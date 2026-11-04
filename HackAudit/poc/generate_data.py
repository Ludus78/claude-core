"""Génère le jeu de données FICTIF et reproductible du POC AudirIA.

Aucune donnée réelle : fournisseurs, montants et références sont inventés.
Les anomalies injectées sont écrites à part dans data/verite_terrain.json,
que le moteur ne lit que pour la recette (jamais pour décider).
"""
import csv
import datetime as dt
import json
import random
from pathlib import Path

SEED = 2026
CLOSING = dt.date(2026, 12, 31)
OUT = Path(__file__).parent / "data"

SUPPLIERS = [
    ("F001", "Nordika Textile"), ("F002", "Logistik Express"), ("F003", "Packaging Ouest"),
    ("F004", "Digital Ads Europe"), ("F005", "Maison Verte Distribution"), ("F006", "Sportline Import"),
    ("F007", "Cosmetica France"), ("F008", "TechAccessoires SA"), ("F009", "Boissons du Sud"),
    ("F010", "Emballages Rhône"), ("F011", "Mobilier Urbain"), ("F012", "Transports Delmas"),
]
N_BASE = 200
VAT = 0.20

# catégorie injectée -> nombre de cas
INJECTIONS = {
    "fec_absent": 4, "fec_montant": 4, "fec_reference": 3, "doublon": 4,
    "prix_contrat": 5, "qte_recue": 4, "sans_reception": 3, "qte_commande": 3,
    "cutoff": 3, "contrat_expire": 3, "arithmetique": 3, "extraction": 3,
}

rng = random.Random(SEED)
iso = lambda x: x.isoformat()
money = lambda x: round(x + 1e-9, 2)


def build_contracts():
    contracts = {}
    for sid, name in SUPPLIERS:
        end = dt.date(2026, 6, 30) if sid == "F012" else dt.date(2027, 12, 31)
        grid = [{"sku": f"{sid}-{k}", "unit_price": money(rng.uniform(4, 180)),
                 "clause": "Annexe 1 - Grille tarifaire", "page": 4} for k in ("A1", "A2", "A3")]
        contracts[sid] = {
            "contract_id": f"C-{sid}-2025", "supplier_id": sid, "supplier_name": name,
            "start": "2025-01-01", "end": iso(end), "payment_terms_days": 30,
            "validity_clause": {"clause": "Art. 2 - Durée", "page": 2}, "price_grid": grid,
        }
    return contracts


def make_invoice(n, contracts, sid=None, date=None):
    sid = sid or rng.choice(SUPPLIERS)[0]
    name = dict(SUPPLIERS)[sid]
    if date is None:
        last = dt.date(2026, 6, 30) if sid == "F012" else dt.date(2026, 12, 15)
        date = dt.date(2026, 1, 5) + dt.timedelta(days=rng.randint(0, (last - dt.date(2026, 1, 5)).days))
    grid = contracts[sid]["price_grid"]
    lines = []
    for g in rng.sample(grid, rng.randint(1, 3)):
        lines.append({"sku": g["sku"], "qty": rng.randint(10, 500), "unit_price": g["unit_price"]})
    iid, po_id = f"INV-{n:04d}", f"PO-{n:04d}"
    inv = {"invoice_id": iid, "supplier_id": sid, "supplier_name": name, "ref": f"{sid}-FA-{n:04d}",
           "date": iso(date), "po_id": po_id, "lines": lines,
           "source_file": f"factures/{iid}.pdf", "source_page": 1, "confidence": round(rng.uniform(0.9, 0.99), 2)}
    totals(inv)
    po = {"po_id": po_id, "supplier_id": sid, "date": iso(date - dt.timedelta(days=rng.randint(10, 30))),
          "lines": [dict(l) for l in lines]}
    rec = [{"receipt_id": f"RC-{n:04d}", "po_id": po_id, "supplier_id": sid,
            "date": iso(date - dt.timedelta(days=rng.randint(2, 10))),
            "lines": [{"sku": l["sku"], "qty": l["qty"]} for l in lines]}]
    return inv, po, rec


def totals(inv):
    inv["ht"] = money(sum(money(l["qty"] * l["unit_price"]) for l in inv["lines"]))
    inv["tva"] = money(inv["ht"] * VAT)
    inv["ttc"] = money(inv["ht"] + inv["tva"])


def fec_entry(num, inv, ttc, ref=None, date=None):
    ref = ref or inv["ref"]
    d = (date or dt.date.fromisoformat(inv["date"])).strftime("%Y%m%d")
    pd = dt.date.fromisoformat(inv["date"]).strftime("%Y%m%d")
    ht = inv["ht"] if abs(ttc - inv["ttc"]) < 0.5 else money(ttc - inv["tva"])
    vat = money(ttc - ht)
    lib = f"Facture {inv['supplier_name']}"
    row = lambda cpt, aux, deb, cred: {"JournalCode": "ACH", "EcritureNum": f"ACH-{num:04d}", "EcritureDate": d,
                                       "CompteNum": cpt, "CompAuxNum": aux, "PieceRef": ref, "PieceDate": pd,
                                       "EcritureLib": lib, "Debit": f"{deb:.2f}", "Credit": f"{cred:.2f}"}
    return [row("607000", "", ht, 0), row("445660", "", vat, 0), row("401000", inv["supplier_id"], 0, ttc)]


