---
id: audit
title: "Audit の設定"
---
import { LinkTag } from './basecomponent.jsx';

## 基本設定
インストールして起動すれば基本動く  
監査ログは`/var/log/auditd`配下に出力される  

ログファイルの保持期間やサイズはコンフィグで調整可能  

```
# vim /etc/auditd/auditd.conf

max_log_file = 50
num_logs = 10
```

レポート出力コマンド  

例）一週間のログを出力

```
# /sbin/aureport -au -ts week-ago
```

cronで定期的に実行する場合、cron経由だと上記コマンドでは上手く動かないので注意  
オプションでファイル指定するときディレクトリを指定しないと指定のログファイル分しかレポートしてくれない  

```
# /sbin/aureport -au -ts week-ago -if /var/log/audit
```