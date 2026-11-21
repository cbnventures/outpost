import brandMarkUrl from '@/web/assets/brand-mark.svg';

import type { Web_AppConfig } from '@/types/web/app-config.d.ts';

/**
 * App Config - App Config.
 *
 * Keeps product copy, storage keys, and token capabilities outside the shared
 * console foundation so another app can adopt it without editing shared files.
 *
 * @since 1.1.0
 */
export const appConfig: Web_AppConfig = {
  appName: 'Outpost',
  brandMarkUrl,
  brandName: 'Outpost',
  claimCodeHint: 'Find it with docker logs. A new code is printed each time the container restarts.',
  recoveryCodeFileName: 'outpost-recovery-codes.txt',
  roleLabels: {},
  securityLabel: 'Sign-in and security',
  securitySurfaceName: 'dashboard',
  storageKeys: {
    theme: 'outpost-theme',
  },
  tokenDefaultScopes: ['status:read'],
  tokenNamePlaceholder: 'e.g. Monitoring dashboard',
  tokenScopes: [
    {
      description: 'See the overview, containers, history, and settings.',
      endpoints: [
        'GET /api/v1/overview',
        'GET /api/v1/containers',
        'GET /api/v1/history',
        'GET /api/v1/settings',
        'GET /api/v1/status',
        'GET /api/v1/events',
        'GET /v1/status',
      ],
      id: 'status:read',
    },
    {
      description: 'Check for available images and apply updates unless Outpost is monitor-only.',
      endpoints: [
        'POST /api/v1/checks',
        'POST /api/v1/updates',
        'POST /v1/update',
      ],
      id: 'updates:run',
    },
    {
      description: 'Read the Prometheus metrics.',
      endpoints: ['GET /metrics'],
      id: 'metrics:read',
    },
  ],
};
