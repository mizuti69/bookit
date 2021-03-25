---
id: introduction
title: "はじめに"
---
import { LinkTag } from '../basecomponent.jsx';

## ELEGOO Arduino UNO R3 Super Starter Kit 
本チュートリアルは Arduino UNO R3 互換ボードを販売している ELEGOO の付属チュートリアル内容になります。  

<LinkTag url="https://www.elegoo.com/">ELEGOO</LinkTag>
<LinkTag url="https://www.elegoo.com/pages/arduino-kits-support-files"> ELEGOO UNO R3 SuperStarter Kit - Tutorial & Code</LinkTag>

### Arduino UNO R3 の仕様

<img src={require('./assets/arduino-00.png').default} />

<LinkTag url="http://localhost:3000/docs_iot/arduino/introduction">full pinout diagram</LinkTag>

:::note 電子回路の基礎知識  
* GND  
GND は「グランド」と読みます。0Vの基準点を示してくれるピンで、電池のマイナス極と似た役割を持っています。デジタルピンから電圧をかけるときは、最終的にこのピンに結線して、回路を作ります。  
* 5V/3V  
5Vピンは5ボルトの電力を供給し、3.3Vピンは3.3ボルトの電力を供給します。Arduinoで使われている簡単な部品のほとんどは、5ボルトでも3.3ボルトでも問題なく動作します。  
* Analog  
アナログインラベルの下にあるピンの領域（UNO の A0～A5）がアナログインピンです。これらのピンは、アナログセンサー（温度センサーのようなもの）からの信号を読み取って、読み取れるデジタル値に変換することができます。  
* Digital  
デジタルピン（UNO の 0～13）があります。これらのピンはデジタル入力（ボタンが押されているかどうかを知らせるようなもの）とデジタル出力（LEDへの電力供給のようなもの）の両方に使用することができる。デジタルという名前の通り、HIGHとLOWだけを扱えます。電圧をかけるときは5V、かけないときは0Vになります。電圧を読み取るときも、HIGHとLOWの区別だけができます。穴のすぐ下に、0から13の数字が書いてありますが、これがピンのIDを表しています。プログラムを書くときは、「DIGITAL PINの13番から電圧をかける」というような処理を記述します。  
* PWM  
デジタルピンの出力はHIGHかLOWだけだが、電圧によって自由に調整したい場合があります。その際にHIGHとLOWを素早く切り替えることで擬似的にアナログ的な出力を実現させるための手法です。デジタルピンの隣にチルダ(~)があることにお気づきかもしれません。(UNO では 3, 5, 6, 9, 10, 11)。これらのピンは通常のデジタルピンとして機能しますが、パルス幅変調（PWM）と呼ばれるものに対応したピンになります。  
* AREF  
Analog Reference の略です。ほとんどの場合、このピンは放っておいても大丈夫です。アナログ入力ピンの上限として外部基準電圧（0～5 ボルト）を設定するために使用されることがあります。  
:::

各ピンの使い方や仕組みについてはチュートリアルの中で実際に学習していく  

## IDE のインストール
Arduino IDE は Arduino 開発におけるプラットフォームです。Arduino をプログラミングするために必要で各種OSに用意されているため、環境に応じてインストールしセットアップしておく。
IDEにはソフトウェ版とオンライン版があり好きな方を利用できる。  

ここでは Windows 端末にインストール、作業する場合の手順となります。  

### インストール
下記等よりダウンロードしインストールする。  

<LinkTag url="https://www.arduino.cc/en/software">Arduino IDE</LinkTag>

### ドライバ認識の確認
Windows において Arduino 用のドライバが正常に認識されない場合があるため、認識状態を確認しておく。  

<img src={require('./assets/tutorial-03.png').default} />

### ライブラリの管理  
インストールが完了し、IDEを起動すると場合によってはライブラリのアップデートを促されます。Arduino では様々なボードや接続機器を簡単にプログラミングできるよう多くのライブラリやツールが用意されています。チュートリアルにおいてライブラリの更新や追加が必要な場合があるため理解しておく。  

### 接続確認
IDEを起動し、Arduino を PC に接続し、IDEからきちんと認識されることを確認する。ドライバーがきちんとインストールされていれば下記のようにシリアル接続されている事を確認できる。  

<img src={require('./assets/tutorial-05.png').default} width="50%"/>
