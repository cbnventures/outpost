import {
  createHash,
  randomBytes,
} from 'node:crypto';

import { toDataURL } from 'qrcode';

import type {
  IncomingMessage,
  ServerResponse,
} from 'node:http';

import type {
  Plugin,
  ViteDevServer,
} from 'vite';

/**
 * Mock API - Mock scope.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 1.0.0
 */
type MockScope = 'metrics:read' | 'status:read' | 'updates:run';

/**
 * Mock API - Mock status.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 1.0.0
 */
type MockStatus = 'available' | 'failed' | 'rolled-back' | 'skipped' | 'up-to-date' | 'updated';

/**
 * Mock API - Mock trigger.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 1.0.0
 */
type MockTrigger = 'api' | 'dashboard' | 'schedule' | 'startup';

/**
 * Mock API - Mock issue.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 1.0.0
 */
type MockIssue = {
  field: string
  message: string
  path: string[]
};

/**
 * Mock API - Mock token.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 1.0.0
 */
type MockToken = {
  createdAt: string
  expiresAt: string | null
  hash: string
  id: string
  lastUsedAt: string | null
  name: string
  scopes: MockScope[]
};

/**
 * Mock API - Mock result.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 1.0.0
 */
type MockResult = {
  container: string
  detail: string
  image: string
  status: MockStatus
};

/**
 * Mock API - Mock report.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 1.0.0
 */
type MockReport = {
  error?: string
  finishedAt: string
  results: MockResult[]
  startedAt: string
  trigger: MockTrigger
};

/**
 * Mock API - Mock container.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 1.0.0
 */
type MockContainer = {
  history: Record<number, [MockStatus, string]>
  id: string
  image: string
  managed: boolean
  monitorOnly: boolean
  name: string
  note: string
  self?: boolean
  skipped?: string
};

/**
 * Mock API - Mock runtime settings.
 *
 * Mirrors the persisted settings contract used by the production API.
 * Keeping the mock contract aligned lets the settings UI work in development.
 *
 * @since 1.0.0
 */
type MockRuntimeSettings = {
  cleanup: boolean
  healthTimeoutSeconds: number
  labelMode: 'opt-in' | 'opt-out'
  monitorOnly: boolean
  runOnStart: boolean
  schedule: string
  settleSeconds: number
  stopTimeoutSeconds: number
};

/**
 * Mock API - Mock settings.
 *
 * Separates editable runtime behavior from read-only container details.
 * The development server returns the same document as the production API.
 *
 * @since 1.0.0
 */
type MockSettings = {
  runtime: MockRuntimeSettings
  system: {
    dataDirectory: string
    dockerHost: string
    timeZone: string
  }
};

/**
 * Mock API - Mock principal.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 1.0.0
 */
type MockPrincipal = {
  kind: 'session'
  sessionId: string
} | {
  kind: 'token'
  token: MockToken
};

/**
 * Mock API - Mock passkey.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 1.0.0
 */
type MockPasskey = {
  createdAt: string
  hostname: string | null
  id: string
  lastUsedAt: string | null
  name: string
};

/**
 * Mock API - Mock registry.
 *
 * Mirrors one private registry sign-in as the production API lists it.
 * The mock keeps no password, only whether a lost key removed it.
 *
 * @since 1.0.0
 */
type MockRegistry = {
  createdAt: string
  id: string
  passwordMissing: boolean
  registry: string
  updatedAt: string
  username: string
};

/**
 * Mock API - Setup code.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const setupCode: string = 'K7Q2M-XR9TD-P4W8N';

/**
 * Mock API - Mock password.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const mockPassword: string = 'mock password 123';

/**
 * Mock API - Mock notification service.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 1.0.0
 */
type MockNotificationService = 'apprise' | 'discord' | 'email' | 'gotify' | 'matrix' | 'ntfy' | 'ntfy-reverse-proxy' | 'pushover' | 'slack' | 'telegram' | 'webhook';

/**
 * Mock API - Mock notification.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 1.0.0
 */
type MockNotification = {
  createdAt: string
  events: string[]
  id: string
  lastAttemptAt: string | null
  lastError: string | null
  name: string
  secrets: Record<string, true>
  secretsMissing: string[]
  service: MockNotificationService
  settings: Record<string, string>
  updatedAt: string
};

// MockNotificationField is one service field: [key, message when missing, secret, required].

/**
 * Mock API - Mock notification field.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 1.0.0
 */
type MockNotificationField = [string, string, boolean, boolean];

// MockNotificationInput is a checked create or edit body, with the optional secrets to clear.

/**
 * Mock API - Mock notification input.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 1.0.0
 */
type MockNotificationInput = Pick<MockNotification, 'events' | 'name' | 'secrets' | 'service' | 'settings'> & {
  clearSecrets: string[]
};

// Each service's fields: [key, message when missing, secret, required].

