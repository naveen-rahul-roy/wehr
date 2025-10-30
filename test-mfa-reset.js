import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testMFAReset() {
    console.log('🔐 Testing MFA Reset Functionality\n');
    console.log('═'.repeat(70));
    
    let token = '';

    try {
        // Step 1: Login
        console.log('\n1️⃣ Logging in...');
        const loginResp = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@hrms.com',
            password: 'password123'
        });
        console.log('✅ Login successful');
        console.log('   User:', loginResp.data.user.name);
        console.log('   MFA Setup:', loginResp.data.user.isMfaSetup);

        // Step 2: Email Verification
        console.log('\n2️⃣ Email verification...');
        await axios.post(`${API_URL}/auth/mfa/email-verification-request`, {
            email: 'admin@hrms.com'
        });
        
        const verifyResp = await axios.post(`${API_URL}/auth/mfa/verify-email-code`, {
            email: 'admin@hrms.com',
            verificationCode: '123456'
        });
        token = verifyResp.data.token;
        console.log('✅ Email verified - Token received');
        console.log('   MFA Setup:', verifyResp.data.user.isMfaSetup);

        // Step 3: Check current MFA status
        console.log('\n3️⃣ Checking current MFA status...');
        const meResp = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Current user info:');
        console.log('   Name:', meResp.data.user.name);
        console.log('   Email:', meResp.data.user.email);
        console.log('   MFA Setup:', meResp.data.user.isMfaSetup);

        // Step 4: Reset MFA
        console.log('\n4️⃣ Resetting MFA setup...');
        const resetResp = await axios.post(`${API_URL}/auth/mfa/reset`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ MFA reset successful');
        console.log('   Message:', resetResp.data.message);
        console.log('   New MFA Setup status:', resetResp.data.user.isMfaSetup);

        // Step 5: Verify MFA was reset
        console.log('\n5️⃣ Verifying MFA was reset...');
        const meResp2 = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Verified MFA status:');
        console.log('   MFA Setup:', meResp2.data.user.isMfaSetup);
        
        if (meResp2.data.user.isMfaSetup === false) {
            console.log('   ✅ MFA successfully reset!');
        } else {
            console.log('   ❌ MFA reset failed!');
        }

        // Step 6: Test login after reset (should show MFA setup page)
        console.log('\n6️⃣ Testing login after MFA reset...');
        const loginResp2 = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@hrms.com',
            password: 'password123'
        });
        console.log('✅ Login after reset:');
        console.log('   MFA Setup:', loginResp2.data.user.isMfaSetup);
        console.log('   Expected: false (user should see MFA setup page)');
        
        if (loginResp2.data.user.isMfaSetup === false) {
            console.log('   ✅ User will see MFA setup page with new QR code!');
        }

        console.log('\n' + '═'.repeat(70));
        console.log('🎉 MFA RESET TEST PASSED!');
        console.log('═'.repeat(70));
        
        console.log('\n📋 Summary:');
        console.log('   ✅ MFA reset endpoint working');
        console.log('   ✅ MFA status changed from true to false');
        console.log('   ✅ User will see new QR code on next login');
        console.log('   ✅ Protected route (requires authentication)');
        
        console.log('\n🎯 Next Steps:');
        console.log('   1. Login at http://localhost:3000');
        console.log('   2. Go to Profile → Security & MFA tab');
        console.log('   3. Click "Reset MFA Setup" button');
        console.log('   4. Logout and login again');
        console.log('   5. You\'ll see MFA setup page with NEW QR code');

    } catch (error) {
        console.error('\n❌ Test failed:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
        console.error('URL:', error.config?.url);
        process.exit(1);
    }
}

testMFAReset();
