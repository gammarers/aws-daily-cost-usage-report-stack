# AWS Daily Cost Usage Reports

AWS Cost And Usage report to Slack on daily 09:01.
- Report type
  - Services
    - This is Cost by AWS Services.
  - Accounts
    - This is Cost by Linked Account (when organization master account)

## Resources

This construct creating resource list.

- Lambda function execution role
- Lambda function
- EventBridge Scheduler execution role
- EventBridge Scheduler

## Install

### TypeScript

```shell
npm install @gammarer/aws-daily-cost-usage-repoter
# or
yarn add @gammarer/aws-daily-cost-usage-repoter
```

### Python

```shell
pip install gammarer.aws-daily-cost-usage-repoter
```

## Example

```shell
npm install @gammarer/aws-daily-cost-usage-repoter
```

```typescript
import { CostGroupType, DailyCostUsageReporter } from '@gammarer/aws-daily-cost-usage-repoter';

new DailyCostUsageReporter(stack, 'DailyCostUsageReporter', {
  slackWebhookUrl: 'https://hooks.slack.com/services/xxxxxxxxxx', // already created slack webhook url
  slackPostChannel: 'example-channel', // already created slack channel
  costGroupType: CostGroupType.SERVICES,
});

```

## License

This project is licensed under the Apache-2.0 License.




# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### DailyCostUsageReporter <a name="DailyCostUsageReporter" id="@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporter"></a>

#### Initializers <a name="Initializers" id="@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporter.Initializer"></a>

```typescript
import { DailyCostUsageReporter } from '@gammarer/aws-daily-cost-usage-reporter'

new DailyCostUsageReporter(scope: Construct, id: string, props: DailyCostUsageReporterProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporter.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporter.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporter.Initializer.parameter.props">props</a></code> | <code><a href="#@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporterProps">DailyCostUsageReporterProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporter.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporter.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporter.Initializer.parameter.props"></a>

- *Type:* <a href="#@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporterProps">DailyCostUsageReporterProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporter.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporter.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporter.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporter.isConstruct"></a>

```typescript
import { DailyCostUsageReporter } from '@gammarer/aws-daily-cost-usage-reporter'

DailyCostUsageReporter.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporter.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporter.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporter.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


## Structs <a name="Structs" id="Structs"></a>

### DailyCostUsageReporterProps <a name="DailyCostUsageReporterProps" id="@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporterProps"></a>

#### Initializer <a name="Initializer" id="@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporterProps.Initializer"></a>

```typescript
import { DailyCostUsageReporterProps } from '@gammarer/aws-daily-cost-usage-reporter'

const dailyCostUsageReporterProps: DailyCostUsageReporterProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporterProps.property.costGroupType">costGroupType</a></code> | <code><a href="#@gammarer/aws-daily-cost-usage-reporter.CostGroupType">CostGroupType</a></code> | *No description.* |
| <code><a href="#@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporterProps.property.slackChannel">slackChannel</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporterProps.property.slackToken">slackToken</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporterProps.property.scheduleTimezone">scheduleTimezone</a></code> | <code>string</code> | *No description.* |

---

##### `costGroupType`<sup>Required</sup> <a name="costGroupType" id="@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporterProps.property.costGroupType"></a>

```typescript
public readonly costGroupType: CostGroupType;
```

- *Type:* <a href="#@gammarer/aws-daily-cost-usage-reporter.CostGroupType">CostGroupType</a>

---

##### `slackChannel`<sup>Required</sup> <a name="slackChannel" id="@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporterProps.property.slackChannel"></a>

```typescript
public readonly slackChannel: string;
```

- *Type:* string

---

##### `slackToken`<sup>Required</sup> <a name="slackToken" id="@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporterProps.property.slackToken"></a>

```typescript
public readonly slackToken: string;
```

- *Type:* string

---

##### `scheduleTimezone`<sup>Optional</sup> <a name="scheduleTimezone" id="@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporterProps.property.scheduleTimezone"></a>

```typescript
public readonly scheduleTimezone: string;
```

- *Type:* string

---



## Enums <a name="Enums" id="Enums"></a>

### CostGroupType <a name="CostGroupType" id="@gammarer/aws-daily-cost-usage-reporter.CostGroupType"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@gammarer/aws-daily-cost-usage-reporter.CostGroupType.ACCOUNTS">ACCOUNTS</a></code> | *No description.* |
| <code><a href="#@gammarer/aws-daily-cost-usage-reporter.CostGroupType.SERVICES">SERVICES</a></code> | *No description.* |

---

##### `ACCOUNTS` <a name="ACCOUNTS" id="@gammarer/aws-daily-cost-usage-reporter.CostGroupType.ACCOUNTS"></a>

---


##### `SERVICES` <a name="SERVICES" id="@gammarer/aws-daily-cost-usage-reporter.CostGroupType.SERVICES"></a>

---

