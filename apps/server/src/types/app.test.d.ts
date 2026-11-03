import type { JsonWebKey, KeyPairKeyObjectResult } from 'node:crypto';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { ReadableStreamDefaultReader } from 'node:stream/web';
import type { TextDecoder } from 'node:util';

import type { DockerContainerInspect, DockerContainerSummary } from 'outpost-package-docker-engine';
import type { Mock, MockInstance } from 'vitest';

import type { Runner as History } from '../history.js';
import type { Runner as State } from '../lib/state.js';
import type { Runner as Scheduler } from '../scheduler.js';
import type {
  Lib_Notifications_App,
  Lib_Notifications_Notification,
  Lib_Notifications_Result,
  Lib_Notifications_Target,
} from './lib/notifications.d.ts';
import type { Lib_State_Runner_GetAdministrator_Returns } from './lib/state.d.ts';
import type { Shared_PersonalAccessTokenScopes, Shared_PersonalAccessTokenSummary } from './shared.d.ts';

/**
 * App.
 *
 * @since 1.0.0
 */
export type App_Container = DockerContainerSummary;

export type App_Containers = App_Container[];

export type App_ContainerInspect = DockerContainerInspect;

export type App_ContainerInspects = App_ContainerInspect[];

export type App_ProxyHeaders = Record<string, string>;

export type App_BaseDirectory = string;

export type App_Harness = App_StartHarness_Returns_Harness | undefined;

/**
 * App - Start Harness.
 *
 * @since 1.0.0
 */
export type App_StartHarness_Options_Now = () => number;

export type App_StartHarness_Options_WebRoot = string;

export type App_StartHarness_Options = {
  now?: App_StartHarness_Options_Now;
  webRoot?: App_StartHarness_Options_WebRoot;
};

export type App_StartHarness_Returns_BaseUrl = string;

export type App_StartHarness_Returns_Harness = {
  baseUrl: App_StartHarness_Returns_BaseUrl;
  cycle: App_StartHarness_Cycle;
  docker: App_StartHarness_Docker;
  history: App_StartHarness_History;
  httpServer: App_StartHarness_HttpServer;
  scheduler: App_StartHarness_Scheduler;
  state: App_StartHarness_State;
};

export type App_StartHarness_Returns = Promise<App_StartHarness_Returns_Harness>;

export type App_StartHarness_DataDirectory = string;

export type App_StartHarness_State = State;

export type App_StartHarness_History = History;

export type App_StartHarness_Docker_Failing = boolean;

export type App_StartHarness_Docker = {
  failing: App_StartHarness_Docker_Failing;
};

export type App_StartHarness_Cycle_Call = string[] | undefined;

export type App_StartHarness_Cycle_Calls = App_StartHarness_Cycle_Call[];

export type App_StartHarness_Cycle_Release = () => void;

export type App_StartHarness_Cycle_Pending = App_StartHarness_Cycle_Release[];

export type App_StartHarness_Cycle = {
  calls: App_StartHarness_Cycle_Calls;
  pending: App_StartHarness_Cycle_Pending;
};

export type App_StartHarness_Scheduler = Scheduler;

export type App_StartHarness_HttpServer = Server;

export type App_StartHarness_Inspected = DockerContainerInspect | undefined;

export type App_StartHarness_Address = AddressInfo | string | null;

/**
 * App - Release Cycle.
 *
 * @since 1.0.0
 */
export type App_ReleaseCycle_RunningHarness = App_StartHarness_Returns_Harness;

export type App_ReleaseCycle_Returns = void;

export type App_ReleaseCycle_Release = App_StartHarness_Cycle_Release | undefined;

/**
 * App - Wait For Idle.
 *
 * @since 1.0.0
 */
export type App_WaitForIdle_RunningHarness = App_StartHarness_Returns_Harness;

export type App_WaitForIdle_Returns = Promise<void>;

/**
 * App - Stop Harness.
 *
 * @since 1.0.0
 */
export type App_StopHarness_RunningHarness = App_StartHarness_Returns_Harness;

