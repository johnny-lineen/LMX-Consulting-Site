import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { generateToken, setTokenCookie } from '@/utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user);

    // Set cookie
    setTokenCookie(res, token);

    // Return user data (password excluded by toJSON method)
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}