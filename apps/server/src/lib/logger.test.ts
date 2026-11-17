import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  logDebug,
  logError,
  logInfo,
  logWarn,
  setDebugLogging,
} from './logger.js';

import type {
  Lib_LoggerTest_Stderr,
  Lib_LoggerTest_Stdout,
} from '../types/lib/logger.test.d.ts';

describe('logger', () => {
  beforeEach(() => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date('2026-11-17T14:25:36.789Z'));

    return;
  });

  afterEach(() => {
    setDebugLogging(false);

    vi.useRealTimers();

    vi.restoreAllMocks();

    return;
  });

  it('writes the shared timestamp, level, component, and one-line message shape', () => {
    const stdout: Lib_LoggerTest_Stdout = vi.spyOn(process.stdout, 'write').mockReturnValue(true);
    const stderr: Lib_LoggerTest_Stderr = vi.spyOn(process.stderr, 'write').mockReturnValue(true);

    logInfo('server', 'ready');

    logWarn('state', [
      'first fact',
      'second fact',
    ].join('\n'));

    logError('docker', 'socket unavailable');

    expect(stdout).toHaveBeenCalledWith('2026-11-17T14:25:36Z INFO server: ready\n');

    expect(stderr).toHaveBeenNthCalledWith(1, '2026-11-17T14:25:36Z WARN state: first fact second fact\n');

    expect(stderr).toHaveBeenNthCalledWith(2, '2026-11-17T14:25:36Z ERROR docker: socket unavailable\n');

    return;
  });

  it('writes DEBUG records only while debug logging is on', () => {
    const stdout: Lib_LoggerTest_Stdout = vi.spyOn(process.stdout, 'write').mockReturnValue(true);

    logDebug('registry', 'hidden');

    setDebugLogging(true);

    logDebug('registry', 'visible');

    expect(stdout).toHaveBeenCalledOnce();

    expect(stdout).toHaveBeenCalledWith('2026-11-17T14:25:36Z DEBUG registry: visible\n');

    return;
  });

  return;
});
