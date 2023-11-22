---
id: eventbridge_ec2stop
title: "EC2 の定期的な自動停止設定"
---
import { LinkTag } from '../basecomponent.jsx';

## EventBridgeを利用したEC2の自動停止  
夜になったら毎時でEC2は停止するAmazonEventBridgeをスケジューラから作成  

### EventBridge用IAMロールの作成  
カスタム信頼ポリシーから下記権限を付与したロールを作成する  
<img src={require('./assets/eb_stopec204.png').default} width="90%"/>

```
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "Statement1",
			"Effect": "Allow",
			"Principal": {"Service": "scheduler.amazonaws.com" },
			"Action": "sts:AssumeRole"
		}
	]
}
```

必要な権限を付与  
<img src={require('./assets/eb_stopec205.png').default} width="90%"/>
Full権限は不要だがとりあえず  

### スケジュール定義  
<img src={require('./assets/eb_stopec201.png').default} width="90%"/>

### 利用API指定
<img src={require('./assets/eb_stopec202.png').default} width="90%"/>

パラメータに停止したいインスタンスIDを指定  
<img src={require('./assets/eb_stopec203.png').default} width="90%"/>

### ロールの指定
事前に作成したIAMロールを指定  
<img src={require('./assets/eb_stopec206.png').default} width="90%"/>


設定を確認し問題なければ時間どおりに動く事を確認して終了  
