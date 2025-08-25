import { useState } from 'react';
import { FaExclamationTriangle, FaEnvelope, FaShieldAlt, FaPaperPlane } from 'react-icons/fa';

const ReportForm = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    type: 'spam',
    description: '',
    personalExperience: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phoneNumber || !formData.description) return;
    
    setIsSubmitting(true);
    
    // Simulation d'envoi
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        phoneNumber: '',
        type: 'spam',
        description: '',
        personalExperience: ''
      });
      
      // Reset après 3 secondes
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 text-center">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Signalement envoyé !
        </h3>
        <p className="text-gray-600">
          Merci pour votre contribution. Votre signalement aide à protéger la communauté.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
      <div className="flex items-center mb-6">
        <FaExclamationTriangle className="text-2xl text-red-600 mr-3" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Signaler un numéro
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de téléphone *
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="+33 6 12 34 56 78"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de problème *
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="spam">Spam / Appels non sollicités</option>
            <option value="scam">Arnaque / Fraude</option>
            <option value="harassment">Harcèlement</option>
            <option value="other">Autre</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description du problème *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Décrivez brièvement ce qui s'est passé..."
            required
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Votre expérience (optionnel)
          </label>
          <textarea
            name="personalExperience"
            value={formData.personalExperience}
            onChange={handleInputChange}
            placeholder="Partagez plus de détails sur votre expérience..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <FaShieldAlt className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Votre signalement est confidentiel</p>
              <p>Nous ne partageons jamais vos informations personnelles. Votre contribution aide à protéger toute la communauté.</p>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !formData.phoneNumber || !formData.description}
          className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Envoi en cours...
            </>
          ) : (
            <>
              <FaPaperPlane className="mr-2" />
              Envoyer le signalement
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
