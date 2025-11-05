#!/bin/bash

echo "🚀 Démarrage des serveurs pour l'accès réseau..."
echo ""

# Obtenir l'IP de la machine
IP=$(hostname -I | awk '{print $1}')

echo "📡 Adresse IP de cette machine: $IP"
echo ""
echo "🌐 URLs d'accès:"
echo "   Frontend: http://$IP:5173"
echo "   Backend:  http://$IP:5000"
echo ""
echo "💡 Pour accéder depuis d'autres appareils du même réseau,"
echo "   utilisez ces URLs avec l'IP ci-dessus"
echo ""
echo "⚠️  Assurez-vous que votre pare-feu autorise les ports 5000 et 5173"
echo ""
echo "Démarrage en cours..."
echo ""

# Démarrer le backend en arrière-plan
cd backend
npm run dev &
BACKEND_PID=$!

# Attendre un peu
sleep 2

# Démarrer le frontend
cd ../site-formation
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Serveurs démarrés!"
echo "   Backend PID:  $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "Pour arrêter les serveurs, utilisez: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Attendre que les processus se terminent
wait

