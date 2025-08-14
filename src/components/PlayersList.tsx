import React from 'react';
import { motion } from 'framer-motion';
import { Users, Crown, Globe } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';

const PlayersList: React.FC = () => {
  const { players } = useFirebase();

  const countryGroups = players.reduce((acc, player) => {
    if (!acc[player.country]) {
      acc[player.country] = [];
    }
    acc[player.country].push(player);
    return acc;
  }, {} as Record<string, typeof players>);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <Users className="w-6 h-6 text-green-400" />
        <h2 className="text-xl font-bold text-white">Players</h2>
        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded-full">
          {players.length}/40
        </span>
      </div>

      <div className="space-y-4">
        {Object.entries(countryGroups).map(([country, countryPlayers]) => (
          <motion.div
            key={country}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Globe className="w-4 h-4 text-blue-400" />
              <h3 className="font-semibold text-white">{country}</h3>
              <span className="text-xs text-gray-400">({countryPlayers.length})</span>
            </div>
            
            <div className="grid gap-2">
              {countryPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-2">
                    {player.isAdmin && (
                      <Crown className="w-4 h-4 text-yellow-400" />
                    )}
                    <span className="text-gray-200">{player.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {player.joinedAt.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {players.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No players yet...</p>
        </div>
      )}
    </div>
  );
};

export default PlayersList;