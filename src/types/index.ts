export type ID = string;
export type Status = 'not_started' | 'in_progress' | 'done';
export type GoalType = 'three_year' | 'one_year' | 'ninety_day';

export interface User {
  id: ID;
  email: string;
  displayName?: string;
}

export interface Step {
  id: ID;
  rockId: ID;
  title: string;
  dueDate?: string;
  status: Status;
}

export interface Rock {
  id: ID;
  goalId: ID;
  title: string;
  startDate?: string;
  dueDate?: string;
  status: Status;
  progress?: number; // 0-100 computed from steps
}

export interface Goal {
  id: ID;
  userId: ID;
  type: GoalType;
  title: string;
  startDate?: string;
  dueDate?: string;
  status: Status;
}

export interface Metric {
  id: ID;
  userId: ID;
  name: string;   // e.g., "Monthly Revenue"
  unit: string;   // e.g., "$"
  target: number;
  current: number;
  period: 'weekly' | 'monthly';
}

export interface AppState {
  currentUser?: User;
  goals: Goal[];
  rocks: Rock[];
  steps: Step[];
  metrics: Metric[];
  users: any[]; // For compatibility, not used in new implementation
}

export interface AppContextType {
  user: User | null;
  goals: Goal[];
  rocks: Rock[];
  steps: Step[];
  metrics: Metric[];
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, displayName: string) => Promise<boolean>;
  signOut: () => void;
  addGoal: (goal: Omit<Goal, 'id' | 'userId'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addRock: (rock: Omit<Rock, 'id' | 'progress'>) => void;
  updateRock: (id: string, updates: Partial<Rock>) => void;
  deleteRock: (id: string) => void;
  addStep: (step: Omit<Step, 'id'>) => void;
  updateStep: (id: string, updates: Partial<Step>) => void;
  deleteStep: (id: string) => void;
  addMetric: (metric: Omit<Metric, 'id'>) => void;
  updateMetric: (id: string, updates: Partial<Metric>) => void;
  deleteMetric: (id: string) => void;
}