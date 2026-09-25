import { useEffect, useState } from 'react';
import NewsletterCard from '../components/NewsletterCard.jsx';
import { Inbox } from 'lucide-react';
import api from '../services/api.js';

export default function Newsletters({ isSection = false }) {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    api.get('/newsletters').then(r => setNewsletters(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (newsletters.length > 0) {
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
  }, [newsletters]);

  return (
    <>
      {!isSection && (
        <div className="page-hero">
          <div className="container">
            <div className="section-tag">Stay Informed</div>
            <h1 className="section-title">Newsletters</h1>
            <p className="section-subtitle">Read our monthly editions — Wings of Falcon — and keep up with everything happening in Rotaract.</p>
          </div>
        </div>
      )}

      <section className="section">
        <div className="container">
          {isSection && (
            <div className="section-header fade-up">
              <div className="section-tag">Stay Informed</div>
              <h2 className="section-title">Newsletters</h2>
            </div>
          )}
          {loading
            ? <div className="spinner" />
            : newsletters.length === 0
              ? <div className="empty-state"><Inbox size={48} color="var(--maroon)" /><p style={{marginTop:16}}>No newsletters published yet.</p></div>
              : <div className="grid-3">{newsletters.map(n => <NewsletterCard key={n._id} newsletter={n} />)}</div>
          }
        </div>
      </section>
    </>
  );
}
