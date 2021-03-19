module.exports = {
  /*
  docs: [
    {
      type: 'category',
      label: 'Docusaurus Tutorial',
      items: [
        'getting-started',
        'create-a-page',
        'create-a-document',
        'create-a-blog-post',
        'markdown-features',
        'thank-you',
      ],
    },    
  ],
  */
  el8: {
    "RedhatEL8/CentOS8セットアップ": [
      'el8/introduction',
      {
        type: 'category',
        label: 'OSインストール',
        items: [
          'el8/install',
          'el8/subscribe',
        ],
      },
      {
        type: 'category',
        label: 'ネットワーク設定',
        items: [
          'el8/network_nic',
          'el8/network_hostname',
          'el8/network_security',
        ],
      },
      {
        type: 'category',
        label: 'OS基本設定',
        items: [
          'el8/selinux',
          'el8/systemd',
          'el8/locale',
          'el8/clock',
          'el8/cron',
          'el8/logrotate',
          'el8/ops',
          'el8/cockpit',
        ],
      },
      {
        type: 'category',
        label: 'Tips',
        items: [
          'el8/rsyslog',
        ],
      },
    ],
  },
  el7: {
    "RedhatEL7/CentOS7 セットアップ": [
      'el7/index',
    ],
  },
};
