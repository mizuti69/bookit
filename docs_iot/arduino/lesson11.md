---
id: lesson11
title: Lesson 11  
---
import { LinkTag } from '../basecomponent.jsx';

## 温度湿度センサー
温度湿度センサーと電気式センサーの仕組みについて学習。  

### 使用する機器  

* (1) x Elegoo Uno R3
* (1) x DHT11 Temperature and Humidity module
* (3) x F-M wires (Female to Male DuPont wires)

### 温度湿度センサー  

<img src="https://images-na.ssl-images-amazon.com/images/I/61l3mmxGyVL._SL1000_.jpg" width="30%"/>

セットに入っている温度湿度センサーは DHT11 というセンサーを採用しており、抵抗膜方式の湿度計測部とNTC方式の温度計測部で構成され、高性能な8ビットマイコンと接続することで、優れた品質、高速応答、耐干渉性、コストパフォーマンスを実現しています。

電子式の湿度センサーには、主に抵抗式と容量式の2種類があり、抵抗式は感湿材料の吸湿/脱湿によって変化する抵抗値を捉えて計測し、容量式の場合は、感湿材料の吸湿/脱湿によって変化する静電容量を捉えて計測します。抵抗型は湿度が低くなると抵抗値が大きくなり、湿度が高くなると抵抗値が小さくなります。

<LinkTag url="https://www.daiichi-kagaku.co.jp/situdo/note/arekore10/">株式会社第一科学 - 電気式湿度センサー</LinkTag>

温度測定に使われている NTC とは 温度により電気抵抗値が下がる仕組みを利用している。  

<LinkTag url="https://www.murata.com/ja-jp/products/thermistor/ntc/library/basic/ntc">村田製作所 - NTCサーミスタとは？</LinkTag>

本キットは上記の組み合わせでモジュール化している。  
DHT11 は データシートにある通り、正面から見たときに左から VDD 電源ピン、DATA データ転送ピン、NC 無接続ピン、GNDピンとなっており、モジュール化されるにあたり NC が省略され 3ピンになっている。  

<LinkTag url="https://datasheetspdf.com/pdf/785591/Aosong/DHT11/1">DatasheetsPDF.com - DHT11</LinkTag>

### 構成  

<img src={require('./assets/tutorial-38.png').default} /> 

配線し、サンプルプログラムとライブラリをデプロイして、シリアルコンソールを開くとセンサーデータを確認できる。  

<img src={require('./assets/tutorial-39.png').default} /> 

T（temperature）が温度、 H（humidity）が湿度となっており、コードを見てみると  

```c
#include <dht_nonblocking.h>
#define DHT_SENSOR_TYPE DHT_TYPE_11

static const int DHT_SENSOR_PIN = 2;
DHT_nonblocking dht_sensor( DHT_SENSOR_PIN, DHT_SENSOR_TYPE );

/*
 * Initialize the serial port.
 */
void setup( )
{
  Serial.begin( 9600);
}

/*
 * Poll for a measurement, keeping the state machine alive.  Returns
 * true if a measurement is available.
 */
static bool measure_environment( float *temperature, float *humidity )
{
  static unsigned long measurement_timestamp = millis( );

  /* Measure once every four seconds. */
  if( millis( ) - measurement_timestamp > 3000ul )
  {
    if( dht_sensor.measure( temperature, humidity ) == true )
    {
      measurement_timestamp = millis( );
      return( true );
    }
  }

  return( false );
}

/*
 * Main program loop.
 */
void loop( )
{
  float temperature;
  float humidity;

  /* Measure temperature and humidity.  If the functions returns
     true, then a measurement is available. */
  if( measure_environment( &temperature, &humidity ) == true )
  {
    Serial.print( "T = " );
    Serial.print( temperature, 1 );
    Serial.print( " deg. C, H = " );
    Serial.print( humidity, 1 );
    Serial.println( "%" );
  }
}`

```

`DHT_nonblocking dht_sensor( DHT_SENSOR_PIN, DHT_SENSOR_TYPE );` でデータをやり取りするピンと、利用する DHTセンサーのタイプを指定している。  
ライブラリ側で計算しているためセンサー制御系のコードは無く、データの定義とデータ取得、表示についてのコードのみ `measure_environment` 関数を定義して値を取り続けるようにし、あとは `Loop`で値の取得確認と表示を繰り返している。  

[Lesson 5](/docs_iot/arduino/lesson5) で デジタル入力、アナログ入力について学習したように、本来温度のような短時間での連続データを取り扱うことに対してデジタル入力は本来向いていません。実際にセンサーが取得し Arudino 側に送っているデータは 8bit x 5種類となっており  先頭から湿度（High）、湿度（Loｗ）、温度（High）、温度（Low）と下記のようになっておりモジュール側で吸収している。  

<img src={require('./assets/tutorial-40.png').default} /> 
