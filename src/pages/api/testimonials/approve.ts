import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Testimonial } from '@/models/Testimonial';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { testimonialId, status } = req.body || {} as { testimonialId?: string; status?: 'approved' | 'rejected' };

    if (!testimonialId || !status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'testimonialId and valid status are required' });
    }

    // Placeholder admin check: replace with real auth later
    // e.g., const user = getCurrentUser(req); if (!user?.isAdmin) return res.status(403)...

    await connectDB();

    const update: any = { status };
    if (status === 'approved') {
      update.approvedAt = new Date();
    } else {
      update.approvedAt = null;
    }

    const updated = await Testimonial.findByIdAndUpdate(
      testimonialId,
      { $set: update },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    return res.status(200).json({ success: true, testimonial: updated });
  } catch (error: unknown) {
    console.error('[testimonials/approve] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


