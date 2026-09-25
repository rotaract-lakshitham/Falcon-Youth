import { useEffect, useState } from 'react';
import { Users, CheckCircle2, Heart, Clock, BarChart3, Save, AlertCircle } from 'lucide-react';
import api from '../../services/api.js';

export default function ManageStats() {
  /*
  const [form, setForm]   = useState({ activeMembers:0, projectsCompleted:0, livesImpacted:0, volunteerHours:0 });
  const [msg, setMsg]     = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/stats').then(r => setForm({
      activeMembers:     r.data.activeMembers,
      projectsCompleted: r.data.projectsCompleted,
      livesImpacted:     r.data.livesImpacted,
      volunteerHours:    r.data.volunteerHours,
    })).catch(() => {});
  }, []);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: Number(e.target.value) }));

  const save = async (e) => {
    e.preventDefault(); setLoading(true); setMsg('');
    try {
      await api.put('/stats', form);
      setMsg('Stats updated! Changes are live on the homepage.');
    } catch (err) { setMsg(err.response?.data?.message || 'Error occurred'); }
    finally { setLoading(false); }
  };

  const FIELDS = [
    { name:'activeMembers',     label:'Active Members',     Icon: Users },
    { name:'projectsCompleted', label:'Projects Completed', Icon: CheckCircle2 },
    { name:'livesImpacted',     label:'Lives Impacted',     Icon: Heart },
    { name:'volunteerHours',    label:'Volunteer Hours',    Icon: Clock },
  ];
  */

  return (
    <div style={{ maxWidth:640 }}>
      <h2 style={{ fontWeight:800, fontSize:'1.4rem', marginBottom:8, display:'flex', alignItems:'center', gap:8 }}>
        <BarChart3 size={22} color="var(--maroon)" /> Homepage Impact Stats
      </h2>
      <p style={{ color:'var(--text-muted)', marginBottom:28, fontSize:'0.88rem' }}>
        (Stats management is currently disabled/commented out)
      </p>
    </div>
  );
}
