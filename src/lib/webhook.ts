import { WEBHOOK_URLS } from '../constants/booking';

export type WebhookEvent = 'created' | 'modified' | 'rescheduled' | 'cancelled' | 'blocked' | 'unblocked';

type ImportMetaEnvMaybe = { env?: { VITE_WEBHOOK_URL?: string } };

// Lightweight utility to centralize webhook POSTs while keeping caller payload shape flexible.
export async function sendWebhook<T extends Record<string, unknown>>(
  event: WebhookEvent,
  payload: T
): Promise<void> {
  const envUrl = (import.meta as unknown as ImportMetaEnvMaybe)?.env?.VITE_WEBHOOK_URL;
  const url = envUrl || WEBHOOK_URLS.BOOKING;
  const body = { action: event, timestamp: new Date().toISOString(), ...payload } as const;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Webhook failed (${res.status}): ${text}`);
  }
}
