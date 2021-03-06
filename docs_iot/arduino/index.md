---
id: index
title: Arduino とは？  
---
import { LinkTag } from '../basecomponent.jsx';

## Arduino 
<LinkTag url="https://www.arduino.cc">Arduino</LinkTag>  

Arduinoは、使いやすいハードウェアとソフトウェアをベースにした、オープンソースのエレクトロニクス・プラットフォームです。Arduinoボードは、センサーの光、ボタンを押す指、Twitterのメッセージなどの入力を読み取り、モーターを動かす、LEDを点灯させる、オンラインで公開するなどの出力に変えることができます。ボード上のマイクロコントローラーに一連の命令を送ることで、ボードに何をすべきかを伝えることができます。そのためには、WiringをベースにしたArduinoプログラミング言語と、ProcessingをベースにしたArduinoソフトウェア（IDE）を使用します。  

Arduinoは、Ivrea Interaction Design Instituteで、電子工学やプログラミングの知識がない学生を対象に、簡単にプロトタイプを作成できるツールとして誕生しました。Arduinoボードは、より多くのコミュニティに普及すると同時に、新たなニーズや課題に対応するために変化し始め、シンプルな8ビットボードから、IoTアプリケーション、ウェアラブル、3Dプリンティング、組み込み環境向けの製品へと差別化されていきました。すべてのArduinoボードは完全にオープンソースであり、ユーザーが独自に構築し、最終的に特定のニーズに適合させることができます。また、ソフトウェアもオープンソースであり、世界中のユーザーの貢献によって成長しています。  

フィジカル・コンピューティングに使用できるマイクロコントローラーやマイクロコントローラー・プラットフォームは他にもたくさんあります。これらのツールはいずれも、マイクロコントローラのプログラミングの面倒な部分を、使いやすいパッケージにまとめています。Arduinoもまた、マイクロコントローラを扱うプロセスを簡素化しますが、教師や学生、興味のあるアマチュアにとっては、他のシステムに比べていくつかの利点があります。  

* 安価:  
  Arduinoのボードは、他のマイクロコントローラ・プラットフォームに比べて比較的安価です。  
  最も安価なバージョンのArduinoモジュールは、手作業で組み立てることができ、組み立て済みのArduinoモジュールでも50ドル以下である。  
* クロスプラットフォーム:  
  Arduinoソフトウェア（IDE）は、Windows、Macintosh OSX、Linuxの各OSで動作します。  
  ほとんどのマイクロコントローラシステムはWindowsに限定されています。  
* シンプルでわかりやすいプログラミング環境:  
  Arduinoソフトウェア（IDE）は、初心者にも使いやすく、上級者にも活用できる柔軟性を備えています。  
* オープンソースで拡張可能なソフトウェア:  
  Arduinoのソフトウェアはオープンソースツールとして公開されており、経験豊富なプログラマーによる拡張が可能です。  
  C++のライブラリを使って言語を拡張することができ、技術的な詳細を理解したい人は、ArduinoからベースとなっているAVR Cプログラミング言語に移行することができます。  
  同様に、AVR-CのコードをArduinoのプログラムに直接追加することもできます。  
* オープンソースで拡張可能なハードウェア:  
  Arduinoボードの設計図はクリエイティブ・コモンズ・ライセンスの下で公開されているため、経験豊富な回路設計者は、モジュールを拡張したり改良したりして独自のバージョンを作ることができます。  

