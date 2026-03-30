import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OwnerDashboard from './pages/OwnerDashboard';
import UploadDocuments from './pages/UploadDocuments';
import QRCodePage from './pages/QRCodePage';
import PublicVehicleView from './pages/PublicVehicleView';

function App() {
  const { user } = useContext(AuthContext);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/vehicle/:id" element={<PublicVehicleView />} />

            {/* Owner Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['owner']}><OwnerDashboard /></ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute allowedRoles={['owner']}><UploadDocuments /></ProtectedRoute>
            } />
            <Route path="/qr/:id" element={
              <ProtectedRoute allowedRoles={['owner']}><QRCodePage /></ProtectedRoute>
            } />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
