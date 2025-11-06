import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const fixAllLoginIssues = async () => {
  try {
    console.log('🔧 Fixing All Login Issues...\n');
    
    // Connect to database
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    // Get all users
    const users = await User.find({});
    console.log(`👥 Found ${users.length} users\n`);

    let fixed = 0;

    for (const user of users) {
      console.log(`🔧 Fixing: ${user.name} (${user.email})`);
      
      let changes = [];

      // Reset MFA for easier login
      if (user.isMfaSetup) {
        user.isMfaSetup = false;
        user.mfaSecret = null;
        changes.push('MFA disabled');
      }

      // Reset login attempts
      if (user.loginAttempts > 0) {
        user.loginAttempts = 0;
        changes.push('Login attempts reset');
      }

      // Remove account lock
      if (user.lockUntil) {
        user.lockUntil = null;
        changes.push('Account unlocked');
      }

      // Ensure account is active
      if (!user.isActive) {
        user.isActive = true;
        changes.push('Account activated');
      }

      if (changes.length > 0) {
        await user.save();
        console.log(`   ✅ Fixed: ${changes.join(', ')}`);
        fixed++;
      } else {
        console.log(`   ℹ️  No changes needed`);
      }
      console.log('');
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log(`✅ Fixed ${fixed} users`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n📝 Login Credentials:\n');
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Password: Check with admin or use "admin123" for admin`);
      console.log('');
    });

    console.log('═══════════════════════════════════════════════════════');
    console.log('🎉 All login issues fixed!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n⚠️  MFA has been disabled for all users');
    console.log('   Users can now login without MFA codes');
    console.log('   They can re-enable MFA from their profile settings\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

fixAllLoginIssues();
