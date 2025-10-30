// Comprehensive test for all CRUD operations
import axios from 'axios';
import speakeasy from 'speakeasy';

const API_BASE = 'http://localhost:5000/api';

async function authenticateAdmin() {
  // Login
  const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
    email: 'admin@hrms.com',
    password: 'password123'
  });
  
  // MFA verification
  const mfaToken = speakeasy.totp({
    secret: 'MJXGI5TWGFIVQTCAOVNGWWRUNZUXWURZEVLXQLTIINUCMYKTPVZA',
    encoding: 'base32'
  });
  
  const mfaResponse = await axios.post(`${API_BASE}/auth/mfa/verify`, {
    userId: loginResponse.data.user.id,
    token: mfaToken,
    isSetup: false
  });
  
  return mfaResponse.data.token;
}

async function testAllCRUDOperations() {
  try {
    console.log('🔍 Testing all CRUD operations...\n');
    
    const token = await authenticateAdmin();
    const headers = { Authorization: `Bearer ${token}` };
    
    // Test 1: Department CRUD
    console.log('1. Testing Department CRUD...');
    
    // Create
    const deptResponse = await axios.post(`${API_BASE}/departments`, {
      name: `Test Dept ${Date.now()}`,
      managerId: null
    }, { headers });
    console.log('✅ Department created:', deptResponse.data.name);
    
    // Read
    const allDepts = await axios.get(`${API_BASE}/departments`, { headers });
    console.log('✅ Departments loaded:', allDepts.data.length);
    
    // Update
    const updatedDept = await axios.put(`${API_BASE}/departments/${deptResponse.data._id}`, {
      name: `Updated ${deptResponse.data.name}`
    }, { headers });
    console.log('✅ Department updated:', updatedDept.data.name);
    
    // Delete
    await axios.delete(`${API_BASE}/departments/${deptResponse.data._id}`, { headers });
    console.log('✅ Department deleted');
    
    // Test 2: Employee CRUD
    console.log('\n2. Testing Employee CRUD...');
    
    // Get a department for the employee
    const departments = await axios.get(`${API_BASE}/departments`, { headers });
    const firstDept = departments.data[0];
    
    // Create Employee
    const empResponse = await axios.post(`${API_BASE}/employees`, {
      employeeId: `TEST${Date.now()}`,
      name: 'Test Employee',
      email: `test${Date.now()}@example.com`,
      phone: '1234567890',
      departmentId: firstDept._id,
      role: 'Test Role',
      joinDate: new Date().toISOString().split('T')[0],
      salary: 50000,
      password: 'password123'
    }, { headers });
    console.log('✅ Employee created:', empResponse.data.employee.name);
    
    // Read Employees
    const allEmps = await axios.get(`${API_BASE}/employees`, { headers });
    console.log('✅ Employees loaded:', allEmps.data.length);
    
    // Update Employee
    const updatedEmp = await axios.put(`${API_BASE}/employees/${empResponse.data.employee._id}`, {
      name: 'Updated Test Employee',
      salary: 55000
    }, { headers });
    console.log('✅ Employee updated:', updatedEmp.data.name);
    
    // Delete Employee
    await axios.delete(`${API_BASE}/employees/${empResponse.data.employee._id}`, { headers });
    console.log('✅ Employee deleted');
    
    // Test 3: Leave CRUD
    console.log('\n3. Testing Leave CRUD...');
    
    // Get an existing employee for leave request
    const employees = await axios.get(`${API_BASE}/employees`, { headers });
    const testEmployee = employees.data[0];
    
    if (testEmployee) {
      // Create Leave Request
      const leaveResponse = await axios.post(`${API_BASE}/leaves`, {
        employeeId: testEmployee._id,
        employeeName: testEmployee.name,
        leaveType: 'Annual',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reason: 'Test leave request'
      }, { headers });
      console.log('✅ Leave request created:', leaveResponse.data._id);
      
      // Read Leave Requests
      const allLeaves = await axios.get(`${API_BASE}/leaves`, { headers });
      console.log('✅ Leave requests loaded:', allLeaves.data.length);
      
      // Update Leave Request (approve)
      const updatedLeave = await axios.put(`${API_BASE}/leaves/${leaveResponse.data._id}`, {
        status: 'Approved'
      }, { headers });
      console.log('✅ Leave request approved:', updatedLeave.data.status);
      
      // Delete Leave Request
      await axios.delete(`${API_BASE}/leaves/${leaveResponse.data._id}`, { headers });
      console.log('✅ Leave request deleted');
    }
    
    // Test 4: Attendance CRUD
    console.log('\n4. Testing Attendance CRUD...');
    
    // Read Attendance
    const allAttendance = await axios.get(`${API_BASE}/attendance`, { headers });
    console.log('✅ Attendance records loaded:', allAttendance.data.length);
    
    console.log('\n🎉 All CRUD operations working successfully!');
    console.log('📊 Summary:');
    console.log('   ✅ Departments: Create, Read, Update, Delete');
    console.log('   ✅ Employees: Create, Read, Update, Delete');
    console.log('   ✅ Leaves: Create, Read, Update, Delete');
    console.log('   ✅ Attendance: Read');
    
  } catch (error) {
    console.error('❌ CRUD test failed:', error.response?.data?.message || error.message);
    if (error.response?.status) {
      console.error('📊 Status:', error.response.status);
    }
  }
}

testAllCRUDOperations();