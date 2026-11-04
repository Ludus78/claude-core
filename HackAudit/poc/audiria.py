"""AudirIA - POC : contrôle d'une facture fournisseur contre FEC, contrat, commande et réceptions de stock.

Chaque contrôle est une règle explicite et versionnée. Aucun LLM ne décide ici : la lecture des
factures (OCR + agent) est simulée par data/factures_extraites.json, avec renvoi page et confiance.
Sortie : fiche de contrôle HTML pour le CAC, journal de trace JSON, résultats CSV.
"""
import argparse
import csv
import datetime as dt
import hashlib
import html
import json
import platform
import sys
import time
from collections import defaultdict
from pathlib import Path

ENGINE_VERSION = "0.1.0"
RULES_VERSION = "R-2026.1"
CLOSING = dt.date(2026, 12, 31)
TOL_AMOUNT = 0.05        # EUR, arrondis admis
TOL_DAYS = 5             # écart de date facture / FEC admis
TOL_PRICE = 0.005        # 0,5 % d'écart de prix admis
CONF_MIN = 0.80          # en dessous : relecture humaine obligatoire
SAMPLE_PCT = 10          # % de non-alertes tirées pour test ciblé par l'auditeur
SAMPLE_SALT = "audiria-2026"

RULES = {
    "R01": "Intégrité du FEC", "R02": "Facture absente du FEC", "R03": "Écart facture / FEC",
    "R04": "Référence ambiguë (candidat FEC hors référence)", "R05": "Doublon de facture",
    "R06": "Prix différent de la grille contractuelle", "R07": "Contrat absent ou expiré à la date de facture",
    "R08": "Quantité facturée supérieure à la commande", "R09": "Aucune réception de stock",
    "R10": "Quantité facturée supérieure à la quantité reçue", "R11": "Cut-off : réception après la clôture",
    "R12": "Arithmétique de la facture incohérente", "R13": "Extraction incertaine (relecture requise)",
}
EXPECTED = {"fec_absent": "R02", "fec_montant": "R03", "fec_reference": "R04", "doublon": "R05",
            "prix_contrat": "R06", "contrat_expire": "R07", "qte_commande": "R08", "sans_reception": "R09",
            "qte_recue": "R10", "cutoff": "R11", "arithmetique": "R12", "extraction": "R13"}

D = dt.date.fromisoformat
sha = lambda b: hashlib.sha256(b).hexdigest()


def finding(rule, detail, inv_val, ref_val, sources):
    return {"rule": rule, "label": RULES[rule], "detail": detail, "invoice_value": inv_val,
            "reference_value": ref_val, "sources": sources}


def load(data_dir):
    p = Path(data_dir)
    files = ["factures_extraites.json", "contrats.json", "commandes.json", "receptions_stock.json", "fec.csv"]
    hashes = {f: sha((p / f).read_bytes()) for f in files}
    j = lambda f: json.loads((p / f).read_text("utf-8"))
    with open(p / "fec.csv", encoding="utf-8", newline="") as fh:
        fec = list(csv.DictReader(fh, delimiter=";"))
    return {"invoices": j("factures_extraites.json"), "contracts": {c["supplier_id"]: c for c in j("contrats.json")},
            "pos": {x["po_id"]: x for x in j("commandes.json")}, "receipts": j("receptions_stock.json"), "fec": fec}, hashes


def check_fec_integrity(fec):
    """R01 : équilibre débit/crédit par écriture, équilibre global, séquence sans trou."""
    errs, by = [], defaultdict(list)
    for r in fec:
        by[r["EcritureNum"]].append(r)
    for num, rows in by.items():
        d, c = sum(float(r["Debit"]) for r in rows), sum(float(r["Credit"]) for r in rows)
        if abs(d - c) > 0.005:
            errs.append(f"{num} déséquilibrée (débit {d:.2f} / crédit {c:.2f})")
    nums = sorted(int(n.split("-")[1]) for n in by)
    missing = sorted(set(range(nums[0], nums[-1] + 1)) - set(nums)) if nums else []
    skipped = len(missing)   # un trou de séquence est une information, pas une erreur bloquante ici
    return errs, {"ecritures": len(by), "lignes": len(fec), "trous_sequence": skipped,
                  "debit_total": round(sum(float(r["Debit"]) for r in fec), 2),
                  "credit_total": round(sum(float(r["Credit"]) for r in fec), 2)}


