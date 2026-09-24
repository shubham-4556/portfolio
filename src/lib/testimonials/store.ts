import {randomUUID} from 'crypto';
import fs from 'fs';
import path from 'path';

import {PublicTestimonial, TestimonialInput, TestimonialRecord, TestimonialStatus, toPublic} from './types';

/**
 * Storage contract. Swap in a PostgreSQL adapter (Prisma/Kysely) behind the
 * same interface later without touching routes or the frontend.
 */
export interface TestimonialStore {
  listPublic(): Promise<PublicTestimonial[]>;
  listAll(): Promise<TestimonialRecord[]>;
  create(input: TestimonialInput): Promise<TestimonialRecord>;
  setStatus(id: string, status: TestimonialStatus): Promise<TestimonialRecord | null>;
  remove(id: string): Promise<boolean>;
}

const seed: TestimonialRecord[] = [
  {
    id: 'seed-frontend-lead',
    name: 'Aarav Sharma',
    email: 'seed+frontend@example.com',
    role: 'Frontend Lead',
    company: 'Nimbus Labs',
    testimonial:
      'Shubham brought the AI support platform to life — the interface is fast, polished, and a joy to use on every device.',
    rating: 5,
    linkedinUrl: 'https://www.linkedin.com/',
    profileImage: undefined,
    status: 'approved',
    createdAt: '2026-08-01T09:00:00.000Z',
    approvedAt: '2026-08-02T09:00:00.000Z',
  },
  {
    id: 'seed-product-manager',
    name: 'Priya Patel',
    email: 'seed+pm@example.com',
    role: 'Product Manager',
    company: 'Cloudly',
    testimonial:
      'Reliable, communicative, and technically precise. The MCP integration work fundamentally improved how our support team operates.',
    rating: 5,
    linkedinUrl: 'https://www.linkedin.com/',
    profileImage: undefined,
    status: 'approved',
    createdAt: '2026-08-05T09:00:00.000Z',
    approvedAt: '2026-08-06T09:00:00.000Z',
  },
  {
    id: 'seed-cto',
    name: 'Rahul Verma',
    email: 'seed+cto@example.com',
    role: 'CTO',
    company: 'Stackline',
    testimonial:
      'A full stack developer who cares about the whole product — from database design to pixel-perfect UI. Highly recommended.',
    rating: 5,
    linkedinUrl: 'https://www.linkedin.com/',
    profileImage: undefined,
    status: 'approved',
    createdAt: '2026-08-12T09:00:00.000Z',
    approvedAt: '2026-08-13T09:00:00.000Z',
  },
];

const STORE_FILE = path.join(process.cwd(), 'data', 'testimonials.json');

class JsonFileStore implements TestimonialStore {
  private cache: TestimonialRecord[] | null = null;

  async listPublic(): Promise<PublicTestimonial[]> {
    const records = (await this.read())
      .filter(record => record.status === 'approved')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return records.map(toPublic);
  }

  async listAll(): Promise<TestimonialRecord[]> {
    return (await this.read())
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async create(input: TestimonialInput): Promise<TestimonialRecord> {
    const record: TestimonialRecord = {
      id: randomUUID(),
      name: input.name,
      email: input.email,
      role: input.role,
      company: input.company ?? '',
      testimonial: input.testimonial,
      rating: input.rating ?? 0,
      ...(input.linkedinUrl ? {linkedinUrl: input.linkedinUrl} : {}),
      ...(input.profileImage ? {profileImage: input.profileImage} : {}),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const records = await this.read();
    records.unshift(record);
    await this.write(records);
    return record;
  }

  async setStatus(id: string, status: TestimonialStatus): Promise<TestimonialRecord | null> {
    const records = await this.read();
    const index = records.findIndex(record => record.id === id);
    if (index === -1) return null;
    const record = records[index];
    const updated = {
      ...record,
      status,
      ...(status === 'approved' ? {approvedAt: new Date().toISOString()} : {}),
    };
    records[index] = updated;
    await this.write(records);
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    const records = await this.read();
    const next = records.filter(record => record.id !== id);
    if (next.length === records.length) return false;
    await this.write(next);
    return true;
  }

  private async read(): Promise<TestimonialRecord[]> {
    if (this.cache) return this.cache;
    try {
      const raw = await fs.promises.readFile(STORE_FILE, 'utf8');
      const parsed = JSON.parse(raw) as TestimonialRecord[];
      this.cache = Array.isArray(parsed) ? parsed : [];
    } catch {
      this.cache = seed.map(item => ({...item}));
      await this.write(this.cache);
    }
    return this.cache;
  }

  private async write(records: TestimonialRecord[]): Promise<void> {
    this.cache = records;
    await fs.promises.mkdir(path.dirname(STORE_FILE), {recursive: true});
    const tmp = `${STORE_FILE}.tmp`;
    await fs.promises.writeFile(tmp, JSON.stringify(records, null, 2), 'utf8');
    await fs.promises.rename(tmp, STORE_FILE);
  }
}

let store: TestimonialStore | null = null;

/** Returns the app-wide store instance. Uses JSON-file storage. */
export function getStore(): TestimonialStore {
  if (!store) {
    store = new JsonFileStore();
    if (process.env.TESTIMONIALS_DSN) {
      console.warn(
        '[testimonials] TESTIMONIALS_DSN is set but the PostgreSQL adapter is not bundled yet; ' +
          'using the JSON-file store. See README to wire a Postgres adapter.',
      );
    }
  }
  return store;
}
