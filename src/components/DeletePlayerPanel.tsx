import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, ArrowLeft } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Player } from '../types'; // Assuming Player type is defined here
import { usePlayer } from '../context/PlayerContext'; // Import usePlayer

const DeletePlayerPanel: React.FC = () => {
  const { players, deletePlayer } = useFirebase();
  const { currentPlayer, clearCurrentPlayer } = usePlayer(); // Get currentPlayer and clearCurrentPlayer
  const [isLoading, setIsLoading] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);

  useEffect(() => {
    setFilteredPlayers(
      players.filter(player =>
        player.name.toLowerCase().includes(filterText.toLowerCase()) ||
        player.id.toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [players, filterText]);

  const handleDeletePlayer = async (playerUid: string, playerName: string) => {
    if (window.confirm(`Are you sure you want to delete player "${playerName}"? This action cannot be undone.`)) {
      setIsLoading(true);
      try {
        await deletePlayer(playerUid);
        toast.success(`Player "${playerName}" deleted successfully!`);
        
        // If the deleted player is the current player, clear their local storage
        if (currentPlayer && currentPlayer.id === playerUid) {
          clearCurrentPlayer();
          toast('Your player data has been deleted. You will be redirected to the login page.', { icon: '👋' });
        }

      } catch (error) {
        console.error('Error deleting player:', error);
        toast.error(`Failed to delete player "${playerName}"`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-red-900 p-4 lg:p-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/10 to-orange-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-400/10 to-red-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 lg:mb-10"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 lg:w-20 lg:h-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl mb-3 lg:mb-6">
            <Trash2 className="w-7 h-7 lg:w-10 lg:h-10 text-white" />
          </div>
          <h1 className="text-xl lg:text-4xl font-bold text-white mb-1 lg:mb-3">Delete Player</h1>
          <p className="text-sm lg:text-lg text-gray-300">Permanently remove players and their data</p>
        </motion.div>

        {/* Back Button */}
        <Link to="/admin" className="absolute top-4 left-4 lg:top-8 lg:left-8 text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm lg:text-base">Back to Admin Panel</span>
        </Link>

        {/* Player List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 lg:p-8"
        >
          <h2 className="text-xl lg:text-2xl font-bold text-white mb-6">All Players ({players.length})</h2>
          
          <input
            type="text"
            placeholder="Filter players by name or ID..."
            className="w-full p-3 mb-6 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />

          {filteredPlayers.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No players found.</p>
          ) : (
            <ul className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {filteredPlayers.map((player) => (
                <li
                  key={player.id}
                  className="flex items-center justify-between bg-slate-800/60 p-4 rounded-lg border border-slate-700"
                >
                  <div>
                    <p className="text-white font-semibold text-lg">{player.name}</p>
                    <p className="text-gray-400 text-sm">ID: {player.id}</p>
                  </div>
                  <motion.button
                    onClick={() => handleDeletePlayer(player.id, player.name)}
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                    <span>Delete</span>
                  </motion.button>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DeletePlayerPanel;
