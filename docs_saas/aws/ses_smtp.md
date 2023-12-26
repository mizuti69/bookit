---
id: ses_smtp
title: "EC2 の定期的な自動停止設定"
---
import { LinkTag } from '../basecomponent.jsx';

## SESのID登録



## OSからSMTP送信設定
SMTP認証に利用する IAM ユーザーを作成  



## OSからメール送信確認
メール送信コマンドがない場合はインストール  

```
# dnf install s-nail
```

外部SMTPサーバ送信用設定を作成  
https://wiki.archlinux.jp/index.php/S-nail

```
$ vim ~/.mailrc
set smtp-use-starttls
set v15-compat=yes
set mta=smtp://AKIA5CVSVOBSSYL4VILK:BI1ASXVyrfHqUdXfrEIv2lCa2Cds9HZwy%2FzokFkq97tV@email-smtp.ap-northeast-1.amazonaws.com:587
set smtp-auth=login
set from=root@drupal-toto.ttvdemo.tci-dm.jp
```

ユーザー名、パスワードの記号等は s-nail で送信できるようにエンコードしたものを記載する  

```
$ echo 'urlcodec enc AKIA5CVSVOBSSYL4VILK' |s-nail -#
```

※主にプログラムで引っかかるであろう記号等がエンコードされるくらい  

送信テスト  

```
$ echo "TEST." | s-nail -v -s "TEST" wakabayashi.t@trans-cosmos.co.jp
```
