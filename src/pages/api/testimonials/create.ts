import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Testimonial } from '@/models/Testimonial';
import { User } from '@/models/User';
import TestimonialUser from '@/models/TestimonialUser';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { clientName, email, testimonial, rating, source } = req.body || {};

    if (!clientName || !email || !testimonial) {
      return res.status(400).json({ error: 'clientName, email, and testimonial are required' });
    }

    if (rating !== undefined) {
      const parsedRating = Number(rating);
      if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return res.status(400).json({ error: 'rating must be a number between 1 and 5' });
      }
    }

    await connectDB();

    // Determine reference target: User or TestimonialUser
    const normalizedEmail = String(email).toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail }).lean();

    let userModel: 'User' | 'TestimonialUser';
    let userRef;

    if (existingUser) {
      userModel = 'User';
      userRef = existingUser._id;
    } else {
      // Find or create testimonial-only user
      let tUser = await TestimonialUser.findOne({ email: normalizedEmail });
      if (!tUser) {
        try {
          tUser = await TestimonialUser.create({ name: String(clientName).trim(), email: normalizedEmail });
        } catch (e: any) {
          if (e && e.code === 11000) {
            tUser = await TestimonialUser.findOne({ email: normalizedEmail });
          } else {
            throw e;
          }
        }
      }
      userModel = 'TestimonialUser';
      userRef = tUser!._id;
    }

    const doc = await Testimonial.create({
      userModel,
      userRef,
      clientName: String(clientName).trim(),
      email: normalizedEmail,
      testimonial: String(testimonial).trim(),
      rating: rating !== undefined ? Number(rating) : undefined,
      source: source ? String(source).trim() : 'consultation',
      status: 'pending'
    });

    return res.status(200).json({ success: true, testimonialId: doc._id, userModel, userRef });
  } catch (error: unknown) {
    console.error('[testimonials/create] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


