---
id: introduction
title: "はじめに"
---
import { LinkTag } from './basecomponent.jsx';

# OS設計
本手順ではRedhatOSクローンであるCentOSのインストール手順について記載している  

## OSの選定
新しくOSをインストールし、サーバを立ち上げる場合基本的には以下の点を考慮する  

* ライフサイクル  

OSにもEOLがあり、サポートやパッチ適応状況を理解して利用する  
https://access.redhat.com/ja/support/policy/updates/errata  

* 対応ハードウェア情報、インストール要件  

OSは動作保証環境を明示している  
多くの場合は問題ないが、対応機種情報を確認しておく  
https://hardware.redhat.com/  

またOSインストール・動作に必要な最低限のスペックがあります  
https://access.redhat.com/ja/articles/1271503  

| 項目 | 値  |
| ---- | ------ |
| CPU  | x86_64 |
| Mem  | 2GB    |
| Dick | 10GB   |

* サーバスペック  

インストールするサーバの用意  
サーバのスペックは後から縮小する事は難しい要素になる  
特にディスクについてはパーティションを切った後は縮小はほぼ不可となり、拡張も手間がかかるため  
システムに求められるサーバ要件をしっかり確認しておく  

## OSの入手  
インストールに必要なISOファイルはインターネットから入手できるため、  
サイトよりISOイメージをダウンロードしDVDに焼くか仮想化ソフトでサーバにインストールする  
https://www.centos.org/  

ISOファイルとは？  
https://ja.wikipedia.org/wiki/ISO%E3%82%A4%E3%83%A1%E3%83%BC%E3%82%B8  
