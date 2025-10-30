// Debug script to test frontend login exactly as the browser would
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

async function debugFrontendLogin() {
  try {
    console.log('🔍 Testing frontend login simulation...\n');
    
    // Create axios instance exactly like the frontend
    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    console.log('📡 API Base URL:', API_BASE_URL);
    console.log('🔑 Attempting login with admin credentials...');

    const response = await api.post('/auth/login', {
      email: 'admin@hrms.com',
      password: 'password123'
    });

    console.log('✅ Login successful!');
    console.log('👤 User:', response.data.user.name);
    console.log('📧 Email:', response.data.user.email);
    console.log('🔐 MFA Setup:', response.data.user.isMfaSetup);
    console.log('🆔 User ID:', response.data.user.id);

    console.log('\n🎉 Frontend login should work!');
    console.log('💡 If it\'s still failing, check browser console for errors.');

  } catch (error) {
    console.error('❌ Login failed:', error.message);
    
    if (error.response) {
      console.error('📊 Response status:', error.response.status);
      console.error('📝 Response data:', error.response.data);
    } else if (error.request) {
      console.error('📡 No response received:', error.request);
    } else {
      console.error('⚙️ Request setup error:', error.message);
    }
  }
}

debugFrontendLogin();