---
id: locale
title: "システムロケール"
---
import { LinkTag } from './basecomponent.jsx';

## システムロケール概要  
locale は国や地域などの言葉・文字・単位・日付形式などを定義したものです。この locale を切り替えることでLinuxは国際化ができるようになっています。  

<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/7/html/system_administrators_guide/ch-keyboard_configuration">システムロケールおよびキーボード設定</LinkTag>  

システム全体にわたるロケール設定は `/etc/locale.conf` ファイルに保存され、systemd デーモンがブートの初期段階で読み取ります。  
`/etc/locale.conf` に設定されたロケール設定は、個別のプログラムやユーザーが上書きしない限り、すべてのサービスやユーザーに継承されます。  

## システムロケールの設定  

現在のロケール確認  

```
# localectl status
```

利用可能ロケールの一覧  

```
# localectl list-locales
C.utf8
ja_JP.eucjp
ja_JP.utf8
```

デフォルトロケールの変更  

```
# localectl set-locale LANG=ja_JP.utf8
```

日本語用パッケージがインストールされていない場合は下記のようにインストールする  

```
# dnf install langpacks-ja  
```
