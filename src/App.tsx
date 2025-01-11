import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navigation } from '@/components/layout/Navigation';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import NewNewsletter from './pages/NewNewsletter';
import EditNewsletter from './pages/EditNewsletter';
import ContentCuration from './pages/ContentCuration';
import Auth from './pages/Auth';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <Navigation />
                  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Dashboard />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <Navigation />
                  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Settings />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/content" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <Navigation />
                  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ContentCuration />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/new" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <Navigation />
                  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <NewNewsletter />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/edit/:id" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <Navigation />
                  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <EditNewsletter />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;