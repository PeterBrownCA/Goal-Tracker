import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { AppState, Goal, Rock, Step, Metric, ID, Status, User, AppContextType } from '../types';

interface StoredUser {
  id: string;
  email: string;
  password: string;
  displayName?: string;
}

type Action =
  | { type: 'SIGN_IN'; email: string; displayName?: string }
  | { type: 'SIGN_OUT' }
  | { type: 'SIGN_UP'; email: string; password: string; displayName?: string }
  | { type: 'ADD_GOAL'; goal: Goal }
  | { type: 'UPDATE_GOAL'; id: ID; updates: Partial<Goal> }
  | { type: 'DELETE_GOAL'; id: ID }
  | { type: 'ADD_ROCK'; rock: Rock }
  | { type: 'UPDATE_ROCK'; id: ID; updates: Partial<Rock> }
  | { type: 'DELETE_ROCK'; id: ID }
  | { type: 'ADD_STEP'; step: Step }
  | { type: 'UPDATE_STEP'; id: ID; updates: Partial<Step> }
  | { type: 'DELETE_STEP'; id: ID }
  | { type: 'UPDATE_STEP_STATUS'; stepId: ID; status: Status }
  | { type: 'ADD_METRIC'; metric: Metric }
  | { type: 'UPDATE_METRIC'; id: ID; updates: Partial<Metric> }
  | { type: 'DELETE_METRIC'; id: ID };

const initial: AppState = { goals: [], rocks: [], steps: [], metrics: [] };
const VERSION = 'v1';
const STORAGE_KEY = `gpp:${VERSION}:state`;
const USERS_KEY   = `gpp:${VERSION}:users`;
const uid = () => crypto.randomUUID();

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function load(): AppState {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '') as AppState } catch { return initial }
}
function save(state: AppState) { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function loadUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as StoredUser[] } catch { return [] }
}
function saveUsers(users: StoredUser[]) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SIGN_IN':
      return { ...state, currentUser: action.user };
    case 'SIGN_UP':
      return { ...state, currentUser: action.user };
    case 'SIGN_OUT': 
      return { ...state, currentUser: undefined };
    case 'ADD_GOAL': 
      return { ...state, goals: [action.goal, ...state.goals] };
    case 'UPDATE_GOAL': 
      return { 
        ...state, 
        goals: state.goals.map(g => g.id === action.id ? { ...g, ...action.updates } : g) 
      };
    case 'DELETE_GOAL': 
      return { 
        ...state, 
        goals: state.goals.filter(g => g.id !== action.id),
        rocks: state.rocks.filter(r => r.goalId !== action.id),
        steps: state.steps.filter(s => !state.rocks.some(r => r.goalId === action.id && r.id === s.rockId))
      };
    case 'ADD_ROCK': 
      return { ...state, rocks: [action.rock, ...state.rocks] };
    case 'UPDATE_ROCK': 
      return { 
        ...state, 
        rocks: state.rocks.map(r => r.id === action.id ? { ...r, ...action.updates } : r) 
      };
    case 'DELETE_ROCK': 
      return { 
        ...state, 
        rocks: state.rocks.filter(r => r.id !== action.id),
        steps: state.steps.filter(s => s.rockId !== action.id)
      };
    case 'ADD_STEP': 
      return { ...state, steps: [action.step, ...state.steps] };
    case 'UPDATE_STEP': 
      return { 
        ...state, 
        steps: state.steps.map(s => s.id === action.id ? { ...s, ...action.updates } : s) 
      };
    case 'DELETE_STEP': 
      return { 
        ...state, 
        steps: state.steps.filter(s => s.id !== action.id) 
      };
    case 'UPDATE_STEP_STATUS': {
      const updatedSteps = state.steps.map(s => s.id === action.stepId ? { ...s, status: action.status } : s);
      
      // Find the rock that contains this step
      const step = state.steps.find(s => s.id === action.stepId);
      if (!step) return { ...state, steps: updatedSteps };
      
      const rock = state.rocks.find(r => r.id === step.rockId);
      if (!rock) return { ...state, steps: updatedSteps };
      
      // Get all steps for this rock
      const rockSteps = updatedSteps.filter(s => s.rockId === rock.id);
      const completedSteps = rockSteps.filter(s => s.status === 'done');
      
      // Update rock status based on step completion
      let newRockStatus = rock.status;
      if (rockSteps.length > 0) {
        if (completedSteps.length === rockSteps.length) {
          newRockStatus = 'done';
        } else if (completedSteps.length > 0) {
          newRockStatus = 'in_progress';
        } else {
          newRockStatus = 'not_started';
        }
      }
      
      const updatedRocks = state.rocks.map(r => 
        r.id === rock.id ? { ...r, status: newRockStatus } : r
      );
      
      return { ...state, steps: updatedSteps, rocks: updatedRocks };
    }
    case 'ADD_METRIC': 
      return { ...state, metrics: [action.metric, ...state.metrics] };
    case 'UPDATE_METRIC': 
      return { 
        ...state, 
        metrics: state.metrics.map(m => m.id === action.id ? { ...m, ...action.updates } : m) 
      };
    case 'DELETE_METRIC': 
      return { 
        ...state, 
        metrics: state.metrics.filter(m => m.id !== action.id) 
      };
    default: 
      return state;
  }
}

