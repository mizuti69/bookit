---
id: security_firewall
title: "Firewallサービスの設定"
---
import { LinkTag } from './basecomponent.jsx';

## ファイアウォールおよびパケットフィルターの設定
<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/9/html/configuring_firewalls_and_packet_filters/index">ファイアウォールおよびパケットフィルターの設定</LinkTag>  

* firewalld  
  簡単なファイアウォールのユースケースには、firewalld ユーティリティーを使用します。firewalld はプロトコル単位での簡単な IN 通信を制御するのに向いている  
* nftables  
  iptablesの後継。nftables ユーティリティーを使用して、ネットワーク全体など、複雑なパフォーマンスに関する重要なファイアウォールを設定します。  

:::info firewalldでのダイレクトルール
nftables バックエンドを使用した firewalld が、--direct オプションを使用して、カスタムの nftables ルールを firewalld に渡すことに対応していないことに注意してください。  
firewalld はポリシー定義によってはの変更時に瞬間的に通信が全て不可となる瞬間があるため運用を考慮して採用を検討する  
:::

最小構成だとデフォルトではインストールされていないことが多く  
最近はクラウドサービスのホスティング側でパケットフィルター機能を標準搭載していることが多く、サーバサイドでの制御は行わないため割愛  
