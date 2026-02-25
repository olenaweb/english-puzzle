import { getLevelAction } from '@/lib/db/server-actions/server-actions';
import { Level } from '@/types/types';
import Welcome from './welcome';

/**
 * Async Server Component — suspends while fetching levels.
 * Wrapped in <Suspense> in WelcomePage to enable streaming SSR.
 */
export default async function WelcomeLoader() {
  const result = await getLevelAction();

  return (
    <Welcome
      levels={result.isSuccess ? (result.data as Level[]) : []}
      error={!result.isSuccess ? result.message : undefined}
    />
  );
}
