import { useState, useEffect } from 'react';
import { Badge, PageHeader, Card, Table, Tr, Td, Avatar, StatCard, Field, Input, Select, Textarea } from '../components/UI.jsx';
import api from '../services/api';

function leadInitials(name) {
  if (!name) return '?';
  return name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 3).toUpperCase();
}

function formatLeadDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const STAGE_KEYS = [
  { key: 'all', label: 'All Stages' },
  { key: 'new', label: 'New' },
  { key: 'screening', label: 'Screening' },
  { key: 'consultation_set', label: 'Consultation' },
  { key: 'retained', label: 'Retained' },
  { key: 'declined', label: 'Declined' },
  { key: 'archived', label: 'Archived' },
];

// ─────────────────────────────────────────────────────────
//  LEAD DASHBOARD
// ─────────────────────────────────────────────────────────
export function LeadDashboard({ navigate, toast, openModal }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.leads.list({ limit: 500 });
      setLeads(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(e.message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (l.full_name || '').toLowerCase().includes(q) ||
      (l.matter_type || '').toLowerCase().includes(q) ||
      (l.email || '').toLowerCase().includes(q);
    const matchStage = stageFilter === 'all' || l.status === stageFilter;
    return matchSearch && matchStage;
  });

  const countBy = (s) => leads.filter((l) => l.status === s).length;
  const newCount = countBy('new');
  const screeningCount = countBy('screening');
  const consultCount = countBy('consultation_set');
  const retainedCount = countBy('retained');
  const total = leads.length;
  const convRate = total ? Math.round((retainedCount / total) * 100) : 0;

  if (loading) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[13px] text-slate-500">Loading leads…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in space-y-4">
        <Card className="border-red-200 bg-red-50/50">
          <p className="text-[13px] text-red-800 font-600">{error}</p>
          <button type="button" onClick={load} className="btn btn-secondary btn-sm mt-3">Retry</button>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="Intake & Leads" subtitle="Manage prospective clients and screening pipeline">
        <button onClick={() => navigate('/admin/conflict-check')} className="btn btn-secondary">Conflict Check</button>
        <button onClick={() => openModal('add-client')} className="btn btn-primary">+ New Lead</button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="New Leads" value={String(newCount)} 
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 4v16m8-8H4" /></svg>}
          iconBg="bg-[#0057c7]/10 text-[#38bdf8]" gradient="linear-gradient(90deg,#0B1F3A,#C9A24A)" />
        <StatCard label="In Screening" value={String(screeningCount)} 
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>}
          iconBg="bg-amber-500/10 text-amber-400" gradient="linear-gradient(90deg,#f59e0b,#fbbf24)" />
        <StatCard label="Consultations" value={String(consultCount)} 
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          iconBg="bg-emerald-500/10 text-emerald-400" gradient="linear-gradient(90deg,#10b981,#34d399)" />
        <StatCard label="Conversion Rate" value={`${convRate}%`} 
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
          iconBg="bg-indigo-500/10 text-indigo-400" gradient="linear-gradient(90deg,#0B1F3A,#C9A24A)" />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 no-scrollbar">
        {STAGE_KEYS.map(({ key, label }) => {
          const count = key === 'all' ? total : countBy(key);
          return (
            <button key={key} onClick={() => setStageFilter(key)}
              className={`px-4 py-2 rounded-xl text-[12px] font-700 border transition-all whitespace-nowrap ${stageFilter === key ? 'bg-[#0057c7] text-white border-transparent shadow-lg shadow-[#0057c7]/20' : 'bg-white/5 text-[#8a94a6] border-white/5 hover:border-white/20 hover:bg-white/10 hover:text-white'}`}>
              {label} <span className={`ml-1 opacity-50 ${stageFilter === key ? 'text-white' : ''}`}>({count})</span>
            </button>
          );
        })}
      </div>

      <Table headers={['Lead Name', 'Matter Type', 'Source', 'Received', 'Status', '']}
        searchPlaceholder="Search leads..." onSearch={setSearch}>
        {filtered.map((l) => (
          <Tr key={l.id} onClick={() => navigate(`/admin/intake-leads/${l.id}`)}>
            <Td>
              <div className="flex items-center gap-3">
                <Avatar initials={leadInitials(l.full_name)} size="sm" />
                <div>
                  <p className="font-700 text-white group-hover:text-[#38bdf8] transition-colors">{l.full_name}</p>
                  <p className="text-[11px] text-[#8a94a6] font-500">#{l.id}</p>
                </div>
              </div>
            </Td>
            <Td><span className="text-[11px] bg-[#0057c7]/20 text-[#38bdf8] px-2.5 py-1 rounded-lg font-700 border border-[#0057c7]/30">{l.matter_type || '—'}</span></Td>
            <Td className="text-[#b8c2d1] text-[13px] font-500">{l.source || '—'}</Td>
            <Td className="text-[#b8c2d1] text-[13px] font-500">{formatLeadDate(l.created_at)}</Td>
            <Td><Badge status={l.status} /></Td>
            <Td>
              <button type="button" className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#8a94a6] hover:bg-[#0057c7] hover:text-white hover:border-transparent transition-all group/btn" title="View Detail">
                <svg className="w-4 h-4 transition-transform group-hover/btn:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </button>
            </Td>
          </Tr>
        ))}
      </Table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  LEAD DETAIL PAGE
