import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Import Link
import { Settings, Plus, Send, Users, Vote as VoteIcon, Eye, EyeOff, UserCheck, UserX } from 'lucide-react';
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
    setMysteryPerson,
    resetMysteryPerson,
    sendMessage // Import sendMessage
  } = useFirebase();

  const mysteryPerson = useMemo(() => {
    return players.find(p => p.id === gameState.mysteryPersonId);
  }, [players, gameState.mysteryPersonId]);


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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 sm:p-6">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/10 to-teal-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-sm sm:text-base text-gray-400">Manage MEXC Bali Mystery Game</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6"
          >
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{players.length}</p>
                <p className="text-gray-400">Players Online</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6"
          >
            <div className="flex items-center space-x-3">
              <Plus className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">{dailyHints.length}</p>
                <p className="text-gray-400">Total Hints</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6"
          >
            <div className="flex items-center space-x-3">
              <VoteIcon className={`w-8 h-8 ${gameState.isVotingOpen ? 'text-purple-400' : 'text-gray-400'}`} />
              <div>
                <p className="text-2xl font-bold text-white">
                  {gameState.isVotingOpen ? 'Open' : 'Closed'}
                </p>
                <p className="text-gray-400">Voting Status</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Add Hint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Plus className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Add Daily Hint</h2>
            </div>

            <form onSubmit={handleAddHint} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
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
                {/* Character count for rich text is more complex, might need a custom solution if strict */}
                {/* <div className="text-right text-xs text-gray-500 mt-1">
                  {hintContent.length}/1000
                </div> */}
              </div>


              <motion.button
                type="submit"
                disabled={!hintContent.trim() || isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-6 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                    Adding Hint...
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
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
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Game Controls</h2>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">Voting System</h3>
                    <p className="text-sm text-gray-400">Control when players can vote</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                  className={`w-full py-3 px-6 font-semibold rounded-xl shadow-lg transition-all duration-200 ${
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

              {/* Mystery Person Selection */}
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">Mystery Person</h3>
                    <p className="text-sm text-gray-400">Select the mystery person for the game</p>
                  </div>
                  {mysteryPerson && (
                    <div className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-400/30">
                      SET
                    </div>
                  )}
                </div>

                {mysteryPerson ? (
                  <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg mb-4">
                    <span className="text-white font-medium">{mysteryPerson.name}</span>
                    <UserCheck className="w-5 h-5 text-green-400" />
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm mb-4">No mystery person selected.</p>
                )}

                {mysteryPerson ? (
                  <motion.button
                    onClick={async () => {
                      await resetMysteryPerson();
                      toast.success('Mystery person reset!');
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-6 font-semibold rounded-xl shadow-lg transition-all duration-200 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <UserX className="w-4 h-4" />
                      <span>Reset Mystery Person</span>
                    </div>
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={async () => {
                      if (players.length > 0) {
                        const randomIndex = Math.floor(Math.random() * players.length);
                        const randomPlayer = players[randomIndex];
                        await setMysteryPerson(randomPlayer.id);
                        toast.success(`Mystery person selected: ${randomPlayer.name}!`);
                      } else {
                        toast.error('No players available to select as mystery person.');
                      }
                    }}
                    disabled={players.length === 0}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-6 font-semibold rounded-xl shadow-lg transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <UserCheck className="w-4 h-4" />
                      <span>Select Random Mystery Person</span>
                    </div>
                  </motion.button>
                )}
              </div>

              {/* View Vote Results Button */}
              <Link to="/admin/voteresult"> {/* Use Link for navigation */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-6 font-semibold rounded-xl shadow-lg transition-all duration-200 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <VoteIcon className="w-4 h-4" />
                    <span>View All Vote Results</span>
                  </div>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
