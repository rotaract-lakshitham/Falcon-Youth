import { useState } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, FileText, Download, X } from 'lucide-react';

export default function PDFViewer({ pdfUrl, title }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
      >
        <BookOpen size={16} /> Open PDF Viewer
      </button>
    );
  }

  const embedUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;

  const modalContent = (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 99999,
      background: 'rgba(10, 10, 15, 0.95)',
      backdropFilter: 'blur(16px)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 24px',
        background: '#12131a',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        flexWrap: 'wrap', gap: 12
      }}>
        <span style={{ color: 'var(--maroon)', fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={18} /> {title}
        </span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a href={pdfUrl} target="_blank" rel="noreferrer" download className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Download size={14} /> Download PDF
          </a>
          <button onClick={() => setOpen(false)} className="btn btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <X size={16} /> Close
          </button>
        </div>
      </div>

      {/* Embedded Viewer Body */}
      <div style={{ flex: 1, padding: '16px', background: '#0a0a0f' }}>
        <iframe
          src={embedUrl}
          style={{
            width: '100%',
            height: '100%',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            background: '#fff'
          }}
          title={title}
        />
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}


