import { useState } from 'react';
import { Calendar, Clock, MapPin, X, ExternalLink, Maximize2 } from 'lucide-react';
import TiltCard from './TiltCard.jsx';

export default function EventCard({ event }) {
  const { title, description, date, time, location, category, imageUrl, status, registrationUrl } = event;
  const [showModal, setShowModal] = useState(false);

  const formatted = new Date(date).toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'long', year:'numeric' });

  return (
    <>
      <TiltCard 
        className="glass-card" 
        style={{ 
          overflow:'hidden', 
          display:'flex', 
          flexDirection:'column', 
          height:'100%',
          cursor: 'pointer',
          position: 'relative'
        }}
        onClick={() => setShowModal(true)}
      >
        {/* Banner */}
        <div style={{
          height:'200px',
          background: imageUrl ? `url(${imageUrl}) center/cover no-repeat` : 'linear-gradient(135deg,var(--maroon-dark),var(--bg-secondary))',
          position:'relative', flexShrink:0,
        }}>
          <div style={{ position:'absolute', top:12, left:12, zIndex:2 }}>
            <span className={`badge badge-${status}`} style={{ backdropFilter:'blur(8px)', background: status === 'upcoming' ? 'rgba(110, 30, 36, 0.88)' : 'rgba(0,0,0,0.6)', color:'#fff' }}>
              {status === 'upcoming' ? 'Upcoming' : 'Past'}
            </span>
          </div>
          {category && (
            <div style={{ position:'absolute', top:12, right:12, zIndex:2 }}>
              <span className="badge" style={{ background:'rgba(0,0,0,0.65)', backdropFilter:'blur(8px)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)' }}>
                {category}
              </span>
            </div>
          )}
          <div style={{
            position:'absolute', inset:0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)',
            display:'flex', alignItems:'flex-end', justifyContent:'flex-end', padding:'10px'
          }}>
            <span style={{ color:'#fff', fontSize:'0.75rem', display:'flex', alignItems:'center', gap:4, background:'rgba(0,0,0,0.5)', padding:'4px 10px', borderRadius:'20px', backdropFilter:'blur(4px)' }}>
              <Maximize2 size={12} /> Click to expand
            </span>
          </div>
        </div>

        <div style={{ padding:'20px', display:'flex', flexDirection:'column', flex:1 }}>
          <h3 style={{ fontWeight:800, marginBottom:'8px', fontSize:'1.1rem', lineHeight:1.35, color:'var(--text-primary)' }}>{title}</h3>
          <p style={{ color:'var(--text-secondary)', fontSize:'0.88rem', lineHeight:1.6, marginBottom:'16px', flex:1 }}>
            {description.length > 100 ? description.slice(0,100)+'…' : description}
          </p>
          
          <div style={{ fontSize:'0.82rem', color:'var(--text-muted)', display:'flex', flexDirection:'column', gap:'6px', marginBottom:'16px' }}>
            <span style={{ display:'flex', alignItems:'center', gap:6 }}><Calendar size={14} color="var(--maroon)" /> {formatted}</span>
            <span style={{ display:'flex', alignItems:'center', gap:6 }}><Clock size={14} color="var(--maroon)" /> {time}</span>
            <span style={{ display:'flex', alignItems:'center', gap:6 }}><MapPin size={14} color="var(--maroon)" /> {location}</span>
          </div>

          <div style={{ display:'flex', gap:10, marginTop:'auto' }}>
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
              className="btn btn-outline btn-sm"
              style={{ flex:1, justifyContent:'center' }}
            >
              View Details
            </button>

            {status === 'upcoming' && registrationUrl && (
              <a 
                href={registrationUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-primary btn-sm" 
                style={{ justifyContent:'center' }}
                onClick={(e) => e.stopPropagation()}
              >
                Register →
              </a>
            )}
          </div>
        </div>
      </TiltCard>

      {/* ── EXPANDED EVENT DETAILS MODAL ── */}
      {showModal && (
        <div 
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px', animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setShowModal(false)}
        >
          <div 
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--glass-border)',
              borderRadius: '24px',
              maxWidth: '820px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowModal(false)}
              aria-label="Close details modal"
              style={{
                position: 'absolute', top: 16, right: 16, zIndex: 10,
                width: 38, height: 38, borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(6px)', transition: 'all 0.2s'
              }}
            >
              <X size={20} />
            </button>

            {/* Poster Image (Full Uncropped) */}
            {imageUrl && (
              <div style={{ background: '#0a0a0f', width: '100%', textAlign: 'center', padding: '16px 0', borderBottom: '1px solid var(--glass-border)' }}>
                <img 
                  src={imageUrl} 
                  alt={title} 
                  style={{ maxHeight: '500px', width: 'auto', maxWidth: '100%', objectFit: 'contain', borderRadius: '12px' }} 
                />
              </div>
            )}

            {/* Modal Body */}
            <div style={{ padding: '28px' }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                <span className={`badge badge-${status}`}>
                  {status === 'upcoming' ? 'Upcoming Event' : 'Past Event'}
                </span>
                {category && (
                  <span className="badge" style={{ background: 'rgba(110,30,36,0.12)', color: 'var(--maroon)' }}>
                    {category}
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.3 }}>
                {title}
              </h2>

              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px',
                padding: '18px', background: 'var(--bg-secondary)', borderRadius: '14px', marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Calendar size={18} color="var(--maroon)" />
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Date</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{formatted}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Clock size={18} color="var(--maroon)" />
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Time</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{time}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MapPin size={18} color="var(--maroon)" />
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Location</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{location}</p>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>Full Event Details</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {description}
                </p>
              </div>

              {/* Action Footer */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', borderTop: '1px solid var(--glass-border)', paddingTop: 20 }}>
                <button className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Close
                </button>
                {status === 'upcoming' && registrationUrl && (
                  <a href={registrationUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    Register for Event <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
