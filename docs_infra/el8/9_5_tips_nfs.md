---
id: nfs
title: "NFSの設定"
---
import { LinkTag } from './basecomponent.jsx';

:::info
情報が古くなっています
:::

## サーバ側設定
### サーバのインストール

```
# yum install nfs-utils
```

### 共有ディレクトリを登録  
NFS共有したいディレクトリ、接続元、権限を設定  

```
# vim /etc/exports
/data02 <ipaddress>(rw,async,no_root_squash)
/data02 <ipaddress>(rw,async,no_root_squash)
```

NFSサーバを起動  

```
# systemctl start nfs-server
# systemctl enable nfs-server
```

共有ディレクトリを登録  

```
# exportfs -ra
# exportfs -v
```

:::info
NFS4であれば利用ポートは固定(2049,111)されているためポート固定は不要  
:::

## クライアント側設定
パッケージのインストール  

```
# yum install nfs-utils
```

マウント設定  

```
# vim /etc/fstab
<ipaddress>:/data02 /data02                    nfs     rw,_netdev,soft,timeo=300,retrans=2 0 0
```

マウント  

```
# mount /data02
```

`/etc/fstab`に記載しておけばOS再起動時にも自動でマウントしてくれる  
