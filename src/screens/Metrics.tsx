import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';
import { ArrowLeft, Plus, Edit2, Trash2, TrendingUp } from 'lucide-react';
import { Metric } from '../types';

export const Metrics: React.FC = () => {
  const { metrics, addMetric, updateMetric, deleteMetric } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingMetric, setEditingMetric] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    target: 0,
    current: 0,
    period: 'monthly' as 'weekly' | 'monthly',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMetric) {
      updateMetric(editingMetric, formData);
      setEditingMetric(null);
    } else {
      addMetric(formData);
    }
    
    setFormData({
      name: '',
      unit: '',
      target: 0,
      current: 0,
      period: 'monthly',
    });
    setShowForm(false);
  };

  const handleEdit = (metric: Metric) => {
    setFormData({
      name: metric.name,
      unit: metric.unit,
      target: metric.target,
      current: metric.current,
      period: metric.period,
    });
    setEditingMetric(metric.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMetric(null);
    setFormData({
      name: '',
      unit: '',
      target: 0,
      current: 0,
      period: 'monthly',
    });
  };

  const getProgressPercentage = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
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
            <h1 className="text-2xl font-bold text-gray-900">Metrics</h1>
          </div>
          
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Metric
            </Button>
          )}
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-lg font-semibold">
                {editingMetric ? 'Edit Metric' : 'Add New Metric'}
              </h2>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardBody className="space-y-4">
                <Input
                  label="Metric Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Monthly Revenue, Weekly Workouts"
                  required
                />
                
                <Input
                  label="Unit"
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="e.g., $, hours, count"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    label="Target"
                    value={formData.target}
                    onChange={(e) => setFormData(prev => ({ ...prev, target: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.01"
                    required
                  />
                  
                  <Input
                    type="number"
                    label="Current"
                    value={formData.current}
                    onChange={(e) => setFormData(prev => ({ ...prev, current: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Period
                  </label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value as 'weekly' | 'monthly' }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </CardBody>
              <CardFooter>
                <div className="flex space-x-3">
                  <Button type="submit">
                    {editingMetric ? 'Update Metric' : 'Add Metric'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* Metrics List */}
        <div className="space-y-4">
          {metrics.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Metrics Yet</h3>
                <p className="text-gray-600 mb-6">Start tracking your key performance indicators</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Metric
                </Button>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metrics.map(metric => {
                const progress = getProgressPercentage(metric.current, metric.target);
                return (
                  <Card key={metric.id}>
                    <CardBody>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{metric.name}</h3>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {metric.period}
                          </span>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(metric)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteMetric(metric.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900">
                            {metric.unit}{metric.current.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">
                            of {metric.unit}{metric.target.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Progress</span>
                            <span className="text-sm font-medium text-gray-900">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                progress >= 100 ? 'bg-green-600' : 
                                progress >= 75 ? 'bg-blue-600' : 
                                progress >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};