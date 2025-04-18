# AWS Daily Cost Usage Report Stack

AWS Cost And Usage report to Slack on daily 09:01.
- Report type
  - Services
    - This is Cost by AWS Services.
  - Accounts
    - This is Cost by Linked Account (when organization master account)

## Resources

This construct creating resource list.

- Lambda function execution role
- Lambda function
- EventBridge Scheduler execution role
- EventBridge Scheduler

## Install

### TypeScript

#### use by npm

```shell
npm install @gammarers/aws-daily-cost-usage-repote-stack
```

#### use by yarn

```shell
yarn add @gammarers/aws-daily-cost-usage-repote-stack
```

### Python

```shell
pip install gammarer.aws-daily-cost-usage-repote-stack
```

## Example

```shell
npm install @gammarers/aws-daily-cost-usage-repote-stack
```

```typescript
import { CostGroupType, DailyCostUsageReportStack } from '@gammarer/aws-daily-cost-usage-repote-stack';

new DailyCostUsageReportStack(app, 'DailyCostUsageReportStack', {
  slackToken: 'xoxb-11111111111-XXXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX',
  slackChannel: 'example-channel',
  costGroupType: CostGroupType.SERVICES,
});

```

## License

This project is licensed under the Apache-2.0 License.



