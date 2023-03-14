import * as crypto from 'crypto';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { CostReporterFunction } from './funcs/cost-reporter-function';

export interface DailyCostUsageReporterProps {
  readonly slackWebhookUrl: string;
  readonly slackPostChannel: string;
}

export class DailyCostUsageReporter extends Construct {
  constructor(scope: Construct, id: string, props: DailyCostUsageReporterProps) {
    super(scope, id);

    // 👇Get current account & region
    // const account = cdk.Stack.of(this).account;
    // const region = cdk.Stack.of(this).region;

    // 👇Create random key
    const randomNameKey = crypto.createHash('shake256', { outputLength: 4 })
      .update(`${cdk.Names.uniqueId(scope)}-${cdk.Names.uniqueId(this)}`)
      .digest('hex');

    // 👇Lambda Exec Role
    const lambdaExecutionRole = new iam.Role(this, 'LambdaExecutionRole', {
      roleName: `cost-report-lambda-exec-${randomNameKey}-role`,
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
    //const lambdaFunction =
    new CostReporterFunction(this, 'CostReporterFunction', {
      functionName: `cost-report-${randomNameKey}-func`,
      description: 'A function to archive logs s3 bucket from CloudWatch Logs.',
      environment: {
        //BUCKET_NAME: logArchiveBucket.bucketName,
        SLACK_WEBHOOK_URL: props.slackWebhookUrl,
        SLACK_POST_CHANNEL: props.slackPostChannel,
      },
      role: lambdaExecutionRole,
    });

    // 👇Schedule

  }

}