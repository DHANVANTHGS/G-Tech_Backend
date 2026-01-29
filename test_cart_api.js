const API_URL = 'http://localhost:5000/api';

const email = 'test@example.com';
const password = 'password123';

async function testCart() {
    try {
        // 1. Login
        console.log('Logging in...');
        let token;
        let loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mail: email, password: password })
        });

        let data = await loginRes.json();

        if (!loginRes.ok) {
            console.log('Login failed, trying to register...');
            const regRes = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mail: email,
                    password: password,
                    name: 'Test User',
                    mobileno: '1234567890'
                })
            });
            data = await regRes.json();
            console.log('Registration response:', data);
        }

        token = data.token;
        if (!token) {
            console.error('Failed to get token:', data);
            return;
        }
        console.log('Token received.');

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // 2. Add to Cart
        console.log('Adding to cart...');
        // Fetch products
        const prodRes = await fetch(`${API_URL}/product`);
        const prodData = await prodRes.json();
        const products = prodData.products || prodData;

        if (!products || products.length === 0) {
            console.error('No products found to add to cart.');
            return;
        }
        const productId = products[0]._id || products[0].id;
        console.log(`Adding product ${productId} to cart...`);

        const addRes = await fetch(`${API_URL}/cart/add`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ productId: productId, quantity: 1 })
        });
        console.log('Add to cart response:', await addRes.json());

        // 3. Get Cart
        console.log('Fetching cart...');
        const getRes = await fetch(`${API_URL}/cart`, { headers });
        console.log('Get cart response:', JSON.stringify(await getRes.json(), null, 2));

        // 4. Remove from Cart
        console.log('Removing from cart...');
        const remRes = await fetch(`${API_URL}/cart/remove`, {
            method: 'DELETE',
            headers,
            body: JSON.stringify({ productId: productId })
        });
        console.log('Remove from cart response:', await remRes.json());

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testCart();
