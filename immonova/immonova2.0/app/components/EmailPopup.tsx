import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { validateEmail } from '../utils/validateEmail';

interface EmailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, acceptNewsletter: boolean) => Promise<void>;
  targetCalculator: string;
}

export default function EmailPopup({ isOpen, onClose, onSubmit, targetCalculator }: EmailPopupProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptNewsletter, setAcceptNewsletter] = useState(true);

  // Réinitialiser l'erreur lorsque l'utilisateur modifie l'email
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Trim l'email pour éviter les espaces
    const trimmedEmail = email.trim();

    // Validation de l'email
    const emailValidation = validateEmail(trimmedEmail);
    if (!emailValidation.isValid) {
      setError(emailValidation.message || "Adresse email invalide");
      setIsLoading(false);
      return;
    }

    try {
      await onSubmit(trimmedEmail, acceptNewsletter);
      onClose();
    } catch (err) {
      console.error("Erreur lors de la soumission:", err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 backdrop-blur-sm">
      <div className="relative top-20 mx-auto p-8 border w-[450px] shadow-2xl rounded-xl bg-white">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="text-center">
          {/* Icône de la calculette */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 mb-4">
            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Accédez à la calculette pour {targetCalculator}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Entrez votre email pour accéder gratuitement à nos outils de calcul et recevoir des conseils personnalisés pour votre projet immobilier
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Votre email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                aria-invalid={!!error}
                aria-describedby={error ? "email-error" : undefined}
              />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="newsletter"
                  type="checkbox"
                  checked={acceptNewsletter}
                  onChange={(e) => setAcceptNewsletter(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="newsletter" className="text-sm text-gray-500 cursor-pointer">
                  Je souhaite recevoir des conseils personnalisés et les actualités immobilières
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 border border-transparent rounded-lg shadow-sm hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Chargement...
                </span>
              ) : (
                'Accéder à la calculette'
              )}
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-400">
            En utilisant nos services, vous acceptez notre politique de confidentialité et nos conditions d'utilisation.
          </p>
        </div>
      </div>
    </div>
  );
} 