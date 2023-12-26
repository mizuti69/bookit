---
id: waf_managedrule
title: "AWSマネージドルールのWAF ACLを作成"
---
import { LinkTag } from '../basecomponent.jsx';

## WAF V2

### マネージドルールのACL作成  

ACLを利用したいAWSサービスタイプを選択し、ルールを作成する。  
<img src={require('./assets/waf_acl01.png').default} width="90%"/>

WAFでのリクエストボディ検査バイト数を指定、デフォルトでは16KB以上はWAFでブロックされる。  
別途費用はかかるが制限を増やすことが可能。  
またACLを付与するサービスを作成時点で定義することもできる。  
<img src={require('./assets/waf_acl02.png').default} width="90%"/>

利用するルールグループの設定  
<img src={require('./assets/waf_acl03.png').default} width="90%"/>

AWSのマネージメントグループの詳細は下記にある通りで、  
<LinkTag url="https://docs.aws.amazon.com/ja_jp/waf/latest/developerguide/aws-managed-rule-groups-list.html">AWS マネージドルールのルールグループのリスト</LinkTag>  

各ルールの詳細は定義内容は更改されていないが、内容や概要を確認し、必要なものを選択する。  
例えば標準的な LAMP アプリケーションサイトを保護したいと考えたとき下記が選択肢にある。  

* AWS-AWSManagedRulesCommonRuleSet  
* AWS-AWSManagedRulesLinuxRuleSet
* AWS-AWSManagedRulesUnixRuleSet
* AWS-AWSManagedRulesSQLiRuleSet
* AWS-AWSManagedRulesPHPRuleSet

上記を選択した場合 1300 WCUs となり利用料金に関わってくるので利用するルールは要検討。  
<LinkTag url="https://docs.aws.amazon.com/ja_jp/waf/latest/developerguide/aws-waf-capacity-units.html">AWS WAF ウェブ ACL キャパシティユニット (WCU)</LinkTag>  

1500 WCUs までは追加料金無しで定義可能。  

WAFのデフォルトアクションを指定、 Allow がデフォルト許可でルールマッチは拒否、 Block が逆  
<img src={require('./assets/waf_acl04.png').default} width="90%"/>

WAFルールの適用順序。  
ルールを処理した数だけ課金額が増えていくので、全体的なルール（コアルール）等を優先度を挙げ、
アプリケーションなどよりソフトウェアよりなルールは下にするなど大部分の攻撃に対してヒットするルールを優先度高めにしたほうが良いかも。  
<img src={require('./assets/waf_acl05.png').default} width="90%"/>

サンプル取得の設定  
実際に拒否した際のサンプル（実攻撃ログ）表示を取得するかどうかの指定で、無いと何が弾かれていたのか確認したい際に詳細ログが必須になるため、  
マネージドルールを採用する場合は特にゆこうかしておいたほうがよい。  
<img src={require('./assets/waf_acl06.png').default} width="90%"/>

問題なければ作成され、指定したリソースに適用される  
