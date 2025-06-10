import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { CompañiasPage } from './pages/CompañiasPage';
import { TiendasPage } from './pages/TiendasPage';
import { ClientesPage } from './pages/ClientesPage';
import { ProductosPage } from './pages/ProductosPage';
import { InventarioPage } from './pages/InventarioPage';
import { POSPage } from './pages/POSPage';
import { ReportesPage } from './pages/ReportesPage';
import { initializeData } from './data/localStorage';
import { initializeDemoUsers } from './utils/initializeDemo';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize data and demo users on app start
    initializeData();
    initializeDemoUsers();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/companias" 
              element={
                <ProtectedRoute requiredPermission="all">
                  <Layout>
                    <CompañiasPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tiendas" 
              element={
                <ProtectedRoute requiredPermission="all">
                  <Layout>
                    <TiendasPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/clientes" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ClientesPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/productos" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProductosPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/inventario" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <InventarioPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ventas" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <POSPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reportes" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ReportesPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

