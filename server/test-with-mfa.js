import axios from 'axios';
import speakeasy from 'speakeasy';

const API_BASE = 'http://localhost:5000/api';

async function testWithMFA() {
  try {
    console.log('🔍 Testing complete MFA authentication flow...\n');

    // Step 1: Login (this will return user info but no token)
    console.log('1. Initial login...');
    let userId = null;
    
    try {
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: 'admin@hrms.com',
        password: 'password123'
      });
      
      userId = loginResponse.data.user.id;
      console.log('✅ Initial login successful');
      console.log('👤 User:', loginResponse.data.user.name);
      console.log('🔐 MFA Setup:', loginResponse.data.user.isMfaSetup);
      
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data?.message || error.message);
      return;
    }

    // Step 2: Generate MFA token using the secret from seed data
    console.log('\n2. Generating MFA token...');
    const mfaSecret = 'JBSWY3DPEHPK3PXP'; // From seed data for admin user
    
    const mfaToken = speakeasy.totp({
      secret: mfaSecret,
      encoding: 'base32'
    });
    
    console.log('🔑 Generated MFA token:', mfaToken);

    // Step 3: Verify MFA and get JWT token
    console.log('\n3. Verifying MFA...');
    let jwtToken = null;
    
    try {
      const mfaResponse = await axios.post(`${API_BASE}/auth/mfa/verify`, {
        userId: userId,
        token: mfaToken,
        isSetup: false // Not initial setup
      });
      
      jwtToken = mfaResponse.data.token;
      console.log('✅ MFA verification successful');
      console.log('🎫 JWT token received');
      
    } catch (error) {
      console.log('❌ MFA verification failed:', error.response?.data?.message || error.message);
      return;
    }

    // Step 4: Test authenticated API calls
    console.log('\n4. Testing authenticated department operations...');
    
    // Get current departments
    try {
      const deptResponse = await axios.get(`${API_BASE}/departments`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      
      console.log('✅ Current departments:');
      deptResponse.data.forEach((dept, index) => {
        console.log(`   ${index + 1}. ${dept.name} (ID: ${dept._id})`);
      });
      
    } catch (error) {
      console.log('❌ Failed to get departments:', error.response?.data?.message || error.message);
      return;
    }

    // Create "Naveen Department"
    console.log('\n5. Creating "Naveen Department"...');
    try {
      const createResponse = await axios.post(`${API_BASE}/departments`, {
        name: 'Naveen Department',
        managerId: null
      }, {
        headers: { Authorization: `Bearer ${jwtToken}` }
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

    // Verify the department was created
    console.log('\n6. Final verification...');
    try {
      const verifyResponse = await axios.get(`${API_BASE}/departments`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      
      const naveenDept = verifyResponse.data.find(dept => dept.name === 'Naveen Department');
      if (naveenDept) {
        console.log('✅ "Naveen Department" confirmed in database!');
        console.log('📋 Final department count:', verifyResponse.data.length);
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

testWithMFA();