import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart2, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'; // Import ChevronDown and ChevronUp
import { Vote } from '../types';

interface VoteDetailsProps {
  allVotes: Vote[]; // All votes passed from App.tsx
}

const VoteDetails: React.FC<VoteDetailsProps> = ({ allVotes }) => {
  const { sessionKey: encodedSessionKey } = useParams<{ sessionKey: string }>();
  const sessionKey = encodedSessionKey ? decodeURIComponent(encodedSessionKey) : undefined;

  const [expandedPerson, setExpandedPerson] = React.useState<string | null>(null); // State to manage expanded person

  const toggleExpand = (personName: string) => {
    setExpandedPerson(prev => (prev === personName ? null : personName));
  };

  const sessionVotes = useMemo(() => {
    if (!sessionKey) return [];
    return allVotes.filter(vote => {
      const date = new Date(vote.timestamp);
      const currentSessionKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}h`;
      return currentSessionKey === sessionKey;
    }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()); // Sort by timestamp within the session
  }, [allVotes, sessionKey]);

  const voteCounts = useMemo(() => {
    const counts: { [key: string]: { count: number; voters: string[] } } = {};
    sessionVotes.forEach(vote => {
      if (!counts[vote.suspectedPersonName]) {
        counts[vote.suspectedPersonName] = { count: 0, voters: [] };
      }
      counts[vote.suspectedPersonName].count++;
      counts[vote.suspectedPersonName].voters.push(vote.voterName);
    });
    return Object.entries(counts).sort(([, dataA], [, dataB]) => dataB.count - dataA.count);
  }, [sessionVotes]);

  if (!sessionKey) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 text-white text-center">
        <p className="text-sm sm:text-base">No session key provided.</p>
        <Link to="/admin/vote-results" className="text-blue-400 hover:underline text-sm sm:text-base">Back to Vote Results</Link>
      </div>
    );
  }

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
          <h1 className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Vote Details for {sessionKey}</h1>
          <p className="text-sm sm:text-base text-gray-400">Detailed breakdown of votes in this session</p>
        </motion.div>

        {/* Back Button */}
        <Link to="/admin/vote-results" className="block mb-4 sm:mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-medium hover:bg-white/20 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Vote Sessions</span>
          </motion.button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6 col-span-full"
        >
          {sessionVotes.length === 0 ? (
            <p className="text-gray-400 text-center py-4 text-sm sm:text-base">No votes found for this session.</p>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Overall Ranking */}
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Overall Ranking</h2>
              <div className="space-y-3">
                {voteCounts.map(([person, data]) => (
                  <div key={person} className="bg-white/10 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium text-sm sm:text-base">{person}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-300 font-bold text-sm">{data.count} votes</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleExpand(person)}
                          className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
                        >
                          {expandedPerson === person ? (
                            <ChevronUp className="w-4 h-4 text-white" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-white" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                    {expandedPerson === person && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 sm:mt-3 pl-3 sm:pl-4 border-l border-white/20"
                      >
                        <p className="text-gray-300 text-xs sm:text-sm mb-1">Voters:</p>
                        <ul className="list-disc list-inside text-gray-400 text-xs sm:text-sm">
                          {data.voters.map((voter, i) => (
                            <li key={i}>{voter}</li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* Individual Votes */}
              <h2 className="text-lg sm:text-xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">Individual Votes</h2>
              <div className="space-y-3">
                {sessionVotes.map((vote, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
                    <span className="text-white font-medium text-sm">{vote.voterName} voted for {vote.suspectedPersonName}</span>
                    <span className="text-xs text-gray-300">
                      ({new Date(vote.timestamp).toLocaleString('en-US', { 
                        timeZone: 'Asia/Makassar', // Bali timezone
                        month: 'numeric', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VoteDetails;
