import { awscdk, javascript } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  cdkVersion: '2.60.0',
  defaultReleaseBranch: 'main',
  name: '@yicr/aws-daily-cost-usage-reporter',
  description: 'Cost & Usage Reports',
  keywords: ['aws', 'cdk', 'aws-cdk', 'cost', 'reports', 'slack'],
  projenrcTs: true,
  repositoryUrl: 'https://github.com/yicr/aws-daily-cost-usage-reporter.git',
  deps: [
  ],
  devDeps: [
    'aws-sdk-client-mock',
    'aws-sdk-client-mock-jest',
    '@yicr/jest-serializer-cdk-asset',
    '@aws-sdk/client-cost-explorer',
    '@types/aws-lambda',
    '@slack/webhook',
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
  releaseToNpm: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  minNodeVersion: '16.0.0',
  workflowNodeVersion: '16.19.1',
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.expressions(['0 19 * * *']),
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['yicr'],
  },
});
project.synth();