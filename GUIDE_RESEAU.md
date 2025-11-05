# 🌐 Guide d'Accès Réseau

## Configuration Effectuée

Le backend et le frontend sont maintenant configurés pour être accessibles sur tout le réseau local.

### Modifications apportées :

1. **Backend** (`server.js`) :
   - Écoute sur `0.0.0.0` (toutes les interfaces réseau)
   - CORS configuré pour accepter toutes les origines
   - Port : 5000 (par défaut)

2. **Frontend** (`vite.config.js`) :
   - Écoute sur `0.0.0.0`
   - Port : 5173 (par défaut)

## 🚀 Démarrage

### Option 1 : Démarrage Manuel

#### Terminal 1 - Backend :
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend :
```bash
cd site-formation
npm run dev
```

### Option 2 : Script Automatique

```bash
./start-network.sh
```

## 📡 Trouver l'Adresse IP

### Méthode 1 : Script Node.js
```bash
cd backend
npm run network-info
```

### Méthode 2 : Commande Linux
```bash
hostname -I
# ou
ip addr show | grep "inet "
```

### Méthode 3 : Windows
```cmd
ipconfig
```

## 🌐 Accès depuis d'autres Appareils

Une fois que vous avez l'IP de votre machine (exemple : `192.168.1.100`) :

### Sur le même réseau WiFi/LAN :

- **Frontend** : `http://192.168.1.100:5173`
- **Backend API** : `http://192.168.1.100:5000`

### Configuration Frontend pour le Réseau

Pour que le frontend utilise automatiquement l'IP du serveur au lieu de localhost, créez un fichier `.env` dans `site-formation/` :

```env
VITE_API_URL=http://192.168.1.100:5000/api
```

Remplacez `192.168.1.100` par l'IP réelle de votre machine.

**Astuce** : Utilisez `0.0.0.0` pour que Vite détecte automatiquement l'IP.

## 🔧 Configuration Avancée

### Changer les Ports

#### Backend :
```bash
# Dans backend/.env
PORT=5000
```

#### Frontend :
```javascript
// Dans vite.config.js
server: {
  port: 5173,
}
```

### Restreindre les Origines CORS (Production)

Dans `backend/server.js`, remplacez :
```javascript
app.use(cors({
  origin: "*", // Autoriser toutes les origines
}));
```

Par :
```javascript
app.use(cors({
  origin: ["http://votre-domaine.com", "https://votre-domaine.com"],
  credentials: true,
}));
```

## 🔥 Pare-feu

### Ubuntu/Debian :
```bash
# Autoriser le port 5000 (backend)
sudo ufw allow 5000/tcp

# Autoriser le port 5173 (frontend)
sudo ufw allow 5173/tcp

# Vérifier
sudo ufw status
```

### CentOS/RHEL :
```bash
# Autoriser le port 5000
sudo firewall-cmd --permanent --add-port=5000/tcp

# Autoriser le port 5173
sudo firewall-cmd --permanent --add-port=5173/tcp

# Recharger
sudo firewall-cmd --reload
```

### Windows :
1. Ouvrez "Pare-feu Windows Defender"
2. Cliquez sur "Paramètres avancés"
3. Créez des règles de trafic entrant pour les ports 5000 et 5173

## ✅ Vérification

1. **Testez localement** :
   ```bash
   curl http://localhost:5000
   ```

2. **Testez depuis le réseau** (remplacez par votre IP) :
   ```bash
   curl http://192.168.1.100:5000
   ```

3. **Depuis un autre appareil** :
   - Ouvrez un navigateur
   - Allez sur `http://VOTRE_IP:5173`

## 📱 Accès depuis Mobile

Sur votre téléphone (même WiFi) :
1. Notez l'IP de votre machine
2. Ouvrez le navigateur
3. Allez sur : `http://VOTRE_IP:5173`

## ⚠️ Sécurité

⚠️ **Important** : Cette configuration permet l'accès depuis tout le réseau local. Pour la production :

1. Utilisez un serveur web (nginx, Apache) comme reverse proxy
2. Activez HTTPS avec SSL/TLS
3. Restreignez les origines CORS
4. Utilisez un pare-feu pour limiter l'accès

## 🐛 Dépannage

### Le site ne charge pas depuis un autre appareil

1. Vérifiez que les deux appareils sont sur le même réseau
2. Vérifiez que le pare-feu autorise les ports
3. Vérifiez l'IP avec `hostname -I` ou `ipconfig`
4. Testez avec `curl` ou `ping` depuis l'autre appareil

### Erreur CORS

- Vérifiez que CORS autorise l'origine dans `server.js`
- Vérifiez que `VITE_API_URL` dans le frontend pointe vers la bonne URL

### Le backend ne répond pas

- Vérifiez que le serveur écoute bien sur `0.0.0.0:5000`
- Vérifiez les logs pour voir les erreurs
- Testez avec `curl http://localhost:5000` localement d'abord

