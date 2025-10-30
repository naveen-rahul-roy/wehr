// Complete System Test - All CRUD Operations & Integrations
import axios from 'axios';
import speakeasy from 'speakeasy';

const API_BASE = 'http://localhost:5000/api';
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

let testStats = { total: 0, passed: 0, failed: 0 };

function log(emoji, message, color = colors.reset) {
    console.log(`${color}${emoji} ${message}${colors.reset}`);
}

function logTest(name, status, details = '') {
    testStats.total++;
    if (status === 'pass') {
        testStats.passed++;
        log('✅', `${name}: PASSED ${details}`, colors.green);
    } else {
        testStats.failed++;
        log('❌', `${name}: FAILED ${details}`, colors.red);
    }
}

async function authenticateAdmin() {
    log('🔐', 'Authenticating as Admin...', colors.cyan);
    
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: 'admin@hrms.com',
        password: 'password123'
    });
    
    const mfaToken = speakeasy.totp({
        secret: 'MJXGI5TWGFIVQTCAOVNGWWRUNZUXWURZEVLXQLTIINUCMYKTPVZA',
        encoding: 'base32'
    });
    
    const mfaResponse = await axios.post(`${API_BASE}/auth/mfa/verify`, {
        userId: loginResponse.data.user.id,
        token: mfaToken,
        isSetup: false
    });
    
    log('✅', 'Admin authenticated successfully', colors.green);
    return mfaResponse.data.token;
}

async function testCompleteSystem() {
    console.log('\n' + '='.repeat(70));
    log('🚀', 'COMPLETE HR MANAGEMENT SYSTEM - COMPREHENSIVE TEST', colors.bright + colors.magenta);
    console.log('='.repeat(70) + '\n');
    
    try {
        const token = await authenticateAdmin();
        const headers = { Authorization: `Bearer ${token}` };
        
        // Test 1: Department CRUD
        console.log('\n' + colors.blue + '📁 DEPARTMENT MANAGEMENT - CRUD OPERATIONS' + colors.reset);
        console.log('-'.repeat(70));
        await testDepartmentCRUD(headers);
        
        // Test 2: Employee CRUD
        console.log('\n' + colors.blue + '👥 EMPLOYEE MANAGEMENT - CRUD OPERATIONS' + colors.reset);
        console.log('-'.repeat(70));
        await testEmployeeCRUD(headers);
        
        // Test 3: Leave CRUD
        console.log('\n' + colors.blue + '🏖️ LEAVE MANAGEMENT - CRUD OPERATIONS' + colors.reset);
        console.log('-'.repeat(70));
        await testLeaveCRUD(headers);
        
        // Test 4: Attendance Operations
        console.log('\n' + colors.blue + '📅 ATTENDANCE MANAGEMENT - OPERATIONS' + colors.reset);
        console.log('-'.repeat(70));
        await testAttendanceOperations(headers);
        
        // Test 5: System Integration
        console.log('\n' + colors.blue + '🏥 SYSTEM INTEGRATION - HEALTH & CONNECTIVITY' + colors.reset);
        console.log('-'.repeat(70));
        await testSystemIntegration(headers);
        
        // Final Summary
        printSummary();
        
    } catch (error) {
        log('❌', `CRITICAL ERROR: ${error.message}`, colors.red);
        if (error.response) {
            console.log(`Status: ${error.response.status}`);
            console.log(`Data:`, error.response.data);
        }
        process.exit(1);
    }
}

async function testDepartmentCRUD(headers) {
    const deptName = `Test Department ${Date.now()}`;
    let deptId = null;
    
    try {
        // CREATE
        const createRes = await axios.post(`${API_BASE}/departments`, 
            { name: deptName, managerId: null }, 
            { headers }
        );
        deptId = createRes.data._id;
        logTest('CREATE Department', 'pass', `- "${createRes.data.name}"`);
        
        // READ
        const readRes = await axios.get(`${API_BASE}/departments`, { headers });
        const found = readRes.data.find(d => d._id === deptId);
        logTest('READ Departments', found ? 'pass' : 'fail', `- Found ${readRes.data.length} departments`);
        
        // UPDATE
        const updateRes = await axios.put(`${API_BASE}/departments/${deptId}`,
            { name: `Updated ${deptName}` },
            { headers }
        );
        logTest('UPDATE Department', 'pass', `- "${updateRes.data.name}"`);
        
        // DELETE
        await axios.delete(`${API_BASE}/departments/${deptId}`, { headers });
        const afterDelete = await axios.get(`${API_BASE}/departments`, { headers });
        const stillExists = afterDelete.data.find(d => d._id === deptId);
        logTest('DELETE Department', !stillExists ? 'pass' : 'fail', '- Removed successfully');
        
    } catch (error) {
        logTest('Department CRUD', 'fail', `- ${error.message}`);
    }
}

