import { useEffect, useState } from 'react';
import { FileText, Upload, Save, Calendar, BookOpen, Edit3, Trash2, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api.js';

const BLANK = { title: '', edition: '', publishDate: '' };

export default function ManageNewsletters() {
  const [list, setList]           = useState([]);
  const [form, setForm]           = useState(BLANK);
  const [pdf, setPdf]             = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg]             = useState('');
  const [loading, setLoading]     = useState(false);

  const load = () => api.get('/newsletters').then(r => setList(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handle     = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleFile = e => setPdf(e.target.files[0]);

  const save = async (e) => {
    e.preventDefault();
    if (!editingId && !pdf) {
      const errText = 'Please select a PDF file.';
      setMsg('Error: ' + errText);
      toast.error(errText);
      return;
    }
    setLoading(true); setMsg('');

    try {
      if (pdf) {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        fd.append('pdf', pdf);
        if (editingId) {
          await api.put(`/newsletters/${editingId}`, fd);
          const succText = 'Newsletter updated with new PDF!';
          setMsg('Success: ' + succText);
          toast.success(succText);
        } else {
          await api.post('/newsletters', fd);
          const succText = 'Newsletter uploaded successfully!';
          setMsg('Success: ' + succText);
          toast.success(succText);
        }
      } else {
        await api.put(`/newsletters/${editingId}`, form);
        const succText = 'Newsletter details updated successfully!';
        setMsg('Success: ' + succText);
        toast.success(succText);
      }

      setForm(BLANK); setPdf(null); setEditingId(null);
      load();
    } catch (err) {
      const errText = err.response?.data?.message || 'Operation failed';
      setMsg('Error: ' + errText);
      toast.error(errText);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = n => {
    setEditingId(n._id);
    setForm({
      title: n.title,
      edition: n.edition,
      publishDate: n.publishDate ? n.publishDate.substring(0, 10) : ''
    });
    setPdf(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(BLANK);
    setPdf(null);
  };

  const del = async (id) => {
    if (!window.confirm('Delete this newsletter?')) return;
    try {
      await api.delete(`/newsletters/${id}`);
      toast.success('Newsletter deleted successfully');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete newsletter');
    }
  };

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        {editingId ? <Edit3 size={20} color="var(--maroon)" /> : <FileText size={20} color="var(--maroon)" />}
        {editingId ? 'Edit Newsletter Details' : 'Upload Newsletter PDF'}
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: '0.88rem' }}>
        {editingId
          ? 'Update bulletin title, edition, or upload a new PDF file.'
          : 'Upload a new monthly bulletin. Visitors will see a live in-page PDF reader.'}
      </p>

      {msg && (
        <div className={`alert ${msg.includes('failed') || msg.includes('Please') ? 'alert-error' : 'alert-success'}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {msg.includes('failed') || msg.includes('Please') ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />} {msg}
        </div>
      )}

      <form onSubmit={save} className="glass-card" style={{ padding: 28, marginBottom: 40 }}>
        <div className="grid-2" style={{ gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Newsletter Title *</label>
            <input
              name="title"
              className="form-control"
              placeholder="e.g. Wings of Falcon"
              value={form.title}
              onChange={handle}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Edition *</label>
            <input
              name="edition"
              className="form-control"
              placeholder="e.g. Volume 1, Issue 3"
              value={form.edition}
              onChange={handle}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Publish Date *</label>
            <input
              type="date"
              name="publishDate"
              className="form-control"
              value={form.publishDate}
              onChange={handle}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              PDF File {editingId ? '(Optional if keeping current file)' : '*'}
            </label>
            <input
              type="file"
              name="pdf"
              className="form-control"
              accept="application/pdf"
              onChange={handleFile}
              required={!editingId}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} disabled={loading}>
            {loading ? 'Saving…' : editingId ? <><Save size={16} /> Update Newsletter</> : <><Upload size={16} /> Upload Newsletter</>}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="btn btn-outline">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1.1rem' }}>
        Published Newsletters ({list.length})
      </h3>

      {list.length === 0 ? (
        <div className="empty-state">
          <p>No newsletters yet. Upload your first bulletin above!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.map(n => (
            <div
              key={n._id}
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
                <strong>{n.title}</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><BookOpen size={14} color="var(--maroon)" /> {n.edition}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} color="var(--maroon)" /> {n.publishDate ? n.publishDate.substring(0, 10) : ''}</span>
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <a href={n.pdfUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <ExternalLink size={14} /> View PDF
                </a>
                <button onClick={() => startEdit(n)} className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Edit3 size={14} /> Edit
                </button>
                <button onClick={() => del(n._id)} className="btn btn-danger btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
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
