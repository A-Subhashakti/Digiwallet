import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/auth.jsx';

import Navbar from './components/navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import KYC from './pages/kyc';
import Transactions from './pages/Transactions';
import PrivateRoute from './components/PrivateRoute';


function App() {
  const location = useLocation();
  const hideLayout = ['/login', '/register'].includes(location.pathname);
  const { token } = useContext(AuthContext);

  
  
  const PublicRoute = ({ children }) => {
    return !token ? children : <Navigate to="/dashboard" replace />;
  };

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={<Navigate to={token ? '/dashboard' : '/login'} />}
        />

        
        <Route
          path="/login"
          element={<PublicRoute><Login /></PublicRoute>}
        />
        <Route
          path="/register"
          element={<PublicRoute><Register /></PublicRoute>}
        />

      
        <Route
          path="/dashboard"
          element={<PrivateRoute><Dashboard /></PrivateRoute>}
        />
        <Route
          path="/wallet"
          element={<PrivateRoute><Wallet /></PrivateRoute>}
        />
        <Route
          path="/kyc"
          element={<PrivateRoute><KYC /></PrivateRoute>}
        />
        <Route
          path="/transactions"
          element={<PrivateRoute><Transactions /></PrivateRoute>}
        />

        
        <Route
          path="*"
          element={<h2 style={{ padding: '2rem' }}>404 - Page Not Found</h2>}
        />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
