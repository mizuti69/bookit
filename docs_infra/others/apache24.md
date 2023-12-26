---
id: apache24
title: "Apache 2.4のインストールと基本設定"
---
import { LinkTag } from './basecomponent.jsx';

## Apacheのインストール

```
# dnf install httpd httpd-devel
```

## 基本設定  
設定ファイルの整形  
コメントアウト等不要な記載を削除する  

```
# cd /etc/httpd/conf
# cp -p httpd.conf httpd.conf.org
# sed -e "/^#/d" -e "/^$/d" -e "/^ #/d" httpd.conf.org > httpd.conf
```

### サーバポートの設定  
環境に合わせて定義  

```
# vim /etc/httpd/conf/httpd.conf
Listen 18080
```

### 不要なデフォルト設定の削除
VirtualHostでサイト定義を管理するためデフォルト設定は削除する  

* ドキュメントルートの削除  

```
# vim /etc/httpd/conf/httpd.conf
#DocumentRoot "/var/www/html"
```

```
# vim /etc/httpd/conf/httpd.conf
#<Directory "/var/www">
#    AllowOverride None
#    # Allow open access:
#    Require all granted
#</Directory>
#<Directory "/var/www/html">
#    Options Indexes FollowSymLinks
#    AllowOverride None
#    Require all granted
#</Directory>
```

* CGI設定の削除  

```
# vim /etc/httpd/conf/httpd.conf
#<IfModule alias_module>
#    ScriptAlias /cgi-bin/ "/var/www/cgi-bin/"
#</IfModule>
```

```
# vim /etc/httpd/conf/httpd.conf
#<Directory "/var/www/cgi-bin">
#    AllowOverride None
#    Options None
#    Require all granted
#</Directory>
```

* SSI設定の削除  

```
# vim /etc/httpd/conf/httpd.conf
<IfModule mime_module>
    TypesConfig /etc/mime.types
    AddType application/x-compress .Z
    AddType application/x-gzip .gz .tgz
    #AddType text/html .shtml
    #AddOutputFilter INCLUDES .shtml
</IfModule>
```

### ディレクトリインデックスの設定
環境に合わせて定義  

```
# vim /etc/httpd/conf/httpd.conf
<IfModule dir_module>
    DirectoryIndex index.html index.php
</IfModule>
```

### アクセス制御
デフォルトでは全てのアクセスと全ての外部設定ファイルは無効にされている。  
サイトに必要な定義はVirtualHost単位で制御するため httpd.conf の定義はそのままにする。  

```
# vim /etc/httpd/conf/httpd.conf
<Directory />
    AllowOverride none
    Require all denied
</Directory>
```

その他ドット始まり、ログ系などアクセスされたくないファイルはアクセス拒否設定を追記する  

```
# vim /etc/httpd/conf/httpd.conf
<Files ~ "\.(dat|log|csv)$">
    Require all denied
</Files>
<Files ~ "^\..*">
    Require all denied
</Files>
```

### デフォルト文字コード定義
サーバ側で制御するべきものではないので無効化する。  

```
# vim /etc/httpd/conf/httpd.conf
AddDefaultCharset Off
```

### 外部読み込みファイルの設定
環境に合わせて使い分ける、デフォルトでは conf.d ディレクトリ配下にある conf ファイルは全て読み込むように定義されている  

```
# vim /etc/httpd/conf/httpd.conf
#IncludeOptional conf.d/*conf
```

### サーバURL、Port解決定義の無効化  
Apacheは様々な状況で自己参照URLつまりサーバが自分自身を指し示すURLを生成する必要があります。  
LB配下等で、クライアントからのリクエストポートと、サーバ上のポートが違う場合、応答ポートをサーバ上のポートで返答しないよう考慮する必要がある。  
基本はリクエストヘッダー内容に準ずるよう設定。  

```
# vim /etc/httpd/conf/httpd.conf
UseCanonicalName Off
```

### ディレクトリインデックス対策  
ディレクトリインデックスはデフォルトで無効化しておく  

```
# vim /etc/httpd/conf/httpd.conf
<Directory />
    Options -Indexes
    AllowOverride none
    Require all denied
</Directory>
```

### 名前解決の無効  

```
# vim /etc/httpd/conf/httpd.conf
HostnameLookups Off
```

### 不要なリクエストメソッド応答の無効化  

```
# vim /etc/httpd/conf/httpd.conf
TraceEnable Off
```

### DEFALATE設定
特に理由がなければデフォルトで有効化しておく  
CDN等を利用していて、そちらで対応している場合もあるので環境に合わせて定義  

```
# vim /etc/httpd/conf/httpd.conf
AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript
```

### キャッシュ設定
最低限クライアントキャッシュを行うように定義  
キャッシュ設定はコンテンツと仕様を確認し調整してどこで誰が管理、定義するか認識を合わせておくこと  

```
# vim /etc/httpd/conf/httpd.conf
FileEtag MTime Size
```

### 不要なモジュールの除外  
使わなそうなモジュールは脆弱性のもとと、パフォーマンスに影響されるため除外しておく  

```
# vim /etc/httpd/conf.mobules.d/00-base.conf
#LoadModule auth_basic_module modules/mod_auth_digest.so
#LoadModule authn_anon_module modules/mod_authn_anon.so
#LoadModule authn_dbd_module modules/mod_authn_dbd.so
#LoadModule authn_dbm_module modules/mod_authn_dbm.so
#LoadModule authz_dbd_module modules/mod_authz_dbd.so
#LoadModule authz_dbm_module modules/mod_authz_dbm.so
#LoadModule userdir_module modules/mod_userdir.so
#LoadModule suexec_module modules/mod_suexec.so
```

