import type { Metadata } from 'next';
import { ManageCookiesButton } from '../components/CookieConsent';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Les données personnelles que collecte immonova.org, pourquoi, combien de temps, et comment exercer vos droits.',
};

const CONTACT_EMAIL = 'ludv.denis@gmail.com';

export default function ConfidentialitePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Politique de confidentialité</h1>
        <p className="mt-2 text-sm text-gray-500">Dernière mise à jour : 1er novembre 2026</p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Qui est responsable de vos données ?</h2>
        <p>
          Le site immonova.org est édité par Ludovic Denis, responsable du traitement de vos données.
          Pour toute question : <a className="text-primary-700 underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Ce que nous collectons, et pourquoi</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Votre e-mail avant d&apos;ouvrir une calculette.</strong> Nous enregistrons votre adresse, la calculette demandée
            et la date, pour vous donner accès à l&apos;outil. Cette collecte repose sur notre intérêt légitime à connaître l&apos;usage
            du site et à vous recontacter au sujet de votre demande.
          </li>
          <li>
            <strong>La newsletter.</strong> La case est décochée par défaut. Si vous la cochez, nous utiliserons votre e-mail pour
            vous envoyer des conseils et actualités immobilières. Votre consentement et sa date sont conservés. Vous pouvez vous
            désabonner à tout moment en nous écrivant.
          </li>
          <li>
            <strong>Votre compte.</strong> Si vous vous connectez, votre e-mail et votre nom sont gérés par notre service de connexion
            (Kinde). Nous gardons dans notre base votre e-mail, votre nom, la date de votre dernière connexion et leur nombre,
            pour faire fonctionner votre espace.
          </li>
          <li>
            <strong>Vos simulations sauvegardées.</strong> Le type de calculette et l&apos;adresse de la simulation, liés à votre compte.
          </li>
          <li>
            <strong>Le formulaire de contact.</strong> Nom, e-mail, téléphone, sujet, type de projet, budget et message que vous saisissez,
            pour répondre à votre demande.
          </li>
          <li>
            <strong>L&apos;assistant en ligne.</strong> Les messages que vous lui écrivez sont transmis à Anthropic pour générer la réponse.
            Ne saisissez pas de données sensibles (coordonnées bancaires, numéro de sécurité sociale). Ses réponses sont
            indicatives et ne constituent pas un conseil financier ou juridique.
          </li>
          <li>
            <strong>Les données techniques.</strong> Notre hébergeur (Vercel) enregistre des journaux de connexion (adresse IP, date,
            pages demandées) pour assurer la sécurité et le bon fonctionnement du site.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Mesure d&apos;audience et cookies</h2>
        <p>
          Avec votre accord uniquement, nous utilisons PostHog (hébergé dans l&apos;Union européenne) pour compter les pages vues et
          l&apos;usage des calculettes (ouverture, première saisie, export PDF, partage, sauvegarde). Nous n&apos;envoyons jamais les montants
          saisis dans les calculettes. Tant que vous n&apos;avez pas accepté, aucune mesure n&apos;a lieu et aucun cookie de mesure n&apos;est
          déposé. Votre choix est mémorisé dans votre navigateur.
        </p>
        <p>Vous pouvez changer d&apos;avis à tout moment :</p>
        <ManageCookiesButton />
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Qui reçoit vos données</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Vercel : hébergement du site.</li>
          <li>Neon : base de données, hébergée en Allemagne (région de Francfort).</li>
          <li>Kinde : connexion et gestion des comptes.</li>
          <li>PostHog : mesure d&apos;audience, avec votre accord, hébergée dans l&apos;Union européenne.</li>
          <li>Anthropic : traitement des messages de l&apos;assistant, société établie aux États-Unis.</li>
          <li>Google : recherche web utilisée par l&apos;assistant, avec les termes de la question posée.</li>
        </ul>
        <p>Nous ne vendons pas vos données.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Combien de temps nous les gardons</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>E-mails recueillis avant une calculette et inscriptions à la newsletter : 3 ans après votre dernier échange avec nous, ou jusqu&apos;à votre désabonnement.</li>
          <li>Messages du formulaire de contact : 3 ans.</li>
          <li>Compte et simulations : jusqu&apos;à la suppression de votre compte.</li>
          <li>Mesure d&apos;audience : 25 mois au maximum.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Vos droits</h2>
        <p>
          Vous pouvez demander l&apos;accès à vos données, leur rectification, leur effacement, la limitation ou l&apos;opposition à leur
          traitement, et leur portabilité. Vous pouvez aussi retirer votre consentement à tout moment. Écrivez-nous à{' '}
          <a className="text-primary-700 underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> : nous répondons dans un
          délai d&apos;un mois. Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la{' '}
          <a className="text-primary-700 underline" href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">CNIL</a>.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Modifications</h2>
        <p>Cette page peut évoluer. La date de dernière mise à jour figure en haut.</p>
      </section>
    </div>
  );
}
