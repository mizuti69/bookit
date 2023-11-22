---
id: selinux
title: "SELinuxの設定"
---
import { LinkTag } from './basecomponent.jsx';

## SELinuxのモードについて
<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/9/html/using_selinux/getting-started-with-selinux_using-selinux">SELinuxの使用</LinkTag>

Selinuxはファイルシステム単位でパーミッションの管理定義を行ないより厳密にセキュリティを高める事ができる  
Sekinuxには３つのモードがある  

* Enforcing モード
  デフォルトのモードで、推奨される動作モードです。SELinux は、Enforcing モードでは正常に動作し、読み込んだセキュリティーポリシーをシステム全体に強制します。  
* Permissive モードで
  システムは、読み込んだセキュリティーポリシーを SELinux が強制しているように振る舞い、オブジェクトのラベリングや、アクセスを拒否したエントリーをログに出力しますが、実際に操作を拒否しているわけではありません。Permissive モードは、実稼働システムで使用することは推奨されませんが、SELinux ポリシーの開発やデバッグには役に立ちます。  
* Disabled モード  
  使用することは推奨されません。システムは、SELinux ポリシーの強制を回避するだけでなく、ファイルなどの任意の永続オブジェクトにラベルを付けなくなり、将来的に SELinux を有効にすることが難しくなります。

## SelLnuxのモード変更
現在の設定状況を確認  

```
# getenforce
Enforcing
```

:::caution 注意
Permissive モードで SELinux を実行すると、ユーザーやプロセスにより、さまざまなファイルシステムオブジェクトのラベルが間違って設定される可能性があります。SELinux が無効になっている間に作成されたファイルシステムのオブジェクトには、ラベルが追加されません。ただし、SELinux では、ファイルシステムオブジェクトのラベルが正しいことが必要になるため、これにより Enforcing モードに変更したときに問題が発生します。
:::


設定の変更

```
# vim /etc/selinux/config
SELINUX=permissive
```

変更を反映させるために再起動  

```
# systemctl reboot
```

## SELinuxの無効化
非推奨であり、Redhat9からは無効化するには kernel 起動オプションを変更する必要がある  
<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/9/html/using_selinux/enabling_and_disabling_selinux-disabling_selinux_changing-selinux-states-and-modes">SELinux の無効化</LinkTag>
