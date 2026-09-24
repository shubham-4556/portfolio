import {TestimonialRecord} from './types';

function baseOrigin(): string {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.SITE_URL) return process.env.SITE_URL;
  return '';
}

function adminToken(): string | undefined {
  return process.env.TESTIMONIALS_ADMIN_TOKEN;
}

/** Builds a server-side-only, token-signed moderation link (approve/reject). */
export function buildAdminActionUrl(id: string, action: 'approve' | 'reject'): string {
  const origin = baseOrigin();
  const base = `${origin}/api/testimonials/${id}/${action}`;
  const token = adminToken();
  return token ? `${base}?admin_token=${encodeURIComponent(token)}` : base;
}

/**
 * Sends or logs a private notification about a new (pending) submission.
 * The email address is backend-internal and only appears in this notification,
 * never in public API responses.
 */
export async function notifySubmission(record: TestimonialRecord): Promise<void> {
  const payload = {
    event: 'new_testimonial',
    id: record.id,
    submitter: {name: record.name, role: record.role, company: record.company},
    email: record.email,
    rating: record.rating,
    testimony: record.testimonial,
    submittedAt: record.createdAt,
    actions: {
      approve: buildAdminActionUrl(record.id, 'approve'),
      reject: buildAdminActionUrl(record.id, 'reject'),
    },
  };

  const webhook = process.env.TESTIMONIALS_NOTIFY_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(payload),
      });
      return;
    } catch (error) {
      console.error('[testimonials] notification webhook failed', error instanceof Error ? error.message : error);
    }
  }

  console.log('[testimonials] NEW SUBMISSION (pending moderation):\n' + JSON.stringify(payload, null, 2));
}
