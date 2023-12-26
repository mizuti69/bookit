---
id: postfix_transport
title: "送信制限"
---
import { LinkTag } from './basecomponent.jsx';

## メール送信制限
外部に送信するメールを送信先ドメインで制限する  
特定のドメイン宛てのメールは許可し、それ以外はローカルメールキューに配送（破棄）するよう設定します  

```
# vim /etc/postfix/main.cf
transport_maps = hash:/etc/postfix/transport
```

送信許可ドメインと送信許可先サーバの設定  

```
# vim /etc/postfix/transport
hogehoge.co.jp	            :hogehoge.co.jp
*                           :[127.0.0.1]
```

上記の場合`hogehoge.co.jp`宛てのメールは`hogehoge.co.jp`のMXレコード宛に送信を許可し、  
それ以外は全て`[127.0.0.1]`に送るよう設定している  

転送先をドメインにした場合、MXレコードに登録してあるIPに送信  
`[]`で囲い指定した場合はAレコードに登録してあるIPへ送信  

ルールをハッシュ化  

```
# postmap /etc/postfix/transport
```

設定の反映  

```
# postfix check
# systemctl restart postfix
```

## メールアドレス制限
### ハイフン「-」で始まるメールアドレスの許可  
Postfixではハイフン「-」で始まるメールアドレスをコマンドからの引数と判別するため、デフォルトでは無効化されている  

許可させる場合  

```
# vim main.cf
allow_min_user = yes
```

### RFC違反しているメールアドレスの許可  

一般的に下記に記してあるようにRFCに準拠していないメールアドレスはデフォルトで拒否されます  

| ヘッダー例 | 備考 |
|:-------------|:--------|
| RCPT TO: `<.user@domain.name>` | 頭に "." |
| PT TO: `<user.@domain.name>` | ユーザ名末尾が "." |
| RCPT TO: `<user..name@domain.name>` | "."が連続している |
| RCPT To: Hogemoge Taro `<taro@domain.name>` | ヘッダのTo:を丸ごとコピー。sendmailは これでも動いてしまう |
| RCPT TO: `<hogemoge taro@domain.name>` | 空白をクオートしていない。  サーバによって解釈が異なるので危険 |
| RCPT TO: `<user@.domain.name>` | ドメイン頭に"." |
| RCPT TO: `<@domain.name>` | ユーザ名が空。  PostfixではMAILER-DAEMONに配送 |
| MAIL FROM: `<まぁまぁｗｗ@domain.name>` | 8bit文字。UTF-8もダメ。 クオートしてもダメ。 |
| MAIL FROM: `<#@[]>` | qmail の doublebounce。 []は空のIPアドレス |

RFCチェックを無効化する場合  

```
# vim main.cf
strict_rfc821_envelopes = no
```

メールアドレス整合性をチェックしなくなってしまうため無効化する場合には注意  

### 特殊メールアドレス送信の挙動について
拒否とはどのようにされるのか  

```
# telnet localhost 25
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
220 dev-winf01 ESMTP
helo test
250 dev-winf01
mail from:<test@localhost.localdomain>
250 2.1.0 Ok
rcpt to:<-hogehoge@gmail.com>
501 5.1.3 Bad recipient address syntax
quit
221 2.0.0 Bye
Connection closed by foreign host.
```

ハイフンから始まるアドレスは確かに上記のように拒否される  

```
# telnet localhost 25
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
220 dev-winf01 ESMTP
helo test
250 dev-winf01
mail from:<testplocalhost.localdomain>
250 2.1.0 Ok
rcpt to:<hoge..hoge@gmail.com>
250 2.1.5 Ok
data
354 End data with <CR><LF>.<CR><LF>
From:test@localhost.localdomain
To:hoge..hoge@gmail.com
Subject:test
testmail
.
250 2.0.0 Ok: queued as 6179380686
quit
221 2.0.0 Bye
Connection closed by foreign host.
```

ドットが連続しているアドレスはそのまま行けてしまう  

```
]# mailq
-Queue ID- --Size-- ----Arrival Time---- -Sender/Recipient-------
6179380686*     355 Wed Feb 18 17:22:02  testplocalhost.localdomain
                                         "hoge..hoge"@gmail.com
```
メールキューを見てみるとダブルクオートが補完されている  
ダブルクオートやでくくれば大体のアドレスはスルーするらしく、postfixはドット始まりやドット連続のアドレスはダブルクオートを自動補完してしまう  

## Poistfix接続数制限  
特定のアドレスからSMTPリクエストが一定時間内に制限値以上くると下記のようなアラートが発生する  

```
Sep 28 12:26:03 hogehoge postfix/anvil[29515]: statistics: max connection rate 1/60s for (smtp: ipaddress) at Sep 28 12:22:22
Sep 28 12:26:03 hogehoge postfix/anvil[29515]: statistics: max connection count 1 for (smtp: ipaddress) at Sep 28 12:22:22
Sep 28 12:26:03 hogehoge postfix/anvil[29515]: statistics: max cache size 2 at Sep 28 12:22:43
```

### 制限からの除外  
対象が監視サービスなど信頼されているアクセス元の場合は制限から除外する  

```
# vim /etc/postfix/main.cf
smtpd_client_event_limit_exceptions = {ip address}
```

### 制限値を変更する
サービス上必要だが無制限にはしたくない場合  

* 連続接続時間を変更する  

```
# vim /etc/postfix/main.cf
smtpd_client_message_rate_limit = 0
anvil_rate_time_unit = 60s
```

* 連続接続最大数を変更する  

```
# vim /etc/postfix/main.cf
smtpd_client_connection_count_limit = 50
```
