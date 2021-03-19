---
id: network_hostname
title: "ホスト名の設定"
---
import { LinkTag } from './basecomponent.jsx';

## ホスト名の概略  
<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/7/html/networking_guide/ch-configure_host_names">ホスト名の設定</LinkTag>

ホスト名には概念的に3つのクラスが定義されている  

* static:  
  従来の hostname で、ユーザーが選択することができ`/etc/hostname`ファイルに保存される  
* transient:  
  カーネルによって維持される動的なホスト名  
  デフォルトでは static ホスト名に初期化され、その値は`localhost`になります。ランタイム時にDHCPまたはmDNSによる変更が可能  
* pretty:  
  ユーザーに自由形式の UTF8 ホスト名を提示するもの  

**推奨される命名プラクティス**  
ICANN (The Internet Corporation for Assigned Names and Numbers) は、(.yourcompany などの) トップレベルの未登録ドメインを公開登録簿に追加することがあります。  
このため、Red Hat では、プライベートネットワーク上であっても委任されていないドメイン名を使用しないことを強く推奨しています。  
これは、ネットワーク設定によっては異なる解決をしてしまうドメインネームになってしまう可能性があるからです。  
その結果、ネットワークリソースは利用不可能になってしまいます。  
また、委任されていないドメイン名を使うと、DNSSEC の実装および維持がより困難になります。  
これは、ドメインネームが競合すると DNSSEC 検証に手動の設定が必要となるからです。  

:::caution
NetworkManager は systemd-hostnamed サービスを使用して `/etc/hostname` ファイルに保存される静的ホスト名の読み取りおよび書き込みを実行します。  
したがって `/etc/hostname`ファイルに対する手動の変更が NetworkManager によって自動的に取得されなくなりました。  
hostnamectl ユーティリティーを使って、システムのホスト名を変更する必要があります。  
また、`/etc/sysconfig/network` ファイルでの HOSTNAME 変数の使用は非推奨になりました。  
:::

## ホスト名の設定
ホスト名の確認  

```
# hostnamectl status
```

ホスト名の設定  

```
# hostnamectl set-hostname <hostname>
```

## HOSTSの設定  
ローカルホスト名を名前解決する場合にDNSサーバを参照しにいく無駄を省くため  
hostsには今までどおり手動で追記する  
サーバの名前解決優先順位は以下のファイルに定義されている  

```
# cat /etc/authselect/nsswitch.conf
hosts:      files dns myhostname
```

:::caution
`/etc/nsswitch.conf` ファイルを直接 変更しては行けない。  
変更したい場合は後述する「ユーザーポリシー」手順を確認する。  
:::

hostsに追記  

```
# vim /etc/hosts
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6

{ipaddress} {hostname}
```

デフォルトではループバックアドレスに対しての記述があるが、特に理由がない限りは削除したり追記したりしないようにする。  
ミドルウェアによっては意識しているサービスがあり、動作に影響があるため（らしい）。  
