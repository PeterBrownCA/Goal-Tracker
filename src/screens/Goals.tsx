import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';
import { ArrowLeft, Plus, Edit2, Trash2, Target } from 'lucide-react';
import { Goal, GoalType, Status } from '../types';

export const Goals: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'one_year' as GoalType,
    startDate: '',
    dueDate: '',
    status: 'not_started' as Status,
  });

  const navigate = useNavigate();

  // Auto-calculate due date based on goal type and start date
  const calculateDueDate = (startDate: string, goalType: GoalType): string => {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    let dueDate = new Date(start);
    
    switch (goalType) {
      case 'ninety_day':
        dueDate.setDate(start.getDate() + 90);
        break;
      case 'one_year':
        dueDate.setFullYear(start.getFullYear() + 1);
        break;
      case 'three_year':
        dueDate.setFullYear(start.getFullYear() + 3);
        break;
    }
    
    return dueDate.toISOString().split('T')[0];
  };

  // Handle start date change and auto-calculate due date
  const handleStartDateChange = (startDate: string) => {
    const dueDate = calculateDueDate(startDate, formData.type);
    setFormData(prev => ({ 
      ...prev, 
      startDate, 
      dueDate 
    }));
  };

  // Handle goal type change and auto-calculate due date if start date exists
  const handleGoalTypeChange = (type: GoalType) => {
    const dueDate = formData.startDate ? calculateDueDate(formData.startDate, type) : '';
    setFormData(prev => ({ 
      ...prev, 
      type, 
      dueDate 
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingGoal) {
      updateGoal(editingGoal, formData);
      setEditingGoal(null);
    } else {
      addGoal(formData);
    }
    
    setFormData({
      title: '',
      type: 'one_year',
      startDate: '',
      dueDate: '',
      status: 'not_started',
    });
    setShowForm(false);
  };

  const handleEdit = (goal: Goal) => {
    setFormData({
      title: goal.title,
      type: goal.type,
      startDate: goal.startDate || '',
      dueDate: goal.dueDate || '',
      status: goal.status,
    });
    setEditingGoal(goal.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGoal(null);
    setFormData({
      title: '',
      type: 'one_year',
      startDate: '',
      dueDate: '',
      status: 'not_started',
    });
  };

  const threeYearGoals = goals.filter(goal => goal.type === 'three_year');
  const oneYearGoals = goals.filter(goal => goal.type === 'one_year');
  const ninetyDayGoals = goals.filter(goal => goal.type === 'ninety_day');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
          </div>
          
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          )}
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-lg font-semibold">
                {editingGoal ? 'Edit Goal' : 'Add New Goal'}
              </h2>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardBody className="space-y-4">
                <Input
                  label="Goal Title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter your goal title"
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleGoalTypeChange(e.target.value as GoalType)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="one_year">1-Year Goal</option>
                    <option value="three_year">3-Year Goal</option>
                    <option value="ninety_day">90-Day Goal</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="date"
                    label="Start Date"
                    value={formData.startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                  />
                  
                  <Input
                    type="date"
                    label="Due Date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    helperText="Auto-calculated based on goal type and start date"
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
                  <Button type="submit">
                    {editingGoal ? 'Update Goal' : 'Save'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* Goals List */}
        <div className="space-y-8">
          {goals.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Goals Yet</h3>
                <p className="text-gray-600 mb-6">Start by setting your first goal</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Goal
                </Button>
              </CardBody>
            </Card>
          ) : (
            <>
              {ninetyDayGoals.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">90-Day Goals</h2>
                  <div className="space-y-4">
                    {ninetyDayGoals.map(goal => (
                      <Card key={goal.id}>
                        <CardBody>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  goal.status === 'done' ? 'bg-green-100 text-green-800' :
                                  goal.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {goal.status.replace('_', ' ')}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                {goal.startDate && (
                                  <span>Start: {new Date(goal.startDate).toLocaleDateString()}</span>
                                )}
                                {goal.dueDate && (
                                  <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex space-x-2 ml-4">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(goal)}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => deleteGoal(goal.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {threeYearGoals.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">3-Year Goals</h2>
                  <div className="space-y-4">
                    {threeYearGoals.map(goal => (
                      <Card key={goal.id}>
                        <CardBody>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  goal.status === 'done' ? 'bg-green-100 text-green-800' :
                                  goal.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {goal.status.replace('_', ' ')}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                {goal.startDate && (
                                  <span>Start: {new Date(goal.startDate).toLocaleDateString()}</span>
                                )}
                                {goal.dueDate && (
                                  <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex space-x-2 ml-4">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(goal)}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => deleteGoal(goal.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {oneYearGoals.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">1-Year Goals</h2>
                  <div className="space-y-4">
                    {oneYearGoals.map(goal => (
                      <Card key={goal.id}>
                        <CardBody>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  goal.status === 'done' ? 'bg-green-100 text-green-800' :
                                  goal.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {goal.status.replace('_', ' ')}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                {goal.startDate && (
                                  <span>Start: {new Date(goal.startDate).toLocaleDateString()}</span>
                                )}
                                {goal.dueDate && (
                                  <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex space-x-2 ml-4">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(goal)}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => deleteGoal(goal.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};