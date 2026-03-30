import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Vehicle from './models/Vehicle.js';
import dotenv from 'dotenv';

dotenv.config();

const displayData = async () => {
  try {
    await connectDB();
    console.log('\n=============================================');
    console.log('                 USER ACCOUNTS                 ');
    console.log('=============================================');
    const users = await User.find({}).select('-password');
    console.log(JSON.stringify(users, null, 2));

    console.log('\n=============================================');
    console.log('              REGISTERED VEHICLES              ');
    console.log('=============================================');
    const vehicles = await Vehicle.find({});
    console.log(JSON.stringify(vehicles, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Error fetching data:', error);
    process.exit(1);
  }
};

displayData();
