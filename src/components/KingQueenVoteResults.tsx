import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Crown, Users, BarChart2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFirebase } from '../hooks/useFirebase';
// import { Player } from '../types'; // Player is used in getPlayerAvatar, so keep it.

const KingQueenVoteResults: React.FC = () => {
  const { kingQueenVotes, players } = useFirebase();

  const calculateResults = useMemo(() => {
    const kingCounts: { [key: string]: number } = {};
    const queenCounts: { [key: string]: number } = {};

    kingQueenVotes.forEach(vote => {
      kingCounts[vote.kingCandidate] = (kingCounts[vote.kingCandidate] || 0) + 1;
      queenCounts[vote.queenCandidate] = (queenCounts[vote.queenCandidate] || 0) + 1;
    });

    const sortedKingCandidates = Object.entries(kingCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([name, count]) => ({ name, count }));

    const sortedQueenCandidates = Object.entries(queenCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([name, count]) => ({ name, count }));

    const totalVotes = kingQueenVotes.length;

    return { sortedKingCandidates, sortedQueenCandidates, totalVotes };
  }, [kingQueenVotes]);

  const { sortedKingCandidates, sortedQueenCandidates, totalVotes } = calculateResults;

  const getPlayerAvatar = (playerName: string) => {
    const player = players.find(p => p.name === playerName);
    return player ? player.country : '👤'; // Fallback to a neutral person icon if player not found
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/10 to-teal-600/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-4xl mx-auto space-y-6 py-8"
      >
        {/* Back Button */}
        <Link to="/admin" className="inline-flex items-center text-gray-400 hover:text-white transition-colors duration-200 mb-4">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Back to Admin Panel</span>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-3 sm:mb-4">
            <Crown className="w-7 h-7 sm:w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">King & Queen Vote Results</h1>
          <p className="text-sm sm:text-base text-gray-400">See who's leading the royal race!</p>
        </motion.div>

        {totalVotes === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center shadow-lg mb-6 sm:mb-8"
          >
            <BarChart2 className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">No King & Queen Votes Yet</h3>
            <p className="text-base text-gray-400">
              Votes will appear here once players start submitting their choices for King and Queen.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 sm:mb-8">
            {/* King Results */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-5">
                <Crown className="w-7 h-7 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">King Candidates</h3>
              </div>
              <ul className="space-y-4">
                {sortedKingCandidates.map((candidate, index) => (
                  <motion.li
                    key={candidate.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-2 sm:p-3"
                >
                  <div className="flex items-center space-x-4">
                    {getPlayerAvatar(candidate.name) !== '👤' && (
                      <span className="text-2xl">{getPlayerAvatar(candidate.name)}</span>
                    )}
                    <span className="text-white font-semibold text-lg">
                      {candidate.name || 'Unknown Candidate'}
                    </span>
                  </div>
                  <span className="text-yellow-300 font-extrabold text-xl">{candidate.count} votes</span>
                </motion.li>
              ))}
            </ul>
          </div>

            {/* Queen Results */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-5">
                <Crown className="w-7 h-7 text-pink-400" />
                <h3 className="text-xl font-bold text-white">Queen Candidates</h3>
              </div>
              <ul className="space-y-4">
                {sortedQueenCandidates.map((candidate, index) => (
                  <motion.li
                    key={candidate.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-2 sm:p-3"
                  >
                    <div className="flex items-center space-x-4">
                      {getPlayerAvatar(candidate.name) !== '👤' && (
                        <span className="text-2xl">{getPlayerAvatar(candidate.name)}</span>
                      )}
                      <span className="text-white font-semibold text-lg">
                        {candidate.name || 'Unknown Candidate'}
                      </span>
                    </div>
                    <span className="text-pink-300 font-extrabold text-xl">{candidate.count} votes</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-cyan-400" />
              <span className="text-white font-semibold text-lg">Total King & Queen Votes Cast</span>
            </div>
            <span className="text-cyan-400 font-extrabold text-xl">{totalVotes}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default KingQueenVoteResults;
