import React, { useState } from 'react';
import { Save, Bell, Shield, User, Mail, Phone } from 'lucide-react';

interface NotificationSettings {
  [key: string]: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
  campaignUpdates: boolean;
  failureAlerts: boolean;
}

export default function Settings() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailAlerts: true,
    smsAlerts: false,
    campaignUpdates: true,
    failureAlerts: true
  });

  const [apiSettings, setApiSettings] = useState({
    apiKey: '****************************',
    webhookUrl: 'https://api.example.com/webhook',
    maxRetries: '3'
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <User className="text-gray-400" size={24} />
              <h2 className="text-xl font-semibold">Profile Settings</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  defaultValue="SMS AI"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  defaultValue="contact@example.com"
                />
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <Bell className="text-gray-400" size={24} />
              <h2 className="text-xl font-semibold">Notification Preferences</h2>
            </div>

            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-700">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                      peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full 
                      peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                      after:left-[2px] after:bg-white after:border-gray-300 after:border 
                      after:rounded-full after:h-5 after:w-5 after:transition-all 
                      peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* API Settings Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <Shield className="text-gray-400" size={24} />
              <h2 className="text-xl font-semibold">API Settings</h2>
            </div>

            <div className="space-y-4">
              {Object.entries(apiSettings).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  <input
                    type={key === 'apiKey' ? 'password' : 'text'}
                    value={value}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 
                transition-colors flex items-center gap-2"
            >
              <Save size={20} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 