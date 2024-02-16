---
id: tlog
title: "コンソールログの取得"
---
import { LinkTag } from './basecomponent.jsx';

## 操作ログを取得する
<LinkTag url="https://rheb.hatenablog.com/entry/tlog">DNF Configuration Reference</LinkTag>  

### tlog のインストール

```
# dnf install tlog
```

### SSSDを利用したログ取得
<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/8/html/recording_sessions/configuring-recorded-users-or-user-groups-with-sssd-from-cli-deploying-session-recording">CLI からの SSSD を使用したユーザーおよびグループのセッションの録画の有効化</LinkTag>  

### ログインシェルを利用したログ取得
SSSDを利用しない小規模環境などで取得したい場合  

:::inf 注意
SSSDを利用しない方法をRedhat自体は非推奨している  
:::

ログを取得したいユーザーのログインシェルを以下に変更する  

```
/usr/bin/tlog-rec-session
```

### profileを利用したログ取得  
ログを取得したいユーザーがログインしたときにログ記録コマンドを実行させる  

```
# vim /etc/profile
# Logging operation
GRPS=(`/usr/bin/id -Gn`)
CHK_LOGIN="not a tty"
CHK_TTY=`LANG=C /usr/bin/tty|sed -e "s/$CHK_LOGIN/1/g"`
echo $CHK_TTY
if [ $CHK_TTY != 1 ]; then
  for grpnum in ${GRPS[@]};do
    case $grpnum in
      loggrp)
        NUM=1
        ENTER_LIMIT=3
        echo ""
        echo 'Please enter your name in *ALPHABET*.'
        echo ""
        echo -n "Who are you ? : "
        read REALNAME
        while [ ! -n "$REALNAME" ]
        do
          if [ $NUM -eq $ENTER_LIMIT ]; then
            echo "$REALNAME"
            break
          fi
          echo -n "Enter your name again : "
          read REALNAME
          NUM=`expr $NUM + 1`
        done
        if [ ! -n "$REALNAME" ]; then
          exit
        fi
        LOGGINGFILE="/var/log/loginchk/tlog_$(date +%Y%m%d_%H%M%S)_${REALNAME}.log"
        /usr/bin/tlog-rec --writer=file --file-path="$LOGGINGFILE"
        exit
      ;;
    esac
  done
fi
```

## ログの管理
tlogはデフォルトでjournal経由でログを保管管理する  
ログや設定は`/etc/tlog/tlog-rec.conf`、`/etc/tlog/tlog-rec-session.conf`で管理されていて、デフォルトでは`authpriv`ファシリティで出力されるとあるが、  
JSON形式のログは messages にも出力されてしまうため、journal ログにだけ出力されればいい場合は rsyslog のフィルターで除外する  

```
# view /etc/rsyslog.d/tlog.conf
:programname, isequal, "-tlog-rec-session"      stop

# rsyslogd -N 1
# systemctl restart rsyslog
```

:::info
本来 `authpriv` で secure ログに出るのでは？という気がするが messages にしか出ず、怪しい部分もあるため一旦除外で対応している  
`/etc/tlog/tlog-rec-session.conf` の 以下の設定を無効化すればでなくなる？  

```
        // If true, the "journal" writer copies the following JSON fields
        // to Journal fields: user -> TLOG_USER, session -> TLOG_SESSION,
        // rec -> TLOG_REC, and id -> TLOG_ID.
        // "augment" : true
```

:::
