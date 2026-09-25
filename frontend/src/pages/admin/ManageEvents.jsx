import { useEffect, useState } from 'react';
import { Calendar, MapPin, PlusCircle, Edit3, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api.js';

const BLANK = { title:'', description:'', date:'', time:'', location:'', category:'', registrationUrl:'', status:'upcoming' };

export default function ManageEvents() {
  const [events, setEvents]   = useState([]);
  const [form, setForm]       = useState(BLANK);
  const [image, setImage]     = useState(null);
  const [editId, setEditId]   = useState(null);
  const [msg, setMsg]         = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => api.get('/events').then(r => setEvents(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handle     = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleFile = e => setImage(e.target.files[0]);

  const save = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg('');
    const fd = new FormData();
    Object.entries(form).forEach(([k,v]) => fd.append(k, v));
    if (image) fd.append('image', image);
    try {
      if (editId) { 
        await api.put(`/events/${editId}`, fd); 
        setMsg('Event updated successfully!'); 
        toast.success('Event updated successfully!');
      } else { 
        await api.post('/events', fd);          
        setMsg('Event created successfully!'); 
        toast.success('Event created successfully!');
      }
      setForm(BLANK); setImage(null); setEditId(null);
      load();
    } catch (err) { 
      const errorText = err.response?.data?.message || 'Error occurred';
      setMsg(errorText); 
      toast.error(errorText);
    } finally { 
      setLoading(false); 
    }
  };

  const startEdit = (ev) => {
    setEditId(ev._id);
    setForm({ title:ev.title, description:ev.description, date:ev.date?.slice(0,10), time:ev.time, location:ev.location, category:ev.category||'', registrationUrl:ev.registrationUrl||'', status:ev.status });
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  const del = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted successfully');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete event');
    }
  };

  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:'1.4rem', marginBottom:8, display:'flex', alignItems:'center', gap:8 }}>
        {editId ? <Edit3 size={20} color="var(--maroon)" /> : <PlusCircle size={20} color="var(--maroon)" />}
        {editId ? 'Edit Event' : 'Add New Event'}
      </h2>
      <p style={{ color:'var(--text-muted)', marginBottom:28, fontSize:'0.88rem' }}>Fill in the details below.</p>

      {msg && (
        <div className={`alert ${msg.includes('Error') || msg.includes('failed') ? 'alert-error' : 'alert-success'}`} style={{ display:'flex', alignItems:'center', gap:8 }}>
          {msg.includes('Error') || msg.includes('failed') ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />} {msg}
        </div>
      )}

      <form onSubmit={save} className="glass-card" style={{ padding:28, marginBottom:40 }}>
        <div className="grid-2" style={{ gap:16 }}>
          <div className="form-group">
            <label className="form-label">Event Title *</label>
            <input name="title" className="form-control" value={form.title} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input name="category" className="form-control" value={form.category} onChange={handle} placeholder="e.g. Community, Health" />
          </div>
          <div className="form-group">
            <label className="form-label">Date *</label>
            <input type="date" name="date" className="form-control" value={form.date} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">Time *</label>
            <input name="time" className="form-control" value={form.time} onChange={handle} placeholder="e.g. 10:00 AM" required />
          </div>
          <div className="form-group">
            <label className="form-label">Location *</label>
            <input name="location" className="form-control" value={form.location} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select name="status" className="form-control" value={form.status} onChange={handle}>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
          <div className="form-group" style={{ gridColumn:'1/-1' }}>
            <label className="form-label">Description *</label>
            <textarea name="description" className="form-control" rows={3} value={form.description} onChange={handle} required style={{ resize:'vertical' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Registration URL</label>
            <input name="registrationUrl" className="form-control" value={form.registrationUrl} onChange={handle} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label className="form-label">Event Banner Image</label>
            <input type="file" name="image" className="form-control" accept="image/*" onChange={handleFile} />
          </div>
        </div>
        <div style={{ display:'flex', gap:12, marginTop:16 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving…' : editId ? 'Update Event' : 'Add Event'}</button>
          {editId && <button type="button" className="btn btn-outline" onClick={() => { setEditId(null); setForm(BLANK); }}>Cancel</button>}
        </div>
      </form>

      <h3 style={{ fontWeight:700, marginBottom:20, fontSize:'1.1rem' }}>All Events ({events.length})</h3>
      {events.length === 0
        ? <div className="empty-state"><p>No events yet. Add your first above!</p></div>
        : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {events.map(ev => (
              <div key={ev._id} className="glass-card" style={{ padding:'20px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                <div style={{ flex:1 }}>
                  <span className={`badge badge-${ev.status}`} style={{ marginRight:8 }}>{ev.status}</span>
                  <strong>{ev.title}</strong>
                  <p style={{ color:'var(--text-muted)', fontSize:'0.8rem', marginTop:6, display:'flex', alignItems:'center', gap:12 }}>
                    <span style={{ display:'flex', alignItems:'center', gap:4 }}><Calendar size={14} color="var(--maroon)" /> {new Date(ev.date).toLocaleDateString('en-IN')}</span>
                    <span style={{ display:'flex', alignItems:'center', gap:4 }}><MapPin size={14} color="var(--maroon)" /> {ev.location}</span>
                  </p>
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={() => startEdit(ev)} className="btn btn-outline btn-sm" style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Edit3 size={14} /> Edit</button>
                  <button onClick={() => del(ev._id)}   className="btn btn-danger  btn-sm" style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
