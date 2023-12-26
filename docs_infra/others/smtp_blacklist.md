---
id: postfix_blacklist
title: "ブラックリスト管理"
---
import { LinkTag } from './basecomponent.jsx';

## ブラックリスト制限
Fromアドレス情報をみて特定ドメイン・アドレスは拒否するように設定する  
postfixのコンフィグにFromのブラックリストを見るようにポリシーを追加

```
# vim /etc/postfix/main.cf
smtpd_sender_restrictions = reject_unknown_sender_domain, reject_sender_login_mismatch, check_sender_access hash:/etc/postfix/access
```

ブラックリストの作成  

```
# vim accsess
qq.com REJECT
```

ハッシュ化  

```
# postmap access
```

設定の反映  

```
# service postfix restart
```

試しにSMTPしてみると、たしかに拒否される  

```
# telnet localhost 25
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
220 dev-winf01 ESMTP
HELO hogehoge.jp
250 localhost
MAIL FROM: hogehoge@qq.com
250 2.1.0 Ok
RCPT TO: user@localhost.localdomain
554 5.7.1 <hogehoge@qq.com>: Sender address rejected: Access denied
```

メールログ  

```
postfix/smtpd[22748]: NOQUEUE: reject: RCPT from localhost[127.0.0.1]: 554 5.7.1 <hogehoge@qq.com>: Sender address rejected: Access denied; from=<hogehoge@qq.com> to=<user@localhost.localdomain> proto=SMTP helo=<hogehoge.com>
```
