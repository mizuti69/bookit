---
id: selinux
title: "SELinuxの設定"
---
import { LinkTag } from './basecomponent.jsx';

## SELinuxのモードについて
Selinuxはファイルシステム単位でパーミッションの管理定義を行ないより厳密にセキュリティを高める事ができる  
Sekinuxには３つのモードがある  

* Enforcing モード  
  SELinux ポリシーが強制され、SELinux ポリシールールに基づいてアクセスが拒否されます。  
  Red Hat Enterprise Linux では、SELinux がシステムにインストールされると、enforcing モードがデフォルトで有効になります。  
* Permissive モード  
  SELinux ポリシーは強制されません。システムは操作可能なままで、SELinux が拒否する操作はありませんが、AVC メッセージのみがログ記録されます。  
  各 AVC がログ記録されるのは 1 回のみです。  
* SELinux の無効化  
  SELinux ポリシーはまったく読み込まれないので強制されることもなく、AVC メッセージもログ記録されません。  

:::caution
Red Hat では、SELinux を永続的に無効にするのではなく、permissive モードで使用することを強く推奨しています。  
:::

## SelLnuxの無効化
完全に無効化する  

```
# getenforce
Enforcing
```

設定の変更

```
# vim /etc/selinux/config
SELINUX=disabled
```

変更を反映させるために再起動  

```
# systemctl reboot
```

再移動後設定値を確認して `Disabled` になっている事を確認する  

## SeLinuxのPermissiveモード化
最低限ログを記録するようにし、システムへの怪しいアクセスが合った場合最低限追えるように  
SElinuxは有効のまま非強制モードにしてログだけ記録されるようにする  

```
# vim /etc/selinux/config
SELINUX=permissive
```

設定を反映させるために再起動  

```
# systemctl reboot
```

再移動後設定値を確認して `Permissive` になっている事を確認する  

SeLinuxのポリシーによりパーミッションが拒否された場合、ログは Audit ログに記録されます  
後述する Audit と合わせて設定を行っておく必要がある  
Audit ログのAVCログを確認する場合  

```
# ausearch -m avc
```
