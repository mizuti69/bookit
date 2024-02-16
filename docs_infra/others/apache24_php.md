---
id: apache24_php
title: "Apache24 と PHP8 の設定"
---
import { LinkTag } from './basecomponent.jsx';

## PHPのインストール
リポジトリで対応しているバージョンを確認する  

```
# dnf module list
```

Redhat9.3の場合 php 8.1 まで標準リポジトリで提供されているため、モジュールリストにない場合追加する  

```
# dnf module enable php:8.1
```

インストール  

```
# dnf install php
```

## PHPの基本設定
<LinkTag url="https://www.php.net/manual/ja/opcache.configuration.php#ini.opcache.revalidate-freq">OPCache 実行時設定</LinkTag>  

### ヘッダー情報の隠蔽

```
expose_php = Off
```

### PHP実行許可ディレクトリの設定
アプリケーション要件に合わせて設定  

```
open_basedir = /
```

### 文字コードの指定

```
default_charset = "UTF-8"
mbstring.language = Japanese
```

### ログ出力設定

```
log_errors = On
```

ログレベル
下記のログレベルの場合E_STRICT、E_DEPRECATEDは出力されない  

```
error_reporting = E_ALL & ~E_DEPRECATED & ~E_STRICT
```

ログ出力先  
デフォルトは空  

```
error_log = syslog
```

### メモリ割当量  
ベースとして平均的メモリ制限をiniファイルで設定し、それ以上必要な場合はアプリファイル内で設定させる  

```
memory_limit = 128M
```

### タイムゾーン
デフォルトは空  

```
date.timezone = "Asia/Tokyo"
```

### 処理タイムアウト
スクリプトがパーサにより強制終了されるまでに許容される最大の 時間を秒単位で指定  
デフォルトは0、アプリケーション要件やサイト要件に合わせて調整する  

```
max_execution_time=0
```


### ファイルPOST制限
システム要件に合わせて設定、メモリ制限と合わせて調整  

```
file_uploads = On
upload_max_filesize = 2M
max_file_uploads = 20
```

## モジュール設定

### OPCache

#### 有効化  

```
opcache.enable=1
```

#### キャッシュ更新確認頻度  
更新確認の有効化  

```
opcache.validate_timestamps=1
```

#### 更新頻度の指定（秒数）  
0を指定した場合リクエスト毎にチェックを行うようになる  

```
opcache.revalidate_freq=2
```

#### キャッシュ除外リスト

```
opcache.blacklist_filename=/etc/php.d/opcache*.blacklist
```

#### キャッシュサイズ
キャッシュできるファイル・サイズの最大（バイト）  
デフォルトは0で上限なし  

```
opcache.max_file_size=0
```

#### キャッシュロックタイムアウト
キャッシュがアクティブではない場合に、スケジュールされた再起動が始まるのを待つ時間の長さ（秒）  

```
opcache.force_restart_timeout=180
```

#### ログ出力
デフォルトは空で、stderr と同様に扱われ、結果として標準エラー（ほとんどの場合、Web サーバーのエラーログ）に送られる  

```
opcache.error_log=
```

### JIT
OPCacheの一部として組み込まれているPHP8以降の新しいキャッシュ機能  
定義ファイルがデフォルトではない場合があるため `/etc/php.d/10-jit.ini` 等作成して定義を記述する  

#### JIT有効化

```
opcache.jit=tracing
```

* disable: 完全に無効にする。実行時にも有効にできません。
* off: 無効にしますが、実行時に有効にできます。
* tracing/on: トレーシングJIT を使う。 デフォルトはこの値です。ほとんどのユーザに推奨される値です。
* function: 関数単位でJITを使う。

#### キャッシュサイズ
コンパイル済みのJITコードを保存する共有メモリの合計サイズ（バイト）
デフォルトは0で0は無効化を意味する  

```
opcache.jit_buffer_size=0
```

memory_limit ～　OPCacheの半分くらいの値を割り当てるのが良いらしい  


### APCu

:::info
PHP8ではAPCuはサポートされていない  
:::


## php-fpmのインストール  
PHPをインストールすると標準で一緒にインストールされる  
されていない場合はインストール  

```
# dnf install php-fpm
```

自動起動設定  

```
# systemctl enable php-fpm
# systemctl start php-fpm
```

## php-fpm の基本設定
<LinkTag url="https://www.php.net/manual/ja/install.fpm.php">FastCGI Process Manager</LinkTag>  

Apache24以降レガシーな技術となってきた mod_php が廃止され php-fpm（CGI）経由での実行が標準となったアプリケーションサーバ  
php-fpmサーバとApacheの連携には mod_proxy_fcgi によって行われる  

<LinkTag url="https://www.php.net/manual/ja/install.fpm.configuration.php">php-fpm インストールと設定</LinkTag>  

基本設定ファイルは `/etc/php-fpm.conf`

### ログ出力
"syslog" と設定すると、ログをローカルファイルに書き出すのではなく、syslogd に送信  

```
error_log = /var/log/php-fpm/error.log
```

### プロセスタイムアウト
デフォルトは0 なので ApacheのTimeoutと調整する  

```
process_control_timeout = 0
```

### プール設定
`/etc/php-fpm.d/www.conf` 等プール定義ファイルに記載されている  
プール名を `[]` で宣言しそのプール内に設定を定義していく  

