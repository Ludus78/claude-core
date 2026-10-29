import Navigation from "../components/Navigation";

export default function Estimation() {
  return (
    <div className="min-h-screen bg-[#131316] text-white">
      <Navigation />
      
      <div className="pt-20 p-8 sm:p-20">
        <section className="max-w-5xl mx-auto mt-10">
          <h1 className="text-4xl font-bold mb-6 text-center">Estimation Détaillée de Votre Bien</h1>
          <p className="text-xl text-gray-300 text-center mb-12">
            Obtenez une estimation précise basée sur des données du marché et des biens comparables récents.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-[#1e1e24] p-6 rounded-lg lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Détails de votre bien</h2>
              
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label className="block text-gray-300 mb-2">Code postal</label>
                    <input type="text" className="w-full bg-[#2a2a35] p-3 rounded-lg" placeholder="Ex: 75001" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Surface (m²)</label>
                    <input type="number" className="w-full bg-[#2a2a35] p-3 rounded-lg" placeholder="Ex: 75" />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Nombre de pièces</label>
                    <select className="w-full bg-[#2a2a35] p-3 rounded-lg">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5+</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Étage</label>
                    <select className="w-full bg-[#2a2a35] p-3 rounded-lg">
                      <option>RDC</option>
                      <option>1er</option>
                      <option>2ème</option>
                      <option>3ème</option>
                      <option>4ème et +</option>
                      <option>Dernier étage</option>
                      <option>N/A</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label className="block text-gray-300 mb-2">Année de construction</label>
                    <select className="w-full bg-[#2a2a35] p-3 rounded-lg">
                      <option>Avant 1949</option>
                      <option>Entre 1949 et 1969</option>
                      <option>Entre 1970 et 1999</option>
                      <option>Entre 2000 et 2010</option>
                      <option>Après 2010</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Caractéristiques supplémentaires</label>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    <div className="flex items-center">
                      <input type="checkbox" id="balcon" className="mr-2" />
                      <label htmlFor="balcon">Balcon/Terrasse</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="parking" className="mr-2" />
                      <label htmlFor="parking">Parking</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="ascenseur" className="mr-2" />
                      <label htmlFor="ascenseur">Ascenseur</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="cave" className="mr-2" />
                      <label htmlFor="cave">Cave</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="gardien" className="mr-2" />
                      <label htmlFor="gardien">Gardien</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="calme" className="mr-2" />
                      <label htmlFor="calme">Calme</label>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-blue-600 py-3 px-6 rounded-lg font-bold hover:bg-blue-700 transition">
                  Estimer mon bien
                </button>
              </form>
            </div>
            
            <div>
              <div className="bg-[#1e1e24] p-6 rounded-lg mb-6">
                <h2 className="text-2xl font-bold mb-4">Estimation</h2>
                <p className="text-gray-300 mb-6">
                  Complétez le formulaire pour obtenir une estimation précise de votre bien.
                </p>
                
                <div className="bg-[#2a2a35] p-4 rounded-lg text-center">
                  <h3 className="text-lg font-medium mb-2">Prix estimé</h3>
                  <p className="text-3xl font-bold text-blue-400">- € </p>
                </div>
                
                <div className="text-sm text-gray-400 mt-4 text-center">
                  Estimation basée sur les données du marché immobilier actuel
                </div>
              </div>
              
              <div className="bg-[#1e1e24] p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Rapport détaillé</h2>
                <p className="text-gray-300 mb-6">
                  Pour une analyse complète, recevez un rapport détaillé incluant:
                </p>
                
                <ul className="list-disc pl-5 space-y-2 text-gray-300 mb-6">
                  <li>Analyse des ventes récentes</li>
                  <li>Tendances du marché dans votre quartier</li>
                  <li>Comparaison avec des biens similaires</li>
                  <li>Recommandations pour optimiser votre prix de vente</li>
                </ul>
                
                <button className="w-full bg-green-600 py-3 px-6 rounded-lg font-bold hover:bg-green-700 transition">
                  Recevoir un rapport détaillé
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1e1e24] p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-bold mb-6">Biens récemment vendus à proximité</h2>
            <p className="text-gray-300 mb-6">
              Entrez votre adresse pour voir les ventes comparables dans votre quartier.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#2a2a35] p-4 rounded-lg">
                <div className="h-32 bg-gray-700 rounded mb-3"></div>
                <h3 className="font-bold mb-1">Appartement 3 pièces</h3>
                <p className="text-gray-300 text-sm mb-1">68m² - 3ème étage</p>
                <p className="text-blue-400 font-bold">Vendu: 320 000 €</p>
                <p className="text-xs text-gray-400">Vendu en Mars 2023</p>
              </div>
              
              <div className="bg-[#2a2a35] p-4 rounded-lg">
                <div className="h-32 bg-gray-700 rounded mb-3"></div>
                <h3 className="font-bold mb-1">Appartement 2 pièces</h3>
                <p className="text-gray-300 text-sm mb-1">45m² - 1er étage</p>
                <p className="text-blue-400 font-bold">Vendu: 245 000 €</p>
                <p className="text-xs text-gray-400">Vendu en Février 2023</p>
              </div>
              
              <div className="bg-[#2a2a35] p-4 rounded-lg">
                <div className="h-32 bg-gray-700 rounded mb-3"></div>
                <h3 className="font-bold mb-1">Maison 4 pièces</h3>
                <p className="text-gray-300 text-sm mb-1">95m² - Jardin</p>
                <p className="text-blue-400 font-bold">Vendu: 450 000 €</p>
                <p className="text-xs text-gray-400">Vendu en Avril 2023</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 