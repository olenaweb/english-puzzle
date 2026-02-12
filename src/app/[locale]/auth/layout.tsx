'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/context/auth-context';
import Spinner from '@/components/spinner/spinner';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <>{children}</>;
  }

  return null;
}