export type App_StopHarness_Returns = Promise<void>;

export type App_StopHarness_HttpServer = Server;

/**
 * App - Create Client.
 *
 * @since 1.0.0
 */
export type App_CreateClient_BaseUrl = string;

export type App_CreateClient_DefaultHeaders = Record<string, string>;

export type App_CreateClient_Cookies = Map<string, string>;

export type App_CreateClient_Returns_Client = {
  cookies: App_CreateClient_Cookies;
  request: App_CreateClient_Request;
};

export type App_CreateClient_Returns = App_CreateClient_Returns_Client;

/**
 * App - Create Client - Request.
 *
 * @since 1.0.0
 */
export type App_CreateClient_Request_Method = string;

export type App_CreateClient_Request_Path = string;

export type App_CreateClient_Request_Body = unknown;

export type App_CreateClient_Request_Headers = Record<string, string>;

export type App_CreateClient_Request_Returns_Body = unknown;

export type App_CreateClient_Request_Returns_Headers = Headers;

export type App_CreateClient_Request_Returns_Status = number;

export type App_CreateClient_Request_Returns_Response = {
  body: App_CreateClient_Request_Returns_Body;
  headers: App_CreateClient_Request_Returns_Headers;
  status: App_CreateClient_Request_Returns_Status;
};

export type App_CreateClient_Request_Returns = Promise<App_CreateClient_Request_Returns_Response>;

export type App_CreateClient_Request = (method: App_CreateClient_Request_Method, path: App_CreateClient_Request_Path, body?: App_CreateClient_Request_Body, headers?: App_CreateClient_Request_Headers) => App_CreateClient_Request_Returns;

export type App_CreateClient_Request_RequestHeaders = Headers;

export type App_CreateClient_Request_Response = Response;

export type App_CreateClient_Request_Pair = string;

export type App_CreateClient_Request_Name = string;

export type App_CreateClient_Request_Value = string;

export type App_CreateClient_Request_Text = string;

/**
 * App - Claim.
 *
 * @since 1.0.0
 */
export type App_Claim_Client = App_CreateClient_Returns_Client;

export type App_Claim_RunningHarness = App_StartHarness_Returns_Harness;

export type App_Claim_Returns = App_CreateClient_Request_Returns;

export type App_Claim_SetupClaim_Code = string;

export type App_Claim_SetupClaim_ExpiresAt = string;

export type App_Claim_SetupClaim = {
  code: App_Claim_SetupClaim_Code;
  expiresAt: App_Claim_SetupClaim_ExpiresAt;
} | undefined;

/**
 * App - Create Token.
 *
 * @since 1.0.0
 */
export type App_CreateToken_RunningHarness = App_StartHarness_Returns_Harness;

export type App_CreateToken_Name = string;

export type App_CreateToken_Scopes = Shared_PersonalAccessTokenScopes;

export type App_CreateToken_Returns_PersonalAccessToken = string;

export type App_CreateToken_Returns_Token = Shared_PersonalAccessTokenSummary;

export type App_CreateToken_Returns_Created = {
  personalAccessToken: App_CreateToken_Returns_PersonalAccessToken;
  token: App_CreateToken_Returns_Token;
};

export type App_CreateToken_Returns = App_CreateToken_Returns_Created;

export type App_CreateToken_Token = App_CreateToken_Returns_Created | undefined;

/**
 * App - Parse Events.
 *
 * @since 1.0.0
 */
export type App_ParseEvents_Text = string;

export type App_ParseEvents_ServerSentEvent_Comment = string;

export type App_ParseEvents_ServerSentEvent_Data = unknown;

export type App_ParseEvents_ServerSentEvent_Event = string;

export type App_ParseEvents_ServerSentEvent_Retry = string;

export type App_ParseEvents_ServerSentEvent = {
  comment?: App_ParseEvents_ServerSentEvent_Comment;
  data?: App_ParseEvents_ServerSentEvent_Data;
  event?: App_ParseEvents_ServerSentEvent_Event;
  retry?: App_ParseEvents_ServerSentEvent_Retry;
};

