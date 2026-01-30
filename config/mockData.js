const mockProducts = [
    // New Laptops
    {
        _id: "mock-new-1",
        name: "Dell XPS 15",
        brand: "Dell",
        category: "New Laptops",
        price: 185000,
        description: "High performance laptop with 4K display and i9 processor.",
        stock: 10,
        images: ["https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/gray/notebook-xps-15-9530-gray-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=668&qlt=100,1&resMode=sharp2&size=668,402&chrss=full"],
        specs: ["i9 13th Gen", "32GB RAM", "1TB SSD", "RTX 4060"],
        condition: "New",
        createdAt: new Date().toISOString(),
        featured: true
    },
    {
        _id: "mock-new-2",
        name: "MacBook Air M2",
        brand: "Apple",
        category: "New Laptops",
        price: 115000,
        description: "Supercharged by M2 chip. Amazingly thin and light.",
        stock: 15,
        images: ["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084309702"],
        specs: ["M2 Chip", "8GB RAM", "256GB SSD"],
        condition: "New",
        createdAt: new Date().toISOString(),
        featured: true
    },
    {
        _id: "mock-new-3",
        name: "HP Spectre x360",
        brand: "HP",
        category: "New Laptops",
        price: 145000,
        description: "Convertible laptop with stunning design and performance.",
        stock: 8,
        images: ["https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08495631.png"],
        specs: ["i7 13th Gen", "16GB RAM", "512GB SSD", "Touchscreen"],
        condition: "New",
        createdAt: new Date().toISOString()
    },

    // Used Laptops
    {
        _id: "mock-used-1",
        name: "Lenovo ThinkPad T480 (Refurbished)",
        brand: "Lenovo",
        category: "Used Laptops",
        price: 25000,
        description: "Business workhorse. Reliable and durable.",
        stock: 20,
        images: ["https://www.lenovo.com/medias/lenovo-laptop-thinkpad-t480-hero.png?context=bWFzdGVyfHJvb3R8MjUyNTl8aW1hZ2UvcG5nfGhkMy9oZDMvOTYxNDY2NjA4MDI4Ni5wbmd8M2IyYzQxZDY0MzYxM2Y2ZDM4YzQxZDY0MzYxM2Y2ZDM4"],
        specs: ["i5 8th Gen", "8GB RAM", "256GB SSD"],
        condition: "Used",
        createdAt: new Date().toISOString()
    },
    {
        _id: "mock-used-2",
        name: "Dell Latitude 7490",
        brand: "Dell",
        category: "Used Laptops",
        price: 22000,
        description: "Premium business ultrabook. Lightweight and powerful.",
        stock: 12,
        images: ["https://i.dell.com/sites/csimages/Video_Imagery/all/latitude-7490-video-still.jpg"],
        specs: ["i5 8th Gen", "16GB RAM", "512GB SSD"],
        condition: "Used",
        createdAt: new Date().toISOString()
    },

    // Accessories
    {
        _id: "mock-acc-1",
        name: "Logitech MX Master 3S",
        brand: "Logitech",
        category: "Accessories",
        price: 8999,
        description: "Performance wireless mouse.",
        stock: 50,
        images: ["https://resource.logitech.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-mouse-top-black.png?v=1"],
        specs: ["Wireless", "Ergonomic", "8K DPI"],
        condition: "New",
        createdAt: new Date().toISOString(),
        featured: true
    },
    {
        _id: "mock-acc-2",
        name: "Keychron K2 Mechanical Keyboard",
        brand: "Keychron",
        category: "Accessories",
        price: 7500,
        description: "Wireless mechanical keyboard for Mac and Windows.",
        stock: 30,
        images: ["https://keychron.in/wp-content/uploads/2021/05/Keychron-K2-Wireless-Mechanical-Keyboard-Frame-A-1.jpg"],
        specs: ["RGB", "Brown Switch", "Bluetooth"],
        condition: "New",
        createdAt: new Date().toISOString()
    },

    // Networking & CCTV
    {
        _id: "mock-net-1",
        name: "Hikvision 4K CCTV Camera",
        brand: "Hikvision",
        category: "Networking & CCTV",
        price: 4500,
        description: "High resolution security camera with night vision.",
        stock: 25,
        images: ["https://www.hikvision.com/content/dam/hikvision/products/IP-Products/Network-Cameras/Pro-Series/EasyIP-3-0/DS-2CD2085G1-I/DS-2CD2085G1-I.png"],
        specs: ["8MP", "Night Vision", "IP67"],
        condition: "New",
        createdAt: new Date().toISOString()
    },
    {
        _id: "mock-net-2",
        name: "TP-Link Archer AX55 Router",
        brand: "TP-Link",
        category: "Networking & CCTV",
        price: 6500,
        description: "Dual-band Gigabit Wi-Fi 6 Router.",
        stock: 15,
        images: ["https://static.tp-link.com/upload/product-overview/2021/202110/20211019/Archer-AX55-01.png"],
        specs: ["Wi-Fi 6", "AX3000", "Dual Band"],
        condition: "New",
        createdAt: new Date().toISOString()
    }
];

const mockOrders = [
    {
        _id: "mock-order-1",
        user: "admin-override-id",
        items: [
            {
                product: {
                    _id: "mock-new-1",
                    name: "Dell XPS 15",
                    price: 185000,
                    images: ["https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/gray/notebook-xps-15-9530-gray-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=668&qlt=100,1&resMode=sharp2&size=668,402&chrss=full"]
                },
                quantity: 1
            },
            {
                product: {
                    _id: "mock-acc-1",
                    name: "Logitech MX Master 3S",
                    price: 8999,
                    images: ["https://resource.logitech.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-mouse-top-black.png?v=1"]
                },
                quantity: 2
            }
        ],
        totalAmount: 202998,
        status: "Delivered",
        address: {
            addressLine1: "123 Tech Park, OMR",
            city: "Chennai",
            state: "Tamil Nadu",
            pincode: "600001"
        },
        paymentMethod: "UPI",
        trackingId: "TRK-MOCK-888",
        trackingHistory: [
            { status: "Order Placed", date: new Date(Date.now() - 86400000 * 3).toISOString() },
            { status: "Processing", date: new Date(Date.now() - 86400000 * 2).toISOString() },
            { status: "Shipped", date: new Date(Date.now() - 86400000 * 1).toISOString() },
            { status: "Delivered", date: new Date().toISOString() }
        ],
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    }
];

module.exports = { mockProducts, mockOrders };
