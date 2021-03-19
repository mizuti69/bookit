---
id: clock
title: "システム時刻"
---
import { LinkTag } from './basecomponent.jsx';

## Linuxシステム時刻の概要  
Linuxの時刻調整には「地域標準時(LOCAL)」と「協定世界時(UTC)」がある。  
選択地域の設定を変更する事で地域標準時にする事も可能。  

* 地域標準時(LOCAL)  
  UTC/GMTから取得した時刻にタイムゾーンの標準時を計算した時間（`UTC/GMT ± タイムゾーン`）  
* 協定世界時(UTC)  
  原子時計により精密に時間が調整されている世界共通の標準時間  
  閏秒の調整も行われている  

<LinkTag url="https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/7/html/system_administrators_guide/chap-configuring_the_date_and_time">日付と時刻の設定]</LinkTag>  

最新のオペレーティングシステムは、2つのタイプのクロックを区別します。  
リアルタイムクロック (RTC) は、一般にハードウェアクロック と呼ばれます。  
これは通常、システムボード上の集積回路で、オペレーティングシステムの現行状態からは完全に独立しており、コンピューターがシャットダウンしても稼働しています。  
システムクロックはソフトウェアクロック とも呼ばれ、カーネルが維持し、その初期値はリアルタイムクロックに基づいています。  
システムが起動するとシステムクロックは初期化され、リアルタイムクロックとは完全に独立したものになります。  
リアルタイムクロックは、ローカルタイムか協定世界時(UTC)のいずれかを使うことができます。  
リアルタイムクロックが UTC を使うように設定すると、システムクロックは使用中のタイムゾーンにその時間差を適用して計算され、該当する場合は、夏時間(DST)も同様に計算されます。  
対照的に、ローカルタイムは存在地のタイムゾーンにおける実際の時間を表します。  
ほとんどの場合は、UTC の使用が推奨されます。  

## システムタイムゾーンの設定  
システム全般の時刻状況を確認  

```
# timedatectl
               Local time: 火 2019-05-14 19:32:43 JST
           Universal time: 火 2019-05-14 10:32:43 UTC
                 RTC time: 火 2019-05-14 10:32:41
                Time zone: Asia/Tokyo (JST, +0900)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no
```

タイムゾーンの変更  

```
# timedatectl set-timezone Asia/Tokyo
```

利用可能なタイムゾーンの確認  

```
# timedatectl list-timezones | grep Asia
```

:::caution
timedatectl は、chrony または ntpd のステータスへの変更を即座に認識しません。  
これらのツールの設定またはステータスを変更した場合は、以下のコマンドを実行します。  

```
systemctl restart systemd-timedated.service
```
:::