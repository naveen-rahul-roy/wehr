import mongoose from 'mongoose';
import User from './server/models/User.js';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

async function checkLogin() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        console.log('👥 Checking users in database...');
        const users = await User.find();
        
        if (users.length === 0) {
            console.log('❌ No users found in database!');
            console.log('📝 Creating admin user...');
            
            const adminUser = await User.create({
                email: 'admin@hrms.com',
                password: 'password123',
                name: 'Admin User',
                role: 'admin',
                mfaEnabled: true,
                mfaSecret: 'JBSWY3DPEHPK3PXP'
            });
            
            console.log('✅ Admin user created:', adminUser.email);
        } else {
            console.log(`✅ Found ${users.length} user(s):\n`);
            users.forEach((user, index) => {
                console.log(`${index + 1}. Email: ${user.email}`);
                console.log(`   Name: ${user.name}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   MFA Enabled: ${user.mfaEnabled}`);
                console.log(`   MFA Secret: ${user.mfaSecret || 'Not set'}`);
                console.log('');
            });
        }

        // Test login
        console.log('🔐 Testing login with admin@hrms.com...');
        const testUser = await User.findOne({ email: 'admin@hrms.com' });
        
        if (testUser) {
            const isMatch = await testUser.comparePassword('password123');
            console.log('✅ User found');
            console.log('🔑 Password match:', isMatch);
            console.log('🔐 MFA Enabled:', testUser.mfaEnabled);
            console.log('🔑 MFA Secret:', testUser.mfaSecret);
        } else {
            console.log('❌ User not found!');
        }

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkLogin();
