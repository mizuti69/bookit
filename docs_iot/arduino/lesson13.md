---
id: lesson13
title: Lesson 13  
---
import { LinkTag } from '../basecomponent.jsx';

## 赤外線受信モジュール  
赤外線受信機と受信データに基づくシリアル出力操作の学習。  

### 使用する機器  

* (1) x Elegoo Uno R3 
* (1) x IR receiver module 
* (1) x IR remote 
* (3) x F-M wires (Female to Male DuPont wires) 

### 赤外線通信について

<img src="https://images-na.ssl-images-amazon.com/images/I/41ATnvpRn9L.jpg" width="30%"/>

IR 検出器は、赤外線を受信するように調整されたフォトセルを備えたマイクロチップで、テレビや DVD プレーヤーの前面には、クリッカーからの IR 信号を受信するためのものがあります。  
リモコンの内部には一致する IR LED があり、赤外線パルスを発してテレビの電源をオン、オフ、または変更するようにテレビに指示します。赤外光は人間の目には見えません。  
IR 検出器はデジタル出力です。これらは 38KHz  IR 信号を検出してロー（0V）を出力するか、いずれも検出せず、ハイ（5V）を出力します。光電池は抵抗器のように振る舞い、どれだけの光が当たるかによって抵抗が変化します。  

学習キットに含まれてるのは AX-1838HS という IR赤外線レシーバーモジュール。  
レシーバー自体には 3本ピンがありそれぞれ Vcc,GND,DATAとなっていて、モジュールになってもそこは変わらず３本のピンとなっていてそれぞれ  

* G：GND  
* R：Vcc  
* Y：DATA  

となっている。  

赤外領域の光（赤外線）を受光し電気信号に変換して、必要な情報を取り出して応用する技術、またその技術を利用した機器。人間の視覚を刺激しないで物を見られる、対象物の温度を遠くから非接触で瞬時に測定できるなどの特徴を持つ。そして電磁波の一種であるため、通信は波によって伝わります。  
赤外線を利用したリモコン通信はモールス信号のように ON/OFF を組み合わせてやりとりしている（PPM パルス位相変調）、PPM方式にはフォーマットがあり、「NECフォーマット」、「Sonyフォーマット」等がある。PPMについてはイメージとしてはモールス信号が近い。  

<LinkTag url="https://ja.wikipedia.org/wiki/IrDA">Wikipedia - IrDA</LinkTag>

### 構成  

<img src={require('./assets/tutorial-43.png').default} />  

サンプルプログラムとライブラリをデプロイして付属のリモコンでセンサーに向かってボタンを押すと下記のようにシリアル出力されることを確認できる。  

<img src={require('./assets/tutorial-44.png').default} />  

`other button`は家にあったTVリモコンから送った場合のデータ。  

コードを見てみよう  

```c
#include "IRremote.h"

int receiver = 11; // Signal Pin of IR receiver to Arduino Digital Pin 11

/*-----( Declare objects )-----*/
IRrecv irrecv(receiver);     // create instance of 'irrecv'
decode_results results;      // create instance of 'decode_results'

/*-----( Function )-----*/
void translateIR() // takes action based on IR code received

// describing Remote IR codes 

{

  switch(results.value)

  {
  case 0xFFA25D: Serial.println("POWER"); break;
  case 0xFFE21D: Serial.println("FUNC/STOP"); break;
  case 0xFF629D: Serial.println("VOL+"); break;
  case 0xFF22DD: Serial.println("FAST BACK");    break;
  case 0xFF02FD: Serial.println("PAUSE");    break;
  case 0xFFC23D: Serial.println("FAST FORWARD");   break;
  case 0xFFE01F: Serial.println("DOWN");    break;
  case 0xFFA857: Serial.println("VOL-");    break;
  case 0xFF906F: Serial.println("UP");    break;
  case 0xFF9867: Serial.println("EQ");    break;
  case 0xFFB04F: Serial.println("ST/REPT");    break;
  case 0xFF6897: Serial.println("0");    break;
  case 0xFF30CF: Serial.println("1");    break;
  case 0xFF18E7: Serial.println("2");    break;
  case 0xFF7A85: Serial.println("3");    break;
  case 0xFF10EF: Serial.println("4");    break;
  case 0xFF38C7: Serial.println("5");    break;
  case 0xFF5AA5: Serial.println("6");    break;
  case 0xFF42BD: Serial.println("7");    break;
  case 0xFF4AB5: Serial.println("8");    break;
  case 0xFF52AD: Serial.println("9");    break;
  case 0xFFFFFFFF: Serial.println(" REPEAT");break;  

  default: 
    Serial.println(" other button   ");

  }// End Case

  delay(500); // Do not get immediate repeat

} //END translateIR
void setup()   /*----( SETUP: RUNS ONCE )----*/
{
  Serial.begin(9600);
  Serial.println("IR Receiver Button Decode"); 
  irrecv.enableIRIn(); // Start the receiver

}/*--(end setup )---*/


void loop()   /*----( LOOP: RUNS CONSTANTLY )----*/
{
  if (irrecv.decode(&results)) // have we received an IR signal?

  {
    translateIR(); 
    irrecv.resume(); // receive the next value
  }  
}/* --(end main loop )-- */
```

センサー入力値を `switch` 文でぶん回してマッピングさせ、センサーからの入力値にマッチするテキストを出力させている。  
実際の値がどうなっているかというと、下記のようにセットされた値を [`Serial.print()`](https://www.arduino.cc/reference/en/language/functions/communication/serial/print/) で追記することで確認できる。  

```c
{
  Serial.print(results.value);
  switch(results.value)

  {
```

上記のようにし、例えば「Vol-」ボタンを押すと  

```
16:45:08.546 -> 16754775 VOL-
```

となる。  
しかし switch 文の case に書かれてる文字と違う値となっている。 例えばパワーボタンの `0xFFA25D`、 `0x` は 16進数であることの宣言なのでその後に続く `FFA25D` が実際に取得しているデータの１６進数になっている。  
試しに `Serial.print(results.value, HEX);` にすることで 16進数にした値を確認できる。  

```
17:00:03.666 -> FFE21D FUNC/STOP
17:32:31.701 -> A90 other button 
```

レシーバーはデジタル入力なので、0,1 で送られてくる２進数を赤外線データのようなリモコン等多数のボタンが付くもので網羅しようとすると多種、及び長大になるのでコード上は１６進数で制御している。  
