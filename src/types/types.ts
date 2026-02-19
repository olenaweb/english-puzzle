export interface Words {
  audioExample: string;
  textExample: string;
  textExampleTranslate: string;
  id: number;
  word: string;
  wordTranslate: string;
  wordTranslateUa: string;
  textExampleTranslateUa: string;
}

export interface LevelData {
  author: string;
  year: string;
  id: string;
  cutSrc: string;
  name: string;
  imageSrc: string;
}

export interface GetDataResult {
  isSuccess: boolean;
  data: LevelRoundData[] | Level[] | string;
  error?: string;
  message?: string;
  messageCode?: string;
}

export interface LevelRoundData {
  id: `level_${number}_round${number}`;
  levelNumber: number;
  roundNumber: number;
  levelId: `level_${number}`;
  levelData: LevelData;
  words: Words[];
  totalWords: number;
  createdAt: Date;
}

export interface Level {
  id: string;
  levelNumber: number;
  name: string;
  description: string;
  createdAt: Date;
  totalRounds: number;
}
