import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLogin() {
  const [form, setForm]   = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! Logged in successfully.');
      navigate('/admin');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Check credentials.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'var(--bg-primary)', padding:24,
      backgroundImage:'radial-gradient(ellipse at 50% 20%, rgba(110,30,36,0.06) 0%, transparent 60%)',
    }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ display:'inline-flex', justifyContent:'center', marginBottom:12, height: '80px', width: '240px', overflow: 'hidden' }}>
            <img src="/falcon-logo.png" alt="Rotaract Falcon Youth" style={{ height: '85px', width: 'auto', transform: 'scale(3.2)', transformOrigin: 'center center' }} />
          </div>
          <h1 style={{ color:'var(--maroon)', fontWeight:800, fontSize:'1.5rem', marginBottom:6 }}>Admin Portal</h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.88rem' }}>Rotaract Club of Falcon Youth</p>
        </div>

        <form onSubmit={submit} className="glass-card" style={{ padding:36 }}>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-control" placeholder="admin@falconyouth.com" value={form.email} onChange={handle} required autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" placeholder="••••••••" value={form.password} onChange={handle} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', marginTop:8, display:'inline-flex', alignItems:'center', gap:8 }} disabled={loading}>
            {loading ? 'Signing in…' : <>Sign In <ArrowRight size={16} /></>}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:24, color:'var(--text-muted)', fontSize:'0.82rem' }}>
          This portal is for authorised admins only.
        </p>
      </div>
    </div>
  );
}
