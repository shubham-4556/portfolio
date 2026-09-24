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

/**
 * Record format for one testimonial. No pre-seeded examples are shipped;
 * the store starts empty and grows from approved submissions.
 *
 * Example shape:
 * {
 *   id: 'uuid',                      // generated
 *   name: 'Jane Doe',                // required
 *   email: 'jane@example.com',       // required, moderation only (never public)
 *   role: 'Product Manager',         // required
 *   company: 'Acme Inc.',            // optional
 *   linkedinUrl: 'https://...',      // optional
 *   profileImage: 'https://...',     // optional
 *   testimonial: 'Great to work with…', // required
 *   rating: 5,                       // required, 1-5
 *   status: 'pending',               // 'pending' | 'approved' | 'rejected'
 *   createdAt: '2026-09-24T00:00:00.000Z',
 *   approvedAt: undefined,           // set when approved
 * }
 */

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
      this.cache = [];
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
