import { awscdk, javascript } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  cdkVersion: '2.189.1',
  typescriptVersion: '5.7.x',
  jsiiVersion: '5.7.x',
  defaultReleaseBranch: 'main',
  name: '@gammarers/aws-daily-cost-usage-report-stack',
  description: 'Cost & Usage Reports',
  keywords: ['aws', 'cdk', 'aws-cdk', 'cost', 'reports', 'slack'],
  majorVersion: 1,
  projenrcTs: true,
  repositoryUrl: 'https://github.com/gammarers/aws-daily-cost-usage-report-stack.git',
  deps: [
  ],
  devDeps: [
    'aws-sdk-client-mock',
    'aws-sdk-client-mock-jest',
    '@aws-sdk/client-cost-explorer',
    '@slack/web-api',
    '@types/aws-lambda',
    '@yicr/aws-lambda-errors',
    '@gammarers/jest-aws-cdk-asset-filename-renamer@~0.5.0',
  ],
  jestOptions: {
    jestConfig: {
      snapshotSerializers: ['<rootDir>/node_modules/@gammarers/jest-aws-cdk-asset-filename-renamer'],
    },
    extraCliOptions: ['--silent'],
  },
  lambdaOptions: {
    // target node.js runtime
    runtime: awscdk.LambdaRuntime.NODEJS_20_X,
    bundlingOptions: {
      // list of node modules to exclude from the bundle
      externals: ['@aws-sdk/client-cost-explorer'],
      sourcemap: true,
    },
  },
  releaseToNpm: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  minNodeVersion: '16.0.0',
  workflowNodeVersion: '22.x',
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.expressions(['0 19 * * 3']), // every wednesday 19:00 (JST/THU:0400)
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['yicr'],
  },
  publishToPypi: {
    distName: 'gammarer.aws-daily-cost-usage-reporter',
    module: 'gammarer.aws_daily_cost_usage_reporter',
  },
});
project.synth();