def index_fec(fec):
    entries = {}
    for r in fec:
        e = entries.setdefault(r["EcritureNum"], {"num": r["EcritureNum"], "ref": r["PieceRef"], "date": None,
                                                  "supplier": None, "ttc": 0.0, "ht": 0.0})
        e["date"] = dt.datetime.strptime(r["EcritureDate"], "%Y%m%d").date()
        if r["CompteNum"].startswith("401"):
            e["supplier"], e["ttc"] = r["CompAuxNum"], float(r["Credit"])
        elif r["CompteNum"].startswith("607"):
            e["ht"] = float(r["Debit"])
    by_key = {(e["supplier"], e["ref"]): e for e in entries.values()}
    return entries, by_key


def control_invoice(inv, ctx, seen):
    f, iid = [], inv["invoice_id"]
    src_inv = f"Facture {iid} ({inv['source_file']}, p.{inv['source_page']})"
    d = D(inv["date"])
    # R13 extraction
    if inv["confidence"] < CONF_MIN:
        f.append(finding("R13", f"Confiance d'extraction {inv['confidence']:.2f} < {CONF_MIN:.2f} : champs à relire sur la pièce.",
                         inv["confidence"], CONF_MIN, [src_inv]))
    # R12 arithmétique
    calc_ht = round(sum(round(l["qty"] * l["unit_price"], 2) for l in inv["lines"]), 2)
    if abs(calc_ht - inv["ht"]) > 0.02 or abs(inv["ht"] + inv["tva"] - inv["ttc"]) > 0.02:
        f.append(finding("R12", f"HT {inv['ht']:.2f} + TVA {inv['tva']:.2f} ≠ TTC {inv['ttc']:.2f} (lignes : {calc_ht:.2f}).",
                         inv["ttc"], round(inv["ht"] + inv["tva"], 2), [src_inv]))
    # R05 doublon
    k1, k2 = (inv["supplier_id"], inv["ref"]), (inv["supplier_id"], inv["ttc"], inv["date"])
    prev = seen.get(k1) or seen.get(k2)
    if prev:
        f.append(finding("R05", f"Même fournisseur et même référence/montant/date que {prev}.", iid, prev, [src_inv, f"Facture {prev}"]))
    seen.setdefault(k1, iid); seen.setdefault(k2, iid)
    # R02 / R03 / R04 rapprochement FEC
    e = ctx["fec_by_key"].get((inv["supplier_id"], inv["ref"]))
    if e:
        s = f"FEC {e['num']} (journal ACH, compte 401000)"
        if abs(e["ttc"] - inv["ttc"]) > TOL_AMOUNT:
            f.append(finding("R03", f"TTC facture {inv['ttc']:.2f} ≠ FEC {e['ttc']:.2f} (écart {inv['ttc'] - e['ttc']:+.2f}).",
                             inv["ttc"], e["ttc"], [src_inv, s]))
        if abs((e["date"] - d).days) > TOL_DAYS:
            f.append(finding("R03", f"Date facture {inv['date']} / date d'écriture {e['date']} : écart de {abs((e['date'] - d).days)} jours.",
                             inv["date"], str(e["date"]), [src_inv, s]))
    else:
        cands = [x for x in ctx["fec_entries"].values() if x["supplier"] == inv["supplier_id"]
                 and (x["supplier"], x["ref"]) not in ctx["invoice_keys"]
                 and abs(x["ttc"] - inv["ttc"]) <= TOL_AMOUNT and abs((x["date"] - d).days) <= 10]
        if cands:
            c = cands[0]
            f.append(finding("R04", f"Aucune écriture à la référence {inv['ref']}, mais {c['num']} (réf. {c['ref']}) a même fournisseur, "
                             f"montant et date proches : appariement à confirmer.", inv["ref"], c["ref"],
                             [src_inv, f"FEC {c['num']} (compte 401000)"]))
        else:
            f.append(finding("R02", f"Aucune écriture FEC pour {inv['ref']} ({inv['ttc']:.2f} EUR TTC). Une absence reste une exception.",
                             inv["ttc"], None, [src_inv]))
    # R07 / R06 contrat
    c = ctx["contracts"].get(inv["supplier_id"])
    if not c or not (D(c["start"]) <= d <= D(c["end"])):
        cs = f"Contrat {c['contract_id']}, {c['validity_clause']['clause']} p.{c['validity_clause']['page']}" if c else "Aucun contrat"
        f.append(finding("R07", f"Facture du {inv['date']} hors période contractuelle ({c['start']} → {c['end']})." if c
                         else "Aucun contrat pour ce fournisseur.", inv["date"], c["end"] if c else None, [src_inv, cs]))
    if c:
        grid = {g["sku"]: g for g in c["price_grid"]}
        for l in inv["lines"]:
            g = grid.get(l["sku"])
            cs = f"Contrat {c['contract_id']}, {g['clause']} p.{g['page']}" if g else f"Contrat {c['contract_id']}"
            if not g:
                f.append(finding("R06", f"Article {l['sku']} absent de la grille.", l["unit_price"], None, [src_inv, cs]))
            elif abs(l["unit_price"] - g["unit_price"]) / g["unit_price"] > TOL_PRICE:
                f.append(finding("R06", f"{l['sku']} : prix facturé {l['unit_price']:.2f} vs contrat {g['unit_price']:.2f} "
                                 f"({(l['unit_price'] / g['unit_price'] - 1) * 100:+.1f} %), surcoût {(l['unit_price'] - g['unit_price']) * l['qty']:.2f} EUR.",
                                 l["unit_price"], g["unit_price"], [src_inv, cs]))
    # R08 commande
    po = ctx["pos"].get(inv["po_id"])
    if po:
        ordered = {l["sku"]: l["qty"] for l in po["lines"]}
        for l in inv["lines"]:
            if l["qty"] > ordered.get(l["sku"], 0):
                f.append(finding("R08", f"{l['sku']} : {l['qty']} facturés pour {ordered.get(l['sku'], 0)} commandés.",
                                 l["qty"], ordered.get(l["sku"], 0), [src_inv, f"Bon de commande {po['po_id']}"]))
    # R09 / R10 / R11 stock
    recs = ctx["receipts_by_po"].get(inv["po_id"], [])
    if not recs:
        f.append(finding("R09", f"Aucun bon de réception pour la commande {inv['po_id']}.", None, None, [src_inv, "Journal de stock"]))
    else:
        got = defaultdict(int)
        for r in recs:
            for l in r["lines"]:
                got[l["sku"]] += l["qty"]
        for l in inv["lines"]:
            if l["qty"] > got.get(l["sku"], 0):
                f.append(finding("R10", f"{l['sku']} : {l['qty']} facturés pour {got.get(l['sku'], 0)} reçus.",
                                 l["qty"], got.get(l["sku"], 0), [src_inv, f"Bon de réception {recs[0]['receipt_id']}"]))
        late = [r for r in recs if D(r["date"]) > CLOSING]
        if late and d <= CLOSING:
            f.append(finding("R11", f"Facture du {inv['date']} comptabilisée sur l'exercice, marchandises reçues le {late[0]['date']} (après le {CLOSING}).",
                             inv["date"], late[0]["date"], [src_inv, f"Bon de réception {late[0]['receipt_id']}"]))
    return f


