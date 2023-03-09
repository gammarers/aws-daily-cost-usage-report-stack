import { CostExplorerClient, GetCostAndUsageCommand } from '@aws-sdk/client-cost-explorer';
import { Context } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../../src/funcs/cost-reporter.lambda';

describe('Lambda Function Handler testing', () => {

  const ceClientMock = mockClient(CostExplorerClient);

  beforeEach(() => {
    ceClientMock.reset();
  });

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
          //BUCKET_NAME: 'example-bucket',
        };
        const result = await handler({}, {} as Context);

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
          //BUCKET_NAME: 'example-bucket',
        };
        const result = await handler({}, {} as Context);

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
        //BUCKET_NAME: 'example-bucket',
      };
      const result = await handler({}, {} as Context);

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
          //BUCKET_NAME: 'example-bucket',
        };
        const result = await handler({}, {} as Context);

        expect(result).toEqual('OK');
      });

    });

  });
  it('Should CostExplorer', async () => {


    //


    // expect(ceClientMock.calls()).toHaveLength(2);

    //expect(cwLogsMock).toHaveReceivedCommandTimes(CreateExportTaskCommand,1);
  });

  it('Should EnvironmentVariableError(BUCKET_NAME)', async () => {
    //const payload: EventInput = {};
    //process.env = {};
    //const result = handler(payload, {} as Context);
    //await expect(handler(payload, {} as Context)).rejects.toThrow(EnvironmentVariableError);
    //expect(result).toThrowError(EnvironmentVariableError);
  });

});