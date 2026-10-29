import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

interface Simulation {
  id: string;
  type: string;
  url: string;
  date: string;
}

export default function SavedSimulations() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useKindeBrowserClient();

  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        const response = await fetch('/api/simulations');
        if (response.ok) {
          const data = await response.json();
          setSimulations(data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des simulations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchSimulations();
    }
  }, [user?.id]);

  const getSimulationTitle = (type: string) => {
    const titles = {
      achat: 'Simulation d\'achat',
      locatif: 'Simulation locative',
      viager: 'Simulation viager'
    };
    return titles[type as keyof typeof titles] || 'Simulation';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (simulations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Aucune simulation sauvegardée pour le moment.</p>
        <div className="mt-4 space-x-4">
          <Link href="/calculette" className="text-primary-600 hover:text-primary-700">
            Faire une simulation d'achat →
          </Link>
          <Link href="/calculette-locative" className="text-primary-600 hover:text-primary-700">
            Faire une simulation locative →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {simulations.map((simulation) => (
        <div
          key={simulation.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-gray-900 mb-2">
            {getSimulationTitle(simulation.type)}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Sauvegardée le {new Date(simulation.date).toLocaleDateString('fr-FR')}
          </p>
          <Link
            href={simulation.url}
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            Voir la simulation
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      ))}
    </div>
  );
} 