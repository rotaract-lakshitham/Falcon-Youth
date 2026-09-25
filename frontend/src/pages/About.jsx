import { useEffect, useState } from 'react';
import { Target, Compass, Users, HeartHandshake, Award, Globe2 } from 'lucide-react';
import CouncilCarousel from '../components/CouncilCarousel.jsx';
import api from '../services/api.js';

export default function About({ isSection = false }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/council').then(r => setMembers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <>
      {!isSection && (
        <div className="page-hero">
          <div className="container">
            <div className="section-tag">Our Story</div>
            <h1 className="section-title">About Our Club</h1>
            <p className="section-subtitle">
              Rotaract Club of Falcon Youth — a community of dynamic young leaders committed to service, fellowship, and professional excellence.
            </p>
          </div>
        </div>
      )}

      {/* Mission / Vision */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap:32 }}>
            <div className="glass-card fade-up" style={{ padding:'36px' }}>
              <div style={{ display:'inline-flex', padding:'12px', borderRadius:'50%', background:'rgba(110, 30, 36, 0.08)', marginBottom:'16px' }}>
                <Target size={32} color="var(--maroon)" />
              </div>
              <h2 style={{ fontWeight:800, color:'var(--maroon)', marginBottom:12 }}>Our Mission</h2>
              <p style={{ color:'var(--text-secondary)', lineHeight:1.9 }}>
                To empower young people through meaningful service, quality projects, leadership, and strong connections. We believe in creating real impact, building lasting friendships, having fun along the way, and inspiring every individual to believe in themselves, grow together, and turn ideas into meaningful change.
              </p>
            </div>
            <div className="glass-card fade-up stagger-1" style={{ padding:'36px' }}>
              <div style={{ display:'inline-flex', padding:'12px', borderRadius:'50%', background:'rgba(110, 30, 36, 0.08)', marginBottom:'16px' }}>
                <Compass size={32} color="var(--maroon)" />
              </div>
              <h2 style={{ fontWeight:800, color:'var(--maroon)', marginBottom:12 }}>Our Vision</h2>
              <p style={{ color:'var(--text-secondary)', lineHeight:1.9 }}>
                To build a generation of purpose-driven young leaders who create quality-driven, meaningful impact, inspire change, and grow together through service, connection, self-belief, and lifelong friendships — making every project and every experience count.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Council Carousel */}
      <section className="section" style={{ borderTop:'1px solid var(--glass-border)' }}>
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-tag">2026–2027 Board</div>
            <h2 className="section-title">Board Of Directors</h2>
            <p className="section-subtitle">Meet the leaders steering Falcon Youth forward this Rotary Year.</p>
          </div>
          {loading
            ? <div className="spinner" />
            : <CouncilCarousel members={members} />
          }
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-tag">What Drives Us</div>
            <h2 className="section-title">Core Values</h2>
          </div>
          <div className="grid-4">
            {[
              { Icon: Users,          label:'Fellowship',   desc:'Building bonds that last a lifetime.' },
              { Icon: HeartHandshake, label:'Service',       desc:'Acting for the good of communities.' },
              { Icon: Award,          label:'Roots & Responsibility',   desc:'Creating Impact today while protecting the future for generations to come' },
              { Icon: Globe2,         label:'Connection',    desc:'Building meaningful relationships through collaboration, networking, and shared experiences.' },
            ].map(v => (
              <div key={v.label} className="glass-card fade-up" style={{ padding:'28px', textAlign:'center' }}>
                <div style={{ display:'inline-flex', padding:'10px', borderRadius:'50%', background:'rgba(110, 30, 36, 0.08)', marginBottom:'12px' }}>
                  <v.Icon size={28} color="var(--maroon)" />
                </div>
                <h3 style={{ fontWeight:700, marginBottom:8 }}>{v.label}</h3>
                <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', lineHeight:1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
