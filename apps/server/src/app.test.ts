import {
  createHash,
  generateKeyPairSync,
  randomBytes,
  sign,
} from 'node:crypto';
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { createApp } from './app.js';
import { loadConfig } from './config.js';
import { Runner as History } from './history.js';
import { Runner as State } from './lib/state.js';
import {
  generateCode,
  generateTotpSecret,
} from './lib/totp.js';
import {
  csrfTokenPattern,
  personalAccessTokenIdPattern,
  personalAccessTokenPattern,
  registryIdPattern,
  sessionTokenPattern,
} from './regex.js';
import { Runner as Scheduler } from './scheduler.js';

import type {
  App_AccountSecurity_ChangesThePasswordAndUsername_Client,
  App_AccountSecurity_ChangesThePasswordAndUsername_OtherBrowser,
  App_AccountSecurity_ListsWhatALostKeyRemovedUntilItIsDismissed_Administrator,
  App_AccountSecurity_ListsWhatALostKeyRemovedUntilItIsDismissed_Client,
  App_AccountSecurity_ListsWhatALostKeyRemovedUntilItIsDismissed_RestartedClient,
  App_AccountSecurity_ListsWhatALostKeyRemovedUntilItIsDismissed_Stderr,
  App_BaseDirectory,
  App_Claim_Client,
  App_Claim_Returns,
  App_Claim_RunningHarness,
  App_Claim_SetupClaim,
  App_ContainerInspects,
  App_Containers,
  App_CreateAssertion_Authenticator,
  App_CreateAssertion_AuthenticatorData,
  App_CreateAssertion_ClientData,
  App_CreateAssertion_Options,
  App_CreateAssertion_Origin,
  App_CreateAssertion_Returns,
  App_CreateAssertion_RpId,
  App_CreateAssertion_Signature,
  App_CreateAuthenticator_KeyPair,
  App_CreateAuthenticator_Returns,
  App_CreateAuthenticatorData_Attested,
  App_CreateAuthenticatorData_Counter,
  App_CreateAuthenticatorData_Flags,
  App_CreateAuthenticatorData_Returns,
  App_CreateAuthenticatorData_RpId,
  App_CreateAuthenticatorData_SignCount,
  App_CreateClient_BaseUrl,
  App_CreateClient_Cookies,
  App_CreateClient_DefaultHeaders,
  App_CreateClient_Request,
  App_CreateClient_Request_Body,
  App_CreateClient_Request_Headers,
  App_CreateClient_Request_Method,
  App_CreateClient_Request_Name,
  App_CreateClient_Request_Pair,
  App_CreateClient_Request_Path,
  App_CreateClient_Request_RequestHeaders,
  App_CreateClient_Request_Response,
  App_CreateClient_Request_Returns,
  App_CreateClient_Request_Text,
  App_CreateClient_Request_Value,
  App_CreateClient_Returns,
  App_CreateRegistration_AttestationObject,
  App_CreateRegistration_Attested,
  App_CreateRegistration_Authenticator,
  App_CreateRegistration_AuthenticatorData,
  App_CreateRegistration_ClientData,
  App_CreateRegistration_CredentialIdLength,
  App_CreateRegistration_Options,
  App_CreateRegistration_Origin,
  App_CreateRegistration_PublicKey,
  App_CreateRegistration_Returns,
  App_CreateToken_Name,
  App_CreateToken_Returns,
  App_CreateToken_RunningHarness,
  App_CreateToken_Scopes,
  App_CreateToken_Token,
  App_DashboardApi_EndsStreamsForRevokedCallers_Client,
  App_DashboardApi_EndsStreamsForRevokedCallers_Reader,
  App_DashboardApi_EndsStreamsForRevokedCallers_SessionEvents,
  App_DashboardApi_EndsStreamsForRevokedCallers_TokenEvents,
  App_DashboardApi_ReportsDockerFailures_Client,
  App_DashboardApi_RunsOneCheckAtATime_Automation,
  App_DashboardApi_RunsOneCheckAtATime_Client,
  App_DashboardApi_RunsOneCheckAtATime_Reader,
  App_DashboardApi_RunsOneCheckAtATime_Runner,
  App_DashboardApi_ServesDataToSessionsAndStatusTokens_Anonymous,
  App_DashboardApi_ServesDataToSessionsAndStatusTokens_Client,
  App_DashboardApi_ServesDataToSessionsAndStatusTokens_Reader,
  App_DashboardApi_ServesDataToSessionsAndStatusTokens_Runner,
  App_DashboardApi_ServesDataToSessionsAndStatusTokens_Settings,
  App_DashboardApi_ServesDataToSessionsAndStatusTokens_UpdatedSettings,
  App_DashboardApi_StreamsTheStateAndEachFinishedCheck_Client,
  App_DashboardApi_StreamsTheStateAndEachFinishedCheck_Events,
  App_DashboardApi_StreamsTheStateAndEachFinishedCheck_Finished,
  App_DashboardApi_StreamsTheStateAndEachFinishedCheck_NamedEvents,
  App_DashboardApi_StreamsTheStateAndEachFinishedCheck_Opened,
  App_EncodeCbor_Bytes,
  App_EncodeCbor_Entries,
  App_EncodeCbor_Returns,
  App_EncodeCbor_Value,
  App_EncodeCborHead_Head,
  App_EncodeCborHead_Length,
  App_EncodeCborHead_MajorType,
  App_EncodeCborHead_Returns,
  App_ErrorsAndTheDashboardPage_AnswersMalformedRequestsWithTheErrorEnvelope_Client,
  App_ErrorsAndTheDashboardPage_AnswersMalformedRequestsWithTheErrorEnvelope_Limited,
  App_ErrorsAndTheDashboardPage_ServesThePageForEveryDashboardPath_Asset,
  App_ErrorsAndTheDashboardPage_ServesThePageForEveryDashboardPath_Client,
  App_ErrorsAndTheDashboardPage_ServesThePageForEveryDashboardPath_OldApi,
  App_ErrorsAndTheDashboardPage_ServesThePageForEveryDashboardPath_Page,
  App_ErrorsAndTheDashboardPage_ServesThePageForEveryDashboardPath_Root,
  App_Harness,
  App_Notifications_AddsEditsTestsAndRemovesDestinations_Client,
  App_Notifications_AddsEditsTestsAndRemovesDestinations_Created,
  App_Notifications_AddsEditsTestsAndRemovesDestinations_Events,
  App_Notifications_AddsEditsTestsAndRemovesDestinations_NotificationId,
  App_Notifications_AddsEditsTestsAndRemovesDestinations_Token,
  App_Notifications_ClearsSavedOptionalSecretsExplicitly_Client,
  App_Notifications_ClearsSavedOptionalSecretsExplicitly_Created,
  App_Notifications_ClearsSavedOptionalSecretsExplicitly_NotificationId,
  App_Notifications_Mocks,
  App_Notifications_Module,
  App_OpenEvents_BaseUrl,
  App_OpenEvents_Buffer,
  App_OpenEvents_Close,
  App_OpenEvents_Controller,
  App_OpenEvents_Decoder,
  App_OpenEvents_Headers,
  App_OpenEvents_Reader,
  App_OpenEvents_ReadUntil,
  App_OpenEvents_ReadUntil_Chunk,
  App_OpenEvents_ReadUntil_Returns,
  App_OpenEvents_ReadUntil_Until,
  App_OpenEvents_Response,
  App_OpenEvents_Returns,
  App_ParseEvents_Field,
  App_ParseEvents_Returns,
  App_ParseEvents_ServerSentEvent,
  App_ParseEvents_Text,
  App_ParseEvents_Value,
  App_ProxyHeaders,
  App_ProxyTrust_TrustsForwardedHeadersOnlyFromPrivateSenders_Claimed,
  App_ProxyTrust_TrustsForwardedHeadersOnlyFromPrivateSenders_FailedAttempts,
  App_ProxyTrust_TrustsForwardedHeadersOnlyFromPrivateSenders_Proxied,
  App_ProxyTrust_TrustsForwardedHeadersOnlyFromPrivateSenders_TrustProxy,
  App_Registries_AddsEditsAndRemovesRegistrySignIns_Automation,
  App_Registries_AddsEditsAndRemovesRegistrySignIns_Client,
  App_Registries_AddsEditsAndRemovesRegistrySignIns_Created,
  App_Registries_AddsEditsAndRemovesRegistrySignIns_Ghcr,
  App_Registries_AddsEditsAndRemovesRegistrySignIns_GhcrId,
  App_Registries_AddsEditsAndRemovesRegistrySignIns_RegistryId,
  App_Registries_AddsEditsAndRemovesRegistrySignIns_Token,
  App_Registries_AsksAgainForAPasswordALostKeyRemoved_Client,
  App_Registries_AsksAgainForAPasswordALostKeyRemoved_Created,
  App_Registries_AsksAgainForAPasswordALostKeyRemoved_RegistryId,
  App_Registries_AsksAgainForAPasswordALostKeyRemoved_RestartedClient,
  App_Registries_AsksAgainForAPasswordALostKeyRemoved_Stderr,
  App_ReleaseCycle_Release,
  App_ReleaseCycle_Returns,
  App_ReleaseCycle_RunningHarness,
  App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Attacker,
  App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Client,
  App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Enabled,
  App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_FailedAttempts,
  App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_GuessedStep,
  App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Guesser,
  App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Guesses,
  App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Limited,
  App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_PasswordStep,
  App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_RecoveryCodes,
  App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Secret,
  App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Setup,
  App_SetupAndSignIn_ClaimsTheFirstAccountAndChecksCsrf_Claimed,
  App_SetupAndSignIn_ClaimsTheFirstAccountAndChecksCsrf_Client,
  App_SetupAndSignIn_ClaimsTheFirstAccountAndChecksCsrf_SetCookies,
  App_SetupAndSignIn_KeepsASessionAcrossARestart_Client,
  App_SetupAndSignIn_KeepsASessionAcrossARestart_RestartedClient,
  App_SetupAndSignIn_LimitsSetupCodesAndRefusesAnExpiredOne_Client,
  App_SetupAndSignIn_LimitsSetupCodesAndRefusesAnExpiredOne_Clock,
  App_SetupAndSignIn_LimitsSetupCodesAndRefusesAnExpiredOne_Guesses,
  App_SetupAndSignIn_LimitsSetupCodesAndRefusesAnExpiredOne_Limited,
  App_SetupAndSignIn_LimitsSetupCodesAndRefusesAnExpiredOne_SetupClaim,
  App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_Authenticator,
  App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_Client,
  App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_CreationOptions,
  App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_OtherHost,
  App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_OtherOptions,
  App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_RegistrationOptions,
  App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_RequestOptions,
  App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_SignInOptions,
  App_StartHarness_Address,
  App_StartHarness_Cycle,
  App_StartHarness_DataDirectory,
  App_StartHarness_Docker,
  App_StartHarness_History,
  App_StartHarness_HttpServer,
  App_StartHarness_Inspected,
  App_StartHarness_Options,
  App_StartHarness_Returns,
  App_StartHarness_Scheduler,
  App_StartHarness_State,
  App_StopHarness_HttpServer,
  App_StopHarness_Returns,
  App_StopHarness_RunningHarness,
  App_Tokens_CreatesEditsAndRevokesNamedTokens_Client,
  App_Tokens_CreatesEditsAndRevokesNamedTokens_Created,
  App_Tokens_CreatesEditsAndRevokesNamedTokens_TokenId,
  App_WaitForIdle_Returns,
  App_WaitForIdle_RunningHarness,
  App_WatchtowerStyleEndpoints_NeedsATokenWithTheMatchingScope_Client,
  App_WatchtowerStyleEndpoints_NeedsATokenWithTheMatchingScope_Metrics,
  App_WatchtowerStyleEndpoints_NeedsATokenWithTheMatchingScope_Reader,
  App_WatchtowerStyleEndpoints_NeedsATokenWithTheMatchingScope_Runner,
  App_WatchtowerStyleEndpoints_NeedsATokenWithTheMatchingScope_Scraper,
  App_WatchtowerStyleEndpoints_NeedsATokenWithTheMatchingScope_WrongToken,
} from './types/app.test.d.ts';

/**
 * App - Notification Mocks.
 *
 * Stands in for the network send, so no notification leaves a test.
 * Each test that sends sets what it answers.
 *
 * @since 1.0.0
 */
const notificationMocks: App_Notifications_Mocks = vi.hoisted(() => ({
  send: vi.fn(),
}));

vi.mock('./lib/notifications.js', async (importOriginal) => ({
  ...(await importOriginal<App_Notifications_Module>()),
  sendNotification: notificationMocks['send'],
}));

/**
 * App - Containers.
 *
 * Two running containers as Docker lists them: one Outpost manages and one
 * opted out by label.
 *
 * @since 1.0.0
 */
const containers: App_Containers = [
  {
    Id: `aaaaaaaaaaaa${'1'.repeat(52)}`,
    Names: ['/web'],
    Image: 'nginx:1',
    ImageID: 'sha256:1',
    Labels: {},
    HostConfig: {
      NetworkMode: 'bridge',
      AutoRemove: false,
    },
    State: 'running',
  },
  {
    Id: `bbbbbbbbbbbb${'2'.repeat(52)}`,
    Names: ['/db'],
    Image: 'postgres:17',
    ImageID: 'sha256:2',
    Labels: { 'io.cbnventures.outpost.enable': 'false' },
    HostConfig: {
      NetworkMode: 'bridge',
      AutoRemove: false,
    },
    State: 'running',
  },
];

/**
 * App - Container Inspects.
 *
 * The inspected configuration of both containers, which the container rows
 * read pinned images and shared networks from.
 *
 * @since 1.0.0
 */
