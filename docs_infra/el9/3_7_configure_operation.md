---
id: ops
title: "運用設定"
---
import { LinkTag } from './basecomponent.jsx';

## Kernel パニック対策
<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/9/html/managing_monitoring_and_updating_the_kernel/keeping-kernel-panic-parameters-disabled-in-virtualized-environments_managing-monitoring-and-updating-the-kernel">仮想化環境でカーネルパニックのパラメーターを無効のままにする</LinkTag>  

## HISTORY履歴の詳細化
history コマンドで履歴を見たときにタイムスタンプも表示させるようにする  

```
# vim /etc/profile.d/history.sh
HISTTIMEFORMAT='%Y/%m/%d %H:%M:%S '
```

## コンソールのカスタマイズ
環境によってコンソールに表示されるホスト名のカラーを変え資格的にどの環境にアクセスしているか分かるようにする  

```
# vim /etc/profile.d/ps1.sh
PS1="[\u@\[\e[1;35m\]\h\[\e[00m\] \w]\\$ "
```

| code  | coloer |
| ----- | ------ |
| 0;30m | Black  |
| 0;31m | Red    |
| 0;32m | Green  |
| 0;33m | Yellow |
| 0;34m | Blue   |
| 0;35m | Purple |
| 0;36m | Cyan   |
| 0;37m | White  |

## ログイン時のメッセージ表示
ログインした際に本番環境であればメッセージを表示するようにする  

```
# vim /etc/motd

!!!!!!!!!!!!!!!!!
 Prod Server 1
!!!!!!!!!!!!!!!!!

```
