import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Users, Bot, BarChart } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">SMS AI</div>
        <div className="flex gap-6">
          <button className="hover:text-purple-300 transition-colors">Features</button>
          <button className="hover:text-purple-300 transition-colors">About</button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Dashboard
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-6xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                STEP INTO THE
              </span>
              <br />
              FUTURE OF SMS
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Create intelligent SMS agents powered by AI to engage leads and drive conversions. 
              Transform your messaging strategy with automated, personalized conversations.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/agent-creation')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                Create Agent
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="border-2 border-purple-600 px-8 py-4 rounded-lg font-bold hover:bg-purple-600/20 transition-colors"
              >
                View Dashboard
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-purple-600/30 rounded-full blur-3xl"></div>
            {/* <img 
              src="src/assets/image/ai_agents.png" 
              alt="AI Agent" 
              className="relative w-full rounded-lg"
            /> */}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-3 gap-8">
          <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm">
            <div className="text-4xl font-bold mb-2">98%</div>
            <div className="text-gray-300">Response Rate</div>
          </div>
          <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm">
            <div className="text-4xl font-bold mb-2">5000+</div>
            <div className="text-gray-300">Active Agents</div>
          </div>
          <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm">
            <div className="text-4xl font-bold mb-2">1M+</div>
            <div className="text-gray-300">Messages Sent</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold mb-12 text-center">Key Features</h2>
        <div className="grid grid-cols-3 gap-8">
          <div className="bg-white/5 p-8 rounded-lg hover:bg-white/10 transition-colors">
            <Bot className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">AI Agents</h3>
            <p className="text-gray-300">Create customized AI agents with unique personalities and goals</p>
          </div>
          <div className="bg-white/5 p-8 rounded-lg hover:bg-white/10 transition-colors">
            <MessageSquare className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Smart Conversations</h3>
            <p className="text-gray-300">Engage leads with natural, context-aware conversations</p>
          </div>
          <div className="bg-white/5 p-8 rounded-lg hover:bg-white/10 transition-colors">
            <BarChart className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Analytics</h3>
            <p className="text-gray-300">Track performance and optimize your campaigns</p>
          </div>
        </div>
      </div>
    </div>
  );
} 