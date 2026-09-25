import { Link } from 'react-router-dom';
import { MapPin, Heart, Mail } from 'lucide-react';

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

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--glass-border)',
      padding: '60px 0 30px',
      marginTop: '40px',
    }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'40px', marginBottom:'40px' }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom:'20px', height: '60px', width: '220px', display:'flex', alignItems:'center', overflow: 'hidden' }}>
              <img src="/falcon-logo.png" alt="Rotaract Falcon Youth" style={{ height: '70px', width: 'auto', transform: 'scale(3.2)', transformOrigin: 'left center' }} />
            </div>
            <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', lineHeight:1.7 }}>
              Empowering youth to lead, serve, and create lasting impact in the community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color:'var(--maroon)', marginBottom:'16px', fontSize:'0.85rem', letterSpacing:'1px', textTransform:'uppercase' }}>Quick Links</h4>
            {['/', '/about', '/events', '/projects', '/newsletters', '/directory', '/contact'].map((path, i) => {
              const labels = ['Home','About','Events','Projects','Newsletters','Directory','Contact'];
              return (
                <div key={path} style={{ marginBottom:'8px' }}>
                  <Link to={path} style={{ color:'var(--text-muted)', fontSize:'0.9rem', transition:'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color='var(--maroon)'}
                    onMouseLeave={e => e.target.style.color='var(--text-muted)'}
                  >{labels[i]}</Link>
                </div>
              );
            })}
          </div>

          {/* Connect & Social */}
          <div>
            <h4 style={{ color:'var(--maroon)', marginBottom:'16px', fontSize:'0.85rem', letterSpacing:'1px', textTransform:'uppercase' }}>Connect With Us</h4>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px', fontSize:'0.88rem' }}>
              <a href="https://maps.google.com/?q=Bengaluru,+Karnataka,+India" target="_blank" rel="noreferrer" style={{ color:'var(--text-muted)', textDecoration:'none', display:'flex', alignItems:'center', gap:8 }}>
                <MapPin size={16} color="var(--maroon)" /> Bengaluru, Karnataka
              </a>
              <a href="https://www.instagram.com/rac_falconyouth?stkn=MWVpaG1sdTB1eDAxMw==" target="_blank" rel="noreferrer" style={{ color:'var(--maroon)', textDecoration:'none', fontWeight: 500, display:'flex', alignItems:'center', gap:8 }}>
                <InstagramIcon size={16} /> @rac_falconyouth ↗
              </a>
              <a href="https://www.linkedin.com/company/rotaract-club-of-falcon-youth-ri-dist3192/" target="_blank" rel="noreferrer" style={{ color:'var(--maroon)', textDecoration:'none', fontWeight: 500, display:'flex', alignItems:'center', gap:8 }}>
                <LinkedinIcon size={16} /> LinkedIn Page ↗
              </a>
              <a href="mailto:rcfalconyouth@gmail.com" style={{ color:'var(--maroon)', textDecoration:'none', fontWeight: 500, display:'flex', alignItems:'center', gap:8 }}>
                <Mail size={16} /> rcfalconyouth@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div style={{ borderTop:'1px solid var(--glass-border)', paddingTop:'24px', textAlign:'center', color:'var(--text-muted)', fontSize:'0.82rem', display:'flex', alignItems:'center', justifyContent:'center', gap:6, flexWrap:'wrap' }}>
          © {year} Rotaract Club of Falcon Youth. All rights reserved. | Built with <Heart size={14} color="var(--maroon)" fill="var(--maroon)" /> by <a href="https://www.linkedin.com/in/vinanth-h-b826b4253/" target="_blank" rel="noreferrer" style={{ color: 'var(--maroon)', textDecoration: 'none', fontWeight: 600 }}>Vinanth</a>
        </div>
      </div>
    </footer>
  );
}
