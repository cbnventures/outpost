import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  ContainersView,
  UpdateConfirmationDialog,
} from './containers-view.js';
import { ImageName } from './image-name.js';

import type {
  Web_ContainersView_ContainersView_RendersAnAccessibleActionsHeader_Container,
  Web_ContainersView_ContainersView_RendersAnAccessibleActionsHeader_Html,
  Web_ContainersView_ContainersView_RendersAnAccessibleActionsHeader_Overview,
  Web_ContainersView_ContainersView_UsesResultNeutralCheckedLabels_Containers,
  Web_ContainersView_ContainersView_UsesResultNeutralCheckedLabels_Html,
  Web_ContainersView_ContainersView_UsesResultNeutralCheckedLabels_Overview,
  Web_ContainersView_ContainersView_UsesTheShortResultSummary_Container,
  Web_ContainersView_ContainersView_UsesTheShortResultSummary_Html,
  Web_ContainersView_ContainersView_UsesTheShortResultSummary_Overview,
  Web_ContainersView_ImageName_WrapsOnlyAfterImageDelimiters_Html,
  Web_ContainersView_UpdateConfirmationDialog_Container,
  Web_ContainersView_UpdateConfirmationDialog_Html,
  Web_ContainersView_UpdateConfirmationDialog_OnCancel,
  Web_ContainersView_UpdateConfirmationDialog_OnConfirm,
} from '@/types/web/containers-view.test.d.ts';

/**
 * Containers View - Containers view.
 *
 * Covers the table's accessible action heading and the completed-action time.
 * Static markup also exposes the safe wrapping tokens used in result details.
 *
 * @since 1.1.0
 */
