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

const data = RESTPostCreateTemplateBody.parse({
	name: 'order_shipped',
	content: 'Hi {{first_name}}, your order {{order_id}} is on the way.',
	description: 'Default shipping notification',
	variables: [
		{ name: 'first_name', fallback: 'customer' },
		{ name: 'order_id', fallback: '0000' },
	],
	i18n: {
		br: 'Oi {{first_name}}, seu pedido {{order_id}} esta a caminho.',
	},
});

console.log({
	data,
	url: '/templates',
	response: RESTGetListTemplatesData.parse({
		ok: true,
		data: [],
		cursor: {
			persist: false,
		},
	}),
});
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
	name: 'Message lifecycle',
	secret: 'rewrite_webhook_secret',
	endpoint: 'https://example.com/webhooks/rewrite',
	events: ['message.queued', 'message.delivered'],
	status: 'ACTIVE',
	projectId: '748395130237498701',
	createdAt: '2026-02-19T16:05:00.000Z',
});

const body = RESTPostCreateWebhookBody.parse({
	name: 'Message lifecycle',
	endpoint: 'https://example.com/webhooks/rewrite',
	events: ['message.queued', 'message.delivered'],
	secret: 'rewrite_webhook_secret',
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

const result = WebhookEvent.safeParse({
	type: 'message.sent',
	id: '748395130237498799',
	createdAt: '2026-02-19T16:05:00.000Z',
	data: {
		id: '748395130237498800',
		projectId: '748395130237498701',
		createdAt: '748395130237498801',
		analysis: {
			characters: 24,
			encoding: 'gsm7',
			segments: {
				count: 1,
				single: 160,
				concat: 153,
				reason: 'fits',
			},
		},
		to: '+5511999999999',
		type: 'SMS',
		tags: [{ name: 'campaign', value: 'spring' }],
		status: 'SENT',
		country: 'br',
		content: 'Your code is 123456',
		encoding: 'GMS7',
		templateId: null,
		deliveredAt: null,
		scheduledAt: null,
		isPayAsYouGo: false,
	},
});

if (!result.success) {
	console.error({ error: result.error });

	return;
}

console.log({ data: result.data });
```

<div align="center">

You can view our documentation going [here](https://docs.rewritetoday.com/api-reference). Thanks for building with Rewrite!

</div>
