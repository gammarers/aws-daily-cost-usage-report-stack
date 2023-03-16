import { CostExplorerClient, GetCostAndUsageCommand } from '@aws-sdk/client-cost-explorer';
import { IncomingWebhook } from '@slack/webhook';
import { Context } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import { handler, MissingEnvironmentVariableError } from '../../src/funcs/cost-reporter.lambda';

describe('Lambda Function Handler testing', () => {

  const ceClientMock = mockClient(CostExplorerClient);

  beforeEach(() => {
    ceClientMock.reset();
  });

  // Slack Webhook mock.
  jest
    .spyOn(IncomingWebhook.prototype, 'send')
    .mockImplementation();

  describe('Not beginning of the month...', () => {
    beforeEach(() => {
      Date.now = jest.fn(() => new Date(2023, 1, 23, 2, 2, 2).getTime());
    });

    describe('Lambda Function handler', () => {
      it('Should client succeed', async () => {

        ceClientMock
          .on(GetCostAndUsageCommand, {
            TimePeriod: {
              Start: '2023-02-01',
              End: '2023-02-22',
            },
            Granularity: 'MONTHLY',
            Metrics: [
              'AMORTIZED_COST',
            ],
          })
          .resolves({
            $metadata: {
              httpStatusCode: 200,
            },
            ResultsByTime: [
              {
                Estimated: true,
                Groups: [],
                TimePeriod: {
                  Start: '2023-02-01',
                  End: '2023-02-22',
                },
                Total: {
                  AmortizedCost: {
                    Amount: '1.23456',
                    Unit: 'USD',
                  },
                },
              },
            ],
          })
          .on(GetCostAndUsageCommand, {
            TimePeriod: {
              Start: '2023-02-01',
              End: '2023-02-22',
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
          })
          .resolves({
            $metadata: {
              httpStatusCode: 200,
            },
            ResultsByTime: [
              {
                Estimated: false,
                TimePeriod: {
                  End: '2023-02-28',
                  Start: '2023-02-01',
                },
                Total: {},
                Groups: [
                  {
                    Keys: [
                      'AWS CloudTrail',
                    ],
                    Metrics: {
                      AmortizedCost: {
                        Amount: '0',
                        Unit: 'USD',
                      },
                    },
                  },
                  {
                    Keys: [
                      'AWS Config',
                    ],
                    Metrics: {
                      AmortizedCost: {
                        Amount: '0.012',
                        Unit: 'USD',
                      },
                    },
                  },
                  {
                    Keys: [
                      'Tax',
                    ],
                    Metrics: {
                      AmortizedCost: {
                        Amount: '1.39',
                        Unit: 'USD',
                      },
                    },
                  },
                ],

              },
            ],
          });

        process.env = {
          SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/xxxxxxxxxx',
          SLACK_POST_CHANNEL: 'example-channel',
        };
        const result = await handler({ Type: 'Services' }, {} as Context);

        expect(result).toEqual('OK');
      });

      it('Should client error', async () => {
        ceClientMock
          .on(GetCostAndUsageCommand, {
            TimePeriod: {
              Start: '2023-02-01',
              End: '2023-02-22',
            },
            Granularity: 'MONTHLY',
            Metrics: [
              'AMORTIZED_COST',
            ],
          })
          .rejects()
          .on(GetCostAndUsageCommand, {
            TimePeriod: {
              Start: '2023-02-01',
              End: '2023-02-22',
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
          })
          .rejects();

        process.env = {
          SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/xxxxxxxxxx',
          SLACK_POST_CHANNEL: 'example-channel',
        };
        const result = await handler({ Type: 'Services' }, {} as Context);

        expect(result).toEqual('OK');
      });
    });

    it('Should client unknown response', async () => {
      ceClientMock
        .on(GetCostAndUsageCommand, {
          TimePeriod: {
            Start: '2023-02-01',
            End: '2023-02-22',
          },
          Granularity: 'MONTHLY',
          Metrics: [
            'AMORTIZED_COST',
          ],
        })
        .resolves({
          $metadata: {
            httpStatusCode: 200,
          },
        })
        .on(GetCostAndUsageCommand, {
          TimePeriod: {
            Start: '2023-02-01',
            End: '2023-02-22',
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
        })
        .resolves({
          $metadata: {
            httpStatusCode: 200,
          },
        });

      process.env = {
        SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/xxxxxxxxxx',
        SLACK_POST_CHANNEL: 'example-channel',
      };
      const result = await handler({ Type: 'Services' }, {} as Context);

      expect(result).toEqual('OK');
    });

  });

  describe('Beginning of the month...', () => {
    beforeEach(() => {
      Date.now = jest.fn(() => new Date(2023, 1, 1, 2, 2, 2).getTime());
    });

    describe('Lambda Function handler', () => {
      it('Should client succeed', async () => {

        ceClientMock
          .on(GetCostAndUsageCommand, {
            TimePeriod: {
              Start: '2023-01-01',
              End: '2023-01-31',
            },
            Granularity: 'MONTHLY',
            Metrics: [
              'AMORTIZED_COST',
            ],
          })
          .resolves({
            $metadata: {
              httpStatusCode: 200,
            },
            ResultsByTime: [
              {
                Estimated: true,
                Groups: [],
                TimePeriod: {
                  Start: '2023-02-01',
                  End: '2023-02-22',
                },
                Total: {
                  AmortizedCost: {
                    Amount: '1.23456',
                    Unit: 'USD',
                  },
                },
              },
            ],
          })
          .on(GetCostAndUsageCommand, {
            TimePeriod: {
              Start: '2023-01-01',
              End: '2023-01-31',
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
          })
          .resolves({
            $metadata: {
              httpStatusCode: 200,
            },
            ResultsByTime: [
              {
                Estimated: false,
                TimePeriod: {
                  End: '2023-02-28',
                  Start: '2023-02-01',
                },
                Total: {},
                Groups: [
                  {
                    Keys: [
                      'AWS CloudTrail',
                    ],
                    Metrics: {
                      AmortizedCost: {
                        Amount: '0',
                        Unit: 'USD',
                      },
                    },
                  },
                  {
                    Keys: [
                      'AWS Config',
                    ],
                    Metrics: {
                      AmortizedCost: {
                        Amount: '0.012',
                        Unit: 'USD',
                      },
                    },
                  },
                  {
                    Keys: [
                      'Tax',
                    ],
                    Metrics: {
                      AmortizedCost: {
                        Amount: '1.39',
                        Unit: 'USD',
                      },
                    },
                  },
                ],

              },
            ],
          });

        process.env = {
          SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/xxxxxxxxxx',
          SLACK_POST_CHANNEL: 'example-channel',
        };
        const result = await handler({ Type: 'Services' }, {} as Context);

        expect(result).toEqual('OK');
      });

    });

  });

  describe('Error handling', () => {
    describe('Should Environment Variable Error handling', () => {
      it('Should error cause EnvironmentVariableError(SLACK_WEBHOOK_URL)', async () => {
        process.env = {
          SLACK_POST_CHANNEL: 'example-channel',
        };
        await expect(handler({ Type: 'Services' }, {} as Context)).rejects.toThrow(MissingEnvironmentVariableError);
      });
      it('Should error cause EnvironmentVariableError(SLACK_POST_CHANNEL)', async () => {
        process.env = {
          SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/xxxxxxxxxx',
        };
        await expect(handler({ Type: 'Services' }, {} as Context)).rejects.toThrow(MissingEnvironmentVariableError);
      });
    });
  });
});