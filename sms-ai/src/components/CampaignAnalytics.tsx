import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { MessageSquare, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { api } from '../services/api';

interface CampaignStats {
  id: string;
  name: string;
  totalMessages: number;
  deliveredMessages: number;
  failedMessages: number;
  responseRate: number;
  averageResponseTime: string;
  dailyStats: {
    date: string;
    messages: number;
    responses: number;
    deliveryRate: number;
  }[];
}

export default function CampaignAnalytics() {
  const { id } = useParams();
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('7d');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(`/chat/campaigns/${id}/analytics?timeframe=${timeframe}`);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching campaign stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [id, timeframe]);

  if (loading || !stats) {
    return <div className="min-h-screen bg-gray-50 p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{stats.name}</h1>
            <p className="text-gray-500">Campaign Analytics</p>
          </div>
          <div className="flex gap-2">
            {(['24h', '7d', '30d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeframe === t
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Messages"
            value={stats.totalMessages}
            icon={<MessageSquare className="text-purple-500" />}
            color="purple"
          />
          <MetricCard
            title="Delivery Rate"
            value={`${((stats.deliveredMessages / stats.totalMessages) * 100).toFixed(1)}%`}
            icon={<CheckCircle className="text-green-500" />}
            color="green"
          />
          <MetricCard
            title="Response Rate"
            value={`${stats.responseRate.toFixed(1)}%`}
            icon={<Users className="text-blue-500" />}
            color="blue"
          />
          <MetricCard
            title="Avg Response Time"
            value={stats.averageResponseTime}
            icon={<Clock className="text-orange-500" />}
            color="orange"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Message Volume Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Message Volume</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="messages"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Response Rate Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Response Rate</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="responses"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Delivery Rate Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Delivery Rate</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="deliveryRate" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'purple' | 'green' | 'blue' | 'orange';
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  const colorClasses = {
    purple: 'bg-purple-50 border-purple-100',
    green: 'bg-green-50 border-green-100',
    blue: 'bg-blue-50 border-blue-100',
    orange: 'bg-orange-50 border-orange-100'
  };

  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 font-medium">{title}</h3>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
} 