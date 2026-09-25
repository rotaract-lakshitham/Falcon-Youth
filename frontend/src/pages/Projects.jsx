import { useEffect, useState } from 'react';
import { Calendar, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import TiltCard from '../components/TiltCard.jsx';
import api from '../services/api.js';

const AVENUES = ['All', 'Community Service', 'Club Service', 'Professional Development', 'International Service', 'General'];

export default function Projects({ isSection = false }) {
  const [projects, setProjects]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeAvenue, setActiveAvenue] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/projects')
      .then(r => setProjects(r.data))
      .catch(err => console.error('Failed to fetch projects', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
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
  }, [projects]);

  const filtered = activeAvenue === 'All'
    ? projects
    : projects.filter(p => p.avenue === activeAvenue);

  return (
    <>
      {!isSection && (
        <div className="page-hero">
          <div className="container">
            <div className="section-tag">Our Impact</div>
            <h1 className="section-title">Projects & Initiatives</h1>
            <p className="section-subtitle">
              Every project we undertake carries the potential to transform lives and empower communities.
            </p>
          </div>
        </div>
      )}

      <section className="section">
        <div className="container">

          {isSection && (
            <div className="section-header fade-up">
              <div className="section-tag">Our Impact</div>
              <h2 className="section-title">Projects & Initiatives</h2>
            </div>
          )}

          {/* ── PROJECT DETAILS VIEW (Matches Screenshot Design) ── */}
          {selectedProject ? (
            <div style={{ maxWidth: 880, margin: '0 auto' }}>
              {/* Back navigation */}
              <button
                onClick={() => setSelectedProject(null)}
                className="btn btn-outline btn-sm"
                style={{ marginBottom: 24, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <ArrowLeft size={16} /> Projects / Details
              </button>

              {/* Banner Image if available */}
              {selectedProject.bannerUrl && (
                <div style={{
                  height: 280,
                  borderRadius: 16,
                  backgroundImage: `url(${selectedProject.bannerUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  marginBottom: 28,
                  border: '1px solid var(--glass-border)'
                }} />
              )}

              {/* Badges */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <span style={{
                  background: 'var(--maroon)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  padding: '6px 14px',
                  borderRadius: 20,
                  display: 'inline-block'
                }}>
                  {selectedProject.avenue}
                </span>

                <span style={{
                  background: '#10b981',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  padding: '6px 14px',
                  borderRadius: 20,
                  display: 'inline-block'
                }}>
                  {selectedProject.status}
                </span>
              </div>

              {/* Title */}
              <h1 style={{
                fontSize: '2.4rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: 16,
                lineHeight: 1.2
              }}>
                {selectedProject.title}
              </h1>

              {/* Meta info: Date & Location */}
              <div style={{
                display: 'flex',
                gap: 24,
                color: 'var(--text-muted)',
                fontSize: '0.95rem',
                marginBottom: 32,
                flexWrap: 'wrap'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={16} color="var(--maroon)" /> {new Date(selectedProject.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={16} color="var(--maroon)" /> {selectedProject.location}</span>
              </div>

              {/* Description Glass Box (Exact design match) */}
              <div className="glass-card" style={{ padding: '36px', borderRadius: 16 }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 16,
                  paddingBottom: 16,
                  borderBottom: '1px solid var(--glass-border)'
                }}>
                  Project Description
                </h3>

                <div style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-line'
                }}>
                  {selectedProject.description}
                </div>
              </div>
            </div>
          ) : (

            /* ── PROJECTS LISTING GRID ── */
            <>
              {/* Filter Chips */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 44 }}>
                {AVENUES.map(a => (
                  <button
                    key={a}
                    onClick={() => setActiveAvenue(a)}
                    className={`btn ${activeAvenue === a ? 'btn-primary' : 'btn-outline'} btn-sm`}
                  >
                    {a}
                  </button>
                ))}
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div className="spinner" style={{ margin: '0 auto' }} />
                </div>
              ) : filtered.length === 0 ? (
                <div className="empty-state">
                  <p>No projects found under "{activeAvenue}". Check back soon!</p>
                </div>
              ) : (
                <div className="grid-3">
                  {filtered.map(p => (
                    <TiltCard
                      key={p._id}
                      className="glass-card fade-up"
                      style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}
                    >
                      <div onClick={() => setSelectedProject(p)}>
                      <div>
                        {p.bannerUrl && (
                          <div style={{
                            height: 140,
                            borderRadius: 10,
                            backgroundImage: `url(${p.bannerUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            marginBottom: 16
                          }} />
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <span className="badge" style={{ fontSize: '0.72rem', background: 'rgba(110,30,36,0.1)', color: 'var(--maroon)' }}>{p.avenue}</span>
                          <span className="badge" style={{ fontSize: '0.72rem', background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>{p.status}</span>
                        </div>
                        <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8, color: 'var(--text-primary)' }}>{p.title}</h3>
                        <p style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.85rem',
                          lineHeight: 1.6,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          marginBottom: 16
                        }}>
                          {p.description}
                        </p>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid var(--glass-border)',
                        paddingTop: 12,
                        marginTop: 12,
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={14} color="var(--maroon)" /> {new Date(p.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                        <span style={{ color: 'var(--maroon)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>Read Details <ArrowRight size={14} /></span>
                      </div>
                      </div>
                    </TiltCard>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </section>
    </>
  );
}
