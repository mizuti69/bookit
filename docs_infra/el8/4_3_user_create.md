---
id: user_create
title: "ユーザー／グループの作成"
---
import { LinkTag } from './basecomponent.jsx';

設計にもとづきグループとユーザーを作成する  

## OSグループの作成  

```
# groupadd -g {gid} {group name}
```

## OSアカウントの作成  

```
# useradd -u {uid} -g {group name} -G {subgroup name} -s {login shell} {username}
```

* `-M`を指定した場合ユーザー用のホームディレクトリ、メールボックスは作成されない  
* `-c "${コメント}"`を指定した場合コメントを追記することができる  
* `-d`を指定した場合ホームディレクトリを指定することができる  
* `-g`を指定しない場合ユーザー名がグループ名に指定されます  

## パスワード設定  

```
# passwd {username}
```

* `-l`オプションを利用した場合アカウントをロックすることができる  
