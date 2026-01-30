const mockProducts = [
    {
        _id: 'mock-1',
        name: 'Dell XPS 13 Plus',
        category: 'New Laptops',
        condition: 'New',
        price: 135000,
        description: '13.4-inch UHD+ Touch, 12th Gen Intel Core i7, 16GB RAM, 1TB SSD',
        images: ['https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9320/media-gallery/xs-9320-nt-blue-gallery-3.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=668&qlt=100,1&resMode=sharp2&size=668,402&chrss=full'],
        brand: 'Dell',
        location: 'Chennai',
        createdAt: new Date().toISOString(),
        specs: ['Intel Core i7', '16GB RAM', '1TB SSD', 'Windows 11'],
        featured: true
    },
    {
        _id: 'mock-2',
        name: 'MacBook Air M2',
        category: 'New Laptops',
        condition: 'New',
        price: 114900,
        description: 'Apple M2 chip with 8-core CPU and 8-core GPU, 8GB Unified Memory, 256GB SSD Storage',
        images: ['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665'],
        brand: 'Apple',
        location: 'Chennai',
        createdAt: new Date().toISOString(),
        specs: ['M2 Chip', '8GB RAM', '256GB SSD', 'macOS'],
        featured: true
    },
    {
        _id: 'mock-3',
        name: 'HP Pavilion 15',
        category: 'Used Laptops',
        condition: 'Used',
        price: 45000,
        description: 'AMD Ryzen 5 Hexa Core, 8GB RAM, 512GB SSD, 15.6 inch FHD Display',
        images: ['https://m.media-amazon.com/images/I/710a2KkYlLL._SL1500_.jpg'],
        brand: 'HP',
        location: 'Coimbatore',
        createdAt: new Date().toISOString(),
        specs: ['AMD Ryzen 5', '8GB RAM', '512GB SSD', 'Windows 10'],
        featured: false
    }
];

const mockOrders = [
    {
        _id: 'ord-mock-001',
        user: 'admin-override-id',
        items: [{
            product: {
                _id: 'mock-1',
                name: 'Dell XPS 13 Plus',
                price: 135000,
                images: ['https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9320/media-gallery/xs-9320-nt-blue-gallery-3.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=668&qlt=100,1&resMode=sharp2&size=668,402&chrss=full']
            },
            quantity: 1,
            price: 135000
        }],
        totalAmount: 135000,
        status: 'Processing',
        address: '123 Fake Street, Chennai',
        createdAt: new Date().toISOString(),
        trackingId: 'TRK123456789'
    }
];

module.exports = { mockProducts, mockOrders };
