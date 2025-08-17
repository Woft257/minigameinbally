
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Calendar, Eye } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';

const DailyHints: React.FC = () => {
  const [selectedHint, setSelectedHint] = useState<string | null>(null);
  const { dailyHints } = useFirebase();

  // Display all hints, regardless of isActive status, and sort them by creation date
  const sortedHints = dailyHints.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="space-y-3 sm:space-y-4 p-4">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
        <h2 className="text-lg sm:text-xl font-bold text-white">Daily Hints</h2>
      </div>

      {sortedHints.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-6 sm:py-8 text-gray-300"
        >
          <Lightbulb className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
          <p className="text-sm sm:text-base font-medium">No hints available yet...</p>
          <p className="text-xs sm:text-sm mt-1 sm:mt-2">Check back daily for new clues!</p>
        </motion.div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {sortedHints.map((hint, index) => (
            <motion.div
              key={hint.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-3 sm:p-4 hover:bg-slate-700/80 transition-all duration-200 shadow-lg"
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
                    <span className="text-yellow-300 font-bold text-xs sm:text-sm">#{sortedHints.length - index}</span>
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-white">Hint #{sortedHints.length - index}</p>
                    <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-gray-300">
                      <Calendar className="w-3 h-3" />
                      <span>{hint.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                {hint.content.length > 100 && (
                  <button
                    onClick={() => setSelectedHint(selectedHint === hint.id ? null : hint.id)}
                    className="flex items-center space-x-1 px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 rounded-lg text-cyan-300 text-xs transition-colors duration-200"
                  >
                    <Eye className="w-3 h-3" />
                    <span>{selectedHint === hint.id ? 'Less' : 'More'}</span>
                  </button>
                )}
              </div>

              <div className="text-gray-200 leading-relaxed mb-2 sm:mb-3 quill-content text-sm"
                dangerouslySetInnerHTML={{
                  __html: selectedHint === hint.id || hint.content.length <= 100
                    ? hint.content
                    : `${hint.content.substring(0, 100)}...`
                }}
              />

              {hint.imageUrl && (
                <div className="rounded-lg overflow-hidden border border-slate-600/30">
                  <img
                    src={hint.imageUrl}
                    alt="Hint"
                    className="w-full h-24 sm:h-32 object-cover"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyHints;
