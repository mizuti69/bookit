module.exports = {
  el9: {
    "RedhatEL9/CentOSS9セットアップ": [
      'el9/introduction',
      'el9/install',
      {
        type: 'category',
        label: 'ネットワーク設定',
        items: [
          'el9/network_nic',
          'el9/network_hostname',
          'el9/network_security',
        ],
      },
      {
        type: 'category',
        label: 'OS基本設定',
        items: [
          'el9/selinux',
          'el9/systemd',
          'el9/locale',
          'el9/clock',
          'el9/cron',
          'el9/logrotate',
          'el9/ops',
          'el9/journal_log',
        ],
      },
      {
        type: 'category',
        label: 'ユーザー設定',
        items: [
          'el9/user',
          'el9/user_policy',
          'el9/user_create',
          'el9/user_chage',
        ],
      },
      {
        type: 'category',
        label: 'セキュリティ設定',
        items: [
          'el9/security_user',
          'el9/security_firewall',
          'el9/audit',
        ],
      },
      {
        type: 'category',
        label: 'SSH設定',
        items: [
          'el9/ssh',
          'el9/ssh_auth',
          'el9/ssh_sftp',
        ],
      },
      'el9/timedata',
      'el9/update',
      {
        type: 'category',
        label: 'Tips',
        items: [
          'el9/tools',
          'el9/sysstat',
        ],
      },
    ],
  },
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
  /*
  el7: {
    "RedhatEL7/CentOS7 セットアップ": [
      'el7/introduction',
    ],
  },
  */
  others: {
    "その他": [
      {
        type: 'category',
        label: 'HTTPD',
        items: [
          'others/apache24',
          'others/apache24_php',
        ],
      },
      {
        type: 'category',
        label: 'SMTPサーバ',
        items: [
          'others/postfix',
          'others/postfix_server',
          'others/postfix_client',
          'others/postfix_transport',
          'others/postfix_blacklist',
        ],
      },
      {
        type: 'category',
        label: 'MySQL',
        items: [
          'others/mysql',
        ],
      },
      {
        type: 'category',
        label: 'Fsecure',
        items: [
          'others/fsecure',
        ],
      },
    ],
  },
};
