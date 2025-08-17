import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/Button';
import { Card, CardHeader, CardBody } from '../components/Card';
import { ArrowLeft, Plus, Check, Circle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export const ViewRock: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { goals, rocks, steps, deleteRock, updateStep, deleteStep } = useAppContext();
  const navigate = useNavigate();
  
  const rock = rocks.find(r => r.id === id);
  const goal = rock ? goals.find(g => g.id === rock.goalId) : null;
  const rockSteps = steps.filter(step => step.rockId === id);
  const completedSteps = rockSteps.filter(step => step.status === 'done').length;
  const totalSteps = rockSteps.length;
  const progressPercentage = rock?.progress || 0;

  if (!rock) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardBody className="text-center py-8">
            <p className="text-gray-600 mb-4">Milestone not found</p>
            <Link to="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  const handleToggleStep = (stepId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'not_started' : 'done';
    updateStep(stepId, { status: newStatus });
  };

  const handleDeleteRock = () => {
    if (window.confirm('Are you sure you want to delete this milestone? This action cannot be undone.')) {
      deleteRock(rock.id);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            
            <div className="flex space-x-3">
              <Link to={`/add-step/${rock.id}`}>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleDeleteRock} className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Rock Details */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{rock.title}</h1>
                  <div className="flex items-center space-x-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      rock.status === 'done' ? 'bg-green-100 text-green-800' :
                      rock.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {rock.status.replace('_', ' ')}
                    </span>
                    {goal && (
                      <span className="text-sm text-gray-600">
                        Goal: {goal.title}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {rock.startDate && (
                    <p className="text-sm text-gray-500">Start: {format(new Date(rock.startDate), 'MMM dd, yyyy')}</p>
                  )}
                  {rock.dueDate && (
                    <p className="text-sm text-gray-500">Due: {format(new Date(rock.dueDate), 'MMM dd, yyyy')}</p>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardBody>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-bold text-gray-900">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{completedSteps} of {totalSteps} steps completed</p>
              </div>
            </CardBody>
          </Card>

          {/* Steps */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Steps</h2>
                <Link to={`/add-step/${rock.id}`}>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                </Link>
              </div>
            </CardHeader>
            
            <CardBody>
              {rockSteps.length === 0 ? (
                <div className="text-center py-8">
                  <Circle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No steps added yet</p>
                  <Link to={`/add-step/${rock.id}`}>
                    <Button>Add Your First Step</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {rockSteps.map(step => (
                    <div key={step.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <button
                        onClick={() => handleToggleStep(step.id, step.status)}
                        className="mt-1 flex-shrink-0"
                      >
                        {step.status === 'done' ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium ${step.status === 'done' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {step.title}
                        </h3>
                        {step.dueDate && (
                          <p className="text-xs text-gray-500 mt-2">
                            Due: {format(new Date(step.dueDate), 'MMM dd, yyyy')}
                          </p>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteStep(step.id)}
                        className="text-red-600 hover:text-red-700 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};