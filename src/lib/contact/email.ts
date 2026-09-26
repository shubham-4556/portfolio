export interface ContactMessage {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
}

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

/**
 * Emails the site owner a contact-form message via the Resend API, with the
 * visitor's email set as Reply-To. Content is HTML-escaped before being
 * inserted into the template. RESEND_API_KEY is reused from the testimonials
 * setup; owner/from fall back to the existing TESTIMONIALS_* variables so a
 * single Resend configuration covers both features.
 */
export async function sendContactEmail(message: ContactMessage): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_OWNER_EMAIL || process.env.TESTIMONIALS_OWNER_EMAIL;
  if (!apiKey || !to) {
    console.warn(
      '[contact] email not sent (set RESEND_API_KEY and CONTACT_OWNER_EMAIL — or TESTIMONIALS_OWNER_EMAIL — to enable).',
    );
    return false;
  }

  const from = process.env.CONTACT_EMAIL_FROM || process.env.TESTIMONIALS_EMAIL_FROM || 'Shubh <onboarding@resend.dev>';
  const submittedAt = new Date().toLocaleString('en-US', {dateStyle: 'full', timeStyle: 'short'});

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#f4f4f5;color:#1f1e1d;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif">
    <div style="max-width:560px;margin:24px auto;background:#ffffff;border-radius:12px;border:1px solid #e7e5e4">
      <div style="padding:20px 28px;border-bottom:1px solid #e7e5e4">
        <h1 style="margin:0;font-size:18px">New Contact Message</h1>
        <p style="margin:6px 0 0;color:#78716c;font-size:13px">Submitted ${escapeHtml(submittedAt)}</p>
      </div>
      <div style="padding:20px 28px">
        <table style="border-collapse:collapse;margin-bottom:16px">
          ${meta('Name', message.name)}
          ${meta('Email', message.email)}
          ${meta('Company', message.company || '—')}
          ${meta('Subject', message.subject)}
        </table>
        <blockquote style="margin:0 0 20px;padding:12px 16px;border-left:4px solid #f97316;background:#fff7ed;border-radius:0 8px 8px 0;color:#3f3f46;white-space:pre-wrap">${escapeHtml(message.message)}</blockquote>
        <p style="margin:0;font-size:12px;color:#a8a29e">
          Reply directly to this email — the sender's address is set as Reply-To.
          Received from <strong>Shubham Deo's portfolio website</strong>.
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
      body: JSON.stringify({
        from,
        to: [to],
        subject: `New Contact Message — ${message.name}`,
        reply_to: [message.email],
        html,
      }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error(`[contact] email send failed (${response.status})`, detail.slice(0, 400));
      return false;
    }
    return true;
  } catch (error) {
    console.error('[contact] email error', error instanceof Error ? error.message : error);
    return false;
  }
}
