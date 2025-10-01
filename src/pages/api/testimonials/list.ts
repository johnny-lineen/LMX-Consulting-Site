import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Testimonial } from '@/models/Testimonial';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const statusParam = (req.query.status as string) || 'approved';
    const limitParam = Math.min(parseInt((req.query.limit as string) || '15', 10) || 15, 50);
    const skipParam = Math.max(parseInt((req.query.skip as string) || '0', 10) || 0, 0);

    const query: any = { status: statusParam };

    // Sorting
    let sort: any = { createdAt: -1 };
    if (statusParam === 'approved') {
      sort = { approvedAt: -1, createdAt: -1 };
    }

    const [items, total] = await Promise.all([
      Testimonial.find(query)
        .select('_id clientName email testimonial rating source status createdAt approvedAt userModel userRef')
        .sort(sort)
        .skip(skipParam)
        .limit(limitParam)
        .lean(),
      Testimonial.countDocuments(query)
    ]);

    const nextSkip = skipParam + items.length;
    const hasMore = nextSkip < total;

    return res.status(200).json({ success: true, items, total, nextSkip: hasMore ? nextSkip : undefined });
  } catch (error: unknown) {
    console.error('[testimonials/list] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


