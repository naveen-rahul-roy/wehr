import mongoose from 'mongoose';
import User from './server/models/User.js';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

async function unlockUser() {
    try {
        const email = process.argv[2];
        
        if (!email) {
            console.log('Usage: node unlock-user.js <email>');
            console.log('Example: node unlock-user.js naveenrahulroy1@gmail.com');
            process.exit(1);
        }

        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        console.log('🔍 Finding user:', email);
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            console.log('❌ User not found:', email);
            process.exit(1);
        }

        console.log('✅ User found:', user.name);
        console.log('   Email:', user.email);
        console.log('   Login Attempts:', user.loginAttempts);
        console.log('   Lock Until:', user.lockUntil);
        console.log('   MFA Setup:', user.isMfaSetup);

        // Unlock the account
        user.loginAttempts = 0;
        user.lockUntil = null;
        await user.save();

        console.log('\n✅ Account unlocked successfully!');
        console.log('   Login Attempts reset to: 0');
        console.log('   Lock removed');
        console.log('\n🔐 User can now login with:');
        console.log('   Email:', user.email);
        console.log('   Password: password (default for new employees)');
        console.log('   MFA: Will need to set up on first login');

        await mongoose.connection.close();
        console.log('\n✅ Done!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

unlockUser();
