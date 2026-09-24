import {TestimonialInput} from './types';

export interface ValidationResult<T> {
  ok: boolean;
  value?: T;
  errors?: Record<string, string>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const isControlChar = (char: string): boolean => {
  const code = char.charCodeAt(0);
  return (
    code === 0 || (code >= 1 && code <= 8) || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127
  );
};

/** Strip control characters and HTML-ish brackets so stored text stays clean. */
const sanitize = (value: string): string =>
  value
    .split('')
    .filter(char => !isControlChar(char))
    .join('')
    .replace(/</gu, '\uFF1C')
    .replace(/>/gu, '\uFF1E')
    .trim();

const cleanOptionalUrl = (value: string | undefined, label: string, expectLinkedIn = false): string | undefined => {
  if (!value || !value.trim()) return undefined;
  const candidate = value.trim();
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      throw new Error();
    }
    if (expectLinkedIn && !parsed.hostname.toLowerCase().endsWith('linkedin.com')) {
      throw new Error();
    }
    return candidate;
  } catch {
    throw new Error(`${label} must be a valid${expectLinkedIn ? ' LinkedIn' : ''} URL`);
  }
};

/**
 * Validates and sanitizes a public testimonial submission.
 * Server-side source of truth — the frontend mirrors these rules but is never trusted.
 */
export function validateTestimonial(body: unknown): ValidationResult<TestimonialInput> {
  const errors: Record<string, string> = {};
  const raw = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>;

  const name = typeof raw.name === 'string' ? sanitize(raw.name) : '';
  if (!name) errors.name = 'Full name is required.';
  else if (name.length < 2) errors.name = 'Name must be at least 2 characters.';
  else if (name.length > 80) errors.name = 'Name must be 80 characters or fewer.';

  const email = typeof raw.email === 'string' ? raw.email.trim() : '';
  if (!email) errors.email = 'Email is required.';
  else if (!EMAIL_RE.test(email) || email.length > 160) errors.email = 'Please enter a valid email address.';

  const role = typeof raw.role === 'string' ? sanitize(raw.role) : '';
  if (!role) errors.role = 'Role / designation is required.';
  else if (role.length < 2) errors.role = 'Role must be at least 2 characters.';
  else if (role.length > 100) errors.role = 'Role must be 100 characters or fewer.';

  const company = typeof raw.company === 'string' ? sanitize(raw.company) : '';
  if (company && company.length > 100) errors.company = 'Company must be 100 characters or fewer.';

  const testimonial = typeof raw.testimonial === 'string' ? sanitize(raw.testimonial) : '';
  if (!testimonial) errors.testimonial = 'Testimonial is required.';
  else if (testimonial.length < 10) errors.testimonial = 'Testimonial must be at least 10 characters.';
  else if (testimonial.length > 2000) errors.testimonial = 'Testimonial must be 2000 characters or fewer.';

  let rating = 0;
  if (raw.rating !== undefined && raw.rating !== null && raw.rating !== '') {
    const parsed = Math.round(Number(raw.rating));
    if (!Number.isFinite(parsed)) errors.rating = 'Rating must be a number.';
    else if (parsed < 1 || parsed > 5) errors.rating = 'Rating must be between 1 and 5.';
    else rating = parsed;
  }

  let linkedinUrl: string | undefined;
  try {
    linkedinUrl = cleanOptionalUrl(
      typeof raw.linkedinUrl === 'string' ? raw.linkedinUrl : undefined,
      'LinkedIn URL',
      true,
    );
  } catch (error) {
    errors.linkedinUrl = (error as Error).message;
  }

  let profileImage: string | undefined;
  try {
    profileImage = cleanOptionalUrl(
      typeof raw.profileImage === 'string' ? raw.profileImage : undefined,
      'Profile image URL',
    );
  } catch (error) {
    errors.profileImage = (error as Error).message;
  }

  if (Object.keys(errors).length > 0) {
    return {ok: false, errors};
  }

  return {
    ok: true,
    value: {
      name,
      email: email.toLowerCase(),
      role,
      company,
      testimonial,
      rating,
      ...(linkedinUrl ? {linkedinUrl} : {}),
      ...(profileImage ? {profileImage} : {}),
    },
  };
}
