import { CostExplorerClient } from '@aws-sdk/client-cost-explorer';
import { IncomingWebhook } from '@slack/webhook';
import { Context } from 'aws-lambda';
import { GetAccountBillings, GetServiceBilling, GetTotalBilling } from './lib/get-billing-command';
import { GetDateRange } from './lib/get-date-range';

export class MissingEnvironmentVariableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MissingEnvironmentVariableError';
  }
}

export class MissingInputVariableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MissingInputVariableError';
  }
}

export class InvalidInputVariableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidInputVariableError';
  }
}

export interface EventInput {
  readonly Type: string;
}

export interface MessageAttachmentField {
  readonly title: string;
  readonly value: string;
}

const ceClient = new CostExplorerClient({
  region: 'us-east-1',
});

export const handler = async (event: EventInput, context: Context): Promise<string | Error> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  // do validation
  if (!process.env.SLACK_WEBHOOK_URL) {
    throw new MissingEnvironmentVariableError('missing environment variable SLACK_WEBHOOK_URL.');
  }
  if (!process.env.SLACK_POST_CHANNEL) {
    throw new MissingEnvironmentVariableError('missing environment variable SLACK_POST_CHANNEL.');
  }
  if (!event.Type) {
    throw new MissingInputVariableError('missing input variable Type');
  } else {
    if (!Array('Accounts', 'Services').includes(event.Type)) {
      throw new InvalidInputVariableError('invalid input variable Type is Account or Service.');
    }
  }

  // 👇Calculate Date Range
  const dateRange = new GetDateRange();
  console.log(`DateRange::${JSON.stringify(dateRange, null, 2)}`);

  // 👇Get Total Billing
  const totalBilling = await (new GetTotalBilling(ceClient)).execute(dateRange);
  console.log(`TotalBilling: ${JSON.stringify(totalBilling, null, 2)}`);

  const fields: MessageAttachmentField[] | undefined = await (async () => {
    switch (event.Type) {
      case 'Accounts':
        const accountBillings = await (new GetAccountBillings(ceClient).execute(dateRange));
        console.log(`AccountBillings: ${JSON.stringify(accountBillings, null, 2)}`);
        return accountBillings?.map((value) => {
          return {
            title: value.account,
            value: `${value.amount} ${value.unit}`,
          };
        });
      case 'Services':
        // 👇Get Service Billings
        const serviceBillings = await (new GetServiceBilling(ceClient)).execute(dateRange);
        console.log(`ServiceBilling: ${JSON.stringify(serviceBillings, null, 2)}`);
        return serviceBillings?.map((value) => {
          return {
            title: value.service,
            value: `${value.amount} ${value.unit}`,
          };
        });
      default:
        return undefined;
    }
  })();

  const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL, {
    icon_emoji: ':money-with-wings:',
    channel: process.env.SLACK_POST_CHANNEL,
  });

  // Send the notification
  await (async () => {
    await webhook.send({
      icon_emoji: ':money-with-wings:',
      text: `AWS Cost Reports (${dateRange.start} - ${dateRange.end})`,
      attachments: [
        {
          title: ':moneybag: Total',
          text: `${totalBilling?.amount} ${totalBilling?.unit}`,
          color: '#ff8c00',
        },
        {
          color: '#ffd700',
          fields: fields?.map((filed) => {
            return {
              title: `:aws: ${filed.title}`,
              value: filed.value,
              short: false,
            };
          }),
        },
      ],
    });
  })();

  return 'OK';
};

