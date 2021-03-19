---
id: subscribe
title: "サブスクリプション登録"
---
import { LinkTag } from './basecomponent.jsx';

## Redhat 開発用サブスクリプション登録  
開発用寒サブスクリプションを利用してOSインストールを行ないたい場合は開発サイトに登録し、専用のISOをダウンロードする必要がある。  
<LinkTag url="https://developers.redhat.com/">Redhat Developer</LinkTag>  

サイトより利用したいOSのISOイメージをダウンロードする。  
その時利用者情報の入力を求められ、入力後ダウンロードが開始する。  
しばらくするとカスタマーポータルにてサブスクリプションが関連付けされていることを確認できる。  

<img src={require('./assets/os8_premise_01.png').default} />  

インストールしたサーバへのサブスクリプション登録  

```
# subscription-manager register --username {username} --password {password} --autosubscribe
```

カスタマーポータルにて割当が正常にできていることも確認  

<img src={require('./assets/os8_premise_02.png').default} />  

開発用サブスクリプションの有効期限は1年  
