import React from 'react';
import { motion } from 'framer-motion';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  country?: string;
  index: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCurrentUser, country, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.01, 0.1) }}
      className={`flex mb-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[80%] sm:max-w-xs lg:max-w-md ${isCurrentUser ? 'order-2' : 'order-1'}`}>
        {!isCurrentUser && (
          <div className="flex items-center space-x-2 mb-1 ml-1">
            <span className="text-sm font-medium text-emerald-400">{message.playerName}</span>
            {country && (
              <span className="text-xs text-white bg-cyan-500/30 px-2 py-0.5 rounded-full border border-cyan-400/50">
                {country}
              </span>
            )}
          </div>
        )}
        
        <div
          className={`px-3 py-2 rounded-2xl shadow-md backdrop-blur-sm ${
            isCurrentUser
              ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-emerald-500/20 rounded-br-md'
              : 'bg-slate-800/90 border border-slate-600/50 text-gray-100 rounded-bl-md'
          }`}
        >
          <p className="text-sm leading-relaxed break-words">{message.content}</p>
          <p className={`text-xs mt-1 ${
            isCurrentUser ? 'text-white/70' : 'text-gray-400'
          }`}>
            {new Date(message.timestamp).toLocaleString('en-US', { 
              timeZone: 'Asia/Makassar',
              month: 'numeric', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;