---
id: lesson15
title: Lesson 15  
---
import { LinkTag } from '../basecomponent.jsx';

## NTC Thermometer  
可変抵抗器サーミスタとアナログ入力による電圧、抵抗値の理解。  

### 使用する機器  

* (1) x Elegoo Uno R3 
* (1) x LCD1602 Module 
* (1) x 10k ohm resistor 
* (1) x Thermistor 
* (1) x Potentiometer 
* (1) x 830 tie-points Breadboard 
* (18) x M-M wires (Male to Male jumper wires) 

### Thermometer  

<img src="https://images-na.ssl-images-amazon.com/images/I/6196PBdRDNL._SL1100_.jpg" width="30%"/>

[Lesson 11](/docs_iot/arduino/lesson11) でも軽く触れたが、サーミスタはサーマル抵抗で、温度によって抵抗が変化する抵抗。サーミスタは温度によって抵抗値が大きく変化するように作られており、1 度あたり 100 オーム以上変化させることができる。
サーミスタには NTC（負の温度係数）と PTC（正の温度係数）の 2 種類がある。一般に、温度測定には NTC センサーが使用され、PTC はリセッタブルヒューズとしてよく使用され、温度が上昇すると抵抗が増加し、電流が流れると発熱し、電流を「チョークバック」して回路を保護しスマートフォン等の発熱対策にも用いられる。  

NTCサーミスタの抵抗値は、以下のような式で表すことができるため、広く温度センサとして使用されています。  

> RT＝R0expB (1/T-1/T0)  

ここで、RTは周囲温度T (K) の時の抵抗値、R0は周囲温度T0 (K) の時の抵抗値、BはB定数と言われる定数。  

<LinkTag url="https://jp.rs-online.com/web/generalDisplay.html?id=ideas-and-advice/ntc-thermistors-guide">jp.rs-online.com - NTCサーミスタとは？ポジティブとネガティブ～サーミスタの用途と使い分け ～</LinkTag>

NTCサーミスタは広い温度範囲で抵抗値が一様かつ滑らかに変化する、したがって、温度を値として検出して、制御する用途に適している。  
PTCサーミスタは、特定の温度を超えると、急激に抵抗値が大きくなるデジタル的な変化をします。この性質を利用して、過熱時に回路を遮断したり、機器を過電流から保護したりするのに用いる。  

実際のB定数は温度で若干変わるので、カタログには25℃と85℃（50℃/100℃等もあり）で実測した値が記載され、選定の際は、RoとB定数が基本になります。それぞれに許容誤差が規定されており、±1％クラスの精度を持つものもあります。メーカーでは、製品毎の温度と抵抗値を表にしたものをホームページ等で公表しています。  

セットに入っているのは MF52D-103f-3950 NTC Thermistor というものでデータシートは下記となる。  

<LinkTag url="http://www.focusens.com/include/sensor-fitting-show.php?id=106">www.focusens.com - MF52 Series Temperarure Sensor</LinkTag>

B値 3950 ±1% で値は 25℃と50℃で計測されたもので、103 は 25℃のときの抵抗値とある。  
各温度時の抵抗値については計算サイトがあるので値を把握するだけでB定数は計算できる。  

<LinkTag url="https://keisan.casio.jp/exec/user/1248569182">keisan.casio.jp - NTCサーミスタの温度特性（B定数による計算）</LinkTag>  

今回のチュートリアルのように逆に抵抗から温度を求める場合は逆算すればいい 

> 1/T = 1/B × ln(Rth/R0) + 1/T0  

### 構成  

<img src={require('./assets/tutorial-47.png').default} />  

[Lesson 14](/docs_iot/arduino/lesson14) 構成をほぼそのままにサーミスタと 10kΩ の抵抗器を追加する。  
サンプルプログラムをデプロイするとディスプレイに 「Temp  XX.XX C」 というメッセージが表示され、温度が表示されることを確認できる。  

