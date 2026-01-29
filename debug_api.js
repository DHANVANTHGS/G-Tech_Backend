const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/product',
    method: 'GET',
};

const req = http.request(options, (res) => {
    let data = '';

    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            console.log('Response Structure Keys:', Object.keys(parsed));
            if (parsed.products) {
                console.log(`Number of Products: ${parsed.products.length}`);
                if (parsed.products.length > 0) {
                    console.log('Sample Product:', JSON.stringify(parsed.products[0], null, 2));
                }
            } else {
                console.log('Raw Response:', data.substring(0, 500));
            }
        } catch (e) {
            console.error('Error parsing JSON:', e);
            console.log('Raw Data:', data);
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
