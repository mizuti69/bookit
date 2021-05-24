---
id: lesson19
title: Lesson 19  
---
import { LinkTag } from '../basecomponent.jsx';

## 74HC595 と７セグメント表示
シフトレジスタを利用して 7セグメントディスプレイの制御を学ぶ。  

### 必要な部品構成

* (1) x Elegoo Uno R3 
* (1) x 830 tie-points breadboard 
* (1) x 74HC595 IC 
* (1) x 1 Digit 7-Segment Display 
* (8) x 220 ohm resistors 
* (26) x M-M wires (Male to Male jumper wires) 

### 7セグメントディスプレイ
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Seven_segment_02_Pengo.jpg/280px-Seven_segment_02_Pengo.jpg" />

七つの画（セグメント）から構成されている。個々の部分が点灯したり消えたりすることで、アラビア数字を表現する。7セグメントディスプレイの全状態は 1バイト で符号化できる、一般的には A-Gを "GFEDCBA" または "ABCDEFG" のように並べ、0 を消灯(off)、1 を点灯(on)とする。0から9までの数字を7セグメントディスプレイで表示する場合、真理値表のようなものからデコーダ回路を作ることになる。

<img src={require('./assets/tutorial-54.png').default} />

[Wiki - 7セグメントディスプレイ](https://ja.wikipedia.org/wiki/7%E3%82%BB%E3%82%B0%E3%83%A1%E3%83%B3%E3%83%88%E3%83%87%E3%82%A3%E3%82%B9%E3%83%97%E3%83%AC%E3%82%A4)  

本セットで使われている 7セグメントディスプレイは下記のもの  

<LinkTag url="http://www.wayjun.com/Datasheet/Led/Segment%20Digit%20LED%20Display.pdf">WAYJUN 7 Segment Four Digit LED Display Common Anode 0.56 Inch </LinkTag>

ピンは１０本あり、データシートを確認すると以下のように各ピンがマッチしている。  

| PIN No. | Segments | PIN No. | Segments |
| -- | :-- | -- | :-- |
| 1 | Cathode E | 6 | Cathode B |
| 2 | Cathode D | 7 | Cathode A |
| 3 | Common Anode DIG. 1 | 8 | Common Anode DIG. 2 |
| 4 | Cathode C | 9 | Cathode F |
| 5 | Cathode DP | 10 | Cathode G |

<img src={require('./assets/tutorial-55.png').default} />

## 構成

<img src={require('./assets/tutorial-56.png').default} />

[Lesson 16](/docs_iot/arduino/lesson16) の構成をベースに 7セグメントディスプレイを配線する。  