/**
 * Mock API - Notification fields.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const notificationFields: Record<MockNotificationService, [string, string, boolean, boolean][]> = {
  'apprise': [
    [
      'url',
      'Enter the Apprise URL.',
      true,
      true,
    ],
    [
      'urls',
      '',
      true,
      false,
    ],
  ],
  'discord': [[
    'webhookUrl',
    'Enter the webhook URL.',
    true,
    true,
  ]],
  'email': [
    [
      'host',
      'Enter the SMTP server.',
      false,
      true,
    ],
    [
      'port',
      'Enter a port number.',
      false,
      true,
    ],
    [
      'security',
      'Choose STARTTLS, TLS, or none.',
      false,
      true,
    ],
    [
      'username',
      '',
      false,
      false,
    ],
    [
      'password',
      '',
      true,
      false,
    ],
    [
      'from',
      'Enter the address to send from.',
      false,
      true,
    ],
    [
      'to',
      'Enter the address to send to.',
      false,
      true,
    ],
  ],
  'gotify': [
    [
      'url',
      'Enter the server URL.',
      false,
      true,
    ],
    [
      'token',
      'Enter the app token.',
      true,
      true,
    ],
  ],
  'matrix': [
    [
      'homeserverUrl',
      'Enter the homeserver URL.',
      false,
      true,
    ],
    [
      'roomId',
      'Enter the room ID.',
      false,
      true,
    ],
    [
      'accessToken',
      'Enter the access token.',
      true,
      true,
    ],
  ],
  'ntfy': [
    [
      'url',
      'Enter the topic URL.',
      false,
      true,
    ],
    [
      'token',
      '',
      true,
      false,
    ],
  ],
  'ntfy-reverse-proxy': [
    [
      'url',
      'Enter the context URL.',
      false,
      true,
    ],
    [
      'token',
      '',
      true,
      false,
    ],
  ],
  'pushover': [
    [
      'userKey',
      'Enter the user key.',
      true,
      true,
    ],
    [
      'appToken',
      'Enter the app token.',
      true,
      true,
    ],
  ],
  'slack': [[
    'webhookUrl',
    'Enter the webhook URL.',
    true,
    true,
  ]],
  'telegram': [
    [
      'botToken',
      'Enter the bot token.',
      true,
      true,
    ],
    [
      'chatId',
      'Enter the chat ID.',
      false,
      true,
    ],
  ],
  'webhook': [
    [
      'url',
      'Enter the URL.',
      true,
      true,
    ],
    [
      'token',
      '',
      true,
      false,
    ],
  ],
};

/**
 * Mock API - Notification events.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const notificationEvents: {
  defaultEnabled: boolean
  description: string
  key: string
  label: string
}[] = [
  {
    defaultEnabled: true,
    description: 'The app started without its key and removed what it locked.',
    key: 'secrets-removed',
    label: 'Saved secrets were removed',
  },
  {
    defaultEnabled: true,
    description: 'Ten failed sign-ins from one address paused sign-in from it.',
    key: 'sign-in-locked',
    label: 'Sign-in locked',
  },
  {
    defaultEnabled: true,
    description: 'Containers were updated to new images.',
    key: 'updates-applied',
    label: 'Containers updated',
  },
  {
    defaultEnabled: true,
    description: 'Monitor-only containers have new images.',
    key: 'updates-available',
    label: 'New images available',
  },
  {
    defaultEnabled: true,
    description: 'An update failed or was rolled back.',
    key: 'update-failed',
    label: 'Update failed',
  },
];

/**
 * Mock API - Minute.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const minute: number = 60 * 1000;

/**
 * Mock API - Day.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const day: number = 24 * 60 * minute;

/**
 * Mock API - Started at.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const startedAt: number = Date.now();

/**
 * Mock API - Settings.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const settings: MockSettings = {
  runtime: {
    cleanup: true,
    healthTimeoutSeconds: 120,
    labelMode: 'opt-out',
    monitorOnly: false,
    runOnStart: false,
    schedule: '0 0 4 * * *',
    settleSeconds: 10,
    stopTimeoutSeconds: 30,
  },
  system: {
    dataDirectory: '/data',
    dockerHost: 'unix:///var/run/docker.sock',
    timeZone: 'UTC',
  },
};

/**
 * Mock API - Scope order.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const scopeOrder: MockScope[] = [
  'metrics:read',
  'status:read',
  'updates:run',
];

/**
 * Mock API - Administrator ID.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const administratorId: string = '00000000-0000-4000-8000-000000000001';

/**
 * Mock API - Digest.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const digest = (value: string): string => createHash('sha256').update(value).digest('hex');

// fakeDigest makes a stable, realistic image digest from a seed.

/**
 * Mock API - Fake digest.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const fakeDigest = (seed: string): string => `sha256:${digest(seed)}`;

// The seeds count days back from the latest 4:00 check, so the history looks the same at any hour.

/**
 * Mock API - Last check day.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const lastCheckDay: Date = new Date();

if (lastCheckDay.getHours() < 4) {
  lastCheckDay.setDate(lastCheckDay.getDate() - 1);
}

// at returns the time a number of days before the latest 4:00 check's day at a given local hour and minute.

/**
 * Mock API - At.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const at = (daysAgo: number, hour: number, minutes: number = 0): number => {
  const date: Date = new Date(lastCheckDay);

  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, minutes, 0, 0);

  return date.getTime();
};

// nextRun is the next 4:00 the schedule fires at.

/**
 * Mock API - Next run.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const nextRun = (): string => new Date(at(-1, 4)).toISOString();

/**
 * Mock API - Containers.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const containers: MockContainer[] = [
  {
    history: {},
    id: '4f6c2a1e9b3d',
    image: 'traefik:v3.2',
    managed: true,
    monitorOnly: false,
    name: 'traefik',
    note: 'Managed',
  },
  {
    history: {
      1: [
        'updated',
        'Recreated with nextcloud:30-apache',
      ],
      7: [
        'updated',
        'Recreated with nextcloud:30-apache',
      ],
    },
    id: '9a8e7d6c5b4a',
    image: 'nextcloud:30-apache',
    managed: true,
    monitorOnly: false,
    name: 'nextcloud',
    note: 'Managed',
  },
  {
    history: {
      5: [
        'updated',
        'Recreated with postgres:16-alpine',
      ],
    },
    id: '1b2c3d4e5f60',
    image: 'postgres:16-alpine',
    managed: true,
    monitorOnly: false,
    name: 'nextcloud-db',
    note: 'Managed',
  },
  {
    history: {
      0: [
        'failed',
        'Registry "ghcr.io" returned HTTP 503 for "immich-app/immich-server:release".',
      ],
      4: [
        'rolled-back',
        'New container did not become healthy within 120s; rolled back to the previous container',
      ],
    },
    id: '7e1f0a9b8c2d',
    image: 'ghcr.io/immich-app/immich-server:release',
    managed: true,
    monitorOnly: false,
    name: 'immich-server',
    note: 'Managed',
  },
  {
    history: {
      0: [
        'available',
        `New digest ${fakeDigest('jellyfin-10.10.3')}`,
      ],
      1: [
        'available',
        `New digest ${fakeDigest('jellyfin-10.10.3')}`,
      ],
      2: [
        'available',
        `New digest ${fakeDigest('jellyfin-10.10.3')}`,
      ],
    },
    id: '3c4d5e6f7a8b',
    image: 'jellyfin/jellyfin:10.10',
    managed: true,
    monitorOnly: true,
    name: 'jellyfin',
    note: 'Managed',
  },
  {
    history: {},
    id: '5d6e7f8a9b0c',
    image: 'ghcr.io/home-assistant/home-assistant:stable',
    managed: false,
    monitorOnly: false,
    name: 'homeassistant',
    note: 'Opted out by label',
  },
  {
    history: {},
    id: '8b9c0d1e2f3a',
    image: `pihole/pihole@${fakeDigest('pihole-2024.07.0')}`,
    managed: false,
    monitorOnly: false,
    name: 'pihole',
    note: 'Pinned image',
    skipped: 'Image is pinned to a digest or ID',
  },
  {
    history: {},
    id: '2a3b4c5d6e7f',
    image: 'qmcgaw/gluetun:v3.39',
    managed: false,
    monitorOnly: false,
    name: 'gluetun',
    note: 'Network namespace owner',
    skipped: 'Has containers sharing its network namespace',
  },
  {
    history: {},
    id: '6f7a8b9c0d1e',
    image: 'lscr.io/linuxserver/qbittorrent:latest',
    managed: false,
    monitorOnly: false,
    name: 'qbittorrent',
    note: 'Shared network namespace',
    skipped: 'Shares another container\'s network namespace',
  },
  {
    history: {
      1: [
        'updated',
        'Recreated with cbnventures/outpost:latest',
      ],
    },
    id: '0e1d2c3b4a59',
    image: 'cbnventures/outpost:latest',
    managed: true,
    monitorOnly: false,
    name: 'outpost',
    note: 'Managed',
    self: true,
  },
];

// resultFor says what a check found for one container on a given day; skipped containers always say why.

/**
 * Mock API - Result for.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const resultFor = (container: MockContainer, daysAgo: number): MockResult => {
  if (container.skipped !== undefined) {
    return {
      container: container.name,
      detail: container.skipped,
      image: container.image,
      status: 'skipped',
    };
  }

  const [
    status,
    detail,
  ] = container.history[daysAgo] ?? [
    'up-to-date',
    fakeDigest(`${container.image}-current`),
  ];

  return {
    container: container.name,
    detail,
    image: container.image,
    status,
  };
};

// Opted-out containers never appear in a check; every other container does.

/**
 * Mock API - Checked containers.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const checkedContainers = (): MockContainer[] => containers.filter((container: MockContainer): boolean => container.note !== 'Opted out by label');

/**
 * Mock API - Seed report.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const seedReport = (daysAgo: number, startTime: number, seconds: number, trigger: MockTrigger): MockReport => ({
  finishedAt: new Date(startTime + (seconds * 1000)).toISOString(),
  results: checkedContainers().map((container: MockContainer): MockResult => resultFor(container, daysAgo)),
  startedAt: new Date(startTime).toISOString(),
  trigger,
});

// About two weeks of checks: one each night at 4:00, plus a few started by hand, by a script, or at startup.

/**
 * Mock API - History.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const history: MockReport[] = [];

for (let daysAgo = 10; daysAgo >= 0; daysAgo -= 1) {
  const startTime: number = at(daysAgo, 4);

  if (startTime > Date.now()) {
    continue;
  }

  if (daysAgo === 8) {
    history.unshift({
      error: 'connect ENOENT /var/run/docker.sock',
      finishedAt: new Date(startTime + 1200).toISOString(),
      results: [{
        container: 'Outpost',
        detail: 'Update cycle failed: connect ENOENT /var/run/docker.sock',
        image: 'update cycle',
        status: 'failed',
      }],
      startedAt: new Date(startTime).toISOString(),
      trigger: 'schedule',
    });

    continue;
  }

  history.unshift(seedReport(daysAgo, startTime, 24 + ((daysAgo * 7) % 19) + ((daysAgo === 1 || daysAgo === 4) ? 52 : 0), 'schedule'));

  if (daysAgo === 6) {
    history.unshift(seedReport(daysAgo, at(daysAgo, 9, 12), 31, 'startup'));
  }

  if (daysAgo === 3) {
    history.unshift(seedReport(daysAgo, at(daysAgo, 14, 26), 27, 'api'));
  }
}

/**
 * Mock API - Jellyfin.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const jellyfin: MockContainer | undefined = containers.find((container: MockContainer): boolean => container.name === 'jellyfin');

if (jellyfin !== undefined) {
  history.unshift({
    finishedAt: new Date(at(1, 18, 20) + 4000).toISOString(),
    results: [resultFor(jellyfin, 1)],
    startedAt: new Date(at(1, 18, 20)).toISOString(),
    trigger: 'dashboard',
  });
}

history.sort((left: MockReport, right: MockReport): number => right.startedAt.localeCompare(left.startedAt));

/**
 * Mock API - Administrator.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
let administrator: {
  createdAt: string
  password: string
  username: string
} | null = null;

/**
 * Mock API - Pending challenge.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
let pendingChallenge: {
  challenge: string
  failures: number
} | null = null;

/**
 * Mock API - TOTP enabled.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
let totpEnabled: boolean = false;

/**
 * Mock API - TOTP pending.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
let totpPending: boolean = false;

/**
 * Mock API - Recovery codes.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
let recoveryCodes: string[] = [];

// Two saved passkeys, so the Security page shows a realistic list. Ones added in the mock are kept until it restarts.

/**
 * Mock API - Passkeys.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
let passkeys: MockPasskey[] = [
  {
    createdAt: new Date(startedAt - (34 * day)).toISOString(),
    hostname: 'outpost.example.net',
    id: 'pk-mJ3xQ8vN2rT5wY7z',
    lastUsedAt: new Date(startedAt - (2 * 60 * minute)).toISOString(),
    name: 'MacBook Pro',
  },
  {
    createdAt: new Date(startedAt - (9 * day)).toISOString(),
    hostname: 'outpost.example.net',
    id: 'pk-hK6dF1sL9pB4cX2v',
    lastUsedAt: new Date(startedAt - (3 * day)).toISOString(),
    name: 'iPhone',
  },
];

/**
 * Mock API - Passkey ceremonies.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const passkeyCeremonies: Map<string, string> = new Map();
// MOCK_KEY_REPLACED=true starts as if the encryption key had been lost, to show the notice.

/**
 * Mock API - Key replaced.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const keyReplaced: boolean = process.env['MOCK_KEY_REPLACED'] === 'true';

/**
 * Mock API - Removed secrets.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
let removedSecrets: {
  kind: 'authenticator' | 'notification' | 'registry'
  name?: string
  notificationId?: string
  registryId?: string
  removedAt: string
}[] = (keyReplaced) ? [{
  kind: 'authenticator',
  removedAt: new Date(startedAt).toISOString(),
}] : [];

/**
 * Mock API - Notifications.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const notifications: MockNotification[] = [
  {
    createdAt: new Date(startedAt - (21 * 24 * 60 * minute)).toISOString(),
    events: [
      'secrets-removed',
      'sign-in-locked',
      'updates-applied',
      'updates-available',
      'update-failed',
    ],
    id: 'ntf-1b3d5f7a9c0e2b48',
    lastAttemptAt: new Date(startedAt - (4 * 60 * minute)).toISOString(),
    lastError: null,
    name: 'My phone',
    secrets: {},
    secretsMissing: [],
    service: 'ntfy',
    settings: { url: 'https://ntfy.sh/outpost-updates' },
    updatedAt: new Date(startedAt - (21 * 24 * 60 * minute)).toISOString(),
  },
  {
    createdAt: new Date(startedAt - (12 * 24 * 60 * minute)).toISOString(),
    events: [
      'updates-applied',
      'update-failed',
    ],
    id: 'ntf-6a8c0e2b4d6f8a13',
    lastAttemptAt: new Date(startedAt - (28 * 60 * minute)).toISOString(),
    lastError: null,
    name: 'Homelab chat',
    secrets: { botToken: true },
    secretsMissing: [],
    service: 'telegram',
    settings: { chatId: '-1002468013579' },
    updatedAt: new Date(startedAt - (12 * 24 * 60 * minute)).toISOString(),
  },
  {
    createdAt: new Date(startedAt - (5 * 24 * 60 * minute)).toISOString(),
    events: ['update-failed'],
    id: 'ntf-9e1a3c5b7d0f2e64',
    lastAttemptAt: new Date(startedAt - (3 * 24 * 60 * minute)).toISOString(),
    lastError: 'Invalid login: 535 5.7.8 Authentication credentials invalid',
    name: 'Email',
    secrets: { password: true },
    secretsMissing: [],
    service: 'email',
    settings: {
      from: 'outpost@example.com',
      host: 'smtp.example.com',
      port: '587',
      security: 'starttls',
      to: 'me@example.com',
      username: 'outpost@example.com',
    },
    updatedAt: new Date(startedAt - (5 * 24 * 60 * minute)).toISOString(),
  },
];

// A lost key removes every destination's saved secrets, as the server does, and pauses
// those destinations until the secrets are entered again.
if (keyReplaced) {
  for (const notification of [...notifications].sort((left: MockNotification, right: MockNotification): number => left.name.localeCompare(right.name))) {
    const secretKeys: string[] = Object.keys(notification.secrets).sort();

    if (secretKeys.length === 0) {
      continue;
    }

    notification.secrets = {};
    notification.secretsMissing = secretKeys;
    removedSecrets.push({
      kind: 'notification',
      name: notification.name,
      notificationId: notification.id,
      removedAt: new Date(startedAt).toISOString(),
    });
  }
}

// Two saved sign-ins, so the Private registries list on the Settings page looks real. Ones added in the mock are kept until it restarts.

/**
 * Mock API - Registries.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const registries: MockRegistry[] = [
  {
    createdAt: '2026-10-28T09:14:00.000Z',
    id: 'reg-3c5e7a9b1d2f4a68',
    passwordMissing: false,
    registry: 'ghcr.io',
    updatedAt: '2026-10-28T09:14:00.000Z',
    username: 'cbnventures-bot',
  },
  {
    createdAt: '2026-11-01T16:42:00.000Z',
    id: 'reg-8b0d2f4a6c1e3b57',
    passwordMissing: false,
    registry: 'registry.example.com',
    updatedAt: '2026-11-01T16:42:00.000Z',
    username: 'deploy',
  },
];

// A lost key takes each registry's password as well, as the server does; the host and username stay.
if (keyReplaced) {
  for (const registry of registries) {
    registry.passwordMissing = true;
    removedSecrets.push({
      kind: 'registry',
      name: registry.registry,
      registryId: registry.id,
      removedAt: new Date(startedAt).toISOString(),
    });
  }
}

/**
 * Mock API - Running.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
let running: boolean = false;

/**
 * Mock API - Run started at.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
let runStartedAt: string | undefined = undefined;

/**
 * Mock API - Last error.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
let lastError: string | undefined = undefined;

/**
 * Mock API - Live checks.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
let liveChecks: number = 0;

/**
 * Mock API - Totals.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const totals: {
  cycles: number
  failed: number
  updated: number
} = {
  cycles: 0,
  failed: 0,
  updated: 0,
};

/**
 * Mock API - Sessions.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const sessions: Map<string, string> = new Map();

/**
 * Mock API - Event clients.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const eventClients: Set<ServerResponse> = new Set();

// Seeded tokens have readable values so scripts can call the mock: outpost_ and 43 characters, like real ones.

/**
 * Mock API - Seed tokens.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const seedTokens: {
  createdDaysAgo: number
  expiresInDays: number | null
  name: string
  plaintext: string
  scopes: MockScope[]
  usedMinutesAgo: number | null
}[] = [
  {
    createdDaysAgo: 40,
    expiresInDays: null,
    name: 'Home Assistant',
    plaintext: `outpost_${'homeassistant'.padEnd(43, '0')}`,
    scopes: ['status:read'],
    usedMinutesAgo: 5,
  },
  {
    createdDaysAgo: 21,
    expiresInDays: null,
    name: 'GitHub Actions',
    plaintext: `outpost_${'githubactions'.padEnd(43, '0')}`,
    scopes: [
      'status:read',
      'updates:run',
    ],
    usedMinutesAgo: 3 * 24 * 60,
  },
  {
    createdDaysAgo: 12,
    expiresInDays: 78,
    name: 'Prometheus',
    plaintext: `outpost_${'prometheus'.padEnd(43, '0')}`,
    scopes: ['metrics:read'],
    usedMinutesAgo: 0.5,
  },
];

/**
 * Mock API - Tokens.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const tokens: MockToken[] = seedTokens.map((seed): MockToken => ({
  createdAt: new Date(startedAt - (seed.createdDaysAgo * day)).toISOString(),
  expiresAt: (seed.expiresInDays === null) ? null : new Date(startedAt + (seed.expiresInDays * day)).toISOString(),
  hash: digest(seed.plaintext),
  id: `tok-${digest(seed.name).slice(0, 16)}`,
  lastUsedAt: (seed.usedMinutesAgo === null) ? null : new Date(startedAt - (seed.usedMinutesAgo * minute)).toISOString(),
  name: seed.name,
  scopes: seed.scopes,
}));

/**
 * Mock API - Sends JSON.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const sendJSON = (response: ServerResponse, status: number, body: unknown): void => {
  response.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json',
  }).end(JSON.stringify(body));
};

/**
 * Mock API - Sends empty.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const sendEmpty = (response: ServerResponse): void => {
  response.writeHead(204).end();
};

/**
 * Mock API - Sends error.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const sendError = (response: ServerResponse, status: number, code: string, message: string): void => {
  sendJSON(response, status, {
    error: {
      code,
      message,
    },
  });
};

/**
 * Mock API - Sends issues.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const sendIssues = (response: ServerResponse, status: number, code: string, issues: MockIssue[]): void => {
  sendJSON(response, status, {
    error: {
      code,
      issues,
      message: issues[0]?.message ?? 'Check the highlighted fields.',
    },
  });
};

/**
 * Mock API - Field issue.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const fieldIssue = (field: string, message: string): MockIssue => ({
  field,
  message,
  path: field.split('.'),
});

/**
 * Mock API - Reads cookies.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const readCookies = (request: IncomingMessage): Record<string, string> => Object.fromEntries((request.headers.cookie ?? '')
  .split(';')
  .map((part: string): string[] => part.trim().split('='))
  .filter((parts: string[]): boolean => parts.length >= 2 && parts[0] !== '')
  .map((parts: string[]): [string, string] => [
    parts[0] ?? '',
    decodeURIComponent(parts.slice(1).join('=')),
  ]));

/**
 * Mock API - Reads body.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const readBody = async (request: IncomingMessage): Promise<Record<string, unknown> | null> => {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }

  const text: string = Buffer.concat(chunks).toString('utf-8');

  if (text === '') {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(text);

    return (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) ? parsed as Record<string, unknown> : {};
  } catch {
    return null;
  }
};

// Marks the browser signed in and answers like the real session response.

/**
 * Mock API - Starts session.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const startSession = (response: ServerResponse, status: number = 200): void => {
  const sessionId: string = randomBytes(24).toString('base64url');
  const csrfToken: string = randomBytes(24).toString('base64url');

  sessions.set(sessionId, csrfToken);
  response.setHeader('Set-Cookie', [
    `outpost_session=${sessionId}; Path=/; HttpOnly; SameSite=Strict`,
    `outpost_csrf=${csrfToken}; Path=/; SameSite=Strict`,
  ]);
  sendJSON(response, status, {
    administrator: {
      id: administratorId,
      username: administrator?.username ?? 'admin',
    },
    csrfToken,
    expiresAt: new Date(Date.now() + day).toISOString(),
    status: 'authenticated',
  });
};

// principalOf finds who is calling: a personal access token wins over the session cookie.

/**
 * Mock API - Principal of.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const principalOf = (request: IncomingMessage): MockPrincipal | 'invalid-token' | null => {
  const authorization: string | undefined = request.headers.authorization;

  if (authorization !== undefined) {
    const plaintext: string = (authorization.startsWith('Bearer ')) ? authorization.slice(7).trim() : '';
    const token: MockToken | undefined = tokens.find((candidate: MockToken): boolean => candidate.hash === digest(plaintext));

    if (token === undefined || (token.expiresAt !== null && Date.parse(token.expiresAt) <= Date.now())) {
      return 'invalid-token';
    }

    token.lastUsedAt = new Date().toISOString();

    return {
      kind: 'token',
      token,
    };
  }

  const sessionId: string = readCookies(request)['outpost_session'] ?? '';

  return (administrator !== null && sessions.has(sessionId)) ? {
    kind: 'session',
    sessionId,
  } : null;
};

// Codes are compared like the server does: any letter case, with or without spaces and dashes.

/**
 * Mock API - Normalizes code.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const normalizeCode = (value: string): string => value.toUpperCase().replace(/[\s-]/gu, '');

// Usernames follow the rule every app shares: 3 to 64 characters, starting with a letter or number.

/**
 * Mock API - Username issue.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const usernameIssue = (value: string): string => {
  if (value === '') {
    return 'Enter a username.';
  }

  return (/^[A-Za-z0-9][A-Za-z0-9._-]{2,63}$/u.test(value)) ? '' : 'Use 3 to 64 letters, numbers, periods, underscores, or hyphens, starting with a letter or number.';
};

/**
 * Mock API - Password issue.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const passwordIssue = (value: unknown): string => {
  if (typeof value !== 'string' || value.length < 12) {
    return 'Use at least 12 characters.';
  }

  return (value.length > 1024) ? 'Use 1024 characters or fewer.' : '';
};

// unknownFields lists the body fields a route doesn't take.

/**
 * Mock API - Unknown fields.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const unknownFields = (body: Record<string, unknown>, allowed: string[]): MockIssue[] => Object.keys(body)
  .filter((field: string): boolean => !allowed.includes(field))
  .map((field: string): MockIssue => fieldIssue(field, 'This field isn\'t accepted.'));

// newRecoveryCodes makes ten codes the way the server does: ten characters without look-alikes, split 5-5.

/**
 * Mock API - New recovery codes.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const newRecoveryCodes = (): string[] => Array.from({ length: 10 }, (): string => {
  const code: string = [...randomBytes(10)].map((byte: number): string => '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'.charAt(byte % 32)).join('');

  return `${code.slice(0, 5)}-${code.slice(5)}`;
});

/**
 * Mock API - Scheduler state.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const schedulerState = (): Record<string, unknown> => ({
  lastError,
  lastReport: history[0],
  nextRun: nextRun(),
  running,
  startedAt: runStartedAt,
  totals: { ...totals },
});

/**
 * Mock API - Overview resource.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const overviewResource = (): Record<string, unknown> => ({
  ...schedulerState(),
  labelMode: settings.runtime.labelMode,
  monitorOnly: settings.runtime.monitorOnly,
  schedule: settings.runtime.schedule,
  timeZone: settings.system.timeZone,
});

// containerRows shows each container with its newest result, the way the server builds them from the history.

/**
 * Mock API - Container rows.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const containerRows = (): Record<string, unknown>[] => containers.map((container: MockContainer): Record<string, unknown> => {
  const report: MockReport | undefined = history.find((candidate: MockReport): boolean => candidate.results.some((result: MockResult): boolean => result.container === container.name));
  const result: MockResult | undefined = report?.results.find((candidate: MockResult): boolean => candidate.container === container.name);

  return {
    id: container.id,
    image: container.image,
    lastCheckedAt: report?.finishedAt,
    lastDetail: result?.detail,
    lastStatus: result?.status,
    managed: container.managed,
    monitorOnly: container.monitorOnly,
    name: container.name,
    note: container.note,
    self: container.self ?? false,
    state: 'running',
  };
}).sort((left: Record<string, unknown>, right: Record<string, unknown>): number => String(left['name']).localeCompare(String(right['name'])));

/**
 * Mock API - Metrics text.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const metricsText = (): string => {
  const lines: string[] = [
    '# HELP outpost_cycles_total Update cycles finished since start.',
    '# TYPE outpost_cycles_total counter',
    `outpost_cycles_total ${totals.cycles}`,
    '# HELP outpost_containers_updated_total Containers updated since start.',
    '# TYPE outpost_containers_updated_total counter',
    `outpost_containers_updated_total ${totals.updated}`,
    '# HELP outpost_containers_failed_total Container updates that failed or rolled back since start.',
    '# TYPE outpost_containers_failed_total counter',
    `outpost_containers_failed_total ${totals.failed}`,
    '# HELP outpost_cycle_running Whether an update cycle is running.',
    '# TYPE outpost_cycle_running gauge',
    `outpost_cycle_running ${(running) ? 1 : 0}`,
  ];
  const lastReport: MockReport | undefined = history[0];

  if (lastReport !== undefined) {
    lines.push(
      '# HELP outpost_last_cycle_timestamp_seconds When the last cycle finished.',
      '# TYPE outpost_last_cycle_timestamp_seconds gauge',
      `outpost_last_cycle_timestamp_seconds ${Math.floor(Date.parse(lastReport.finishedAt) / 1000)}`,
    );
  }

  return `${lines.join('\n')}\n`;
};

// broadcast sends one server-sent event to every open dashboard.

/**
 * Mock API - Broadcast.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const broadcast = (event: string, data: unknown): void => {
  for (const client of eventClients) {
    client.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  }
};

// liveResult is what a check started now finds: the first one updates immich-server, jellyfin keeps waiting.

/**
 * Mock API - Live result.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const liveResult = (container: MockContainer): MockResult => {
  const result: MockResult = resultFor(container, 0);

  if (container.name === 'immich-server') {
    return {
      ...result,
      detail: (liveChecks === 0) ? `Recreated with ${container.image}` : fakeDigest(`${container.image}-new`),
      status: (liveChecks === 0) ? 'updated' : 'up-to-date',
    };
  }

  if (result.status === 'updated' || result.status === 'failed' || result.status === 'rolled-back') {
    return {
      ...result,
      detail: fakeDigest(`${container.image}-current`),
      status: 'up-to-date',
    };
  }

  return result;
};

// startCheck runs a simulated check in the background, like the scheduler: one at a time.

/**
 * Mock API - Starts check.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const startCheck = (containerId: string | undefined, trigger: MockTrigger): boolean => {
  if (running) {
    return false;
  }

  running = true;
  runStartedAt = new Date().toISOString();
  broadcast('state', overviewResource());

  const targets: MockContainer[] = (containerId === undefined) ? checkedContainers() : containers.filter(
    (container: MockContainer): boolean => container.managed && container.id.startsWith(containerId),
  );

  setTimeout((): void => {
    const report: MockReport = {
      finishedAt: new Date().toISOString(),
      results: targets.map(liveResult),
      startedAt: runStartedAt ?? new Date().toISOString(),
      trigger,
    };

    liveChecks += 1;
    history.unshift(report);
    history.splice(50);
    totals.cycles += 1;
    totals.updated += report.results.filter((result: MockResult): boolean => result.status === 'updated').length;
    totals.failed += report.results.filter((result: MockResult): boolean => result.status === 'failed' || result.status === 'rolled-back').length;
    lastError = undefined;
    running = false;
    runStartedAt = undefined;
    broadcast('check', report);
    broadcast('state', overviewResource());
  }, (containerId === undefined) ? 7000 : 3000);

  return true;
};

// tokenInput reads and checks a create or edit body, sending the first problem it finds.

/**
 * Mock API - Token input.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 1.0.0
 */
