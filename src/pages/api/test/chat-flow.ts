import { NextApiRequest, NextApiResponse } from 'next';

/**
 * DISABLED: Chatbot test endpoint
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({ 
    success: true, 
    message: 'Chatbot backend is currently disabled' 
  });
}