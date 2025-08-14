import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, UserPlus, Waves } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';
import { usePlayer } from '../context/PlayerContext';
import toast from 'react-hot-toast';

const countries = [
  'Vietnam', 'Singapore', 'Thailand', 'Indonesia', 'Malaysia', 
  'Philippines', 'Cambodia', 'Laos', 'Myanmar', 'Brunei',
  'China', 'Japan', 'South Korea', 'India', 'Australia',
  'United States', 'United Kingdom', 'Canada', 'Germany', 'France'
];

const Login: React.FC = () => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addPlayer, players } = useFirebase();
  const { setCurrentPlayer } = usePlayer();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !country) {
      toast.error('Please enter your name and select your country');
      return;
    }

    if (players.length >= 40) {
      toast.error('Game is full! Maximum 40 players allowed.');
      return;
    }

    if (players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      toast.error('Name already taken! Please choose a different name.');
      return;
    }

    setIsLoading(true);
    try {
      const playerId = await addPlayer(name.trim(), country);
      const newPlayer = {
        id: playerId,
        name: name.trim(),
        country,
        joinedAt: new Date(),
        isAdmin: false
      };
      setCurrentPlayer(newPlayer);
      toast.success(`Welcome to MEXC Bali, ${name}! 🌊`);
    } catch (error) {
      toast.error('Failed to join the game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-teal-600/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl mb-6 shadow-2xl"
          >
            <Waves className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl font-bold text-white mb-2"
          >
            Sea & Style Retreat
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg text-gray-300 mb-2"
          >
            MEXC in Bali
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-400/20 to-green-400/20 rounded-full border border-cyan-400/30"
          >
            <span className="text-cyan-300 font-semibold">Mystery Person Game</span>
          </motion.div>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                Your Name
              </label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your name"
                  maxLength={20}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-200 mb-2">
                Country
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all duration-200 appearance-none"
                  required
                >
                  <option value="" className="bg-slate-800">Select your country</option>
                  {countries.map((c) => (
                    <option key={c} value={c} className="bg-slate-800">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                  Joining Game...
                </div>
              ) : (
                'Join the Mystery 🏝️'
              )}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Players Online</span>
              <span className="text-cyan-400 font-semibold">{players.length}/40</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;