const tokenInput = (response: ServerResponse, body: Record<string, unknown>, exceptId: string, creating: boolean): {
  expiresAt?: string | null
  name: string
  scopes: MockScope[]
} | null => {
  const extra: MockIssue[] = unknownFields(body, [
    'expiresAt',
    'name',
    'scopes',
  ]);

  if (extra.length > 0) {
    sendIssues(response, 422, 'invalid_request', extra);

    return null;
  }

  const name: string = (typeof body['name'] === 'string') ? body['name'].trim() : '';
  const rawScopes: unknown[] = (Array.isArray(body['scopes'])) ? body['scopes'] : [];
  const issues: MockIssue[] = [];

  if (name === '') {
    issues.push(fieldIssue('name', 'Name this token.'));
  } else if (name.length > 80) {
    issues.push(fieldIssue('name', 'Use 80 characters or fewer.'));
  }

  if (rawScopes.length === 0) {
    issues.push(fieldIssue('scopes', 'Choose at least one scope.'));
  } else if (rawScopes.some((scope: unknown): boolean => !scopeOrder.includes(scope as MockScope))) {
    issues.push(fieldIssue('scopes', `Choose from: ${scopeOrder.join(', ')}.`));
  } else if (new Set(rawScopes).size !== rawScopes.length) {
    issues.push(fieldIssue('scopes', 'Choose each scope only once.'));
  }

  const expiresAt: unknown = body['expiresAt'];

  if (expiresAt !== undefined && expiresAt !== null) {
    if (typeof expiresAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/u.test(expiresAt) || Number.isNaN(Date.parse(expiresAt))) {
      issues.push(fieldIssue('expiresAt', 'Use an ISO 8601 date and time with a time zone, like 2030-01-01T00:00:00Z.'));
    } else if (Date.parse(expiresAt) <= Date.now()) {
      issues.push(fieldIssue('expiresAt', 'Choose an expiration date in the future.'));
    }
  }

  if (issues.length > 0) {
    sendIssues(response, 422, 'invalid_request', issues);

    return null;
  }

  if (tokens.some((token: MockToken): boolean => token.id !== exceptId && token.name.toLowerCase() === name.toLowerCase())) {
    sendIssues(response, 409, 'token_exists', [fieldIssue('name', 'A token with this name already exists.')]);

    return null;
  }

  return {
    ...((expiresAt === undefined && !creating) ? {} : { expiresAt: (typeof expiresAt === 'string') ? expiresAt : null }),
    name,
    scopes: scopeOrder.filter((scope: MockScope): boolean => rawScopes.includes(scope)),
  };
};

