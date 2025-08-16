import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFirebase } from '../hooks/useFirebase'; // We'll add reset functions here
import toast from 'react-hot-toast';

const ResetPanel: React.FC = () => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { resetAllData } = useFirebase(); // This function will be added to useFirebase

  const handleResetData = async () => {
    setIsLoading(true);
    try {
      await resetAllData();
      toast.success('All game data has been reset! 🎉');
      setIsConfirming(false); // Reset confirmation state
    } catch (error) {
      console.error('Error resetting data:', error);
      toast.error('Failed to reset data. Check console for details.');
    } finally {
      setIsLoading(false);
    }
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
        className="relative z-10 max-w-2xl mx-auto space-y-6 py-8"
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
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl mb-3 sm:mb-4">
            <Trash2 className="w-7 h-7 sm:w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Reset Game Data</h1>
          <p className="text-sm sm:text-base text-gray-400">
            This page is for debugging purposes. Use with caution!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center shadow-lg"
        >
          {isConfirming ? (
            <div className="space-y-6">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Are you absolutely sure?</h3>
              <p className="text-base text-gray-400 mb-6">
                This action cannot be undone. All messages, players, hints, votes, and game state will be permanently deleted.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={handleResetData}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg transition-all duration-200 text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center text-sm">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                      Deleting...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Trash2 className="w-5 h-5" />
                      <span>Yes, Delete All Data</span>
                    </div>
                  )}
                </motion.button>
                <motion.button
                  onClick={() => setIsConfirming(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 px-6 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg transition-all duration-200 text-base"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>No, Cancel</span>
                  </div>
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <Trash2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Reset Game Data</h3>
              <p className="text-base text-gray-400 mb-6">
                Click the button below to permanently delete all game data, including players, messages, hints, and votes.
              </p>
              <motion.button
                onClick={() => setIsConfirming(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 text-base"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Trash2 className="w-5 h-5" />
                  <span>Reset All Data</span>
                </div>
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetPanel;
