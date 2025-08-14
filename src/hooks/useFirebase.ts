import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  doc,
  updateDoc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Message, DailyHint, Player, Vote, GameState, MysteryPerson } from '../types';

export const useFirebase = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [dailyHints, setDailyHints] = useState<DailyHint[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    isVotingOpen: false,
    gameStarted: false,
    mysteryPersonRevealed: false
  });

  // Listen to messages
  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(100)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      })) as Message[];
      setMessages(messagesData.reverse());
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
      const hintsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as DailyHint[];
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

  const sendMessage = async (playerId: string, playerName: string, content: string) => {
    await addDoc(collection(db, 'messages'), {
      playerId,
      playerName,
      content,
      timestamp: new Date()
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

  const addDailyHint = async (content: string, imageUrl?: string) => {
    await addDoc(collection(db, 'dailyHints'), {
      content,
      imageUrl,
      createdAt: new Date(),
      isActive: true
    });
  };

  const updateGameState = async (newState: Partial<GameState>) => {
    const gameStateDoc = doc(db, 'gameState', 'current');
    await updateDoc(gameStateDoc, newState);
  };

  const submitVote = async (playerId: string, playerName: string, suspectedPersonName: string) => {
    await addDoc(collection(db, 'votes'), {
      playerId,
      playerName,
      suspectedPersonName,
      timestamp: new Date()
    });
  };

  return {
    messages,
    players,
    dailyHints,
    gameState,
    sendMessage,
    addPlayer,
    addDailyHint,
    updateGameState,
    submitVote
  };
};