import { FileText, Calendar } from 'lucide-react';
import PDFViewer from './PDFViewer.jsx';

export default function NewsletterCard({ newsletter }) {
  const { title, edition, publishDate, pdfUrl, coverImageUrl } = newsletter;
  return (
    <div className="glass-card" style={{ overflow: 'hidden' }}>
      {/* Cover */}
      <div style={{
        height: '180px', background: coverImageUrl
          ? `url(${coverImageUrl}) center/cover`
          : 'linear-gradient(135deg, var(--maroon-dark), var(--bg-secondary))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        {!coverImageUrl && <FileText size={48} color="var(--maroon)" style={{ opacity: 0.7 }} />}
      </div>
      <div style={{ padding: '20px' }}>
        <div className="section-tag" style={{ marginBottom: '10px' }}>{edition}</div>
        <h3 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '1.05rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Calendar size={14} color="var(--maroon)" /> {new Date(publishDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}
        </p>
        <PDFViewer pdfUrl={pdfUrl} title={title} />
      </div>
    </div>
  );
}
