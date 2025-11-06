import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from '../models/Notification.js';

dotenv.config();

const cleanupOldNotifications = async () => {
  try {
    console.log('🧹 Cleaning Up Old Notifications...\n');
    
    // Connect to database
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    // Get current count
    const totalBefore = await Notification.countDocuments({});
    console.log(`📊 Current notifications: ${totalBefore}\n`);

    // Option 1: Delete all read notifications older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oldReadResult = await Notification.deleteMany({
      read: true,
      createdAt: { $lt: thirtyDaysAgo }
    });

    console.log(`✅ Deleted ${oldReadResult.deletedCount} read notifications older than 30 days`);

    // Option 2: Delete all notifications older than 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const veryOldResult = await Notification.deleteMany({
      createdAt: { $lt: ninetyDaysAgo }
    });

    console.log(`✅ Deleted ${veryOldResult.deletedCount} notifications older than 90 days`);

    // Get final count
    const totalAfter = await Notification.countDocuments({});
    const totalDeleted = totalBefore - totalAfter;

    console.log('\n═══════════════════════════════════════════════════════');
    console.log(`✅ Cleanup Complete!`);
    console.log(`   Before: ${totalBefore} notifications`);
    console.log(`   After: ${totalAfter} notifications`);
    console.log(`   Deleted: ${totalDeleted} notifications`);
    console.log('═══════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

cleanupOldNotifications();
