import type { NextConfig } from 'next';
import { execSync } from 'child_process';
import createNextIntlPlugin from 'next-intl/plugin';

// В development режиме логи всегда включены
// В production можно отключить через NEXT_PUBLIC_DISABLE_CONSOLE=true
const shouldRemoveConsole =
  process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_DISABLE_CONSOLE === 'true';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_GIT_COMMIT_SHA:
      process.env.VERCEL_GIT_COMMIT_SHA || execSync('git rev-parse HEAD').toString().trim(),
    NEXT_PUBLIC_BUILD_TIMESTAMP: new Date().toUTCString(),
  },
  compiler: {
    removeConsole: shouldRemoveConsole,
  },
  turbopack: {
    root: __dirname,
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withNextIntl(nextConfig);
