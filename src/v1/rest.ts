import { type _ZodType, z } from 'zod';
import { HasUniqueItems } from '../utils';
import { APIKey, APIKeyScope } from './resources/api-key';
import { Cursor, Snowflake } from './resources/common';
import { APITemplate, TemplateVariable } from './resources/template';
import {
	APIWebhook,
	WebhookStatus,
	WebhookSubscriptionEventType,
} from './resources/webhook';

const RESTCursorPaginationQueryParams = z.object({
	after: Snowflake.optional().describe(
		'Cursor that starts the next page right after this item for seamless pagination.',
	),
	before: Snowflake.optional().describe(
		'Cursor that lets you move backward through results without losing context.',
	),
	limit: z
		.int()
		.min(2)
		.max(100)
		.optional()
		.describe('Number of items Rewrite should return in this page.'),
});

const TemplateVariableBodyList = z
	.array(TemplateVariable)
	.min(1)
	.max(15)
	.refine((items) => HasUniqueItems(items, (item) => item.name), {
		message: 'Template variable names must be unique.',
	});

const EmptyData = z
	.null()
	.describe(
		'This operation completed successfully and does not need to return a payload.',
	);

/**
 * Any successful response returned by the Rewrite API.
 */
export const APIResponse = <Schema extends _ZodType>(schema: Schema) =>
	z.object({
		ok: z
			.literal(true)
			.describe(
				'Always `true` when Rewrite completes the request successfully.',
			),
		data: schema.describe(
			'Primary payload returned by this Rewrite API operation.',
		),
	});

/**
 * Any successful response returned by the Rewrite API.
 */
export type APIResponse<Schema extends _ZodType> = z.infer<
	ReturnType<typeof APIResponse<Schema>>
>;

/**
 * Any successful paginated response returned by the Rewrite API.
 */
export const APIPaginatedResponse = <Schema extends _ZodType>(schema: Schema) =>
	APIResponse(schema).extend({
		cursor: Cursor.describe(
			'Pagination metadata that keeps high-volume list endpoints fast and predictable.',
		),
	});

/**
 * Any successful paginated response returned by the Rewrite API.
 */
export type APIPaginatedResponse<Schema extends _ZodType> = z.infer<
	ReturnType<typeof APIPaginatedResponse<Schema>>
>;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/api-keys
 *
 * @reference https://docs.rewritetoday.com/api-reference/api-keys/list-api-keys
 */
export const RESTGetListAPIKeysQueryParams = RESTCursorPaginationQueryParams;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/api-keys
 *
 * @reference https://docs.rewritetoday.com/api-reference/api-keys/list-api-keys
 */
export type RESTGetListAPIKeysQueryParams = z.infer<
	typeof RESTGetListAPIKeysQueryParams
>;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/api-keys
 *
 * @reference https://docs.rewritetoday.com/api-reference/api-keys/list-api-keys
 */
export const RESTGetListAPIKeysData = APIPaginatedResponse(z.array(APIKey));

/**
 * https://api.rewritetoday.com/v1/projects/{id}/api-keys
 *
 * @reference https://docs.rewritetoday.com/api-reference/api-keys/list-api-keys
 */
export type RESTGetListAPIKeysData = z.infer<typeof RESTGetListAPIKeysData>;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/api-keys
 *
 * @reference https://docs.rewritetoday.com/api-reference/api-keys/create-api-key
 */
export const RESTPostCreateAPIKeyBody = z.object({
	name: z
		.string()
		.min(2)
		.max(32)
		.describe(
			'Readable API key name for teams, services, and production environments.',
		),
	scopes: z
		.array(APIKeyScope)
		.refine((items) => HasUniqueItems(items, (item) => item), {
			message: 'API key scopes must be unique.',
		})
		.optional()
		.describe(
			'Permission scopes you want this API key to launch with from day one.',
		),
});

/**
 * https://api.rewritetoday.com/v1/projects/{id}/api-keys
 *
 * @reference https://docs.rewritetoday.com/api-reference/api-keys/create-api-key
 */
