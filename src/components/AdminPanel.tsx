import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Import Link
import { Settings, Plus, Send, Users, Vote as VoteIcon, Eye, EyeOff, Trophy } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const AdminPanel: React.FC = () => {
  const [hintContent, setHintContent] = useState('');
  const [hintImage, setHintImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    addDailyHint, 
    updateGameState, 
    gameState, 
    players, 
    dailyHints,
    sendMessage, // Import sendMessage
  } = useFirebase();


  const handleAddHint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hintContent.trim()) return;

    setIsLoading(true);
    try {
      await addDailyHint(hintContent.trim(), hintImage.trim() || null);
      setHintContent('');
      setHintImage('');
      toast.success('Hint added successfully! 💡');
      
      // Send a system message to chat
      await sendMessage('admin-system', 'Game Admin', 'A new daily hint has been added! Check the Hints tab. 💡');
    } catch (error) {
      console.error('Error adding hint:', error);
      toast.error('Failed to add hint');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoting = async () => {
    try {
      const newVotingState = !gameState.isVotingOpen;
      await updateGameState({ isVotingOpen: newVotingState });
      
      const messageContent = newVotingState 
        ? 'Voting has been opened! Cast your votes now! 🗳️' 
        : 'Voting has been closed! 🔒';
      
      // Send a system message to chat
      await sendMessage('admin-system', 'Game Admin', messageContent);

      toast.success(
        newVotingState 
          ? 'Voting opened! 🗳️' 
          : 'Voting closed! 🔒'
      );
    } catch (error) {
      console.error('Error updating voting status:', error);
      toast.error('Failed to update voting status');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-4 lg:p-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-cyan-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/10 to-emerald-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">{/* Increased max width for desktop */}
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 lg:mb-10"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 lg:w-20 lg:h-20 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-2xl mb-3 lg:mb-6">
            <Settings className="w-7 h-7 lg:w-10 lg:h-10 text-white" />
          </div>
          <h1 className="text-xl lg:text-4xl font-bold text-white mb-1 lg:mb-3">Admin Panel</h1>
          <p className="text-sm lg:text-lg text-gray-300">Manage MEXC Bali Mystery Game</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 lg:p-6"
          >
            <div className="flex items-center space-x-3 lg:space-x-4">
              <Users className="w-8 h-8 lg:w-10 lg:h-10 text-emerald-400" />
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-white">{players.length}</p>
                <p className="text-gray-300 text-sm lg:text-base">Players Online</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 lg:p-6"
          >
            <div className="flex items-center space-x-3 lg:space-x-4">
              <Plus className="w-8 h-8 lg:w-10 lg:h-10 text-yellow-400" />
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-white">{dailyHints.length}</p>
                <p className="text-gray-300 text-sm lg:text-base">Total Hints</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 lg:p-6"
          >
            <div className="flex items-center space-x-3 lg:space-x-4">
              <VoteIcon className={`w-8 h-8 lg:w-10 lg:h-10 ${gameState.isVotingOpen ? 'text-emerald-400' : 'text-gray-400'}`} />
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-white">
                  {gameState.isVotingOpen ? 'Open' : 'Closed'}
                </p>
                <p className="text-gray-300 text-sm lg:text-base">Voting Status</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 lg:p-6"
          >
            <div className="flex items-center space-x-3 lg:space-x-4">
              <Trophy className={`w-8 h-8 lg:w-10 lg:h-10 ${gameState.isKingQueenVotingOpen ? 'text-yellow-400' : 'text-gray-400'}`} />
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-white">
                  {gameState.isKingQueenVotingOpen ? 'Open' : 'Closed'}
                </p>
                <p className="text-gray-300 text-sm lg:text-base">K&Q Voting</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-12">
          {/* Add Hint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 lg:p-8"
          >
            <div className="flex items-center space-x-3 lg:space-x-4 mb-6 lg:mb-8">
              <Plus className="w-6 h-6 lg:w-7 lg:h-7 text-yellow-400" />
              <h2 className="text-xl lg:text-2xl font-bold text-white">Add Daily Hint</h2>
            </div>

            <form onSubmit={handleAddHint} className="space-y-4 lg:space-y-6">
              <div>
                <label className="block text-sm lg:text-base font-medium text-white mb-3 lg:mb-4">
                  Hint Content
                </label>
                <ReactQuill
                  theme="snow"
                  value={hintContent}
                  onChange={setHintContent}
                  placeholder="Enter hint content..."
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, false] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                      ['link', 'image'],
                      ['clean']
                    ],
                  }}
                  formats={[
                    'header',
                    'bold', 'italic', 'underline', 'strike', 'blockquote',
                    'list', 'bullet',
                    'link', 'image'
                  ]}
                  // Custom class for styling
                  className="quill-custom-theme" 
                />
              </div>


              <motion.button
                type="submit"
                disabled={!hintContent.trim() || isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg transition-all duration-200 text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center text-sm">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                    Adding Hint...
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 text-base">
                    <Send className="w-4 h-4" />
                    <span>Add Hint</span>
                  </div>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Game Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 lg:p-8"
          >
            <div className="flex items-center space-x-3 lg:space-x-4 mb-6 lg:mb-8">
              <Settings className="w-6 h-6 lg:w-7 lg:h-7 text-emerald-400" />
              <h2 className="text-xl lg:text-2xl font-bold text-white">Game Controls</h2>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
              {/* Mystery Person Game Controls */}
              <div className="space-y-6 lg:space-y-8">
                <div className="p-4 lg:p-6 bg-slate-800/60 rounded-xl">
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <div>
                      <h3 className="font-semibold text-white text-base lg:text-lg">Mystery Person Voting</h3>
                      <p className="text-sm lg:text-base text-gray-300">Control when players can vote</p>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      gameState.isVotingOpen
                        ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                        : 'bg-red-500/20 text-red-400 border border-red-400/30'
                    }`}>
                      {gameState.isVotingOpen ? 'OPEN' : 'CLOSED'}
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={handleToggleVoting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-2 sm:py-3 px-4 sm:px-6 font-semibold rounded-xl shadow-lg transition-all duration-200 text-base ${
                      gameState.isVotingOpen
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {gameState.isVotingOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span>{gameState.isVotingOpen ? 'Close Voting' : 'Open Voting'}</span>
                    </div>
                  </motion.button>
                </div>

                {/* View Mystery Person Vote Results Button */}
                <Link to="/admin/vote-results">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 sm:py-3 px-4 sm:px-6 font-semibold rounded-xl shadow-lg transition-all duration-200 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-base"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <VoteIcon className="w-4 h-4" />
                      <span>View Mystery Person Vote Results</span>
                    </div>
                  </motion.button>
                </Link>
              </div>

              {/* King & Queen Game Controls */}
              <div className="space-y-4 sm:space-y-6">
                <div className="p-3 sm:p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div>
                      <h3 className="font-semibold text-white text-base">King & Queen Voting Status</h3>
                      <p className="text-xs sm:text-sm text-gray-400">Control when players can vote for King & Queen</p>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      gameState.isKingQueenVotingOpen
                        ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                        : 'bg-red-500/20 text-red-400 border border-red-400/30'
                    }`}>
                      {gameState.isKingQueenVotingOpen ? 'OPEN' : 'CLOSED'}
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={async () => {
                      try {
                        const newKingQueenVotingState = !gameState.isKingQueenVotingOpen;
                        await updateGameState({ isKingQueenVotingOpen: newKingQueenVotingState });
                        
                        const messageContent = newKingQueenVotingState 
                          ? 'King & Queen voting has been opened! Cast your votes now! 👑' 
                          : 'King & Queen voting has been closed! 🔒';
                        
                        await sendMessage('admin-system', 'Game Admin', messageContent);

                        toast.success(
                          newKingQueenVotingState 
                            ? 'King & Queen Voting opened! 👑' 
                            : 'King & Queen Voting closed! 🔒'
                        );
                      } catch (error) {
                        console.error('Error updating King & Queen voting status:', error);
                        toast.error('Failed to update King & Queen voting status');
                      }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-2 sm:py-3 px-4 sm:px-6 font-semibold rounded-xl shadow-lg transition-all duration-200 text-base ${
                      gameState.isKingQueenVotingOpen
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {gameState.isKingQueenVotingOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span>{gameState.isKingQueenVotingOpen ? 'Close K&Q Voting' : 'Open K&Q Voting'}</span>
                    </div>
                  </motion.button>
                </div>

                {/* View King & Queen Vote Results Button */}
                <Link to="/admin/king-queen-vote-results">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 sm:py-3 px-4 sm:px-6 font-semibold rounded-xl shadow-lg transition-all duration-200 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white text-base"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Trophy className="w-4 h-4" />
                      <span>View King & Queen Results</span>
                    </div>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
