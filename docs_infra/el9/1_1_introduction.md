---
id: introduction
title: "はじめに"
---
import { LinkTag } from './basecomponent.jsx';

本資料は Redhat Enterprise Linux、CentOS Stream についての記述になります。  

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
* 拡張アップデートサポートアドオン  
  Red Hatは、特定のマイナーリリースを長期間にわたって標準化したいお客様のために、Red Hat Enterprise LinuxサブスクリプションへのExtended Update Support（EUS）アドオンを提供しています。  
  各Red Hat Enterprise Linux EUSストリームは、マイナーリリースが提供されてから24ヶ月間利用できます。  

### ライフサイクル(CentOS Stream)
CentOS Stream Projectについては下記を参照  
<LinkTag url="https://www.redhat.com/en/blog/faq-centos-stream-updates">FAQ:CentOS Stream Updates</LinkTag>

### ライフサイクル(AppStream)  
<LinkTag url="https://access.redhat.com/ja/node/4167391">Red Hat Enterprise Linux Application Streams ライフサイクル</LinkTag>
Redhat8から導入されたライフサイクルがパッケージ提供元のEOLに準拠するリポジトリ  
PHPやNodeJS、Pythonなど最新のパッケージを使いたい場合に利用する事ができるがライフサイクルは各ソフトウェアのライフサイクルに準拠する  

## 新しいOSについての理解

### 主要な変更点  
またRedhat8から9への主な相違点は下記にまとめられている  
<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/9/html-single/considerations_in_adopting_rhel_9/index#assembly_changes-to-packages_considerations-in-adopting-RHEL-9">RHEL 8 と RHEL 9 の主な相違点</LinkTag>

目についた変更点は  
* 古い暗号化方法の廃止に伴う `SCP` の廃止、Redhat9は古いOSとのSSHもできなくなっている  
* SSHデフォルトでのrootパスワードログインの禁止 `#PermitRootLogin prohibit-password`  
* OpenSSL の FIPS モードを有効にしなければ正常に機能しない  
* SELinux の無効化に対応しなくなる（厳密にはできる）  

### 非推奨パッケージの確認  
<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/9/html/9.0_release_notes/deprecated-packages">Redat9：非推奨のパッケージ</LinkTag>
Redhat9からiptablesは明確に非推奨、非サポートとなっている  
network-scriptsの完全廃止  

### ハードウェア要件  
<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/9/html/performing_a_standard_rhel_9_installation/system-requirements-reference_installing-rhel">システム要件の参照</LinkTag>

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