/**
 * Mock API - Token resource.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const tokenResource = (token: MockToken): Record<string, unknown> => ({
  createdAt: token.createdAt,
  expiresAt: token.expiresAt,
  id: token.id,
  lastUsedAt: token.lastUsedAt,
  name: token.name,
  scopes: token.scopes,
});

// normalizeRegistry saves a host the way the server does: lowercase, without a scheme or path, and every Docker Hub name as docker.io.

/**
 * Mock API - Normalizes registry.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const normalizeRegistry = (value: string): string => {
  const host: string = value.trim().toLowerCase().replace(/^https?:\/\//u, '').split('/')[0] ?? '';

  return ([
    'docker.io',
    'index.docker.io',
    'registry-1.docker.io',
  ].includes(host)) ? 'docker.io' : host;
};

// registryInput reads and checks a registry sign-in body like the server, sending every problem it finds.

/**
 * Mock API - Registry input.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const registryInput = (response: ServerResponse, body: Record<string, unknown>, exceptId: string, creating: boolean): {
  password?: string
  registry: string
  username: string
} | null => {
  const password: unknown = body['password'];
  const registry: string = (typeof body['registry'] === 'string') ? normalizeRegistry(body['registry']) : '';
  const username: string = (typeof body['username'] === 'string') ? body['username'].trim() : '';
  const issues: MockIssue[] = [];

  // Leaving the password out of an edit keeps the saved one.
  if ((creating || password !== undefined) && (typeof password !== 'string' || password === '')) {
    issues.push(fieldIssue('password', 'Enter a password or access token.'));
  } else if (typeof password === 'string' && password.length > 4096) {
    issues.push(fieldIssue('password', 'Use 4096 characters or fewer.'));
  }

  if (registry === '') {
    issues.push(fieldIssue('registry', 'Enter a registry host, like ghcr.io.'));
  } else if (registry.length > 255) {
    issues.push(fieldIssue('registry', 'Use 255 characters or fewer.'));
  } else if (!/^(?:\[[0-9a-f:.]+\]|[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*)(?::[0-9]{1,5})?$/u.test(registry)) {
    issues.push(fieldIssue('registry', 'Use a host name with an optional port, like registry.example.com:5000.'));
  }

  if (username === '') {
    issues.push(fieldIssue('username', 'Enter a username.'));
  } else if (username.length > 255) {
    issues.push(fieldIssue('username', 'Use 255 characters or fewer.'));
  }

  issues.push(...unknownFields(body, [
    'password',
    'registry',
    'username',
  ]));

  if (issues.length > 0) {
    sendIssues(response, 422, 'invalid_request', issues);

    return null;
  }

  if (registries.some((candidate: MockRegistry): boolean => candidate.id !== exceptId && candidate.registry === registry)) {
    sendIssues(response, 409, 'registry_exists', [fieldIssue('registry', 'A sign-in for this registry already exists.')]);

    return null;
  }

  return {
    ...((typeof password === 'string') ? { password } : {}),
    registry,
    username,
  };
};

// Answers one dashboard API call, or returns false so Vite serves the page.

/**
 * Mock API - Handles request.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 1.0.0
 */
