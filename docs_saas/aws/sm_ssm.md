---
id: sm_ssm
title: "SessionManager の設定"
---
import { LinkTag } from '../basecomponent.jsx';

## SSM Agentのインストール
<LinkTag url="https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/ssm-agent.html">SSM Agent の使用</LinkTag>  
AmazonLinuxを除きでオルトではインストールされていない場合はインストールを行う  

### RedhatELへのインストール
<LinkTag url="https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/agent-install-rhel.html">Red Hat Enterprise Linux インスタンスに SSM Agent を手動でインストールする</LinkTag>  

Python 2 または Python 3 のいずれかが RHEL 8 および 9 インスタンスにインストールされていることを確認します  

```
# python --version
```

インストール  

```
# dnf install -y https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm
```

動作確認  

```
# systemctl status amazon-ssm-agent
```

:::info
SSM Agent のバージョン 2.3.50.0 以降、エージェントはマネージドノード上にルートまたは管理者アクセス許可 (ssm-user と呼ばれる) のあるユーザーアカウントを作成します。(2.3.612.0 より前のバージョンでは、SSM Agent が起動または再起動するときにアカウントが作成されます。2.3.612.0 以降のバージョンでは、マネージドノード上でセッションが開始されるときに ssm-user が初めて作成されます) セッションは、このユーザーアカウントの管理者認証情報を使用して起動します。
:::

## SessionManager設定  
EC2への接続手段としてSessionManagerの設定を行う  
<LinkTag url="https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager-getting-started.html">AWS: Session Manager のセットアップ</LinkTag>  

### SessionManager用のセッションデータ暗号化用鍵の作成
<LinkTag url="https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-preferences-enable-encryption.html">セッションデータの KMS キー暗号化を有効にする</LinkTag>  

コンソールからSessionManagerの設定画面を開き、「KMS encryption」のチェックを有効にする  
<img src={require('./assets/sm_ssm01.png').default} width="90%"/>

有効にするとKMSキーの指定を求められるので、ない場合は新規で作成する  
<img src={require('./assets/sm_ssm02.png').default} width="90%"/>

鍵の管理者を設定し、キーの使用法アクセス許可を定義については別途IAMロールで指定する  
作成後元のSessionManager設定画面に戻り、先程作成した鍵を指定して設定を保存する  
<img src={require('./assets/sm_ssm04.png').default} width="90%"/>

### セッションログ保存用S3バケットの作成  
セッションマネージャーログ保存用のバケット、またはフォルダを作成する  
ログを頻繁に見ないのであればライフサイクルを設定できるバケットを指定したほうがよい  

### SessionManager用のIAMロール作成  
<LinkTag url="https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/getting-started-create-iam-instance-profile.html#create-iam-instance-profile-ssn-logging">Session Manager のカスタム IAM ロールを作成</LinkTag>  

カスタムポリシーの作成  
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ssmmessages:CreateControlChannel",
                "ssmmessages:CreateDataChannel",
                "ssmmessages:OpenControlChannel",
                "ssmmessages:OpenDataChannel",
                "ssm:UpdateInstanceInformation"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "logs:DescribeLogGroups",
                "logs:DescribeLogStreams"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::DOC-EXAMPLE-BUCKET/s3-bucket-prefix/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetEncryptionConfiguration"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "kms:Decrypt"
            ],
            "Resource": "key-name"
        },
        {
            "Effect": "Allow",
            "Action": "kms:GenerateDataKey",
            "Resource": "*"
        }
    ]
}
```

作成したポリシーをEC2に設定しているロールに付与する  

### AWS IAMユーザーに対するSSM許可ポリシーの作成
<LinkTag url="https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/getting-started-restrict-access-quickstart.html">Session Manager のクイックスタートのデフォルト IAM ポリシー</LinkTag>  

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ssm:StartSession"
            ],
            "Resource": [
                "arn:aws:ec2:region:account-id:instance/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "ssm:DescribeSessions",
                "ssm:GetConnectionStatus",
                "ssm:DescribeInstanceProperties",
                "ec2:DescribeInstances"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ssm:CreateDocument",
                "ssm:UpdateDocument",
                "ssm:GetDocument"
            ],
            "Resource": "arn:aws:ssm:region:account-id:document/SSM-SessionManagerRunShell"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ssm:TerminateSession",
                "ssm:ResumeSession"
            ],
            "Resource": [
                "arn:aws:ssm:*:*:session/${aws:userid}-*"
            ]
        }
    ]
}
```

