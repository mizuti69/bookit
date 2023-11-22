---
id: ssh_auth
title: "SSH認証設定"
---
import { LinkTag } from './basecomponent.jsx';

:::tip memo
クラウドサービスやコンテナが主流となり単純にサーバへのアクセス方法がSSHのみと言えなくなっている  
サーバを運用する場合、クラウドサービスのコンソール権限、API、コンソール上のターミナルサービスなど  
総合的に運用の実態を把握する必要がある  
:::

## パスワード認証設定
パスワード認証の設定  

* メリット  
  * アカウントのパスワードを知っていれば特別な操作はいらない  
* デメリット  
  * パスワードがネットワーク上を流れるのでパスワードを盗まれる可能性がないとはいえない  
  * ブルートフォースアタック等によりパスワードが流出する可能性がある  

パスワード認証より鍵認証のほうがセキュアだという記事をよく見るが、サーバ側からすればそうでしょう  
しかしデメリットの部分を考えてみるとパスワード認証でも鍵認証でも流出が根本の問題となり接続、運用を行う担当者がリスクとなる問題  
パスワードだからセキュアではない、鍵認証だからセキュアだという意識ではなく  
運用担当者は管理できているか、SSHへのアクセス制限は実施しているか、作業端末は固定化しているかなどをまず考えるべき  
その上で運用や現場の利用手法よりセキュアな通信、接続方法を実施する  

```
# vim /etc/ssh/sshd_config
PasswordAuthentication yes
ChallengeResponseAuthentication yes
UsePAM yes
```

## 鍵認証設定
鍵認証方法によるユーザー認証設定  

* メリット  
  * ネットワーク上をパスワードが流れる心配がないのでパスワード認証方式より安全  
  * 鍵ファイルとパスフレーズ両方で流出を防ぐ事が出来る  
* デメリット  
  * 前もって鍵ファイルをサーバや作業端末に登録しておく必要があるため運用が手間  
  * 作業環境分の鍵ファイルコピーや作成を行う必要があるため手間  

パスワードだからセキュアではない、鍵認証だからセキュアだという意識ではなく  
運用担当者は管理できているか、SSHへのアクセス制限は実施しているか、作業端末は固定化しているかなどをまず考えるべき  
その上でよりセキュアな通信、接続方法を実施する  

まず鍵認証を許可するよう設定します。  

```
# vim /etc/ssh/sshd_config
RSAAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile     .ssh/authorized_keys
```

SSHを再起動して設定を反映後、鍵交換により接続出来る事を確認する  
鍵認証による接続が確認できた後、パスワード認証を無効化  

```
# vim /etc/ssh/sshd_config
PasswordAuthentication no
ChallengeResponseAuthentication no
KbdInteractiveAuthentication no
```

再度SSHを再起動して設定を反映し、パスワードでSSHログインできない事を確認  

```
# sshd -t
# systemctl start sshd
```

:::inf FIPS
Redhat8以降 `sshd_config` を設定し `sshd -t` コマンドでコンフィグ確認を行うと次のようなメッセージが表示される  

```
main: sshd: ssh-rsa algorithm is disabled
```

これはRSA/SHA1 暗号方式の鍵 (ssh-rsa) がデフォルトで無効になっているためです  
そのため鍵を作成する場合は以下のコマンドで作成します  

```
$ ssh-keygen -t ecdsa
```

:::