---
id: ssh
title: "SSH基本設定"
---
import { LinkTag } from './basecomponent.jsx';

## 基本設定
詳細なパラメータ設定についてはMANページを参照する  
<LinkTag url="https://linux.die.net/man/5/sshd_config">sshd_config(5) Linux man page</LinkTag>  

### リスニングポートの指定  
SSH のリスニングポートを指定  
firewall 等で接続元は制限するためデフォルトポートから変更はしない  

```
# vim /etc/ssh/sshd_config
Port 22
```

### リスニングプロトコルの指定  
デフォルトですが利用する SSH プロトコルは 2 のみとする  

```
# vim /etc/ssh/sshd_config
Protocol 2
```

### 接続元の逆引き無効化  
接続元IPを逆引きすることによる通信遅延を回避  

```
# vim /etc/ssh/sshd_config
UseDNS no
```

### リスニングアドレスの明記  
SSH サーバが起動するリスニングアドレスを指定  
ここでは IPv4 のみ利用にする  

```
# vim /etc/ssh/sshd_config
AddressFamily inet
```

### アクセス数制限  
SSH アクセスするユーザー数が限られ、かつ多重に接続する運用が無い場合  
攻撃のような多重アクセスが来た場合は拒否するよう設定  
ここでは 10 回以上要求が来た場合 70% の確立で拒否し、15 回以上要求が来た場合全て拒否します。  

```
# vim /etc/ssh/sshd_config
MaxStartups 10:70:15
```

### SSH Xフォワードの有効化  
GUI 環境に直接アクセスできない場合、  
必要によりSSH ポートフォワード機能を利用してサーバの Xwindow システムにアクセスできるようにしておく  

```
# vim /etc/ssh/sshd_config
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

rsync や scp など直接ログインしないけど ROOT 権限でアクセスはしたい場合  

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
