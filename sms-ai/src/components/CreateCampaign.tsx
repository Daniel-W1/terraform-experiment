import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Loader2 } from 'lucide-react';
import { isAxiosError } from 'axios';

interface Chatbot {
  id: string;
  name: string;
}

interface LeadsList {
  id: string;
  name: string;
}

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [leadsLists, setLeadsLists] = useState<LeadsList[]>([]);
  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({
    name: '',
    chatbotId: '',
    leadsListId: '',
    schedule: {
      start_date: '',
      end_date: '',
      time_zone: 'UTC', // Default timezone
      daily_start_time: '09:00',  // Default start time
      daily_end_time: '17:00'     // Default end time
    }
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chatbotsRes, leadsListsRes] = await Promise.all([
          api.get('/chat/get-all-chatbots'),
          api.get('/chat/get-all-leads-information-lists')
        ]);
        setChatbots(chatbotsRes.data);
        setLeadsLists(leadsListsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      chatbot_id: formData.chatbotId,
      leads_list_id: formData.leadsListId,
      status: 'active',
      schedule: {
        start_date: formData.schedule.start_date,
        end_date: formData.schedule.end_date,
        time_zone: formData.schedule.time_zone,
        daily_start_time: formData.schedule.daily_start_time + ':00',
        daily_end_time: formData.schedule.daily_end_time + ':00'
      }
    };

    console.log('Payload being sent:', JSON.stringify(payload, null, 2));

    try {
      const response = await api.post('/chat/create-campaign', payload);

      console.log('Campaign created successfully:', response.data);
      navigate('/campaigns');
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('Full error response:', error.response?.data);
        alert(`Failed to create campaign: ${JSON.stringify(error.response?.data, null, 2)}`);
      } else {
        console.error('Error creating campaign:', error);
        alert('Failed to create campaign: Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Create SMS Campaign</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Chatbot
            </label>
            <select
              value={formData.chatbotId}
              onChange={(e) => setFormData({ ...formData, chatbotId: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select a chatbot...</option>
              {chatbots.map((bot) => (
                <option key={bot.id} value={bot.id}>
                  {bot.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Leads List
            </label>
            <select
              value={formData.leadsListId}
              onChange={(e) => setFormData({ ...formData, leadsListId: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select a leads list...</option>
              {leadsLists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.schedule.start_date}
                onChange={(e) => handleScheduleChange('start_date', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.schedule.end_date}
                onChange={(e) => handleScheduleChange('end_date', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Start Time
              </label>
              <input
                type="time"
                value={formData.schedule.daily_start_time}
                onChange={(e) => handleScheduleChange('daily_start_time', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily End Time
              </label>
              <input
                type="time"
                value={formData.schedule.daily_end_time}
                onChange={(e) => handleScheduleChange('daily_end_time', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400 flex items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={20} />}
              Create Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 