---
id: locale
title: "システムロケール"
---
import { LinkTag } from './basecomponent.jsx';

## システムロケール概要  
locale は国や地域などの言葉・文字・単位・日付形式などを定義したものです。この locale を切り替えることでLinuxは国際化ができるようになっています。  

<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/9/html/configuring_basic_system_settings/proc_configuring-the-system-locale_assembly_changing-basic-environment-settings">システムロケールの設定</LinkTag>  

システム全体にわたるロケール設定は /etc/locale.conf ファイルに保存され、システム起動の初期段階で systemd デーモンにより読み込まれます。/etc/locale.conf に設定したロケール設定は、個別のプログラムやユーザーが上書きしない限り、すべてのサービスやユーザーに継承されます。  

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

日本語用パッケージがインストールされていない場合は下記のようにインストールする  

```
# dnf install langpacks-ja glibc-langpack-ja 
```

デフォルトロケールの変更  

```
# localectl set-locale LANG=ja_JP.utf8
# localectl set-keymap jp
```

:::caution 注意
Red Hat Enterprise Linux release 9.2 (Plow) 時点では上記locale設定をしてもターミナル上で日本語が文字化けしている  
そのため暫定的に `LANG=C.UTF-8` を設定して回避できる  
:::
