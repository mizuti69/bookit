---
id: security_firewall
title: "Firewallサービスの設定"
---
import { LinkTag } from './basecomponent.jsx';

firewalldの利用が推奨されている  

:::tip memo
※2019年 現時点で directルールが上手く動かない気がしている    
:::

## Firewalldのインストール
firewalldの稼働状況確認  

```
# firewall-cmd --state
running
```

インストールされていない場合インストールする  

```
# yum install firewalld
```

NetworkManager管理環境で後からfirewalldをインストールした場合、管理の競合が発生する場合があるためNetworkManagerを再起動しておく  

## ZONE定義  

<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/7/html/security_guide/sec-using_firewalls">ファイアウォールの使用</LinkTag>  

firewalld は、ゾーン および サービス の概念を使用し、トラフィック管理を簡素化します。ゾーンは、事前定義したルールセットです。ネットワークインターフェースおよびソースはゾーンに割り当てることができます。許可されているトラフィックは、コンピューターが接続されるネットワークと、このネットワークが割り当てられているセキュリティーレベルに従います。ファイアウォールサービスは、特定のサービスに着信トラフィックを許可するのに必要な設定を扱う事前定義のルールで、ゾーンで適用されます。  
firewalld は、インターフェースに追加する信頼レベルと、そのネットワークのトラフィックに従って、複数のネットワークを複数のゾーンに分類できます。接続は、1 つのゾーンにしか指定できませんが、ゾーンは多くのネットワーク接続に使用できます。  
インストール時に、firewalld のデフォルトゾーンは public ゾーンに設定されます。  

| zone name | example                                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------- |
| block     | IPv4 の場合は icmp-host-prohibited メッセージ、そして IPv6 の場合は icmp6-adm-prohibited メッセージで、すべての着信ネットワーク接続が拒否されます。システム内で開始したネットワーク接続のみが可能です。 |
| dmz       | 公開アクセスが可能ではあるものの、内部ネットワークへのアクセスには制限がある非武装地帯にあるコンピューター用。選択した着信接続のみが許可されます。                                                       |
| drop      | 着信ネットワークパケットは、通知なしで遮断されます。発信ネットワーク接続だけが可能です。                                                                                    |
| external  | マスカレードを特別にルーター用に有効にした外部ネットワーク上での使用向けです。自分のコンピューターを保護するため、ネットワーク上の他のコンピューターを信頼しません。選択された着信接続のみが許可されます。                           |
| home      | そのネットワークでその他のコンピューターをほぼ信頼できる自宅での使用。選択した着信接続のみが許可されます。                                                                           |
| internal  | そのネットワークでその他のコンピューターをほぼ信頼できる内部ネットワークでの使用。選択した着信接続のみが許可されます。                                                                     |
| public    | そのネットワークでその他のコンピューターを信頼できないパブリックエリアでの使用。選択した着信接続のみが許可されます。                                                                      |
| trusted   | すべてのネットワーク接続が許可されます。                                                                                                            |
| work      | そのネットワークで、その他のコンピューターをほぼ信頼できる職場での使用。選択した着信接続のみが許可されます。                                                                          |

LANに接続しているNICがデフォルトでどのzoneに登録されているかを確認  

```
# firewall-cmd --get-active-zones
public
  interfaces: enp0s3

# nmcli -p c show eth0 |grep zone
connection.zone:                        public
```

デフォルトで割り当てられるZoneは下記にて定義されている  

```
# vim /etc/firewalld/firewalld.conf
DefaultZone=public
```

### ZONEにデフォルトで定義されているポリシー
現在の割り当てられているZONEに定義されているポリシー  

```
# firewall-cmd --list-all
public (active)
  target: default
  icmp-block-inversion: no
  interfaces: enp0s3
  sources:
  services: cockpit dhcpv6-client ssh
  ports:
  protocols:
  masquerade: no
  forward-ports:
  source-ports:
  icmp-blocks:
  rich rules:
```

指定のZONEに定義されているポリシー  

```
# firewall-cmd --list-all --zone=dmz
dmz
  target: default
  icmp-block-inversion: no
  interfaces:
  sources:
  services: ssh
  ports:
  protocols:
  masquerade: no
  forward-ports:
  source-ports:
  icmp-blocks:
  rich rules:
```

