export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

/**
 * Full record stored by the backend. `email` is private infra data and
 * must NEVER be returned by any public endpoint.
 */
export interface TestimonialRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  testimonial: string;
  rating: number;
  linkedinUrl?: string;
  profileImage?: string;
  status: TestimonialStatus;
  createdAt: string;
  approvedAt?: string;
}

/** Shape exposed to the public — intentionally omits `email`. */
export interface PublicTestimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  testimonial: string;
  rating: number;
  linkedinUrl?: string;
  profileImage?: string;
  createdAt: string;
}

/** Payload accepted from the public form. */
export interface TestimonialInput {
  name: string;
  email: string;
  role: string;
  company?: string;
  testimonial: string;
  rating?: number;
  linkedinUrl?: string;
  profileImage?: string;
}

export function toPublic(record: TestimonialRecord): PublicTestimonial {
  return {
    id: record.id,
    name: record.name,
    role: record.role,
    company: record.company,
    testimonial: record.testimonial,
    rating: record.rating,
    ...(record.linkedinUrl ? {linkedinUrl: record.linkedinUrl} : {}),
    ...(record.profileImage ? {profileImage: record.profileImage} : {}),
    createdAt: record.createdAt,
  };
}
