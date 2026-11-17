import { isDebugLogging, logDebug } from './logger.js';

import type {
  Lib_DebugTiming_DescribeAddress_Href,
  Lib_DebugTiming_DescribeAddress_Input,
  Lib_DebugTiming_DescribeAddress_Returns,
  Lib_DebugTiming_Reason_Error,
  Lib_DebugTiming_Reason_Returns,
  Lib_DebugTiming_SlowDockerMilliseconds,
  Lib_DebugTiming_TimedEngine_Engine,
  Lib_DebugTiming_TimedEngine_Method,
  Lib_DebugTiming_TimedEngine_Result,
  Lib_DebugTiming_TimedEngine_Returns,
  Lib_DebugTiming_TimedEngine_StartedAt,
  Lib_DebugTiming_TimedEngine_Value,
  Lib_DebugTiming_TimedFetch_Address,
  Lib_DebugTiming_TimedFetch_FetchFunction,
  Lib_DebugTiming_TimedFetch_Method,
  Lib_DebugTiming_TimedFetch_Response,
  Lib_DebugTiming_TimedFetch_Returns,
  Lib_DebugTiming_TimedFetch_StartedAt,
  Lib_DebugTiming_TimeEngineCall_Elapsed,
  Lib_DebugTiming_TimeEngineCall_Name,
  Lib_DebugTiming_TimeEngineCall_Pending,
  Lib_DebugTiming_TimeEngineCall_Resolved,
  Lib_DebugTiming_TimeEngineCall_Returns,
  Lib_DebugTiming_TimeEngineCall_StartedAt,
} from '../types/lib/debug-timing.d.ts';

/**
 * Lib - Debug Timing - Slow Docker Milliseconds.
 *
 * How long a Docker call has to take before Debug logging notes it.
 * Quick calls stay out of the log so the slow ones stand out.
 *
 * @since 1.1.0
 */
const slowDockerMilliseconds: Lib_DebugTiming_SlowDockerMilliseconds = 1000;

/**
 * Lib - Debug Timing - Describe Address.
 *
 * Names a request by its origin and path, leaving out the query string, where a
 * registry's token request carries its scope.
 *
 * @param {Lib_DebugTiming_DescribeAddress_Input} input - Input.
 *
 * @returns {Lib_DebugTiming_DescribeAddress_Returns}
 *
 * @since 1.1.0
 */
function describeAddress(input: Lib_DebugTiming_DescribeAddress_Input): Lib_DebugTiming_DescribeAddress_Returns {
  let href: Lib_DebugTiming_DescribeAddress_Href = '';

  if (typeof input === 'string') {
    href = input;
  } else if (input instanceof URL) {
    href = input.href;
  } else {
    href = input.url;
  }

  try {
    const address: URL = new URL(href);

    return `${address.origin}${address.pathname}`;
  } catch {
    return 'an unreadable address';
  }
}

/**
 * Lib - Debug Timing - Reason.
 *
 * Turns a thrown value into the message a DEBUG line shows.
 * Anything that isn't an Error is shown as text.
 *
 * @param {Lib_DebugTiming_Reason_Error} error - Error.
 *
 * @returns {Lib_DebugTiming_Reason_Returns}
 *
 * @since 1.1.0
 */
function reason(error: Lib_DebugTiming_Reason_Error): Lib_DebugTiming_Reason_Returns {
  return (error instanceof Error) ? error.message : String(error);
}

/**
 * Lib - Debug Timing - Time Engine Call.
 *
 * Waits for one Docker call, then logs it when it took a second or more, or when it
 * failed. The call's own answer or error is passed on unchanged.
 *
 * @param {Lib_DebugTiming_TimeEngineCall_Name}      name      - Name.
 * @param {Lib_DebugTiming_TimeEngineCall_StartedAt} startedAt - Started at.
 * @param {Lib_DebugTiming_TimeEngineCall_Pending}   pending   - Pending.
 *
 * @returns {Lib_DebugTiming_TimeEngineCall_Returns}
 *
 * @since 1.1.0
 */
