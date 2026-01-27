const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./model/User');
const Product = require('./model/Product');
const connect = require('./config/config');

dotenv.config();

const seedData = async () => {
    try {
        await connect();
        console.log('Connected to MongoDB');

        // Clear existing data (optional - comment out if you want to keep existing data)
        // await User.deleteMany({});
        // await Product.deleteMany({});
        // console.log('Cleared existing data');

        // Hash password
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create Users
        const users = [
            {
                name: 'Admin User',
                mail: 'admin@example.com',
                password: hashedPassword,
                role: 'admin',
                mobileno: 1234567890,
                gender: 'Male',
                address: ['123 Admin St, Tech City']
            },
            {
                name: 'John Doe',
                mail: 'john@example.com',
                password: hashedPassword,
                role: 'user',
                mobileno: 9876543210,
                gender: 'Male',
                address: ['456 User Lane, Tech City']
            }
        ];

        for (const user of users) {
            const existingUser = await User.findOne({ mail: user.mail });
            if (!existingUser) {
                await User.create(user);
                console.log(`Created user: ${user.name}`);
            } else {
                console.log(`User already exists: ${user.name}`);
            }
        }

        // Create Products
        const products = [
            {
                name: 'Laptop Pro X',
                price: 1200,
                description: 'High performance laptop for professionals.',
                category: 'Laptops',
                stock: 50,
                cashOnDelivery: true
            },
            {
                name: 'Smartphone Z',
                price: 800,
                description: 'Latest smartphone with amazing camera.',
                category: 'Mobiles',
                stock: 100,
                cashOnDelivery: true
            },
            {
                name: 'Wireless Headphones',
                price: 150,
                description: 'Noise cancelling wireless headphones.',
                category: 'Accessories',
                stock: 200,
                cashOnDelivery: false
            },
            {
                name: 'Gaming Mouse',
                price: 50,
                description: 'RGB gaming mouse with high DPI.',
                category: 'Accessories',
                stock: 150,
                cashOnDelivery: true
            },
            {
                name: '4K Monitor',
                price: 300,
                description: '27-inch 4K UHD monitor.',
                category: 'Monitors',
                stock: 30,
                cashOnDelivery: false
            }
        ];

        for (const product of products) {
            // Check if product exists by name to avoid duplicates on re-run
            const existingProduct = await Product.findOne({ name: product.name });
            if (!existingProduct) {
                await Product.create(product);
                console.log(`Created product: ${product.name}`);
            } else {
                console.log(`Product already exists: ${product.name}`);
            }
        }

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
