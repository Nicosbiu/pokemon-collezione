// src/App.jsx
import { Routes, Route } from 'react-router-dom'; // ✅ NO BrowserRouter qui
import { AuthProvider } from './contexts/AuthContext';
import RequireAuth from './components/RequireAuth';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CollectionsPage from './pages/CollectionsPage';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black">
        <Navbar />
        <Routes>  {/* ✅ Solo Routes, NO Router */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/collections" element={
            <RequireAuth>
              <CollectionsPage />
            </RequireAuth>
          } />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
