import type { Mock } from 'vitest';

import type {
  Shared_Dependencies,
  Shared_Engine,
  Shared_Options,
  Shared_Report,
} from './shared.d.ts';

/**
 * Run.
 *
 * @since 0.0.1
 */
export type Run_Options = Shared_Options;

export type Run_InspectContainer = Shared_Engine['inspectContainer'];

export type Run_InspectImage = Shared_Engine['inspectImage'];

export type Run_FetchFunction = Shared_Dependencies['fetchFunction'];

export type Run_Sleep = Shared_Dependencies['sleep'];

export type Run_FakeEngine = { [Key in keyof Shared_Engine]: Mock<Shared_Engine[Key]> };

export type Run_FakeDependencies_Engine = Run_FakeEngine;

export type Run_FakeDependencies_FetchFunction = Mock<Shared_Dependencies['fetchFunction']>;

export type Run_FakeDependencies_Sleep = Mock<Shared_Dependencies['sleep']>;

export type Run_FakeDependencies_Now = Shared_Dependencies['now'];

export type Run_FakeDependencies_FindCredentials = Shared_Dependencies['findCredentials'];

export type Run_FakeDependencies = {
  engine: Run_FakeDependencies_Engine;
  fetchFunction: Run_FakeDependencies_FetchFunction;
  sleep: Run_FakeDependencies_Sleep;
  now: Run_FakeDependencies_Now;
  findCredentials: Run_FakeDependencies_FindCredentials;
};

/**
 * Run - Create Dependencies.
 *
 * @since 0.0.1
 */
export type Run_CreateDependencies_State_LocalDigest = string;

export type Run_CreateDependencies_State = {
  localDigest: Run_CreateDependencies_State_LocalDigest;
};

export type Run_CreateDependencies_RunningAfterStart = boolean;

export type Run_CreateDependencies_Returns = Run_FakeDependencies;

export type Run_CreateDependencies_Clock = number;

/**
 * Run - Run Update Cycle - Rolls Back When The New Container Stops.
 *
 * @since 0.0.1
 */
export type Run_RunUpdateCycle_RollsBackWhenTheNewContainerStops_Dependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_RollsBackWhenTheNewContainerStops_Report = Shared_Report;

/**
 * Run - Run Update Cycle - Skips Pulling When The Digest Matches.
 *
 * @since 0.0.1
 */
export type Run_RunUpdateCycle_SkipsPullingWhenTheDigestMatches_Dependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_SkipsPullingWhenTheDigestMatches_Report = Shared_Report;

/**
 * Run - Run Update Cycle - Updates And Cleans Up When A New Image Exists.
 *
 * @since 0.0.1
 */
export type Run_RunUpdateCycle_UpdatesAndCleansUpWhenANewImageExists_Dependencies = Run_FakeDependencies;

export type Run_RunUpdateCycle_UpdatesAndCleansUpWhenANewImageExists_Report = Shared_Report;