export type App_ParseEvents_ServerSentEvents = App_ParseEvents_ServerSentEvent[];

export type App_ParseEvents_Returns = App_ParseEvents_ServerSentEvents;

export type App_ParseEvents_Field = string;

export type App_ParseEvents_Value = string;

/**
 * App - Open Events.
 *
 * @since 1.0.0
 */
export type App_OpenEvents_BaseUrl = string;

export type App_OpenEvents_Headers = Record<string, string>;

export type App_OpenEvents_Returns_Stream = {
  close: App_OpenEvents_Close;
  readUntil: App_OpenEvents_ReadUntil;
  response: App_OpenEvents_Response;
};

export type App_OpenEvents_Returns = Promise<App_OpenEvents_Returns_Stream>;

export type App_OpenEvents_Controller = AbortController;

export type App_OpenEvents_Response = Response;

export type App_OpenEvents_Reader = ReadableStreamDefaultReader<Uint8Array>;

export type App_OpenEvents_Decoder = TextDecoder;

export type App_OpenEvents_Buffer_Closed = boolean;

export type App_OpenEvents_Buffer_Text = string;

export type App_OpenEvents_Buffer = {
  closed: App_OpenEvents_Buffer_Closed;
  text: App_OpenEvents_Buffer_Text;
};

/**
 * App - Open Events - Close.
 *
 * @since 1.0.0
 */
export type App_OpenEvents_Close_Returns = void;

export type App_OpenEvents_Close = () => App_OpenEvents_Close_Returns;

/**
 * App - Open Events - Read Until.
 *
 * @since 1.0.0
 */
export type App_OpenEvents_ReadUntil_Until_Received = App_ParseEvents_ServerSentEvents;

export type App_OpenEvents_ReadUntil_Until = (received: App_OpenEvents_ReadUntil_Until_Received) => boolean;

export type App_OpenEvents_ReadUntil_Returns_Closed = boolean;

export type App_OpenEvents_ReadUntil_Returns_Events = App_ParseEvents_ServerSentEvents;

export type App_OpenEvents_ReadUntil_Returns_Received = {
  closed: App_OpenEvents_ReadUntil_Returns_Closed;
  events: App_OpenEvents_ReadUntil_Returns_Events;
};

export type App_OpenEvents_ReadUntil_Returns = Promise<App_OpenEvents_ReadUntil_Returns_Received>;

export type App_OpenEvents_ReadUntil = (until: App_OpenEvents_ReadUntil_Until) => App_OpenEvents_ReadUntil_Returns;

export type App_OpenEvents_ReadUntil_Chunk_Done = boolean;

export type App_OpenEvents_ReadUntil_Chunk_Value = Uint8Array | undefined;

export type App_OpenEvents_ReadUntil_Chunk = {
  done: App_OpenEvents_ReadUntil_Chunk_Done;
  value?: App_OpenEvents_ReadUntil_Chunk_Value;
};

/**
 * App - Encode Cbor Head.
 *
 * @since 1.0.0
 */
export type App_EncodeCborHead_MajorType = number;

export type App_EncodeCborHead_Length = number;

export type App_EncodeCborHead_Returns = Buffer;

export type App_EncodeCborHead_Head = Buffer;

/**
 * App - Encode Cbor.
 *
 * @since 1.0.0
 */
export type App_EncodeCbor_Value = number | string | Uint8Array | Map<App_EncodeCbor_Value, App_EncodeCbor_Value>;

export type App_EncodeCbor_Returns = Buffer;

export type App_EncodeCbor_Bytes = Buffer;

export type App_EncodeCbor_Entry = [App_EncodeCbor_Value, App_EncodeCbor_Value];

export type App_EncodeCbor_Entries = App_EncodeCbor_Entry[];

/**
 * App - Create Authenticator Data.
 *
 * @since 1.0.0
 */
export type App_CreateAuthenticatorData_RpId = string;

export type App_CreateAuthenticatorData_Flags = number;

export type App_CreateAuthenticatorData_SignCount = number;

