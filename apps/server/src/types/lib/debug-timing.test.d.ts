import type { Mock, MockInstance } from 'vitest';

/**
 * Lib - Debug Timing - Fake Engine.
 *
 * @since 1.1.0
 */
export type Lib_DebugTiming_FakeEngine_Name = string;

export type Lib_DebugTiming_FakeEngine_ListContainers_Returns = Promise<string[]>;

export type Lib_DebugTiming_FakeEngine_InspectContainer_Returns = Promise<string[]>;

/**
 * Lib - Debug Timing - Lines.
 *
 * @since 1.1.0
 */
export type Lib_DebugTiming_Lines = string[];

/**
 * Lib - Debug Timing - Write.
 *
 * @since 1.1.0
 */
export type Lib_DebugTiming_Write = MockInstance<typeof process.stdout.write>;

/**
 * Lib - Debug Timing - Fetch.
 *
 * @since 1.1.0
 */
export type Lib_DebugTiming_Fetch = Mock<typeof fetch>;

export type Lib_DebugTiming_Answer = Response;
