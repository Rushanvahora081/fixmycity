export interface UserDTO {
  _id?: string;
  name: string;
  email: string;
  role: 'citizen' | 'municipal' | 'admin';
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: 'citizen' | 'municipal' | 'admin';
}


