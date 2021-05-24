module.exports = {
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
        label: 'ユーザー設定',
        items: [
          'el8/user',
          'el8/user_policy',
          'el8/user_create',
          'el8/user_chage',
        ],
      },
      {
        type: 'category',
        label: 'セキュリティ設定',
        items: [
          'el8/security_user',
          'el8/security_service',
          'el8/security_firewall',
        ],
      },
      {
        type: 'category',
        label: 'SSH設定',
        items: [
          'el8/ssh',
          'el8/ssh_auth',
          'el8/ssh_sftp',
        ],
      },
      'el8/timedata',
      'el8/update',
      {
        type: 'category',
        label: 'Tips',
        items: [
          'el8/rsyslog',
          'el8/tools',
          'el8/sysstat',
          'el8/audit',
          'el8/nfs',
        ],
      },
    ],
  },
  el7: {
    "RedhatEL7/CentOS7 セットアップ": [
      'el7/introduction',
      {
        type: 'category',
        label: 'OSインストール',
        items: [
          'el8/install',
          'el8/subscribe',
        ],
      },
    ],
  },
  smtp: {
    "Postfix セットアップ": [
      'smtp/postfix',
      'smtp/postfix_server',
      'smtp/postfix_client',
      'smtp/postfix_transport',
      'smtp/postfix_blacklist',
    ],
  },
  tools: {
    "Fsecure CLE Linux": [
      'others/fsecure',
    ],
  },
};
