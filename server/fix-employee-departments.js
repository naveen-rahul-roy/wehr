import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from './models/Employee.js';
import Department from './models/Department.js';
import connectDB from './config/database.js';

dotenv.config();

const fixEmployeeDepartments = async () => {
    try {
        await connectDB();
        console.log('✅ Connected to MongoDB\n');

        // Get all departments
        const departments = await Department.find();
        console.log(`📋 Found ${departments.length} departments:`);
        departments.forEach((dept, index) => {
            console.log(`   ${index + 1}. ${dept.name} (${dept._id})`);
        });

        if (departments.length === 0) {
            console.log('\n❌ No departments found! Please create departments first.');
            process.exit(1);
        }

        // Get all employees
        const employees = await Employee.find();
        console.log(`\n👥 Found ${employees.length} employees\n`);

        let fixed = 0;
        let alreadyAssigned = 0;

        // Assign departments to employees without one
        for (const employee of employees) {
            if (!employee.departmentId) {
                // Assign based on role or randomly
                let assignedDept;
                
                if (employee.role && employee.role.toLowerCase().includes('hr')) {
                    assignedDept = departments.find(d => d.name.toLowerCase().includes('hr'));
                } else if (employee.role && employee.role.toLowerCase().includes('engineer')) {
                    assignedDept = departments.find(d => d.name.toLowerCase().includes('engineer'));
                } else if (employee.role && employee.role.toLowerCase().includes('sales')) {
                    assignedDept = departments.find(d => d.name.toLowerCase().includes('sales'));
                } else if (employee.role && employee.role.toLowerCase().includes('marketing')) {
                    assignedDept = departments.find(d => d.name.toLowerCase().includes('marketing'));
                } else if (employee.role && employee.role.toLowerCase().includes('admin')) {
                    assignedDept = departments.find(d => d.name.toLowerCase().includes('hr'));
                } else if (employee.role && employee.role.toLowerCase().includes('manager')) {
                    assignedDept = departments.find(d => d.name.toLowerCase().includes('engineer'));
                }

                // If no match found, assign to first department
                if (!assignedDept) {
                    assignedDept = departments[0];
                }

                employee.departmentId = assignedDept._id;
                await employee.save();
                
                console.log(`✅ Fixed: ${employee.name} → ${assignedDept.name}`);
                fixed++;
            } else {
                const dept = await Department.findById(employee.departmentId);
                console.log(`✓  OK: ${employee.name} → ${dept ? dept.name : 'Unknown'}`);
                alreadyAssigned++;
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`   Fixed: ${fixed} employees`);
        console.log(`   Already assigned: ${alreadyAssigned} employees`);
        console.log(`   Total: ${employees.length} employees`);
        
        if (fixed > 0) {
            console.log(`\n🎉 Successfully assigned departments to ${fixed} employee(s)!`);
        } else {
            console.log(`\n✅ All employees already have departments assigned!`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

fixEmployeeDepartments();
