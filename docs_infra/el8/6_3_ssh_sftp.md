---
id: ssh_sftp
title: "SFTPサーバ設定"
---
import { LinkTag } from './basecomponent.jsx';

## SFTPサーバ設定
OpenSSH-ServerにはSFTPサーバも含まれています。  
デフォルトの利用においては困ることは無いですが、FTPのようにログを出力するようにする事も可能  
ここではログファシリティを`AUTHPRIV`、ログレベルを`INFO`デフォルト`umask`を`002`にしています  

```
# vim /etc/ssh/sshd_config
Subsystem       sftp    /usr/libexec/openssh/sftp-server -f AUTHPRIV -l INFO -u 002
```

またSSHは許可せず、SFTPのみ許可したい場合はユーザー・グループ単位で指定可能です。  
SFTPのみ許可設定する場合はデフォルトの`sftp-server`ではなく、`internal-sftp`を利用  

```
# vim /etc/ssh/sshd_config
Match User sftp-user
        ForceCommand internal-sftp -f AUTHPRIV -l INFO -u 002
```

`internal-sftp`を利用する事で、ユーザーのログインシェルを`/sbin/nologin`にする事もできる  

:::caution
`Match User` 定義は明確な定義完了の区切りが無いため、通常の設定を `Match User` 定義の後ろに書くとサーバ設定として認識されずうまく動かない事があるため、必ずコンフィグの最後に記述する  
:::

## chroot設定
SFTPなどでFTPと同じようにchrootさせたい場合がある  
まずchrootさせたいユーザーがログインするディレクトリの上の階層がROOT権限、  
chrootユーザーで読み書きできない権限`755`である必要がある  

```
# mkdir /home/chroot/user
```

SSHサーバの設定にchrootしたいユーザーとディレクトリを定義  

```
# vim /etc/ssh/sshd_config
Match User sftp-user
  ChrootDirectory ~/
  ForceCommand internal-sftp
```
