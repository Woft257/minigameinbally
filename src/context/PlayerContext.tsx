import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Player } from '../types';

interface PlayerContextType {
  currentPlayer: Player | null;
  setCurrentPlayer: (player: Player | null) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(() => {
    const saved = localStorage.getItem('mexc-player');
    return saved ? JSON.parse(saved) : null;
  });

  const setPlayerWithStorage = (player: Player | null) => {
    setCurrentPlayer(player);
    if (player) {
      localStorage.setItem('mexc-player', JSON.stringify(player));
    } else {
      localStorage.removeItem('mexc-player');
    }
  };

  return (
    <PlayerContext.Provider value={{ 
      currentPlayer, 
      setCurrentPlayer: setPlayerWithStorage 
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};