---
id: cron
title: "ジョブ管理ツール"
---
import { LinkTag } from './basecomponent.jsx';

## タスクツールの概要  
<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/6/html/deployment_guide/ch-automating_system_tasks">システムタスクの自動化</LinkTag>  

Red Hat Enterprise Linux は、cron、anacron、at、 batch といった自動化タスクユーティリティを備えています。  
Cron は、最高で 1 分おきの頻度でジョブの実行が可能です。しかし、ユーティリティはシステムが継続的に稼働状態であることを前提としており、ジョブがスケジュールされている時にシステムが稼働していない場合は、ジョブは実行されません。  
Anacron は、ジョブがスケジュールされている時点でシステムが稼働していなくても、ジョブを記憶しています。そして、次回にシステムが立ち上がった時にジョブを実行します。しかし、Anacron は１日に１回しかジョブを実行できません。  

## anacronの設定
anacron はジョブに対して「指定時刻の範囲内で実行する」ように定義する  
例えば下記のように anacrontab ジョブが定義されていた場合  

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
その場合ログローテート処理等も ランダムな時間で実行されるようになってしまうため、ジョブ管理上問題が発生する  
そのため本手順では anacron の設定を従来どおり cron でのジョブ管理をメインとし、cron ジョブがシステム停止等で実行されなかった場合に anacron 経由で実行を試みる構成に戻す  

### anacron遅延実行時間範囲の変更  
anacronをcronのバクアップジョブ実行機能として利用するため、再ジョブ実行の範囲を限定する  

```
# vim /etc/anacrontab
START_HOURS_RANGE=5-6
```

### メール通知先の指定
ジョブエラー時のメール通知先  

```
# vim /etc/anacrontab
MAILTO=root
```

## cronの設定

### crontabの設定
システムジョブをcronで実行するように `cron.dayly/*`、`cron.weekly/*`、`cron.monthly/*` の実行時間を指定  

```
# vim /etc/crontab
05 0 * * * root run-parts /etc/cron.daily
25 0 * * 0 root run-parts /etc/cron.weekly
45 0 1 * * root run-parts /etc/cron.monthly
```

`cron.houry/*` については、 `cron.d/0hourly` にて実行される  

### anacron連携用システムジョブの用意  
 cron でジョブを実行した事を anacron に伝え、 anacron 実行時間帯には動作しないようにする  
下記ジョブスクリプトをそれぞれ作成  

* daily  

```
# vi /etc/cron.daily/0anacron
#!/bin/sh
if [ ! -e /var/run/anacron.pid ]; then
    anacron -u cron.daily
fi

# chmod 755 cron.daily/0anacron
```

* weekly  

```
# vi /etc/cron.weekly/0anacron
#!/bin/sh
if [ ! -e /var/run/anacron.pid ]; then
    anacron -u cron.weekly
fi

# chmod 755 cron.weekly/0anacron
```

* monthly  

```
# vi /etc/cron.monthly/0anacron
#!/bin/sh
if [ ! -e /var/run/anacron.pid ]; then
    anacron -u cron.monthly
fi

# chmod 755 cron.monthly/0anacron
```

### ジョブエラーの通知先
ジョブエラー時のメール通知先  

```
# vi /etc/crontab
MAILTO="root"
```

```
# vi /etc/cron.d/0hourly
MAILTO="root"
```

ジョブ毎に通知先を分けたい場合は実行ジョブの直前に `MAILTO=` を定義することで以降のジョブに設定される  
また cron はジョブ実行結果に標準出力があると内容をメールに送信しようとするため、  
ジョブのデバック用に標準出力はしたいがメール通知はしたくない場合は標準出力を破棄するようにジョブ末尾に定義する  

```
10 0 * * * sample_job >/dev/null 2>&1
```
