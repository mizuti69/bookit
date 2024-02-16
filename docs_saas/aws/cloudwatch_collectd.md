---
id: cloudwatch_collectd
title: "CloudWatchAgent + collectd でのカスタムメトリクス取得"
---
import { LinkTag } from '../basecomponent.jsx';


## collectd のインストール
https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-collectd.html

```
# dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm
# dnf install collectd
# systemctl enable collectd
# systemctl start collectd
```

※redhat7以降標準リポジトリから提供されなくなった  

## CloudWatchAgentのインストール

### インストール
割愛  

必要な権限周りについては下記参照  
https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/create-iam-roles-for-cloudwatch-agent.html  

### 設定ファイルの作成
https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/create-cloudwatch-agent-configuration-file-wizard.html  

```
# /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
================================================================
= Welcome to the Amazon CloudWatch Agent Configuration Manager =
=                                                              =
= CloudWatch Agent allows you to collect metrics and logs from =
= your host and send them to CloudWatch. Additional CloudWatch =
= charges may apply.                                           =
================================================================
On which OS are you planning to use the agent?
1. linux
2. windows
3. darwin
default choice: [1]:

Trying to fetch the default region based on ec2 metadata...
I! imds retry client will retry 1 timesAre you using EC2 or On-Premises hosts?
1. EC2
2. On-Premises
default choice: [1]:

Which user are you planning to run the agent?
1. root
2. cwagent
3. others
default choice: [1]:

Do you want to turn on StatsD daemon?
1. yes
2. no
default choice: [1]:

Which port do you want StatsD daemon to listen to?
default choice: [8125]

What is the collect interval for StatsD daemon?
1. 10s
2. 30s
3. 60s
default choice: [1]:

What is the aggregation interval for metrics collected by StatsD daemon?
1. Do not aggregate
2. 10s
3. 30s
4. 60s
default choice: [4]:

Do you want to monitor metrics from CollectD? WARNING: CollectD must be installed or the Agent will fail to start
1. yes
2. no
default choice: [1]:

Do you want to monitor any host metrics? e.g. CPU, memory, etc.
1. yes
2. no
default choice: [1]:

Do you want to monitor cpu metrics per core?
1. yes
2. no
default choice: [1]:

Do you want to add ec2 dimensions (ImageId, InstanceId, InstanceType, AutoScalingGroupName) into all of your metrics if the info is available?
1. yes
2. no
default choice: [1]:

Do you want to aggregate ec2 dimensions (InstanceId)?
1. yes
2. no
default choice: [1]:

Would you like to collect your metrics at high resolution (sub-minute resolution)? This enables sub-minute resolution for all metrics, but you can customize for specific metrics in the output json file.
1. 1s
2. 10s
3. 30s
4. 60s
default choice: [4]:

Which default metrics config do you want?  # メトリクスタイプの選択basicは mem と disck しか取得せず Advanced は net が不要そう
1. Basic
2. Standard
3. Advanced
4. None
default choice: [1]:
2
Current config as follows:
{
        "agent": {
                "metrics_collection_interval": 60,
                "run_as_user": "root"
        },
        "metrics": {
                "aggregation_dimensions": [
                        [
                                "InstanceId"
                        ]
                ],
                "append_dimensions": {
                        "AutoScalingGroupName": "${aws:AutoScalingGroupName}",
                        "ImageId": "${aws:ImageId}",
                        "InstanceId": "${aws:InstanceId}",
                        "InstanceType": "${aws:InstanceType}"
                },
                "metrics_collected": {
                        "collectd": {
                                "metrics_aggregation_interval": 60
                        },
                        "cpu": {
                                "measurement": [
                                        "cpu_usage_idle",
                                        "cpu_usage_iowait",
                                        "cpu_usage_user",
                                        "cpu_usage_system"
                                ],
                                "metrics_collection_interval": 60,
                                "resources": [
                                        "*"
                                ],
                                "totalcpu": false
                        },
                        "disk": {
                                "measurement": [
                                        "used_percent",
                                        "inodes_free"
                                ],
                                "metrics_collection_interval": 60,
                                "resources": [
                                        "*"
                                ]
                        },
                        "diskio": {
                                "measurement": [
                                        "io_time"
                                ],
                                "metrics_collection_interval": 60,
                                "resources": [
                                        "*"
                                ]
                        },
                        "mem": {
                                "measurement": [
                                        "mem_used_percent"
                                ],
                                "metrics_collection_interval": 60
                        },
                        "statsd": {
                                "metrics_aggregation_interval": 60,
                                "metrics_collection_interval": 10,
                                "service_address": ":8125"
                        },
                        "swap": {
                                "measurement": [
                                        "swap_used_percent"
                                ],
                                "metrics_collection_interval": 60
                        }
                }
        }
}
Are you satisfied with the above config? Note: it can be manually customized after the wizard completes to add additional items.
1. yes
2. no
default choice: [1]:

Do you have any existing CloudWatch Log Agent (http://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AgentReference.html) configuration file to import for migration?
1. yes
2. no
default choice: [2]:

Do you want to monitor any log files?  ## ログ監視は行わないので
1. yes
2. no
default choice: [1]:
2
Do you want the CloudWatch agent to also retrieve X-ray traces?  ## X-rayも使わない
1. yes
2. no
default choice: [1]:
2
Existing config JSON identified and copied to:  /opt/aws/amazon-cloudwatch-agent/etc/backup-configs
Saved config file to /opt/aws/amazon-cloudwatch-agent/bin/config.json successfully.
Current config as follows:
{
        "agent": {
                "metrics_collection_interval": 60,
                "run_as_user": "root"
        },
        "metrics": {
                "aggregation_dimensions": [
                        [
                                "InstanceId"
                        ]
                ],
                "append_dimensions": {
                        "AutoScalingGroupName": "${aws:AutoScalingGroupName}",
                        "ImageId": "${aws:ImageId}",
                        "InstanceId": "${aws:InstanceId}",
                        "InstanceType": "${aws:InstanceType}"
                },
                "metrics_collected": {
                        "collectd": {
                                "metrics_aggregation_interval": 60
                        },
                        "cpu": {
                                "measurement": [
                                        "cpu_usage_idle",
                                        "cpu_usage_iowait",
                                        "cpu_usage_user",
                                        "cpu_usage_system"
                                ],
                                "metrics_collection_interval": 60,
                                "resources": [
                                        "*"
                                ],
                                "totalcpu": false
                        },
                        "disk": {
                                "measurement": [
                                        "used_percent",
                                        "inodes_free"
                                ],
                                "metrics_collection_interval": 60,
                                "resources": [
                                        "*"
                                ]
                        },
                        "diskio": {
                                "measurement": [
                                        "io_time"
                                ],
                                "metrics_collection_interval": 60,
                                "resources": [
                                        "*"
                                ]
                        },
                        "mem": {
                                "measurement": [
                                        "mem_used_percent"
                                ],
                                "metrics_collection_interval": 60
                        },
                        "statsd": {
                                "metrics_aggregation_interval": 60,
                                "metrics_collection_interval": 10,
                                "service_address": ":8125"
                        },
                        "swap": {
                                "measurement": [
                                        "swap_used_percent"
                                ],
                                "metrics_collection_interval": 60
                        }
                }
        }
}
Please check the above content of the config.
The config file is also located at /opt/aws/amazon-cloudwatch-agent/bin/config.json.
Edit it manually if needed.
Do you want to store the config in the SSM parameter store?
1. yes
2. no
default choice: [1]:

What parameter store name do you want to use to store your config? (Use 'AmazonCloudWatch-' prefix if you use our managed AWS policy)
default choice: [AmazonCloudWatch-linux]

Trying to fetch the default region based on ec2 metadata...
I! imds retry client will retry 1 timesWhich region do you want to store the config in the parameter store?
default choice: [ap-northeast-1]

Which AWS credential should be used to send json config to parameter store?
1. ASIA5CVSVOBS5CRNU3ML(From SDK)
2. Other
default choice: [1]:

Successfully put config to parameter store AmazonCloudWatch-linux.
Program exits now.
```