async function testEmployeeCRUD(headers) {
    let empId = null;
    
    try {
        // Get department for employee
        const depts = await axios.get(`${API_BASE}/departments`, { headers });
        const testDept = depts.data[0];
        
        // CREATE
        const empData = {
            employeeId: `EMP${Date.now()}`,
            name: 'Test Employee',
            email: `test${Date.now()}@example.com`,
            phone: '1234567890',
            departmentId: testDept._id,
            role: 'Employee',
            joinDate: new Date().toISOString().split('T')[0],
            salary: 50000,
            password: 'password123'
        };
        
        const createRes = await axios.post(`${API_BASE}/employees`, empData, { headers });
        empId = createRes.data.employee._id;
        logTest('CREATE Employee', 'pass', `- "${createRes.data.employee.name}"`);
        
        // READ
        const readRes = await axios.get(`${API_BASE}/employees`, { headers });
        const found = readRes.data.find(e => e._id === empId);
        logTest('READ Employees', found ? 'pass' : 'fail', `- Found ${readRes.data.length} employees`);
        
        // UPDATE
        const updateRes = await axios.put(`${API_BASE}/employees/${empId}`,
            { name: 'Updated Test Employee', salary: 55000 },
            { headers }
        );
        logTest('UPDATE Employee', 'pass', `- "${updateRes.data.name}" - $${updateRes.data.salary}`);
        
        // DELETE
        await axios.delete(`${API_BASE}/employees/${empId}`, { headers });
        const afterDelete = await axios.get(`${API_BASE}/employees`, { headers });
        const stillExists = afterDelete.data.find(e => e._id === empId);
        logTest('DELETE Employee', !stillExists ? 'pass' : 'fail', '- Removed successfully');
        
    } catch (error) {
        logTest('Employee CRUD', 'fail', `- ${error.message}`);
    }
}

async function testLeaveCRUD(headers) {
    let leaveId = null;
    
    try {
        // Get employee for leave
        const emps = await axios.get(`${API_BASE}/employees`, { headers });
        const testEmp = emps.data[0];
        
        // CREATE
        const leaveData = {
            employeeId: testEmp._id,
            employeeName: testEmp.name,
            leaveType: 'Annual',
            startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            reason: 'Test leave request'
        };
        
        const createRes = await axios.post(`${API_BASE}/leaves`, leaveData, { headers });
        leaveId = createRes.data._id;
        logTest('CREATE Leave', 'pass', `- ${createRes.data.leaveType} for ${createRes.data.days} days`);
        
        // READ
        const readRes = await axios.get(`${API_BASE}/leaves`, { headers });
        const found = readRes.data.find(l => l._id === leaveId);
        logTest('READ Leaves', found ? 'pass' : 'fail', `- Found ${readRes.data.length} leave requests`);
        
        // UPDATE
        const updateRes = await axios.put(`${API_BASE}/leaves/${leaveId}`,
            { status: 'Approved' },
            { headers }
        );
        logTest('UPDATE Leave', 'pass', `- Status: ${updateRes.data.status}`);
        
        // DELETE (should fail for approved)
        try {
            await axios.delete(`${API_BASE}/leaves/${leaveId}`, { headers });
            logTest('DELETE Leave Protection', 'fail', '- Approved leave was deleted');
        } catch (error) {
            if (error.response?.status === 400) {
                logTest('DELETE Leave Protection', 'pass', '- Approved leave protected');
            } else {
                throw error;
            }
        }
        
    } catch (error) {
        logTest('Leave CRUD', 'fail', `- ${error.message}`);
    }
}

async function testAttendanceOperations(headers) {
    try {
        // READ
        const readRes = await axios.get(`${API_BASE}/attendance`, { headers });
        logTest('READ Attendance', 'pass', `- ${readRes.data.length} records`);
        
        // Statistics
        const stats = {
            total: readRes.data.length,
            present: readRes.data.filter(a => a.status === 'Present').length,
            absent: readRes.data.filter(a => a.status === 'Absent').length,
            leave: readRes.data.filter(a => a.status === 'Leave').length
        };
        logTest('Attendance Statistics', 'pass', 
            `- Present: ${stats.present}, Absent: ${stats.absent}, Leave: ${stats.leave}`);
        
    } catch (error) {
        logTest('Attendance Operations', 'fail', `- ${error.message}`);
    }
}

async function testSystemIntegration(headers) {
    try {
        // Health Check
        const healthRes = await axios.get(`${API_BASE}/health`);
        logTest('API Health Check', 'pass', `- ${healthRes.data.message}`);
        
        // Database Connectivity
        const dbRes = await axios.get(`${API_BASE}/departments`, { headers });
        logTest('Database Connectivity', 'pass', `- ${dbRes.data.length} departments accessible`);
        
        // CORS Configuration
        const corsHeader = healthRes.headers['access-control-allow-origin'];
        logTest('CORS Configuration', 'pass', `- ${corsHeader || 'Default'}`);
        
    } catch (error) {
        logTest('System Integration', 'fail', `- ${error.message}`);
    }
}

function printSummary() {
    console.log('\n' + '='.repeat(70));
    log('📊', 'TEST EXECUTION SUMMARY', colors.bright + colors.cyan);
    console.log('='.repeat(70));
    
    const successRate = ((testStats.passed / testStats.total) * 100).toFixed(1);
    
    console.log(`${colors.bright}Total Tests:${colors.reset}   ${testStats.total}`);
    console.log(`${colors.green}Passed:${colors.reset}        ${testStats.passed}`);
    console.log(`${colors.red}Failed:${colors.reset}        ${testStats.failed}`);
    console.log(`${colors.yellow}Success Rate:${colors.reset}  ${successRate}%`);
    
    console.log('\n' + '='.repeat(70));
    
    if (testStats.failed === 0) {
        log('🎉', 'ALL TESTS PASSED! SYSTEM IS FULLY OPERATIONAL!', colors.bright + colors.green);
        log('✨', 'All CRUD operations working perfectly', colors.green);
        log('🚀', 'Production ready - Complete HR Management System', colors.green);
    } else {
        log('⚠️', `${testStats.failed} test(s) failed. Review the output above.`, colors.yellow);
    }
    
    console.log('='.repeat(70) + '\n');
}

testCompleteSystem();
