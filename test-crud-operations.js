import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

const log = (emoji, message, color = colors.reset) => {
    console.log(`${color}${emoji} ${message}${colors.reset}`);
};

async function testCRUDOperations() {
    console.log('\n' + '='.repeat(70));
    console.log('🧪 TESTING CRUD OPERATIONS');
    console.log('='.repeat(70) + '\n');

    let authToken = null;
    let testDeptId = null;
    let testEmployeeId = null;

    try {
        // Step 1: Login
        log('🔐', 'Step 1: Logging in as admin...', colors.blue);
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@hrms.com',
            password: 'password123'
        });
        const userId = loginResponse.data.user.id;
        log('✅', 'Login successful', colors.green);

        // Step 2: Verify MFA to get token
        log('🔑', 'Step 2: Verifying MFA...', colors.blue);
        const mfaResponse = await axios.post(`${API_URL}/auth/mfa/verify`, {
            userId: userId,
            token: '123456', // Demo code
            isSetup: false
        });
        authToken = mfaResponse.data.token;
        log('✅', 'MFA verified, token received', colors.green);

        const headers = { Authorization: `Bearer ${authToken}` };

        // Step 3: CREATE Department
        log('📝', 'Step 3: Creating new department...', colors.blue);
        const createDeptResponse = await axios.post(
            `${API_URL}/departments`,
            { name: `Test Department ${Date.now()}` },
            { headers }
        );
        testDeptId = createDeptResponse.data._id || createDeptResponse.data.id;
        log('✅', `Department created: ${createDeptResponse.data.name} (ID: ${testDeptId})`, colors.green);

        // Step 4: READ Departments
        log('📖', 'Step 4: Reading all departments...', colors.blue);
        const readDeptResponse = await axios.get(`${API_URL}/departments`, { headers });
        log('✅', `Found ${readDeptResponse.data.length} departments`, colors.green);

        // Step 5: UPDATE Department
        log('✏️', 'Step 5: Updating department...', colors.blue);
        const updateDeptResponse = await axios.put(
            `${API_URL}/departments/${testDeptId}`,
            { name: `Updated Test Department ${Date.now()}` },
            { headers }
        );
        log('✅', `Department updated: ${updateDeptResponse.data.name}`, colors.green);

        // Step 6: CREATE Employee
        log('👤', 'Step 6: Creating new employee...', colors.blue);
        const createEmpResponse = await axios.post(
            `${API_URL}/employees`,
            {
                employeeId: `EMP${Date.now()}`,
                name: 'Test Employee',
                email: `test${Date.now()}@example.com`,
                phone: '555-0000',
                departmentId: testDeptId,
                role: 'Test Role',
                joinDate: new Date().toISOString().split('T')[0],
                status: 'Active',
                employeeType: 'Permanent',
                salary: 50000
            },
            { headers }
        );
        testEmployeeId = createEmpResponse.data.employee._id || createEmpResponse.data.employee.id;
        log('✅', `Employee created: ${createEmpResponse.data.employee.name} (ID: ${testEmployeeId})`, colors.green);

        // Step 7: READ Employees
        log('📖', 'Step 7: Reading all employees...', colors.blue);
        const readEmpResponse = await axios.get(`${API_URL}/employees`, { headers });
        log('✅', `Found ${readEmpResponse.data.length} employees`, colors.green);

        // Step 8: UPDATE Employee
        log('✏️', 'Step 8: Updating employee...', colors.blue);
        const updateEmpResponse = await axios.put(
            `${API_URL}/employees/${testEmployeeId}`,
            {
                name: 'Updated Test Employee',
                salary: 60000
            },
            { headers }
        );
        log('✅', `Employee updated: ${updateEmpResponse.data.name}`, colors.green);

        // Step 9: DELETE Employee
        log('🗑️', 'Step 9: Deleting test employee...', colors.blue);
        await axios.delete(`${API_URL}/employees/${testEmployeeId}`, { headers });
        log('✅', 'Employee deleted successfully', colors.green);

        // Step 10: DELETE Department
        log('🗑️', 'Step 10: Deleting test department...', colors.blue);
        await axios.delete(`${API_URL}/departments/${testDeptId}`, { headers });
        log('✅', 'Department deleted successfully', colors.green);

        // Step 11: Verify Dashboard Data
        log('📊', 'Step 11: Verifying dashboard data...', colors.blue);
        const finalDeptResponse = await axios.get(`${API_URL}/departments`, { headers });
        const finalEmpResponse = await axios.get(`${API_URL}/employees`, { headers });
        
        console.log('\n📈 Final Counts:');
        console.log(`   Departments: ${finalDeptResponse.data.length}`);
        console.log(`   Employees: ${finalEmpResponse.data.length}`);

        console.log('\n' + '='.repeat(70));
        log('🎉', 'ALL CRUD OPERATIONS SUCCESSFUL!', colors.green);
        console.log('='.repeat(70) + '\n');

    } catch (error) {
        console.error('\n' + '='.repeat(70));
        log('❌', 'CRUD OPERATIONS FAILED', colors.red);
        console.log('='.repeat(70));
        
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Message: ${error.response.data.message || error.response.data}`);
        } else if (error.request) {
            console.error('❌ No response from server. Is the backend running?');
        } else {
            console.error('Error:', error.message);
        }
        console.log('\n');
        process.exit(1);
    }
}

testCRUDOperations();
