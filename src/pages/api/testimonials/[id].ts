import {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';

import {adminTokenFromRequest, isAuthorizedAdmin} from '../../../lib/testimonials/auth';
import {getStore} from '../../../lib/testimonials/store';

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'DELETE') {
      res.setHeader('Allow', 'DELETE');
      res.status(405).json({success: false, message: 'Method not allowed'});
      return;
    }

    if (!process.env.TESTIMONIALS_ADMIN_TOKEN) {
      res.status(503).json({success: false, message: 'Admin token not configured on the server.'});
      return;
    }
    if (!isAuthorizedAdmin(adminTokenFromRequest(req))) {
      res.status(401).json({success: false, message: 'Unauthorized.'});
      return;
    }

    const removed = await getStore().remove(String(req.query.id ?? ''));
    if (!removed) {
      res.status(404).json({success: false, message: 'Testimonial not found.'});
      return;
    }
    res.status(200).json({success: true, id: String(req.query.id ?? '')});
  } catch (error) {
    console.error('[testimonials] delete error', error instanceof Error ? error.message : error);
    res.status(500).json({success: false, message: 'Something went wrong.'});
  }
};

export default handler;
