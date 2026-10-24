import {
  BlogPreview,
  Features,
  Hero,
  InstallStrip,
  Stats,
} from '@cbnventures/docusaurus-preset-nova/blocks';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';

import type {
  Pages_Index_Home_BlogEnabled,
  Pages_Index_Home_Returns,
} from '../types/pages/index.d.ts';

/**
 * Index - Blog Enabled.
 *
 * Keeps the preset-native blog preview aligned with the content model selected
 * when Nova generated this documentation workspace.
 *
 * @since 0.0.0
 */
const blogEnabled: Pages_Index_Home_BlogEnabled = Boolean({ routeBasePath: 'blog' });

/**
 * Index - Home.
 *
 * Composes the Outpost landing page: hero, one-line install, feature grid,
 * key numbers, and the latest blog posts.
 *
 * @returns {Pages_Index_Home_Returns}
 *
 * @since 0.0.0
 */
function Home(): Pages_Index_Home_Returns {
  return (
    <Layout>
      <Head>
        <title>Outpost - Self-Hosted Container Updater for Docker</title>
        <meta name="description" content="Outpost keeps Docker containers on the latest image, recreates them with their original settings, and rolls back automatically when an update breaks." />
      </Head>
      <Hero
        eyebrow="Container Auto-Updater for Docker"
        heading="Keep every container current, and roll back when an update breaks."
        tagline="Outpost checks your registries on a schedule, recreates containers on new images with their settings, volumes, and networks intact, and restores the old container if the new one fails. A modern, non-root Watchtower replacement."
        ctaLabel="Read the Docs"
        ctaLink="/docs/overview/"
        secondaryCtaLabel="Quick Start"
        secondaryCtaLink="/docs/getting-started/quick-start/"
      />
      <main>
        <InstallStrip command="docker pull cbnventures/outpost" copyTarget="block" />
        <Features
          heading="Updates you can leave running"
          items={[
            {
              icon: 'lucide:undo-2',
              title: 'Automatic Rollback',
              description: 'If the new container stops or reports unhealthy, Outpost removes it and starts the previous container again under its original name.',
            },
            {
              icon: 'lucide:hard-drive',
              title: 'Safe Recreation',
              description: 'Environment, labels, ports, every network, and volumes (including anonymous ones) carry over, while stale defaults from the old image are dropped.',
            },
            {
              icon: 'lucide:fingerprint',
              title: 'Digest-First Checks',
              description: 'Outpost asks the registry for the current digest before pulling, so an up-to-date container is never downloaded again.',
            },
            {
              icon: 'lucide:tags',
              title: 'Label Control',
              description: 'Update everything except what you label off, or only what you label on. Mark individual containers as monitor-only.',
            },
            {
              icon: 'lucide:bell',
              title: 'Notifications',
              description: 'Get an ntfy push or a JSON webhook when a cycle updates, finds, or fails something. Quiet cycles stay quiet.',
            },
            {
              icon: 'lucide:layout-dashboard',
              title: 'Web Dashboard',
              description: 'See every container, the next check, and the last 50 results in your browser, and start a check with one click.',
            },
            {
              icon: 'lucide:activity',
              title: 'HTTP API and Metrics',
              description: 'Trigger a cycle, read the last report, and scrape Prometheus metrics behind a bearer token.',
            },
          ]}
        />
        <Stats
          heading="By the Numbers"
          surface="alt"
          items={[
            {
              value: '1',
              label: 'Socket mount to get started',
              color: 'primary',
            },
            {
              value: '0',
              label: 'Root privileges for the updater process',
              color: 'accent',
            },
            {
              value: '0',
              label: 'Image downloads for an up-to-date container',
              color: 'primary',
            },
            {
              value: '2',
              label: 'Architectures: amd64 and arm64',
              color: 'accent',
            },
          ]}
        />
        {(blogEnabled === true) && (
          <BlogPreview
            heading="From the Blog"
            description="Release notes and upgrade guides."
            auto={true}
            limit={3}
            sort="newest"
          />
        )}
      </main>
    </Layout>
  );
}

export default Home;
