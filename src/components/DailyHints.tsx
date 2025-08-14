import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X, Calendar, Eye } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';

const DailyHints: React.FC = () => {
  const [selectedHint, setSelectedHint] = useState<string | null>(null);
  const { dailyHints } = useFirebase();

  const activeHints = dailyHints.filter(hint => hint.isActive);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <Lightbulb className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">Daily Hints</h2>
      </div>

      {activeHints.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-400"
        >
          <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No hints available yet...</p>
          <p className="text-sm mt-2">Check back daily for new clues!</p>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {activeHints.map((hint, index) => (
            <motion.div
              key={hint.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-yellow-500/20 rounded-lg">
                    <span className="text-yellow-400 font-bold text-sm">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Hint #{index + 1}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{hint.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                {hint.content.length > 100 && (
                  <button
                    onClick={() => setSelectedHint(selectedHint === hint.id ? null : hint.id)}
                    className="flex items-center space-x-1 px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg text-cyan-400 text-xs transition-colors duration-200"
                  >
                    <Eye className="w-3 h-3" />
                    <span>{selectedHint === hint.id ? 'Less' : 'More'}</span>
                  </button>
                )}
              </div>

              <p className="text-gray-300 leading-relaxed mb-3">
                {selectedHint === hint.id || hint.content.length <= 100
                  ? hint.content
                  : `${hint.content.substring(0, 100)}...`}
              </p>

              {hint.imageUrl && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={hint.imageUrl}
                    alt="Hint"
                    className="w-full h-32 object-cover"
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