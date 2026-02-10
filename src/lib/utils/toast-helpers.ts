import toast from 'react-hot-toast';

export const successToast = (message: string) => {
  toast.success(message, {
    duration: 4000,
    style: {
      background: '#10B981',
      color: 'white',
    },
  });
};

export const errorToast = (message: string, error?: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  toast.error(
    error ? `${message}\nError: ${errorMessage}` : message,
    {
      duration: 5000,
      style: {
        background: '#EF4444',
        color: 'white',
      },
    }
  );
};

export const loadingToast = (message: string) => {
  return toast.loading(message);
};