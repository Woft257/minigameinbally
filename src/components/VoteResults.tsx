import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, ArrowLeft } from 'lucide-react'; // Import ArrowLeft icon
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { Vote } from '../types';

interface VoteResultsProps {
  votes: Vote[];
}

interface GroupedVoteSession {
  sessionKey: string; // e.g., "2025-08-16 19h"
  totalVotes: number;
  votesInSession: Vote[];
}

const VoteResults: React.FC<VoteResultsProps> = ({ votes }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const groupedVotes = useMemo(() => {
    const sessions: { [key: string]: GroupedVoteSession } = {};

    votes.forEach(vote => {
      const date = new Date(vote.timestamp);
      // Format to YYYY-MM-DD HHh for internal key, but display more friendly
      const internalSessionKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}h`;

      if (!sessions[internalSessionKey]) {
        sessions[internalSessionKey] = {
          sessionKey: internalSessionKey, // Store the machine-readable key
          totalVotes: 0,
          votesInSession: [],
        };
      }

      sessions[internalSessionKey].totalVotes++;
      sessions[internalSessionKey].votesInSession.push(vote);
    });

    // Sort sessions by key (timestamp) in ascending order
    return Object.values(sessions).sort((a, b) => {
      const dateA = new Date(a.sessionKey.replace('h', ':00'));
      const dateB = new Date(b.sessionKey.replace('h', ':00'));
      return dateA.getTime() - dateB.getTime();
    });
  }, [votes]);

  const formatSessionKeyForDisplay = (key: string) => {
    const date = new Date(key.replace('h', ':00'));
    return date.toLocaleString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Makassar' // Bali timezone
    });
  };

  const handleViewDetails = (sessionKey: string) => {
    navigate(`/admin/vote-results/${encodeURIComponent(sessionKey)}`);
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-4">
            <BarChart2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Vote Results by Session</h1>
          <p className="text-sm sm:text-base text-gray-400">Overview of player votes grouped by session</p>
        </motion.div>

        {/* Back Button */}
        <Link to="/admin" className="block mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-medium hover:bg-white/20 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Admin Panel</span>
          </motion.button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6 col-span-full"
        >
          {groupedVotes.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No vote sessions found yet.</p>
          ) : (
            <div className="space-y-4">
              {groupedVotes.map(session => (
                <div key={session.sessionKey} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/10 p-3 rounded-lg">
                  <div className="flex flex-col mb-2 sm:mb-0">
                    <span className="text-white font-medium text-lg">{formatSessionKeyForDisplay(session.sessionKey)}</span>
                    <span className="text-blue-300 text-sm">{session.totalVotes} total votes</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleViewDetails(session.sessionKey)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                  >
                    View Details
                  </motion.button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VoteResults;
