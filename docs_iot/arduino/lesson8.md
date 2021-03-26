---
id: lesson8
title: Lesson 8  
---
import { LinkTag } from '../basecomponent.jsx';

## 傾斜ボールスイッチ
傾斜ボールスイッチの学習。  

### 使用する機器  

* (1) x Elegoo Uno R3 
* (1) x Tilt Ball switch 
* (2) x F-M wires (Female to Male DuPont wires) 

:::note 傾斜センサー  

<img src="https://images-na.ssl-images-amazon.com/images/I/515aHX5HpeL._AC_SL1000_.jpg" width="30%"/>  

中に入ってるボールが分側の基部に触れていると通電し、それ以外はOFFになる。使用すると、向きや傾きを検出できます。 「水銀スイッチ」、「傾斜スイ
ッチ」または「ローリングボールセンサー」と呼ばれることもあります。 
:::

### 構成  

<img src={require('./assets/tutorial-30.png').default} /> 

スイッチのピンに正負はない  
サンプルプログラムをデプロイすると、シンプルにスイッチがONの場合は Arduino 本体の LED が光り、OFFの場合は消えることを確認できる  
真上、真下にスイッチのぼーるがなくても、筒の太さ、長さ、ボールの大きさからわかるようにちょっとの傾斜でON/OFFになる事がわかる  

```c
const int ledPin = 13;//the led attach to

void setup()
{ 
  pinMode(ledPin,OUTPUT);//initialize the ledPin as an output
  pinMode(2,INPUT);
  digitalWrite(2, HIGH);
} 

void loop() 
{  
  int digitalVal = digitalRead(2);
  if(HIGH == digitalVal)
  {
    digitalWrite(ledPin,LOW);//turn the led off
  }
  else
  {
    digitalWrite(ledPin,HIGH);//turn the led on 
  }
}
```

`pinMode()` は INPUT にするとプルアップ抵抗が無効になる。そのため `setup()` 内で `digitalWrite()` で HIGH にしプルアップ抵抗時と同等の状況にしている。  
後はスイッチの HIGH , LOW に応じて ボードの LED を HIGH , LOW にしている。  
