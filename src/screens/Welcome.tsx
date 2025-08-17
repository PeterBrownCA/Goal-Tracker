import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card, CardBody } from '../components/Card';
import { Target, ArrowRight, CheckCircle, Users, TrendingUp } from 'lucide-react';

export const Welcome: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex p-4 bg-blue-600 rounded-full mb-6">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Dreams Into
            <span className="text-blue-600"> Achievements</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Strategic goal tracking with 90-day rocks, progress journaling, and metrics that turn your aspirations into reality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/signin">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card hover>
            <CardBody className="text-center p-8">
              <div className="inline-flex p-3 bg-blue-100 rounded-full mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Strategic Goal Setting</h3>
              <p className="text-gray-600">
                Set 1-year and 3-year goals with clear timelines and track your progress systematically.
              </p>
            </CardBody>
          </Card>

          <Card hover>
            <CardBody className="text-center p-8">
              <div className="inline-flex p-3 bg-purple-100 rounded-full mb-4">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">90-Day Rocks</h3>
              <p className="text-gray-600">
                Break down big goals into manageable 90-day priorities with actionable steps.
              </p>
            </CardBody>
          </Card>

          <Card hover>
            <CardBody className="text-center p-8">
              <div className="inline-flex p-3 bg-green-100 rounded-full mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Progress Metrics</h3>
              <p className="text-gray-600">
                Track key performance indicators and visualize your progress with detailed analytics.
              </p>
            </CardBody>
          </Card>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="relative">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Your Goals</h3>
              <p className="text-gray-600">Define your 1-year and 3-year objectives</p>
            </div>
            
            <div className="relative">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Rocks</h3>
              <p className="text-gray-600">Break goals into 90-day priorities</p>
            </div>
            
            <div className="relative">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Steps</h3>
              <p className="text-gray-600">Define actionable tasks for each rock</p>
            </div>
            
            <div className="relative">
              <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor metrics and celebrate wins</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardBody className="text-center p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Achieve Your Goals?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of achievers who've transformed their dreams into reality
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Your Journey Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};