---
id: ops
title: "運用設定"
---
import { LinkTag } from './basecomponent.jsx';

## Kernel パニック対策
カーネルパニックが発生した場合デフォルトでは `0（ハングアップ）` となっているため指定秒後を自動再起動するようにする  

```
# vim /etc/sysctl.d/99-sysctl.conf
kernel.panic = 10
```

設定の反映  

```
# sysctl -p /etc/sysctl.d/99-sysctl.conf
```

または再起動する  


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

## ユーザー作成時のデフォルト設定  
OSユーザー作成時には `/etc/skel` 配下のファイルがテンプレートとしてユーザーフォームディレクトリに展開される  
OSユーザーに標準で設定したい変数やファイルがある場合に利用する  

```
# ls -la /etc/skel/
合計 24
drwxr-xr-x.  2 root root   62  4月  6 23:18 .
drwxr-xr-x. 85 root root 8192  5月 25 17:50 ..
-rw-r--r--.  1 root root   18  9月  7  2017 .bash_logout
-rw-r--r--.  1 root root  193  9月  7  2017 .bash_profile
-rw-r--r--.  1 root root  231  9月  7  2017 .bashrc
```
