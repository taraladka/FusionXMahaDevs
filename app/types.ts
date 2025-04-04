export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description: string;
  image: string;
  capacity?: number;
  registeredUsers?: number;
  category?: 'upcoming' | 'current' | 'past';
  isDeleted?: boolean;
}

export type Feedback = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string | Date;
  userId?: string | null;
}; 