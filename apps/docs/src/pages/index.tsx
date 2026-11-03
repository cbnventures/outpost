import {
  BlogPreview,
  Canvas,
  Features,
  InstallStrip,
  Stats,
} from '@cbnventures/docusaurus-preset-nova/blocks';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';

import styles from './index.module.css';

import type {
  Pages_Index_Home_BlogEnabled,
  Pages_Index_Home_Returns,
} from '../types/pages/index.d.ts';

/**
 * Pages - Blog Enabled.
 *
 * Keeps the preset-native blog preview aligned with the content model selected
 * when Nova generated this documentation workspace.
 *
 * @since 0.0.0
 */
const blogEnabled: Pages_Index_Home_BlogEnabled = Boolean({ routeBasePath: 'blog' });

/**
 * Pages - Home.
 *
 * Composes the Outpost landing page: hero with a copy of the dashboard overview,
 * one-line install, feature grid, key numbers, and the latest blog posts.
 *
 * @returns {Pages_Index_Home_Returns}
 *
 * @since 0.0.0
 */
function Home(): Pages_Index_Home_Returns {
  return (
    <Layout description="Outpost keeps Docker containers on the latest image, recreates them with their original settings, and rolls back automatically when an update breaks.">
      <Head>
        <title>Outpost - Self-Hosted Container Updater for Docker</title>
      </Head>
      <Canvas container="full" className={styles['hero']}>
        <div className={styles['hero-inner']}>
          <div className={styles['hero-content']}>
            <p className="nova-hero-eyebrow">Container Auto-Updater for Docker</p>
            <Heading as="h1" className="nova-hero-heading">
              Keep every container current, and roll back when an update breaks.
            </Heading>
            <p className="nova-hero-tagline">
              Outpost checks your registries on a schedule, recreates containers on new images with their settings, volumes, and networks intact, and restores the old container if the new one fails. A modern, non-root Watchtower replacement.
            </p>
            <div className={`nova-hero-actions ${styles['hero-actions']}`}>
              <Link className="nova-cta-primary" to="/docs/overview/">Read the Docs</Link>
              <Link className="nova-cta-secondary" to="/docs/getting-started/quick-start/">Quick Start</Link>
            </div>
          </div>
          <div className={styles['dashboard']} aria-hidden="true">
            <div className={styles['dashboard-header']}>
              <p className={styles['dashboard-title']}>Overview</p>
              <span className={styles['dashboard-button']}>Check now</span>
            </div>
            <dl className={styles['dashboard-stats']}>
              <div className={styles['dashboard-stat']}>
                <dt className={styles['dashboard-stat-label']}>Status</dt>
                <dd className={styles['dashboard-stat-value']}>
                  <span className={`${styles['badge']} ${styles['badge-success']}`}>Idle</span>
                </dd>
              </div>
              <div className={styles['dashboard-stat']}>
                <dt className={styles['dashboard-stat-label']}>Managed containers</dt>
                <dd className={styles['dashboard-stat-value']}>12</dd>
              </div>
              <div className={styles['dashboard-stat']}>
                <dt className={styles['dashboard-stat-label']}>Last check</dt>
                <dd className={styles['dashboard-stat-value']}>6 min ago</dd>
              </div>
              <div className={styles['dashboard-stat']}>
                <dt className={styles['dashboard-stat-label']}>Next check</dt>
                <dd className={styles['dashboard-stat-value']}>in 54 min</dd>
              </div>
            </dl>
            <p className={styles['dashboard-section-title']}>Last check results</p>
            <ul className={styles['result-list']}>
              <li className={styles['result']}>
                <span className={styles['result-text']}>
                  <span className={styles['result-name']}>jellyfin</span>
                  <span className={styles['result-image']}>jellyfin/jellyfin:latest</span>
                </span>
                <span className={`${styles['badge']} ${styles['badge-success']}`}>Updated</span>
              </li>
              <li className={styles['result']}>
                <span className={styles['result-text']}>
                  <span className={styles['result-name']}>vaultwarden</span>
                  <span className={styles['result-image']}>vaultwarden/server:latest</span>
                </span>
                <span className={`${styles['badge']} ${styles['badge-success']}`}>Up to date</span>
              </li>
              <li className={styles['result']}>
                <span className={styles['result-text']}>
                  <span className={styles['result-name']}>home-assistant</span>
                  <span className={styles['result-image']}>ghcr.io/home-assistant/home-assistant:stable</span>
                </span>
                <span className={`${styles['badge']} ${styles['badge-warning']}`}>Rolled back</span>
              </li>
              <li className={styles['result']}>
                <span className={styles['result-text']}>
                  <span className={styles['result-name']}>immich-server</span>
                  <span className={styles['result-image']}>ghcr.io/immich-app/immich-server:release</span>
                </span>
                <span className={`${styles['badge']} ${styles['badge-primary']}`}>Update available</span>
              </li>
            </ul>
          </div>
        </div>
      </Canvas>
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
              description: 'Get alerts in ntfy, Telegram, Discord, email, and more when containers update, new images appear, or an update fails. Quiet checks stay quiet.',
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
              value: '50',
              label: 'Checks kept in the dashboard history',
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
