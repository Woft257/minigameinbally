import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useFirebase } from '../hooks/useFirebase'; // Import useFirebase
import toast from 'react-hot-toast';
import { User } from 'lucide-react';

const ChangeNamePanel: React.FC = () => {
  const { currentPlayer, setCurrentPlayer } = usePlayer(); // Get setCurrentPlayer
  const { updatePlayerNameInFirebase, checkPlayerNameExists } = useFirebase(); // Get new functions
  const [newPlayerName, setNewPlayerName] = useState(currentPlayer?.name || '');

  const handleNameSave = async () => { // Make it async
    if (!currentPlayer) {
      toast.error('No current player found.');
      return;
    }

    const trimmedName = newPlayerName.trim();

    if (!trimmedName || trimmedName === currentPlayer.name) {
      toast.error('Invalid new name or same as current name.');
      return;
    }

    const nameExists = await checkPlayerNameExists(trimmedName);
    if (nameExists) {
      toast.error('This name is already taken. Please choose a different name.');
      return;
    }

    try {
      await updatePlayerNameInFirebase(currentPlayer.id, trimmedName);
      setCurrentPlayer({ ...currentPlayer, name: trimmedName }); // Update local context
      toast.success('User name updated successfully!');
    } catch (error) {
      console.error('Error updating player name:', error);
      toast.error('Failed to update user name. Please try again.');
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-800/70 rounded-lg shadow-xl border border-slate-700 max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <User className="w-6 h-6 text-emerald-400" />
        Change User Name
      </h2>
      <div className="mb-4">
        <label htmlFor="playerName" className="block text-gray-300 text-sm font-medium mb-2">
          Current Name: <span className="text-emerald-400">{currentPlayer?.name}</span>
        </label>
        <input
          type="text"
          id="playerName"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          placeholder="Enter your new name"
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      <button
        onClick={handleNameSave}
        className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold py-2 px-4 rounded-md hover:from-emerald-700 hover:to-cyan-700 transition-all duration-300 shadow-lg"
      >
        Save New Name
      </button>
    </div>
  );
};

export default ChangeNamePanel;
