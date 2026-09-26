import {NextApiHandler, NextApiResponse} from 'next';

import {sendContactEmail} from '../../../lib/contact/email';
import {isRateLimited, resolveIp} from '../../../lib/testimonials/rateLimit';

const NAME_MAX = 100;
const EMAIL_MAX = 160;
const COMPANY_MAX = 200;
const SUBJECT_MAX = 200;
const MESSAGE_MAX = 5000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactErrors {
  name?: string;
  email?: string;
  company?: string;
  subject?: string;
  message?: string;
}

function stretchedString(input: string, max: number): string {
  return input.replace(/\s+/g, ' ').trim().slice(0, max);
}

function respond(res: NextApiResponse, status: number, body: Record<string, unknown>): void {
  res.status(status).json(body);
}

/**
 * Handles contact-form submissions server-side. Validates every field (never
 * trusts the client), rate-limits per IP, ignores honeypot-filled requests
 * (returning success so bots don't learn), and delivers the message to the
 * owner's inbox via Resend with the visitor's email as Reply-To.
 */
const contactHandler: NextApiHandler = async (req, res) => {
  try {
    res.setHeader('cache-control', 'no-store');
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      respond(res, 405, {success: false, message: 'Method not allowed'});
      return;
    }

    if (isRateLimited(`contact:${resolveIp(req.headers)}`, 5, 15 * 60 * 1000)) {
      respond(res, 429, {success: false, message: 'Too many messages. Please try again later.'});
      return;
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    if (typeof body !== 'object' || Array.isArray(body)) {
      respond(res, 400, {success: false, message: 'Invalid request.'});
      return;
    }

    // Honeypot — invisible to humans, filled only by bots. Pretend success.
    if (typeof body.website === 'string' && body.website.length > 0) {
      respond(res, 200, {success: true, message: 'Message sent successfully!'});
      return;
    }

    const name = typeof body.name === 'string' ? stretchedString(body.name, NAME_MAX) : '';
    const email = typeof body.email === 'string' ? stretchedString(body.email, EMAIL_MAX) : '';
    const company = typeof body.company === 'string' ? stretchedString(body.company, COMPANY_MAX) : '';
    const subject = typeof body.subject === 'string' ? stretchedString(body.subject, SUBJECT_MAX) : '';
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, MESSAGE_MAX) : '';

    const errors: ContactErrors = {};
    if (!name) errors.name = 'Please enter your name.';
    if (!email) errors.email = 'Please enter your email address.';
    else if (!EMAIL_PATTERN.test(email)) errors.email = 'Please enter a valid email address.';
    if (company && company.length < 2) errors.company = 'Please enter a valid company name.';
    if (!subject) errors.subject = 'Please enter a subject.';
    if (!message) errors.message = 'Please write a message (at least a sentence).';
    else if (message.length < 10) errors.message = 'Your message is too short.';

    if (Object.keys(errors).length > 0) {
      respond(res, 400, {success: false, message: 'Please fix the highlighted fields.', errors});
      return;
    }

    const delivered = await sendContactEmail({name, email, company, subject, message});
    if (!delivered) {
      respond(res, 500, {success: false, message: 'Could not send your message right now. Please try again.'});
      return;
    }

    respond(res, 200, {success: true, message: 'Message sent successfully!'});
  } catch (error) {
    console.error('[contact] handler error', error instanceof Error ? error.message : error);
    respond(res, 500, {success: false, message: 'Something went wrong. Please try again.'});
  }
};

export default contactHandler;
