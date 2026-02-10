'use client';

import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';

export const ClientProviders = ({ children }: { children: ReactNode }) => {
  const toastDuration = Number(process.env.NEXT_PUBLIC_TOAST_DURATION) || 5000;
  return (
    <>
      <Toaster
        position='top-center'
        reverseOrder={false}
        toastOptions={{
          duration: toastDuration,
          style: {
            background: 'var(--color)',
            color: 'var(--white-color)',
          },
        }}
      />
      {children}
    </>
  );
};
