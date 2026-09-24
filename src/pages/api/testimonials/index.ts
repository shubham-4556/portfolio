import {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';

import {notifySubmission} from '../../../lib/testimonials/notify';
import {isRateLimited, resolveIp} from '../../../lib/testimonials/rateLimit';
import {getStore} from '../../../lib/testimonials/store';
import {validateTestimonial} from '../../../lib/testimonials/validation';

function respond(res: NextApiResponse, status: number, body: Record<string, unknown>): void {
  res.status(status).json(body);
}

const createHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const store = getStore();
      const testimonials = await store.listPublic();
      respond(res, 200, {success: true, testimonials});
      return;
    }

    if (req.method === 'POST') {
      if (isRateLimited(`post:${resolveIp(req.headers)}`, 3, 15 * 60 * 1000)) {
        respond(res, 429, {success: false, message: 'Too many submissions. Please try again later.'});
        return;
      }

      const result = validateTestimonial(req.body);
      if (!result.ok || !result.value) {
        respond(res, 400, {success: false, errors: result.errors});
        return;
      }

      const store = getStore();
      const record = await store.create(result.value);
      await notifySubmission(record);

      respond(res, 201, {
        success: true,
        id: record.id,
        message:
          'Thank you! Your testimonial has been submitted successfully and will be reviewed before being published.',
      });
      return;
    }

    res.setHeader('Allow', 'GET, POST');
    respond(res, 405, {success: false, message: 'Method not allowed'});
  } catch (error) {
    console.error('[testimonials] error handling request', error instanceof Error ? error.message : error);
    respond(res, 500, {success: false, message: 'Something went wrong. Please try again.'});
  }
};

export default createHandler;
