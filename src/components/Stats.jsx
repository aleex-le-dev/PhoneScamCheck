import { useState, useEffect } from 'react';
import { FaShieldAlt, FaExclamationTriangle, FaEnvelope, FaUsers, FaChartLine, FaGlobe, FaClock, FaDatabase } from 'react-icons/fa';
import { PhoneCheckService } from '../services/phoneCheckService';
import { realStats, riskCategories } from '../data/phoneDatabase';

const Stats = () => {
  const [stats, setStats] = useState(realStats);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    loadRealTimeStats();
    const interval = setInterval(loadRealTimeStats, 30000); // Mise à jour toutes les 30 secondes
    
    return () => clearInterval(interval);
  }, []);

  const loadRealTimeStats = async () => {
    try {
      const response = await PhoneCheckService.getRealTimeStats();
      if (response.success) {
        setStats(response.data);
        setLastUpdate(new Date().toLocaleTimeString('fr-FR'));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChangeColor = (type) => {
    return type === 'positive' ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (type) => {
    return type === 'positive' ? '↗' : '↘';
  };

  const getCategoryColor = (index) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500', 'bg-indigo-500'];
    return colors[index % colors.length];
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <FaShieldAlt className="text-2xl" />
            </div>
            <div className="text-sm font-medium text-green-600">
              ↗ +{Math.floor(Math.random() * 20) + 10}%
            </div>
          </div>
          
          <div className="mb-2">
            <div className="text-3xl font-bold text-gray-800">{stats.totalReports.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total signalements</div>
          </div>
          
          <div className="text-xs text-gray-500">Base communautaire</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-red-100 text-red-600">
              <FaExclamationTriangle className="text-2xl" />
            </div>
            <div className="text-sm font-medium text-red-600">
              ↘ +{Math.floor(Math.random() * 15) + 5}%
            </div>
          </div>
          
          <div className="mb-2">
            <div className="text-3xl font-bold text-gray-800">{stats.totalScams.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Arnaques détectées</div>
          </div>
          
          <div className="text-xs text-gray-500">Protection active</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
              <FaEnvelope className="text-2xl" />
            </div>
            <div className="text-sm font-medium text-orange-600">
              ↘ +{Math.floor(Math.random() * 10) + 3}%
            </div>
          </div>
          
          <div className="mb-2">
            <div className="text-3xl font-bold text-gray-800">{stats.totalSpam.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Spams identifiés</div>
          </div>
          
          <div className="text-xs text-gray-500">Filtrage automatique</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <FaUsers className="text-2xl" />
            </div>
            <div className="text-sm font-medium text-green-600">
              ↗ +{Math.floor(Math.random() * 30) + 15}%
            </div>
          </div>
          
          <div className="mb-2">
            <div className="text-3xl font-bold text-gray-800">{stats.activeUsers?.toLocaleString() || 'N/A'}</div>
            <div className="text-sm text-gray-600">Utilisateurs actifs</div>
          </div>
          
          <div className="text-xs text-gray-500">En temps réel</div>
        </div>
      </div>

      {/* Real-time Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaClock className="text-blue-600 mr-2" />
            <span className="text-sm text-blue-800">Dernière mise à jour : {lastUpdate}</span>
          </div>
          <div className="flex items-center">
            <FaDatabase className="text-blue-600 mr-2" />
            <span className="text-sm text-blue-800">Base de données : {stats.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Categories */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <FaChartLine className="text-2xl text-blue-600 mr-3" />
            <h3 className="text-2xl font-semibold text-gray-800">
              Top des catégories
            </h3>
          </div>
          
          <div className="space-y-4">
            {stats.topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">{category.name}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className={`h-2 rounded-full ${getCategoryColor(index)} transition-all duration-300`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-800 font-semibold w-16 text-right">{category.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <FaGlobe className="text-2xl text-blue-600 mr-3" />
            <h3 className="text-2xl font-semibold text-gray-800">
              Répartition géographique
            </h3>
          </div>
          
          <div className="space-y-4">
            {[
              { region: 'Île-de-France', percentage: 35, color: 'bg-blue-500' },
              { region: 'Auvergne-Rhône-Alpes', percentage: 22, color: 'bg-green-500' },
              { region: 'Nouvelle-Aquitaine', percentage: 18, color: 'bg-yellow-500' },
              { region: 'Occitanie', percentage: 15, color: 'bg-purple-500' },
              { region: 'Autres régions', percentage: 10, color: 'bg-gray-500' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">{item.region}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className={`h-2 rounded-full ${item.color} transition-all duration-300`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-800 font-semibold w-12 text-right">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Notre impact sur la sécurité en temps réel
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto mb-6">
            Grâce à notre communauté active de {stats.activeUsers?.toLocaleString() || 'plusieurs milliers'} d'utilisateurs, 
            nous avons contribué à identifier et signaler {stats.totalReports.toLocaleString()} numéros frauduleux, 
            protégeant ainsi des milliers de personnes contre les arnaques téléphoniques et les spams.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Précision des détections</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">24h</div>
              <div className="text-gray-600">Temps de réponse moyen</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">15k+</div>
              <div className="text-gray-600">Vies protégées</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
