# 📱 PhoneScamCheck - Détecteur d'Arnaques Téléphoniques

> **Site à la Have I Been Pwned" pour vérifier si un numéro de téléphone est signalé comme spam/arnaque**

[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🚀 **Concept**

PhoneScamCheck est un site web qui permet aux utilisateurs de vérifier si un numéro de téléphone est signalé comme spam ou arnaque. Inspiré de "Have I Been Pwned", il combine :

- **Vérification multi-sources** : Base locale + APIs externes
- **Crowdsourcing** : Les visiteurs signalent eux-mêmes les numéros suspects
- **Analyse automatique** : Détection de patterns suspects
- **Interface moderne** : Design responsive et intuitif

## ✨ **Fonctionnalités Principales**

### 🔍 **Vérification de Numéros**
- **Recherche instantanée** par numéro de téléphone
- **Validation française** (+33 ou 0XXXXXXXXX)
- **Résultats détaillés** avec niveau de risque et confiance
- **Sources multiples** : Base locale + APIs externes

### 📊 **Statistiques en Temps Réel**
- **Nombre total** de signalements
- **Répartition** arnaques vs spam
- **Top catégories** d'arnaque
- **Utilisateurs actifs** et vérifications du jour

### 🚨 **Signalement Communautaire**
- **Formulaire de signalement** pour nouveaux numéros
- **Catégorisation** automatique (support technique, bancaire, etc.)
- **Enrichissement** de la base de données
- **Validation** des signalements

### 🔧 **APIs Intégrées**
- **NumVerify** : Validation des numéros (gratuit)
- **OpenCNAM** : Réputation téléphonique
- **ScamAlert.fr** : Base française des arnaques
- **TrueCaller** : Service de réputation (simulé)
- **Analyse automatique** des patterns suspects

## 🛠️ **Technologies Utilisées**

- **Frontend** : React 18 + Vite
- **Styling** : Tailwind CSS
- **Icons** : React Icons (FontAwesome)
- **Architecture** : Services modulaires + composants React
- **Environnement** : Variables d'environnement Vite

## 📁 **Structure du Projet**

```
PhoneScamCheck/
├── src/
│   ├── components/          # Composants React
│   │   ├── PhoneChecker.jsx     # Vérification principale
│   │   ├── Navigation.jsx       # Navigation responsive
│   │   ├── Stats.jsx            # Statistiques temps réel
│   │   ├── RecentReports.jsx    # Rapports récents
│   │   ├── ReportForm.jsx       # Formulaire signalement
│   │   ├── APISources.jsx       # Statut des APIs
│   │   └── TrueCallerTest.jsx   # Test du service TrueCaller
│   ├── services/            # Services métier
│   │   ├── phoneCheckService.js  # Service principal
│   │   ├── externalAPIs.js       # Intégration APIs externes
│   │   └── truecallerService.js  # Service TrueCaller
│   ├── data/                # Données statiques
│   │   └── phoneDatabase.js      # Base de données locale
│   ├── App.jsx              # Application principale
│   └── main.jsx             # Point d'entrée
├── .env                     # Variables d'environnement
├── .env.example            # Exemple de configuration
└── README.md               # Ce fichier
```

## 🚀 **Installation et Démarrage**

### **Prérequis**
- Node.js 18+ 
- npm ou yarn

### **Installation**
```bash
# Cloner le projet
git clone https://github.com/username/PhoneScamCheck.git
cd PhoneScamCheck

# Installer les dépendances
npm install

# Copier la configuration
cp .env.example .env

# Configurer les clés API (optionnel)
# Éditer .env avec tes vraies clés
```

### **Configuration des APIs**
```env
# 🔑 NUMVERIFY (Gratuit - 100 requêtes/jour)
VITE_NUMVERIFY_KEY=ta_cle_ici

# 🔑 SCAMALERT.FR (Communautaire)
VITE_SCAMALERT_ENABLED=true

# 🔑 TRUECALLER (Payant)
VITE_TRUECALLER_KEY=ta_cle_ici

# 🔑 WHOCALLEDME (Payant)
VITE_WHOCALLEDME_KEY=ta_cle_ici
```

### **Démarrage**
```bash
# Mode développement
npm run dev

# Ouvrir http://localhost:5173
```

## 🧪 **Test des Fonctionnalités**

### **Numéros de Test**
- **`+33123456789`** → Marqué comme **SPAM** (démarchage SFR/Orange)
- **`0568482050`** → Marqué comme **SPAM** (signalé par utilisateur)
- **`+33612345678`** → Marqué comme **ARNAQUE** (support technique Microsoft)
- **`+33612345677`** → Marqué comme **ARNAQUE** (fausse facture EDF)

### **Composant de Test TrueCaller**
- **Localisation** : Section "Test du Service TrueCaller"
- **Fonctionnalités** : Vérification, analyse de réputation, patterns
- **Données** : Noms, villes, opérateurs français réalistes

## 🔒 **Sécurité et Confidentialité**

- **Aucune donnée personnelle** stockée
- **Chiffrement** des communications API
- **Validation** des entrées utilisateur
- **Rate limiting** sur les APIs externes
- **Logs anonymisés** pour le debugging

## 📈 **Roadmap et Évolutions**

### **Phase 1** ✅ (Terminé)
- [x] Interface utilisateur React + Tailwind
- [x] Base de données locale communautaire
- [x] Intégration APIs externes
- [x] Service TrueCaller simulé
- [x] Système de signalement

### **Phase 2** 🚧 (En cours)
- [ ] API REST pour développeurs
- [ ] Base de données PostgreSQL
- [ ] Authentification utilisateurs
- [ ] Notifications push

### **Phase 3** 📋 (Prévu)
- [ ] Application mobile React Native
- [ ] Intégration blockchain pour la transparence
- [ ] Intelligence artificielle pour la détection
- [ ] Partenariats avec opérateurs

## 💰 **Modèle Économique**

- **API payante** pour professionnels (call centers, opérateurs)
- **Abonnement premium** avec alertes SMS
- **Publicité** ciblée (non intrusive)
- **Données enrichies** pour entreprises

## 🤝 **Contribuer**

### **Comment Aider**
1. **Signaler** des numéros spam/arnaque
2. **Tester** les nouvelles fonctionnalités
3. **Soumettre** des améliorations via Issues
4. **Partager** le site pour plus de données

### **Développement**
```bash
# Fork le projet
# Créer une branche feature
git checkout -b feature/nouvelle-fonctionnalite

# Commiter les changements
git commit -m "Ajout: nouvelle fonctionnalité"

# Pousser et créer Pull Request
git push origin feature/nouvelle-fonctionnalite
```
