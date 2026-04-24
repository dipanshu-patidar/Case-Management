import { useState, useEffect, useRef } from 'react';

export function downloadFile(filename, content = "Dummy legal document content.") {
  const el = document.createElement('a');
  el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  el.setAttribute('download', filename);
  el.style.display = 'none';
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
}

// ── Toast System ─────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const toast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };
  return { toasts, toast };
}

export function ToastContainer({ toasts }) {
  if (!toasts.length) return null;
  const colors = { success: 'bg-emerald-600', error: 'bg-red-600', info: 'bg-primary-600', warning: 'bg-amber-500' };
  const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`${colors[t.type] || colors.success} text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2.5 text-[13px] font-medium animate-toast pointer-events-auto min-w-[240px]`}>
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px] flex-shrink-0">{icons[t.type] || '✓'}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ── Badge Component ───────────────────────────────────────
export function Badge({ status }) {
  const map = {
    active:   ['bg-emerald-50 text-emerald-700 border border-emerald-200', '● Active'],
    inactive: ['bg-slate-100 text-slate-500 border border-slate-200',      '● Inactive'],
    pending:  ['bg-amber-50 text-amber-700 border border-amber-200',        '● Pending'],
    closed:   ['bg-slate-100 text-slate-500 border border-slate-200',       '● Closed'],
    completed:['bg-slate-100 text-slate-500 border border-slate-200',       '● Complete'],
    new:      ['bg-blue-50 text-blue-700 border border-blue-200',           '● New'],
    screening:['bg-amber-50 text-amber-700 border border-amber-200',       '● Screening'],
    consultation_set: ['bg-indigo-50 text-indigo-700 border border-indigo-200', '● Consultation'],
    retained: ['bg-emerald-50 text-emerald-700 border border-emerald-200',  '● Retained'],
    declined: ['bg-red-50 text-red-700 border border-red-200',              '● Declined'],
    archived: ['bg-slate-100 text-slate-500 border border-slate-200',       '● Archived'],
    draft:    ['bg-slate-100 text-slate-600 border border-slate-200',       '● Pending'],
    void:     ['bg-slate-100 text-slate-500 border border-slate-200',       '● Void'],
    unpaid:   ['bg-red-50 text-red-700 border border-red-200',              '● Unpaid'],
    due:      ['bg-indigo-50 text-indigo-700 border border-indigo-200',     '● Due'],
    paid:     ['bg-emerald-50 text-emerald-700 border border-emerald-200',  '✓ Paid'],
    overdue:  ['bg-red-50 text-red-700 border border-red-200',              '! Overdue'],
    high:     ['bg-red-50 text-red-700 border border-red-200',              '▲ High'],
    medium:   ['bg-amber-50 text-amber-700 border border-amber-200',        '→ Medium'],
    low:      ['bg-blue-50 text-blue-700 border border-blue-200',           '↓ Low'],
  };
  const [cls, label] = map[status] || ['bg-slate-100 text-slate-500', status];
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-700 uppercase tracking-wider ${cls}`}>{label}</span>;
}

// ── Avatar ────────────────────────────────────────────────
export function Avatar({ initials, size = 'sm', color }) {
  const sizes = { xs:'w-6 h-6 text-[10px]', sm:'w-7 h-7 text-[11px]', md:'w-9 h-9 text-[13px]', lg:'w-11 h-11 text-base', xl:'w-14 h-14 text-xl' };
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center font-700 flex-shrink-0 text-white`}
      style={{ background: color || 'linear-gradient(135deg, #0B1F3A, #C9A24A)' }}>
      {initials}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────
