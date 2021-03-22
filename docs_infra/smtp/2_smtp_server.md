---
id: postfix_server
title: "サーバ用途の設定"
---
import { LinkTag } from './basecomponent.jsx';

## 送信用設定

### ネットワーク関連  
主にどこからのSMTPリクエストを受け付けるか、どのネットワークでリッスンするかを指定  
内部からのSMTPリクエストを処理し、外部に送受信する場合は`mynetworks`に信頼するネットワークを設定し、  
リスニングする`inet_interfaces`に`all`か外部通信するネットワークを設定  

```
mynetworks = <network address>, <network address>
inet_interfaces = all
inet_protocols = ipv4
```

`inet_protocols`は必要により`ipv4`だけに限定している  

### メールヘッダーの書き換え  
外部にメールを送信する際に、ローカルNW情報が流出しないよう書き換える  

```
header_checks = regexp:/etc/postfix/header_checks
```

書き換えルールの設定  

```
# vim /etc/postfix/header_checks
/(^Received:.*) \[[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\](.*)/ REPLACE $1$2
```

## FROM、ENVELOPE FROMの書き換え
メール送信を行う前に、FROMやENVEROPE FROMを独自ルールで自動的に書き換えることが可能  
ローカルネットワーク内の転送用SMTPサーバから送られてくるメールのFROM書き換えなどに有用  

デフォルトではFROM、ENVELOPE FROM両方のヘッダーを書き換えます  

```
sender_canonical_classes = envelope_sender, header_sender
sender_canonical_maps = regexp:/etc/postfix/sender_canonical
```

書き換えルールの作成  

```
# vim /etc/postfix/sender_canonical
/@hogehoge.localdomain/  @localhost.localdomain
```

`@hogehoge.localdomain`FROMのメールを送信する際に`@localhost.localdomain`に書き換える  

ルールをハッシュ化  

```
# postmap /etc/postfix/sender_canocical
```

再起動して反映  

```
# postfix check
# systemctl restart postfix
```
