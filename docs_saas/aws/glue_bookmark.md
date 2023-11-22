---
slug: glue_bookmark
title: GLue の Job bookmark と重複について

---
import { LinkTag } from '../basecomponent.jsx';

Glue Job の Job bookmark について挙動を理解しておく  

## Job bookmark
[ジョブのブックマークを使用した処理済みデータの追跡](https://docs.aws.amazon.com/ja_jp/glue/latest/dg/monitor-continuations.html)  

> ジョブの実行後に状態を更新させて以前に処理されたデータを追跡します。ジョブのブックマークをサポートしているソースのあるジョブの場合、ジョブは処理されたデータを追跡し、ジョブが実行されると、最後のチェックポイント以降の新しいデータを処理します  

> Amazon S3 入力ソースの場合、AWS Glue ジョブのブックマークではオブジェクトの最終更新日時を確認して、どのオブジェクトを再処理する必要があるのかを確認します。入力ソースデータが最後のジョブ実行以降に変更されている場合、ジョブを再度実行すると、ファイルが再度処理されます。  

上記のように job bookmark は 以前処理したデータを記憶していて次の処理のときには処理済みデータはスキップして処理することで  
重複処理を回避でき、処理時間の短縮を行うことができるように書かれているが何をどのように管理しているのかを確認する  

### Job bookmarkの有効化
ブックマーク自体はヴィジュアルエディタの場合ジョブのdetailsにある  

<img src={require('./assets/glue-bm01.png').default} width="90%"/>

### 変更の無い同一データソースに対して複数回ETLジョブを実行してみる  
①S3にデータソースを配置  
②Glue ETLジョブで取り込み  
③Glue ETLジョブを再実行  

②で取り込み処理が成功し、③では何も処理する対象がなく即時終了している  
出力先のS3バケットを確認しても１つの出力ファイルがあるだけになっている  

### 取り込み済みデータソースのタイムスタンプを変更してみる  
①S3にデータを配置  
②Glue ETLジョブで取り込み  
③S3に配置したデータを同一データで上書き更新しタイムスタンプを更新する  
④Glue ETLジョブで取り込み  

タイムスタンプを更新（S3上で）したところジョブでは新しいデータと認識されて処理されていることがわかる  

<img src={require('./assets/glue-bm03.png').default} width="90%"/>
<img src={require('./assets/glue-bm02.png').default} width="90%"/>

出力先を見てみても前回取り込み時と同様の内容、バイト数のファイルがもう一つ作成されていることがわかる  

<img src={require('./assets/glue-bm04.png').default} width="90%"/>

これはドキュメントにあるようにタイムスタンプを参照しているため想定通りの挙動となる  

### ジョブブックマーク無効状態の挙動  
①ジョブブックマークを削除  
②ジョブブックマークの無効化  
③ETLジョブを実行  
④ETLジョブを実行  

<img src={require('./assets/glue-bm05.png').default} width="90%"/>

実行を行うたびに重複データが生成されている  

Glue でジョブ運用を行う場合は以下の事に注意する  

* ブックマークを必ず有効化して運用する必要がある（データソースがS3の場合）  
* データの再取り込み、再アップ等する際は操作により重複データが生成されるか理解しておくこと  

## Data Catalog update options
[Creating tables, updating the schema, and adding new partitions in the Data Catalog from AWS Glue ETL jobs](https://docs.aws.amazon.com/glue/latest/dg/update-from-job.html)  

ETLジョブには取り込み時の挙動として Data Catalog update options があり、「Create a table in the Data Catalog and on subsequent runs, update the schema and add new partitions」にチェックしていれば重複なんて発生しないのでは？と思いそうだが、
こちらで行っているのは Glue Crawler の変わりであり、データ形式（カラムやスキーマ構成）、パーティションの更新のみでありデータの内容は見ていないので注意  

## S3のタイムスタンプとメタデータ
[オブジェクトメタデータの使用](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/UsingMetadata.html)  

基本的にS3上オブジェクトのメタデータは何かしら操作をすると更新され、こちらで変更や操作をすることはできない  
ファイルをアップする時にカスタムメタデータでタイムスタンプを指定することはできるが、基本的にS3はそういうものとおぼえたほうが良い  

## 重複データの削除
取り込み後に重複データが発生してしまった場合は基本的に Glue 側ではどうすこともできないため  

* 出力先データがS3 であれば重複分をファイルごと削除する  
* Glue データカタログ、テーブル、ブックマーク情報、出力先データを全て削除し、全て取り込み直す  

くらいしかない  
重複データを絶対に許したくない場合はRDBを採用し重複データが入らないような仕組みにするほうが良さそう  
また ETL 処理を更新し、今までのデータを再取り込みしたい場合も同様に対応するしかない  
