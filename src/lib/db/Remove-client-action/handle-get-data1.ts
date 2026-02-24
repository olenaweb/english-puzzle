'use client';

import { getLevelAction, getRoundDataAction } from '@/lib/db/server-actions/server-actions';
import { GetDataResult } from '@/types/types';
import { errorToast } from '@/lib/utils/toast-helpers';

/**
 * Client-side wrapper for getting levels with error handling and toast notifications
 * @constant errorMessage - Error message to display
 * @returns Promise with the result of the request or {} []
 */
const errorMessage: string = 'Error loading levels';

export const handleGetLevelAction = async (): Promise<GetDataResult> => {
  try {
    const result = await getLevelAction();

    if (!result.isSuccess) {
      errorToast(result.message || errorMessage);
      return result;
    }

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : errorMessage;
    errorToast(message);
    return {
      isSuccess: false,
      data: [],
      error: message,
      message: errorMessage,
      messageCode: 'DATA_GET_ERROR',
    };
  }
};

export const handleGetRoundDataAction = async (
  levelNumber: string | number,
  roundNumber: string | number,
): Promise<GetDataResult> => {
  try {
    const result = await getRoundDataAction(levelNumber, roundNumber);
    if (!result.isSuccess) {
      errorToast(result.message || errorMessage);
      return result;
    }

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : errorMessage;
    errorToast(message);
    return {
      isSuccess: false,
      data: {} as GetDataResult['data'],
      error: message,
      message: errorMessage,
      messageCode: 'DATA_GET_ERROR',
    };
  }
};
