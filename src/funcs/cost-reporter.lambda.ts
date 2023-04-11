import { CostExplorerClient } from '@aws-sdk/client-cost-explorer';
import { WebClient } from '@slack/web-api';
import { MissingEnvironmentVariableError, MissingInputVariableError, InvalidInputVariableFormatError } from '@yicr/aws-lambda-errors';
import { Context } from 'aws-lambda';
import { GetAccountBillings, GetServiceBilling, GetTotalBilling } from './lib/get-billing-command';
import { GetDateRange } from './lib/get-date-range';

export interface EventInput {
  readonly Type: EventInputType;
}

export enum EventInputType {
  ACCOUNTS = 'Accounts',
  SERVICES = 'Services',
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
  if (!process.env.SLACK_TOKEN) {
    throw new MissingEnvironmentVariableError('missing environment variable SLACK_TOKEN.');
  }
  if (!process.env.SLACK_CHANNEL) {
    throw new MissingEnvironmentVariableError('missing environment variable SLACK_CHANNEL.');
  }
  if (!event.Type) {
    throw new MissingInputVariableError('missing input variable Type');
  } else {
    if (!Object.values(EventInputType).includes(event.Type)) {
      throw new InvalidInputVariableFormatError('invalid input variable format is Accounts or Services.');
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
      case EventInputType.ACCOUNTS:
        // 👇Get Accounts Billings
        const accountBillings = await (new GetAccountBillings(ceClient).execute(dateRange));
        console.log(`AccountBillings: ${JSON.stringify(accountBillings, null, 2)}`);
        return accountBillings?.map((value) => {
          return {
            title: value.account,
            value: `${value.amount} ${value.unit}`,
          };
        });
      case EventInputType.SERVICES:
        // 👇Get Service Billings
        const serviceBillings = await (new GetServiceBilling(ceClient)).execute(dateRange);
        console.log(`ServiceBilling: ${JSON.stringify(serviceBillings, null, 2)}`);
        return serviceBillings?.map((value) => {
          return {
            title: value.service,
            value: `${value.amount} ${value.unit}`,
          };
        });
    }
  })();

  const client = new WebClient(process.env.SLACK_TOKEN);

  const channel = process.env.SLACK_CHANNEL;

  // Send the notification
  await (async () => {
    const result = await client.chat.postMessage({
      channel,
      icon_emoji: ':money-with-wings:',
      text: `AWS Cost Reports (${dateRange.start} - ${dateRange.end})`,
      attachments: [
        {
          title: ':moneybag: Total',
          text: `${totalBilling?.amount} ${totalBilling?.unit}`,
          color: '#ff8c00',
        },
      ],
    });
    if (result.ok) {
      await client.chat.postMessage({
        channel,
        thread_ts: result.ts,
        attachments: [
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
    }
  })();

  return 'OK';
};

