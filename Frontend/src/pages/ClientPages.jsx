import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, StatCard, PageHeader, Card, Table, Tr, Td, EmptyState, Avatar, Field, Input, Textarea } from '../components/UI.jsx';
import api from '../services/api';

const money = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(v) || 0);
const initials = (name) => (name || '').split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?';

export function ClientDashboard({ navigate }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ myMatters: 0, unpaidInvoices: 0, pendingSignatures: 0 });
  const [matters, setMatters] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const [dashRes, mattersRes] = await Promise.all([
          api.dashboard.client(),
          api.matters.list({ limit: 10 }),
        ]);
        if (cancelled) return;
        setStats(dashRes?.data?.counters || { myMatters: 0, unpaidInvoices: 0, pendingSignatures: 0 });
        setMatters(Array.isArray(mattersRes?.data) ? mattersRes.data : []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load dashboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="text-[13px] text-slate-500 p-4">Loading dashboard...</div>;
  if (error) return <Card className="border-red-200 bg-red-50/50"><p className="text-[13px] text-red-800 font-600">{error}</p></Card>;

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="My Dashboard" subtitle="Your matters, billing status, and signature items." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="My Matters" value={String(stats.myMatters || 0)} icon="📁" iconBg="bg-blue-50" gradient="linear-gradient(90deg,#0B1F3A,#C9A24A)" />
        <StatCard label="Unpaid Invoices" value={String(stats.unpaidInvoices || 0)} icon="💳" iconBg="bg-amber-50" gradient="linear-gradient(90deg,#f59e0b,#fbbf24)" />
        <StatCard label="Pending Signatures" value={String(stats.pendingSignatures || 0)} icon="✍️" iconBg="bg-emerald-50" gradient="linear-gradient(90deg,#10b981,#34d399)" />
        <StatCard label="Recent Matters" value={String(matters.length)} icon="📌" iconBg="bg-primary-50" gradient="linear-gradient(90deg,#2563eb,#60a5fa)" />
      </div>
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-600 text-slate-900">My Matters</h3>
          <button onClick={() => navigate('/client/matters')} className="text-[12px] text-primary-600 hover:underline">View all →</button>
        </div>
        <div className="space-y-2">
          {matters.slice(0, 5).map((m) => (
            <div key={m.id} className="group relative p-3 rounded-xl border border-slate-200 hover:border-primary-300 transition-all bg-white">
              <button onClick={() => navigate(`/client/matters/${m.id}`)} className="w-full text-left">
                <p className="text-[12px] font-mono text-primary-600">{m.matter_number}</p>
                <p className="text-[13px] font-700 text-slate-900">{m.title}</p>
                <p className="text-[11px] text-slate-500">{m.assigned_lawyer?.full_name || 'Unassigned'} · {m.matter_type || m.practice_area}</p>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/client/matters/${m.id}?tab=Messages`);
                }}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 btn btn-secondary btn-xs h-7 px-2 flex items-center gap-1.5 transition-all"
              >
                <span>💬</span> New Message
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function ClientCasesPage({ navigate }) {
  const [matters, setMatters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.matters.list({ limit: 500 });
        if (!cancelled) setMatters(Array.isArray(res?.data) ? res.data : []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load matters');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="text-[13px] text-slate-500 p-4">Loading matters...</div>;
  if (error) return <Card className="border-red-200 bg-red-50/50"><p className="text-[13px] text-red-800 font-600">{error}</p></Card>;

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="My Matters" subtitle="Track your active legal matters" />
      <Table headers={['Matter', 'Title', 'Lawyer', 'Type', 'Status', '']}>
        {matters.map((m) => (
          <Tr key={m.id}>
            <Td><span className="font-mono text-[12px] text-primary-600">{m.matter_number}</span></Td>
            <Td className="font-600">{m.title}</Td>
            <Td>{m.assigned_lawyer?.full_name || '—'}</Td>
            <Td>{m.matter_type || m.practice_area}</Td>
            <Td><Badge status={m.status} /></Td>
            <Td><button onClick={() => navigate(`/client/matters/${m.id}`)} className="btn btn-primary btn-xs">View</button></Td>
          </Tr>
        ))}
      </Table>
    </div>
  );
}

export function ClientDocumentsPage({ toast }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.documents.list({ limit: 500 });
        if (!cancelled) setDocs(Array.isArray(res?.data) ? res.data : []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load documents');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const downloadDocument = async (doc) => {
    try {
      const { blob, filename } = await api.documents.download(doc.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || doc.original_name || `document-${doc.id}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast(`${doc.original_name} download started`, 'success');
    } catch (e) {
      toast(e.message || 'Download failed', 'error');
    }
  };

  if (loading) return <div className="text-[13px] text-slate-500 p-4">Loading documents...</div>;
  if (error) return <Card className="border-red-200 bg-red-50/50"><p className="text-[13px] text-red-800 font-600">{error}</p></Card>;

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="My Documents" subtitle="Files shared by your legal team" />
      {!docs.length ? <EmptyState icon="📂" title="No documents yet" desc="Your legal team will share documents as your matter progresses." /> : (
        <Table headers={['Name', 'Matter', 'Category', 'Uploaded', '']}>
          {docs.map((d) => (
            <Tr key={d.id}>
              <Td>{d.original_name}</Td>
              <Td>{d.matter?.matter_number || '—'}</Td>
              <Td>{d.category || 'General'}</Td>
              <Td>{new Date(d.created_at).toLocaleDateString()}</Td>
              <Td><button onClick={() => downloadDocument(d)} className="btn btn-secondary btn-xs">Download</button></Td>
            </Tr>
          ))}
        </Table>
      )}
    </div>
  );
}

