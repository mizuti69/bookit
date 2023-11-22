---
id: network_nic
title: "ネットワーク・インターフェースの設定"
---
import { LinkTag } from './basecomponent.jsx';

## NIC名の概略  
ネットワークインターフェースファイルの命名は「 **Predictable Network Interface Names** 」命名規則が採用されている  

<LinkTag url="https://www.freedesktop.org/wiki/Software/systemd/PredictableNetworkInterfaceNames/">Predictable Network Interface Names</LinkTag>  

カーネルによって適用されるネットワークインタフェースの古典的な命名法は、ドライバによって検証されるので、 "eth0"、 "eth1"、...で始まる名前をすべてのインタフェースに単純に割り当てることです。  
最新のテクノロジではドライバのプロービングは一般的に予測できないため、複数のネットワークインターフェイスが使用可能になるとすぐに "eth0"、 "eth1"などの名前の割り当てが一般的に固定されなくなります。  
ある起動でのeth0 "は次の起動では" eth1 "になります。  
これは、たとえば、特定の命名規則用にコード化されているファイアウォール規則など、重大なセキュリティ上の問題を引き起こす可能性があります。そのため、予期しない名前の変更に対して非常に敏感です。  
この問題を解決するために、複数の解決策が提案され実施されてきた。udevは長い間、MACアドレスに基づいて特定のインターフェースに永続的な "ethX"名を割り当てるためのサポートを提供していました。  
これには多数の問題があることがわかりました。  
その中には、一般に利用できない書き込み可能なルートディレクトリが必要でした。  
システム上でOSイメージを起動するとイメージの設定が変更されるため、システムのステートレス性は失われます。  
多くのシステムでは、MACアドレスは実際には固定されていません。多くの組み込みハードウェア、特にあらゆる種類の仮想化ソリューションなどです。  
もっとも最大の問題は、インターフェース名を割り当てようとしているユーザースペースコンポーネントが、同じ "ethX"名前空間から新しい名前を割り当てているカーネルに対して競合していることです。  
それらの間で名前の割り当てが時々失敗したこと。結果として、これに対するサポートはしばらく前にsystemd / udevから削除されました。  

一般的なもので下記のような命名規則がある  

| name                | example         | value                                                      |
| ------------------- | --------------- | ---------------------------------------------------------- |
| ID_NET_NAME_ONBOARD | eno1            | ファームウェア/BIOS に登録されたオンボードデバイスの番号        |
| ID_NET_NAME_SLOT    | ens1            | ファームウェア/BIOS に登録された PCI ホットプラグスロットの番号 |
| ID_NET_NAME_PATH    | enp2s0          | システムバスの接続順                                         |
| ID_NET_NAME_MAC     | enx78e7d1ea46da | MAC アドレス                                                |

Redhatによる詳細な命名規則の定義や設定は下記を参照  
<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/9/html-single/configuring_and_managing_networking/index#network-interface-naming-schemes_consistent-network-interface-device-naming">ネットワークの設定および管理</LinkTag>  

## NetworkManager の設定
### NICエイリアス名の変更
「Predictable Network Interface Names」よりNIC名を物理的に変更することは推奨されないが、管理上理解しやすい用にエイリアス名を設定する。  

NIC情報の確認  

```
# ip link show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 9001 qdisc mq state UP mode DEFAULT group default qlen 1000
    link/ether ************ brd ************
    altname enp0s5
    altname ens5

# nmcli c show
NAME         UUID                                  TYPE      DEVICE
System eth0  ********************  ethernet  eth0
```

NetworkManager経由で設定を行う場合利用するのは「NAME」のプロファイル名のため、操作する上で扱いやすい名前に変更を行う  

```
# nmcli c mod "System eth0" connection.id eth0
```

### NICの有効化
OSインストール時に設定してない場合はデフォルトでNICが無効化されているため自動でリンクアップするよう有効化する。  

デバイスステータスの確認  

```
# nmcli device status
```

有効化  

```
# nmcli c up id eth0
# nmcli c mod eth0 connection.autoconnect yes
# nmcli c up eth0
```

### 固定IPの設定方法  
固定IPを設定する場合の手順  

```
# nmcli c mod eth0 ipv4.method manual ipv4.addr "{ipaddress}/{subnet mask}" ipv4.gateway "{gaetway}"
# nmcli c up eth0
```

### DHCPの設定方法  
DHCPアドレッシングを行う場合の設定手順  

```
# nmcli c mod eth0 ipv4.method auto -ipv4.address "" -ipv4.gateway ""
# nmcli c up eth0
```

### 参照DNS設定  
名前解決に利用するDNSの設定  

```
# nmcli c mod eth0 ipv4.dns "<primary dns> <secondary dns>"
# nmcli c up eth0
```

### IPv6の無効化
IPv6を無効化する場合の手順  

```
# nmcli c mod eth0 ipv6.method ignore
# nmcli c up eth0
```

### その他パラメータ
NICに設定できる詳細なパラメータは下記コマンドで確認する事ができる  

```
# nmcli -p c show eth0
```

## nm-cloud-setup につて
<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/9/html-single/configuring_and_managing_networking/index#automatically-configuring-network-interfaces-in-public-clouds-using-nm-cloud-setup_configuring-and-managing-networking">nm-cloud-setup を使用してパブリッククラウドのネットワークインターフェイスを自動的に設定する</LinkTag>  

> 通常、仮想マシン (VM) には、DHCP で設定可能なインターフェイスが 1 つだけあります。ただし、VM によっては、DHCP で設定できない 1 つのインターフェイスに複数のネットワークインターフェイス、IP アドレス、および IP サブネットがある場合があります。また、管理者は、マシンの実行中にネットワークを再設定できます。nm-cloud-setup ユーティリティーは、クラウドサービスプロバイダーのメタデータサーバーから設定情報を自動的に取得し、パブリッククラウド内の VM のネットワーク設定を更新します。  
