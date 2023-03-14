import {
  CostExplorerClient,
  GetCostAndUsageCommand,
  GetCostAndUsageCommandInput,
  GetCostAndUsageCommandOutput,
} from '@aws-sdk/client-cost-explorer';
import { IncomingWebhook } from '@slack/webhook';
import { Context } from 'aws-lambda';

export class EnvironmentVariableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvironmentVariableError';
  }
}

export interface EventInput {
}

interface DateRange {
  readonly start: string;
  readonly end: string;
}

export interface TotalCost {
  readonly unit: string;
  readonly amount: number;
}

export interface ServiceCost {
  readonly service: string;
  readonly unit: string;
  readonly amount: number;
}

const ceClient = new CostExplorerClient({
  region: 'us-east-1',
});

export const handler = async (event: EventInput, context: Context): Promise<string | Error> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  // do validation
  if (!process.env.SLACK_WEBHOOK_URL) {
    throw new EnvironmentVariableError('SLACK_WEBHOOK_URL environment variable not set.');
  }
  if (!process.env.SLACK_POST_CHANNEL) {
    throw new EnvironmentVariableError('SLACK_POST_CHANNEL environment variable not set.');
  }

  // 👇Calculate Date Range
  const dateRange: DateRange = (() => {
    const dateFormatString = (date: Date): string => {
      return (date.getFullYear()) + '-' + ('00' + (date.getMonth() + 1)).slice(-2) + '-' + ('00' + (date.getDate())).slice(-2);
    };

    const now = new Date(Date.now());
    if (now.getDate() === 1) {
      // Last month
      return {
        start: dateFormatString(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
        end: dateFormatString(new Date(now.getFullYear(), now.getMonth(), 0)),
      };
    }

    return {
      start: dateFormatString(new Date(now.getFullYear(), now.getMonth(), 1)),
      end: dateFormatString(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)),
    };
  })();
  console.log(`DateRange::${JSON.stringify(dateRange, null, 2)}`);

  // 👇Get Total Billing
  const totalBilling: TotalCost | undefined = await (async () => {
    const input: GetCostAndUsageCommandInput = {
      TimePeriod: {
        Start: dateRange.start,
        End: dateRange.end,
      },
      Granularity: 'MONTHLY',
      Metrics: [
        'AMORTIZED_COST',
      ],
    };
    console.log(`TotalBilling:Command:Input:${JSON.stringify(input)}`);
    return ceClient.send(new GetCostAndUsageCommand(input))
      .then((data: GetCostAndUsageCommandOutput) => {
        if (data && data.ResultsByTime && data.ResultsByTime.length === 1) {
          const cost = Object(data.ResultsByTime[0]).Total.AmortizedCost;
          const result: TotalCost = {
            unit: cost.Unit,
            amount: cost.Amount,
          };
          console.log(`TotalBilling:Command:Output(Shaped):${JSON.stringify(result)}`);
          return result;
        }
        return undefined;
      })
      .catch((error) => {
        console.log('Error caught...');
        console.log(`Error:${JSON.stringify(error)}`);
        return undefined;
      });
  })();

  // 👇Get Service Billings
  const serviceBillings: ServiceCost[] | undefined = await (async () => {
    const input: GetCostAndUsageCommandInput = {
      TimePeriod: {
        Start: dateRange.start,
        End: dateRange.end,
      },
      Granularity: 'MONTHLY',
      Metrics: [
        'AMORTIZED_COST',
      ],
      GroupBy: [
        {
          Type: 'DIMENSION',
          Key: 'SERVICE',
        },
      ],
    };
    console.log(`ServiceBillings:Command:Input:${JSON.stringify(input)}`);
    return ceClient.send(new GetCostAndUsageCommand(input))
      .then((data) => {
        const billings: ServiceCost[] = [];
        if (data.ResultsByTime && data.ResultsByTime.length === 1) {
          for (const item of Object(data.ResultsByTime[0]).Groups) {
            billings.push({
              service: item.Keys[0],
              unit: item.Metrics.AmortizedCost.Unit,
              amount: item.Metrics.AmortizedCost.Amount,
            });
          }
          console.log(`ServiceBillings:Command:Output(Shaped):${JSON.stringify(billings)}`);
          return billings;
        }
        return undefined;
      })
      .catch((error) => {
        console.log('Error caught...');
        console.log(`Error:${JSON.stringify(error)}`);
        return undefined;
      });
  })();

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