export function ClientBillingPage({ toast }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payingInvoiceId, setPayingInvoiceId] = useState(null);

  const loadInvoices = async () => {
    const res = await api.billing.listInvoices({ limit: 500 });
    setInvoices(Array.isArray(res?.data) ? res.data : []);
  };

  const loadBillingData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.billing.listInvoices({ limit: 500 });
      setInvoices(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setError(e.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBillingData();
    window.addEventListener('vktori:entities-changed', loadBillingData);
    return () => window.removeEventListener('vktori:entities-changed', loadBillingData);
  }, [loadBillingData]);

  const payInvoice = async (invoice) => {
    if (!invoice?.id) return;
    try {
      setPayingInvoiceId(invoice.id);
      await api.billing.payInvoice(invoice.id, {
        payment_method: 'manual',
        payment_reference: 'internal-manual',
      });
      await loadBillingData();
      toast('Payment marked as paid.', 'success');
    } catch (e) {
      toast(e.message || 'Payment failed', 'error');
    } finally {
      setPayingInvoiceId(null);
    }
  };

  const totals = useMemo(() => {
    const validInvoices = invoices.filter(i => i.status !== 'void');
    const due = validInvoices.reduce((s, i) => {
      const totalAmt = Number(i.amount) || 0;
      const paidAmt = i.paid_amount ?? (i.payments || []).reduce((sum, p) => sum + Number(p.amount), 0);
      return s + Math.max(0, totalAmt - paidAmt);
    }, 0);
    const paid = validInvoices.reduce((s, i) => {
      const paidAmt = i.paid_amount ?? (i.payments || []).reduce((sum, p) => sum + Number(p.amount), 0);
      return s + paidAmt;
    }, 0);
    return { due, paid };
  }, [invoices]);

  if (loading) return <div className="text-[13px] text-slate-500 p-4">Loading billing...</div>;
  if (error) return <Card className="border-red-200 bg-red-50/50"><p className="text-[13px] text-red-800 font-600">{error}</p></Card>;

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="My Billing" subtitle="View your invoices and payment status" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Total Due" value={money(totals.due)} icon="⏳" iconBg="bg-amber-50" gradient="linear-gradient(90deg,#f59e0b,#fbbf24)" />
        <StatCard label="Invoices" value={String(invoices.length)} icon="📋" iconBg="bg-blue-50" gradient="linear-gradient(90deg,#0B1F3A,#C9A24A)" />
        <StatCard label="Total Paid" value={money(totals.paid)} icon="✅" iconBg="bg-emerald-50" gradient="linear-gradient(90deg,#10b981,#34d399)" />
      </div>
      <Table headers={['Invoice', 'Matter', 'Amount', 'Due Date', 'Status', '']}>
        {invoices.map((inv) => (
          <Tr key={inv.id}>
            <Td><span className="font-mono text-[12px]">{inv.invoice_number}</span></Td>
            <Td>{inv.matter?.matter_number || '—'}</Td>
            <Td>
              <div className="font-700">{money(inv.amount)}</div>
              {inv.paid_amount > 0 && <div className="text-[10px] text-emerald-600 font-600">Paid: {money(inv.paid_amount)}</div>}
              {inv.due_amount > 0 && <div className="text-[10px] text-red-500 font-600">Due: {money(inv.due_amount)}</div>}
            </Td>
            <Td>{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '—'}</Td>
            <Td><Badge status={inv.status} /></Td>
            <Td>
              {inv.status === 'paid'
                ? <button onClick={async () => {
                  try {
                    const { blob, filename } = await api.billing.downloadInvoicePdf(inv.id);
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename || `Receipt-${inv.invoice_number}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                    toast('Receipt downloaded', 'success');
                  } catch (e) {
                    toast(e.message || 'Download failed', 'error');
                  }
                }} className="btn btn-secondary btn-xs">Receipt</button>
                : <button onClick={() => payInvoice(inv)} disabled={payingInvoiceId === inv.id} className="btn btn-primary btn-xs">{payingInvoiceId === inv.id ? 'Processing...' : 'Pay'}</button>}
            </Td>
          </Tr>
        ))}
      </Table>
    </div>
  );
}

export function ClientMessagesPage({ toast }) {
  const [items, setItems] = useState([]);
  const [matters, setMatters] = useState([]);
  const [matterId, setMatterId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    const [mattersRes, commRes] = await Promise.all([
      api.matters.list({ limit: 500 }),
      api.communications.list({ limit: 500, visibility: 'client_visible' }),
    ]);
    const m = Array.isArray(mattersRes?.data) ? mattersRes.data : [];
    const c = Array.isArray(commRes?.data) ? commRes.data : [];
    setMatters(m);
    setItems(c);
    if (!matterId && m[0]?.id) setMatterId(String(m[0].id));
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        await load();
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load messages');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (matterId) {
      api.communications.markMatterRead(matterId)
        .then(() => {
          window.dispatchEvent(new Event('vktori:entities-changed'));
        })
        .catch(() => {});
    }
  }, [matterId]);

  const send = async () => {
    if (!matterId || !message.trim()) return;
    try {
      await api.communications.create({
        matter_id: Number(matterId),
        message_body: message.trim(),
        communication_type: 'portal_message',
        visibility: 'client_visible',
      });
      setMessage('');
      await load();
      toast('Message sent', 'success');
      window.dispatchEvent(new CustomEvent('vktori:entities-changed'));
    } catch (e) {
      toast(e.message || 'Send failed', 'error');
    }
  };

  if (loading) return <div className="text-[13px] text-slate-500 p-4">Loading messages...</div>;
  if (error) return <Card className="border-red-200 bg-red-50/50"><p className="text-[13px] text-red-800 font-600">{error}</p></Card>;

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="Messages" subtitle="Communicate with your legal team" />
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <Field label="Matter">
            <select className="form-input" value={matterId} onChange={(e) => setMatterId(e.target.value)}>
              {matters.map((m) => <option key={m.id} value={m.id}>{m.matter_number} — {m.title}</option>)}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Message">
              <div className="flex gap-2">
                <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message..." />
                <button onClick={send} className="btn btn-primary">Send</button>
              </div>
            </Field>
          </div>
        </div>
        <Table headers={['When', 'Matter', 'From', 'Message']}>
          {items.map((c) => (
            <Tr key={c.id}>
              <Td>{new Date(c.created_at).toLocaleString()}</Td>
              <Td>{matters.find((m) => m.id === c.matter_id)?.matter_number || c.matter_id}</Td>
              <Td>{c.sender?.full_name || c.sender_role}</Td>
              <Td className="max-w-[420px] truncate">{c.message_body}</Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

export function ClientProfilePage({ toast }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [client, setClient] = useState(null);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', notes: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.clients.list({ limit: 1 });
        const c = Array.isArray(res?.data) ? res.data[0] : null;
        if (!cancelled) {
          setClient(c || null);
          setForm({
            full_name: c?.full_name || '',
            email: c?.email || '',
            phone: c?.phone || '',
            notes: c?.notes || '',
          });
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load profile');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const save = async () => {
    if (!client?.id) return;
    try {
      await api.clients.update(client.id, form);
      toast('Profile saved', 'success');
    } catch (e) {
      toast(e.message || 'Save failed', 'error');
    }
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast('Please fill in all password fields', 'error');
    }
    if (newPassword !== confirmPassword) {
      return toast('New passwords do not match', 'error');
    }
    if (newPassword.length < 4) {
      return toast('New password must be at least 4 characters long', 'error');
    }

    try {
      setUpdatingPassword(true);
      await api.auth.changePassword({ currentPassword, newPassword });
      toast('Password updated successfully', 'success');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      toast(e.message || 'Failed to update password', 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) return <div className="text-[13px] text-slate-500 p-4">Loading profile...</div>;
  if (error) return <Card className="border-red-200 bg-red-50/50"><p className="text-[13px] text-red-800 font-600">{error}</p></Card>;

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="My Profile" subtitle="Manage your personal information" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="text-center h-fit">
          <Avatar initials={initials(form.full_name)} size="xl" color="linear-gradient(135deg,#10b981,#059669)" />
          <h3 className="text-[16px] font-700 text-slate-900 mt-3">{form.full_name || 'Client'}</h3>
          <p className="text-[12px] text-slate-400 mb-2">{client?.id ? `C${String(client.id).padStart(3, '0')}` : '—'}</p>
          <Badge status={client?.is_portal_enabled ? 'active' : 'pending'} />
        </Card>
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <h3 className="text-[14px] font-600 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <Field label="Full Name"><Input value={form.full_name} onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))} /></Field>
              <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} /></Field>
              <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} /></Field>
            </div>
            <Field label="Notes"><Textarea rows={3} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} /></Field>
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={save} className="btn btn-primary">Save Changes</button>
            </div>
          </Card>

          <Card>
            <h3 className="text-[14px] font-600 mb-4">Security & Password</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <Field label="Current Password"><Input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))} /></Field>
              <div className="hidden sm:block"></div>
              <Field label="New Password"><Input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))} /></Field>
              <Field label="Confirm New Password"><Input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))} /></Field>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={handleChangePassword} disabled={updatingPassword} className="btn btn-secondary">{updatingPassword ? 'Updating...' : 'Change Password'}</button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
