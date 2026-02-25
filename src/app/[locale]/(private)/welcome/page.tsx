import { requireAuthAction } from '@/lib/db/server-actions/server-actions';
import { Suspense } from 'react';
import Spinner from '@/components/spinner/spinner';
import WelcomeLoader from '@/components/welcome/welcome-loader';

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * Server Component — shell for the level selection page.
 * Checks authorization, then streams WelcomeLoader inside Suspense.
 */
export default async function WelcomePage({ params }: Props) {
  const { locale } = await params;

  await requireAuthAction(locale);

  return (
    <div className='container'>
      <Suspense
        fallback={
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <Spinner />
          </div>
        }
      >
        <WelcomeLoader />
      </Suspense>
    </div>
  );
}
