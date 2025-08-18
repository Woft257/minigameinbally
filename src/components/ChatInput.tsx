import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (message.length > 500) {
      toast.error('Message too long! Maximum 500 characters.');
      return;
    }

    const messageToSend = message.trim();
    setMessage('');
    setIsTyping(true);

    try {
      await onSendMessage(messageToSend);
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error('Failed to send message');
      setMessage(messageToSend);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="p-3 sm:p-4 border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-md fixed bottom-0 left-0 right-0 w-full z-20">
      <form onSubmit={handleSubmit} className="flex space-x-3 max-w-screen-xl mx-auto">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full px-4 py-3 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all duration-200 text-sm pr-12"
            maxLength={500}
            disabled={isTyping || disabled}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
            {message.length}/500
          </div>
        </div>
        
        <motion.button
          type="submit"
          disabled={!message.trim() || isTyping || disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md transition-all duration-200"
        >
          {isTyping ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5 text-white" />
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default ChatInput;