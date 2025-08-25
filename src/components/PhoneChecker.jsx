import { useState } from 'react';
import { FaPhone, FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaSearch, FaFilter, FaDatabase, FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa';
import { PhoneCheckService } from '../services/phoneCheckService';
import { riskCategories, riskLevels } from '../data/phoneDatabase';

const PhoneChecker = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSources, setShowSources] = useState(false);

  const checkPhoneNumber = async () => {
    if (!phoneNumber || phoneNumber.length < 8) return;
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await PhoneCheckService.checkPhoneNumber(phoneNumber);
      
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Erreur lors de la vérification');
    } finally {
      setLoading(false);
    }
  };

  const reportNumber = async () => {
    if (!phoneNumber || !result) return;
    
    try {
      const reportData = {
        type: result.type,
        description: result.description,
        category: result.category
      };
      
      const response = await PhoneCheckService.reportNumber(phoneNumber, reportData);
      
      if (response.success) {
        // Mettre à jour le nombre de signalements localement
        setResult(prev => ({
          ...prev,
          reports: (prev.reports || 0) + 1
        }));
        
        alert('Numéro signalé avec succès à toutes les sources !');
      } else {
        alert('Erreur lors du signalement');
      }
    } catch (err) {
      alert('Erreur lors du signalement');
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await PhoneCheckService.searchReports(searchQuery);
      
      if (response.success) {
        setSearchResults(response.data);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      setSearchResults([]);
    }
  };

  const getResultIcon = () => {
    if (!result) return null;
    
    switch (result.type) {
      case 'scam':
        return <FaExclamationTriangle className="text-red-500 text-4xl" />;
      case 'spam':
        return <FaExclamationTriangle className="text-orange-500 text-4xl" />;
      case 'safe':
        return <FaCheckCircle className="text-green-500 text-4xl" />;
      case 'reliable':
        return <FaCheckCircle className="text-green-500 text-4xl" />;
      case 'suspicious':
        return <FaExclamationTriangle className="text-yellow-500 text-4xl" />;
      default:
        return <FaShieldAlt className="text-gray-500 text-4xl" />;
    }
  };

  const getResultColor = () => {
    if (!result) return '';
    
    switch (result.type) {
      case 'scam':
        return 'border-red-500 bg-red-50';
      case 'spam':
        return 'border-orange-500 bg-orange-50';
      case 'safe':
        return 'border-green-500 bg-green-50';
      case 'reliable':
        return 'border-green-500 bg-green-50';
      case 'suspicious':
        return 'border-yellow-500 bg-yellow-50';
      case 'truecaller':
      case 'mobile':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getResultText = () => {
    if (!result) return '';
    
    switch (result.type) {
      case 'scam':
        return '🚨 ARNAQUE DÉTECTÉE';
      case 'spam':
        return '⚠️ SPAM DÉTECTÉ';
      case 'safe':
        return '✅ NUMÉRO SÉCURISÉ';
      case 'reliable':
        return '✅ NUMÉRO FIABLE';
      case 'suspicious':
        return '⚠️ NUMÉRO SUSPECT';
      case 'truecaller':
        return '';
      case 'mobile':
        return '';
      default:
        return '❓ NON VÉRIFIÉ';
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'medium':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'low':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'none':
        return 'text-green-600 bg-green-100 border-green-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100 border-green-200';
    if (confidence >= 70) return 'text-blue-600 bg-blue-100 border-blue-200';
    if (confidence >= 50) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 90) return 'Très élevée';
    if (confidence >= 70) return 'Élevée';
    if (confidence >= 50) return 'Moyenne';
    return 'Faible';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FaShieldAlt className="text-6xl text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            PhoneScamCheck
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Vérifiez instantanément si un numéro de téléphone est signalé comme spam ou arnaque. 
            Base de données communautaire + APIs externes en temps réel.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="flex items-center mb-6">
              <FaPhone className="text-2xl text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Vérifier un numéro
              </h2>
            </div>
            
            <div className="flex gap-3">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+33 6 12 34 56 78"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <button
                onClick={checkPhoneNumber}
                disabled={loading || !phoneNumber}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Vérification...' : 'Vérifier'}
              </button>
            </div>
            
            {error && (
              <div className="mt-3 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            
            <p className="text-sm text-gray-500 mt-3">
              Entrez un numéro de téléphone français pour vérifier s'il est signalé
            </p>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className={`bg-white rounded-2xl shadow-xl p-8 border-2 ${getResultColor()}`}>
              <div className="text-center mb-6">
                {getResultIcon()}
                <h3 className={`text-2xl font-bold mt-4 ${
                  result.type === 'scam' ? 'text-red-600' :
                  result.type === 'spam' ? 'text-orange-600' :
                  result.type === 'safe' ? 'text-green-600' :
                  result.type === 'reliable' ? 'text-green-600' :
                  result.type === 'suspicious' ? 'text-yellow-600' :
                  result.type === 'truecaller' || result.type === 'mobile' ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {getResultText()}
                </h3>
                
                {/* Affichage du numéro de téléphone avec emoji approprié */}
                <p className="text-xl text-blue-600 mt-2 font-mono font-bold">
                  {result.type === 'mobile' || result.type === 'truecaller' ? '📱' : '☎️'} {phoneNumber}
                </p>
                
                {/* Affichage du niveau de risque seulement si pertinent */}
                {result.riskInfo && result.riskLevel !== 'none' && (
                  <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskLevelColor(result.riskLevel)}`}>
                    {result.riskInfo.icon} {result.riskInfo.label}
                  </div>
                )}
                
                {/* Affichage spécial pour les numéros fiables */}
                {result.riskInfo && result.riskLevel === 'none' && (
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-green-200 text-green-600 bg-green-100">
                    ✅ Numéro fiable
                  </div>
                )}

                {/* Score de confiance unifié */}
                {result.source === 'TrueCaller' && (
                  <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-blue-200 text-blue-600 bg-blue-100">
                    <FaInfoCircle className="mr-2" />
                    Confiance : {typeof result.confidence === 'number' ? result.confidence : 85}% ({getConfidenceLabel(typeof result.confidence === 'number' ? result.confidence : 85)})
                  </div>
                )}
                

                
                {/* Score de confiance pour les autres sources */}
                {result.confidence && result.source !== 'TrueCaller' && (
                  <div className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getConfidenceColor(result.confidence)}`}>
                    <FaInfoCircle className="mr-2" />
                    Confiance : {result.confidence}% ({getConfidenceLabel(result.confidence)})
                  </div>
                )}
                
                {/* Score de spam TrueCaller */}
                {result.spamScore !== undefined && (
                  <div className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                    result.spamScore >= 80 ? 'text-red-600 bg-red-100 border-red-200' :
                    result.spamScore >= 50 ? 'text-orange-600 bg-orange-100 border-orange-200' :
                    'text-green-600 bg-green-100 border-green-200'
                  }`}>
                    <FaExclamationTriangle className="mr-2" />
                    Score Spam : {result.spamScore}% ({result.spamScore >= 80 ? 'Élevé' : result.spamScore >= 50 ? 'Moyen' : 'Faible'})
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {/* Informations de base */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Signalements :</span>
                    <span className="font-bold text-2xl text-blue-600 text-right">{result.reports || 0}</span>
                  </div>
                  
                  {result.spamScore !== undefined && (
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Risque :</span>
                      <span className={`font-bold text-2xl text-right ${
                        result.spamScore >= 80 ? 'text-red-600' :
                        result.spamScore >= 50 ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {result.spamScore}%
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Message spécial si aucun signalement */}
                {(!result.reports || result.reports === 0) && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center text-green-700">
                      <FaCheckCircle className="mr-2" />
                      <span className="font-medium">Aucun signalement - Numéro considéré comme fiable</span>
                    </div>
                  </div>
                )}
                
                {/* Dernier signalement seulement s'il y en a */}
                {result.lastReport && result.reports > 0 && (
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Dernier signalement :</span>
                    <span className="text-gray-600">
                      {new Date(result.lastReport).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
                
                {result.categoryLabel && (
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Catégorie :</span>
                    <span className="text-gray-600">{result.categoryLabel}</span>
                  </div>
                )}

                {result.source && (
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Source :</span>
                    <span className="text-gray-600">{result.source}</span>
                  </div>
                )}
                
                {/* Informations TrueCaller */}
                {result.name && (
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="font-medium text-blue-700">Nom :</span>
                    <span className="text-blue-600 font-medium">{result.name}</span>
                  </div>
                )}
                
                {/* Type de ligne (fixe/mobile) */}
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="font-medium text-blue-700">Type de ligne :</span>
                  <span className="text-blue-600 font-medium">
                    {result.type === 'mobile' ? '📱 Mobile' : 
                     result.type === 'landline' ? '☎️ Fixe' : 
                     result.type === 'truecaller' ? '📱 Mobile' :
                     'Inconnu'}
                  </span>
                </div>
                
                {/* Pourcentage de problème */}
                {result.spamScore !== undefined && (
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="font-medium text-blue-700">Problème :</span>
                    <span className={`font-medium ${
                      result.spamScore >= 80 ? 'text-red-600' :
                      result.spamScore >= 50 ? 'text-orange-600' :
                      'text-green-600'
                    }`}>
                      {result.spamScore}%
                    </span>
                  </div>
                )}
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Description :</span>
                  <p className="text-gray-600 mt-1">{result.description}</p>
                </div>

                {/* Sources externes */}
                {result.externalSources && Object.keys(result.externalSources).length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-2">
                      <FaDatabase className="text-blue-600 mr-2" />
                      <span className="font-medium text-blue-800">Sources externes consultées :</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(result.externalSources).map(([key, source]) => (
                        source && (
                          <span key={key} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200">
                            {key === 'numverify' ? 'NumVerify' : 
                             key === 'opencnam' ? 'OpenCNAM' : 
                             key === 'scamalert' ? 'ScamAlert.fr' : key}
                          </span>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 text-center space-y-3">
                <button
                  onClick={reportNumber}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Signaler ce numéro
                </button>
                
                <button
                  onClick={() => setShowSources(!showSources)}
                  className="block w-full px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors text-sm"
                >
                  <FaExternalLinkAlt className="inline mr-2" />
                  {showSources ? 'Masquer' : 'Voir'} les sources de données
                </button>
              </div>

              {/* Sources détaillées */}
              {showSources && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Sources de données utilisées :</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FaDatabase className="mr-2 text-blue-600" />
                      <span>Base de données locale communautaire</span>
                    </div>
                    <div className="flex items-center">
                      <FaExternalLinkAlt className="mr-2 text-green-600" />
                      <span>NumVerify - Validation des numéros</span>
                    </div>
                    <div className="flex items-center">
                      <FaExternalLinkAlt className="mr-2 text-purple-600" />
                      <span>OpenCNAM - Réputation téléphonique</span>
                    </div>
                    <div className="flex items-center">
                      <FaExternalLinkAlt className="mr-2 text-orange-600" />
                      <span>ScamAlert.fr - Base française des arnaques</span>
                    </div>
                    <div className="flex items-center">
                      <FaShieldAlt className="mr-2 text-yellow-600" />
                      <span>Analyse automatique des patterns</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Advanced Search */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FaSearch className="text-2xl text-blue-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">
                  Recherche avancée
                </h2>
              </div>
              <button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaFilter className="mr-2" />
                {showAdvancedSearch ? 'Masquer' : 'Afficher'}
              </button>
            </div>
            
            {showAdvancedSearch && (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par numéro, description ou catégorie..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={performSearch}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Rechercher
                  </button>
                </div>
                
                {searchResults.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Résultats de recherche ({searchResults.length})
                    </h3>
                    <div className="space-y-3">
                      {searchResults.slice(0, 5).map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-gray-800">{item.phoneNumber}</div>
                              <div className="text-sm text-gray-600">{item.description}</div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRiskLevelColor(item.riskLevel)}`}>
                                  {item.riskInfo?.icon} {item.riskInfo?.label}
                                </span>
                                <span className="text-xs text-gray-500">{item.categoryLabel}</span>
                                {item.source && (
                                  <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
                                    {item.source}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-800">{item.reports}</div>
                              <div className="text-xs text-gray-500">signalements</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p>Protégez-vous et protégez les autres en signalant les numéros frauduleux</p>
          <p className="mt-2">© 2024 PhoneScamCheck - Sécurité communautaire + APIs externes en temps réel</p>
        </div>
      </div>
    </div>
  );
};

export default PhoneChecker;
