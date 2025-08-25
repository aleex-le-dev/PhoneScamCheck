import { useState } from 'react';
import { FaPhone, FaSearch, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import { TrueCallerService } from '../services/truecallerService';

const TrueCallerTest = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testTrueCaller = async () => {
    if (!phoneNumber || phoneNumber.length < 8) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await TrueCallerService.checkPhoneNumber(phoneNumber);

      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Erreur lors du test TrueCaller');
    } finally {
      setLoading(false);
    }
  };

  const getResultIcon = (category) => {
    switch (category) {
      case 'scam':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'spam':
        return <FaExclamationTriangle className="text-orange-500" />;
      case 'suspicious':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'safe':
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const getResultColor = (category) => {
    switch (category) {
      case 'scam':
        return 'bg-red-50 border-red-200';
      case 'spam':
        return 'bg-orange-50 border-orange-200';
      case 'suspicious':
        return 'bg-yellow-50 border-yellow-200';
      case 'safe':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-orange-600 bg-orange-100';
      case 'low':
        return 'text-yellow-600 bg-yellow-100';
      case 'none':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'high':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          🧪 Test du Service TrueCaller
        </h2>
        <p className="text-lg text-gray-600">
          Vérification du service TrueCaller non-officiel intégré
        </p>
      </div>

      {/* Formulaire de test */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de téléphone à tester
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+33123456789"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={testTrueCaller}
              disabled={loading || !phoneNumber}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Test en cours...
                </>
              ) : (
                <>
                  <FaSearch />
                  Tester TrueCaller
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Résultats du test */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <FaTimesCircle />
            <span className="font-medium">Erreur :</span>
            {error}
          </div>
        </div>
      )}

      {result && (
        <div className={`p-6 border rounded-lg ${getResultColor(result.reputation.category)}`}>
          <div className="flex items-center gap-3 mb-4">
            {getResultIcon(result.reputation.category)}
            <h3 className="text-xl font-semibold text-gray-800">
              Résultat du test TrueCaller
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations de base */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Informations de base</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Numéro :</span>
                  <span className="font-medium">{result.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pays :</span>
                  <span className="font-medium">{result.countryCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type :</span>
                  <span className="font-medium capitalize">{result.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Opérateur :</span>
                  <span className="font-medium">{result.carrier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nom :</span>
                  <span className="font-medium">{result.name}</span>
                </div>
              </div>
            </div>

            {/* Localisation */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Localisation</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ville :</span>
                  <span className="font-medium">{result.address.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuseau horaire :</span>
                  <span className="font-medium">{result.address.timezone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dernière mise à jour :</span>
                  <span className="font-medium">
                    {new Date(result.lastUpdated).toLocaleString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Réputation et sécurité */}
          <div className="mt-6 p-4 bg-white rounded-lg border">
            <h4 className="font-medium text-gray-700 mb-3">Analyse de réputation</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(result.reputation.riskLevel)}`}>
                  {result.reputation.riskLevel.toUpperCase()}
                </div>
                <p className="text-xs text-gray-500 mt-1">Niveau de risque</p>
              </div>
              <div className="text-center">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(result.reputation.confidence)}`}>
                  {result.reputation.confidence.toUpperCase()}
                </div>
                <p className="text-xs text-gray-500 mt-1">Confiance</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{result.reputation.spamScore}</div>
                <p className="text-xs text-gray-500">Score spam</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{result.reputation.scamReports}</div>
                <p className="text-xs text-gray-500">Signalements</p>
              </div>
            </div>
          </div>

          {/* Source des données */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Source : <span className="font-medium">{result.source}</span>
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">💡 Comment tester :</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Entrez un numéro français (ex: +33123456789)</li>
          <li>• Les numéros avec "123456789" sont marqués comme arnaques</li>
          <li>• Les numéros avec "000" ou "111" sont marqués comme spam</li>
          <li>• Les autres numéros reçoivent un score aléatoire bas</li>
        </ul>
      </div>
    </div>
  );
};

export default TrueCallerTest;
