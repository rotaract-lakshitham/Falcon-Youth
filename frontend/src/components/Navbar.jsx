import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [theme, setTheme]         = useState(() => localStorage.getItem('theme') || 'light');
  const { admin, logout }         = useAuth();
  const navigate                  = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      
      const sections = ['home', 'about', 'projects', 'events', 'newsletters', 'directory', 'contact'];
      let current = '';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= (el.offsetTop - 150)) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/',            label: 'Home'        },
    { to: '/#about',      label: 'About Us'    },
    { to: '/#projects',   label: 'Projects'    },
    { to: '/#events',     label: 'Events'      },
    { to: '/#newsletters',label: 'Newsletters' },
    { to: '/#directory',  label: 'Directory'   },
    { to: '/#contact',    label: 'Contact'     },
  ];

  const handleLogout = () => { logout(); navigate('/'); };

  const location = useLocation();

  const handleNavClick = (e, path) => {
    setMenuOpen(false);
    if (location.pathname === '/') {
      if (path.startsWith('/#')) {
        e.preventDefault();
        const id = path.substring(2);
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', `/#${id}`);
        }
      } else if (path === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState(null, '', '/');
      }
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" onClick={(e) => handleNavClick(e, '/')}>
          <div style={{ height: '52px', width: '210px', display: 'flex', alignItems: 'center', overflow: 'hidden', flexShrink: 0 }}>
            <img src="/falcon-logo.png" alt="Rotaract Falcon Youth" style={{ height: '62px', width: 'auto', transform: 'scale(3.2)', transformOrigin: 'left center' }} />
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="navbar__links">
          {navLinks.map((l) => (
            <li key={l.to}>
              <Link 
                to={l.to}
                onClick={(e) => handleNavClick(e, l.to)}
                className={
                  (l.to === '/' && activeSection === 'home') || 
                  (l.to === `/#${activeSection}`) ? 'active' : ''
                }
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA & Theme Toggle */}
        <div className="navbar__cta" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={toggleTheme}
            className="btn btn-outline btn-sm"
            style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50px' }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {admin
            ? <>
                <Link to="/admin" className="btn btn-outline btn-sm">Dashboard</Link>
                <button onClick={handleLogout} className="btn btn-danger btn-sm">Logout</button>
              </>
            : <Link to="/admin/login" className="btn btn-primary btn-sm">Admin</Link>
          }
        </div>

        {/* Hamburger */}
        <button className={`navbar__burger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="menu">
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar__mobile">
          {navLinks.map((l) => (
            <Link 
              key={l.to} 
              to={l.to} 
              onClick={(e) => handleNavClick(e, l.to)}
              className={
                (l.to === '/' && activeSection === 'home') || 
                (l.to === `/#${activeSection}`) ? 'active' : ''
              }
            >
              {l.label}
            </Link>
          ))}
          {admin
            ? <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="btn btn-danger btn-sm" style={{width:'100%'}}>Logout</button>
            : <Link to="/admin/login" onClick={() => setMenuOpen(false)} className="btn btn-primary btn-sm" style={{textAlign:'center'}}>Admin Login</Link>
          }
        </div>
      )}
    </nav>
  );
}
