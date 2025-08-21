import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'; // Import useEffect
import { Player } from '../types';

interface PlayerContextType {
  currentPlayer: Player | null;
  setCurrentPlayer: (player: Player | null) => void;
  updatePlayerName: (newName: string) => void;
  clearCurrentPlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

import { useFirebase } from '../hooks/useFirebase';

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { players } = useFirebase();
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(() => {
    const saved = localStorage.getItem('mexc-player');
    const storedPlayer = saved ? JSON.parse(saved) : null;
    console.log('PlayerContext: Initial currentPlayer from localStorage:', storedPlayer);
    return storedPlayer;
  });

  useEffect(() => {
    // Only perform this check if currentPlayer exists and players data has been loaded (players.length > 0)
    if (currentPlayer && players.length > 0) {
      const playerExistsInDb = players.some(p => p.id === currentPlayer.id);
      if (!playerExistsInDb) {
        // If the current player is not found in the database, clear their local storage
        clearCurrentPlayer();
      }
    }
  }, [players, currentPlayer]);

  const setPlayerWithStorage = (player: Player | null) => {
    setCurrentPlayer(player);
    if (player) {
      localStorage.setItem('mexc-player', JSON.stringify(player));
    } else {
      localStorage.removeItem('mexc-player');
    }
  };

  const updatePlayerName = (newName: string) => {
    setCurrentPlayer(prevPlayer => {
      if (prevPlayer) {
        const updatedPlayer = { ...prevPlayer, name: newName };
        localStorage.setItem('mexc-player', JSON.stringify(updatedPlayer));
        return updatedPlayer;
      }
      return prevPlayer;
    });
  };

  const clearCurrentPlayer = () => {
    setCurrentPlayer(null);
    localStorage.removeItem('mexc-player');
  };

  return (
    <PlayerContext.Provider value={{ 
      currentPlayer, 
      setCurrentPlayer: setPlayerWithStorage,
      updatePlayerName,
      clearCurrentPlayer // Add this line
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