:::info
プール単位でリスナーやログ、実行ユーザー、プロセス管理を行えるため  
複数サイトや権限管理を分けたい場合はプールの細分化や設定を検討する事で可能？  
:::

#### 実行ユーザー
プロセス実行ユーザー  

```
user = apache
group = apache
```

#### FastCGI リクエストを受け入れるアドレス
ip.add.re.ss:port', 'port', '/path/to/unix/socket' 形式の構文が使え、Apache側で指定する際にも使う  

```
listen = /run/php-fpm/www.sock
```

#### ソケットパーミッション 
読み書きアクセス権限を設定しないとウェブサーバーからの接続を受け付けることができません  
デフォルト値: ユーザーとグループは実行しているユーザーと同じ、モードは 0660  
`listen.acl_users`設定した場合は、`listen.owner` および `listen.group` は無視され`listen.acl_groups`は`listen.acl_users`を参照します  

```
;listen.owner = nobody
;listen.group = nobody
;listen.mode = 0660
listen.acl_users = apache,nginx
;listen.acl_groups =
```

#### リスニングIP
tcp でリスンするソケットに対してのみ意味をなします  

```
listen.allowed_clients = 127.0.0.1
```

#### プロセスマネージ方法  
サイトの特性やアプリケーションに求められるも、Apacheのプロセス管理方法と合わせて適切なものを選択する  

* static - 子プロセスの数は固定 (pm.max_children) です。
* ondemand - プロセスを必要に応じて立ち上げます。 dynamic とは対照的に、リクエストされると pm.start_servers で指定しただけサービスを開始します。
* dynamic - 子プロセスの数は、 pm.max_children、pm.start_servers、 pm.min_spare_servers、pm.max_spare_servers の内容に基づいて動的に設定されます。

```
pm = dynamic
```

Apacheのmpmプロセス設定数 <= php-fpm のプロセス数とする  

```
pm.max_children = 50  ## 最大子プロセス数、mpmの最大接続数以上
pm.start_servers = 5  ## 最小デフォルト起動プロセス数（min_spare_servers + (max_spare_servers - min_spare_servers)/2）、mpm の StartServers数以上
pm.min_spare_servers = 5 ## アイドル状態のサーバープロセス数の最小値、mpm の StartServers数以上
pm.max_spare_servers = 35 ## アイドル状態のサーバープロセス数の最大値、mpm の ServerLimit（MaxRequestWorkers / ThreadsPerChild） 以上
```

#### アイドルタイムアウト
アイドルなプロセスがkillされた後の秒数、デフォルト10秒  
プロセスのライフサイクル  

```
pm.process_idle_timeout = 10s;
```

#### 最大処理リクエスト数
各子プロセスが、再起動するまでに実行するリクエスト数、メモリリーク対策として定義可能  
デフォルトは 0 で再起動せずにずっとリクエストを処理する  

```
pm.max_requests = 0
```

#### 処理タイムアウト
'max_execution_time' ini オプションが何らかの理由でスクリプトの実行を止められなかった場合に使われる単一のリクエストを処理する際のタイムアウト。  
この時間を過ぎるとワーカープロセスが kill されます。  
デフォルトは 0  

Apacheのタイムアウトと調整  

```
;request_terminate_timeout = 0
```

#### アクセスログ系
問題発生時の切り分けように有効化しておく  

```
access.log = /var/log/php-fpm/$pool.access.log
access.format = "%R - %u %t \"%m %r%Q%q\" %s %f %{mili}d %{kilo}M %C%%"
slowlog = /var/log/php-fpm/www-slow.log
request_slowlog_timeout = 60s
request_slowlog_trace_depth = 20
```

#### 不要な環境変数の除外
任意の環境変数が FPM ワーカープロセスに到達してしまうことを防ぐために、 ワーカー内の環境をいったんクリアしてから、このプールの設定で指定された環境変数を追加します  

```
clear_env = yes
```

#### 実行可能拡張子の制限
FPM がパース可能なメインスクリプトを拡張子で制限する  
悪意のあるユーザーがその他の拡張子で php のコードを実行させようとする試みを防ぐことができます  

```
security.limit_extensions = .php
```

### ログのローテート
デフォルトで logrotated に設定されている  

```
# vim /etc/logrotate.d/php-fpm
/var/log/php-fpm/*log {
    missingok
    notifempty
    sharedscripts
    delaycompress
    postrotate
        /bin/kill -SIGUSR1 `cat /run/php-fpm/php-fpm.pid 2>/dev/null` 2>/dev/null || true
    endscript
}
```

## Apacheの設定

### ProxyCGIモジュールの有効化
php-fpmに対して ProxyCGIモジュールで通信するため有効化  

```
# vim /etc/httpd/conf.modules.d/00-proxy.conf
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_fcgi_module modules/mod_proxy_fcgi.so
```

### php-fpm連携設定
php-fpmインストール時にサンプルコンフィグが `/etc/httpd/conf.d/php.conf` に作成されているので参考に  
FileMatchでドキュメンルート配下の `.php` 拡張子に対するリクエストは php-fpm に転送する   

```
  <Directory /var/www/html>
    Options -Indexes -MultiViews +IncludesNOEXEC
    AllowOverride ALL
    Require all granted
    <FilesMatch \.php$>
       SetHandler "proxy:unix:/run/php-fpm/www.sock|fcgi://127.0.0.1"
    </FilesMatch>
  </Directory>
```