export type RESTPostCreateAPIKeyBody = z.infer<typeof RESTPostCreateAPIKeyBody>;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/api-keys
 *
 * @reference https://docs.rewritetoday.com/api-reference/api-keys/create-api-key
 */
export const RESTPostCreateAPIKeyData = APIResponse(
	z.object({
		id: Snowflake.describe(
			'Unique Rewrite ID for the newly created API key, ready for immediate tracking.',
		),
		key: z
			.string()
			.min(1)
			.describe(
				'One-time secret API key. Store it now and use it to authenticate live Rewrite traffic.',
			),
		count: z
			.int()
			.nonnegative()
			.optional()
			.describe(
				'Optional total number of active API keys after this key is created.',
			),
		createdAt: z.coerce
			.date()
			.describe(
				'Creation timestamp for the new key so auditing stays crisp and reliable.',
			),
	}),
);

/**
 * https://api.rewritetoday.com/v1/projects/{id}/api-keys
 *
 * @reference https://docs.rewritetoday.com/api-reference/api-keys/create-api-key
 */
export type RESTPostCreateAPIKeyData = z.infer<typeof RESTPostCreateAPIKeyData>;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/api-keys/{key}
 *
 * @reference https://docs.rewritetoday.com/api-reference/api-keys/revoke-api-key
 */
export const RESTDeleteAPIKeyData = APIResponse(EmptyData);

/**
 * https://api.rewritetoday.com/v1/projects/{id}/api-keys/{key}
 *
 * @reference https://docs.rewritetoday.com/api-reference/api-keys/revoke-api-key
 */
export type RESTDeleteAPIKeyData = z.infer<typeof RESTDeleteAPIKeyData>;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/templates
 *
 * @reference https://docs.rewritetoday.com/api-reference/templates/list-templates
 */
export const RESTGetListTemplatesQueryParams = RESTCursorPaginationQueryParams;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/templates
 *
 * @reference https://docs.rewritetoday.com/api-reference/templates/list-templates
 */
export type RESTGetListTemplatesQueryParams = z.infer<
	typeof RESTGetListTemplatesQueryParams
>;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/templates
 *
 * @reference https://docs.rewritetoday.com/api-reference/templates/list-templates
 */
export const RESTGetListTemplatesData = APIPaginatedResponse(
	z.array(APITemplate),
);

/**
 * https://api.rewritetoday.com/v1/projects/{id}/templates
 *
 * @reference https://docs.rewritetoday.com/api-reference/templates/list-templates
 */
export type RESTGetListTemplatesData = z.infer<typeof RESTGetListTemplatesData>;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/templates
 *
 * @reference https://docs.rewritetoday.com/api-reference/templates/create-template
 */
export const RESTPostCreateTemplateBody = z.object({
	name: z
		.string()
		.min(1)
		.max(32)
		.describe(
			'Template name that keeps your messaging catalog clean, searchable, and scalable.',
		),
	content: z
		.string()
		.min(1)
		.max(1024)
		.describe(
			'Message content your customers will receive, with support for dynamic variables.',
		),
	variables: TemplateVariableBodyList.describe(
		'Variables available to personalize every message with safe, dynamic content.',
	),
});

/**
 * https://api.rewritetoday.com/v1/projects/{id}/templates
 *
 * @reference https://docs.rewritetoday.com/api-reference/templates/create-template
 */
export type RESTPostCreateTemplateBody = z.infer<
	typeof RESTPostCreateTemplateBody
>;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/templates
 *
 * @reference https://docs.rewritetoday.com/api-reference/templates/create-template
 */
export const RESTPostCreateTemplateData = APIResponse(
	z.object({
		id: Snowflake.describe(
			'Unique Rewrite ID for the newly created template, ready for instant reuse.',
		),
		createdAt: z.coerce
			.date()
			.describe(
				'Creation timestamp for this template so launches stay easy to track.',
			),
	}),
);

/**
 * https://api.rewritetoday.com/v1/projects/{id}/templates
 *
 * @reference https://docs.rewritetoday.com/api-reference/templates/create-template
 */
export type RESTPostCreateTemplateData = z.infer<
	typeof RESTPostCreateTemplateData
