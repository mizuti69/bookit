---
id: postfix
title: "Postfixの基本設定"
---
import { LinkTag } from './basecomponent.jsx';

## Postfix インストール
標準でインストールされている場合が多いですが、無い場合インストール  

```
# dnf install postfix
```

他のSMTPサーヒスがインストールされていた場合、デフォルトMTAを切り替えておく  

```
# alternatives --config mta
1 プログラムがあり 'mta' を提供します。

  選択       コマンド
-----------------------------------------------
*+ 1           /usr/sbin/sendmail.postfix

Enter を押して現在の選択 [+] を保持するか、選択番号を入力します:
```

自動起動設定  

```
# systemctl start postfix
# systemctl enable postfix
```

## Postfixの基本設定
サーバ用途、クライアント用途であっても同様に基本設定を行う  

```
# vim /etc/postfix/main.cf
```

### デフォルト設定  

```
command_directory = /usr/sbin
daemon_directory = /usr/libexec/postfix
data_directory = /var/lib/postfix
mail_owner = postfix
unknown_local_recipient_reject_code = 550
alias_maps = hash:/etc/aliases
alias_database = hash:/etc/aliases
debug_peer_level = 2
debugger_command =
         PATH=/bin:/usr/bin:/usr/local/bin:/usr/X11R6/bin
         ddd $daemon_directory/$process_name $process_id & sleep 5
sendmail_path = /usr/sbin/sendmail.postfix
newaliases_path = /usr/bin/newaliases.postfix
mailq_path = /usr/bin/mailq.postfix
setgid_group = postdrop
html_directory = no
manpage_directory = /usr/share/man
sample_directory = /usr/share/doc/postfix-2.10.1/samples
readme_directory = /usr/share/doc/postfix-2.10.1/README_FILES
```

### メールサーバ名  
`SMTP HELO`などメールを送信する場合に利用するメールサーバのドメイン名を設定  
基本的にはサービスで利用する`@`以下のドメイン名`@localhost.localdomain`を設定  

```
myhostname = localhost.localdomain
mydomain = localhost.localdomain
mydestination = $myhostname, localhost.$mydomain, localhost, localhost.localdomain, $myhostname.$mydomain
smtp_helo_name = $mydomain
```

メール通信の信頼性上、外部通信で利用する場合に設定するドメイン名は
以下のDNSレコードに登録されている必要がある  

1. Aレコード  
2. SPFレコード  
3. MXレコード  
  

### メールボックス  
ローカル上のメールボックスは指定がない限り下記にファイルで保存される  

```
queue_directory = /var/spool/postfix
home_mailbox =
```

ユーザーローカルに meilbox を作成し、ファイルで管理する場合は`home_mailbox`を定義  

### SMTPバナーの隠蔽  
SMTPバナーでメールサーバ情報やバージョンが表示されないようにする  

```
smtpd_banner = $myhostname ESMTP
```

### SMTP VRFYコマンド制御  
SMTP VRFY コマンドを無効化、存在ユーザー応答をしないようにする  

```
disable_vrfy_command = yes
```

### システム情報の隠蔽  
`Received`ヘッダやSMTPグリーティングバナー、バウンスされたメールに表示されるメールシステム名を隠蔽  

```
mail_name = unknown
```

### SMTP HELO要求  
SMTPリクエストがあったとき、リクエスト元のメールサーバ名を要求する  

```
smtpd_helo_required = yes
```

### SMTP HELOポリシー  
信頼されているネットワークからのSMTPリクエストは基本的に許可し、  
HELO または EHLO ホスト名の文法が不正な場合に、要求を拒否  
それ以外は処理  

```
smtpd_helo_restrictions = permit_mynetworks, reject_invalid_hostname
```

### メール受信ポリシー  
信頼されているネットワークからのメールは基本的に許可し、  
転送要求の場合は設定されているドメイン名のみ、受信の場合は自身のドメイン名、存在ユーザーでない場合は拒否  
それ以外は処理  

```
smtpd_recipient_restrictions = permit_mynetworks, reject_unauth_destination
```

### SMTP要求ポリシー  
信頼ネットワークからのリクエストのみ許可  

```
smtpd_client_restrictions = permit_mynetworks, permit
```

### 送信元ポリシー  
信頼されているネットワークからのメールは基本的に許可し、  
送信元のFROMドメインは名前解決できるドメインか、中継として利用しようとしていないか、
SMTP AUTHに成功していない場合は拒否  
それ以外は処理  

```
smtpd_sender_restrictions = permit_mynetworks,reject_unknown_sender_domain,reject_sender_login_mismatch
```

### SMTP ETRN要求ポリシー  
信頼されているネットワークからのメールは基本的に許可し、  
信頼できないサーバからの要求は拒否  
それ以外は処理  

```
smtpd_etrn_restrictions = permit_mynetworks, reject_invalid_hostname
```
