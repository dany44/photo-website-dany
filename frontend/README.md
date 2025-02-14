# Photography Frontend Documentation

## **Introduction**
Bienvenue sur le frontend de mon Site Professionnel de Photographie ! Ce projet, développé avec **React**. Il propose une galerie pour les visiteurs et une interface d'administration sécurisée pour gérer les photos. Une intégration fluide avec un backend **API RESTful** assure une expérience utilisateur optimale.

---

## **Fonctionnalités Principales**

### **Authentification**
- **Connexion Admin** : Accès sécurisé pour les administrateurs.
- **Gestion des Tokens** : Sécurisation avec **JWT** pour les routes sensibles.

### **Gestion des Photos**
- **Visualisation** : Galerie avec mise en page **Masonry**.
- **Ajout de Photos** : Téléchargement via un formulaire intuitif.
- **Suppression** : Suppression directe depuis la galerie (pour les administrateurs).

### **Navigation et Layout**
- **Sidebar Rétractable** : Accès facile aux sections principales.
- **Routes Dynamiques** : Navigation fluide avec **React Router**.

### **Performance et Sécurité**
- **Axios Interceptors** : Sécurisation des requêtes API avec gestion automatique des tokens.
- **Gestion des Erreurs** : Feedback clair en cas de problème.

---

## **Architecture et Structure du Projet**

```
PHOTOGRAPHY-FRONTEND/
├── src/
    ├── api/
        ├── auth.js
        ├── axiosInstance.js
        ├── photos.js
    ├── components/
        ├── common/
        ├── forms/
            ├── AddPhotoForm.jsx
            ├── LoginForm.jsx
        ├── gallery/
            ├── PhotoGallery.jsx
        ├── layout/
            ├── Sidebar.jsx
    ├── context/
        ├── AuthContext.jsx
    ├── hooks/
    ├── pages/
        ├── Admin/
            ├── AdminPage.jsx
        ├── Home/
            ├── HomePage.jsx
        ├── Login/
            ├── LoginPage.jsx
    ├── routes/
        ├── AppRoutes.jsx
    ├── styles/
    ├── App.jsx
    ├── App.test.js
    ├── index.css
    ├── index.js
```

- **`api/`** : Appels API pour l’authentification et la gestion des photos.
- **`components/`** : Composants réutilisables.
- **`context/`** : Gestion globale de l'authentification.
- **`pages/`** : Pages principales (Accueil, Admin, Connexion).
- **`routes/`** : Gestion centralisée des routes.
- **`styles/`** : Fichiers de styles personnalisés.
- **`App.jsx`** : Composant racine.
- **`index.js`** : Point d’entrée de l’application.

---

## **Installation et Configuration**

### **Prérequis**
- **Node.js** : Version 14 ou supérieure.
- **npm** ou **yarn** : Gestionnaire de paquets.

### **Étapes d’Installation**

1. **Cloner le Dépôt :**
   ```bash
   git clone https://github.com/dany44/photo-gallery-frontend.git
   cd photo-gallery-frontend
   ```

2. **Installer les Dépendances :**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configurer les Variables d’Environnement :**
   Créez un fichier `.env` et ajoutez :
   ```
   REACT_APP_API_URL=http://localhost:3000
   ```

4. **Démarrer l’Application :**
   ```bash
   npm start
   # ou
   yarn start
   ```

Accédez à l'application sur `http://localhost:3000`.

---

## **Utilisation**

### **Connexion Admin**
- Accédez à la page **Connexion** via la sidebar.
- Identifiants par défaut :
  - **Username** : `admin`
  - **Password** : `password123`
- Après connexion, accès à la page Admin pour gérer les photos.

### **Gestion des Photos**
- **Ajouter une Photo :**
  - Remplir le formulaire (titre, description, image) dans la page Admin.
  - Cliquez sur **Ajouter** pour soumettre.
- **Supprimer une Photo :**
  - Cliquez sur le bouton **Suppr** sous chaque photo (Admin uniquement).

### **Navigation**
- **Accueil** : Galerie pour les visiteurs.
- **Admin** : Gestion des photos (Admin uniquement).
- **Connexion** : Page pour administrateurs.

---

## **Détails Techniques**

### **API**
- **`auth.js`** : Authentification (connexion).
- **`photos.js`** : Gestion des photos (récupération, ajout, suppression).
- **`axiosInstance.js`** : Instance Axios avec **interceptor JWT**.

### **Context**
- **`AuthContext.jsx`** : Stockage et gestion du JWT, méthodes de connexion/déconnexion.

### **Composants Principaux**
- **`AddPhotoForm.jsx`** : Formulaire d’ajout de photos.
- **`LoginForm.jsx`** : Formulaire de connexion.
- **`PhotoGallery.jsx`** : Galerie avec pagination et options pour administrateurs.
- **`Sidebar.jsx`** : Barre latérale rétractable.

### **Pages**
- **`AdminPage.jsx`** : Interface pour la gestion des photos.
- **`HomePage.jsx`** : Galerie publique.
- **`LoginPage.jsx`** : Formulaire de connexion.

### **Routes**
- **`AppRoutes.jsx`** : Routes définissant l'accès et les protections.

---

## **Améliorations Futures**
1. **Gestion des Utilisateurs** : Rôles et permissions.
2. **Tests Unitaires et d'Intégration** : Garantir la fiabilité.
3. **Optimisation des Images** : Utilisation d’un **CDN** ou d’outils.
4. **Pagination Avancée** : Amélioration UX (scroll infini).
5. **Mise à Jour des Photos** : Modifier les métadonnées existantes.
6. **Notifications et Feedbacks** : Meilleur retour utilisateur.
7. **Sécurité Renforcée** : Vérification des rôles, anti-CSRF.

---

## **Dépendances Principales**
- **React** : Construction de l'interface utilisateur.
- **React Router Dom** : Gestion des routes.
- **Axios** : Requêtes API.
- **Tailwind CSS** : Styling rapide et adaptatif.
- **React Icons** : Icônes modernes et accessibles.

---

## **Contact**
**Auteur** : Dany Khadhar  
**GitLab** : [https://gitlab.com/dany44](https://gitlab.com/dany44)  
