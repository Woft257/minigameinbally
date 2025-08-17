import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminAuthProps {
  onAuthSuccess: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthSuccess }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // In a real application, you would send this password to a server for verification.
    // For this example, we're directly comparing it to an environment variable.
    // This is NOT secure for production environments.
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (password === adminPassword) {
      toast.success('Admin login successful!');
      onAuthSuccess();
    } else {
      toast.error('Incorrect password.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-6"
          >
            <Lock className="w-full h-full text-emerald-400" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="font-display text-4xl sm:text-5xl font-bold text-white mb-3 tracking-wide"
          >
            Admin Access
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg sm:text-xl text-bali-emerald font-medium mb-4"
          >
            Enter password to proceed
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="glass-effect rounded-3xl p-6 sm:p-8 shadow-2xl"
        >
          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 sm:py-3 glass-effect rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-bali-emerald/50 focus:border-bali-emerald/30 transition-all duration-200 text-base"
                  placeholder="Enter admin password"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 sm:py-3 px-6 bg-tropical-gradient hover:shadow-xl hover:shadow-bali-emerald/25 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-lg transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center justify-center text-base">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                  Logging In...
                </div>
              ) : (
                '🔑 Login'
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminAuth;
