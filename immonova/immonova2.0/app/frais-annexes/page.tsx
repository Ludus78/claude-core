export default function FraisAnnexes() {
  return (
    <section className="max-w-5xl mx-auto mt-10">
      <h1 className="text-4xl font-bold mb-6 text-center text-[#2c3e50] font-['Montserrat']">Estimation des Frais Annexes</h1>
      <p className="text-xl text-[#5d6d7e] text-center mb-12 font-['Nunito']">
        Calculez tous les frais supplémentaires liés à votre achat immobilier pour avoir une vision complète du coût total.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border-l-4 border-[#e67e22]">
          <h2 className="text-2xl font-bold mb-6 text-[#2c3e50] font-['Montserrat']">Calculateur de Frais</h2>
          
          <form className="space-y-6">
            <div>
              <label className="block text-[#34495e] mb-2 font-medium font-['Nunito']">Prix d'achat du bien</label>
              <div className="flex">
                <input 
                  type="number" 
                  placeholder="Ex: 300000" 
                  className="w-full px-4 py-3 rounded-l-lg bg-[#f0eeec] text-[#34495e] border border-[#ddd]"
                />
                <span className="bg-[#e6e6e6] px-4 py-3 rounded-r-lg flex items-center text-[#34495e]">€</span>
              </div>
            </div>
            
            <div>
              <label className="block text-[#34495e] mb-2 font-medium font-['Nunito']">Type d'acquisition</label>
              <select className="w-full bg-[#f0eeec] p-3 rounded-lg text-[#34495e] border border-[#ddd]">
                <option>Résidence principale</option>
                <option>Résidence secondaire</option>
                <option>Investissement locatif</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[#34495e] mb-2 font-medium font-['Nunito']">État du bien</label>
              <select className="w-full bg-[#f0eeec] p-3 rounded-lg text-[#34495e] border border-[#ddd]">
                <option>Neuf</option>
                <option>Ancien (moins de 5 ans)</option>
                <option>Ancien (plus de 5 ans)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[#34495e] mb-2 font-medium font-['Nunito']">Travaux envisagés</label>
              <select className="w-full bg-[#f0eeec] p-3 rounded-lg text-[#34495e] border border-[#ddd]" id="travaux-select">
                <option value="0">Aucun travaux</option>
                <option value="5">Rafraîchissement léger</option>
                <option value="10">Rénovation partielle</option>
                <option value="15">Rénovation complète</option>
                <option value="custom">Montant personnalisé</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[#34495e] mb-2 font-medium font-['Nunito']">Financement</label>
              <select className="w-full bg-[#f0eeec] p-3 rounded-lg text-[#34495e] border border-[#ddd]">
                <option>Prêt immobilier classique</option>
                <option>Prêt à taux zéro (PTZ)</option>
                <option>Comptant</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[#34495e] mb-2 font-medium font-['Nunito']">Localisation</label>
              <input 
                type="text" 
                placeholder="Code postal" 
                className="w-full px-4 py-3 rounded-lg bg-[#f0eeec] text-[#34495e] border border-[#ddd]"
              />
            </div>
            
            <button className="w-full bg-[#e67e22] py-3 px-6 rounded-lg font-bold hover:bg-[#d35400] transition text-lg text-white">
              Calculer les frais
            </button>
          </form>
        </div>
        
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#2980b9] mb-6">
            <h2 className="text-2xl font-bold mb-4 text-[#2c3e50] font-['Montserrat']">Résumé des Frais</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-[#eee]">
                <span className="text-[#5d6d7e] font-['Nunito']">Prix d'achat</span>
                <span className="font-bold text-[#34495e]">300 000 €</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-[#eee]">
                <span className="text-[#5d6d7e] font-['Nunito']">Frais de notaire</span>
                <span className="font-bold text-[#34495e]">21 000 €</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-[#eee]">
                <span className="text-[#5d6d7e] font-['Nunito']">Frais de garantie</span>
                <span className="font-bold text-[#34495e]">3 200 €</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-[#eee]">
                <span className="text-[#5d6d7e] font-['Nunito']">Frais de dossier bancaire</span>
                <span className="font-bold text-[#34495e]">1 500 €</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-[#eee]">
                <span className="text-[#5d6d7e] font-['Nunito']">Estimation travaux</span>
                <span className="font-bold text-[#34495e]">30 000 €</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-[#eee]">
                <span className="text-[#5d6d7e] font-['Nunito']">Taxe foncière (annuelle)</span>
                <span className="font-bold text-[#34495e]">1 800 €</span>
              </div>
            </div>
            
            <div className="bg-[#2980b9] p-4 rounded-lg text-white">
              <div className="flex justify-between items-center">
                <span className="font-bold">COÛT TOTAL</span>
                <span className="font-bold text-xl">355 700 €</span>
              </div>
              <div className="text-xs text-white/80 mt-2">
                Dont 55 700 € de frais annexes (18.6% du prix d'achat)
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#27ae60]">
            <h2 className="text-xl font-bold mb-4 text-[#2c3e50] font-['Montserrat']">Exporter le résultat</h2>
            <div className="space-y-3">
              <button className="w-full bg-[#27ae60] hover:bg-[#219653] text-white py-2 px-4 rounded flex items-center justify-center gap-2">
                <span>Télécharger en PDF</span>
              </button>
              <button className="w-full bg-[#2980b9] hover:bg-[#2471a3] text-white py-2 px-4 rounded flex items-center justify-center gap-2">
                <span>Envoyer par email</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#e67e22]">
          <h2 className="text-xl font-bold mb-4 text-[#2c3e50] font-['Montserrat']">Comprendre les frais de notaire</h2>
          <p className="text-[#5d6d7e] mb-4 font-['Nunito']">
            Les frais de notaire comprennent plusieurs éléments dont :
          </p>
          <ul className="list-disc list-inside text-[#5d6d7e] space-y-2 mb-4 font-['Nunito']">
            <li>Droits d'enregistrement (environ 5.8% pour l'ancien)</li>
            <li>Émoluments du notaire (0.8% à 1.5% du prix)</li>
            <li>Frais de gestion du dossier</li>
            <li>Débours (frais avancés par le notaire)</li>
          </ul>
          <p className="text-[#5d6d7e] font-['Nunito']">
            Pour un bien ancien, les frais représentent généralement 7% à 8% du prix d'achat, 
            contre 2% à 3% pour un bien neuf.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#2980b9]">
          <h2 className="text-xl font-bold mb-4 text-[#2c3e50] font-['Montserrat']">Autres frais à prévoir</h2>
          <ul className="list-disc list-inside text-[#5d6d7e] space-y-3 font-['Nunito']">
            <li>
              <strong>Frais de déménagement</strong>: De 500€ à 3000€ selon le volume et la distance
            </li>
            <li>
              <strong>Frais d'agence immobilière</strong>: Entre 3% et 5% du prix de vente (souvent à la charge du vendeur)
            </li>
            <li>
              <strong>Taxe d'habitation</strong>: Variable selon la commune et la valeur du bien
            </li>
            <li>
              <strong>Assurance habitation</strong>: Entre 150€ et 400€ par an pour un appartement
            </li>
            <li>
              <strong>Frais de copropriété</strong>: Variables selon les prestations offertes
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
} 