>;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/templates/{identifier}
 *
 * @reference https://docs.rewritetoday.com/api-reference/templates/get-template
 */
export const RESTGetTemplateData = APIResponse(APITemplate);

/**
 * https://api.rewritetoday.com/v1/projects/{id}/templates/{identifier}
 *
 * @reference https://docs.rewritetoday.com/api-reference/templates/get-template
 */
export type RESTGetTemplateData = z.infer<typeof RESTGetTemplateData>;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/templates/{templateId}
 *
 * @reference https://docs.rewritetoday.com/api-reference/templates/update-template
 */
export const RESTPatchUpdateTemplateBody = z
	.object({
		content: z
			.string()
			.min(1)
			.max(1024)
			.optional()
			.describe(
				'Fresh template content to roll out instantly across your messaging journeys.',
			),
		variables: TemplateVariableBodyList.optional().describe(
			'Updated personalization variables to keep this template flexible and on-brand.',
		),
	})
	.refine(
		(input) => input.content !== undefined || input.variables !== undefined,
		{
			message: 'At least one field must be provided to update a template.',
		},
	);

/**
 * https://api.rewritetoday.com/v1/projects/{id}/templates/{templateId}
 *
 * @reference https://docs.rewritetoday.com/api-reference/templates/update-template
 */
export type RESTPatchUpdateTemplateBody = z.infer<
	typeof RESTPatchUpdateTemplateBody
>;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/templates/{templateId}
 *
 * @reference https://docs.rewritetoday.com/api-reference/templates/update-template
 */
export const RESTPatchUpdateTemplateData = APIResponse(EmptyData);

/**
 * https://api.rewritetoday.com/v1/projects/{id}/templates/{templateId}
 *
 * @reference https://docs.rewritetoday.com/api-reference/templates/update-template
 */
export type RESTPatchUpdateTemplateData = z.infer<
	typeof RESTPatchUpdateTemplateData
>;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/templates/{templateId}
 *
 * @reference https://docs.rewritetoday.com/api-reference/templates/delete-template
 */
export const RESTDeleteTemplateData = APIResponse(EmptyData);

/**
 * https://api.rewritetoday.com/v1/projects/{id}/templates/{templateId}
 *
 * @reference https://docs.rewritetoday.com/api-reference/templates/delete-template
 */
export type RESTDeleteTemplateData = z.infer<typeof RESTDeleteTemplateData>;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/webhooks
 *
 * @reference https://docs.rewritetoday.com/api-reference/webhooks/list-webhooks
 */
export const RESTGetListWebhooksQueryParams = RESTCursorPaginationQueryParams;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/webhooks
 *
 * @reference https://docs.rewritetoday.com/api-reference/webhooks/list-webhooks
 */
export type RESTGetListWebhooksQueryParams = z.infer<
	typeof RESTGetListWebhooksQueryParams
>;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/webhooks
 *
 * @reference https://docs.rewritetoday.com/api-reference/webhooks/list-webhooks
 */
export const RESTGetListWebhooksData = APIPaginatedResponse(
	z.array(APIWebhook),
);

/**
 * https://api.rewritetoday.com/v1/projects/{id}/webhooks
 *
 * @reference https://docs.rewritetoday.com/api-reference/webhooks/list-webhooks
 */
export type RESTGetListWebhooksData = z.infer<typeof RESTGetListWebhooksData>;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/webhooks
 *
 * @reference https://docs.rewritetoday.com/api-reference/webhooks/create-webhook
 */
export const RESTPostCreateWebhookBody = z.object({
	name: z
		.string()
		.min(1)
		.max(32)
		.optional()
		.describe(
			'Optional label that keeps webhook destinations organized across every environment.',
		),
	events: z
		.array(WebhookSubscriptionEventType)
		.refine((items) => HasUniqueItems(items, (item) => item), {
			message: 'Webhook event subscriptions must be unique.',
		})
		.describe(
			'Events Rewrite should deliver to this endpoint for real-time product automation.',
		),
	endpoint: z
		.url()
		.max(255)
		.describe(
			'Public HTTPS URL that will receive Rewrite webhook deliveries in real time.',
		),
});

