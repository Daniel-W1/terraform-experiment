import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ChevronRight, Users, MessageSquare } from 'lucide-react';

interface Chatbot {
  id: string;
  name: string;
}

interface LeadsList {
  id: string;
  name: string;
  total_leads: number;
  created_at: string;
  updated_at: string;
}

interface Lead {
  phone_number: string;
  name: string;
  email: string;
  detail: string | null;
  chatbot_id: string;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatSession {
  session_id: string;
  title: string;
  created_at: string;
  messages: ChatMessage[];
}

export default function SMSAgentsPage() {
  const navigate = useNavigate();
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [selectedChatbot, setSelectedChatbot] = useState<string | null>(null);
  const [leadLists, setLeadLists] = useState<LeadsList[]>([]);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        const response = await api.get('/chat/get-all-chatbots');
        setChatbots(response.data);
      } catch (error) {
        console.error('Error fetching chatbots:', error);
      }
    };
    fetchChatbots();
  }, []);

  const fetchLeadLists = async (chatbotId: string) => {
    try {
      const response = await api.get(`/chat/chatbot/${chatbotId}/lead-lists`);
      setLeadLists(response.data);
      setSelectedChatbot(chatbotId);
      setSelectedList(null);
      setSelectedLead(null);
      setChatHistory([]);
    } catch (error) {
      console.error('Error fetching lead lists:', error);
    }
  };

  const fetchLeads = async (listId: string) => {
    try {
      const response = await api.get(`/chat/lead-list/${listId}/leads`);
      setLeads(response.data);
      setSelectedList(listId);
      setSelectedLead(null);
      setChatHistory([]);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchChatHistory = async (phoneNumber: string) => {
    try {
      const response = await api.get(`/chat/lead/${phoneNumber}/chat-history`);
      setChatHistory(response.data);
      setSelectedLead(phoneNumber);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  // ... previous imports and interfaces remain the same ...

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">SMS Agents</h1>
        <button
          onClick={() => navigate('/agent-creation')}
          className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
        >
          + Add Agent
        </button>
      </div>

      <div className="grid grid-cols-12 gap-4"> {/* Changed to 12-column grid */}
        {/* Chatbots Column - 2 columns */}
        <div className="col-span-2 bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-4">Chatbots</h2>
          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]"> {/* Added scrolling */}
            {chatbots.map((chatbot) => (
              <div
                key={chatbot.id}
                onClick={() => fetchLeadLists(chatbot.id)}
                className={`p-2 rounded-lg cursor-pointer flex items-center justify-between ${
                  selectedChatbot === chatbot.id ? 'bg-purple-100' : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-sm truncate">{chatbot.name}</span>
                <ChevronRight size={14} />
              </div>
            ))}
          </div>
        </div>

        {/* Lead Lists Column - 2 columns */}
        {selectedChatbot && (
          <div className="col-span-2 bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-4">Lead Lists</h2>
            <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
              {leadLists.map((list) => (
                <div
                  key={list.id}
                  onClick={() => fetchLeads(list.id)}
                  className={`p-2 rounded-lg cursor-pointer ${
                    selectedList === list.id ? 'bg-purple-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate">{list.name}</span>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span className="text-xs text-gray-600">{list.total_leads}</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leads Column - 2 columns */}
        {selectedList && (
          <div className="col-span-2 bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-4">Leads</h2>
            <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
              {leads.map((lead) => (
                <div
                  key={lead.phone_number}
                  onClick={() => fetchChatHistory(lead.phone_number)}
                  className={`p-2 rounded-lg cursor-pointer ${
                    selectedLead === lead.phone_number ? 'bg-purple-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col">
                    <p className="font-medium text-sm truncate">{lead.name}</p>
                    <p className="text-xs text-gray-600">{lead.phone_number}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat History Column - 6 columns (half the grid) */}
        {selectedLead && (
          <div className="col-span-6 bg-white p-4 rounded-lg shadow flex flex-col h-[calc(100vh-200px)]">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <MessageSquare size={16} />
              Chat History
            </h2>
            
            {/* Chat Messages */}
            <div className="space-y-4 overflow-y-auto flex-1 mb-4">
              {chatHistory.map((session) => (
                <div key={session.session_id} className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 sticky top-0 bg-white py-2">
                    <span>{new Date(session.created_at).toLocaleString()}</span>
                  </div>
                  {session.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-gray-100 ml-auto max-w-[80%]' 
                          : 'bg-purple-100 mr-auto max-w-[80%]'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="mt-auto border-t pt-4">
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
                  const message = input.value.trim();
                  
                  if (!message || !selectedLead) return;

                  try {
                    // Send the message
                    await api.post('/sms/chat-with-history', {
                      session_id: selectedLead,
                      user_id: selectedLead,
                      message: message,
                    });

                    // Clear input immediately for better UX
                    input.value = '';

                    // Wait a bit before refreshing chat history to allow backend to process
                    setTimeout(async () => {
                      await fetchChatHistory(selectedLead);
                    }, 1000);

                  } catch (error) {
                    console.error('Error sending message:', error);
                    alert('Failed to send message. Please try again.');
                  }
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  name="message"
                  placeholder="Type your message..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



