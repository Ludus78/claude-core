import { useState } from 'react';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface CalculatorActionsProps {
  calculatorType: 'achat' | 'locatif' | 'viager' | 'pret';
  calculatorRef: React.RefObject<HTMLDivElement>;
}

export default function CalculatorActions({ calculatorType, calculatorRef }: CalculatorActionsProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { user, isAuthenticated } = useKindeBrowserClient();

  const handleExportPDF = async () => {
    if (!calculatorRef.current) return;

    try {
      const canvas = await html2canvas(calculatorRef.current);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`simulation-${calculatorType}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      alert('Une erreur est survenue lors de l\'export PDF. Veuillez réessayer.');
    }
  };

  const handleShare = async (platform: 'linkedin' | 'email' | 'copy') => {
    const url = window.location.href;
    const text = `Découvrez ma simulation immobilière sur ImmoNova !`;
    
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        alert('Lien copié dans le presse-papier !');
      } catch (error) {
        console.error('Erreur lors de la copie:', error);
        alert('Une erreur est survenue lors de la copie du lien.');
      }
      setIsShareModalOpen(false);
      return;
    }
    
    const shareUrls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent('Simulation immobilière ImmoNova')}&body=${encodeURIComponent(text + '\n\n' + url)}`
    };

    window.open(shareUrls[platform], '_blank');
    setIsShareModalOpen(false);
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      console.log('Utilisateur non authentifié');
      alert('Veuillez vous connecter pour sauvegarder votre simulation.');
      return;
    }

    console.log('Tentative de sauvegarde avec:', {
      type: calculatorType,
      url: window.location.href,
      userId: user?.id
    });

    try {
      const response = await fetch('/api/simulations/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: calculatorType,
          url: window.location.href
        }),
      });

      console.log('Réponse du serveur:', {
        status: response.status,
        ok: response.ok
      });

      if (response.ok) {
        alert('Simulation sauvegardée avec succès ! Vous pouvez la retrouver dans votre tableau de bord.');
      } else {
        const errorData = await response.text();
        console.error('Erreur serveur:', errorData);
        throw new Error(`Erreur lors de la sauvegarde: ${errorData}`);
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
      alert('Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.');
    }
  };

  return (
    <div className="flex justify-end space-x-4 mt-6 border-t pt-6">
      <button
        onClick={handleExportPDF}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Exporter PDF
      </button>

      <button
        onClick={() => setIsShareModalOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Partager
      </button>

      <button
        onClick={handleSave}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        Sauvegarder
      </button>

      {/* Modal de partage */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsShareModalOpen(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Partager la simulation
                  </h3>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
                    >
                      LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare('email')}
                      className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                    >
                      Email
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      Copier le lien
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => setIsShareModalOpen(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 