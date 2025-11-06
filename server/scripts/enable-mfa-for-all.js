import mongoose from 'mongoose';
import dotenv from 'dotenv';
import speakeasy from 'speakeasy';
import User from '../models/User.js';

dotenv.config();

const enableMfaForAll = async () => {
  try {
    console.log('🔐 Enabling MFA for All Users...\n');
    
    // Connect to database
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    // Get all users
    const users = await User.find({});
    console.log(`👥 Found ${users.length} users\n`);

    let enabled = 0;

    for (const user of users) {
      console.log(`🔐 Enabling MFA for: ${user.name} (${user.email})`);
      
      // Generate MFA secret if not exists
      if (!user.mfaSecret) {
        const secret = speakeasy.generateSecret({
          name: `HR Management (${user.email})`,
          length: 32
        });
        user.mfaSecret = secret.base32;
        console.log(`   ✅ Generated MFA secret`);
      }

      // Enable MFA
      if (!user.isMfaSetup) {
        user.isMfaSetup = true;
        console.log(`   ✅ MFA enabled`);
        enabled++;
      } else {
        console.log(`   ℹ️  MFA already enabled`);
      }

      await user.save();
      console.log('');
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log(`✅ Enabled MFA for ${enabled} users`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n⚠️  IMPORTANT: MFA is now REQUIRED for all users\n');
    console.log('📱 Users will need to:');
    console.log('   1. Login with email and password');
    console.log('   2. Scan QR code with authenticator app');
    console.log('   3. Enter 6-digit verification code\n');
    console.log('🔓 Development Bypass:');
    console.log('   - Use code "123456" to bypass MFA in development mode\n');
    console.log('📧 Alternative Login Methods:');
    console.log('   - Email verification (request code via email)');
    console.log('   - CAPTCHA verification (reset MFA)');
    console.log('   - Recovery codes (if previously saved)\n');
    console.log('═══════════════════════════════════════════════════════');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

enableMfaForAll();
