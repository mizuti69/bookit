---
id: lesson2
title: Lesson 2  
---
import { LinkTag } from '../basecomponent.jsx';

## 点滅

### Blink を使用した基本的な制御
Arduino UNO のボードには単一のLEDが内蔵されており、電源を接続すると点滅します。これは「Blink」というプログラムがプリインストールされて出荷されるためで、 Blink プログラムを変更することで簡単に Arduino IDE からプログラムの変更、デプロイ、変更による動作の変化を確認することができます。  

IDEから「ファイル」 -> 「スケッチ例」 -> 「01.Basics」 -> 「Blink」を開き、  

<img src={require('./assets/tutorial-08.png').default} width="50%"/>

コードを見てみると下記のように記述されています。  

```c
// the setup function runs once when you press reset or power the board
void setup() {
  // initialize digital pin LED_BUILTIN as an output.
  pinMode(LED_BUILTIN, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
  digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(1000);                       // wait for a second
  digitalWrite(LED_BUILTIN, LOW);    // turn the LED off by making the voltage LOW
  delay(1000);                       // wait for a second
}
```

すべての Arduino で [`setup()`](https://www.arduino.cc/reference/en/language/structure/sketch/setup/) 関数は必要です。この関数は、スケッチの開始時に呼び出されます。変数、ピン モード、ライブラリの使用などを開始する場合などに使用します。この機能は、Arduinoボードの各電源投入またはリセット後に1回のみ実行されます。  

一度しか実行されない `setup()` とは違い、連続してプログラムをループして実行できるようにする [`loop()`](https://www.arduino.cc/reference/en/language/structure/sketch/loop/) 関数を利用して繰り返し処理を実行させます。  

Blink のスケッチでは LED ピンに対して HIGH と LOW を [`delay()`](https://www.arduino.cc/reference/en/language/functions/time/delay/) 関数で指定した間隔で繰り返すように書かれていることがわかります。  
`delay()` 関数の数値を変更し、デプロイ後に点滅速度が変わることを確認しましょう。  
関数で指定できる値はミリ秒です。  
