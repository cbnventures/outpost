import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { SchedulePicker } from './schedule-picker.js';

import type { Web_SchedulePicker_Render } from '@/types/web/schedule-picker.test.d.ts';

/**
 * Schedule Picker - Schedule Picker.
 *
 * Verifies the next scheduled cycle is named for the action it will perform.
 * Normal update mode and monitor-only check mode keep distinct wording.
 *
 * @since 1.1.0
 */
describe('schedule picker', () => {
  it('names normal schedules as updates and monitor-only schedules as checks', () => {
    /**
     * Schedule Picker - Render.
     *
     * Renders one mode with the same valid schedule and time zone.
     * The resulting status text exposes the action name for the assertion.
     *
     * @param {boolean} monitorOnly - Monitor only.
     *
     * @returns {string}
     *
     * @since 1.1.0
     */
    const render: Web_SchedulePicker_Render = (monitorOnly) => renderToStaticMarkup(createElement(SchedulePicker, {
      issue: '',
      monitorOnly,
      onChange: vi.fn(),
      timeZone: 'UTC',
      value: '0 * * * *',
    }));

    expect(render(false)).toContain('Next update:');

    expect(render(true)).toContain('Next check:');

    return;
  });

  return;
});
