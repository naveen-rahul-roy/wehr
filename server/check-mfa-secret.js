import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkMFASecret() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const adminUser = await User.findOne({ email: 'admin@hrms.com' });
    if (adminUser) {
      console.log('👤 Admin user found:');
      console.log('   Name:', adminUser.name);
      console.log('   Email:', adminUser.email);
      console.log('   MFA Setup:', adminUser.isMfaSetup);
      console.log('   MFA Secret:', adminUser.mfaSecret);
    } else {
      console.log('❌ Admin user not found');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkMFASecret();