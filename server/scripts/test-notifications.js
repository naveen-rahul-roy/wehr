import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

dotenv.config();

const testNotifications = async () => {
  try {
    console.log('🔔 Testing Notification System...\n');
    
    // Connect to database
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    // Get all users
    const users = await User.find({}).select('name email role');
    console.log(`👥 Found ${users.length} users\n`);

    // Check existing notifications
    console.log('📋 Checking existing notifications...');
    const existingNotifications = await Notification.find({}).populate('userId', 'name email');
    console.log(`   Found ${existingNotifications.length} existing notifications\n`);

    if (existingNotifications.length > 0) {
      console.log('📊 Notification breakdown by user:');
      const notificationsByUser = {};
      
      existingNotifications.forEach(notif => {
        const userId = notif.userId._id.toString();
        if (!notificationsByUser[userId]) {
          notificationsByUser[userId] = {
            user: notif.userId,
            total: 0,
            unread: 0,
            read: 0
          };
        }
        notificationsByUser[userId].total++;
        if (notif.read) {
          notificationsByUser[userId].read++;
        } else {
          notificationsByUser[userId].unread++;
        }
      });

      Object.values(notificationsByUser).forEach(data => {
        console.log(`   ${data.user.name} (${data.user.email})`);
        console.log(`      Total: ${data.total}, Unread: ${data.unread}, Read: ${data.read}`);
      });
      console.log('');
    }

    // Create test notifications for each user
    console.log('🧪 Creating test notifications...\n');
    
    for (const user of users) {
      const testNotification = await Notification.create({
        userId: user._id,
        title: 'System Test Notification',
        message: `This is a test notification for ${user.name}. The notification system is working correctly!`,
        link: '/notifications',
        read: false
      });

      console.log(`✅ Created test notification for ${user.name} (${user.email})`);
      console.log(`   ID: ${testNotification._id}`);
      console.log(`   Title: ${testNotification.title}`);
      console.log(`   Read: ${testNotification.read}`);
      console.log('');
    }

    // Verify notifications were created
    const newCount = await Notification.countDocuments({});
    console.log('═══════════════════════════════════════════════════════');
    console.log(`✅ Test notifications created successfully!`);
    console.log(`   Total notifications in database: ${newCount}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n📱 To view notifications:');
    console.log('   1. Start the application');
    console.log('   2. Login with any user');
    console.log('   3. Click the bell icon in the top right');
    console.log('   4. You should see the test notification\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

testNotifications();
