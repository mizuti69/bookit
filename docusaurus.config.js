/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Bookit',
  tagline: 'Study bookshelf for yourself',
  url: 'https://bookit-update.netlify.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.png',
  organizationName: 'mizuti69', // Usually your GitHub org/user name.
  projectName: 'bookit', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Bookit',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.png',
      },
      items: [
        //{to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/mizuti69/bookit',
          label: 'GitHub',
          position: 'right',
        },
        /*{
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },*/
        {
          label: 'Infra',
          position: 'left',
          items: [
            {
              label: 'RedhatEL/CentOSS9 セットアップ',
              to: '/docs_infra/el9/introduction',
            },
            {
              label: 'RedhatEL/CentOS8 セットアップ',
              to: '/docs_infra/el8/introduction',
            },
            /*
            {
              label: 'RedhatEL/CentOS7 セットアップ',
              to: '/docs_infra/el7/introduction',
            },
            */
            {
              label: 'その他',
              to: '/docs_infra/others/fsecure',
            },
          ],
        },
        {
          label: 'SaaS',
          position: 'left',
          items: [
            {
              label: 'AWS',
              to: '/docs_saas/aws/',
            },
          ],
        },
        {
          label: 'IoT/MiCon',
          position: 'left',
          items: [
            {
              label: 'RaspberryPi',
              to: '/docs_iot/raspberrypi/',
            },
            {
              label: 'Arduino',
              to: '/docs_iot/arduino/',
            },
          ],
        },
      ],
    },
    footer: {
      style: 'dark',
      /*links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'docs/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      */
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        /*
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/mizuti69/bookit/edit/master',
        },
        */
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        /*
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          trailingSlash: false,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
        */
      },
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'infra',
        path: 'docs_infra',
        routeBasePath: 'docs_infra',
        sidebarPath: require.resolve('./sidebarsInfra.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'saas',
        path: 'docs_saas',
        routeBasePath: 'docs_saas',
        sidebarPath: require.resolve('./sidebarsAws.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'iot',
        path: 'docs_iot',
        routeBasePath: 'docs_iot',
        sidebarPath: require.resolve('./sidebarsIot.js'),
      },
    ],
    /*
    [
      '@docusaurus/plugin-ideal-image',
    ],
    */
  ],
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja'],
    localeConfigs: {
      ja: {
        label: '日本語',
        direction: 'ltr',
      },
    },
  },
};
