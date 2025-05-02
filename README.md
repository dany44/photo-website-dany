# 📸 Mon site photo — Albums & Blog

Bienvenue sur le dépôt de mon site personnel. Il s’agit d’un projet **fullstack (Node.js + React)** qui me permet de **partager mes photos** via des **albums organisés** et de publier des **articles**. J’y présente mes randonnées, mes voyages et mon regard photographique.

---

# 🚀 Fonctionnalités principales

### 📷 Portfolio
- **Albums dynamiques** avec couverture, description et galerie intégrée
- **Upload d’images** avec titre, description et attribution à un album
- **Galerie publique** avec vue masonry ou slider

### ✍️ Blog
- Support des **articles Markdown** uploadés via interface
- Ajout optionnel d’une **image de couverture**
- **Rendu enrichi** (tableaux, images, blockquotes…) grâce à `react-markdown`

### 🔐 Authentification
- Connexion sécurisée par **JWT**
- Interface conditionnelle selon rôle (public / admin)
- Redirection automatique vers /login si session expirée

### 🛠️ Admin complet
- Upload / suppression de photos
- Création / édition / suppression d’albums
- Gestion des articles markdown

---

# 🧠 Stack technique

### Backend (Node.js v22.12.0)
- Express.js + MongoDB (Mongoose)
- Authentification JWT (stockée en HTTP-only cookie)
- Sécurité : Helmet, CORS dynamique, mongo-sanitize
- Logger : Winston avec timestamp & niveau
- Markdown parsing pour les articles
- Uploads supportés : Local, AWS S3, ou Cloudinary
- Structure MVC (controllers, middlewares, validations, modèles)

### Frontend (React)
- React + React Router DOM
- React Query + cache local persisté (avec localStorage)
- React Markdown (blog), React Slick (carrousel), Framer Motion
- Architecture modulaire : pages / composants / hooks
- `AuthContext` pour la gestion centralisée de l’état auth
- Interface responsive, dark mode par défaut

### CI & Environnement
- Variable `STORAGE_MODE` (local / s3 / cloudinary)
- Variables .env côté serveur et côté client
- CORS dynamique en fonction de `FRONTEND_URL`

---

# 🌍 Exemple de `.env` côté backend

```
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
MONGO_URI=...
JWT_SECRET=...
FRONTEND_URL=http://localhost:3001

STORAGE_MODE=local

# AWS
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=eu-north-1
AWS_BUCKET_NAME=...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Admin
ADMIN_HASHED_PASSWORD=...

# Contact (email)
GMAIL_USER=...
GMAIL_PASSWORD=...
```

# 🌍 Exemple de `.env` côté frontend

```
REACT_APP_API_URL=...

```

---

# 📁 Architecture simplifiée

```
backend/
  ├── config/              # Initialisation Mongo, S3, Cloudinary, Winston
  ├── controllers/         # Logique métier (photos, albums, articles…)
  ├── middlewares/         # Auth, error, logger, CORS
  ├── models/              # Mongoose schemas
  ├── routes/              # Routes express
  ├── services/            # Abstractions Cloudinary / S3 / Local
  └── utils/               # Markdown, date, regex…

frontend/
  ├── components/          # Forms, gallery, admin, layout
  ├── context/             # Auth context (JWT)
  ├── hooks/               # React Query (photos, albums, articles…)
  ├── pages/               # Home, Album, Blog, Admin, Contact, About
  └── styles/              # Tailwind + custom CSS
```

---

# ✅ Améliorations prévues

- Ajout d’un système de **tags** pour les photos
- **Recherche** ou filtrage par lieux / sujets
- Section “carnet de voyage” avec cartes interactives (Leaflet)
- Internationalisation (FR / EN)
- Tests unitaires avec Jest côté front et back

---

# ✅ Lancement local

### Prérequis :
- Node.js >= 18 (utilisé : 22.12.0)
- MongoDB Atlas ou local
- Créer un `.env` côté backend

### Lancer le backend
```bash
cd backend
npm install
npm start
```

### Lancer le frontend
```bash
cd frontend
npm install
npm start
```

---

# ✒️ À propos

Développé par [Dany Khadhar](https://danykhadhar.fr)