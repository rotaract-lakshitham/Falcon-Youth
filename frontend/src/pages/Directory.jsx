import { useEffect, useState } from 'react';
import { Search, Building2 } from 'lucide-react';
import BusinessCard from '../components/BusinessCard.jsx';
import api from '../services/api.js';

export default function Directory({ isSection = false }) {
  const [businesses, setBusinesses] = useState([]);
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    api.get('/directory').then(r => setBusinesses(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (businesses.length > 0) {
      setTimeout(() => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
          });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
        return () => observer.disconnect();
      }, 50);
    }
  }, [businesses]);

  const filtered = businesses.filter(b =>
    b.businessName.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase()) ||
    b.ownerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {!isSection && (
        <div className="page-hero">
          <div className="container">
            <div className="section-tag">Falcon Community</div>
            <h1 className="section-title">Falcon Directory</h1>
            <p className="section-subtitle">Discover businesses and services run by our amazing members.</p>
          </div>
        </div>
      )}

      <section className="section">
        <div className="container">
          {isSection && (
            <div className="section-header fade-up">
              <div className="section-tag">Falcon Community</div>
              <h2 className="section-title">Falcon Directory</h2>
            </div>
          )}
          {/* Search */}
          <div className="fade-up" style={{ maxWidth:480, margin:'0 auto 48px', position:'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }} />
            <input
              className="form-control"
              style={{ paddingLeft:40 }}
              placeholder="Search by name, category or owner..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {loading
            ? <div className="spinner" />
            : filtered.length === 0
              ? <div className="empty-state"><Building2 size={48} color="var(--maroon)" style={{ opacity: 0.5 }} /><p style={{marginTop:16}}>No businesses found.</p></div>
              : <div style={{ display:'flex', flexDirection:'column', gap:16 }}>{filtered.map(b => <BusinessCard key={b._id} business={b} />)}</div>
          }
        </div>
      </section>
    </>
  );
}
