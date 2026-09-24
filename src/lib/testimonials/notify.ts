import {buildModerationUrl} from './moderation';
import {TestimonialRecord} from './types';

/**
 * Sends or logs a private notification about a new (pending) submission.
 * Links carry HMAC signatures only — TESTIMONIALS_ADMIN_TOKEN is never placed
 * in a URL. The submitter email is backend-internal and only appears here,
 * never in public API responses.
 */
export async function notifySubmission(record: TestimonialRecord, origin: string): Promise<void> {
  const payload = {
    event: 'new_testimonial',
    id: record.id,
    submitter: {name: record.name, role: record.role, company: record.company},
    email: record.email,
    rating: record.rating,
    testimony: record.testimonial,
    submittedAt: record.createdAt,
    actions: {
      approve: buildModerationUrl(origin, record.id, 'approve'),
      reject: buildModerationUrl(origin, record.id, 'reject'),
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
