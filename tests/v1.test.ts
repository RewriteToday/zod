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
	WebhookEvent,
	WebhookEventType,
} from '../src/v1';

describe('v1 schema sync', () => {
	it('parses new contact and segment resources', () => {
		expect(
			APIContact.parse({
				id: '1',
				createdAt: '2026-04-02T12:00:00.000Z',
				updatedAt: '2026-04-02T12:01:00.000Z',
				name: null,
				phone: '+5511999999999',
				country: 'br',
				channel: null,
				tags: { crmId: 123 },
			}),
		).toBeDefined();

		expect(
			APISegment.parse({
				id: '2',
				createdAt: '2026-04-02T12:00:00.000Z',
				updatedAt: '2026-04-02T12:01:00.000Z',
				name: 'VIP',
				color: '#00AAFF',
				description: null,
				contactsCount: 12,
			}),
		).toBeDefined();
	});

	it('accepts updated webhook and template shapes', () => {
		expect(
			APIWebhook.parse({
				id: '3',
				name: null,
				secret: 'secret',
				endpoint: 'https://example.com/webhooks/rewrite',
				events: ['*'],
				status: 'ACTIVE',
				timeout: 5000,
				retries: 3,
				createdAt: '2026-04-02T12:00:00.000Z',
			}),
		).toBeDefined();

		expect(
			RESTPostCreateTemplateBody.parse({
				name: 'welcome',
				content: 'Hello {{name}}',
				variables: [{ name: 'name', fallback: 'friend' }],
				description: null,
				tags: [{ name: 'channel', value: 'onboarding' }],
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
				data: [
					{
						id: '4',
						createdAt: '2026-04-02T12:00:00.000Z',
						analysis: {
							characters: 10,
							encoding: 'gsm7',
							segments: {
								count: 1,
								single: 160,
								concat: 153,
								reason: 'fits',
							},
						},
					},
				],
			}),
		).toBeDefined();
	});

	it('supports contact and template-based message bodies', () => {
		expect(
			RESTPostSendMessageBody.parse({
				contact: 'ada',
				content: 'Hello',
				tags: [{ name: 'origin', value: 'crm' }],
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
			data: {
				id: '7',
				projectId: '8',
				to: '+5511999999999',
				contact: 'Ada',
				contactId: '9',
				tags: [{ name: 'campaign', value: 'spring' }],
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
