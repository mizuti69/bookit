---
id: lesson6
title: Lesson 6  
---
import { LinkTag } from '../basecomponent.jsx';

## アクティブブザー
アクティブブザーを利用したサウンド生成の学習。  

### 使用する機器  

* (1) x Elegoo Uno R3 
* (1) x Active buzzer 
* (2) x F-M wires (Female to Male DuPont wires) 

:::note BUZZER  

<img src="https://images-na.ssl-images-amazon.com/images/I/612FFbTzUkL._AC_SX466_.jpg" width="30%"/>  

アクティブブザーとパッシブブザーというものがあり、各ブザーの違いは端子側にある。  

* アクティブブザー  
  端子側が樹脂等でコーティングされている  
  ブザー内部に振動機があり電力を通すだけでブザー音が鳴る  
  よくイメージするブザー  
* パッシブブザー  
  端子側が基盤むき出し  
  振動器は無いため外部から波形データを渡して鳴らせる必要があります  
  イメージ的にはスピーカー  
:::

:::note ジャンパーワイヤ

<img src="https://images-na.ssl-images-amazon.com/images/I/41fr6YGuoiL._AC_.jpg" width="30%"/>  

回路上にジャンプ（電路のショートカット）を作り、繋ぐためのもの。  オス・メスがあり、オスーオスのもの、オスーメスのものなど用途や回路に応じて用意する。  
:::

### 構成  

<img src={require('./assets/tutorial-22.png').default} /> 

ブザーの端子には＋－があり正面に書いてもあるが端子の足が長いほうが＋、－をGNDにつなぐように注意する。  

サンプルコードをデプロイするとちょっと耳障りな音が２音交互に鳴り続ける。

```c
int buzzer = 12;//the pin of the active buzzer
void setup()
{
 pinMode(buzzer,OUTPUT);//initialize the buzzer pin as an output
}
void loop()
{
 unsigned char i;
 while(1)
 {
   //output an frequency
   for(i=0;i<80;i++)
   {
    digitalWrite(buzzer,HIGH);
    delay(1);//wait for 1ms
    digitalWrite(buzzer,LOW);
    delay(1);//wait for 1ms
    }
    //output another frequency
     for(i=0;i<100;i++)
      {
        digitalWrite(buzzer,HIGH);
        delay(2);//wait for 2ms
        digitalWrite(buzzer,LOW);
        delay(2);//wait for 2ms
      }
  }
} 
```

コード自体に新しい要素はなく、アクティブブザーの場合発振器は回路内にあるため、`digitalWrite()` で 発振と停止を `delay()` で繰り返すことで擬似的に音波を作り複数の音がなっているように感じさせている。  
