# Guide pour Ajouter les Vidéos de Formation

## 📁 Structure Recommandée

### Option 1 : Vidéos Locales (Stockage sur le serveur)

Placez vos vidéos dans : `/backend/public/videos/`

```
backend/
  └── public/
      └── videos/
          ├── module1-introduction.mp4
          ├── module2-techniques-vente.mp4
          ├── module3-prise-parole.mp4
          └── thumbnails/ (optionnel)
              ├── module1-thumb.jpg
              ├── module2-thumb.jpg
              └── module3-thumb.jpg
```

### Option 2 : URLs Externes (Recommandé pour la production)

Utilisez des services comme :
- **YouTube** (vidéos non listées ou privées)
- **Vimeo**
- **AWS S3** / **Cloudinary**
- **Autres CDN**

## 🎬 Comment Ajouter des Formations avec Vidéos

### Méthode 1 : Via le Script (Recommandé)

1. **Placez vos vidéos** dans `backend/public/videos/`

2. **Éditez le script** `backend/scripts/addFormation.js` :
   ```javascript
   const formations = [
     {
       title: "Module 1 : Introduction à la Négociation",
       description: "Apprenez les bases fondamentales...",
       videoUrl: "/uploads/videos/module1-introduction.mp4", // URL locale
       thumbnailUrl: "/uploads/videos/thumbnails/module1-thumb.jpg", // Optionnel
       duration: 450, // Durée en secondes
       module: 1,
       order: 1,
     },
     // Ajoutez d'autres formations...
   ];
   ```

3. **Lancez le script** :
   ```bash
   cd backend
   node scripts/addFormation.js
   ```

### Méthode 2 : Via l'API Admin (Interface Web)

1. Connectez-vous en tant qu'admin
2. Allez sur `/admin/dashboard`
3. Utilisez l'API pour créer des formations

### Méthode 3 : Via l'API directement

```bash
curl -X POST http://localhost:5000/api/formations \
  -H "Authorization: Bearer VOTRE_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Module 1 : Introduction",
    "description": "Description...",
    "videoUrl": "/uploads/videos/module1.mp4",
    "thumbnailUrl": "/uploads/videos/thumbnails/module1.jpg",
    "duration": 450,
    "module": 1,
    "order": 1
  }'
```

## 📝 Format des URLs Vidéo

### Pour des vidéos locales :
```
videoUrl: "/uploads/videos/nom-du-fichier.mp4"
```

### Pour YouTube (vidéo non listée) :
```
videoUrl: "https://www.youtube.com/embed/VIDEO_ID"
```

### Pour Vimeo :
```
videoUrl: "https://player.vimeo.com/video/VIDEO_ID"
```

### Pour AWS S3 / Cloudinary :
```
videoUrl: "https://votre-bucket.s3.amazonaws.com/videos/module1.mp4"
```

## 🔧 Configuration du Lecteur Vidéo

Le lecteur vidéo actuel ouvre les vidéos dans un nouvel onglet. Pour intégrer un lecteur vidéo :

### Option A : Utiliser un iframe (YouTube, Vimeo)
Le code actuel dans `Video.jsx` ouvre dans un nouvel onglet. Pour intégrer un lecteur, modifiez la section vidéo.

### Option B : Lecteur HTML5 (pour vidéos locales ou directes)
```jsx
<video 
  controls 
  className="w-100 rounded-4"
  poster={formation.thumbnailUrl}
>
  <source src={formation.videoUrl} type="video/mp4" />
  Votre navigateur ne supporte pas la lecture de vidéos.
</video>
```

## ✅ Vérification

1. Vérifiez que les vidéos sont accessibles :
   ```bash
   # Testez l'URL
   curl http://localhost:5000/uploads/videos/module1.mp4
   ```

2. Vérifiez les formations créées :
   ```bash
   cd backend
   node scripts/listFormations.js
   ```

## 🎯 Système de Commentaires

✅ **Le système de commentaires est DÉJÀ fonctionnel !**

Les clients peuvent :
- ✅ Ajouter des commentaires/questions sur chaque vidéo
- ✅ Voir les commentaires des autres clients
- ✅ Voir les réponses des administrateurs

Les administrateurs peuvent :
- ✅ Voir tous les commentaires
- ✅ Répondre aux commentaires (via l'API `/api/comments/:id/reply`)

## 📌 Recommandations

1. **Pour le développement** : Utilisez des vidéos locales dans `backend/public/videos/`
2. **Pour la production** : Utilisez un service de CDN (YouTube, Vimeo, AWS S3, Cloudinary)
3. **Taille des fichiers** : Optimisez vos vidéos (compression MP4 recommandée)
4. **Thumbnails** : Créez des miniatures pour améliorer l'expérience utilisateur

## 🔐 Sécurité

- Les vidéos dans `public/` sont accessibles publiquement
- Pour protéger les vidéos, utilisez un middleware d'authentification
- Ou hébergez les vidéos sur un service avec authentification


