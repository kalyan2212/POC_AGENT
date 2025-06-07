#!/usr/bin/env node

const http = require('http');

function testEndpoint(port, path, description) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: port,
            path: path,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    description,
                    status: res.statusCode,
                    success: res.statusCode === 200,
                    data: data
                });
            });
        });

        req.on('error', (err) => {
            resolve({
                description,
                status: 'ERROR',
                success: false,
                error: err.message
            });
        });

        req.setTimeout(2000, () => {
            req.destroy();
            resolve({
                description,
                status: 'TIMEOUT',
                success: false,
                error: 'Request timeout'
            });
        });

        req.end();
    });
}

async function runTests() {
    console.log('🧪 POC Agent Integration Tests');
    console.log('================================');
    
    // Test broken server endpoints
    console.log('\n📋 Testing broken server (expected failures):');
    const brokenTests = [
        testEndpoint(3001, '/health', 'Health check'),
        testEndpoint(3001, '/data', 'Data endpoint (broken path)'),
        testEndpoint(3001, '/api/data', 'API data endpoint (should fail)')
    ];
    
    for (const test of brokenTests) {
        const result = await test;
        const icon = result.success ? '✅' : '❌';
        console.log(`${icon} ${result.description}: ${result.status}`);
        if (result.error) {
            console.log(`   Error: ${result.error}`);
        }
    }
    
    console.log('\n📋 Testing fixed server (expected successes):');
    const fixedTests = [
        testEndpoint(3001, '/health', 'Health check'),
        testEndpoint(3001, '/api/data', 'API data endpoint (fixed)'),
        testEndpoint(3001, '/data', 'Redirect endpoint')
    ];
    
    for (const test of fixedTests) {
        const result = await test;
        const icon = result.success ? '✅' : '❌';
        console.log(`${icon} ${result.description}: ${result.status}`);
        if (result.error) {
            console.log(`   Error: ${result.error}`);
        }
    }
    
    console.log('\n🏁 Test complete!');
    console.log('\nTo run the POC:');
    console.log('1. Start server: node server.js (broken) or node server-fixed.js (fixed)');
    console.log('2. Open index.html in a web browser');
    console.log('3. Click "Test Backend Integration"');
}

if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { testEndpoint, runTests };