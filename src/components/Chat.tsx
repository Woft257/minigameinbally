
import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Users, Loader2 } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';
import { usePlayer } from '../context/PlayerContext';
import toast from 'react-hot-toast';

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0); // To store previous scroll height
  const prevScrollTopRef = useRef<number>(0); // To store previous scroll top
  const lastMessageIdRef = useRef<string | undefined>(undefined); // To track the ID of the last message

  const { messages, players, sendMessage, loadMoreMessages, hasMoreMessages } = useFirebase();
  const { currentPlayer } = usePlayer();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // New state to track initial load

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Use useLayoutEffect to capture scroll position before DOM updates
  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      prevScrollHeightRef.current = container.scrollHeight;
      prevScrollTopRef.current = container.scrollTop;
    }
  }); // No dependencies, runs after every render

  // Effect for auto-scrolling based on new messages
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // On initial load, always scroll to bottom
    if (isInitialLoad) {
      scrollToBottom();
      setIsInitialLoad(false);
      lastMessageIdRef.current = messages.length > 0 ? messages[messages.length - 1].id : undefined;
      return;
    }

    // If we are currently loading more messages (scrolling up), do NOT auto-scroll to bottom.
    // The handleScroll function already manages scroll position for this case.
    if (isLoadingMore) {
      return;
    }

    const currentLastMessage = messages[messages.length - 1];
    const prevLastMessageId = lastMessageIdRef.current;

    // Check if a new message has been added to the end of the array
    const hasNewMessageAtEnd = currentLastMessage && currentLastMessage.id !== prevLastMessageId;

    // Determine if the user was at the very bottom before new messages arrived
    // A very small buffer (e.g., 1px) for "near the bottom"
    const wasAtBottom = (prevScrollHeightRef.current - prevScrollTopRef.current) <= container.clientHeight + 1;

    // If new messages arrived at the end AND the user was at the bottom, scroll to the new bottom.
    if (hasNewMessageAtEnd && wasAtBottom) {
      scrollToBottom();
    }

    // Update the last message ID for the next render
    lastMessageIdRef.current = currentLastMessage ? currentLastMessage.id : undefined;

  }, [messages, isInitialLoad, isLoadingMore, scrollToBottom]); // Dependencies: messages, isInitialLoad, isLoadingMore, scrollToBottom

  const inputRef = useRef<HTMLInputElement>(null);

  const handleScroll = async () => {
    if (messagesContainerRef.current && messagesContainerRef.current.scrollTop === 0 && hasMoreMessages && !isLoadingMore) {
      setIsLoadingMore(true);
      const oldScrollHeight = messagesContainerRef.current.scrollHeight;
      await loadMoreMessages();
      // After loading more messages, maintain scroll position
      if (messagesContainerRef.current) {
        const newScrollHeight = messagesContainerRef.current.scrollHeight;
        messagesContainerRef.current.scrollTop = newScrollHeight - oldScrollHeight;
      }
      setIsLoadingMore(false);
    }
  };

  const handleFocus = () => {
    // Scroll the input into view when focused, especially for mobile virtual keyboards
    if (inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentPlayer) return;

    if (message.length > 500) {
      toast.error('Message too long! Maximum 500 characters.');
      return;
    }

    const messageToSend = message.trim();
    setMessage('');
    setIsTyping(true);

    try {
      await sendMessage(currentPlayer.id, currentPlayer.name, messageToSend);
      // Explicitly scroll to bottom after sending a message
      scrollToBottom();
    } catch (_err) {
      toast.error('Failed to send message');
      setMessage(messageToSend);
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
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-700/50 bg-slate-900/50 fixed top-0 left-0 right-0 w-full z-10">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
          <h2 className="text-lg sm:text-xl font-bold text-white">Bali Chat</h2>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-emerald-400 font-medium">
          <Users className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{players.length} online</span>
        </div>
      </div>

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto px-3 sm:px-4 pt-16 space-y-3 sm:space-y-4 pb-20"
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {isLoadingMore && (
          <div className="flex justify-center py-2">
            <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
          </div>
        )}
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
                <div className={`max-w-[85%] sm:max-w-xs lg:max-w-md ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                  {!isCurrentUser && (
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                      <span className="text-sm font-semibold text-emerald-400">{msg.playerName}</span>
                      {country && (
                        <span className="text-xs text-white bg-cyan-500/30 px-1.5 py-0.5 rounded-full border border-cyan-400/50">
                          {country}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div
                    className={`p-2 sm:p-3 rounded-2xl shadow-lg ${
                      isCurrentUser
                        ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-emerald-500/25'
                        : 'bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 text-gray-100'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      isCurrentUser ? 'text-white/80' : 'text-gray-400'
                    }`}>
                      {new Date(msg.timestamp).toLocaleString('en-US', { 
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
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 sm:p-4 border-t border-slate-700/50 bg-slate-900/50 fixed bottom-0 left-0 right-0 w-full z-10">
        <form onSubmit={handleSendMessage} className="flex space-x-2 sm:space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={handleFocus}
              placeholder="Type your message..."
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all duration-200 text-sm"
              maxLength={500}
              disabled={isTyping}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
              {message.length}/500
            </div>
          </div>
          
          <motion.button
            type="submit"
            disabled={!message.trim() || isTyping}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:shadow-xl hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            {isTyping ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