def sample_non_alerts(ids):
    return [i for i in ids if int(sha((SAMPLE_SALT + i).encode())[:8], 16) % 100 < SAMPLE_PCT]


def recette(results, truth):
    """Compare aux anomalies injectées. Sert de test de non-régression, pas de preuve de performance réelle."""
    per, fp, fp_ids = defaultdict(lambda: [0, 0]), 0, []
    for r in results:
        t = truth.get(r["invoice_id"], {"categorie": None})
        rules = {x["rule"] for x in r["findings"]}
        if t["categorie"]:
            per[t["categorie"]][0] += 1
            per[t["categorie"]][1] += EXPECTED[t["categorie"]] in rules
        elif rules:
            fp += 1; fp_ids.append(r["invoice_id"])
    inj = sum(v[0] for v in per.values()); det = sum(v[1] for v in per.values())
    clean = sum(1 for r in results if not truth.get(r["invoice_id"], {}).get("categorie"))
    return {"par_categorie": {k: {"injectes": v[0], "detectes": v[1], "regle": EXPECTED[k]} for k, v in sorted(per.items())},
            "injectes": inj, "detectes": det, "rappel": round(det / inj, 3) if inj else None,
            "faux_positifs": fp, "factures_saines": clean, "taux_faux_positifs": round(fp / clean, 3) if clean else None,
            "faux_positifs_ids": fp_ids, "avertissement": "Jeu synthétique généré par l'équipe : test de non-régression du moteur, pas une mesure de performance sur données réelles."}


