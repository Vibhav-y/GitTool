import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/home';
import Auth from './pages/auth';
import Repos from './pages/repos';
import Editor from './pages/editor';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import Templates from './pages/Templates';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="auth" element={<Auth />} />

            {/* Legacy Routes - To be migrated soon */}
            <Route path="repos" element={<Repos />} />
            <Route path="generate/:owner/:repo" element={<Editor />} />

            {/* New Protected Routes */}
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="create" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
            <Route path="project/:id" element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
            <Route path="templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
