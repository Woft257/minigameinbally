import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, ArrowLeft } from 'lucide-react'; // Import ArrowLeft icon
import { Link } from 'react-router-dom'; // Import Link
import { Vote } from '../types';

interface VoteResultsProps {
  votes: Vote[];
}

const VoteResults: React.FC<VoteResultsProps> = ({ votes }) => {
  const voteCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    votes.forEach(vote => {
      counts[vote.suspectedPersonName] = (counts[vote.suspectedPersonName] || 0) + 1;
    });
    return Object.entries(counts).sort(([, countA], [, countB]) => countB - countA);
  }, [votes]);

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
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Vote Results</h1>
          <p className="text-sm sm:text-base text-gray-400">Overview of all player votes</p>
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
          {voteCounts.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No votes submitted yet.</p>
          ) : (
            <div className="space-y-4">
              {voteCounts.map(([person, count]) => (
                <div key={person} className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
                  <span className="text-white font-medium">{person}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-300 font-bold">{count} votes</span>
                    {/* Display creation date if available */}
                    {votes.find(v => v.suspectedPersonName === person)?.timestamp && (
                      <span className="text-xs text-gray-300"> {/* Changed to gray-300 for better visibility */}
                        ({new Date(votes.find(v => v.suspectedPersonName === person)!.timestamp).toLocaleString('en-US', { 
                          timeZone: 'Asia/Makassar', // Bali timezone
                          month: 'numeric', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })})
                      </span>
                    )}
                  </div>
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
