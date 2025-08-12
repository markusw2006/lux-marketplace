'use client';

import { useState, useEffect } from 'react';

// Minimal debug component to test client-side execution
export default function DebugPage() {
  const [message, setMessage] = useState('Initial state');
  const [apiResult, setApiResult] = useState<any>(null);

  useEffect(() => {
    console.log('useEffect is running!');
    setMessage('useEffect executed');
    
    // Test simple fetch
    fetch('/api/admin/status')
      .then(res => res.json())
      .then(data => {
        console.log('API result:', data);
        setApiResult(data);
      })
      .catch(err => {
        console.error('API error:', err);
        setApiResult({ error: err.message });
      });
  }, []);

  console.log('Component render, message:', message);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="mb-2"><strong>Message:</strong> {message}</p>
          <p className="mb-2"><strong>API Result:</strong></p>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(apiResult, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}