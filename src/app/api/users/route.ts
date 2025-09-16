import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User, CreateUserData } from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

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
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
