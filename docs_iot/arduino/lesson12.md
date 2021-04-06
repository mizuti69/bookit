---
id: lesson12
title: Lesson 12  
---
import { LinkTag } from '../basecomponent.jsx';

## アナログジョイスティック  
アナログ入力と可変抵抗器の学習。  

###  使用する機器  

* (1) x Elegoo Uno R3 
* (1) x Joystick module 
* (5) x F-M wires (Female to Male DuPont wires) 

### ジョイスティックモジュールと可変抵抗器  

<img src="https://images-na.ssl-images-amazon.com/images/I/51U9d0yBiRL._AC_SL1001_.jpg" width="30%"/>

モジュールには VCC、グランド、X、Y、スイッチの 5 つのピンがあります。（モジュールを入手した場所によって、あなたのラベルが若干異なる場合があります。）  
X / Y ピンからデータを読み出すにはアナログの Arduino ピンを使用し、ボタンを読むにはデジタルピンを使用する必要があります。スイッチ ピンは、ジョイスティックが押されるとグランドに接続され、そうでなければフローティングになります。スイッチ/セレクト・ピンから安定した読み出しを得るには、プルアップ抵抗を介して VCC に接続する必要があります。  

スティックの押し込みはプッシュスイッチの原理だが、X/Y 方向への入力値は 可変抵抗器を利用し X,Y 軸の動きを抵抗値の変化による電圧の変化として入力されアナログ値として読みとっている。  
<LinkTag url="https://go.alpsalpine.jp/l/506151/2020-02-20/33dk7t">alpsalpine - 可変抵抗器とは</LinkTag>

Arduino のアナログ入力は 10ビット分解能なので 0V～5Vの電圧を 0 ~ 1023 の値で表現される  
真上からみてコントローラーの左右上下がそれぞれ 0 ~ 1023 、中心にあるデフォルトの場合 x,y それぞれ 511 くらいとなる。  

### 構成  

<img src={require('./assets/tutorial-41.png').default} /> 

先に述べたように X,Y はアナログ入力なため アナログピンに接続し、「SW」スイッチは [Lesson 5](/docs_iot/arduino/lesson5) 同様に デジタルピンに、GND、5Vはそれぞれピンに  
サンプルプログラムをデプロイし、シリアルモニタを開くと X,Y の座標とスイッチの状態が取得が確認んできる。  

<img src={require('./assets/tutorial-42.png').default} /> 

スティックを動かすと値の変化を確認できるだろう。  
デフォルト値が 511 ではなくずれている場合があるが抵抗機やモジュールの製品精度の問題なため学習用途では問題としない。  
コードは下記のようになっており、  

```c
// Arduino pin numbers
const int SW_pin = 2; // digital pin connected to switch output
const int X_pin = A0; // analog pin connected to X output
const int Y_pin = A1; // analog pin connected to Y output

void setup() {
  pinMode(SW_pin, INPUT);
  digitalWrite(SW_pin, HIGH);
  Serial.begin(9600);
}

void loop() {
  Serial.print("Switch:  ");
  Serial.print(digitalRead(SW_pin));
  Serial.print("\n");
  Serial.print("X-axis: ");
  Serial.print(analogRead(X_pin));
  Serial.print("\n");
  Serial.print("Y-axis: ");
  Serial.println(analogRead(Y_pin));
  Serial.print("\n\n");
  delay(500);
}
```

各ピンを指定し  
`digitalRead()` 、[`analogRead()`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogread/) でそれぞれ読み取り表示しているだけのシンプルなコードとなっている。  
