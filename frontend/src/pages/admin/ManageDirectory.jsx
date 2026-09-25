import { useEffect, useState } from 'react';
import { Building2, Tag, User, Edit3, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api.js';

const BLANK = { businessName:'', category:'', ownerName:'', description:'', location:'Bengaluru', contactUrl:'' };

export default function ManageDirectory() {
  const [list, setList]       = useState([]);
  const [form, setForm]       = useState(BLANK);
  const [logo, setLogo]       = useState(null);
  const [editId, setEditId]   = useState(null);
  const [msg, setMsg]         = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => api.get('/directory').then(r => setList(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handle     = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleFile = e => setLogo(e.target.files[0]);

  const save = async (e) => {
    e.preventDefault(); setLoading(true); setMsg('');
    const fd = new FormData();
    Object.entries(form).forEach(([k,v]) => fd.append(k, v));
    if (logo) fd.append('logo', logo);
    try {
      if (editId) { 
        await api.put(`/directory/${editId}`, fd); 
        setMsg('Business updated successfully!'); 
        toast.success('Business listing updated successfully!');
      } else { 
        await api.post('/directory', fd);          
        setMsg('Business added successfully!'); 
        toast.success('Business listing added successfully!');
      }
      setForm(BLANK); setLogo(null); setEditId(null); load();
    } catch (err) { 
      const text = err.response?.data?.message || 'Error occurred';
      setMsg(text); 
      toast.error(text);
    } finally { 
      setLoading(false); 
    }
  };

  const startEdit = (b) => {
    setEditId(b._id);
    setForm({ businessName:b.businessName, category:b.category, ownerName:b.ownerName, description:b.description, location:b.location, contactUrl:b.contactUrl||'' });
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  const del = async (id) => {
    if (!window.confirm('Remove this listing?')) return;
    try {
      await api.delete(`/directory/${id}`); 
      toast.success('Business listing removed successfully');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove listing');
    }
  };

  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:'1.4rem', marginBottom:8, display:'flex', alignItems:'center', gap:8 }}>
        {editId ? <Edit3 size={20} color="var(--maroon)" /> : <Building2 size={20} color="var(--maroon)" />}
        {editId ? 'Edit Listing' : 'Add Business'}
      </h2>
      <p style={{ color:'var(--text-muted)', marginBottom:28, fontSize:'0.88rem' }}>Add or manage member business listings in the Falcon Directory.</p>

      {msg && (
        <div className={`alert ${msg.includes('Error') || msg.includes('failed') ? 'alert-error' : 'alert-success'}`} style={{ display:'flex', alignItems:'center', gap:8 }}>
          {msg.includes('Error') || msg.includes('failed') ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />} {msg}
        </div>
      )}

      <form onSubmit={save} className="glass-card" style={{ padding:28, marginBottom:40 }}>
        <div className="grid-2" style={{ gap:16 }}>
          <div className="form-group">
            <label className="form-label">Business Name *</label>
            <input name="businessName" className="form-control" value={form.businessName} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <input name="category" className="form-control" placeholder="e.g. Photography, Tech, F&B" value={form.category} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">Owner / Member Name *</label>
            <input name="ownerName" className="form-control" value={form.ownerName} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input name="location" className="form-control" value={form.location} onChange={handle} />
          </div>
          <div className="form-group" style={{ gridColumn:'1/-1' }}>
            <label className="form-label">Description *</label>
            <textarea name="description" className="form-control" rows={3} value={form.description} onChange={handle} required style={{ resize:'vertical' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Contact / Website URL</label>
            <input name="contactUrl" className="form-control" placeholder="https://..." value={form.contactUrl} onChange={handle} />
          </div>
          <div className="form-group">
            <label className="form-label">Business Logo</label>
            <input type="file" name="logo" className="form-control" accept="image/*" onChange={handleFile} />
          </div>
        </div>
        <div style={{ display:'flex', gap:12, marginTop:16 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving…' : editId ? 'Update' : 'Add Listing'}</button>
          {editId && <button type="button" className="btn btn-outline" onClick={() => { setEditId(null); setForm(BLANK); }}>Cancel</button>}
        </div>
      </form>

      <h3 style={{ fontWeight:700, marginBottom:20, fontSize:'1.1rem' }}>Directory Listings ({list.length})</h3>
      {list.length === 0
        ? <div className="empty-state"><p>No listings yet.</p></div>
        : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {list.map(b => (
              <div key={b._id} className="glass-card" style={{ padding:'18px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                <div>
                  <strong style={{ fontSize:'1.05rem' }}>{b.businessName}</strong>
                  <p style={{ color:'var(--text-muted)', fontSize:'0.8rem', marginTop:6, display:'flex', alignItems:'center', gap:12 }}>
                    <span style={{ display:'flex', alignItems:'center', gap:4 }}><Tag size={13} color="var(--maroon)" /> {b.category}</span>
                    <span style={{ display:'flex', alignItems:'center', gap:4 }}><User size={13} color="var(--maroon)" /> {b.ownerName}</span>
                  </p>
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={() => startEdit(b)} className="btn btn-outline btn-sm" style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Edit3 size={14} /> Edit</button>
                  <button onClick={() => del(b._id)}   className="btn btn-danger  btn-sm" style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Trash2 size={14} /> Remove</button>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