const containerInspects: App_ContainerInspects = [
  {
    Id: `aaaaaaaaaaaa${'1'.repeat(52)}`,
    Name: '/web',
    Image: 'sha256:1',
    Config: { Image: 'nginx:1' },
    HostConfig: {
      NetworkMode: 'bridge',
      AutoRemove: false,
    },
    NetworkSettings: { Networks: { bridge: {} } },
    Mounts: [],
    State: {
      Running: true,
      Status: 'running',
    },
  },
  {
    Id: `bbbbbbbbbbbb${'2'.repeat(52)}`,
    Name: '/db',
    Image: 'sha256:2',
    Config: { Image: 'postgres:17' },
    HostConfig: {
      NetworkMode: 'bridge',
      AutoRemove: false,
    },
    NetworkSettings: { Networks: { bridge: {} } },
    Mounts: [],
    State: {
      Running: true,
      Status: 'running',
    },
  },
];

/**
 * App - Proxy Headers.
 *
 * Makes requests from the loopback test client look like they came through a proxy.
 * The app should then use this hostname and scheme as its own address.
 *
 * @since 1.0.0
 */
const proxyHeaders: App_ProxyHeaders = {
  'X-Forwarded-Host': 'outpost.example.net',
  'X-Forwarded-Proto': 'https',
};

/**
 * App - Base Directory.
 *
 * Holds each test's data folder and stand-in dashboard build in one
 * temporary directory.
 *
 * @since 1.0.0
 */
let baseDirectory: App_BaseDirectory = '';

/**
 * App - Harness.
 *
 * Holds the running server of the current test, which the clean-up step
 * stops even when the test fails.
 *
 * @since 1.0.0
 */
let harness: App_Harness = undefined;

/**
 * App - Start Harness.
 *
 * Builds the real app with a real scheduler whose checks wait until a test
 * releases them, and listens on a random loopback port.
 *
 * @param {App_StartHarness_Options} [options] - Options.
 *
 * @returns {App_StartHarness_Returns}
 *
 * @since 1.0.0
 */
async function startHarness(options: App_StartHarness_Options = {}): App_StartHarness_Returns {
  const dataDirectory: App_StartHarness_DataDirectory = join(baseDirectory, 'data');
  const state: App_StartHarness_State = new State(dataDirectory, options['now']);
  const history: App_StartHarness_History = new History(join(dataDirectory, 'history.json'), 50);
  const docker: App_StartHarness_Docker = {
    failing: false,
  };
  const cycle: App_StartHarness_Cycle = {
    calls: [],
    pending: [],
  };
  const scheduler: App_StartHarness_Scheduler = new Scheduler(async (containerIds) => {
    cycle['calls'].push(containerIds);

    return new Promise((resolve) => {
      cycle['pending'].push(() => {
        resolve({
          startedAt: '2026-10-25T04:00:00.000Z',
          finishedAt: '2026-10-25T04:00:05.000Z',
          results: [{
            container: 'web',
            image: 'nginx:1',
            status: 'up-to-date',
            detail: 'sha256:1',
          }],
        });

        return;
      });

      return;
    });
  }, history, () => undefined);
  const httpServer: App_StartHarness_HttpServer = createServer(createApp({
    config: loadConfig({ OUTPOST_DATA_DIRECTORY: dataDirectory }),
    eventHeartbeatMilliseconds: 50,
    history,
    inspectContainer: async (id) => {
      const inspected: App_StartHarness_Inspected = containerInspects.find((containerInspect) => containerInspect['Id'] === id);

      if (inspected === undefined) {
        throw new Error(`No such container: ${id}`);
      }

      return inspected;
    },
    listContainers: async () => {
      if (docker['failing'] === true) {
        throw new Error('connect ENOENT /var/run/docker.sock');
      }

      return containers;
    },
    ...((options['now'] === undefined) ? {} : { now: options['now'] }),
    scheduler,
    state,
    webRoot: options['webRoot'] ?? join(baseDirectory, 'web'),
  }));

  await new Promise((resolve) => {
    httpServer.listen(0, '127.0.0.1', () => {
      resolve(undefined);

      return;
    });

    return;
  });

  const address: App_StartHarness_Address = httpServer.address();

  if (address === null || typeof address === 'string') {
    throw new Error('The test server did not report a port.');
  }

  return {
    baseUrl: `http://127.0.0.1:${String(address['port'])}`,
    cycle,
    docker,
    history,
    httpServer,
    scheduler,
    state,
  };
}

/**
 * App - Release Cycle.
 *
 * Lets the oldest waiting check finish with its one up-to-date result.
 * A test that releases a check nobody started fails right away.
 *
 * @param {App_ReleaseCycle_RunningHarness} runningHarness - Running harness.
 *
 * @returns {App_ReleaseCycle_Returns}
 *
 * @since 1.0.0
 */
function releaseCycle(runningHarness: App_ReleaseCycle_RunningHarness): App_ReleaseCycle_Returns {
  const release: App_ReleaseCycle_Release = runningHarness['cycle']['pending'].shift();

  if (release === undefined) {
    throw new Error('No check is waiting to finish.');
  }

  release();

  return;
}

/**
 * App - Wait For Idle.
 *
 * Waits until the scheduler has recorded the running check and released its lock.
 * The history holds the report by then.
 *
 * @param {App_WaitForIdle_RunningHarness} runningHarness - Running harness.
 *
 * @returns {App_WaitForIdle_Returns}
 *
 * @since 1.0.0
 */
async function waitForIdle(runningHarness: App_WaitForIdle_RunningHarness): App_WaitForIdle_Returns {
  await vi.waitFor(() => {
    expect(runningHarness['scheduler'].getState()['running']).toBe(false);

    return;
  });

  return;
}

/**
 * App - Stop Harness.
 *
 * Closes the listener and any open event streams, lets waiting checks finish,
 * and closes the SQLite handle.
 *
 * @param {App_StopHarness_RunningHarness} runningHarness - Running harness.
 *
 * @returns {App_StopHarness_Returns}
 *
 * @since 1.0.0
 */
async function stopHarness(runningHarness: App_StopHarness_RunningHarness): App_StopHarness_Returns {
  const httpServer: App_StopHarness_HttpServer = runningHarness['httpServer'];

  httpServer.closeAllConnections();

  await new Promise((resolve) => {
    httpServer.close(() => {
      resolve(undefined);

      return;
    });

    return;
  });

  for (const release of runningHarness['cycle']['pending'].splice(0)) {
    release();
  }

  await waitForIdle(runningHarness);

  runningHarness['state'].close();

  return;
}

/**
 * App - Create Client.
 *
 * Makes a small fetch client that keeps cookies and sends the CSRF header
 * on changes, like the dashboard does.
 *
 * @param {App_CreateClient_BaseUrl}        baseUrl          - Base url.
 * @param {App_CreateClient_DefaultHeaders} [defaultHeaders] - Default headers.
 *
 * @returns {App_CreateClient_Returns}
 *
 * @since 1.0.0
 */
function createClient(baseUrl: App_CreateClient_BaseUrl, defaultHeaders: App_CreateClient_DefaultHeaders = {}): App_CreateClient_Returns {
  const cookies: App_CreateClient_Cookies = new Map();

  /**
   * App - Create Client - Request.
   *
   * Sends one request with the stored cookies, then keeps the cookies the
   * response sets and reads JSON bodies.
   *
   * @param {App_CreateClient_Request_Method}  method    - Method.
   * @param {App_CreateClient_Request_Path}    path      - Path.
   * @param {App_CreateClient_Request_Body}    [body]    - Body.
   * @param {App_CreateClient_Request_Headers} [headers] - Headers.
   *
   * @returns {App_CreateClient_Request_Returns}
   *
   * @since 1.0.0
   */
  const request: App_CreateClient_Request = async (method: App_CreateClient_Request_Method, path: App_CreateClient_Request_Path, body?: App_CreateClient_Request_Body, headers: App_CreateClient_Request_Headers = {}): App_CreateClient_Request_Returns => {
    const requestHeaders: App_CreateClient_Request_RequestHeaders = new Headers({
      ...defaultHeaders,
      ...headers,
    });

    if (cookies.size > 0) {
      requestHeaders.set('Cookie', [...cookies.entries()].map((cookie) => `${cookie[0]}=${cookie[1]}`).join('; '));
    }

    if (
      method !== 'GET'
      && cookies.has('outpost_csrf') === true
      && requestHeaders.has('X-CSRF-Token') === false
    ) {
      requestHeaders.set('X-CSRF-Token', cookies.get('outpost_csrf') ?? '');
    }

    if (body !== undefined) {
      requestHeaders.set('Content-Type', 'application/json');
    }

    const response: App_CreateClient_Request_Response = await fetch(`${baseUrl}${path}`, {
      ...((body === undefined) ? {} : { body: (typeof body === 'string') ? body : JSON.stringify(body) }),
      headers: requestHeaders,
      method,
      redirect: 'manual',
    });

    for (const setCookie of response.headers.getSetCookie()) {
      const pair: App_CreateClient_Request_Pair = setCookie.split(';')[0] ?? '';
      const name: App_CreateClient_Request_Name = pair.slice(0, pair.indexOf('='));
      const value: App_CreateClient_Request_Value = pair.slice(pair.indexOf('=') + 1);

      if (value === '') {
        cookies.delete(name);
      } else {
        cookies.set(name, value);
      }
    }

    const text: App_CreateClient_Request_Text = await response.text();

    return {
      body: (text !== '' && (response.headers.get('Content-Type') ?? '').includes('application/json') === true) ? JSON.parse(text) : text,
      headers: response.headers,
      status: response.status,
    };
  };

  return {
    cookies,
    request,
  };
}

/**
 * App - Claim.
 *
 * Creates the account through the setup endpoint with a fresh setup code,
 * which also signs the client in.
 *
 * @param {App_Claim_Client}         client         - Client.
 * @param {App_Claim_RunningHarness} runningHarness - Running harness.
 *
 * @returns {App_Claim_Returns}
 *
 * @since 1.0.0
 */
async function claim(client: App_Claim_Client, runningHarness: App_Claim_RunningHarness): App_Claim_Returns {
  const setupClaim: App_Claim_SetupClaim = runningHarness['state'].prepareSetupClaim();

  if (setupClaim === undefined) {
    throw new Error('The installation did not issue a setup code.');
  }

  return client.request('POST', '/api/v1/setup/claim', {
    claimCode: setupClaim['code'],
    password: 'fixture admin password',
    username: 'admin',
  });
}

/**
 * App - Create Token.
 *
 * Creates an access token straight in the state store and returns its raw
 * value with its details.
 *
 * @param {App_CreateToken_RunningHarness} runningHarness - Running harness.
 * @param {App_CreateToken_Name}           name           - Name.
 * @param {App_CreateToken_Scopes}         scopes         - Scopes.
 *
 * @returns {App_CreateToken_Returns}
 *
 * @since 1.0.0
 */
function createToken(runningHarness: App_CreateToken_RunningHarness, name: App_CreateToken_Name, scopes: App_CreateToken_Scopes): App_CreateToken_Returns {
  const token: App_CreateToken_Token = runningHarness['state'].createToken({
    name,
    scopes,
  });

  if (token === undefined) {
    throw new Error('The fixture token was not created.');
  }

  return token;
}

/**
 * App - Parse Events.
 *
 * Splits server-sent event text into its finished events, with each data line
 * read as JSON and each comment kept without its colon.
 *
 * @param {App_ParseEvents_Text} text - Text.
 *
 * @returns {App_ParseEvents_Returns}
 *
 * @since 1.0.0
 */
function parseEvents(text: App_ParseEvents_Text): App_ParseEvents_Returns {
  // Text after the last blank line belongs to an event still arriving, so it is left out.
  return text.split('\n\n').slice(0, -1).map((block) => {
    const serverSentEvent: App_ParseEvents_ServerSentEvent = {};

    for (const line of block.split('\n')) {
      const field: App_ParseEvents_Field = line.slice(0, line.indexOf(':'));
      const value: App_ParseEvents_Value = line.slice(line.indexOf(':') + 1).trim();

      if (field === '') {
        Reflect.set(serverSentEvent, 'comment', value);
      } else if (field === 'data') {
        Reflect.set(serverSentEvent, 'data', JSON.parse(value));
      } else {
        Reflect.set(serverSentEvent, field, value);
      }
    }

    return serverSentEvent;
  });
}

/**
 * App - Open Events.
 *
 * Opens the server-sent event stream with the given credentials and reads it
 * on demand.
 *
 * @param {App_OpenEvents_BaseUrl} baseUrl - Base url.
 * @param {App_OpenEvents_Headers} headers - Headers.
 *
 * @returns {App_OpenEvents_Returns}
 *
 * @since 1.0.0
 */
async function openEvents(baseUrl: App_OpenEvents_BaseUrl, headers: App_OpenEvents_Headers): App_OpenEvents_Returns {
  const controller: App_OpenEvents_Controller = new AbortController();
  const response: App_OpenEvents_Response = await fetch(`${baseUrl}/api/v1/events`, {
    headers,
    signal: controller.signal,
  });

  if (response.body === null) {
    throw new Error('The event stream has no body.');
  }

  const reader: App_OpenEvents_Reader = response.body.getReader();
  const decoder: App_OpenEvents_Decoder = new TextDecoder();
  const buffer: App_OpenEvents_Buffer = {
    closed: false,
    text: '',
  };

  /**
   * App - Open Events - Close.
   *
   * Aborts the request, which also ends the stream on the server.
   * Its listener and heartbeat stop when the connection closes.
   *
   * @returns {App_OpenEvents_Close_Returns}
   *
   * @since 1.0.0
   */
  const close: App_OpenEvents_Close = () => {
    controller.abort();

    return;
  };

  /**
   * App - Open Events - Read Until.
   *
   * Reads the stream until its finished events pass the check or the server
   * ends it, and returns every finished event so far.
   *
   * @param {App_OpenEvents_ReadUntil_Until} until - Until.
   *
   * @returns {App_OpenEvents_ReadUntil_Returns}
   *
   * @since 1.0.0
   */
  const readUntil: App_OpenEvents_ReadUntil = async (until: App_OpenEvents_ReadUntil_Until): App_OpenEvents_ReadUntil_Returns => {
    while (until(parseEvents(buffer['text'])) === false && buffer['closed'] === false) {
      const chunk: App_OpenEvents_ReadUntil_Chunk = await reader.read().catch(() => ({
        done: true,
        value: undefined,
      }));

      if (chunk['done'] === true) {
        Reflect.set(buffer, 'closed', true);
      } else {
        Reflect.set(buffer, 'text', `${buffer['text']}${decoder.decode(chunk['value'], { stream: true })}`);
      }
    }

    return {
      closed: buffer['closed'],
      events: parseEvents(buffer['text']),
    };
  };

  return {
    close,
    readUntil,
    response,
  };
}

