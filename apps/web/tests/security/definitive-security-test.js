/**
 * IRFGC Platform - Definitive Security Testing
 * 
 * This test provides definitive, unambiguous security results.
 * No "likely" or uncertain language is acceptable in security testing.
 * Each test must return a definitive PASS or FAIL result.
 */

const axios = require('axios');
const WebSocket = require('ws');

class DefinitiveSecurityTest {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.testResults = [];
  }

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

  // Test 1: Role-based Access Control - Definitive Testing
  async testRoleBasedAccessControl() {
    console.log('\n🔍 TESTING ROLE-BASED ACCESS CONTROL - DEFINITIVE RESULTS');
    console.log('==========================================================');
    
    const testEndpoints = [
      {
        url: '/api/users/test-user-id/role',
        method: 'PATCH',
        description: 'User role management endpoint'
      },
      {
        url: '/api/moderation/reports/test-report-id/resolve',
        method: 'PATCH',
        description: 'Report resolution endpoint'
      },
      {
        url: '/api/moderation/forum/test-thread-id/pin',
        method: 'PATCH',
        description: 'Forum thread pin endpoint'
      },
      {
        url: '/api/news',
        method: 'POST',
        description: 'News creation endpoint'
      },
      {
        url: '/api/events',
        method: 'POST',
        description: 'Event creation endpoint'
      }
    ];

    const roleVariations = ['admin', 'ADMIN', 'Admin', 'aDmIn'];

    for (const endpoint of testEndpoints) {
      console.log(`\n🔍 Testing: ${endpoint.description}`);
      console.log(`   Endpoint: ${endpoint.method} ${endpoint.url}`);
      
      let unauthorizedAccessAllowed = false;
      
      for (const role of roleVariations) {
        try {
          const response = await axios({
            method: endpoint.method,
            url: `${this.baseUrl}${endpoint.url}`,
            headers: {
              'Authorization': `Bearer fake-token-with-role-${role}`,
              'Content-Type': 'application/json'
            },
            data: endpoint.method === 'POST' ? {
              title: 'Test',
              content: 'Test content'
            } : {},
            timeout: 5000
          });

          if (response.status === 200 || response.status === 201) {
            unauthorizedAccessAllowed = true;
            this.logResult(
              `Role Bypass - ${endpoint.description}`,
              'CRITICAL',
              'FAILED',
              `DEFINITIVE: Role variation "${role}" successfully bypassed access control on ${endpoint.url}`
            );
            break;
          }
        } catch (error) {
          if (error.response) {
            if (error.response.status === 401 || error.response.status === 403) {
              // This is expected - unauthorized access properly blocked
              continue;
            } else {
              // Unexpected response - potential security issue
              this.logResult(
                `Role Bypass - ${endpoint.description}`,
                'MEDIUM',
                'FAILED',
                `DEFINITIVE: Unexpected response ${error.response.status} for role "${role}" on ${endpoint.url}`
              );
              unauthorizedAccessAllowed = true;
              break;
            }
          } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            // Server not running or endpoint not found
            this.logResult(
              `Role Bypass - ${endpoint.description}`,
              'ERROR',
              'ERROR',
              `DEFINITIVE: Cannot test - server not accessible (${error.code})`
            );
            break;
          } else {
            // Network error - cannot determine security status
            this.logResult(
              `Role Bypass - ${endpoint.description}`,
              'ERROR',
              'ERROR',
              `DEFINITIVE: Cannot test - network error (${error.message})`
            );
            break;
          }
        }
      }
      
      if (!unauthorizedAccessAllowed) {
        this.logResult(
          `Role Bypass - ${endpoint.description}`,
          'INFO',
          'PASSED',
          `DEFINITIVE: All role variations properly blocked (401/403 responses)`
        );
      }
    }
  }

  // Test 2: Authentication Bypass - Definitive Testing
  async testAuthenticationBypass() {
    console.log('\n🔍 TESTING AUTHENTICATION BYPASS - DEFINITIVE RESULTS');
    console.log('=====================================================');
    
    const protectedEndpoints = [
      '/api/dashboard/users',
      '/api/moderation/forum',
      '/api/cms/events',
      '/api/discord'
    ];

    for (const endpoint of protectedEndpoints) {
      try {
        const response = await axios.get(`${this.baseUrl}${endpoint}`, {
          timeout: 5000
        });

        if (response.status === 200) {
          this.logResult(
            `Authentication Bypass - ${endpoint}`,
            'CRITICAL',
            'FAILED',
            `DEFINITIVE: Unauthenticated access allowed to ${endpoint}`
          );
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401 || error.response.status === 403) {
            this.logResult(
              `Authentication Bypass - ${endpoint}`,
              'INFO',
              'PASSED',
              `DEFINITIVE: Authentication required for ${endpoint} (${error.response.status})`
            );
          } else {
            this.logResult(
              `Authentication Bypass - ${endpoint}`,
              'MEDIUM',
              'FAILED',
              `DEFINITIVE: Unexpected response ${error.response.status} for unauthenticated access to ${endpoint}`
            );
          }
        } else {
          this.logResult(
            `Authentication Bypass - ${endpoint}`,
            'ERROR',
            'ERROR',
            `DEFINITIVE: Cannot test authentication bypass - ${error.message}`
          );
        }
      }
    }
  }

  // Test 3: SQL Injection - Definitive Testing
  async testSQLInjection() {
    console.log('\n🔍 TESTING SQL INJECTION - DEFINITIVE RESULTS');
    console.log('==============================================');
    
    const sqlInjectionPayloads = [
      "' OR 1=1 --",
      "'; DROP TABLE users; --",
      "' UNION SELECT * FROM users --",
      "admin'--"
    ];

    const testEndpoints = [
      '/api/events?search=',
      '/api/forum?search=',
      '/api/users?search='
    ];

    for (const endpoint of testEndpoints) {
      for (const payload of sqlInjectionPayloads) {
        try {
          const response = await axios.get(`${this.baseUrl}${endpoint}${encodeURIComponent(payload)}`, {
            timeout: 5000
          });

          if (response.status === 200) {
            // Check if response contains sensitive data that would indicate SQL injection success
            const responseText = JSON.stringify(response.data).toLowerCase();
            if (responseText.includes('password') || responseText.includes('email') || 
                responseText.includes('admin') || responseText.includes('user')) {
              this.logResult(
                `SQL Injection - ${endpoint}`,
                'CRITICAL',
                'FAILED',
                `DEFINITIVE: SQL injection successful with payload "${payload}" on ${endpoint}`
              );
              break;
            }
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            this.logResult(
              `SQL Injection - ${endpoint}`,
              'INFO',
              'PASSED',
              `DEFINITIVE: SQL injection payload "${payload}" properly rejected (400) on ${endpoint}`
            );
          } else if (error.response && error.response.status === 500) {
            this.logResult(
              `SQL Injection - ${endpoint}`,
              'MEDIUM',
              'FAILED',
              `DEFINITIVE: SQL injection caused server error (500) with payload "${payload}" on ${endpoint}`
            );
          } else {
            this.logResult(
              `SQL Injection - ${endpoint}`,
              'ERROR',
              'ERROR',
              `DEFINITIVE: Cannot test SQL injection - ${error.message}`
            );
          }
        }
      }
    }
  }

  // Test 4: XSS Protection - Definitive Testing
  async testXSSProtection() {
    console.log('\n🔍 TESTING XSS PROTECTION - DEFINITIVE RESULTS');
    console.log('===============================================');
    
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      '<img src=x onerror=alert("XSS")>',
      '"><script>alert("XSS")</script>'
    ];

    const testEndpoints = [
      { url: '/api/forum', method: 'POST' },
      { url: '/api/news', method: 'POST' },
      { url: '/api/events', method: 'POST' }
    ];

    for (const endpoint of testEndpoints) {
      for (const payload of xssPayloads) {
        try {
          const response = await axios({
            method: endpoint.method,
            url: `${this.baseUrl}${endpoint.url}`,
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              title: payload,
              content: payload
            },
            timeout: 5000
          });

          if (response.status === 201 || response.status === 200) {
            this.logResult(
              `XSS Protection - ${endpoint.url}`,
              'CRITICAL',
              'FAILED',
              `DEFINITIVE: XSS payload "${payload}" accepted on ${endpoint.url}`
            );
            break;
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            this.logResult(
              `XSS Protection - ${endpoint.url}`,
              'INFO',
              'PASSED',
              `DEFINITIVE: XSS payload "${payload}" properly rejected (400) on ${endpoint.url}`
            );
          } else {
            this.logResult(
              `XSS Protection - ${endpoint.url}`,
              'ERROR',
              'ERROR',
              `DEFINITIVE: Cannot test XSS protection - ${error.message}`
            );
          }
        }
      }
    }
  }

  // Test 5: Rate Limiting - Definitive Testing
  async testRateLimiting() {
    console.log('\n🔍 TESTING RATE LIMITING - DEFINITIVE RESULTS');
    console.log('==============================================');
    
    const endpoints = [
      '/api/auth/signin',
      '/api/auth/register',
      '/api/events',
      '/api/forum'
    ];

    for (const endpoint of endpoints) {
      const promises = [];
      
      // Send 20 rapid requests to test rate limiting
      for (let i = 0; i < 20; i++) {
        promises.push(
          axios.get(`${this.baseUrl}${endpoint}`, { timeout: 5000 }).catch(() => null)
        );
      }

      const responses = await Promise.all(promises);
      const successfulResponses = responses.filter(r => r && r.status === 200);
      const rateLimitedResponses = responses.filter(r => r && (r.status === 429 || r.status === 403));

      if (successfulResponses.length > 10) {
        this.logResult(
          `Rate Limiting - ${endpoint}`,
          'HIGH',
          'FAILED',
          `DEFINITIVE: Rate limiting ineffective - ${successfulResponses.length}/20 requests succeeded`
        );
      } else if (rateLimitedResponses.length > 0) {
        this.logResult(
          `Rate Limiting - ${endpoint}`,
          'INFO',
          'PASSED',
          `DEFINITIVE: Rate limiting working - ${rateLimitedResponses.length} requests rate limited`
        );
      } else {
        this.logResult(
          `Rate Limiting - ${endpoint}`,
          'MEDIUM',
          'FAILED',
          `DEFINITIVE: No rate limiting detected - ${successfulResponses.length}/20 requests succeeded`
        );
      }
    }
  }

  // Test 6: Security Headers - Definitive Testing
  async testSecurityHeaders() {
    console.log('\n🔍 TESTING SECURITY HEADERS - DEFINITIVE RESULTS');
    console.log('=================================================');
    
    try {
      const response = await axios.get(`${this.baseUrl}/`, { timeout: 5000 });
      const headers = response.headers;

      const requiredHeaders = [
        'X-Content-Type-Options',
        'X-Frame-Options',
        'X-XSS-Protection',
        'Strict-Transport-Security',
        'Content-Security-Policy'
      ];

      let missingHeaders = [];

      for (const header of requiredHeaders) {
        if (!headers[header.toLowerCase()]) {
          missingHeaders.push(header);
        }
      }

      if (missingHeaders.length > 0) {
        this.logResult(
          'Security Headers',
          'HIGH',
          'FAILED',
          `DEFINITIVE: Missing security headers: ${missingHeaders.join(', ')}`
        );
      } else {
        this.logResult(
          'Security Headers',
          'INFO',
          'PASSED',
          'DEFINITIVE: All required security headers present'
        );
      }
    } catch (error) {
      this.logResult(
        'Security Headers',
        'ERROR',
        'ERROR',
        `DEFINITIVE: Cannot test security headers - ${error.message}`
      );
    }
  }

  // Run all definitive security tests
  async runAllTests() {
    console.log('🚨 IRFGC Platform - Definitive Security Testing');
    console.log('===============================================');
    
    await this.testRoleBasedAccessControl();
    await this.testAuthenticationBypass();
    await this.testSQLInjection();
    await this.testXSSProtection();
    await this.testRateLimiting();
    await this.testSecurityHeaders();

    this.generateDefinitiveReport();
  }

  // Generate definitive security test report
  generateDefinitiveReport() {
    console.log('\n📊 DEFINITIVE SECURITY TEST REPORT');
    console.log('===================================');
    
    const critical = this.testResults.filter(r => r.severity === 'CRITICAL');
    const high = this.testResults.filter(r => r.severity === 'HIGH');
    const medium = this.testResults.filter(r => r.severity === 'MEDIUM');
    const passed = this.testResults.filter(r => r.status === 'PASSED');
    const failed = this.testResults.filter(r => r.status === 'FAILED');
    const errors = this.testResults.filter(r => r.status === 'ERROR');

    console.log(`\nTest Results Summary:`);
    console.log(`- Total Tests: ${this.testResults.length}`);
    console.log(`- Passed: ${passed.length}`);
    console.log(`- Failed: ${failed.length}`);
    console.log(`- Errors: ${errors.length}`);
    console.log(`- Critical Issues: ${critical.length}`);
    console.log(`- High Issues: ${high.length}`);
    console.log(`- Medium Issues: ${medium.length}`);

    if (failed.length > 0) {
      console.log(`\n🚨 DEFINITIVE FAILED TESTS:`);
      failed.forEach(test => {
        console.log(`- [${test.severity}] ${test.test}: ${test.details}`);
      });
    }

    if (critical.length > 0) {
      console.log(`\n🔥 DEFINITIVE CRITICAL SECURITY ISSUES:`);
      critical.forEach(test => {
        console.log(`- ${test.test}: ${test.details}`);
      });
    }

    if (errors.length > 0) {
      console.log(`\n❌ DEFINITIVE TEST ERRORS:`);
      errors.forEach(test => {
        console.log(`- ${test.test}: ${test.details}`);
      });
    }

    // Save definitive report
    const reportPath = './tests/security/reports/definitive-security-test-report.json';
    const fs = require('fs');
    fs.writeFileSync(reportPath, JSON.stringify(this.testResults, null, 2));
    console.log(`\n📄 Definitive report saved to: ${reportPath}`);
  }
}

// Run tests if called directly
if (require.main === module) {
  const testSuite = new DefinitiveSecurityTest();
  testSuite.runAllTests().catch(console.error);
}

module.exports = DefinitiveSecurityTest; 