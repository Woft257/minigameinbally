import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  doc,
  setDoc,
  getDocs, // Import getDocs
  writeBatch // Import writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Message, DailyHint, Player, Vote, GameState, KingQueenVote } from '../types';

export const useFirebase = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [dailyHints, setDailyHints] = useState<DailyHint[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [kingQueenVotes, setKingQueenVotes] = useState<KingQueenVote[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    isVotingOpen: false,
    isKingQueenVotingOpen: false, // New state for King & Queen voting
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

  // Listen to King & Queen votes
  useEffect(() => {
    const q = query(
      collection(db, 'kingQueenVotes'),
      orderBy('timestamp', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const kqVotesData = snapshot.docs.map(doc => {
        const rawTimestamp = doc.data().timestamp;
        let parsedTimestamp: Date;

        if (rawTimestamp && typeof rawTimestamp.toDate === 'function') {
          parsedTimestamp = rawTimestamp.toDate();
        } else if (typeof rawTimestamp === 'string') {
          parsedTimestamp = new Date(rawTimestamp);
        } else {
          parsedTimestamp = new Date(); 
        }

        return {
          id: doc.id,
          ...doc.data(),
          timestamp: parsedTimestamp
        }
      }) as KingQueenVote[];
      setKingQueenVotes(kqVotesData);
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

  const markHintAsRead = async (hintId: string) => {
    const hintDocRef = doc(db, 'dailyHints', hintId);
    await setDoc(hintDocRef, { isActive: false }, { merge: true });
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

  const submitKingQueenVote = async (playerId: string, voterName: string, kingCandidate: string, queenCandidate: string) => {
    await addDoc(collection(db, 'kingQueenVotes'), {
      playerId,
      voterName,
      kingCandidate,
      queenCandidate,
      timestamp: new Date().toISOString()
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

  const resetAllData = async () => {
    const collectionsToClear = ['messages', 'players', 'dailyHints', 'votes', 'kingQueenVotes'];

    for (const collectionName of collectionsToClear) {
      const q = query(collection(db, collectionName));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }

    // Reset game state to initial values
    await setDoc(doc(db, 'gameState', 'current'), {
      isVotingOpen: false,
      isKingQueenVotingOpen: false,
      gameStarted: false,
      mysteryPersonRevealed: false,
      mysteryPersonId: null
    });
  };

  return {
    messages,
    players,
    dailyHints,
    votes,
    kingQueenVotes,
    gameState,
    sendMessage,
    addPlayer,
    addDailyHint,
    updateGameState,
    submitVote,
    submitKingQueenVote,
    setMysteryPerson,
    resetMysteryPerson,
    revealMysteryPerson,
    resetAllData,
    markHintAsRead
  };
};
