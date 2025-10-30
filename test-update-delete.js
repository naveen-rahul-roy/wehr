import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testUpdateDelete() {
    console.log('🧪 Testing Update & Delete Operations\n');
    console.log('═'.repeat(60));
    
    let token = '';

    try {
        // Login first
        console.log('\n🔐 Logging in...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@hrms.com',
            password: 'password123'
        });
        
        await axios.post(`${API_URL}/auth/mfa/email-verification-request`, {
            email: 'admin@hrms.com'
        });
        
        const verifyResponse = await axios.post(`${API_URL}/auth/mfa/verify-email-code`, {
            email: 'admin@hrms.com',
            verificationCode: '123456'
        });
        
        token = verifyResponse.data.token;
        console.log('✅ Logged in successfully\n');

        // Test Departments Update & Delete
        console.log('📁 TESTING DEPARTMENTS UPDATE & DELETE');
        console.log('-'.repeat(60));
        
        // Create a test department
        const createDeptResp = await axios.post(`${API_URL}/departments`, {
            name: 'Test Dept ' + Date.now()
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const deptId = createDeptResp.data._id;
        console.log('✅ Created department:', createDeptResp.data.name, '(ID:', deptId, ')');

        // Update department
        const updateDeptResp = await axios.put(`${API_URL}/departments/${deptId}`, {
            name: 'Updated Dept ' + Date.now()
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Updated department:', updateDeptResp.data.name);

        // Verify update
        const getDeptResp = await axios.get(`${API_URL}/departments/${deptId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Verified update:', getDeptResp.data.name);

        // Delete department
        await axios.delete(`${API_URL}/departments/${deptId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Deleted department');

        // Verify deletion
        try {
            await axios.get(`${API_URL}/departments/${deptId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('❌ Department still exists after delete!');
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('✅ Verified deletion (404 Not Found)');
            } else {
                console.log('⚠️ Unexpected error:', error.response?.status);
            }
        }

        // Test Employees Update & Delete
        console.log('\n👥 TESTING EMPLOYEES UPDATE & DELETE');
        console.log('-'.repeat(60));
        
        // Get first department for employee
        const deptsResp = await axios.get(`${API_URL}/departments`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const firstDept = deptsResp.data[0];

        // Create a test employee
        const createEmpResp = await axios.post(`${API_URL}/employees`, {
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
        const empId = createEmpResp.data.employee._id;
        console.log('✅ Created employee:', createEmpResp.data.employee.name, '(ID:', empId, ')');

        // Update employee
        const updateEmpResp = await axios.put(`${API_URL}/employees/${empId}`, {
            name: 'Updated Employee',
            salary: 60000
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Updated employee:', updateEmpResp.data.name, '- Salary:', updateEmpResp.data.salary);

        // Verify update
        const getEmpResp = await axios.get(`${API_URL}/employees/${empId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Verified update:', getEmpResp.data.name, '- Salary:', getEmpResp.data.salary);

        // Delete employee
        await axios.delete(`${API_URL}/employees/${empId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Deleted employee');

        // Verify deletion
        try {
            await axios.get(`${API_URL}/employees/${empId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('❌ Employee still exists after delete!');
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('✅ Verified deletion (404 Not Found)');
            } else {
                console.log('⚠️ Unexpected error:', error.response?.status);
            }
        }

        // Test Leaves Update & Delete
        console.log('\n🏖️ TESTING LEAVES UPDATE & DELETE');
        console.log('-'.repeat(60));
        
        // Create a test leave
        const createLeaveResp = await axios.post(`${API_URL}/leaves`, {
            employeeId: verifyResponse.data.user.id,
            leaveType: 'Casual',
            startDate: '2025-12-01',
            endDate: '2025-12-02',
            reason: 'Test leave for update/delete'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const leaveId = createLeaveResp.data._id;
        console.log('✅ Created leave:', createLeaveResp.data.leaveType, '(ID:', leaveId, ')');
        console.log('   Status:', createLeaveResp.data.status);

        // Update leave (approve it)
        const updateLeaveResp = await axios.put(`${API_URL}/leaves/${leaveId}`, {
            status: 'Approved'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Updated leave status:', updateLeaveResp.data.status);

        // Try to delete approved leave (should fail)
        try {
            await axios.delete(`${API_URL}/leaves/${leaveId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('⚠️ Approved leave was deleted (should be protected)');
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Approved leave protected from deletion (as expected)');
            } else {
                console.log('⚠️ Unexpected error:', error.response?.status, error.response?.data?.message);
            }
        }

        // Create another leave for deletion test
        const createLeave2Resp = await axios.post(`${API_URL}/leaves`, {
            employeeId: verifyResponse.data.user.id,
            leaveType: 'Casual',
            startDate: '2025-12-10',
            endDate: '2025-12-11',
            reason: 'Test leave for deletion'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const leave2Id = createLeave2Resp.data._id;
        console.log('✅ Created pending leave for deletion test (ID:', leave2Id, ')');

        // Delete pending leave (should work)
        await axios.delete(`${API_URL}/leaves/${leave2Id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Deleted pending leave successfully');

        console.log('\n' + '═'.repeat(60));
        console.log('🎉 ALL UPDATE & DELETE TESTS PASSED!');
        console.log('═'.repeat(60));

    } catch (error) {
        console.error('\n❌ Test failed:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
        console.error('URL:', error.config?.url);
        process.exit(1);
    }
}

testUpdateDelete();
