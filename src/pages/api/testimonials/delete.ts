import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Testimonial } from '@/models/Testimonial';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { testimonialId } = req.body || {};
    if (!testimonialId) {
      return res.status(400).json({ error: 'testimonialId is required' });
    }

    await connectDB();

    const deleted = await Testimonial.findByIdAndDelete(testimonialId);
    if (!deleted) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    return res.status(200).json({ success: true });
  } catch (error: unknown) {
    console.error('[ERROR]:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error) console.error(error.stack);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


