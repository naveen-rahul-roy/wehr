import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Department from '../models/Department.js';

dotenv.config();

// Helper function to generate avatar URL
const generateAvatar = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`;
};

const seedProduction = async () => {
  try {
    console.log('🌱 Seeding Production Database...\n');
    
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    console.log('   URI:', process.env.MONGODB_URI?.substring(0, 50) + '...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log(`⚠️  Warning: Database already has ${existingUsers} users`);
      console.log('   Do you want to continue? This will ADD more users.');
      console.log('   To clear and reseed, delete all data first.\n');
    }

    console.log('📋 Creating departments...');
    // Create departments (check if they exist first)
    let departments = await Department.find({});
    
    if (departments.length === 0) {
      departments = await Department.create([
        { name: 'Engineering' },
        { name: 'Human Resources' },
        { name: 'Sales' },
        { name: 'Marketing' }
      ]);
      console.log(`✅ Created ${departments.length} departments\n`);
    } else {
      console.log(`ℹ️  Using existing ${departments.length} departments\n`);
    }

    console.log('👥 Creating users...');
    
    // Check if admin user exists
    let adminUser = await User.findOne({ email: 'admin@hrms.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Alex Admin',
        email: 'admin@hrms.com',
        password: 'admin123', // Using admin123 to match your local setup
        role: 'Admin',
        avatarUrl: generateAvatar('Alex Admin'),
        isMfaSetup: false,
        isActive: true
      });
      console.log('✅ Created Admin user');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Check if HR user exists
    let hrUser = await User.findOne({ email: 'hr@hrms.com' });
    if (!hrUser) {
      hrUser = await User.create({
        name: 'Harriet HR',
        email: 'hr@hrms.com',
        password: 'admin123',
        role: 'HR',
        avatarUrl: generateAvatar('Harriet HR'),
        isMfaSetup: false,
        isActive: true
      });
      console.log('✅ Created HR user');
    } else {
      console.log('ℹ️  HR user already exists');
    }

    // Check if Manager user exists
    let managerUser = await User.findOne({ email: 'manager@hrms.com' });
    if (!managerUser) {
      managerUser = await User.create({
        name: 'Mandy Manager',
        email: 'manager@hrms.com',
        password: 'admin123',
        role: 'Manager',
        avatarUrl: generateAvatar('Mandy Manager'),
        isMfaSetup: false,
        isActive: true
      });
      console.log('✅ Created Manager user');
    } else {
      console.log('ℹ️  Manager user already exists');
    }

    // Check if Employee user exists
    let employeeUser = await User.findOne({ email: 'employee@hrms.com' });
    if (!employeeUser) {
      employeeUser = await User.create({
        name: 'Eva Employee',
        email: 'employee@hrms.com',
        password: 'admin123',
        role: 'Employee',
        avatarUrl: generateAvatar('Eva Employee'),
        isMfaSetup: false,
        isActive: true
      });
      console.log('✅ Created Employee user');
    } else {
      console.log('ℹ️  Employee user already exists');
    }

    console.log('\n👔 Creating employee records...');
    
    // Create employee records if they don't exist
    const employeeRecords = [
      {
        employeeId: 'ADM001',
        userId: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        phone: '555-0001',
        avatarUrl: adminUser.avatarUrl,
        departmentId: departments[1]._id, // HR
        role: 'System Administrator',
        joinDate: new Date('2020-01-01'),
        status: 'Active',
        employeeType: 'Permanent',
        salary: 110000,
        currentPassword: 'admin123'
      },
      {
        employeeId: 'HR001',
        userId: hrUser._id,
        name: hrUser.name,
        email: hrUser.email,
        phone: '555-0002',
        avatarUrl: hrUser.avatarUrl,
        departmentId: departments[1]._id, // HR
        role: 'Senior HR Generalist',
        joinDate: new Date('2021-02-15'),
        status: 'Active',
        employeeType: 'Permanent',
        salary: 78000,
        currentPassword: 'admin123'
      },
      {
        employeeId: 'MGR001',
        userId: managerUser._id,
        name: managerUser.name,
        email: managerUser.email,
        phone: '555-0003',
        avatarUrl: managerUser.avatarUrl,
        departmentId: departments[0]._id, // Engineering
        role: 'Engineering Manager',
        joinDate: new Date('2021-09-01'),
        status: 'Active',
        employeeType: 'Permanent',
        salary: 105000,
        currentPassword: 'admin123'
      },
      {
        employeeId: 'EMP001',
        userId: employeeUser._id,
        name: employeeUser.name,
        email: employeeUser.email,
        phone: '555-0004',
        avatarUrl: employeeUser.avatarUrl,
        departmentId: departments[0]._id, // Engineering
        role: 'Software Engineer',
        joinDate: new Date('2023-03-12'),
        status: 'Active',
        employeeType: 'Permanent',
        salary: 75000,
        currentPassword: 'admin123'
      }
    ];

    for (const empData of employeeRecords) {
      const existing = await Employee.findOne({ email: empData.email });
      if (!existing) {
        await Employee.create(empData);
        console.log(`✅ Created employee: ${empData.name}`);
      } else {
        console.log(`ℹ️  Employee already exists: ${empData.name}`);
      }
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ Production Database Seeded Successfully!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n🔐 Login Credentials:\n');
    console.log('Admin:');
    console.log('  Email: admin@hrms.com');
    console.log('  Password: admin123');
    console.log('  MFA Code: 123456 (development bypass)\n');
    
    console.log('HR:');
    console.log('  Email: hr@hrms.com');
    console.log('  Password: admin123');
    console.log('  MFA Code: 123456\n');
    
    console.log('Manager:');
    console.log('  Email: manager@hrms.com');
    console.log('  Password: admin123');
    console.log('  MFA Code: 123456\n');
    
    console.log('Employee:');
    console.log('  Email: employee@hrms.com');
    console.log('  Password: admin123');
    console.log('  MFA Code: 123456\n');
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 Database Summary:');
    console.log(`   Users: ${await User.countDocuments()}`);
    console.log(`   Employees: ${await Employee.countDocuments()}`);
    console.log(`   Departments: ${await Department.countDocuments()}`);
    console.log('═══════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedProduction();
