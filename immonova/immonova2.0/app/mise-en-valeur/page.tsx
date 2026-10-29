import Navigation from "../components/Navigation";

export default function MiseEnValeur() {
  return (
    <div className="min-h-screen bg-[#131316] text-white">
      <Navigation />
      
      <div className="pt-20 p-8 sm:p-20">
        <section className="max-w-5xl mx-auto mt-10">
          <h1 className="text-4xl font-bold mb-6 text-center">Mise en Valeur de Votre Bien</h1>
          <p className="text-xl text-gray-300 text-center mb-12">
            Optimisez l'attractivité de votre bien avec nos conseils personnalisés.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-[#1e1e24] p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Décrivez votre bien</h2>
              <form className="space-y-5">
                <div>
                  <label className="block text-gray-300 mb-2">Type de bien</label>
                  <select className="w-full bg-[#2a2a35] p-3 rounded-lg">
                    <option>Appartement</option>
                    <option>Maison</option>
                    <option>Studio</option>
                    <option>Loft</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Surface (m²)</label>
                  <input type="number" className="w-full bg-[#2a2a35] p-3 rounded-lg" placeholder="Ex: 75" />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">État général</label>
                  <select className="w-full bg-[#2a2a35] p-3 rounded-lg">
                    <option>Neuf / Très bon état</option>
                    <option>Bon état</option>
                    <option>À rafraîchir</option>
                    <option>À rénover</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Style / Époque</label>
                  <select className="w-full bg-[#2a2a35] p-3 rounded-lg">
                    <option>Contemporain</option>
                    <option>Ancien</option>
                    <option>Haussmannien</option>
                    <option>Industriel</option>
                    <option>Autre</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Points forts</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="terrasse" className="mr-2" />
                      <label htmlFor="terrasse">Terrasse/Balcon</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="vue" className="mr-2" />
                      <label htmlFor="vue">Belle vue</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="luminosite" className="mr-2" />
                      <label htmlFor="luminosite">Lumineux</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="parking" className="mr-2" />
                      <label htmlFor="parking">Parking</label>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-blue-600 py-3 px-6 rounded-lg font-bold hover:bg-blue-700 transition">
                  Obtenir mes conseils
                </button>
              </form>
            </div>
            
            <div className="bg-[#1e1e24] p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Conseils personnalisés</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-blue-400">Préparation générale</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    <li>Désencombrez toutes les pièces pour maximiser l'espace perçu</li>
                    <li>Effectuez un nettoyage approfondi y compris vitres et luminaires</li>
                    <li>Réparez les petits défauts (poignées, joints, fissures)</li>
                    <li>Neutralisez les odeurs désagréables (tabac, animaux)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3 text-blue-400">Mise en scène</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    <li>Optimisez la luminosité (ouverture des volets, éclairage indirect)</li>
                    <li>Créez une ambiance chaleureuse avec quelques accessoires déco</li>
                    <li>Valorisez les espaces extérieurs avec du mobilier adapté</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3 text-blue-400">Photos professionnelles</h3>
                  <p className="text-gray-300">
                    Investir dans des photos professionnelles peut augmenter le nombre de visites de 30%. 
                    Nous pouvons vous mettre en relation avec un photographe spécialisé.
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <button className="w-full bg-green-600 py-3 px-6 rounded-lg font-bold hover:bg-green-700 transition">
                  Télécharger cette liste en PDF
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1e1e24] p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Service de Home Staging Virtuel</h2>
            <p className="text-gray-300 mb-6">
              Visualisez le potentiel de votre bien avec notre service de home staging virtuel. 
              Nos designers transforment vos photos pour montrer à quoi pourrait ressembler votre bien après quelques améliorations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#2a2a35] p-4 rounded-lg">
                <h3 className="font-bold mb-2">Avant</h3>
                <div className="h-48 bg-gray-700 rounded flex items-center justify-center">
                  <p>Photo Avant</p>
                </div>
              </div>
              <div className="bg-[#2a2a35] p-4 rounded-lg">
                <h3 className="font-bold mb-2">Après</h3>
                <div className="h-48 bg-gray-700 rounded flex items-center justify-center">
                  <p>Photo Après</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button className="bg-purple-600 py-3 px-6 rounded-lg font-bold hover:bg-purple-700 transition">
                Essayer le home staging virtuel
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 