基本的にはデフォルトのままで不要な機能のみ無効化し、パラメータは SSMパラメータストアに保存して他ホストでも使い回せるように  

設定の反映  

```
# /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
>  -a fetch-config -m ec2  -s -c ssm:AmazonCloudWatch-linux
****** processing amazon-cloudwatch-agent ******
I! Trying to detect region from ec2 D! [EC2] Found active network interface I! imds retry client will retry 1 timesRegion: ap-northeast-1 credsConfig: map[] Successfully fetched the config and saved in /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.d/ssm_AmazonCloudWatch-linux.tmp
Start configuration validation...
2024/01/31 14:54:11 Reading json config file path: /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.d/ssm_AmazonCloudWatch-linux.tmp ...
2024/01/31 14:54:11 I! Valid Json input schema.
2024/01/31 14:54:11 D! ec2tagger processor required because append_dimensions is set
2024/01/31 14:54:11 D! delta processor required because metrics with diskio or net are set
2024/01/31 14:54:11 D! ec2tagger processor required because append_dimensions is set
2024/01/31 14:54:11 Configuration validation first phase succeeded
I! Detecting run_as_user...
I! Trying to detect region from ec2
D! [EC2] Found active network interface
I! imds retry client will retry 1 times
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent -schematest -config /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.toml
Configuration validation second phase succeeded
Configuration validation succeeded
amazon-cloudwatch-agent has already been stopped
```

