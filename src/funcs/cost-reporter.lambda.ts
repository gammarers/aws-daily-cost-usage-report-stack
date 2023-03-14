import { CostExplorerClient } from '@aws-sdk/client-cost-explorer';
import { IncomingWebhook } from '@slack/webhook';
import { Context } from 'aws-lambda';
import { GetServiceBilling, GetTotalBilling } from './lib/get-billing-command';
import { GetDateRange } from './lib/get-date-range';

export class MissingEnvironmentVariableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MissingEnvironmentVariableError';
  }
}

export interface EventInput {
}

const ceClient = new CostExplorerClient({
  region: 'us-east-1',
});

export const handler = async (event: EventInput, context: Context): Promise<string | Error> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  // do validation
  if (!process.env.SLACK_WEBHOOK_URL) {
    throw new MissingEnvironmentVariableError('missing environment variable SLACK_WEBHOOK_URL en.');
  }
  if (!process.env.SLACK_POST_CHANNEL) {
    throw new MissingEnvironmentVariableError('missing environment variable SLACK_POST_CHANNEL environment variable not set.');
  }

  // 👇Calculate Date Range
  const dateRange = new GetDateRange();
  console.log(`DateRange::${JSON.stringify(dateRange, null, 2)}`);

  // 👇Get Total Billing
  const totalBilling = await (new GetTotalBilling(ceClient)).execute(dateRange);

  // 👇Get Service Billings
  const serviceBillings = await (new GetServiceBilling(ceClient)).execute(dateRange);

  console.log(`TotalBilling: ${JSON.stringify(totalBilling, null, 2)}`);
  console.log(`ServiceBilling: ${JSON.stringify(serviceBillings, null, 2)}`);

  const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL, {
    icon_emoji: ':money-with-wings:',
    channel: process.env.SLACK_POST_CHANNEL,
  });

  // Send the notification
  await (async () => {
    await webhook.send({
      icon_emoji: ':money-with-wings:',
      text: `AWS Cost Reports (${dateRange.start} - ${dateRange.end})`,
      attachments: [{
        title: 'Total',
        text: `${totalBilling?.amount} ${totalBilling?.unit}`,
        fields: serviceBillings?.map((value) => {
          return {
            title: value.service,
            value: `${value.amount} ${value.unit}`,
            short: false,
          };
        }),
      }],
    });
  })();

  return 'OK';
};