// ─────────────────────────────────────────────────────────
export function LeadDetailPage({ leadId, navigate, openModal, toast }) {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('new');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.leads.get(leadId);
        if (cancelled) return;
        const L = res.data;
        setLead(L);
        setStatus(L.status);
        setNotes(L.notes || '');
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load lead');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [leadId]);

  const saveLead = async () => {
    try {
      await api.leads.update(leadId, { status, notes });
      toast('Lead updated successfully!', 'success');
      const res = await api.leads.get(leadId);
      setLead(res.data);
    } catch (e) {
      toast(e.message || 'Update failed', 'error');
    }
  };

  const convertLead = async () => {
    try {
      const res = await api.leads.convert(leadId);
      toast('Lead converted to client.', 'success');
      navigate(`/admin/clients/${res.data.id}`);
    } catch (e) {
      toast(e.message || 'Conversion failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[13px] text-slate-500">Loading lead…</p>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="animate-fade-in space-y-4">
        <button onClick={() => navigate('/admin/intake-leads')} className="btn btn-secondary btn-xs">← Back to Leads</button>
        <Card className="border-red-200 bg-red-50/50">
          <p className="text-[13px] text-red-800 font-600">{error || 'Lead not found'}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button onClick={() => navigate('/admin/intake-leads')} className="btn btn-secondary btn-xs">← Back to Leads</button>
        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
          <button onClick={() => openModal('conflict-check')} className="btn btn-secondary btn-xs">Run Conflict Check</button>
          <button onClick={convertLead} className="btn btn-primary btn-xs">Convert to Client</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="flex items-start gap-4 mb-6">
              <Avatar initials={leadInitials(lead.full_name)} size="xl" />
              <div className="flex-1">
                <h2 className="text-2xl font-900 text-white tracking-tight">{lead.full_name}</h2>
                <div className="flex items-center gap-4 mt-2 text-[13px] text-[#8a94a6] flex-wrap font-500">
                  <span className="flex items-center gap-1.5"><span className="text-[#0057c7]">🆔</span> #{lead.id}</span>
                  <span className="flex items-center gap-1.5"><span className="text-[#0057c7]">📅</span> Received: {formatLeadDate(lead.created_at)}</span>
                  <span className="flex items-center gap-1.5"><span className="text-[#0057c7]">📍</span> {lead.source || '—'}</span>
                </div>
              </div>
              <Badge status={status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-[12px] font-800 text-white uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0057c7]"></span>
                  Matter Information
                </h4>
                <div className="space-y-3">
                  <Field label="Matter Type"><Input value={lead.matter_type || ''} readOnly /></Field>
                  <Field label="Practice Area"><Input value={lead.practice_area || ''} readOnly /></Field>
                  <Field label="Email"><Input value={lead.email || ''} readOnly /></Field>
                  <Field label="Phone"><Input value={lead.phone || ''} readOnly /></Field>
                </div>
              </div>
              <div>
                <h4 className="text-[12px] font-800 text-white uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Lead Status
                </h4>
                <div className="space-y-3">
                  <Field label="Current Pipeline Stage">
                    <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="new">New</option>
                      <option value="screening">Screening</option>
                      <option value="consultation_set">Consultation</option>
                      <option value="retained">Retained</option>
                      <option value="declined">Declined</option>
                      <option value="archived">Archived</option>
                    </Select>
                  </Field>
                  <button type="button" onClick={() => openModal('add-task')} className="btn btn-secondary w-full justify-center">Schedule Consultation</button>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h4 className="text-[14px] font-800 text-white mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#0057c7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Intake Notes
            </h4>
            <Textarea rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} />
            <div className="flex justify-end mt-3">
              <button type="button" onClick={saveLead} className="btn btn-primary w-full sm:w-auto justify-center">Save Notes</button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h4 className="text-[14px] font-800 text-white mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#0057c7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
              Original Message
            </h4>
            <p className="text-[13px] text-[#b8c2d1] leading-relaxed whitespace-pre-wrap bg-white/5 p-4 rounded-2xl border border-white/5">{lead.message || 'No message provided.'}</p>
          </Card>

          <Card className="bg-primary-600 text-white">
            <h4 className="text-[13px] font-700 mb-2">Convert to Client</h4>
            <p className="text-[11px] text-primary-100 leading-relaxed mb-4">
              Creates a client record from this lead and marks the lead as retained.
            </p>
            <button type="button" onClick={convertLead} className="btn bg-white text-primary-600 w-full justify-center font-800">Convert Now</button>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  CONFLICT CHECK PAGE
// ─────────────────────────────────────────────────────────
export function ConflictCheckPage({ navigate, openModal, toast }) {
  const [client, setClient] = useState('');
  const [opponent, setOpponent] = useState('');
  const [result, setResult] = useState('');

  const handleCheck = () => {
    if (!client || !opponent) return;
    setResult('Conflict-check API is not configured yet. Use manual review workflow.');
  };

  return (
    <div className="animate-fade-in space-y-4 max-w-4xl mx-auto">
      <PageHeader title="Conflict Check Tool" subtitle="Scan existing records for potential ethical conflicts" />
      
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Field label="Prospective Client" required>
            <Input placeholder="Enter full name..." value={client} onChange={e => setClient(e.target.value)} />
          </Field>
          <Field label="Adverse / Opposing Party" required>
            <Input placeholder="Enter full name..." value={opponent} onChange={e => setOpponent(e.target.value)} />
          </Field>
        </div>
        <button onClick={handleCheck} disabled={!client || !opponent}
          className="btn btn-primary w-full justify-center h-12 text-[15px]">
          Perform Comprehensive Check
        </button>
      </Card>

      {result && (
        <div className="animate-slide-up p-8 rounded-2xl border-2 text-center bg-slate-50 border-slate-200 text-slate-700">
          <div className="text-5xl mb-4">ℹ️</div>
          <h2 className="text-2xl font-800 font-display mb-2">Manual Review Required</h2>
          <p className="text-[14px] opacity-80 max-w-md mx-auto">{result}</p>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <button onClick={() => setResult('')} className="btn btn-secondary w-full sm:w-auto justify-center">Clear</button>
          </div>
        </div>
      )}
    </div>
  );
}
