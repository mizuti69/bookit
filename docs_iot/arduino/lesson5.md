---
id: lesson5
title: Lesson 5  
---
import { LinkTag } from '../basecomponent.jsx';

## デジタル入力
プッシュスイッチ機器を使ったデジタル入力の学習。  

### 使用する機器  

* (1) x Elegoo Uno R3 
* (1) x 830 Tie-points Breadboard 
* (1) x 5mm red LED 
* (1) x 220 ohm resistor 
* (2) x push switches 
* (7) x M-M wires (Male to Male jumper wires) 

:::note push switches  

<img src="https://www.shenzhen2u.com/image/cache/catalog/Buttons/Mini%20Push%20Button%20Switch-500x500.jpg" width="30%"/>  

ボタンを押すかレバーを回すと、2 つの接点が電気的に接続されます。  
:::

### デジタル入力とアナログ入力について

<LinkTag url="https://spiceman.jp/analog-digital-circuit/">Spiceman - アナログ回路とデジタル回路の違い</LinkTag>

Arduino など マイコンボードには「アナログ」「デジタル」の考え方があるが何が違うのか。 [はじめに](/docs_iot/arduino/introduction) で 基礎知識にあったように、アナログ回路による入力とデジタル回路による入力は取り扱うデータが違います。  
デジタル回路は `0`, `1` 、HIGH と LOW だけを扱い、そのためソフトウェアにより簡単に機能の追加や週背を行うことが出来ます。対してアナログ回路は電気信号（電圧等）を扱うためセンサー類の連続して変化する値の取り扱いに向いています。  
アナログ回路は電圧の変化を数値的に解釈することで、例えば温度センサーから 3V の電圧入力があったら 20℃ のように解釈します。デジタル通信で同じようなことをしようとした場合、 0 と 1 を駆使して連続しデータを贈り～とする必要があり、短時間での連続データ取得には向いていません。  
このように取り扱いたいデータと用途を考慮し必要に応じて使い分けたりします。  

### 構成

<img src={require('./assets/tutorial-19.png').default} />

チュートリアル用のサンプルプログラムを開きデプロイするとLEDが消え、左ボタンを押すと LED が点灯し、右ボタンを押すと消灯します。  

```c
void setup() 
{
  pinMode(ledPin, OUTPUT);
  pinMode(buttonApin, INPUT_PULLUP);  
  pinMode(buttonBpin, INPUT_PULLUP);  
}

void loop() 
{
  if (digitalRead(buttonApin) == LOW)
  {
    digitalWrite(ledPin, HIGH);
  }
  if (digitalRead(buttonBpin) == LOW)
  {
    digitalWrite(ledPin, LOW);
  }
}
```

`pinMode()` で今までと違いボタンに対して `INPUT_PULLUP` 入力を指定していることがわかります。  
前回の [Lesson4](/docs_iot/arduino/lesson4) で学習したように、 マイコンにはプルアップ抵抗があり、ボードが壊れないよう結線していない場合でも電圧が入っている、つまり HIGH になっています。  
そのためスイッチが押され結線されると 値が LOW になることを利用して [`digitalRead()`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalread/) で読み取りスイッチ A が LOW なら LED に電圧を入力し HIGH に、スイッチ B が LOW になったら LED を LOW にしている。  
