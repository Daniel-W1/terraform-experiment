import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import AdminPage from './components/AdminPage';
import AgentCreationPage from './components/AgentCreationPage';
import SMSAgentsPage from './components/smsAgents';
import CreateCampaign from './components/CreateCampaign';
import CreateLeadsList from './components/CreateLeadsList';
import SuccessPage from './components/SuccessPage';
import CampaignView from './components/CampaignView';
import LeadsListView from './components/LeadsListView';
import Sidebar from './components/Sidebar';
import Settings from './components/Settings';
import CampaignAnalytics from './components/CampaignAnalytics';
import LeadDetail from './components/LeadDetail';
import { LoadingProvider } from './context/LoadingContext';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import { NotificationProvider } from './context/NotificationContext';
import LandingPage from './components/LandingPage';
import RedirectHome from './components/RedirectHome';

function App() {
  return (
    <LoadingProvider>
      <NotificationProvider>
        <Router>
          <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-64">
              <AnimatePresence mode="wait">
                <Routes>
                <Route path="/" element={<PageTransition><RedirectHome /></PageTransition>} />
                  <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
                  <Route path="/landing" element={<PageTransition><LandingPage /></PageTransition>} />
                  <Route path="/chat" element={<PageTransition><ChatInterface /></PageTransition>} />
                  <Route path="/admin" element={<PageTransition><AdminPage /></PageTransition>} />
                  <Route path="/smsagents" element={<PageTransition><SMSAgentsPage /></PageTransition>} />
                  <Route path="/agent-creation" element={<PageTransition><AgentCreationPage /></PageTransition>} />
                  <Route path="/create-campaign" element={<PageTransition><CreateCampaign /></PageTransition>} />
                  <Route path="/create-leads-list" element={<PageTransition><CreateLeadsList /></PageTransition>} />
                  <Route path="/campaigns" element={<PageTransition><CampaignView /></PageTransition>} />
                  <Route path="/leads-lists" element={<PageTransition><LeadsListView /></PageTransition>} />
                  <Route path="/campaign-success" element={<PageTransition><SuccessPage title="Campaign Created!" message="Your SMS campaign has been created successfully." returnPath="/" returnText="Return to Dashboard" /></PageTransition>} />
                  <Route path="/leads-success" element={<PageTransition><SuccessPage title="Leads List Created!" message="Your leads list has been uploaded successfully." returnPath="/" returnText="Return to Dashboard" /></PageTransition>} />
                  <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
                  <Route path="/campaigns/:id/analytics" element={<PageTransition><CampaignAnalytics /></PageTransition>} />
                  <Route path="/leads/:id" element={<PageTransition><LeadDetail /></PageTransition>} />
                </Routes>
              </AnimatePresence>
            </div>
          </div>
        </Router>
      </NotificationProvider>
    </LoadingProvider>
  );
}

export default App;