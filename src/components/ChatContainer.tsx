import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import { Message, Player } from '../types'; // Import Player type

interface ChatContainerProps {
  messages: Message[];
  players: Player[];
  currentUserId?: string;
  onLoadMore: () => Promise<void>;
  hasMoreMessages: boolean;
  isLoadingMore: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = React.memo(({
  messages,
  players,
  currentUserId,
  onLoadMore,
  hasMoreMessages,
  isLoadingMore
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const prevMessageCountRef = useRef(messages.length);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
      
      // Ensure input is visible after scrolling on mobile
      setTimeout(() => {
        const chatInput = document.querySelector('[data-chat-input]');
        if (chatInput) {
          chatInput.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 300);
    }
  }, []);

  // Simple auto-scroll logic for new messages
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current && isAtBottom) {
      setTimeout(() => scrollToBottom('smooth'), 100);
    }
    prevMessageCountRef.current = messages.length;
  }, [messages.length, isAtBottom, scrollToBottom]);

  // Initial scroll to bottom
  useEffect(() => {
    setTimeout(() => scrollToBottom('auto'), 100);
  }, [scrollToBottom]);

  const handleScroll = useCallback(async (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = container;
    
    // Check if user scrolled to bottom (very generous threshold for better sensitivity)
    const atBottom = Math.abs(scrollHeight - scrollTop - clientHeight) <= 100;
    
    // Update scroll state
    setIsAtBottom(atBottom);
    
    // Load more messages when scrolled to top
    if (scrollTop === 0 && hasMoreMessages && !isLoadingMore) {
      const prevScrollHeight = scrollHeight;
      const prevScrollTop = scrollTop;
      
      await onLoadMore();
      
      // Keep scroll position after loading more messages
      requestAnimationFrame(() => {
        const newScrollHeight = container.scrollHeight;
        if (newScrollHeight > prevScrollHeight) {
          container.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
        }
      });
    }
  }, [hasMoreMessages, isLoadingMore, onLoadMore]);

  // Memoize rendered messages for better performance
  const renderedMessages = useMemo(() => {
    return messages.map((msg, index) => {
      const isCurrentUser = msg.playerId === currentUserId;
      const player = players.find(p => p.id === msg.playerId); // Find the player object
      
      return (
        <ChatMessage
          key={msg.id}
          message={msg}
          isCurrentUser={isCurrentUser}
          player={player} // Pass the full player object
          index={index}
        />
      );
    });
  }, [messages, currentUserId, players]); // Add players to dependency array

  return (
    <div className="h-full w-full flex flex-col">
      <div 
        className="flex-1 overflow-y-auto px-3 sm:px-4 py-4"
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {hasMoreMessages && (
          <div className="flex justify-center py-3">
            {isLoadingMore ? (
              <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
            ) : (
              <button
                onClick={onLoadMore}
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Load more messages
              </button>
            )}
          </div>
        )}
        
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {renderedMessages}
          </AnimatePresence>
        </div>
        
        <div ref={messagesEndRef} className="h-4" />
        
        {/* New message indicator - positioned relative to container */}
        <AnimatePresence>
          {!isAtBottom && messages.length > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => {
                setIsAtBottom(true);
                scrollToBottom('auto');
              }}
              className="fixed bottom-20 right-4 z-10 w-12 h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white rounded-full shadow-lg transition-all duration-200 backdrop-blur-sm border border-emerald-500/30 flex items-center justify-center"
            >
              <motion.div
                animate={{ y: [0, 2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default ChatContainer;
