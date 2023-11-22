---
id: cron
title: "ジョブ管理ツール"
---
import { LinkTag } from './basecomponent.jsx';

## タスクツールの概要  
Redhat8以降、systemdが導入されたこともありシステムジョブ管理は cron / anacron から systemd timer に移行されていっている  
cron / anacron にちては Redhat9 時点では引き続き導入されていて利用できるが今後非推奨になることが想定される  

## cron / anacronの設定
システム上のジョブの多くが systemd timer に移行されていて、OSデフォルトで利用するジョブについてはすでに cron / anacron はほとんど利用されていない  
そのため最低限の設定変更のみ行う  

```
# cat /etc/anacrontab
# /etc/anacrontab: configuration file for anacron

# See anacron(8) and anacrontab(5) for details.

SHELL=/bin/sh
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=root
# the maximal random delay added to the base delay of the jobs
RANDOM_DELAY=45
# the jobs will be started during the following hours only
START_HOURS_RANGE=3-22

#period in days   delay in minutes   job-identifier   command
1       5       cron.daily              nice run-parts /etc/cron.daily
7       25      cron.weekly             nice run-parts /etc/cron.weekly
@monthly 45     cron.monthly            nice run-parts /etc/cron.monthly
```

ファイル内で定義されているジョブはすべて、ランダムに 6 分から 45 分の間で遅延することになり、3:00 時から 22:00 時の間に実行できます。
最初に定義してあるジョブは `days` の値が `5` となっているため 3:11 時から 22:00 時の間に実行されます  
このジョブに指定されているコマンドは、run-parts スクリプトを使って `/etc/cron.daily` ディレクトリ内にあるすべての現行プログラムを実行します  
デフォルトではシステムで定期実行（日次、週次、月次）されるジョブは anacrontab でジョブ実行、管理されている  

cron、anacronでランダム実行されるシステムジョブはほぼ無いが、実行時間が広すぎるため要件に応じて調整する  

```
# vim /etc/anacrontab
START_HOURS_RANGE=1-8
```

## Systemd Timerについて
<LinkTag url="https://wiki.archlinux.jp/index.php/Systemd/%E3%82%BF%E3%82%A4%E3%83%9E%E3%83%BC">systemd/タイマー</LinkTag>  
※redhat公式ドキュメントみあたらず  

timer ジョブ一覧  

```
# systemctl list-timers
NEXT                        LEFT     LAST                        PASSED    UNIT                         ACTIVATES      >
Thu 2023-10-26 14:54:29 JST 8s left  -                           -         dnf-makecache.timer          dnf-makecache.s>
Fri 2023-10-27 00:00:00 JST 9h left  Thu 2023-10-26 13:56:33 JST 57min ago logrotate.timer              logrotate.servi>
Fri 2023-10-27 14:11:34 JST 23h left Thu 2023-10-26 14:11:34 JST 42min ago systemd-tmpfiles-clean.timer systemd-tmpfile>
-                           -        Thu 2023-10-26 14:54:20 JST 3ms ago   nm-cloud-setup.timer         nm-cloud-setup.>

4 timers listed.
```

システムログのローテートは timer で管理されていて、定義ファイルは下記に配置されている  

```
# ls -l /etc/systemd/system/timers.target.wants/
total 0
lrwxrwxrwx. 1 root root 43 May  3 18:00 dnf-makecache.timer -> /usr/lib/systemd/system/dnf-makecache.timer
lrwxrwxrwx. 1 root root 39 May  3 18:00 logrotate.timer -> /usr/lib/systemd/system/logrotate.timer
lrwxrwxrwx. 1 root root 44 May  3 18:01 nm-cloud-setup.timer -> /usr/lib/systemd/system/nm-cloud-setup.timer
```

### timer ジョブの作成  
systemd timer ジョブは下記 コマンドやジョブの実行環境を定義する service ファイルと、実行日時や周期を定義する timer ファイル２つで管理を行う  
logrotateで見た場合  

* serviceファイル  

```
# cat /usr/lib/systemd/system/logrotate.service
[Unit]
Description=Rotate log files
Documentation=man:logrotate(8) man:logrotate.conf(5)
RequiresMountsFor=/var/log
ConditionACPower=true

[Service]
Type=oneshot
ExecStart=/usr/sbin/logrotate /etc/logrotate.conf

# performance options
Nice=19
IOSchedulingClass=best-effort
IOSchedulingPriority=7

# hardening options
#  details: https://www.freedesktop.org/software/systemd/man/systemd.exec.html
#  no ProtectHome for userdir logs
#  no PrivateNetwork for mail deliviery
#  no NoNewPrivileges for third party rotate scripts
#  no RestrictSUIDSGID for creating setgid directories
LockPersonality=true
MemoryDenyWriteExecute=true
PrivateDevices=true
PrivateTmp=true
ProtectClock=true
ProtectControlGroups=true
ProtectHostname=true
ProtectKernelLogs=true
ProtectKernelModules=true
ProtectKernelTunables=true
ProtectSystem=full
RestrictNamespaces=true
RestrictRealtime=true

```

* timerファイル  

```
# cat /usr/lib/systemd/system/logrotate.timer
[Unit]
Description=Daily rotation of log files
Documentation=man:logrotate(8) man:logrotate.conf(5)

[Timer]
OnCalendar=daily
AccuracySec=1h
Persistent=true

[Install]
WantedBy=timers.target
```

logrotateジョブは**最初に起動したタイミングから日時で実行**になっている  
さらに `AccuracySec` で最大1時間ランダムでズレる仕様になっている、運用上いつ実行されるか不明確なのは困る場合明確な日時を指定する  


cron的な onCalender の定義の仕方  

| onCalendar | 同等のフル書式 | 日本語での意味 |
| --- | --- | --- |
| minutely | `*-*-* *:*:00` | 毎分 |
| hourly | `*-*-* *:00:00` | 毎時 |
| daily | `*-*-* 00:00:00` | 日次 |
| monthly | `*-*-01 00:00:00` | 月次 |
| weekly | `Mon *-*-* 00:00:00` | 週次 |
