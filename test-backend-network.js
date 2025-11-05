import http from 'http';

const IP = process.argv[2] || '0.0.0.0';
const PORT = 5000;

const options = {
  hostname: IP === '0.0.0.0' ? 'localhost' : IP,
  port: PORT,
  path: '/',
  method: 'GET',
};

const req = http.request(options, (res) => {
  console.log(`✅ Backend accessible sur ${IP}:${PORT}`);
  console.log(`   Status: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(`   Réponse: ${data.substring(0, 50)}...`);
  });
});

req.on('error', (e) => {
  console.error(`❌ Erreur de connexion: ${e.message}`);
  console.log(`💡 Assurez-vous que le backend est démarré sur le port ${PORT}`);
});

req.end();

