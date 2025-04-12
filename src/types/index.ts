
export type UserRole = 'worker' | 'employer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  createdAt: string;
}

export interface Worker extends User {
  role: 'worker';
  skills: Skill[];
  availability: Availability[];
  expectedWage?: number;
  ratings: Rating[];
}

export interface Employer extends User {
  role: 'employer';
  companyName: string;
  industry?: string;
  jobs: Job[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level?: 'beginner' | 'intermediate' | 'expert';
}

export interface Availability {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  skillRequired: Skill[];
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  payment: number;
  status: 'open' | 'assigned' | 'completed' | 'cancelled';
  employerId: string;
  workerId?: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  score: number; // 1-5
  comment?: string;
  jobId: string;
  fromId: string; // User ID of person giving rating
  toId: string; // User ID of person receiving rating
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  jobId: string;
  timestamp: string;
  read: boolean;
}
