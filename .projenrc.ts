import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: '@yicr/cost-usage-reports',
  description: 'Cost & Usage Reports',
  keywords: ['aws', 'cdk', 'aws-cdk', 'cost', 'reports', 's3', 'bucket'],
  projenrcTs: true,
  repositoryUrl: 'https://github.com/yicr/cost-usage-reports.git',
  deps: [
    '@yicr/secure-bucket',
  ],
  devDeps: [
    'aws-sdk-client-mock',
    'aws-sdk-client-mock-jest',
    '@aws-sdk/client-cost-explorer',
    '@types/aws-lambda',
    '@yicr/jest-serializer-cdk-asset',
  ],
  peerDeps: [
    '@yicr/secure-bucket',
  ],
});
project.synth();