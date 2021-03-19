---
id: systemd
title: "SYSTEMDによるサーバ管理"
---
import { LinkTag } from './basecomponent.jsx';

## systemdの概要  
<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/7/html/system_administrators_guide/chap-managing_services_with_systemd">SYSTEMD によるサービス管理</LinkTag>  

systemd は Linux オペレーティングシステム用のシステムおよびサービスマネージャー。  
SysV init スクリプトと後方互換するように設計されており、起動時のシステムサービスの並行スタートアップやデーモンのオンデマンドのアクティベーション、システム状態のスナップショットのサポート、依存ベースのサービス管理論理などの多くの機能を提供している。  
RedHatEnterpriseLinux7 では、 systemd は Upstart に代わるデフォルトの init システムです。  
サービスユニットは、ファイル拡張子.service 等で終わり、init スクリプトと同様の目的を果たす。  
サービスの表示、開始、停止、再開、有効化、無効化には、「service ユーティリティーと systemctl の比較」、「chkconfig ユーティリティーと systemctl の比較」、および以下で説明されているように systemctl コマンドラインを使用する。  
service および chkconfig はシステム内で利用可能でまだ機能しますが、これらは互換性のために含まれており、使用の回避を推奨する  

## システムターゲット
systemd ターゲットを表示、変更、または設定するにはsystemctl ユーティリティーを使用します。  
runlevel および telinit の各コマンドはシステムで利用可能なままで、期待どおりに機能しますが、これらが含まれているのは互換性が目的であり、使用は避けてください。  

| runlevel | systemd target                      | example                                       |
| -------- | ----------------------------------- | --------------------------------------------- |
| 0        | runlevel0.target, poweroff.target   | システムをシャットダウンし、電源を切ります。      |
| 1        | runlevel1.target, rescue.target     | レスキューシェルを設定します。                   |
| 2        | runlevel2.target, multi-user.target | 非グラフィカルな複数ユーザーシステムを設定します。 |
| 3        | runlevel3.target, multi-user.target | 非グラフィカルな複数ユーザーシステムを設定します。 |
| 4        | runlevel4.target, multi-user.target | 非グラフィカルな複数ユーザーシステムを設定します。 |
| 5        | runlevel5.target, graphical.target  | グラフィカルな複数ユーザーシステムを設定します。   |
| 6        | runlevel6.target, reboot.target     | システムをシャットダウンして再起動します。        |

現在のデフォルトターゲットを確認  

```
# systemctl get-default
```

デフォルトターゲットを変更する場合  

```
# systemctl set-default <target name>
```

現在のターゲットを変更する場合  

```
# systemctl isolate <target name>
```

## サービスの操作  
serviceコマンド比較  

| service command            | systemctl command                                               | example                                |
| -------------------------- | --------------------------------------------------------------- | -------------------------------------- |
| service {name} start       | systemctl start name.service                                    | サービスを開始します。                   |
| service {name} stop        | systemctl stop name.service                                     | サービスを停止します。                   |
| service {name} restart     | systemctl restart name.service                                  | サービスを再起動します。                 |
| service {name} condrestart | systemctl try-restart name.service                              | サービスが実行中の場合のみ、再起動します。 |
| service {name} reload      | systemctl reload name.service                                   | 設定を再読み込みします。                 |
| service {name} status      | systemctl status name.service, systemctl is-active name.service | サービスが実行中かどうかをチェックします。 |
| service --status-all       | systemctl list-units --type service --all                       | すべてのサービスのステータスを表示        |

chkconfig コマンド比較  

| chkconfig             | systemctl                                                        | example                                                     |
| --------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------ |
| chkconfig name on     | systemctl enable name.service                                    | サービスを有効にします。                                       |
| chkconfig name off    | systemctl disable name.service                                   | サービスを無効にします。                                       |
| chkconfig --list name | systemctl status name.service, systemctl is-enabled name.service | サービスが有効かどうかをチェックします。                        |
| chkconfig --list      | systemctl list-unit-files --type service                         | サービスすべてを一覧表示し、それらが有効かどうかをチェックします。 |

サーバ状態操作のコマンド  

| command                | example                                |
| ---------------------- | -------------------------------------- |
| systemctl halt         | システムを停止します。                   |
| systemctl poweroff     | システムの電源を切ります。               |
| systemctl reboot       | システムを再起動します。                 |
| systemctl suspend      | システムをサスペンドします。              |
| systemctl hibernate    | システムを休止状態にします。              |
| systemctl hybrid-sleep | システムを休止状態にしてサスペンドします。 |

## systemdのログレベルを変更
systemd のデフォルト設定でログレベルが `info` に設定されていて大量のログが出るためログレベルを調整する  

```
# vim /etc/systemd/system.conf
[Manager]
LogLevel=notice
```

変更の反映  

```
# systemctl daemon-reexec
```
