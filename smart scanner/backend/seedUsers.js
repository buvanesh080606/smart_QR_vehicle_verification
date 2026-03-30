import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    
    const ownerExists = await User.findOne({ email: 'owner@demo.com' });
    if (!ownerExists) {
        await User.create({
            name: 'Demo Owner',
            email: 'owner@demo.com',
            password: 'password123',
            role: 'owner'
        });
        console.log('Created Demo Owner');
    }

    const policeExists = await User.findOne({ email: 'police@demo.com' });
    if (!policeExists) {
        await User.create({
            name: 'Officer John',
            email: 'police@demo.com',
            password: 'password123',
            role: 'police'
        });
        console.log('Created Demo Police');
    }

    console.log('Dummy accounts ready via scripting!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
