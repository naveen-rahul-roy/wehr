import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

async function testDepartmentAPI() {
  try {
    console.log('🔍 Testing Department API endpoints...\n');

    // Test GET departments (this should work without auth for testing)
    console.log('1. Testing GET /api/departments');
    try {
      const response = await axios.get(`${API_BASE}/departments`);
      console.log('✅ GET departments successful');
      console.log('📋 Current departments:', response.data.length);
      response.data.forEach((dept, index) => {
        console.log(`   ${index + 1}. ${dept.name}`);
      });
    } catch (error) {
      console.log('❌ GET departments failed:', error.response?.status, error.response?.data?.message || error.message);
    }

    console.log('\n2. Testing POST /api/departments (without auth - should fail)');
    try {
      const response = await axios.post(`${API_BASE}/departments`, {
        name: 'Naveen Department',
        managerId: null
      });
      console.log('✅ POST department successful (unexpected!)');
    } catch (error) {
      console.log('❌ POST department failed (expected):', error.response?.status, error.response?.data?.message || error.message);
      
      if (error.response?.status === 401) {
        console.log('🔒 This is expected - authentication required');
      }
    }

  } catch (error) {
    console.error('❌ General error:', error.message);
  }
}

testDepartmentAPI();