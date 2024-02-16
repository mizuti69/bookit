---
id: timedata
title: "時刻設定"
---
import { LinkTag } from './basecomponent.jsx';

## chronyとは
ntpdとは異なるNTP プロトコルの実装で、システムクロックをより迅速に調整することが可能です。  
ntpdとchronydの大きな違いの1つは、コンピューターのクロックを管理するために使われるアルゴリズムにあります  
Chrony は、頻繁にネットワーク接続が一時停止したり、断続的に切断され再接続されるようなシステムの場合に検討してください。  
たとえば、モバイルや仮想システムなどです。  

NTPデーモン(ntpd)は、通常、常時接続のシステムの場合に検討してください。  
ブロードキャストまたはマルチキャストIPを使用する必要のあるシステム、  
またはAutokeyプロトコルでパケット認証を実行する必要のあるシステムの場合は、ntpdの使用を検討してください。  
Chronyは、MD5、SHA1、またはより強力なハッシュ機能のあるメッセージ認証コード(MAC)を使用した対称鍵認証のみをサポートしますが、  
ntpdはPKIシステムの活用も可能なAutokey認証プロトコルもサポートします。  

上記のように用途に分けて利用を決定する  
基本的には従来の NTPD のように設定する事が可能  

<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/8/html/configuring_basic_system_settings/configuring-time-synchronization_configuring-basic-system-settings#assembly_overview-of-network-time-security-in-chrony_configuring-time-synchronization">時刻同期の設定</LinkTag>  

## インストール  

```
# dnf install chrony
```

NTP設定を有効化  

```
# timedatectl set-ntp yes
# timedatectl status
               Local time: 木 2019-05-16 17:32:11 JST
           Universal time: 木 2019-05-16 08:32:11 UTC
                 RTC time: 木 2019-05-16 08:32:11
                Time zone: Asia/Tokyo (JST, +0900)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no
```

## クライアント設定
時刻同期のクライアントとして利用する設定を行います。  
設定ファイルは `/etc/chrony.conf` を編集します。  

### 同期サーバの指定  

```
# vim /etc/chrony.conf
server {ntp server ip} prefer iburst minpoll 4 maxpoll 4
```

`iburst` オプションは付いた NTP サーバに対して、起動直後に短い間隔で4回問い合わせをする（ ntpd の iburst は8回）  
NTPサーバの妥当性の判断には1回の問い合わせだけでは足りず数回を要するのだが、  
起動直後に4度問い合わせをすることによって妥当性判断が早く済み、  
結果として起動から時刻同期が行われるまでの時間が短くなる  

### ハード時刻の調整  

ハード時刻を NTP システム時刻で調整する  

```
rtcsync
```

パラメータを指定しておくことで、11分ごとにハード時刻を調整する  

### step時刻調整  

OS起動時のみ step にて時刻を調整するよう指定が出来る  
`ntpd` は `ntpdate` サービスと分けてOS起動時に `ntpdate` を実行させていたが chrony は下記記述で指定可能  

```
makestep 1.0 3
```

デフォルトでは起動時に1秒以上時間がずれていた場合、3回まで `step` 調整で時刻を同期する  

### リスニングポート・アドレス  
クライアント用途で利用するため、ポートをリスニングしないよう設定  

```
port 0
```

またリスニングアドレスもローカルのみとしておく  
IPv6を無効化している場合はコメントアウトしておく  

```
bindcmdaddress 127.0.0.1
#bindcmdaddress ::1
```

## サーバ設定

同期サーバ、ハード時刻調整、step時刻調整はクライアント設定と同様  

### リスニングポート・アドレス  

サーバ用にポートを開放  

```
port 123
```

### 参照制御  
リモートクライアントからのアクセス制御  
chrony では細かい権限の制御ではなく、ネットワーク単位レベルでのアクセス可否を設定  

```
allow {ntp client ip}
```

## うるう秒設定
chronyはうるう秒の際の動作がデフォルトでは step 動作になっているため、明示的に設定する  

```
leapsecmode slew
maxslewrate 1000
```

## サーバの起動
設定完了後、時刻同期を開始  

```
# systemctl start chronyd
```

同期状態の確認  

```
# chronyc sources
```
