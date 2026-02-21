import { getCurrentUserIdAction, getLevelAction } from '@/lib/db/server-actions/server-actions';
// import { handleGetLevelAction } from '@/lib/db/client-action/handle-get-data';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import Welcome from '@/components/welcome/welcome';
import { Level } from '@/types/types';

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * Server Component for the level selection page
 * Checks authorization and loads data on the server
 */
export default async function WelcomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('WelcomePage');

  // Check authorization on the server
  const userId = await getCurrentUserIdAction();
  if (!userId) {
    redirect(`/${locale}/auth/signin`);
  }

  // Get level data on the server
  const result = await getLevelAction();

  return (
    <div className='container'>
      <h1>{t('title')}</h1>
      <Welcome
        levels={result.isSuccess ? (result.data as Level[]) : []}
        error={!result.isSuccess ? result.message : undefined}
      />
    </div>
  );
}
