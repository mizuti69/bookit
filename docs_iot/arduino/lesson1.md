---
id: lesson1
title: Lesson 1  
---
import { LinkTag } from '../basecomponent.jsx';

## IDE ライブラリの追加とシリアルモニタ接続

### ライブラリの追加
Arduino IDE に新しいライブラリをインストールするにはライブラリマネージャを使用するのが良いです。 IDE を開き「スケッチ」 -> 「ライブラリのインクルード」 -> 「ライブラリの管理」  

<img src={require('./assets/tutorial-28.png').default} width="50%"/>

ライブラリマネージャーではインストール済みライブラリのアップデートやリポジトリにあるライブラリの追加が行えます。  

<img src={require('./assets/tutorial-04.png').default} width="50%"/>

### ZIP ライブラリのインポート
ZIP形式のサードパーティや配布されているライブラリを手動でインポートすることも出来ます。ライブラリマネージャー同様に IDEの「スケッチ」から「.ZIP形式のライブラリをインストール」を選択し、PC上にあるライブラリファイルをインポートすることが出来ます。  

<img src={require('./assets/tutorial-27.png').default} width="50%"/>

### シリアル接続
Arduino IDE にはシリアルモニタが付属しており、シリアルモニタアイコンをクリックするだけで接続することが出来ます。  
うまく接続出来ない場合は「ツール」 -> 「シリアルポート」から Arduino が正常に認識出来ていることを確認してください。  

<img src={require('./assets/tutorial-06.png').default} width="50%"/>