export type App_CreateAuthenticatorData_Attested = Buffer;

export type App_CreateAuthenticatorData_Returns = Buffer;

export type App_CreateAuthenticatorData_Counter = Buffer;

/**
 * App - Create Authenticator.
 *
 * @since 1.0.0
 */
export type App_CreateAuthenticator_Returns_CredentialId = Buffer;

export type App_CreateAuthenticator_Returns_KeyPair = KeyPairKeyObjectResult;

export type App_CreateAuthenticator_Returns_SignCount = number;

export type App_CreateAuthenticator_Returns_UserHandle = string;

export type App_CreateAuthenticator_Returns_Authenticator = {
  credentialId: App_CreateAuthenticator_Returns_CredentialId;
  keyPair: App_CreateAuthenticator_Returns_KeyPair;
  signCount: App_CreateAuthenticator_Returns_SignCount;
  userHandle: App_CreateAuthenticator_Returns_UserHandle;
};

export type App_CreateAuthenticator_Returns = App_CreateAuthenticator_Returns_Authenticator;

export type App_CreateAuthenticator_KeyPair = KeyPairKeyObjectResult;

/**
 * App - Create Registration.
 *
 * @since 1.0.0
 */
export type App_CreateRegistration_Authenticator = App_CreateAuthenticator_Returns_Authenticator;

export type App_CreateRegistration_Options = Record<string, unknown>;

export type App_CreateRegistration_Origin = string;

export type App_CreateRegistration_Returns_AuthenticatorAttachment = string;

export type App_CreateRegistration_Returns_ClientExtensionResults = Record<string, unknown>;

export type App_CreateRegistration_Returns_Id = string;

export type App_CreateRegistration_Returns_RawId = string;

export type App_CreateRegistration_Returns_Response_AttestationObject = string;

export type App_CreateRegistration_Returns_Response_ClientDataJson = string;

export type App_CreateRegistration_Returns_Response_Transports = string[];

export type App_CreateRegistration_Returns_Response = {
  attestationObject: App_CreateRegistration_Returns_Response_AttestationObject;
  clientDataJSON: App_CreateRegistration_Returns_Response_ClientDataJson;
  transports: App_CreateRegistration_Returns_Response_Transports;
};

export type App_CreateRegistration_Returns_Type = string;

export type App_CreateRegistration_Returns = {
  authenticatorAttachment: App_CreateRegistration_Returns_AuthenticatorAttachment;
  clientExtensionResults: App_CreateRegistration_Returns_ClientExtensionResults;
  id: App_CreateRegistration_Returns_Id;
  rawId: App_CreateRegistration_Returns_RawId;
  response: App_CreateRegistration_Returns_Response;
  type: App_CreateRegistration_Returns_Type;
};

export type App_CreateRegistration_PublicKey = JsonWebKey;

export type App_CreateRegistration_CredentialIdLength = Buffer;

export type App_CreateRegistration_Attested = Buffer;

export type App_CreateRegistration_AuthenticatorData = Buffer;

export type App_CreateRegistration_AttestationObject = Buffer;

export type App_CreateRegistration_ClientData = Buffer;

/**
 * App - Create Assertion.
 *
 * @since 1.0.0
 */
export type App_CreateAssertion_Authenticator = App_CreateAuthenticator_Returns_Authenticator;

export type App_CreateAssertion_Options = Record<string, unknown>;

export type App_CreateAssertion_Origin = string;

export type App_CreateAssertion_RpId = string;

export type App_CreateAssertion_Returns_AuthenticatorAttachment = string;

export type App_CreateAssertion_Returns_ClientExtensionResults = Record<string, unknown>;

export type App_CreateAssertion_Returns_Id = string;

export type App_CreateAssertion_Returns_RawId = string;

export type App_CreateAssertion_Returns_Response_AuthenticatorData = string;

export type App_CreateAssertion_Returns_Response_ClientDataJson = string;

export type App_CreateAssertion_Returns_Response_Signature = string;

export type App_CreateAssertion_Returns_Response_UserHandle = string;

