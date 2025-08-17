
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Lightbulb, Vote, Users, Trophy } from 'lucide-react';
import GameHeader from './GameHeader';
import Chat from './Chat';
import DailyHints from './DailyHints';
import VotingPanel from './VotingPanel';
import KingQueenVotingPanel from './KingQueenVotingPanel';
import PlayersList from './PlayersList';

const Game: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'hints', label: 'Hints', icon: Lightbulb },
    { id: 'vote', label: 'Vote', icon: Vote },
    { id: 'kingQueenVote', label: 'K&Q Vote', icon: Trophy },
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
      case 'kingQueenVote':
        return <KingQueenVotingPanel />;
      case 'players':
        return <PlayersList />;
      default:
        return <Chat />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Tropical Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-400 animate-palm-sway">
            <path d="M50 90 C30 70, 20 50, 50 30 C80 50, 70 70, 50 90 Z" fill="currentColor"/>
          </svg>
        </div>
        <div className="absolute bottom-20 right-20 w-28 h-28 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400 animate-palm-sway" style={{ animationDelay: '2s' }}>
            <path d="M50 90 C25 75, 15 55, 50 25 C85 55, 75 75, 50 90 Z" fill="currentColor"/>
          </svg>
        </div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-emerald-400/3 rounded-full blur-2xl animate-tropical-float"></div>
        <div className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-cyan-400/3 rounded-full blur-3xl animate-tropical-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        <GameHeader onTabChange={setActiveTab} />

        <div className="flex-1 flex overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden lg:flex w-80 flex-col bg-slate-900/90 backdrop-blur-sm border-r border-slate-700/50">
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
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/25 transform scale-105'
                          : 'text-gray-300 hover:text-white hover:bg-slate-800/60 hover:transform hover:scale-102'
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
          <div className="flex-1 flex flex-col max-w-full">
            {/* Mobile Tab Bar */}
            <div className="lg:hidden bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/50 p-2 sm:p-4">
              <div className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-1 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium whitespace-nowrap text-xs sm:text-sm transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-md'
                          : 'text-gray-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{tab.label}</span>
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
                <div className="h-full overflow-y-auto p-4 sm:p-6">
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
