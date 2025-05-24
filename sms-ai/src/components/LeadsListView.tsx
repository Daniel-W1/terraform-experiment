import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Users, Download, Eye } from 'lucide-react';
import { LeadsList } from '../types/dashboard';
import { api } from '../services/api';

export default function LeadsListView() {
  const navigate = useNavigate();
  const [leadsList, setLeadsList] = useState<LeadsList[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLeadsLists = async () => {
      try {
        const response = await api.get('/chat/get-all-leads-information-lists');
        setLeadsList(response.data);
      } catch (error) {
        console.error('Error fetching leads lists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadsLists();
  }, []);

  const filteredLists = leadsList.filter(list => 
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Leads Lists</h1>
          <button
            onClick={() => navigate('/create-leads-list')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
              transition-colors flex items-center gap-2"
          >
            <PlusCircle size={20} />
            Create List
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search leads lists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leads Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLists.map((list) => (
                    <tr key={list.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="text-gray-400 mr-2" size={20} />
                          <span className="text-sm font-medium text-gray-900">{list.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {list.leads.length} leads
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(list.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/leads/${list.id}`)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => {/* Download list */}}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 