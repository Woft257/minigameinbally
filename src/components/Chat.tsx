import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Users } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';
import { usePlayer } from '../context/PlayerContext';
import toast from 'react-hot-toast';

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, players, sendMessage } = useFirebase();
  const { currentPlayer } = usePlayer();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentPlayer) return;

    if (message.length > 500) {
      toast.error('Message too long! Maximum 500 characters.');
      return;
    }

    setIsTyping(true);
    try {
      await sendMessage(currentPlayer.id, currentPlayer.name, message.trim());
      setMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsTyping(false);
    }
  };

  const getPlayerCountry = (playerName: string) => {
    const player = players.find(p => p.name === playerName);
    return player?.country;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <MessageCircle className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Group Chat</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Users className="w-4 h-4" />
          <span>{players.length} online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const isCurrentUser = msg.playerId === currentPlayer?.id;
            const country = getPlayerCountry(msg.playerName);
            
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                  {!isCurrentUser && (
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-semibold text-cyan-400">{msg.playerName}</span>
                      {country && (
                        <span className="text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded-full">
                          {country}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div
                    className={`p-3 rounded-2xl shadow-lg ${
                      isCurrentUser
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                        : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-100'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      isCurrentUser ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      {new Date(msg.timestamp).toLocaleString('en-US', { 
                        timeZone: 'Asia/Makassar', // Bali timezone
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
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-white/10">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all duration-200"
              maxLength={500}
              disabled={isTyping}
            />
            <div className="absolute right-3 top-3 text-xs text-gray-500">
              {message.length}/500
            </div>
          </div>
          
          <motion.button
            type="submit"
            disabled={!message.trim() || isTyping}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg transition-all duration-200"
          >
            {isTyping ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
