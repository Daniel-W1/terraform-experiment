import React, { useRef } from 'react';
import { api } from '../services/api';

interface AdminSettings {
  notifications: boolean;
  autoRespond: boolean;
  maxDailyMessages: number;
  timezone: string;
}

export default function AdminPage() {
  const customerDataInputRef = useRef<HTMLInputElement | null>(null);
  const chatScriptInputRef = useRef<HTMLInputElement | null>(null);

  const handleCustomerDataUpload = () => {
    customerDataInputRef.current?.click();
  };

  const handleChatScriptUpload = () => {
    chatScriptInputRef.current?.click();
  };

  const handleSendFirstMessage = () => {
    alert('Message sent successfully');
  };

  const fetchAdminData = async () => {
    try {
      const response = await api.get('/chat/admin/dashboard');
      // ... handle response
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const updateSettings = async (settings: AdminSettings) => {
    try {
      await api.post('/chat/admin/settings', settings);
      // ... handle success
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="space-y-4 space-x-4">
        <button
          onClick={handleCustomerDataUpload}
          className="bg-blue-500 text-white px-4 py-8 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Upload Customer Data
        </button>
        <input
          type="file"
          ref={customerDataInputRef}
          style={{ display: 'none' }}
          onChange={(e) => {
            // Handle file upload logic here
            console.log(e.target.files);
          }}
        />

        <button
          onClick={handleChatScriptUpload}
          className="bg-blue-500 text-white px-4 py-8 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Upload Chat Script
        </button>
        <input
          type="file"
          ref={chatScriptInputRef}
          style={{ display: 'none' }}
          onChange={(e) => {
            // Handle file upload logic here
            console.log(e.target.files);
          }}
        />

        <button
          onClick={handleSendFirstMessage}
          className="bg-blue-500 text-white px-4 py-8 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Send First Message for Customers
        </button>
      </div>
    </div>
  );
}