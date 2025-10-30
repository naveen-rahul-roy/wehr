// Test to see the exact login response format
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

async function testLoginResponse() {
  try {
    console.log('🔍 Testing login response format...\n');

    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@hrms.com',
      password: 'password123'
    });

    console.log('✅ Login successful');
    console.log('📋 Response structure:');
    console.log(JSON.stringify(response.data, null, 2));

    console.log('\n🔍 User object properties:');
    const user = response.data.user;
    console.log('- id:', user.id);
    console.log('- name:', user.name);
    console.log('- email:', user.email);
    console.log('- role:', user.role);
    console.log('- avatarUrl:', user.avatarUrl);
    console.log('- isMfaSetup:', user.isMfaSetup);

  } catch (error) {
    console.error('❌ Login failed:', error.response?.data?.message || error.message);
  }
}

testLoginResponse();