※[Arduino - What is Arduino?](https://www.arduino.cc/en/Guide/Introduction) より一部機械翻訳し抜粋  

## ハードウェアの種類  
Arduino はハードウェアの規格がオープンにされており、様々な互換のサードパーティキットや、公式からも様々な形式のボードが発売されており、ここではいくつか紹介する  
※以下機械翻訳し抜粋  

<LinkTag url="https://www.arduino.cc/en/Main/Products">Arduino Products</LinkTag>  


### Entry Level
電子機械のコーディングや学習、改造を始めるのに適した入門的シリーズ  

#### [Arduino UNO](https://store.arduino.cc/usa/arduino-uno-rev3)  
Arduino Unoは、ATmega328P をベースにしたマイクロコントローラボードです。
14本のデジタル入出力端子（うち6本はPWM出力として使用可能）、6本のアナログ入力端子、16MHzのセラミック発振子（CSTCE16M0V53-R0）、USB接続端子、電源ジャック、ICSPヘッダー、リセットボタンを備えています。マイコンをサポートするために必要なものがすべて含まれています。USBケーブルでコンピューターに接続したり、AC-DCアダプターやバッテリーで電源を供給するだけで、すぐに使い始めることができます。  

#### [Arduino NANO](https://store.arduino.cc/usa/arduino-nano)
Arduino Nanoは、ATmega328（Arduino Nano 3.x）をベースにした、小型で完成度の高い、ブレッドボードに適したボードです。Arduino Duemilanoveとほぼ同じ機能を備えていますが、パッケージが異なります。DC電源ジャックがないだけで、標準のUSBケーブルではなくミニBのUSBケーブルで動作します。  

#### [Arduino Micro](https://store.arduino.cc/usa/arduino-micro)  
Microは、Adafruitと共同で開発したATmega32U4（データシート）をベースにしたマイクロコントローラボードです。20本のデジタル入出力端子（うち7本はPWM出力、12本はアナログ入力）、16MHzの水晶振動子、マイクロUSB接続端子、ICSPヘッダー、リセットボタンを備えています。マイコンのサポートに必要なものがすべて含まれており、マイクロUSBケーブルでコンピューターに接続するだけで使用できます。また、ブレッドボード上に簡単に設置できるように、フォームファクターを採用しています。  

### Enhanced Features
より高性能、高速なパフォーマンスが必要な開発プロジェクト用のシリーズ  

#### [Arduino MEGA 2560](https://store.arduino.cc/usa/mega-2560-r3)  
Arduino Mega 2560は、ATmega2560をベースにしたマイクロコントローラボードです。54本のデジタル入出力端子（うち15本はPWM出力として使用可能）、16本のアナログ入力端子、4個のUART（ハードウェアシリアルポート）、16MHz水晶発振器、USB接続端子、電源ジャック、ICSPヘッダー、リセットボタンを備えています。マイコンをサポートするために必要なものがすべて含まれており、USBケーブルでコンピュータに接続したり、AC-DCアダプタやバッテリーで電源を供給するだけで、すぐに使用できます。Mega 2560ボードは、Uno用に設計されたほとんどのシールドや、以前のボードであるDuemilanoveまたはDiecimilaと互換性があります。Mega 2560は、Arduino Megaの後継機種としてアップデートされたものです。  

#### [Arsuino Due](https://store.arduino.cc/usa/due)  
Arduino Dueは、Atmel SAM3X8E ARM Cortex-M3 CPUをベースにしたマイクロコントローラボードです。32ビットARMコアのマイクロコントローラーをベースにした初のArduinoボードです。54本のデジタル入出力ピン（うち12本はPWM出力として使用可能）、12本のアナログ入力、4個のUART（ハードウェアシリアルポート）、84MHzクロック、USB OTG対応接続、2個のDAC（digital to analog）、2個のTWI、電源ジャック、SPIヘッダー、JTAGヘッダー、リセットボタン、消去ボタンを備えています。  

ほとんどのArduinoボードとは異なり、Arduino Dueボードは3.3Vで動作します。I/Oピンが許容できる最大電圧は3.3Vです。I/Oピンに3.3V以上の電圧を印加すると、ボードが破損する恐れがあります。  

### Internet of Things
IoT開発プロジェクト向けの WiFi / Bluetooth デバイスが追加されたシリーズ  

#### [Arduino NANO 33 IoT](https://store.arduino.cc/usa/nano-33-iot)  
Arduino Nano 33 IoTは、既存のデバイスをIoTの一部として強化したり、新しいデバイスを作成したり、ピコ・ネットワーク・アプリケーションを設計するための、最も簡単で安価なエントリー・ポイントです。Nano 33 IoTは、オフィスや家庭のルーターに接続されたセンサーネットワークの構築や、携帯電話にデータを送信するBLEデバイスの作成など、IoTアプリケーションの基本的なシナリオの多くに対応するワンストップソリューションです。このボードのメインプロセッサは、低消費電力のArm® Cortex®-M0 32ビットSAMD21です。WiFiとBluetooth®の接続は、2.4GHz帯で動作する低消費電力のチップセットであるu-bloxのモジュール、NINA-W10で行います。さらに、マイクロチップ社のECC608暗号チップを搭載し、安全な通信を実現しています。さらに、6軸IMUを搭載しているので、シンプルな振動アラームシステムや歩数計、ロボットの相対的な位置決めなどに最適なボードです。  

#### [Arduino UNO WiFi](https://store.arduino.cc/usa/arduino-uno-wifi-rev2)  
Arduino UNO WiFi Rev.2は、UNOファミリーの標準的なフォームファクターで、基本的なIoTへの最も簡単なエントリーポイントとなります。オフィスや自宅のルーターに接続するセンサーネットワークの構築や、携帯電話にデータを送信するBLEデバイスの作成など、Arduino UNO WiFi Rev.2は、基本的なIoTアプリケーションシナリオの多くに対応するワンストップソリューションです。このボードをデバイスに追加すれば、安全なECC608暗号チップアクセラレータを使用して、デバイスをWiFiネットワークに接続することができます。Arduino Uno WiFiは、機能的にはArduino Uno Rev3と同じですが、WiFi / Bluetoothが追加され、その他の機能も強化されています。  
