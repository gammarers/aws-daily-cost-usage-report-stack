import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { DailyCostUsageReporter } from '../src';

describe('CostUsageReports Testing', () => {

  const app = new App();
  const stack = new Stack(app, 'TestingStack', {
    env: {
      account: '123456789012',
      region: 'us-east-1',
    },
  });

  new DailyCostUsageReporter(stack, 'DailyCostUsageReporter');

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
        Runtime: 'nodejs18.x',
        Code: {
          S3Bucket: Match.anyValue(),
          S3Key: Match.stringLikeRegexp('.*.zip'),
        },
        Description: Match.anyValue(),
        Environment: {
          Variables: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
          },
        },
        Role: {
          'Fn::GetAtt': [
            Match.stringLikeRegexp('DailyCostUsageReporterLambdaExecutionRole.*'),
            'Arn',
          ],
        },
      }));
    });
  });

  // Schedule testing

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot('report');
  });
});