/**
 * https://api.rewritetoday.com/v1/projects/{id}/webhooks
 *
 * @reference https://docs.rewritetoday.com/api-reference/webhooks/create-webhook
 */
export type RESTPostCreateWebhookBody = z.infer<
	typeof RESTPostCreateWebhookBody
>;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/webhooks
 *
 * @reference https://docs.rewritetoday.com/api-reference/webhooks/create-webhook
 */
export const RESTPostCreateWebhookData = APIResponse(
	z.object({
		id: Snowflake.describe(
			'Unique Rewrite ID for the newly created webhook, ready for operational visibility.',
		),
	}),
);

/**
 * https://api.rewritetoday.com/v1/projects/{id}/webhooks
 *
 * @reference https://docs.rewritetoday.com/api-reference/webhooks/create-webhook
 */
export type RESTPostCreateWebhookData = z.infer<
	typeof RESTPostCreateWebhookData
>;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/webhooks/{webhookId}
 *
 * @reference https://docs.rewritetoday.com/api-reference/webhooks/get-webhook
 */
export const RESTGetWebhookData = APIResponse(APIWebhook);

/**
 * https://api.rewritetoday.com/v1/projects/{id}/webhooks/{webhookId}
 *
 * @reference https://docs.rewritetoday.com/api-reference/webhooks/get-webhook
 */
export type RESTGetWebhookData = z.infer<typeof RESTGetWebhookData>;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/webhooks/{webhookId}
 *
 * @reference https://docs.rewritetoday.com/api-reference/webhooks/update-webhook
 */
export const RESTPatchUpdateWebhookBody = z
	.object({
		name: z
			.string()
			.min(1)
			.max(32)
			.nullable()
			.optional()
			.describe(
				'Updated label for this webhook, or `null` if you want to clear it.',
			),
		events: z
			.array(WebhookSubscriptionEventType)
			.refine((items) => HasUniqueItems(items, (item) => item), {
				message: 'Webhook event subscriptions must be unique.',
			})
			.optional()
			.describe(
				'Replacement event subscriptions to retune what this webhook receives.',
			),
		endpoint: z
			.url()
			.max(255)
			.optional()
			.describe('New HTTPS destination for future Rewrite webhook deliveries.'),
		status: WebhookStatus.optional().describe(
			'Delivery state used to instantly activate or pause this webhook.',
		),
	})
	.refine(
		(input) =>
			input.name !== undefined ||
			input.events !== undefined ||
			input.endpoint !== undefined ||
			input.status !== undefined,
		{
			message: 'At least one field must be provided to update a webhook.',
		},
	);

/**
 * https://api.rewritetoday.com/v1/projects/{id}/webhooks/{webhookId}
 *
 * @reference https://docs.rewritetoday.com/api-reference/webhooks/update-webhook
 */
export type RESTPatchUpdateWebhookBody = z.infer<
	typeof RESTPatchUpdateWebhookBody
>;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/webhooks/{webhookId}
 *
 * @reference https://docs.rewritetoday.com/api-reference/webhooks/update-webhook
 */
export const RESTPatchUpdateWebhookData = APIResponse(EmptyData);

/**
 * https://api.rewritetoday.com/v1/projects/{id}/webhooks/{webhookId}
 *
 * @reference https://docs.rewritetoday.com/api-reference/webhooks/update-webhook
 */
export type RESTPatchUpdateWebhookData = z.infer<
	typeof RESTPatchUpdateWebhookData
>;

/**
 * https://api.rewritetoday.com/v1/projects/{id}/webhooks/{webhookId}
 *
 * @reference https://docs.rewritetoday.com/api-reference/webhooks/delete-webhook
 */
export const RESTDeleteWebhookData = APIResponse(EmptyData);

/**
 * https://api.rewritetoday.com/v1/projects/{id}/webhooks/{webhookId}
 *
 * @reference https://docs.rewritetoday.com/api-reference/webhooks/delete-webhook
 */
export type RESTDeleteWebhookData = z.infer<typeof RESTDeleteWebhookData>;
