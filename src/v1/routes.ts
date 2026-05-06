import type {
	RESTGetListAPIKeyLogsQueryParams,
	RESTGetListAPIKeysQueryParams,
	RESTGetListContactsQueryParams,
	RESTGetListDeliveriesQueryParams,
	RESTGetListLogsQueryParams,
	RESTGetListMessagesQueryParams,
	RESTGetListSegmentContactsQueryParams,
	RESTGetListSegmentsQueryParams,
	RESTGetListTemplatesQueryParams,
	RESTGetListWebhookDeliveriesQueryParams,
	RESTGetListWebhooksQueryParams,
	RESTGetTemplateQueryParams,
} from './rest';
import { createCursorQuery, createQuery } from './utils';

export const API_BASE_URL = 'https://api.rewritetoday.com';

export const Routes = {
	messages: {
		send: () => '/messages',
		create() {
			return this.send();
		},
		batch: () => '/messages/batch',
		list(options?: RESTGetListMessagesQueryParams) {
			return `/messages?${createCursorQuery(options)}`;
		},
		get: (id: string) => `/messages/${id}`,
		cancel: (id: string) => `/messages/${id}/cancel`,
	},
	apiKeys: {
		list: (options?: RESTGetListAPIKeysQueryParams) =>
			`/api-keys?${createCursorQuery(options)}`,
		create: () => '/api-keys',
		sweep: () => '/api-keys',
		get: (id: string) => `/api-keys/${id}`,
		update: (id: string) => `/api-keys/${id}`,
		delete: (id: string) => `/api-keys/${id}`,
		logs(id: string, options?: RESTGetListAPIKeyLogsQueryParams) {
			return `/api-keys/${id}/logs?${createCursorQuery(options)}`;
		},
	},
	contacts: {
		list(options?: RESTGetListContactsQueryParams) {
			return `/contacts?${createCursorQuery(options)}`;
		},
		create: () => '/contacts',
		sweep: () => '/contacts',
		batch: () => '/contacts/batch',
		get: (identifier: string) => `/contacts/${identifier}`,
		update: (id: string) => `/contacts/${id}`,
		delete: (id: string) => `/contacts/${id}`,
		addTags: (id: string) => `/contacts/${id}/tags`,
		removeTags: (id: string) => `/contacts/${id}/tags`,
	},
	segments: {
		list(options?: RESTGetListSegmentsQueryParams) {
			return `/segments?${createCursorQuery(options)}`;
		},
		create: () => '/segments',
		sweep: () => '/segments',
		get: (id: string) => `/segments/${id}`,
		update: (id: string) => `/segments/${id}`,
		delete: (id: string) => `/segments/${id}`,
		contacts: {
			list(id: string, options?: RESTGetListSegmentContactsQueryParams) {
				return `/segments/${id}/contacts?${createCursorQuery(options)}`;
			},
			attach: (id: string) => `/segments/${id}/contacts`,
			attachMany: (id: string) => `/segments/${id}/contacts/attach`,
			detachMany: (id: string) => `/segments/${id}/contacts/detach`,
			detach: (id: string, contactId: string) =>
				`/segments/${id}/contacts/${contactId}`,
		},
		attachContact: (id: string) => `/segments/${id}/contacts`,
		attachContacts: (id: string) => `/segments/${id}/contacts/attach`,
		detachContacts: (id: string) => `/segments/${id}/contacts/detach`,
		detachContact: (id: string, contactId: string) =>
			`/segments/${id}/contacts/${contactId}`,
	},
	otp: {
		send: () => '/otp',
		create() {
			return this.send();
		},
		verify: (id: string) => `/otp/${id}/verify`,
	},
	tags: {
		list: () => '/tags',
		create: () => '/tags',
		get: (id: string) => `/tags/${id}`,
		update: (id: string) => `/tags/${id}`,
		delete: (id: string) => `/tags/${id}`,
	},
	templates: {
		list(options?: RESTGetListTemplatesQueryParams) {
			return `/templates?${createCursorQuery(options)}`;
		},
		create: () => '/templates',
		sweep: () => '/templates',
		get(identifier: string, options?: RESTGetTemplateQueryParams) {
			const query = createQuery(options);
			return query
				? `/templates/${identifier}?${query}`
				: `/templates/${identifier}`;
		},
		update: (id: string) => `/templates/${id}`,
		delete: (id: string) => `/templates/${id}`,
		duplicate: (id: string) => `/templates/${id}/duplicate`,
	},
	webhooks: {
		list(options?: RESTGetListWebhooksQueryParams) {
			return `/webhooks?${createCursorQuery(options)}`;
		},
		create: () => '/webhooks',
		sweep: () => '/webhooks',
		get: (id: string) => `/webhooks/${id}`,
		update: (id: string) => `/webhooks/${id}`,
		delete: (id: string) => `/webhooks/${id}`,
		deliveries(id: string, options?: RESTGetListWebhookDeliveriesQueryParams) {
			return `/webhooks/${id}/deliveries?${createCursorQuery(options)}`;
		},
		logs(id: string, options?: RESTGetListWebhookDeliveriesQueryParams) {
			return this.deliveries(id, options);
		},
	},
	logs: {
		list(options?: RESTGetListLogsQueryParams) {
			return `/logs?${createCursorQuery(options)}`;
		},
		get: (id: string) => `/logs/${id}`,
	},
	deliveries: {
		list(options?: RESTGetListDeliveriesQueryParams) {
			return `/deliveries?${createCursorQuery(options)}`;
		},
		get: (id: string) => `/deliveries/${id}`,
		byWebhook(id: string, options?: RESTGetListWebhookDeliveriesQueryParams) {
			return `/webhooks/${id}/deliveries?${createCursorQuery(options)}`;
		},
	},
} as const;
