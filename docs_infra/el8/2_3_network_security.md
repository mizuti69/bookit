---
id: network_security
title: "ネットワークセキュリティ設定"
---
import { LinkTag } from './basecomponent.jsx';

## カーネルパラメータの設定概要  
カーネルパラメータを変更する場合以下の方法があり、  

* sysctl コマンドによる変更  
* sysctlコンフィグファイルによる変更  
* `/proc/sys` の仮想ファイルを直接編集する方法  

永続的にパラメータを変更する場合 sysctl コマンドか sysctl コンフィグを編集する必要がある。  

### sysctlコマンドの利用  
一時的なパラメータ設定  

```
# sysctl net.ipv4.conf.all.rp_filter=1
```

永続的なパラメータ設定  

```
# sysctl -w net.ipv4.conf.all.rp_filter=1
```

### sysctlコンフィグの利用  
ファイルによるコンフィグを設定する場合、幾つかの分散ファイルを理解します。  
sysctl 設定は `/usr/lib/sysctl.d/` 、 `/run/sysctl.d/` 、 `/etc/sysctl.d/` にて定義されベンダー設定は `/usr/lib/sysctl.d/` にて管理されています。  
任意の設定の追加、全ての定義ファイルより優先して設定を行ないたい場合は `/etc/sysctl.d/` にファイルを作成し定義します。  

```
# vim /etc/sysctl.d/99-sysctl.conf
net.ipv4.conf.all.rp_filter=1

# sysctl -p /etc/sysctl.d/99-sysctl.conf
```

本手順ではコンフィグファイルによる設定管理を行う。  

## ネットワークパラメータ設定
### IPv6モジュールの無効化
IPv6を無効化する場合はNICの他にkernelモジュールも読み込まないようにする。  

```
# vim /etc/sysctl.d/99-sysctl.conf
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
```

### ソースルーティング対策  
<LinkTag url="https://access.redhat.com/documentation/ja-JP/Red_Hat_Enterprise_Linux/7/html/Security_Guide/sec-Securing_Network_Access.html">ネットワークアクセスのセキュア化</LinkTag>  

ソースルーティングはインターネットプロトコルメカニズムで、IPパケットがアドレス一覧の情報を持ち運べるようにします。  
このアドレスは、パケットが通過する必要のあるパスをルーターに知らせるものです。  
ルートを移動する際にホップを記録するオプションもあります。  
「ルート記録」と呼ばれるホップの記録は、宛先にソースまでの帰りのパスを提供します。  
これによりソースは(つまり送信ホスト)、すべてもしくは一部のルーターのルーティングテーブルを無視して、ルートを厳密もしくは緩やかに特定することができます。  
これによりユーザーは、不正目的でネットワークトラフィックをリダイレクトすることが可能になります。  
このため、ソースベースのルーティングは無効にする必要があります。  

デフォルトで下記のように設定されている  

```
# vim /usr/lib/sysctl.d/50-default.conf
net.ipv4.conf.all.accept_source_route = 0
```

### 逆方向パス転送  
<LinkTag url="https://access.redhat.com/documentation/ja-JP/Red_Hat_Enterprise_Linux/7/html/Security_Guide/sec-Securing_Network_Access.html">ネットワークアクセスのセキュア化</LinkTag>  

逆方向パス転送は、あるインターフェイスから着信したパケットが異なるインターフェイス経由で去ってしまうことを防ぐために使用されます。  
送信ルートと着信ルートが異なる場合は、非対称ルーティングと呼ばれる場合もあります。  
ルーターがパケットをこの方法でルート設定することはよくありますが、ほとんどのホストはこのようなことをする必要はないはずです。  
例外として挙げられるのは、トラフィックをあるリンクで送信し、異なるサービスプロバイダーから別のリンクでトラフィックを受け取るアプリケーションです。  
例えば、xDSL との組み合わせで専用回線を使っている場合や、3Gモデムを使ったサテライトリンクなどの場合です。  
このようなシナリオが該当する場合は、着信インターフェイスで逆方向パス転送をオフにすることが必要になります。  
つまり、これが必要だと分かっている場合を除いて、有効にしておくのが最善の方法です。  
これは、ローカルサブネットからユーザーがIPアドレスをスプーフィングすることを防ぎ、DDoS 攻撃の機会を減らすためです。  

:::caution
Red Hat Enterprise Linux 7 はデフォルトで厳密な逆方向パス転送を使用します。  
これは、RFC 3704 の Ingress Filtering for Multihomed Networks からの厳密な逆方向パスに関する推奨事項に準拠したものです。  
現在これが適用されるのは、IPv4 のみです。  
:::

* 0 — ソース確認なし  
* 1 — RFC3704 で定義された厳密モード  
* 2 — RFC3704 で定義された緩やかなモード  

デフォルトで下記のように設定されている  

```
# vim /usr/lib/sysctl.d/50-default.conf
net.ipv4.conf.all.rp_filter = 1
```

### SYN FLOOD攻撃対策  
<LinkTag url="https://ja.wikipedia.org/wiki/SYN_cookies">Wiki - SYN cookies</LinkTag>  

サーバは SYN パケットを受けとった後、クライアントに対して SYN ACK パケットを返す。  
ここにはその TCP 接続に関連づけられたTCPシーケンス番号が含まれている。  
TCPシーケンス番号はこれ以降の TCP通信の中で、クライアントおよびサーバが共通して使用する。  
そのためクライアントはサーバが返した SYN ACK パケットにあるシーケンス番号を ACK パケットの中に含めてくるはずである。  
この性質を利用して、もしサーバが本来メモリ上に記憶するべき情報を返りの SYN ACK パケットの中のシーケンス番号の中に埋めこむことができれば、サーバ側は SYN を受けとった直後に記憶領域を消費する必要はなくなり、ACK パケットが来てからはじめて TCP 接続用の領域を割り当てればよくなる。  
大量の SYN flood を行うほとんどの攻撃元ホストは IP アドレスを偽装しているため、このシーケンス番号を受けとることはできず、したがってサーバに正しい ACK パケットを送ることができない。  
その結果、サーバは正当なホストからの接続要求のみに対応 (メモリ割り当て) することができる。  

```
# vim /etc/sysctl.d/99-sysctl.conf
net.ipv4.tcp_syncookies = 1
```

### Smurf攻撃対策  
<LinkTag url="https://ja.wikipedia.org/wiki/Smurf%E6%94%BB%E6%92%83">Wiki - Smurf攻撃</LinkTag>  

DoS攻撃の一種であり、標的となるコンピュータのIPアドレスを送信元アドレスとしてなりすました大量のICMPパケットをブロードキャストアドレスによってコンピュータネットワークにブロードキャストで送信するものである。  
ネットワーク上のほとんどのデバイスは、デフォルトで、受信したICMPメッセージの送信元アドレスに対して応答メッセージを送信する。  
パケットを受信して応答するマシンが非常に多いと、標的のコンピュータはトラフィックであふれることになる。  

```
# vim /etc/sysctl.d/99-sysctl.conf
net.ipv4.icmp_echo_ignore_broadcasts = 1
```

### 設定の反映
反映  

```
# sysctl -p /etc/sysctl.d/99-sysctl.conf
```

または再起動し確認する  