### デフォルト割り当てゾーンの変更  
デフォルトで利用されるZONEの変更  

```
# firewall-cmd --set-default-zone=public
```

### NIC割当ZONEの設定
NICの登録ゾーンを変更する場合はnmcliコマンドで設定する。  

```
# nmcli c mod "eth0" connection.zone public
# nmcli c up eth0
# nmcli -p con show "eth0"
```

## ポリシーの設定
firewalldにてZONEにポリシーを追加する  
**firewalldではデフォルトでOUT側通信に対する制御がありません**、firewalldを利用する場合は幾つかのポリシー定義・管理方法からサービスに合った方法を選択する必要がある  
全ての方法を利用してポリシーを定義することも可能だが、管理が煩雑になるため注意する  

firewalldはバックグラウンドでnftablesを利用しポリシーを管理している  

```
# nft list table filter
table ip filter {
        chain INPUT {
                type filter hook input priority 0; policy accept;
        }

        chain FORWARD {
                type filter hook forward priority 0; policy accept;
        }

        chain OUTPUT {
                type filter hook output priority 0; policy accept;
        }
}
```

デフォルトでは `INPUT`, `FORWARD`, `OUTPUT` 全てのチェインについて何もルールが設定されていない  
また通常ポリシーにて定義してあるサービスも表示されない  

:::tip memo
**OS系よりfirewalldで管理している通常ルール、リッチルールとダイレクトルールは別管理**になっているっぽく  
今までのようにダイレクトルールで全てのポリシー管理ができない（多分）  
インプット側の通信はfirewalldの通常ルール、アウトプット側の通信はダイレクトルールと定義をそれぞれ設定する必要がある  
処理優先順位は 通常ルール（デフォルトall drop）＞ダイレクトルール（デフォルト all accept）？  
:::

### 通常ポリシー定義  
サービス、ポート単位でポリシーを管理できる  
特定の宛先からの通信、OUT側通信に対するポリシーは定義できません  
デフォルトで利用されているポリシー定義方法  

* 許可ポートの追加  

```
# firewall-cmd --zone=public --add-port=80/tcp
```

レンジで登録したい場合は `-add-port=5060-5061/udp` のように指定する  

* 許可サービスの追加  

ポートやポートレンジをサービスとして登録し、サービスの許可、拒否という管理も行えます。  
現在登録されているサービスの確認  

```
# firewall-cmd --get-services
```

* サービスの追加  

```
# firewall-cmd --zone=public --add-service=smtp
```

* 登録したサービスを削除  

```
# firewall-cmd --zone=public --remove-service=smtp
```  

### リッチルールによるポリシー定義  
サービスやポート単位の許可・拒否ではなく細かく制御したいときに利用できるルールを作成できます  
OUT側通信に対するポリシーは定義できません  

* リッチルールの基本書式  

```
firewall-cmd [--permanent] --add-rich-rule    = ルール（追加）[––timeout=(seconds)]
firewall-cmd [--permanent] --remove-rich-rule = ルール（削除）[––timeout=(seconds)]
```

* 定義内容の確認  

```
# firewall-cmd --list-rich-rules
```

定義例

```
# firewall-cmd --add-rich-rule="rule family=ipv4 source address=1.0.16.0/20 service name=https accept"
```

### ダイレクトルールによるポリシー定義
firewalldを経由してnftablesに直接定義を記述するようにルールを作成できる  
接続元、インターフェース指定、OUT側通信と詳細定義を行うことができる  
ダイレクトルールとはそのままfirewalldの管理ポリシー定義ベースで運用するのではなく、nftables同様kernelポリシーとして直接定義するルール  

* 書式  

```
firewall-cmd [--permanent] --direct --add-rule {ipv4|ipv6|eb} <テーブル> <チェイン> <優先順位> <引数>（追加）
firewall-cmd [--permanent] --direct --remove-rule {ipv4|ipv6|eb} <テーブル> <チェイン> <優先順位> <引数>（削除）
```

定義例

```
# firewall-cmd　--permanent --direct --add-rule ipv4 filter OUTPUT_direct 2 -j DROP
# firewall-cmd　--permanent --direct --add-rule ipv4 filter INPUT_direct 1 -s 0.0.0.0 -p tcp -m state --state NEW --dport 22 -j ACCEPT
```

