import { FaExclamationTriangle, FaEnvelope, FaShieldAlt } from 'react-icons/fa';

const RecentReports = () => {
  // Données simulées des derniers signalements
  const recentReports = [
    {
      id: 1,
      phoneNumber: '+33 6 12 34 56 78',
      type: 'scam',
      description: 'Arnaque au support technique Microsoft',
      timestamp: 'Il y a 2 heures',
      reports: 15
    },
    {
      id: 2,
      phoneNumber: '+33 1 23 45 67 89',
      type: 'spam',
      description: 'Appels automatisés de démarchage',
      timestamp: 'Il y a 4 heures',
      reports: 8
    },
    {
      id: 3,
      phoneNumber: '+33 6 98 76 54 32',
      type: 'scam',
      description: 'Fausse facture d\'électricité',
      timestamp: 'Il y a 6 heures',
      reports: 23
    },
    {
      id: 4,
      phoneNumber: '+33 1 98 76 54 32',
      type: 'spam',
      description: 'SMS publicitaires non sollicités',
      timestamp: 'Il y a 8 heures',
      reports: 12
    },
    {
      id: 5,
      phoneNumber: '+33 6 11 22 33 44',
      type: 'scam',
      description: 'Arnaque à la carte bancaire',
      timestamp: 'Il y a 12 heures',
      reports: 31
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'scam':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'spam':
        return <FaEnvelope className="text-orange-500" />;
      default:
        return <FaShieldAlt className="text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'scam':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'spam':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'scam':
        return 'Arnaque';
      case 'spam':
        return 'Spam';
      default:
        return 'Autre';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
      <div className="flex items-center mb-6">
        <FaShieldAlt className="text-2xl text-blue-600 mr-3" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Derniers signalements
        </h2>
      </div>
      
      <div className="space-y-4">
        {recentReports.map((report) => (
          <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getTypeIcon(report.type)}
                  <span className="font-semibold text-gray-800 text-lg">
                    {report.phoneNumber}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(report.type)}`}>
                    {getTypeText(report.type)}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-2">
                  {report.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{report.timestamp}</span>
                  <span>•</span>
                  <span>{report.reports} signalements</span>
                </div>
              </div>
              
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                Signaler
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-6">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Voir tous les signalements
        </button>
      </div>
    </div>
  );
};

export default RecentReports;
