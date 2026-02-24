import { getTranslations } from 'next-intl/server';
import { getCurrentUserIdAction } from '@/lib/db/server-actions/server-actions';
import { redirect } from 'next/navigation';

interface RoundPageProps {
  params: Promise<{
    levelId: string;
    roundId: string;
    locale: string;
  }>;
}

export default async function RoundPage({ params }: RoundPageProps) {
  const { levelId, roundId, locale } = await params;
  const t = await getTranslations('RoundPage');

  const userId = await getCurrentUserIdAction();
  if (!userId) {
    redirect(`/${locale}/auth/signin`);
  }

  return (
    <div className='container'>
      <h1>{t('title', { levelNumber: levelId, roundNumber: roundId })}</h1>
    </div>
  );
}
