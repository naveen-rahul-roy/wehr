import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Employee from '../models/Employee.js';

dotenv.config();

const testLogin = async () => {
  try {
    console.log('🔍 Testing Login Configuration...\n');
    
    // Connect to database
    console.log('📡 Connecting to MongoDB...');
    console.log('   URI:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    // Check users
    console.log('👥 Checking Users...');
    const users = await User.find({}).select('name email role isActive isMfaSetup');
    console.log(`   Found ${users.length} users:\n`);
    
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name}`);
      console.log(`      Email: ${user.email}`);
      console.log(`      Role: ${user.role}`);
      console.log(`      Active: ${user.isActive}`);
      console.log(`      MFA Setup: ${user.isMfaSetup}`);
      console.log('');
    });

    // Check employees
    console.log('👔 Checking Employees...');
    const employees = await Employee.find({}).select('name email currentPassword');
    console.log(`   Found ${employees.length} employees\n`);

    // Test password for first user
    if (users.length > 0) {
      const testUser = users[0];
      console.log(`🔐 Testing password for: ${testUser.email}`);
      
      const fullUser = await User.findById(testUser._id);
      
      // Try common passwords
      const testPasswords = ['admin123', 'password', 'Admin@123', '123456'];
      
      for (const pwd of testPasswords) {
        const isMatch = await fullUser.comparePassword(pwd);
        if (isMatch) {
          console.log(`   ✅ Password "${pwd}" works!`);
          break;
        } else {
          console.log(`   ❌ Password "${pwd}" doesn't work`);
        }
      }
    }

    console.log('\n✅ Test Complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testLogin();
