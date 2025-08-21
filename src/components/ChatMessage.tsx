import { memo } from 'react';
import { motion } from 'framer-motion';
import { Message, Player } from '../types'; // Import Player type

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  player?: Player; // Pass the full player object
  index: number;
}

const ChatMessage = memo(({ message, isCurrentUser, player, index }: ChatMessageProps) => {
  const displayName = player?.name || message.playerName; // Use player name if available, otherwise message name
  const displayCountry = player?.country;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ 
        duration: 0.2, 
        delay: Math.min(index * 0.01, 0.1),
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
      className={`flex mb-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[80%] sm:max-w-xs lg:max-w-md ${isCurrentUser ? 'order-2' : 'order-1'}`}>
        {!isCurrentUser && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(index * 0.02, 0.2) + 0.1 }}
            className="flex items-center space-x-2 mb-1 ml-1"
          >
            <span className="text-sm font-medium text-emerald-400">{displayName}</span>
            {displayCountry && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: Math.min(index * 0.02, 0.2) + 0.2, type: "spring" }}
                className="text-xs text-white bg-cyan-500/30 px-2 py-0.5 rounded-full border border-cyan-400/50"
              >
                {displayCountry}
              </motion.span>
            )}
          </motion.div>
        )}
        
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ 
            delay: Math.min(index * 0.02, 0.2) + 0.1,
            type: "spring",
            stiffness: 400,
            damping: 25
          }}
          className={`px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 ${
            isCurrentUser
              ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-emerald-500/30 rounded-br-md hover:shadow-emerald-500/40'
              : 'bg-slate-800/90 border border-slate-600/50 text-gray-100 rounded-bl-md hover:bg-slate-800/95 hover:border-slate-500/60'
          }`}
        >
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: Math.min(index * 0.02, 0.2) + 0.2 }}
            className="text-sm leading-relaxed break-words"
          >
            {message.content}
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: Math.min(index * 0.02, 0.2) + 0.3 }}
            className={`text-xs mt-2 ${
              isCurrentUser ? 'text-white/70' : 'text-gray-400'
            }`}
          >
            {new Date(message.timestamp).toLocaleString('en-US', { 
              timeZone: 'Asia/Makassar',
              month: 'numeric', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
});

export default ChatMessage;
