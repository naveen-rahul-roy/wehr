import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testCompleteFlow() {
    console.log('🚀 Testing Complete HR System Flow\n');
    console.log('═'.repeat(60));
    
    let token = '';
    let userId = '';

    try {
        // 1. Test Login
        console.log('\n1️⃣ Testing Login...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@hrms.com',
            password: 'password123'
        });
        
        console.log('✅ Login successful');
        console.log('   User:', loginResponse.data.user.name);
        console.log('   Email:', loginResponse.data.user.email);
        console.log('   MFA Setup:', loginResponse.data.user.isMfaSetup);
        userId = loginResponse.data.user.id;

        // 2. Test Email Verification Request
        console.log('\n2️⃣ Testing Email Verification Request...');
        const emailReqResponse = await axios.post(`${API_URL}/auth/mfa/email-verification-request`, {
            email: 'admin@hrms.com'
        });
        
        console.log('✅ Email verification request sent');
        console.log('   Message:', emailReqResponse.data.message);

        // 3. Test Email Verification with Dev Code
        console.log('\n3️⃣ Testing Email Verification (Dev Code: 123456)...');
        const verifyResponse = await axios.post(`${API_URL}/auth/mfa/verify-email-code`, {
            email: 'admin@hrms.com',
            verificationCode: '123456'
        });
        
        console.log('✅ Email verification successful');
        console.log('   Token received:', verifyResponse.data.token ? 'Yes' : 'No');
        token = verifyResponse.data.token;

        // 4. Test Departments CRUD
        console.log('\n4️⃣ Testing Departments CRUD...');
        
        // Read
        const deptsResponse = await axios.get(`${API_URL}/departments`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Read:', deptsResponse.data.length, 'departments');

        // Create
        const createDeptResponse = await axios.post(`${API_URL}/departments`, {
            name: 'Test Department ' + Date.now()
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Create: Department created');
        const deptId = createDeptResponse.data._id;

        // Update
        await axios.put(`${API_URL}/departments/${deptId}`, {
            name: 'Updated Test Department'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Update: Department updated');

        // Delete
        await axios.delete(`${API_URL}/departments/${deptId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Delete: Department deleted');

        // 5. Test Employees CRUD
        console.log('\n5️⃣ Testing Employees CRUD...');
        
        // Read
        const empsResponse = await axios.get(`${API_URL}/employees`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Read:', empsResponse.data.length, 'employees');

        // Create
        const firstDept = deptsResponse.data[0];
        const createEmpResponse = await axios.post(`${API_URL}/employees`, {
            employeeId: 'EMP' + Date.now(),
            name: 'Test Employee',
            email: 'test' + Date.now() + '@test.com',
            phone: '1234567890',
            departmentId: firstDept._id,
            role: 'Developer',
            joinDate: new Date().toISOString().split('T')[0],
            status: 'Active',
            employeeType: 'Permanent',
            salary: 50000
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Create: Employee created');
        const empId = createEmpResponse.data.employee._id;

        // Update
        await axios.put(`${API_URL}/employees/${empId}`, {
            salary: 55000
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Update: Employee updated');

        // Delete
        await axios.delete(`${API_URL}/employees/${empId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Delete: Employee deleted');

        // 6. Test Leaves CRUD
        console.log('\n6️⃣ Testing Leaves CRUD...');
        
        // Read
        const leavesResponse = await axios.get(`${API_URL}/leaves`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Read:', leavesResponse.data.length, 'leave requests');

        // Create
        const createLeaveResponse = await axios.post(`${API_URL}/leaves`, {
            employeeId: userId,
            leaveType: 'Sick',
            startDate: '2025-11-01',
            endDate: '2025-11-02',
            reason: 'Test leave request'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Create: Leave request created');
        const leaveId = createLeaveResponse.data._id;

        // Update
        await axios.put(`${API_URL}/leaves/${leaveId}`, {
            status: 'Approved'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Update: Leave approved');

        // 7. Test Attendance
        console.log('\n7️⃣ Testing Attendance...');
        
        const attendanceResponse = await axios.get(`${API_URL}/attendance`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Read:', attendanceResponse.data.length, 'attendance records');

        console.log('\n' + '═'.repeat(60));
        console.log('🎉 ALL TESTS PASSED!');
        console.log('✅ Authentication: Working');
        console.log('✅ Email Verification: Working (Dev Mode)');
        console.log('✅ Departments CRUD: Working');
        console.log('✅ Employees CRUD: Working');
        console.log('✅ Leaves CRUD: Working');
        console.log('✅ Attendance: Working');
        console.log('═'.repeat(60));

    } catch (error) {
        console.error('\n❌ Test failed:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
        process.exit(1);
    }
}

testCompleteFlow();
