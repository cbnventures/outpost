import { NovaIdentity } from '@cbnventures/nova/toolkit';

import type { DocusaurusNovaConfig } from '@cbnventures/docusaurus-preset-nova/types/config';

/**
 * Docusaurus - Identity.
 *
 * Reads the documentation identity from the generated Nova configuration.
 * Fallbacks keep the site runnable while consumers finish project metadata.
 *
 * @since 0.0.0
 */
const identity = new NovaIdentity().forDocs();

/**
 * Docusaurus - Config.
 *
 * Configures the Outpost documentation site with Nova's signal preset, the
 * docs and blog plugins, local search, and Outpost-specific navigation.
 *
 * @since 0.0.0
 */
const config: DocusaurusNovaConfig = {
  // Site Metadata.
  title: identity['title'] ?? 'Outpost',
  titleDelimiter: '-',
  tagline: identity['tagline'] ?? 'Self-hosted container auto-updater for Docker, a modern Watchtower replacement',
  favicon: './favicon.ico',

  // Deployment.
  url: identity['url'] ?? 'https://outpost.cbnventures.io',
  baseUrl: identity['baseUrl'] ?? '/',
  organizationName: identity['organizationName'] ?? 'cbnventures',
  projectName: identity['projectName'] ?? 'outpost',
  trailingSlash: true,
  noIndex: false,

  // Error Handling.
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  onDuplicateRoutes: 'throw',

  // Head Tags.
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        property: 'og:type',
        content: 'website',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: `${identity['baseUrl'] ?? '/'}apple-touch-icon.png`,
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: `${identity['baseUrl'] ?? '/'}favicon-96x96.png`,
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/svg+xml',
        href: `${identity['baseUrl'] ?? '/'}favicon.svg`,
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'manifest',
        href: `${identity['baseUrl'] ?? '/'}site.webmanifest`,
      },
    },
  ],

  // Markdown.
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
      onBrokenMarkdownImages: 'throw',
    },
  },

  // Internationalization.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Presets (Nova).
  presets: [[
    '@cbnventures/docusaurus-preset-nova',
    {
      // Preset Identity.
      preset: 'foundry',

      // Preset Overrides (undefined = use preset default).
      overrides: {
        colors: {
          primary: {
            light: '#1565C0',
            dark: '#1565C0',
          },
          secondary: {
            light: '#D97706',
            dark: '#D97706',
          },
          text: undefined,
          border: undefined,
          warning: undefined,
          danger: undefined,
        },
        fonts: {
          display: undefined,
          body: undefined,
          code: undefined,
        },
        navbar: undefined,
        footer: undefined,
      },

      // Plugins.
      plugins: {
        docs: {
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        blog: {
          routeBasePath: 'blog',
          showReadingTime: true,
          blogTitle: 'Blog',
          blogDescription: 'Release notes, upgrade guides, and notes on keeping Docker containers current without breaking them.',
          postsPerPage: 10,
          blogSidebarTitle: 'Recent Posts',
          blogSidebarCount: 15,
          feedOptions: {
            type: [
              'rss',
              'atom',
            ],
            copyright: identity['copyright'] ?? '',
            limit: 20,
            title: 'Outpost Blog',
            description: 'Release notes, upgrade guides, and notes on keeping Docker containers current without breaking them.',
          },
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/docs/tags/**'],
          filename: 'sitemap.xml',
        },
      },

      // Search.
      search: {
        indexDocs: true,
        indexBlog: true,
        indexPages: true,
        docsRouteBasePath: 'docs',
        hashed: true,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        searchBarShortcutKeymap: 'mod+k',
        searchResultLimits: 8,
      },

      // Progress Bar.
      progressBar: true,
    },
  ]],

  // Theme Config.
  themeConfig: {
    // Site.
    site: {
      logo: {
        alt: 'Outpost',
        src: {
          light: '/images/navbar.svg',
          dark: undefined,
        },
        href: '/',
      },
      image: '/thumbnails/brand.png',
      metadata: [
        {
          name: 'description',
          content: identity['metaDescription'] ?? 'Self-hosted container auto-updater for Docker, a modern Watchtower replacement',
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
      ],
    },

    // Color Mode.
    colorMode: {
      defaultMode: 'system',
      disableSwitch: false,
    },

    // Navbar.
    navbar: {
      title: 'Outpost',
      hideOnScroll: false,
      items: [
        {
          label: 'Docs',
          position: 'left',
          to: '/docs/overview/',
          icon: 'lucide:book-open',
          activeBaseRegex: '^/docs/(?!features)',
        },
        {
          label: 'Features',
          position: 'left',
          to: '/docs/features/labels-and-modes/',
          icon: 'lucide:container',
          activeBasePath: '/docs/features',
        },
        {
          label: 'Blog',
          position: 'left',
          to: '/blog/',
          icon: 'lucide:pen-line',
        },
        {
          label: 'Docker Hub',
          position: 'right',
          href: 'https://hub.docker.com/r/cbnventures/outpost',
          icon: 'lucide:package',
        },
        {
          label: 'GitHub',
          position: 'right',
          href: 'https://github.com/cbnventures/outpost',
          icon: 'lucide:github',
        },
      ],
    },

    // Docs.
    docs: {
      sidebar: {
        hideable: false,
        autoCollapseCategories: false,
      },
    },

    // Blog.
    blog: {
      sidebar: {
        groupByYear: true,
      },
      layout: {
        heading: 'Blog',
        description: 'Release notes and upgrade guides',
      },
      share: {
        platforms: [
          'linkedin',
          'reddit',
          'facebook',
          'x',
          'copy',
        ],
      },
    },

    // Table of Contents.
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },

    // Back to Top Button.
    backToTopButton: true,

    // Error Pages - overrides Nova's randomized defaults with consumer copy.
    errorPages: {
      notFound: {
        title: 'No container by that name.',
        description: 'This page was never pulled. Head back to the docs index to find what you were looking for.',
        backHomeLabel: 'Back to the docs',
      },
      errorPageContent: {
        title: 'This page turned unhealthy.',
        retryLabel: 'Roll back and retry',
      },
      error: {
        retryLabel: 'Retry the update',
      },
    },

    // Footer.
    footer: {
      sections: {
        docs: [
          {
            label: 'Quick Start',
            href: '/docs/getting-started/quick-start/',
          },
          {
            label: 'Configuration',
            href: '/docs/getting-started/configuration/',
          },
          {
            label: 'Migrating from Watchtower',
            href: '/docs/reference/migrating-from-watchtower/',
          },
          {
            label: 'Troubleshooting',
            href: '/docs/reference/troubleshooting/',
          },
        ],
        resources: [
          {
            label: 'Blog',
            href: '/blog/',
          },
          {
            label: 'Docker Hub',
            href: 'https://hub.docker.com/r/cbnventures/outpost',
          },
          {
            label: 'GitHub',
            href: 'https://github.com/cbnventures/outpost',
          },
        ],
        company: [
          {
            label: 'About',
            href: 'https://www.cbnventures.io/',
          },
          {
            label: 'Get In Touch',
            href: 'https://www.cbnventures.io/get-in-touch/',
          },
        ],
        legal: [
          {
            label: 'Terms of Use',
            href: 'https://www.cbnventures.io/terms/',
          },
          {
            label: 'Privacy Policy',
            href: 'https://www.cbnventures.io/privacy/',
          },
        ],
      },
      layout: {
        docs: {
          title: 'Docs',
          section: 'docs',
        },
        resources: {
          title: 'Resources',
          section: 'resources',
        },
        company: {
          title: 'Company',
          section: 'company',
        },
        legal: {
          title: 'Legal',
          section: 'legal',
        },
      },
      socialLinks: [
        {
          icon: 'ri:facebook-fill',
          href: 'https://www.facebook.com/cbnventures',
          label: 'Facebook',
        },
        {
          icon: 'ri:twitter-x-fill',
          href: 'https://x.com/cbnventures',
          label: 'X',
        },
        {
          icon: 'ri:youtube-fill',
          href: 'https://www.youtube.com/@cbnventures',
          label: 'YouTube',
        },
        {
          icon: 'ri:instagram-fill',
          href: 'https://www.instagram.com/cbnventures/',
          label: 'Instagram',
        },
        {
          icon: 'ri:github-fill',
          href: 'https://github.com/cbnventures',
          label: 'GitHub',
        },
        {
          icon: 'ri:google-play-fill',
          href: 'https://play.google.com/store/apps/dev?id=6419450160526226105',
          label: 'Google Play',
        },
        {
          icon: 'ri:linkedin-fill',
          href: 'https://www.linkedin.com/company/cbnventures/',
          label: 'LinkedIn',
        },
      ],
      copyright: identity['copyright'],
      credit: true,
      cta: {
        label: 'Start with the Quick Start',
        href: '/docs/getting-started/quick-start/',
      },
    },
  },
};

export default config;
