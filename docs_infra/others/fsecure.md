---
id: fsecure
title: "Fsecure Security CLE for Linux"
---
import { LinkTag } from './basecomponent.jsx';

## インストール  
Fsecure から購入したパッケージをサーバ上に展開しインストールコマンドを実行します。  
いくつかのライブラリが必要なのでない場合はインストールしておく。  

```
# yum install glibc-devel kernel-devel ld-linux.so.2
# tar xzf fsls-11.00.79-rtm.tar.gz
# cd fsls-11.00.79-rtm
# ./fsls-11.00.79-rtm --command-line-only
```

インストール時にライセンスコードが求められるので入力  

```
30-day evaluation version.
keycode: **************
```

評価版としてインストールする場合は何も入力せづにエンターして進みます  

## 基本設定  
スキャン時詳細設定を行う  

```
# vi /etc/opt/f-secure/fssp/fssp.conf
```

スキャンタイムアウト値の変更（秒）  

```
odsFileScanTimeout 300
```

2GB以上のファイルはスキャンをスキップする  

```
odsFileSkipLarge 1
```

スキャン除外パスの指定  

```
odsFileExcludedPaths /proc\n/sys\n/usr/local/src/\n/var/opt/f-secure\n/opt/f-secure
```

## スキャンテスト  
eicar提供のテストウイルスファイルをサーバ上に配置してスキャンさせます  

<LinkTag url="http://www.eicar.org/">Anti-Malware Testfile</LinkTag>  

スキャンを実行し検知されることを確認  

```
fsav --auto --action1=disinf --action2=rename /tmp/eicar.txt
```

## アンインストール  

```
/opt/f-secure/fssp/sbin/uninstall-fssp
```
