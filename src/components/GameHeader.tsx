import React from 'react';
import { motion } from 'framer-motion';
import { Waves, Users, Bell } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useFirebase } from '../hooks/useFirebase';

const GameHeader: React.FC = () => {
  const { currentPlayer } = usePlayer();
  const { players, dailyHints } = useFirebase();

  const latestHint = dailyHints.find(hint => hint.isActive);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40"
    >
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl">
              <Waves className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">MEXC Bali</h1>
              <p className="text-xs sm:text-sm text-gray-400">Mystery Person Game</p>
            </div>
          </div>

          {/* Center Info */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            {latestHint && (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex items-center space-x-1 sm:space-x-2 px-2 py-1 sm:px-4 sm:py-2 bg-yellow-500/20 border border-yellow-400/30 rounded-lg"
              >
                <Bell className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                <span className="text-yellow-300 text-xs sm:text-sm font-medium">New Hint!</span>
              </motion.div>
            )}
            
            <div className="flex items-center space-x-1 sm:space-x-2 px-2 py-1 sm:px-4 sm:py-2 bg-white/10 rounded-lg">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
              <span className="text-white font-semibold text-sm sm:text-base">{players.length}</span>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="text-right">
              <p className="text-white font-semibold text-sm sm:text-base">{currentPlayer?.name}</p>
              <p className="text-gray-400 text-xs sm:text-sm">{currentPlayer?.country}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default GameHeader;