def main():
    contracts = build_contracts()
    invs, pos, recs = [], [], []
    for n in range(1, N_BASE + 1):
        i, p, r = make_invoice(n, contracts)
        invs.append(i); pos.append(p); recs.append(r)

    in_place = {c: n for c, n in INJECTIONS.items() if c != "doublon"}
    picks = rng.sample(range(N_BASE), sum(in_place.values()))
    plan, k = {}, 0
    for cat, count in in_place.items():
        for idx in picks[k:k + count]:
            plan[idx] = cat
        k += count
    spare = [i for i in range(N_BASE) if i not in plan]

    fec_flags = {}  # idx -> overrides FEC
    truth = {}
    for idx, cat in plan.items():
        inv, po, rec = invs[idx], pos[idx], recs[idx]
        n = idx + 1
        if cat == "contrat_expire":
            late = dt.date(2026, 7, 15) + dt.timedelta(days=rng.randint(0, 150))
            invs[idx], pos[idx], recs[idx] = make_invoice(n, contracts, sid="F012", date=late)
        elif cat == "prix_contrat":
            inv["lines"][0]["unit_price"] = money(inv["lines"][0]["unit_price"] * 1.08)
            po["lines"][0]["unit_price"] = inv["lines"][0]["unit_price"]
            totals(inv)
        elif cat == "qte_recue":
            rec[0]["lines"][0]["qty"] = int(inv["lines"][0]["qty"] * 0.8)
        elif cat == "sans_reception":
            recs[idx] = []
        elif cat == "qte_commande":
            po["lines"][0]["qty"] = int(inv["lines"][0]["qty"] * 0.7)
        elif cat == "cutoff":
            inv["date"] = iso(dt.date(2026, 12, rng.randint(20, 28)))
            rec[0]["date"] = iso(dt.date(2027, 1, rng.randint(3, 9)))
        elif cat == "arithmetique":
            inv["tva"] = money(inv["ht"] * 0.10)
        elif cat == "extraction":
            inv["confidence"] = round(rng.uniform(0.45, 0.65), 2)
        elif cat == "fec_absent":
            fec_flags[idx] = {"skip": True}
        elif cat == "fec_montant":
            fec_flags[idx] = {"delta": rng.choice([-1, 1]) * rng.randint(50, 900)}
        elif cat == "fec_reference":
            ref = invs[idx]["ref"]
            fec_flags[idx] = {"ref": ref[:-2] + ref[-1] + ref[-2]}
        truth[invs[idx]["invoice_id"]] = {"categorie": cat}

    # Bruit légitime : ne doit PAS déclencher d'alerte.
    for idx in rng.sample(spare, 12):
        fec_flags[idx] = {"offset_days": rng.randint(1, 3)}
        truth[invs[idx]["invoice_id"]] = {"categorie": None, "bruit": "date de comptabilisation décalée de 1 à 3 jours"}
    for idx in rng.sample([i for i in spare if i not in fec_flags], 8):
        fec_flags[idx] = {"delta": 0.01}
        truth[invs[idx]["invoice_id"]] = {"categorie": None, "bruit": "arrondi de 0,01 EUR entre facture et FEC"}

    # Doublons : copie de factures saines, comptabilisées une seule fois.
    clean = [i for i in range(N_BASE) if i not in plan and i not in fec_flags]
    for j, idx in enumerate(rng.sample(clean, INJECTIONS["doublon"])):
        dup = json.loads(json.dumps(invs[idx]))
        dup["invoice_id"] = f"INV-{N_BASE + 1 + j:04d}"
        dup["source_file"] = f"factures/{dup['invoice_id']}.pdf"
        invs.append(dup)
        truth[dup["invoice_id"]] = {"categorie": "doublon", "original": invs[idx]["invoice_id"]}

    fec = []
    for idx in range(N_BASE):
        inv, fl = invs[idx], fec_flags.get(idx, {})
        if fl.get("skip"):
            continue
        ttc = money(inv["ttc"] + fl.get("delta", 0))
        date = dt.date.fromisoformat(inv["date"]) + dt.timedelta(days=fl.get("offset_days", 0))
        fec += fec_entry(idx + 1, inv, ttc, ref=fl.get("ref"), date=date)

    OUT.mkdir(exist_ok=True)
    (OUT / "factures_extraites.json").write_text(json.dumps(invs, ensure_ascii=False, indent=1), "utf-8")
    (OUT / "contrats.json").write_text(json.dumps(list(contracts.values()), ensure_ascii=False, indent=1), "utf-8")
    (OUT / "commandes.json").write_text(json.dumps(pos, ensure_ascii=False, indent=1), "utf-8")
    (OUT / "receptions_stock.json").write_text(json.dumps([r for rr in recs for r in rr], ensure_ascii=False, indent=1), "utf-8")
    with open(OUT / "fec.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(fec[0]), delimiter=";")
        w.writeheader(); w.writerows(fec)
    (OUT / "verite_terrain.json").write_text(json.dumps(truth, ensure_ascii=False, indent=1), "utf-8")
    inj = sum(1 for t in truth.values() if t["categorie"])
    print(f"{len(invs)} factures, {len(fec) // 3} écritures FEC, {inj} anomalies injectées, "
          f"{sum(1 for t in truth.values() if t.get('bruit'))} cas de bruit légitime -> {OUT}")


if __name__ == "__main__":
    main()
