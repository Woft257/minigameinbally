import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  doc,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Message, DailyHint, Player, Vote, GameState } from '../types';

export const useFirebase = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [dailyHints, setDailyHints] = useState<DailyHint[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    isVotingOpen: false,
    gameStarted: false,
    mysteryPersonRevealed: false,
    mysteryPersonId: null // Initialize mysteryPersonId
  });

  // Listen to messages
  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'asc'), // Order by ascending timestamp
      limit(100)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => {
        const rawTimestamp = doc.data().timestamp;
        let parsedTimestamp: Date;

        if (rawTimestamp && typeof rawTimestamp.toDate === 'function') {
          // It's a Firestore Timestamp object
          parsedTimestamp = rawTimestamp.toDate();
        } else if (typeof rawTimestamp === 'string') {
          // It's an ISO string
          parsedTimestamp = new Date(rawTimestamp);
        } else {
          // Fallback for missing or unrecognised format
          parsedTimestamp = new Date(); 
        }

        return {
          id: doc.id,
          ...doc.data(),
          timestamp: parsedTimestamp
        }
      }) as Message[];
      setMessages(messagesData); // No need to reverse
    });

    return unsubscribe;
  }, []);

  // Listen to players
  useEffect(() => {
    const q = query(collection(db, 'players'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const playersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        joinedAt: doc.data().joinedAt?.toDate()
      })) as Player[];
      setPlayers(playersData);
    });

    return unsubscribe;
  }, []);

  // Listen to daily hints
  useEffect(() => {
    const q = query(
      collection(db, 'dailyHints'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const hintsData = snapshot.docs.map(doc => {
        const rawCreatedAt = doc.data().createdAt;
        let parsedCreatedAt: Date;

        if (rawCreatedAt && typeof rawCreatedAt.toDate === 'function') {
          // It's a Firestore Timestamp object
          parsedCreatedAt = rawCreatedAt.toDate();
        } else if (typeof rawCreatedAt === 'string') {
          // It's an ISO string
          parsedCreatedAt = new Date(rawCreatedAt);
        } else {
          // Fallback for missing or unrecognised format
          parsedCreatedAt = new Date(); 
        }

        return {
          id: doc.id,
          ...doc.data(),
          createdAt: parsedCreatedAt
        }
      }) as DailyHint[];
      setDailyHints(hintsData);
    });

    return unsubscribe;
  }, []);

  // Listen to game state
  useEffect(() => {
    const gameStateDoc = doc(db, 'gameState', 'current');
    const unsubscribe = onSnapshot(gameStateDoc, (snapshot) => {
      if (snapshot.exists()) {
        setGameState(snapshot.data() as GameState);
      }
    });

    return unsubscribe;
  }, []);

  // Listen to votes
  useEffect(() => {
    const q = query(
      collection(db, 'votes'),
      orderBy('timestamp', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const votesData = snapshot.docs.map(doc => {
        const rawTimestamp = doc.data().timestamp;
        let parsedTimestamp: Date;

        if (rawTimestamp && typeof rawTimestamp.toDate === 'function') {
          // It's a Firestore Timestamp object
          parsedTimestamp = rawTimestamp.toDate();
        } else if (typeof rawTimestamp === 'string') {
          // It's an ISO string
          parsedTimestamp = new Date(rawTimestamp);
        } else {
          // Fallback for missing or unrecognised format
          parsedTimestamp = new Date(); 
        }

        return {
          id: doc.id,
          ...doc.data(),
          timestamp: parsedTimestamp
        }
      }) as Vote[];
      setVotes(votesData);
    });

    return unsubscribe;
  }, []);

  const sendMessage = async (playerId: string, playerName: string, content: string) => {
    await addDoc(collection(db, 'messages'), {
      playerId,
      playerName,
      content,
      timestamp: new Date().toISOString() // Store as ISO string
    });
  };

  const addPlayer = async (name: string, country: string) => {
    const docRef = await addDoc(collection(db, 'players'), {
      name,
      country,
      joinedAt: new Date(),
      isAdmin: false
    });
    return docRef.id;
  };

  const addDailyHint = async (content: string, imageUrl?: string | null) => {
    await addDoc(collection(db, 'dailyHints'), {
      content,
      imageUrl,
      createdAt: new Date().toISOString(), // Store as ISO string
      isActive: true
    });
  };

  const updateGameState = async (newState: Partial<GameState>) => {
    const gameStateDoc = doc(db, 'gameState', 'current');
    await setDoc(gameStateDoc, newState, { merge: true });
  };

  const submitVote = async (playerId: string, voterName: string, suspectedPersonName: string) => {
    await addDoc(collection(db, 'votes'), {
      playerId,
      voterName,
      suspectedPersonName,
      timestamp: new Date().toISOString() // Store as ISO string
    });
  };

  const setMysteryPerson = async (playerId: string) => {
    await updateGameState({ mysteryPersonId: playerId });
  };

  const resetMysteryPerson = async () => {
    await updateGameState({ mysteryPersonId: null });
  };

  const revealMysteryPerson = async () => {
    await updateGameState({ mysteryPersonRevealed: true });
  };

  return {
    messages,
    players,
    dailyHints,
    votes,
    gameState,
    sendMessage,
    addPlayer,
    addDailyHint,
    updateGameState,
    submitVote,
    setMysteryPerson,
    resetMysteryPerson,
    revealMysteryPerson // Add the new function to the returned object
  };
};
