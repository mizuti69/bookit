---
id: user_policy
title: "ユーザーポリシーの設定"
---
import { LinkTag } from './basecomponent.jsx';

## OSユーザーの定義
ユーザーを作成するときに利用する`useradd`コマンドではデフォルトで設定されるユーザー情報がある  

```
# useradd -D
GROUP=100
HOME=/home
INACTIVE=-1
EXPIRE=
SHELL=/bin/bash
SKEL=/etc/skel
CREATE_MAIL_SPOOL=yes
```

デフォルトではユーザーID、グループIDはシステムで予約されているものがあり、`/usr/share/doc/setup/uidgid`にて定義されている  

新規で作成するユーザーやグループはが500番から始まるようになっている  
`SKEL`にはデフォルトでユーザーホームに配置されるファイルテンプレートが設定されている  

### ユーザーデフォルトの変更  
ユーザー作成時のホームディレクトリを変更したい場合、下記定義ファイルを変更する  

```
# vim /etc/default/useradd
# useradd defaults file
GROUP=100
HOME=/home/users
INACTIVE=-1
EXPIRE=
SHELL=/bin/bash
SKEL=/etc/skel
CREATE_MAIL_SPOOL=yes
```

## パスワードポリシー  

### パスワード文字数、文字種の定義

:::info 
`/etc/login.defs` では下記パラメータが非サポートに  
* PASS_CHANGE_TRIES is not supported
* PASS_ALWAYS_WARN is not supported
* PASS_MAX_LEN is not supported
* CHFN_AUTH is not supported
:::


```
# vim /etc/security/pwquality.conf.d/custum.conf
minlen = 8
dcredit = 1
ucredit = 1
lcredit = 1
ocredit = 1
```

## 認証設定
<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/9/html-single/configuring_authentication_and_authorization_in_rhel/index">RHEL での認証と認可の設定</LinkTag>  

authselect ユーティリティーを使用して、Red Hat Enterprise Linux 9 ホストでユーザー認証を設定できます。  
既製のプロファイルのいずれかを選択して、ID 情報および認証ソースおよびプロバイダーを設定できます。  

* デフォルトの sssd プロファイルでは、LDAP 認証を使用するシステムの System Security Services Daemon (SSSD) が有効になります。
* winbind プロファイルは、Microsoft Active Directory と直接統合したシステムの Winbind ユーティリティーを有効にします。
* minimal プロファイルは、システムファイルから直接ローカルユーザーおよびグループのみを提供します。これにより、管理者は不要になったネットワーク認証サービスを削除できます。

現在設定さてているプロファイル  

```
# authselect current
プロファイル ID: sssd
有効な機能: なし
```

定義ファイル  

```
# vim /etc/nsswitch.conf
passwd:     sss files systemd
group:      sss files systemd
netgroup:   sss files
automount:  sss files
services:   sss files
```

デフォルトで認証時に優先参照先として SSSD が設定されている  
システムを特定のアクティブディレクトリや LDAP を利用していないのであれば SSSD とかは気にしなくてよい  
上記のように認証時に SSSD がチェックされ、対象のレジストラがない場合は `/etc/passwd` などの file が参照される  

### プロファイルの変更
認証サービスを利用しない場合は下記のようにプロファイルを変更  

```
# authselect select minimal
Profile "minimal" was selected.
The following nsswitch maps are overwritten by the profile:
- aliases
- automount
- ethers
- group
- hosts
- initgroups
- netgroup
- networks
- passwd
- protocols
- publickey
- rpc
- services
- shadow
```

SSSD はデフォルトでサービスインストール、起動しているため利用しない場合は停止しておく  

```
# systemctl stop sssd
# systemctl disable sssd
```

### カスタムプロファイルの作成  
<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/9/html-single/configuring_authentication_and_authorization_in_rhel/index#creating-and-deploying-your-own-authselect-profile_configuring-user-authentication-using-authselect">独自の authselect プロファイルの作成とデプロイメント</LinkTag>  

:::caution
`/etc/nsswitch.conf` ファイルを直接変更してはいけない  
:::

authselect コマンドについては下記を参照する  

<LinkTag url="https://www.mankier.com/8/authselect">Authselect MAN Page</LinkTag>  

### アカウントロック制御
<LinkTag url="https://access.redhat.com/ja/solutions/1289333">pam_faillock の概要および Red Hat Enterprise Linux 8 と 9 での使用方法</LinkTag>  
基本の認証設定では faillock モジュールが読み込まれていない  

```
# cat /etc/pam.d/password-auth
# Generated by authselect on Thu Oct 26 19:06:32 2023
# Do not modify this file manually.

auth        required                                     pam_env.so
auth        required                                     pam_faildelay.so delay=2000000
auth        sufficient                                   pam_unix.so nullok
auth        required                                     pam_deny.so
```
faillockモジュールの有効化  

```
# authselect enable-feature with-faillock
```

faillock モジュールが追加されている  

```
# cat /etc/pam.d/password-auth
# Generated by authselect on Thu Oct 26 19:40:39 2023
# Do not modify this file manually.

auth        required                                     pam_env.so
auth        required                                     pam_faildelay.so delay=2000000
auth        required                                     pam_faillock.so preauth silent
auth        sufficient                                   pam_unix.so nullok
auth        required                                     pam_faillock.so authfail
auth        required                                     pam_deny.so
```

有効化  

```
# authselect select minimal with-faillock
```

ロック設定

```
# vim /etc/security/faillock.conf
deny = 10  # ロックされる失敗回数  
fail_interval = 900 # ユーザーアカウントがロックされるために認証に連続して失敗しなければならない間隔の長さ  
unlock_time = 600  # ロック後アクセスが最有効化されるまでのインターバル  
root_unlock_time　# rootアカウントのロック後アクセスが最有効化されるまでのインターバル  
silent # ユーザーに有益なメッセージを出力しない（有効なユーザーの存在を伝えないようにする）  
```

ロックの確認  

```
# faillock
```

ロックの解除  

```
# faillock --user {username} --reset
```
