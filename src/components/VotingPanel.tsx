import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote as VoteIcon, Users, Trophy, Clock } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';
import { usePlayer } from '../context/PlayerContext';
import toast from 'react-hot-toast';

const VotingPanel: React.FC = () => {
  const [suspectedName, setSuspectedName] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const { gameState, players, submitVote } = useFirebase();
  const { currentPlayer } = usePlayer();

  const handleSubmitVote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!suspectedName.trim() || !currentPlayer) return;
    
    if (hasVoted) {
      toast.error('You have already voted!');
      return;
    }

    try {
      await submitVote(currentPlayer.id, currentPlayer.name, suspectedName.trim()); // Pass currentPlayer.name as voterName
      setHasVoted(true);
      setSuspectedName('');
      toast.success('Your vote has been submitted! 🗳️');
    } catch (error) {
      // console.error('Error submitting vote:', error); // Removed for linting
      toast.error('Failed to submit vote');
    }
  };

  if (!gameState.isVotingOpen) {
    return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 text-center"
    >
      <Clock className="w-10 h-10 sm:w-12 h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Voting Not Available</h3>
      <p className="text-sm sm:text-base text-gray-400">
        Voting will open when the admin decides it's time to reveal the mystery person!
      </p>
    </motion.div>
  );
}

return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-4 sm:space-y-6 p-4"
  >
    <div className="flex items-center space-x-2 sm:space-x-3">
      <VoteIcon className="w-5 h-5 sm:w-6 h-6 text-purple-400" />
      <h2 className="text-lg sm:text-xl font-bold text-white">Final Vote</h2>
    </div>

    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-xl p-3 sm:p-4">
      <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
        <Trophy className="w-4 h-4 sm:w-5 h-5 text-yellow-400" />
        <h3 className="text-base sm:text-lg font-semibold text-white">Time to Vote!</h3>
      </div>
      <p className="text-sm sm:text-base text-gray-300">
        Who do you think is the mystery person? Enter their name below and submit your final vote.
      </p>
    </div>

    <AnimatePresence>
      {!hasVoted ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6"
        >
          <form onSubmit={handleSubmitVote} className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="suspected" className="block text-sm font-medium text-gray-200 mb-2">
                Who is the mystery person?
              </label>
              <input
                type="text"
                id="suspected"
                value={suspectedName}
                onChange={(e) => setSuspectedName(e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-200 text-sm"
                placeholder="Enter the person's name..."
                maxLength={50}
                required
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 text-base"
            >
              Submit Vote 🗳️
            </motion.button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-400/30 rounded-xl p-4 sm:p-6 text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 h-16 bg-green-500/20 rounded-full mb-3 sm:mb-4">
            <VoteIcon className="w-7 h-7 sm:w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Vote Submitted!</h3>
          <p className="text-sm sm:text-base text-gray-300">
            Thank you for participating! Wait for the results to be revealed.
          </p>
        </motion.div>
      )}
    </AnimatePresence>

    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-3 h-3 sm:w-4 h-4 text-cyan-400" />
          <span className="text-white font-medium text-sm">Total Players</span>
        </div>
        <span className="text-cyan-400 font-bold text-sm">{players.length}</span>
      </div>
    </div>
  </motion.div>
);
};

export default VotingPanel;
