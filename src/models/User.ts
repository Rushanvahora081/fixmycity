import { Document, ObjectId } from 'mongodb';

export interface User extends Document {
  _id?: ObjectId;
  name: string;
  email: string;
  role: 'citizen' | 'municipal' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  role: 'citizen' | 'municipal' | 'admin';
}
