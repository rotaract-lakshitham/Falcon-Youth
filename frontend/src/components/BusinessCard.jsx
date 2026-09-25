import { Building2, MapPin, ArrowRight } from 'lucide-react';
import TiltCard from './TiltCard.jsx';

export default function BusinessCard({ business }) {
  const { businessName, category, ownerName, description, location, contactUrl, logoUrl } = business;
  return (
    <TiltCard className="glass-card fade-up" style={{ padding:'24px', display:'flex', gap:'16px', alignItems:'flex-start', height:'100%' }}>
      {/* Logo */}
      <div style={{
        width:56, height:56, borderRadius:'12px', flexShrink:0, overflow:'hidden',
        background: logoUrl ? `url(${logoUrl}) center/cover` : 'linear-gradient(135deg,var(--maroon-dark),var(--bg-secondary))',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        {!logoUrl && <Building2 size={24} color="var(--maroon)" />}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'8px', flexWrap:'wrap' }}>
          <h3 style={{ fontWeight:700, fontSize:'1rem', marginBottom:'4px' }}>{businessName}</h3>
          <span className="section-tag" style={{ fontSize:'0.68rem', whiteSpace:'nowrap' }}>{category}</span>
        </div>
        <p style={{ color:'var(--text-muted)', fontSize:'0.78rem', marginBottom:'6px', display:'flex', alignItems:'center', gap:4 }}>
          by {ownerName} · <MapPin size={12} color="var(--maroon)" /> {location}
        </p>
        <p style={{ color:'var(--text-secondary)', fontSize:'0.85rem', lineHeight:1.6, marginBottom:'12px' }}>
          {description.length > 100 ? description.slice(0,100)+'…' : description}
        </p>
        {contactUrl && (
          <a href={contactUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
            View / Contact <ArrowRight size={14} />
          </a>
        )}
      </div>
    </TiltCard>
  );
}
