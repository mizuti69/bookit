---
slug: glue_workflow
title: GLue の複数 ETL ジョブを WorkFlow で管理する
---

複数の連続したETLジョブはWorkFlowで実行管理する  


## Glue workflows を使ったステップETLジョブ実行
データソースに対していくつかの複数ジョブを順番通り実行したいときにworkflowを利用することで複雑なジョブ体型をstepfunctionsのように管理実行できる  

### 複数ジョブ
今回の場合データソースに配置されたログファイルの文字コードを変更するジョブと、  
完了後、データレイクに取り込むジョブの２つがあり、これを連続して実行するようにしたい  

<img src={require('./assets/glue-wf01.png').default} width="90%"/>

### ワークフローの作成
Glueのコンソールからワークフローを作成  
ワークフローの作成自体は特別設定等は無く、フローの作成は作成後  

<img src={require('./assets/glue-wf02.png').default} width="90%"/>

作成したワークフローを開くと「Graph」の所に「Trigger」「Crawler」「Job」をそれぞれ定義してワークフローを定義できる  

<img src={require('./assets/glue-wf03.png').default} width="90%"/>

最初にまず「Trigger」を設定する必要があり、**これらは後から変更できず変更したい場合は再作成となる**  
「Trigger」に設定できるのは

* cron式の「Schedule」
* 主にジョブのつなぎ目で使う「Event」
* 手動でワークフローを動かしたい場合の「On demand」
* EventBridge と連携した「EventBridge event」

<img src={require('./assets/glue-wf04.png').default} width="90%"/>

Trriger Logic で 前提のトリガー状況に応じて制御できるように ANY や ALL が選択できる  
ここでの場合、ワークフローを定期実行したいので スケジュール Trigger にし、  
ファイルのエンコードジョブが正常に完了した場合（ALL）次の データレイク取り込みジョブを実行するようにしている  

### ワークフローの実行
ワークフローはオンデマンドであればコンソール等から手動実行  
スケジュール等であれば設定された時間に実行されることで確認できる  

<img src={require('./assets/glue-wf05.png').default} width="90%"/>

上記のようにワークフローの Run details から確認できるが注意点として、  

* **途中のジョブが失敗してもワークフローは正常終了する**
* ワークフロー単位でジョブの実行監視はできない（多分）
* ジョブのログを見たい場合は各ジョブで確認する必要がある  
* Triggerを変更したい場合は再作成

とちょっと使いにくい  

## PythonScriptで処理を行い場合のログについて
PythonScriptで簡単な処理を実行したい場合、Glueは自身のログ設定を持っているためちょっとした処理ログを残したい場合に出力されずに困る  
※print等標準出力やWorning以上のログは普通に出力される  

下記サイトを参考に  
https://yomon.hatenablog.com/entry/2019/07/gluepythonshelllog

既存のログハンドラを削除、再設定して logging.info 等で開発時と同様にログを制御できるようにする事が可能  

```python
import sys
import logging

logger = logging.getLogger()
[logger.removeHandler(h) for h in logger.handlers]
log_format = '[%(levelname)s][%(filename)s][%(funcName)s:%(lineno)d]\t%(message)s'
stdout_handler = logging.StreamHandler(stream=sys.stdout)
stdout_handler.setFormatter(logging.Formatter(log_format))
logger.addHandler(stdout_handler)
logger.setLevel(logging.INFO)
```

サンプル  

```
import sys
import re
import boto3
from awsglue.utils import getResolvedOptions
import logging

""" Glue logger set"""
logger = logging.getLogger()
[logger.removeHandler(h) for h in logger.handlers]
log_format = '[%(levelname)s] %(message)s'
stdout_handler = logging.StreamHandler(stream=sys.stdout)
stdout_handler.setFormatter(logging.Formatter(log_format))
logger.addHandler(stdout_handler)
logger.setLevel(logging.INFO)
""" Glue logger set"""


# ENV
args = getResolvedOptions(sys.argv, ['BUCKET_NAME','BUCKET_PATH','BUCKET_PATH_DECODE','BUCKET_PATH_ORG','DECODE_LANG'])
#BUCKET_NAME = 'dp-datalake-dev'
BUCKET_NAME = args['BUCKET_NAME']
#BUCKET_PATH = 'Processed_CTS_dev/input/'
BUCKET_PATH = args['BUCKET_PATH']
#BUCKET_PATH_DECODE = 'Processed_CTS_dev/utf8/'
BUCKET_PATH_DECODE = args['BUCKET_PATH_DECODE']
#BUCKET_PATH_ORG = 'Processed_CTS_dev/shif_jis/'
BUCKET_PATH_ORG = args['BUCKET_PATH_ORG']
#DECODE_LANG = 'cp932'
DECODE_LANG = args['DECODE_LANG']

s3 = boto3.resource('s3')
bucket = s3.Bucket(BUCKET_NAME)
for objects in bucket.objects.filter(Prefix=BUCKET_PATH):
    #print('{0}:{1}'.format(bucket.name, objects.key))

    if objects.key != BUCKET_PATH:
        logging.info(objects.key)

        # Get S3 Object
        src_obj = s3.Object(bucket.name, objects.key)
        obj_file_name = str(re.sub(BUCKET_PATH, "", objects.key))
        logging.info("get " + str(src_obj))
        
        # Decodeing object
        body = src_obj.get()['Body'].read().decode(DECODE_LANG)
        
        # Upload utf8 object
        dest_obj = s3.Object(bucket.name, BUCKET_PATH_DECODE + obj_file_name)
        logging.info("upload " + str(dest_obj))
        dest_obj.put(Body=body)

        # Moving and deleting source files
        copy_source = { 'Bucket': bucket.name, 'Key': src_obj.key }
        s3.meta.client.copy(copy_source, bucket.name, BUCKET_PATH_ORG + obj_file_name)
 
        del_obj = s3.Object(bucket.name, src_obj.key)
        del_obj.delete()

    else:
        if not objects:
            logging.info("S3 FILE NOT FOUND" + objects.key)
            exit(1)
        else:
            logging.info("SKIP " + objects.key)
            
```
