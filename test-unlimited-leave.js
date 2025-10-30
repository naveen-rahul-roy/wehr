/**
 * Test Script: Unlimited Leave Verification
 * 
 * This script verifies that the leave system now supports unlimited leave days
 * and that the validation has been properly removed.
 */

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

const log = (emoji, message, color = colors.reset) => {
    console.log(`${color}${emoji} ${message}${colors.reset}`);
};

async function testUnlimitedLeave() {
    console.log('\n' + '='.repeat(70));
    console.log('🧪 UNLIMITED LEAVE VERIFICATION TEST');
    console.log('='.repeat(70) + '\n');

    let authToken = null;
    let employeeId = null;

    try {
        // Step 1: Login
        log('🔐', 'Step 1: Logging in as employee...', colors.blue);
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'employee@hrms.com',
            password: 'password123'
        });
        authToken = loginResponse.data.token;
        employeeId = loginResponse.data.user.id;
        log('✅', 'Login successful', colors.green);

        // Step 2: Check leave balance
        log('📊', 'Step 2: Checking leave balance...', colors.blue);
        const balanceResponse = await axios.get(
            `${API_URL}/leaves/balance/${employeeId}`,
            { headers: { Authorization: `Bearer ${authToken}` } }
        );
        
        console.log('\n📋 Leave Balance:');
        balanceResponse.data.balances.forEach(balance => {
            const remaining = balance.total - balance.used - balance.pending;
            console.log(`   ${balance.type}: ${remaining}/${balance.total} days (Used: ${balance.used}, Pending: ${balance.pending})`);
            
            if (balance.total === 999) {
                log('✅', `${balance.type} has unlimited days (999)`, colors.green);
            } else {
                log('⚠️', `${balance.type} has limited days (${balance.total})`, colors.yellow);
            }
        });

        // Step 3: Request large number of leave days (should succeed)
        log('📝', 'Step 3: Requesting 30 days of Annual leave...', colors.blue);
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 10);
        const endDate = new Date(futureDate);
        endDate.setDate(endDate.getDate() + 29); // 30 days total

        const leaveRequest = {
            employeeId: employeeId,
            leaveType: 'Annual',
            startDate: futureDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            reason: 'Testing unlimited leave - requesting 30 days'
        };

        const createResponse = await axios.post(
            `${API_URL}/leaves`,
            leaveRequest,
            { headers: { Authorization: `Bearer ${authToken}` } }
        );

        if (createResponse.data) {
            log('✅', `Leave request created successfully! (${createResponse.data.days} days)`, colors.green);
            console.log(`   Leave ID: ${createResponse.data._id}`);
            console.log(`   Status: ${createResponse.data.status}`);
            
            // Clean up - delete the test leave request
            await axios.delete(
                `${API_URL}/leaves/${createResponse.data._id}`,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            log('🧹', 'Test leave request cleaned up', colors.blue);
        }

        // Step 4: Verify all leave types are unlimited
        log('🔍', 'Step 4: Verifying all leave types are unlimited...', colors.blue);
        const allUnlimited = balanceResponse.data.balances.every(b => b.total === 999);
        
        if (allUnlimited) {
            log('✅', 'All leave types have unlimited days!', colors.green);
        } else {
            log('❌', 'Some leave types still have limited days', colors.red);
        }

        console.log('\n' + '='.repeat(70));
        log('🎉', 'UNLIMITED LEAVE VERIFICATION COMPLETE', colors.green);
        console.log('='.repeat(70) + '\n');

    } catch (error) {
        console.error('\n' + '='.repeat(70));
        log('❌', 'TEST FAILED', colors.red);
        console.log('='.repeat(70));
        
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Message: ${error.response.data.message || error.response.data}`);
        } else {
            console.error(error.message);
        }
        console.log('\n');
        process.exit(1);
    }
}

// Run the test
testUnlimitedLeave();
