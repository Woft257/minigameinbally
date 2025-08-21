import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Vote } from '../types';

interface VoteResultsProps {
  votes: Vote[];
}

const VoteResults: React.FC<VoteResultsProps> = ({ votes }) => {
  const [showVoterList, setShowVoterList] = useState(false);
  const [selectedSuspectedPerson, setSelectedSuspectedPerson] = useState<string | null>(null);

  // Calculate vote counts for each suspected person
  const voteCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    votes.forEach(vote => {
      counts[vote.suspectedPersonName] = (counts[vote.suspectedPersonName] || 0) + 1;
    });
    // Convert to an array of { name, count } objects and sort by count descending
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [votes]);

  const totalVotes = votes.length;

  const handleShowVoters = (personName: string) => {
    setSelectedSuspectedPerson(personName);
    setShowVoterList(true);
  };

  const handleBackToResults = () => {
    setShowVoterList(false);
    setSelectedSuspectedPerson(null);
  };

  const votersForSelectedPerson = useMemo(() => {
    if (!selectedSuspectedPerson) return [];
    return votes
      .filter(vote => vote.suspectedPersonName === selectedSuspectedPerson)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()); // Sort by timestamp
  }, [votes, selectedSuspectedPerson]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
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
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-3 sm:mb-4">
            <BarChart2 className="w-7 h-7 sm:w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Final Vote Results</h1>
          <p className="text-sm sm:text-base text-gray-400">Overview of all player votes</p>
        </motion.div>

        {/* Back Button */}
        <Link to="/admin" className="block mb-4 sm:mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-medium hover:bg-white/20 transition-colors duration-200"
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
          {totalVotes === 0 ? (
            <p className="text-gray-400 text-center py-4 text-sm sm:text-base">No votes cast yet.</p>
          ) : (
            <>
              {!showVoterList ? (
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-white text-lg font-semibold mb-4">Total Votes: {totalVotes}</p>
                  {voteCounts.map((result) => (
                    <div key={result.name} className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-white font-medium text-base sm:text-lg">{result.name}</span>
                        <span className="text-blue-300 text-xs sm:text-sm">{result.count} votes</span>
                      </div>
                      <button
                        onClick={() => handleShowVoters(result.name)}
                        className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
                        aria-label={`Show voters for ${result.name}`}
                      >
                        <ChevronRight className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBackToResults}
                    className="flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-medium hover:bg-white/20 transition-colors duration-200 mb-4"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Vote Results</span>
                  </motion.button>
                  <h2 className="text-white text-xl font-semibold mb-4">Voters for {selectedSuspectedPerson}</h2>
                  {votersForSelectedPerson.length === 0 ? (
                    <p className="text-gray-400 text-center py-4 text-sm sm:text-base">No voters found for this person.</p>
                  ) : (
                    <div className="space-y-2">
                      {votersForSelectedPerson.map((vote) => (
                        <div key={vote.id} className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
                          <span className="text-white font-medium">{vote.voterName}</span>
                          <span className="text-gray-400 text-sm">
                            {new Date(vote.timestamp).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VoteResults;
