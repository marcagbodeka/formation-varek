import { networkInterfaces } from 'os';

const nets = networkInterfaces();
const results = {};

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    // Ignorer les interfaces non IPv4 et internes (localhost)
    if (net.family === 'IPv4' && !net.internal) {
      if (!results[name]) {
        results[name] = [];
      }
      results[name].push(net.address);
    }
  }
}

console.log('\n🌐 Adresses IP de cette machine sur le réseau :\n');
console.log('Pour accéder au site depuis d\'autres appareils, utilisez :\n');

for (const name of Object.keys(results)) {
  results[name].forEach(ip => {
    console.log(`   Frontend: http://${ip}:5173`);
    console.log(`   Backend:  http://${ip}:5000\n`);
  });
}

console.log('💡 Assurez-vous que votre pare-feu autorise ces ports\n');

