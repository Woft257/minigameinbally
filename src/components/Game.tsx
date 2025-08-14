import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Lightbulb, Vote, Users, Menu, X } from 'lucide-react';
import GameHeader from './GameHeader';
import Chat from './Chat';
import DailyHints from './DailyHints';
import VotingPanel from './VotingPanel';
import PlayersList from './PlayersList';

const Game: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'hints', label: 'Hints', icon: Lightbulb },
    { id: 'vote', label: 'Vote', icon: Vote },
    { id: 'players', label: 'Players', icon: Users }
  ];

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'chat':
        return <Chat />;
      case 'hints':
        return <DailyHints />;
      case 'vote':
        return <VotingPanel />;
      case 'players':
        return <PlayersList />;
      default:
        return <Chat />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/10 to-teal-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        <GameHeader />

        <div className="flex-1 flex overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden lg:flex w-80 flex-col bg-white/5 backdrop-blur-xl border-r border-white/10">
            <div className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-400/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Mobile Tab Bar */}
            <div className="lg:hidden bg-white/5 backdrop-blur-xl border-b border-white/10 p-4">
              <div className="flex space-x-2 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-400/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'chat' ? (
                <div className="h-full">
                  {renderActiveContent()}
                </div>
              ) : (
                <div className="h-full overflow-y-auto p-6">
                  {renderActiveContent()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;