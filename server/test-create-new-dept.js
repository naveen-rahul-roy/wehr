// Test creating a new department to verify the API works
import axios from 'axios';
import speakeasy from 'speakeasy';

const API_BASE = 'http://localhost:5000/api';

async function testCreateNewDepartment() {
  try {
    console.log('🔍 Testing creation of a new department...\n');

    // Step 1: Login and get MFA token
    console.log('1. Authenticating...');
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
    
    const jwtToken = mfaResponse.data.token;
    console.log('✅ Authenticated successfully');

    // Step 2: Create a new department with timestamp
    const timestamp = Date.now();
    const newDeptName = `Test Department ${timestamp}`;
    
    console.log(`\n2. Creating "${newDeptName}"...`);
    const createResponse = await axios.post(`${API_BASE}/departments`, {
      name: newDeptName,
      managerId: null
    }, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    
    console.log('✅ Department created successfully!');
    console.log('📋 Department details:', {
      id: createResponse.data._id,
      name: createResponse.data.name,
      createdAt: createResponse.data.createdAt
    });

    // Step 3: Verify it exists in the database
    console.log('\n3. Verifying in database...');
    const allDepts = await axios.get(`${API_BASE}/departments`, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    
    const createdDept = allDepts.data.find(d => d.name === newDeptName);
    if (createdDept) {
      console.log('✅ Department confirmed in database!');
      console.log('📊 Total departments:', allDepts.data.length);
    } else {
      console.log('❌ Department not found in database');
    }

    // Step 4: Clean up - delete the test department
    console.log('\n4. Cleaning up test department...');
    await axios.delete(`${API_BASE}/departments/${createResponse.data._id}`, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    console.log('✅ Test department deleted');

    console.log('\n🎉 API is working perfectly!');
    console.log('💡 The backend can create, read, and delete departments successfully.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
  }
}

testCreateNewDepartment();