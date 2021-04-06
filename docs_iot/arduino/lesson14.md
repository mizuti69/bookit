---
id: lesson14
title: Lesson 14  
---
import { LinkTag } from '../basecomponent.jsx';

## LCD DISPLAY  
液晶が画面への出力操作学習。  

### 使用する機器  

* (1) x Elegoo Uno R3 
* (1) x LCD1602 module 
* (1) x Potentiometer (10k) 
* (1) x 830 tie-points Breadboard 
* (16) x M-M wires (Male to Male jumper wires) 

### LCD DISPLAY

<img src="https://images-na.ssl-images-amazon.com/images/I/61ZGi7vhGUL._AC_SL1500_.jpg" width="30%"/>

LCD とは Liquid Crystal Display の略で液晶ディスプレイのことで、液晶ディスプレイはバックライトが発する光を偏光フィルター、カラーフィルター、液晶を通過させることで色付きの光として出力されます。  
セット内の LCD DIsplay は「LCM1602A」という LCD にコントローラーをつけてモジュール化したもので、データシートは下記になる。  
<LinkTag url="https://datasheetspdf.com/pdf/866417/LONGTECHOPTICS/LCM1602A/1">datasheetspdf.com - LCM1602A Module</LinkTag> 

液状ディスプレイは、制御するためのタイミングチャート、表示させるための文字コード、文字やその他表示制御用のインスラクション等を意識する必要があるが、 Arduino にはライブラリが用意されており、上記のような制御が抽象化されているためほとんど意識しなくても扱うことができる。  
ここでは詳細については割愛する。  

:::note
[LCDに文字を表示させるプログラミング - monoist.atmarkit.co.jp](https://monoist.atmarkit.co.jp/mn/articles/0703/19/news116.html)  
[インストラクションによる液晶表示器の設定 - infoseek_rip.g.ribbon.to](http://infoseek_rip.g.ribbon.to/spectrum123.at.infoseek.co.jp/lcd/lcd_2/lcd_2.htm)  
:::

このモジュールでは16ピンあり、それぞれ  

* VSS: グランドに接続するピン  
* VDD: + 5V 電源に接続するピン  
* VO: LCD1602 のコントラストを調整するピン  
* RS: LCD のメモリ内のどこにデータを書き込むかを制御するレジスタ選択ピン 画面に表示されている内容を保持するデータレジスタ、または命令のレジスタ（LCD のコントローラが次に何をするかの指示を参照する）を選択できます 
* R/W: 読み出しモードまたは書き込みモードを選択する読み出し/書き込みピン  
* E: ローレベルのエネルギーが供給されると、LDC モジュールに関連する命令を実行させるイネーブルピン 
* D0-D7: データを読み書きするためのピン  
* A and K: LED バックライトを制御するピン  

となっている  

### 可変抵抗器 ポテショメータ  

<img src="https://images-na.ssl-images-amazon.com/images/I/61cBZVCQNeL._SL1100_.jpg" width="30%"/>

以前の [Lesson 12](/docs_iot/arduino/lesson12) でも触れた可変抵抗器の一種。  
上記のと見た目は違うがセットに含まれてるのは PT-15 というポテンショメータ（ノブ付き）でデータシートは下記になる。  
<LinkTag url="https://japanese.alibaba.com/product-detail/pt06-pt15-trimmer-potentiometer-with-knob-60484680409.html">PT06PT15トリマーポテンショメータ (ノブ付き) - japanese.alibaba.com</LinkTag>  

ポテンショメータも抵抗値を任意の値に変更できる可変抵抗器のことで、オーディオのボリューム調整といったアナログ電圧の制御・設定から、カメラのズームレンズ制御といった位置・角度検出センサまでと、幅広い用途で用いられている電子部品。ワイパで機械的に位置を変化させ、その変位量と出力された電圧から距離・寸法などを測定する、というようにカメラのズームレンズの制御や工作・建設機械などのアーム操作の角度検出などに用いられる。  

LCDディスプレイの本チュートリアルではバックライトの調整に使う  

ポテンションメータのピンは3本あり、2本に電圧をかけて真ん中のピンから出力結果を得ます。  
出力ピンはアナログ出力、左ピンが VCC、、右ピンが GND になっている。  
10k とは 10kΩのことで、最小0Ω、最大10kΩの調整が可能ということ。  

### 構成  

<img src={require('./assets/tutorial-45.png').default} />  

ポテンションメータの出力先は LCD の VO ピンにつなげる。RS、E、D4～D7 の制御用はすべてがデジタル入出力に繋げる。  
サンプルコードをデプロイすると「hello、world」というメッセージが表示され、その後にゼロからカウントアップする数字が表示されます。  
※必要により LiquidCrystal ライブラリを追加する。多くの場合デフォルトである。  
※メッセージが出ない場合、ポテンションメータによってコントラストが低すぎる場合があるので動かしてみると見える場合もある。  

<img src={require('./assets/tutorial-46.jpg').default} width="50%"/>  

コードを見てみると。  

```c
// include the library code:
#include <LiquidCrystal.h>

// initialize the library with the numbers of the interface pins
LiquidCrystal lcd(7, 8, 9, 10, 11, 12);

void setup() {
  // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);
  // Print a message to the LCD.
  lcd.print("Hello, World!");
}

void loop() {
  // set the cursor to column 0, line 1
  // (note: line 1 is the second row, since counting begins with 0):
  lcd.setCursor(0, 1);
  // print the number of seconds since reset:
  lcd.print(millis() / 1000);
}
```

ライブラリにより簡略化され、ピンの割当宣言と [`LiquidCrystal lcd()`](https://www.arduino.cc/en/Reference/LiquidCrystalConstructor) 、 
処理の setup は  
`lcd.begin()` で使用する LCD の行数と列数を指定し `lcd.print()` で表示させる文字を指定している。  
２行目への文字は loop 内で指定している `lcd.setCursor()`が表示行の指定。  

静的な文字の表示であれば setup と loop を分ける必要は無いが、  
サンプルコードでは動的に変化する文字を表示しようとしている `lcd.print(millis() / 1000)` ためLoop 側に記述することで 処理されるたびに表示される値が変わるよう動的表示を制御している。  

ポテンショメータも、左右に弄ってみると液晶の表示具合の変化を確認できる。ポテンショメータではなく普通の抵抗器でも無くても(つまり0Ω状態)大丈夫だが抵抗値を大小大きく値を変えてみると必要性がわかるだろう。  

**「なぜ LCD の D0 から配線していないのか？」**  
という点については `LiquidCrystal() ` リファレンスにもあるとおり D0 ~ D3 はオプションになっており動作モードによって使うピンが変わるからである。  
4つのデータピンを使用する4ビットモード（d4-d7）と8つのデータピンすべてを使用する8ビットモード（d0-d7）の2つの主要な動作モードがあり、利用するディスプレイがどちらの動作モードをサポートしているかによって選択したり、動作モードの違いにより Arduino の利用できるピン数も減ってしまうためそのへんの選択で変わってきます。  

4bit モードと 8bit モードの違いは単純に表示速度ですが、  マイクロチップコントローラーの発展や色々と時代の経緯やらがあるため興味がある場合は調べてみると良い。  

:::note
[マイクロコントローラ - Wiki](https://ja.wikipedia.org/wiki/%E3%83%9E%E3%82%A4%E3%82%AF%E3%83%AD%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%A9)  
[液晶表示モジュールを４ビットモードで使ったときの空きピン処理 - act-ele.c.ooco.jp](http://act-ele.c.ooco.jp/trouble/lcd4bit/lcd4bit.htm)  
:::
