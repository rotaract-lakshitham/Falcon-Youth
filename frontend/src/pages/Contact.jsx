import { useEffect, useState } from 'react';
import { MapPin, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api.js';

const InstagramIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function Contact({ isSection = false }) {
  const [form, setForm]         = useState({ name:'', email:'', phone:'', message:'' });
  const [contactEmail, setContactEmail] = useState('pp.rtr.lakshitha.m@gmail.com');
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    api.get('/contact/info')
      .then(r => { if (r.data?.email) setContactEmail(r.data.email); })
      .catch(() => {});
  }, []);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await api.post('/contact', form);
      setSent(true);
      toast.success('Message sent successfully! We will get back to you soon.');
      setForm({ name:'', email:'', phone:'', message:'' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send message. Please try again.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isSection && (
        <div className="page-hero">
          <div className="container">
            <div className="section-tag">Reach Out</div>
            <h1 className="section-title">Contact Us</h1>
            <p className="section-subtitle">Have a question or want to join? We'd love to hear from you.</p>
          </div>
        </div>
      )}

      <section className="section">
        <div className="container">
          {isSection && (
            <div className="section-header fade-up">
              <div className="section-tag">Reach Out</div>
              <h2 className="section-title">Contact Us</h2>
            </div>
          )}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:48 }}>
            {/* Info */}
            <div className="fade-up">
            <h2 style={{ fontWeight:700, color:'var(--maroon)', marginBottom:24, fontSize:'1.4rem' }}>Get in Touch</h2>
            {[
              {
                Icon: MapPin,
                label:'Location',
                val:'Bengaluru, Karnataka, India',
                link:'https://maps.google.com/?q=Bengaluru,+Karnataka,+India'
              },
              {
                Icon: InstagramIcon,
                label:'Instagram',
                val:'@rac_falconyouth',
                link:'https://www.instagram.com/rac_falconyouth?stkn=MWVpaG1sdTB1eDAxMw=='
              },
              {
                Icon: LinkedinIcon,
                label:'LinkedIn',
                val:'Rotaract Club of Falcon Youth',
                link:'https://www.linkedin.com/company/rotaract-club-of-falcon-youth-ri-dist3192/'
              },
            ].map(i => (
              <a
                key={i.label}
                href={i.link}
                target="_blank"
                rel="noreferrer"
                className="glass-card"
                style={{
                  padding: '20px',
                  marginBottom: 16,
                  display: 'flex',
                  gap: 16,
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'transform 0.2s, border-color 0.2s'
                }}
              >
                <div style={{ padding:'10px', borderRadius:'50%', background:'rgba(110, 30, 36, 0.08)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <i.Icon size={20} color="var(--maroon)" />
                </div>
                <div>
                  <div style={{ color:'var(--text-muted)', fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'1px', marginBottom:2 }}>{i.label}</div>
                  <div style={{ color:'var(--maroon)', fontSize:'0.95rem', fontWeight: 600 }}>{i.val} ↗</div>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          <div className="fade-up stagger-1">
            <h2 style={{ fontWeight:700, color:'var(--maroon)', marginBottom:24, fontSize:'1.4rem' }}>Send a Message</h2>
            {sent ? (
              <div className="alert alert-success" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={20} color="#4ade80" /> Message sent! We have received your inquiry and will reply to you shortly.
                </span>
                <button
                  onClick={() => setSent(false)}
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: 4, display: 'inline-flex', alignSelf: 'flex-start' }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="glass-card" style={{ padding:32 }}>
                {errorMsg && (
                  <div className="alert alert-error" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertCircle size={18} /> {errorMsg}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input name="name" className="form-control" placeholder="Your name" value={form.name} onChange={handle} required />
                </div>
                <div className="grid-2" style={{ gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input type="email" name="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={handle} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input type="tel" name="phone" className="form-control" placeholder="+91 98765 43210" value={form.phone} onChange={handle} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea name="message" className="form-control" rows={5} placeholder="Write your message here..." value={form.message} onChange={handle} required style={{ resize:'vertical' }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
                  {loading ? 'Sending…' : <>Send Message <Send size={16} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
        </div>
      </section>
    </>
  );
}

