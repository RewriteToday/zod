import { describe, expect, it } from 'bun:test';
import {
	APIContact,
	APISegment,
	APIWebhook,
	RESTGetListTemplatesQueryParams,
	RESTPatchUpdateWebhookData,
	RESTPostCreateTemplateBody,
	RESTPostSendBatchMessagesData,
	RESTPostSendMessageBody,
	Routes,
	WebhookDeliveryStatus,
	WebhookEvent,
	WebhookEventType,
} from '../src/v1';

describe('Routes', () => {
	it('builds contacts and segments routes', () => {
		expect(Routes.contacts.list()).toBe('/contacts?limit=15');
		expect(Routes.contacts.get('Ada')).toBe('/contacts/Ada');
		expect(Routes.segments.list({ limit: 20, after: '123' })).toBe(
			'/segments?limit=20&after=123',
		);
		expect(Routes.segments.contacts.attach('10')).toBe('/segments/10/contacts');
		expect(Routes.segments.contacts.detach('10', '20')).toBe(
			'/segments/10/contacts/20',
		);
	});

	it('builds updated message and template routes', () => {
		expect(Routes.messages.get('123')).toBe('/messages/123');
		expect(Routes.templates.get('welcome')).toBe('/templates/welcome');
		expect(Routes.templates.get('welcome', { withi18n: true })).toBe(
			'/templates/welcome?withi18n=true',
		);
	});

	it('builds updated webhook routes', () => {
		expect(Routes.webhooks.list({ limit: 48 })).toBe('/webhooks?limit=48');
		expect(
			Routes.webhooks.logs('42', {
				limit: 10,
				status: WebhookDeliveryStatus.Failed,
			}),
		).toBe('/webhooks/42/deliveries?limit=10&status=FAILED');
	});
});

describe('v1 schema sync', () => {
	it('parses updated contact and segment resources', () => {
		expect(
			APIContact.parse({
				id: '1',
				createdAt: '2026-04-02T12:00:00.000Z',
				name: null,
				phone: '+5511999999999',
				country: 'br',
				channel: null,
				preferredLanguages: ['pt-BR'],
				tags: { crmId: 123 },
				sandbox: false,
				updatedAt: '2026-04-02T12:01:00.000Z',
			}),
		).toBeDefined();

		expect(
			APISegment.parse({
				id: '2',
				createdAt: '2026-04-02T12:00:00.000Z',
				name: 'VIP',
				color: '#00AAFF',
				description: null,
				contactsCount: 12,
				sandbox: false,
				updatedAt: '2026-04-02T12:01:00.000Z',
			}),
		).toBeDefined();
	});

	it('accepts updated webhook and template shapes', () => {
		expect(
			APIWebhook.parse({
				id: '3',
				name: null,
				endpoint: 'https://example.com/webhooks/rewrite',
				events: [WebhookEventType.MessageDelivered],
				isEnabled: true,
				sandbox: false,
				timeout: 5000,
				retries: 3,
				lastDeliveryAt: null,
				createdAt: '2026-04-02T12:00:00.000Z',
			}),
		).toBeDefined();

		expect(
			RESTPostCreateTemplateBody.parse({
				name: 'welcome',
				content: 'Hello {{name}}',
				variables: [{ name: 'name', fallback: 'friend' }],
				description: null,
				tags: { channel: 'onboarding' },
			}),
		).toBeDefined();
	});

	it('uses the current query params and REST response contracts', () => {
		expect(
			RESTGetListTemplatesQueryParams.parse({
				limit: 20,
				withi18n: true,
			}),
		).toBeDefined();

		expect(
			RESTPatchUpdateWebhookData.parse({
				ok: true,
				data: null,
			}),
		).toBeDefined();

		expect(
			RESTPostSendBatchMessagesData.parse({
				ok: true,
				data: {
					ids: ['4', '5'],
				},
			}),
		).toBeDefined();
	});

	it('supports contact and template-based message bodies', () => {
		expect(
			RESTPostSendMessageBody.parse({
				contact: 'ada',
				content: 'Hello',
				tags: { origin: 'crm' },
			}),
		).toBeDefined();

		expect(
			RESTPostSendMessageBody.parse({
				to: '+5511999999999',
				templateId: '5',
			}),
		).toBeDefined();
	});

	it('parses the completed delivered webhook payload', () => {
		const event = WebhookEvent.parse({
			type: WebhookEventType.MessageDelivered,
			id: '6',
			createdAt: '2026-04-02T12:00:00.000Z',
			sandbox: false,
			data: {
				id: '7',
				projectId: '8',
				to: '+5511999999999',
				contact: 'Ada',
				contactId: '9',
				tags: { campaign: 'spring' },
				sandbox: false,
				type: 'SMS',
				status: 'DELIVERED',
				country: 'br',
				content: 'Hello',
				analysis: {
					characters: 5,
					encoding: 'gsm7',
					segments: {
						count: 1,
						single: 160,
						concat: 153,
						reason: 'fits',
					},
				},
				templateId: null,
				scheduledAt: null,
				deliveredAt: '2026-04-02T12:00:10.000Z',
				error: null,
			},
		});

		expect(event.type).toBe(WebhookEventType.MessageDelivered);
	});
});
