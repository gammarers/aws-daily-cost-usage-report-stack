import { CostExplorerClient, GetCostAndUsageCommand } from '@aws-sdk/client-cost-explorer';
import { IncomingWebhook } from '@slack/webhook';
import { Context } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import { handler, MissingEnvironmentVariableError, MissingInputVariableError, InvalidInputVariableError, EventInputType } from '../../src/funcs/cost-reporter.lambda';

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
      describe('Event Input Type = Services', () => {
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
              NextPageToken: 'XXXxxXXXxxXXXxxXXXxxXXXxxXXXxxXXXxxXXXxx',
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
                  ],
                },
              ],
            })
            .on(GetCostAndUsageCommand, {
              NextPageToken: 'XXXxxXXXxxXXXxxXXXxxXXXxxXXXxxXXXxxXXXxx',
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
          const result = await handler({ Type: EventInputType.SERVICES }, {} as Context);

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
          const result = await handler({ Type: EventInputType.SERVICES }, {} as Context);

          expect(result).toEqual('OK');
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
          const result = await handler({ Type: EventInputType.SERVICES }, {} as Context);

          expect(result).toEqual('OK');
        });
      });

      describe('Event Input Type = Accounts', () => {
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
                  Key: 'LINKED_ACCOUNT',
                },
              ],
            })
            .resolves({
              $metadata: {
                httpStatusCode: 200,
              },
              NextPageToken: 'XXXxxXXXxxXXXxxXXXxxXXXxxXXXxxXXXxxXXXxx',
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
                        '111111111111',
                      ],
                      Metrics: {
                        AmortizedCost: {
                          Amount: '67.4724468979',
                          Unit: 'USD',
                        },
                      },
                    },
                    {
                      Keys: [
                        '222222222222',
                      ],
                      Metrics: {
                        AmortizedCost: {
                          Amount: '6.8423283327',
                          Unit: 'USD',
                        },
                      },
                    },
                    {
                      Keys: [
                        '333333333333',
                      ],
                      Metrics: {
                        AmortizedCost: {
                          Amount: '7.1233988094',
                          Unit: 'USD',
                        },
                      },
                    },
                  ],
                },
              ],
              DimensionValueAttributes: [
                {
                  Value: '111111111111',
                  Attributes: {
                    description: 'Example System 1A',
                  },
                },
                {
                  Value: '222222222222',
                  Attributes: {
                    description: 'Example System 2A',
                  },
                },
                {
                  Value: '333333333333',
                  Attributes: {
                    description: 'Example System 3A',
                  },
                },
              ],
            })
            .on(GetCostAndUsageCommand, {
              NextPageToken: 'XXXxxXXXxxXXXxxXXXxxXXXxxXXXxxXXXxxXXXxx',
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
                  Key: 'LINKED_ACCOUNT',
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
                        '444444444444',
                      ],
                      Metrics: {
                        AmortizedCost: {
                          Amount: '0.4724468979',
                          Unit: 'USD',
                        },
                      },
                    },
                  ],
                },
              ],
              DimensionValueAttributes: [
                {
                  Value: '444444444444',
                  Attributes: {
                    description: 'Example System 4A',
                  },
                },
              ],
            });

          process.env = {
            SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/xxxxxxxxxx',
            SLACK_POST_CHANNEL: 'example-channel',
          };
          const result = await handler({ Type: EventInputType.ACCOUNTS }, {} as Context);

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
                  Key: 'LINKED_ACCOUNT',
                },
              ],
            })
            .rejects();

          process.env = {
            SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/xxxxxxxxxx',
            SLACK_POST_CHANNEL: 'example-channel',
          };
          const result = await handler({ Type: EventInputType.ACCOUNTS }, {} as Context);

          expect(result).toEqual('OK');
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
          const result = await handler({ Type: EventInputType.ACCOUNTS }, {} as Context);

          expect(result).toEqual('OK');
        });
      });
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
        const result = await handler({ Type: EventInputType.SERVICES }, {} as Context);

        expect(result).toEqual('OK');
      });

    });

  });

  describe('Error handling', () => {
    describe('Should Environment Variable Error handling', () => {
      it('Should error cause MissingEnvironmentVariableError(SLACK_WEBHOOK_URL)', async () => {
        process.env = {
          SLACK_POST_CHANNEL: 'example-channel',
        };
        await expect(handler({ Type: EventInputType.SERVICES }, {} as Context)).rejects.toThrow(MissingEnvironmentVariableError);
      });
      it('Should error cause MissingEnvironmentVariableError(SLACK_POST_CHANNEL)', async () => {
        process.env = {
          SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/xxxxxxxxxx',
        };
        await expect(handler({ Type: EventInputType.SERVICES }, {} as Context)).rejects.toThrow(MissingEnvironmentVariableError);
      });
    });
    describe('Should Event Input Variable Error handling', () => {
      it('Should error cause MissingInputVariableError(Type)', async () => {
        process.env = {
          SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/xxxxxxxxxx',
          SLACK_POST_CHANNEL: 'example-channel',
        };
        await expect(handler({ Type: '' as EventInputType }, {} as Context)).rejects.toThrow(MissingInputVariableError);
      });
      it('Should error cause InvalidInputVariableError(Type)', async () => {
        process.env = {
          SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/xxxxxxxxxx',
          SLACK_POST_CHANNEL: 'example-channel',
        };
        await expect(handler({ Type: 'Miss' as EventInputType }, {} as Context)).rejects.toThrow(InvalidInputVariableError);
      });
    });
  });
});