/**
 * App - Encode Cbor Head.
 *
 * Encodes one CBOR major type and length the way authenticators do.
 * Lengths up to 65535 cover every value these tests encode.
 *
 * @param {App_EncodeCborHead_MajorType} majorType - Major type.
 * @param {App_EncodeCborHead_Length}    length    - Length.
 *
 * @returns {App_EncodeCborHead_Returns}
 *
 * @since 1.0.0
 */
function encodeCborHead(majorType: App_EncodeCborHead_MajorType, length: App_EncodeCborHead_Length): App_EncodeCborHead_Returns {
  if (length < 24) {
    return Buffer.from([(majorType * 32) + length]);
  }

  if (length < 256) {
    return Buffer.from([
      (majorType * 32) + 24,
      length,
    ]);
  }

  const head: App_EncodeCborHead_Head = Buffer.alloc(3);

  head.writeUInt8((majorType * 32) + 25, 0);

  head.writeUInt16BE(length, 1);

  return head;
}

/**
 * App - Encode Cbor.
 *
 * Encodes the small CBOR subset that attestation objects and COSE keys use:
 * integers, text, bytes, and maps.
 *
 * @param {App_EncodeCbor_Value} value - Value.
 *
 * @returns {App_EncodeCbor_Returns}
 *
 * @since 1.0.0
 */
function encodeCbor(value: App_EncodeCbor_Value): App_EncodeCbor_Returns {
  if (typeof value === 'number') {
    return (value >= 0) ? encodeCborHead(0, value) : encodeCborHead(1, -1 - value);
  }

  if (typeof value === 'string') {
    const bytes: App_EncodeCbor_Bytes = Buffer.from(value, 'utf8');

    return Buffer.concat([
      encodeCborHead(3, bytes.length),
      bytes,
    ]);
  }

  if (value instanceof Uint8Array) {
    return Buffer.concat([
      encodeCborHead(2, value.length),
      Buffer.from(value),
    ]);
  }

  const entries: App_EncodeCbor_Entries = [...value.entries()];

  return Buffer.concat([
    encodeCborHead(5, entries.length),
    ...entries.flatMap((entry) => [
      encodeCbor(entry[0]),
      encodeCbor(entry[1]),
    ]),
  ]);
}

/**
 * App - Create Authenticator Data.
 *
 * Builds the RP ID hash, flags, and counter that start every authenticator
 * response, with the new credential when one is attested.
 *
 * @param {App_CreateAuthenticatorData_RpId}      rpId       - Rp id.
 * @param {App_CreateAuthenticatorData_Flags}     flags      - Flags.
 * @param {App_CreateAuthenticatorData_SignCount} signCount  - Sign count.
 * @param {App_CreateAuthenticatorData_Attested}  [attested] - Attested.
 *
 * @returns {App_CreateAuthenticatorData_Returns}
 *
 * @since 1.0.0
 */
function createAuthenticatorData(rpId: App_CreateAuthenticatorData_RpId, flags: App_CreateAuthenticatorData_Flags, signCount: App_CreateAuthenticatorData_SignCount, attested?: App_CreateAuthenticatorData_Attested): App_CreateAuthenticatorData_Returns {
  const counter: App_CreateAuthenticatorData_Counter = Buffer.alloc(4);

  counter.writeUInt32BE(signCount, 0);

  return Buffer.concat([
    createHash('sha256').update(rpId).digest(),
    Buffer.from([flags]),
    counter,
    ...((attested === undefined) ? [] : [attested]),
  ]);
}

/**
 * App - Create Authenticator.
 *
 * Creates a software passkey with a P-256 key pair and a random credential ID.
 * Its user handle is filled in from the registration options.
 *
 * @returns {App_CreateAuthenticator_Returns}
 *
 * @since 1.0.0
 */
function createAuthenticator(): App_CreateAuthenticator_Returns {
  const keyPair: App_CreateAuthenticator_KeyPair = generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',
  });

  return {
    credentialId: randomBytes(16),
    keyPair,
    signCount: 0,
    userHandle: '',
  };
}

/**
 * App - Create Registration.
 *
 * Answers registration options the way a browser and a platform authenticator
 * would, with a "none" attestation.
 *
 * @param {App_CreateRegistration_Authenticator} authenticator - Authenticator.
 * @param {App_CreateRegistration_Options}       options       - Options.
 * @param {App_CreateRegistration_Origin}        origin        - Origin.
 *
 * @returns {App_CreateRegistration_Returns}
 *
 * @since 1.0.0
 */
function createRegistration(authenticator: App_CreateRegistration_Authenticator, options: App_CreateRegistration_Options, origin: App_CreateRegistration_Origin): App_CreateRegistration_Returns {
  const publicKey: App_CreateRegistration_PublicKey = authenticator['keyPair']['publicKey'].export({
    format: 'jwk',
  });
  const credentialIdLength: App_CreateRegistration_CredentialIdLength = Buffer.alloc(2);

  credentialIdLength.writeUInt16BE(authenticator['credentialId'].length, 0);

  const attested: App_CreateRegistration_Attested = Buffer.concat([
    Buffer.alloc(16),
    credentialIdLength,
    authenticator['credentialId'],
    encodeCbor(new Map<App_EncodeCbor_Value, App_EncodeCbor_Value>([
      [
        1,
        2,
      ],
      [
        3,
        -7,
      ],
      [
        -1,
        1,
      ],
      [
        -2,
        Buffer.from(publicKey['x'] ?? '', 'base64url'),
      ],
      [
        -3,
        Buffer.from(publicKey['y'] ?? '', 'base64url'),
      ],
    ])),
  ]);
  const authenticatorData: App_CreateRegistration_AuthenticatorData = createAuthenticatorData(String(Reflect.get(Object(options['rp']), 'id')), 69, authenticator['signCount'], attested);
  const attestationObject: App_CreateRegistration_AttestationObject = encodeCbor(new Map<App_EncodeCbor_Value, App_EncodeCbor_Value>([
    [
      'fmt',
      'none',
    ],
    [
      'attStmt',
      new Map(),
    ],
    [
      'authData',
      authenticatorData,
    ],
  ]));
  const clientData: App_CreateRegistration_ClientData = Buffer.from(JSON.stringify({
    challenge: options['challenge'],
    crossOrigin: false,
    origin,
    type: 'webauthn.create',
  }));

  return {
    authenticatorAttachment: 'platform',
    clientExtensionResults: {},
    id: authenticator['credentialId'].toString('base64url'),
    rawId: authenticator['credentialId'].toString('base64url'),
    response: {
      attestationObject: attestationObject.toString('base64url'),
      clientDataJSON: clientData.toString('base64url'),
      transports: ['internal'],
    },
    type: 'public-key',
  };
}

/**
 * App - Create Assertion.
 *
 * Signs authentication options the way a browser and a platform authenticator
 * would, for the RP ID and origin given.
 *
 * @param {App_CreateAssertion_Authenticator} authenticator - Authenticator.
 * @param {App_CreateAssertion_Options}       options       - Options.
 * @param {App_CreateAssertion_Origin}        origin        - Origin.
 * @param {App_CreateAssertion_RpId}          rpId          - Rp id.
 *
 * @returns {App_CreateAssertion_Returns}
 *
 * @since 1.0.0
 */
function createAssertion(authenticator: App_CreateAssertion_Authenticator, options: App_CreateAssertion_Options, origin: App_CreateAssertion_Origin, rpId: App_CreateAssertion_RpId): App_CreateAssertion_Returns {
  Reflect.set(authenticator, 'signCount', authenticator['signCount'] + 1);

  const authenticatorData: App_CreateAssertion_AuthenticatorData = createAuthenticatorData(rpId, 5, authenticator['signCount']);
  const clientData: App_CreateAssertion_ClientData = Buffer.from(JSON.stringify({
    challenge: options['challenge'],
    crossOrigin: false,
    origin,
    type: 'webauthn.get',
  }));
  const signature: App_CreateAssertion_Signature = sign('sha256', Buffer.concat([
    authenticatorData,
    createHash('sha256').update(clientData).digest(),
  ]), authenticator['keyPair']['privateKey']);

  return {
    authenticatorAttachment: 'platform',
    clientExtensionResults: {},
    id: authenticator['credentialId'].toString('base64url'),
    rawId: authenticator['credentialId'].toString('base64url'),
    response: {
      authenticatorData: authenticatorData.toString('base64url'),
      clientDataJSON: clientData.toString('base64url'),
      signature: signature.toString('base64url'),
      userHandle: authenticator['userHandle'],
    },
    type: 'public-key',
  };
}

// Each test gets a fresh data folder and a stand-in dashboard build, and the
// per-container lines a finished check prints stay out of the test output.
beforeEach(() => {
  baseDirectory = mkdtempSync(join(tmpdir(), 'outpost-app-'));

  mkdirSync(join(baseDirectory, 'web', 'assets'), {
    recursive: true,
  });

  writeFileSync(join(baseDirectory, 'web', 'index.html'), '<!doctype html><title>Outpost</title>');

  writeFileSync(join(baseDirectory, 'web', 'assets', 'app-1234.js'), 'console.log("dashboard");');

  vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

  return;
});

// The server a test started is stopped, and its folders removed, even when the test fails.
afterEach(async () => {
  if (harness !== undefined) {
    await stopHarness(harness);
  }

  harness = undefined;

  rmSync(baseDirectory, {
    force: true,
    recursive: true,
  });

  vi.restoreAllMocks();

  return;
});

/**
 * App - Setup And Sign-in.
 *
 * Checks first-run setup, CSRF on changes, the code step, the attempt limits,
 * sessions across restarts, and passkeys.
 *
 * @since 1.0.0
 */
