import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {randomUUID} from 'crypto';
import {NextApiHandler, NextApiResponse} from 'next';

import {isRateLimited, resolveIp} from '../../../lib/testimonials/rateLimit';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const BUCKET = 'testimonial-photos';

interface UploadPayload {
  name: string;
  mimeType: string;
  size: number;
}

function respond(res: NextApiResponse, status: number, body: Record<string, unknown>): void {
  res.status(status).json(body);
}

function s3Client(): S3Client | null {
  const {AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ENDPOINT_URL_S3} = process.env;
  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_ENDPOINT_URL_S3) return null;
  return new S3Client({
    region: process.env.AWS_REGION,
    forcePathStyle: true,
    // The modern SDK auto-adds a CRC32 checksum of the *signing-time* body to
    // presigned PUTs, which would mismatch the actual bytes the browser sends.
    // Only attach checksums when the target actually requires one.
    requestChecksumCalculation: 'WHEN_REQUIRED',
  });
}

/**
 * Reserve an object key and hand back a short-lived presigned PUT URL so the
 * browser uploads the photo directly to Neon Object Storage — the raw bytes
 * never pass through the Next.js server. Only the resulting public URL is
 * stored in Postgres.
 */
const uploadHandler: NextApiHandler = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      respond(res, 405, {success: false, error: 'Method not allowed'});
      return;
    }

    if (isRateLimited(`upload:${resolveIp(req.headers)}`, 10, 15 * 60 * 1000)) {
      respond(res, 429, {success: false, error: 'Too many uploads. Please try again later.'});
      return;
    }

    const client = s3Client();
    if (!client) {
      respond(res, 503, {
        success: false,
        error: 'Image storage is not configured on the server yet.',
      });
      return;
    }

    const body = (req.body ?? {}) as Partial<UploadPayload>;
    const mimeType = typeof body.mimeType === 'string' ? body.mimeType.toLowerCase().trim() : '';
    const ext = ALLOWED[mimeType] ?? (typeof body.name === 'string' ? extFromName(body.name) : null);
    const size = typeof body.size === 'number' && Number.isFinite(body.size) ? body.size : NaN;

    if (!ext) {
      respond(res, 400, {success: false, error: 'Only JPG, PNG, and WEBP images are supported.'});
      return;
    }
    if (!Number.isFinite(size) || size <= 0 || size > MAX_IMAGE_BYTES) {
      respond(res, 400, {success: false, error: 'Photo must be no larger than 5 MB.'});
      return;
    }

    const key = `testimonials/${randomUUID()}.${ext}`;
    const uploadUrl = await getSignedUrl(
      client,
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: mimeType || `image/${ext}`,
        ContentLength: size,
        CacheControl: 'public, max-age=31536000, immutable',
      }),
      {expiresIn: 300},
    );

    const endpoint = (process.env.AWS_ENDPOINT_URL_S3 ?? '').replace(/\/+$/, '');
    const publicUrl = `${endpoint}/${BUCKET}/${key}`;
    respond(res, 200, {success: true, key, uploadUrl, publicUrl});
  } catch (error) {
    console.error('[testimonials] upload reservation error', error instanceof Error ? error.message : error);
    respond(res, 500, {success: false, error: 'Something went wrong preparing the upload.'});
  }
};

function extFromName(name: string): string | null {
  const match = /\.(jpe?g|png|webp)$/i.exec(name.trim());
  if (!match) return null;
  return match[1].toLowerCase() === 'jpeg' ? 'jpg' : match[1].toLowerCase();
}

export default uploadHandler;
