---
id: lesson16
title: Lesson 16  
---
import { LinkTag } from '../basecomponent.jsx';

## Eight LED with 74HC595 
フリップフロップ回路とシフトレジスタについての学習。  

### 必要な部品構成

* (1) x Elegoo Uno R3 
* (1) x 830 tie-points breadboard 
* (8) x leds 
* (8) x 220 ohm resistors 
* (1) x 74hc595 IC 
* (14) x M-M wires (Male to Male jumper wires) 

### シフトレジスタ
<img src="https://images-na.ssl-images-amazon.com/images/I/61vZGIBGMVL._AC_SL1100_.jpg" width="30%"/>

:::note フリップフロップ回路
シフトレジスタを理解するにはまず「フリップフロップ」について理解する必要がある。  
フリップフロップは日本語の「ギッコンバッタン」というシーソーの擬音と同様の意味を持つ英語が由来とされていて、フリップフロップを表す下記回路図のように `Q`、`Q#` がそれぞれシーソーのように両端にあり、出力を指し、`R`、 `S` がシーソーに乗ると対応した `Q`、 `Q#` が沈む、出力されることをイメージしています。  

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Flipflop_RS_type.png/295px-Flipflop_RS_type.png"/>

またシーソーのように、`R`、`S` が入力され、シーソーが傾き対応する `Q`、`Q#` が出力された後、`R`、 `S` がシーソーから降りても、シーソーは出力した方で傾いたままなのが特徴です。  
シーソーには同時に一人しか乗れません。  
このような RSフリップフロップは最も基本的なフリップフロップとなります。  

RSフリップフロップが前回の出力値を覚えている回路に対して、クロック信号(CK)の立ち上がりや立ち下がり(信号の HIGH - LOW 変化)のタイミングで入力信号の状態を保持し、出力を変化させる Dフリップフロップ回路があります。  

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/D-Type_Flip-flop_Diagram.svg/640px-D-Type_Flip-flop_Diagram.svg.png"/>

基本的なフリップフロップ回路が入力によりシーソーが傾き出力値が決まり、シーソーが傾いたままになるイメージで出力結果が保持されるのに対し、Dフリップフロップ回路はシーソーに乗ってもシーソーは傾きません。シーソーに乗ったり降りたりではなく、クロック信号の変化時の値を保持するため、シーソーに乗り（入力）、クロック信号が送られて初めてシーソーは傾き出力となり、保持されます。  
同様にこの後シーソーを降り（入力の停止）してもシーソーの傾きは変わりません。  

