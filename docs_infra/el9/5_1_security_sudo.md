---
id: security_user
title: "ユーザー権限昇格設定"
---
import { LinkTag } from './basecomponent.jsx';

## SUDOの基本設定
ROOTアカウントのパスワードを共有して利用する事はセキュリティ上問題があり、
管理もしにくくなるため SUDO 機能を利用することで ROOT パスワードの多人数利用を防ぎ、ROOT 権限で実行できるコマンドを制限する  

### パスワードキャッシュの無効化  
`sudo` はでデフォルトで入力されたパスワードキャッシュを5分間保持する、  
セキュリティ上パスワードのキャッシュを持たれるのは良くないためキャッシュを無効化する  

```
# visudo -f /etc/sudoers.d/custom
Defaults timestamp_timeout = 0
```

### 試行回数の制限  
デフォルトでは `sudo` 時の認証は3回まで失敗する事が出来る  
その回数を任意の回数に制限  

```
# visudo -f /etc/sudoers.d/custom
Defaults passwd_tries = 3
```

### リモートコマンドの実行許可  
デフォルトで sudo は tty を持たない接続からの実行はできない  
そうあるべきですが、Jenkins などCIツールなどから sudo を利用する場合 tty 経由以外でも実行できるようにできる  

```
# visudo
Defaults    requiretty
```

## SUDOコマンド制限
詳細な制御、定義の仕方はマニュアルページを参照する  

<LinkTag url="https://linuxjm.osdn.jp/html/sudo/man5/sudoers.5.html">Man page of SUDOERS</LinkTag>  

### ユーザーグループ単位で指定  

```
# visudo -f /etc/sudoers.d/hostmaster
%group_name ALL=(root) ALL
```

### ユーザー単位で指定  
`User_Alias`変数を利用して複数ユーザーに対して同じ権限を与える  

```
# visudo -f /etc/sudoers.d/hostmaster
User_Alias HOSTMASTER = user_name1, user_name2
HOSTMASTER ALL=(root) ALL
```

### パスワード要求の有り無し  
下記の場合`READ`変数に入れたコマンドは`NOPASSWD`パスワード認証無しでROOT権限実行を許可  

```
# visudo -f /etc/sudoers.d/hostmaster
Cmnd_Alias READ = /bin/cat, /bin/more, /bin/grep, /bin/ls, /usr/bin/diff, /bin/find, /usr/bin/tail, /bin/cp
%group_name ALL=(root) NOPASSWD: READ
```

## ユーザースイッチ制限
SUコマンドによりログインユーザーをチェンジできるユーザーを制限する  

:::caution
sudo 、su を合わせて制限利用した場合に設定状況によってはOSコントロール権限を失う恐れがあるため注意  

login.defs による `SU_WHEEL_ONLY` はサポートされていません  
Currently SU_WHEEL_ONLY is not supported
:::

SUコマンドで権限昇格できるユーザーは`wheel`グループに所属しているユーザーのみと設定する  
`root_only` を追加することで pam_wheel が有効なのは root への権限昇格時のみとしている  

```
# vi /etc/pam.d/su
# Uncomment the following line to implicitly trust users in the "wheel" group.
#auth           sufficient      pam_wheel.so trust use_uid
# Uncomment the following line to require a user to be in the "wheel" group.
auth           required        pam_wheel.so use_uid root_only
```

設定後、忘れずにOS管理ユーザーは`wheel`グループに所属させる  
また設定確認をする場合は現在のセッションは切断せず、新たにターミナルを立ち上げて確認すること  

```
# usermod -aG wheel ec2-user
```
