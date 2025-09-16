import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { mockCreateIssue, mockGetIssues } from '@/lib/mockData';
import { Issue, CreateIssueData } from '@/models/Issue';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy');
    const status = searchParams.get('status');
    const role = searchParams.get('role');

    try {
      const { db } = await connectToDatabase();
      const issuesCollection = db.collection<Issue>('issues');
    
    let query: any = {};
    
    // Filter by creator if specified
    if (createdBy) {
      query.createdBy = new ObjectId(createdBy);
    }
    
    // Filter by status if specified
    if (status) {
      query.status = status;
    }

      const issues = await issuesCollection
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

    // Populate user information
      const usersCollection = db.collection('users');
      const issuesWithUsers = await Promise.all(
        issues.map(async (issue) => {
          const user = await usersCollection.findOne({ _id: issue.createdBy });
          return {
            ...issue,
            createdBy: user ? { name: user.name, email: user.email } : null
          };
        })
      );

      return NextResponse.json({ issues: issuesWithUsers });
    } catch (e) {
      const issues = mockGetIssues({
        createdBy: createdBy || undefined,
        status: (status as any) || undefined,
      });
      return NextResponse.json({ issues });
    }
  } catch (error) {
    console.error('Get issues error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: CreateIssueData = await request.json();
    
    if (!data.title || !data.description || !data.location || !data.createdBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
      const { db } = await connectToDatabase();
      const issuesCollection = db.collection<Issue>('issues');
      
      const issue: Omit<Issue, '_id'> = {
        title: data.title,
        description: data.description,
        location: data.location,
        status: 'pending',
        createdBy: new ObjectId(data.createdBy),
        createdAt: new Date(),
        updatedAt: new Date(),
        photoUrl: data.photoUrl
      };

      const result = await issuesCollection.insertOne(issue);
      
      return NextResponse.json({ 
        success: true, 
        issue: { ...issue, _id: result.insertedId } 
      });
    } catch (e) {
      const issue = mockCreateIssue({
        title: data.title,
        description: data.description,
        location: data.location,
        createdBy: data.createdBy,
        photoUrl: data.photoUrl,
      });
      return NextResponse.json({ success: true, issue });
    }
  } catch (error) {
    console.error('Create issue error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
