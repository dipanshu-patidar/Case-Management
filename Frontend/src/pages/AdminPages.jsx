import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { Badge, StatCard, PageHeader, Card, Table, Tr, Td, Tabs, Timeline, EmptyState, ProgressBar, FileIcon, Modal, Field, Input, Select, Textarea, Avatar, SearchInput, downloadFile } from '../components/UI.jsx';
import api from '../services/api';
import { API_BASE_URL } from '../config/env';

function leadInitials(name) {
  if (!name) return '?';
  return name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 3).toUpperCase();
}

function matterStatusForBadge(status) {
  if (status === 'completed') return 'closed';
  return status;
}

function mapMatterToCaseView(m) {
  const st = m.status === 'completed' ? 'closed' : m.status;
  return {
    matter_number: m.matter_number,
    numericId: m.id,
    id: m.matter_number,
    title: m.title,
    client: m.client?.full_name || '',
    lawyer: m.assigned_lawyer?.full_name || 'Unassigned',
    type: m.matter_type || m.practice_area,
    status: st,
    filed: m.opened_at
      ? new Date(m.opened_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    nextHearing: m.next_hearing
      ? new Date(m.next_hearing).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '—',
    priority: 'medium',
    description: m.description || '',
    opposingParty: m.opposing_party_name || '',
    lastUpdated: new Date(m.updated_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
  };
}

function draftUiStatus(db) {
  const k = { draft: 'Draft', ready: 'Ready', sent_for_signature: 'Sent for Signature', signed: 'Signed' };
  return k[db] || db;
}

function clientStatus(db) {
  const k = { draft: 'Review Needed', ready: 'Ready', sent_for_signature: 'Pending Signature', signed: 'Signed' };
  return k[db] || db;
}

function matterMimeToFileType(mime) {
  if (!mime) return 'doc';
  if (mime.includes('pdf')) return 'pdf';
  if (mime.includes('image')) return 'img';
  return 'doc';
}

/** Maps document.category to Matter Folders bucket (Complaint, Evidence, Contract, Court order). */
function documentFolderBucket(category) {
  if (!category) return null;
  const c = String(category).toLowerCase();
  if (c.includes('complaint')) return 'Complaint';
  if (c.includes('evidence')) return 'Evidence';
  if (c.includes('contract')) return 'Contract';
  if (c.includes('court')) return 'Court order';
  // If it's none of the standard ones, it's a custom folder category
  return category;
}

async function downloadDocumentBlob(documentId, fallbackName) {
  const { blob, filename } = await api.documents.download(documentId);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || fallbackName || 'document.bin';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

async function downloadInvoicePdfBlob(dbId, fallbackLabel, toast) {
  if (!dbId) {
    toast('This invoice is not linked to a database record.', 'info');
    return;
  }
  try {
    const { blob, filename } = await api.billing.downloadInvoicePdf(dbId);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `Invoice-${fallbackLabel || dbId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    toast('Invoice PDF downloaded', 'success');
  } catch (e) {
    toast(e.message || 'Could not download invoice PDF', 'error');
  }
}

const progressColors = ['bg-primary-500', 'bg-emerald-500', 'bg-amber-500', 'bg-accent-500', 'bg-blue-500', 'bg-slate-500'];

// ─────────────────────────────────────────────────────────
//  ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────
export function AdminDashboard({ navigate, toast, openModal }) {
  const [dash, setDash] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.dashboard.admin();
      setDash(res.data);
    } catch (e) {
      setError(e.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    window.addEventListener('vktori:entities-changed', load);
    return () => window.removeEventListener('vktori:entities-changed', load);
  }, [load]);

  const exportReport = () => {
    if (!dash) {
      toast('Nothing to export yet.', 'info');
      return;
    }
    const row = `Metric,Value\nTotal Clients,${dash.counts.totalClients}\nOpen Matters,${dash.counts.openMatters}\nUpcoming Deadlines,${dash.counts.upcomingDeadlineCount}\nRevenue (${dash.revenue.monthLabel}),${dash.revenue.totalFormatted}\n`;
    downloadFile(`firm_overview_${new Date().toISOString().slice(0, 10)}.csv`, row);
    toast('Report exported!', 'success');
  };

  if (loading) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[13px] text-slate-500">Loading dashboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in space-y-4">
        <Card className="border-red-200 bg-red-50/50">
          <p className="text-[13px] text-red-800 font-600">{error}</p>
          <button type="button" onClick={() => window.location.reload()} className="btn btn-secondary btn-sm mt-3">Retry</button>
        </Card>
      </div>
    );
  }

  const c = dash.counts;
  const revRows = dash.revenue.byPracticeArea.length
    ? dash.revenue.byPracticeArea.map((item, i) => ({
      label: item.practiceArea,
      pct: item.pct,
      amount: item.amountFormatted,
      color: progressColors[i % progressColors.length],
    }))
    : [{ label: 'No paid revenue this month', pct: 0, amount: '—', color: 'bg-slate-300' }];

  const deadlines = dash.upcomingDeadlines.length ? dash.upcomingDeadlines : [];

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="Dashboard" subtitle={`Welcome back! Practice overview · ${dash.revenue.monthLabel}`}>
        <button onClick={exportReport} className="btn btn-secondary">Export Report</button>
        <div className="flex gap-2">
          <button onClick={() => openModal('conflict-check')} className="btn btn-secondary">Conflict Check</button>
          <button onClick={() => openModal('add-case')} className="btn btn-primary">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New Matter
          </button>
        </div>
      </PageHeader>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Clients" value={String(c.totalClients)} icon="👥" iconBg="bg-blue-50" gradient="linear-gradient(90deg,#0B1F3A,#C9A24A)" />
        <StatCard label="Open Matters" value={String(c.openMatters)} icon="📁" iconBg="bg-emerald-50" gradient="linear-gradient(90deg,#10b981,#34d399)" />
        <StatCard label="Upcoming Deadlines" value={String(c.upcomingDeadlineCount)} icon="⏰" iconBg="bg-amber-50" gradient="linear-gradient(90deg,#f59e0b,#fbbf24)" />
        <StatCard label={`Revenue (${dash.revenue.monthLabel.split(' ')[0]})`} value={dash.revenue.totalFormatted} icon="💰" iconBg="bg-accent-50" gradient="linear-gradient(90deg,#0B1F3A,#C9A24A)" />
      </div>

      {/* Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-600 text-slate-900">Recent Matters</h3>
            <button onClick={() => navigate('/admin/matters')} className="text-[12px] text-primary-600 hover:underline font-500">View all →</button>
          </div>
          <div className="space-y-1">
            {dash.recentMatters.length === 0 ? (
              <p className="text-[12px] text-slate-500 py-4 text-center">No matters yet.</p>
            ) : (
              dash.recentMatters.map((m) => (
                <div key={m.id} onClick={() => navigate(`/admin/matters/${m.id}`)}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
                  <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-500 text-slate-900 truncate group-hover:text-primary-600 transition-colors">{m.title}</p>
                    <p className="text-[11px] text-slate-400">{m.matterNumber} · {m.clientName}</p>
                  </div>
                  <Badge status={matterStatusForBadge(m.status)} />
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-600 text-slate-900">Upcoming Deadlines</h3>
              <button onClick={() => navigate('/admin/calendar')} className="text-[12px] text-primary-600 hover:underline font-500">Calendar →</button>
            </div>
            <div className="space-y-1.5">
              {deadlines.length === 0 ? (
                <p className="text-[12px] text-slate-500 py-2">No invoice due dates in the next window.</p>
              ) : (
                deadlines.map((e, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-primary-50 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[14px] font-700 text-primary-700 leading-none">{e.day}</span>
                      <span className="text-[8px] text-primary-400 uppercase">{e.month}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-500 text-slate-800 truncate">{e.title}</p>
                      <p className="text-[11px] text-slate-400">{e.time || 'Due'}</p>
                    </div>
                    <span className={`text-[11px] font-600 px-1.5 py-0.5 rounded-full ${e.color === 'red' ? 'bg-red-50 text-red-600' :
                        e.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                      {e.color === 'red' ? 'Urgent' : e.color === 'amber' ? 'Soon' : 'Due'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-[13px] font-600 text-slate-900 mb-3">Revenue Breakdown</h3>
            {revRows.map(item => (
              <div key={item.label} className="mb-2.5 last:mb-0">
                <div className="flex justify-between mb-1">
                  <span className="text-[12px] text-slate-600">{item.label}</span>
                  <span className="text-[12px] font-600 text-slate-800">{item.amount}</span>
                </div>
                <ProgressBar pct={item.pct} color={item.color} />
              </div>
            ))}
          </Card>
        </div>
      </div>

      <Card>
        <h3 className="text-[13px] font-600 text-slate-900 mb-3">Recent Activity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
          {dash.activityFeed.length === 0 ? (
            <p className="text-[12px] text-slate-500 col-span-full py-2">No activity recorded yet.</p>
          ) : (
            dash.activityFeed.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm ${item.bg}`}>{item.icon}</div>
                <div className="min-w-0">
                  <p className="text-[12px] text-slate-700 truncate">{item.text}</p>
                  <p className="text-[11px] text-slate-400">{item.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  CLIENTS PAGE
// ─────────────────────────────────────────────────────────
export function ClientsPage({ navigate, toast, openModal }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.clients.list({ limit: 500 });
      setClients(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(e.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const rows = clients.map((c) => ({
    raw: c,
    id: String(c.id),
    name: c.full_name,
    avatar: leadInitials(c.full_name),
    email: c.email,
    phone: c.phone || '—',
    type: c.is_portal_enabled ? 'Portal' : 'Standard',
    cases: c._count?.matters ?? 0,
    status: c.is_portal_enabled ? 'active' : 'pending',
    joined: c.created_at ? new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
  }));

  const filtered = rows.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All Status' || c.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[13px] text-slate-500">Loading clients…</p>
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
      <PageHeader title="Clients" subtitle={`${clients.length} total clients registered`}>
        <button onClick={() => openModal('add-client')} className="btn btn-primary">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Client
        </button>
      </PageHeader>
      <Table headers={['Client', 'Email', 'Phone', 'Type', 'Matters', 'Status', 'Joined', '']}
        searchPlaceholder="Search clients..." onSearch={setSearch}
        actions={
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="btn btn-secondary text-[12px]">
            <option>All Status</option><option>Active</option><option>Pending</option><option>Inactive</option>
          </select>
        }>
        {filtered.map(c => (
          <Tr key={c.id}>
            <Td className="whitespace-nowrap">
              <div className="flex items-center gap-2.5">
                <Avatar initials={c.avatar} size="sm" />
                <div className="whitespace-nowrap"><p className="font-500 text-slate-900 hover:text-primary-600">{c.name}</p><p className="text-[11px] text-slate-400">{c.id}</p></div>
              </div>
            </Td>
            <Td className="text-slate-500 whitespace-nowrap">{c.email}</Td>
            <Td className="text-slate-500 whitespace-nowrap">{c.phone}</Td>
            <Td className="whitespace-nowrap"><span className="text-[12px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-500">{c.type}</span></Td>
            <Td className="whitespace-nowrap"><span className="font-600 text-slate-900">{c.cases}</span></Td>
            <Td className="whitespace-nowrap"><Badge status={c.status} /></Td>
            <Td className="text-slate-400 text-[12px] whitespace-nowrap">{c.joined}</Td>
            <Td className="whitespace-nowrap">
              <div className="flex gap-1">
                <button onClick={e => { e.stopPropagation(); navigate(`/admin/clients/${c.id}`); }} className="btn btn-secondary btn-xs p-1.5" title="View">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                </button>
                <button onClick={e => { e.stopPropagation(); openModal('edit-client', c.raw); }} className="btn btn-secondary btn-xs p-1.5" title="Edit">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </button>
              </div>
            </Td>
          </Tr>
        ))}
      </Table>
      <div className="flex items-center justify-between text-[12px] text-slate-500 gap-2 flex-wrap">
        <span>Showing {filtered.length} of {clients.length} clients</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  CLIENT DETAIL PAGE
// ─────────────────────────────────────────────────────────
export function ClientDetailPage({ clientId, navigate, toast, openModal }) {
  const [tab, setTab] = useState('Overview');
  const [client, setClient] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.clients.get(clientId);
        if (cancelled) return;
        const C = res.data;
        setClient(C);
        setNotes(C.notes || '');
        const matters = C.matters || [];
        const mids = new Set(matters.map((m) => m.id));
        const [invRes, docRes] = await Promise.all([
          api.billing.listInvoices({ limit: 500 }),
          api.documents.list({ limit: 500 }),
        ]);
        if (cancelled) return;
        const invData = Array.isArray(invRes.data) ? invRes.data : [];
        const clientInvoices = invData.filter((i) => mids.has(i.matter_id)).map(inv => {
          const amt = Number(inv.amount || 0);
          const invPaid = (inv.payments || []).reduce((s, p) => s + Number(p.amount || 0), 0);
          return {
            ...inv,
            paidAmount: invPaid,
            outstanding: Math.max(0, amt - invPaid),
            status: inv.status === 'draft' ? 'pending' : inv.status,
          };
        });
        setInvoices(clientInvoices);
        const docData = Array.isArray(docRes.data) ? docRes.data : [];
        setDocuments(docData.filter((d) => mids.has(d.matter_id)));
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load client');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [clientId]);

  const saveNotes = async () => {
    try {
      await api.clients.update(clientId, { notes });
      toast('Notes saved!', 'success');
    } catch (e) {
      toast(e.message || 'Save failed', 'error');
    }
  };

  const formatMoney = (v) => {
    const n = typeof v === 'string' ? parseFloat(v) : Number(v);
    if (Number.isNaN(n)) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
  };

  const mimeToType = (mime) => {
    if (!mime) return 'doc';
    if (mime.includes('pdf')) return 'pdf';
    if (mime.includes('image')) return 'img';
    return 'doc';
  };

  if (loading) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[13px] text-slate-500">Loading client…</p>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="animate-fade-in space-y-4">
        <button onClick={() => navigate('/admin/clients')} className="btn btn-secondary btn-xs">Back to Clients</button>
        <Card className="border-red-200 bg-red-50/50">
          <p className="text-[13px] text-red-800 font-600">{error || 'Client not found'}</p>
        </Card>
      </div>
    );
  }

  const matters = client.matters || [];
  const firstMatterId = matters[0]?.id != null ? String(matters[0].id) : '';
  const view = {
    name: client.full_name,
    avatar: leadInitials(client.full_name),
    email: client.email,
    phone: client.phone || '—',
    type: client.is_portal_enabled ? 'Portal' : 'Standard',
    status: client.is_portal_enabled ? 'active' : 'pending',
    id: String(client.id),
    joined: client.created_at
      ? new Date(client.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '—',
  };

  const activeMatters = matters.filter((m) => m.status === 'active').length;
  const pendingInv = invoices.filter((i) => (i.outstanding || 0) > 0 && i.status !== 'void').length;

  return (
    <div className="animate-fade-in space-y-4">
      <button onClick={() => navigate('/admin/clients')} className="btn btn-secondary btn-xs">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
        Back to Clients
      </button>

      <Card>
        <div className="flex items-start gap-4 flex-wrap">
          <Avatar initials={view.avatar} size="xl" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-xl font-700 text-slate-900 font-display">{view.name}</h2>
              <Badge status={view.status} />
              <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-500">{view.type}</span>
            </div>
            <p className="text-[12px] text-slate-500 mb-2">{view.id} · Joined {view.joined}</p>
            <div className="flex flex-wrap gap-4 text-[13px] text-slate-600">
              <span>📧 {view.email}</span>
              <span>📞 {view.phone}</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => openModal('compose-email', firstMatterId ? { matterId: firstMatterId } : {})} className="btn btn-secondary btn-xs">Send Email</button>
            <button onClick={() => openModal('edit-client', client)} className="btn btn-primary btn-xs">Edit Client</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
          {[
            { label: 'Active Matters', value: activeMatters },
            { label: 'Documents', value: documents.length },
            { label: 'Pending Bills', value: pendingInv },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-xl font-700 text-primary-600">{s.value}</p>
              <p className="text-[11px] text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </Card>

      <Tabs tabs={['Overview', 'Matters', 'Documents', 'Billing', 'Notes']} active={tab} onChange={setTab} />

      {tab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <h3 className="text-[13px] font-600 text-slate-900 mb-3">Contact Details</h3>
            {[
              ['Full Name', view.name],
              ['Email', view.email],
              ['Phone', view.phone],
              ['Type', view.type],
              ['Client ID', view.id],
              ['Joined', view.joined],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-slate-50 last:border-0 text-[13px]">
                <span className="text-slate-500">{k}</span><span className="font-500 text-slate-800">{v}</span>
              </div>
            ))}
          </Card>
          <Card>
            <h3 className="text-[13px] font-600 text-slate-900 mb-3">Notes</h3>
            <Textarea rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} />
            <button type="button" onClick={saveNotes} className="btn btn-primary mt-3 w-full justify-center">Save Notes</button>
          </Card>
        </div>
      )}
      {tab === 'Matters' && (
        matters.length > 0 ? (
          <Table headers={['Matter ID', 'Title', 'Type', 'Status', 'Next Hearing']}>
            {matters.map((c) => (
              <Tr key={c.id} onClick={() => navigate(`/admin/matters/${c.id}`)}>
                <Td><span className="font-mono text-[12px] text-primary-600">{c.matter_number}</span></Td>
                <Td className="font-500 text-slate-900">{c.title}</Td>
                <Td><span className="text-[12px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{c.matter_type || c.practice_area}</span></Td>
                <Td><Badge status={matterStatusForBadge(c.status)} /></Td>
                <Td className="text-slate-500 text-[12px]">{c.next_hearing ? new Date(c.next_hearing).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</Td>
              </Tr>
            ))}
          </Table>
        ) : <EmptyState icon="📁" title="No matters found" desc="No matters assigned to this client yet." />
      )}
      {tab === 'Documents' && (
        documents.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {documents.map((d) => (
              <Card key={d.id} className="hover:shadow-md cursor-pointer group" noPad>
                <div className="p-3">
                  <FileIcon type={mimeToType(d.mime_type)} />
                  <p className="text-[12px] font-500 text-slate-800 mt-2 line-clamp-2 group-hover:text-primary-600">{d.original_name}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{d.file_size} bytes · {new Date(d.created_at).toLocaleDateString()}</p>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await downloadDocumentBlob(d.id, d.original_name);
                        toast(`${d.original_name} download started`, 'success');
                      } catch (e) {
                        toast(e.message || 'Download failed', 'error');
                      }
                    }}
                    className="btn btn-secondary w-full justify-center mt-2 text-[11px] py-1"
                  >
                    Download
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : <EmptyState icon="📂" title="No documents" desc="Documents will appear here when uploaded." />
      )}
      {tab === 'Billing' && (
        invoices.length > 0 ? (
          <Table headers={['Invoice', 'Description', 'Amount', 'Due', 'Status']}>
            {invoices.map((inv) => (
              <Tr key={inv.id}>
                <Td><span className="font-mono text-[12px]">{inv.invoice_number}</span></Td>
                <Td className="text-[12px] text-slate-500 max-w-[200px] truncate">{inv.description || '—'}</Td>
                <Td className="font-600">{formatMoney(inv.amount)}</Td>
                <Td className="text-slate-500 text-[12px]">{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '—'}</Td>
                <Td><Badge status={inv.status} /></Td>
              </Tr>
            ))}
          </Table>
        ) : <EmptyState icon="🧾" title="No invoices" desc="Invoices linked to this client’s matters will appear here." />
      )}
      {tab === 'Notes' && (
        <Card>
          <h3 className="text-[13px] font-600 text-slate-900 mb-3">Client notes</h3>
          <p className="text-[12px] text-slate-500 mb-3">Use the Overview tab to edit and save firm notes for this client.</p>
          <Textarea rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} />
          <button type="button" onClick={saveNotes} className="btn btn-primary mt-2">Save Notes</button>
        </Card>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  CASES PAGE
// ─────────────────────────────────────────────────────────
export function CasesPage({ navigate, toast, openModal }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [matters, setMatters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.matters.list({ limit: 500 });
      setMatters(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(e.message || 'Failed to load matters');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    window.addEventListener('vktori:entities-changed', load);
    return () => window.removeEventListener('vktori:entities-changed', load);
  }, [load]);

  const rows = matters.map((m) => ({
    id: m.id,
    matterNumber: m.matter_number,
    title: m.title,
    client: m.client?.full_name || '—',
    lawyer: m.assigned_lawyer?.full_name || '—',
    type: m.matter_type || m.practice_area,
    status: m.status === 'completed' ? 'closed' : m.status,
    nextHearing: m.next_hearing
      ? new Date(m.next_hearing).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '—',
    priority: 'medium',
  }));

  const filtered = rows.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      String(c.matterNumber).toLowerCase().includes(search.toLowerCase()) ||
      c.client.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All Status' || c.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[13px] text-slate-500">Loading matters…</p>
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
      <PageHeader title="Matters" subtitle={`${matters.length} total matters`}>
        <button onClick={() => openModal('add-case')} className="btn btn-primary">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          New Matter
        </button>
      </PageHeader>
      <Table headers={['Matter ID', 'Title', 'Client', 'Lawyer', 'Type', 'Status', 'Next Hearing', 'Priority', '']}
        searchPlaceholder="Search matters..." onSearch={setSearch}
        actions={
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="btn btn-secondary text-[12px]">
            <option>All Status</option><option>Active</option><option>Pending</option><option>Closed</option>
          </select>
        }>
        {filtered.map(c => (
          <Tr key={c.id}>
            <Td className="whitespace-nowrap"><span className="font-mono text-[12px] text-primary-600 font-500">{c.matterNumber}</span></Td>
            <Td className="whitespace-nowrap"><p className="font-500 text-slate-900 hover:text-primary-600 truncate max-w-[180px]">{c.title}</p></Td>
            <Td className="text-[12px] whitespace-nowrap">{c.client}</Td>
            <Td className="text-[12px] whitespace-nowrap">{c.lawyer}</Td>
            <Td className="whitespace-nowrap"><span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-500">{c.type}</span></Td>
            <Td className="whitespace-nowrap"><Badge status={c.status} /></Td>
            <Td className="text-slate-500 text-[12px] whitespace-nowrap">{c.nextHearing}</Td>
            <Td className="whitespace-nowrap"><Badge status={c.priority} /></Td>
            <Td className="whitespace-nowrap">
              <button onClick={e => { e.stopPropagation(); navigate(`/admin/matters/${c.id}`); }} className="btn btn-secondary p-1.5" title="View">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              </button>
            </Td>
          </Tr>
        ))}
      </Table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  MATTER DETAIL
// ─────────────────────────────────────────────────────────
export function CaseDetailPage({ caseId, navigate, toast, openModal, role: originalRole = 'admin' }) {
  const role = originalRole.toLowerCase();
  const isAdmin = role === 'admin';
  const isStaff = role === 'admin' || role === 'lawyer';
  const isClient = role === 'client';
  const hasApiMatter = true;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'Overview';
  const [tab, setTab] = useState(initialTab);
  const [documentsFolderFilter, setDocumentsFolderFilter] = useState(null);
  const [currentCase, setCurrentCase] = useState(null);
  const [apiMatter, setApiMatter] = useState(null);
  const [matterLoading, setMatterLoading] = useState(hasApiMatter);
  const [matterError, setMatterError] = useState('');
  const [statusHistory, setStatusHistory] = useState([]);
  const [matterRefreshTick, setMatterRefreshTick] = useState(0);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerHistory, setTimerHistory] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const stoppingRef = useRef(false);
  const activeTimerRef = useRef(null);

  useEffect(() => {
    activeTimerRef.current = activeTimer;
  }, [activeTimer]);

  const [remoteFolders, setRemoteFolders] = useState([]);

  const fetchData = useCallback(async () => {
    setMatterLoading(true);
    setMatterError('');
    try {
      const [res, folderRes] = await Promise.all([
        api.matters.get(caseId),
        api.folders.list({ matter_id: caseId })
      ]);
      const m = res.data;
      setApiMatter(m);
      setRemoteFolders(Array.isArray(folderRes.data) ? folderRes.data : []);
      setCurrentCase(mapMatterToCaseView(m));
      const hist = (m.status_history || []).map((h) => ({
        date: new Date(h.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        from: h.old_status === 'completed' ? 'closed' : h.old_status,
        to: h.new_status === 'completed' ? 'closed' : h.new_status,
        by: 'Firm',
      }));
      setStatusHistory(hist);
    } catch (e) {
      setMatterError(e.message || 'Failed to load matter');
    } finally {
      setMatterLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    window.addEventListener('vktori:entities-changed', fetchData);
    return () => window.removeEventListener('vktori:entities-changed', fetchData);
  }, [fetchData]);

  useEffect(() => {
    if (isClient) return;
    let cancelled = false;
    api.timers.active().then(res => {
      if (cancelled) return;
      if (res.data) {
        setActiveTimer(res.data);
      } else if (caseId) {
        // Auto-start timer if none active
        startTimer();
      }
    }).catch(console.error);
    return () => { cancelled = true; };
  }, [caseId, isClient]);

  // Handle auto-stop on unmount or tab close
  useEffect(() => {
    if (isClient) return;

    const handleUnload = () => {
      if (activeTimerRef.current && activeTimerRef.current.matter_id === Number(caseId)) {
        const token = localStorage.getItem('vktori_token');
        if (token) {
          // Use fetch with keepalive for tab close
          fetch(`${API_BASE_URL}/timers/${activeTimerRef.current.id}/stop`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            keepalive: true
          }).catch(() => {});
        }
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      // Only stop if still active and for this matter
      const timer = activeTimerRef.current;
      if (timer && timer.matter_id === Number(caseId) && !stoppingRef.current) {
        stopTimer();
      }
    };
  }, [caseId, isClient]); // Removed activeTimer from deps to prevent stopping on every update

  useEffect(() => {
    if (!activeTimer || activeTimer.matter_id !== Number(caseId)) {
      setTimerSeconds(0);
      return;
    }
    const update = () => {
      const start = new Date(activeTimer.start_time);
      const diff = Math.floor((new Date() - start) / 1000);
      setTimerSeconds(diff > 0 ? diff : 0);
    };
    update();
    const inv = setInterval(update, 1000);
    return () => clearInterval(inv);
  }, [activeTimer, caseId]);

  const loadTimerHistory = useCallback(async () => {
    if (isClient) return;
    try {
      const res = await api.timers.list({ matter_id: caseId });
      setTimerHistory(res.data || []);
    } catch (e) {
      console.error('Failed to load timer history', e);
    }
  }, [caseId, isClient]);

  useEffect(() => {
    loadTimerHistory();
  }, [loadTimerHistory]);

  useEffect(() => {
    const onRefresh = () => loadTimerHistory();
    window.addEventListener('vktori:entities-changed', onRefresh);
    return () => window.removeEventListener('vktori:entities-changed', onRefresh);
  }, [loadTimerHistory]);

  const handleSendReply = async () => {
    if (!replyText.trim() || !caseId) return;
    setIsSubmittingReply(true);
    try {
      await api.communications.create({
        matter_id: Number(caseId),
        message_body: replyText.trim(),
        communication_type: 'portal_message',
        visibility: 'client_visible',
      });
      setReplyText('');
      setReplyingTo(null);
      toast('Reply sent successfully', 'success');
      // Refresh data
      fetchData();
      window.dispatchEvent(new Event('vktori:entities-changed'));
    } catch (e) {
      toast(e.message || 'Failed to send reply', 'error');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const formatTimer = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return [h, m, sec].map(v => String(v).padStart(2, '0')).join(':');
  };

  const startTimer = async () => {
    try {
      const res = await api.timers.start(caseId);
      setActiveTimer(res.data);
      toast('Timer started', 'success');
      window.dispatchEvent(new Event('vktori:entities-changed'));
    } catch (e) {
      toast(e.message || 'Failed to start timer', 'error');
    }
  };

  const stopTimer = async () => {
    const token = localStorage.getItem('vktori_token');
    if (!activeTimerRef.current || stoppingRef.current || !token) return;
    stoppingRef.current = true;
    const timerId = activeTimerRef.current.id;
    try {
      await api.timers.stop(timerId);
      setActiveTimer(null);
      setTimerSeconds(0);
      toast('Timer stopped and session saved', 'success');
      window.dispatchEvent(new Event('vktori:entities-changed'));
    } catch (e) {
      // Only toast error if it's not a "already stopped" message which we are trying to avoid anyway
      if (!e.message?.includes('already stopped')) {
        toast(e.message || 'Failed to stop timer', 'error');
      }
    } finally {
      stoppingRef.current = false;
    }
  };

  useEffect(() => {
    setDocumentsFolderFilter(null);
  }, [caseId]);

  useEffect(() => {
    if (!hasApiMatter) return;
    const onRefresh = () => setMatterRefreshTick((t) => t + 1);
    window.addEventListener('vktori:entities-changed', onRefresh);
    return () => window.removeEventListener('vktori:entities-changed', onRefresh);
  }, [hasApiMatter]);

  useEffect(() => {
    if ((tab === 'Communications' || tab === 'Messages' || tab === 'Notes') && apiMatter?.id) {
      api.communications.markMatterRead(apiMatter.id)
        .then(() => {
          window.dispatchEvent(new Event('vktori:entities-changed'));
        })
        .catch(() => { });
    }
  }, [tab, apiMatter?.id]);

  const handleStatusChange = async (newStatus) => {
    if (!currentCase || newStatus === currentCase.status) return;
    try {
      const apiSt = newStatus === 'closed' ? 'completed' : newStatus;
      await api.matters.update(caseId, { status: apiSt });
      const res = await api.matters.get(caseId);
      setApiMatter(res.data);
      setCurrentCase(mapMatterToCaseView(res.data));
      toast(`Matter status updated to ${newStatus}`, 'success');
    } catch (e) {
      toast(e.message || 'Update failed', 'error');
    }
  };

  const docs = currentCase
    ? (hasApiMatter && apiMatter?.documents
      ? apiMatter.documents.map((d) => ({
        id: d.id,
        name: d.original_name,
        type: matterMimeToFileType(d.mime_type),
        caseId: currentCase.id,
        category: d.category || 'General',
        by: d.uploader?.full_name || '—',
        uploaded: new Date(d.created_at).toLocaleDateString(),
        size: `${Math.max(1, Math.round(d.file_size / 1024))} KB`,
      }))
      : [])
    : [];

  const docsInFolder = documentsFolderFilter
    ? docs.filter((d) => documentFolderBucket(d.category) === documentsFolderFilter)
    : docs;

  const tasks = [];

  const [templatesDrafts, setTemplatesDrafts] = useState([]);

  useEffect(() => {
    if (hasApiMatter && apiMatter?.drafts) {
      setTemplatesDrafts(
        apiMatter.drafts.map((d) => ({
          id: String(d.id),
          title: d.title,
          category: d.category || 'General',
          updated: new Date(d.updated_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          status: d.status,
          preview: (d.content || '').slice(0, 400) || '—',
        })),
      );
    } else {
      setTemplatesDrafts([]);
    }
  }, [hasApiMatter, apiMatter, currentCase?.id]);
  const [reviewDraft, setReviewDraft] = useState(null);
  const [reviewConfirmed, setReviewConfirmed] = useState(false);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [payingInvoiceDbId, setPayingInvoiceDbId] = useState(null);
  const [previewDraft, setPreviewDraft] = useState(null);
  const [isCreateDraftOpen, setIsCreateDraftOpen] = useState(false);
  const [newDraftForm, setNewDraftForm] = useState({
    title: '',
    category: '',
    matterName: '',
    clientName: '',
    status: 'Draft',
    notes: '',
  });
  const signaturePadRef = useRef(null);
  const signaturePadContainerRef = useRef(null);
  const signaturePadHeight = 210;

  const sendTemplateForSignature = async (id) => {
    if (!/^\d+$/.test(String(id))) {
      toast('Draft is not linked to database.', 'info');
      return;
    }
    try {
      await api.drafts.update(id, { status: 'sent_for_signature', sent_for_signature_at: new Date().toISOString() });
      const res = await api.matters.get(caseId);
      setApiMatter(res.data);
      toast('Draft sent for signature.', 'success');
    } catch (e) {
      toast(e.message || 'Update failed', 'error');
    }
  };
  const openDraftPreview = (item) => setPreviewDraft(item);
  const openCreateDraftModal = () => {
    setNewDraftForm({
      title: '',
      category: '',
      matterName: currentCase.title || '',
      clientName: currentCase.client || '',
      status: 'Draft',
      notes: '',
    });
    setIsCreateDraftOpen(true);
  };
  const saveNewDraft = async () => {
    if (!newDraftForm.title.trim()) {
      toast('Draft Title is required.', 'warning');
      return;
    }
    if (!newDraftForm.category.trim()) {
      toast('Category is required.', 'warning');
      return;
    }
    try {
      let u = null;
      try {
        u = JSON.parse(localStorage.getItem('vktori_user') || 'null');
      } catch { /* ignore */ }
      if (!u?.id) {
        toast('Missing user session.', 'error');
        return;
      }
      await api.drafts.create({
        matter_id: Number(caseId),
        title: newDraftForm.title.trim(),
        category: newDraftForm.category.trim(),
        content: newDraftForm.notes.trim() || null,
        created_by_user_id: u.id,
        status: 'draft',
      });
      const res = await api.matters.get(caseId);
      setApiMatter(res.data);
      setIsCreateDraftOpen(false);
      toast('New draft created successfully.', 'success');
    } catch (e) {
      toast(e.message || 'Create failed', 'error');
    }
  };
  const clientStatus = (status) => status === 'Sent for Signature' ? 'Pending Signature' : status;
  const openReviewAndSign = (item) => {
    setReviewConfirmed(false);
    setHasDrawnSignature(false);
    signaturePadRef.current?.clear();
    setReviewDraft(item);
  };
  const signReviewedDraft = async () => {
    if (!reviewConfirmed || !reviewDraft || !hasDrawnSignature) return;
    try {
      if (!/^\d+$/.test(String(reviewDraft.id))) {
        toast('Draft is not linked to a database record.', 'info');
        return;
      }
      const signature_data = signaturePadRef.current?.toDataURL() || null;
      if (!signature_data) {
        toast('Failed to capture signature image.', 'error');
        return;
      }
      await api.drafts.sign(Number(reviewDraft.id), {
        signature_data,
        ip_address: '0.0.0.0', // Could be captured if needed
        device_info: window.navigator.userAgent,
      });
      const res = await api.matters.get(caseId);
      setApiMatter(res.data);
      setReviewDraft(null);
      setReviewConfirmed(false);
      setHasDrawnSignature(false);
      signaturePadRef.current?.clear();
      toast('Document signed successfully.', 'success');
    } catch (e) {
      toast(e.message || 'Sign failed', 'error');
    }
  };

  const handleEdit = () => {
    openModal('edit-case', { ...currentCase, matterId: caseId, numericId: currentCase?.numericId ?? Number(caseId) });
  };

  const matterModalContext =
    isStaff && caseId ? { matterId: caseId }
      : currentCase?.numericId ? { matterId: String(currentCase.numericId) }
        : {};
  const getProgressByStatus = (status) => (status === 'pending' ? 30 : status === 'active' ? 60 : 100);
  const [statusProgress, setStatusProgress] = useState(0);

  useEffect(() => {
    if (!currentCase?.status) return;
    setStatusProgress(getProgressByStatus(currentCase.status));
  }, [currentCase?.status]);

  useEffect(() => {
    if (!reviewDraft) return;

    const syncSignaturePadSize = () => {
      if (!signaturePadRef.current || !signaturePadContainerRef.current) return;
      const canvas = signaturePadRef.current.getCanvas();
      const displayWidth = signaturePadContainerRef.current.clientWidth;
      if (!canvas || !displayWidth) return;

      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = Math.floor(displayWidth * ratio);
      canvas.height = Math.floor(signaturePadHeight * ratio);
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${signaturePadHeight}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(ratio, ratio);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
      signaturePadRef.current.clear();
      setHasDrawnSignature(false);
    };

    const timeoutId = window.setTimeout(syncSignaturePadSize, 0);
    window.addEventListener('resize', syncSignaturePadSize);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('resize', syncSignaturePadSize);
    };
  }, [reviewDraft]);

  const formatUsd = (n) => {
    const x = Number(n) || 0;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(x);
  };
  const formatDateDDMMYYYY = (v) => {
    if (!v) return '—';
    const dt = new Date(v);
    if (Number.isNaN(dt.getTime())) return '—';
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const yyyy = dt.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const matterInvoices = hasApiMatter && apiMatter?.invoices
    ? apiMatter.invoices.map((inv) => {
      const totalAmt = Number(inv.amount);
      const paidAmt = inv.paid_amount ?? (inv.payments || []).reduce((s, p) => s + Number(p.amount), 0);
      const dueAmt = inv.due_amount ?? Math.max(0, totalAmt - paidAmt);
      return {
        dbId: inv.id,
        id: inv.invoice_number,
        issued: formatDateDDMMYYYY(inv.issued_at || inv.created_at),
        due: formatDateDDMMYYYY(inv.due_date),
        amount: formatUsd(totalAmt),
        paid: formatUsd(paidAmt),
        due_amount: formatUsd(dueAmt),
        outstanding: formatUsd(dueAmt),
        status: inv.status === 'draft' ? 'pending' : inv.status,
        desc: inv.description || currentCase?.title || 'Professional Legal Services',
      };
    })
    : [];

  const billingTotals = (() => {
    const invs = hasApiMatter && apiMatter?.invoices ? apiMatter.invoices : [];
    let total = 0;
    let paid = 0;
    let outstanding = 0;
    for (const inv of invs) {
      if (inv.status === 'void') continue;
      const totalAmt = Number(inv.amount);
      const paidAmt = inv.paid_amount ?? (inv.payments || []).reduce((s, p) => s + Number(p.amount), 0);
      const dueAmt = inv.due_amount ?? Math.max(0, totalAmt - paidAmt);
      total += totalAmt;
      paid += paidAmt;
      outstanding += dueAmt;
    }
    return { total, paid, outstanding };
  })();

  const payAllOutstanding = async () => {
    const payable = matterInvoices.filter((inv) => inv.status !== 'paid' && inv.status !== 'void' && inv.dbId != null);
    if (!payable.length) {
      toast('No payable invoices found.', 'info');
      return;
    }
    try {
      for (const inv of payable) {
        await api.billing.payInvoice(inv.dbId, {
          payment_method: 'manual',
          payment_reference: 'internal-manual',
        });
      }
      const res = await api.matters.get(caseId);
      setApiMatter(res.data);
      toast('Manual payments recorded.', 'success');
    } catch (e) {
      toast(e.message || 'Payment failed', 'error');
    }
  };

  const payInvoiceRow = async (invoice) => {
    if (!invoice?.dbId) {
      toast('This invoice is not linked to a database record.', 'info');
      return;
    }
    if (invoice.status === 'paid' || invoice.status === 'void') return;
    try {
      setPayingInvoiceDbId(invoice.dbId);
      await api.billing.payInvoice(invoice.dbId, {
        payment_method: 'manual',
        payment_reference: 'internal-manual',
      });
      const res = await api.matters.get(caseId);
      setApiMatter(res.data);
      toast('Payment marked as paid.', 'success');
    } catch (e) {
      toast(e.message || 'Payment failed', 'error');
    } finally {
      setPayingInvoiceDbId(null);
    }
  };

  const commRows = hasApiMatter && apiMatter
    ? (apiMatter.communications || []).map((c) => {
      const typeLabels = {
        portal_message: 'Portal Msg',
        note: 'Internal Note',
        email_log: 'Email',
        call_log: 'Call',
        meeting_log: 'Meeting',
      };
      const t = typeLabels[c.communication_type] || String(c.communication_type || '').replace(/_/g, ' ');
      const body = c.message_body || '';
      const subj = body.split('\n')[0].slice(0, 80) || t;
      return {
        id: c.id,
        type: t,
        communication_type: c.communication_type,
        subject: subj,
        user: c.sender?.full_name || '—',
        text: body.slice(0, 280),
        date: new Date(c.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
        icon: c.communication_type === 'email_log' ? '✉️' : c.communication_type === 'call_log' ? '📞' : c.communication_type === 'meeting_log' ? '🤝' : '💬',
        visibility: c.visibility,
      };
    })
    : null;

  const activityRows = hasApiMatter && apiMatter
    ? (apiMatter.activities || []).map((a) => ({
      title: (a.action || 'activity').replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase()),
      text: a.description || '',
      date: new Date(a.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
      type: a.entity_type || 'system',
    }))
    : null;

  const nextDeadlineLabel = (() => {
    if (!hasApiMatter || !apiMatter?.invoices?.length) return currentCase?.nextHearing || '—';
    const open = apiMatter.invoices.filter((i) => i.status !== 'paid');
    if (!open.length) return '—';
    open.sort((a, b) => {
      const ta = a.due_date ? new Date(a.due_date).getTime() : Infinity;
      const tb = b.due_date ? new Date(b.due_date).getTime() : Infinity;
      return ta - tb;
    });
    const d = open[0].due_date;
    return d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  })();

  const recentActivityLabel = (() => {
    if (!hasApiMatter || !apiMatter?.activities?.length) return '—';
    return new Date(apiMatter.activities[0].created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  })();

  const overviewBenchmarks = (() => {
    if (!currentCase) return [];
    const invs = apiMatter?.invoices || [];
    const open = invs.filter((i) => i.status !== 'paid' && i.due_date);
    open.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
    const nextInv = open[0];
    return [
      {
        title: 'Next invoice due',
        date: nextInv?.due_date ? new Date(nextInv.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
        status: nextInv && new Date(nextInv.due_date) < new Date() ? 'Overdue' : 'Scheduled',
      },
      { title: 'Matter opened', date: currentCase.filed, status: 'Recorded' },
      { title: 'Last updated', date: currentCase.lastUpdated, status: 'Synced' },
    ];
  })();

  if (hasApiMatter && matterLoading) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[13px] text-slate-500">Loading matter…</p>
      </div>
    );
  }

  if (hasApiMatter && matterError) {
    return (
      <div className="animate-fade-in space-y-4">
        <button type="button" onClick={() => navigate(isClient ? '/client/matters' : role === 'lawyer' ? '/lawyer/matters' : '/admin/matters')} className="btn btn-secondary btn-xs">Back to Matters</button>
        <Card className="border-red-200 bg-red-50/50">
          <p className="text-[13px] text-red-800 font-600">{matterError}</p>
        </Card>
      </div>
    );
  }

  if (!currentCase) {
    return null;
  }

  const getStatusByProgress = (progress) => {
    if (progress >= 100) return 'closed';
    if (progress >= 50) return 'active';
    return 'pending';
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between pb-2 gap-3 flex-wrap">
        <button onClick={() => navigate(isClient ? '/client/matters' : role === 'lawyer' ? '/lawyer/matters' : '/admin/matters')} className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-500 text-[13px]">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><polyline points="15 18 9 12 15 6" /></svg>
          </div>
          Back to Matters
        </button>
        {!isClient && (
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">

            <button onClick={() => openModal('add-document', matterModalContext)} className="btn btn-secondary btn-sm h-9 px-4">Upload File</button>
            <button onClick={() => openModal('add-note', matterModalContext)} className="btn btn-primary btn-sm h-9 px-4">+ New Note</button>
          </div>
        )}
      </div>

      {/* Matter Header */}
      <header className="bg-white p-6 rounded-[1.25rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-primary-600" />
        <div className={`flex justify-between items-start gap-6 flex-wrap ${isClient ? 'items-center' : ''}`}>
          <div className="flex-1 min-w-[280px]">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[11px] bg-primary-50 text-primary-700 px-2.5 py-1 rounded-lg font-700 uppercase tracking-wider">{currentCase.id}</span>
              <Badge status={currentCase.status} />
              <Badge status={currentCase.priority} />
              {activeTimer && activeTimer.matter_id === Number(caseId) && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 border border-red-100 animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  <span className="text-[10px] font-900 text-red-600 uppercase tracking-widest">Recording Time</span>
                </div>
              )}
            </div>
            <h1 className="text-3xl font-800 text-slate-900 font-display mb-2">{currentCase.title}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-slate-500 font-500">
              <span className="flex items-center gap-1.5"><span className="text-[16px]">👤</span> {currentCase.client}</span>
              <span className="flex items-center gap-1.5"><span className="text-[16px]">📋</span> {currentCase.type}</span>
              <span className="flex items-center gap-1.5"><span className="text-[16px]">⚖️</span> {currentCase.lawyer}</span>
              <span className="flex items-center gap-1.5"><span className="text-[16px]">📅</span> Opened: {currentCase.filed}</span>
            </div>
          </div>
          {!isClient && (
            <div className="flex flex-col items-start sm:items-end gap-3 text-left sm:text-right w-full sm:w-auto">
              <div>
                <p className="text-[10px] text-slate-400 font-800 uppercase tracking-widest mb-1">
                  {activeTimer && activeTimer.matter_id !== Number(caseId) ? 'Timer Running Elsewhere' : 'Matter Timer'}
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-mono font-800 text-primary-600">
                    {activeTimer && activeTimer.matter_id === Number(caseId) ? formatTimer(timerSeconds) : '00:00:00'}
                  </p>
                  {activeTimer && activeTimer.matter_id === Number(caseId) ? (
                    <button onClick={stopTimer} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Stop Timer">
                      <span className="text-[12px]">■</span>
                    </button>
                  ) : (
                    <button
                      onClick={startTimer}
                      disabled={activeTimer && activeTimer.matter_id !== Number(caseId)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${activeTimer && activeTimer.matter_id !== Number(caseId) ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-primary-50 text-primary-600 hover:bg-primary-100'}`}
                      title={activeTimer && activeTimer.matter_id !== Number(caseId) ? 'Active timer on another matter' : 'Start Timer'}
                    >
                      <span className="text-[12px]">▶</span>
                    </button>
                  )}
                </div>
              </div>
              <button onClick={handleEdit} className="btn btn-secondary btn-xs px-3 font-700 text-[11px]">Edit Details</button>
            </div>
          )}
        </div>
      </header>

      {/* Summary Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total Billed', value: formatUsd(billingTotals.total), icon: '📊', color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Outstanding', value: formatUsd(billingTotals.outstanding), icon: '💰', color: 'bg-primary-50 text-primary-600' },
          { label: 'Documents', value: docs.length, icon: '📄', color: 'bg-blue-50 text-blue-600' },
          { label: 'Next Deadline', value: nextDeadlineLabel, icon: '⏰', color: 'bg-red-50 text-red-600' },
          { label: 'Recent Activity', value: recentActivityLabel, icon: '✨', color: 'bg-emerald-50 text-emerald-600' },
        ].map((stat, i) => (
          (isClient && stat.label === 'Total Billed') ? null : (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-[18px] font-800 text-slate-900 leading-none">{stat.value}</p>
                <p className="text-[11px] text-slate-400 mt-1.5 font-700 uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Workspace Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Main Workspace (75%) */}
        <div className="lg:col-span-3 min-w-0 space-y-4">
          <Tabs
            tabs={isClient ? ['Overview', 'Documents', 'Templates / Drafts', 'Messages', 'Billing'] : ['Overview', 'Documents', 'Templates / Drafts', 'Communications', 'Messages', 'Tasks', 'Billing', 'Activity', 'Notes']}
            active={tab}
            onChange={(newTab) => {
              setTab(newTab);
              const params = new URLSearchParams(window.location.search);
              params.set('tab', newTab);
              navigate(`${window.location.pathname}?${params.toString()}`, { replace: true });
            }}
          />

          {isClient && (
            <div className="animate-fade-in mb-6">
              <div className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-[1.5rem] p-6 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <span className="text-9xl">📈</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div>
                    <h3 className="text-[13px] font-800 uppercase tracking-[0.2em] text-primary-200 mb-2">Matter Status</h3>
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30">
                        <span className="text-xl font-900 uppercase tracking-tighter">{currentCase.status}</span>
                      </div>
                      <p className="text-[15px] font-600 opacity-90 max-w-sm">
                        {currentCase.status === 'active' ? "Your case is currently in active progress. Our team is working on the current phase." :
                          currentCase.status === 'pending' ? "Your case is currently awaiting updates or required documentation." :
                            "Your case has been successfully completed and finalized."}
                      </p>
                    </div>
                  </div>
                  <div className="flex -space-x-3">
                    <Avatar initials="AP" size="md" className="ring-4 ring-primary-600" />
                    <Avatar initials="SL" size="md" className="ring-4 ring-primary-600" />
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-[11px] font-800 ring-4 ring-primary-600">+2</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'Overview' && (
            <div className="animate-fade-in space-y-4">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[15px] font-700 text-slate-900">Matter Summary</h3>
                </div>
                <p className="text-[14px] leading-relaxed text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                  "{currentCase.description || 'No description provided for this matter.'}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-[11px] font-800 text-slate-400 uppercase tracking-widest mb-4">Core Information</h4>
                    <div className="space-y-4">
                      {[
                        ['Filing Date', currentCase.filed],
                        ['Opposing Party', currentCase.opposingParty || 'N/A'],
                        ['Lead Counsel', currentCase.lawyer],
                        ['Court Locality', isAdmin ? '—' : 'Superior Court of California'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-[13px] border-b border-slate-50 pb-2">
                          <span className="text-slate-500">{k}</span>
                          <span className="font-600 text-slate-800">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-800 text-slate-400 uppercase tracking-widest mb-4">Upcoming Benchmarks</h4>
                    <div className="space-y-3">
                      {overviewBenchmarks.map(b => (
                        <div key={b.title} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <div>
                            <p className="text-[13px] font-600 text-slate-800">{b.title}</p>
                            <p className="text-[11px] text-slate-400">{b.date}</p>
                          </div>
                          <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full uppercase tracking-wider ${b.status === 'Imminent' || b.status === 'Overdue' ? 'bg-red-50 text-red-600' : 'bg-primary-50 text-primary-600'}`}>{b.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>



              {/* Private Strategy Log - Hidden from clients */}
              {!isClient ? (
                <Card className="bg-primary-900 text-white border-0">
                  <h3 className="text-[13px] font-700 uppercase tracking-widest text-primary-300 mb-3">Internal Strategy Brief</h3>
                  <p className="text-[14px] leading-relaxed opacity-90 italic">
                    {isAdmin && apiMatter
                      ? (apiMatter.description
                        ? `"${apiMatter.description}"`
                        : 'No internal strategy brief recorded for this matter.')
                      : '"Initial motion for summary judgment is ready. Focus on the testimony from the third-party inspector. Need to confirm the insurance limits for the adverse party before next mediation session."'}
                  </p>
                </Card>
              ) : (
                <Card className="bg-primary-50 border-primary-100">
                  <h3 className="text-[13px] font-700 uppercase tracking-widest text-primary-600 mb-3">Your Case Progress Brief</h3>
                  <p className="text-[14px] leading-relaxed text-slate-700 font-500">
                    We are currently in the mid-litigation phase. Our team has finalized the initial filings and is now performing a deep-dive into the evidence provided. You will receive an update as soon as the court confirms the next session date.
                    <br /><br />
                    <span className="font-700 text-primary-700">Next Action:</span> Final review of witness affidavits.
                  </p>
                </Card>
              )}

              {!isClient && (
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[15px] font-700 text-slate-900 flex items-center gap-2">
                      <span className="text-[18px]">⏱️</span> Time Tracking History
                    </h3>
                  </div>
                  {timerHistory.length === 0 ? (
                    <div className="bg-slate-50/50 rounded-xl p-6 text-center border border-dashed border-slate-200">
                      <p className="text-[12px] text-slate-400 italic">No time entries recorded for this matter.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {timerHistory.map((t) => (
                        <div key={t.id} className="bg-white border border-slate-100 rounded-xl p-3.5 flex items-center justify-between hover:border-primary-100 transition-colors shadow-sm relative overflow-hidden">
                          {t.is_running && <div className="absolute top-0 left-0 w-1 h-full bg-primary-600" />}
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[15px] ${t.is_running ? 'bg-primary-50 text-primary-600' : 'bg-slate-50 text-slate-400'}`}>
                              {t.is_running ? '⌛' : '👤'}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[12px] font-700 text-slate-800 truncate">{t.user?.full_name || 'Legal Staff'}</p>
                              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                <span>{new Date(t.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <span>→</span>
                                <span>{t.end_time ? new Date(t.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Running'}</span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-[13px] font-800 ${t.is_running ? 'text-primary-600 animate-pulse' : 'text-slate-700'}`}>
                              {t.duration_minutes ? (t.duration_minutes < 60 ? `${t.duration_minutes}m` : `${Math.floor(t.duration_minutes / 60)}h ${t.duration_minutes % 60}m`) : 'In Progress'}
                            </p>
                            <p className="text-[10px] text-slate-400 font-700 uppercase tracking-widest mt-0.5">
                              {new Date(t.start_time).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {tab === 'Documents' && (
            <div className="animate-fade-in space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {[...new Set(['Complaint', 'Evidence', 'Contract', 'Court order', ...remoteFolders.map(f => f.name)])].map((folder) => (
                  <div
                    key={folder}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setDocumentsFolderFilter((prev) => (prev === folder ? null : folder));
                      }
                    }}
                    onClick={() => {
                      setDocumentsFolderFilter((prev) => (prev === folder ? null : folder));
                      toast(`Opened folder ${folder}`, 'info');
                    }}
                    className={`p-4 rounded-2xl border-2 bg-white transition-all cursor-pointer group ${documentsFolderFilter === folder
                        ? 'border-primary-500 ring-2 ring-primary-200 bg-primary-50/30'
                        : 'border-slate-50 hover:border-primary-200'
                      }`}
                  >
                    <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">📁</span>
                    <p className={`text-[13px] font-700 leading-tight ${documentsFolderFilter === folder ? 'text-primary-800' : 'text-slate-800'}`}>{folder}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {docs.filter((d) => documentFolderBucket(d.category) === folder).length} files
                    </p>
                  </div>
                ))}
              </div>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-[15px] font-700 text-slate-900">Case Documents</h3>
                    {documentsFolderFilter && (
                      <p className="text-[11px] text-slate-500 mt-1">Showing: {documentsFolderFilter} · click folder again to show all</p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {isClient && <button onClick={() => openModal('add-document', matterModalContext)} className="btn btn-primary btn-xs">Upload Document</button>}
                    <div className="relative">
                      <input className="text-[12px] bg-slate-50 border border-slate-100 rounded-lg pl-8 pr-3 py-1.5 w-full sm:w-48 outline-none focus:ring-2 focus:ring-primary-100" placeholder="Search docs..." />
                      <svg className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                  </div>
                </div>
                <Table headers={['Document Name', 'Category', 'Uploaded By', 'Date', '']}>
                  {docsInFolder.map(d => (
                    <Tr key={d.id}>
                      <Td>
                        <div className="flex items-center gap-2">
                          <FileIcon type={d.type} />
                          <span className="text-[13px] font-600 text-slate-700 truncate max-w-[200px]">{d.name}</span>
                        </div>
                      </Td>
                      <Td><span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-600 tracking-wide uppercase">{d.category || 'General'}</span></Td>
                      <Td className="text-slate-500 text-[12px]">{d.by}</Td>
                      <Td className="text-slate-400 text-[11px]">{d.uploaded}</Td>
                      <Td>
                        <button
                          onClick={async () => {
                            try {
                              await downloadDocumentBlob(d.id, d.name);
                              toast(`${d.name} download started`, 'success');
                            } catch (e) {
                              toast(e.message || 'Download failed', 'error');
                            }
                          }}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M7 16V4h10v12" /><path d="M20 12l-8 8-8-8" /></svg>
                        </button>
                      </Td>
                    </Tr>
                  ))}
                </Table>
              </Card>
            </div>
          )}

          {tab === 'Templates / Drafts' && (
            <div className="animate-fade-in">
              <Card>
                <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
                  <div>
                    <h3 className="text-[15px] font-700 text-slate-900">Templates / Drafts</h3>
                    <p className="text-[12px] text-slate-500 mt-1">Create, review, and manage draft documents for this matter.</p>
                  </div>
                  {!isClient && (
                    <div className="flex gap-2">
                      <button onClick={() => openModal('browse-templates', { targetMatterId: caseId })} className="btn btn-secondary btn-sm">
                        Browse Library
                      </button>
                      <button onClick={openCreateDraftModal} className="btn btn-primary btn-sm">
                        Create New Draft
                      </button>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {templatesDrafts.length > 0 ? templatesDrafts.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl border border-slate-100 bg-white">
                      {(() => {
                        const displayStatus = isClient ? clientStatus(item.status) : draftUiStatus(item.status);
                        return (
                          <>
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                              <div className="min-w-0">
                                <p className="text-[14px] font-700 text-slate-900">{item.title}</p>
                                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 flex-wrap">
                                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-700 uppercase tracking-wider">{item.category}</span>
                                  <span>Updated {item.updated}</span>
                                </div>
                              </div>
                              <span className={`text-[10px] font-800 px-2.5 py-1 rounded-full uppercase tracking-wider ${displayStatus === 'Draft'
                                  ? 'bg-amber-50 text-amber-600'
                                  : displayStatus === 'Ready'
                                    ? 'bg-blue-50 text-blue-600'
                                    : displayStatus === 'Sent for Signature' || displayStatus === 'Pending Signature'
                                      ? 'bg-primary-50 text-primary-600'
                                      : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                {displayStatus}
                              </span>
                            </div>
                            <div className="mt-4 flex gap-2 flex-wrap">
                              <button onClick={() => openDraftPreview(item)} className="btn btn-secondary btn-xs">View Draft</button>
                              {!isClient && <button onClick={() => openModal('use-template', { ...item, targetMatterId: caseId })} className="btn btn-primary btn-xs">Use Template</button>}
                              {!isClient && <button onClick={() => sendTemplateForSignature(item.id)} className="btn btn-primary btn-xs">Send for Signature</button>}
                              {isClient && (item.status === 'sent_for_signature' || displayStatus === 'Pending Signature') && (
                                <button onClick={() => openReviewAndSign(item)} className="btn btn-primary btn-xs">Review & Sign</button>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )) : (
                    <EmptyState
                      icon="📝"
                      title="No drafts yet"
                      desc="Create a new draft or select one from the template library to get started."
                      action={
                        !isClient && (
                          <div className="flex gap-2">
                            <button onClick={() => openModal('browse-templates', { targetMatterId: caseId })} className="btn btn-secondary btn-xs">Browse Library</button>
                            <button onClick={openCreateDraftModal} className="btn btn-primary btn-xs">Create Draft</button>
                          </div>
                        )
                      }
                    />
                  )}
                </div>
              </Card>
            </div>
          )}

          {(tab === 'Communications' || tab === 'Messages') && (
            <Card>
              <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
                <h3 className="text-[15px] font-700 text-slate-900">{isClient ? 'Portal Messages' : 'Communication History'}</h3>
                <div className="flex gap-2 flex-wrap">
                  {!isClient && <button onClick={() => openModal('log-call', matterModalContext)} className="btn btn-secondary btn-xs">Log Call</button>}
                  <button className="btn btn-primary btn-xs" onClick={() => openModal('compose-email', matterModalContext)}>{isClient ? 'New Message' : 'Send Email'}</button>
                </div>
              </div>
              <div className="space-y-4">
                {(commRows || [])
                  .filter(c => c.communication_type !== 'note')
                  .filter(c => !isClient || c.visibility === 'client_visible' || c.visibility === 'client_shared')
                  .map((com, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-50 bg-slate-50/20 hover:bg-white hover:shadow-md transition-all group">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                        {com.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-[13.5px] font-700 text-slate-900 truncate">{com.subject}</h4>
                          <span className="text-[11px] text-slate-400 font-500 whitespace-nowrap">{com.date}</span>
                        </div>
                        <p className="text-[12.5px] text-slate-500 mb-2">{com.text}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full font-700 uppercase tracking-widest">{com.type}</span>
                            <span className="text-[11px] text-slate-400 font-500">· {com.user}</span>
                          </div>
                          {isClient && (
                            <button
                              onClick={() => {
                                setReplyingTo(com.id);
                                setReplyText(`Replying to: ${com.text.slice(0, 50)}${com.text.length > 50 ? '...' : ''}\n\n`);
                              }}
                              className="text-[11px] font-800 text-primary-600 hover:text-primary-800 uppercase tracking-widest"
                            >
                              Reply →
                            </button>
                          )}
                        </div>
                        {replyingTo === com.id && (
                          <div className="mt-4 p-4 rounded-xl bg-white border border-primary-100 shadow-sm animate-slide-up">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-800 uppercase tracking-widest text-primary-600">Your Reply</span>
                              <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                            <Textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type your reply here..."
                              rows={3}
                              className="mb-3 text-[13px]"
                            />
                            <div className="flex justify-end gap-2">
                              <button onClick={() => setReplyingTo(null)} className="btn btn-secondary btn-xs">Cancel</button>
                              <button
                                onClick={handleSendReply}
                                disabled={isSubmittingReply || !replyText.trim()}
                                className="btn btn-primary btn-xs"
                              >
                                {isSubmittingReply ? 'Sending...' : 'Send Reply'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          )}

          {tab === 'Tasks' && (
            <div className="animate-fade-in space-y-6">
              {(role === 'lawyer' || role === 'admin') ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Status Control Card */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                        <span className="text-9xl">⚖️</span>
                      </div>

                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <p className="text-[11px] font-800 uppercase tracking-[0.2em] text-slate-400 mb-1">Matter Management</p>
                          <h3 className="text-xl font-800 text-slate-900 font-display">Status & Workflow</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 font-700 uppercase mb-1">Current Matter Status</p>
                          <Badge status={currentCase.status} />
                          <p className="text-[10px] text-slate-400 mt-1">Last updated: {statusHistory[0]?.date || '—'}</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-[13px] font-700 text-slate-700 mb-4">Set New Matter Status</label>
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-inner">
                            <div className="flex items-center justify-between text-[12px] text-slate-500 mb-2">
                              <span>Matter Progress</span>
                              <span className="font-700 text-slate-600">{statusProgress}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
                              <div
                                className="h-full bg-primary-600 rounded-full transition-all duration-300"
                                style={{ width: `${statusProgress}%` }}
                              />
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="10"
                              value={statusProgress}
                              onChange={(e) => {
                                const value = Number(e.target.value);
                                setStatusProgress(value);
                                const nextStatus = getStatusByProgress(value);
                                if (nextStatus !== currentCase.status) {
                                  handleStatusChange(nextStatus);
                                }
                              }}
                              className="w-full mb-3 accent-primary-600 cursor-pointer"
                              aria-label="Matter progress slider"
                            />
                            <div className="grid grid-cols-3 gap-2">
                              {['active', 'pending', 'closed'].map((s) => {
                                const isSelected = currentCase.status === s;
                                return (
                                  <button
                                    key={s}
                                    onClick={() => {
                                      handleStatusChange(s);
                                      setStatusProgress(getProgressByStatus(s));
                                    }}
                                    className={`py-2.5 px-2 sm:px-3 rounded-xl text-[12px] sm:text-[13px] font-700 transition-all duration-200 text-center whitespace-nowrap ${isSelected
                                        ? 'bg-primary-600 text-white shadow-sm'
                                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                      }`}
                                  >
                                    {s === 'closed' ? 'Complete' : s.charAt(0).toUpperCase() + s.slice(1)}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-50">
                          {[
                            { label: 'Active', desc: 'Matter is currently in active litigation/negotiation.', color: 'emerald' },
                            { label: 'Pending', desc: 'Awaiting review, documents, or opposing response.', color: 'amber' },
                            { label: 'Complete', desc: 'Matter has been finalized and billing is reconciled.', color: 'slate' },
                          ].map(item => (
                            <div key={item.label} className="p-3">
                              <p className={`text-[11px] font-800 text-${item.color}-600 underline decoration-2 underline-offset-4 mb-2`}>{item.label}</p>
                              <p className="text-[11px] text-slate-400 leading-relaxed font-500">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>

                    <div className="bg-primary-50/50 rounded-[1.5rem] p-6 border border-primary-100/50">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white text-xl flex-shrink-0 shadow-lg shadow-primary-500/20">💡</div>
                        <div>
                          <h4 className="text-[14px] font-700 text-primary-900 mb-1">Lawyer Tip</h4>
                          <p className="text-[12px] text-primary-700/70 leading-relaxed font-500">
                            Keep the status updated to "Complete" once all trust account balances are zeroed and final orders have been served. This helps in firm-wide revenue forecasting.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status History Sidebar */}
                  <div className="space-y-4">
                    <Card>
                      <h3 className="text-[13px] font-800 text-slate-900 uppercase tracking-widest mb-6">Status History</h3>
                      <div className="space-y-6">
                        {statusHistory.map((h, i) => (
                          <div key={i} className="relative pl-6 group">
                            {i !== statusHistory.length - 1 && <div className="absolute left-[3px] top-[14px] bottom-[-22px] w-[1px] bg-slate-100 group-hover:bg-primary-200" />}
                            <div className={`absolute left-0 top-[6px] w-[7px] h-[7px] rounded-full ring-4 ring-white shadow-sm ${i === 0 ? 'bg-primary-500' : 'bg-slate-300'}`} />
                            <div className="space-y-1">
                              <p className="text-[12px] font-700 text-slate-800">{h.to === 'closed' ? 'Complete' : h.to.charAt(0).toUpperCase() + h.to.slice(1)}</p>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-600">
                                <span>{h.date}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                <span>By {h.by}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                    <div className="p-5 rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center py-8">
                      <span className="text-2xl mb-2 opacity-30">🔔</span>
                      <p className="text-[11px] font-700 text-slate-400 uppercase tracking-wider">Automated Notifications</p>
                      <p className="text-[10px] text-slate-400 mt-1 max-w-[150px]">Status updates are reflected instantly in the connected client portal.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {['Pending', 'In Progress', 'Completed', 'Overdue'].map(status => (
                    <div key={status} className="space-y-3">
                      <div className="flex items-center justify-between px-1">
                        <h4 className="text-[11px] font-800 uppercase tracking-widest text-slate-500">{status}</h4>
                        <span className="w-5 h-5 bg-slate-100 rounded-lg flex items-center justify-center text-[11px] font-800 text-slate-400">{tasks.filter(t => t.status === status).length}</span>
                      </div>
                      {tasks.filter(t => t.status === status).map(task => (
                        <div key={task.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-primary-300 cursor-pointer transition-all group">
                          <div className="flex justify-between items-start mb-2">
                            <span className={`text-[9px] font-900 px-2 py-0.5 rounded-full uppercase tracking-tighter ${task.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>{task.priority}</span>
                            <span className="text-[10px] text-slate-400 font-500">{task.due}</span>
                          </div>
                          <p className="text-[13px] font-700 text-slate-800 leading-tight group-hover:text-primary-600 transition-colors">{task.title}</p>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                            <span className="text-[11px] text-slate-400">{task.assignee}</span>
                            <Avatar initials={task.assignee.split(' ').map(n => n[0]).join('')} size="xs" />
                          </div>
                        </div>
                      ))}
                      <button onClick={() => openModal('add-task')} className="w-full py-2.5 border-2 border-dashed border-slate-100 rounded-2xl text-[12px] text-slate-400 font-700 hover:bg-slate-50 hover:border-slate-300 transition-all">+ Add {status}</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'Billing' && (
            <div className="animate-fade-in space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] text-slate-400 font-800 uppercase tracking-widest mb-1">Total Billed</p>
                  <p className="text-2xl font-800 text-slate-900">{formatUsd(billingTotals.total)}</p>
                </div>
                <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 shadow-sm">
                  <p className="text-[10px] text-emerald-500 font-800 uppercase tracking-widest mb-1">Paid to Date</p>
                  <p className="text-2xl font-800 text-emerald-600">{formatUsd(billingTotals.paid)}</p>
                </div>
                <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100 shadow-sm">
                  <p className="text-[10px] text-red-500 font-800 uppercase tracking-widest mb-1">Outstanding</p>
                  <p className="text-2xl font-800 text-red-600">{formatUsd(billingTotals.outstanding)}</p>
                </div>
              </div>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[15px] font-700 text-slate-900">{isClient ? 'Your Invoices' : 'Matter Invoices'}</h3>
                  {!isClient && <button className="btn btn-primary btn-xs" onClick={() => openModal('create-invoice', matterModalContext)}>Generate Invoice</button>}
                  {isClient && <button className="btn btn-primary btn-xs" onClick={payAllOutstanding}>Pay All Outstanding</button>}
                </div>
                <Table headers={['Invoice ID', 'Issue Date', 'Due Date', 'Total', 'Paid', 'Outstanding', 'Status', '']}>
                  {matterInvoices.map(inv => (
                    <Tr key={inv.id}>
                      <Td><span className="font-mono text-[12px] font-700 text-primary-600">{inv.id}</span></Td>
                      <Td className="text-slate-500 text-[12px]">{inv.issued}</Td>
                      <Td className="text-slate-500 text-[12px]">{inv.due}</Td>
                      <Td className="font-700 text-slate-900">{inv.amount}</Td>
                      <Td className="text-emerald-600 font-600 text-[12px]">{inv.paid}</Td>
                      <Td className="text-red-500 font-600 text-[12px]">{inv.outstanding}</Td>
                      <Td><Badge status={inv.status} /></Td>
                      <Td>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => openModal('view-invoice', {
                              id: inv.id,
                              dbId: inv.dbId,
                              client: currentCase?.client || '—',
                              amount: inv.amount,
                              issued: inv.issued,
                              due: inv.due,
                              status: inv.status,
                              desc: inv.desc || currentCase?.title || 'Professional Legal Services',
                            })}
                            className="text-primary-600 font-700 text-[12px] hover:underline"
                          >
                            View Invoice
                          </button>
                          {isClient && inv.status !== 'paid' && inv.status !== 'void' && inv.dbId != null && (
                            <button
                              type="button"
                              onClick={() => payInvoiceRow(inv)}
                              disabled={payingInvoiceDbId === inv.dbId}
                              className="btn btn-primary btn-xs"
                            >
                              {payingInvoiceDbId === inv.dbId ? 'Processing...' : 'Pay'}
                            </button>
                          )}
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </Table>
              </Card>
            </div>
          )}

          {tab === 'Activity' && (
            <Card>
              <h3 className="text-[15px] font-700 text-slate-900 mb-6">Discovery Activity Timeline</h3>
              <div className="space-y-0">
                {(activityRows || []).map((act, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 ${i === 0 ? 'bg-primary-600' : 'bg-slate-300'} mt-1.5`} />
                      {i < 5 && <div className="w-0.5 h-full bg-slate-100 -mt-0.5 group-hover:bg-primary-100 transition-colors" />}
                    </div>
                    <div className="pb-8 flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-[13.5px] font-700 text-slate-800">{act.title}</h4>
                        <span className="text-[10px] text-slate-400 font-600 uppercase tracking-widest">{act.date}</span>
                      </div>
                      <p className="text-[12.5px] text-slate-500">{act.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === 'Notes' && (
            <div className="animate-fade-in space-y-4">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[15px] font-700 text-slate-900">Matter Journal</h3>
                  {!isClient && <button className="btn btn-primary btn-xs" onClick={() => openModal('add-note', matterModalContext)}>+ Add Daily Note</button>}
                </div>
                <div className="space-y-4">
                  {(apiMatter?.communications || [])
                    .filter((c) => c.communication_type === 'note')
                    .map((c) => ({
                      author: c.sender?.full_name || '—',
                      date: new Date(c.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
                      text: c.message_body || '',
                      visibility: c.visibility === 'client_visible' || c.visibility === 'client_shared' ? 'Shared' : 'Internal',
                    }))
                    .map((note, idx) => (
                      (isClient && note.visibility === 'Internal') ? null : (
                        <div key={idx} className="p-4 rounded-2xl border border-slate-50 bg-slate-50/20 group hover:shadow-sm transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-700 text-slate-900">{note.author}</span>
                              <span className="text-slate-300">·</span>
                              <span className="text-[11px] text-slate-400 font-500">{note.date}</span>
                            </div>
                            {!isClient && (
                              <span className={`text-[9px] font-800 px-2 py-0.5 rounded-full uppercase tracking-tighter ${note.visibility === 'Internal' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                {note.visibility}
                              </span>
                            )}
                          </div>
                          <p className="text-[13.5px] text-slate-600 leading-relaxed font-400">{note.text}</p>
                        </div>
                      )
                    ))}
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Status / Quick Panel (25%) */}
        <div className="space-y-4 lg:sticky lg:top-0">
          <Card className="!p-0 overflow-hidden">
            <div className="bg-slate-900 text-white p-5">
              <p className="text-[10px] font-800 uppercase tracking-[0.2em] text-primary-400 mb-4 text-center">Matter Status Profile</p>
              <div className="flex flex-col items-center gap-3">
                <div className="min-w-[4rem] h-16 px-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xl font-900 whitespace-nowrap shadow-inner shadow-white/10">
                  {currentCase.matter_number || currentCase.id || '—'}
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-700">{currentCase.title}</h3>
                  <p className="text-slate-400 text-[12px]">{currentCase.type}</p>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <h4 className="text-[11px] font-800 text-slate-400 uppercase tracking-widest mb-3">Matter Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">💼</div>
                    <div><p className="text-[11px] text-slate-400 font-600 uppercase">Assigned Lawyer</p><p className="text-[13px] font-700 text-slate-800 leading-tight">{currentCase.lawyer}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">👤</div>
                    <div><p className="text-[11px] text-slate-400 font-600 uppercase">Primary Client</p><p className="text-[13px] font-700 text-slate-800 leading-tight">{currentCase.client}</p></div>
                  </div>
                </div>
              </div>
              <div className="pt-5 border-t border-slate-100">
                <h4 className="text-[11px] font-800 text-slate-400 uppercase tracking-widest mb-3">Control Center</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="text-slate-500">Matter Status</span>
                    <Badge status={currentCase.status} />
                  </div>
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="text-slate-500">Matter Priority</span>
                    <Badge status={currentCase.priority} />
                  </div>
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="text-slate-500">Client Portal</span>
                    <span className="flex items-center gap-1.5 text-emerald-600 font-700"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Active</span>
                  </div>
                  <div className="flex justify-between items-center text-[12px] pt-1">
                    <span className="text-slate-500">Last Updated</span>
                    <span className="font-600 text-slate-700 text-[11px]">{currentCase.lastUpdated || '—'}</span>
                  </div>
                </div>
              </div>
              {!isClient && (
                <div className="pt-4">
                  <button onClick={() => toast('Matter archiving confirmed', 'warning')} className="w-full py-2.5 rounded-xl border border-slate-100 text-slate-400 text-[12px] font-700 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Archive Matter
                  </button>
                </div>
              )}
            </div>
          </Card>

        </div>
      </div>

      {isCreateDraftOpen && (
        <Modal
          title="Create New Draft"
          onClose={() => setIsCreateDraftOpen(false)}
          footer={
            <>
              <button onClick={() => setIsCreateDraftOpen(false)} className="btn btn-secondary btn-sm">Cancel</button>
              <button onClick={saveNewDraft} className="btn btn-primary btn-sm">Save Draft</button>
            </>
          }
        >
          <div className="space-y-4">
            <Field label="Draft Title" required>
              <Input
                value={newDraftForm.title}
                onChange={(e) => setNewDraftForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter draft title"
              />
            </Field>
            <Field label="Category / Template Type" required>
              <Select
                value={newDraftForm.category}
                onChange={(e) => setNewDraftForm((prev) => ({ ...prev, category: e.target.value }))}
              >
                <option value="">Select category</option>
                <option value="Engagement">Engagement</option>
                <option value="Intake">Intake</option>
                <option value="Litigation">Litigation</option>
                <option value="Resolution">Resolution</option>
                <option value="General">General</option>
              </Select>
            </Field>
            <Field label="Related Matter Name">
              <Input
                value={newDraftForm.matterName}
                onChange={(e) => setNewDraftForm((prev) => ({ ...prev, matterName: e.target.value }))}
              />
            </Field>
            <Field label="Client Name">
              <Input
                value={newDraftForm.clientName}
                onChange={(e) => setNewDraftForm((prev) => ({ ...prev, clientName: e.target.value }))}
              />
            </Field>
            <Field label="Draft Status">
              <Input value={newDraftForm.status} disabled />
            </Field>
            <Field label="Mock Content / Notes">
              <Textarea
                rows={4}
                value={newDraftForm.notes}
                onChange={(e) => setNewDraftForm((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Add mock legal draft notes..."
              />
            </Field>
          </div>
        </Modal>
      )}

      {reviewDraft && (
        <Modal
          title={`Review & Sign · ${reviewDraft.title}`}
          onClose={() => {
            setReviewDraft(null);
            setReviewConfirmed(false);
            setHasDrawnSignature(false);
            signaturePadRef.current?.clear();
          }}
          footer={
            <>
              <button onClick={() => {
                setReviewDraft(null);
                setReviewConfirmed(false);
                setHasDrawnSignature(false);
                signaturePadRef.current?.clear();
              }} className="btn btn-secondary btn-sm">Cancel</button>
              <button
                onClick={signReviewedDraft}
                disabled={!reviewConfirmed || !hasDrawnSignature}
                className={`btn btn-primary btn-sm ${(!reviewConfirmed || !hasDrawnSignature) ? 'opacity-60 cursor-not-allowed hover:translate-y-0 hover:shadow-none' : ''}`}
              >
                Sign Document
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[10px] font-800 uppercase tracking-[0.18em] text-slate-400 mb-1">Document Title</p>
              <p className="text-[14px] font-700 text-slate-900">{reviewDraft.title}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <p className="text-[10px] font-800 uppercase tracking-[0.18em] text-slate-400 mb-2">Short Preview</p>
              <p className="text-[13px] text-slate-700 leading-relaxed">{reviewDraft.preview}</p>
              <span className="inline-flex mt-3 text-[10px] font-800 px-2.5 py-1 rounded-full uppercase tracking-wider bg-primary-50 text-primary-600">
                Pending Signature
              </span>
            </div>
            <div className="rounded-2xl border border-primary-100 bg-primary-50/60 p-4">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reviewConfirmed}
                  onChange={(e) => setReviewConfirmed(e.target.checked)}
                  className="mt-0.5 accent-primary-600"
                />
                <span className="text-[12.5px] text-slate-700">
                  I confirm I have reviewed this document
                </span>
              </label>
              <div className="mt-3">
                <div ref={signaturePadContainerRef} className="rounded-xl border border-slate-200 bg-white p-2">
                  <SignatureCanvas
                    ref={signaturePadRef}
                    penColor="#3E2F2F"
                    onEnd={() => setHasDrawnSignature(!signaturePadRef.current?.isEmpty())}
                    canvasProps={{
                      className: 'w-full rounded-lg bg-white',
                      height: signaturePadHeight,
                    }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-[11px] text-slate-500">Use your mouse or touch to sign</p>
                  <button
                    onClick={() => {
                      signaturePadRef.current?.clear();
                      setHasDrawnSignature(false);
                    }}
                    className="btn btn-secondary btn-xs"
                  >
                    Clear Signature
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {previewDraft && (
        <Modal
          title={`Draft Preview · ${previewDraft.title}`}
          onClose={() => setPreviewDraft(null)}
          wide
          footer={
            <>
              <button onClick={() => setPreviewDraft(null)} className="btn btn-secondary btn-sm">Close</button>
            </>
          }
        >
          <div className="space-y-5">
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-800 uppercase tracking-[0.18em] text-slate-400 mb-1">Draft Title</p>
                  <p className="text-[14px] font-700 text-slate-900">{previewDraft.title}</p>
                </div>
                <div>
                  <p className="text-[10px] font-800 uppercase tracking-[0.18em] text-slate-400 mb-1">Matter Name</p>
                  <p className="text-[14px] font-600 text-slate-800">{currentCase.title}</p>
                </div>
                <div>
                  <p className="text-[10px] font-800 uppercase tracking-[0.18em] text-slate-400 mb-1">Client Name</p>
                  <p className="text-[14px] font-600 text-slate-800">{currentCase.client}</p>
                </div>
                <div>
                  <p className="text-[10px] font-800 uppercase tracking-[0.18em] text-slate-400 mb-1">Last Updated</p>
                  <p className="text-[14px] font-600 text-slate-800">{previewDraft.updated}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className={`inline-flex text-[10px] font-800 px-2.5 py-1 rounded-full uppercase tracking-wider ${previewDraft.status === 'Draft'
                    ? 'bg-amber-50 text-amber-600'
                    : previewDraft.status === 'Ready'
                      ? 'bg-blue-50 text-blue-600'
                      : previewDraft.status === 'Sent for Signature'
                        ? 'bg-primary-50 text-primary-600'
                        : 'bg-emerald-50 text-emerald-600'
                  }`}>
                  {previewDraft.status}
                </span>
              </div>
            </div>

            <div className="border border-slate-100 rounded-2xl bg-white p-5">
              <p className="text-[10px] font-800 uppercase tracking-[0.18em] text-slate-400 mb-3">Mock Draft Content</p>
              <div className="space-y-4 text-[13.5px] text-slate-700 leading-relaxed">
                <p>
                  <span className="font-700 text-slate-900">Re:</span> {currentCase.title} - {currentCase.client}
                </p>
                <p>{previewDraft.preview}</p>
                <p>
                  This draft is prepared for internal review and client-ready refinement. The language may be revised by counsel before formal issuance or signature circulation.
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}


// ─────────────────────────────────────────────────────────
//  CALENDAR PAGE
// ─────────────────────────────────────────────────────────
export function CalendarPage({ toast, openModal, role = 'lawyer' }) {
  const isAdmin = role !== 'client';
  const [viewDate, setViewDate] = useState(() => new Date());
  const [events, setEvents] = useState([]);
  const [matterPick, setMatterPick] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Quick Add State
  const [quickTitle, setQuickTitle] = useState('');
  const [quickDate, setQuickDate] = useState(new Date().toISOString().split('T')[0]);
  const [quickMatter, setQuickMatter] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [calRes, matRes] = await Promise.all([
        api.calendar.list(),
        api.matters.list({ limit: 500 }),
      ]);
      setEvents(calRes.data || []);
      const mats = Array.isArray(matRes.data) ? matRes.data : [];
      setMatterPick(mats.map((m) => ({ id: m.id, label: m.matter_number || String(m.id) })));
    } catch (e) {
      setError(e.message || 'Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleQuickAdd = async () => {
    if (!quickTitle.trim()) {
      toast('Please enter an event title', 'info');
      return;
    }
    setIsAdding(true);
    try {
      await api.calendar.create({
        title: quickTitle,
        date: quickDate,
        matter_id: quickMatter || null
      });
      toast('Event created successfully', 'success');
      setQuickTitle('');
      setQuickMatter('');
      loadData();
    } catch (e) {
      toast(e.message || 'Failed to create event', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = viewDate.getFullYear();
  const monthIdx = viewDate.getMonth();
  const monthName = viewDate.toLocaleString('default', { month: 'long' });

  const days = [];
  const daysInMonth = getDaysInMonth(year, monthIdx);
  const firstDay = getFirstDayOfMonth(year, monthIdx);

  // Prev month padding
  const prevMonthDays = getDaysInMonth(year, monthIdx - 1);
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: prevMonthDays - firstDay + i + 1, other: true });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ day: d });
  }

  // Next month padding
  while (days.length % 7 !== 0) {
    days.push({ day: days.length - (firstDay + daysInMonth) + 1, other: true });
  }

  const handlePrev = () => setViewDate(new Date(year, monthIdx - 1, 1));
  const handleNext = () => setViewDate(new Date(year, monthIdx + 1, 1));

  const getTypeStyle = (type) => {
    switch (type) {
      case 'invoice': return 'bg-amber-100 text-amber-700';
      case 'matter': return 'bg-blue-100 text-blue-700';
      case 'hearing': return 'bg-red-100 text-red-700';
      default: return 'bg-emerald-100 text-emerald-700';
    }
  };

  const sameDay = (d1, d2) => {
    const a = new Date(d1);
    const b = new Date(d2);
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };

  const today = new Date();
  const monthEventsSide = events
    .filter((e) => {
      const dt = new Date(e.date);
      return dt.getFullYear() === year && dt.getMonth() === monthIdx;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (loading) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[13px] text-slate-500">Loading calendar…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in space-y-4">
        <Card className="border-red-200 bg-red-50/50">
          <p className="text-[13px] text-red-800 font-600">{error}</p>
          <button type="button" onClick={loadData} className="btn btn-secondary btn-sm mt-3">Retry</button>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="Calendar" subtitle={`${monthName} ${year} · Manage hearings, deadlines & meetings`}>
        <button onClick={handlePrev} className="btn btn-secondary btn-xs">← Prev</button>
        <span className="text-[13px] font-600 text-slate-700 px-3">{monthName} {year}</span>
        <button onClick={handleNext} className="btn btn-secondary btn-xs">Next →</button>
        <button onClick={() => openModal('add-event')} className="btn btn-primary">+ Add Event</button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card noPad className="overflow-hidden">
            <div className="grid grid-cols-7 border-b border-slate-100">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="py-2 text-center text-[11px] font-600 text-slate-500 uppercase tracking-wide">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
              {days.map(({ day, other }, i) => {
                const cellDate = new Date(year, monthIdx, day);
                const evts = other ? [] : events.filter(e => sameDay(e.date, cellDate));
                const isToday = !other && day === today.getDate() && monthIdx === today.getMonth() && year === today.getFullYear();

                return (
                  <div key={i} onClick={() => openModal('add-event', { date: cellDate })} className={`min-h-[84px] p-1.5 ${other ? 'bg-slate-50' : 'hover:bg-slate-50'} cursor-pointer transition-all hover:shadow-inner group relative`}>
                    <div className={`w-5 h-5 flex items-center justify-center text-[12px] mb-1.5 rounded-full ${isToday ? 'bg-primary-600 text-white font-700 shadow-sm' : other ? 'text-slate-300' : 'text-slate-700'}`}>{day}</div>
                    <div className="space-y-0.5">
                      {evts.map((e, j) => (
                        <div
                          key={j}
                          onClick={(ev) => { ev.stopPropagation(); openModal('view-event', e); }}
                          className={`text-[9px] font-700 px-1.5 py-0.5 rounded truncate border border-black/5 shadow-sm transition-transform hover:scale-[1.02] active:scale-95 ${getTypeStyle(e.type)}`}
                        >
                          {e.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <Card>
            <h3 className="text-[13px] font-800 text-slate-900 uppercase tracking-widest mb-4">Agenda: {monthName}</h3>
            <div className="space-y-3">
              {monthEventsSide.length > 0 ? monthEventsSide.map((e, i) => (
                <div
                  key={i}
                  onClick={() => openModal('view-event', e)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white hover:shadow-md hover:border-slate-200 transition-all border border-transparent group cursor-pointer"
                >
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex flex-col items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                    <span className="text-[14px] font-800 text-primary-700 leading-none">{new Date(e.date).getDate()}</span>
                    <span className="text-[8px] text-primary-400 font-800 uppercase mt-0.5">{monthName.slice(0, 3)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-700 text-slate-800 truncate">{e.title}</p>
                    <p className="text-[11px] text-slate-400 font-500 uppercase tracking-wide">{e.type}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${e.type === 'invoice' ? 'bg-amber-400' : e.type === 'matter' ? 'bg-blue-400' : 'bg-emerald-400'}`} />
                </div>
              )) : (
                <div className="py-12 text-center">
                  <p className="text-[12px] text-slate-400 italic">No events scheduled for this month.</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-slate-900 text-white border-0 shadow-xl shadow-slate-900/10">
            <h3 className="text-[12px] font-800 uppercase tracking-widest mb-4 text-slate-400">Quick Add Event</h3>
            <div className="space-y-3">
              <input
                className="w-full text-[13px] bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="What's happening?"
                value={quickTitle}
                onChange={e => setQuickTitle(e.target.value)}
              />
              <input
                type="date"
                className="w-full text-[13px] bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all [color-scheme:dark]"
                value={quickDate}
                onChange={e => setQuickDate(e.target.value)}
              />
              <select
                className="w-full text-[13px] bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none cursor-pointer"
                value={quickMatter}
                onChange={e => setQuickMatter(e.target.value)}
              >
                <option value="" className="bg-slate-900">General Event</option>
                {matterPick.map((c) => <option key={c.id} value={c.id} className="bg-slate-900">{c.label}</option>)}
              </select>
              <button
                onClick={handleQuickAdd}
                disabled={isAdding}
                className="btn btn-primary w-full justify-center h-11 text-[13px] font-800 shadow-lg shadow-primary-500/20 disabled:opacity-50"
              >
                {isAdding ? 'Adding...' : 'Add to Schedule'}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  DOCUMENTS PAGE
// ─────────────────────────────────────────────────────────
export function DocumentsPage({ toast, openModal, role = 'lawyer' }) {
  const isAdmin = role !== 'client';
  const [search, setSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [remoteDocs, setRemoteDocs] = useState([]);
  const [remoteFolders, setRemoteFolders] = useState([]);
  const [docLoading, setDocLoading] = useState(isAdmin);
  const [docError, setDocError] = useState('');

  const fetchData = useCallback(async () => {
    if (!isAdmin) return;
    setDocLoading(true);
    setDocError('');
    try {
      const [docRes, folderRes] = await Promise.all([
        api.documents.list({ limit: 500 }),
        api.folders.list()
      ]);
      setRemoteDocs(Array.isArray(docRes.data) ? docRes.data : []);
      setRemoteFolders(Array.isArray(folderRes.data) ? folderRes.data : []);
    } catch (e) {
      setDocError(e.message || 'Failed to load document data');
    } finally {
      setDocLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    window.addEventListener('vktori:entities-changed', fetchData);
    return () => window.removeEventListener('vktori:entities-changed', fetchData);
  }, [fetchData]);

  const folders = (() => {
    const buckets = [...new Set([
      'Complaint', 'Evidence', 'Contract', 'Court order',
      ...remoteFolders.map(f => f.name)
    ])];
    const by = Object.fromEntries(buckets.map((name) => [name, 0]));
    remoteDocs.forEach((d) => {
      const bucket = documentFolderBucket(d.category);
      if (bucket && bucket in by) by[bucket] += 1;
    });
    return buckets.map((name) => ({ name, count: by[name] || 0 }));
  })();

  const filtered = (() => {
    return remoteDocs
      .filter((d) => {
        if (!selectedFolder) return true;
        return documentFolderBucket(d.category) === selectedFolder;
      })
      .map((d) => ({
        id: d.id,
        name: d.original_name,
        type: matterMimeToFileType(d.mime_type),
        size: `${Math.max(1, Math.round(d.file_size / 1024))} KB`,
        uploaded: new Date(d.created_at).toLocaleDateString(),
        caseId: d.matter?.matter_number || '—',
      }))
      .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
  })();

  if (isAdmin && docLoading) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[13px] text-slate-500">Loading documents…</p>
      </div>
    );
  }

  if (isAdmin && docError) {
    return (
      <div className="animate-fade-in space-y-4">
        <Card className="border-red-200 bg-red-50/50">
          <p className="text-[13px] text-red-800 font-600">{docError}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="Documents" subtitle="Manage all matter documents and files">
        <button onClick={() => openModal('add-document')} className="btn btn-secondary">Upload File</button>
        <button onClick={() => openModal('add-folder')} className="btn btn-primary">+ New Folder</button>
      </PageHeader>

      <Card>
        <h3 className="text-[13px] font-600 text-slate-900 mb-3">Matter Folders</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {folders.map(f => (
            <div
              key={f.name}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedFolder((prev) => (prev === f.name ? null : f.name));
                }
              }}
              onClick={() => {
                setSelectedFolder((prev) => (prev === f.name ? null : f.name));
                toast(`Opened folder ${f.name}`, 'info');
              }}
              className={`flex flex-col items-center p-3 rounded-xl border cursor-pointer transition-all group ${selectedFolder === f.name
                  ? 'border-primary-500 ring-2 ring-primary-200 bg-primary-50/40'
                  : 'border-slate-200 hover:border-primary-300 hover:bg-primary-50/30'
                }`}
            >
              <span className="text-3xl mb-1.5">📁</span>
              <p className={`text-[11px] font-600 text-center leading-tight ${selectedFolder === f.name ? 'text-primary-800' : 'text-slate-800 group-hover:text-primary-700'}`}>{f.name}</p>
              <p className="text-[10px] text-slate-400">{f.count} files</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
          <div>
            <h3 className="text-[13px] font-600 text-slate-900">Recent Files</h3>
            {selectedFolder && (
              <p className="text-[11px] text-slate-500 mt-0.5">Showing: {selectedFolder} · click folder again to show all</p>
            )}
          </div>
          <SearchInput placeholder="Search files..." value={search} onChange={setSearch} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(d => (
            <div key={d.id} className="flex flex-col gap-2 p-3 rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-md cursor-pointer transition-all group">
              <FileIcon type={d.type} />
              <div>
                <p className="text-[12px] font-500 text-slate-800 group-hover:text-primary-600 line-clamp-2 leading-tight">{d.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{d.size} · {d.uploaded}</p>
                <p className="text-[10px] text-slate-400">{d.caseId}</p>
              </div>
              <button
                onClick={async () => {
                  try {
                    await downloadDocumentBlob(d.id, d.name);
                    toast(`${d.name} download started`, 'success');
                  } catch (e) {
                    toast(e.message || 'Download failed', 'error');
                  }
                }}
                className="btn btn-secondary text-[11px] py-1 justify-center w-full mt-auto"
              >
                ⬇ Download
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  BILLING PAGE
// ─────────────────────────────────────────────────────────
export function BillingPage({ openModal, toast, navigate, role = 'lawyer' }) {
  const isAdmin = role !== 'client';
  const canMarkPaid = role === 'admin';
  const [tab, setTab] = useState('Invoices');
  const [search, setSearch] = useState('');
  const [apiInvoices, setApiInvoices] = useState([]);
  const [apiTimers, setApiTimers] = useState([]);
  const [apiSettings, setApiSettings] = useState({});
  const [apiTrustAccounts, setApiTrustAccounts] = useState([]);
  const [billLoading, setBillLoading] = useState(isAdmin);
  const [billError, setBillError] = useState('');

  const billFormatUsd = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n) || 0);

  const loadBillingData = useCallback(async () => {
    if (!isAdmin) return;
    setBillLoading(true);
    setBillError('');
    try {
      const fetchAdminSettings = role === 'admin' 
        ? api.dashboard.admin().then(r => r.data?.settings || {}) 
        : Promise.resolve({});

      const [invRes, timerRes, settingsRes, trustRes] = await Promise.all([
        api.billing.listInvoices({ limit: 500 }),
        api.timers.list({ limit: 200 }),
        fetchAdminSettings,
        api.billing.listTrustAccounts()
      ]);
      setApiInvoices(Array.isArray(invRes.data) ? invRes.data : []);
      setApiTimers(Array.isArray(timerRes.data) ? timerRes.data : []);
      setApiSettings(settingsRes);
      setApiTrustAccounts(Array.isArray(trustRes.data) ? trustRes.data : []);
    } catch (e) {
      setBillError(e.message || 'Failed to load billing');
    } finally {
      setBillLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadBillingData();
    window.addEventListener('vktori:entities-changed', loadBillingData);
    return () => window.removeEventListener('vktori:entities-changed', loadBillingData);
  }, [loadBillingData]);

  const adminStats = (() => {
    if (!isAdmin) {
      return { unbilled: '—', draft: '$0.00', ar: '$0.00', mtd: '$0.00' };
    }
    
    // Calculate Invoices Stats
    let draft = 0;
    let ar = 0;
    let mtd = 0;
    const startMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    
    apiInvoices.forEach((inv) => {
      const totalAmt = Number(inv.amount);
      const paidAmt = inv.paid_amount ?? (inv.payments || []).reduce((s, p) => s + Number(p.amount), 0);
      const dueAmt = inv.due_amount ?? Math.max(0, totalAmt - paidAmt);

      if (inv.status === 'draft') {
        draft += totalAmt;
      } else if (inv.status !== 'void') {
        ar += dueAmt;
      }

      // Revenue MTD: sum of payments made this month
      (inv.payments || []).forEach(p => {
        const pd = p.paid_on ? new Date(p.paid_on) : null;
        if (pd && !Number.isNaN(pd.getTime()) && pd >= startMonth) {
          mtd += Number(p.amount);
        }
      });
    });

    // Calculate Unbilled Time (Running timers + stopped but not invoiced - though backend usually invoices immediately)
    const rate = parseFloat(apiSettings.billing_rate) || 150;
    let unbilledMins = 0;
    apiTimers.forEach(t => {
      if (t.is_running) {
        const start = new Date(t.start_time);
        const now = new Date();
        const diff = Math.max(0, Math.floor((now - start) / 60000));
        unbilledMins += diff;
      } else if (!t.invoice_id) {
        // Technically backend handles this, but for safety:
        unbilledMins += (t.duration_minutes || 0);
      }
    });
    const unbilledAmt = (unbilledMins / 60) * rate;

    return {
      unbilled: unbilledAmt > 0 ? billFormatUsd(unbilledAmt) : '$0.00',
      draft: billFormatUsd(draft),
      ar: billFormatUsd(ar),
      mtd: billFormatUsd(mtd),
    };
  })();

  const ledgerRows = (() => {
    if (!isAdmin || !apiInvoices.length) return [];
    return [...apiInvoices]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 40)
      .map((inv) => {
        const dt = inv.issued_at || inv.created_at;
        const dateStr = dt ? new Date(dt).toLocaleDateString() : '—';
        const matterNum = inv.matter?.matter_number || '';
        const paid = inv.status === 'paid';
        return {
          date: dateStr,
          desc: `Invoice ${inv.invoice_number}${matterNum ? ` · ${matterNum}` : ''}`,
          amount: paid ? `+${billFormatUsd(inv.amount)}` : billFormatUsd(inv.amount),
          color: paid ? 'text-emerald-600' : 'text-slate-700',
          bal: '—',
        };
      });
  })();

  const filteredInvoices = (() => {
    return apiInvoices
      .filter((inv) => {
        const client = inv.matter?.client?.full_name || '';
        const q = search.toLowerCase();
        return client.toLowerCase().includes(q) || inv.invoice_number.toLowerCase().includes(q);
      })
      .map((inv) => ({
        id: inv.invoice_number,
        dbId: inv.id,
        client: inv.matter?.client?.full_name || '—',
        amount: inv.amount,
        paid_amount: inv.paid_amount,
        due_amount: inv.due_amount,
        issued: inv.issued_at ? new Date(inv.issued_at).toLocaleDateString() : '—',
        due: inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '—',
        status: inv.status,
        desc: inv.description || 'Professional Legal Services',
      }));
  })();

  if (isAdmin && billLoading) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[13px] text-slate-500">Loading billing…</p>
      </div>
    );
  }

  if (isAdmin && billError) {
    return (
      <div className="animate-fade-in space-y-4">
        <Card className="border-red-200 bg-red-50/50">
          <p className="text-[13px] text-red-800 font-600">{billError}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="Billing & Financials" subtitle="Manage invoices, trust accounts, and billable time">
        <button onClick={() => navigate('calendar')} className="btn btn-secondary">Time Entries</button>
        <button onClick={() => openModal('create-invoice')} className="btn btn-primary">+ Create Invoice</button>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Unbilled Time" value={adminStats.unbilled} icon="⏱️" iconBg="bg-blue-50" gradient="linear-gradient(90deg,#0B1F3A,#C9A24A)" />
        <StatCard label="Draft Invoices" value={adminStats.draft} icon="📝" iconBg="bg-slate-50" gradient="linear-gradient(90deg,#94a3b8,#cbd5e1)" />
        <StatCard label="Outstanding (A/R)" value={adminStats.ar} icon="⏳" iconBg="bg-amber-50" gradient="linear-gradient(90deg,#f59e0b,#fbbf24)" />
        <StatCard label="Collected (MTD)" value={adminStats.mtd} icon="💰" iconBg="bg-emerald-50" gradient="linear-gradient(90deg,#10b981,#34d399)" />
      </div>

      <Tabs tabs={['Invoices', 'Trust Accounts', 'Ledger', 'Expenses']} active={tab} onChange={setTab} />

      {tab === 'Invoices' && (
        <Table headers={['Invoice ID', 'Client', 'Amount', 'Issued', 'Due Date', 'Status', '']}
          searchPlaceholder="Search invoices..." onSearch={setSearch}>
          {filteredInvoices.map(inv => (
            <Tr key={inv.id}>
              <Td className="font-700 text-slate-900">{inv.id}</Td>
              <Td>
                <div className="flex items-center gap-2">
                  <Avatar initials={inv.client.split(' ').map(n => n[0]).join('') || '—'} size="xs" />
                  <span className="font-500">{inv.client}</span>
                </div>
              </Td>
              <Td>
                <div className="font-700">{billFormatUsd(inv.amount)}</div>
                {inv.paid_amount > 0 && <div className="text-[10px] text-emerald-600 font-600">Paid: {billFormatUsd(inv.paid_amount)}</div>}
                {inv.due_amount > 0 && <div className="text-[10px] text-red-500 font-600">Due: {billFormatUsd(inv.due_amount)}</div>}
              </Td>
              <Td className="text-slate-500">{inv.issued}</Td>
              <Td className="text-slate-500">{inv.due}</Td>
              <Td><Badge status={inv.status} /></Td>
              <Td>
                <div className="flex gap-1 flex-wrap">
                  <button onClick={() => openModal('view-invoice', inv)} className="btn btn-secondary btn-xs p-1.5" title="View Details">👁️</button>
                  {canMarkPaid && inv.status !== 'paid' && inv.status !== 'void' && inv.dbId != null && (
                    <button onClick={() => openModal('pay-invoice', inv)} className="btn btn-primary btn-xs p-1.5" title="Mark paid">✓</button>
                  )}
                  <button onClick={() => downloadInvoicePdfBlob(inv.dbId, inv.id, toast)} className="btn btn-secondary btn-xs p-1.5" title="Download PDF">📥</button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      )}
      {tab === 'Trust Accounts' && (
        <div className="space-y-3">
          <div className="flex justify-end">
             <button onClick={() => openModal('trust-deposit')} className="btn btn-primary btn-sm">+ Trust Deposit</button>
          </div>
          <Table headers={['Client', 'Account ID', 'Balance', 'Last Activity', 'Status', '']}>
            {apiTrustAccounts.length === 0 ? (
              <Tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-500 text-[13px]">No trust account records found.</td>
              </Tr>
            ) : (
              apiTrustAccounts.map(ta => (
                <Tr key={ta.id}>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Avatar initials={ta.client?.full_name?.split(' ').map(n => n[0]).join('') || '—'} size="xs" />
                      <span className="font-500">{ta.client?.full_name || '—'}</span>
                    </div>
                  </Td>
                  <Td className="text-slate-500 text-[12px]">TR-{String(ta.id).padStart(4, '0')}</Td>
                  <Td className="font-700 text-emerald-600">{billFormatUsd(ta.balance)}</Td>
                  <Td className="text-slate-500 text-[12px]">{ta.updated_at ? new Date(ta.updated_at).toLocaleDateString() : '—'}</Td>
                  <Td><Badge status="active" /></Td>
                  <Td>
                    <div className="flex gap-2">
                      <button onClick={() => openModal('trust-ledger', ta)} className="btn btn-secondary btn-xs p-1.5" title="View History">📜</button>
                      <button onClick={() => openModal('apply-trust', ta)} className="btn btn-primary btn-xs p-1.5" title="Apply to Invoice">💳</button>
                    </div>
                  </Td>
                </Tr>
              ))
            )}
          </Table>
        </div>
      )}

      {tab === 'Expenses' && (
        <Table headers={['Vendor / Description', 'Matter ID', 'Category', 'Amount', 'Date', 'Status']}>
          <Tr>
            <td colSpan={6} className="px-4 py-10 text-center text-slate-500 text-[13px]">No expense records in the database.</td>
          </Tr>
        </Table>
      )}
      {tab === 'Ledger' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-700 text-slate-900">Firm Transaction Ledger</h3>
            <button onClick={() => toast('Financial statement generated successfully!', 'success')} className="btn btn-secondary btn-xs">Generate Statement</button>
          </div>
          <div className="space-y-0 text-[13px]">
            {ledgerRows.map((row, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 py-3 border-b border-slate-50 hover:bg-slate-50 px-2 transition-colors">
                <div className="col-span-2 text-slate-400">{row.date}</div>
                <div className="col-span-6 font-500 text-slate-800">{row.desc}</div>
                <div className={`col-span-2 font-700 text-right ${row.color}`}>{row.amount}</div>
                <div className="col-span-2 text-right font-600 text-slate-400">{row.bal}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  EMAIL PAGE
// ─────────────────────────────────────────────────────────
export function EmailPage({ toast, openModal, role = 'lawyer' }) {
  const isAdmin = role !== 'client';
  const [selected, setSelected] = useState(null);
  const [commList, setCommList] = useState([]);
  const [mailLoading, setMailLoading] = useState(isAdmin);
  const [mailError, setMailError] = useState('');
  const [action, setAction] = useState(null); // 'reply' or 'forward'

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    (async () => {
      setMailLoading(true);
      setMailError('');
      try {
        const res = await api.communications.list({ limit: 200 });
        if (cancelled) return;
        const rows = Array.isArray(res.data) ? res.data : [];
        const mapped = rows.map((c) => {
          const body = c.message_body || '';
          return {
            id: c.id,
            from: c.sender?.full_name || 'Unknown',
            subject: body.split('\n')[0].slice(0, 80) || String(c.communication_type || '').replace(/_/g, ' '),
            preview: body.slice(0, 120),
            body,
            time: new Date(c.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
            read: true,
          };
        });
        setCommList(mapped);
        setSelected(mapped[0] || null);
      } catch (e) {
        if (!cancelled) setMailError(e.message || 'Failed to load communications');
      } finally {
        if (!cancelled) setMailLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isAdmin]);

  const handleSend = () => {
    toast(action === 'reply' ? 'Reply sent successfully!' : 'Email forwarded!', 'success');
    setAction(null);
  };

  const inbox = commList;

  if (isAdmin && mailLoading) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[13px] text-slate-500">Loading communications…</p>
      </div>
    );
  }

  if (isAdmin && mailError) {
    return (
      <div className="animate-fade-in space-y-4">
        <Card className="border-red-200 bg-red-50/50">
          <p className="text-[13px] text-red-800 font-600">{mailError}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="Email" subtitle="View and manage communications">
        <button onClick={() => openModal('compose-email')} className="btn btn-primary">✏️ Compose</button>
      </PageHeader>

      <Card noPad className="overflow-hidden">
        <div className="flex" style={{ height: '520px' }}>
          {/* Email List */}
          <div className="w-72 flex-shrink-0 border-r border-slate-100 flex flex-col">
            <div className="p-3 border-b border-slate-100">
              <SearchInput placeholder="Search emails..." value="" onChange={() => { }} />
            </div>
            <div className="flex-1 overflow-y-auto">
              {inbox.map(e => (
                <div key={e.id} onClick={() => { setSelected(e); setAction(null); }}
                  className={`px-4 py-3 cursor-pointer border-b border-slate-50 transition-colors hover:bg-slate-50 ${selected?.id === e.id ? 'bg-primary-50 border-l-2 border-l-primary-500' : ''}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[13px] ${!e.read ? 'font-700 text-slate-900' : 'font-500 text-slate-700'}`}>{e.from}</span>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">{e.time}</span>
                  </div>
                  <p className="text-[12px] text-slate-600 truncate">{e.subject}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{e.preview}</p>
                  {!e.read && <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1" />}
                </div>
              ))}
            </div>
          </div>

          {/* Email Preview */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {selected ? (
              <>
                <div className="p-4 border-b border-slate-100">
                  <h3 className="text-[16px] font-600 text-slate-900 mb-2">{selected.subject}</h3>
                  <div className="flex items-center gap-3">
                    <Avatar initials={selected.from.charAt(0)} size="sm" />
                    <div className="flex-1">
                      <p className="text-[13px] font-500">{selected.from}</p>
                      <p className="text-[11px] text-slate-400">{selected.time}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setAction('reply')} className={`btn btn-xs ${action === 'reply' ? 'btn-primary' : 'btn-secondary'}`}>Reply</button>
                      <button onClick={() => setAction('forward')} className={`btn btn-xs ${action === 'forward' ? 'btn-primary' : 'btn-secondary'}`}>Forward</button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
                  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-line">{selected.body}</p>
                  </div>

                  {action && (
                    <div className="animate-slide-up bg-white rounded-xl border border-primary-100 shadow-lg overflow-hidden">
                      <div className="bg-primary-50 px-4 py-2 border-b border-primary-100 flex items-center justify-between">
                        <span className="text-[11px] font-700 text-primary-700 uppercase tracking-wider">
                          {action === 'reply' ? 'Quick Reply' : 'Forward Email'}
                        </span>
                        <button onClick={() => setAction(null)} className="text-primary-400 hover:text-primary-600">✕</button>
                      </div>
                      <div className="p-4 space-y-3">
                        {action === 'forward' && (
                          <Field label="Forward to" required>
                            <Input placeholder="recipient@example.com" required />
                          </Field>
                        )}
                        <Field label={action === 'reply' ? 'Your Message' : 'Message (Optional)'} required={action === 'reply'}>
                          <Textarea rows={4} placeholder={action === 'reply' ? 'Type your reply here...' : 'Add a note to this forward...'} required={action === 'reply'} />
                        </Field>
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setAction(null)} className="btn btn-secondary btn-sm">Cancel</button>
                          <button onClick={handleSend} className="btn btn-primary btn-sm">
                            {action === 'reply' ? 'Send Reply' : 'Forward Email'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : <EmptyState icon="📨" title="Select an email" desc="Click an email to read it" />}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  AI ASSISTANT PAGE
// ─────────────────────────────────────────────────────────
export function AIPage({ toast }) {
  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="VyNius Assistant" subtitle="Powered by ">
        <span className="flex items-center gap-1.5 text-[12px] text-emerald-600 font-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />Online
        </span>
      </PageHeader>

      <Card className="min-h-[520px] flex items-center justify-center">
        <EmptyState icon="🤖" title="AI assistant unavailable" desc="Live AI service is not configured yet." />
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  USERS PAGE
// ─────────────────────────────────────────────────────────
export function UsersPage({ toast, openModal }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const mapApiUser = (u) => ({
    id: u.id,
    name: u.full_name,
    email: u.email,
    avatar: (u.full_name || '').split(' ').filter(Boolean).map((p) => p[0]).join('').slice(0, 2).toUpperCase() || '—',
    roleLabel: u.role === 'admin' ? 'Admin' : (u.role === 'client' ? 'Client' : 'Lawyer'),
    cases: u._count?.assigned_matters ?? 0,
    status: u.is_active ? 'active' : 'inactive',
    lastLogin: u.last_login_at
      ? new Date(u.last_login_at).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true
      })
      : '—',
  });

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.users.list();
      const rows = Array.isArray(res.data) ? res.data : [];
      setUsers(rows.map(mapApiUser));
    } catch (e) {
      setError(e.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleEdit = (u) => {
    openModal('edit-user', u, async (values) => {
      try {
        const updatedName = `${values.firstName} ${values.lastName}`;
        const apiRole = values.roleLabel === 'Admin' ? 'admin' : (values.roleLabel === 'Client' ? 'client' : 'lawyer');
        await api.users.update(u.id, {
          full_name: updatedName,
          email: values.email,
          role: apiRole,
          is_active: values.status === 'active',
        });
        await loadUsers();
        toast('User updated successfully!', 'success');
      } catch (e) {
        toast(e.message || 'Update failed', 'error');
      }
    });
  };

  const handleDelete = (u) => {
    if (!window.confirm(`Are you sure you want to delete user ${u.name}?`)) return;
    (async () => {
      try {
        await api.users.remove(u.id);
        await loadUsers();
        toast('User deleted successfully!', 'success');
      } catch (e) {
        toast(e.message || 'Delete failed', 'error');
      }
    })();
  };

  if (loading) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[13px] text-slate-500">Loading users…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in space-y-4">
        <Card className="border-red-200 bg-red-50/50">
          <p className="text-[13px] text-red-800 font-600">{error}</p>
          <button type="button" onClick={loadUsers} className="btn btn-secondary btn-sm mt-3">Retry</button>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="User Management" subtitle="Manage lawyers and administrators">
        <button onClick={() => openModal('add-user', null, async (values) => {
          try {
            const apiRole = values.roleLabel === 'Admin' ? 'admin' : 'lawyer';
            await api.users.create({
              full_name: `${values.firstName} ${values.lastName}`,
              email: values.email,
              password: values.password,
              role: apiRole,
            });
            await loadUsers();
            toast('User account created!', 'success');
          } catch (e) {
            toast(e.message || 'Create failed', 'error');
          }
        })} className="btn btn-primary">+ Add User</button>
      </PageHeader>
      <Table headers={['User', 'Email', 'Role', 'Cases', 'Status', 'Last Login', '']}>
        {users.map(u => (
          <Tr key={u.id}>
            <Td><div className="flex items-center gap-2.5"><Avatar initials={u.avatar} size="sm" /><div><p className="font-500 text-slate-900">{u.name}</p><p className="text-[11px] text-slate-400">{u.id}</p></div></div></Td>
            <Td className="text-slate-500">{u.email}</Td>
            <Td><span className={`text-[11px] font-600 px-2 py-0.5 rounded-full ${u.roleLabel === 'Admin' ? 'bg-accent-50 text-accent-700' : 'bg-blue-50 text-blue-700'}`}>{u.roleLabel}</span></Td>
            <Td className="font-600">{u.cases || '–'}</Td>
            <Td><Badge status={u.status} /></Td>
            <Td className="text-[12px] text-slate-400">{u.lastLogin}</Td>
            <Td>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(u)} className="btn btn-secondary p-1.5" title="Edit">✏️</button>
                <button onClick={() => handleDelete(u)} className="btn btn-danger p-1.5" title="Delete">🗑</button>
              </div>
            </Td>
          </Tr>
        ))}
      </Table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  SETTINGS PAGE
// ─────────────────────────────────────────────────────────
export function SettingsPage({ toast }) {
  const [activeTab, setActiveTab] = useState('Firm Profile');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    (async () => {
      try {
        const res = await api.settings.get();
        setSettings(res.data || {});
      } catch (e) {
        toast('Failed to load settings', 'error');
      }
    })();
  }, [toast]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.settings.update(settings);
      toast('Firm settings saved successfully!', 'success');
      // Trigger a global change event if needed
      window.dispatchEvent(new CustomEvent('vktori:entities-changed'));
    } catch (e) {
      toast(e.message || 'Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key, val) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  const integrationPlaceholder = () => toast('Integration API is not available.', 'info');
  const integrationCards = [
    { title: 'Titan Email', subtitle: 'Sync firm communications and calendars.', connected: true },
    { title: 'Zoom Video', subtitle: 'Automate hearing and consultation links.', connected: true },
    { title: 'Microsoft Outlook', subtitle: 'Bi-directional calendar and task sync.', connected: false },
    { title: 'Microsoft Teams', subtitle: 'Internal firm collaboration and chat.', connected: false },
  ];

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="Firm Settings" subtitle="Configure VkTori to match your practice" />

      <Tabs tabs={['Firm Profile', 'Integrations', 'Social Links', 'Security', 'Billing Setup', 'Notifications']} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'Firm Profile' && (
        <Card className="max-w-3xl">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
            <div className="w-20 h-20 rounded-2xl bg-primary-600 flex items-center justify-center text-3xl text-white shadow-xl shadow-primary-500/20">
              {String(settings.firm_name || 'V')[0]}
            </div>
            <div>
              <h3 className="text-xl font-800 text-slate-900 font-display">{settings.firm_name || 'VkTori Legal'}</h3>
              <p className="text-[14px] text-slate-500">Legal ERP Configuration</p>

            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Law Firm Name"><Input value={settings.firm_name || ''} onChange={e => updateSetting('firm_name', e.target.value)} /></Field>
            <Field label="Practice Specialization"><Input value={settings.specialty || ''} onChange={e => updateSetting('specialty', e.target.value)} /></Field>
            <Field label="Primary Email"><Input value={settings.email || ''} onChange={e => updateSetting('email', e.target.value)} /></Field>
            <Field label="Phone Number"><Input value={settings.phone || ''} onChange={e => updateSetting('phone', e.target.value)} /></Field>
            <div className="md:col-span-2">
              <Field label="Default Billing Rate ($/hr)"><Input type="number" value={settings.billing_rate || ''} onChange={e => updateSetting('billing_rate', e.target.value)} /></Field>
            </div>
          </div>
          <div className="flex justify-end mt-8 border-t border-slate-100 pt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn btn-primary px-8"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </Card>
      )}

      {activeTab === 'Integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrationCards.map((item) => (
            <Card key={item.title} className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-[15px] font-800 text-slate-900">{item.title}</h3>
                  <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">{item.subtitle}</p>
                </div>
                <span
                  className={`flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-700 uppercase tracking-wider border ${item.connected
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                >
                  {item.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="flex justify-end pt-3 mt-auto border-t border-slate-100">
                {item.connected ? (
                  <button type="button" onClick={integrationPlaceholder} className="btn btn-secondary btn-sm">
                    Disconnect
                  </button>
                ) : (
                  <button type="button" onClick={integrationPlaceholder} className="btn btn-primary btn-sm">
                    Connect Service
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {activeTab === 'Social Links' && (
        <SocialLinksSettings toast={toast} />
      )}

      {activeTab === 'Security' && (
        <Card className="max-w-3xl">
          <h3 className="text-base font-700 text-slate-900 mb-4">Change Password</h3>
          <div className="space-y-4">
            <Field label="Current Password">
              <Input
                type="password"
                placeholder="••••••••"
                value={passwordForm.currentPassword}
                onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="New Password">
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                />
              </Field>
              <Field label="Confirm Password">
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </Field>
            </div>
          </div>
          <div className="flex justify-end mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={async () => {
                if (!passwordForm.currentPassword || !passwordForm.newPassword) {
                  return toast('Please fill in all password fields', 'error');
                }
                if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                  return toast('Passwords do not match', 'error');
                }
                try {
                  setLoading(true);
                  await api.auth.changePassword({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                  });
                  toast('Password updated successfully!', 'success');
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                } catch (e) {
                  toast(e.message || 'Failed to update password', 'error');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="btn btn-primary px-8"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </Card>
      )}

      {activeTab === 'Billing Setup' && (
        <Card className="max-w-3xl">
          <h3 className="text-base font-700 text-slate-900 mb-6">Billing Preferences</h3>
          <div className="space-y-6">
            <Field label="Primary Billing Email">
              <Input
                value={settings.billing_email || ''}
                onChange={e => updateSetting('billing_email', e.target.value)}
                placeholder="billing@yourfirm.com"
              />
            </Field>
            <div className="space-y-4">
              {[
                { key: 'auto_invoice', label: 'Auto-Invoice per Case', desc: 'Generate a base invoice automatically when a case is created.' },
                { key: 'storage_overages', label: 'Cloud Storage Overages', desc: 'Automatically charge for storage usage beyond the 500GB limit.' },
                { key: 'tax_compliance', label: 'Tax Compliance Receipts', desc: 'Send VAT/Tax compliant PDF receipts for every transaction.' },
              ].map((pref) => {
                const isEnabled = settings[pref.key] === 'true' || settings[pref.key] === true;
                return (
                  <div key={pref.key} className="flex items-start justify-between gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                    <div>
                      <p className="text-[13px] font-700 text-slate-900">{pref.label}</p>
                      <p className="text-[11px] text-slate-500">{pref.desc}</p>
                    </div>
                    <div
                      onClick={() => updateSetting(pref.key, !isEnabled ? 'true' : 'false')}
                      className={`w-10 h-5 rounded-full relative cursor-pointer shadow-sm transition-all duration-200 flex-shrink-0 ${isEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 ${isEnabled ? 'left-[23px]' : 'left-1'
                        }`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end mt-8 pt-4 border-t border-slate-100">
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn btn-primary px-8"
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </Card>
      )}
      {activeTab === 'Notifications' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-base font-700 text-slate-900 mb-6 flex items-center gap-2">
                <span className="text-xl">📩</span> Email Notifications
              </h3>
              <div className="space-y-4">
                {[
                  {
                    group: 'Matter Management', items: [
                      { key: 'notify_new_lead', label: 'New Intake Lead', desc: 'Notify when a new lead is captured via website.' },
                    ]
                  },
                  {
                    group: 'Client Communication', items: [
                      { key: 'notify_direct_message', label: 'Direct Message', desc: 'Notify on receiving an encrypted portal message.' },
                    ]
                  }
                ].map((group, gi) => (
                  <div key={gi} className="space-y-3 pt-2 first:pt-0">
                    <p className="text-[11px] font-800 text-slate-400 uppercase tracking-widest">{group.group}</p>
                    {group.items.map((item) => {
                      const isEnabled = settings[item.key] === 'true' || settings[item.key] === true;
                      return (
                        <div key={item.key} className="flex items-start justify-between gap-4 p-2.5 hover:bg-slate-50 rounded-xl transition-colors group">
                          <div>
                            <p className="text-[13px] font-700 text-slate-800">{item.label}</p>
                            <p className="text-[11px] text-slate-500">{item.desc}</p>
                          </div>
                          <div
                            onClick={() => updateSetting(item.key, !isEnabled ? 'true' : 'false')}
                            className={`w-10 h-5 rounded-full relative cursor-pointer transition-all duration-200 flex-shrink-0 ${isEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                              }`}
                          >
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 ${isEnabled ? 'left-[23px]' : 'left-1'
                              }`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </Card>

            <div className="space-y-6">
              <Card>
                <h3 className="text-base font-700 text-slate-900 mb-6 flex items-center gap-2">
                  <span className="text-xl">⚙️</span> System Alerts
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'notify_matter_deadlines', label: 'Matter Deadlines', desc: 'Reminders for court dates and filing requirements.' },
                    { key: 'notify_task_assignments', label: 'Task Assignments', desc: 'Notify when a new internal task is delegated.' },
                  ].map((item) => {
                    const isEnabled = settings[item.key] === 'true' || settings[item.key] === true;
                    return (
                      <div key={item.key} className="flex items-start justify-between gap-4 p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                        <div>
                          <p className="text-[13px] font-700 text-slate-800">{item.label}</p>
                          <p className="text-[11px] text-slate-500">{item.desc}</p>
                        </div>
                        <div
                          onClick={() => updateSetting(item.key, !isEnabled ? 'true' : 'false')}
                          className={`w-10 h-5 rounded-full relative cursor-pointer transition-all duration-200 flex-shrink-0 ${isEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}
                        >
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 ${isEnabled ? 'left-[23px]' : 'left-1'
                            }`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn btn-primary px-8"
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  TEMPLATE LIBRARY COMPONENT
// ─────────────────────────────────────────────────────────
export function TemplateLibrary({ targetMatterId, onSelect }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    api.drafts.list({ limit: 100 }).then(res => {
      if (cancelled) return;
      setTemplates(res.data || []);
      setLoading(false);
    }).catch(err => {
      if (cancelled) return;
      console.error(err);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const filtered = templates.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    (t.category || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Loading library...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          className="text-[13px] bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 w-full outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
          placeholder="Search templates by title or category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>

      <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
        {filtered.length > 0 ? filtered.map(t => (
          <div key={t.id} className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-primary-300 hover:shadow-md transition-all group flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[14px] font-700 text-slate-900 group-hover:text-primary-600 transition-colors">{t.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-800 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-widest">{t.category || 'General'}</span>
                <span className="text-[11px] text-slate-400">· from Matter #{t.matter_id}</span>
              </div>
            </div>
            <button
              onClick={() => {
                // We use the global openModal via window event or just call it if we have access.
                // In this architecture, it's easier to just call the parent-provided openModal.
                // But TemplateLibrary is rendered inside a Modal, so we need to trigger another modal.
                window.dispatchEvent(new CustomEvent('vktori:open-modal', {
                  detail: { type: 'use-template', data: { ...t, targetMatterId } }
                }));
              }}
              className="btn btn-primary btn-xs whitespace-nowrap"
            >
              Apply Template
            </button>
          </div>
        )) : (
          <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl">
            <p className="text-[13px] text-slate-400">No matching templates found in the library.</p>
          </div>
        )}
      </div>
    </div>
  );
}
export function SocialLinksSettings({ toast }) {
  const [links, setLinks] = useState([
    { platform: 'LinkedIn', url: '' },
    { platform: 'Instagram', url: '' },
    { platform: 'Facebook', url: '' },
    { platform: 'YouTube', url: '' }
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.marketing.getSocialLinks();
        if (res.success && res.data.length > 0) {
          // Merge with defaults to ensure all platforms are present
          const merged = links.map(d => {
            const found = res.data.find(r => r.platform === d.platform);
            return found ? { ...d, url: found.url || '' } : d;
          });
          setLinks(merged);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.marketing.updateSocialLinks(links);
      toast('Social links updated successfully!', 'success');
    } catch (e) {
      toast(e.message || 'Failed to update links', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateUrl = (platform, url) => {
    setLinks(prev => prev.map(l => l.platform === platform ? { ...l, url } : l));
  };

  if (loading) {
    return (
      <Card className="max-w-3xl">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-48 bg-slate-200 rounded" />
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-slate-50 rounded-2xl" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl">
      <h3 className="text-base font-700 text-slate-900 mb-6">Social Media Presence</h3>
      <p className="text-[13px] text-slate-500 mb-8 leading-relaxed">
        Configure the social media URLs for your firm's public website. If a URL is left empty, the corresponding icon will be disabled on the website.
      </p>
      
      <div className="space-y-6">
        {links.map(link => (
          <div key={link.platform} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {link.platform === 'LinkedIn' ? '💼' : link.platform === 'Instagram' ? '📸' : link.platform === 'Facebook' ? '👥' : '🎥'}
              </span>
              <span className="text-[14px] font-700 text-slate-700">{link.platform}</span>
            </div>
            <div className="md:col-span-3">
              <Input 
                placeholder={`https://${link.platform.toLowerCase()}.com/yourfirm`} 
                value={link.url} 
                onChange={e => updateUrl(link.platform, e.target.value)} 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-8 pt-4 border-t border-slate-100">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary px-8"
        >
          {saving ? 'Updating...' : 'Update Social Links'}
        </button>
      </div>
    </Card>
  );
}
