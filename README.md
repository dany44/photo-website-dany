# Photo Gallery - Projet Full Stack (Backend & Frontend)

## **📌 Introduction**
Bienvenue sur **Photo Gallery**, une application complète permettant de gérer et afficher des albums photos.
Ce projet est une **solution Full Stack** développée en **Node.js (backend) et React (frontend)** avec une infrastructure prête pour le déploiement sur Kubernetes.

🔹 **Backend** : API REST avec **Express, MongoDB, JWT, AWS S3** (optionnel) 📦  
🔹 **Frontend** : Interface utilisateur avec **React, React Router, Tailwind CSS** 🎨  
🔹 **Déploiement** : Conteneurisé avec **Docker**, orchestré avec **Kubernetes (EKS)** et optimisé pour **CI/CD**.  

---

## **📌 Fonctionnalités**

### 🔹 **Backend (API REST)**
✅ Gestion des albums : Création, modification, suppression 📂  
✅ Gestion des photos : Upload, suppression, génération de liens sécurisés 🔗  
✅ Authentification sécurisée avec **JWT** 🔑  
✅ Stockage flexible **Local / AWS S3** ☁️  
✅ Logs centralisés et sécurisés 📊  
✅ Pagination et sécurisation des requêtes 🔄  

### 🔹 **Frontend (React)**
✅ Galerie photo avec affichage dynamique 🎨  
✅ Upload de photos et gestion des albums 🖼️  
✅ Connexion admin et gestion des droits 🔐  
✅ Responsive & Dark Mode 🌙  

---

## **📌 Technologies Utilisées**

### **Backend** 🖥️
- **Node.js** avec **Express.js** 🚀
- **MongoDB** avec **Mongoose** 🗄️
- **AWS S3** pour le stockage des photos ☁️
- **Winston** pour la gestion des logs 📜
- **Multer** pour l'upload de fichiers 📂
- **JWT** pour l'authentification 🔐

### **Frontend** 🎨
- **React** avec **React Router** 🔄
- **Axios** pour les appels API 📡
- **Tailwind CSS** pour le style 💅
- **React Context API** pour la gestion globale ⚡

### **DevOps & Déploiement** ⚙️
- **Docker & Kubernetes (EKS)** ☸️
- **GitHub Actions (CI/CD)** 🔄
- **Terraform** pour provisionner l'infrastructure ☁️

---

## **📌 Architecture du Projet**

```
photo-gallery/
├── backend/                  # API Node.js (Express, MongoDB)
│   ├── src/
│   │   ├── config/           # Configuration et logs
│   │   ├── controllers/      # Logique métier
│   │   ├── middlewares/      # Authentification, validation
│   │   ├── models/           # Modèles de données MongoDB
│   │   ├── routes/           # Définition des endpoints API
│   │   ├── uploads/          # Stockage local des images
│   │   ├── app.js            # Point d'entrée Express
│   │   └── server.js         # Serveur HTTP
│   ├── .env.example          # Variables d'environnement
│   ├── package.json          # Dépendances du backend
│   ├── Dockerfile            # Conteneurisation backend
│   ├── README.md             # Documentation backend
│   ├── tests/                # Tests unitaires
│   ├── application.log       # Fichier de logs
│   ├── terraform/            # Infrastructure as Code (AWS, Kubernetes)
│
├── frontend/                 # Interface utilisateur React
│   ├── src/
│   │   ├── api/              # Gestion des appels API
│   │   ├── components/       # Composants React
│   │   ├── context/          # Gestion de l'état global
│   │   ├── pages/            # Pages principales
│   │   ├── routes/           # Configuration React Router
│   │   ├── App.jsx           # Point d'entrée React
│   │   ├── index.js          # Initialisation React
│   │   ├── index.css         # Styles globaux
│   ├── .env.example          # Variables d'environnement
│   ├── package.json          # Dépendances du frontend
│   ├── Dockerfile            # Conteneurisation frontend
│   ├── public/               # Fichiers statiques
│   ├── README.md             # Documentation frontend
│   ├── vite.config.js        # Configuration Vite.js
│
├── .github/workflows/        # Pipelines CI/CD
│   ├── backend-ci.yml        # CI/CD Backend
│   ├── frontend-ci.yml       # CI/CD Frontend
│   ├── deploy.yml            # Déploiement Kubernetes (EKS)
│
├── .gitignore                # Ignorer les fichiers sensibles
├── README.md                 # Documentation globale
├── kubernetes/               # Fichiers de configuration Kubernetes (manifests YAML)
├── terraform/                # Infrastructure Cloud (AWS, Kubernetes)
└── package.json              # Dépendances globales (si monorepo)
```

---

## **📌 CI/CD & Déploiement**
- **GitHub Actions** : Tests, builds et déploiement automatisé 🚀  
- **Docker** : Conteneurisation complète 🐳  
- **Kubernetes (EKS)** : Déploiement scalable ☸️  
- **Terraform** : Provisionnement AWS (EKS, S3, RDS) ☁️  
