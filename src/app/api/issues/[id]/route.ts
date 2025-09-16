import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { mockDeleteIssue, mockUpdateIssue } from '@/lib/mockData';
import { Issue, UpdateIssueData } from '@/models/Issue';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data: UpdateIssueData = await request.json();
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid issue ID' }, { status: 400 });
    }

    try {
      const { db } = await connectToDatabase();
      const issuesCollection = db.collection<Issue>('issues');
      
      const updateData = {
        ...data,
        updatedAt: new Date()
      };

      const result = await issuesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true });
    } catch (e) {
      const ok = mockUpdateIssue(id, data);
      if (!ok) return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Update issue error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid issue ID' }, { status: 400 });
    }

    try {
      const { db } = await connectToDatabase();
      const issuesCollection = db.collection<Issue>('issues');
      
      const result = await issuesCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true });
    } catch (e) {
      const ok = mockDeleteIssue(id);
      if (!ok) return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Delete issue error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
