import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import Login from './components/Login';
import Game from './components/Game';
import AdminPanel from './components/AdminPanel';
import VoteResults from './components/VoteResults';
import VoteDetails from './components/VoteDetails'; // Import VoteDetails
import { useFirebase } from './hooks/useFirebase'; // Import useFirebase

const AppContent: React.FC = () => {
  const { currentPlayer } = usePlayer();
  const { votes } = useFirebase(); // Get votes from useFirebase

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/vote-results" element={<VoteResults votes={votes} />} /> {/* Updated path and pass votes */}
        <Route path="/admin/vote-results/:sessionKey" element={<VoteDetails allVotes={votes} />} /> {/* New route for VoteDetails */}
        <Route
          path="/game"
          element={currentPlayer ? <Game /> : <Navigate to="/" replace />}
        />
        <Route
          path="/"
          element={currentPlayer ? <Navigate to="/game" replace /> : <Login />}
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <PlayerProvider>
      <div className="min-h-screen">
        <AppContent />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(15, 23, 42, 0.9)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
            },
          }}
        />
      </div>
    </PlayerProvider>
  );
}

export default App;
