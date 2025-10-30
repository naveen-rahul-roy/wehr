// Simple test script to verify CRUD operations
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

async function testCRUD() {
  try {
    console.log('Testing API Health...');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check:', health.data);

    // Note: These endpoints require authentication
    // You'll need to login first to get a token
    console.log('\n📝 To test CRUD operations, you need to:');
    console.log('1. Start the frontend application');
    console.log('2. Login with valid credentials');
    console.log('3. The frontend will automatically include auth tokens');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCRUD();