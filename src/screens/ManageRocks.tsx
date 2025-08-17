import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/Button';
import { Card, CardHeader, CardBody } from '../components/Card';
import { ArrowLeft, Plus, Edit2, Trash2, Calendar, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export const ManageRocks: React.FC = () => {
  const { goals, rocks, steps, deleteRock } = useAppContext();
  const [activeTab, setActiveTab] = useState<'progress' | 'completed'>('progress');

  const milestonesInProgress = rocks.filter(rock => rock.status !== 'done');
  const completedMilestones = rocks.filter(rock => rock.status === 'done');

  const handleDeleteMilestone = (rockId: string, rockTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${rockTitle}"? This action cannot be undone.`)) {
      deleteRock(rockId);
    }
  };

  const MilestoneCard = ({ rock }: { rock: any }) => {
    const goal = goals.find(g => g.id === rock.goalId);
    const rockSteps = steps.filter(step => step.rockId === rock.id);
    const completedSteps = rockSteps.filter(step => step.status === 'done').length;

    return (
      <Card key={rock.id} hover>
        <CardBody>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{rock.title}</h3>
              {goal && (
                <p className="text-sm text-gray-600 mb-2">Goal: {goal.title}</p>
              )}
              <div className="flex items-center space-x-4">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  rock.status === 'done' ? 'bg-green-100 text-green-800' :
                  rock.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {rock.status.replace('_', ' ')}
                </span>
                {rock.dueDate && (
                  <span className="text-xs text-gray-500">
                    Due: {format(new Date(rock.dueDate), 'MMM dd, yyyy')}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex space-x-2 ml-4">
              <Link to={`/rock/${rock.id}`}>
                <Button variant="ghost" size="sm">
                  <Edit2 className="w-4 h-4" />
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleDeleteMilestone(rock.id, rock.title)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium text-gray-900">
                {completedSteps}/{rockSteps.length} steps ({rock.progress}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  rock.progress === 100 ? 'bg-green-600' : 'bg-purple-600'
                }`}
                style={{ width: `${rock.progress}%` }}
              ></div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Manage Rocks</h1>
          </div>
          
          <Link to="/add-milestone">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Milestone
            </Button>
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'progress'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:text-gray-900'
            }`}
          >
            In Progress ({milestonesInProgress.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:text-gray-900'
            }`}
          >
            Completed ({completedMilestones.length})
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'progress' ? (
            milestonesInProgress.length === 0 ? (
              <Card>
                <CardBody className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Milestones in Progress</h3>
                  <p className="text-gray-600 mb-6">Start by adding your first milestone</p>
                  <Link to="/add-milestone">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Milestone
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {milestonesInProgress.map(rock => (
                  <MilestoneCard key={rock.id} rock={rock} />
                ))}
              </div>
            )
          ) : (
            completedMilestones.length === 0 ? (
              <Card>
                <CardBody className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Completed Milestones</h3>
                  <p className="text-gray-600">Complete some milestones to see them here</p>
                </CardBody>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedMilestones.map(rock => (
                  <MilestoneCard key={rock.id} rock={rock} />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};