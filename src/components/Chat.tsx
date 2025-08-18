
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
  const lastMessageIdRef = useRef<string | undefined>(undefined); // To track the ID of the last message
  const isInitialMountRef = useRef(true); // To track if it's the very first mount of the component
  const wasUserAtBottomRef = useRef(true); // To track if the user was at the bottom before a new render
  const scrollStateForLoadMore = useRef<{ scrollHeight: number; scrollTop: number } | null>(null); // To store scroll state for loading more messages

  const { messages, players, sendMessage, loadMoreMessages, hasMoreMessages } = useFirebase();
  const { currentPlayer } = usePlayer();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Use useLayoutEffect to capture scroll position and 'was at bottom' state *before* the browser paints
  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      // Update wasUserAtBottomRef for the *next* useEffect cycle
      wasUserAtBottomRef.current = (container.scrollHeight - container.scrollTop) <= container.clientHeight + 1;
    }
  }); // No dependencies, runs after every render

  // Effect for initial scroll and new incoming messages
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // On initial mount of the component (or when tab is switched and component remounts due to key prop)
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false; // Mark as not initial mount after first render
      if (messages.length > 0) {
        scrollToBottom('auto'); // Scroll instantly on initial load if messages exist
      }
      // Update lastMessageIdRef here for the first time
      lastMessageIdRef.current = messages.length > 0 ? messages[messages.length - 1].id : undefined;
      return; // Prevent further logic on initial mount
    }

    // If we are currently loading more messages (scrolling up), do NOT auto-scroll to bottom.
    if (isLoadingMore) {
      return;
    }

    const currentLastMessage = messages[messages.length - 1];
    const prevLastMessageId = lastMessageIdRef.current;

    // Check if a new message has been added to the end of the array (incoming message)
    const hasNewIncomingMessage = currentLastMessage && currentLastMessage.id !== prevLastMessageId;

    // If a new incoming message arrived AND the user was at the bottom, scroll smoothly
    if (hasNewIncomingMessage && wasUserAtBottomRef.current) {
      scrollToBottom('smooth');
    }

    // Always update lastMessageIdRef for the next render cycle
    lastMessageIdRef.current = currentLastMessage ? currentLastMessage.id : undefined;

  }, [messages, isLoadingMore, scrollToBottom]); // Dependencies: messages, isLoadingMore, scrollToBottom

  // useLayoutEffect to adjust scroll position after loading more messages (runs after DOM updates)
  useLayoutEffect(() => {
    if (scrollStateForLoadMore.current && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const newScrollHeight = container.scrollHeight;
      const heightAdded = newScrollHeight - scrollStateForLoadMore.current.scrollHeight;
      container.scrollTop = scrollStateForLoadMore.current.scrollTop + heightAdded; // Adjust scroll by the height of newly added content
      scrollStateForLoadMore.current = null; // Reset the ref
    }
  }, [messages]); // Depend on messages to ensure it runs after messages update

  const inputRef = useRef<HTMLInputElement>(null);

  const handleScroll = async () => {
    if (messagesContainerRef.current && messagesContainerRef.current.scrollTop === 0 && hasMoreMessages && !isLoadingMore) {
      setIsLoadingMore(true);
      // Capture current scroll state before loading more
      scrollStateForLoadMore.current = {
        scrollHeight: messagesContainerRef.current.scrollHeight,
        scrollTop: messagesContainerRef.current.scrollTop,
      };

      await loadMoreMessages();
      setIsLoadingMore(false);
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
    } catch (err) { // Changed _err to err to fix ESLint error
      console.error("Failed to send message:", err);
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
      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto px-3 sm:px-4 space-y-3 sm:space-y-4 pb-20" /* Removed pt-16, will be handled by Game.tsx */
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
       <div className="p-3 sm:p-4 border-t border-slate-700/50 bg-slate-900 fixed bottom-0 left-0 right-0 w-full z-10">
        <form onSubmit={handleSendMessage} className="flex space-x-2 sm:space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
