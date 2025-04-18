import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { CostGroupType, DailyCostUsageReportStack } from '../src';

describe('CostUsageReports Construct Testing', () => {

  describe('CostUsageReport Construct Normal(only required arguments) Testing', () => {

    const app = new App();

    const stack = new DailyCostUsageReportStack(app, 'DailyCostUsageReportStack', {
      slackToken: 'xoxb-11111111111-XXXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX',
      slackChannel: 'example-channel',
      costGroupType: CostGroupType.SERVICES,
    });

    const template = Template.fromStack(stack);

    describe('Lambda Testing', () => {

      it('Should have lambda execution role', () => {
        template.hasResourceProperties('AWS::IAM::Role', Match.objectEquals({
          RoleName: Match.stringLikeRegexp('cost-report-lambda-exec-.*-role'),
          AssumeRolePolicyDocument: Match.objectEquals({
            Version: '2012-10-17',
            Statement: Match.arrayWith([
              Match.objectEquals({
                Effect: 'Allow',
                Principal: {
                  Service: 'lambda.amazonaws.com',
                },
                Action: 'sts:AssumeRole',
              }),
            ]),
          }),
          ManagedPolicyArns: Match.arrayWith([
            {
              'Fn::Join': Match.arrayEquals([
                '',
                Match.arrayEquals([
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                ]),
              ]),
            },
          ]),
          Policies: Match.arrayEquals([
            {
              PolicyName: 'get-cost-usage',
              PolicyDocument: Match.objectEquals({
                Version: '2012-10-17',
                Statement: [
                  Match.objectEquals({
                    Effect: 'Allow',
                    Action: 'ce:GetCostAndUsage',
                    Resource: '*',
                  }),
                ],
              }),
            },
          ]),
        }));
      });

      it('Should have lambda function', () => {
        template.hasResourceProperties('AWS::Lambda::Function', Match.objectEquals({
          FunctionName: Match.stringLikeRegexp('cost-report-.*-func'),
          Handler: 'index.handler',
          Runtime: 'nodejs20.x',
          Timeout: 45,
          Code: {
            S3Bucket: Match.anyValue(),
            S3Key: Match.stringLikeRegexp('.*.zip'),
          },
          Description: Match.anyValue(),
          Environment: {
            Variables: {
              AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
              SLACK_TOKEN: Match.anyValue(),
              SLACK_CHANNEL: Match.anyValue(),
            },
          },
          Role: {
            'Fn::GetAtt': [
              Match.stringLikeRegexp('LambdaExecutionRole'),
              'Arn',
            ],
          },
        }));
      });
    });

    // Schedule testing
    it('Should have Schedule', () => {
      template.hasResourceProperties('AWS::Scheduler::Schedule', Match.objectEquals({
        Name: Match.stringLikeRegexp('daily-cost-report-.*-schedule'),
        Description: Match.anyValue(),
        State: 'ENABLED',
        FlexibleTimeWindow: {
          Mode: 'OFF',
        },
        ScheduleExpressionTimezone: 'UTC',
        ScheduleExpression: 'cron(1 9 * * ? *)',
        Target: Match.objectEquals({
          Arn: {
            'Fn::GetAtt': [
              Match.stringLikeRegexp('CostReporterFunction'),
              'Arn',
            ],
          },
          RoleArn: {
            'Fn::GetAtt': [
              Match.stringLikeRegexp('SchedulerExecutionRole'),
              'Arn',
            ],
          },
          Input: Match.stringLikeRegexp('{"Type":"(Accounts|Services)"}'),
          RetryPolicy: {
            MaximumEventAgeInSeconds: 60,
            MaximumRetryAttempts: 0,
          },
        }),
      }));
      template.resourceCountIs('AWS::Scheduler::Schedule', 1);
    });

    it('Should match snapshot', () => {
      expect(template.toJSON()).toMatchSnapshot('report');
    });
  });

  describe('CostUsageReport Construct Normal(all arguments) Testing', () => {

    const app = new App();

    const stack = new DailyCostUsageReportStack(app, 'DailyCostUsageReportStack', {
      costGroupType: CostGroupType.SERVICES,
      slackToken: 'xoxb-11111111111-XXXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX',
      slackChannel: 'example-channel',
      scheduleTimezone: 'Asia/Tokyo',
    });

    const template = Template.fromStack(stack);

    it('Should have Schedule', () => {
      template.hasResourceProperties('AWS::Scheduler::Schedule', Match.objectEquals({
        Name: Match.stringLikeRegexp('daily-cost-report-.*-schedule'),
        Description: Match.anyValue(),
        State: 'ENABLED',
        FlexibleTimeWindow: {
          Mode: 'OFF',
        },
        ScheduleExpressionTimezone: 'Asia/Tokyo',
        ScheduleExpression: 'cron(1 9 * * ? *)',
        Target: Match.objectEquals({
          Arn: {
            'Fn::GetAtt': [
              Match.stringLikeRegexp('CostReporterFunction.'),
              'Arn',
            ],
          },
          RoleArn: {
            'Fn::GetAtt': [
              Match.stringLikeRegexp('SchedulerExecutionRole.*'),
              'Arn',
            ],
          },
          Input: Match.stringLikeRegexp('{"Type":"(Accounts|Services)"}'),
          RetryPolicy: {
            MaximumEventAgeInSeconds: 60,
            MaximumRetryAttempts: 0,
          },
        }),
      }));
      template.resourceCountIs('AWS::Scheduler::Schedule', 1);
    });

    it('Should match snapshot', () => {
      expect(template.toJSON()).toMatchSnapshot('report-timezone');
    });
  });
});