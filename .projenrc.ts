import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  cdkVersion: '2.42.0',
  defaultReleaseBranch: 'main',
  name: '@yicr/daily-cost-usage-reporter',
  description: 'Cost & Usage Reports',
  keywords: ['aws', 'cdk', 'aws-cdk', 'cost', 'reports', 's3', 'bucket'],
  projenrcTs: true,
  repositoryUrl: 'https://github.com/yicr/daily-cost-usage-reporter.git',
  devDeps: [
    'aws-sdk-client-mock',
    'aws-sdk-client-mock-jest',
    '@aws-sdk/client-cost-explorer',
    '@types/aws-lambda',
    '@yicr/jest-serializer-cdk-asset',
  ],
  jestOptions: {
    jestConfig: {
      snapshotSerializers: ['<rootDir>/node_modules/@yicr/jest-serializer-cdk-asset'],
    },
    extraCliOptions: ['--silent'],
  },
  lambdaOptions: {
    // target node.js runtime
    runtime: awscdk.LambdaRuntime.NODEJS_18_X,
    bundlingOptions: {
      // list of node modules to exclude from the bundle
      externals: ['@aws-sdk/client-cost-explorer'],
      sourcemap: true,
    },
  },
});
project.synth();