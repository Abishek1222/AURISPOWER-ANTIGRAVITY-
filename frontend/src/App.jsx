import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './components/dashboard/Dashboard';
import Monitor from './pages/Monitor';
import Alerts from './pages/Alerts';
import Admin from './pages/Admin';
import GlobalOverview from './pages/GlobalOverview';
import IndustryStandards from './pages/IndustryStandards';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="monitor" element={<Monitor />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="admin" element={<Admin />} />
          <Route path="global" element={<GlobalOverview />} />
          <Route path="standards" element={<IndustryStandards />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