describe('setup and sign-in', () => {
  it('claims the first account and checks CSRF', async () => {
    harness = await startHarness();

    const client: App_SetupAndSignIn_ClaimsTheFirstAccountAndChecksCsrf_Client = createClient(harness['baseUrl']);

    expect(await client.request('GET', '/api/v1/setup/status')).toEqual(expect.objectContaining({
      body: {
        claimRequired: true,
      },
      status: 200,
    }));

    expect(await client.request('POST', '/api/v1/setup/claim', {
      claimCode: 'AAAAA-BBBBB-CCCCC',
      password: 'fixture admin password',
      username: 'admin',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'claim_invalid',
          issues: [{
            field: 'claimCode',
            message: 'That setup code is wrong or expired. Restart the container to print a new one.',
            path: ['claimCode'],
          }],
          message: 'That setup code is wrong or expired. Restart the container to print a new one.',
        },
      },
      status: 401,
    }));

    expect(await client.request('POST', '/api/v1/setup/claim', {
      claimCode: ' ',
      password: 'short',
      role: 'owner',
      username: 'ab',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [
            {
              field: 'claimCode',
              message: 'Enter the setup code from the container log.',
              path: ['claimCode'],
            },
            {
              field: 'password',
              message: 'Use at least 12 characters.',
              path: ['password'],
            },
            {
              field: 'username',
              message: 'Use 3 to 64 letters, numbers, periods, underscores, or hyphens, starting with a letter or number.',
              path: ['username'],
            },
            {
              field: 'role',
              message: 'This field isn\'t accepted.',
              path: ['role'],
            },
          ],
          message: 'Enter the setup code from the container log.',
        },
      },
      status: 422,
    }));

    const claimed: App_SetupAndSignIn_ClaimsTheFirstAccountAndChecksCsrf_Claimed = await claim(client, harness);
    const setCookies: App_SetupAndSignIn_ClaimsTheFirstAccountAndChecksCsrf_SetCookies = claimed['headers'].getSetCookie();

    expect(claimed).toEqual(expect.objectContaining({
      body: {
        administrator: {
          id: expect.any(String),
          username: 'admin',
        },
        csrfToken: client['cookies'].get('outpost_csrf'),
        expiresAt: expect.any(String),
        status: 'authenticated',
      },
      status: 201,
    }));

    expect(client['cookies'].get('outpost_session')).toMatch(sessionTokenPattern);

    expect(client['cookies'].get('outpost_csrf')).toMatch(csrfTokenPattern);

    expect(setCookies).toHaveLength(2);

    expect(setCookies[0]).toContain(`outpost_session=${String(client['cookies'].get('outpost_session'))}; Path=/; SameSite=Strict; Max-Age=`);

    expect(setCookies[0]).toContain('; HttpOnly');

    expect(setCookies[1]).toContain(`outpost_csrf=${String(client['cookies'].get('outpost_csrf'))}; Path=/; SameSite=Strict; Max-Age=`);

    expect(setCookies[1]).not.toContain('HttpOnly');

    expect(setCookies.some((setCookie) => setCookie.includes('Secure'))).toBe(false);

    expect(await client.request('GET', '/api/v1/auth/me')).toEqual(expect.objectContaining({
      body: {
        administratorId: expect.any(String),
        authenticationType: 'session',
        id: expect.any(String),
        removedSecrets: [],
        username: 'admin',
      },
      status: 200,
    }));

    expect(await client.request('POST', '/api/v1/auth/tokens', {
      name: 'Home Assistant',
      scopes: ['status:read'],
    }, {
      'X-CSRF-Token': `opc_${'A'.repeat(32)}`,
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'csrf_invalid',
          message: 'The request CSRF token is missing or invalid.',
        },
      },
      status: 403,
    }));

    expect(await client.request('POST', '/api/v1/auth/tokens', {
      name: 'Home Assistant',
      scopes: ['status:read'],
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        plaintext: expect.stringMatching(personalAccessTokenPattern),
      }),
      status: 201,
    }));

    expect(await createClient(harness['baseUrl']).request('POST', '/api/v1/setup/claim', {
      claimCode: 'AAAAA-BBBBB-CCCCC',
      password: 'fixture admin password',
      username: 'intruder',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'claim_unavailable',
          message: 'Setup is already complete. Sign in instead.',
        },
      },
      status: 409,
    }));

    expect(await client.request('GET', '/api/v1/setup/status')).toEqual(expect.objectContaining({
      body: {
        claimRequired: false,
      },
    }));

    expect(await client.request('POST', '/api/v1/auth/logout')).toEqual(expect.objectContaining({
      status: 204,
    }));

    expect(client['cookies'].size).toBe(0);

    expect(await client.request('GET', '/api/v1/auth/me')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'authentication_required',
          message: 'Sign in to continue.',
        },
      },
      status: 401,
    }));

    return;
  });

  it('limits setup codes and refuses an expired one', async () => {
    const clock: App_SetupAndSignIn_LimitsSetupCodesAndRefusesAnExpiredOne_Clock = {
      value: 0,
    };

    harness = await startHarness({
      now: () => clock['value'],
    });

    const client: App_SetupAndSignIn_LimitsSetupCodesAndRefusesAnExpiredOne_Client = createClient(harness['baseUrl']);
    const setupClaim: App_SetupAndSignIn_LimitsSetupCodesAndRefusesAnExpiredOne_SetupClaim = harness['state'].prepareSetupClaim();

    if (setupClaim === undefined) {
      throw new Error('The installation did not issue a setup code.');
    }

    const guesses: App_SetupAndSignIn_LimitsSetupCodesAndRefusesAnExpiredOne_Guesses = await Promise.all(Array.from({ length: 10 }, async () => client.request('POST', '/api/v1/setup/claim', {
      claimCode: 'wrong code',
      password: 'fixture admin password',
      username: 'admin',
    })));

    expect(guesses.map((guess) => guess['status'])).toEqual(Array.from({ length: 10 }, () => 401));

    const limited: App_SetupAndSignIn_LimitsSetupCodesAndRefusesAnExpiredOne_Limited = await client.request('POST', '/api/v1/setup/claim', {
      claimCode: setupClaim['code'],
      password: 'fixture admin password',
      username: 'admin',
    });

    expect(limited).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'rate_limited',
          message: 'Too many setup attempts. Try again in 15 minutes.',
        },
      },
      status: 429,
    }));

    expect(limited['headers'].get('Retry-After')).toBe('900');

    expect(await client.request('POST', '/api/v1/auth/login', {
      password: 'fixture admin password',
      username: 'admin',
    })).toEqual(expect.objectContaining({
      status: 401,
    }));

    // The setup code lasts 30 minutes, and the failures leave the 15-minute window by then.
    Reflect.set(clock, 'value', 31 * 60 * 1000);

    expect(await client.request('POST', '/api/v1/setup/claim', {
      claimCode: setupClaim['code'],
      password: 'fixture admin password',
      username: 'admin',
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        error: expect.objectContaining({
          code: 'claim_invalid',
        }),
      }),
      status: 401,
    }));

    expect(harness['state'].hasAdministrator()).toBe(false);

    return;
  });

  it('asks for a second factor and limits failures', async () => {
    harness = await startHarness();

    const client: App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Client = createClient(harness['baseUrl'], {
      'X-Forwarded-For': '198.51.100.20',
    });

    await claim(client, harness);

    const setup: App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Setup = await client.request('POST', '/api/v1/auth/totp/setup', {
      password: 'fixture admin password',
    });
    const secret: App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Secret = String(Reflect.get(Object(setup['body']), 'secret'));

    expect(setup['body']).toEqual({
      expiresAt: expect.any(String),
      qrCode: expect.stringContaining('data:image/png;base64,'),
      secret: expect.any(String),
      uri: `otpauth://totp/Outpost:admin?secret=${secret}&issuer=Outpost&algorithm=SHA1&digits=6&period=30`,
    });

    expect(await client.request('POST', '/api/v1/auth/totp/enable', {
      code: '12345',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [{
            field: 'code',
            message: 'Enter the 6-digit code from your app.',
            path: ['code'],
          }],
          message: 'Enter the 6-digit code from your app.',
        },
      },
      status: 422,
    }));

    const enabled: App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Enabled = await client.request('POST', '/api/v1/auth/totp/enable', {
      code: generateCode(secret, Math.floor(Date.now() / 30000)),
    });
    const recoveryCodes: App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_RecoveryCodes = Reflect.get(Object(enabled['body']), 'recoveryCodes');

    expect(enabled['status']).toBe(200);

    expect(recoveryCodes).toHaveLength(10);

    expect(await client.request('POST', '/api/v1/auth/totp/setup', {
      password: 'fixture admin password',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'totp_enabled',
          message: 'The authenticator app is already on.',
        },
      },
      status: 409,
    }));

    await client.request('POST', '/api/v1/auth/logout');

    const passwordStep: App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_PasswordStep = await client.request('POST', '/api/v1/auth/login', {
      password: 'fixture admin password',
      username: 'admin',
    });

    expect(passwordStep).toEqual(expect.objectContaining({
      body: {
        challenge: expect.any(String),
        expiresAt: expect.any(String),
        status: 'second_factor_required',
      },
      status: 200,
    }));

    expect(client['cookies'].has('outpost_session')).toBe(false);

    expect(await client.request('POST', '/api/v1/auth/login/second-factor', {
      challenge: Reflect.get(Object(passwordStep['body']), 'challenge'),
      code: '',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [{
            field: 'code',
            message: 'Enter the code from your authenticator app, or a recovery code.',
            path: ['code'],
          }],
          message: 'Enter the code from your authenticator app, or a recovery code.',
        },
      },
      status: 422,
    }));

    expect(await client.request('POST', '/api/v1/auth/login/second-factor', {
      code: '123456',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'challenge_expired',
          message: 'Your sign-in timed out. Enter your password again.',
        },
      },
      status: 401,
    }));

    expect(await client.request('POST', '/api/v1/auth/login/second-factor', {
      challenge: Reflect.get(Object(passwordStep['body']), 'challenge'),
      code: '000000',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'code_invalid',
          issues: [{
            field: 'code',
            message: 'That code doesn\'t match. Try the current code, or a recovery code.',
            path: ['code'],
          }],
          message: 'That code doesn\'t match. Try the current code, or a recovery code.',
        },
      },
      status: 401,
    }));

    expect(await client.request('POST', '/api/v1/auth/login/second-factor', {
      challenge: Reflect.get(Object(passwordStep['body']), 'challenge'),
      code: String(Reflect.get(Object(recoveryCodes), 0)),
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        status: 'authenticated',
      }),
      status: 200,
    }));

    expect(await client.request('GET', '/api/v1/auth/security')).toEqual(expect.objectContaining({
      body: {
        hostname: '127.0.0.1',
        passkeys: [],
        passkeysAvailable: false,
        recoveryCodesRemaining: 9,
        totpEnabled: true,
        username: 'admin',
      },
      status: 200,
    }));

    const guesser: App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Guesser = createClient(harness['baseUrl'], {
      'X-Forwarded-For': '198.51.100.21',
    });
    const guessedStep: App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_GuessedStep = await guesser.request('POST', '/api/v1/auth/login', {
      password: 'fixture admin password',
      username: 'admin',
    });
    const guesses: App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Guesses = [];

    // Each wrong code depends on the count before it, so the guesses go one at a time.
    for (const guess of [
      '111111',
      '222222',
      '333333',
      '444444',
      '555555',
    ]) {
      guesses.push(await guesser.request('POST', '/api/v1/auth/login/second-factor', {
        challenge: Reflect.get(Object(guessedStep['body']), 'challenge'),
        code: guess,
      }));
    }

    expect(guesses.map((guess) => guess['body'])).toEqual([
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'code_invalid',
        }),
      }),
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'code_invalid',
        }),
      }),
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'code_invalid',
        }),
      }),
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'code_invalid',
        }),
      }),
      {
        error: {
          code: 'challenge_expired',
          message: 'Too many wrong codes. Enter your password again.',
        },
      },
    ]);

    const attacker: App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Attacker = createClient(harness['baseUrl'], {
      'X-Forwarded-For': '198.51.100.66',
    });
    const failedAttempts: App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_FailedAttempts = await Promise.all(Array.from({ length: 10 }, async () => attacker.request('POST', '/api/v1/auth/login', {
      password: 'wrong password guess',
      username: 'admin',
    })));

    expect(failedAttempts.map((failedAttempt) => failedAttempt['body'])).toEqual(Array.from({ length: 10 }, () => ({
      error: {
        code: 'credentials_invalid',
        message: 'The username or password is incorrect.',
      },
    })));

    const limited: App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Limited = await attacker.request('POST', '/api/v1/auth/login', {
      password: 'fixture admin password',
      username: 'admin',
    });

    expect(limited).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'rate_limited',
          message: 'Too many sign-in attempts. Try again in 15 minutes.',
        },
      },
      status: 429,
    }));

    expect(Number(limited['headers'].get('Retry-After'))).toBeGreaterThan(0);

    expect(await createClient(harness['baseUrl'], {
      'X-Forwarded-For': '198.51.100.67',
    }).request('POST', '/api/v1/auth/login', {
      password: 'fixture admin password',
      username: 'admin',
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        status: 'second_factor_required',
      }),
      status: 200,
    }));

    // IPv6 visitors share one limit per /56 network, whichever address in it they use.
    const baseUrl: App_CreateClient_BaseUrl = harness['baseUrl'];
    const ipv6Failures: App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_FailedAttempts = await Promise.all(Array.from({ length: 10 }, async (_value, index) => createClient(baseUrl, {
      'X-Forwarded-For': `2001:db8:1234:56${index.toString(16).padStart(2, '0')}::1`,
    }).request('POST', '/api/v1/auth/login', {
      password: 'wrong password guess',
      username: 'admin',
    })));

    expect(ipv6Failures.map((failedAttempt) => failedAttempt['body'])).toEqual(Array.from({ length: 10 }, () => ({
      error: {
        code: 'credentials_invalid',
        message: 'The username or password is incorrect.',
      },
    })));

    expect(await createClient(baseUrl, {
      'X-Forwarded-For': '2001:db8:1234:56ff::1',
    }).request('POST', '/api/v1/auth/login', {
      password: 'fixture admin password',
      username: 'admin',
    })).toEqual(expect.objectContaining({
      status: 429,
    }));

    expect(await createClient(baseUrl, {
      'X-Forwarded-For': '2001:db8:1234:5700::1',
    }).request('POST', '/api/v1/auth/login', {
      password: 'fixture admin password',
      username: 'admin',
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        status: 'second_factor_required',
      }),
      status: 200,
    }));

    return;
  });

  it('keeps a session across a restart', async () => {
    harness = await startHarness();

    const client: App_SetupAndSignIn_KeepsASessionAcrossARestart_Client = createClient(harness['baseUrl']);

    await claim(client, harness);

    await stopHarness(harness);

    harness = await startHarness();

    const restartedClient: App_SetupAndSignIn_KeepsASessionAcrossARestart_RestartedClient = createClient(harness['baseUrl']);

    for (const cookie of client['cookies']) {
      restartedClient['cookies'].set(cookie[0], cookie[1]);
    }

    expect(await restartedClient.request('GET', '/api/v1/auth/me')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        authenticationType: 'session',
        username: 'admin',
      }),
      status: 200,
    }));

    return;
  });

  it('signs in with a passkey only on its hostname', async () => {
    harness = await startHarness();

    const client: App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_Client = createClient(harness['baseUrl'], proxyHeaders);
    const authenticator: App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_Authenticator = createAuthenticator();

    await claim(client, harness);

    expect(await createClient(harness['baseUrl']).request('POST', '/api/v1/auth/passkeys/login/options')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'passkeys_unavailable',
          message: 'Passkeys need https and a domain name. Open this page at its domain, or use your password.',
        },
      },
      status: 409,
    }));

    const registrationOptions: App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_RegistrationOptions = await client.request('POST', '/api/v1/auth/passkeys/register/options', {
      name: 'MacBook',
      password: 'fixture admin password',
    });
    const creationOptions: App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_CreationOptions = Object(Reflect.get(Object(registrationOptions['body']), 'options'));

    Reflect.set(authenticator, 'userHandle', String(Reflect.get(Object(creationOptions['user']), 'id')));

    expect(creationOptions['rp']).toEqual({
      id: 'outpost.example.net',
      name: 'Outpost',
    });

    expect(await client.request('POST', '/api/v1/auth/passkeys/register/verify', {
      ceremonyId: Reflect.get(Object(registrationOptions['body']), 'ceremonyId'),
      credential: createRegistration(authenticator, creationOptions, 'https://outpost.example.net'),
    })).toEqual(expect.objectContaining({
      body: {
        createdAt: expect.any(String),
        hostname: 'outpost.example.net',
        id: authenticator['credentialId'].toString('base64url'),
        lastUsedAt: null,
        name: 'MacBook',
      },
      status: 201,
    }));

    await client.request('POST', '/api/v1/auth/logout');

    const signInOptions: App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_SignInOptions = await client.request('POST', '/api/v1/auth/passkeys/login/options');
    const requestOptions: App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_RequestOptions = Object(Reflect.get(Object(signInOptions['body']), 'options'));

    expect(await client.request('POST', '/api/v1/auth/passkeys/login/verify', {
      ceremonyId: Reflect.get(Object(signInOptions['body']), 'ceremonyId'),
      credential: createAssertion(authenticator, requestOptions, 'https://outpost.example.net', 'outpost.example.net'),
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        status: 'authenticated',
      }),
      status: 200,
    }));

    const otherHost: App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_OtherHost = createClient(harness['baseUrl'], {
      'X-Forwarded-Host': 'other.example.net',
      'X-Forwarded-Proto': 'https',
    });
    const otherOptions: App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_OtherOptions = await otherHost.request('POST', '/api/v1/auth/passkeys/login/options');

    expect(await otherHost.request('POST', '/api/v1/auth/passkeys/login/verify', {
      ceremonyId: Reflect.get(Object(otherOptions['body']), 'ceremonyId'),
      credential: createAssertion(authenticator, Object(Reflect.get(Object(otherOptions['body']), 'options')), 'https://other.example.net', 'outpost.example.net'),
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'passkey_rejected',
          message: 'That passkey wasn\'t accepted. It may belong to a different address for this app.',
        },
      },
      status: 401,
    }));

    expect(await otherHost.request('POST', '/api/v1/auth/passkeys/login/verify', {
      ceremonyId: 'A'.repeat(43),
      credential: createAssertion(authenticator, requestOptions, 'https://other.example.net', 'outpost.example.net'),
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'passkey_ceremony_invalid',
          message: 'That passkey request expired. Try again.',
        },
      },
      status: 409,
    }));

    return;
  });

  return;
});

