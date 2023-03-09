# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### DailyCostUsageReporter <a name="DailyCostUsageReporter" id="@yicr/daily-cost-usage-reporter.DailyCostUsageReporter"></a>

#### Initializers <a name="Initializers" id="@yicr/daily-cost-usage-reporter.DailyCostUsageReporter.Initializer"></a>

```typescript
import { DailyCostUsageReporter } from '@yicr/daily-cost-usage-reporter'

new DailyCostUsageReporter(scope: Construct, id: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yicr/daily-cost-usage-reporter.DailyCostUsageReporter.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@yicr/daily-cost-usage-reporter.DailyCostUsageReporter.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@yicr/daily-cost-usage-reporter.DailyCostUsageReporter.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@yicr/daily-cost-usage-reporter.DailyCostUsageReporter.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@yicr/daily-cost-usage-reporter.DailyCostUsageReporter.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@yicr/daily-cost-usage-reporter.DailyCostUsageReporter.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@yicr/daily-cost-usage-reporter.DailyCostUsageReporter.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@yicr/daily-cost-usage-reporter.DailyCostUsageReporter.isConstruct"></a>

```typescript
import { DailyCostUsageReporter } from '@yicr/daily-cost-usage-reporter'

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

###### `x`<sup>Required</sup> <a name="x" id="@yicr/daily-cost-usage-reporter.DailyCostUsageReporter.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yicr/daily-cost-usage-reporter.DailyCostUsageReporter.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@yicr/daily-cost-usage-reporter.DailyCostUsageReporter.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---





