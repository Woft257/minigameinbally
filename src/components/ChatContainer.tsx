import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import { Message } from '../types';

interface ChatContainerProps {
  messages: Message[];
  players: any[];
  currentUserId?: string;
  onLoadMore: () => Promise<void>;
  hasMoreMessages: boolean;
  isLoadingMore: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  players,
  currentUserId,
  onLoadMore,
  hasMoreMessages,
  isLoadingMore
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current && shouldAutoScroll) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
    }
  }, [shouldAutoScroll]);

  // Auto scroll on new messages if user is near bottom
  useEffect(() => {
    if (!userScrolledUp) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom, userScrolledUp]);

  const handleScroll = useCallback(async (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = container;
    
    // Check if user scrolled to near bottom (within 100px)
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setUserScrolledUp(!isNearBottom);
    setShouldAutoScroll(isNearBottom);
    
    // Load more messages when scrolled to top
    if (scrollTop === 0 && hasMoreMessages && !isLoadingMore) {
      const prevScrollHeight = scrollHeight;
      await onLoadMore();
      
      // Maintain scroll position after loading more messages
      requestAnimationFrame(() => {
        if (container.scrollHeight > prevScrollHeight) {
          container.scrollTop = container.scrollHeight - prevScrollHeight;
        }
      });
    }
  }, [hasMoreMessages, isLoadingMore, onLoadMore]);

  const getPlayerCountry = useCallback((playerName: string) => {
    const player = players.find(p => p.name === playerName);
    return player?.country;
  }, [players]);

  return (
    <div className="flex flex-col h-full">
      <div 
        className="flex-1 overflow-y-auto px-3 sm:px-4 pb-20 pt-4 scroll-smooth"
        ref={messagesContainerRef}
        onScroll={handleScroll}
        style={{ scrollBehavior: 'smooth' }}
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
        
        <AnimatePresence mode="popLayout">
          {messages.map((msg, index) => {
            const isCurrentUser = msg.playerId === currentUserId;
            const country = getPlayerCountry(msg.playerName);
            
            return (
              <ChatMessage
                key={msg.id}
                message={msg}
                isCurrentUser={isCurrentUser}
                country={country}
                index={index}
              />
            );
          })}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
        
        {/* New message indicator */}
        {userScrolledUp && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => {
              setUserScrolledUp(false);
              setShouldAutoScroll(true);
              scrollToBottom();
            }}
            className="fixed bottom-24 right-4 z-10 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full shadow-lg text-sm transition-colors"
          >
            New messages ↓
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;