import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Users, Trophy, Clock } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';
import { usePlayer } from '../context/PlayerContext';
import toast from 'react-hot-toast';

const KingQueenVotingPanel: React.FC = () => {
  const [kingCandidate, setKingCandidate] = useState('');
  const [queenCandidate, setQueenCandidate] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const { gameState, players, submitKingQueenVote } = useFirebase();
  const { currentPlayer } = usePlayer();

  const handleSubmitVote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!kingCandidate.trim() || !queenCandidate.trim() || !currentPlayer) return;
    
    if (hasVoted) {
      toast.error('You have already voted for King and Queen!');
      return;
    }

    try {
      await submitKingQueenVote(currentPlayer.id, currentPlayer.name, kingCandidate.trim(), queenCandidate.trim());
      setHasVoted(true);
      setKingCandidate('');
      setQueenCandidate('');
      toast.success('Your King and Queen votes have been submitted! 👑');
    } catch (error) {
      toast.error('Failed to submit King and Queen votes');
    }
  };

  if (!gameState.isKingQueenVotingOpen) {
    return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 sm:p-6 text-center"
    >
      <Clock className="w-10 h-10 sm:w-12 h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">King & Queen Voting Not Available</h3>
      <p className="text-sm sm:text-base text-gray-300">
        King and Queen voting will open when the admin decides!
      </p>
    </motion.div>
  );
}

return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-4 sm:space-y-6 p-4 smooth-scroll"
  >
    <div className="flex items-center space-x-2 sm:space-x-3">
      <Crown className="w-5 h-5 sm:w-6 h-6 text-yellow-400" />
      <h2 className="text-lg sm:text-xl font-bold text-white">King & Queen Vote</h2>
    </div>

    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-xl p-3 sm:p-4">
      <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
        <Trophy className="w-4 h-4 sm:w-5 h-5 text-yellow-400" />
        <h3 className="text-base sm:text-lg font-semibold text-white">Vote for King & Queen!</h3>
      </div>
      <p className="text-sm sm:text-base text-gray-200">
        Who do you think should be King and Queen? Enter their names below and submit your votes.
      </p>
    </div>

    <AnimatePresence>
      {!hasVoted ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 sm:p-6"
        >
          <form onSubmit={handleSubmitVote} className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="kingCandidate" className="block text-sm font-medium text-white mb-2">
                Who should be King?
              </label>
              <input
                type="text"
                id="kingCandidate"
                value={kingCandidate}
                onChange={(e) => setKingCandidate(e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200 text-sm"
                placeholder="Enter King's name..."
                maxLength={50}
                required
              />
            </div>
            <div>
              <label htmlFor="queenCandidate" className="block text-sm font-medium text-white mb-2">
                Who should be Queen?
              </label>
              <input
                type="text"
                id="queenCandidate"
                value={queenCandidate}
                onChange={(e) => setQueenCandidate(e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200 text-sm"
                placeholder="Enter Queen's name..."
                maxLength={50}
                required
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 text-base"
            >
              Submit King & Queen Votes 👑
            </motion.button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-600/20 border border-emerald-400/30 rounded-xl p-4 sm:p-6 text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 h-16 bg-emerald-500/20 rounded-full mb-3 sm:mb-4">
            <Crown className="w-7 h-7 sm:w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Votes Submitted!</h3>
          <p className="text-sm sm:text-base text-gray-200">
            Thank you for participating! Wait for the King and Queen results to be revealed.
          </p>
        </motion.div>
      )}
    </AnimatePresence>

    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 sm:p-4">
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

export default KingQueenVotingPanel;
