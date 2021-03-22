---
id: sysstat
title: "SYSSTAT の設定"
---
import { LinkTag } from './basecomponent.jsx';

## sysstatのインストール
多くの場合デフォルトでインストールされている事が多いが、ない場合インストール  

```
# dnf install sysstat
```

## 設定
### ログ保有期間  
sysstat ログの保持期間を設定  
30日を越える場合、月ごとにログの出力先が細分化されます  

```
# vim /etc/sysconfig/sysstat
HISTORY=365
```

### ログの圧縮  
指定日以前のログは圧縮  

```
# vim /etc/sysconfig/sysstat
COMPRESSAFTER=31
```

### システムログ取得間隔の調整  
デフォルトでは10分間隔でステータスをログに取得するが、5分間隔に変更  

```
# vim /etc/cron.d/sysstat
# Run system activity accounting tool every 10 minutes
*/5 * * * * root /usr/lib64/sa/sa1 1 1
# 0 * * * * root /usr/lib64/sa/sa1 600 6 &
# Generate a daily summary of process accounting at 23:53
58 23 * * * root /usr/lib64/sa/sa2 -A
```

## サービスの登録、起動
サーバ再起動後も自動で動くよう設定  

```
# systemctl enable sysstat
```
