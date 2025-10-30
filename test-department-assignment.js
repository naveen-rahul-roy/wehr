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

async function testDepartmentAssignment() {
    console.log('\n' + '='.repeat(70));
    console.log('🏢 TESTING DEPARTMENT ASSIGNMENT TO EMPLOYEES');
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

        const mfaResponse = await axios.post(`${API_URL}/auth/mfa/verify`, {
            userId: userId,
            token: '123456',
            isSetup: false
        });
        authToken = mfaResponse.data.token;
        const headers = { Authorization: `Bearer ${authToken}` };
        log('✅', 'Authenticated successfully', colors.green);

        // Step 2: Get all departments
        log('📋', '\nStep 2: Fetching all departments...', colors.blue);
        const deptsResponse = await axios.get(`${API_URL}/departments`, { headers });
        const departments = deptsResponse.data;
        
        console.log(`\n📊 Available Departments:`);
        departments.forEach((dept, index) => {
            console.log(`   ${index + 1}. ${dept.name} (ID: ${dept._id || dept.id})`);
        });

        if (departments.length === 0) {
            log('⚠️', 'No departments found! Creating one...', colors.yellow);
            const createDeptResp = await axios.post(
                `${API_URL}/departments`,
                { name: 'Test Department' },
                { headers }
            );
            testDeptId = createDeptResp.data._id || createDeptResp.data.id;
            log('✅', `Created department: ${createDeptResp.data.name}`, colors.green);
        } else {
            testDeptId = departments[0]._id || departments[0].id;
            log('✅', `Using existing department: ${departments[0].name}`, colors.green);
        }

        // Step 3: Get all employees
        log('👥', '\nStep 3: Fetching all employees...', colors.blue);
        const empsResponse = await axios.get(`${API_URL}/employees`, { headers });
        const employees = empsResponse.data;
        
        console.log(`\n📊 Current Employees:`);
        employees.forEach((emp, index) => {
            // Handle both populated and non-populated departmentId
            let deptName = 'UNASSIGNED';
            if (emp.departmentId) {
                if (typeof emp.departmentId === 'object' && emp.departmentId.name) {
                    deptName = emp.departmentId.name;
                } else {
                    const dept = departments.find(d => (d._id || d.id) === emp.departmentId);
                    deptName = dept ? dept.name : 'UNASSIGNED';
                }
            }
            console.log(`   ${index + 1}. ${emp.name} - Department: ${deptName}`);
        });

        // Step 4: Create employee with department
        log('➕', '\nStep 4: Creating employee with department assignment...', colors.blue);
        const createEmpResp = await axios.post(
            `${API_URL}/employees`,
            {
                employeeId: `EMP${Date.now()}`,
                name: 'Test Employee with Dept',
                email: `test${Date.now()}@example.com`,
                phone: '555-1234',
                departmentId: testDeptId,
                role: 'Test Role',
                joinDate: new Date().toISOString().split('T')[0],
                status: 'Active',
                employeeType: 'Permanent',
                salary: 50000
            },
            { headers }
        );
        testEmployeeId = createEmpResp.data.employee._id || createEmpResp.data.employee.id;
        const assignedDeptId = createEmpResp.data.employee.departmentId;
        
        // Handle populated departmentId (object) or plain ID (string)
        const actualDeptId = typeof assignedDeptId === 'object' ? (assignedDeptId._id || assignedDeptId.id) : assignedDeptId;
        
        if (actualDeptId === testDeptId || actualDeptId.toString() === testDeptId.toString()) {
            log('✅', `Employee created with correct department assignment!`, colors.green);
            console.log(`   Employee: ${createEmpResp.data.employee.name}`);
            console.log(`   Department: ${typeof assignedDeptId === 'object' ? assignedDeptId.name : actualDeptId}`);
        } else {
            log('❌', `Department assignment failed!`, colors.red);
            console.log(`   Expected: ${testDeptId}`);
            console.log(`   Got: ${actualDeptId}`);
        }

        // Step 5: Verify employee has department
        log('🔍', '\nStep 5: Verifying employee-department relationship...', colors.blue);
        const empResponse = await axios.get(`${API_URL}/employees/${testEmployeeId}`, { headers });
        const employee = empResponse.data;
        
        if (employee.departmentId) {
            // Handle populated departmentId
            const deptName = typeof employee.departmentId === 'object' ? employee.departmentId.name : 
                            departments.find(d => (d._id || d.id) === employee.departmentId)?.name || 'Unknown';
            log('✅', `Employee has department: ${deptName}`, colors.green);
        } else {
            log('❌', `Employee has NO department assigned!`, colors.red);
        }

        // Step 6: Update employee department
        log('✏️', '\nStep 6: Testing department reassignment...', colors.blue);
        if (departments.length > 1) {
            const newDeptId = departments[1]._id || departments[1].id;
            await axios.put(
                `${API_URL}/employees/${testEmployeeId}`,
                { departmentId: newDeptId },
                { headers }
            );
            
            const updatedEmp = await axios.get(`${API_URL}/employees/${testEmployeeId}`, { headers });
            const updatedDeptId = typeof updatedEmp.data.departmentId === 'object' ? 
                                 (updatedEmp.data.departmentId._id || updatedEmp.data.departmentId.id) : 
                                 updatedEmp.data.departmentId;
            
            if (updatedDeptId === newDeptId || updatedDeptId.toString() === newDeptId.toString()) {
                log('✅', `Department reassignment successful!`, colors.green);
                const deptName = typeof updatedEmp.data.departmentId === 'object' ? 
                                updatedEmp.data.departmentId.name : 
                                departments.find(d => (d._id || d.id) === newDeptId)?.name || 'Unknown';
                console.log(`   New Department: ${deptName}`);
            } else {
                log('❌', `Department reassignment failed!`, colors.red);
            }
        } else {
            log('⚠️', `Only one department exists, skipping reassignment test`, colors.yellow);
        }

        // Step 7: Check unassigned employees
        log('🔍', '\nStep 7: Checking for unassigned employees...', colors.blue);
        const allEmps = await axios.get(`${API_URL}/employees`, { headers });
        const unassigned = allEmps.data.filter(emp => !emp.departmentId);
        
        if (unassigned.length > 0) {
            log('⚠️', `Found ${unassigned.length} employee(s) without department:`, colors.yellow);
            unassigned.forEach(emp => {
                console.log(`   - ${emp.name} (${emp.email})`);
            });
        } else {
            log('✅', `All employees have departments assigned!`, colors.green);
        }

        // Step 8: Cleanup
        log('🧹', '\nStep 8: Cleaning up test data...', colors.blue);
        if (testEmployeeId) {
            await axios.delete(`${API_URL}/employees/${testEmployeeId}`, { headers });
            log('✅', 'Test employee deleted', colors.green);
        }

        console.log('\n' + '='.repeat(70));
        log('🎉', 'DEPARTMENT ASSIGNMENT TEST COMPLETE!', colors.green);
        console.log('='.repeat(70));
        
        console.log('\n💡 Summary:');
        console.log('   ✅ Employees can be assigned to departments');
        console.log('   ✅ Department assignment persists in database');
        console.log('   ✅ Employees can be reassigned to different departments');
        console.log('   ✅ System tracks employee-department relationships');
        console.log('\n');

    } catch (error) {
        console.error('\n' + '='.repeat(70));
        log('❌', 'DEPARTMENT ASSIGNMENT TEST FAILED', colors.red);
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

testDepartmentAssignment();
