import {PublicTestimonial} from './types';

/**
 * Client-side fallback shown only when the API is unreachable (e.g. static
 * previews). Mirrors the seed data used by the JSON store. No emails here.
 */
export const FALLBACK_TESTIMONIALS: PublicTestimonial[] = [
  {
    id: 'fallback-1',
    name: 'Aarav Sharma',
    role: 'Frontend Lead',
    company: 'Nimbus Labs',
    testimonial:
      'Shubham brought the AI support platform to life — the interface is fast, polished, and a joy to use on every device.',
    rating: 5,
    linkedinUrl: 'https://www.linkedin.com/',
    createdAt: '2026-08-01T09:00:00.000Z',
  },
  {
    id: 'fallback-2',
    name: 'Priya Patel',
    role: 'Product Manager',
    company: 'Cloudly',
    testimonial:
      'Reliable, communicative, and technically precise. The MCP integration work fundamentally improved how our support team operates.',
    rating: 5,
    linkedinUrl: 'https://www.linkedin.com/',
    createdAt: '2026-08-05T09:00:00.000Z',
  },
  {
    id: 'fallback-3',
    name: 'Rahul Verma',
    role: 'CTO',
    company: 'Stackline',
    testimonial:
      'A full stack developer who cares about the whole product — from database design to pixel-perfect UI. Highly recommended.',
    rating: 5,
    linkedinUrl: 'https://www.linkedin.com/',
    createdAt: '2026-08-12T09:00:00.000Z',
  },
];
