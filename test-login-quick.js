import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testLogin() {
    console.log('🧪 Testing Login...\n');

    try {
        // Test login
        console.log('📝 Attempting login with admin@hrms.com...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@hrms.com',
            password: 'password123'
        });

        console.log('✅ Login successful!');
        console.log('User:', loginResponse.data.user);
        console.log('MFA Setup:', loginResponse.data.user.isMfaSetup);

        if (loginResponse.data.token) {
            console.log('✅ Token received:', loginResponse.data.token.substring(0, 20) + '...');
        } else {
            console.log('⚠️ No token in response (MFA may be required)');
        }

    } catch (error) {
        console.error('❌ Login failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Message:', error.response.data.message || error.response.data);
        } else if (error.request) {
            console.error('❌ No response from server. Is the backend running?');
            console.error('Make sure to start the server with: cd server && npm start');
        } else {
            console.error('Error:', error.message);
        }
    }
}

testLogin();
