import { useState, useEffect } from 'react';
import { User, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import TiltCard from './TiltCard.jsx';

const InstagramIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function CouncilCarousel({ members }) {
  const [current, setCurrent] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!members.length) return <p style={{ color:'var(--text-muted)', textAlign:'center' }}>No members added yet.</p>;

  const maxIndex = Math.max(0, members.length - itemsPerView);
  
  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(maxIndex, c + 1));

  return (
    <div style={{ position:'relative', maxWidth: 1100, margin:'0 auto', userSelect:'none', padding: '0 50px' }}>
      <div style={{ overflow: 'hidden' }}>
        <div style={{
          display: 'flex', gap: '24px', transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
          transform: `translateX(calc(-${current * (100 / itemsPerView)}% - ${current * (24 / itemsPerView)}px))`
        }}>
          {members.map((m, i) => (
            <TiltCard key={m._id || i} style={{
              flex: `0 0 calc(${100 / itemsPerView}% - ${(24 * (itemsPerView - 1)) / itemsPerView}px)`,
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              background: 'var(--bg-card)',
              border: '1px solid var(--glass-border)',
              aspectRatio: '1/1',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            }} className="council-card">
              
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: m.photoUrl ? `url(${m.photoUrl}) center/cover` : 'linear-gradient(135deg,var(--maroon),var(--maroon-dark))',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {!m.photoUrl && <User size={80} color="#ffffff" opacity={0.5} />}
              </div>
              
              {/* Overlay */}
              <div className="council-card-overlay" style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.7) 60%, transparent 100%)',
                padding: '24px',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                height: '100%',
              }}>
                <div style={{ transform: 'translateY(10px)', transition: 'transform 0.3s ease' }} className="council-card-content">
                  <p style={{ color:'var(--maroon-light)', fontSize:'0.7rem', letterSpacing:'2px', textTransform:'uppercase', fontWeight:700, marginBottom:'4px' }}>
                    {m.rotaryYear}
                  </p>
                  <h3 style={{ color: '#fff', fontWeight:800, fontSize:'1.4rem', marginBottom:'2px' }}>{m.name}</h3>
                  <p style={{ color:'rgba(255,255,255,0.8)', fontWeight:500, fontSize:'0.9rem', marginBottom:'12px' }}>{m.designation}</p>
                  
                  <div className="council-card-hidden" style={{ opacity: 0, maxHeight: 0, overflow: 'hidden', transition: 'all 0.3s ease' }}>
                    {m.bio && <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.85rem', lineHeight:1.5, marginBottom:'16px' }}>{m.bio}</p>}
                    <div style={{ display:'flex', gap:10 }}>
                      {m.socials?.linkedin  && <a href={m.socials.linkedin} target="_blank" rel="noreferrer" style={socialBtn}><LinkedinIcon size={16}/></a>}
                      {m.socials?.instagram && <a href={m.socials.instagram} target="_blank" rel="noreferrer" style={socialBtn}><InstagramIcon size={16}/></a>}
                      {m.socials?.email     && <a href={`mailto:${m.socials.email}`} style={socialBtn}><Mail size={16}/></a>}
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>

      <button onClick={prev} disabled={current === 0} aria-label="previous" style={{...arrowStyle('left'), opacity: current === 0 ? 0.3 : 1}}><ChevronLeft size={20} /></button>
      <button onClick={next} disabled={current === maxIndex} aria-label="next" style={{...arrowStyle('right'), opacity: current === maxIndex ? 0.3 : 1}}><ChevronRight size={20} /></button>

      {/* Dots */}
      <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:24 }}>
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} aria-label={`page ${i+1}`} style={{
            width: i===current ? 24 : 8, height:8, borderRadius:4,
            background: i===current ? 'var(--maroon)' : 'var(--glass-border)',
            border:'none', cursor:'pointer', transition:'all 0.3s',
          }} />
        ))}
      </div>
    </div>
  );
}

const arrowStyle = (side) => ({
  position:'absolute', top:'50%', transform:'translateY(-50%)',
  [side]: 0,
  width:44, height:44, borderRadius:'50%',
  background:'var(--bg-card)', border:'1px solid var(--glass-border)',
  color:'var(--maroon)', cursor:'pointer',
  display:'flex', alignItems:'center', justifyContent:'center',
  transition:'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  zIndex: 10
});

const socialBtn = {
  width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', 
  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
  transition: 'background 0.2s'
};
