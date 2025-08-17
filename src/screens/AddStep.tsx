import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';
import { ArrowLeft } from 'lucide-react';
import { Status } from '../types';

export const AddStep: React.FC = () => {
  const { milestoneId } = useParams<{ milestoneId: string }>();
  const { rocks, addStep } = useAppContext();
  const navigate = useNavigate();
  
  const rock = rocks.find(r => r.id === milestoneId);
  
  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    status: 'not_started' as Status,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!milestoneId) return;
    
    addStep({
      rockId: milestoneId,
      title: formData.title,
      dueDate: formData.dueDate || undefined,
      status: formData.status,
    });
    
    navigate(`/milestone/${milestoneId}`);
  };

  if (!rock) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardBody className="text-center py-8">
            <p className="text-gray-600 mb-4">Rock not found</p>
            <Link to="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Link to={`/milestone/${milestoneId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Milestone
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add Step</h1>
              <p className="text-gray-600">for "{rock.title}"</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Create Step</h2>
              <p className="text-sm text-gray-600 mt-1">
                Break down your rock into specific, actionable steps
              </p>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardBody className="space-y-6">
                <Input
                  label="Step Title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What specific action will you take?"
                  required
                />
                
                <Input
                  type="date"
                  label="Due Date (Optional)"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  helperText="Set a deadline for this specific step"
                />

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
                  <Button type="submit">Add Step</Button>
                  <Link to={`/milestone/${milestoneId}`}>
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