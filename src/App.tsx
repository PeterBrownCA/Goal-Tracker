import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { Welcome } from './screens/Welcome';
import { SignIn } from './screens/SignIn';
import { SignUp } from './screens/SignUp';
import { UserDashboard } from './screens/UserDashboard';
import { Goals } from './screens/Goals';
import { AddRock } from './screens/AddRock';
import { ViewRock } from './screens/ViewRock';
import { AddStep } from './screens/AddStep';
import { Metrics } from './screens/Metrics';
import { ManageRocks } from './screens/ManageRocks';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppContext();
  return user ? <>{children}</> : <Navigate to="/signin" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppContext();
  return !user ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <Welcome />
          </PublicRoute>
        } />
        <Route path="/signin" element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/goals" element={
          <ProtectedRoute>
            <Goals />
          </ProtectedRoute>
        } />
        <Route path="/add-milestone" element={
          <ProtectedRoute>
            <AddRock />
          </ProtectedRoute>
        } />
        <Route path="/milestone/:id" element={
          <ProtectedRoute>
            <ViewRock />
          </ProtectedRoute>
        } />
        <Route path="/add-step/:milestoneId" element={
          <ProtectedRoute>
            <AddStep />
          </ProtectedRoute>
        } />
        <Route path="/metrics" element={
          <ProtectedRoute>
            <Metrics />
          </ProtectedRoute>
        } />
        <Route path="/milestones" element={
          <ProtectedRoute>
            <ManageRocks />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;