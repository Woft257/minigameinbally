import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import Login from './components/Login';
import Game from './components/Game';
import AdminPanel from './components/AdminPanel';

const AppContent: React.FC = () => {
  const { currentPlayer } = usePlayer();

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
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