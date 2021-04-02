---
id: lesson10
title: Lesson 10  
---
import { LinkTag } from '../basecomponent.jsx';

## 超音波センサー
超音波センサーとシリアル出力の学習。  

### 使用する機器  

* (1) x Elegoo Uno R3 
* (1) x Ultrasonic sensor module 
* (4) x F-M wires (Female to Male DuPont wires) 

### 超音波センサー  

<img src="https://www.amazon.co.jp/images/I/715dXVAlnoL._AC_SL1500_.jpg" width="30%"/>  

「超音波」とは音波の一種です。20kHz以上の耳に聞こえない音のことを超音波と言います。  
超音波には超音波の反射を利用した距離検知や超音波の揺らぎを検出する存在検知など様々な活用方法があります。距離検知用途においては、光式測距センサとは異なり透明なプラスチックやガラスなども検知可能という特徴があります。超音波センサの原理として、圧電セラミックスが電圧の向きにより伸縮し空気振動（超音波）を発生させる作用を利用しています。  
センサヘッドから超音波を発信し、対象物から反射してくる超音波を再度センサヘッドで受信します。超音波式センサは、発信から受信までの「時間」を計測することで対象物までの距離を測定しています。  

試験距離=（HIGHレベル時間×音速（340m / s）/ 2  

<LinkTag url="https://www.murata.com/ja-jp/products/sensor/ultrasonic/library/basic/ability">村田製作所 - 超音波センサ　基礎知識 ― 超音波センサでできること</LinkTag>

セットに入っているセンサーは超音波の発振と受信が一体型でモジュール化されており、  
データシートは下記になる。  

<LinkTag url="https://datasheetspdf.com/pdf/1380136/ETC/HC-SR04/1">DatasheetsPDF.com - HC-SR04</LinkTag>

基盤に記載のある VCC が 5V電源、 Trig がインプット、つまり受信用ピン、 Echo が発振用の操作ピン、 GNDピン となっている。  
Trig ピンに対し10μsの間HIGHに設定する必要があり、その時点でHCSR04は40kHZで8サイクルの音波バーストを送信とある。超音波バーストが送信された後、ECHOピンはHIGHになり、ECHOピンがHIGHになっている時間を記録することで、対象物までの距離を計算することができる。

### 構成  

<img src={require('./assets/tutorial-36.png').default} /> 

Echoピンを 11番に、Trigピンを12番にし、サンプルプログラムと呼び出しているライブラリを確認しデプロイ、シリアルモニタを開くと何かしら文字列が流れていく。  

<img src={require('./assets/tutorial-37.png').default} />  

コードを見てみると  

```c
#include "SR04.h"
#define TRIG_PIN 12
#define ECHO_PIN 11
SR04 sr04 = SR04(ECHO_PIN,TRIG_PIN);
long a;

void setup() {
   Serial.begin(9600);
   delay(1000);
}

void loop() {
   a=sr04.Distance();
   Serial.print(a);
   Serial.println("cm");
   delay(1000);
}
```

前回の [Lesson 9](/docs_iot/arduino/lesson9) はシリアル接続がなかったため不要だったが、今回はシリアル出力結果を見るため [`Serial.begin()`](https://www.arduino.cc/reference/en/language/functions/communication/serial/begin/) で定義しておく必要がある。  
ライブラリにより Trig と Echo の制御及び距離の計算が不要になっているが、 `delay()` で連続的に動作しないよう制御しておく。ライブラリで完全に簡略化されているが、 `log a` に `sr04.Distance()` 超音波センサーで取得した値を格納し [`Serial.print()`](https://www.arduino.cc/reference/en/language/functions/communication/serial/print/) シリアルログ出力している。  
