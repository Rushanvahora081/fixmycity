import { Document, ObjectId } from 'mongodb';

export interface Issue extends Document {
  _id?: ObjectId;
  title: string;
  description: string;
  location: string;
  status: 'pending' | 'in_progress' | 'solved';
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  photoUrl?: string;
}

export interface CreateIssueData {
  title: string;
  description: string;
  location: string;
  createdBy: string;
  photoUrl?: string;
}

export interface UpdateIssueData {
  status?: 'pending' | 'in_progress' | 'solved';
  title?: string;
  description?: string;
  location?: string;
}