[順序回路、フリップフロップ - www.renesas.com](https://www.renesas.com/us/ja/support/engineer-school/digital-circuits-03-sequential-logic)  
[フリップフロップ - wikipedia](https://ja.wikipedia.org/wiki/%E3%83%95%E3%83%AA%E3%83%83%E3%83%97%E3%83%95%E3%83%AD%E3%83%83%E3%83%97)  
:::

シフトレジスタとは、複数のフリップフロップをカスケード接続し、データがその回路内を移動（シフト）していくよう構成したデジタル回路のことです。  
今までのチュートリアルでは一つの機器、回路に対して一つの役割（LEDの点灯やセンサーの入出力）を構築してきましたが、たった一つの信号を送受信だけする、一つ一つの送受信を一つずつ行うという事はデバイスや配線が巨大化、複雑化していき現実的ではありません。  
そこで フリップフロップ回路を応用したシフトレジスタが登場します。  

シフトレジスタはDフリップフロップ回路をカスケード接続し、複数の入力値を保持し一つにまとめて出力したりその逆のことを行うことが出来ます。どのフリップフロップを、いくつ必要か？は保存したいデータのビット数によって異なります。PCでいうメモリのイメージですね。  

シフトレジスタには接続方式によっていくつかの種類があります。  

* 直列入力直列出力形  
シフトレジスタの入力側と出力側にシリアル伝送され、クロック制御で1ビットずつシフトする接続形式のもの。最も基本的で、クロック信号を送ることでフリップフロップを1ビットずつシフトさせていくわけです。入力された値を同じ順序で出力させます。  

* 直列入力並列出力形  
入力がシリアル伝送、出力がパラレル出力のシフトレジスタ。シリアル信号をパラレル信号に変換する目的によく用いられ、接続されている全てのフリップフロップに格納されたデータを一緒に読み取り、まとめて出力します。  

* 並列入力直列出力形  
入力がパラレル伝送、出力がシリアル伝送のシフトレジスタ。直列入力並列出力形と同様に信号を変換する目的に用いられます。  

* 並列入力並列出力形  
入力も出力もパラレル伝送で行うシフトレジスタ。複数の入力をロードし、クロック信号で制御して同時に出力させます。  

その他にもデータのシフト方向を変化させるユニバーサルシフトレジスタなどもある。  

このようにシフトレジスタは複数のシリアル・パラレルの信号を保持し、変換するために用いられます。  
本キットにあるシフトレジスタは 「74HC595」というものでデータシートは下記となる。  

<LinkTag url="https://html.alldatasheet.jp/html-pdf/15644/PHILIPS/74HC595/246/1/74HC595.html">alldatasheet.jp - 74HC595</LinkTag>

b bit の シリアルイン シリアル or パラレル出力 シフトレジスタとある。  
### 構成

<img src={require('./assets/tutorial-49.png').default} />

シフトレジスタのピン配置は下記のようになっており、  

<img src={require('./assets/tutorial-50.png').default} />

ピン配線は下記のようにする。  
抵抗器はチュートリアル上は 220Ω 、LED点灯については学習した [Lesson 3](/docs_iot/arduino/lesson3) を復習し好きな抵抗器を配線する。  
シフトレジスタの上下は目印となる凹みがある方を頭に見。  

| 名前 | 対応ピン | 概要 |
| -- | :-- | :-- |
| Q1 | Green LED | パラレル出力ピン |
| Q2 | Red LED | パラレル出力ピン |
| Q3 | REd LED | パラレル出力ピン |
| Q4 | Yellow LED | パラレル出力ピン |
| Q5 | Yellow LED | パラレル出力ピン |
| Q6 | Blue LED | パラレル出力ピン |
| Q7 | Blue LED | パラレル出力ピン |
| GND | (-) | ground (0 V) |
| == | == | == |
| Vcc | (+) | 電源 |
| Q0 | Green LED | パラレル出力ピン |
| DS | pin 12 | シリアル入力 |
| OE | (-) | 出力の有効化 (active LOW) |
| ST_CP | pin ~11 | ストレージレジスタのクロック信号入力 |
| SH_CP | pin ~9 | シフトレジスタのクロック信号入力 |
| MR | (+) | シフトレジスタのクリア (active LOW) |
| Q7# | - | シリアル出力ピン |

74HC595シフトレジスタには出力ピンとクロック信号の入力ピン以外にも様々なピンがある。  

* OE  
出力ピンの制御を行うピン。 OE ピンに LOW を入力すると出力が有効になり、HIGH を入力すると出力を無効にできる。
* MR  
クロック信号の有無に関わらず、シフトレジスタのフリップフロップ回路の状態を LOW にします。MR に LOW (GND) を入力するとクリアされるので、利用する際には HIGH につなげる。  
* Q7#  
シフトレジスタ同士を繋げて利用する場合に使うピン。  

:::note ストレージレジスタとは？  
スリップフロップ回路をつなぎ合わせ、クロックにより数値を記憶できるようにしたり出力を制御できるシフトレジスタ回路のようなものを一般的にはレジスタといい、このように記憶や演算もできるようなレジスタと区別する目的で記憶と呼び出しのみ行えるレジスタをストレージレジスタと呼ぶ場合があります。  
マイコンなどの出力命令でデータを出力するとき、実際にマイコンから出力されたデータは一瞬しか出力されません。そこでそれをずっと保持（ラッチ）することが必要になり、そのためにDフリップフロップ回路やラッチレジスタを使います。  
今回のチュートリアルのようにシフトレジスタとストレージレジスタが組み合わさった回路において、LED点灯のようにタイミングチャートによっては意図しない順番での出力が行われないように制御するために用いてます。  
[シフトレジスタの解説 - synapse.kyoto](https://synapse.kyoto/glossary/shift_register/page001.html)  
:::

上記を参考に配線を行いサンプルプログラムをデプロイすると、LEDが順番に繰り返し点灯することを確認できる。  
コードを見てみると  

```c
int tDelay = 100;
int latchPin = 11;      // (11) ST_CP [RCK] on 74HC595
int clockPin = 9;      // (9) SH_CP [SCK] on 74HC595
int dataPin = 12;     // (12) DS [S1] on 74HC595

byte leds = 0;

void updateShiftRegister()
{
   digitalWrite(latchPin, LOW);
   shiftOut(dataPin, clockPin, LSBFIRST, leds);
   digitalWrite(latchPin, HIGH);
}

void setup() 
{
  pinMode(latchPin, OUTPUT);
  pinMode(dataPin, OUTPUT);  
  pinMode(clockPin, OUTPUT);
}

void loop() 
{
  leds = 0;
  updateShiftRegister();
  delay(tDelay);
  for (int i = 0; i < 8; i++)
  {
    bitSet(leds, i);
    updateShiftRegister();
    delay(tDelay);
  }
}
```

Arduino には シフトレジスタ制御用にライブラリ、関数が用意されており制御を簡単に行えるようにしている。  
最初に [`byte`](https://www.arduino.cc/reference/en/language/variables/data-types/byte/) にて leds は byte型であることを宣言します。  
本シフトレジスタは 8bit で 1byte ずつシフトして処理していくため、そのまま指定のバイト位置がLEDのピンを指定していきます。  
`updateShiftRegister()` にて、[`shiftOut()`](https://www.arduino.cc/reference/en/language/functions/advanced-io/shiftout/) を使ってデータの入力とクロックによる保存を行う関数を事前に定義しておく。  

`loop()` にて `leds = 0` で value を 0 に初期化し、 `updateShiftRegister()` 関数を呼び出し LED を全て消灯する。  
その後 `for()` 文で `i` の値を 0 ~ 8 の間でループするようにし、[`bitSet()`](https://www.arduino.cc/reference/en/language/functions/bits-and-bytes/bitset/) で leds の値を設定し、再度 `updateShiftRegister()` 関数を呼び出し 1byte ずつ、一つづつ LED を指定していくことで順番に点灯させ最後に全部のLEDが点灯します。  
