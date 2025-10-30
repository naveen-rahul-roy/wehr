import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

async function testFullFlow() {
  try {
    console.log('🔍 Testing complete authentication and department creation flow...\n');

    // Step 1: Login as admin
    console.log('1. Logging in as admin...');
    let token = null;
    
    try {
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: 'admin@hrms.com',
        password: 'password123' // Default password from seed data
      });
      
      token = loginResponse.data.token;
      console.log('✅ Login successful');
      console.log('👤 User:', loginResponse.data.user.name, '- Role:', loginResponse.data.user.role);
      
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data?.message || error.message);
      console.log('💡 Try these default credentials:');
      console.log('   - admin@hrms.com / password123');
      console.log('   - hr@hrms.com / password123');
      return;
    }

    // Step 2: Get current departments
    console.log('\n2. Getting current departments...');
    try {
      const deptResponse = await axios.get(`${API_BASE}/departments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Current departments:');
      deptResponse.data.forEach((dept, index) => {
        console.log(`   ${index + 1}. ${dept.name} (ID: ${dept._id})`);
      });
      
    } catch (error) {
      console.log('❌ Failed to get departments:', error.response?.data?.message || error.message);
    }

    // Step 3: Create "Naveen Department"
    console.log('\n3. Creating "Naveen Department"...');
    try {
      const createResponse = await axios.post(`${API_BASE}/departments`, {
        name: 'Naveen Department',
        managerId: null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Successfully created "Naveen Department"!');
      console.log('📋 Department details:', {
        id: createResponse.data._id,
        name: createResponse.data.name,
        createdAt: createResponse.data.createdAt
      });
      
    } catch (error) {
      console.log('❌ Failed to create department:', error.response?.data?.message || error.message);
      
      if (error.response?.data?.message === 'Department already exists') {
        console.log('💡 "Naveen Department" already exists in the database');
      }
    }

    // Step 4: Verify the department was created
    console.log('\n4. Verifying department creation...');
    try {
      const verifyResponse = await axios.get(`${API_BASE}/departments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const naveenDept = verifyResponse.data.find(dept => dept.name === 'Naveen Department');
      if (naveenDept) {
        console.log('✅ "Naveen Department" found in database!');
        console.log('📋 Department ID:', naveenDept._id);
      } else {
        console.log('❌ "Naveen Department" not found in database');
      }
      
    } catch (error) {
      console.log('❌ Failed to verify department:', error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.error('❌ General error:', error.message);
  }
}

testFullFlow();