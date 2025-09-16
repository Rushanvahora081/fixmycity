import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, role } = await request.json();
    
    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection<User>('users');
    
    // Find user by email and role
    const user = await usersCollection.findOne({ email, role });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Simple session simulation - in a real app, use proper JWT or session management
    const sessionData = {
      userId: user._id?.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };

    return NextResponse.json({ 
      success: true, 
      user: sessionData 
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