### 動作確認

```
# systemctl enable amazon-cloudwatch-agent
# systemctl start amazon-cloudwatch-agent
```

## LoadAvarageを取得

### collectdのサーバ機能とLA取得プラグインの有効化

```
# vim /etc/collectd.conf

LoadPlugin load 
LoadPlugin network

<Plugin load>
        ReportRelative true
</Plugin>

<Plugin network>
        # client setup:
#        Server "ff18::efc0:4a42" "25826"
        <Server "127.0.0.1" "25826">
                SecurityLevel Encrypt
                Username "user"
                Password "secret"
#               Interface "eth0"
#               ResolveInterval 14400
        </Server>
# ~省略~
</Plugin>
```

認証情報の保存

```
# vim /etc/collectd.d/auth_file
user: secret
```

collectd.conf と同様の内容を記載しておく  

設定の反映  

```
# systemctl restart collectd
```

### CloudWatchAgentの設定
設定ファイルを変更、またはパラメータストアの設定を変更  

```
# vim /opt/aws/amazon-cloudwatch-agent/bin/config.json
                "metrics_collected": {
                        "collectd": {
                                "collectd_security_level":"encrypt",
                                "collectd_auth_file":"/etc/collectd.d/auth_file",
                                "metrics_aggregation_interval": 60
```

※ローカルファイルを変更した場合はパラメータストアの定義も更新しておく  

```
# aws ssm put-parameter --name "AmazonCloudWatch-linux" --type "String" --value file:///opt/aws/amazon-cloudwatch-agent/bin/config.json
```

パラメータストアの定義を変更した場合は同様にローカルのAgentに設定を反映させる  

```
# /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl  -a fetch-config -m ec2  -s -c ssm:AmazonCloudWatch-linux
# systemctl restart amazon-cloudwatch-agent
```

## CloudWatchメトリクスで確認
collectdで取得している
メモリ、ディスク情報、ロードアベレージ等が取得できていればOk  

> CWAgent→ImageId,InstanceId,InstanceType,type,type_instance  
