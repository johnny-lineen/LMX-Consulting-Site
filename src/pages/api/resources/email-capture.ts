import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Resource } from '@/models/Resource';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { resourceId, email } = req.body;

    if (!resourceId || !email) {
      return res.status(400).json({ error: 'Resource ID and email are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Find the resource
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Check if resource is gated
    if (!resource.gated) {
      return res.status(400).json({ error: 'This resource does not require email capture' });
    }

    // Here you could save the email to a separate collection for lead tracking
    // For now, we'll just return success and the resource access URL
    // In a production system, you might want to:
    // 1. Save the email to a leads/subscribers collection
    // 2. Send a welcome email
    // 3. Track the conversion event
    // 4. Add the user to your email marketing system

    console.log(`Email captured for resource ${resourceId}: ${email}`);

    return res.status(200).json({ 
      success: true,
      message: 'Email captured successfully',
      resourceUrl: resource.fileUrl,
      resourceTitle: resource.title
    });

  } catch (error: unknown) {
    console.error('[ERROR]:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error) console.error(error.stack);
    return res.status(500).json({ error: 'Failed to capture email' });
  }
}
