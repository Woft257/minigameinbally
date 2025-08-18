import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSentTime = useRef(0);
  const messageCount = useRef(0);
  const resetCountTimeout = useRef<NodeJS.Timeout>();

  // Handle mobile keyboard visibility
  useEffect(() => {
    const handleResize = () => {
      if (document.activeElement === inputRef.current && containerRef.current) {
        setTimeout(() => {
          containerRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end' 
          });
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Ensure input stays visible after sending message
  const ensureInputVisible = useCallback(() => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'end' 
        });
      }
    }, 100);
  }, []);

  // Rate limiting: max 5 messages per 10 seconds
  const isRateLimited = useCallback(() => {
    const now = Date.now();
    const timeDiff = now - lastSentTime.current;
    
    // Reset counter every 10 seconds
    if (timeDiff > 10000) {
      messageCount.current = 0;
    }
    
    // Check if exceeded rate limit
    if (messageCount.current >= 5 && timeDiff < 10000) {
      return true;
    }
    
    return false;
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isTyping) return;

    if (message.length > 500) {
      toast.error('Message too long! Maximum 500 characters.');
      return;
    }

    // Rate limiting check
    if (isRateLimited()) {
      toast.error('Too many messages! Please wait a moment.');
      return;
    }

    const messageToSend = message.trim();
    setMessage('');
    setIsTyping(true);

    try {
      await onSendMessage(messageToSend);
      
      // Update rate limiting counters
      lastSentTime.current = Date.now();
      messageCount.current += 1;
      
      // Auto-reset counter after 10 seconds
      if (resetCountTimeout.current) {
        clearTimeout(resetCountTimeout.current);
      }
      resetCountTimeout.current = setTimeout(() => {
        messageCount.current = 0;
      }, 10000);

      // Ensure input stays visible after sending
      ensureInputVisible();
      
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error('Failed to send message');
      setMessage(messageToSend);
    } finally {
      setIsTyping(false);
    }
  }, [message, isTyping, onSendMessage, isRateLimited, ensureInputVisible]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }, []);

  const handleInputFocus = useCallback(() => {
    ensureInputVisible();
  }, [ensureInputVisible]);

  const characterCountColor = useMemo(() => {
    const length = message.length;
    if (length > 450) return 'text-red-400';
    if (length > 400) return 'text-yellow-400';
    return 'text-gray-500';
  }, [message.length]);

  return (
    <motion.div 
      ref={containerRef}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full p-2 sm:p-3 md:p-4 border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-md safe-area-bottom"
      data-chat-input
      style={{
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))'
      }}
    >
      <form onSubmit={handleSubmit} className="flex space-x-3 max-w-screen-xl mx-auto">
        <div className="flex-1 relative">
          <motion.input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Type a message..."
            className="w-full px-4 py-3 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all duration-200 text-sm pr-12"
            maxLength={500}
            disabled={isTyping || disabled}
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
          <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${characterCountColor} transition-colors duration-200`}>
            {message.length}/500
          </div>
        </div>
        
        <motion.button
          type="submit"
          disabled={!message.trim() || isTyping || disabled}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md transition-all duration-200"
        >
          <motion.div
            animate={isTyping ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 1, repeat: isTyping ? Infinity : 0, ease: "linear" }}
          >
            {isTyping ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </motion.div>
        </motion.button>
      </form>
    </motion.div>
  );
};

export default React.memo(ChatInput);