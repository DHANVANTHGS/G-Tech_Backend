const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/product',
    method: 'GET',
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            console.log('KEYS:', Object.keys(parsed));
            console.log('IsArray:', Array.isArray(parsed));
        } catch (e) {
            console.error('Error:', e.message);
        }
    });
});
req.on('error', (e) => console.error(e));
req.end();
