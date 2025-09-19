// src/App.jsx - Aggiungi la nuova route
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import RequireAuth from './components/RequireAuth';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CollectionsPage from './pages/CollectionsPage';
import CollectionViewPage from './pages/CollectionViewPage'; // ✅ NUOVO IMPORT

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-violet-900 to-black">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/collections" element={
            <RequireAuth>
              <CollectionsPage />
            </RequireAuth>
          } />
          {/* ✅ NUOVA ROUTE PER BINDER */}
          <Route path="/collection/:id" element={
            <RequireAuth>
              <CollectionViewPage />
            </RequireAuth>
          } />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
