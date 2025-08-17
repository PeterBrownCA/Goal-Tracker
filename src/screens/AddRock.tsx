import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';
import { ArrowLeft } from 'lucide-react';
import { Status } from '../types';

export const AddRock: React.FC = () => {
  const { goals, addRock } = useAppContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    goalId: '',
    title: '',
    startDate: '',
    dueDate: '',
    status: 'not_started' as Status,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addRock(formData);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Add New Milestone</h1>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Create Milestone</h2>
              <p className="text-sm text-gray-600 mt-1">
                Milestones are your most important priorities that support your goals
              </p>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardBody className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Associated Goal
                  </label>
                  <select
                    value={formData.goalId}
                    onChange={(e) => setFormData(prev => ({ ...prev, goalId: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a goal</option>
                    {goals.map(goal => (
                      <option key={goal.id} value={goal.id}>
                        {goal.title} ({goal.type === 'ninety_day' ? '90-day' : goal.type.replace('_', '-')})
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Milestone Title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What's your most important priority?"
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="date"
                    label="Start Date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                  
                  <Input
                    type="date"
                    label="Due Date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Status }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </CardBody>
              
              <CardFooter>
                <div className="flex space-x-3">
                  <Button type="submit">Create Milestone</Button>
                  <Link to="/dashboard">
                    <Button type="button" variant="outline">Cancel</Button>
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};