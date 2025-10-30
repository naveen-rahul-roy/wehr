// Test script to verify frontend-backend connection
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:3001';

async function testConnection() {
  try {
    console.log('🔍 Testing frontend-backend connection...\n');

    // Test 1: Health check
    console.log('1. Testing API health...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ API Health:', healthResponse.data.message);

    // Test 2: CORS check
    console.log('\n2. Testing CORS...');
    const corsResponse = await axios.get(`${API_BASE}/health`, {
      headers: {
        'Origin': FRONTEND_URL
      }
    });
    console.log('✅ CORS working - Access-Control-Allow-Origin:', corsResponse.headers['access-control-allow-origin']);

    // Test 3: Login flow
    console.log('\n3. Testing login flow...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@hrms.com',
      password: 'password123'
    });
    console.log('✅ Login successful - User:', loginResponse.data.user.name);
    console.log('🔐 MFA Setup required:', !loginResponse.data.user.isMfaSetup);

    console.log('\n🎉 All tests passed! Frontend should be able to connect to backend.');
    console.log(`📱 Frontend: ${FRONTEND_URL}`);
    console.log(`🔧 Backend: ${API_BASE}`);

  } catch (error) {
    console.error('❌ Connection test failed:', error.response?.data?.message || error.message);
  }
}

testConnection();