export function StatCard({ label, value, change, icon, gradient, iconBg }) {
  return (
    <div className="stat-card cursor-default">
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl" style={{ background: gradient }} />
      <div className="flex items-start justify-between mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${iconBg}`}>{icon}</div>
        {change && (
          <span className={`text-[11px] font-600 px-1.5 py-0.5 rounded-full ${change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-800 text-slate-900 font-display leading-tight">{value}</div>
      <div className="text-[12px] text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}

// ── Page Header ───────────────────────────────────────────
export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex items-start sm:items-center justify-between mb-4 flex-wrap gap-3">
      <div>
        <h1 className="text-xl font-700 text-slate-900 font-display">{title}</h1>
        {subtitle && <p className="text-[12px] text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">{children}</div>}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────
export function Card({ children, className = '', noPad = false }) {
  return (
    <div className={`card ${noPad ? '' : 'p-4'} ${className}`}>
      {children}
    </div>
  );
}

// ── Table ─────────────────────────────────────────────────
export function Table({ headers, children, searchPlaceholder, onSearch, actions }) {
  return (
    <div className="card overflow-hidden">
      {(searchPlaceholder || actions) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 gap-3 flex-wrap">
          {searchPlaceholder && (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 min-w-0 w-full sm:w-auto sm:min-w-[200px]">
              <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input className="bg-transparent border-none outline-none text-[13px] text-slate-700 w-full placeholder:text-slate-400" placeholder={searchPlaceholder} onChange={e => onSearch?.(e.target.value)} />
            </div>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {headers.map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-[11px] font-600 text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function Tr({ children, onClick }) {
  return (
    <tr className={`border-b border-slate-50 last:border-0 ${onClick ? 'hover:bg-slate-50 cursor-pointer' : 'hover:bg-slate-50/50'} transition-colors`} onClick={onClick}>
      {children}
    </tr>
  );
}

export function Td({ children, className = '' }) {
  return <td className={`px-4 py-2.5 text-[13px] text-slate-700 ${className}`}>{children}</td>;
}

// ── Tabs ──────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex border-b border-slate-200 mb-4 overflow-x-auto no-scrollbar scroll-smooth">
      {tabs.map(tab => (
        <button key={tab} onClick={() => onChange(tab)}
          className={`tab-btn ${active === tab ? 'active' : ''}`}>
          {tab}
        </button>
      ))}
    </div>
  );
}

// ── Search Input ──────────────────────────────────────────
export function SearchInput({ placeholder, value, onChange }) {
  return (
    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
      <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input className="bg-transparent border-none outline-none text-[13px] text-slate-700 w-full placeholder:text-slate-400" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────
export function Modal({ title, onClose, children, footer, wide }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} animate-slide-up max-h-[90vh] flex flex-col`}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-base font-700 text-slate-900">{title}</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="overflow-y-auto p-5 flex-1">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex-wrap">{footer}</div>}
      </div>
    </div>
  );
}

// ── Form Fields ───────────────────────────────────────────
export function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-[12px] font-600 text-slate-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export function Input({ ...props }) {
  return <input className="form-input" {...props} />;
}

export function Select({ children, ...props }) {
  return <select className="form-input cursor-pointer" {...props}>{children}</select>;
}

export function Textarea({ ...props }) {
  return <textarea className="form-input resize-none" {...props} />;
}

// ── Timeline ──────────────────────────────────────────────
export function Timeline({ items }) {
  const dotColor = { green:'bg-emerald-500', blue:'bg-primary-500', gray:'bg-slate-300', amber:'bg-amber-500' };
  return (
    <div className="space-y-0">
      {items.map((item, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center flex-shrink-0 w-5">
            <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${dotColor[item.color] || 'bg-slate-300'}`} />
            {i < items.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1" />}
          </div>
          <div className="pb-4 flex-1">
            <p className="text-[13px] font-500 text-slate-800">{item.title}</p>
            {item.desc && <p className="text-[12px] text-slate-500 mt-0.5">{item.desc}</p>}
            <p className="text-[11px] text-slate-400 mt-1">{item.date}{item.by ? ` · ${item.by}` : ''}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────
export function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-4xl mb-3 opacity-40">{icon}</div>
      <p className="text-[14px] font-600 text-slate-600">{title}</p>
      {desc && <p className="text-[12px] text-slate-400 mt-1 max-w-[240px]">{desc}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────────
export function ProgressBar({ pct, color = 'bg-primary-500' }) {
  return (
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ── File Icon ─────────────────────────────────────────────
export function FileIcon({ type }) {
  if (type === 'pdf') return <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-lg">📄</div>;
  if (type === 'doc') return <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-lg">📝</div>;
  return <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-lg">🖼️</div>;
}