const handleRequest = async (request: IncomingMessage, response: ServerResponse): Promise<boolean> => {
  // The Host header gives the address the page was opened at, like the real server sees it.
  const url: URL = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
  const path: string = url.pathname;
  const method: string = request.method ?? 'GET';
  const aliasRoute: boolean = path === '/v1/update' || path === '/v1/status' || path === '/metrics';

  if (method === 'GET' && path === '/') {
    response.writeHead(302, { Location: '/admin/' }).end();

    return true;
  }

  if (!path.startsWith('/api/v1/') && !aliasRoute) {
    return false;
  }

  const parsedBody: Record<string, unknown> | null = (method === 'GET' || method === 'HEAD') ? {} : await readBody(request);

  if (parsedBody === null) {
    sendError(response, 400, 'invalid_json', 'The request body is not valid JSON.');

    return true;
  }

  const body: Record<string, unknown> = parsedBody;

  // The Watchtower-style paths take a token with the right scope, and nothing else.
  if (aliasRoute) {
    const aliases: Record<string, [string, MockScope]> = {
      '/metrics': [
        'GET',
        'metrics:read',
      ],
      '/v1/status': [
        'GET',
        'status:read',
      ],
      '/v1/update': [
        'POST',
        'updates:run',
      ],
    };
    const [
      aliasMethod,
      aliasScope,
    ] = aliases[path] ?? [
      '',
      'status:read',
    ];
    const aliasPrincipal: MockPrincipal | 'invalid-token' | null = principalOf(request);

    if (method !== aliasMethod) {
      sendError(response, 404, 'not_found', 'No route matches this request.');

      return true;
    }

    if (aliasPrincipal === null || aliasPrincipal === 'invalid-token' || aliasPrincipal.kind !== 'token') {
      sendError(response, 401, 'authentication_required', 'A valid personal access token is required.');

      return true;
    }

    if (!aliasPrincipal.token.scopes.includes(aliasScope)) {
      sendError(response, 403, 'scope_required', `This token doesn't have the ${aliasScope} scope.`);

      return true;
    }

    if (path === '/v1/update') {
      const started: boolean = startCheck(undefined, 'api');

      sendJSON(response, (started) ? 202 : 409, { started });

      return true;
    }

    if (path === '/v1/status') {
      sendJSON(response, 200, schedulerState());

      return true;
    }

    response.writeHead(200, { 'Content-Type': 'text/plain; version=0.0.4; charset=utf-8' }).end(metricsText());

    return true;
  }

  if (method === 'GET' && path === '/api/v1/setup/status') {
    sendJSON(response, 200, (administrator === null) ? {
      claimExpiresAt: new Date(startedAt + (30 * minute)).toISOString(),
      claimRequired: true,
    } : { claimRequired: false });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/setup/claim') {
    if (administrator !== null) {
      sendError(response, 409, 'claim_unavailable', 'Setup is already complete. Sign in instead.');

      return true;
    }

    const claimUsername: string = (typeof body['username'] === 'string') ? body['username'].trim() : '';
    const issues: MockIssue[] = unknownFields(body, [
      'claimCode',
      'password',
      'username',
    ]);

    if (typeof body['claimCode'] !== 'string' || body['claimCode'].trim() === '') {
      issues.push(fieldIssue('claimCode', 'Enter the setup code from the container log.'));
    }

    if (usernameIssue(claimUsername) !== '') {
      issues.push(fieldIssue('username', usernameIssue(claimUsername)));
    }

    if (passwordIssue(body['password']) !== '') {
      issues.push(fieldIssue('password', passwordIssue(body['password'])));
    }

    if (issues.length > 0) {
      sendIssues(response, 422, 'invalid_request', issues);

      return true;
    }

    if (normalizeCode(String(body['claimCode'])) !== normalizeCode(setupCode)) {
      sendIssues(response, 401, 'claim_invalid', [fieldIssue('claimCode', 'That setup code is wrong or expired. Restart the container to print a new one.')]);

      return true;
    }

    administrator = {
      createdAt: new Date().toISOString(),
      password: String(body['password']),
      username: claimUsername,
    };
    startSession(response, 201);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/login') {
    const issues: MockIssue[] = unknownFields(body, [
      'password',
      'username',
    ]);
    const loginUsername: string = (typeof body['username'] === 'string') ? body['username'].trim() : '';

    if (loginUsername === '') {
      issues.push(fieldIssue('username', 'Enter your username.'));
    }

    if (typeof body['password'] !== 'string' || body['password'] === '') {
      issues.push(fieldIssue('password', 'Enter your password.'));
    }

    if (issues.length > 0) {
      sendIssues(response, 422, 'invalid_request', issues);

      return true;
    }

    if (administrator === null || loginUsername.toLowerCase() !== administrator.username.toLowerCase() || body['password'] !== administrator.password) {
      sendError(response, 401, 'credentials_invalid', 'The username or password is incorrect.');

      return true;
    }

    if (totpEnabled) {
      pendingChallenge = {
        challenge: randomBytes(24).toString('base64url'),
        failures: 0,
      };
      sendJSON(response, 200, {
        challenge: pendingChallenge.challenge,
        expiresAt: new Date(Date.now() + (5 * minute)).toISOString(),
        status: 'second_factor_required',
      });

      return true;
    }

    startSession(response);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/login/second-factor') {
    const code: string = (typeof body['code'] === 'string') ? body['code'].trim() : '';

    if (pendingChallenge === null || body['challenge'] !== pendingChallenge.challenge) {
      sendError(response, 401, 'challenge_expired', 'Your sign-in timed out. Enter your password again.');

      return true;
    }

    if (code === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('code', 'Enter the code from your authenticator app, or a recovery code.')]);

      return true;
    }

    const isTotpCode: boolean = /^[0-9]{6}$/u.test(code);
    const recoveryCode: string | undefined = (isTotpCode) ? undefined : recoveryCodes.find((candidate: string): boolean => normalizeCode(candidate) === normalizeCode(code));

    if ((isTotpCode && code !== '123456') || (!isTotpCode && recoveryCode === undefined)) {
      pendingChallenge.failures += 1;

      if (pendingChallenge.failures >= 5) {
        pendingChallenge = null;
        sendError(response, 401, 'challenge_expired', 'Too many wrong codes. Enter your password again.');

        return true;
      }

      sendIssues(response, 401, 'code_invalid', [fieldIssue('code', 'That code doesn\'t match. Try the current code, or a recovery code.')]);

      return true;
    }

    recoveryCodes = recoveryCodes.filter((candidate: string): boolean => candidate !== recoveryCode);
    pendingChallenge = null;
    startSession(response);

    return true;
  }

  // Passkey sign-in accepts any answer from the browser, like the transmission-vpn mock.
  if (method === 'POST' && path === '/api/v1/auth/passkeys/login/options') {
    sendJSON(response, 200, {
      ceremonyId: randomBytes(16).toString('base64url'),
      options: {
        allowCredentials: [],
        challenge: randomBytes(32).toString('base64url'),
        rpId: url.hostname,
        timeout: 300000,
        userVerification: 'required',
      },
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/passkeys/login/verify') {
    if (administrator === null) {
      sendError(response, 401, 'passkey_rejected', 'That passkey wasn\'t accepted.');

      return true;
    }

    startSession(response);

    return true;
  }

  const principal: MockPrincipal | 'invalid-token' | null = principalOf(request);

  if (principal === 'invalid-token') {
    sendError(response, 401, 'authentication_required', 'A valid personal access token is required.');

    return true;
  }

  if (principal === null) {
    sendError(response, 401, 'authentication_required', 'Sign in to continue.');

    return true;
  }

  if (principal.kind === 'session' && method !== 'GET' && request.headers['x-csrf-token'] !== sessions.get(principal.sessionId)) {
    sendError(response, 403, 'csrf_invalid', 'The request CSRF token is missing or invalid.');

    return true;
  }

  // Tokens reach the dashboard data with the right scope; sign-in, security, and tokens need the browser session.

  /**
   * Mock API - Requires scope.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const requireScope = (scope: MockScope): boolean => {
    if (principal.kind === 'token' && !principal.token.scopes.includes(scope)) {
      sendError(response, 403, 'scope_required', `This token doesn't have the ${scope} scope.`);

      return false;
    }

    return true;
  };

  if (method === 'GET' && path === '/api/v1/auth/me') {
    sendJSON(response, 200, (principal.kind === 'token') ? {
      authenticationType: 'token',
      id: principal.token.id,
      name: principal.token.name,
      scopes: principal.token.scopes,
    } : {
      administratorId,
      authenticationType: 'session',
      id: 'mock-session',
      removedSecrets,
      username: administrator?.username ?? 'admin',
    });

    return true;
  }

  if (method === 'GET' && path === '/api/v1/overview') {
    if (requireScope('status:read')) {
      sendJSON(response, 200, overviewResource());
    }

    return true;
  }

  if (method === 'GET' && path === '/api/v1/status') {
    if (requireScope('status:read')) {
      sendJSON(response, 200, schedulerState());
    }

    return true;
  }

  if (method === 'GET' && path === '/api/v1/containers') {
    if (requireScope('status:read')) {
      sendJSON(response, 200, { items: containerRows() });
    }

    return true;
  }

  if (method === 'GET' && path === '/api/v1/history') {
    if (requireScope('status:read')) {
      sendJSON(response, 200, { items: history.slice(0, 50) });
    }

    return true;
  }

  if (method === 'GET' && path === '/api/v1/settings') {
    if (requireScope('status:read')) {
      sendJSON(response, 200, settings);
    }

    return true;
  }

  if (method === 'PUT' && path === '/api/v1/settings') {
    if (principal.kind === 'token') {
      sendError(response, 403, 'session_required', 'An administrator browser session is required.');

      return true;
    }

    const allowed: string[] = [
      'cleanup',
      'healthTimeoutSeconds',
      'labelMode',
      'monitorOnly',
      'runOnStart',
      'schedule',
      'settleSeconds',
      'stopTimeoutSeconds',
    ];
    const issues: MockIssue[] = unknownFields(body, allowed);

    for (const field of [
      'cleanup',
      'monitorOnly',
      'runOnStart',
    ]) {
      if (typeof body[field] !== 'boolean') {
        issues.push(fieldIssue(field, 'Use true or false.'));
      }
    }

    for (const field of [
      'healthTimeoutSeconds',
      'settleSeconds',
      'stopTimeoutSeconds',
    ]) {
      if (!Number.isInteger(body[field]) || Number(body[field]) <= 0) {
        issues.push(fieldIssue(field, 'Use a positive whole number.'));
      }
    }

    if (body['labelMode'] !== 'opt-in' && body['labelMode'] !== 'opt-out') {
      issues.push(fieldIssue('labelMode', 'Choose opt-in or opt-out.'));
    }

    if (typeof body['schedule'] !== 'string' || body['schedule'].trim() === '') {
      issues.push(fieldIssue('schedule', 'Enter a cron schedule.'));
    }

    if (issues.length > 0) {
      sendIssues(response, 422, 'invalid_request', issues);

      return true;
    }

    settings.runtime = {
      cleanup: body['cleanup'] === true,
      healthTimeoutSeconds: Number(body['healthTimeoutSeconds']),
      labelMode: (body['labelMode'] === 'opt-in') ? 'opt-in' : 'opt-out',
      monitorOnly: body['monitorOnly'] === true,
      runOnStart: body['runOnStart'] === true,
      schedule: String(body['schedule']),
      settleSeconds: Number(body['settleSeconds']),
      stopTimeoutSeconds: Number(body['stopTimeoutSeconds']),
    };
    sendJSON(response, 200, settings);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/checks') {
    if (!requireScope('updates:run')) {
      return true;
    }

    const extra: MockIssue[] = unknownFields(body, ['containerId']);

    if (extra.length > 0) {
      sendIssues(response, 422, 'invalid_request', extra);

      return true;
    }

    if (body['containerId'] !== undefined && (typeof body['containerId'] !== 'string' || !/^[0-9a-f]{12,64}$/u.test(body['containerId']))) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('containerId', 'Use a container ID of 12 to 64 hexadecimal characters.')]);

      return true;
    }

    if (!startCheck((typeof body['containerId'] === 'string') ? body['containerId'] : undefined, (principal.kind === 'token') ? 'api' : 'dashboard')) {
      sendError(response, 409, 'check_running', 'A check is already running.');

      return true;
    }

    sendJSON(response, 202, { started: true });

    return true;
  }

  if (method === 'GET' && path === '/api/v1/events') {
    if (!requireScope('status:read')) {
      return true;
    }

    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Connection': 'keep-alive',
      'Content-Type': 'text/event-stream; charset=utf-8',
    });
    response.write('retry: 3000\n\n');
    response.write(`event: state\ndata: ${JSON.stringify(overviewResource())}\n\n`);
    eventClients.add(response);

    const keepAlive: NodeJS.Timeout = setInterval((): void => {
      response.write(': keep-alive\n\n');
    }, 15_000);

    request.on('close', (): void => {
      clearInterval(keepAlive);
      eventClients.delete(response);
    });

    return true;
  }

  if (principal.kind === 'token') {
    if (path.startsWith('/api/v1/auth/')) {
      sendError(response, 403, 'session_required', 'An administrator browser session is required.');
    } else {
      sendError(response, 404, 'not_found', 'No route matches this request.');
    }

    return true;
  }

  /**
   * Mock API - Checks password.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const checkPassword = (field: string = 'password'): boolean => {
    if (typeof body[field] !== 'string' || body[field] === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue(field, (field === 'currentPassword') ? 'Enter your current password.' : 'Enter your password.')]);

      return false;
    }

    if (body[field] !== administrator?.password) {
      sendIssues(response, 422, 'password_incorrect', [fieldIssue(field, 'That password is incorrect.')]);

      return false;
    }

    return true;
  };

  /**
   * Mock API - Reject unknown.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const rejectUnknown = (allowed: string[]): boolean => {
    const extra: MockIssue[] = unknownFields(body, allowed);

    if (extra.length > 0) {
      sendIssues(response, 422, 'invalid_request', extra);

      return true;
    }

    return false;
  };

  if (method === 'DELETE' && path === '/api/v1/auth/removed-secrets') {
    removedSecrets = [];
    sendEmpty(response);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/logout') {
    sessions.delete(principal.sessionId);
    response.setHeader('Set-Cookie', [
      'outpost_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0',
      'outpost_csrf=; Path=/; SameSite=Strict; Max-Age=0',
    ]);
    sendEmpty(response);

    return true;
  }

  if (method === 'GET' && path === '/api/v1/auth/security') {
    sendJSON(response, 200, {
      hostname: url.hostname,
      passkeys,
      passkeysAvailable: true,
      recoveryCodesRemaining: recoveryCodes.length,
      totpEnabled,
      username: administrator?.username ?? 'admin',
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/password') {
    if (rejectUnknown([
      'currentPassword',
      'newPassword',
    ]) || !checkPassword('currentPassword')) {
      return true;
    }

    if (passwordIssue(body['newPassword']) !== '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('newPassword', passwordIssue(body['newPassword']))]);

      return true;
    }

    if (administrator !== null) {
      administrator.password = String(body['newPassword']);
    }

    // Other browsers are signed out; this one stays.
    for (const sessionId of [...sessions.keys()]) {
      if (sessionId !== principal.sessionId) {
        sessions.delete(sessionId);
      }
    }

    sendEmpty(response);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/username') {
    const newUsername: string = (typeof body['username'] === 'string') ? body['username'].trim() : '';

    if (rejectUnknown([
      'password',
      'username',
    ])) {
      return true;
    }

    if (typeof body['password'] !== 'string' || body['password'] === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('password', 'Enter your password.')]);

      return true;
    }

    if (usernameIssue(newUsername) !== '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('username', usernameIssue(newUsername))]);

      return true;
    }

    if (!checkPassword()) {
      return true;
    }

    if (administrator !== null) {
      administrator.username = newUsername;
    }

    sendJSON(response, 200, {
      administrator: {
        id: administratorId,
        username: administrator?.username ?? newUsername,
      },
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/totp/setup') {
    if (rejectUnknown(['password']) || !checkPassword()) {
      return true;
    }

    if (totpEnabled) {
      sendError(response, 409, 'totp_enabled', 'The authenticator app is already on.');

      return true;
    }

    // The same URI and QR code options as the real server, so the code scans.
    const totpUri: string = `otpauth://totp/Outpost:${encodeURIComponent(administrator?.username ?? 'admin')}?secret=JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP&issuer=Outpost&algorithm=SHA1&digits=6&period=30`;

    totpPending = true;
    sendJSON(response, 200, {
      expiresAt: new Date(Date.now() + (10 * minute)).toISOString(),
      qrCode: await toDataURL(totpUri, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 240,
      }),
      secret: 'JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP',
      uri: totpUri,
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/totp/enable') {
    if (rejectUnknown(['code'])) {
      return true;
    }

    if (!totpPending) {
      sendError(response, 409, 'totp_setup_expired', 'Authenticator setup expired. Start again.');

      return true;
    }

    if (body['code'] !== '123456') {
      sendIssues(response, 422, 'code_invalid', [fieldIssue('code', 'That code doesn\'t match. Check the time on your device and try again. In the mock, use 123456.')]);

      return true;
    }

    totpEnabled = true;
    totpPending = false;
    recoveryCodes = newRecoveryCodes();
    removedSecrets = removedSecrets.filter((removedSecret): boolean => removedSecret.kind !== 'authenticator');
    sendJSON(response, 200, { recoveryCodes });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/totp/disable') {
    if (rejectUnknown(['password']) || !checkPassword()) {
      return true;
    }

    if (!totpEnabled) {
      sendError(response, 409, 'totp_disabled', 'The authenticator app is already off.');

      return true;
    }

    totpEnabled = false;
    recoveryCodes = [];
    sendEmpty(response);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/recovery-codes') {
    if (rejectUnknown(['password']) || !checkPassword()) {
      return true;
    }

    if (!totpEnabled) {
      sendError(response, 409, 'totp_disabled', 'Turn on the authenticator app first.');

      return true;
    }

    recoveryCodes = newRecoveryCodes();
    sendJSON(response, 200, { recoveryCodes });

    return true;
  }

  // Adding a passkey runs the browser's real prompt; the mock saves whatever answer comes back.
  if (method === 'POST' && path === '/api/v1/auth/passkeys/register/options') {
    const passkeyName: string = (typeof body['name'] === 'string') ? body['name'].trim() : '';

    if (rejectUnknown([
      'name',
      'password',
    ])) {
      return true;
    }

    if (passkeyName === '' || [...passkeyName].length > 80) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('name', (passkeyName === '') ? 'Name this passkey.' : 'Use 80 characters or fewer.')]);

      return true;
    }

    if (!checkPassword()) {
      return true;
    }

    const ceremonyId: string = randomBytes(16).toString('base64url');

    passkeyCeremonies.set(ceremonyId, passkeyName);
    sendJSON(response, 200, {
      ceremonyId,
      options: {
        attestation: 'none',
        authenticatorSelection: {
          residentKey: 'required',
          userVerification: 'preferred',
        },
        challenge: randomBytes(32).toString('base64url'),
        excludeCredentials: [],
        pubKeyCredParams: [
          {
            alg: -7,
            type: 'public-key',
          },
          {
            alg: -257,
            type: 'public-key',
          },
        ],
        rp: {
          id: url.hostname,
          name: 'Outpost',
        },
        timeout: 300000,
        user: {
          displayName: administrator?.username ?? 'admin',
          id: Buffer.from(administratorId).toString('base64url'),
          name: administrator?.username ?? 'admin',
        },
      },
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/passkeys/register/verify') {
    const ceremonyId: string = (typeof body['ceremonyId'] === 'string') ? body['ceremonyId'] : '';
    const passkeyName: string | undefined = passkeyCeremonies.get(ceremonyId);

    if (passkeyName === undefined) {
      sendError(response, 409, 'passkey_ceremony_invalid', 'That passkey request expired. Try again.');

      return true;
    }

    const passkey: MockPasskey = {
      createdAt: new Date().toISOString(),
      hostname: url.hostname,
      id: `pk-${randomBytes(12).toString('base64url')}`,
      lastUsedAt: null,
      name: passkeyName,
    };

    passkeyCeremonies.delete(ceremonyId);
    passkeys = [
      ...passkeys,
      passkey,
    ];
    sendJSON(response, 201, passkey);

    return true;
  }

  if (method === 'DELETE' && path.startsWith('/api/v1/auth/passkeys/')) {
    const passkeyId: string = decodeURIComponent(path.slice('/api/v1/auth/passkeys/'.length));

    if (!passkeys.some((passkey: MockPasskey): boolean => passkey.id === passkeyId)) {
      sendError(response, 404, 'passkey_not_found', 'That passkey no longer exists.');

      return true;
    }

    if (rejectUnknown(['password']) || !checkPassword()) {
      return true;
    }

    passkeys = passkeys.filter((passkey: MockPasskey): boolean => passkey.id !== passkeyId);
    sendEmpty(response);

    return true;
  }

  if (method === 'GET' && path === '/api/v1/notifications/events') {
    sendJSON(response, 200, { items: notificationEvents });

    return true;
  }

  if (method === 'GET' && path === '/api/v1/notifications') {
    sendJSON(response, 200, { items: [...notifications].sort((left: MockNotification, right: MockNotification): number => right.createdAt.localeCompare(left.createdAt)) });

    return true;
  }

  // notificationInput checks a create or edit body like the server, sending the first problem.

  /**
   * Mock API - Notification input.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 1.0.0
   */
  const notificationInput = (existing: MockNotification | null): MockNotificationInput | null => {
    const service: MockNotificationService = existing?.service ?? body['service'] as MockNotificationService;
    const name: string = (typeof body['name'] === 'string') ? body['name'].trim() : '';
    const events: string[] = (Array.isArray(body['events'])) ? body['events'] as string[] : [];
    const values: Record<string, unknown> = (typeof body['settings'] === 'object' && body['settings'] !== null) ? body['settings'] as Record<string, unknown> : {};

    if (notificationFields[service] === undefined) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('service', 'Choose a service.')]);

      return null;
    }

    if (name === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('name', 'Name this notification.')]);

      return null;
    }

    if (events.length === 0) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('events', 'Choose at least one event.')]);

      return null;
    }

    const plainSettings: Record<string, string> = {};
    const secrets: Record<string, true> = { ...(existing?.secrets ?? {}) };

    for (const [
      key,
      missing,
      secret,
      required,
    ] of notificationFields[service]) {
      const value: string = (typeof values[key] === 'string') ? (values[key]).trim() : '';
      const saved: boolean = secret && existing !== null && existing.secrets[key] === true;

      if (value === '' && required && !saved) {
        sendIssues(response, 422, 'invalid_request', [fieldIssue(`settings.${key}`, missing)]);

        return null;
      }

      if (value !== '' && secret) {
        secrets[key] = true;
      } else if (value !== '') {
        plainSettings[key] = value;
      }
    }

    // Optional secrets that are saved, or missing after a lost key, can be cleared once each, never alongside a new value.
    const clearable: string[] = notificationFields[service]
      .filter((field: MockNotificationField): boolean => field[2] && !field[3] && existing !== null && (existing.secrets[field[0]] === true || existing.secretsMissing.includes(field[0])))
      .map((field: MockNotificationField): string => field[0]);
    const clearSecrets: unknown[] = (Array.isArray(body['clearSecrets'])) ? body['clearSecrets'] : [];
    const invalidIndex: number = clearSecrets.findIndex((key: unknown): boolean => typeof key !== 'string' || !clearable.includes(key));

    if (body['clearSecrets'] !== undefined && !Array.isArray(body['clearSecrets'])) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('clearSecrets', 'Choose an optional saved secret.')]);

      return null;
    }

    if (invalidIndex !== -1) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue(`clearSecrets.${invalidIndex}`, 'Choose an optional saved secret.')]);

      return null;
    }

    if (new Set(clearSecrets).size !== clearSecrets.length) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('clearSecrets', 'Choose each secret only once.')]);

      return null;
    }

    const replaced: string | undefined = (clearSecrets as string[]).find((key: string): boolean => typeof values[key] === 'string' && (values[key]).trim() !== '');

    if (replaced !== undefined) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue(`settings.${replaced}`, 'Enter a new value or clear this field, not both.')]);

      return null;
    }

    for (const key of clearSecrets as string[]) {
      Reflect.deleteProperty(secrets, key);
    }

    if (notifications.some((notification: MockNotification): boolean => notification.id !== existing?.id && notification.name.toLowerCase() === name.toLowerCase())) {
      sendIssues(response, 409, 'notification_exists', [fieldIssue('name', 'A notification with this name already exists.')]);

      return null;
    }

    return {
      events,
      name,
      clearSecrets: clearSecrets as string[],
      secrets,
      service,
      settings: plainSettings,
    };
  };

  if (method === 'POST' && path === '/api/v1/notifications') {
    const input: MockNotificationInput | null = notificationInput(null);

    if (input === null) {
      return true;
    }

    const notification: MockNotification = {
      events: input.events,
      name: input.name,
      secrets: input.secrets,
      service: input.service,
      settings: input.settings,
      createdAt: new Date().toISOString(),
      id: `ntf-${randomBytes(8).toString('hex')}`,
      lastAttemptAt: null,
      lastError: null,
      secretsMissing: [],
      updatedAt: new Date().toISOString(),
    };

    notifications.push(notification);
    sendJSON(response, 201, notification);

    return true;
  }

  const notificationMatch: RegExpMatchArray | null = path.match(/^\/api\/v1\/notifications\/(ntf-[0-9a-f]{16})(\/test)?$/u);

  if (notificationMatch !== null) {
    const index: number = notifications.findIndex((notification: MockNotification): boolean => notification.id === notificationMatch[1]);
    const notification: MockNotification | undefined = notifications[index];

    if (notification === undefined) {
      sendError(response, 404, 'notification_not_found', 'That notification no longer exists.');

      return true;
    }

    if (method === 'POST' && notificationMatch[2] === '/test') {
      if (notification.secretsMissing.length > 0) {
        sendJSON(response, 200, {
          delivered: false,
          message: 'Enter the removed secrets again first.',
        });

        return true;
      }

      notification.lastAttemptAt = new Date().toISOString();
      notification.lastError = null;
      sendJSON(response, 200, { delivered: true });

      return true;
    }

    if (method === 'DELETE') {
      notifications.splice(index, 1);
      removedSecrets = removedSecrets.filter((removedSecret): boolean => removedSecret.notificationId !== notification.id);
      sendEmpty(response);

      return true;
    }

    if (method === 'PUT') {
      const input: MockNotificationInput | null = notificationInput(notification);

      if (input === null) {
        return true;
      }

      notification.events = input.events;
      notification.name = input.name;
      notification.secrets = input.secrets;
      // A missing secret is settled by entering it again or, when optional, by clearing it.
      notification.secretsMissing = notification.secretsMissing.filter((key: string): boolean => input.secrets[key] !== true && !input.clearSecrets.includes(key));
      notification.settings = input.settings;
      notification.updatedAt = new Date().toISOString();

      if (notification.secretsMissing.length === 0) {
        removedSecrets = removedSecrets.filter((removedSecret): boolean => removedSecret.notificationId !== notification.id);
      }

      sendJSON(response, 200, notification);

      return true;
    }
  }

  if (method === 'GET' && path === '/api/v1/registries') {
    sendJSON(response, 200, { items: [...registries].sort((left: MockRegistry, right: MockRegistry): number => left.registry.localeCompare(right.registry)) });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/registries') {
    const input = registryInput(response, body, '', true);

    if (input === null) {
      return true;
    }

    const registry: MockRegistry = {
      createdAt: new Date().toISOString(),
      id: `reg-${randomBytes(8).toString('hex')}`,
      passwordMissing: false,
      registry: input.registry,
      updatedAt: new Date().toISOString(),
      username: input.username,
    };

    registries.push(registry);
    sendJSON(response, 201, registry);

    return true;
  }

  const registryMatch: RegExpMatchArray | null = path.match(/^\/api\/v1\/registries\/([^/]+)$/u);

  if (registryMatch !== null && (method === 'PUT' || method === 'DELETE')) {
    const index: number = registries.findIndex((registry: MockRegistry): boolean => registry.id === decodeURIComponent(registryMatch[1] ?? ''));
    const registry: MockRegistry | undefined = registries[index];

    if (registry === undefined) {
      sendError(response, 404, 'registry_not_found', 'That registry sign-in no longer exists.');

      return true;
    }

    if (method === 'DELETE') {
      registries.splice(index, 1);
      removedSecrets = removedSecrets.filter((removedSecret): boolean => removedSecret.registryId !== registry.id);
      sendEmpty(response);

      return true;
    }

    const input = registryInput(response, body, registry.id, false);

    if (input === null) {
      return true;
    }

    registry.registry = input.registry;
    registry.username = input.username;
    registry.updatedAt = new Date().toISOString();

    // A new password replaces the saved one, even one a lost key removed, and settles its notice.
    if (input.password !== undefined) {
      registry.passwordMissing = false;
      removedSecrets = removedSecrets.filter((removedSecret): boolean => removedSecret.registryId !== registry.id);
    }

    sendJSON(response, 200, registry);

    return true;
  }

  if (method === 'GET' && path === '/api/v1/auth/tokens') {
    sendJSON(response, 200, {
      items: [...tokens]
        .sort((left: MockToken, right: MockToken): number => right.createdAt.localeCompare(left.createdAt))
        .map(tokenResource),
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/tokens') {
    const input = tokenInput(response, body, '', true);

    if (input === null) {
      return true;
    }

    const plaintext: string = `outpost_${randomBytes(32).toString('base64url')}`;
    const token: MockToken = {
      createdAt: new Date().toISOString(),
      expiresAt: input.expiresAt ?? null,
      hash: digest(plaintext),
      id: `tok-${randomBytes(8).toString('hex')}`,
      lastUsedAt: null,
      name: input.name,
      scopes: input.scopes,
    };

    tokens.push(token);
    sendJSON(response, 201, {
      plaintext,
      token: tokenResource(token),
    });

    return true;
  }

  const tokenMatch: RegExpMatchArray | null = path.match(/^\/api\/v1\/auth\/tokens\/([^/]+)$/u);

  if (tokenMatch !== null && (method === 'PUT' || method === 'DELETE')) {
    const index: number = tokens.findIndex((token: MockToken): boolean => token.id === decodeURIComponent(tokenMatch[1] ?? ''));
    const token: MockToken | undefined = tokens[index];

    if (token === undefined) {
      sendError(response, 404, 'token_not_found', 'That token no longer exists.');

      return true;
    }

    if (method === 'DELETE') {
      tokens.splice(index, 1);
      sendEmpty(response);

      return true;
    }

    const input = tokenInput(response, body, token.id, false);

    if (input === null) {
      return true;
    }

    token.name = input.name;
    token.scopes = input.scopes;

    if (input.expiresAt !== undefined) {
      token.expiresAt = input.expiresAt;
    }

    sendJSON(response, 200, tokenResource(token));

    return true;
  }

  sendError(response, 404, 'not_found', 'No route matches this request.');

  return true;
};

/**
 * Mock API.
 *
 * Answers the dashboard's API from memory, so the interface runs without Docker.
 * Set up with the printed code and "mock password 123"; the authenticator code
 * is 123456, and recovery codes are random, shown once when they're made.
 *
 * @returns {Plugin}
 *
 * @since 1.0.0
 */
export const mockApi = (): Plugin => ({
  name: 'outpost-mock-api',
  configureServer: (server: ViteDevServer): void => {
    server.config.logger.info(`  Mock setup code: ${setupCode}, password "${mockPassword}"`);
    server.config.logger.info(`  Mock tokens: ${seedTokens.map((seed): string => `${seed.name} ${seed.plaintext} (${seed.scopes.join(', ')})`).join('; ')}`);

    server.middlewares.use((request: IncomingMessage, response: ServerResponse, next: () => void): void => {
      void handleRequest(request, response).then((handled: boolean): void => {
        if (!handled) {
          next();
        }
      }).catch((error: unknown): void => {
        server.config.logger.error(`  Mock API error: ${(error instanceof Error) ? error.stack ?? error.message : String(error)}`);

        if (!response.headersSent) {
          sendError(response, 500, 'internal_error', 'Something went wrong. Try again.');
        }
      });
    });
  },
});
