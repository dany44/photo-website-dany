# README pour le Backend du Projet : Site Professionnel de Photographie

---

## **Introduction**
Ce projet est un **backend API RESTful** pour un site web professionnel de photographie. Il permet :
1. Aux visiteurs de consulter une galerie de photos via des liens sécurisés.
2. À l'administrateur d'ajouter, modifier et supprimer des photos via une interface sécurisée.
3. De gérer les photos en local ou sur AWS S3, en fonction du mode choisi (développement ou production).

Ce backend est conçu pour être **modulaire**, **sécurisé**, et facilement extensible. Il est optimisé pour une architecture **cloud-native** tout en restant accessible en local.

---

## **Fonctionnalités Principales**
1. **Gestion des Photos** :
   - Ajout, suppression, et mise à jour des métadonnées des photos (titre, description).
   - Stockage des photos localement ou dans un bucket AWS S3.
   - Génération de liens pré-signés pour sécuriser l'accès aux photos hébergées sur S3.

2. **Authentification** :
   - Sécurisation des routes sensibles (ajout, suppression, mise à jour) via JSON Web Tokens (JWT).

3. **Logs et Monitoring** :
   - Système de logs centralisé avec différents niveaux (info, warn, error, debug).
   - Logs écrits dans un fichier `application.log` pour faciliter le suivi en production.

4. **Configuration Centralisée** :
   - Toutes les configurations (MongoDB, AWS, logs) sont gérées via une classe `Config` pour simplifier l'accès et la gestion.

---

## **Architecture**
Le backend suit une architecture **modèle-service-contrôleur** :

- **Modèles (`models`)** :
  - Définit les schémas de la base de données avec Mongoose (MongoDB).
  - Exemple : Modèle `Photo` pour gérer les métadonnées des photos.

- **Contrôleurs (`controllers`)** :
  - Contient toute la logique métier.
  - Exemple : `photoController` gère les opérations CRUD pour les photos.

- **Middlewares (`middlewares`)** :
  - Gèrent les aspects transversaux comme l'authentification et le traitement des fichiers (Multer).

- **Routes (`routes`)** :
  - Définit les endpoints exposés à l’API.

- **Configuration (`config`)** :
  - Classe `Config` centralise la gestion des logs, de la connexion MongoDB, et du client AWS S3.

---

## **Configuration**
### **Variables d’Environnement**
Les variables d'environnement sont essentielles pour la flexibilité et la sécurité du projet. Ajoutez-les dans un fichier `.env` à la racine du projet :

```env
NODE_ENV=development
STORAGE_MODE=local
AWS_BUCKET_NAME=nom-du-bucket
AWS_REGION=region-du-bucket
AWS_ACCESS_KEY_ID=cle-aws
AWS_SECRET_ACCESS_KEY=cle-secrete-aws
MONGO_URI=uri-mongodb
JWT_SECRET=super-secret-key
LOG_LEVEL=info
```

### **Modes de Stockage**
1. **Mode Local (`STORAGE_MODE=local`)** :
   - Les photos sont stockées dans un dossier local (`uploads/`).
2. **Mode AWS (`STORAGE_MODE=aws`)** :
   - Les photos sont envoyées dans un bucket S3 avec des liens pré-signés pour un accès sécurisé.

---

## **Endpoints de l’API**
### **Authentification**
- **POST `/photos/login`**
  - Authentifie un utilisateur administrateur et retourne un token JWT.
  - **Payload** :
    ```json
    {
      "username": "admin",
      "password": "password123"
    }
    ```
  - **Réponse** :
    ```json
    {
      "token": "jwt-token"
    }
    ```

### **Photos**
- **GET `/photos`**
  - Retourne toutes les photos avec des liens sécurisés.
  - **Réponse** :
    ```json
    [
      {
        "title": "Photo 1",
        "description": "Description de la photo",
        "signedUrl": "https://..."
      }
    ]
    ```

- **POST `/photos/upload`** (protégé par JWT)
  - Ajoute une photo (titre, description, image).
  - **Headers** :
    ```json
    {
      "Authorization": "Bearer jwt-token"
    }
    ```
  - **Payload** (form-data) :
    - `title`: Titre de la photo.
    - `description`: Description de la photo.
    - `image`: Fichier image.
  - **Réponse** :
    ```json
    {
      "message": "Photo téléchargée avec succès.",
      "photo": {
        "title": "Titre",
        "description": "Description",
        "imagePath": "chemin-ou-lien-de-la-photo"
      }
    }
    ```

- **DELETE `/photos/:id`** (protégé par JWT)
  - Supprime une photo à partir de son ID.
  - **Headers** :
    ```json
    {
      "Authorization": "Bearer jwt-token"
    }
    ```
  - **Réponse** :
    ```json
    {
      "message": "Photo supprimée avec succès."
    }
    ```

- **PUT `/photos/:id`** (protégé par JWT)
  - Met à jour le titre ou la description d'une photo.
  - **Payload** :
    ```json
    {
      "title": "Nouveau Titre",
      "description": "Nouvelle Description"
    }
    ```
  - **Réponse** :
    ```json
    {
      "message": "Photo mise à jour avec succès."
    }
    ```

---

## **Installation et Exécution**
### **Prérequis**
- **Node.js** : Version 14 ou supérieure.
- **MongoDB** : Utilisation de MongoDB Atlas pour le cloud ou d’une instance locale.
- **AWS S3** (si mode production).

### **Étapes**
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/photo-gallery-backend.git
   cd photo-gallery-backend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez le fichier `.env`.

4. Lancez le projet :
   ```bash
   npm start
   ```

5. Accédez à l'API sur `http://localhost:3000`.

---

## **Améliorations Futures**
- Implémenter une base de données pour les utilisateurs (remplacer les identifiants hardcodés).
- Ajouter des tests unitaires et d'intégration.
- Utiliser un CDN pour accélérer le chargement des photos.
- Intégrer un système de pagination pour les photos.

---

## **Structure des Dossiers**
```
photo-gallery-backend/
├── config/                # Gestion centralisée des configurations
├── controllers/           # Logique métier
├── middlewares/           # Gestion des middlewares (authentification, upload)
├── models/                # Schémas Mongoose
├── routes/                # Définition des routes
├── uploads/               # Dossier de stockage local (en mode développement)
├── application.log        # Fichier de logs
├── .env                   # Variables d'environnement
└── app.js                 # Point d'entrée de l'application
```

---

## **Conclusion**
Ce backend est conçu pour offrir une gestion professionnelle des photos, avec une flexibilité maximale pour le développement et la production. Sa structure modulaire, ses logs avancés, et ses configurations centralisées en font une solution robuste pour des projets à échelle variable.

Si vous avez des questions ou souhaitez contribuer, n’hésitez pas à me contacter via [mon GitLab](https://gitlab.com/dany44). 😊