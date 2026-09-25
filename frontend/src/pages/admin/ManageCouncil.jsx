import { useEffect, useState } from 'react';
import { Users, User, Edit3, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api.js';

const BLANK = { name:'', designation:'', rotaryYear:'2026-2027', bio:'', displayOrder:0, linkedin:'', instagram:'', email:'' };

export default function ManageCouncil() {
  const [members, setMembers] = useState([]);
  const [form, setForm]       = useState(BLANK);
  const [photo, setPhoto]     = useState(null);
  const [editId, setEditId]   = useState(null);
  const [msg, setMsg]         = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => api.get('/council').then(r => setMembers(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleFile = e => setPhoto(e.target.files[0]);

  const save = async (e) => {
    e.preventDefault(); setLoading(true); setMsg('');
    const fd = new FormData();
    const { linkedin, instagram, email: socEmail, ...rest } = form;
    Object.entries(rest).forEach(([k,v]) => fd.append(k, v));
    fd.append('socials', JSON.stringify({ linkedin, instagram, email: socEmail }));
    if (photo) fd.append('photo', photo);
    try {
      if (editId) { 
        await api.put(`/council/${editId}`, fd); 
        setMsg('Member updated successfully!'); 
        toast.success('Council member updated successfully!');
      } else { 
        await api.post('/council', fd);          
        setMsg('Member added successfully!'); 
        toast.success('Council member added successfully!');
      }
      setForm(BLANK); setPhoto(null); setEditId(null); load();
    } catch (err) { 
      const text = err.response?.data?.message || 'Error occurred';
      setMsg(text); 
      toast.error(text);
    } finally { 
      setLoading(false); 
    }
  };

  const startEdit = (m) => {
    setEditId(m._id);
    setForm({ name:m.name, designation:m.designation, rotaryYear:m.rotaryYear, bio:m.bio||'', displayOrder:m.displayOrder||0,
      linkedin:m.socials?.linkedin||'', instagram:m.socials?.instagram||'', email:m.socials?.email||'' });
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  const del = async (id) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await api.delete(`/council/${id}`); 
      toast.success('Council member removed successfully');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:'1.4rem', marginBottom:8, display:'flex', alignItems:'center', gap:8 }}>
        {editId ? <Edit3 size={20} color="var(--maroon)" /> : <Users size={20} color="var(--maroon)" />}
        {editId ? 'Edit Member' : 'Add Council Member'}
      </h2>
      <p style={{ color:'var(--text-muted)', marginBottom:28, fontSize:'0.88rem' }}>Manage the club board for any Rotary year.</p>

      {msg && (
        <div className={`alert ${msg.includes('Error') || msg.includes('failed') ? 'alert-error' : 'alert-success'}`} style={{ display:'flex', alignItems:'center', gap:8 }}>
          {msg.includes('Error') || msg.includes('failed') ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />} {msg}
        </div>
      )}

      <form onSubmit={save} className="glass-card" style={{ padding:28, marginBottom:40 }}>
        <div className="grid-2" style={{ gap:16 }}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input name="name" className="form-control" value={form.name} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">Designation *</label>
            <input name="designation" className="form-control" placeholder="e.g. President" value={form.designation} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">Rotary Year</label>
            <input name="rotaryYear" className="form-control" placeholder="2026-2027" value={form.rotaryYear} onChange={handle} />
          </div>
          <div className="form-group">
            <label className="form-label">Display Order</label>
            <input type="number" name="displayOrder" className="form-control" value={form.displayOrder} onChange={handle} />
          </div>
          <div className="form-group" style={{ gridColumn:'1/-1' }}>
            <label className="form-label">Bio</label>
            <textarea name="bio" className="form-control" rows={3} value={form.bio} onChange={handle} style={{ resize:'vertical' }} />
          </div>
          <div className="form-group">
            <label className="form-label">LinkedIn URL</label>
            <input name="linkedin" className="form-control" placeholder="https://linkedin.com/in/..." value={form.linkedin} onChange={handle} />
          </div>
          <div className="form-group">
            <label className="form-label">Instagram URL</label>
            <input name="instagram" className="form-control" placeholder="https://instagram.com/..." value={form.instagram} onChange={handle} />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Email</label>
            <input type="email" name="email" className="form-control" value={form.email} onChange={handle} />
          </div>
          <div className="form-group">
            <label className="form-label">Profile Photo</label>
            <input type="file" name="photo" className="form-control" accept="image/*" onChange={handleFile} />
          </div>
        </div>
        <div style={{ display:'flex', gap:12, marginTop:16 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving…' : editId ? 'Update Member' : 'Add Member'}</button>
          {editId && <button type="button" className="btn btn-outline" onClick={() => { setEditId(null); setForm(BLANK); }}>Cancel</button>}
        </div>
      </form>

      <h3 style={{ fontWeight:700, marginBottom:20, fontSize:'1.1rem' }}>Board Members ({members.length})</h3>
      {members.length === 0
        ? <div className="empty-state"><p>No members added yet.</p></div>
        : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {members.map(m => (
              <div key={m._id} className="glass-card" style={{ padding:'18px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background: m.photoUrl ? `url(${m.photoUrl}) center/cover` : 'var(--bg-secondary)', border:'2px solid var(--glass-border)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {!m.photoUrl && <User size={20} color="var(--maroon)" />}
                  </div>
                  <div>
                    <strong>{m.name}</strong>
                    <p style={{ color:'var(--maroon)', fontSize:'0.8rem', fontWeight:500 }}>{m.designation} · {m.rotaryYear}</p>
                  </div>
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={() => startEdit(m)} className="btn btn-outline btn-sm" style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Edit3 size={14} /> Edit</button>
                  <button onClick={() => del(m._id)}   className="btn btn-danger  btn-sm" style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Trash2 size={14} /> Remove</button>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
