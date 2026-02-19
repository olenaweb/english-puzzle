'use client';

import { getLevelAction } from '@/lib/db/server-actions/server-actions';
import { GetDataResult } from '@/types/types';
import { errorToast } from '@/lib/utils/toast-helpers';

/**
 * Client-side wrapper for getting levels with error handling and toast notifications
 * @param errorMessage - Error message to display
 * @returns Promise with the result of the request or null
 */
export const handleGetLevelAction = async (
  errorMessage: string = 'Error loading levels',
): Promise<GetDataResult> => {
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
