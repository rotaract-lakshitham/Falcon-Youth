import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import TiltCard from './TiltCard.jsx';

export default function EventCard({ event }) {
  const { _id, title, description, date, time, location, category, imageUrl, status, registrationUrl } = event;
  const formatted = new Date(date).toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'long', year:'numeric' });

  return (
    <TiltCard className="glass-card" style={{ overflow:'hidden', display:'flex', flexDirection:'column', height:'100%' }}>
      {/* Banner */}
      <div style={{
        height:'180px',
        background: imageUrl ? `url(${imageUrl}) center/cover` : 'linear-gradient(135deg,var(--maroon-dark),var(--bg-secondary))',
        position:'relative', flexShrink:0,
      }}>
        <div style={{ position:'absolute', top:12, left:12 }}>
          <span className={`badge badge-${status}`}>
            {status === 'upcoming' ? 'Upcoming' : 'Past'}
          </span>
        </div>
        {category && (
          <div style={{ position:'absolute', top:12, right:12 }}>
            <span className="badge" style={{ background:'rgba(0,0,0,0.5)', color:'var(--text-secondary)', border:'none' }}>{category}</span>
          </div>
        )}
      </div>

      <div style={{ padding:'20px', display:'flex', flexDirection:'column', flex:1 }}>
        <h3 style={{ fontWeight:700, marginBottom:'8px', fontSize:'1.05rem', lineHeight:1.3 }}>{title}</h3>
        <p style={{ color:'var(--text-secondary)', fontSize:'0.85rem', lineHeight:1.6, marginBottom:'16px', flex:1 }}>
          {description.length > 110 ? description.slice(0,110)+'…' : description}
        </p>
        <div style={{ fontSize:'0.82rem', color:'var(--text-muted)', display:'flex', flexDirection:'column', gap:'6px', marginBottom:'16px' }}>
          <span style={{ display:'flex', alignItems:'center', gap:6 }}><Calendar size={14} color="var(--maroon)" /> {formatted}</span>
          <span style={{ display:'flex', alignItems:'center', gap:6 }}><Clock size={14} color="var(--maroon)" /> {time}</span>
          <span style={{ display:'flex', alignItems:'center', gap:6 }}><MapPin size={14} color="var(--maroon)" /> {location}</span>
        </div>
        {status === 'upcoming' && registrationUrl && (
          <a href={registrationUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ justifyContent:'center' }}>
            Register Now →
          </a>
        )}
      </div>
    </TiltCard>
  );
}
