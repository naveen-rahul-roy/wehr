// Simple employee creation test
import axios from 'axios';
import speakeasy from 'speakeasy';

const API_BASE = 'http://localhost:5000/api';

async function testEmployeeCreation() {
  try {
    console.log('🔍 Testing Employee Creation...\n');
    
    // Authenticate
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
    
    const headers = { Authorization: `Bearer ${mfaResponse.data.token}` };
    
    // Get departments
    const departments = await axios.get(`${API_BASE}/departments`, { headers });
    console.log('Available departments:', departments.data.length);
    
    if (departments.data.length === 0) {
      console.log('❌ No departments available for employee creation');
      return;
    }
    
    const testDept = departments.data[0];
    console.log('Using department:', testDept.name, '(ID:', testDept._id, ')');
    
    // Simple employee data
    const empData = {
      employeeId: `SIMPLE${Date.now()}`,
      name: 'Simple Test Employee',
      email: `simple${Date.now()}@test.com`,
      phone: '1234567890',
      departmentId: testDept._id,
      role: 'Employee',
      joinDate: '2024-01-01',
      salary: 50000
    };
    
    console.log('Creating employee with data:', JSON.stringify(empData, null, 2));
    
    const empResponse = await axios.post(`${API_BASE}/employees`, empData, { headers });
    console.log('✅ Employee created successfully:', empResponse.data.employee.name);
    
  } catch (error) {
    console.error('❌ Employee creation failed:', error.response?.data || error.message);
    if (error.response?.status) {
      console.error('Status:', error.response.status);
    }
  }
}

testEmployeeCreation();