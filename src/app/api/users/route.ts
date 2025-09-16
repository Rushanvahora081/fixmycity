import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { mockCreateUser, mockGetUsers } from '@/lib/mockData';
import { User, CreateUserData } from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    try {
      const { db } = await connectToDatabase();
      const usersCollection = db.collection<User>('users');
      
      let query: any = {};
      if (role) {
        query.role = role;
      }

      const users = await usersCollection
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      return NextResponse.json({ users });
    } catch (e) {
      const users = mockGetUsers(role || undefined);
      return NextResponse.json({ users });
    }
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: CreateUserData = await request.json();
    
    if (!data.name || !data.email || !data.role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
      const { db } = await connectToDatabase();
      const usersCollection = db.collection<User>('users');
      
      // Check if user already exists
      const existingUser = await usersCollection.findOne({ email: data.email });
      if (existingUser) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
      }

      const user: Omit<User, '_id'> = {
        name: data.name,
        email: data.email,
        role: data.role,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await usersCollection.insertOne(user);
      
      return NextResponse.json({ 
        success: true, 
        user: { ...user, _id: result.insertedId } 
      });
    } catch (e) {
      try {
        const user = mockCreateUser({ name: data.name, email: data.email, role: data.role });
        return NextResponse.json({ success: true, user });
      } catch (err: any) {
        return NextResponse.json({ error: err?.message || 'Failed to create user' }, { status: 400 });
      }
    }
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
