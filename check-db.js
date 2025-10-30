import mongoose from 'mongoose';
import Department from './server/models/Department.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './server/.env' });

async function checkDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n📋 Current departments in database:');
    const departments = await Department.find();
    
    if (departments.length === 0) {
      console.log('❌ No departments found in database');
    } else {
      departments.forEach((dept, index) => {
        console.log(`${index + 1}. ${dept.name} (ID: ${dept._id})`);
      });
    }

    console.log('\n🔍 Testing department creation...');
    
    // Try to create a test department
    try {
      const testDept = await Department.create({
        name: 'Test Department ' + Date.now(),
        managerId: null
      });
      console.log('✅ Successfully created test department:', testDept.name);
      
      // Clean up test department
      await Department.findByIdAndDelete(testDept._id);
      console.log('✅ Test department cleaned up');
      
    } catch (createError) {
      console.error('❌ Error creating test department:', createError.message);
    }

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }
}

checkDatabase();