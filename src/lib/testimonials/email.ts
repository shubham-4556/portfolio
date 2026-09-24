import {buildModerationUrl} from './moderation';
import {TestimonialRecord} from './types';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function meta(label: string, value: string): string {
  return `<tr><td style="padding:6px 12px 6px 0;color:#78716c;white-space:nowrap;vertical-align:top">${label}</td>
    <td style="padding:6px 0;color:#1f1e1d;vertical-align:top">${escapeHtml(value)}</td></tr>`;
}

function actionButton(href: string, label: string, bg: string): string {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;margin:0 6px 6px 0;background:${bg};color:#ffffff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600">${label}</a>`;
}

/**
 * Emails the site owner a private moderation request for a new pending
 * submission. Uses the Resend API. The Approve/Reject links carry only an
 * HMAC signature — TESTIMONIALS_ADMIN_TOKEN is never exposed in the URL.
 *
 * Returns whether the email was successfully handed to Resend.
 */
export async function sendTestimonialNotification(record: TestimonialRecord, origin: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.TESTIMONIALS_OWNER_EMAIL;
  if (!apiKey || !to) {
    console.warn(
      '[testimonials] email notification skipped (set RESEND_API_KEY and TESTIMONIALS_OWNER_EMAIL to enable).',
    );
    return false;
  }

  const from = process.env.TESTIMONIALS_EMAIL_FROM || 'Testimonials <onboarding@resend.dev>';
  const company = record.company ? ` at ${record.company}` : '';
  const subject = `New testimonial from ${record.name} (${record.role}${company}) — awaiting approval`;

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#f4f4f5;color:#1f1e1d;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif">
    <div style="max-width:560px;margin:24px auto;background:#ffffff;border-radius:12px;border:1px solid #e7e5e4">
      <div style="padding:20px 28px;border-bottom:1px solid #e7e5e4">
        <h1 style="margin:0;font-size:18px">New testimonial awaiting approval</h1>
        <p style="margin:6px 0 0;color:#78716c;font-size:13px">Submitted ${new Date(record.createdAt).toLocaleString('en-US', {dateStyle: 'medium', timeStyle: 'short'})}</p>
      </div>
      <div style="padding:20px 28px">
        <table style="border-collapse:collapse;margin-bottom:16px">
          ${meta('Name', record.name)}
          ${meta('Role', record.role)}
          ${meta('Company', record.company || '—')}
          ${meta('Rating', `${record.rating} / 5`)}
        </table>
        <blockquote style="margin:0 0 20px;padding:12px 16px;border-left:4px solid #fecd60;background:#fffbeb;border-radius:0 8px 8px 0;color:#3f3f46;white-space:pre-wrap">${escapeHtml(record.testimonial)}</blockquote>
        <p style="margin:0 0 12px;font-size:13px;color:#78716c">Review this testimonial:</p>
        <div>
          ${actionButton(buildModerationUrl(origin, record.id, 'approve'), 'Approve', '#16a34a')}
          ${actionButton(buildModerationUrl(origin, record.id, 'reject'), 'Reject', '#dc2626')}
        </div>
        <p style="margin:16px 0 0;font-size:12px;color:#a8a29e">
          These links are signed and expire only when the testimonial is removed. Only approved testimonials appear publicly.
        </p>
      </div>
    </div>
  </body>
</html>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({from, to: [to], subject, html}),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error(`[testimonials] email send failed (${response.status})`, detail.slice(0, 400));
      return false;
    }
    return true;
  } catch (error) {
    console.error('[testimonials] email notification error', error instanceof Error ? error.message : error);
    return false;
  }
}
