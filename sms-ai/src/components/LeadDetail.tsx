import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare, Mail, Phone, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../services/api';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'failed' | 'replied';
  response?: string;
}

interface LeadDetail {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  created_at: string;
  messages: Message[];
  campaigns: {
    id: string;
    name: string;
    status: string;
  }[];
}

export default function LeadDetail() {
  const { phoneNumber } = useParams(); // Update to use phone number parameter
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        const response = await api.get('/chat/get_lead', {
          params: {
            phone_number: phoneNumber
          }
        });
        setLead(response.data);
      } catch (error) {
        console.error('Error fetching lead details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (phoneNumber) {
      fetchLeadDetails();
    }
  }, [phoneNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Lead not found</div>
      </div>
    );
  }

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'failed':
        return <XCircle className="text-red-500" size={16} />;
      case 'replied':
        return <MessageSquare className="text-blue-500" size={16} />;
      default:
        return <Clock className="text-yellow-500" size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Lead Header */}
          <div className="p-6 border-b bg-gradient-to-r from-purple-500 to-blue-500">
            <h1 className="text-2xl font-bold text-white mb-2">{lead.name}</h1>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>{lead.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>{lead.phone_number}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Added {new Date(lead.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x">
            {/* Message History */}
            <div className="lg:col-span-2 p-6">
              <h2 className="text-xl font-semibold mb-4">Message History</h2>
              <div className="space-y-4">
                {lead.messages.map((message) => (
                  <div
                    key={message.id}
                    className="bg-gray-50 rounded-lg p-4 transition-transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(message.status)}
                        <span className="text-sm text-gray-500">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-200">
                        {message.status}
                      </span>
                    </div>
                    <p className="text-gray-700">{message.content}</p>
                    {message.response && (
                      <div className="mt-2 pl-4 border-l-2 border-blue-500">
                        <p className="text-gray-600">{message.response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Information */}
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Campaigns</h2>
              <div className="space-y-3">
                {lead.campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium text-gray-700">{campaign.name}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      campaign.status === 'active' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}