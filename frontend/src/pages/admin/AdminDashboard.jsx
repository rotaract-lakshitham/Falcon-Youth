import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Briefcase, FileText, Users, Building2, Menu, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import ManageEvents       from './ManageEvents.jsx';
import ManageProjects     from './ManageProjects.jsx';
import ManageNewsletters  from './ManageNewsletters.jsx';
import ManageCouncil      from './ManageCouncil.jsx';
import ManageDirectory    from './ManageDirectory.jsx';
// import ManageStats        from './ManageStats.jsx';

const NAV = [
  { to:'', label:'Overview', Icon: LayoutDashboard, end:true },
  { to:'events',       label:'Events',      Icon: Calendar },
  { to:'projects',     label:'Projects',    Icon: Briefcase },
  { to:'newsletters',  label:'Newsletters', Icon: FileText },
  { to:'council',      label:'Council',     Icon: Users },
  { to:'directory',    label:'Directory',   Icon: Building2 },
  // { to:'stats',        label:'Stats',       Icon: BarChart3 },
];

function Overview({ admin }) {
  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:'1.6rem', marginBottom:8 }}>Welcome back, {admin?.username || 'Admin'}</h2>
      <p style={{ color:'var(--text-muted)', marginBottom:40 }}>Manage all club content from this dashboard.</p>
      <div className="grid-3">
        {[
          { Icon: Calendar,     label:'Events',      desc:'Add, edit or delete upcoming and past events.',            link:'events'      },
          { Icon: Briefcase,    label:'Projects',    desc:'Add, edit or delete club projects & initiatives.',        link:'projects'    },
          { Icon: FileText,     label:'Newsletters', desc:'Upload monthly PDF bulletins for the Newsletter page.',    link:'newsletters'  },
          { Icon: Users,        label:'Council',     desc:'Update the board of directors / club council members.',    link:'council'      },
          { Icon: Building2,    label:'Directory',   desc:'Manage Falcon Directory business listings.',               link:'directory'    },
          // { Icon: BarChart3,    label:'Stats',       desc:'Update the homepage impact counter numbers.',              link:'stats'        },
        ].map(c => (
          <NavLink to={c.link} key={c.label} className="glass-card" style={{ padding:28, display:'block', textDecoration:'none' }}>
            <div style={{ display:'inline-flex', padding:10, borderRadius:'50%', background:'rgba(110,30,36,0.08)', marginBottom:12 }}>
              <c.Icon size={28} color="var(--maroon)" />
            </div>
            <h3 style={{ fontWeight:700, marginBottom:8, color:'var(--text-primary)' }}>{c.label}</h3>
            <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', lineHeight:1.6 }}>{c.desc}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const handleLogout = () => { logout(); toast.success('Logged out successfully'); navigate('/'); };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 0,
        minHeight:'100vh',
        background:'var(--bg-card)',
        borderRight:'1px solid var(--glass-border)',
        padding: sidebarOpen ? '28px 16px' : 0,
        overflow:'hidden',
        transition:'width 0.3s ease, padding 0.3s ease',
        flexShrink:0,
        display:'flex', flexDirection:'column',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 28, paddingLeft: 8, height: '60px', width: '200px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <img src="/falcon-logo.png" alt="Falcon Youth Admin" style={{ height: '70px', width: 'auto', transform: 'scale(3.2)', transformOrigin: 'left center' }} />
        </div>

        {/* Nav */}
        <nav style={{ flex:1 }}>
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={`/admin${n.to ? '/'+n.to : ''}`}
              end={n.end}
              style={({ isActive }) => ({
                display:'flex', alignItems:'center', gap:10, padding:'11px 16px', borderRadius:'var(--radius-sm)', marginBottom:4,
                color: isActive ? 'var(--maroon)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(110,30,36,0.08)' : 'transparent',
                fontSize:'0.88rem', fontWeight: isActive ? 600 : 400, transition:'all 0.2s',
                textDecoration:'none',
              })}
            >
              <n.Icon size={16} /> {n.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ borderTop:'1px solid var(--glass-border)', paddingTop:16, marginTop:16 }}>
          <p style={{ color:'var(--text-muted)', fontSize:'0.75rem', marginBottom:12, paddingLeft:8 }}>Logged in as <strong>{admin?.username}</strong></p>
          <Link to="/" target="_blank" className="btn btn-outline btn-sm" style={{ width:'100%', textAlign:'center', display:'block', marginBottom:8 }}>View Site</Link>
          <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ width:'100%' }}>Logout</button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'auto' }}>
        {/* Topbar */}
        <header style={{
          padding:'16px 28px', background:'var(--bg-card)',
          borderBottom:'1px solid var(--glass-border)',
          display:'flex', alignItems:'center', justifyContent:'space-between', gap:16,
          position:'sticky', top:0, zIndex:100,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <button
              onClick={() => setSidebarOpen(o => !o)}
              style={{ background:'none', border:'none', color:'var(--text-secondary)', cursor:'pointer', padding:4, display:'flex', alignItems:'center' }}
              aria-label="toggle sidebar"
            ><Menu size={20} /></button>
            <span style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>Rotaract Club of Falcon Youth — Admin Panel</span>
          </div>

          <button
            onClick={toggleTheme}
            className="btn btn-outline btn-sm"
            style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50px' }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </header>

        <main style={{ padding:'36px 28px', flex:1 }}>
          <Routes>
            <Route index                    element={<Overview admin={admin} />} />
            <Route path="events"            element={<ManageEvents />} />
            <Route path="projects"          element={<ManageProjects />} />
            <Route path="newsletters"       element={<ManageNewsletters />} />
            <Route path="council"           element={<ManageCouncil />} />
            <Route path="directory"         element={<ManageDirectory />} />
            {/* <Route path="stats"             element={<ManageStats />} /> */}
          </Routes>
        </main>
      </div>
    </div>
  );
}