export type App_CreateAssertion_Returns_Response = {
  authenticatorData: App_CreateAssertion_Returns_Response_AuthenticatorData;
  clientDataJSON: App_CreateAssertion_Returns_Response_ClientDataJson;
  signature: App_CreateAssertion_Returns_Response_Signature;
  userHandle: App_CreateAssertion_Returns_Response_UserHandle;
};

export type App_CreateAssertion_Returns_Type = string;

export type App_CreateAssertion_Returns = {
  authenticatorAttachment: App_CreateAssertion_Returns_AuthenticatorAttachment;
  clientExtensionResults: App_CreateAssertion_Returns_ClientExtensionResults;
  id: App_CreateAssertion_Returns_Id;
  rawId: App_CreateAssertion_Returns_RawId;
  response: App_CreateAssertion_Returns_Response;
  type: App_CreateAssertion_Returns_Type;
};

export type App_CreateAssertion_AuthenticatorData = Buffer;

export type App_CreateAssertion_ClientData = Buffer;

export type App_CreateAssertion_Signature = Buffer;

/**
 * App - Setup And Sign-in - Claims The First Account And Checks CSRF.
 *
 * @since 1.0.0
 */
export type App_SetupAndSignIn_ClaimsTheFirstAccountAndChecksCsrf_Client = App_CreateClient_Returns_Client;

export type App_SetupAndSignIn_ClaimsTheFirstAccountAndChecksCsrf_Claimed = App_CreateClient_Request_Returns_Response;

export type App_SetupAndSignIn_ClaimsTheFirstAccountAndChecksCsrf_SetCookies = string[];

/**
 * App - Setup And Sign-in - Limits Setup Codes And Refuses An Expired One.
 *
 * @since 1.0.0
 */
export type App_SetupAndSignIn_LimitsSetupCodesAndRefusesAnExpiredOne_Clock_Value = number;

export type App_SetupAndSignIn_LimitsSetupCodesAndRefusesAnExpiredOne_Clock = {
  value: App_SetupAndSignIn_LimitsSetupCodesAndRefusesAnExpiredOne_Clock_Value;
};

export type App_SetupAndSignIn_LimitsSetupCodesAndRefusesAnExpiredOne_Client = App_CreateClient_Returns_Client;

export type App_SetupAndSignIn_LimitsSetupCodesAndRefusesAnExpiredOne_SetupClaim = App_Claim_SetupClaim;

export type App_SetupAndSignIn_LimitsSetupCodesAndRefusesAnExpiredOne_Guesses = App_CreateClient_Request_Returns_Response[];

export type App_SetupAndSignIn_LimitsSetupCodesAndRefusesAnExpiredOne_Limited = App_CreateClient_Request_Returns_Response;

/**
 * App - Setup And Sign-in - Asks For A Second Factor And Limits Failures.
 *
 * @since 1.0.0
 */
export type App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Client = App_CreateClient_Returns_Client;

export type App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Setup = App_CreateClient_Request_Returns_Response;

export type App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Secret = string;

export type App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Enabled = App_CreateClient_Request_Returns_Response;

export type App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_RecoveryCodes = unknown;

export type App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_PasswordStep = App_CreateClient_Request_Returns_Response;

export type App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Guesser = App_CreateClient_Returns_Client;

export type App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_GuessedStep = App_CreateClient_Request_Returns_Response;

export type App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Guesses = App_CreateClient_Request_Returns_Response[];

export type App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Attacker = App_CreateClient_Returns_Client;

export type App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_FailedAttempts = App_CreateClient_Request_Returns_Response[];

export type App_SetupAndSignIn_AsksForASecondFactorAndLimitsFailures_Limited = App_CreateClient_Request_Returns_Response;

/**
 * App - Setup And Sign-in - Keeps A Session Across A Restart.
 *
 * @since 1.0.0
 */
export type App_SetupAndSignIn_KeepsASessionAcrossARestart_Client = App_CreateClient_Returns_Client;

export type App_SetupAndSignIn_KeepsASessionAcrossARestart_RestartedClient = App_CreateClient_Returns_Client;

