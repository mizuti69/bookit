---
id: update
title: "セキュリティパッチの適用"
---
import { LinkTag } from './basecomponent.jsx';

## DNF設定
詳細なパラメータはマニュアルを参照  
<LinkTag url="https://dnf.readthedocs.io/en/latest/conf_ref.html#installonlypkgs-label">DNF Configuration Reference</LinkTag>  

### Proxy設定
Proxy配下環境で dnf を利用する場合は Proxy 設定をしておく必要がある  

```
# vim /etc/dnf/dnf.conf
proxy=http://{proxy server}:{port}/
```

### インストール除外設定  
バージョン指定でインストールし、以降アップデートや依存関係でバージョンが変わらないように制限したい場合、  
パッケージ検索から除外するようにする  

```
# vim /etc/dnf/dnf.conf
exclude=kernel*
```

インストールは許可し、アップデートは行ないたくない場合  

```
# vim /etc/dnf/dnf.conf
installonlypkgs=kernel kernel-smp kernel-devel kernel-smp-devel kernel-largesmp kernel-largesmp-devel kernel-hugemem kernel-hugemem-devel
```

### パッケージキャッシュの有効化
初期セットアップ以降にアップデートしたパッケージは履歴保持するよう設定  

```
# vim /etc/dnf/dnf.conf
keepcache=1
```

下記コマンドで履歴も消えてしまうので注意  

```
# dnf clean all
```

## アップデート  
初期構築時、全てのパッケージをアップデートしておく  

```
# dnf update
```

アップデート可能パッケージの確認は下記で確認できる  

```
# dnf check-update
# dnf check-update パッケージ名
```

## 自動アップデート
開発環境など、自動でパッチ適応を行ないたい場合に設定  

```
# dnf install dnf-automatic
```

* アップグレードタイプの設定  

デフォルトは全てのパッケージをアップグレードする  

```
# vim /etc/dnf/automatic.conf
upgrade_type = default
```

* アップグレードタイミング  

新しいパッケージがある場合即時適応したければ`yes`に変更  

```
# vim /etc/dnf/automatic.conf
apply_updates = no
```

デフォルトでは初回起動時10分後に実行され、以降は１時間毎に実行される  

```
# cat /etc/systemd/system/multi-user.target.wants/dnf-makecache.timer
[Timer]
OnBootSec=10min
OnUnitInactiveSec=1h
Unit=dnf-makecache.service
```

* サービスの開始  

```
# systemctl enable dnf-automatic.timer
# systemctl start dnf-automatic.timer
```