/**
 * App - Account Security.
 *
 * Checks the password and username changes, which need the current password,
 * that other browsers sign out after a password change, and the notice about
 * secrets a lost key removed.
 *
 * @since 1.0.0
 */
describe('account security', () => {
  it('changes the password and username', async () => {
    harness = await startHarness();

    const client: App_AccountSecurity_ChangesThePasswordAndUsername_Client = createClient(harness['baseUrl']);
    const otherBrowser: App_AccountSecurity_ChangesThePasswordAndUsername_OtherBrowser = createClient(harness['baseUrl']);

    await claim(client, harness);

    expect((await otherBrowser.request('POST', '/api/v1/auth/login', {
      password: 'fixture admin password',
      username: 'admin',
    }))['status']).toBe(200);

    expect(await client.request('POST', '/api/v1/auth/password', {
      currentPassword: 'not the password',
      newPassword: 'a different long passphrase',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'password_incorrect',
          issues: [{
            field: 'currentPassword',
            message: 'That password is incorrect.',
            path: ['currentPassword'],
          }],
          message: 'That password is incorrect.',
        },
      },
      status: 422,
    }));

    expect(await client.request('POST', '/api/v1/auth/password', {
      currentPassword: '',
      newPassword: 'short',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [
            {
              field: 'currentPassword',
              message: 'Enter your current password.',
              path: ['currentPassword'],
            },
            {
              field: 'newPassword',
              message: 'Use at least 12 characters.',
              path: ['newPassword'],
            },
          ],
          message: 'Enter your current password.',
        },
      },
      status: 422,
    }));

    expect(await client.request('POST', '/api/v1/auth/password', {
      currentPassword: 'fixture admin password',
      newPassword: 'a different long passphrase',
    })).toEqual(expect.objectContaining({
      status: 204,
    }));

    expect((await client.request('GET', '/api/v1/auth/me'))['status']).toBe(200);

    expect((await otherBrowser.request('GET', '/api/v1/auth/me'))['status']).toBe(401);

    expect(await client.request('POST', '/api/v1/auth/username', {
      password: 'a different long passphrase',
      username: '-bad name',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [{
            field: 'username',
            message: 'Use 3 to 64 letters, numbers, periods, underscores, or hyphens, starting with a letter or number.',
            path: ['username'],
          }],
          message: 'Use 3 to 64 letters, numbers, periods, underscores, or hyphens, starting with a letter or number.',
        },
      },
      status: 422,
    }));

    expect(await client.request('POST', '/api/v1/auth/username', {
      username: 'jacky',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [{
            field: 'password',
            message: 'Enter your password.',
            path: ['password'],
          }],
          message: 'Enter your password.',
        },
      },
      status: 422,
    }));

    expect(await client.request('POST', '/api/v1/auth/username', {
      password: 'a different long passphrase',
      username: 'jacky',
    })).toEqual(expect.objectContaining({
      body: {
        administrator: {
          id: expect.any(String),
          username: 'jacky',
        },
      },
      status: 200,
    }));

    expect(await client.request('GET', '/api/v1/auth/me')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        username: 'jacky',
      }),
    }));

    expect(await client.request('DELETE', '/api/v1/auth/passkeys/not%20a%20passkey', {
      password: 'a different long passphrase',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'passkey_not_found',
          message: 'That passkey no longer exists.',
        },
      },
      status: 404,
    }));

    expect(await client.request('POST', '/api/v1/auth/recovery-codes', {
      password: 'a different long passphrase',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'totp_disabled',
          message: 'Turn on the authenticator app first.',
        },
      },
      status: 409,
    }));

    expect(await client.request('POST', '/api/v1/auth/totp/disable', {
      password: 'a different long passphrase',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'totp_disabled',
          message: 'The authenticator app is already off.',
        },
      },
      status: 409,
    }));

    expect(await client.request('POST', '/api/v1/auth/totp/enable', {
      code: '123456',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'totp_setup_expired',
          message: 'Authenticator setup expired. Start again.',
        },
      },
      status: 409,
    }));

    return;
  });

  it('lists what a lost key removed until it is dismissed', async () => {
    harness = await startHarness();

    const client: App_AccountSecurity_ListsWhatALostKeyRemovedUntilItIsDismissed_Client = createClient(harness['baseUrl']);

    await claim(client, harness);

    const administrator: App_AccountSecurity_ListsWhatALostKeyRemovedUntilItIsDismissed_Administrator = harness['state'].getAdministrator();

    if (administrator === undefined) {
      throw new Error('The setup code did not create the account.');
    }

    harness['state'].enableTotp(administrator['id'], generateTotpSecret(), 1);

    await stopHarness(harness);

    rmSync(join(baseDirectory, 'data', 'keys', 'installation.key'));

    const stderr: App_AccountSecurity_ListsWhatALostKeyRemovedUntilItIsDismissed_Stderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    harness = await startHarness();

    stderr.mockRestore();

    const restartedClient: App_AccountSecurity_ListsWhatALostKeyRemovedUntilItIsDismissed_RestartedClient = createClient(harness['baseUrl']);

    for (const cookie of client['cookies']) {
      restartedClient['cookies'].set(cookie[0], cookie[1]);
    }

    expect(await restartedClient.request('GET', '/api/v1/auth/me')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        removedSecrets: [{
          kind: 'authenticator',
          removedAt: expect.any(String),
        }],
      }),
      status: 200,
    }));

    expect(await restartedClient.request('DELETE', '/api/v1/auth/removed-secrets', undefined, {
      'X-CSRF-Token': `opc_${'A'.repeat(32)}`,
    })).toEqual(expect.objectContaining({
      status: 403,
    }));

    expect(await restartedClient.request('DELETE', '/api/v1/auth/removed-secrets')).toEqual(expect.objectContaining({
      status: 204,
    }));

    expect(await restartedClient.request('GET', '/api/v1/auth/me')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        removedSecrets: [],
      }),
      status: 200,
    }));

    return;
  });
  return;
});

/**
 * App - Tokens.
 *
 * Checks the shared token model: names, sorted scopes, an optional expiry,
 * edits that keep the value, and revocation.
 *
 * @since 1.0.0
 */
describe('tokens', () => {
  it('creates, edits, and revokes named tokens', async () => {
    harness = await startHarness();

    const client: App_Tokens_CreatesEditsAndRevokesNamedTokens_Client = createClient(harness['baseUrl']);

    await claim(client, harness);

    expect(await client.request('POST', '/api/v1/auth/tokens', {
      name: '   ',
      scopes: [],
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [
            {
              field: 'name',
              message: 'Name this token.',
              path: ['name'],
            },
            {
              field: 'scopes',
              message: 'Choose at least one scope.',
              path: ['scopes'],
            },
          ],
          message: 'Name this token.',
        },
      },
      status: 422,
    }));

    const created: App_Tokens_CreatesEditsAndRevokesNamedTokens_Created = await client.request('POST', '/api/v1/auth/tokens', {
      name: '  Home Assistant  ',
      scopes: [
        'updates:run',
        'status:read',
      ],
    });

    expect(created).toEqual(expect.objectContaining({
      body: {
        plaintext: expect.stringMatching(personalAccessTokenPattern),
        token: {
          createdAt: expect.any(String),
          expiresAt: null,
          id: expect.stringMatching(personalAccessTokenIdPattern),
          lastUsedAt: null,
          name: 'Home Assistant',
          scopes: [
            'status:read',
            'updates:run',
          ],
        },
      },
      status: 201,
    }));

    const tokenId: App_Tokens_CreatesEditsAndRevokesNamedTokens_TokenId = String(Reflect.get(Object(Reflect.get(Object(created['body']), 'token')), 'id'));

    expect(await client.request('POST', '/api/v1/auth/tokens', {
      expiresAt: null,
      name: 'Prometheus',
      scopes: ['metrics:read'],
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        token: expect.objectContaining({
          expiresAt: null,
        }),
      }),
      status: 201,
    }));

    expect(await client.request('POST', '/api/v1/auth/tokens', {
      name: 'HOME ASSISTANT',
      scopes: ['status:read'],
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'token_exists',
          issues: [{
            field: 'name',
            message: 'A token with this name already exists.',
            path: ['name'],
          }],
          message: 'A token with this name already exists.',
        },
      },
      status: 409,
    }));

    expect(await client.request('POST', '/api/v1/auth/tokens', {
      expiresAt: '2099-01-31',
      expiresInDays: 30,
      name: 'x'.repeat(81),
      scopes: [
        'containers:write',
        'containers:write',
      ],
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [
            {
              field: 'expiresAt',
              message: 'Use an ISO 8601 date and time with a time zone, like 2030-01-01T00:00:00Z.',
              path: ['expiresAt'],
            },
            {
              field: 'name',
              message: 'Use 80 characters or fewer.',
              path: ['name'],
            },
            {
              field: 'scopes.0',
              message: 'Choose from: metrics:read, status:read, updates:run.',
              path: [
                'scopes',
                '0',
              ],
            },
            {
              field: 'scopes.1',
              message: 'Choose from: metrics:read, status:read, updates:run.',
              path: [
                'scopes',
                '1',
              ],
            },
            {
              field: 'expiresInDays',
              message: 'This field isn\'t accepted.',
              path: ['expiresInDays'],
            },
          ],
          message: 'Use an ISO 8601 date and time with a time zone, like 2030-01-01T00:00:00Z.',
        },
      },
      status: 422,
    }));

    expect(await client.request('POST', '/api/v1/auth/tokens', {
      expiresAt: '2020-01-01T00:00:00Z',
      name: 'Old script',
      scopes: [
        'status:read',
        'status:read',
      ],
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [
            {
              field: 'expiresAt',
              message: 'Choose an expiration date in the future.',
              path: ['expiresAt'],
            },
            {
              field: 'scopes',
              message: 'Choose each scope only once.',
              path: ['scopes'],
            },
          ],
          message: 'Choose an expiration date in the future.',
        },
      },
      status: 422,
    }));

    expect(await client.request('PUT', `/api/v1/auth/tokens/${tokenId}`, {
      name: 'prometheus',
      scopes: ['status:read'],
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        error: expect.objectContaining({
          code: 'token_exists',
        }),
      }),
      status: 409,
    }));

    expect(await client.request('PUT', `/api/v1/auth/tokens/${tokenId}`, {
      expiresAt: '2099-01-01T00:00:00.000Z',
      name: 'home assistant',
      scopes: ['updates:run'],
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        expiresAt: '2099-01-01T00:00:00.000Z',
        id: tokenId,
        name: 'home assistant',
        scopes: ['updates:run'],
      }),
      status: 200,
    }));

    expect(await client.request('PUT', `/api/v1/auth/tokens/${tokenId}`, {
      name: 'Home Assistant',
      scopes: ['updates:run'],
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        expiresAt: '2099-01-01T00:00:00.000Z',
        name: 'Home Assistant',
      }),
      status: 200,
    }));

    expect(await client.request('PUT', `/api/v1/auth/tokens/${tokenId}`, {
      expiresAt: null,
      name: 'Home Assistant',
      scopes: ['updates:run'],
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        expiresAt: null,
      }),
      status: 200,
    }));

    expect(await client.request('GET', '/api/v1/auth/tokens')).toEqual(expect.objectContaining({
      body: {
        items: [
          expect.objectContaining({
            name: 'Prometheus',
          }),
          expect.objectContaining({
            id: tokenId,
            name: 'Home Assistant',
          }),
        ],
      },
      status: 200,
    }));

    expect(await client.request('DELETE', `/api/v1/auth/tokens/${tokenId}`)).toEqual(expect.objectContaining({
      status: 204,
    }));

    for (const missingTokenId of [
      tokenId,
      'Not A Token',
    ]) {
      expect(await client.request('PUT', `/api/v1/auth/tokens/${encodeURIComponent(missingTokenId)}`, {
        name: 'Home Assistant',
        scopes: ['status:read'],
      })).toEqual(expect.objectContaining({
        body: {
          error: {
            code: 'token_not_found',
            message: 'That token no longer exists.',
          },
        },
        status: 404,
      }));

      expect(await client.request('DELETE', `/api/v1/auth/tokens/${encodeURIComponent(missingTokenId)}`)).toEqual(expect.objectContaining({
        status: 404,
      }));
    }

    return;
  });

  return;
});

/**
 * App - Dashboard API.
 *
 * Checks Outpost's data routes with a session and with each scope, one check
 * at a time, Docker failures, and the event stream.
 *
 * @since 1.0.0
 */
