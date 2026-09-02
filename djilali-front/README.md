# Portfolio Djilali

Ce projet est un portfolio dynamique développé avec **React (Vite)** pour l'interface utilisateur (Frontend) et **Sanity CMS** pour la gestion de contenu (Backend/Studio).

## 🚀 Comment lancer le projet en local

Pour travailler sur ce projet, vous devez lancer **deux terminaux** simultanément : un pour le site web, et un autre pour le panneau d'administration.

### Étape 1 : Lancer le site web (Frontend)

C'est l'interface visible par les visiteurs du site.

1. Ouvrez un terminal.
2. Naviguez vers le dossier racine du projet (là où se trouve ce fichier README).
3. Installez les dépendances (si ce n'est pas déjà fait) :
   ```bash
   npm install
   ```
4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```
5. Le site sera accessible à l'adresse : **http://localhost:5173**

### Étape 2 : Lancer le Studio d'administration (Sanity)

C'est l'interface qui vous permet d'ajouter, modifier ou supprimer du contenu (articles, vidéos, livres, etc.).

1. Ouvrez un **deuxième** terminal.
2. Naviguez vers le sous-dossier de Sanity :
   ```bash
   cd studio-djilali-portfolio
   ```
3. Installez les dépendances (si ce n'est pas déjà fait) :
   ```bash
   npm install
   ```
4. Lancez le studio :
   ```bash
   npm run dev
   ```
5. Le studio sera accessible à l'adresse : **http://localhost:3333**

---

## 📂 Structure du projet

- `/src` : Contient tout le code React du site web (composants, pages, styles css).
  - `/src/sanity` : Contient la configuration pour se connecter à la base de données Sanity.
- `/studio-djilali-portfolio` : Contient tout le code de l'administration Sanity (backend).
  - `/schemaTypes` : C'est ici que sont définis les modèles de données (Biographies, Articles, Livres, Paramètres du site, etc.).

## 📧 Formulaire de Contact

Le formulaire de contact utilise **Web3Forms**. 
Pour l'activer, vous devez générer une clé d'accès (Access Key) sur [web3forms.com](https://web3forms.com) (en utilisant `localhost` ou votre vrai nom de domaine) et coller cette clé dans le panneau d'administration Sanity, dans le document **Paramètres du site**.
