import { useState } from 'react';
import { FaBars, FaTimes, FaShieldAlt } from 'react-icons/fa';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <FaShieldAlt className="text-2xl text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-800">PhoneScamCheck</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-600 hover:text-blue-600 transition-colors">
              Accueil
            </a>
            <a href="#stats" className="text-gray-600 hover:text-blue-600 transition-colors">
              Statistiques
            </a>
            <a href="#apis" className="text-gray-600 hover:text-blue-600 transition-colors">
              Sources de données
            </a>
            <a href="#check" className="text-gray-600 hover:text-blue-600 transition-colors">
              Vérifications
            </a>
            <a href="#report" className="text-gray-600 hover:text-blue-600 transition-colors">
              Signaler
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <a
                href="#home"
                onClick={closeMenu}
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                Accueil
              </a>
              <a
                href="#stats"
                onClick={closeMenu}
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                Statistiques
              </a>
              <a
                href="#apis"
                onClick={closeMenu}
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                Sources de données
              </a>
              <a
                href="#check"
                onClick={closeMenu}
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                Vérifications
              </a>
              <a
                href="#report"
                onClick={closeMenu}
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                Signaler
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