describe('dashboard API', () => {
  it('serves data to sessions and status tokens', async () => {
    harness = await startHarness();

    const client: App_DashboardApi_ServesDataToSessionsAndStatusTokens_Client = createClient(harness['baseUrl']);
    const reader: App_DashboardApi_ServesDataToSessionsAndStatusTokens_Reader = createToken(harness, 'Home Assistant', ['status:read']);
    const runner: App_DashboardApi_ServesDataToSessionsAndStatusTokens_Runner = createToken(harness, 'Automation', ['updates:run']);
    const anonymous: App_DashboardApi_ServesDataToSessionsAndStatusTokens_Anonymous = createClient(harness['baseUrl']);

    await claim(client, harness);

    for (const path of [
      '/api/v1/overview',
      '/api/v1/containers',
      '/api/v1/history',
      '/api/v1/settings',
      '/api/v1/status',
    ]) {
      expect((await client.request('GET', path))['status']).toBe(200);

      expect((await createClient(harness['baseUrl'], {
        Authorization: `Bearer ${reader['personalAccessToken']}`,
      }).request('GET', path))['status']).toBe(200);

      expect(await createClient(harness['baseUrl'], {
        Authorization: `Bearer ${runner['personalAccessToken']}`,
      }).request('GET', path)).toEqual(expect.objectContaining({
        body: {
          error: {
            code: 'scope_required',
            message: 'This token doesn\'t have the status:read scope.',
          },
        },
        status: 403,
      }));

      expect(await anonymous.request('GET', path)).toEqual(expect.objectContaining({
        body: {
          error: {
            code: 'authentication_required',
            message: 'Sign in, or send a valid API token.',
          },
        },
        status: 401,
      }));
    }

    expect(await createClient(harness['baseUrl'], {
      Authorization: `Bearer outpost_${'A'.repeat(43)}`,
    }).request('GET', '/api/v1/overview')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'authentication_required',
          message: 'Sign in, or send a valid API token.',
        },
      },
      status: 401,
    }));

    expect(await client.request('GET', '/api/v1/overview')).toEqual(expect.objectContaining({
      body: {
        labelMode: 'opt-out',
        monitorOnly: false,
        running: false,
        schedule: '0 0 4 * * *',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        totals: {
          cycles: 0,
          failed: 0,
          updated: 0,
        },
      },
      status: 200,
    }));

    expect(await client.request('GET', '/api/v1/status')).toEqual(expect.objectContaining({
      body: {
        running: false,
        totals: {
          cycles: 0,
          failed: 0,
          updated: 0,
        },
      },
    }));

    expect(await client.request('GET', '/api/v1/containers')).toEqual(expect.objectContaining({
      body: {
        items: [
          {
            id: 'bbbbbbbbbbbb',
            image: 'postgres:17',
            managed: false,
            monitorOnly: false,
            name: 'db',
            note: 'Opted out by label',
            self: false,
            state: 'running',
          },
          {
            id: 'aaaaaaaaaaaa',
            image: 'nginx:1',
            managed: true,
            monitorOnly: false,
            name: 'web',
            note: 'Managed',
            self: false,
            state: 'running',
          },
        ],
      },
    }));

    expect(await client.request('GET', '/api/v1/history')).toEqual(expect.objectContaining({
      body: {
        items: [],
      },
    }));

    const settings: App_DashboardApi_ServesDataToSessionsAndStatusTokens_Settings = await client.request('GET', '/api/v1/settings');

    expect(settings['body']).toEqual({
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
        dataDirectory: expect.any(String),
        dockerHost: 'unix:///var/run/docker.sock',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    });

    const updatedSettings: App_DashboardApi_ServesDataToSessionsAndStatusTokens_UpdatedSettings = await client.request('PUT', '/api/v1/settings', {
      cleanup: false,
      healthTimeoutSeconds: 240,
      labelMode: 'opt-in',
      monitorOnly: true,
      runOnStart: true,
      schedule: '0 15 2 * * *',
      settleSeconds: 20,
      stopTimeoutSeconds: 45,
    });

    expect(updatedSettings).toEqual(expect.objectContaining({
      body: {
        runtime: {
          cleanup: false,
          healthTimeoutSeconds: 240,
          labelMode: 'opt-in',
          monitorOnly: true,
          runOnStart: true,
          schedule: '0 15 2 * * *',
          settleSeconds: 20,
          stopTimeoutSeconds: 45,
        },
        system: expect.any(Object),
      },
      status: 200,
    }));

    expect(await client.request('GET', '/api/v1/overview')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        labelMode: 'opt-in',
        monitorOnly: true,
        schedule: '0 15 2 * * *',
      }),
    }));

    expect(await createClient(harness['baseUrl'], {
      Authorization: `Bearer ${reader['personalAccessToken']}`,
    }).request('PUT', '/api/v1/settings', updatedSettings['body'])).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'session_required',
          message: 'An administrator browser session is required.',
        },
      },
      status: 403,
    }));

    expect(await client.request('PUT', '/api/v1/settings', {
      cleanup: false,
      healthTimeoutSeconds: 240,
      labelMode: 'opt-in',
      monitorOnly: true,
      runOnStart: true,
      schedule: 'not a cron expression',
      settleSeconds: 20,
      stopTimeoutSeconds: 45,
    })).toEqual(expect.objectContaining({
      body: {
        error: expect.objectContaining({
          code: 'invalid_request',
          issues: expect.arrayContaining([expect.objectContaining({ field: 'schedule' })]),
        }),
      },
      status: 422,
    }));

    expect(await createClient(harness['baseUrl'], {
      Authorization: `Bearer ${reader['personalAccessToken']}`,
    }).request('GET', '/api/v1/auth/me')).toEqual(expect.objectContaining({
      body: {
        authenticationType: 'token',
        id: reader['token']['id'],
        name: 'Home Assistant',
        scopes: ['status:read'],
      },
      status: 200,
    }));

    expect(await createClient(harness['baseUrl'], {
      Authorization: `Bearer ${reader['personalAccessToken']}`,
    }).request('GET', '/api/v1/auth/tokens')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'session_required',
          message: 'An administrator browser session is required.',
        },
      },
      status: 403,
    }));

    expect(await createClient(harness['baseUrl'], {
      Authorization: `Bearer ${reader['personalAccessToken']}`,
    }).request('DELETE', '/api/v1/auth/removed-secrets')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'session_required',
          message: 'An administrator browser session is required.',
        },
      },
      status: 403,
    }));

    return;
  });

  it('runs one check at a time', async () => {
    harness = await startHarness();

    const client: App_DashboardApi_RunsOneCheckAtATime_Client = createClient(harness['baseUrl']);
    const reader: App_DashboardApi_RunsOneCheckAtATime_Reader = createToken(harness, 'Home Assistant', ['status:read']);
    const runner: App_DashboardApi_RunsOneCheckAtATime_Runner = createToken(harness, 'Automation', ['updates:run']);
    const automation: App_DashboardApi_RunsOneCheckAtATime_Automation = createClient(harness['baseUrl'], {
      Authorization: `Bearer ${runner['personalAccessToken']}`,
    });

    await claim(client, harness);

    expect(await client.request('POST', '/api/v1/checks', {}, {
      'X-CSRF-Token': '',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'csrf_invalid',
          message: 'The request CSRF token is missing or invalid.',
        },
      },
      status: 403,
    }));

    expect(await client.request('POST', '/api/v1/checks', {
      containerId: 'web',
      force: true,
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [
            {
              field: 'containerId',
              message: 'Use a container ID of 12 to 64 hexadecimal characters.',
              path: ['containerId'],
            },
            {
              field: 'force',
              message: 'This field isn\'t accepted.',
              path: ['force'],
            },
          ],
          message: 'Use a container ID of 12 to 64 hexadecimal characters.',
        },
      },
      status: 422,
    }));

    expect(await createClient(harness['baseUrl'], {
      Authorization: `Bearer ${reader['personalAccessToken']}`,
    }).request('POST', '/api/v1/checks')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'scope_required',
          message: 'This token doesn\'t have the updates:run scope.',
        },
      },
      status: 403,
    }));

    expect(harness['cycle']['calls']).toEqual([]);

    expect(await client.request('POST', '/api/v1/checks', {
      containerId: 'aaaaaaaaaaaa',
    })).toEqual(expect.objectContaining({
      body: {
        started: true,
      },
      status: 202,
    }));

    expect(harness['cycle']['calls']).toEqual([['aaaaaaaaaaaa']]);

    expect(await client.request('GET', '/api/v1/overview')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        running: true,
        startedAt: expect.any(String),
      }),
    }));

    expect(await automation.request('POST', '/api/v1/checks')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'check_running',
          message: 'A check is already running.',
        },
      },
      status: 409,
    }));

    releaseCycle(harness);

    await waitForIdle(harness);

    expect(await automation.request('POST', '/api/v1/checks')).toEqual(expect.objectContaining({
      body: {
        started: true,
      },
      status: 202,
    }));

    expect(harness['cycle']['calls']).toEqual([
      ['aaaaaaaaaaaa'],
      undefined,
    ]);

    releaseCycle(harness);

    await waitForIdle(harness);

    expect(await client.request('GET', '/api/v1/history')).toEqual(expect.objectContaining({
      body: {
        items: [
          {
            finishedAt: '2026-10-25T04:00:05.000Z',
            results: [{
              container: 'web',
              detail: 'sha256:1',
              image: 'nginx:1',
              status: 'up-to-date',
            }],
            startedAt: '2026-10-25T04:00:00.000Z',
            trigger: 'api',
          },
          expect.objectContaining({
            trigger: 'dashboard',
          }),
        ],
      },
    }));

    expect(await client.request('GET', '/api/v1/containers')).toEqual(expect.objectContaining({
      body: {
        items: expect.arrayContaining([expect.objectContaining({
          lastCheckedAt: '2026-10-25T04:00:05.000Z',
          lastDetail: 'sha256:1',
          lastStatus: 'up-to-date',
          name: 'web',
        })]),
      },
    }));

    return;
  });

  it('reports Docker failures', async () => {
    harness = await startHarness();

    const client: App_DashboardApi_ReportsDockerFailures_Client = createClient(harness['baseUrl']);

    await claim(client, harness);

    Reflect.set(harness['docker'], 'failing', true);

    vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    expect(await client.request('GET', '/api/v1/containers')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'docker_unreachable',
          message: 'Outpost can\'t reach Docker. Check that the Docker socket is mounted.',
        },
      },
      status: 502,
    }));

    return;
  });

  it('streams the state and each finished check', async () => {
    harness = await startHarness();

    const client: App_DashboardApi_StreamsTheStateAndEachFinishedCheck_Client = createClient(harness['baseUrl']);

    await claim(client, harness);

    expect(await createClient(harness['baseUrl']).request('GET', '/api/v1/events')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'authentication_required',
          message: 'Sign in, or send a valid API token.',
        },
      },
      status: 401,
    }));

    const events: App_DashboardApi_StreamsTheStateAndEachFinishedCheck_Events = await openEvents(harness['baseUrl'], {
      Cookie: [...client['cookies'].entries()].map((cookie) => `${cookie[0]}=${cookie[1]}`).join('; '),
    });

    expect(events['response']['status']).toBe(200);

    expect(events['response'].headers.get('Content-Type')).toBe('text/event-stream; charset=utf-8');

    expect(events['response'].headers.get('Cache-Control')).toBe('no-store');

    const opened: App_DashboardApi_StreamsTheStateAndEachFinishedCheck_Opened = await events.readUntil((received) => received.length >= 2);

    expect(opened['events'].slice(0, 2)).toEqual([
      {
        retry: '3000',
      },
      {
        data: {
          labelMode: 'opt-out',
          monitorOnly: false,
          running: false,
          schedule: '0 0 4 * * *',
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          totals: {
            cycles: 0,
            failed: 0,
            updated: 0,
          },
        },
        event: 'state',
      },
    ]);

    expect((await events.readUntil((received) => received.some((event) => event['comment'] === 'keep-alive')))['closed']).toBe(false);

    expect((await client.request('POST', '/api/v1/checks'))['status']).toBe(202);

    expect((await events.readUntil((received) => received.some((event) => Reflect.get(Object(event['data']), 'running') === true)))['closed']).toBe(false);

    releaseCycle(harness);

    const finished: App_DashboardApi_StreamsTheStateAndEachFinishedCheck_Finished = await events.readUntil((received) => received.some((event) => Reflect.get(Object(Reflect.get(Object(event['data']), 'totals')), 'cycles') === 1));
    const namedEvents: App_DashboardApi_StreamsTheStateAndEachFinishedCheck_NamedEvents = finished['events'].filter((event) => event['event'] !== undefined);

    expect(namedEvents.slice(-2)).toEqual([
      {
        data: {
          finishedAt: '2026-10-25T04:00:05.000Z',
          results: [{
            container: 'web',
            detail: 'sha256:1',
            image: 'nginx:1',
            status: 'up-to-date',
          }],
          startedAt: '2026-10-25T04:00:00.000Z',
          trigger: 'dashboard',
        },
        event: 'check',
      },
      {
        data: expect.objectContaining({
          lastReport: expect.objectContaining({
            trigger: 'dashboard',
          }),
          running: false,
          totals: {
            cycles: 1,
            failed: 0,
            updated: 0,
          },
        }),
        event: 'state',
      },
    ]);

    events.close();

    return;
  });

  it('ends streams for revoked callers', async () => {
    harness = await startHarness();

    const client: App_DashboardApi_EndsStreamsForRevokedCallers_Client = createClient(harness['baseUrl']);
    const reader: App_DashboardApi_EndsStreamsForRevokedCallers_Reader = createToken(harness, 'Home Assistant', ['status:read']);

    await claim(client, harness);

    const tokenEvents: App_DashboardApi_EndsStreamsForRevokedCallers_TokenEvents = await openEvents(harness['baseUrl'], {
      Authorization: `Bearer ${reader['personalAccessToken']}`,
    });
    const sessionEvents: App_DashboardApi_EndsStreamsForRevokedCallers_SessionEvents = await openEvents(harness['baseUrl'], {
      Cookie: [...client['cookies'].entries()].map((cookie) => `${cookie[0]}=${cookie[1]}`).join('; '),
    });

    expect((await tokenEvents.readUntil((received) => received.length >= 2))['closed']).toBe(false);

    expect((await sessionEvents.readUntil((received) => received.length >= 2))['closed']).toBe(false);

    expect(harness['state'].removeToken(reader['token']['id'])).toBe('removed');

    expect((await tokenEvents.readUntil(() => false))['closed']).toBe(true);

    expect((await client.request('POST', '/api/v1/auth/logout'))['status']).toBe(204);

    expect((await sessionEvents.readUntil(() => false))['closed']).toBe(true);

    return;
  });

  return;
});

