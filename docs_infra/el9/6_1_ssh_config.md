---
id: ssh
title: "SSH基本設定"
---
import { LinkTag } from './basecomponent.jsx';

## 基本設定
詳細なパラメータ設定についてはMANページを参照する  
<LinkTag url="https://linux.die.net/man/5/sshd_config">sshd_config(5) Linux man page</LinkTag>  

<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/9/html/securing_networks/assembly_using-secure-communications-between-two-systems-with-openssh_securing-networks#ssh-and-openssh_assembly_using-secure-communications-between-two-systems-with-openssh">SSH と OpenSSH</LinkTag>  

`sshd_config` はデフォルトパラメータが記載されていて、個別設定は `Include` で `sshd_config.d` 配下で管理するようになっている  

Redhatの例  

```
# /etc/ssh/ssd_config.d/50-redhat.conf
# This system is following system-wide crypto policy. The changes to
# crypto properties (Ciphers, MACs, ...) will not have any effect in
# this or following included files. To override some configuration option,
# write it before this block or include it before this file.
# Please, see manual pages for update-crypto-policies(8) and sshd_config(5).
Include /etc/crypto-policies/back-ends/opensshserver.config

SyslogFacility AUTHPRIV

ChallengeResponseAuthentication no

GSSAPIAuthentication yes
GSSAPICleanupCredentials no

UsePAM yes

X11Forwarding yes

# It is recommended to use pam_motd in /etc/pam.d/sshd instead of PrintMotd,
# as it is more configurable and versatile than the built-in version.
PrintMotd no
```

### リスニングポートの指定  
SSH のリスニングポートを指定  
firewall 等で接続元は制限するためデフォルトポートから変更はしない  

```
Port 22
```

### リスニングプロトコルの指定  
デフォルトですが利用する SSH プロトコルは 2 のみとする  

```
Protocol 2
```

### 接続元の逆引き無効化  
接続元IPを逆引きすることによる通信遅延を回避  

```
UseDNS no
```

### リスニングアドレスの明記  
SSH サーバが起動するリスニングアドレスを指定  
ここでは IPv4 のみ利用にする  

```
AddressFamily inet
```

### アクセス数制限  
SSH アクセスするユーザー数が限られ、かつ多重に接続する運用が無い場合  
攻撃のような多重アクセスが来た場合は拒否するよう設定  
ここでは 10 回以上要求が来た場合 70% の確立で拒否し、15 回以上要求が来た場合全て拒否します。  

```
MaxStartups 10:70:15
```

### SSH Xフォワードの有効化  
オンプレミス環境等でGUI 環境に直接アクセスできない場合、  
必要によりSSH ポートフォワード機能を利用してサーバの Xwindow システムにアクセスできるようにしておく  

```
X11Forwarding yes
```

### rhosts認証の無効化  
SSH プロトコル１でのみ利用可能ですが、rhosts 認証は無効化しておきます。  

```
# vim /etc/ssh/sshd_config
IgnoreRhosts yes
```

### ROOTログインの拒否  
初期インストール時には ROOT ユーザーでのログインが許可されている場合があります  
OSでの作業ユーザー作成、 `sudo` などの設定は完了していれば速やかに無効にしておきます  

```
# vim /etc/ssh/sshd_config
PermitRootLogin no
```

ROOT ユーザーでログインが必要だけどパスワード認証は不可にしたい場合  

```
PermitRootLogin without-password
```

:::info 注意
Redhatではデフォルトで `prohibit-password` と定義されているが `without-password` と同義  
ChallengeResponseAuthentication が "yes" の場合、 PermitRootLogin が "without-password" に設定されていたとしても、root ユーザはそのパスワードで許可されます。
:::

rsync や sftp など直接ログインしないけど ROOT 権限でアクセスはしたい場合  

```
PermitRootLogin forced-commands-only
```

### SSH利用ユーザー・グループの制限  
SSH接続を許可するユーザー・グループを指定する  

```
AllowUsers username1 username2
AllowGroups groupname1 groupname2
```

ブラックリストの`DenyUsers`、`DenyGroups`もある  
