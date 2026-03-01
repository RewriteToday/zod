<div align="center">

# Rewrite Zod

Official **Zod** schemas for the **Rewrite API** — versioned, typed, and built for production.<br/>
[@rewritejs/zod](https://www.npmjs.com/package/@rewritejs/zod) gives you first-class runtime validation for the public Rewrite API, including REST payloads, reusable resources, and webhook events.

Built for TypeScript, Node.js, Bun, and modern server runtimes, it keeps your integrations aligned with the Rewrite platform while delivering a clean developer experience from request validation to webhook handling.

## Installing

You can use your favorite package manager to install our package

</div>

```bash
npm install @rewritejs/zod zod
# Or
yarn add @rewritejs/zod zod
# Or
bun add @rewritejs/zod zod
```

<div align="center">

## Using the Zod Schemas

Import schemas from the API version you want to target and validate requests or responses with confidence.

</div>

```ts
import {
	RESTPostCreateTemplateBody,
	RESTGetListTemplatesData,
} from '@rewritejs/zod/v1';
import { REST } from '@rewritejs/rest';

const client = new REST(process.env.REWRITE_API_KEY);

const data = RESTPostCreateTemplateBody.parse({
	name: 'order_shipped',
	content: 'Hi {{first_name}}, your order {{order_id}} is on the way.',
	variables: [
		{ name: 'first_name', fallback: 'customer' },
		{ name: 'order_id', fallback: '0000' },
	],
});

const response = await client.post('/templates', {
	data,
});

console.log({ data, response });
```

<div align="center">

### API Models & REST Contracts

Use reusable `API*` resources and endpoint-focused `REST<Method>*` schemas side by side.

</div>

```ts
import {
	APIWebhook,
	RESTPostCreateWebhookBody,
	RESTGetListWebhooksData,
} from '@rewritejs/zod/v1';

const webhook = APIWebhook.parse({
	id: '748395130237498700',
	name: 'Delivery events',
	endpoint: 'https://example.com/webhooks/rewrite',
	events: ['sms.queued', 'sms.delivered'],
	status: 'ACTIVE',
	createdAt: '2026-02-19T16:05:00.000Z',
});

const body = RESTPostCreateWebhookBody.parse({
	name: 'Delivery events',
	endpoint: 'https://example.com/webhooks/rewrite',
	events: ['sms.queued', 'sms.delivered'],
});

const data = RESTGetListWebhooksData.parse({
	ok: true,
	data: [webhook],
	cursor: {
		persist: false,
	},
});

console.log({ body, data });
```

<div align="center">

### Handling Webhooks

Validate Rewrite webhook payloads with a discriminated union and branch safely by event type.

</div>

```ts
import { WebhookEvent } from '@rewritejs/zod/v1';

const result = WebhookEvent.safeParse(payload);

if (!result.success) {
	console.error({ error: result.error });

	return;
}

console.log({ data: result.data });
```

<div align="center">

You can view our documentation going [here](https://docs.rewritetoday.com/api-reference). Thanks for building with Rewrite!

</div>
