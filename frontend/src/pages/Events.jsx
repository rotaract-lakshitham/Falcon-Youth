import { useEffect, useState } from 'react';
import { Calendar, History, Inbox } from 'lucide-react';
import EventCard from '../components/EventCard.jsx';
import api from '../services/api.js';

export default function Events({ isSection = false }) {
  const [events, setEvents]   = useState([]);
  const [tab, setTab]         = useState('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/events?status=${tab}`).then(r => setEvents(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [tab]);

  useEffect(() => {
    if (events.length > 0) {
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
  }, [events]);

  return (
    <>
      {!isSection && (
        <div className="page-hero">
          <div className="container">
            <div className="section-tag">What's Happening</div>
            <h1 className="section-title">Club Events</h1>
            <p className="section-subtitle">Stay updated on upcoming events and celebrate our past achievements.</p>
          </div>
        </div>
      )}

      <section className="section">
        <div className="container">
          {isSection && (
            <div className="section-header fade-up">
              <div className="section-tag">What's Happening</div>
              <h2 className="section-title">Club Events</h2>
            </div>
          )}
          {/* Tabs */}
          <div className="fade-up" style={{ display:'flex', gap:12, justifyContent:'center', marginBottom:48 }}>
            {[
              { key: 'upcoming', label: 'Upcoming', Icon: Calendar },
              { key: 'past',     label: 'Past Events', Icon: History }
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`btn ${tab===t.key ? 'btn-primary' : 'btn-outline'}`} style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
                <t.Icon size={16} /> {t.label}
              </button>
            ))}
          </div>

          {loading
            ? <div className="spinner" />
            : events.length === 0
              ? <div className="empty-state"><Inbox size={48} color="var(--maroon)" style={{ opacity: 0.5 }} /><p style={{marginTop:16}}>No {tab} events right now.</p></div>
              : <div className="grid-3">{events.map(e => <EventCard key={e._id} event={e} />)}</div>
          }
        </div>
      </section>
    </>
  );
}
