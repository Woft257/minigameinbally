import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  startAfter,
  doc,
  setDoc,
  getDocs,
  writeBatch,
  where // Import where
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Message, DailyHint, Player, Vote, GameState, KingQueenVote } from '../types';

export const useFirebase = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLimit] = useState(20);
  const [lastVisibleMessage, setLastVisibleMessage] = useState<unknown>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const [players, setPlayers] = useState<Player[]>([]);
  const [dailyHints, setDailyHints] = useState<DailyHint[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [kingQueenVotes, setKingQueenVotes] = useState<KingQueenVote[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    isVotingOpen: false,
    isKingQueenVotingOpen: false,
    gameStarted: false,
    mysteryPersonRevealed: false,
    mysteryPersonId: null
  });

  // Listen to messages with pagination
  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(messagesLimit)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessagesData = snapshot.docs.map(doc => {
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
      }) as Message[];
      
      setMessages(newMessagesData.reverse());
      setLastVisibleMessage(snapshot.docs[snapshot.docs.length - 1]);
      setHasMoreMessages(newMessagesData.length === messagesLimit);
    });

    return unsubscribe;
  }, [messagesLimit]);

  const loadMoreMessages = () => {
    if (!lastVisibleMessage || !hasMoreMessages) return;

    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'desc'),
      startAfter(lastVisibleMessage),
      limit(20)
    );

    getDocs(q).then((snapshot) => {
      const olderMessagesData = snapshot.docs.map(doc => {
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
      }) as Message[];

      setMessages((prevMessages) => [...olderMessagesData.reverse(), ...prevMessages]);
      setLastVisibleMessage(snapshot.docs[snapshot.docs.length - 1]);
      setHasMoreMessages(olderMessagesData.length === 20);
    });
  };

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
          parsedCreatedAt = rawCreatedAt.toDate();
        } else if (typeof rawCreatedAt === 'string') {
          parsedCreatedAt = new Date(rawCreatedAt);
        } else {
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
      timestamp: new Date().toISOString()
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

  // New function to update player name in Firebase and messages
  const updatePlayerNameInFirebase = async (playerId: string, newName: string) => {
    const batch = writeBatch(db);

    // 1. Update player document
    const playerRef = doc(db, 'players', playerId);
    batch.update(playerRef, { name: newName });

    // 2. Update player name in all their messages
    const messagesQuery = query(collection(db, 'messages'), where('playerId', '==', playerId));
    const messagesSnapshot = await getDocs(messagesQuery);
    messagesSnapshot.docs.forEach((msgDoc) => {
      batch.update(msgDoc.ref, { playerName: newName });
    });

    await batch.commit();
  };

  // New function to check if player name already exists
  const checkPlayerNameExists = async (name: string): Promise<boolean> => {
    const q = query(collection(db, 'players'), where('name', '==', name));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  };

  const addDailyHint = async (content: string, imageUrl?: string | null) => {
    await addDoc(collection(db, 'dailyHints'), {
      content,
      imageUrl,
      createdAt: new Date().toISOString(),
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
      timestamp: new Date().toISOString()
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

  const deletePlayer = async (playerUid: string) => {
    const batch = writeBatch(db);

    // 1. Delete player document
    const playerRef = doc(db, 'players', playerUid);
    batch.delete(playerRef);

    // 2. Delete all messages by this player
    const messagesQuery = query(collection(db, 'messages'), where('playerId', '==', playerUid));
    const messagesSnapshot = await getDocs(messagesQuery);
    messagesSnapshot.docs.forEach((msgDoc) => {
      batch.delete(msgDoc.ref);
    });

    // 3. Delete all votes cast by this player
    const votesQuery = query(collection(db, 'votes'), where('playerId', '==', playerUid));
    const votesSnapshot = await getDocs(votesQuery);
    votesSnapshot.docs.forEach((voteDoc) => {
      batch.delete(voteDoc.ref);
    });

    // 4. Delete all King & Queen votes cast by this player
    const kqVotesQuery = query(collection(db, 'kingQueenVotes'), where('playerId', '==', playerUid));
    const kqVotesSnapshot = await getDocs(kqVotesQuery);
    kqVotesSnapshot.docs.forEach((kqVoteDoc) => {
      batch.delete(kqVoteDoc.ref);
    });

    // 5. If the deleted player was the mystery person, reset mysteryPersonId
    if (gameState.mysteryPersonId === playerUid) {
      const gameStateDoc = doc(db, 'gameState', 'current');
      batch.update(gameStateDoc, { mysteryPersonId: null, mysteryPersonRevealed: false });
    }

    await batch.commit();
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
    updatePlayerNameInFirebase, // Expose new function
    checkPlayerNameExists, // Expose new function
    addDailyHint,
    updateGameState,
    submitVote,
    submitKingQueenVote,
    setMysteryPerson,
    resetMysteryPerson,
    revealMysteryPerson,
    resetAllData,
    deletePlayer, // Expose new function
    markHintAsRead,
    loadMoreMessages,
    hasMoreMessages
  };
};
