---
id: network_hostname
title: "ホスト名の設定"
---
import { LinkTag } from './basecomponent.jsx';

## ホスト名の概略  
<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/9/html-single/configuring_and_managing_networking/index#assembly_changing-a-hostname_configuring-and-managing-networking">ホスト名の変更</LinkTag>

ホスト名には概念的に3つのクラスが定義されている  

* static:  
  `/etc/hostname` ファイルに保存されます。通常、サービスはこの名前をホスト名として使用します。  
* Transient hostname:  
  通常、ネットワーク設定から受け取るフォールバック値  
* Pretty hostname:  
  Proxy server in data center A などのわかりやすい名前  

:::tip 推奨される命名プラクティス  
ICANN (The Internet Corporation for Assigned Names and Numbers) は、(.yourcompany などの) トップレベルの未登録ドメインを公開登録簿に追加することがあります。  
このため、Red Hat では、プライベートネットワーク上であっても委任されていないドメイン名を使用しないことを強く推奨しています。  
これは、ネットワーク設定によっては異なる解決をしてしまうドメインネームになってしまう可能性があるからです。  
その結果、ネットワークリソースは利用不可能になってしまいます。  
また、委任されていないドメイン名を使うと、DNSSEC の実装および維持がより困難になります。  
これは、ドメインネームが競合すると DNSSEC 検証に手動の設定が必要となるからです。  
:::

## ホスト名の設定
現在設定されている静的ホスト名の確認  

```
# hostnamectl status --static
```

ホスト名の設定  

```
# hostnamectl set-hostname <hostname>
# systemctl restart systemd-hostnamed
```

## HOSTSの設定  
ローカルホスト名を名前解決する場合にDNSサーバを参照しにいく無駄を省くため  
hostsには今までどおり手動で追記する  
サーバの名前解決優先順位は以下のファイルに定義されている  

```
# cat /etc/authselect/user-nsswitch.conf
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
