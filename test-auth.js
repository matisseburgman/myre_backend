// Simple test script for authentication endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAuth() {
    console.log('🧪 Testing Authentication Endpoints...\n');

    try {
        // Test 1: Register a new user
        console.log('1️⃣ Testing user registration...');
        const registerData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        };

        const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
        console.log('✅ Registration successful:', registerResponse.data.message);
        console.log('📧 User email:', registerResponse.data.user.email);
        console.log('🔑 Token received:', registerResponse.data.token ? 'Yes' : 'No');
        console.log('');

        const token = registerResponse.data.token;

        // Test 2: Login with the same user
        console.log('2️⃣ Testing user login...');
        const loginData = {
            email: 'test@example.com',
            password: 'password123'
        };

        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
        console.log('✅ Login successful:', loginResponse.data.message);
        console.log('📧 User email:', loginResponse.data.user.email);
        console.log('🔑 Token received:', loginResponse.data.token ? 'Yes' : 'No');
        console.log('');

        // Test 3: Validate token
        console.log('3️⃣ Testing token validation...');
        const validateResponse = await axios.get(`${BASE_URL}/auth/validate`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Token validation successful');
        console.log('👤 User info:', validateResponse.data.name, validateResponse.data.email);
        console.log('');

        // Test 4: Get user profile
        console.log('4️⃣ Testing get profile...');
        const profileResponse = await axios.get(`${BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Profile retrieval successful');
        console.log('👤 Profile:', profileResponse.data.name, profileResponse.data.email);
        console.log('');

        console.log('🎉 All authentication tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        
        if (error.response?.status === 400 && error.response?.data?.error === 'USER_EXISTS') {
            console.log('ℹ️  User already exists, trying login instead...');
            
            try {
                const loginData = {
                    email: 'test@example.com',
                    password: 'password123'
                };

                const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
                console.log('✅ Login successful:', loginResponse.data.message);
                console.log('🔑 Token received:', loginResponse.data.token ? 'Yes' : 'No');
                
            } catch (loginError) {
                console.error('❌ Login also failed:', loginError.response?.data || loginError.message);
            }
        }
    }
}

// Run the test
testAuth();
