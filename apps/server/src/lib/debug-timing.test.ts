import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { timedEngine, timedFetch } from './debug-timing.js';
import { logDebug, setDebugLogging } from './logger.js';

import type {
  Lib_DebugTiming_Answer,
  Lib_DebugTiming_FakeEngine_InspectContainer_Returns,
  Lib_DebugTiming_FakeEngine_ListContainers_Returns,
  Lib_DebugTiming_FakeEngine_Name,
  Lib_DebugTiming_Fetch,
  Lib_DebugTiming_Lines,
  Lib_DebugTiming_Write,
} from '../types/lib/debug-timing.test.d.ts';

/**
 * Lib - Debug Timing.
 *
 * Stands in for the Docker engine, with a private field like the real one, so the
 * timing wrapper is shown to run each call on the engine itself.
 *
 * @since 1.1.0
 */
class FakeEngine {
  /**
   * Lib - Debug Timing - Name.
   *
   * A private field the wrapped calls must still reach.
   * It names the one fixture container.
   *
   * @private
   *
   * @since 1.1.0
   */
  readonly #name: Lib_DebugTiming_FakeEngine_Name = 'fixture-container';

  /**
   * Lib - Debug Timing - Version.
   *
   * A plain value the wrapper passes through untouched.
   * Only methods are timed.
   *
   * @since 1.1.0
   */
  public readonly version: Lib_DebugTiming_FakeEngine_Name = '1.47';

  /**
   * Lib - Debug Timing - Inspect Container.
   *
   * Fails like Docker does for a container that's gone.
   * The error names the container.
   *
   * @returns {Lib_DebugTiming_FakeEngine_InspectContainer_Returns}
   *
   * @since 1.1.0
   */
  public async inspectContainer(): Lib_DebugTiming_FakeEngine_InspectContainer_Returns {
    return Promise.reject(new Error(`No such container: ${this.#name}`));
  }

  /**
   * Lib - Debug Timing - List Containers.
   *
   * Answers with the one fixture container.
   * It reads the private field, as the real engine reads its own.
   *
   * @returns {Lib_DebugTiming_FakeEngine_ListContainers_Returns}
   *
   * @since 1.1.0
   */
  public async listContainers(): Lib_DebugTiming_FakeEngine_ListContainers_Returns {
    return [this.#name];
  }
}

describe('debug timing', () => {
  afterEach(() => {
    setDebugLogging(false);

    vi.restoreAllMocks();

    return;
  });

  it('writes DEBUG lines only while debug logging is on', () => {
    const write: Lib_DebugTiming_Write = vi.spyOn(process.stdout, 'write').mockReturnValue(true);

    logDebug('hidden while off');

    setDebugLogging(true);

    logDebug('shown while on');

    const lines: Lib_DebugTiming_Lines = write.mock.calls.map((call) => String(call[0]));

    expect(lines).toEqual(['DEBUG shown while on\n']);

    return;
  });

  it('logs registry requests by origin and path, without the query string', async () => {
    const write: Lib_DebugTiming_Write = vi.spyOn(process.stdout, 'write').mockReturnValue(true);
    const answer: Lib_DebugTiming_Answer = new Response(null, { status: 200 });
    const fetchFunction: Lib_DebugTiming_Fetch = vi.fn<typeof fetch>(async () => answer);

    await timedFetch(fetchFunction)('https://registry.example.test/token?scope=repository:library/nginx:pull');

    setDebugLogging(true);

    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(1_000)
      .mockReturnValueOnce(1_120);

    expect(await timedFetch(fetchFunction)('https://registry.example.test/v2/library/nginx/manifests/latest?tag=1', {
      method: 'HEAD',
    })).toBe(answer);

    const lines: Lib_DebugTiming_Lines = write.mock.calls.map((call) => String(call[0]));

    expect(lines).toEqual(['DEBUG Registry request HEAD https://registry.example.test/v2/library/nginx/manifests/latest answered 200 after 120 ms\n']);

    return;
  });

  it('logs a failed registry request and passes the error on', async () => {
    const write: Lib_DebugTiming_Write = vi.spyOn(process.stdout, 'write').mockReturnValue(true);
    const fetchFunction: Lib_DebugTiming_Fetch = vi.fn<typeof fetch>(async () => Promise.reject(new Error('connect ECONNREFUSED')));

    setDebugLogging(true);

    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(2_000)
      .mockReturnValueOnce(2_050);

    await expect(timedFetch(fetchFunction)('https://registry.example.test/v2/')).rejects.toThrow('connect ECONNREFUSED');

    const lines: Lib_DebugTiming_Lines = write.mock.calls.map((call) => String(call[0]));

    expect(lines).toEqual(['DEBUG Registry request GET https://registry.example.test/v2/ failed after 50 ms: connect ECONNREFUSED\n']);

    return;
  });

  it('logs slow and failed Docker calls and passes every answer through', async () => {
    const write: Lib_DebugTiming_Write = vi.spyOn(process.stdout, 'write').mockReturnValue(true);
    const engine: FakeEngine = timedEngine(new FakeEngine());

    setDebugLogging(true);

    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(1_000)
      .mockReturnValueOnce(2_500)
      .mockReturnValueOnce(3_000)
      .mockReturnValueOnce(3_010)
      .mockReturnValueOnce(4_000)
      .mockReturnValueOnce(4_020);

    expect(await engine.listContainers()).toEqual(['fixture-container']);

    expect(await engine.listContainers()).toEqual(['fixture-container']);

    await expect(engine.inspectContainer()).rejects.toThrow('No such container: fixture-container');

    expect(engine.version).toBe('1.47');

    const lines: Lib_DebugTiming_Lines = write.mock.calls.map((call) => String(call[0]));

    expect(lines).toEqual([
      'DEBUG Slow Docker call: listContainers took 1500 ms\n',
      'DEBUG Docker call inspectContainer failed after 20 ms: No such container: fixture-container\n',
    ]);

    return;
  });

  return;
});
