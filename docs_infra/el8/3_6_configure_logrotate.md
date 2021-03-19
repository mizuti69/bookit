---
id: logrotate
title: "ログのローテート"
---
import { LinkTag } from './basecomponent.jsx';

## logrotatedの設定  
CentOS / Redhat ではOSやシステムのログ管理ツールとして logrotated がインストールされている  
環境や利用用途にあわせ適切なローテート間隔、保持期間を設定する  

ローテートファイルの保持世代数  

```
# vim /etc/logrotate.conf
# keep 4 weeks worth of backlogs
rotate 100
```

ローテート後に新しいログファイルを作成  

```
# create new (empty) log files after rotating old ones
create
```

ローテート後ファイルの接尾辞  

```
# use date as a suffix of the rotated file
dateext
```

ローテート後ファイルの圧縮処理有無  

```
# uncomment this if you want your log files compressed
compress
```

## サービス毎のログローテート設定
システムに関するログはデフォルトでローテートされるよう設定されているが不要なものもあるので修正する  

### syslog
デフォルトではログファイルが空でもローテートするようになっており、  
ゴミログファイルが作成されてしまうので空のログファイルはローテートしないよう修正  

```
# vim /etc/logrotate.d/syslog

/var/log/cron
/var/log/maillog
/var/log/messages
/var/log/secure
#/var/log/spooler
{
    missingok
    notifempty
    sharedscripts
    postrotate
        /bin/kill -HUP `cat /var/run/syslogd.pid 2> /dev/null` 2> /dev/null || true
    endscript
}
```

### bootlog  
空の場合はローテートしないように修正  

```
# vm /etc/logrotate.d/bootlog

/var/log/boot.log
{
    missingok
    notifempty
    daily
    copytruncate
    rotate 7
}
```
