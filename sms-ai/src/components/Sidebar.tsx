import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Settings, 
  BarChart2,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: MessageSquare, label: 'SMS Agents', path: '/smsagents' },
    { icon: BarChart2, label: 'Campaigns', path: '/campaigns' },
    { icon: Users, label: 'Leads Lists', path: '/leads-lists' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r shadow-sm">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-purple-600 rounded-lg"></div>
          <span className="text-xl font-bold">SMS Platform</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                ${isActive(item.path)
                  ? 'bg-purple-50 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 w-full p-4 border-t">
        <button
          onClick={() => {/* Handle logout */}}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
} 