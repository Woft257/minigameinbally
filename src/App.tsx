import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import Login from './components/Login';
import Game from './components/Game';
import AdminPanel from './components/AdminPanel';
import VoteResults from './components/VoteResults';
import KingQueenVoteResults from './components/KingQueenVoteResults';
import VoteDetails from './components/VoteDetails';
import ResetPanel from './components/ResetPanel';
import AdminAuth from './components/AdminAuth'; // Import AdminAuth
import { useFirebase } from './hooks/useFirebase';

const AppContent: React.FC = () => {
  const { currentPlayer } = usePlayer();
  const { votes } = useFirebase();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = React.useState(false); // New state for admin authentication

  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={isAdminAuthenticated ? <AdminRoutes votes={votes} /> : <AdminAuth onAuthSuccess={() => setIsAdminAuthenticated(true)} />} />
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

// New component to encapsulate admin routes
const AdminRoutes: React.FC<{ votes: any[] }> = ({ votes }) => (
  <Routes>
    <Route path="/" element={<AdminPanel />} />
    <Route path="/vote-results" element={<VoteResults votes={votes} />} />
    <Route path="/vote-results/:sessionKey" element={<VoteDetails allVotes={votes} />} />
    <Route path="/king-queen-vote-results" element={<KingQueenVoteResults />} />
    <Route path="/reset" element={<ResetPanel />} />
  </Routes>
);

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
