import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './contexts/AuthContext';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { FeatureFlagsProvider } from './contexts/FeatureFlagsContext';
import Layout from './components/Layout';

import Home from './pages/home';
import Auth from './pages/auth';
import Privacy from './pages/Privacy';
import Changelog from './pages/Changelog';
import Blog from './pages/Blog';
import BlogArticle from './pages/BlogArticle';
import BlogCategory from './pages/BlogCategory';
import Learn from './pages/Learn';
import LearnArticle from './pages/LearnArticle';
import NotFound from './pages/NotFound';

import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';

// Git Core Tools
import BranchMergeUI from './pages/tools/BranchMergeUI';
import BranchCompare from './pages/tools/BranchCompare';
import ReadmeGenerator from './pages/tools/ReadmeGenerator';

// AI Tools
import ReleaseNotesGenerator from './pages/tools/ReleaseNotesGenerator';

// Code Quality
import DeadCodeDetector from './pages/tools/DeadCodeDetector';

// Documentation
import ApiDocsGenerator from './pages/tools/ApiDocsGenerator';

// Security
import SecurityDashboard from './pages/tools/SecurityDashboard';
import CveAlertDashboard from './pages/tools/CveAlertDashboard';

// CI/CD
import WorkflowBuilder from './pages/tools/WorkflowBuilder';

// Collaboration
import CollaborationHub from './pages/tools/CollaborationHub';
import TodoToIssue from './pages/tools/TodoToIssue';

// Phase 4 Tools
import DependencyAuditor from './pages/tools/DependencyAuditor';
import CommandBuilderPage from './pages/tools/command-builder/CommandBuilderPage';
import ArchitectureDiagram from './pages/tools/ArchitectureDiagram';
import PipelineFailureExplainer from './pages/tools/PipelineFailureExplainer';
import SecretsScanner from './pages/tools/SecretsScanner';
import SemanticVersionSuggester from './pages/tools/SemanticVersionSuggester';
import IssueTriageAssistant from './pages/tools/IssueTriageAssistant';
import Profile from './pages/Profile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,      // 2 min default
      gcTime: 10 * 60 * 1000,         // keep unused data 10 min
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <FeatureFlagsProvider>
      <AuthProvider>
        <WorkspaceProvider>
          <Toaster position="top-right" toastOptions={{
            style: {
              background: '#12121a',
              color: '#e8e8ed',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '0.625rem',
              fontSize: '0.85rem',
            }
          }} />
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="auth" element={<Auth />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="changelog" element={<Changelog />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/category/:category" element={<BlogCategory />} />
                <Route path="blog/:slug" element={<BlogArticle />} />
                <Route path="learn" element={<Learn />} />
                <Route path="learn/:slug" element={<LearnArticle />} />
              </Route>

              {/* Protected App Routes (Shell + Tools) */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/tools" element={<Navigate to="/dashboard" replace />} />

                {/* Git Core */}
                <Route path="/tools/branch-merge" element={<BranchMergeUI />} />
                <Route path="/tools/compare" element={<BranchCompare />} />
                <Route path="/tools/readme-generator" element={<ReadmeGenerator />} />

                {/* AI Tools */}
                <Route path="/tools/release-notes" element={<ReleaseNotesGenerator />} />

                {/* Code Quality */}
                <Route path="/tools/dead-code" element={<DeadCodeDetector />} />

                {/* Documentation */}
                <Route path="/tools/api-docs" element={<ApiDocsGenerator />} />

                {/* Security */}
                <Route path="/tools/security" element={<SecurityDashboard />} />
                <Route path="/tools/cve-alerts" element={<CveAlertDashboard />} />

                {/* CI/CD */}
                <Route path="/tools/workflow-builder" element={<WorkflowBuilder />} />

                {/* Collaboration */}
                <Route path="/tools/collaboration" element={<CollaborationHub />} />
                <Route path="/tools/todo-converter" element={<TodoToIssue />} />

                {/* Phase 4 Tools */}
                <Route path="/tools/dependency-auditor" element={<DependencyAuditor />} />
                <Route path="/tools/command-builder" element={<CommandBuilderPage />} />
                <Route path="/tools/architecture-diagram" element={<ArchitectureDiagram />} />
                <Route path="/tools/failure-explainer" element={<PipelineFailureExplainer />} />
                <Route path="/tools/secrets-scanner" element={<SecretsScanner />} />
                <Route path="/tools/version-suggester" element={<SemanticVersionSuggester />} />
                <Route path="/tools/issue-triage" element={<IssueTriageAssistant />} />
              </Route>

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </WorkspaceProvider>
      </AuthProvider>
      </FeatureFlagsProvider>
    </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
