---
id: lesson18
title: Lesson 18  
---
import { LinkTag } from '../basecomponent.jsx';

## 光電池

### 必要な部品構成

* (1) x Elegoo Uno R3 
* (1) x 830 tie-points breadboard 
* (8) x leds 
* (8) x 220 ohm resistors 
* (1) x 1k ohm resistor 
* (1) x 74hc595 IC 
* (1) x Photoresistor (Photocell) 
* (16) x M-M wires (Male to Male jumper wires) 

### CdS セル 光可変抵抗器
<img src="https://m.media-amazon.com/images/I/31AbZ9saczL._AC_.jpg" width="30%"/>  

CdSセルは、硫化カドミウム(CdS)を主成分とする光導電素子の一種で、光の当たる量によって抵抗値が変化します  
受光部に当たる光の量が多ければ、抵抗値が小さくなり、暗くなると点灯する街路灯や保安灯などに利用されています。  

[フォトレジスター【CdSセル】 - sanuki-tech.net](https://sanuki-tech.net/make-electronics/parts/cds-cell/)  

本キットに入っている CdS セルのデータシートは下記  
<LinkTag url="https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjO1obV88PwAhXR7WEKHYPDC3oQFjABegQIBhAD&url=http%3A%2F%2Fwww.klsele.com%2Fadmin%2Fproduct_upload%2F20190322144057KLS6-3537..pdf&usg=AOvVaw3egydrKvdx6YR8WxTM9J0b">3mm CdS photosensitive resistor  KLS6-3537</LinkTag>  

0Lux の光量で 2MΩ、10Luxで18-50KΩとある。  

## 構成
[Lesson 16](/docs_iot/arduino/lesson16) の構成を流用し CdS フォトレジスタを追加する  

<img src={require('./assets/tutorial-53.png').default} />  

サンプルコードをデプロイするとフォトレジスタへの光の当たり具合で LED の点灯状況が変化する事を確認できる。  

```c
int lightPin = 0;
int latchPin = 11;
int clockPin = 9;
int dataPin = 12;

int leds = 0;

void setup() 
{
  pinMode(latchPin, OUTPUT);
  pinMode(dataPin, OUTPUT);  
  pinMode(clockPin, OUTPUT);
}
void updateShiftRegister()
{
   digitalWrite(latchPin, LOW);
   shiftOut(dataPin, clockPin, LSBFIRST, leds);
   digitalWrite(latchPin, HIGH);
}
void loop() 
{
  int reading  = analogRead(lightPin);
  int numLEDSLit = reading / 57;  //1023 / 9 / 2
  if (numLEDSLit > 8) numLEDSLit = 8;
  leds = 0;   // no LEDs lit to start
  for (int i = 0; i < numLEDSLit; i++)
  {
    leds = leds + (1 << i);  // sets the i'th bit
  }
  updateShiftRegister();
}
```

ピン定義、`setup()` 定義周りは Lesson16 同様となっており、`Loop()` 内で フォトレジスタの抵抗値から光らせる LED 数を計算している。  

```c
int numLEDSLit = reading / 57;
```

通常に考えた場合、点灯を制御させたい LED 数は8個なので、アナログ入力の数値幅 1023 を8で割った数で制御することが正しく思えます。  
しかしフォトレジスタにおいて抵抗値０はありえなく、抵抗値が 1KΩとなってしまった場合、固定抵抗の 1KΩ と合わせて 2kΩ、  
その分を考慮し８分割しようとするので  

```
8 = 1023 / 2 / x
8 = 511/x
```

そこから 57 となっている。  
あとは取得されたアナログ入力値に沿ってシフトレジスタにどの LED を点灯させるかを指定している。  
