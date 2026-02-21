'use server';

import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '@/lib/firebase/config';
import { GetDataResult, Level, LevelRoundData } from '@/types/types';
import { cookies } from 'next/headers';

/**
 * Server Action for Firestore
 * @returns Promise with the result of the request or null
 */

// export async function addHistoryLogAction(logData: HttpRequestLog): Promise<AddLogResult> {
//   try {
//     const cleanedData: FirestoreHttpRequestLog = {
//       ...logData,
//       timestamp: Timestamp.fromDate(logData.timestamp),
//     };

//     const docRef = await addDoc(collection(db, 'history'), cleanedData);
//     revalidatePath('/');
//     return {
//       success: true,
//       id: docRef.id,
//       message: 'Log successfully added',
//       messageCode: 'LOG_ADDED_SUCCESS',
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Unknown error',
//       message: 'Error adding log',
//       messageCode: 'LOG_ADD_ERROR',
//     };
//   }
// }

export async function getLevelAction(): Promise<GetDataResult> {
  try {
    const levelsQuery = query(collection(db, 'levels'), orderBy('levelNumber', 'asc'));

    const querySnapshot = await getDocs(levelsQuery);

    if (querySnapshot.empty) {
      return {
        isSuccess: false,
        data: [] as Level[],
        message: 'No levels found in database',
        messageCode: 'NO_DATA',
      };
    }

    const levels: Level[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: data.id,
        levelNumber: data.levelNumber,
        name: data.name,
        description: data.description,
        createdAt: data.createdAt?.toDate() || new Date(),
        totalRounds: data.totalRounds,
      };
    });

    return { isSuccess: true, data: levels };
  } catch (error) {
    console.error('Error in getLevelAction:', error);
    return {
      isSuccess: false,
      data: [] as Level[],
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Error getting level data',
      messageCode: 'DATA_GET_ERROR',
    };
  }
}

export async function getRoundDataAction(
  levelNumber: string | number,
  roundNumber: string | number,
): Promise<GetDataResult> {
  try {
    const documentId = `level_${levelNumber}_round_${roundNumber}`;

    // Link to the specific document in the "rounds" collection
    const docRef = doc(db, 'rounds', documentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        isSuccess: false,
        data: {} as LevelRoundData,
        message: `Round ${documentId} not found`,
        messageCode: 'ROUND_NOT_FOUND',
      };
    }

    const data = docSnap.data();

    // mapping data (from Firestore format to our interface)
    const round: LevelRoundData = {
      id: data.id,
      levelId: data.levelId,
      levelNumber: data.levelNumber,
      roundNumber: data.roundNumber,
      totalWords: data.totalWords,
      levelData: {
        author: data.levelData.author,
        cutSrc: data.levelData.cutSrc,
        id: data.levelData.id,
        imageSrc: data.levelData.imageSrc,
        name: data.levelData.name,
        year: data.levelData.year,
      },
      words: data.words, // Array of objects is passed as is
      createdAt: data.createdAt?.toDate() || new Date(),
    };

    return {
      isSuccess: true,
      data: round as LevelRoundData,
      message: 'Success',
    };
  } catch (error) {
    console.error('Error in getRoundDataAction:', error);
    return {
      isSuccess: false,
      data: {} as LevelRoundData,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Error getting round data',
      messageCode: 'DATA_GET_ERROR',
    };
  }
}

/**
 * Server Action для получения ID текущего пользователя из cookies
 * @returns Promise с результатом или null если пользователь не авторизован
 */
export async function getCurrentUserIdAction(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const userIdCookie = cookieStore.get('userId');
    return userIdCookie?.value || null;
  } catch (error) {
    console.error('Error in getCurrentUserIdAction:', error);
    return null;
  }
}
