/**
 * IRFGC Platform - Security Testing Suite
 * 
 * This suite tests for the critical security vulnerabilities identified in the platform:
 * 1. Role-based access control inconsistencies
 * 2. Session management vulnerabilities
 * 3. Password policy gaps
 * 4. CSRF protection missing
 * 5. Input validation gaps
 * 6. Socket.IO security gaps
 * 7. CMS integration vulnerabilities
 */

import axios from 'axios';
import WebSocket from 'ws';
import fs from 'fs';

class SecurityTestSuite {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.testResults = [];
    this.sessionTokens = {};
  }

  // Test Result Logger
  logResult(testName, severity, status, details = '') {
    const result = {
      test: testName,
      severity: severity,
      status: status,
      details: details,
      timestamp: new Date().toISOString()
    };
    this.testResults.push(result);
    console.log(`[${severity}] ${testName}: ${status} ${details}`);
  }

  // Authentication Helper
  async authenticate(email, password) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/auth/signin`, {
        email,
        password
      });
      return response.data;
    } catch {
      return null;
    }
  }

  // Test 1: Role-based Access Control Inconsistencies
  async testRoleBasedAccessControl() {
    console.log('\n=== Testing Role-based Access Control ===');
    
    // Test case variations
    const roleVariations = ['admin', 'ADMIN', 'Admin', 'aDmIn'];
    const testEndpoints = [
      '/api/users/test-user-id/role',
      '/api/moderation/forum/test-thread-id/delete',
      '/api/dashboard/users',
      '/api/cms/events'
    ];

    for (const role of roleVariations) {
      for (const endpoint of testEndpoints) {
        try {
          // Simulate request with different role cases
          const response = await axios.get(`${this.baseUrl}${endpoint}`, {
            headers: {
              'Authorization': `Bearer fake-token-with-role-${role}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.status === 200) {
            this.logResult(
              `Role Bypass - ${endpoint}`,
              'CRITICAL',
              'FAILED',
              `Role variation "${role}" bypassed access control`
            );
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            this.logResult(
              `Role Bypass - ${endpoint}`,
              'INFO',
              'PASSED',
              `Role variation "${role}" properly blocked`
            );
          }
        }
      }
    }
  }

  // Test 2: Session Management Vulnerabilities
  async testSessionManagement() {
    console.log('\n=== Testing Session Management ===');
    
    // Test session timeout
    try {
      const session = await this.authenticate('admin@irfgc.ir', 'admin123');
      if (session) {
        // Wait for potential session timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await axios.get(`${this.baseUrl}/api/dashboard/users`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) {
          this.logResult(
            'Session Timeout',
            'CRITICAL',
            'FAILED',
            'Session did not timeout as expected'
          );
        }
      }
    } catch {
      this.logResult(
        'Session Timeout',
        'INFO',
        'PASSED',
        'Session properly timed out'
      );
    }

    // Test session fixation
    try {
      const fixedSessionId = 'fixed-session-id-12345';
      const response = await axios.get(`${this.baseUrl}/api/dashboard/users`, {
        headers: {
          'Cookie': `session=${fixedSessionId}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        this.logResult(
          'Session Fixation',
          'CRITICAL',
          'FAILED',
          'Session fixation vulnerability detected'
        );
      }
    } catch {
      this.logResult(
        'Session Fixation',
        'INFO',
        'PASSED',
        'Session fixation protection working'
      );
    }
  }

  // Test 3: Password Policy Gaps
  async testPasswordPolicy() {
    console.log('\n=== Testing Password Policy ===');
    
    const weakPasswords = [
      '123456',
      'password',
      'admin',
      'qwerty',
      'abc123'
    ];

    for (const password of weakPasswords) {
      try {
        const response = await axios.post(`${this.baseUrl}/api/auth/register`, {
          name: 'Test User',
          email: `test-${Date.now()}@example.com`,
          password: password
        });

        if (response.status === 201) {
          this.logResult(
            'Weak Password Policy',
            'HIGH',
            'FAILED',
            `Weak password "${password}" was accepted`
          );
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.logResult(
            'Weak Password Policy',
            'INFO',
            'PASSED',
            `Weak password "${password}" properly rejected`
          );
        }
      }
    }
  }

  // Test 4: CSRF Protection
  async testCSRFProtection() {
    console.log('\n=== Testing CSRF Protection ===');
    
    const csrfEndpoints = [
      { url: '/api/events', method: 'POST' },
      { url: '/api/news', method: 'POST' },
      { url: '/api/forum', method: 'POST' },
      { url: '/api/lfg', method: 'POST' }
    ];

    for (const endpoint of csrfEndpoints) {
      try {
        const response = await axios({
          method: endpoint.method,
          url: `${this.baseUrl}${endpoint.url}`,
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://malicious-site.com',
            'Referer': 'https://malicious-site.com/attack'
          },
          data: {
            title: 'CSRF Test',
            content: 'This is a CSRF test'
          }
        });

        if (response.status === 201 || response.status === 200) {
          this.logResult(
            'CSRF Protection',
            'HIGH',
            'FAILED',
            `CSRF attack succeeded on ${endpoint.url}`
          );
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          this.logResult(
            'CSRF Protection',
            'INFO',
            'PASSED',
            `CSRF protection working on ${endpoint.url}`
          );
        }
      }
    }
  }

  // Test 5: Input Validation Gaps
  async testInputValidation() {
    console.log('\n=== Testing Input Validation ===');
    
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      '<img src=x onerror=alert("XSS")>',
      '"><script>alert("XSS")</script>'
    ];

    const sqlInjectionPayloads = [
      "' OR 1=1 --",
      "'; DROP TABLE users; --",
      "' UNION SELECT * FROM users --",
      "admin'--"
    ];

    // Test XSS in forum posts
    for (const payload of xssPayloads) {
      try {
        const response = await axios.post(`${this.baseUrl}/api/forum`, {
          title: payload,
          content: payload,
          gameSlug: 'mk'
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 201) {
          this.logResult(
            'XSS Protection',
            'HIGH',
            'FAILED',
            `XSS payload accepted: ${payload.substring(0, 50)}...`
          );
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.logResult(
            'XSS Protection',
            'INFO',
            'PASSED',
            `XSS payload properly rejected: ${payload.substring(0, 50)}...`
          );
        }
      }
    }

    // Test SQL Injection in search parameters
    for (const payload of sqlInjectionPayloads) {
      try {
        const response = await axios.get(`${this.baseUrl}/api/events?search=${encodeURIComponent(payload)}`);
        
        if (response.status === 200) {
          this.logResult(
            'SQL Injection Protection',
            'HIGH',
            'FAILED',
            `SQL injection payload accepted: ${payload.substring(0, 50)}...`
          );
        }
      } catch {
        this.logResult(
          'SQL Injection Protection',
          'INFO',
          'PASSED',
          `SQL injection payload properly handled: ${payload.substring(0, 50)}...`
        );
      }
    }
  }

  // Test 6: Socket.IO Security Gaps
  async testSocketIOSecurity() {
    console.log('\n=== Testing Socket.IO Security ===');
    
    try {
      const ws = new WebSocket(`ws://localhost:3000/api/socketio`);
      
      ws.on('open', () => {
        this.logResult(
          'Socket.IO Authentication',
          'HIGH',
          'FAILED',
          'Unauthenticated WebSocket connection accepted'
        );
        
        // Test message injection
        ws.send(JSON.stringify({
          event: 'send-message',
          data: {
            roomId: 'test-room',
            userId: 'fake-user-id',
            content: '<script>alert("Socket XSS")</script>'
          }
        }));
        
        ws.close();
      });

      ws.on('error', () => {
        this.logResult(
          'Socket.IO Authentication',
          'INFO',
          'PASSED',
          'Unauthenticated WebSocket connection properly rejected'
        );
      });

      // Wait for connection attempt
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch {
      this.logResult(
        'Socket.IO Security',
        'INFO',
        'PASSED',
        'Socket.IO security measures in place'
      );
    }
  }

  // Test 7: CMS Integration Vulnerabilities
  async testCMSIntegration() {
    console.log('\n=== Testing CMS Integration ===');
    
    try {
      // Test unauthorized CMS access
      const response = await axios.get(`${this.baseUrl}/api/cms/events`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        this.logResult(
          'CMS Access Control',
          'MEDIUM',
          'FAILED',
          'Unauthorized CMS access allowed'
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        this.logResult(
          'CMS Access Control',
          'INFO',
          'PASSED',
          'CMS access properly protected'
        );
      }
    }

    // Test CMS token validation
    try {
      const response = await axios.get(`${this.baseUrl}/api/cms/events`, {
        headers: {
          'Authorization': 'Bearer fake-cms-token',
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        this.logResult(
          'CMS Token Validation',
          'MEDIUM',
          'FAILED',
          'Invalid CMS token accepted'
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        this.logResult(
          'CMS Token Validation',
          'INFO',
          'PASSED',
          'CMS token validation working'
        );
      }
    }
  }

  // Test 8: Rate Limiting
  async testRateLimiting() {
    console.log('\n=== Testing Rate Limiting ===');
    
    const endpoints = [
      '/api/auth/signin',
      '/api/auth/register',
      '/api/events',
      '/api/forum'
    ];

    for (const endpoint of endpoints) {
      const promises = [];
      
      // Send multiple rapid requests
      for (let i = 0; i < 10; i++) {
        promises.push(
          axios.get(`${this.baseUrl}${endpoint}`).catch(() => null)
        );
      }

      const responses = await Promise.all(promises);
      const successfulResponses = responses.filter(r => r && r.status === 200);

      if (successfulResponses.length > 5) {
        this.logResult(
          'Rate Limiting',
          'MEDIUM',
          'FAILED',
          `Rate limiting not effective on ${endpoint}`
        );
      } else {
        this.logResult(
          'Rate Limiting',
          'INFO',
          'PASSED',
          `Rate limiting working on ${endpoint}`
        );
      }
    }
  }

  // Test 9: Information Disclosure
  async testInformationDisclosure() {
    console.log('\n=== Testing Information Disclosure ===');
    
    const testEndpoints = [
      '/api/nonexistent',
      '/api/auth/invalid',
      '/api/users/invalid-id'
    ];

    for (const endpoint of testEndpoints) {
      try {
        const response = await axios.get(`${this.baseUrl}${endpoint}`);
        
        if (response.data && (
          response.data.includes('stack trace') ||
          response.data.includes('error details') ||
          response.data.includes('database') ||
          response.data.includes('internal')
        )) {
          this.logResult(
            'Information Disclosure',
            'MEDIUM',
            'FAILED',
            `Sensitive information disclosed on ${endpoint}`
          );
        }
      } catch (error) {
        if (error.response && error.response.data) {
          const responseData = JSON.stringify(error.response.data);
          if (
            responseData.includes('stack trace') ||
            responseData.includes('error details') ||
            responseData.includes('database') ||
            responseData.includes('internal')
          ) {
            this.logResult(
              'Information Disclosure',
              'MEDIUM',
              'FAILED',
              `Sensitive information in error response on ${endpoint}`
            );
          } else {
            this.logResult(
              'Information Disclosure',
              'INFO',
              'PASSED',
              `Proper error handling on ${endpoint}`
            );
          }
        }
      }
    }
  }

  // Test 10: Security Headers
  async testSecurityHeaders() {
    console.log('\n=== Testing Security Headers ===');
    
    try {
      const response = await axios.get(`${this.baseUrl}/`);
      const headers = response.headers;

      const requiredHeaders = [
        'X-Content-Type-Options',
        'X-Frame-Options',
        'X-XSS-Protection',
        'Strict-Transport-Security',
        'Content-Security-Policy'
      ];

      for (const header of requiredHeaders) {
        if (!headers[header.toLowerCase()]) {
          this.logResult(
            'Security Headers',
            'MEDIUM',
            'FAILED',
            `Missing security header: ${header}`
          );
        } else {
          this.logResult(
            'Security Headers',
            'INFO',
            'PASSED',
            `Security header present: ${header}`
          );
        }
      }
    } catch (error) {
      this.logResult(
        'Security Headers',
        'ERROR',
        'ERROR',
        `Could not test security headers: ${error.message}`
      );
    }
  }

  // Run all security tests
  async runAllTests() {
    console.log('🚨 IRFGC Platform Security Testing Suite');
    console.log('==========================================');
    
    await this.testRoleBasedAccessControl();
    await this.testSessionManagement();
    await this.testPasswordPolicy();
    await this.testCSRFProtection();
    await this.testInputValidation();
    await this.testSocketIOSecurity();
    await this.testCMSIntegration();
    await this.testRateLimiting();
    await this.testInformationDisclosure();
    await this.testSecurityHeaders();

    this.generateReport();
  }

  // Generate security test report
  generateReport() {
    console.log('\n📊 SECURITY TEST REPORT');
    console.log('=======================');
    
    const critical = this.testResults.filter(r => r.severity === 'CRITICAL');
    const high = this.testResults.filter(r => r.severity === 'HIGH');
    const medium = this.testResults.filter(r => r.severity === 'MEDIUM');
    const passed = this.testResults.filter(r => r.status === 'PASSED');
    const failed = this.testResults.filter(r => r.status === 'FAILED');

    console.log(`\nTest Results Summary:`);
    console.log(`- Total Tests: ${this.testResults.length}`);
    console.log(`- Passed: ${passed.length}`);
    console.log(`- Failed: ${failed.length}`);
    console.log(`- Critical Issues: ${critical.length}`);
    console.log(`- High Issues: ${high.length}`);
    console.log(`- Medium Issues: ${medium.length}`);

    if (failed.length > 0) {
      console.log(`\n🚨 FAILED TESTS:`);
      failed.forEach(test => {
        console.log(`- [${test.severity}] ${test.test}: ${test.details}`);
      });
    }

    if (critical.length > 0) {
      console.log(`\n🔥 CRITICAL SECURITY ISSUES:`);
      critical.forEach(test => {
        console.log(`- ${test.test}: ${test.details}`);
      });
    }

    // Save detailed report
    const reportPath = './security-test-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(this.testResults, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }
}

// Export for use in other test files
export default SecurityTestSuite;

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const testSuite = new SecurityTestSuite();
  testSuite.runAllTests().catch(console.error);
} 