/**
 * App - Setup And Sign-in - Signs In With A Passkey Only On Its Hostname.
 *
 * @since 1.0.0
 */
export type App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_Client = App_CreateClient_Returns_Client;

export type App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_Authenticator = App_CreateAuthenticator_Returns_Authenticator;

export type App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_RegistrationOptions = App_CreateClient_Request_Returns_Response;

export type App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_CreationOptions = Record<string, unknown>;

export type App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_SignInOptions = App_CreateClient_Request_Returns_Response;

export type App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_RequestOptions = Record<string, unknown>;

export type App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_OtherHost = App_CreateClient_Returns_Client;

export type App_SetupAndSignIn_SignsInWithAPasskeyOnlyOnItsHostname_OtherOptions = App_CreateClient_Request_Returns_Response;

/**
 * App - Account Security - Changes The Password And Username.
 *
 * @since 1.0.0
 */
export type App_AccountSecurity_ChangesThePasswordAndUsername_Client = App_CreateClient_Returns_Client;

export type App_AccountSecurity_ChangesThePasswordAndUsername_OtherBrowser = App_CreateClient_Returns_Client;

/**
 * App - Account Security - Lists What A Lost Key Removed Until It Is Dismissed.
 *
 * @since 1.0.0
 */
export type App_AccountSecurity_ListsWhatALostKeyRemovedUntilItIsDismissed_Client = App_CreateClient_Returns_Client;

export type App_AccountSecurity_ListsWhatALostKeyRemovedUntilItIsDismissed_Administrator = Lib_State_Runner_GetAdministrator_Returns;

export type App_AccountSecurity_ListsWhatALostKeyRemovedUntilItIsDismissed_Stderr = MockInstance<typeof process.stderr.write>;

export type App_AccountSecurity_ListsWhatALostKeyRemovedUntilItIsDismissed_RestartedClient = App_CreateClient_Returns_Client;

/**
 * App - Tokens - Creates Edits And Revokes Named Tokens.
 *
 * @since 1.0.0
 */
export type App_Tokens_CreatesEditsAndRevokesNamedTokens_Client = App_CreateClient_Returns_Client;

export type App_Tokens_CreatesEditsAndRevokesNamedTokens_Created = App_CreateClient_Request_Returns_Response;

export type App_Tokens_CreatesEditsAndRevokesNamedTokens_TokenId = string;

/**
 * App - Dashboard API - Serves Data To Sessions And Status Tokens.
 *
 * @since 1.0.0
 */
export type App_DashboardApi_ServesDataToSessionsAndStatusTokens_Client = App_CreateClient_Returns_Client;

export type App_DashboardApi_ServesDataToSessionsAndStatusTokens_Reader = App_CreateToken_Returns_Created;

export type App_DashboardApi_ServesDataToSessionsAndStatusTokens_Runner = App_CreateToken_Returns_Created;

export type App_DashboardApi_ServesDataToSessionsAndStatusTokens_Anonymous = App_CreateClient_Returns_Client;

export type App_DashboardApi_ServesDataToSessionsAndStatusTokens_Settings = App_CreateClient_Request_Returns_Response;

export type App_DashboardApi_ServesDataToSessionsAndStatusTokens_UpdatedSettings = App_CreateClient_Request_Returns_Response;

/**
 * App - Dashboard API - Runs One Check At A Time.
 *
 * @since 1.0.0
 */
export type App_DashboardApi_RunsOneCheckAtATime_Client = App_CreateClient_Returns_Client;

export type App_DashboardApi_RunsOneCheckAtATime_Reader = App_CreateToken_Returns_Created;

export type App_DashboardApi_RunsOneCheckAtATime_Runner = App_CreateToken_Returns_Created;

export type App_DashboardApi_RunsOneCheckAtATime_Automation = App_CreateClient_Returns_Client;

/**
 * App - Dashboard API - Reports Docker Failures.
 *
 * @since 1.0.0
 */
