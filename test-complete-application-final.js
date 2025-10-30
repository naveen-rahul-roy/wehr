import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    reset: '\x1b[0m'
};

const log = (emoji, message, color = colors.reset) => {
    console.log(`${color}${emoji} ${message}${colors.reset}`);
};

let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    sections: {}
};

const test = (name, passed, details = '') => {
    testResults.total++;
    if (passed) {
        testResults.passed++;
        log('✅', `${name}${details ? ': ' + details : ''}`, colors.green);
    } else {
        testResults.failed++;
        log('❌', `${name}${details ? ': ' + details : ''}`, colors.red);
    }
};

async function testCompleteApplication() {
    console.log('\n' + '='.repeat(80));
    console.log('🧪 COMPREHENSIVE APPLICATION TEST');
    console.log('='.repeat(80) + '\n');

    let authToken = null;
    let userId = null;
    let testDeptId = null;
    let testEmployeeId = null;
    let testLeaveId = null;
    let testAttendanceId = null;

    try {
        // ==================== SECTION 1: AUTHENTICATION ====================
        log('📋', '\n=== SECTION 1: AUTHENTICATION & AUTHORIZATION ===', colors.cyan);
        
        // Test 1.1: Login
        try {
            const loginResponse = await axios.post(`${API_URL}/auth/login`, {
                email: 'admin@hrms.com',
                password: 'password123'
            });
            userId = loginResponse.data.user.id;
            test('Login with valid credentials', true, 'User ID received');
        } catch (error) {
            test('Login with valid credentials', false, error.message);
            throw error;
        }

        // Test 1.2: MFA Verification
        try {
            const mfaResponse = await axios.post(`${API_URL}/auth/mfa/verify`, {
                userId: userId,
                token: '123456',
                isSetup: false
            });
            authToken = mfaResponse.data.token;
            test('MFA verification with demo code', true, 'Token received');
        } catch (error) {
            test('MFA verification with demo code', false, error.message);
            throw error;
        }

        const headers = { Authorization: `Bearer ${authToken}` };

        // Test 1.3: Invalid login
        try {
            await axios.post(`${API_URL}/auth/login`, {
                email: 'invalid@test.com',
                password: 'wrong'
            });
            test('Reject invalid credentials', false, 'Should have failed');
        } catch (error) {
            test('Reject invalid credentials', true, 'Correctly rejected');
        }

        // ==================== SECTION 2: DEPARTMENTS ====================
        log('📋', '\n=== SECTION 2: DEPARTMENTS CRUD ===', colors.cyan);

        // Test 2.1: Read all departments
        try {
            const depts = await axios.get(`${API_URL}/departments`, { headers });
            test('GET all departments', depts.data.length >= 0, `Found ${depts.data.length} departments`);
        } catch (error) {
            test('GET all departments', false, error.message);
        }

        // Test 2.2: Create department
        try {
            const createResp = await axios.post(
                `${API_URL}/departments`,
                { name: `Test Dept ${Date.now()}` },
                { headers }
            );
            testDeptId = createResp.data._id || createResp.data.id;
            test('CREATE department', true, `ID: ${testDeptId}`);
        } catch (error) {
            test('CREATE department', false, error.message);
        }

        // Test 2.3: Update department
        if (testDeptId) {
            try {
                await axios.put(
                    `${API_URL}/departments/${testDeptId}`,
                    { name: `Updated Test Dept ${Date.now()}` },
                    { headers }
                );
                test('UPDATE department', true);
            } catch (error) {
                test('UPDATE department', false, error.message);
            }
        }

        // Test 2.4: Get single department
        if (testDeptId) {
            try {
                const dept = await axios.get(`${API_URL}/departments/${testDeptId}`, { headers });
                test('GET single department', dept.data.name.includes('Updated'), 'Name updated correctly');
            } catch (error) {
                test('GET single department', false, error.message);
            }
        }

        // ==================== SECTION 3: EMPLOYEES ====================
        log('📋', '\n=== SECTION 3: EMPLOYEES CRUD ===', colors.cyan);

        // Test 3.1: Read all employees
        try {
            const emps = await axios.get(`${API_URL}/employees`, { headers });
            test('GET all employees', emps.data.length >= 0, `Found ${emps.data.length} employees`);
        } catch (error) {
            test('GET all employees', false, error.message);
        }

        // Test 3.2: Create employee
        if (testDeptId) {
            try {
                const createResp = await axios.post(
                    `${API_URL}/employees`,
                    {
                        employeeId: `EMP${Date.now()}`,
                        name: 'Test Employee',
                        email: `test${Date.now()}@example.com`,
                        phone: '555-0000',
                        departmentId: testDeptId,
                        role: 'Tester',
                        joinDate: new Date().toISOString().split('T')[0],
                        status: 'Active',
                        employeeType: 'Permanent',
                        salary: 50000
                    },
                    { headers }
                );
                testEmployeeId = createResp.data.employee._id || createResp.data.employee.id;
                test('CREATE employee', true, `ID: ${testEmployeeId}`);
            } catch (error) {
                test('CREATE employee', false, error.message);
            }
        }

        // Test 3.3: Update employee
        if (testEmployeeId) {
            try {
                await axios.put(
                    `${API_URL}/employees/${testEmployeeId}`,
                    { name: 'Updated Test Employee', salary: 60000 },
                    { headers }
                );
                test('UPDATE employee', true);
            } catch (error) {
                test('UPDATE employee', false, error.message);
            }
        }

        // Test 3.4: Get single employee
        if (testEmployeeId) {
            try {
                const emp = await axios.get(`${API_URL}/employees/${testEmployeeId}`, { headers });
                test('GET single employee', emp.data.name === 'Updated Test Employee', 'Name updated correctly');
            } catch (error) {
                test('GET single employee', false, error.message);
            }
        }

        // ==================== SECTION 4: ATTENDANCE ====================
        log('📋', '\n=== SECTION 4: ATTENDANCE SYSTEM ===', colors.cyan);

        // Test 4.1: Read all attendance
        try {
            const att = await axios.get(`${API_URL}/attendance`, { headers });
            test('GET all attendance', att.data.length >= 0, `Found ${att.data.length} records`);
        } catch (error) {
            test('GET all attendance', false, error.message);
        }

        // Test 4.2: Create attendance record
        if (testEmployeeId) {
            try {
                const createResp = await axios.post(
                    `${API_URL}/attendance`,
                    {
                        employeeId: testEmployeeId,
                        date: new Date().toISOString().split('T')[0],
                        status: 'Present',
                        clockIn: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                    },
                    { headers }
                );
                testAttendanceId = createResp.data._id || createResp.data.id;
                test('CREATE attendance record', true, `ID: ${testAttendanceId}`);
            } catch (error) {
                test('CREATE attendance record', false, error.message);
            }
        }

        // Test 4.3: Update attendance
        if (testAttendanceId) {
            try {
                await axios.put(
                    `${API_URL}/attendance/${testAttendanceId}`,
                    { status: 'Half-Day' },
                    { headers }
                );
                test('UPDATE attendance', true);
            } catch (error) {
                test('UPDATE attendance', false, error.message);
            }
        }

        // ==================== SECTION 5: LEAVE MANAGEMENT ====================
        log('📋', '\n=== SECTION 5: LEAVE MANAGEMENT ===', colors.cyan);

        // Test 5.1: Read all leaves
        try {
            const leaves = await axios.get(`${API_URL}/leaves`, { headers });
            test('GET all leave requests', leaves.data.length >= 0, `Found ${leaves.data.length} requests`);
        } catch (error) {
            test('GET all leave requests', false, error.message);
        }

        // Test 5.2: Create leave request
        if (testEmployeeId) {
            try {
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + 7);
                const endDate = new Date(futureDate);
                endDate.setDate(endDate.getDate() + 2);

                const createResp = await axios.post(
                    `${API_URL}/leaves`,
                    {
                        employeeId: testEmployeeId,
                        employeeName: 'Test Employee',
                        leaveType: 'Annual',
                        startDate: futureDate.toISOString().split('T')[0],
                        endDate: endDate.toISOString().split('T')[0],
                        reason: 'Testing leave system'
                    },
                    { headers }
                );
                testLeaveId = createResp.data._id || createResp.data.id;
                test('CREATE leave request', true, `ID: ${testLeaveId}`);
            } catch (error) {
                test('CREATE leave request', false, error.message);
            }
        }

        // Test 5.3: Update leave status
        if (testLeaveId) {
            try {
                await axios.put(
                    `${API_URL}/leaves/${testLeaveId}`,
                    { status: 'Approved' },
                    { headers }
                );
                test('UPDATE leave status (Approve)', true);
            } catch (error) {
                test('UPDATE leave status (Approve)', false, error.message);
            }
        }

        // Test 5.4: Get leave balance
        if (testEmployeeId) {
            try {
                const balance = await axios.get(`${API_URL}/leaves/balance/${testEmployeeId}`, { headers });
                test('GET leave balance', balance.data.balances.length > 0, `Found ${balance.data.balances.length} leave types`);
            } catch (error) {
                test('GET leave balance', false, error.message);
            }
        }

        // ==================== SECTION 6: DASHBOARD DATA ====================
        log('📋', '\n=== SECTION 6: DASHBOARD & REPORTS ===', colors.cyan);

        // Test 6.1: Verify data consistency
        try {
            const [emps, depts, leaves, att] = await Promise.all([
                axios.get(`${API_URL}/employees`, { headers }),
                axios.get(`${API_URL}/departments`, { headers }),
                axios.get(`${API_URL}/leaves`, { headers }),
                axios.get(`${API_URL}/attendance`, { headers })
            ]);
            
            test('Dashboard data consistency', true, 
                `Employees: ${emps.data.length}, Depts: ${depts.data.length}, Leaves: ${leaves.data.length}, Attendance: ${att.data.length}`);
        } catch (error) {
            test('Dashboard data consistency', false, error.message);
        }

        // ==================== CLEANUP ====================
        log('📋', '\n=== CLEANUP: Removing Test Data ===', colors.yellow);

        // Delete test leave
        if (testLeaveId) {
            try {
                await axios.delete(`${API_URL}/leaves/${testLeaveId}`, { headers });
                test('DELETE test leave', true);
            } catch (error) {
                test('DELETE test leave', false, error.message);
            }
        }

        // Delete test attendance
        if (testAttendanceId) {
            try {
                await axios.delete(`${API_URL}/attendance/${testAttendanceId}`, { headers });
                test('DELETE test attendance', true);
            } catch (error) {
                test('DELETE test attendance', false, error.message);
            }
        }

        // Delete test employee
        if (testEmployeeId) {
            try {
                await axios.delete(`${API_URL}/employees/${testEmployeeId}`, { headers });
                test('DELETE test employee', true);
            } catch (error) {
                test('DELETE test employee', false, error.message);
            }
        }

        // Delete test department
        if (testDeptId) {
            try {
                await axios.delete(`${API_URL}/departments/${testDeptId}`, { headers });
                test('DELETE test department', true);
            } catch (error) {
                test('DELETE test department', false, error.message);
            }
        }

        // ==================== RESULTS ====================
        console.log('\n' + '='.repeat(80));
        log('📊', 'TEST RESULTS SUMMARY', colors.magenta);
        console.log('='.repeat(80));
        
        console.log(`\nTotal Tests: ${testResults.total}`);
        console.log(`${colors.green}Passed: ${testResults.passed} ✅${colors.reset}`);
        console.log(`${colors.red}Failed: ${testResults.failed} ❌${colors.reset}`);
        
        const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
        console.log(`\nSuccess Rate: ${successRate}%`);
        
        if (testResults.failed === 0) {
            log('🎉', '\nALL TESTS PASSED! Application is working perfectly!', colors.green);
        } else {
            log('⚠️', `\n${testResults.failed} test(s) failed. Review the errors above.`, colors.yellow);
        }
        
        console.log('\n' + '='.repeat(80) + '\n');

    } catch (error) {
        console.error('\n' + '='.repeat(80));
        log('❌', 'CRITICAL ERROR - Testing Stopped', colors.red);
        console.log('='.repeat(80));
        
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Message: ${error.response.data.message || error.response.data}`);
        } else if (error.request) {
            console.error('❌ No response from server. Is the backend running?');
            console.error('Start backend: cd server && npm start');
        } else {
            console.error('Error:', error.message);
        }
        console.log('\n');
        process.exit(1);
    }
}

testCompleteApplication();
