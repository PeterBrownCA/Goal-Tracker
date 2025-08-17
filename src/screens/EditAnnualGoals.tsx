import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Goal } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export default function EditAnnualGoals() {
  const { state, dispatch } = useAppContext();
  const [title, setTitle] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = state.currentUser?.id; if (!userId) return alert('Sign in first');
    const goal: Goal = { id: crypto.randomUUID(), userId, type: 'one_year', title, status: 'in_progress' };
    dispatch({ type: 'ADD_GOAL', goal });
    setTitle('');
  };
  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="flex gap-2">
        <Input placeholder="e.g., Grow revenue 20%" value={title} onChange={e=>setTitle(e.target.value)} />
        <Button type="submit">Add Goal</Button>
      </form>
      <ul className="space-y-2">
        {state.goals.map(g => <li key={g.id} className="border rounded p-2">{g.title}</li>)}
      </ul>
    </div>
  );
}