def render_html(run, results, orphans, metrics, sample, integrity):
    e = html.escape
    alerts = [r for r in results if r["findings"]]
    by_rule = defaultdict(int)
    for r in alerts:
        for x in r["findings"]:
            by_rule[x["rule"]] += 1
    cards = []
    for r in alerts:
        rows = "".join(f"<tr><td class=m>{x['rule']}</td><td><b>{e(x['label'])}</b><br>{e(x['detail'])}"
                       f"<div class=src>Sources : {e(' · '.join(x['sources']))}</div></td></tr>" for x in r["findings"])
        cards.append(f"<section class=card><h3>{e(r['invoice_id'])} · {e(r['supplier_name'])} · {r['ttc']:.2f} € TTC <small>({e(r['ref'])}, {e(r['date'])})</small></h3>"
                     f"<table>{rows}</table><div class=dec>Décision auditeur : ☐ Anomalie confirmée &nbsp; ☐ Explication obtenue &nbsp; ☐ Faux positif"
                     f" &nbsp;|&nbsp; Commentaire / pièce complémentaire : ________________________ &nbsp; Initiales : ____ Date : ____</div></section>")
    mrows = "".join(f"<tr><td>{k}</td><td>{v['regle']}</td><td>{v['injectes']}</td><td>{v['detectes']}</td></tr>" for k, v in metrics["par_categorie"].items()) if metrics else ""
    recette_html = (f"""<h2>5. Recette de l'outil sur cas étalons</h2><p class=warn>{e(metrics['avertissement'])}</p>
<table><tr><th>Catégorie injectée</th><th>Règle attendue</th><th>Injectés</th><th>Détectés</th></tr>{mrows}
<tr><th colspan=2>Total</th><th>{metrics['injectes']}</th><th>{metrics['detectes']}</th></tr></table>
<p>Rappel : <b>{metrics['detectes']}/{metrics['injectes']}</b> · Faux positifs : <b>{metrics['faux_positifs']}</b> sur {metrics['factures_saines']} factures saines
({'ids : ' + ', '.join(metrics['faux_positifs_ids']) if metrics['faux_positifs_ids'] else 'aucun'}).</p>""" if metrics else
        "<h2>5. Recette de l'outil</h2><p>Aucun jeu étalon fourni pour ce lot : recette non réalisée.</p>")
    srows = "".join(f"<tr><td>{e(r['invoice_id'])}</td><td>{e(r['supplier_name'])}</td><td>{r['ttc']:.2f}</td><td>☐ OK ☐ Écart</td></tr>"
                    for r in results if r["invoice_id"] in set(sample))
    rrows = "".join(f"<tr><td>{k}</td><td>{e(RULES[k])}</td><td>{v}</td></tr>" for k, v in sorted(by_rule.items()))
    return f"""<!doctype html><html lang=fr><meta charset=utf-8><title>Fiche de contrôle AudirIA</title>
<style>body{{font:13px/1.45 Segoe UI,Arial,sans-serif;max-width:980px;margin:24px auto;color:#1a2233;padding:0 16px}}
h1{{background:#16305c;color:#fff;padding:14px 18px;margin:0;font-size:20px}}h2{{border-bottom:2px solid #16305c;padding-bottom:3px;margin-top:28px;color:#16305c}}
table{{border-collapse:collapse;width:100%;margin:6px 0}}td,th{{border:1px solid #ccd3e0;padding:5px 8px;vertical-align:top;text-align:left}}th{{background:#eef1f7}}
.m{{width:48px;font-weight:700;color:#b3261e}}.card{{border:1px solid #ccd3e0;border-left:4px solid #c8963e;padding:8px 12px;margin:10px 0;page-break-inside:avoid}}
.card h3{{margin:0 0 4px;font-size:14px}}small{{color:#667}}.src{{color:#556;font-size:11.5px;margin-top:2px}}.dec{{background:#fffaf0;border:1px dashed #c8963e;padding:6px 8px;margin-top:6px;font-size:12px}}
.kpi{{display:flex;gap:10px;flex-wrap:wrap}}.kpi div{{flex:1;min-width:130px;border:1px solid #ccd3e0;padding:8px;text-align:center}}.kpi b{{display:block;font-size:22px;color:#16305c}}
.warn{{background:#fff3cd;border:1px solid #e0c36a;padding:8px 12px}}.sig td{{height:46px}}</style>
<h1>Fiche de contrôle – cycle Achats · exercice clos le {CLOSING:%d/%m/%Y}</h1>
<p class=warn><b>Données fictives (démonstration).</b> Cette fiche est une aide à la revue : elle ne vaut pas conclusion. Chaque alerte est à qualifier par l'auditeur ;
le CAC valide les seuils, examine les travaux et conclut. Une absence de pièce n'est jamais une correspondance validée.</p>
<h2>1. Périmètre et populations réconciliées</h2>
<div class=kpi><div><b>{len(results)}</b>factures reçues</div><div><b>{integrity['ecritures']}</b>écritures FEC (achats)</div>
<div><b>{len(alerts)}</b>factures à examiner</div><div><b>{len(results) - len(alerts)}</b>sans alerte</div><div><b>{len(orphans)}</b>écritures FEC sans facture</div></div>
<p>Intégrité du FEC (R01) : équilibre débit/crédit par écriture contrôlé, total débit {integrity['debit_total']:.2f} € = total crédit {integrity['credit_total']:.2f} €,
trous de séquence : {integrity['trous_sequence']}. Sources croisées : factures, FEC, contrats (grille tarifaire, durée), bons de commande, bons de réception de stock.</p>
<h2>2. Synthèse des alertes par règle</h2><table><tr><th>Règle</th><th>Intitulé</th><th>Occurrences</th></tr>{rrows}</table>
<h2>3. Factures à examiner ({len(alerts)})</h2>{''.join(cards)}
<h2>4. Non-alertes tirées pour test ciblé ({len(sample)})</h2>
<p>Tirage déterministe de {SAMPLE_PCT} % des factures sans alerte (graine « {SAMPLE_SALT} »), à vérifier sur pièces pour apprécier les faux négatifs.</p>
<table><tr><th>Facture</th><th>Fournisseur</th><th>TTC</th><th>Résultat du test</th></tr>{srows}</table>
{recette_html}
<h2>6. Trace d'exécution (NEP 230)</h2>
<table><tr><td>Horodatage (UTC)</td><td>{run['timestamp']}</td></tr><tr><td>Version moteur / règles</td><td>{ENGINE_VERSION} / {RULES_VERSION}</td></tr>
<tr><td>Environnement</td><td>Python {run['python']}, {run['platform']}</td></tr><tr><td>Modèle de langage</td><td>Aucun dans ce POC (lecture des factures simulée, extraction pré-calculée)</td></tr>
<tr><td>Paramètres</td><td>tolérance montant {TOL_AMOUNT} € · tolérance date {TOL_DAYS} j · tolérance prix {TOL_PRICE:.1%} · confiance min. {CONF_MIN}</td></tr>
<tr><td>Durée de traitement</td><td>{run['duree_s']:.3f} s pour {len(results)} factures</td></tr>
<tr><td>Empreintes SHA-256 des entrées</td><td>{'<br>'.join(f'{k} : <code>{v[:16]}…</code>' for k, v in run['hashes'].items())}</td></tr></table>
<h2>7. Revue et conclusion</h2>
<table class=sig><tr><th>Rôle</th><th>Nom</th><th>Travaux / conclusion</th><th>Date et signature</th></tr>
<tr><td>Auditeur</td><td></td><td>Alertes qualifiées ☐ · Non-alertes testées ☐</td><td></td></tr>
<tr><td>CAC responsable</td><td></td><td>Seuils validés ☐ · Travaux revus ☐ · Conclusion : ______________</td><td></td></tr></table></html>"""


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    here = Path(__file__).parent
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--data", default=here / "data")
    ap.add_argument("--out", default=here / "out")
    a = ap.parse_args()
    t0 = time.perf_counter()
    data, hashes = load(a.data)
    errs, integrity = check_fec_integrity(data["fec"])
    if errs:
        print("R01 ÉCHEC BLOQUANT : le FEC est incohérent, le lot est suspendu.\n  " + "\n  ".join(errs[:10]))
        sys.exit(2)
    entries, by_key = index_fec(data["fec"])
    rbp = defaultdict(list)
    for r in data["receipts"]:
        rbp[r["po_id"]].append(r)
    ctx = {"contracts": data["contracts"], "pos": data["pos"], "receipts_by_po": rbp, "fec_entries": entries, "fec_by_key": by_key,
           "invoice_keys": {(i["supplier_id"], i["ref"]) for i in data["invoices"]}}
    seen, results = {}, []
    for inv in sorted(data["invoices"], key=lambda i: i["invoice_id"]):
        fnd = control_invoice(inv, ctx, seen)
        results.append({"invoice_id": inv["invoice_id"], "supplier_name": inv["supplier_name"], "ref": inv["ref"],
                        "date": inv["date"], "ttc": inv["ttc"], "status": "A_EXAMINER" if fnd else "CONFORME", "findings": fnd})
    matched = {(e["supplier"], e["ref"]) for e in entries.values()} & ctx["invoice_keys"]
    orphans = [e["num"] for e in entries.values() if (e["supplier"], e["ref"]) not in matched
               and not any(x["rule"] == "R04" and e["num"] in " ".join(x["sources"]) for r in results for x in r["findings"])]
    sample = sample_non_alerts([r["invoice_id"] for r in results if not r["findings"]])
    truth_f = Path(a.data) / "verite_terrain.json"
    metrics = recette(results, json.loads(truth_f.read_text("utf-8"))) if truth_f.exists() else None
    run = {"timestamp": dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d %H:%M:%S"), "python": platform.python_version(),
           "platform": platform.platform(), "duree_s": time.perf_counter() - t0, "hashes": hashes}
    out = Path(a.out); out.mkdir(exist_ok=True)
    (out / "journal.json").write_text(json.dumps({"run": run, "engine": ENGINE_VERSION, "rules": RULES_VERSION, "integrity": integrity,
                                                  "sample_non_alertes": sample, "recette": metrics, "results": results}, ensure_ascii=False, indent=1), "utf-8")
    with open(out / "resultats.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh, delimiter=";")
        w.writerow(["facture", "fournisseur", "reference", "date", "ttc", "statut", "regles"])
        for r in results:
            w.writerow([r["invoice_id"], r["supplier_name"], r["ref"], r["date"], r["ttc"], r["status"], ",".join(x["rule"] for x in r["findings"])])
    (out / "fiche_cac.html").write_text(render_html(run, results, orphans, metrics, sample, integrity), "utf-8")
    alerts = sum(1 for r in results if r["findings"])
    print(f"{len(results)} factures contrôlées en {run['duree_s']:.3f} s · {alerts} à examiner · {len(results) - alerts} sans alerte · {len(sample)} non-alertes à tester")
    if metrics:
        print(f"Recette (jeu synthétique) : {metrics['detectes']}/{metrics['injectes']} anomalies injectées détectées · "
              f"{metrics['faux_positifs']} faux positif(s) sur {metrics['factures_saines']} factures saines")
        for k, v in metrics["par_categorie"].items():
            print(f"  {k:<16}{v['regle']}  {v['detectes']}/{v['injectes']}")
        if metrics["faux_positifs_ids"]:
            print("  faux positifs :", ", ".join(metrics["faux_positifs_ids"]))
    print(f"Fiche CAC : {out / 'fiche_cac.html'}")


if __name__ == "__main__":
    main()
