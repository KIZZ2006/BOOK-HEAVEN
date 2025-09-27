'use client';

import { useState } from 'react';
import { API_BASE_URL } from '../../lib/config';

export default function TestAPI() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('Testing API connection...');
    
    try {
      // Test 1: Check if API URL is accessible
      setResult('Step 1: Testing API URL accessibility...\n');
      
      const testUrl = `${API_BASE_URL}/api/auth/signup`;
      setResult(prev => prev + `API URL: ${testUrl}\n`);
      
      // Test 2: Make the actual request
      setResult(prev => prev + 'Step 2: Making signup request...\n');
      
      const response = await fetch(testUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: 'test@example.com', 
          password: 'test123', 
          name: 'Test User' 
        }),
      });

      setResult(prev => prev + `Step 3: Response received\n`);
      setResult(prev => prev + `Status: ${response.status}\n`);
      setResult(prev => prev + `Status Text: ${response.statusText}\n`);
      setResult(prev => prev + `Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}\n`);
      
      const data = await response.json();
      setResult(prev => prev + `Response Body: ${JSON.stringify(data, null, 2)}\n`);
      
      // Test 3: Test CORS preflight
      setResult(prev => prev + '\nStep 4: Testing CORS preflight...\n');
      try {
        const preflightResponse = await fetch(testUrl, {
          method: 'OPTIONS',
          headers: {
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type',
          },
        });
        setResult(prev => prev + `Preflight Status: ${preflightResponse.status}\n`);
        setResult(prev => prev + `Preflight Headers: ${JSON.stringify(Object.fromEntries(preflightResponse.headers.entries()), null, 2)}\n`);
      } catch (preflightError) {
        setResult(prev => prev + `Preflight Error: ${preflightError instanceof Error ? preflightError.message : 'Unknown error'}\n`);
      }
      
    } catch (error) {
      setResult(prev => prev + `\nError Details:\n`);
      setResult(prev => prev + `Error Type: ${error instanceof Error ? error.constructor.name : 'Unknown'}\n`);
      setResult(prev => prev + `Error Message: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
      setResult(prev => prev + `Error Stack: ${error instanceof Error ? error.stack : 'No stack trace'}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <p><strong>API Base URL:</strong> {API_BASE_URL}</p>
          <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
          <p><strong>Deploy Target:</strong> {process.env.DEPLOY_TARGET}</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-800">Login Credentials</h2>
          <div className="space-y-2">
            <p><strong>Admin Account:</strong></p>
            <p className="font-mono text-sm bg-white p-2 rounded border">
              Email: admin@bookheaven.com<br/>
              Password: BookHeaven2024!
            </p>
            <p className="text-sm text-green-700 mt-2">
              This account has admin privileges and can upload/delete books.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test API Connection</h2>
          <div className="space-y-4">
            <button
              onClick={testAPI}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mr-4"
            >
              {loading ? 'Testing...' : 'Test Signup API'}
            </button>
            <button
              onClick={async () => {
                setLoading(true);
                setResult('Testing basic connectivity...\n');
                try {
                  const response = await fetch(`${API_BASE_URL}/api/books`);
                  setResult(`Books API Status: ${response.status}\n`);
                  const data = await response.json();
                  setResult(prev => prev + `Books API Response: ${JSON.stringify(data, null, 2)}\n`);
                } catch (error) {
                  setResult(prev => prev + `Books API Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Test Books API
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Result</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {result || 'Click "Test Signup API" to see results'}
          </pre>
        </div>
      </div>
    </div>
  );
}
