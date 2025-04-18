import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { CostGroupType, DailyCostUsageReportStack } from '../src';

describe('Stack specific(all arguments) Testing', () => {

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
      // Name: Match.stringLikeRegexp('daily-cost-report-.*-schedule'),
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
    expect(template.toJSON()).toMatchSnapshot();
  });
});