/**
 * App - Notifications.
 *
 * Covers adding, editing, testing, and removing destinations from a browser session.
 * Secrets never come back from the API, and tokens can't reach these routes.
 *
 * @since 1.0.0
 */
describe('notifications', () => {
  it('adds, edits, tests, and removes destinations', async () => {
    harness = await startHarness();

    notificationMocks['send'].mockReset().mockResolvedValue({
      delivered: false,
      message: 'HTTP 401',
    });

    const client: App_Notifications_AddsEditsTestsAndRemovesDestinations_Client = createClient(harness['baseUrl']);

    await claim(client, harness);

    const events: App_Notifications_AddsEditsTestsAndRemovesDestinations_Events = await client.request('GET', '/api/v1/notifications/events');

    expect(Reflect.get(Object(events['body']), 'items')).toEqual([
      expect.objectContaining({ key: 'secrets-removed' }),
      expect.objectContaining({ key: 'sign-in-locked' }),
      expect.objectContaining({
        defaultEnabled: true,
        key: 'updates-applied',
        label: 'Containers updated',
      }),
      expect.objectContaining({
        description: 'Monitor-only containers have new images.',
        key: 'updates-available',
      }),
      expect.objectContaining({ key: 'update-failed' }),
    ]);

    expect(await client.request('POST', '/api/v1/notifications', {
      events: ['update-failed'],
      name: 'Homelab chat',
      service: 'telegram',
      settings: { chatId: '-1002468013579' },
    })).toEqual(expect.objectContaining({
      body: {
        error: expect.objectContaining({
          code: 'invalid_request',
          message: 'Enter the bot token.',
        }),
      },
      status: 422,
    }));

    const created: App_Notifications_AddsEditsTestsAndRemovesDestinations_Created = await client.request('POST', '/api/v1/notifications', {
      events: [
        'updates-applied',
        'update-failed',
      ],
      name: 'Homelab chat',
      service: 'telegram',
      settings: {
        botToken: '123456:telegram-secret',
        chatId: '-1002468013579',
      },
    });
    const notificationId: App_Notifications_AddsEditsTestsAndRemovesDestinations_NotificationId = String(Reflect.get(Object(created['body']), 'id'));

    expect(created).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        name: 'Homelab chat',
        secrets: { botToken: true },
        secretsMissing: [],
        settings: { chatId: '-1002468013579' },
      }),
      status: 201,
    }));

    expect(JSON.stringify(created['body']).includes('telegram-secret')).toBe(false);

    expect(await client.request('POST', '/api/v1/notifications', {
      events: ['update-failed'],
      name: 'HOMELAB CHAT',
      service: 'ntfy',
      settings: { url: 'https://ntfy.sh/outpost-updates' },
    })).toEqual(expect.objectContaining({
      body: {
        error: expect.objectContaining({ code: 'notification_exists' }),
      },
      status: 409,
    }));

    expect(await client.request('PUT', `/api/v1/notifications/${notificationId}`, {
      events: ['update-failed'],
      name: 'Homelab chat',
      settings: {
        botToken: '',
        chatId: '-1009876543210',
      },
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        events: ['update-failed'],
        secrets: { botToken: true },
      }),
      status: 200,
    }));

    expect(await client.request('POST', `/api/v1/notifications/${notificationId}/test`)).toEqual(expect.objectContaining({
      body: {
        delivered: false,
        message: 'HTTP 401',
      },
      status: 200,
    }));

    expect(notificationMocks['send']).toHaveBeenLastCalledWith(expect.objectContaining({ key: 'outpost' }), {
      secrets: { botToken: '123456:telegram-secret' },
      service: 'telegram',
      settings: { chatId: '-1009876543210' },
    }, expect.objectContaining({ event: 'test' }));

    const token: App_Notifications_AddsEditsTestsAndRemovesDestinations_Token = createToken(harness, 'Automation', ['status:read']);

    expect(await createClient(harness['baseUrl'], {
      Authorization: `Bearer ${token['personalAccessToken']}`,
    }).request('GET', '/api/v1/notifications')).toEqual(expect.objectContaining({
      body: {
        error: expect.objectContaining({ code: 'session_required' }),
      },
      status: 403,
    }));

    expect((await client.request('DELETE', `/api/v1/notifications/${notificationId}`))['status']).toBe(204);

    expect(await client.request('GET', '/api/v1/notifications')).toEqual(expect.objectContaining({
      body: { items: [] },
      status: 200,
    }));

    return;
  });

  it('clears saved optional secrets explicitly', async () => {
    harness = await startHarness();

    notificationMocks['send'].mockReset().mockResolvedValue({ delivered: true });

    const client: App_Notifications_ClearsSavedOptionalSecretsExplicitly_Client = createClient(harness['baseUrl']);

    await claim(client, harness);

    const created: App_Notifications_ClearsSavedOptionalSecretsExplicitly_Created = await client.request('POST', '/api/v1/notifications', {
      events: ['update-failed'],
      name: 'Phone',
      service: 'ntfy',
      settings: {
        token: 'ntfy-secret',
        url: 'https://ntfy.sh/outpost-updates',
      },
    });
    const notificationId: App_Notifications_ClearsSavedOptionalSecretsExplicitly_NotificationId = String(Reflect.get(Object(created['body']), 'id'));

    expect(await client.request('PUT', `/api/v1/notifications/${notificationId}`, {
      clearSecrets: ['token'],
      events: ['update-failed'],
      name: 'Phone',
      settings: {
        token: 'new-secret',
        url: 'https://ntfy.sh/outpost-updates',
      },
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        error: expect.objectContaining({
          issues: [expect.objectContaining({
            field: 'settings.token',
            message: 'Enter a new value or clear this field, not both.',
          })],
        }),
      }),
      status: 422,
    }));

    expect(await client.request('PUT', `/api/v1/notifications/${notificationId}`, {
      clearSecrets: ['token'],
      events: ['update-failed'],
      name: 'Phone',
      settings: {
        token: '',
        url: 'https://ntfy.sh/outpost-updates',
      },
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        secrets: {},
        secretsMissing: [],
      }),
      status: 200,
    }));

    // Once it's gone there's nothing left to clear.
    expect(await client.request('PUT', `/api/v1/notifications/${notificationId}`, {
      clearSecrets: ['token'],
      events: ['update-failed'],
      name: 'Phone',
      settings: {
        token: '',
        url: 'https://ntfy.sh/outpost-updates',
      },
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        error: expect.objectContaining({
          issues: [expect.objectContaining({
            field: 'clearSecrets.0',
            message: 'Choose an optional saved secret.',
          })],
        }),
      }),
      status: 422,
    }));

    expect((await client.request('POST', `/api/v1/notifications/${notificationId}/test`))['status']).toBe(200);

    expect(notificationMocks['send']).toHaveBeenLastCalledWith(expect.anything(), {
      secrets: {},
      service: 'ntfy',
      settings: { url: 'https://ntfy.sh/outpost-updates' },
    }, expect.objectContaining({ event: 'test' }));

    return;
  });

  return;
});

/**
 * App - Registries.
 *
 * Covers adding, editing, and removing private registry sign-ins from a browser session.
 * Passwords never come back from the API, and tokens can't reach these routes.
 *
 * @since 1.0.0
 */
describe('registries', () => {
  it('adds, edits, and removes registry sign-ins', async () => {
    harness = await startHarness();

    const client: App_Registries_AddsEditsAndRemovesRegistrySignIns_Client = createClient(harness['baseUrl']);

    await claim(client, harness);

    expect(await client.request('POST', '/api/v1/registries', {
      registry: 'https://not a host/v2/',
      token: 'ghp_example',
      username: '   ',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [
            {
              field: 'password',
              message: 'Enter a password or access token.',
              path: ['password'],
            },
            {
              field: 'registry',
              message: 'Use a host name with an optional port, like registry.example.com:5000.',
              path: ['registry'],
            },
            {
              field: 'username',
              message: 'Enter a username.',
              path: ['username'],
            },
            {
              field: 'token',
              message: 'This field isn\'t accepted.',
              path: ['token'],
            },
          ],
          message: 'Enter a password or access token.',
        },
      },
      status: 422,
    }));

    const created: App_Registries_AddsEditsAndRemovesRegistrySignIns_Created = await client.request('POST', '/api/v1/registries', {
      password: 'dckr_pat_example',
      registry: '  https://index.docker.io/v1/  ',
      username: '  outpost  ',
    });
    const registryId: App_Registries_AddsEditsAndRemovesRegistrySignIns_RegistryId = String(Reflect.get(Object(created['body']), 'id'));

    expect(created).toEqual(expect.objectContaining({
      body: {
        createdAt: expect.any(String),
        id: expect.stringMatching(registryIdPattern),
        passwordMissing: false,
        registry: 'docker.io',
        updatedAt: expect.any(String),
        username: 'outpost',
      },
      status: 201,
    }));

    expect(JSON.stringify(created['body']).includes('dckr_pat_example')).toBe(false);

    // Docker Hub images name their registry registry-1.docker.io, which finds the docker.io sign-in.
    expect(harness['state'].findRegistryCredentials('registry-1.docker.io')).toEqual({
      password: 'dckr_pat_example',
      username: 'outpost',
    });

    expect(await client.request('POST', '/api/v1/registries', {
      password: 'dckr_pat_other',
      registry: 'registry-1.docker.io',
      username: 'someone',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'registry_exists',
          issues: [{
            field: 'registry',
            message: 'A sign-in for this registry already exists.',
            path: ['registry'],
          }],
          message: 'A sign-in for this registry already exists.',
        },
      },
      status: 409,
    }));

    const ghcr: App_Registries_AddsEditsAndRemovesRegistrySignIns_Ghcr = await client.request('POST', '/api/v1/registries', {
      password: 'ghp_example',
      registry: 'GHCR.io',
      username: 'cbnventures-bot',
    });
    const ghcrId: App_Registries_AddsEditsAndRemovesRegistrySignIns_GhcrId = String(Reflect.get(Object(ghcr['body']), 'id'));

    expect(await client.request('PUT', `/api/v1/registries/${registryId}`, {
      registry: 'docker.io',
      username: 'outpost-bot',
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        id: registryId,
        passwordMissing: false,
        registry: 'docker.io',
        username: 'outpost-bot',
      }),
      status: 200,
    }));

    expect(harness['state'].findRegistryCredentials('docker.io')).toEqual({
      password: 'dckr_pat_example',
      username: 'outpost-bot',
    });

    expect((await client.request('PUT', `/api/v1/registries/${registryId}`, {
      password: 'dckr_pat_rotated',
      registry: 'docker.io',
      username: 'outpost-bot',
    }))['status']).toBe(200);

    expect(harness['state'].findRegistryCredentials('index.docker.io')).toEqual({
      password: 'dckr_pat_rotated',
      username: 'outpost-bot',
    });

    expect(await client.request('PUT', `/api/v1/registries/${registryId}`, {
      password: '',
      registry: 'ghcr.io',
      username: 'outpost-bot',
    })).toEqual(expect.objectContaining({
      body: {
        error: expect.objectContaining({
          code: 'invalid_request',
          issues: [expect.objectContaining({
            field: 'password',
            message: 'Enter a password or access token.',
          })],
        }),
      },
      status: 422,
    }));

    expect(await client.request('PUT', `/api/v1/registries/${registryId}`, {
      registry: 'ghcr.io',
      username: 'outpost-bot',
    })).toEqual(expect.objectContaining({
      body: {
        error: expect.objectContaining({ code: 'registry_exists' }),
      },
      status: 409,
    }));

    expect(await client.request('GET', '/api/v1/registries')).toEqual(expect.objectContaining({
      body: {
        items: [
          expect.objectContaining({
            id: registryId,
            registry: 'docker.io',
          }),
          expect.objectContaining({
            id: ghcrId,
            registry: 'ghcr.io',
          }),
        ],
      },
      status: 200,
    }));

    const token: App_Registries_AddsEditsAndRemovesRegistrySignIns_Token = createToken(harness, 'Automation', [
      'status:read',
      'updates:run',
    ]);
    const automation: App_Registries_AddsEditsAndRemovesRegistrySignIns_Automation = createClient(harness['baseUrl'], {
      Authorization: `Bearer ${token['personalAccessToken']}`,
    });

    expect(await automation.request('GET', '/api/v1/registries')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'session_required',
          message: 'An administrator browser session is required.',
        },
      },
      status: 403,
    }));

    expect((await automation.request('DELETE', `/api/v1/registries/${registryId}`))['status']).toBe(403);

    expect(await client.request('DELETE', `/api/v1/registries/${registryId}`, undefined, {
      'X-CSRF-Token': `opc_${'A'.repeat(32)}`,
    })).toEqual(expect.objectContaining({
      status: 403,
    }));

    expect((await client.request('DELETE', `/api/v1/registries/${registryId}`))['status']).toBe(204);

    expect(harness['state'].findRegistryCredentials('registry-1.docker.io')).toBeUndefined();

    for (const missingRegistryId of [
      registryId,
      'Not A Registry',
    ]) {
      expect(await client.request('PUT', `/api/v1/registries/${encodeURIComponent(missingRegistryId)}`, {
        registry: 'docker.io',
        username: 'outpost',
      })).toEqual(expect.objectContaining({
        body: {
          error: {
            code: 'registry_not_found',
            message: 'That registry sign-in no longer exists.',
          },
        },
        status: 404,
      }));

      expect((await client.request('DELETE', `/api/v1/registries/${encodeURIComponent(missingRegistryId)}`))['status']).toBe(404);
    }

    expect(await client.request('GET', '/api/v1/registries')).toEqual(expect.objectContaining({
      body: {
        items: [expect.objectContaining({ id: ghcrId })],
      },
      status: 200,
    }));

    return;
  });

  it('asks again for a password a lost key removed', async () => {
    harness = await startHarness();

    const client: App_Registries_AsksAgainForAPasswordALostKeyRemoved_Client = createClient(harness['baseUrl']);

    await claim(client, harness);

    const created: App_Registries_AsksAgainForAPasswordALostKeyRemoved_Created = await client.request('POST', '/api/v1/registries', {
      password: 'ghp_example',
      registry: 'ghcr.io',
      username: 'cbnventures-bot',
    });
    const registryId: App_Registries_AsksAgainForAPasswordALostKeyRemoved_RegistryId = String(Reflect.get(Object(created['body']), 'id'));

    await stopHarness(harness);

    rmSync(join(baseDirectory, 'data', 'keys', 'installation.key'));

    const stderr: App_Registries_AsksAgainForAPasswordALostKeyRemoved_Stderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    harness = await startHarness();

    expect(stderr).toHaveBeenCalledWith(expect.stringContaining('were removed: the ghcr.io registry sign-in.'));

    stderr.mockRestore();

    const restartedClient: App_Registries_AsksAgainForAPasswordALostKeyRemoved_RestartedClient = createClient(harness['baseUrl']);

    for (const cookie of client['cookies']) {
      restartedClient['cookies'].set(cookie[0], cookie[1]);
    }

    expect(await restartedClient.request('GET', '/api/v1/auth/me')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        removedSecrets: [{
          kind: 'registry',
          name: 'ghcr.io',
          registryId,
          removedAt: expect.any(String),
        }],
      }),
      status: 200,
    }));

    expect(await restartedClient.request('GET', '/api/v1/registries')).toEqual(expect.objectContaining({
      body: {
        items: [expect.objectContaining({
          id: registryId,
          passwordMissing: true,
          registry: 'ghcr.io',
          username: 'cbnventures-bot',
        })],
      },
      status: 200,
    }));

    // Until the password is entered again, checks reach the registry without a sign-in.
    expect(harness['state'].findRegistryCredentials('ghcr.io')).toBeUndefined();

    expect(await restartedClient.request('PUT', `/api/v1/registries/${registryId}`, {
      password: 'ghp_rotated',
      registry: 'ghcr.io',
      username: 'cbnventures-bot',
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        passwordMissing: false,
      }),
      status: 200,
    }));

    expect(await restartedClient.request('GET', '/api/v1/auth/me')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        removedSecrets: [],
      }),
      status: 200,
    }));

    expect(harness['state'].findRegistryCredentials('ghcr.io')).toEqual({
      password: 'ghp_rotated',
      username: 'cbnventures-bot',
    });

    return;
  });

  return;
});

