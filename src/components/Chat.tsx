import React, { useState } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { usePlayer } from '../context/PlayerContext';
import ChatContainer from './ChatContainer';
import ChatInput from './ChatInput';

const Chat: React.FC = () => {
  const { messages, players, sendMessage, loadMoreMessages, hasMoreMessages } = useFirebase();
  const { currentPlayer } = usePlayer();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    await loadMoreMessages();
    setIsLoadingMore(false);
  };

  const handleSendMessage = async (messageContent: string) => {
    if (!currentPlayer) return;
    await sendMessage(currentPlayer.id, currentPlayer.name, messageContent);
  };

  return (
    <div className="flex flex-col h-full">
      <ChatContainer
        messages={messages}
        players={players}
        currentUserId={currentPlayer?.id}
        onLoadMore={handleLoadMore}
        hasMoreMessages={hasMoreMessages}
        isLoadingMore={isLoadingMore}
      />
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={!currentPlayer}
      />
    </div>
  );
};

export default Chat;