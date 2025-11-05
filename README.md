# Formation Varek - Plateforme de Formation en Ligne

Plateforme de formation en ligne avec authentification pour clients et administrateurs.

## 🚀 Fonctionnalités

- **Authentification** :
  - Clients : Connexion par code d'accès unique
  - Administrateurs : Connexion par numéro de téléphone et mot de passe
  
- **Gestion des formations** :
  - Liste des formations disponibles
  - Lecteur vidéo pour chaque formation
  - Questions de compréhension
  - Système de commentaires/questions anonymes
  
- **Espace administrateur** :
  - Gestion des utilisateurs (clients)
  - Création de nouveaux clients avec génération automatique de code d'accès
  - Réinitialisation des codes d'accès
  - Gestion des formations (CRUD)
  - Réponses aux commentaires des clients

## 📁 Structure du Projet

```
formation-varek/
├── backend/           # API Node.js/Express
│   ├── config/       # Configuration MongoDB
│   ├── controllers/  # Contrôleurs API
│   ├── models/       # Modèles Mongoose
│   ├── routes/        # Routes API
│   ├── middleware/   # Middlewares (auth)
│   └── server.js     # Point d'entrée serveur
│
└── site-formation/   # Frontend React/Vite
    └── src/
        ├── components/  # Composants React
        ├── pages/       # Pages de l'application
        ├── context/     # Contextes React (Auth)
        └── styles/      # Styles CSS
```

## 🔧 Installation

### Backend

1. Naviguez vers le dossier backend :
```bash
cd backend
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à partir de `.env.example` :
```bash
cp .env.example .env
```

4. Configurez les variables d'environnement dans `.env` :
   - `MONGODB_URI` : URL de connexion MongoDB
   - `PORT` : Port du serveur (défaut: 5000)
   - `JWT_SECRET` : Secret pour les tokens JWT

5. Démarrez le serveur :
```bash
npm run dev
```

Le serveur sera accessible sur `http://localhost:5000`

### Frontend

1. Naviguez vers le dossier site-formation :
```bash
cd site-formation
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à partir de `.env.example` :
```bash
cp .env.example .env
```

4. Configurez `VITE_API_URL` dans `.env` (par défaut: `http://localhost:5000/api`)

5. Démarrez le serveur de développement :
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📝 Création du premier administrateur

Pour créer le premier administrateur, utilisez l'endpoint API :

```bash
curl -X POST http://localhost:5000/api/users/admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "country": "TG",
    "phone": "90000000",
    "password": "motdepasse123"
  }'
```

## 🎯 Routes API

### Authentification
- `POST /api/auth/admin/login` - Connexion admin
- `POST /api/auth/client/login` - Connexion client

### Utilisateurs (Admin uniquement)
- `GET /api/users` - Liste tous les clients
- `POST /api/users/client` - Créer un client
- `PUT /api/users/client/:id/reset` - Réinitialiser le code d'accès

### Formations
- `GET /api/formations` - Liste toutes les formations (protégé)
- `GET /api/formations/:id` - Détails d'une formation (protégé)
- `POST /api/formations` - Créer une formation (admin)
- `PUT /api/formations/:id` - Modifier une formation (admin)
- `DELETE /api/formations/:id` - Supprimer une formation (admin)

### Commentaires
- `GET /api/comments/:id` - Liste les commentaires d'une formation (protégé)
- `POST /api/comments` - Ajouter un commentaire (protégé)
- `PUT /api/comments/:id/reply` - Répondre à un commentaire (admin)

## 🔐 Sécurité

- Authentification JWT
- Hashage des mots de passe avec bcrypt
- Protection des routes sensibles
- Séparation des rôles (admin/client)

## 🛠️ Technologies Utilisées

**Backend:**
- Node.js
- Express.js
- MongoDB / Mongoose
- JWT
- bcryptjs

**Frontend:**
- React 19
- React Router
- Axios
- Bootstrap
- Vite

## 📄 Licence

ISC