export type App_DashboardApi_ReportsDockerFailures_Client = App_CreateClient_Returns_Client;

/**
 * App - Dashboard API - Streams The State And Each Finished Check.
 *
 * @since 1.0.0
 */
export type App_DashboardApi_StreamsTheStateAndEachFinishedCheck_Client = App_CreateClient_Returns_Client;

export type App_DashboardApi_StreamsTheStateAndEachFinishedCheck_Events = App_OpenEvents_Returns_Stream;

export type App_DashboardApi_StreamsTheStateAndEachFinishedCheck_Opened = App_OpenEvents_ReadUntil_Returns_Received;

export type App_DashboardApi_StreamsTheStateAndEachFinishedCheck_Finished = App_OpenEvents_ReadUntil_Returns_Received;

export type App_DashboardApi_StreamsTheStateAndEachFinishedCheck_NamedEvents = App_ParseEvents_ServerSentEvents;

/**
 * App - Dashboard API - Ends Streams For Revoked Callers.
 *
 * @since 1.0.0
 */
export type App_DashboardApi_EndsStreamsForRevokedCallers_Client = App_CreateClient_Returns_Client;

export type App_DashboardApi_EndsStreamsForRevokedCallers_Reader = App_CreateToken_Returns_Created;

export type App_DashboardApi_EndsStreamsForRevokedCallers_TokenEvents = App_OpenEvents_Returns_Stream;

export type App_DashboardApi_EndsStreamsForRevokedCallers_SessionEvents = App_OpenEvents_Returns_Stream;

/**
 * App - Watchtower-style Endpoints - Needs A Token With The Matching Scope.
 *
 * @since 1.0.0
 */
export type App_WatchtowerStyleEndpoints_NeedsATokenWithTheMatchingScope_Client = App_CreateClient_Returns_Client;

export type App_WatchtowerStyleEndpoints_NeedsATokenWithTheMatchingScope_Reader = App_CreateToken_Returns_Created;

export type App_WatchtowerStyleEndpoints_NeedsATokenWithTheMatchingScope_Runner = App_CreateToken_Returns_Created;

export type App_WatchtowerStyleEndpoints_NeedsATokenWithTheMatchingScope_Scraper = App_CreateToken_Returns_Created;

export type App_WatchtowerStyleEndpoints_NeedsATokenWithTheMatchingScope_WrongToken = string;

export type App_WatchtowerStyleEndpoints_NeedsATokenWithTheMatchingScope_Metrics = App_CreateClient_Request_Returns_Response;

/**
 * App - Proxy Trust - Trusts Forwarded Headers Only From Private Senders.
 *
 * @since 1.0.0
 */
export type App_ProxyTrust_TrustsForwardedHeadersOnlyFromPrivateSenders_Proxied = App_CreateClient_Returns_Client;

export type App_ProxyTrust_TrustsForwardedHeadersOnlyFromPrivateSenders_TrustProxy_Address = string;

export type App_ProxyTrust_TrustsForwardedHeadersOnlyFromPrivateSenders_TrustProxy_Hop = number;

export type App_ProxyTrust_TrustsForwardedHeadersOnlyFromPrivateSenders_TrustProxy = (address: App_ProxyTrust_TrustsForwardedHeadersOnlyFromPrivateSenders_TrustProxy_Address, hop: App_ProxyTrust_TrustsForwardedHeadersOnlyFromPrivateSenders_TrustProxy_Hop) => boolean;

export type App_ProxyTrust_TrustsForwardedHeadersOnlyFromPrivateSenders_Claimed = App_CreateClient_Request_Returns_Response;

export type App_ProxyTrust_TrustsForwardedHeadersOnlyFromPrivateSenders_FailedAttempts = App_CreateClient_Request_Returns_Response[];

/**
 * App - Errors And The Dashboard Page - Answers Malformed Requests With The Error Envelope.
 *
 * @since 1.0.0
 */
export type App_ErrorsAndTheDashboardPage_AnswersMalformedRequestsWithTheErrorEnvelope_Client = App_CreateClient_Returns_Client;

