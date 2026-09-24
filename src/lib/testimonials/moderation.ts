import crypto from 'crypto';
import {NextApiRequest, NextApiResponse} from 'next';

import {getStore} from './store';
import {TestimonialStatus} from './types';

export type ModerationAction = 'approve' | 'reject';

/**
 * Resolves the canonical origin (scheme + host) for link building, so emailed
 * moderation links are absolute regardless of hostname (localhost or Vercel).
 */
export function requestOrigin(req: NextApiRequest): string {
  const host = req.headers.host;
  if (host) {
    const proto = typeof req.headers['x-forwarded-proto'] === 'string' ? req.headers['x-forwarded-proto'] : 'http';
    return `${proto}://${host}`;
  }
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return '';
}

/**
 * HMAC-signed token for a single moderation action. The signature is keyed on
 * TESTIMONIALS_ADMIN_TOKEN but the token itself is never placed in the URL —
 * only its HMAC, which cannot be used to recover the secret.
 */
export function signModerationToken(id: string, action: ModerationAction): string | undefined {
  const key = process.env.TESTIMONIALS_ADMIN_TOKEN;
  if (!key) return undefined;
  return crypto.createHmac('sha256', key).update(`${id}.${action}`).digest('hex');
}

export function verifyModerationSig(id: string, action: ModerationAction, sig: string): boolean {
  const expected = signModerationToken(id, action);
  if (!expected) return false;
  const provided = Buffer.from(sig, 'hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  if (provided.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(provided, expectedBuffer);
}

/** Full approve/reject URL for a submission, carrying only a signed token. */
export function buildModerationUrl(origin: string, id: string, action: ModerationAction): string {
  const sig = signModerationToken(id, action);
  return `${origin}/api/testimonials/${id}/${action}${sig ? `?sig=${encodeURIComponent(sig)}` : ''}`;
}

/** Whether the request is authorized: valid signed link OR the admin token. */
export function isModerationAuthorized(req: NextApiRequest, id: string, action: ModerationAction): boolean {
  const sig = req.query.sig;
  if (typeof sig === 'string' && verifyModerationSig(id, action, sig)) return true;

  const header = req.headers['x-admin-token'];
  const token = typeof header === 'string' && header.length > 0 ? header : req.query.admin_token;
  if (typeof token === 'string' && token.length > 0 && token === process.env.TESTIMONIALS_ADMIN_TOKEN) {
    return true;
  }
  return false;
}

const RESULT_PAGE = (title: string, message: string): string => `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title></head>
  <body style="margin:0;background:#f6f5f2;color:#1f1e1d;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif">
    <main style="max-width:420px;margin:12vh auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 2px 20px rgba(0,0,0,.06)">
      <h1 style="font-size:20px;margin:0 0 8px">${title}</h1>
      <p style="margin:0;color:#57534e;line-height:1.5">${message}</p>
    </main>
  </body>
</html>`;

async function handleModeration(req: NextApiRequest, res: NextApiResponse, action: ModerationAction): Promise<void> {
  const id = String(req.query.id ?? '');

  if (req.method !== 'GET' && req.method !== 'PATCH') {
    res.setHeader('Allow', 'GET, PATCH');
    res.status(405).json({success: false, message: 'Method not allowed'});
    return;
  }

  if (!process.env.TESTIMONIALS_ADMIN_TOKEN) {
    if (req.method === 'GET') {
      res.status(503).send(RESULT_PAGE('Not configured', 'Moderation is not configured on the server yet.'));
    } else {
      res.status(503).json({success: false, message: 'Admin token not configured on the server.'});
    }
    return;
  }

  if (!isModerationAuthorized(req, id, action)) {
    if (req.method === 'GET') {
      res.status(401).send(RESULT_PAGE('Invalid link', 'This moderation link is invalid or expired.'));
    } else {
      res.status(401).json({success: false, message: 'Unauthorized.'});
    }
    return;
  }

  const status: TestimonialStatus = action === 'approve' ? 'approved' : 'rejected';
  const updated = await getStore().setStatus(id, status);

  if (!updated) {
    const page = RESULT_PAGE('Not found', 'This testimonial no longer exists on the server. It may have been deleted.');
    if (req.method === 'GET') {
      res.status(404).send(page);
    } else {
      res.status(404).json({success: false, message: 'Testimonial not found.'});
    }
    return;
  }

  if (req.method === 'GET') {
    const verb = action === 'approve' ? 'approved' : 'rejected';
    res
      .status(200)
      .send(
        RESULT_PAGE(
          `Testimonial ${verb}`,
          `The submission from ${updated.name} has been ${verb}. You can close this tab safely.`,
        ),
      );
    return;
  }

  res.status(200).json({success: true, id: updated.id, status: updated.status});
  return;
}

export async function handleApprove(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    await handleModeration(req, res, 'approve');
  } catch (error) {
    console.error('[testimonials] approve error', error instanceof Error ? error.message : error);
    res.status(500).json({success: false, message: 'Something went wrong.'});
  }
}

export async function handleReject(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    await handleModeration(req, res, 'reject');
  } catch (error) {
    console.error('[testimonials] reject error', error instanceof Error ? error.message : error);
    res.status(500).json({success: false, message: 'Something went wrong.'});
  }
}
