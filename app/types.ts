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
  category?: 'upcoming' | 'current' | 'past';
  additionalInfo?: string;
  registrationLink?: string;
}

export type Feedback = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}; 