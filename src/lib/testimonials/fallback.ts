import {PublicTestimonial} from './types';

/**
 * Client-side fallback shown only when the API is unreachable (e.g. static
 * previews). Left empty on purpose — no fake people are shipped. The section
 * simply renders without cards until real testimonials are approved.
 *
 * Public record shape (as served by GET /api/testimonials):
 * {
 *   id: 'uuid',
 *   name: 'Jane Doe',
 *   role: 'Product Manager',
 *   company: 'Acme Inc.',          // optional
 *   linkedinUrl: 'https://...',    // optional
 *   profileImage: 'https://...',   // optional
 *   testimonial: 'Great to work with…',
 *   rating: 5,                     // 1-5
 *   createdAt: '2026-09-24T00:00:00.000Z',
 * }
 */
export const FALLBACK_TESTIMONIALS: PublicTestimonial[] = [];
