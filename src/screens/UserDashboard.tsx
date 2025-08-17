import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/Button';
import { Card, CardHeader, CardBody } from '../components/Card';
import { Target, Calendar, Plus, LogOut, TrendingUp, Settings } from 'lucide-react';
import { format } from 'date-fns';

export const UserDashboard: React.FC = () => {
  const { user, goals, rocks, steps, metrics, signOut } = useAppContext();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const oneYearGoals = goals.filter(goal => goal.type === 'one_year');
  const threeYearGoals = goals.filter(goal => goal.type === 'three_year');
  const ninetyDayGoals = goals.filter(goal => goal.type === 'ninety_day');
  const activeRocks = rocks.filter(rock => rock.status !== 'done');
  const completedRocks = rocks.filter(rock => rock.status === 'done').length;
  const totalSteps = steps.length;
  const completedSteps = steps.filter(step => step.status === 'done').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Goal Tracker</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/metrics">
                <Button variant="ghost" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Metrics
                </Button>
              </Link>
              <Link to="/milestones">
                <Button variant="ghost" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Manage Milestones
                </Button>
              </Link>
              <Link to="/blog">
                <Button variant="ghost" size="sm">Blog</Button>
              </Link>
              <span className="text-sm text-gray-600">Welcome, {user?.displayName || user?.email}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.displayName || user?.email || 'there'}!</h1>
          <p className="text-gray-600">Here's your progress overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Goals</p>
                  <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Milestones</p>
                  <p className="text-2xl font-bold text-gray-900">{activeRocks.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Milestones</p>
                  <p className="text-2xl font-bold text-gray-900">{completedRocks}</p>
                </div>
                <div className="text-green-600 font-semibold">✓</div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Steps Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{completedSteps}/{totalSteps}</p>
                </div>
                <div className="text-blue-600 font-semibold">
                  {totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0}%
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Goals Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Goals</h2>
              <Link to="/goals">
                <Button size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Goals
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {goals.length === 0 ? (
                <Card>
                  <CardBody className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No goals set yet</p>
                    <Link to="/goals">
                      <Button>Set Your First Goal</Button>
                    </Link>
                  </CardBody>
                </Card>
              ) : (
                <>
                  {ninetyDayGoals.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">90-Day Goals</h3>
                      {ninetyDayGoals.map(goal => (
                        <Card key={goal.id} hover className="mb-2">
                          <CardBody>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">{goal.title}</h4>
                                <div className="flex items-center space-x-4">
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    goal.status === 'done' ? 'bg-green-100 text-green-800' :
                                    goal.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {goal.status.replace('_', ' ')}
                                  </span>
                                  {goal.dueDate && (
                                    <span className="text-xs text-gray-500">
                                      Due: {format(new Date(goal.dueDate), 'MMM yyyy')}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  )}

                  {threeYearGoals.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">3-Year Goals</h3>
                      {threeYearGoals.map(goal => (
                        <Card key={goal.id} hover className="mb-2">
                          <CardBody>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">{goal.title}</h4>
                                <div className="flex items-center space-x-4">
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    goal.status === 'done' ? 'bg-green-100 text-green-800' :
                                    goal.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {goal.status.replace('_', ' ')}
                                  </span>
                                  {goal.dueDate && (
                                    <span className="text-xs text-gray-500">
                                      Due: {format(new Date(goal.dueDate), 'MMM yyyy')}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  {oneYearGoals.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">1-Year Goals</h3>
                      {oneYearGoals.map(goal => (
                        <Card key={goal.id} hover className="mb-2">
                          <CardBody>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">{goal.title}</h4>
                                <div className="flex items-center space-x-4">
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    goal.status === 'done' ? 'bg-green-100 text-green-800' :
                                    goal.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {goal.status.replace('_', ' ')}
                                  </span>
                                  {goal.dueDate && (
                                    <span className="text-xs text-gray-500">
                                      Due: {format(new Date(goal.dueDate), 'MMM yyyy')}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Active Rocks */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Active Milestones</h2>
              <Link to="/add-milestone">
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Milestone
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {activeRocks.length === 0 ? (
                <Card>
                  <CardBody className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No active milestones</p>
                    <Link to="/add-milestone">
                      <Button>Add Your First Milestone</Button>
                    </Link>
                  </CardBody>
                </Card>
              ) : (
                activeRocks.map(rock => {
                  const goal = goals.find(g => g.id === rock.goalId);
                  const rockSteps = steps.filter(s => s.rockId === rock.id);
                  const done = rockSteps.filter(s => s.status === 'done').length;
                  const progress = rockSteps.length ? Math.round((done / rockSteps.length) * 100) : 0;
                  return (
                    <Link key={rock.id} to={`/milestone/${rock.id}`}>
                      <Card hover>
                        <CardBody>
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">{rock.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              rock.status === 'done' ? 'bg-green-100 text-green-800' :
                              rock.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {rock.status.replace('_', ' ')}
                            </span>
                          </div>
                          
                          {goal && (
                            <p className="text-sm text-gray-600 mb-3">Goal: {goal.title}</p>
                          )}
                          
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>Steps: {done}/{rockSteps.length}</span>
                            <span>{progress}% complete</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                            {rock.dueDate && (
                              <span>Due: {format(new Date(rock.dueDate), 'MMM dd, yyyy')}</span>
                            )}
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </CardBody>
                      </Card>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};