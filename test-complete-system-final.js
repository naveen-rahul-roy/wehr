import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
let authToken = '';
let testEmployeeId = '';
let testDepartmentId = '';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}\n${colors.cyan}${msg}${colors.reset}\n${colors.cyan}${'='.repeat(60)}${colors.reset}\n`)
};

// Test 1: Login
async function testLogin() {
  log.section('TEST 1: Authentication');
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@hrms.com',
      password: 'admin123'
    });
    
    authToken = response.data.token;
    log.success('Login successful');
    log.info(`Token: ${authToken.substring(0, 20)}...`);
    return true;
  } catch (error) {
    log.error(`Login failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 2: Create Department
async function testCreateDepartment() {
  log.section('TEST 2: Create Department');
  try {
    const response = await axios.post(
      `${API_URL}/departments`,
      {
        name: `Test Department ${Date.now()}`,
        managerId: null
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    testDepartmentId = response.data._id;
    log.success('Department created successfully');
    log.info(`Department ID: ${testDepartmentId}`);
    log.info(`Department Name: ${response.data.name}`);
    return true;
  } catch (error) {
    log.error(`Create department failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 3: Get All Departments
async function testGetDepartments() {
  log.section('TEST 3: Get All Departments');
  try {
    const response = await axios.get(`${API_URL}/departments`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    log.success(`Retrieved ${response.data.length} departments`);
    response.data.slice(0, 3).forEach(dept => {
      log.info(`  - ${dept.name} (ID: ${dept._id})`);
    });
    return true;
  } catch (error) {
    log.error(`Get departments failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 4: Update Department
async function testUpdateDepartment() {
  log.section('TEST 4: Update Department');
  try {
    const response = await axios.put(
      `${API_URL}/departments/${testDepartmentId}`,
      {
        name: `Updated Test Department ${Date.now()}`
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    log.success('Department updated successfully');
    log.info(`New Name: ${response.data.name}`);
    return true;
  } catch (error) {
    log.error(`Update department failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 5: Create Employee
async function testCreateEmployee() {
  log.section('TEST 5: Create Employee');
  try {
    const timestamp = Date.now();
    const response = await axios.post(
      `${API_URL}/employees`,
      {
        employeeId: `EMP${timestamp}`,
        name: `Test Employee ${timestamp}`,
        email: `test${timestamp}@company.com`,
        phone: '+1234567890',
        departmentId: testDepartmentId,
        role: 'Software Engineer',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        employeeType: 'Permanent',
        salary: 75000,
        password: 'password'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    testEmployeeId = response.data.employee._id;
    log.success('Employee created successfully');
    log.info(`Employee ID: ${testEmployeeId}`);
    log.info(`Employee Name: ${response.data.employee.name}`);
    log.info(`Temp Password: ${response.data.tempPassword}`);
    return true;
  } catch (error) {
    log.error(`Create employee failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 6: Get All Employees
async function testGetEmployees() {
  log.section('TEST 6: Get All Employees');
  try {
    const response = await axios.get(`${API_URL}/employees`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    log.success(`Retrieved ${response.data.length} employees`);
    response.data.slice(0, 3).forEach(emp => {
      log.info(`  - ${emp.name} (${emp.email})`);
    });
    return true;
  } catch (error) {
    log.error(`Get employees failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 7: Update Employee
async function testUpdateEmployee() {
  log.section('TEST 7: Update Employee');
  try {
    const response = await axios.put(
      `${API_URL}/employees/${testEmployeeId}`,
      {
        role: 'Senior Software Engineer',
        salary: 85000
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    log.success('Employee updated successfully');
    log.info(`New Role: ${response.data.role}`);
    log.info(`New Salary: $${response.data.salary}`);
    return true;
  } catch (error) {
    log.error(`Update employee failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 8: Create Leave Request
async function testCreateLeaveRequest() {
  log.section('TEST 8: Create Leave Request');
  try {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3);
    
    const response = await axios.post(
      `${API_URL}/leaves`,
      {
        employeeId: testEmployeeId,
        leaveType: 'Annual',
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        reason: 'Test leave request'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    log.success('Leave request created successfully');
    log.info(`Leave ID: ${response.data._id}`);
    log.info(`Days: ${response.data.days}`);
    log.info(`Status: ${response.data.status}`);
    return true;
  } catch (error) {
    log.error(`Create leave request failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 9: Get Leave Requests
async function testGetLeaveRequests() {
  log.section('TEST 9: Get Leave Requests');
  try {
    const response = await axios.get(`${API_URL}/leaves`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    log.success(`Retrieved ${response.data.length} leave requests`);
    response.data.slice(0, 3).forEach(leave => {
      log.info(`  - ${leave.employeeName}: ${leave.leaveType} (${leave.status})`);
    });
    return true;
  } catch (error) {
    log.error(`Get leave requests failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 10: Create Attendance Record
async function testCreateAttendance() {
  log.section('TEST 10: Create Attendance Record');
  try {
    const response = await axios.post(
      `${API_URL}/attendance`,
      {
        employeeId: testEmployeeId,
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
        clockIn: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    log.success('Attendance record created successfully');
    log.info(`Attendance ID: ${response.data._id}`);
    log.info(`Clock In: ${response.data.clockIn}`);
    return true;
  } catch (error) {
    log.error(`Create attendance failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 11: Get Attendance Records
async function testGetAttendance() {
  log.section('TEST 11: Get Attendance Records');
  try {
    const response = await axios.get(`${API_URL}/attendance`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    log.success(`Retrieved ${response.data.length} attendance records`);
    response.data.slice(0, 3).forEach(att => {
      log.info(`  - ${att.employeeId?.name || 'Unknown'}: ${att.status} (${att.date})`);
    });
    return true;
  } catch (error) {
    log.error(`Get attendance failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 12: Delete Employee
async function testDeleteEmployee() {
  log.section('TEST 12: Delete Employee');
  try {
    await axios.delete(`${API_URL}/employees/${testEmployeeId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    log.success('Employee deleted successfully');
    return true;
  } catch (error) {
    log.error(`Delete employee failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 13: Delete Department
async function testDeleteDepartment() {
  log.section('TEST 13: Delete Department');
  try {
    await axios.delete(`${API_URL}/departments/${testDepartmentId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    log.success('Department deleted successfully');
    return true;
  } catch (error) {
    log.error(`Delete department failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log(`\n${colors.cyan}${'='.repeat(60)}`);
  console.log('HRMS COMPLETE SYSTEM TEST');
  console.log(`${'='.repeat(60)}${colors.reset}\n`);
  
  const tests = [
    testLogin,
    testCreateDepartment,
    testGetDepartments,
    testUpdateDepartment,
    testCreateEmployee,
    testGetEmployees,
    testUpdateEmployee,
    testCreateLeaveRequest,
    testGetLeaveRequests,
    testCreateAttendance,
    testGetAttendance,
    testDeleteEmployee,
    testDeleteDepartment
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await test();
    if (result) {
      passed++;
    } else {
      failed++;
    }
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
  }
  
  log.section('TEST SUMMARY');
  log.success(`Passed: ${passed}/${tests.length}`);
  if (failed > 0) {
    log.error(`Failed: ${failed}/${tests.length}`);
  }
  
  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

runAllTests().catch(console.error);
