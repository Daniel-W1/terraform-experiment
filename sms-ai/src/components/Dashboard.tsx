import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, MessageSquare, PlusCircle } from 'lucide-react';
import { DashboardMetrics } from '../types/dashboard';
import { api } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    total_campaigns: 0,
    active_campaigns: 0,
    total_leads: 0,
    success_rate: 0,
    monthly_messages: 0
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/chat/dashboard/metrics');
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  const handleCreateCampaign = () => {
    navigate('/create-campaign');
  };

  const handleCreateLeadsList = () => {
    navigate('/create-leads-list');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={handleCreateCampaign}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2  mr-10"
          >
            <PlusCircle size={10} />
            Create Campaign
          </button>
          <button
            onClick={handleCreateLeadsList}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PlusCircle size={10} />
            Create Leads List
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Campaigns"
          value={metrics.total_campaigns}
          icon={<BarChart3 className="text-purple-500" size={24} />}
          color="purple"
        />
        <MetricCard
          title="Active Campaigns"
          value={metrics.active_campaigns}
          icon={<MessageSquare className="text-blue-500" size={24} />}
          color="blue"
        />
        <MetricCard
          title="Total Leads"
          value={metrics.total_leads}
          icon={<Users className="text-green-500" size={24} />}
          color="green"
        />
        <MetricCard
          title="Success Rate"
          value={`${metrics.success_rate}%`}
          icon={<BarChart3 className="text-orange-500" size={24} />}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <QuickActionCard
          title="SMS Agents"
          description="Manage your chatbot agents"
          onClick={() => navigate('/smsagents')}
          color="purple"
        />
        <QuickActionCard
          title="Leads Lists"
          description="View and manage your leads"
          onClick={() => navigate('/leads-lists')}
          color="blue"
        />
        <QuickActionCard
          title="Campaigns"
          description="View all campaigns"
          onClick={() => navigate('/campaigns')}
          color="green"
        />
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'purple' | 'blue' | 'green' | 'orange';
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  const colorClasses = {
    purple: 'bg-purple-50 border-purple-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    orange: 'bg-orange-50 border-orange-200'
  };

  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color]} transition-transform hover:scale-105`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 font-medium">{title}</h3>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  onClick: () => void;
  color: 'purple' | 'blue' | 'green';
}

function QuickActionCard({ title, description, onClick, color }: QuickActionCardProps) {
  const colorClasses = {
    purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    green: 'bg-green-50 hover:bg-green-100 border-green-200'
  };

  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-xl border ${colorClasses[color]} text-left transition-all hover:shadow-md`}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </button>
  );
} 