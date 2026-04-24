import { useState, useEffect } from 'react';
import { PageHeader, Card, StatCard, ProgressBar, Input, Select, Field, downloadFile } from '../components/UI.jsx';
import api from '../services/api';

// ─────────────────────────────────────────────────────────
//  MARKETING DASHBOARD
// ─────────────────────────────────────────────────────────
export function MarketingDashboard({ navigate, toast, openModal }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.reports.marketing();
        if (cancelled) return;
        setData(res.data);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load marketing analytics');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[13px] text-slate-500">Loading marketing analytics…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in space-y-4">
        <Card className="border-red-200 bg-red-50/50">
          <p className="text-[13px] text-red-800 font-600">{error}</p>
        </Card>
      </div>
    );
  }

  const stats = data || {};

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="Marketing & Analytics" subtitle="Track lead sources, conversion rates, and ROI" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="Total Visitors" value={stats.visitors || 0} icon="🌐" iconBg="bg-blue-50" gradient="linear-gradient(90deg,#0B1F3A,#C9A24A)" />
        <StatCard label="Total Leads" value={stats.leads || 0} icon="✨" iconBg="bg-amber-50" gradient="linear-gradient(90deg,#f59e0b,#fbbf24)" />
        <StatCard label="Conv. Rate" value={`${stats.conversionRate || 0}%`} icon="🎯" iconBg="bg-emerald-50" gradient="linear-gradient(90deg,#10b981,#34d399)" />
        <StatCard label="Client Retained" value={stats.clients || 0} icon="🤝" iconBg="bg-accent-50" gradient="linear-gradient(90deg,#0B1F3A,#C9A24A)" />
        <StatCard label="Marketing Rev." value={`₹${Number(stats.revenue || 0).toLocaleString()}`} icon="💰" iconBg="bg-emerald-50" gradient="linear-gradient(90deg,#059669,#10b981)" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <h3 className="text-[14px] font-700 text-slate-900 mb-4">Leads by Channel</h3>
          <div className="space-y-4">
            {!stats.leadsBySource || stats.leadsBySource.length === 0 ? (
              <p className="text-[13px] text-slate-500">No lead source data yet.</p>
            ) : (
              stats.leadsBySource.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
                      <span className="text-[13px] text-slate-600 font-500">{c.name} ({c.count})</span>
                    </div>
                    <span className="text-[13px] font-700 text-slate-900">{c.value}%</span>
                  </div>
                  <ProgressBar pct={c.value} color={c.color} />
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-3">
          <p className="text-[13px] text-slate-500">
            {stats.leads > 0 
              ? `Dynamic tracking enabled. Analyzed ${stats.leads} leads and ${stats.clients} successful conversions.` 
              : "Campaign performance metrics are not available."}
          </p>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  REPORTS DASHBOARD
// ─────────────────────────────────────────────────────────
export function ReportsDashboard({ navigate, toast, openModal }) {
  const [reports, setReports] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Financial');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const loadReports = async () => {
    try {
      const res = await api.reports.list();
      setReports(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleGenerate = async () => {
    if (!title.trim() || !startDate || !endDate) {
       toast('Please fill all required fields.', 'error');
       return;
    }
    setIsGenerating(true);
    try {
      await api.reports.generate({
        title,
        category,
        start_date: startDate,
        end_date: endDate
      });
      toast('Report generated successfully!', 'success');
      setTitle('');
      loadReports();
    } catch (e) {
      toast(e.message || 'Generation failed', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (r) => {
    toast(`Preparing PDF for ${r.title}...`, 'info');
    try {
      const res = await api.reports.download(r.id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${r.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast('Report downloaded successfully', 'success');
    } catch (e) {
      toast(e.message || 'Download failed', 'error');
    }
  };

  const viewReport = (r) => {
    const d = r.data;
    const stats = [
      { label: 'Total Leads', value: d.leads ?? 0, icon: '✨', color: 'text-amber-600 bg-amber-50' },
      { label: 'New Matters', value: d.matters ?? 0, icon: '📁', color: 'text-blue-600 bg-blue-50' },
      { label: 'Revenue Collected', value: `₹${Number(d.revenue || 0).toLocaleString()}`, icon: '💰', color: 'text-emerald-600 bg-emerald-50' },
      { label: 'Billable Hours', value: `${d.hours || 0}h`, icon: '⏰', color: 'text-primary-600 bg-primary-50' },
    ];

    openModal('view-report', {
      title: r.title,
      content: (
        <div className="space-y-6 py-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-widest font-700">
            <span>Period: {new Date(r.start_date).toLocaleDateString()} - {new Date(r.end_date).toLocaleDateString()}</span>
            <span>Ref: #{r.id}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map(s => (
              <div key={s.label} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/30 line-height-tight">
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
                <p className="text-xl font-800 text-slate-900 mb-1">{s.value}</p>
                <p className="text-[11px] font-700 text-slate-400 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-primary-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary-300 font-800 mb-2">Executive Summary</p>
            <p className="text-[14px] font-500 opacity-95 leading-relaxed">
              This consolidated report for {r.title} reflects a high-precision snapshot of firm operations. 
              The revenue of <span className="text-primary-300 font-700">₹{Number(d.revenue || 0).toLocaleString()}</span> represents the total finalized billing for this period. 
              Efficiency levels are currently tracked at <span className="text-primary-300 font-700">{d.hours || 0} billable hours</span>.
            </p>
          </div>
          <div className="flex gap-3">
             <button onClick={() => handleDownload(r)} className="btn btn-primary flex-1 justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M7 16V4h10v12"/><path d="M20 12l-8 8-8-8"/></svg>
                Download PDF
             </button>
          </div>
        </div>
      )
    });
  };

  return (
    <div className="animate-fade-in space-y-4 pb-12">
      <PageHeader title="Firm Reports" subtitle="Comprehensive performance and financial analytics" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r) => (
          <Card key={r.id} className="hover:shadow-md cursor-pointer group transition-all animate-slide-up">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl group-hover:bg-primary-50 transition-colors">{r.category === 'Financial' ? '💰' : '📊'}</div>
              <div className="flex-1">
                <p className="text-[14px] font-700 text-slate-900 group-hover:text-primary-600 truncate">{r.title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{r.category} · Generated {new Date(r.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 flex gap-2 flex-wrap">
              <button onClick={() => viewReport(r)} className="btn btn-secondary btn-xs flex-1 justify-center transition-all hover:bg-slate-100">View Report</button>
              <button onClick={() => handleDownload(r)} className="btn btn-primary btn-xs flex-1 justify-center transition-all hover:translate-y-[-1px] shadow-sm">Download</button>
            </div>
          </Card>
        ))}
        {reports.length === 0 && (
          <Card className="sm:col-span-2 lg:col-span-3">
            <p className="text-[13px] text-slate-500">No generated reports available.</p>
          </Card>
        )}
      </div>

      <Card className="mt-8 overflow-visible relative">
        <h3 className="text-[14px] font-700 text-slate-900 mb-4">Custom Report Builder</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-3">
            <Field label="Report Title" required>
              <Input placeholder="E.g., Quarterly Tax Summary" value={title} onChange={e => setTitle(e.target.value)} />
            </Field>
          </div>
          <div className="lg:col-span-3">
            <Field label="Category">
              <Select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Financial">Financial</option>
                <option value="Operational">Operational</option>
                <option value="Marketing">Marketing</option>
              </Select>
            </Field>
          </div>
          <div className="lg:col-span-2"><Field label="Start Date" required><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></Field></div>
          <div className="lg:col-span-2"><Field label="End Date" required><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></Field></div>
          <div className="lg:col-span-2">
            <button onClick={handleGenerate} disabled={isGenerating}
              className="btn btn-primary w-full h-[38px] justify-center whitespace-nowrap shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40 transition-all font-800 disabled:opacity-50">
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
