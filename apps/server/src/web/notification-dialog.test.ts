import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { NotificationDialog } from '@/web/notification-dialog.js';
import { notificationServiceIssue } from '@/web/notification-services.js';

import type { Web_NotificationDialog_ServiceSelection_KeepsThePlaceholderSelectable_Html } from '@/types/web/notification-dialog.test.d.ts';

/**
 * Notification Dialog - Service selection.
 *
 * Keeps the empty service available as a deliberate choice while preserving
 * the required-field error shown when the form is submitted with that choice.
 *
 * @since 1.1.0
 */
describe('service selection', () => {
  it('keeps the placeholder selectable', () => {
    const html: Web_NotificationDialog_ServiceSelection_KeepsThePlaceholderSelectable_Html = renderToStaticMarkup(createElement(NotificationDialog, {
      events: [{
        defaultEnabled: true,
        description: 'An update failed.',
        key: 'update-failed',
        label: 'Update failed',
      }],
      interpreter: 'outpost',
      onClose: vi.fn(),
      onSaved: vi.fn(async () => undefined),
      open: true,
      target: null,
    }));

    expect(html).toContain('<option class="select-placeholder" value="" selected="">— Select one —</option>');

    expect(html).not.toContain('<option class="select-placeholder" disabled');

    return;
  });

  it('reports the placeholder as required', () => {
    expect(notificationServiceIssue('', true)).toBe('Choose a service.');

    expect(notificationServiceIssue('ntfy', true)).toBe('');

    return;
  });

  return;
});
