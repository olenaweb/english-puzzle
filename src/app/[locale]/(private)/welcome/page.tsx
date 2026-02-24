import { requireAuthAction, getLevelAction } from '@/lib/db/server-actions/server-actions';
import Welcome from '@/components/welcome/welcome';
import { Level } from '@/types/types';
// import { useLocale } from 'next-intl';

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

  await requireAuthAction(locale);

  // Get level data on the server
  const result = await getLevelAction();

  return (
    <div className='container'>
      <Welcome
        levels={result.isSuccess ? (result.data as Level[]) : []}
        error={!result.isSuccess ? result.message : undefined}
      />
    </div>
  );
}
