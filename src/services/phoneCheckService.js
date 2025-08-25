import { phoneDatabase, riskCategories, riskLevels } from '../data/phoneDatabase';
import { ExternalAPIService } from './externalAPIs';
import { TrueCallerService } from './truecallerService';

// Service de vérification des numéros de téléphone avec APIs externes
export class PhoneCheckService {
  
  // Vérifier un numéro de téléphone via toutes les sources
  static async checkPhoneNumber(phoneNumber) {
    try {
      // Nettoyer le numéro
      const cleanNumber = this.cleanPhoneNumber(phoneNumber);
      
      if (!this.isValidFrenchNumber(cleanNumber)) {
        throw new Error('Numéro de téléphone français invalide');
      }
      
      // Vérification multi-sources en parallèle (incluant TrueCaller)
      const [localResult, externalResult, truecallerResult] = await Promise.all([
        this.checkLocalDatabase(cleanNumber),
        ExternalAPIService.checkMultipleSources(cleanNumber),
        TrueCallerService.checkPhoneNumber(cleanNumber)
      ]);
      
      // Combiner les résultats (incluant TrueCaller)
      const combinedResult = this.combineResults(localResult, externalResult, truecallerResult, cleanNumber);
      
      return {
        success: true,
        found: combinedResult.found,
        data: combinedResult.data
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Vérifier dans la base de données locale
  static async checkLocalDatabase(phoneNumber) {
    const result = phoneDatabase[phoneNumber];
    
    if (result) {
      return {
        found: true,
        data: {
          ...result,
          categoryLabel: riskCategories[result.category] || 'Non catégorisé',
          riskInfo: riskLevels[result.riskLevel] || riskLevels.unknown,
          source: 'Base locale'
        }
      };
    }
    
    return {
      found: false,
      data: null
    };
  }
  
  // Combiner les résultats locaux et externes
  static combineResults(localResult, externalResult, truecallerResult, phoneNumber) {
    if (localResult.found) {
      // Numéro trouvé localement - enrichir avec les données externes
      const enrichedData = {
        ...localResult.data,
        externalSources: externalResult.success ? externalResult.data.sources : {},
        confidence: externalResult.success ? externalResult.data.summary.confidence : 80
      };
      
      return {
        found: true,
        data: enrichedData
      };
    } else if (externalResult.success && externalResult.data.summary.totalReports > 0) {
      // Numéro trouvé via les APIs externes
      const externalData = {
        type: externalResult.data.summary.type,
        reports: externalResult.data.summary.totalReports,
        lastReport: new Date().toISOString().split('T')[0],
        description: externalResult.data.summary.description,
        category: 'external',
        riskLevel: externalResult.data.summary.riskLevel,
        categoryLabel: 'Signalé externe',
        riskInfo: riskLevels[externalResult.data.summary.riskLevel] || riskLevels.unknown,
        source: 'APIs externes',
        externalSources: externalResult.data.sources,
        confidence: externalResult.data.summary.confidence
      };
      
      return {
        found: true,
        data: externalData
      };
    } else if (truecallerResult.success && truecallerResult.data) {
      // Numéro trouvé via TrueCaller
      const truecallerData = {
        type: truecallerResult.data.type,
        reports: truecallerResult.data.reports,
        lastReport: truecallerResult.data.lastReport,
        description: truecallerResult.data.description,
        category: 'truecaller',
        riskLevel: truecallerResult.data.riskLevel,
        categoryLabel: 'Signalé par TrueCaller',
        riskInfo: riskLevels[truecallerResult.data.riskLevel] || riskLevels.unknown,
        source: 'TrueCaller',
        externalSources: truecallerResult.data.sources,
        confidence: truecallerResult.data.confidence
      };
      
      return {
        found: true,
        data: truecallerData
      };
    } else {
      // Numéro non trouvé - vérification de sécurité
      const securityCheck = this.performSecurityCheck(phoneNumber);
      return {
        found: false,
        data: securityCheck
      };
    }
  }
  
  // Vérification de sécurité pour les numéros non trouvés
  static performSecurityCheck(phoneNumber) {
    // Analyse basée sur des patterns connus
    const patterns = this.analyzePhonePatterns(phoneNumber);
    
    return {
      type: patterns.risk ? 'suspicious' : 'safe',
      reports: 0,
      lastReport: null,
      description: patterns.description,
      category: 'pattern_analysis',
      riskLevel: patterns.riskLevel,
      categoryLabel: 'Analyse de pattern',
      riskInfo: riskLevels[patterns.riskLevel] || riskLevels.unknown,
      source: 'Analyse automatique',
      confidence: patterns.confidence
    };
  }
  
  // Analyser les patterns des numéros
  static analyzePhonePatterns(phoneNumber) {
    const cleanNumber = phoneNumber.replace(/\+33|0/, '');
    
    // Patterns suspects connus
    const suspiciousPatterns = [
      { pattern: /^1[0-9]{8}$/, risk: 'medium', description: 'Numéro commençant par 1 (souvent démarchage)' },
      { pattern: /^8[0-9]{8}$/, risk: 'low', description: 'Numéro commençant par 8 (services payants)' },
      { pattern: /^9[0-9]{8}$/, risk: 'low', description: 'Numéro commençant par 9 (services spéciaux)' }
    ];
    
    // Vérifier les patterns
    for (const pattern of suspiciousPatterns) {
      if (pattern.pattern.test(cleanNumber)) {
        return {
          risk: true,
          riskLevel: pattern.risk,
          description: pattern.description,
          confidence: 60
        };
      }
    }
    
    // Vérifier les répétitions de chiffres
    const digitCounts = {};
    for (const digit of cleanNumber) {
      digitCounts[digit] = (digitCounts[digit] || 0) + 1;
    }
    
    const maxRepeats = Math.max(...Object.values(digitCounts));
    if (maxRepeats >= 6) {
      return {
        risk: true,
        riskLevel: 'medium',
        description: 'Nombre de répétitions de chiffres suspect',
        confidence: 70
      };
    }
    
    // Numéro semble normal
    return {
      risk: false,
      riskLevel: 'none',
      description: 'Numéro ne présentant pas de pattern suspect',
      confidence: 85
    };
  }
  
  // Nettoyer le numéro de téléphone
  static cleanPhoneNumber(phoneNumber) {
    return phoneNumber.replace(/\s|-|\(|\)/g, '');
  }
  
  // Valider le format français
  static isValidFrenchNumber(phoneNumber) {
    // Format français : +33XXXXXXXXX ou 0XXXXXXXXX
    const frenchPattern = /^(\+33|0)[1-9](\d{8})$/;
    return frenchPattern.test(phoneNumber);
  }
  
  // Signaler un numéro à toutes les sources
  static async reportNumber(phoneNumber, reportData) {
    try {
      const cleanNumber = this.cleanPhoneNumber(phoneNumber);
      
      if (!this.isValidFrenchNumber(cleanNumber)) {
        throw new Error('Numéro de téléphone français invalide');
      }
      
      // Préparer les données de signalement
      const report = {
        phoneNumber: cleanNumber,
        type: reportData.type,
        description: reportData.description,
        category: reportData.category || 'unknown',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ipAddress: '127.0.0.1', // En production, récupéré côté serveur
        location: 'France' // En production, géolocalisation IP
      };
      
      // Envoyer à toutes les sources
      const [localReport, externalReport] = await Promise.all([
        this.sendToLocalDatabase(report),
        ExternalAPIService.reportToAllSources(cleanNumber, reportData)
      ]);
      
      return {
        success: true,
        message: 'Signalement envoyé avec succès à toutes les sources',
        reportId: `MULTI-${Date.now()}`,
        sources: {
          local: localReport.success,
          external: externalReport.success
        }
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Envoyer au système local
  static async sendToLocalDatabase(report) {
    // Simulation d'envoi à la base locale
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log('Signalement local:', report);
    return {
      success: true,
      reportId: `LOCAL-${Date.now()}`
    };
  }
  
  // Obtenir les statistiques en temps réel
  static async getRealTimeStats() {
    try {
      // Récupérer les stats locales et des APIs
      const [localStats, apiStats] = await Promise.all([
        this.getLocalStats(),
        ExternalAPIService.getAPIStats()
      ]);
      
      const stats = {
        ...localStats,
        lastUpdated: new Date().toISOString(),
        activeUsers: Math.floor(Math.random() * 1000) + 500,
        checksToday: Math.floor(Math.random() * 5000) + 2000,
        externalAPIs: apiStats.success ? apiStats.data : {}
      };
      
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Obtenir les stats locales
  static getLocalStats() {
    const totalReports = Object.values(phoneDatabase).reduce((sum, item) => sum + item.reports, 0);
    const totalScams = Object.values(phoneDatabase).filter(item => item.type === 'scam').reduce((sum, item) => sum + item.reports, 0);
    const totalSpam = Object.values(phoneDatabase).filter(item => item.type === 'spam').reduce((sum, item) => sum + item.reports, 0);
    
    return {
      totalReports,
      totalScams,
      totalSpam,
      verifiedSafe: 23,
      lastUpdated: '2024-01-22',
      topCategories: [
        { name: 'Support technique', count: 640, percentage: 29.7 },
        { name: 'Arnaque bancaire', count: 445, percentage: 20.6 },
        { name: 'Fausses factures', count: 334, percentage: 15.5 },
        { name: 'Démarchage', count: 289, percentage: 13.4 },
        { name: 'Arnaque fiscale', count: 234, percentage: 10.9 },
        { name: 'Autres', count: 214, percentage: 9.9 }
      ]
    };
  }
  
  // Recherche avancée avec sources multiples
  static async searchReports(query, filters = {}) {
    try {
      // Recherche locale
      const localResults = this.searchLocalDatabase(query, filters);
      
      // Recherche externe (si demandée)
      let externalResults = [];
      if (filters.includeExternal !== false) {
        try {
          const externalSearch = await ExternalAPIService.checkMultipleSources(query);
          if (externalSearch.success && externalSearch.data.summary.totalReports > 0) {
            externalResults.push({
              phoneNumber: query,
              ...externalSearch.data.summary,
              source: 'APIs externes'
            });
          }
        } catch (error) {
          console.error('Erreur recherche externe:', error);
        }
      }
      
      // Combiner et trier les résultats
      const allResults = [...localResults, ...externalResults];
      const sortedResults = allResults.sort((a, b) => b.reports - a.reports);
      
      return {
        success: true,
        data: sortedResults,
        total: sortedResults.length,
        sources: {
          local: localResults.length,
          external: externalResults.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Recherche dans la base locale
  static searchLocalDatabase(query, filters) {
    return Object.entries(phoneDatabase)
      .filter(([number, data]) => {
        // Filtre par type
        if (filters.type && data.type !== filters.type) return false;
        
        // Filtre par catégorie
        if (filters.category && data.category !== filters.category) return false;
        
        // Filtre par niveau de risque
        if (filters.riskLevel && data.riskLevel !== filters.riskLevel) return false;
        
        // Recherche textuelle
        if (query) {
          const searchText = `${number} ${data.description} ${riskCategories[data.category]}`.toLowerCase();
          return searchText.includes(query.toLowerCase());
        }
        
        return true;
      })
      .map(([number, data]) => ({
        phoneNumber: number,
        ...data,
        categoryLabel: riskCategories[data.category] || 'Non catégorisé',
        riskInfo: riskLevels[data.riskLevel] || riskLevels.unknown,
        source: 'Base locale'
      }));
  }
}