describe('ContainersView', () => {
  it('renders an accessible Actions header', () => {
    const container: Web_ContainersView_ContainersView_RendersAnAccessibleActionsHeader_Container = {
      fullId: 'a'.repeat(64),
      id: 'aaaaaaaaaaaa',
      image: 'localhost:22690/e2e/app:latest',
      lastAction: 'update',
      lastCheckedAt: '2026-10-24T04:00:05.000Z',
      lastDetail: 'Recreated with localhost:22690/e2e/app:latest',
      lastStatus: 'updated',
      managed: true,
      monitorOnly: false,
      name: 'web',
      note: 'Managed',
      self: true,
      state: 'running',
    };
    const overview: Web_ContainersView_ContainersView_RendersAnAccessibleActionsHeader_Overview = {
      labelMode: 'opt-out',
      monitorOnly: false,
      running: false,
      schedule: '0 0 4 * * *',
      timeZone: 'UTC',
      totals: {
        cycles: 1,
        failed: 0,
        updated: 1,
      },
    };
    const html: Web_ContainersView_ContainersView_RendersAnAccessibleActionsHeader_Html = renderToStaticMarkup(createElement(ContainersView, {
      containers: [container],
      error: null,
      onRefresh: vi.fn(async () => undefined),
      onStartCheck: vi.fn(async () => undefined),
      onStartUpdate: vi.fn(async () => undefined),
      overview,
    }));

    expect(html).toContain('<th class="cell-actions" scope="col"><span class="visually-hidden">Actions</span></th>');

    expect(html).toContain('Updated ');

    expect(html).toContain('<span>Recreated</span> <span>with</span> <span>localhost:</span><wbr/><span>22690/</span><wbr/><span>e2e/</span><wbr/><span>app:</span><wbr/><span>latest</span>');

    expect(html).toContain(`title="${'a'.repeat(64)}"><span>aaaaaaaaaaaa</span>`);

    expect(html).toContain('Managed\u00a0·\u00a0');

    return;
  });

  it('uses Checked for every result other than updated', () => {
    const containers: Web_ContainersView_ContainersView_UsesResultNeutralCheckedLabels_Containers = [
      {
        fullId: 'a'.repeat(64),
        id: 'aaaaaaaaaaaa',
        image: 'example/rolled-back:latest',
        lastAction: 'update',
        lastCheckedAt: '2026-11-06T04:00:00.000Z',
        lastDetail: 'Rolled back',
        lastStatus: 'rolled-back',
        managed: true,
        monitorOnly: false,
        name: 'rolled-back',
        note: 'Managed',
        self: false,
        state: 'running',
      },
      {
        fullId: 'b'.repeat(64),
        id: 'bbbbbbbbbbbb',
        image: 'example/held:latest',
        lastAction: 'update',
        lastCheckedAt: '2026-11-06T04:01:00.000Z',
        lastDetail: 'Held',
        lastStatus: 'held',
        managed: true,
        monitorOnly: false,
        name: 'held',
        note: 'Managed',
        self: false,
        state: 'running',
      },
      {
        fullId: 'c'.repeat(64),
        id: 'cccccccccccc',
        image: 'example/failed:latest',
        lastAction: 'update',
        lastCheckedAt: '2026-11-06T04:02:00.000Z',
        lastDetail: 'Failed',
        lastStatus: 'failed',
        managed: true,
        monitorOnly: false,
        name: 'failed',
        note: 'Managed',
        self: false,
        state: 'running',
      },
      {
        fullId: 'd'.repeat(64),
        id: 'dddddddddddd',
        image: 'example/up-to-date:latest',
        lastAction: 'update',
        lastCheckedAt: '2026-11-06T04:03:00.000Z',
        lastDetail: 'Up to date',
        lastStatus: 'up-to-date',
        managed: true,
        monitorOnly: false,
        name: 'up-to-date',
        note: 'Managed',
        self: false,
        state: 'running',
      },
    ];
    const overview: Web_ContainersView_ContainersView_UsesResultNeutralCheckedLabels_Overview = {
      labelMode: 'opt-out',
      monitorOnly: false,
      running: false,
      schedule: '0 0 4 * * *',
      timeZone: 'UTC',
      totals: {
        cycles: 1,
        failed: 2,
        updated: 0,
      },
    };
    const html: Web_ContainersView_ContainersView_UsesResultNeutralCheckedLabels_Html = renderToStaticMarkup(createElement(ContainersView, {
      containers,
      error: null,
      onRefresh: vi.fn(async () => undefined),
      onStartCheck: vi.fn(async () => undefined),
      onStartUpdate: vi.fn(async () => undefined),
      overview,
    }));

    expect(html.match(/Checked /gu)).toHaveLength(8);

    expect(html).not.toContain('Updated ');

    return;
  });

  it('uses the short result summary instead of recovery detail', () => {
    const container: Web_ContainersView_ContainersView_UsesTheShortResultSummary_Container = {
      fullId: 'a'.repeat(64),
      id: 'aaaaaaaaaaaa',
      image: 'localhost:22690/e2e/a-very-long-repository-name/with-nested-path-segments/app:latest',
      lastAction: 'update',
      lastCheckedAt: '2026-11-06T04:04:13.000Z',
      lastDetail: `New container unhealthy; previous container ${'c'.repeat(64)} used image sha256:${'d'.repeat(64)}; previous container config summary: {"configuredImage":"localhost:22690/e2e/a-very-long-repository-name/with-nested-path-segments/app:latest"}`,
      lastStatus: 'kept-unhealthy',
      lastSummary: 'Replacement failed its startup check; previous container kept as e2e-app-outpost-kept-20261106T040413Z',
      managed: true,
      monitorOnly: false,
      name: 'e2e-app',
      note: 'Managed',
      self: false,
      state: 'running',
    };
    const overview: Web_ContainersView_ContainersView_UsesTheShortResultSummary_Overview = {
      labelMode: 'opt-out',
      monitorOnly: false,
      running: false,
      schedule: '0 0 4 * * *',
      timeZone: 'UTC',
      totals: {
        cycles: 1,
        failed: 1,
        updated: 0,
      },
    };
    const html: Web_ContainersView_ContainersView_UsesTheShortResultSummary_Html = renderToStaticMarkup(createElement(ContainersView, {
      containers: [container],
      error: null,
      onRefresh: vi.fn(async () => undefined),
      onStartCheck: vi.fn(async () => undefined),
      onStartUpdate: vi.fn(async () => undefined),
      overview,
    }));

    expect(html).toContain('Replacement failed its startup check');

    expect(html).not.toContain('previous container config summary');

    expect(html).not.toContain('cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc');

    expect(html).toContain('<span>e2e-</span><wbr/><span>app-</span><wbr/><span>outpost-</span><wbr/><span>kept-</span><wbr/>');

    return;
  });

  return;
});

/**
 * Containers View - Image name.
 *
 * Verifies separators stay with their preceding token, leaving the browser a
 * wrap opportunity only after each registry, path, tag, or digest delimiter.
 *
 * @since 1.1.0
 */
