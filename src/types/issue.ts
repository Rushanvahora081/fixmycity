export interface IssueDTO {
  _id?: string;
  title: string;
  description: string;
  location: string;
  status: 'pending' | 'in_progress' | 'solved';
  createdBy: string | { _id?: string; name?: string };
  createdAt: string | Date;
  updatedAt: string | Date;
  photoUrl?: string;
}

export interface CreateIssueInput {
  title: string;
  description: string;
  location: string;
  createdBy: string;
  photoUrl?: string;
}

export interface UpdateIssueInput {
  status?: 'pending' | 'in_progress' | 'solved';
  title?: string;
  description?: string;
  location?: string;
}


