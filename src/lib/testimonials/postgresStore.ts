import {randomUUID} from 'crypto';
import {Pool} from 'pg';

import {TestimonialStore} from './store';
import {PublicTestimonial, TestimonialInput, TestimonialRecord, TestimonialStatus, toPublic} from './types';

interface TestimonialRow {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  linkedin_url: string | null;
  profile_image: string | null;
  testimonial: string;
  rating: number;
  status: TestimonialStatus;
  created_at: Date;
  approved_at: Date | null;
}

function toRecord(row: TestimonialRow): TestimonialRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    company: row.company,
    linkedinUrl: row.linkedin_url ?? undefined,
    profileImage: row.profile_image ?? undefined,
    testimonial: row.testimonial,
    rating: row.rating,
    status: row.status,
    createdAt: row.created_at.toISOString(),
    approvedAt: row.approved_at ? row.approved_at.toISOString() : undefined,
  };
}

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS testimonials (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL,
    role          TEXT NOT NULL,
    company       TEXT NOT NULL DEFAULT '',
    linkedin_url  TEXT,
    profile_image TEXT,
    testimonial   TEXT NOT NULL,
    rating        SMALLINT NOT NULL DEFAULT 0,
    status        TEXT NOT NULL DEFAULT 'pending',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    approved_at   TIMESTAMPTZ
  );
  CREATE INDEX IF NOT EXISTS testimonials_status_idx ON testimonials (status);
`;

/** Postgres-backed store. Uses TESTIMONIALS_DSN; table is created on first use. */
export class PostgresStore implements TestimonialStore {
  private readonly pool: Pool;
  private schemaReady: Promise<void> | null = null;

  constructor(dsn: string) {
    this.pool = new Pool({connectionString: dsn, max: 5});
  }

  async listPublic(): Promise<PublicTestimonial[]> {
    await this.ensureSchema();
    const {rows} = await this.pool.query<TestimonialRow>(
      'SELECT * FROM testimonials WHERE status = $1 ORDER BY created_at DESC',
      ['approved'],
    );
    return rows.map(row => toPublic(toRecord(row)));
  }

  async listAll(): Promise<TestimonialRecord[]> {
    await this.ensureSchema();
    const {rows} = await this.pool.query<TestimonialRow>('SELECT * FROM testimonials ORDER BY created_at DESC');
    return rows.map(toRecord);
  }

  async create(input: TestimonialInput): Promise<TestimonialRecord> {
    await this.ensureSchema();
    const {rows} = await this.pool.query<TestimonialRow>(
      `INSERT INTO testimonials (
         id, name, email, role, company, linkedin_url, profile_image, testimonial, rating, status, created_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', now())
       RETURNING *`,
      [
        randomUUID(),
        input.name,
        input.email,
        input.role,
        input.company ?? '',
        input.linkedinUrl ?? null,
        input.profileImage ?? null,
        input.testimonial,
        input.rating ?? 0,
      ],
    );
    return toRecord(rows[0]);
  }

  async setStatus(id: string, status: TestimonialStatus): Promise<TestimonialRecord | null> {
    await this.ensureSchema();
    const {rows} = await this.pool.query<TestimonialRow>(
      `UPDATE testimonials
       SET status = $2, approved_at = CASE WHEN $2 = 'approved' THEN now() ELSE approved_at END
       WHERE id = $1
       RETURNING *`,
      [id, status],
    );
    return rows.length ? toRecord(rows[0]) : null;
  }

  async remove(id: string): Promise<boolean> {
    await this.ensureSchema();
    const {rowCount} = await this.pool.query('DELETE FROM testimonials WHERE id = $1', [id]);
    return (rowCount ?? 0) > 0;
  }

  private ensureSchema(): Promise<void> {
    if (!this.schemaReady) {
      this.schemaReady = this.pool
        .query(SCHEMA_SQL)
        .then(() => undefined)
        .catch(error => {
          console.error(
            '[testimonials] failed to ensure postgres schema',
            error instanceof Error ? error.message : error,
          );
          throw error;
        });
    }
    return this.schemaReady;
  }
}