### ダイレクトルールによるポリシー定義（XML）
XML形式で記述する事でiptables時と同様にポリシーを簡単に管理、配布する事が出来る  

```xml title=""
# vim /etc/firewalld/direct.xml
<?xml version="1.0" encoding="utf-8"?>
<direct>
  <!-- default rule -->
  <rule priority="2" table="filter" ipv="ipv4" chain="INPUT">-j DROP</rule>
  <rule priority="2" table="filter" ipv="ipv6" chain="INPUT">-j DROP</rule>
  <rule priority="2" table="filter" ipv="ipv4" chain="OUTPUT">-j DROP</rule>
  <rule priority="2" table="filter" ipv="ipv6" chain="OUTPUT">-j DROP</rule>
  <rule priority="2" table="filter" ipv="ipv4" chain="FORWARD">-j DROP</rule>
  <rule priority="2" table="filter" ipv="ipv6" chain="FORWARD">-j DROP</rule>
  <!-- All Accept -->
  <rule priority="1" table="filter" ipv="ipv4" chain="INPUT">-s 127.0.0.1 -j ACCEPT</rule>
  <rule priority="1" table="filter" ipv="ipv4" chain="INPUT">-d 127.0.0.1 -j ACCEPT</rule>
  <rule priority="1" table="filter" ipv="ipv4" chain="FORWARD">-s 127.0.0.1 -j ACCEPT</rule>
  <rule priority="1" table="filter" ipv="ipv4" chain="FORWARD">-d 127.0.0.1 -j ACCEPT</rule>
  <rule priority="1" table="filter" ipv="ipv4" chain="OUTPUT">-s 127.0.0.1 -j ACCEPT</rule>
  <rule priority="1" table="filter" ipv="ipv4" chain="OUTPUT">-d 127.0.0.1 -j ACCEPT</rule>
  <!-- ssh -->
  <rule priority="1" table="filter" ipv="ipv4" chain="INPUT">-p tcp -m state --state NEW --dport 22 -j ACCEPT</rule>
</direct>
```

ルールを反映  

```
# firewall-cmd --reload
# firewall-cmd --direct --get-all-rules
# nft list table filter
table ip filter {
        chain INPUT {
                type filter hook input priority 0; policy accept;
                ip saddr 127.0.0.1 counter packets 0 bytes 0 accept
                ip daddr 127.0.0.1 counter packets 0 bytes 0 accept
                ip saddr 10.128.56.0/22 counter packets 212 bytes 35116 accept
                ip daddr 10.128.56.0/22 counter packets 2 bytes 208 accept
                meta l4proto tcp ct state new tcp dport 22 counter packets 0 bytes 0 accept
                counter packets 2 bytes 722 drop
        }

        chain FORWARD {
                type filter hook forward priority 0; policy accept;
                ip saddr 127.0.0.1 counter packets 0 bytes 0 accept
                ip daddr 127.0.0.1 counter packets 0 bytes 0 accept
                ip saddr 10.128.56.0/22 counter packets 0 bytes 0 accept
                ip daddr 10.128.56.0/22 counter packets 0 bytes 0 accept
                counter packets 0 bytes 0 drop
        }

        chain OUTPUT {
                type filter hook output priority 0; policy accept;
                ip saddr 127.0.0.1 counter packets 0 bytes 0 accept
                ip daddr 127.0.0.1 counter packets 0 bytes 0 accept
                ip saddr 10.128.56.0/22 counter packets 83 bytes 13973 accept
                ip daddr 10.128.56.0/22 counter packets 0 bytes 0 accept
                counter packets 0 bytes 0 drop
        }
}
```

設定後、他のポリシーにて定義した内容を削除する  

```
# firewall-cmd --permanent --remove-service=ssh
# firewall-cmd --permanent --remove-service=dhcp
# firewall-cmd --reload
```

## 操作ロック
他root実行されているアプリケーションからfirewallの設定を変更されたくない場合ロックすることが可能  

* ロック状態の確認  

```
# firewall-cmd --query-lockdown
```

* ロックの有効化、無効化  

```
# firewall-cmd --lockdown-on
# firewall-cmd --lockdown-off
```

## ロギング

```
# vim /etc/firewalld/firewalld.conf
LogDenied=unicast

# systemctl restart firewalld
```
