---
id: lesson7
title: Lesson 7  
---
import { LinkTag } from '../basecomponent.jsx';

## パッシブブザー
パッシブブザーの使用とライブラリの利用について学習。  

### 使用する機器  

* (1) x Elegoo Uno R3 
* (1) x Passive buzzer 
* (2) x F-M wires (Female to Male DuPont wires) 

:::note パッシブブザー  

<img src="https://images-na.ssl-images-amazon.com/images/I/51ecdoDspLL._SX342_.jpg" width="30%"/>  

パッシブブザーは振動回路を持たないブザー  
:::

### 構成  

<img src={require('./assets/tutorial-25.png').default} /> 

構成自体は [Lesson 6](/docs_iot/arduino/lesson6) と同じ。端子自体の長さとかで＋－の見分けがつかないが背面の基盤上に明記してある。  

サンプルコードを見てみるとまず最初に `pitches.h` というモジュールをインクルードしている記述がある。  

```c
#include "pitches.h"
```

まずライブラリーマネージャー上で「pitch」で検索して必要なモジュールがあるか確認し、ない場合ELEGOO のキットにはサンプルコードと一緒にライブラリも配置されており、[Lesson 1](/docs_iot/arduino/lesson1) で学習したようにZIPライブラリをインポートする。  

<img src={require('./assets/tutorial-28.png').default} /> 

デプロイすると音階のメロディが鳴る。  

```c
#include "pitches.h"
 
// notes in the melody:
int melody[] = {
  NOTE_C5, NOTE_D5, NOTE_E5, NOTE_F5, NOTE_G5, NOTE_A5, NOTE_B5, NOTE_C6};
int duration = 500;  // 500 miliseconds
 
void setup() {
 
}
 
void loop() {  
  for (int thisNote = 0; thisNote < 8; thisNote++) {
    // pin8 output the voice, every scale is 0.5 sencond
    tone(8, melody[thisNote], duration);
     
    // Output the voice after several minutes
    delay(1000);
  }
   
  // restart after two seconds 
  delay(2000);
}
```

`int melody` で `melody` という配列８要素指定し、 `duration` で音の長さを指定しています。  
`setup()` は何もせず、 [`tone()`](https://www.arduino.cc/reference/en/language/functions/advanced-io/tone/) 関数で指定したピンに対して指定した周波数の短形波を生成します。周波数の指定は `melody[thisNote]` と配列から指定し、それを最大 8要素目になるまで一つずつ `for()` 文で回しながら鳴らしている。  

### ライブラリと周波数の指定について
メロディの指定はどうやっているのか、今回読み込ませたライブラリの中を見てみると下記のような羅列の記述があり、  

```
#define NOTE_B0  31
#define NOTE_C1  33
#define NOTE_CS1 35
#define NOTE_D1  37
#define NOTE_DS1 39
#define NOTE_E1  41
#define NOTE_F1  44
#define NOTE_FS1 46
#define NOTE_G1  49
#define NOTE_GS1 52
#define NOTE_A1  55
#define NOTE_AS1 58
#define NOTE_B1  62

~ 省略  
```

指定した変数の定義に対して数字が振られている。  
数値は周波数を指していて、どの数字がどの音階に対応しているかはある程度決まっています。  

<LinkTag url="https://www.aihara.co.jp/~taiji/browser-security/js/equal_temperament.html">12平均律と周波数</LinkTag>

例えばコード中の `NOTE_C5` は ライブラリでは値が `523` と設定されていて `523`、つまり 523Hz は ド/C5 になる。  
