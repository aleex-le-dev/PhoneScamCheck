// Configuration des clés API pour les services externes
// En production, ces clés doivent être stockées dans des variables d'environnement

export const API_KEYS = {
  // NumVerify - API gratuite pour la validation des numéros
  // Obtenir une clé gratuite sur : https://numverify.com/
  NUMVERIFY_KEY: process.env.REACT_APP_NUMVERIFY_KEY || 'demo',
  
  // OpenCNAM - Base de données communautaire
  // Service gratuit, pas de clé requise
  OPENCNAM_KEY: process.env.REACT_APP_OPENCNAM_KEY || '',
  
  // HIBP-style database (optionnel)
  HIBP_KEY: process.env.REACT_APP_HIBP_KEY || '',
  
  // ScamAlert.fr - Base de données française (optionnel)
  SCAMALERT_KEY: process.env.REACT_APP_SCAMALERT_KEY || '',
  
  // TrueCaller - Service premium (optionnel)
  TRUECALLER_KEY: process.env.REACT_APP_TRUECALLER_KEY || '',
  
  // WhoCalledMe - Service de réputation (optionnel)
  WHOCALLEDME_KEY: process.env.REACT_APP_WHOCALLEDME_KEY || ''
};

// Configuration des endpoints des APIs
export const API_ENDPOINTS = {
  NUMVERIFY: 'http://apilayer.net/api/validate',
  OPENCNAM: 'https://api.opencnam.com/v3/phone',
  HIBP: 'https://api.hibp.com/breaches',
  SCAMALERT: 'https://www.scamalert.fr/api',
  TRUECALLER: 'https://api.truecaller.com/v2/search',
  WHOCALLEDME: 'https://api.whocalledme.com/v1/search'
};

// Limites des APIs gratuites
export const API_LIMITS = {
  NUMVERIFY: {
    free: 100,
    premium: 10000
  },
  OPENCNAM: {
    free: 1000,
    premium: 100000
  },
  SCAMALERT: {
    free: 'unlimited',
    premium: 'unlimited'
  }
};

// Instructions pour obtenir les clés API
export const API_INSTRUCTIONS = {
  NUMVERIFY: {
    url: 'https://numverify.com/',
    steps: [
      'Visiter numverify.com',
      'Créer un compte gratuit',
      'Obtenir la clé API dans le dashboard',
      'Ajouter REACT_APP_NUMVERIFY_KEY=votre_cle dans .env'
    ]
  },
  OPENCNAM: {
    url: 'https://www.opencnam.com/',
    steps: [
      'Service gratuit, pas de clé requise',
      'Limite de 1000 requêtes par jour',
      'Base de données communautaire'
    ]
  },
  SCAMALERT: {
    url: 'https://www.scamalert.fr/',
    steps: [
      'Base de données française des arnaques',
      'Service gratuit et communautaire',
      'Pas de clé API requise'
    ]
  }
};

// Vérification de la configuration
export const validateAPIKeys = () => {
  const warnings = [];
  const errors = [];
  
  if (!API_KEYS.NUMVERIFY_KEY || API_KEYS.NUMVERIFY_KEY === 'demo') {
    warnings.push('NumVerify utilise la clé de démonstration (limite de 100 requêtes)');
  }
  
  if (!API_KEYS.TRUECALLER_KEY) {
    warnings.push('TrueCaller non configuré - fonctionnalités premium désactivées');
  }
  
  if (!API_KEYS.WHOCALLEDME_KEY) {
    warnings.push('WhoCalledMe non configuré - fonctionnalités premium désactivées');
  }
  
  return { warnings, errors };
};

// Configuration par défaut pour le développement
export const getDefaultConfig = () => ({
  useExternalAPIs: true,
  fallbackToLocal: true,
  cacheResults: true,
  cacheDuration: 3600000, // 1 heure
  maxConcurrentRequests: 3,
  requestTimeout: 10000 // 10 secondes
});