export type App_ErrorsAndTheDashboardPage_AnswersMalformedRequestsWithTheErrorEnvelope_Limited = App_CreateClient_Request_Returns_Response;

/**
 * App - Errors And The Dashboard Page - Serves The Page For Every Dashboard Path.
 *
 * @since 1.0.0
 */
export type App_ErrorsAndTheDashboardPage_ServesThePageForEveryDashboardPath_Client = App_CreateClient_Returns_Client;

export type App_ErrorsAndTheDashboardPage_ServesThePageForEveryDashboardPath_Page = App_CreateClient_Request_Returns_Response;

export type App_ErrorsAndTheDashboardPage_ServesThePageForEveryDashboardPath_OldApi = App_CreateClient_Request_Returns_Response;

export type App_ErrorsAndTheDashboardPage_ServesThePageForEveryDashboardPath_Asset = App_CreateClient_Request_Returns_Response;

export type App_ErrorsAndTheDashboardPage_ServesThePageForEveryDashboardPath_Root = App_CreateClient_Request_Returns_Response;

/**
 * App - Notifications.
 *
 * @since 1.0.0
 */
export type App_Notifications_Mocks = {
  send: Mock<(app: Lib_Notifications_App, target: Lib_Notifications_Target, notification: Lib_Notifications_Notification) => Promise<Lib_Notifications_Result>>;
};

export type App_Notifications_Module = typeof import('../lib/notifications.js');

export type App_Notifications_AddsEditsTestsAndRemovesDestinations_Client = App_CreateClient_Returns_Client;

export type App_Notifications_AddsEditsTestsAndRemovesDestinations_Created = App_CreateClient_Request_Returns_Response;

export type App_Notifications_AddsEditsTestsAndRemovesDestinations_Events = App_CreateClient_Request_Returns_Response;

export type App_Notifications_AddsEditsTestsAndRemovesDestinations_NotificationId = string;

export type App_Notifications_AddsEditsTestsAndRemovesDestinations_Token = App_CreateToken_Returns;

export type App_Notifications_ClearsSavedOptionalSecretsExplicitly_Client = App_CreateClient_Returns_Client;

export type App_Notifications_ClearsSavedOptionalSecretsExplicitly_Created = App_CreateClient_Request_Returns_Response;

export type App_Notifications_ClearsSavedOptionalSecretsExplicitly_NotificationId = string;

/**
 * App - Registries - Adds Edits And Removes Registry Sign Ins.
 *
 * @since 1.0.0
 */
export type App_Registries_AddsEditsAndRemovesRegistrySignIns_Client = App_CreateClient_Returns_Client;

export type App_Registries_AddsEditsAndRemovesRegistrySignIns_Created = App_CreateClient_Request_Returns_Response;

export type App_Registries_AddsEditsAndRemovesRegistrySignIns_RegistryId = string;

export type App_Registries_AddsEditsAndRemovesRegistrySignIns_Ghcr = App_CreateClient_Request_Returns_Response;

export type App_Registries_AddsEditsAndRemovesRegistrySignIns_GhcrId = string;

export type App_Registries_AddsEditsAndRemovesRegistrySignIns_Token = App_CreateToken_Returns;

export type App_Registries_AddsEditsAndRemovesRegistrySignIns_Automation = App_CreateClient_Returns_Client;

/**
 * App - Registries - Asks Again For A Password A Lost Key Removed.
 *
 * @since 1.0.0
 */
export type App_Registries_AsksAgainForAPasswordALostKeyRemoved_Client = App_CreateClient_Returns_Client;

export type App_Registries_AsksAgainForAPasswordALostKeyRemoved_Created = App_CreateClient_Request_Returns_Response;

export type App_Registries_AsksAgainForAPasswordALostKeyRemoved_RegistryId = string;

export type App_Registries_AsksAgainForAPasswordALostKeyRemoved_Stderr = MockInstance<typeof process.stderr.write>;

export type App_Registries_AsksAgainForAPasswordALostKeyRemoved_RestartedClient = App_CreateClient_Returns_Client;
