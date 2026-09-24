import crypto from 'crypto';
import type {NextApiRequest} from 'next';

/**
 * Constant-time check of the admin token (configured via TESTIMONIALS_ADMIN_TOKEN).
 * Protects approve / reject / delete operations. The token must NEVER be bundled
 * into client code — it only ever lives in this server module / env.
 */
export function isAuthorizedAdmin(token: string | null | undefined): boolean {
  const expected = process.env.TESTIMONIALS_ADMIN_TOKEN;
  if (!expected || !token) return false;
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(token);
  if (expectedBuffer.length !== providedBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
}

/** Reads the admin token from the x-admin-token header or admin_token query. */
export function adminTokenFromRequest(req: NextApiRequest): string | undefined {
  const header = req.headers['x-admin-token'];
  if (typeof header === 'string' && header.length > 0) return header;
  const query = req.query.admin_token;
  return typeof query === 'string' && query.length > 0 ? query : undefined;
}
