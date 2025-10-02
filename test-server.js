const http = require('http');

console.log('🔍 Testing server connection...');

const req = http.get('http://localhost:3001', (res) => {
  console.log(`✅ Server responded with status: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`📄 Response length: ${data.length} characters`);
    console.log(`📝 First 200 characters:`, data.substring(0, 200));
  });
});

req.on('error', (err) => {
  console.error('❌ Error connecting to server:', err.message);
});

req.setTimeout(10000, () => {
  console.error('❌ Request timed out');
  req.destroy();
});
