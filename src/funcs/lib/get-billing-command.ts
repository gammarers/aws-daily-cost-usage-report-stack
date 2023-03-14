// eslint-disable-next-line import/no-extraneous-dependencies
import { CostExplorerClient, GetCostAndUsageCommand, GetCostAndUsageCommandInput, GetCostAndUsageCommandOutput } from '@aws-sdk/client-cost-explorer';
import { GetDateRange } from './get-date-range';

export interface TotalBilling {
  readonly unit: string;
  readonly amount: number;
}

export class GetTotalBilling {

  constructor(
    private client: CostExplorerClient,
  ) {};

  public execute = async (dateRange: GetDateRange): Promise<TotalBilling | undefined> => {
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
    return this.client.send(new GetCostAndUsageCommand(input))
      .then((data: GetCostAndUsageCommandOutput) => {
        if (data && data.ResultsByTime && data.ResultsByTime.length === 1) {
          const cost = Object(data.ResultsByTime[0]).Total.AmortizedCost;
          const result: TotalBilling = {
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
  };
}

export interface ServiceBilling {
  readonly service: string;
  readonly unit: string;
  readonly amount: number;
}

export class GetServiceBilling {
  constructor(
    private client: CostExplorerClient,
  ) {};

  public execute = async (dateRange: GetDateRange): Promise<ServiceBilling[] | undefined> => {
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
    return this.client.send(new GetCostAndUsageCommand(input))
      .then((data) => {
        const billings: ServiceBilling[] = [];
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
  };
}