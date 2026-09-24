import {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';

import {adminTokenFromRequest, isAuthorizedAdmin} from '../../../../lib/testimonials/auth';
import {getStore} from '../../../../lib/testimonials/store';

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'PATCH') {
      res.setHeader('Allow', 'PATCH');
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

    const updated = await getStore().setStatus(String(req.query.id ?? ''), 'approved');
    if (!updated) {
      res.status(404).json({success: false, message: 'Testimonial not found.'});
      return;
    }
    res.status(200).json({success: true, id: updated.id, status: updated.status});
  } catch (error) {
    console.error('[testimonials] approve error', error instanceof Error ? error.message : error);
    res.status(500).json({success: false, message: 'Something went wrong.'});
  }
};

export default handler;
