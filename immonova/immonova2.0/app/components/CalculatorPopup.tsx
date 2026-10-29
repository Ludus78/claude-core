import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CalculatorPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Vérifier si le pop-up a déjà été affiché
    const hasSeenPopup = localStorage.getItem('hasSeenCalculatorPopup');
    
    if (!hasSeenPopup) {
      // Si le pop-up n'a jamais été affiché, l'afficher après 2 secondes
      const timer = setTimeout(() => {
        setIsOpen(true);
        // Marquer le pop-up comme vu
        localStorage.setItem('hasSeenCalculatorPopup', 'true');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // S'assurer que le pop-up est marqué comme vu même si l'utilisateur le ferme avant
    localStorage.setItem('hasSeenCalculatorPopup', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
              <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Découvrez notre nouvelle calculette immobilière !
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Optimisez votre projet d'achat avec notre calculette avancée. Simulation PTZ, graphiques détaillés, export PDF et bien plus encore !
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <Link href="/calculateurs/pret" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm">
              Essayer maintenant
            </Link>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
              onClick={handleClose}
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 