```c
#include <LiquidCrystal.h>
int tempPin = 0;
//                BS  E  D4 D5  D6 D7
LiquidCrystal lcd(7, 8, 9, 10, 11, 12);
void setup()
{
  lcd.begin(16, 2);
}
void loop()
{
  int tempReading = analogRead(tempPin);
  // This is OK
  double tempK = log(10000.0 * ((1024.0 / tempReading - 1)));
  tempK = 1 / (0.001129148 + (0.000234125 + (0.0000000876741 * tempK * tempK )) * tempK );       //  Temp Kelvin
  float tempC = tempK - 273.15;            // Convert Kelvin to Celcius
  float tempF = (tempC * 9.0)/ 5.0 + 32.0; // Convert Celcius to Fahrenheit
  /*  replaced
    float tempVolts = tempReading * 5.0 / 1024.0;
    float tempC = (tempVolts - 0.5) * 10.0;
    float tempF = tempC * 9.0 / 5.0 + 32.0;
  */
  // Display Temperature in C
  lcd.setCursor(0, 0);
  lcd.print("Temp         C  ");
  // Display Temperature in F
  //lcd.print("Temp         F  ");
  lcd.setCursor(6, 0);
  // Display Temperature in C
  lcd.print(tempC);
  // Display Temperature in F
  //lcd.print(tempF);
  delay(500);
}
```

コードを見てみるとLCDのの部分については前回と同じく、`int tempReading = analogRead(tempPin)` で analog 入力値（＝電圧）を取得していて、  
 `double tempK = log(10000.0 * ((1024.0 / tempReading - 1)));` ～で温度に計算し直している。  

:::note
サンプルプログラムの記述は応用的な記述となっており記述を見るだけでは理解が難しい。  
記述の下にあるコメントアウトされた式のほうが理解はしやすいのでこちらで何をしているのか把握しやすいと思う。  

```
  /*  replaced
    float tempVolts = tempReading * 5.0 / 1024.0;
    float tempC = (tempVolts - 0.5) * 10.0;
    float tempF = tempC * 9.0 / 5.0 + 32.0;
  */
```

:::

変換した温度はケルビン(K)なので、摂氏(c)に変換している。同様に摂氏(c)を華氏(f)も計算しているが、その後の表示コードの部分でコメントアウトしている。  

:::note 
[温度の単位の換算 - Wikipedia](https://ja.wikipedia.org/wiki/%E6%B8%A9%E5%BA%A6%E3%81%AE%E5%8D%98%E4%BD%8D%E3%81%AE%E6%8F%9B%E7%AE%97)  
:::

loop内にコードを記載しているのは前回同様動的に変動する表示だからだが、面白いのは`lcd.print("Temp         C  ")` で 数値の部分と文字の部分をこういう風に表現できるんだという点。  
かなり奇妙なコメントは、ディスプレイの 16 の列を思い出させるのに役立ちます。その長さの文字列を実際の読み取りが行われるスペースで印刷することができます。ブランクを記入するには、読み取り位置のカーソル位置を設定し、それを印刷します。 

またサーミスタからどのようなアナログ入力があるのかコードに書きを追記して見てみる。  

```c
void loop()
{
  ~省略~
  lcd.setCursor(0, 1);
  lcd.print(tempReading);
  delay(500);
}
```

すると 21℃ のときに **474** という値が出力されつづけていて 温度が上がると値も大きくなる。これはサーミスタがなにか数値を発しているのではなく、アナログピンに指すことで [lesson 12](/docs_iot/arduino/lesson12) で学習したように、Arduino がで電圧を読み取っている。  
読み取った値は 0 から 1024 の整数値に変換されているため、実際の電圧は  

> 474 / 1024 x 5[V] = 2.32[V]  

今回の構成で表すと  

> V = R1[抵抗]/(Rth[サーミスタの抵抗]+R1[抵抗])×5[V]  

知りたいのはサーミスタの抵抗なので  

> Rth[サーミスタの抵抗]=(V/5[V]-1)×R1[抵抗]  

となり コードの最初の `tempK` の式の一部がサーミスタの電圧を求めてる事がわかる。  
