/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Bookit',
  tagline: 'Study bookshelf for yourself',
  url: 'https://bookit-update.netlify.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'mizuti69', // Usually your GitHub org/user name.
  projectName: 'bookit', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Bookit',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
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
              label: 'RedhatEL/CentOS8',
              to: '/docs_infra/el8/index',
            },
            {
              label: 'RedhatEL/CentOS7',
              to: '/docs_infra/el7/index',
            },
          ],
        },
        /*
        {
          label: 'Code/Soft',
          position: 'left',
          items: [
            {
              label: 'Ansible',
              to: '/docs_code/ansible',
            },
            {
              label: 'AWS CDK',
              to: '/docs_code/aws_cdk',
            },
          ],
        },
        */
        {
          label: 'IoT/MiCon',
          position: 'left',
          items: [
            {
              label: 'RaspberryPi',
              to: '/docs_iot/raspberrypi/index',
            },
            {
              label: 'Arduino',
              to: '/docs_iot/arduino/index',
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
};
