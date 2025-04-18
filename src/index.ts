import { Duration, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import { Construct } from 'constructs';
import { CostReporterFunction } from './funcs/cost-reporter-function';

export interface DailyCostUsageReportStackProps {
  readonly slackToken: string;
  readonly slackChannel: string;
  readonly scheduleTimezone?: string;
  readonly costGroupType: CostGroupType;
}

export enum CostGroupType {
  ACCOUNTS = 'Accounts',
  SERVICES = 'Services',
}

export class DailyCostUsageReportStack extends Stack {
  constructor(scope: Construct, id: string, props: DailyCostUsageReportStackProps) {
    super(scope, id);

    // 👇Get current account & region
    // const account = Stack.of(this).account;
    // const region = cdk.Stack.of(this).region;

    // 👇Lambda Exec Role
    const lambdaExecutionRole = new iam.Role(this, 'LambdaExecutionRole', {
      roleName: undefined,
      description: '',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
      inlinePolicies: {
        ['get-cost-usage']: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'ce:GetCostAndUsage',
              ],
              resources: ['*'],
            }),
          ],
        }),
      },
    });

    // 👇Lambda Function
    const lambdaFunction = new CostReporterFunction(this, 'CostReporterFunction', {
      functionName: undefined,
      description: 'A function to archive logs s3 bucket from CloudWatch Logs.',
      environment: {
        //BUCKET_NAME: logArchiveBucket.bucketName,
        SLACK_TOKEN: props.slackToken,
        SLACK_CHANNEL: props.slackChannel,
      },
      role: lambdaExecutionRole,
      timeout: Duration.seconds(45),
    });

    // 👇EventBridge Scheduler IAM Role
    const schedulerExecutionRole = new iam.Role(this, 'SchedulerExecutionRole', {
      roleName: undefined,
      assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
      inlinePolicies: {
        ['lambda-invoke-policy']: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'lambda:InvokeFunction',
              ],
              resources: [
                lambdaFunction.functionArn,
                `${lambdaFunction.functionArn}:*`,
              ],
            }),
          ],
        }),
      },
    });

    // 👇Schedule
    new scheduler.CfnSchedule(this, 'Schedule', {
      name: undefined,
      description: 'aws account const reports.',
      state: 'ENABLED',
      //groupName: scheduleGroup.name, // default
      flexibleTimeWindow: {
        mode: 'OFF',
      },
      scheduleExpressionTimezone: props.scheduleTimezone ?? 'UTC',
      scheduleExpression: 'cron(1 9 * * ? *)',
      target: {
        arn: lambdaFunction.functionArn,
        roleArn: schedulerExecutionRole.roleArn,
        input: JSON.stringify({ Type: props.costGroupType }),
        retryPolicy: {
          maximumEventAgeInSeconds: 60,
          maximumRetryAttempts: 0,
        },
      },
    });
  }

}