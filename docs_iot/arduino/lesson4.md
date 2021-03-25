---
id: lesson4
title: Lesson 4  
---
import { LinkTag } from '../basecomponent.jsx';

## RGB LED
LED の Arduino による PWM 制御の基礎学習  

### 使用する機器  

* (1) x Elegoo Uno R3 
* (1) x 830 Tie Points Breadboard 
* (4) x M-M wires (Male to Male jumper wires) 
* (1) x RGB LED 
* (3) x 220 ohm resistors 
* (1) x BREADBOARD MB-102

:::note RGB LED  

<img src="https://images-na.ssl-images-amazon.com/images/I/41I%2BR4dwHvL._AC_SX355_.jpg" width="30%"/>  

赤、青、緑の LED が一つになっており、各LEDの発光を調整することで任意の色を表現することができる。  
ピンは４本あり、各RGB、共有のGNDがある。詳細はデータシートを確認する必要があるが多くは一番長いピンがGND。  
:::

### PWMについて  
パルス変調の一種、パルス幅変調。
[**はじめに**](/docs_iot/arduino/introduction) でもあったように、デジタルピンの出力はHIGHかLOWだけだが、電圧によって自由に調整したい場合があります。その際にHIGHとLOWを素早く切り替えることで擬似的にアナログ的な出力を実現させるための手法。デューティー比という ON と OFF の周期を指定することで、流す電圧を調整できる。  
この周期の長さは、[`analogWrite()`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/) 関数によって制御されます。
したがって、`analogWrite(0)`は周期をまったく生成せず（常にOFF）、`analogWrite(255)` は次の周期が到着するまですべての時間持続す電圧を生成します（常にON）。  
`analogWrite()` に 0 から 255 の間の値を指定すると、周期が生成されます。  

### 構成  

<img src={require('./assets/tutorial-15.png').default} />

利用する抵抗は発光させたい明るさによって選択する。チュートリアルでは 220Ω。次にPWMを制御するために Arduino IDE からプログラムを実行する  
同梱されてるサンプルコードを確認し、ダブルクリックで IDE 起動しデプロイするとLEDが虹色に変化しながら点灯する。  

```c
// Define Pins
#define BLUE 3
#define GREEN 5
#define RED 6

void setup()
{
pinMode(RED, OUTPUT);
pinMode(GREEN, OUTPUT);
pinMode(BLUE, OUTPUT);
digitalWrite(RED, HIGH);
digitalWrite(GREEN, LOW);
digitalWrite(BLUE, LOW);
}

// define variables
int redValue;
int greenValue;
int blueValue;

// main loop
void loop()
{
#define delayTime 10 // fading time between colors

redValue = 255; // choose a value between 1 and 255 to change the color.
greenValue = 0;
blueValue = 0;

// this is unnecessary as we've either turned on RED in SETUP
// or in the previous loop ... regardless, this turns RED off
// analogWrite(RED, 0);
// delay(1000);

for(int i = 0; i < 255; i += 1) // fades out red bring green full when i=255
{
redValue -= 1;
greenValue += 1;
// The following was reversed, counting in the wrong directions
// analogWrite(RED, 255 - redValue);
// analogWrite(GREEN, 255 - greenValue);
analogWrite(RED, redValue);
analogWrite(GREEN, greenValue);
delay(delayTime);
}

redValue = 0;
greenValue = 255;
blueValue = 0;

for(int i = 0; i < 255; i += 1) // fades out green bring blue full when i=255
{
greenValue -= 1;
blueValue += 1;
// The following was reversed, counting in the wrong directions
// analogWrite(GREEN, 255 - greenValue);
// analogWrite(BLUE, 255 - blueValue);
analogWrite(GREEN, greenValue);
analogWrite(BLUE, blueValue);
delay(delayTime);
}

redValue = 0;
greenValue = 0;
blueValue = 255;

for(int i = 0; i < 255; i += 1) // fades out blue bring red full when i=255
{
// The following code has been rearranged to match the other two similar sections
blueValue -= 1;
redValue += 1;
// The following was reversed, counting in the wrong directions
// analogWrite(BLUE, 255 - blueValue);
// analogWrite(RED, 255 - redValue);
analogWrite(BLUE, blueValue);
analogWrite(RED, redValue);
delay(delayTime);
}
}
```

RGBそれぞれのピンを宣言し、[`pinMode()`](https://www.arduino.cc/reference/en/language/functions/digital-io/pinmode/) で PIN の指定でプルアップ抵抗の有無と出力設定を宣言。  

:::note プルアップ抵抗とは
プルアップ（プルダウン）抵抗とは、電子回路における「浮いている」状態を避けるための抵抗です。マイコンの入力端子は、必ず電圧源、グランド、グランド基準信号源に接続しなければならず「浮いている」状態を極力避ける鉄則があります。  
浮いている状態とは例えばスイッチによって電流の ON / OFF をによって他回路の動作を制御する回路の場合、 OFF の状態により 仕事していない回路が接続されている状態のことがイメージとして近くなります。  
実際には、入力端子が浮いていたとしても、想定している通りの動作はしますし、回路制作の途中で直接的なトラブルに繋がる場合も恐らくはありませんが、回路を量産して長期間動作させることがあれば「浮いている」状態を原因とする不良が発生します。「浮いている」状態になるとノイズによるマイコン誤作動やサージによるラッチアップの誘発などを引き起こし、製品にした場合の安定性が極端に弱くなります。  

プルアップ抵抗を追加すると、スイッチを押していない状態でもマイコンには抵抗を介して5Vが入力されるようになります。 Arduino では INPUT を指定すると、内部プルアップは無効となります。  
:::

[`digitalWrite()`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/) で `pinMode()` が OUTPUT の場合に流す電圧の有無を指定している。初期は RED のみ HIGH で 赤点灯。  
それぞれの PWM 制御値を 0~255 で電圧を変化させ値を [`analogWrite()`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/) で指定しながら各ピンに電圧を流し `for()` 文で変化させながら `loop()` させている。  
上記をそれぞれ Green、Blue でそれぞれ 赤（赤から緑に値を１ずつ変化）→緑（緑から青に値を１ずつ変化）→青（青から赤に値を１ずつ変化）→ループとしている。  

例えば `loop()` 内を全てコメントアウトして、`loop()` 内に下記を PWM 値を調整して記述すれば好きな色で常灯させられる。  

```c
analogWrite(RED, 255);
analogWrite(GREEN, 0);
analogWrite(BLUE, 0);
```
