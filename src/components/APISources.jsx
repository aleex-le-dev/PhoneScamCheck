import { useState, useEffect } from 'react';
import { FaDatabase, FaCheckCircle, FaExclamationTriangle, FaClock, FaExternalLinkAlt, FaShieldAlt } from 'react-icons/fa';
import { ExternalAPIService } from '../services/externalAPIs';

const APISources = () => {
  const [apiStats, setApiStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    loadAPIStats();
    const interval = setInterval(loadAPIStats, 60000); // Mise à jour toutes les minutes
    
    return () => clearInterval(interval);
  }, []);

  const loadAPIStats = async () => {
    try {
      const response = await ExternalAPIService.getAPIStats();
      if (response.success) {
        setApiStats(response.data);
        setLastUpdate(new Date().toLocaleTimeString('fr-FR'));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des stats API:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'inactive':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'limited':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <FaCheckCircle className="text-green-600" />;
      case 'inactive':
        return <FaExclamationTriangle className="text-red-600" />;
      case 'limited':
        return <FaClock className="text-yellow-600" />;
      default:
        return <FaDatabase className="text-gray-600" />;
    }
  };

  const getUsagePercentage = (used, limit) => {
    if (limit === 'unlimited') return 0;
    if (typeof used === 'number' && typeof limit === 'number') {
      return Math.round((used / limit) * 100);
    }
    return 0;
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <FaShieldAlt className="text-4xl text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Sources de données externes
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Notre système utilise plusieurs APIs et bases de données communautaires pour 
          une détection maximale des numéros frauduleux
        </p>
      </div>

      {/* API Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(apiStats).map(([key, api]) => (
          <div key={key} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {getStatusIcon(api.status)}
                <span className="ml-2 text-lg font-semibold text-gray-800">{api.name}</span>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(api.status)}`}>
                {api.status === 'active' ? 'Actif' : api.status === 'inactive' ? 'Inactif' : 'Limité'}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type :</span>
                <span className={`text-sm font-medium ${api.free ? 'text-green-600' : 'text-blue-600'}`}>
                  {api.free ? 'Gratuit' : 'Payant'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Limite quotidienne :</span>
                <span className="text-sm font-medium text-gray-800">
                  {api.dailyLimit === 'unlimited' ? 'Illimitée' : api.dailyLimit}
                </span>
              </div>
              
              {api.dailyLimit !== 'unlimited' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Utilisé :</span>
                    <span className="text-sm font-medium text-gray-800">
                      {api.used} / {api.dailyLimit}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(api.used, api.dailyLimit))} transition-all duration-300`}
                      style={{ width: `${getUsagePercentage(api.used, api.dailyLimit)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
                <FaExternalLinkAlt className="mr-2" />
                <span className="text-sm font-medium">Voir la documentation</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* API Information */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Comment fonctionnent nos sources de données ?
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Vérification locale</h4>
                <p className="text-sm text-gray-600">
                  Notre base de données communautaire contient des milliers de numéros signalés 
                  par nos utilisateurs et partenaires.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">APIs externes</h4>
                <p className="text-sm text-gray-600">
                  Nous interrogeons en temps réel des services comme NumVerify, OpenCNAM 
                  et des bases communautaires françaises.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-purple-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Analyse de patterns</h4>
                <p className="text-sm text-gray-600">
                  Notre IA analyse les patterns des numéros pour détecter des comportements 
                  suspects même sans signalement préalable.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-orange-600 font-bold text-sm">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Score de confiance</h4>
                <p className="text-sm text-gray-600">
                  Chaque vérification génère un score de confiance basé sur le nombre 
                  de sources et la qualité des données.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Updates */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaClock className="text-blue-600 mr-2" />
            <span className="text-sm text-blue-800">Dernière mise à jour des APIs : {lastUpdate}</span>
          </div>
          <div className="flex items-center">
            <FaDatabase className="text-blue-600 mr-2" />
            <span className="text-sm text-blue-800">
              {Object.values(apiStats).filter(api => api.status === 'active').length} APIs actives
            </span>
          </div>
        </div>
      </div>

      {/* API Documentation Links */}
      <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
          Documentation des APIs utilisées
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h4 className="font-semibold text-gray-800 mb-2">NumVerify</h4>
            <p className="text-sm text-gray-600 mb-3">
              Validation et informations sur les numéros de téléphone
            </p>
            <a 
              href="https://numverify.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaExternalLinkAlt className="mr-2" />
              Visiter
            </a>
          </div>
          
          <div className="text-center">
            <h4 className="font-semibold text-gray-800 mb-2">OpenCNAM</h4>
            <p className="text-sm text-gray-600 mb-3">
              Base de données communautaire de réputation téléphonique
            </p>
            <a 
              href="https://www.opencnam.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaExternalLinkAlt className="mr-2" />
              Visiter
            </a>
          </div>
          
          <div className="text-center">
            <h4 className="font-semibold text-gray-800 mb-2">ScamAlert.fr</h4>
            <p className="text-sm text-gray-600 mb-3">
              Base de données française des arnaques et spams
            </p>
            <a 
              href="https://www.scamalert.fr/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FaExternalLinkAlt className="mr-2" />
              Visiter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APISources;
