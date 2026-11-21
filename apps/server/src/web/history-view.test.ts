import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  describe,
  expect,
  it,
} from 'vitest';

import { ResultList } from '@/web/history-view.tsx';

import type {
  Web_HistoryView_ResultList_SeparatesSummariesFromFullDetail_CompactHtml,
  Web_HistoryView_ResultList_SeparatesSummariesFromFullDetail_FullHtml,
  Web_HistoryView_ResultList_SeparatesSummariesFromFullDetail_Result,
} from '@/types/web/history-view.test.d.ts';

/**
 * History View - Result List.
 *
 * Keeps compact overview rows short while expanded history retains recovery
 * detail. Long image references and Docker IDs use the shared safe tokens.
 *
 * @since 1.1.0
 */
describe('ResultList', () => {
  it('separates summaries from full detail', () => {
    const result: Web_HistoryView_ResultList_SeparatesSummariesFromFullDetail_Result = {
      container: 'e2e-app',
      detail: `New container unhealthy; replacement ${'d'.repeat(64)} was kept. Previous image sha256:${'e'.repeat(64)}; previous container config summary: {"configuredImage":"localhost:22690/e2e/a-very-long-repository-name/with-nested-path-segments/app:latest"}`,
      image: 'localhost:22690/e2e/a-very-long-repository-name/with-nested-path-segments/app:latest',
      status: 'kept-unhealthy',
      summary: 'Replacement failed its startup check; previous container kept as e2e-app-outpost-kept-20261106T040413Z',
    };
    const compactHtml: Web_HistoryView_ResultList_SeparatesSummariesFromFullDetail_CompactHtml = renderToStaticMarkup(createElement(ResultList, {
      compact: true,
      results: [result],
    }));
    const fullHtml: Web_HistoryView_ResultList_SeparatesSummariesFromFullDetail_FullHtml = renderToStaticMarkup(createElement(ResultList, {
      results: [result],
    }));

    expect(compactHtml).toContain('Replacement failed its startup check');

    expect(compactHtml).not.toContain('previous container config summary');

    expect(compactHtml).toContain('<span>e2e-</span><wbr/><span>app-</span><wbr/><span>outpost-</span><wbr/><span>kept-</span><wbr/>');

    expect(compactHtml).toContain('\u00a0·\u00a0');

    expect(fullHtml).toContain('previous container config summary');

    expect(fullHtml).toContain(`data-full-value="${'d'.repeat(64)}" title="${'d'.repeat(64)}">dddddddddddd…</span>`);

    expect(fullHtml).toContain('<span>a-very-long-repository-name/</span><wbr/>');

    expect(fullHtml).not.toContain('<span>a-very-long-</span>');

    return;
  });

  return;
});
