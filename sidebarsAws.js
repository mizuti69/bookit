module.exports = {
  aws: {
    "AWS": [
      'aws/index',
      {
        type: 'category',
        label: 'SystemsManager',
        items: [
          "aws/sm_ssm",
        ],
      },
      {
        type: 'category',
        label: 'CloudWatch',
        items: [
          "aws/cloudwatch_collectd",
        ],
      },
      {
        type: 'category',
        label: 'EventBridge',
        items: [
          "aws/eventbridge_ec2stop",
        ],
      },
      {
        type: 'category',
        label: 'Glue',
        items: [
          "aws/glue_lake",
          "aws/glue_bookmark",
          "aws/glue_workflow",
        ],
      },
    ], 
  },
};
