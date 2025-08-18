
import React from 'react';
import { motion } from 'framer-motion';
import { Palmtree, Users, Bell, MessageCircle, Lightbulb, Vote, Trophy } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useFirebase } from '../hooks/useFirebase';

interface GameHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ activeTab, setActiveTab }) => {
  const { currentPlayer } = usePlayer();
  const { players, dailyHints, markHintAsRead } = useFirebase();

  const latestHint = dailyHints.find(hint => hint.isActive);

  const handleHintClick = () => {
    if (latestHint) {
      markHintAsRead(latestHint.id);
    }
    setActiveTab('hints');
  };

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'hints', label: 'Hints', icon: Lightbulb },
    { id: 'vote', label: 'Vote', icon: Vote },
    { id: 'kingQueenVote', label: 'K&Q Vote', icon: Trophy },
    { id: 'players', label: 'Players', icon: Users }
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/95 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-700/50 shadow-lg"
    >
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12">
              <img 
                src="/MEXC Logo Mark_Blue.png" 
                alt="MEXC Bali" 
                className="w-full h-full object-contain filter brightness-0 invert"
              />
            </div>
            <div>
              <h1 className="font-display text-lg sm:text-xl font-bold text-white">Sea & Style Retreat: MEXC in Bali</h1>
              <p className="text-xs sm:text-sm text-emerald-400 flex items-center gap-1 font-medium">
                <Palmtree className="w-3 h-3" />
                Mysterious Person
              </p>
            </div>
          </div>

          {/* Right side: Hints, Player Count, User Info */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            {latestHint && (
              <motion.button
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={handleHintClick}
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500/20 border border-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              </motion.button>
            )}
            
            {/* Combined Player Count and User Info */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1 sm:space-x-2 px-2 py-1 sm:px-4 sm:py-2 bg-slate-800/80 border border-slate-600 rounded-lg">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                <span className="text-white font-semibold text-sm sm:text-base">{players.length}</span>
              </div>
              <div className="text-right hidden sm:block"> {/* Hide on small screens, show on sm and up */}
                <p className="text-white font-semibold text-sm sm:text-base">{currentPlayer?.name}</p>
                <p className="text-emerald-400 text-xs sm:text-sm font-medium">{currentPlayer?.country}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar (moved from Game.tsx) */}
      <div className="hidden lg:block border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-2">
          <nav className="flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-slate-800/60'
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

      {/* Mobile Tab Bar (moved from Game.tsx) */}
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
    </motion.header>
  );
};

export default GameHeader;
