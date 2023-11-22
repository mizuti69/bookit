---
id: systemd
title: "SYSTEMDによるサーバ管理"
---
import { LinkTag } from './basecomponent.jsx';

## systemdの概要  
<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/9/html/managing_monitoring_and_updating_the_kernel/assembly_using-systemd-to-manage-resources-used-by-applications_managing-monitoring-and-updating-the-kernel">systemd を使用してアプリケーションが使用するリソースを管理する</LinkTag>  

RHEL 9 では、cgroup 階層のシステムを systemd ユニットツリーにバインドすることにより、リソース管理設定をプロセスレベルからアプリケーションレベルに移行します。  したがって、システムリソースは、systemctl コマンドを使用するか、systemd ユニットファイルを変更して管理できます。  

## システムターゲット
systemd ターゲットを表示、変更、または設定するにはsystemctl ユーティリティーを使用します。  

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
systemctl 基本的な操作  

| systemctl command                                               | example                                |
| --------------------------------------------------------------- | -------------------------------------- |
| systemctl enable name.service                                    | サービスを有効にします。                                       |
| systemctl disable name.service                                   | サービスを無効にします。                                       |
| systemctl start name.service                                    | サービスを開始します。                   |
| systemctl stop name.service                                     | サービスを停止します。                   |
| systemctl restart name.service                                  | サービスを再起動します。                 |
| systemctl try-restart name.service                              | サービスが実行中の場合のみ、再起動します。 |
| systemctl reload name.service                                   | 設定を再読み込みします。                 |
| systemctl status name.service, systemctl is-active name.service | サービスが実行中かどうかをチェックします。 |
| systemctl list-units --type service --all                       | すべてのサービスのステータスを表示        |

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

### 不要なサービスの停止  
Activeなサービスを確認し不要なサービスが起動している場合は無効化する  

```
# systemctl --type service
```

リスニングポートとサービスの確認  

```
# netstat -pan -A inet,inet6
```

あるいは  

```
# ss -luatp
```
