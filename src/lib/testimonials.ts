import { connectDB } from '@/lib/mongodb';
import { Testimonial } from '@/models/Testimonial';

export interface PublicTestimonial {
  id: string;
  text: string;
  name: string;
  source: string | null;
  rating: number | null;
}

export async function fetchApprovedTestimonials(limit: number = 3): Promise<PublicTestimonial[]> {
  try {
    await connectDB();

    const docs = await Testimonial.find({ status: 'approved' })
      .sort({ approvedAt: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    const list = Array.isArray(docs) ? docs : [];

    return list.map((doc: any) => ({
      id: String(doc._id),
      text: String((doc.testimonial || '').toString()).trim(),
      name: String((doc.clientName || 'Anonymous').toString()).trim() || 'Anonymous',
      source: doc.source ? String(doc.source).trim() : null,
      rating: typeof doc.rating === 'number' ? doc.rating : doc.rating != null ? Number(doc.rating) : null,
    }));
  } catch (err) {
    return [];
  }
}


