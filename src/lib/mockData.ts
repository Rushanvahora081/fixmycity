import { randomUUID } from 'crypto';

type IssueStatus = 'pending' | 'in_progress' | 'solved';

export interface MockUser {
  _id: string;
  name: string;
  email: string;
  role: 'citizen' | 'municipal' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface MockIssue {
  _id: string;
  title: string;
  description: string;
  location: string;
  status: IssueStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  photoUrl?: string;
}

const now = () => new Date().toISOString();

// Seed data once per process
const seedUsers: MockUser[] = [
  { _id: randomUUID(), name: 'John Doe', email: 'john.doe@example.com', role: 'citizen', createdAt: now(), updatedAt: now() },
  { _id: randomUUID(), name: 'Jane Smith', email: 'jane.smith@municipal.gov', role: 'municipal', createdAt: now(), updatedAt: now() },
  { _id: randomUUID(), name: 'Admin User', email: 'admin@fixmycity.gov', role: 'admin', createdAt: now(), updatedAt: now() },
  { _id: randomUUID(), name: 'Mike Johnson', email: 'mike.johnson@municipal.gov', role: 'municipal', createdAt: now(), updatedAt: now() },
  { _id: randomUUID(), name: 'Sarah Wilson', email: 'sarah.wilson@example.com', role: 'citizen', createdAt: now(), updatedAt: now() }
];

const U0 = seedUsers[0]._id;
const U4 = seedUsers[4]._id;

const seedIssues: MockIssue[] = [
  { _id: randomUUID(), title: 'Pothole on Main Street', description: 'Large pothole causing damage to vehicles. Located near the intersection of Main Street and Oak Avenue.', location: 'Main Street & Oak Avenue', status: 'pending', createdBy: U0, createdAt: new Date(Date.now() - 5 * 864e5).toISOString(), updatedAt: new Date(Date.now() - 5 * 864e5).toISOString(), photoUrl: 'https://via.placeholder.com/400x300?text=Pothole+Photo' },
  { _id: randomUUID(), title: 'Broken Street Light', description: 'Street light has been flickering and completely went out last night. Safety concern for pedestrians.', location: '123 Elm Street', status: 'in_progress', createdBy: U0, createdAt: new Date(Date.now() - 3 * 864e5).toISOString(), updatedAt: new Date(Date.now() - 1 * 864e5).toISOString(), photoUrl: 'https://via.placeholder.com/400x300?text=Street+Light+Photo' },
  { _id: randomUUID(), title: 'Garbage Collection Missed', description: 'Garbage was not collected on our street this week. Bins are overflowing.', location: '456 Pine Street', status: 'solved', createdBy: U4, createdAt: new Date(Date.now() - 7 * 864e5).toISOString(), updatedAt: new Date(Date.now() - 2 * 864e5).toISOString(), photoUrl: 'https://via.placeholder.com/400x300?text=Garbage+Photo' }
];

const db = {
  users: [...seedUsers] as MockUser[],
  issues: [...seedIssues] as MockIssue[],
};

export function mockGetUsers(role?: string) {
  const users = role ? db.users.filter(u => u.role === role) : db.users;
  return users.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function mockCreateUser(input: { name: string; email: string; role: MockUser['role'] }) {
  if (db.users.some(u => u.email === input.email)) {
    throw new Error('User with this email already exists');
  }
  const user: MockUser = { _id: randomUUID(), name: input.name, email: input.email, role: input.role, createdAt: now(), updatedAt: now() };
  db.users.unshift(user);
  return user;
}

export function mockDeleteUser(userId: string) {
  const before = db.users.length;
  db.users = db.users.filter(u => u._id !== userId);
  return db.users.length !== before;
}

export function mockGetIssues(filter: { createdBy?: string; status?: IssueStatus } = {}) {
  let issues = db.issues.slice();
  if (filter.createdBy) issues = issues.filter(i => i.createdBy === filter.createdBy);
  if (filter.status) issues = issues.filter(i => i.status === filter.status);
  const usersById = new Map(db.users.map(u => [u._id, u]));
  return issues
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(i => ({
      ...i,
      createdBy: usersById.get(i.createdBy)?.name ? { name: usersById.get(i.createdBy)!.name, email: usersById.get(i.createdBy)!.email } : null,
    }));
}

export function mockCreateIssue(input: { title: string; description: string; location: string; createdBy: string; photoUrl?: string }) {
  const issue: MockIssue = {
    _id: randomUUID(),
    title: input.title,
    description: input.description,
    location: input.location,
    status: 'pending',
    createdBy: input.createdBy,
    createdAt: now(),
    updatedAt: now(),
    photoUrl: input.photoUrl,
  };
  db.issues.unshift(issue);
  return issue;
}

export function mockUpdateIssue(id: string, update: Partial<Pick<MockIssue, 'status' | 'title' | 'description' | 'location'>>) {
  const idx = db.issues.findIndex(i => i._id === id);
  if (idx === -1) return false;
  db.issues[idx] = { ...db.issues[idx], ...update, updatedAt: now() };
  return true;
}

export function mockDeleteIssue(id: string) {
  const before = db.issues.length;
  db.issues = db.issues.filter(i => i._id !== id);
  return db.issues.length !== before;
}


