import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, CheckCircle2, Heart, Clock, ArrowRight, Shield } from 'lucide-react';
import api from '../services/api.js';

import AboutSection from './About.jsx';
import ProjectsSection from './Projects.jsx';
import EventsSection from './Events.jsx';
import NewslettersSection from './Newsletters.jsx';
import DirectorySection from './Directory.jsx';
import ContactSection from './Contact.jsx';
import FalconBackground from '../components/FalconBackground.jsx';

export default function Home() {
  const [stats, setStats] = useState(null);
  const location = useLocation();

  /*
  useEffect(() => {
    api.get('/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (stats) {
      setTimeout(() => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.1 });
        document.getElementById('stats')?.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
        return () => observer.disconnect();
      }, 50);
    }
  }, [stats]);
  */

  return (
    <>
      <FalconBackground />
      <section id="home" style={{
        minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
        textAlign:'center', position:'relative', overflow:'hidden',
        padding:'120px 24px 80px',
        zIndex: 10
      }}>
        {/* Background glow */}
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 20%, rgba(110,30,36,0.06) 0%, transparent 65%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:760, position:'relative' }} className="fade-up">
          <div className="section-tag">DISTRICT 3192</div>
          <h1 style={{
            fontSize:'clamp(2.4rem,6vw,4rem)', fontWeight:900, lineHeight:1.1,
            marginBottom:'24px', marginTop:'16px',
            background:'linear-gradient(135deg, var(--maroon-dark) 0%, var(--maroon) 50%, var(--maroon-light) 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
          }}>
            Rotaract Club of<br />Falcon Youth
          </h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'1.1rem', lineHeight:1.8, marginBottom:'40px', maxWidth:540, margin:'0 auto 40px' }}>
            A community of passionate young leaders dedicated to fellowship, networking, professional growth and creating meaningful change in the world around us.
          </p>

        </div>
      </section>

      {/* ── Stats (Commented out) ── */}
      {/*
      {stats && (
        <section id="stats" style={{ padding:'60px 0', borderTop:'1px solid var(--glass-border)', borderBottom:'1px solid var(--glass-border)' }}>
          <div className="container" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'32px', textAlign:'center' }}>
            {[
              { value: stats.activeMembers,      label:'Active Members',       Icon: Users },
              { value: stats.projectsCompleted,  label:'Projects Completed',   Icon: CheckCircle2 },
              { value: stats.livesImpacted,      label:'Lives Impacted',       Icon: Heart },
              { value: stats.volunteerHours,     label:'Volunteer Hours',      Icon: Clock },
            ].map(s => (
              <div key={s.label} className="fade-up" style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '28px 16px',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.4)'
              }}>
                <div style={{ marginBottom:'12px', display:'flex', justifyContent:'center' }}>
                  <s.Icon size={32} color="var(--maroon)" />
                </div>
                <div style={{ fontSize:'2.4rem', fontWeight:900, color:'var(--maroon)', lineHeight:1 }}>
                  <AnimatedNumber target={s.value} />
                </div>
                <div style={{ color:'var(--text-secondary)', fontSize:'0.82rem', marginTop:'6px', textTransform:'uppercase', letterSpacing:'1px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}
      */}

      {/* Embedded Pages */}
      <div id="about"><AboutSection isSection={true} /></div>
      
      {/* ── CTA ── */}
      <section className="section fade-up" style={{ textAlign:'center' }}>
        <div className="container">
          <div className="glass-card" style={{ padding:'60px 40px', maxWidth:680, margin:'0 auto' }}>
            <div style={{ display:'inline-flex', marginBottom:'20px' }}>
              <img src="/falcon-logo.png" alt="Falcon Youth" style={{ height: '80px', width: 'auto', transform: 'scale(3.2)' }} />
            </div>
            <h2 className="section-title" style={{ marginBottom:16 }}>READY TO BECOME A FALCONITE?</h2>
            <p style={{ color:'var(--text-secondary)', marginBottom:32, lineHeight:1.8 }}>
              Join a community where you don’t just belong — you grow, lead, serve and create impact.
            </p>
            <a href="#contact" className="btn btn-primary" style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
              Get in Touch <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <div id="projects"><ProjectsSection isSection={true} /></div>
      <div id="events"><EventsSection isSection={true} /></div>
      <div id="newsletters"><NewslettersSection isSection={true} /></div>
      <div id="directory"><DirectorySection isSection={true} /></div>
      <div id="contact"><ContactSection isSection={true} /></div>
    </>
  );
}

function AnimatedNumber({ target }) {
  const [val, setVal] = useState(0);
  
  useEffect(() => {
    let current = 0;
    const inc = Math.max(1, Math.floor(target / 40));
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) {
        setVal(target);
        clearInterval(timer);
      } else {
        setVal(current);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  
  return <>{val.toLocaleString()}{target > 100 ? '+' : ''}</>;
}
