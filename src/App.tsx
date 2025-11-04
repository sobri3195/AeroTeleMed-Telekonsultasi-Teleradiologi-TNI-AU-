import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Consultations } from './pages/Consultations';
import { ConsultationDetail } from './pages/ConsultationDetail';
import { Radiology } from './pages/Radiology';
import { TeleICU } from './pages/TeleICU';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/consultations"
          element={
            <PrivateRoute>
              <Consultations />
            </PrivateRoute>
          }
        />
        <Route
          path="/consultations/:id"
          element={
            <PrivateRoute>
              <ConsultationDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/radiology"
          element={
            <PrivateRoute>
              <Radiology />
            </PrivateRoute>
          }
        />
        <Route
          path="/teleicu"
          element={
            <PrivateRoute>
              <TeleICU />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
