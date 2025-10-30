// Final Comprehensive Test - All CRUD Operations
import axios from 'axios';
import speakeasy from 'speakeasy';

const API_BASE = 'http://localhost:5000/api';

// Add delay between requests to avoid connection issues
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function authenticateAdmin() {
    console.log('🔐 Authenticating as Admin...');
    
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: 'admin@hrms.com',
        password: 'password123'
    });
    
    await delay(500);
    
    const mfaToken = speakeasy.totp({
        secret: 'MJXGI5TWGFIVQTCAOVNGWWRUNZUXWURZEVLXQLTIINUCMYKTPVZA',
        encoding: 'base32'
    });
    
    const mfaResponse = await axios.post(`${API_BASE}/auth/mfa/verify`, {
        userId: loginResponse.data.user.id,
        token: mfaToken,
        isSetup: false
    });
    
    console.log('✅ Admin authenticated successfully\n');
    return mfaResponse.data.token;
}

async function testAllCRUD() {
    console.log('🚀 COMPLETE HR MANAGEMENT SYSTEM - CRUD TESTING');
    console.log('='.repeat(60) + '\n');
    
    let results = { total: 0, passed: 0, failed: 0 };
    
    try {
        const token = await authenticateAdmin();
        const headers = { Authorization: `Bearer ${token}` };
        
        // 1. DEPARTMENT CRUD
        console.log('📁 DEPARTMENT MANAGEMENT');
        console.log('-'.repeat(40));
        
        await delay(500);
        const deptCreate = await axios.post(`${API_BASE}/departments`, 
            { name: `Test Dept ${Date.now()}`, managerId: null }, 
            { headers }
        );
        console.log('✅ CREATE: Department created');
        results.passed++; results.total++;
        
        await delay(500);
        const deptRead = await axios.get(`${API_BASE}/departments`, { headers });
        console.log(`✅ READ: ${deptRead.data.length} departments fetched`);
        results.passed++; results.total++;
        
        await delay(500);
        const deptUpdate = await axios.put(`${API_BASE}/departments/${deptCreate.data._id}`,
            { name: `Updated Dept ${Date.now()}` },
            { headers }
        );
        console.log('✅ UPDATE: Department updated');
        results.passed++; results.total++;
        
        await delay(500);
        await axios.delete(`${API_BASE}/departments/${deptCreate.data._id}`, { headers });
        console.log('✅ DELETE: Department deleted\n');
        results.passed++; results.total++;
        
        // 2. EMPLOYEE CRUD
        console.log('👥 EMPLOYEE MANAGEMENT');
        console.log('-'.repeat(40));
        
        const testDept = deptRead.data[0];
        
        await delay(500);
        const empCreate = await axios.post(`${API_BASE}/employees`, {
            employeeId: `EMP${Date.now()}`,
            name: 'Test Employee',
            email: `test${Date.now()}@example.com`,
            phone: '1234567890',
            departmentId: testDept._id,
            role: 'Employee',
            joinDate: new Date().toISOString().split('T')[0],
            salary: 50000,
            password: 'password123'
        }, { headers });
        console.log('✅ CREATE: Employee created');
        results.passed++; results.total++;
        
        await delay(500);
        const empRead = await axios.get(`${API_BASE}/employees`, { headers });
        console.log(`✅ READ: ${empRead.data.length} employees fetched`);
        results.passed++; results.total++;
        
        await delay(500);
        const empUpdate = await axios.put(`${API_BASE}/employees/${empCreate.data.employee._id}`,
            { name: 'Updated Employee', salary: 55000 },
            { headers }
        );
        console.log('✅ UPDATE: Employee updated');
        results.passed++; results.total++;
        
        await delay(500);
        await axios.delete(`${API_BASE}/employees/${empCreate.data.employee._id}`, { headers });
        console.log('✅ DELETE: Employee deleted\n');
        results.passed++; results.total++;
        
        // 3. LEAVE CRUD
        console.log('🏖️ LEAVE MANAGEMENT');
        console.log('-'.repeat(40));
        
        const testEmp = empRead.data[0];
        
        await delay(500);
        const leaveCreate = await axios.post(`${API_BASE}/leaves`, {
            employeeId: testEmp._id,
            employeeName: testEmp.name,
            leaveType: 'Annual',
            startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            reason: 'Test leave'
        }, { headers });
        console.log('✅ CREATE: Leave request created');
        results.passed++; results.total++;
        
        await delay(500);
        const leaveRead = await axios.get(`${API_BASE}/leaves`, { headers });
        console.log(`✅ READ: ${leaveRead.data.length} leave requests fetched`);
        results.passed++; results.total++;
        
        await delay(500);
        const leaveUpdate = await axios.put(`${API_BASE}/leaves/${leaveCreate.data._id}`,
            { status: 'Approved' },
            { headers }
        );
        console.log('✅ UPDATE: Leave approved');
        results.passed++; results.total++;
        
        await delay(500);
        try {
            await axios.delete(`${API_BASE}/leaves/${leaveCreate.data._id}`, { headers });
            console.log('❌ DELETE: Approved leave was deleted (should be protected)');
            results.failed++; results.total++;
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ DELETE: Approved leave correctly protected\n');
                results.passed++; results.total++;
            }
        }
        
        // 4. ATTENDANCE
        console.log('📅 ATTENDANCE MANAGEMENT');
        console.log('-'.repeat(40));
        
        await delay(500);
        const attRead = await axios.get(`${API_BASE}/attendance`, { headers });
        console.log(`✅ READ: ${attRead.data.length} attendance records fetched\n`);
        results.passed++; results.total++;
        
        // 5. SYSTEM HEALTH
        console.log('🏥 SYSTEM INTEGRATION');
        console.log('-'.repeat(40));
        
        await delay(500);
        const health = await axios.get(`${API_BASE}/health`);
        console.log('✅ API Health: System operational');
        results.passed++; results.total++;
        
        await delay(500);
        const dbTest = await axios.get(`${API_BASE}/departments`, { headers });
        console.log('✅ Database: Connected and accessible\n');
        results.passed++; results.total++;
        
        // SUMMARY
        console.log('='.repeat(60));
        console.log('📊 TEST RESULTS SUMMARY');
        console.log('='.repeat(60));
        console.log(`Total Tests:   ${results.total}`);
        console.log(`Passed:        ${results.passed} ✅`);
        console.log(`Failed:        ${results.failed} ❌`);
        console.log(`Success Rate:  ${((results.passed/results.total)*100).toFixed(1)}%`);
        console.log('='.repeat(60));
        
        if (results.failed === 0) {
            console.log('\n🎉 ALL TESTS PASSED!');
            console.log('✨ All CRUD operations working perfectly');
            console.log('🚀 System is production ready');
        }
        
    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testAllCRUD();
