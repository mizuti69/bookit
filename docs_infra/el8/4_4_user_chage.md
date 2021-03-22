---
id: user_chage
title: "ユーザーパスワードの有効期限管理"
---
import { LinkTag } from './basecomponent.jsx';

## パスワード有効期限の設定  
前回パスワード設定から指定日数過ぎたアカウントのパスワードを無効化させます  
パスワードが切れてもアカウントロックはしません 

例）パスワード有効期限を90日に設定  

```
# chage -M 90 {ユーザー名}
```

パスワード有効期限が切れた後SSHアクセスすると以下のような文言が表示され  
変更を促されます  

```
You are required to change your password immediately (root enforced)
WARNING: Your password has expired.
You must change your password now and login again!
Changing password for user user.
Changing password for user.
(current) UNIX password: <古いパスワード>
New password: <新しいパスワード>
Retype new password: <新しいパスワード>
```

## パスワード有効期限切れ通知  
既存の設定で期限切れ間直の通知を出すような機能はない  
`shadow`ファイルにはパスワード設定タイミングの情報が記載されてるようなので、そこから計算します  

1970-01-01 00:00:00 UTC からの秒数を日数に変換

```bash
expr `date +%s` / 60 / 60 / 24
```

`shadow`ファイルの3項目目に同様時刻からの設定日が記載されているので  
`date`コマンドから取得した値から引くことで、初期パスワード設定日から何日経過しているかを計算する  

## 指定日時過ぎたパスワード設定がされているアカウントを無効化したい場合  

```
# chage -I <日数> {ユーザー名}
```

* パスワードロックをデフォルト値にしたい場合  
  `login.defs`ファイルの`PASS_MAX_DAYS`の値を変更することで、  
  「変更後に」作成されたアカウントのデフォルトになる。  
* ユーザーロックをデフォルト値にしたい場合  
  `useradd`ファイルの`INACTIVE`値を変更することで、  
  「変更後に」作成されたアカウントのデフォルトになる。  
