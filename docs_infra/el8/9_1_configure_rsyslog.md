---
id: rsyslog
title: "Rsyslogの設定"
---

## ログパーミッションの変更
セキュリティ的にデフォルトではファイル権限 `600` ディレクトリ権限 `700` となっている  
変更する場合は全ての rsyslog 管理ログに影響することを注意しておく  

```
# vi /etc/rsyslog.conf
$umask 0000
$FileCreateMode 0644
$DirCreateMode 0755
```

再起動して反映  

```
# systemctl restart rsyslog
```

## 大量メッセージの自動破棄回避
5秒間に `rsyslog` へ 200 以上のメッセージ( rsyslog のデフォルト設定)を送信したプロセスID(PID)があれば、rsyslog はメッセージを捨て始める  

```
# view /var/log/messages
imuxsock lost 2299 messages from pid 26006 due to rate-limiting
imuxsock begins to drop messages from pid 26007 due to rate-limiting
```

制限値を変更  
設定はコンフ内の`MODULES`内に追記する  

```
# vi /etc/rsyslog.conf
# Loginig Limit
$SystemLogRateLimitInterval 10
$SystemLogRateLimitBurst 500
```

上記設定の場合、10秒間に500以上のメッセージ出力があった場合削除する  
制限なしにする場合  

```
# vi /etc/rsyslog.conf
$SystemLogRateLimitInterval 0
```

## ログ転送・集約  

### 受信側  

UDPの場合  

```
# vi /etc/rsyslog.conf
$ModLoad imudp
$UDPServerRun 514
$AllowedSender UDP, <from ipaddress>, <from ipaddress>, <from ipaddress>
```

TCPの場合  

```
# vi /etc/rsyslog.conf
$ModLoad imtcp
$InputTCPServerRun 514
$AllowedSender TCP, <from ipaddress>, <from ipaddress>, <from ipaddress>
```

対象ホスト毎にログを分けたい場合  
IP、またはセグメント単位でログ出力先を指定する事ができる  

```
# vi /etc/rsyslog.conf
:fromhost-ip, isequal, "<from ipaddress>" /var/log/switch/dmz.log
& stop
:fromhost-ip, isequal, "<from ipaddress>" /var/log/switch/trust.log
& stop
:fromhost-ip, isequal, "<from ipaddress>" /var/log/switch/manage.log
& stop
```

`isequal`完全一致  
`startswith`前方一致  

これらの定義は`#### RULES ####`の前に記述する必要がある  
`& stop`を指定しないと`messages`と両方のログに出力されてしまう  

## 逆引きの無効化
外部からのrsyslog連携で接続元をいちいち逆引きしないよう設定する  

```
# vim /etc/sysconfig/rsyslog
SYSLOGD_OPTIONS="-c 5 -x"
```

## 特定プロセスのログ出力除外  
ソフトウェア指定のログファイルとmessages両方に同じログが出力されてしまう場合がある  
下記の指定で、特定のログを破棄するように指定できる  

```
# vim /etc/rsyslog.conf
:programname, isequal, "monit"
& stop
```