// selectors & computed progress
function percentDone(steps: Step[]) {
  if (!steps.length) return 0;
  const done = steps.filter(s => s.status === 'done').length;
  return Math.round((done / steps.length) * 100);
}

function goalProgressWeighted(goalId: string, state: AppState) {
  const milestones = state.rocks.filter(r => r.goalId === goalId);
  let totalSteps = 0, totalDone = 0;
  for (const m of milestones) {
    const mSteps = state.steps.filter(s => s.rockId === m.id);
    totalSteps += mSteps.length;
    totalDone  += mSteps.filter(s => s.status === 'done').length;
  }
  return totalSteps ? Math.round((totalDone / totalSteps) * 100) : 0;
}

export function useProgress(state: AppState) {
  const rockProgress = useMemo(() => {
    const map: Record<ID, number> = {};
    for (const rock of state.rocks) {
      const steps = state.steps.filter(s => s.rockId === rock.id);
      map[rock.id] = percentDone(steps);
    }
    return map;
  }, [state.rocks, state.steps]);

  const goalProgress = useMemo(() => {
    const map: Record<ID, number> = {};
    for (const goal of state.goals) {
      map[goal.id] = goalProgressWeighted(goal.id, state);
    }
    return map;
  }, [state.goals, state.rocks, state.steps]);

  return { rockProgress, goalProgress };
}

const AppCtx = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  const [users, setUsers] = React.useState<StoredUser[]>(loadUsers);
  const { rockProgress } = useProgress(state);
  
  useEffect(() => save(state), [state]);
  useEffect(() => saveUsers(users), [users]);

  // Filter data by current user
  const currentUserId = state.currentUser?.id;
  const userGoals = state.goals.filter(goal => goal.userId === currentUserId);
  const userRocks = state.rocks.filter(rock => {
    const goal = state.goals.find(g => g.id === rock.goalId);
    return goal?.userId === currentUserId;
  }).map(rock => ({
    ...rock,
    progress: rockProgress[rock.id] || 0
  }));
  const userSteps = state.steps.filter(step => {
    const rock = state.rocks.find(r => r.id === step.rockId);
    const goal = state.goals.find(g => g.id === rock?.goalId);
    return goal?.userId === currentUserId;
  });
  const userMetrics = state.metrics.filter(metric => metric.userId === currentUserId);
  const contextValue: AppContextType = {
    user: state.currentUser || null,
    goals: userGoals,
    rocks: userRocks,
    steps: userSteps,
    metrics: userMetrics,
    signIn: async (email: string, password: string) => {
      if (!email || !password) return false;
      const hash = await sha256(password);
      const user = users.find(u => u.email === email && (u.password === hash || u.password === password));
      if (user) {
        // Migrate plain text password to hashed if needed
        if (user.password === password) {
          const updatedUser = { ...user, password: hash };
          setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
        }
        dispatch({ type: 'SIGN_IN', user: { id: user.id, email: user.email, displayName: user.displayName }});
        return true;
      }
      return false;
    },
    signUp: async (email: string, password: string, displayName: string) => {
      if (users.find(u => u.email === email)) return false;
      const newUser: StoredUser = { id: uid(), email, password: await sha256(password), displayName };
      setUsers(prev => [...prev, newUser]);
      dispatch({ type: 'SIGN_UP', user: { id: newUser.id, email, displayName }});
      return true;
    },
    signOut: () => {
      dispatch({ type: 'SIGN_OUT' });
    },
    addGoal: (goal: Omit<Goal, 'id' | 'userId'>) => {
      const newGoal: Goal = {
        ...goal,
        id: uid(),
        userId: state.currentUser?.id || ''
      };
      dispatch({ type: 'ADD_GOAL', goal: newGoal });
    },
    updateGoal: (id: string, updates: Partial<Goal>) => {
      dispatch({ type: 'UPDATE_GOAL', id, updates });
    },
    deleteGoal: (id: string) => {
      dispatch({ type: 'DELETE_GOAL', id });
    },
    addRock: (rock: Omit<Rock, 'id' | 'progress'>) => {
      const newRock: Rock = {
        ...rock,
        id: uid()
      };
      dispatch({ type: 'ADD_ROCK', rock: newRock });
    },
    updateRock: (id: string, updates: Partial<Rock>) => {
      dispatch({ type: 'UPDATE_ROCK', id, updates });
    },
    deleteRock: (id: string) => {
      dispatch({ type: 'DELETE_ROCK', id });
    },
    addStep: (step: Omit<Step, 'id'>) => {
      const newStep: Step = {
        ...step,
        id: uid()
      };
      dispatch({ type: 'ADD_STEP', step: newStep });
    },
    updateStep: (id: string, updates: Partial<Step>) => {
      dispatch({ type: 'UPDATE_STEP', id, updates });
    },
    deleteStep: (id: string) => {
      dispatch({ type: 'DELETE_STEP', id });
    },
    addMetric: (metric: Omit<Metric, 'id'>) => {
      const newMetric: Metric = {
        ...metric,
        id: uid(),
        userId: state.currentUser?.id || ''
      };
      dispatch({ type: 'ADD_METRIC', metric: newMetric });
    },
    updateMetric: (id: string, updates: Partial<Metric>) => {
      dispatch({ type: 'UPDATE_METRIC', id, updates });
    },
    deleteMetric: (id: string) => {
      dispatch({ type: 'DELETE_METRIC', id });
    }
  };

  return <AppCtx.Provider value={contextValue}>{children}</AppCtx.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}