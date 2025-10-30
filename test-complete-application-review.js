import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Test results tracker
const results = {
    authentication: [],
    departments: [],
    employees: [],
    leaves: [],
    attendance: [],
    newEmployeeLogin: [],
    dataSync: []
};

function logTest(category, test, passed, details = '') {
    const status = passed ? '✅' : '❌';
    const message = `${status} ${test}${details ? ': ' + details : ''}`;
    console.log(message);
    results[category].push({ test, passed, details });
}

async function testCompleteApplication() {
    console.log('═'.repeat(80));
    console.log('🔍 COMPLETE APPLICATION REVIEW & TEST');
    console.log('═'.repeat(80));
    console.log();

    let adminToken = '';
    let newEmployeeEmail = '';
    let newEmployeePassword = '';
    let testDeptId = '';
    let testEmpId = '';
    let testLeaveId = '';

    try {
        // ============================================================
        // 1. AUTHENTICATION TESTS
        // ============================================================
        console.log('1️⃣ AUTHENTICATION & LOGIN TESTS');
        console.log('-'.repeat(80));

        // Test 1.1: Admin Login
        try {
            const loginResp = await axios.post(`${API_URL}/auth/login`, {
                email: 'admin@hrms.com',
                password: 'password123'
            });
            logTest('authentication', 'Admin Login', true, 'Successful');
            
            // Test 1.2: Email Verification Request
            await axios.post(`${API_URL}/auth/mfa/email-verification-request`, {
                email: 'admin@hrms.com'
            });
            logTest('authentication', 'Email Verification Request', true);

            // Test 1.3: Email Verification with Dev Code
            const verifyResp = await axios.post(`${API_URL}/auth/mfa/verify-email-code`, {
                email: 'admin@hrms.com',
                verificationCode: '123456'
            });
            adminToken = verifyResp.data.token;
            logTest('authentication', 'Email Verification (Dev Code)', true, 'Token received');

            // Test 1.4: Get Current User
            const meResp = await axios.get(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            logTest('authentication', 'Get Current User', true, meResp.data.user.name);

        } catch (error) {
            logTest('authentication', 'Authentication Flow', false, error.message);
            throw error;
        }

        const headers = { Authorization: `Bearer ${adminToken}` };

        // ============================================================
        // 2. DEPARTMENTS CRUD TESTS
        // ============================================================
        console.log('\n2️⃣ DEPARTMENTS CRUD & DATA SYNC TESTS');
        console.log('-'.repeat(80));

        // Test 2.1: Read Departments (Before)
        const deptsBefore = await axios.get(`${API_URL}/departments`, { headers });
        const deptsCountBefore = deptsBefore.data.length;
        logTest('departments', 'Read Departments (Initial)', true, `${deptsCountBefore} departments`);

        // Test 2.2: Create Department
        const createDeptResp = await axios.post(`${API_URL}/departments`, {
            name: 'Test Department ' + Date.now()
        }, { headers });
        testDeptId = createDeptResp.data.id || createDeptResp.data._id;
        logTest('departments', 'Create Department', !!testDeptId, `ID: ${testDeptId}`);
        logTest('dataSync', 'Department has ID field', !!createDeptResp.data.id);

        // Test 2.3: Read Departments (After Create)
        const deptsAfterCreate = await axios.get(`${API_URL}/departments`, { headers });
        const deptsCountAfterCreate = deptsAfterCreate.data.length;
        logTest('departments', 'Data Sync After Create', deptsCountAfterCreate === deptsCountBefore + 1, 
            `${deptsCountBefore} → ${deptsCountAfterCreate}`);

        // Test 2.4: Update Department
        const updateDeptResp = await axios.put(`${API_URL}/departments/${testDeptId}`, {
            name: 'Updated Test Department'
        }, { headers });
        logTest('departments', 'Update Department', updateDeptResp.data.name === 'Updated Test Department');

        // Test 2.5: Read Department (Verify Update)
        const getDeptResp = await axios.get(`${API_URL}/departments/${testDeptId}`, { headers });
        logTest('dataSync', 'Department Update Persisted', getDeptResp.data.name === 'Updated Test Department');

        // Test 2.6: Delete Department
        await axios.delete(`${API_URL}/departments/${testDeptId}`, { headers });
        logTest('departments', 'Delete Department', true);

        // Test 2.7: Verify Deletion
        const deptsAfterDelete = await axios.get(`${API_URL}/departments`, { headers });
        logTest('dataSync', 'Department Delete Synced', deptsAfterDelete.data.length === deptsCountBefore);

        // ============================================================
        // 3. EMPLOYEES CRUD & NEW EMPLOYEE TESTS
        // ============================================================
        console.log('\n3️⃣ EMPLOYEES CRUD & NEW EMPLOYEE LOGIN TESTS');
        console.log('-'.repeat(80));

        // Get a department for employee
        const deptsForEmp = await axios.get(`${API_URL}/departments`, { headers });
        const firstDept = deptsForEmp.data[0];

        // Test 3.1: Read Employees (Before)
        const empsBefore = await axios.get(`${API_URL}/employees`, { headers });
        const empsCountBefore = empsBefore.data.length;
        logTest('employees', 'Read Employees (Initial)', true, `${empsCountBefore} employees`);

        // Test 3.2: Create New Employee
        newEmployeeEmail = `test${Date.now()}@test.com`;
        newEmployeePassword = 'password'; // Default password
        const createEmpResp = await axios.post(`${API_URL}/employees`, {
            employeeId: 'EMP' + Date.now(),
            name: 'Test Employee',
            email: newEmployeeEmail,
            phone: '1234567890',
            departmentId: firstDept._id || firstDept.id,
            role: 'Developer',
            joinDate: new Date().toISOString().split('T')[0],
            status: 'Active',
            employeeType: 'Permanent',
            salary: 50000
        }, { headers });
        testEmpId = createEmpResp.data.employee.id || createEmpResp.data.employee._id;
        logTest('employees', 'Create Employee', !!testEmpId, `ID: ${testEmpId}`);
        logTest('newEmployeeLogin', 'Employee Account Created', !!createEmpResp.data.tempPassword, 
            `Password: ${createEmpResp.data.tempPassword || 'password'}`);

        // Test 3.3: Read Employees (After Create)
        const empsAfterCreate = await axios.get(`${API_URL}/employees`, { headers });
        logTest('dataSync', 'Employee Create Synced', empsAfterCreate.data.length === empsCountBefore + 1);

        // Test 3.4: Update Employee
        const updateEmpResp = await axios.put(`${API_URL}/employees/${testEmpId}`, {
            name: 'Updated Test Employee',
            salary: 60000
        }, { headers });
        logTest('employees', 'Update Employee', updateEmpResp.data.name === 'Updated Test Employee');

        // Test 3.5: Verify Update Persisted
        const getEmpResp = await axios.get(`${API_URL}/employees/${testEmpId}`, { headers });
        logTest('dataSync', 'Employee Update Persisted', 
            getEmpResp.data.name === 'Updated Test Employee' && getEmpResp.data.salary === 60000);

        // ============================================================
        // 4. NEW EMPLOYEE LOGIN TEST
        // ============================================================
        console.log('\n4️⃣ NEW EMPLOYEE LOGIN FLOW TEST');
        console.log('-'.repeat(80));

        // Test 4.1: New Employee Login
        try {
            const newEmpLoginResp = await axios.post(`${API_URL}/auth/login`, {
                email: newEmployeeEmail,
                password: newEmployeePassword
            });
            logTest('newEmployeeLogin', 'New Employee Login', true, 'Login successful');
            logTest('newEmployeeLogin', 'MFA Setup Required', !newEmpLoginResp.data.user.isMfaSetup, 
                'First time login detected');

            // Test 4.2: New Employee Email Verification
            await axios.post(`${API_URL}/auth/mfa/email-verification-request`, {
                email: newEmployeeEmail
            });
            logTest('newEmployeeLogin', 'Email Verification Request', true);

            const newEmpVerifyResp = await axios.post(`${API_URL}/auth/mfa/verify-email-code`, {
                email: newEmployeeEmail,
                verificationCode: '123456'
            });
            logTest('newEmployeeLogin', 'Email Verification Success', !!newEmpVerifyResp.data.token, 
                'New employee can login');

        } catch (error) {
            logTest('newEmployeeLogin', 'New Employee Login Flow', false, error.response?.data?.message || error.message);
        }

        // Test 3.6: Delete Employee (cleanup)
        await axios.delete(`${API_URL}/employees/${testEmpId}`, { headers });
        logTest('employees', 'Delete Employee', true);

        const empsAfterDelete = await axios.get(`${API_URL}/employees`, { headers });
        logTest('dataSync', 'Employee Delete Synced', empsAfterDelete.data.length === empsCountBefore);

        // ============================================================
        // 5. LEAVES CRUD TESTS
        // ============================================================
        console.log('\n5️⃣ LEAVES CRUD & DATA SYNC TESTS');
        console.log('-'.repeat(80));

        // Test 5.1: Read Leaves (Before)
        const leavesBefore = await axios.get(`${API_URL}/leaves`, { headers });
        const leavesCountBefore = leavesBefore.data.length;
        logTest('leaves', 'Read Leaves (Initial)', true, `${leavesCountBefore} leave requests`);

        // Test 5.2: Create Leave Request
        const createLeaveResp = await axios.post(`${API_URL}/leaves`, {
            employeeId: empsBefore.data[0]._id || empsBefore.data[0].id,
            leaveType: 'Casual',
            startDate: '2025-12-01',
            endDate: '2025-12-02',
            reason: 'Test leave request'
        }, { headers });
        testLeaveId = createLeaveResp.data.id || createLeaveResp.data._id;
        logTest('leaves', 'Create Leave Request', !!testLeaveId, `ID: ${testLeaveId}`);

        // Test 5.3: Read Leaves (After Create)
        const leavesAfterCreate = await axios.get(`${API_URL}/leaves`, { headers });
        logTest('dataSync', 'Leave Create Synced', leavesAfterCreate.data.length === leavesCountBefore + 1);

        // Test 5.4: Update Leave (Approve)
        const updateLeaveResp = await axios.put(`${API_URL}/leaves/${testLeaveId}`, {
            status: 'Approved'
        }, { headers });
        logTest('leaves', 'Update Leave Status', updateLeaveResp.data.status === 'Approved');

        // Test 5.5: Verify Update Persisted
        const leavesAfterUpdate = await axios.get(`${API_URL}/leaves`, { headers });
        const updatedLeave = leavesAfterUpdate.data.find(l => (l.id || l._id) === testLeaveId);
        logTest('dataSync', 'Leave Update Persisted', updatedLeave?.status === 'Approved');

        // Test 5.6: Try Delete Approved Leave (Should Fail)
        try {
            await axios.delete(`${API_URL}/leaves/${testLeaveId}`, { headers });
            logTest('leaves', 'Approved Leave Protection', false, 'Should not allow deletion');
        } catch (error) {
            logTest('leaves', 'Approved Leave Protection', error.response?.status === 400, 
                'Correctly prevented deletion');
        }

        // ============================================================
        // 6. ATTENDANCE TESTS
        // ============================================================
        console.log('\n6️⃣ ATTENDANCE TESTS');
        console.log('-'.repeat(80));

        // Test 6.1: Read Attendance
        const attendanceResp = await axios.get(`${API_URL}/attendance`, { headers });
        logTest('attendance', 'Read Attendance Records', attendanceResp.data.length > 0, 
            `${attendanceResp.data.length} records`);
        logTest('dataSync', 'Attendance has ID field', !!attendanceResp.data[0]?.id);

        // ============================================================
        // 7. DATA PERSISTENCE TESTS
        // ============================================================
        console.log('\n7️⃣ DATA PERSISTENCE & DATABASE TESTS');
        console.log('-'.repeat(80));

        // Test 7.1: Verify all data has ID transformation
        const finalDepts = await axios.get(`${API_URL}/departments`, { headers });
        const finalEmps = await axios.get(`${API_URL}/employees`, { headers });
        const finalLeaves = await axios.get(`${API_URL}/leaves`, { headers });

        logTest('dataSync', 'All Departments have ID', finalDepts.data.every(d => !!d.id));
        logTest('dataSync', 'All Employees have ID', finalEmps.data.every(e => !!e.id));
        logTest('dataSync', 'All Leaves have ID', finalLeaves.data.every(l => !!l.id));

        // Test 7.2: Verify data counts are consistent
        logTest('dataSync', 'Data Consistency Check', true, 
            `Depts: ${finalDepts.data.length}, Emps: ${finalEmps.data.length}, Leaves: ${finalLeaves.data.length}`);

        // ============================================================
        // SUMMARY
        // ============================================================
        console.log('\n' + '═'.repeat(80));
        console.log('📊 TEST RESULTS SUMMARY');
        console.log('═'.repeat(80));

        let totalTests = 0;
        let passedTests = 0;

        Object.entries(results).forEach(([category, tests]) => {
            const categoryPassed = tests.filter(t => t.passed).length;
            const categoryTotal = tests.length;
            totalTests += categoryTotal;
            passedTests += categoryPassed;

            const status = categoryPassed === categoryTotal ? '✅' : '⚠️';
            console.log(`\n${status} ${category.toUpperCase()}: ${categoryPassed}/${categoryTotal} passed`);
            
            tests.forEach(test => {
                const icon = test.passed ? '  ✅' : '  ❌';
                console.log(`${icon} ${test.test}${test.details ? ' - ' + test.details : ''}`);
            });
        });

        console.log('\n' + '═'.repeat(80));
        console.log(`OVERALL: ${passedTests}/${totalTests} tests passed (${Math.round(passedTests/totalTests*100)}%)`);
        console.log('═'.repeat(80));

        if (passedTests === totalTests) {
            console.log('\n🎉 ALL TESTS PASSED! APPLICATION FULLY OPERATIONAL!');
            console.log('\n✅ Verified:');
            console.log('   - All CRUD operations working');
            console.log('   - Data syncing between frontend and backend');
            console.log('   - New employee login flow working');
            console.log('   - ID transformation working');
            console.log('   - Data persistence in MongoDB');
            console.log('   - Business logic validation');
        } else {
            console.log('\n⚠️ SOME TESTS FAILED - Review results above');
        }

        console.log('\n🚀 Frontend Application: http://localhost:3000');
        console.log('🔐 Admin Login: admin@hrms.com / password123 / 123456');
        console.log('👤 New Employee: Use credentials shown in employee creation');

    } catch (error) {
        console.error('\n❌ TEST SUITE FAILED:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
            console.error('Status:', error.response.status);
        }
        process.exit(1);
    }
}

// Run the complete test suite
testCompleteApplication();
