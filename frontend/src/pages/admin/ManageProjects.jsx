import { useEffect, useState } from 'react';
import { Briefcase, Save, PlusCircle, Calendar, MapPin, Edit3, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api.js';

const AVENUES = ['Community Service', 'Club Service', 'Professional Development', 'International Service', 'General'];
const STATUSES = ['Completed', 'Ongoing', 'Upcoming'];

const BLANK = { title: '', avenue: 'Community Service', status: 'Completed', date: '', location: '', description: '' };

export default function ManageProjects() {
  const [list, setList]         = useState([]);
  const [form, setForm]         = useState(BLANK);
  const [banner, setBanner]     = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg]           = useState('');
  const [loading, setLoading]   = useState(false);

  const load = () => api.get('/projects').then(r => setList(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleFile = e => setBanner(e.target.files[0]);

  const save = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg('');

    try {
      let resData;
      if (banner) {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        fd.append('banner', banner);
        const res = editingId
          ? await api.put(`/projects/${editingId}`, fd)
          : await api.post('/projects', fd);
        resData = res.data;
      } else {
        const res = editingId
          ? await api.put(`/projects/${editingId}`, form)
          : await api.post('/projects', form);
        resData = res.data;
      }

      const successMsg = `Project ${editingId ? 'updated' : 'created'} successfully!`;
      setMsg(`Success: ${successMsg}`);
      toast.success(successMsg);
      setForm(BLANK); setBanner(null); setEditingId(null);
      load();
    } catch (err) {
      console.error('Project save error:', err);
      const errMsg = err.response?.data?.message || err.response?.data || err.message || 'Failed to save project';
      const text = typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg);
      setMsg('Failed: ' + text);
      toast.error(text);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = p => {
    setEditingId(p._id);
    setForm({
      title: p.title,
      avenue: p.avenue,
      status: p.status,
      date: p.date ? p.date.substring(0, 10) : '',
      location: p.location,
      description: p.description
    });
    setBanner(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(BLANK);
    setBanner(null);
  };

  const del = async id => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted successfully');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project');
    }
  };

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        {editingId ? <Edit3 size={20} color="var(--maroon)" /> : <Briefcase size={20} color="var(--maroon)" />}
        {editingId ? 'Edit Project' : 'Add New Project'}
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: '0.88rem' }}>
        Manage club projects shown under the Projects section.
      </p>

      {msg && (
        <div className={`alert ${msg.includes('Failed') || msg.includes('error') ? 'alert-error' : 'alert-success'}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {msg.includes('Failed') || msg.includes('error') ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />} {msg}
        </div>
      )}

      <form onSubmit={save} className="glass-card" style={{ padding: 28, marginBottom: 40 }}>
        <div className="grid-2" style={{ gap: 16 }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Project Title *</label>
            <input
              name="title"
              className="form-control"
              placeholder="e.g. RYLA 2026 – Rotary Youth Leadership Awards - 2"
              value={form.title}
              onChange={handle}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Avenue *</label>
            <select name="avenue" className="form-control" value={form.avenue} onChange={handle} required>
              {AVENUES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status *</label>
            <select name="status" className="form-control" value={form.status} onChange={handle} required>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Project Date *</label>
            <input type="date" name="date" className="form-control" value={form.date} onChange={handle} required />
          </div>

          <div className="form-group">
            <label className="form-label">Location *</label>
            <input
              name="location"
              className="form-control"
              placeholder="e.g. Capitol School, Main Campus"
              value={form.location}
              onChange={handle}
              required
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Project Description *</label>
            <textarea
              name="description"
              className="form-control"
              rows={6}
              placeholder="Detailed description of the project, impact, dignitaries, and team involvement..."
              value={form.description}
              onChange={handle}
              required
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Banner / Feature Image (Optional)</label>
            <input type="file" name="banner" className="form-control" accept="image/*" onChange={handleFile} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} disabled={loading}>
            {loading ? 'Saving…' : editingId ? <><Save size={16} /> Update Project</> : <><PlusCircle size={16} /> Create Project</>}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="btn btn-outline">
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1.1rem' }}>
        All Projects ({list.length})
      </h3>

      {list.length === 0 ? (
        <div className="empty-state">
          <p>No projects added yet. Create your first project above!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {list.map(p => (
            <div
              key={p._id}
              className="glass-card"
              style={{
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
                flexWrap: 'wrap'
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <span className="badge" style={{ background: 'rgba(110,30,36,0.1)', color: 'var(--maroon)' }}>{p.avenue}</span>
                  <span className="badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>{p.status}</span>
                </div>
                <strong style={{ fontSize: '1.1rem' }}>{p.title}</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} color="var(--maroon)" /> {new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} color="var(--maroon)" /> {p.location}</span>
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => startEdit(p)} className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Edit3 size={14} /> Edit
                </button>
                <button onClick={() => del(p._id)} className="btn btn-danger btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