/**
 * App - Watchtower-style Endpoints.
 *
 * Checks that the update, status, and metrics endpoints keep their bodies and
 * take only a token with the matching scope.
 *
 * @since 1.0.0
 */
describe('Watchtower-style endpoints', () => {
  it('needs a token with the matching scope', async () => {
    harness = await startHarness();

    const client: App_WatchtowerStyleEndpoints_NeedsATokenWithTheMatchingScope_Client = createClient(harness['baseUrl']);
    const reader: App_WatchtowerStyleEndpoints_NeedsATokenWithTheMatchingScope_Reader = createToken(harness, 'Home Assistant', ['status:read']);
    const runner: App_WatchtowerStyleEndpoints_NeedsATokenWithTheMatchingScope_Runner = createToken(harness, 'Automation', ['updates:run']);
    const scraper: App_WatchtowerStyleEndpoints_NeedsATokenWithTheMatchingScope_Scraper = createToken(harness, 'Prometheus', ['metrics:read']);

    await claim(client, harness);

    for (const route of [
      {
        method: 'POST',
        path: '/v1/update',
        scope: 'updates:run',
      },
      {
        method: 'GET',
        path: '/v1/status',
        scope: 'status:read',
      },
      {
        method: 'GET',
        path: '/metrics',
        scope: 'metrics:read',
      },
    ]) {
      const wrongToken: App_WatchtowerStyleEndpoints_NeedsATokenWithTheMatchingScope_WrongToken = (route['scope'] === 'metrics:read') ? reader['personalAccessToken'] : scraper['personalAccessToken'];

      expect(await createClient(harness['baseUrl']).request(route['method'], route['path'])).toEqual(expect.objectContaining({
        body: {
          error: {
            code: 'authentication_required',
            message: 'A valid personal access token is required.',
          },
        },
        status: 401,
      }));

      expect((await client.request(route['method'], route['path']))['status']).toBe(401);

      expect(await createClient(harness['baseUrl'], {
        Authorization: `Bearer ${wrongToken}`,
      }).request(route['method'], route['path'])).toEqual(expect.objectContaining({
        body: {
          error: {
            code: 'scope_required',
            message: `This token doesn't have the ${route['scope']} scope.`,
          },
        },
        status: 403,
      }));
    }

    expect(await createClient(harness['baseUrl'], {
      Authorization: `Bearer ${reader['personalAccessToken']}`,
    }).request('GET', '/v1/status')).toEqual(expect.objectContaining({
      body: {
        running: false,
        totals: {
          cycles: 0,
          failed: 0,
          updated: 0,
        },
      },
      status: 200,
    }));

    const metrics: App_WatchtowerStyleEndpoints_NeedsATokenWithTheMatchingScope_Metrics = await createClient(harness['baseUrl'], {
      Authorization: `Bearer ${scraper['personalAccessToken']}`,
    }).request('GET', '/metrics');

    expect(metrics['status']).toBe(200);

    expect(metrics['headers'].get('Content-Type')).toBe('text/plain; charset=utf-8; version=0.0.4');

    expect(metrics['body']).toContain('outpost_cycles_total 0');

    expect(await createClient(harness['baseUrl'], {
      Authorization: `Bearer ${runner['personalAccessToken']}`,
    }).request('POST', '/v1/update')).toEqual(expect.objectContaining({
      body: {
        started: true,
      },
      status: 202,
    }));

    expect(await createClient(harness['baseUrl'], {
      Authorization: `Bearer ${runner['personalAccessToken']}`,
    }).request('POST', '/v1/update')).toEqual(expect.objectContaining({
      body: {
        started: false,
      },
      status: 409,
    }));

    releaseCycle(harness);

    await waitForIdle(harness);

    expect(harness['history'].list()[0]).toEqual(expect.objectContaining({
      trigger: 'api',
    }));

    return;
  });

  return;
});

/**
 * App - Proxy Trust.
 *
 * Checks that forwarded headers count only from loopback and private senders,
 * and that a trusted proxy's scheme makes the cookies Secure.
 *
 * @since 1.0.0
 */
describe('proxy trust', () => {
  it('trusts forwarded headers only from private senders', async () => {
    harness = await startHarness();

    const proxied: App_ProxyTrust_TrustsForwardedHeadersOnlyFromPrivateSenders_Proxied = createClient(harness['baseUrl'], {
      'X-Forwarded-For': '203.0.113.5',
      'X-Forwarded-Proto': 'https',
    });
    const trustProxy: App_ProxyTrust_TrustsForwardedHeadersOnlyFromPrivateSenders_TrustProxy = createApp({
      config: loadConfig({}),
      history: harness['history'],
      inspectContainer: async () => Promise.reject(new Error('No container should be inspected.')),
      listContainers: async () => [],
      scheduler: harness['scheduler'],
      state: harness['state'],
    }).get('trust proxy fn');

    for (const address of [
      '127.0.0.1',
      '10.0.0.2',
      '172.18.0.2',
      '192.168.1.1',
      '::1',
      'fd00::2',
    ]) {
      expect(trustProxy(address, 0)).toBe(true);
    }

    for (const address of [
      '203.0.113.10',
      '8.8.8.8',
      '2001:db8::1',
    ]) {
      expect(trustProxy(address, 0)).toBe(false);
    }

    const claimed: App_ProxyTrust_TrustsForwardedHeadersOnlyFromPrivateSenders_Claimed = await claim(proxied, harness);

    expect(claimed['headers'].getSetCookie().map((setCookie) => setCookie.endsWith('; Secure'))).toEqual([
      true,
      true,
    ]);

    const failedAttempts: App_ProxyTrust_TrustsForwardedHeadersOnlyFromPrivateSenders_FailedAttempts = await Promise.all(Array.from({ length: 10 }, async () => proxied.request('POST', '/api/v1/auth/login', {
      password: 'wrong password guess',
      username: 'admin',
    })));

    expect(failedAttempts.map((failedAttempt) => failedAttempt['status'])).toEqual(Array.from({ length: 10 }, () => 401));

    expect((await proxied.request('POST', '/api/v1/auth/login', {
      password: 'fixture admin password',
      username: 'admin',
    }))['status']).toBe(429);

    expect((await createClient(harness['baseUrl']).request('POST', '/api/v1/auth/login', {
      password: 'fixture admin password',
      username: 'admin',
    }))['status']).toBe(200);

    return;
  });

  return;
});

/**
 * App - Errors And The Dashboard Page.
 *
 * Checks the shared error envelope for malformed requests and unknown paths,
 * then the dashboard page, its headers, caching, and the root redirect.
 *
 * @since 1.0.0
 */
describe('errors and the dashboard page', () => {
  it('answers malformed requests with the error envelope', async () => {
    harness = await startHarness();

    const client: App_ErrorsAndTheDashboardPage_AnswersMalformedRequestsWithTheErrorEnvelope_Client = createClient(harness['baseUrl']);

    expect(await client.request('POST', '/api/v1/auth/login', '{"username":')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_json',
          message: 'The request body is not valid JSON.',
        },
      },
      status: 400,
    }));

    expect(await client.request('POST', '/api/v1/auth/login', {
      password: 'x'.repeat(70000),
      username: 'admin',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'payload_too_large',
          message: 'The request body is larger than 64 KB.',
        },
      },
      status: 413,
    }));

    expect(await client.request('POST', '/api/v1/auth/login', {
      password: 'fixture admin password',
      remember: true,
      username: 'admin',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [{
            field: 'remember',
            message: 'This field isn\'t accepted.',
            path: ['remember'],
          }],
          message: 'This field isn\'t accepted.',
        },
      },
      status: 422,
    }));

    expect(await client.request('POST', '/api/v1/auth/login', {})).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [
            {
              field: 'password',
              message: 'Enter your password.',
              path: ['password'],
            },
            {
              field: 'username',
              message: 'Enter your username.',
              path: ['username'],
            },
          ],
          message: 'Enter your password.',
        },
      },
      status: 422,
    }));

    expect(await client.request('POST', '/api/v1/auth/login', {
      password: 'x'.repeat(1025),
      username: 'admin',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'credentials_invalid',
          message: 'The username or password is incorrect.',
        },
      },
      status: 401,
    }));

    expect(await client.request('GET', '/api/v1/unknown')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'not_found',
          message: 'No route matches this request.',
        },
      },
      status: 404,
    }));

    expect(await client.request('GET', '/admin/assets/missing.js')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'not_found',
          message: 'No route matches this request.',
        },
      },
      status: 404,
    }));

    await Promise.all(Array.from({ length: 120 }, async () => client.request('GET', '/api/v1/setup/status')));

    const limited: App_ErrorsAndTheDashboardPage_AnswersMalformedRequestsWithTheErrorEnvelope_Limited = await client.request('GET', '/api/v1/setup/status');

    expect(limited).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'rate_limited',
          message: 'Too many requests. Wait a minute and try again.',
        },
      },
      status: 429,
    }));

    expect(Number(limited['headers'].get('Retry-After'))).toBeGreaterThan(0);

    return;
  });

  it('serves the page for every dashboard path', async () => {
    harness = await startHarness();

    const client: App_ErrorsAndTheDashboardPage_ServesThePageForEveryDashboardPath_Client = createClient(harness['baseUrl']);
    const page: App_ErrorsAndTheDashboardPage_ServesThePageForEveryDashboardPath_Page = await client.request('GET', '/admin/tokens');
    const oldApi: App_ErrorsAndTheDashboardPage_ServesThePageForEveryDashboardPath_OldApi = await client.request('GET', '/admin/api/overview');
    const asset: App_ErrorsAndTheDashboardPage_ServesThePageForEveryDashboardPath_Asset = await client.request('GET', '/admin/assets/app-1234.js');
    const root: App_ErrorsAndTheDashboardPage_ServesThePageForEveryDashboardPath_Root = await client.request('GET', '/', undefined, {
      Accept: 'text/html',
    });

    expect(page['status']).toBe(200);

    expect(page['body']).toContain('<title>Outpost</title>');

    expect(page['headers'].get('Content-Security-Policy')).toContain('script-src \'self\'');

    expect(page['headers'].get('X-Frame-Options')).toBe('DENY');

    expect(page['headers'].get('Cache-Control')).toBe('no-store');

    expect(oldApi['body']).toContain('<title>Outpost</title>');

    expect(asset['status']).toBe(200);

    expect(asset['headers'].get('Cache-Control')).toBe('public, max-age=31536000, immutable');

    expect(root['status']).toBe(302);

    expect(root['headers'].get('Location')).toBe('/admin/');

    expect(await client.request('GET', '/', undefined, {
      Accept: 'application/json',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'not_found',
          message: 'No route matches this request.',
        },
      },
      status: 404,
    }));

    expect(await client.request('GET', '/health')).toEqual(expect.objectContaining({
      body: {
        status: 'ok',
      },
      status: 200,
    }));

    return;
  });

  it('reports a missing dashboard build', async () => {
    harness = await startHarness({
      webRoot: join(baseDirectory, 'missing'),
    });

    expect(await createClient(harness['baseUrl']).request('GET', '/admin/')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'console_not_built',
          message: 'The dashboard isn\'t built. Run npm run build:web in apps/server.',
        },
      },
      status: 404,
    }));

    return;
  });

  return;
});
