---
id: introduction
title: "はじめに"
---
import { LinkTag } from './basecomponent.jsx';

本資料は Redhat Enterprise Linux、CentOS Linux についての記述になります。  

## インストール要件の確認  
プロダクト製品には基本的にはライフサイクル、EOLが設定されており、メーカーやディストリビューターがプロダクト製品に対するサポートや提供の期間を定義しています。  
ソフトウェアを導入する際にはライフサイクルや商用利用の規約等を把握しおく必要があり、またありとあらゆる環境で利用が保証されている事はなく、利用する製品が利用したい環境に適しているのか、
メーカー側がサポートしているのかも把握してほく必要がある。  

### ライフサイクル (Redhat)  
インストールするOSのライフサイクル、サポートポリシーを確認する。  
<LinkTag url="https://access.redhat.com/ja/support/policy/updates/errata">Red Hat Enterprise Linux Life Cycle</LinkTag>

* フルサポートフェーズ  
  フルサポートフェーズでは、認定された重要かつ重要なセキュリティエラータアドバイザリ（RHSA）、緊急優先セレクトおよび優先度の高い優先度の高いバグ修正エラータアドバイザリ（RHBA）がリリースされると同時にリリースされることがあります。  
* メンテナンスサポートフェーズ  
  重大な影響セキュリティアドバイザリ（RHSA）および選択された緊急優先度バグ修正アドバイザリ（RHBA）がリリースされる可能性があります。  
  機能および新しいハードウェアの使用可能化は予定されていません。更新されたインストールイメージを含むマイナーリリースは、このフェーズで利用可能になるかもしれません。  
* Red Hat Enterprise Linux 8アプリケーションのライフサイクル  
  ほとんどのApplication Streamsを含むRed Hat Enterprise Linuxバージョン8の大多数のパッケージは、10年間のRed Hat Enterprise Linux 8ライフサイクル全体にわたって維持されます。ただし、指定されたライフサイクルコンポーネントは10年以内に維持され、指定されたライフサイクルはコンポーネントのアップストリームライフと一致することがよくあります。  
  アプリケーションストリームは、メジャーリリースの製造段階における正誤表の基準に従います。  
* 拡張アップデートサポートアドオン  
  Red Hatは、特定のマイナーリリースを長期間にわたって標準化したいお客様のために、Red Hat Enterprise LinuxサブスクリプションへのExtended Update Support（EUS）アドオンを提供しています。  
  各Red Hat Enterprise Linux EUSストリームは、マイナーリリースが提供されてから24ヶ月間利用できます。  

### ライフサイクル(CentOS)
CentOSはRHELの機能互換を目的としたOSSのLinuxディストリビューション。  
CentOSとRedhatはプロジェクトとして連携しており、基本的にはRHELのライフサイクルや仕様に準拠している。  
<LinkTag url="https://wiki.centos.org/FrontPage">What is CentOS Linux?</LinkTag>

:::caution
CentOS Linux8 は 2021年末に サポート終了がアナウンスされています。  
今後は CenOS Stream へ開発が移行され、Redhat EL8 の先行ブランチ的な立ち位置になることが予想されています。  
<LinkTag url="https://blog.centos.org/2020/12/future-is-centos-stream/"> CentOS Project shifts focus to CentOS Stream</LinkTag>
:::

### 非推奨パッケージの確認  
古いバージョンからの移行や、最新バージョンによる変更を確認。  
<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/7/html/7.5_release_notes/chap-red_hat_enterprise_linux-7.5_release_notes-deprecated_functionality">非推奨の機能</LinkTag>

### ハードウェア要件  
* 物理的な端末に対する動作保証機器一覧: <LinkTag url="https://hardware.redhat.com/">Redhat - Tested. Certified. Trusted.</LinkTag>
* スペック要件: <LinkTag url="https://access.redhat.com/articles/rhel-limits">Red Hat Enterprise Linux technology capabilities and limits</LinkTag>

インストールに必要な最低限スペックの抜粋  

| Specification     | Version 8                                           |
| ----------------- | --------------------------------------------------- |
| x86_64            | 1.5GB minimum / 1.5GB per logical CPU recommended22 |
| POWER             | 2GB minimum/2GB required per install                |
| System z          | 1GB                                                 |
| ARM               | 2GB                                                 |
| Minimum diskspace | 10GB minimum/20GB recommended                       |

### 仮想化ソフトウェア要件  
利用する仮想化ソフトウェア側で対応しているかの確認  

* Oracle Virtual Box: <LinkTag url="https://www.oracle.com/technetwork/server-storage/virtualbox/support/index.html">Getting Support for Oracle VM VirtualBox</LinkTag>  
* VMWare: <LinkTag url="https://www.vmware.com/resources/compatibility/search.php">VMware Compatibility Guide</LinkTag>  

## OSの入手  
ディストリビューターから提供されているISOファイルには主に下記のようなものがある  
<LinkTag url="https://access.redhat.com/ja/solutions/2987971">RHEL の .iso ファイルの種類を理解する</LinkTag>  

* boot.iso  
  バイナリーファイルの http リポジトリなど別のソースからオペレーティングシステムをインストールするのに使用します。レスキューモードで起動するのに使用することもできます。  
  インストーラのコア部分のみとなり実際のインストールには外部リポジトリを指定してインストールを行う必要がある  
* バイナリー DVD  
  このディスクは、Red Hat Enterprise Linux をインストールして使用するのに必要です。レスキューモードで起動するのに使用することもできます。  
  インストールからOS起動に必要な全てのパッケージが入っている  
* ソース DVD  
  Red Hat Enterprise Linux のソースコード (人間が判読可能なプログラミング言語の命令)。これは、Red Hat Enterprise Linux が準拠している GNU General Public License に従って提供されています。ソース DVD に関するドキュメントはありません。これは、Red Hat バージョンに基づいて独自のソフトウェアをコンパイルしたり開発したりするのに使用できます。  

### ISOイメージからのインストール  
ライフサイクルとハードウェア要件から利用するOSとバージョンを選定し必要な最新のDVD ISOイメージファイルを入手。  

* <LinkTag url="https://access.redhat.com/downloads/">Redhat OS</LinkTag>
* <LinkTag url="https://developers.redhat.com/">Redhat OS 開発用無償サブスクリプション付き</LinkTag>  
* <LinkTag url="https://www.centos.org/">CentOS</LinkTag>  
