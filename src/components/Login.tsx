import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, UserPlus, Palmtree, ChevronDown } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';
import { usePlayer } from '../context/PlayerContext';
import toast from 'react-hot-toast';

import baliHeroBg from '../assets/bali-hero-bg.jpg';

const allCountries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Brazzaville)", "Congo (Kinshasa)",
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
  "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
  "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
  "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
].sort();

const Login: React.FC = () => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addPlayer, players } = useFirebase();
  const { setCurrentPlayer } = usePlayer();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCountries = useMemo(() => {
    return allCountries.filter(c =>
      c.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !country) {
      toast.error('Please enter your name and select your country');
      return;
    }

    if (!allCountries.includes(country)) {
      toast.error('Please select a valid country from the list.');
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
    <div className="min-h-screen bg-bali-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${baliHeroBg})` }}
      />
      
      {/* Tropical Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 opacity-20">
          <Palmtree className="w-full h-full text-bali-emerald animate-palm-sway" />
        </div>
        <div className="absolute bottom-20 right-20 w-24 h-24 opacity-20">
          <Palmtree className="w-full h-full text-bali-gold animate-palm-sway" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute top-1/3 right-10 w-20 h-20 bg-bali-emerald/10 rounded-full blur-2xl animate-tropical-float"></div>
        <div className="absolute bottom-1/3 left-20 w-28 h-28 bg-bali-coral/10 rounded-full blur-2xl animate-tropical-float" style={{ animationDelay: '3s' }}></div>
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
            className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-6 animate-tropical-float"
          >
            <img 
              src="/MEXC Logo Mark_Blue.png" 
              alt="MEXC Bali Logo" 
              className="w-full h-full object-contain drop-shadow-2xl filter brightness-0 invert"
            />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="font-display text-4xl sm:text-5xl font-bold text-white mb-3 tracking-wide"
          >
            MEXC Bali
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg sm:text-xl text-bali-emerald font-medium mb-4"
          >
            Tropical Mystery Experience
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="inline-block px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-bali-emerald/20 to-bali-turquoise/20 rounded-full border border-bali-emerald/40 shadow-lg"
          >
            <span className="text-white font-semibold text-sm sm:text-base flex items-center gap-2">
              <Palmtree className="w-4 h-4" />
              Mystery Person Game
            </span>
          </motion.div>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="glass-effect rounded-3xl p-6 sm:p-8 shadow-2xl"
        >
          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
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
                  className="w-full pl-12 pr-4 py-2 sm:py-3 glass-effect rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-bali-emerald/50 focus:border-bali-emerald/30 transition-all duration-200 text-base"
                  placeholder="Enter your name"
                  maxLength={20}
                  required
                />
              </div>
            </div>

            <div className="relative" ref={dropdownRef}>
              <label htmlFor="country-input" className="block text-sm font-medium text-gray-200 mb-2">
                Country
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="country-input"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="Search or select your country..."
                  className="w-full pl-12 pr-10 py-2 sm:py-3 glass-effect rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-bali-emerald/50 focus:border-bali-emerald/30 transition-all duration-200 text-base"
                  required
                />
                <ChevronDown 
                  className={`absolute right-3 top-3 w-5 h-5 text-gray-400 cursor-pointer transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />
              </div>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-20 w-full bg-slate-800 border border-white/20 rounded-xl mt-2 shadow-lg max-h-48 sm:max-h-60 overflow-y-auto custom-scrollbar"
                  >
                    <div className="p-2">
                      <input
                        type="text"
                        placeholder="Search countries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 mb-2 text-base"
                      />
                    </div>
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((c) => (
                        <div
                          key={c}
                          className="px-4 py-2 text-gray-200 hover:bg-white/10 cursor-pointer transition-colors duration-150 text-base"
                          onClick={() => {
                            setCountry(c);
                            setSearchTerm(c);
                            setIsDropdownOpen(false);
                          }}
                        >
                          {c}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-400 text-center text-base">No countries found.</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
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
                  Joining Game...
                </div>
              ) : (
                '🌺 Join Bali Mystery 🏝️'
              )}
            </motion.button>
          </form>

          <div className="mt-5 pt-5 sm:mt-6 sm:pt-6 border-t border-white/10">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Players Online</span>
              <span className="text-bali-emerald font-semibold">{players.length}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
