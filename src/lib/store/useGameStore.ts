import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  levelId: number;
  roundId: number;
  setLevel: (level: number) => void;
  setRound: (round: number) => void;
  setGameProgress: (level: number, round: number) => void;
}

// Create the store with persistence
export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      levelId: 1,
      roundId: 1,

      setLevel: (level) => set({ levelId: level }),
      setRound: (round) => set({ roundId: round }),
      setGameProgress: (level, round) => set({ levelId: level, roundId: round }),
    }),
    {
      name: 'english-puzzle-storage', // Name of the key in the browser's localStorage
    },
  ),
);