async function timeEngineCall(name: Lib_DebugTiming_TimeEngineCall_Name, startedAt: Lib_DebugTiming_TimeEngineCall_StartedAt, pending: Lib_DebugTiming_TimeEngineCall_Pending): Lib_DebugTiming_TimeEngineCall_Returns {
  try {
    const resolved: Lib_DebugTiming_TimeEngineCall_Resolved = await pending;
    const elapsed: Lib_DebugTiming_TimeEngineCall_Elapsed = Date.now() - startedAt;

    if (elapsed >= slowDockerMilliseconds) {
      logDebug('docker', `Slow Docker call: ${name} took ${String(elapsed)} ms`);
    }

    return resolved;
  } catch (error) {
    logDebug('docker', `Docker call ${name} failed after ${String(Date.now() - startedAt)} ms: ${reason(error)}`);

    throw error;
  }
}

/**
 * Lib - Debug Timing - Timed Engine.
 *
 * Wraps the Docker engine so each call that takes a second or more, and each call that
 * fails, logs its name and time while Debug logging is on. Calls run on the engine itself.
 *
 * @param {Lib_DebugTiming_TimedEngine_Engine} engine - Engine.
 *
 * @returns {Lib_DebugTiming_TimedEngine_Returns}
 *
 * @since 1.1.0
 */
export function timedEngine<Engine extends object>(engine: Lib_DebugTiming_TimedEngine_Engine<Engine>): Lib_DebugTiming_TimedEngine_Returns<Engine> {
  return new Proxy(engine, {
    get: (target, property) => {
      const value: Lib_DebugTiming_TimedEngine_Value = Reflect.get(target, property);

      if (typeof value !== 'function') {
        return value;
      }

      return new Proxy(value as Lib_DebugTiming_TimedEngine_Method, {
        apply: (method, _thisArgument, methodArguments) => {
          if (isDebugLogging() === false) {
            return Reflect.apply(method, target, methodArguments);
          }

          const startedAt: Lib_DebugTiming_TimedEngine_StartedAt = Date.now();
          const result: Lib_DebugTiming_TimedEngine_Result = Reflect.apply(method, target, methodArguments);

          if ((result instanceof Promise) === false) {
            return result;
          }

          return timeEngineCall(String(property), startedAt, result as Lib_DebugTiming_TimeEngineCall_Pending);
        },
      });
    },
  });
}

/**
 * Lib - Debug Timing - Timed Fetch.
 *
 * Wraps fetch so each registry request logs its method, address, answer, and time while
 * Debug logging is on. Headers, where credentials travel, are never logged.
 *
 * @param {Lib_DebugTiming_TimedFetch_FetchFunction} fetchFunction - Fetch function.
 *
 * @returns {Lib_DebugTiming_TimedFetch_Returns}
 *
 * @since 1.1.0
 */
export function timedFetch(fetchFunction: Lib_DebugTiming_TimedFetch_FetchFunction): Lib_DebugTiming_TimedFetch_Returns {
  return async (input, init) => {
    if (isDebugLogging() === false) {
      return fetchFunction(input, init);
    }

    let method: Lib_DebugTiming_TimedFetch_Method = (input instanceof Request) ? input.method : 'GET';

    if (init !== undefined && init.method !== undefined) {
      method = init.method;
    }

    const address: Lib_DebugTiming_TimedFetch_Address = describeAddress(input);
    const startedAt: Lib_DebugTiming_TimedFetch_StartedAt = Date.now();

    try {
      const response: Lib_DebugTiming_TimedFetch_Response = await fetchFunction(input, init);

      logDebug('registry', `Registry request ${method} ${address} answered ${String(response.status)} after ${String(Date.now() - startedAt)} ms`);

      return response;
    } catch (error) {
      logDebug('registry', `Registry request ${method} ${address} failed after ${String(Date.now() - startedAt)} ms: ${reason(error)}`);

      throw error;
    }
  };
}
