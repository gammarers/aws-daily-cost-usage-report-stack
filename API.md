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

##### ~~`isConstruct`~~ <a name="isConstruct" id="@gammarer/aws-daily-cost-usage-reporter.DailyCostUsageReporter.isConstruct"></a>

```typescript
import { DailyCostUsageReporter } from '@gammarer/aws-daily-cost-usage-reporter'

DailyCostUsageReporter.isConstruct(x: any)
```

Checks if `x` is a construct.

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

