export const formatNumber = (number: number): string => {
  // Utilise Intl.NumberFormat avec une locale fixe pour éviter les différences serveur/client
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0
  }).format(number);
}; 