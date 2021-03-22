---
id: postfix_client
title: "クライアント用途の設定"
---
import { LinkTag } from './basecomponent.jsx';

## 受信・転送用設定
### ネットワーク関連  
主にどこからのSMTPリクエストを受け付けるか、どのネットワークでリッスンするかを指定  
ローカルのSMTPリクエストを処理し、メールサーバに転送する場合は`mynetworks`にローカルNWのみを設定、  
リスニングする`inet_interfaces`に`localhost`を設定   

```
mynetworks = <network address>, <network address>
inet_interfaces = localhost
inet_protocols = ipv4
```

`inet_protocols`は必要により`ipv4`だけに限定している  
ポート監視を行なっている場合`inet_interfaces`を`localhost`にしていると、  
監視からポートに対してアクセスが出来ないので必要により`all`等にする。  

### 転送設定
転送用途の場合は外部とメール通信をするサーバにメールを転送するよう設定  
下記の場合2台のメールサーバがあり、1台目をプライマリとして設定  

```
relayhost = [SMTP SERVER01]
fallback_relay = [<SMTP SERVER02>]
fallback_transport = smtp: [<SMTP SERVER01>]
local_recipient_maps =
```

`fallback_transport`を設定する事で、エラーとなるようなメールでもSMTPサーバに転送し、  
ローカルサーバ上にメールを持たないように設定している  
