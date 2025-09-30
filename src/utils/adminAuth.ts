import { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentUser } from './auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function requireAdmin(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const currentUser = getCurrentUser(req);
  
  if (!currentUser) {
    res.status(401).json({ error: 'Authentication required' });
    return false;
  }

  await connectDB();
  const user = await User.findById(currentUser.userId);

  if (!user || user.isAdmin !== true) {
    res.status(403).json({ error: 'Admin access required' });
    return false;
  }

  return true;
}
