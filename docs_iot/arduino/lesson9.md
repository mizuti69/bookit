---
id: lesson9
title: Lesson 9  
---
import { LinkTag } from '../basecomponent.jsx';

## サーボ
サーボモーターを使用したデータシートの読み方とPWM制御の学習。  

### 使用する機器  

* (1) x Elegoo Uno R3  
* (1) x Servo (SG90)  
* (3) x M-M wires (Male to Male jumper wires)  

### SERVO MOTOR SG90  

<img src="https://akizukidenshi.com/img/goods/L/M-08761.jpg" width="30%"/>  

サーボモーターといえば名前は聞いたことあるが普通のモーターと何が違うのか。  

* モーター：電力をかけるとひたすら回転  
* サーボモーター：信号に応じて0度からN度の範囲で回転  
* ステッピングモーター：信号に応じてモーターを制限なく制御可能  
* ブラシレスモーター：安定した回転速度などの制御が可能  

サーボモーターは PWM 利用して制御する。  
サーボには3本のワイヤーがあり、茶色のワイヤーはグランドワイヤーで、UNO の GND ポートに接続する必要があり、赤色のワイヤーは電源ワイヤーで、5v ポートに接続し、オレンジ色のワイヤーは信号ワイヤー ＃9 ポートに接続する必要があります。  

ELEGOO のスターターキットには各モジュールや機器のデータシートが付随している。  
セットに入っているサーボモーターは SG90 というもので、下記のようなデータシートを公開しているサイト等でも同様のものを確認できる。  

<LinkTag url="https://datasheetspdf.com/datasheet/SG90.html">DatasheetsPDF.com - SG90 Datasheet PDF</LinkTag>

サーボモーターは」 DC モーター、ポテンションメーター、それらを制御回路で組み合わせた形で構成されている。  
このサーボモーターは最大180度まで制御できるもので、データシートを見てみると「Power ansd Signal」、主電圧が 5V で、 PWM の 周期 20ms のパルスにおいて「Duty Cycle」 が 0.5 のとき 0度動き、2.4 ms のとき180度動くということがわかる。  

<img src={require('./assets/tutorial-34.png').default} /> 

### 構成  

<img src={require('./assets/tutorial-33.png').default} /> 

サーボモーターの PWM 対応のオレンジ を Arduinoの PWM 対応 9ピンに、 
GROUND（ー） 対応の 茶色は GND ピンに、
赤は 電源の 5V ピンに。  
サンプルコードを見ると Lesson8 同様にライブラリを呼び出しているため、ライブラリを追加してデプロイするとモーターが動き出す。上記のように PWM を詳細に制御することでサーボモーターを制御することは可能だが、 Arduino では簡易に制御できるよう [**Servoライブラリ**](https://www.arduino.cc/reference/en/libraries/servo/) が標準で提供されている。  

デプロイすると交互に進んだり、戻ったりするように羽が動くのを確認できる。  
※本製品はトイキットという面もあり、正確に180度内の指定で動くわけではない点に注意。  

```c
#include <Servo.h>

Servo myservo;  // create servo object to control a servo
// twelve servo objects can be created on most boards

int pos = 0;    // variable to store the servo position

void setup() {
  Serial.begin(9600);
  myservo.attach(9);  // attaches the servo on pin 9 to the servo object
}

void loop() {
  for (pos = 0; pos <= 180; pos += 1) { // goes from 0 degrees to 180 degrees
    // in steps of 1 degree
    myservo.write(pos);              // tell servo to go to position in variable 'pos'
    delay(15);                       // waits 15ms for the servo to reach the position
  }
  for (pos = 180; pos >= 0; pos -= 1) { // goes from 180 degrees to 0 degrees
    myservo.write(pos);              // tell servo to go to position in variable 'pos'
    delay(15);                       // waits 15ms for the servo to reach the position
  }
 
}
```

[`Serial.begin()`](https://www.arduino.cc/reference/en/language/functions/communication/serial/begin/) シリアル通信を行う際に指定する通信のデータ転送レート指定。このレッスンでは特にシリアルコンソールを開いてという操作は不要。  
`myservo.attach()` では呼び出したライブラリの関数から、PWMによりサーボ制御するピンを指定しています。  

`int pos = 0;` で現在のモーター位置を原点設定し、その後 `for()` 文で `pos` 値を `0~180` つまり 0度～180度 まで 1度 ずつ増減させながらループさせている。 Lesson4 時と違い、PWM の間隔を調整するような記述は無く、Servo ライブラリの関数 `myservo.write()` を利用することで簡単に角度を制御できるようになっている。  
※サンプルプログラム上 Servo ライブラリの関数を `myservo` にして呼び出している。  
