---
id: cockpit
title: "Cockpitのインストール"
---
import { LinkTag } from './basecomponent.jsx';

Cockpitをインストールしておくと、Webブラウザベースでのコンソール操作、リソース状況モニタリング、パッケージ管理等が行えるようになる  

## インストール

```
# dnf install cockpit-dashboard
# systemctl enable cockpit.socket
# systemctl start cockpit.socket
```

Cockpitへ　`https://{ipaddress}:9090/` アクセス  
OSアカウントでログインする  

## コンソール  

### システム  
<img src={require('./assets/configure_cockpit01.png').default} width="80%" />  

### ログ  

<img src={require('./assets/configure_cockpit02.png').default} width="80%" />  

### ネットワーキング  

<img src={require('./assets/configure_cockpit03.png').default} width="80%" />  

### アカウント

<img src={require('./assets/configure_cockpit04.png').default} width="80%" />  

### サービス

<img src={require('./assets/configure_cockpit05.png').default} width="80%" />  

### Diagnostic Report
SOSレポートの事  
<img src={require('./assets/configure_cockpit06.png').default} width="80%" />  

### SeLinux

<img src={require('./assets/configure_cockpit07.png').default} width="80%" />  

### アプリケーション
Cockpit用追加アプリケーション管理  
<img src={require('./assets/configure_cockpit08.png').default} width="80%" />  

### カーネルダンプ

<img src={require('./assets/configure_cockpit09.png').default} width="80%" />  

### サブスクリプション

<img src={require('./assets/configure_cockpit10.png').default} width="80%" />  

### ソフトウェア管理

### 端末

<img src={require('./assets/configure_cockpit12.png').default} width="80%" />  

### ダッシュボード
ダッシュボードは他のサーバを追加できる  
<img src={require('./assets/configure_cockpit13.png').default} width="80%" />  
