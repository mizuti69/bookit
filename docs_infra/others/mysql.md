---
id: mysql
title: "MySQLの設定"
---
import { LinkTag } from './basecomponent.jsx';

RDSなどマネージドサービスでの利用が基本的になってきたためパラメータについてのメモのみ残す  

## サーバ設定
MySQL8からキャッシュシステムはなくなりました  

### パスワード設定  
DBユーザーのパスワード有効期限を無期限に変更  
パスワードポリシーを変更する場合も定義  

```
default_password_lifetime = 0
validate_password_policy = LOW
```

### 最大接続数  
DBに接続できる最大同時接続数を設定  
サーバスペックと相談し、フロントサーバの接続数より少し多い値に設定しておく  

```
max_connections = 151
```

### 接続待ち数  
MySQLで保持できる未処理の接続リクエストの数  
50 + (max_connections / 5)から算出します  

```
back_log = 80
```

### 文字コード
MySQL8からデフォルトで `utf8mb4`  

```
character_set_database = utf8mb4
character_set_client = utf8mb4
```

### Collation
MySQL8からデフォルトで `utf8mb4_0900_as_ci` 必要により変更する  

```
collation_connection = utf8mb4_general_ci
collation_server = utf8mb4_general_ci
```

:::info 注意
`collation_database`、`character_set_database` は非推奨のシステム変数となり将来のバージョンで削除予定  
AWS RDSでは設定の変更は不可能で再起動時に初期値にリセットされる  
:::

:::info 注意
上記のようにデフォルトの文字コード、 collationがMySQL8から変更されており一部変更不可能なあパラメータもあるため  
MySQL DUMP/IMP する際には明示的に文字コードを指定して行うことが推奨されている  
:::

### SQL長
CMSなどSQLが冗長になる場合はパケット制限にかからないように調整する  

```
max_allowed_packet = 67108864
```

### トランザクション分離レベル
デフォルトはREPEATABLE-READ、アプリケーション要件と確認して設定する  

```
transaction_isolation = READ-COMMITTED
```

### サーバ時刻  
デフォルトはアメリカ時間になっていることが多いので明示的に指定  

```
time_zone = Asia/Tokyo
```

### 接続タイムアウト
クライアントからの接続タイムアウトを指定  

```
wait_timeout = 600
```

### タイムスタンプ処理
:::info 注意
このシステム変数は、サーバーがデフォルト値に対して特定の非標準動作を有効にするかどうか、および TIMESTAMP カラムで NULL 値の処理を有効にするかどうかを決定します。 デフォルトでは、explicit_defaults_for_timestamp は有効になっており、非標準動作は無効になっています。 explicit_defaults_for_timestamp を無効にすると、警告が表示されます。  
MySQL 8.0.18 では、このシステム変数のセッション値の設定は制限付き操作ではなくなりました。  
:::

```
explicit_defaults_for_timestamp =   ON
```

### ログ設定
スロークエリログを有効化  

```
slow_query_log = 1
long_query_time = 2
```
