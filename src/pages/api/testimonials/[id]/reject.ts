import {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';

import {handleReject} from '../../../../lib/testimonials/moderation';

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await handleReject(req, res);
};

export default handler;