```
# vim /etc/httpd/conf.mobules.d/00-dav.conf
#LoadModule dav_module modules/mod_dav.so
#LoadModule dav_fs_module modules/mod_dav_fs.so
#LoadModule dav_lock_module modules/mod_dav_lock.so
```

```
vim /etc/httpd/conf.mobules.d/00-proxy.conf
LoadModule proxy_module modules/mod_proxy.so
#LoadModule lbmethod_bybusyness_module modules/mod_lbmethod_bybusyness.so
#LoadModule lbmethod_byrequests_module modules/mod_lbmethod_byrequests.so
#LoadModule lbmethod_bytraffic_module modules/mod_lbmethod_bytraffic.so
#LoadModule lbmethod_heartbeat_module modules/mod_lbmethod_heartbeat.so
#LoadModule proxy_ajp_module modules/mod_proxy_ajp.so
#LoadModule proxy_balancer_module modules/mod_proxy_balancer.so
#LoadModule proxy_connect_module modules/mod_proxy_connect.so
#LoadModule proxy_express_module modules/mod_proxy_express.so
#LoadModule proxy_fcgi_module modules/mod_proxy_fcgi.so
#LoadModule proxy_fdpass_module modules/mod_proxy_fdpass.so
#LoadModule proxy_ftp_module modules/mod_proxy_ftp.so
#LoadModule proxy_http_module modules/mod_proxy_http.so
#LoadModule proxy_hcheck_module modules/mod_proxy_hcheck.so
#LoadModule proxy_scgi_module modules/mod_proxy_scgi.so
#LoadModule proxy_uwsgi_module modules/mod_proxy_uwsgi.so
#LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so
```

```
vim /etc/httpd/conf.mobules.d/00-lua.conf
#LoadModule lua_module modules/mod_lua.so
```

## MPM設定
APacheにはサーバのプロセス管理、アクセス処理の方法として3種類のMPM方法を選択することが出来る  

* worker : リクエストに対してプロセスを起動して処理を行うが、プロセスがスレッドの概念を持ちスレッドの単位でアクセスを処理するマルチプロセス処理  
* prefork : 1リクエストに対して1プロセスを起動し処理をしていくシングルプロセス処理  
* event : worker同様スレッドで処理を行うが、keepaliveの管理方法が違うため worker より処理が早いと言われている  

apache2.4 以降は event がデフォルトに採用されていて特に理由がなければ event を採用したほうがパフォーマンスが良い。  
以前は php の場合、 mod_php を採用する関係で prefork を採用する必要があったが、redhat9 以降 php-fpm が推奨され mod_php は廃止されたため event でよい。  

### event の基本設定  
<LinkTag url="https://httpd.apache.org/docs/2.4/mod/event.html">Apache MPM event</LinkTag>  

```
# vim /etc/httpd/conf.mobules.d/00-mpm.conf
        StartServers             2
        MinSpareThreads          25
        MaxSpareThreads          75
        ThreadLimit              64
        ThreadsPerChild          25
        MaxRequestWorkers        150
        MaxConnectionsPerChild   0
        AsyncRequestWorkerFactor 2
```

最大接続数のは以下のように求める(よくわからない)  

> MaxRequestWorkers ≦ ServerLimit × ThreadLimit
> max_connections = (ThreadsPerChild + (AsyncRequestWorkerFactor * idle_workers)) * ServerLimit
> max_connections = (AsyncRequestWorkerFactor + 1) * MaxRequestWorkers

## ログ管理
Apacheのログはデフォルトで `logs/access.log`、`logs/error.log` に出力されるようになっているが、VirtualHostなどでサイトごとに細分化したりローテート処理を行おうと思うと og 出力処理はサーバプロセスと紐づけられているため少し手間が必要になっている  

デフォルトで提供されてているローテート方法は以下  

* logrotated : OS提供のローテートツール  
* rotatelogs : Apacheに同梱されているローテート用コマンド  

### logrotated
デフォルト設定は下記  

```
# vim /etc/logrotate.d/httpd
/var/log/httpd/*log {
    missingok
    notifempty
    sharedscripts
    delaycompress
    postrotate
        /bin/systemctl reload httpd.service > /dev/null 2>/dev/null || true
    endscript
}
```

logrotate で管理している場合ローテートタイミングで reload(grasefull)が発生するため、  
OSログ含め一括で管理出来る点はメリットだが、運用管理上問題がある場合は削除し別の方法を検討する必要がある。  

### rotatelogs
Apache の log 定義にはコマンドを指定することができ、以下のようにコマンドを渡すことでログのローテート、管理を行う事ができる  

```
CustomLog "|/usr/sbin/rotatelogs -l -n 4 logs/access_log 86400 540" combined
```

上記の場合 `-l` でローカルタイム参照、 `-n` で ログの保持世代を指定、 `86400` でローテートタイミング（秒数）を指定し、 `540` でオフセット、ローテートタイミングの時間基準を指定している  
ログファイル名も `%Y%m%d` で日時形式を指定できるが `-n` オプションと一緒には指定することができないため注意  

### cronolog
EPELリポジトリで提供されているログローテートツール  
rotatelogsと違い、ログ保存先のディレクトリ作成まで行え、 `/%Y/%m/access.log.%d` のような詳細なログ管理を定義できる  
ただし世代管理は行えないため別途仕組みが必要  