すべてのインスタンスに対してすべてのSSM権限を許可する場合は下記でもよい  

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "ssm:StartSession",
                "ssm:TerminateSession",
                "ssm:ResumeSession",
                "ssm:DescribeSessions",
                "ssm:GetConnectionStatus"
            ],
            "Effect": "Allow",
            "Resource": [
                "*"
            ]
        }
    ]
}
```

作成したポリシーをSSMを許可するIAMユーザーに付与する  
※IAMユーザーにすでに強い権限が付与されている場合はスキップ  

### アイドルタイムアウトの設定
<LinkTag url="https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-preferences-timeout.html">アイドルセッションのタイムアウト値を指定します。</LinkTag>  

セッションマネージャーのデフォルトアイドルタイムアウトは20分となっているので必要であれば調整する  

### シェルプロファイルのカスタマイズ  
<LinkTag url="https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-preferences-shell-config.html">アイドルセッションのタイムアウト値を指定</LinkTag>  

SSM利用時のシェルや環境設定必要であれば行う  

### S3 logging設定  
セッションマネージャーの設定画面から  
<img src={require('./assets/sm_ssm05.png').default} width="90%"/>

### セッションマネージャーで利用するOSアカウントの指定
<LinkTag url="https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-preferences-run-as.html">Linux と macOS のマネージドノードで Run As サポートを有効にする</LinkTag>  

デフォルトではSSMAgent導入時に作成される`ssm-user`が利用される、必要であれば指定することが可能  
rootを指定することはできない。  
用途や環境のセキュリティレベルによるが、ec2-user同様、AWSがデフォルトで利用するユーザーから変更することはあまりしないほうが良い印象  
任意のOSアカウントを採用する場合は権限管理やトラブル時に原因切り分けが行えるような設計をする  

### セッションマネージャー経由でのSSH/SCP許可  
<LinkTag url="https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager-getting-started-enable-ssh-connections.html">Session Manager を通して SSH 接続のアクセス許可を有効にして制御する</LinkTag>  

SSM Agent のプラグインをインストール  

<LinkTag url="https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/install-plugin-linux.html">Session Manager プラグインを Red Hat Enterprise Linux ディストリビューションにインストールする</LinkTag>  

```
# dnf install -y https://s3.amazonaws.com/session-manager-downloads/plugin/latest/linux_64bit/session-manager-plugin.rpm
```

ローカルマシンにSSH用Proxyコマンドを設定する  

```
# SSH over Session Manager
host i-* mi-*
    ProxyCommand C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe "aws ssm start-session --target %h --document-name AWS-StartSSHSession --parameters portNumber=%p"
```

## CloudWatchAgentのインストール  
<LinkTag url="https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html">サーバーでの CloudWatch エージェントのインストールおよび実行</LinkTag>  

### インストール
ダウンロードリンクから適切なURLを自身のリージョン状況に変更してインストール  

```
# dnf install -y https://amazoncloudwatch-agent.s3.amazonaws.com/redhat/amd64/latest/amazon-cloudwatch-agent.rpm
```

### CLoudWatchAgent用ポリシーの設定  
<LinkTag url="https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/create-iam-roles-for-cloudwatch-agent-commandline.html">CloudWatch エージェントで使用する IAM ロールとユーザーを作成する</LinkTag>  

EC2に設定したロールに「CloudWatchAgentServerPolicy」ポリシーを付与する  

## SSM クイックセットアップ
各種設定とSystemsManagerとの関連付け、Agentのアップデート管理等を一括登録する  
SysytemsManagerの管理画面から高速セットアップを選択し、関連付けたいインスタンスを指定して実行する  

<img src={require('./assets/sm_ssm06.png').default} width="90%"/>
<img src={require('./assets/sm_ssm07.png').default} width="90%"/>

## SSM接続確認

### コンソールからSSM接続確認  
EC2の接続画面から接続できることを確認  
<img src={require('./assets/sm_ssm08.png').default} width="90%"/>

### ローカルからCLIでの接続確認
ローカルPCからCLIで接続できることを確認  

```
> aws ssm start-session --target <instance id> --profile jsc-dev

Starting session with SessionId: <instance id>
sh-5.1$
```
