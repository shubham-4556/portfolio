import {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';

import {handleApprove} from '../../../../lib/testimonials/moderation';

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await handleApprove(req, res);
};

export default handler;