describe('ImageName', () => {
  it('wraps only after image delimiters', () => {
    const html: Web_ContainersView_ImageName_WrapsOnlyAfterImageDelimiters_Html = renderToStaticMarkup(createElement(ImageName, {
      image: 'localhost:22690/e2e/uptodate-app:latest',
    }));

    expect(html).toContain('<span>localhost:</span><wbr/><span>22690/</span><wbr/><span>e2e/</span><wbr/><span>uptodate-app:</span><wbr/><span>latest</span>');

    expect(html).not.toContain('<span>uptodate-</span><wbr/><span>app:</span>');

    return;
  });

  it('keeps long path segments together and shortens full Docker IDs', () => {
    const imageHtml: Web_ContainersView_ImageName_WrapsOnlyAfterImageDelimiters_Html = renderToStaticMarkup(createElement(ImageName, {
      image: `localhost:22690/e2e/a-very-long-repository-name/with-nested-path-segments/app@sha256:${'a'.repeat(64)}`,
    }));

    expect(imageHtml).toContain('<span>a-very-long-repository-name/</span><wbr/>');

    expect(imageHtml).not.toContain('<span>a-very-long-</span>');

    expect(imageHtml).toContain(`data-full-value="${'a'.repeat(64)}" title="${'a'.repeat(64)}">aaaaaaaaaaaa…</span>`);

    return;
  });

  return;
});

/**
 * Containers View - Update Confirmation Dialog.
 *
 * Keeps the unsafe choice off initially and never offers it for Outpost.
 * Server-rendered markup makes both guarantees observable without a browser.
 *
 * @since 1.1.0
 */
describe('UpdateConfirmationDialog', () => {
  it('shows the rollback override off by default for another container', () => {
    const container: Web_ContainersView_UpdateConfirmationDialog_Container = {
      fullId: 'a'.repeat(64),
      id: 'aaaaaaaaaaaa',
      image: 'nginx:1',
      lastStatus: 'available',
      managed: true,
      monitorOnly: false,
      name: 'web',
      note: 'Managed',
      self: false,
      state: 'running',
    };
    const onCancel: Web_ContainersView_UpdateConfirmationDialog_OnCancel = vi.fn();
    const onConfirm: Web_ContainersView_UpdateConfirmationDialog_OnConfirm = vi.fn();
    const html: Web_ContainersView_UpdateConfirmationDialog_Html = renderToStaticMarkup(createElement(UpdateConfirmationDialog, {
      container,
      onCancel,
      onConfirm,
    }));

    expect(html).toContain('type="checkbox"');

    expect(html).toContain('Keep the new container even if it fails its health check');

    expect(html).not.toContain('checked=""');

    return;
  });

  it('hides the rollback override for Outpost', () => {
    const container: Web_ContainersView_UpdateConfirmationDialog_Container = {
      fullId: 'b'.repeat(64),
      id: 'bbbbbbbbbbbb',
      image: 'cbnventures/outpost:latest',
      lastStatus: 'available',
      managed: true,
      monitorOnly: false,
      name: 'outpost',
      note: 'Managed',
      self: true,
      state: 'running',
    };
    const onCancel: Web_ContainersView_UpdateConfirmationDialog_OnCancel = vi.fn();
    const onConfirm: Web_ContainersView_UpdateConfirmationDialog_OnConfirm = vi.fn();
    const html: Web_ContainersView_UpdateConfirmationDialog_Html = renderToStaticMarkup(createElement(UpdateConfirmationDialog, {
      container,
      onCancel,
      onConfirm,
    }));

    expect(html).not.toContain('type="checkbox"');

    expect(html).not.toContain('Keep the new container even if it fails its health check');

    return;
  });

  it('requires rollback to stay off for a held image', () => {
    const container: Web_ContainersView_UpdateConfirmationDialog_Container = {
      fullId: 'c'.repeat(64),
      id: 'cccccccccccc',
      image: 'nginx:1',
      lastDetail: 'Rolled back last time; waiting for a newer image',
      lastStatus: 'held',
      managed: true,
      monitorOnly: false,
      name: 'web',
      note: 'Managed',
      self: false,
      state: 'running',
    };
    const html: Web_ContainersView_UpdateConfirmationDialog_Html = renderToStaticMarkup(createElement(UpdateConfirmationDialog, {
      container,
      onCancel: vi.fn(),
      onConfirm: vi.fn(),
    }));

    expect(html).toContain('Update without rollback');

    expect(html).toContain('waiting for a newer image');

    expect(html).toContain('checked=""');

    expect(html).toContain('disabled=""');

    return;
  });

  return;
});
