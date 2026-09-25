import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import Home        from './pages/Home.jsx';
import About       from './pages/About.jsx';
import Projects    from './pages/Projects.jsx';
import Events      from './pages/Events.jsx';
import Newsletters from './pages/Newsletters.jsx';
import Directory   from './pages/Directory.jsx';
import Contact     from './pages/Contact.jsx';

import AdminLogin     from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';

// Guard — redirect to /admin/login if not authenticated
function PrivateRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  return admin ? children : <Navigate to="/admin/login" replace />;
}

function ScrollRevealObserver() {
  const location = useLocation();

  useEffect(() => {
    // Add a tiny delay to ensure React has painted the DOM
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
      
      // Cleanup observer on unmount
      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-card)',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.9rem',
            },
            success: {
              iconTheme: {
                primary: 'var(--maroon)',
                secondary: '#fff',
              },
            },
          }}
        />
        <ScrollRevealObserver />
        <Routes>
          {/* ── Public site (with Navbar + Footer) ── */}
          <Route path="/" element={<><Navbar /><main><Home /></main><Footer /></>} />
          <Route path="/about"       element={<><Navbar /><main><About /></main><Footer /></>} />
          <Route path="/projects"    element={<><Navbar /><main><Projects /></main><Footer /></>} />
          <Route path="/events"      element={<><Navbar /><main><Events /></main><Footer /></>} />
          <Route path="/newsletters" element={<><Navbar /><main><Newsletters /></main><Footer /></>} />
          <Route path="/directory"   element={<><Navbar /><main><Directory /></main><Footer /></>} />
          <Route path="/contact"     element={<><Navbar /><main><Contact /></main><Footer /></>} />

          {/* ── Admin routes (no public Navbar) ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*"     element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
