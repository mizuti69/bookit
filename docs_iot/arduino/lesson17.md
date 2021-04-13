---
id: lesson17
title: Lesson 17  
---
import { LinkTag } from '../basecomponent.jsx';

## シリアルモニタ
[lesson16](/docs_iot/arduino/lesson16) をベースにシリアルコンソール接続から Arduino を操作する。  

### 必要な部品構成
Lesson 16 の内容をそのまま使います。  

### 構成
Arduino のボード配線は Lesson16 そのままに、サンプルコードをデプロイします。  
デプロイするとシリアル画面に表示がされる。  

<img src={require('./assets/tutorial-51.png').default} />

コードを見てみると。  

```c
int latchPin = 11;
int clockPin = 9;
int dataPin = 12;

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
  updateShiftRegister();
  Serial.begin(9600);
  while (! Serial); // Wait untilSerial is ready - Leonardo
  Serial.println("Enter LED Number 0 to 7 or 'x' to clear");
}

void loop() 
{
  if (Serial.available())
  {
    char ch = Serial.read();
    if (ch >= '0' && ch <= '7')
    {
      int led = ch - '0';
      bitSet(leds, led);
      updateShiftRegister();
      Serial.print("Turned on LED ");
      Serial.println(led);
    }
    if (ch == 'x')
    {
      leds = 0;
      updateShiftRegister();
      Serial.println("Cleared");
    }
  }
}
```

Lesson16 と同様の構成のためシフトレジスタ周りのコードは同じとなっており、`setup()` にシリアル用の設定が追加されている。  
事前記述周りはほとんど同じで処理側が大きく変わっている。  
`loop()` ではまず [`Serial.available`](https://www.arduino.cc/reference/en/language/functions/communication/serial/available/) に入力データが格納されているかを判定し、入力値が 0 ~ 7 か、 x かでさらに `if()` を回している。  
[`Serial.read()`](https://www.arduino.cc/reference/en/language/functions/communication/serial/read/)で入力された値を `ch` に格納し、  
「x」が入力された場合は `leds` 変数を 0 にして `updateShiftRegister()` を呼び出して LED を消灯するようにしている。  
「0~7」が入力された場合は `led = ch - '0'` に値を格納し `bitSet()` で Lesson16 同様に シフトレジスタに連動した LED を点灯させている

:::note C言語における型とデータの扱いについて
`Serial.read()` を格納している `ch` について、なぜ　`led = ch - '0'` という処理をしているかというと、  
今回入力値に 数字「0~7」と文字列「x」を使っており、`Serial.read()` はリファレンスにある通り `int` 型で入力データを扱います。そのため入力された「0~7」の数値は内部的には「48~55」の数値にて解釈されています。これを「x」同様に文字列として扱えるように int型 を char型 に変換、 `数値 - 0` という式で行っています。  
※[marycore.jp - int型をchar型に変換する方法【数字化 数値の文字列化】](https://marycore.jp/prog/c-lang/convert-number-to-char/)  
:::

上記のように対応した数値をシリアルから送信することで任意の LED を点灯したり、消灯したりできる。  

<img src={require('./assets/tutorial-52.png').default} />
