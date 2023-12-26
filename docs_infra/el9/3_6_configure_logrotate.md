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

### logrotateの任意時間帯指定
デフォルトでは logrotate は systemd timer でランダム性を持って実行されるため、任意の時間帯に固定する  

```
# vim /usr/lib/systemd/system/logrotate.timer
[Unit]
Description=Daily rotation of log files
Documentation=man:logrotate(8) man:logrotate.conf(5)

[Timer]
OnCalendar=*-*-* 0:00:00
AccuracySec=10m
Persistent=true

[Install]
WantedBy=timers.target
```

`OnCalendar`を任意の時間帯（例は毎日0時）に設定し、`AccuracySec`も10分程度のラグにしておく  

設定の反映  

```
# systemctl daemon-reload

# systemctl list-timers
NEXT                        LEFT          LAST                        PASSED       UNIT                         ACTIVAT>
Fri 2023-10-27 00:00:00 JST 12h left      Thu 2023-10-26 13:56:33 JST 2h 17min ago logrotate.timer              logrota>
```

:::warning 注意
systemd-timer は cron の代替であるため、デフォルトでは1日に1回しかローテート処理を行わないということになる  
logrotate.conf 等でいくら時間単位のローテート設定を定義しても処理が行われる timer が daily では意味がないため、timer の設定は 最短のローテート頻度設定に基づいて定義する必要がある？  
:::

## サービス毎のログローテート設定
システムに関するログはデフォルトでローテートされるよう設定されているが不要なものもあるので修正する  

### syslog
デフォルトではログファイルが空でもローテートするようになっており、  
ゴミログファイルが作成されてしまうので空のログファイルはローテートしないよう修正  

```
# vim /etc/logrotate.d/rsyslog

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

### btmpログ  
空の場合はローテートしないように修正  

```
# vm /etc/logrotate.d/btmp

/var/log/btmp {
    missingok
    notifempty
    monthly
    create 0660 root utmp
    rotate 1
}
```
