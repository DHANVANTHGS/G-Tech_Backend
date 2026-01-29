const { db } = require('./config/config');

async function seedProducts() {
    const products = [
        {
            name: "Dell XPS 13",
            brand: "Dell",
            category: "New Laptops",
            condition: "New",
            price: 99900,
            stock: 10,
            description: "13-inch laptop with InfinityEdge display.",
            images: ["https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9315/media-gallery/notebook-xps-9315-blue-gallery-3.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=606&qlt=100,1&resMode=sharp2&size=606,402&chrss=full"],
            specs: ["i7 12th Gen", "16GB RAM", "512GB SSD"],
            featured: true,
            createdAt: new Date().toISOString()
        },
        {
            name: "MacBook Air M2",
            brand: "Apple",
            category: "New Laptops",
            condition: "New",
            price: 114900,
            stock: 15,
            description: "Supercharged by M2 chip.",
            images: ["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665"],
            specs: ["M2 Chip", "8GB RAM", "256GB SSD"],
            featured: true,
            createdAt: new Date().toISOString()
        },
        {
            name: "HP Spectre x360",
            brand: "HP",
            category: "New Laptops",
            condition: "New",
            price: 129000,
            stock: 5,
            description: "2-in-1 Laptop with touchscreen.",
            images: ["https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08491547.png"],
            specs: ["i7 13th Gen", "16GB RAM", "1TB SSD"],
            featured: false,
            createdAt: new Date().toISOString()
        },
        {
            name: "Logitech MX Master 3S",
            brand: "Logitech",
            category: "Accessories",
            condition: "New",
            price: 9995,
            stock: 50,
            description: "Performance Wireless Mouse.",
            images: ["https://resource.logitech.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-mouse-top-view-graphite.png?v=1"],
            specs: ["8000 DPI", "Quiet Clicks"],
            featured: false,
            createdAt: new Date().toISOString()
        },
        {
            name: "Refurbished Lenovo ThinkPad T480",
            brand: "Lenovo",
            category: "Used Laptops",
            condition: "Used",
            price: 25000,
            stock: 20,
            description: "Reliable business laptop.",
            images: ["https://www.lenovo.com/medias/lenovo-laptop-thinkpad-t480-hero.png?context=bWFzdGVyfHJvb3R8MjUyNTl8aW1hZ2UvcG5nfGhkMy9oZDMvOTYxNDY2NjA4MDI4Ni5wbmd8M2IyYzQxZDY0MzYxM2Y2ZDM4YzQxZDY0MzYxM2Y2ZDM4"],
            specs: ["i5 8th Gen", "8GB RAM", "256GB SSD"],
            featured: true,
            createdAt: new Date().toISOString()
        }
    ];

    try {
        const batch = db.batch();
        const productsRef = db.collection('products');

        products.forEach(product => {
            const docRef = productsRef.doc(); // Generate new ID
            batch.set(docRef, product);
        });

        await batch.commit();
        console.log(`✅ Successfully seeded ${products.length} products.`);

    } catch (error) {
        console.error('❌ Error seeding products:', error);
    } finally {
        process.exit(0);
    }
}

seedProducts();
