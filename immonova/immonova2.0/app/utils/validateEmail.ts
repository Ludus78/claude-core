/**
 * Valide un email en utilisant une expression régulière standard et en vérifiant uniquement les domaines temporaires évidents.
 * @param email - L'adresse email à valider
 * @returns Un objet contenant le résultat de validation et un message d'erreur éventuel
 */
export function validateEmail(email: string): { isValid: boolean; message?: string } {
  // Vérifier que l'email n'est pas vide
  if (!email || email.trim() === '') {
    return { isValid: false, message: "L'adresse email est requise" };
  }

  // Expression régulière simplifiée pour la validation d'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Format d'adresse email invalide" };
  }

  // Liste réduite de domaines couramment utilisés pour les emails jetables
  const blacklistedDomains = [
    'yopmail.com',
    'tempmail.com',
    'guerrillamail.com',
    'mailinator.com',
    'temp-mail.org',
    'fakeinbox.com',
  ];

  // Extraire le domaine de l'email
  const domain = email.split('@')[1].toLowerCase();

  // Vérifier si le domaine est dans la liste noire (uniquement domaines jetables évidents)
  if (blacklistedDomains.includes(domain)) {
    return { 
      isValid: false, 
      message: "Veuillez utiliser une adresse email personnelle ou professionnelle valide." 
    };
  }

  return { isValid: true };
} 