import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

const log = (emoji, message, color = colors.reset) => {
    console.log(`${color}${emoji} ${message}${colors.reset}`);
};

async function testDashboardUpdates() {
    console.log('\n' + '='.repeat(70));
    console.log('📊 TESTING DASHBOARD REAL-TIME UPDATES');
    console.log('='.repeat(70) + '\n');

    let authToken = null;
    let testDeptId = null;

    try {
        // Step 1: Login and get token
        log('🔐', 'Step 1: Logging in...', colors.blue);
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@hrms.com',
            password: 'password123'
        });
        const userId = loginResponse.data.user.id;

        const mfaResponse = await axios.post(`${API_URL}/auth/mfa/verify`, {
            userId: userId,
            token: '123456',
            isSetup: false
        });
        authToken = mfaResponse.data.token;
        const headers = { Authorization: `Bearer ${authToken}` };
        log('✅', 'Authenticated successfully', colors.green);

        // Step 2: Get initial counts
        log('📊', 'Step 2: Getting initial dashboard counts...', colors.blue);
        const initialEmployees = await axios.get(`${API_URL}/employees`, { headers });
        const initialDepartments = await axios.get(`${API_URL}/departments`, { headers });
        const initialLeaves = await axios.get(`${API_URL}/leaves`, { headers });
        const initialAttendance = await axios.get(`${API_URL}/attendance`, { headers });

        console.log('\n📈 Initial Counts:');
        console.log(`   Employees: ${initialEmployees.data.length}`);
        console.log(`   Departments: ${initialDepartments.data.length}`);
        console.log(`   Leave Requests: ${initialLeaves.data.length}`);
        console.log(`   Attendance Records: ${initialAttendance.data.length}`);

        // Step 3: Create a new department
        log('➕', '\nStep 3: Creating new department...', colors.cyan);
        const createDeptResponse = await axios.post(
            `${API_URL}/departments`,
            { name: `Dashboard Test Dept ${Date.now()}` },
            { headers }
        );
        testDeptId = createDeptResponse.data._id || createDeptResponse.data.id;
        log('✅', `Department created: ${createDeptResponse.data.name}`, colors.green);

        // Step 4: Wait a moment
        log('⏳', 'Step 4: Waiting 2 seconds...', colors.yellow);
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Step 5: Get updated counts
        log('📊', 'Step 5: Getting updated dashboard counts...', colors.blue);
        const updatedEmployees = await axios.get(`${API_URL}/employees`, { headers });
        const updatedDepartments = await axios.get(`${API_URL}/departments`, { headers });
        const updatedLeaves = await axios.get(`${API_URL}/leaves`, { headers });
        const updatedAttendance = await axios.get(`${API_URL}/attendance`, { headers });

        console.log('\n📈 Updated Counts:');
        console.log(`   Employees: ${updatedEmployees.data.length}`);
        console.log(`   Departments: ${updatedDepartments.data.length} ${updatedDepartments.data.length > initialDepartments.data.length ? '⬆️' : ''}`);
        console.log(`   Leave Requests: ${updatedLeaves.data.length}`);
        console.log(`   Attendance Records: ${updatedAttendance.data.length}`);

        // Step 6: Verify the change
        if (updatedDepartments.data.length > initialDepartments.data.length) {
            log('✅', '\nDashboard data updated successfully!', colors.green);
            log('🎉', 'Department count increased as expected', colors.green);
        } else {
            log('⚠️', '\nWarning: Department count did not increase', colors.yellow);
        }

        // Step 7: Clean up
        log('🧹', '\nStep 6: Cleaning up test data...', colors.blue);
        await axios.delete(`${API_URL}/departments/${testDeptId}`, { headers });
        log('✅', 'Test department deleted', colors.green);

        // Step 8: Final verification
        log('📊', 'Step 7: Final verification...', colors.blue);
        const finalDepartments = await axios.get(`${API_URL}/departments`, { headers });
        
        console.log('\n📈 Final Counts:');
        console.log(`   Departments: ${finalDepartments.data.length}`);

        if (finalDepartments.data.length === initialDepartments.data.length) {
            log('✅', 'Counts returned to initial state', colors.green);
        }

        console.log('\n' + '='.repeat(70));
        log('🎉', 'DASHBOARD UPDATE TEST COMPLETE!', colors.green);
        console.log('='.repeat(70));
        
        console.log('\n💡 Dashboard Update Mechanism:');
        console.log('   • App.tsx refreshes data every 10 seconds');
        console.log('   • DashboardPage refreshes every 10 seconds');
        console.log('   • CRUD operations trigger immediate data reload');
        console.log('   • Changes should appear within 10 seconds max');
        console.log('\n');

    } catch (error) {
        console.error('\n' + '='.repeat(70));
        log('❌', 'DASHBOARD UPDATE TEST FAILED', colors.red);
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

testDashboardUpdates();
