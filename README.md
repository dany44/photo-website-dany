# 📸 Photo Gallery - Projet Full Stack  

**Photo Gallery** est une application complète de gestion et d'affichage d'albums photos, conçue pour exposer mes clichés de voyage de manière simple et authentique. Ce projet Full Stack intègre un **backend en Node.js/Express** et un **frontend en React**, déployé sur **Railway (backend)** et **Netlify (frontend)**, avec **MongoDB Atlas** pour la base de données.  

> **Note :** L'utilisation de solutions de stockage comme **Cloudinary** ou **AWS S3** est optionnelle (configurable via la variable `STORAGE_MODE`). Des **liens signés** sont générés (pour AWS) afin de faciliter une transition si nécessaire.  

---

## 📑 Table des Matières  
1. [Introduction 👋](#-introduction-)  
2. [Fonctionnalités 🚀](#-fonctionnalités-)  
3. [Technologies Utilisées 💻](#-technologies-utilisées-)  
4. [📌 Architecture du Projet](#-architecture-du-projet-)  
5. [Conclusion 🏁](#-conclusion-)  

---

## 👋 Introduction  
**Photo Gallery** est une application **Full Stack** qui me permet de gérer et d'afficher mes albums photos. J'ai conçu ce projet pour :  
✅ Présenter mes photos de voyage.  
✅ Disposer d'un **espace administrateur sécurisé** pour gérer le contenu.  

---

## 🚀 Fonctionnalités  

### 📂 Backend (API REST)  
- **Gestion des albums** : Création, modification, suppression et association de photos.  
- **Gestion des photos** : Upload, suppression, mise à jour et génération de liens sécurisés.  
- **Authentification sécurisée** : JWT & cookies pour l'accès aux routes protégées.  
- **Stockage flexible** : Local, AWS S3 ou Cloudinary (via `STORAGE_MODE`).  
- **Logs centralisés** : Winston avec rotation quotidienne pour un suivi fiable.  

### 🎨 Frontend (React)  
- **Galerie dynamique** : Mode **masonry** et **carrousel**.  
- **Upload de photos** : Interface intuitive.  
- **Espace admin** : Connexion sécurisée, gestion des albums et photos.  
- **Responsive & Dark Mode** : UI moderne avec Tailwind CSS.  
- **Gestion d'état** : React Context & React Query (cache persistant).  

---

## 💻 Technologies Utilisées  

### 🖥️ Backend  
- **Node.js + Express.js**  
- **MongoDB Atlas (Mongoose)**  
- **JWT + Cookies** (authentification)  
- **Cloudinary / AWS S3** (upload & stockage d'images)  
- **Winston + Daily Rotate File** (logs)  
- **Multer** (upload fichiers)  
- **Sécurité** : Helmet, express-mongo-sanitize, Rate Limiting  

### 🌐 Frontend  
- **React + React Router**  
- **Axios** (requêtes API)  
- **Tailwind CSS** (UI)  
- **React Context & React Query** (@tanstack/react-query-persist-client)  

---

## 📌 Architecture du Projet  

```
photo-gallery/
├── backend/                  # API Node.js (Express, MongoDB Atlas)
│   ├── src/
│   │   ├── config/           # Configuration, logs & variables d'environnement
│   │   ├── controllers/      # Logique métier (albums, photos, auth)
│   │   ├── middlewares/      # Auth, validation, rate limiting, etc.
│   │   ├── models/           # Schémas de données (Album, Photo)
│   │   ├── routes/           # Endpoints de l'API
│   │   ├── uploads/          # Stockage local des images (si utilisé)
│   │   ├── app.js            # Point d'entrée Express
│   │   └── server.js         # Démarrage du serveur HTTP
│   ├── .env.example          # Exemple de config
│   ├── package.json          # Dépendances backend
│   ├── Dockerfile            # Conteneurisation backend
│   ├── tests/                # Tests unitaires & intégration
│   ├── logs/                 # Fichiers de logs rotatifs
│
├── frontend/                 # Interface React
│   ├── src/
│   │   ├── api/              # Appels API (auth, albums, photos)
│   │   ├── components/       # Composants réutilisables
│   │   ├── context/          # Gestion d'état global (AuthContext)
│   │   ├── hooks/            # Hooks personnalisés
│   │   ├── pages/            # Pages principales (Home, Admin, About, Login)
│   │   ├── routes/           # React Router
│   │   ├── App.jsx           # Point d'entrée React
│   │   ├── index.js          # Initialisation & persistance cache
│   │   ├── index.css         # Styles globaux
│   ├── .env.example          # Exemple de config frontend
│   ├── package.json          # Dépendances frontend
│   ├── Dockerfile            # Conteneurisation frontend
│   ├── public/               # Assets statiques
│   ├── README.md             # Documentation frontend
│   ├── vite.config.js        # Config Vite.js
│
├── .github/workflows/        # Pipelines CI/CD
│   ├── backend-ci.yml        # CI/CD backend
│   ├── frontend-ci.yml       # CI/CD frontend
│   └── deploy.yml            # Déploiement Railway & Netlify
│
├── .gitignore                # Ignore fichiers sensibles (.env, logs, etc.)
├── README.md                 # Documentation globale
└── package.json              # Dépendances globales (si monorepo)
```
