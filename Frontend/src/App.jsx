import { useState, useRef, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Outlet, useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import { VyniusAI } from './components/VyniusAI.jsx';
import { useToast, ToastContainer, Modal, Field, Input, Select, Textarea } from './components/UI.jsx';
import logoImg from './assets/WhatsApp Image 2026-04-13 at 11.01.36 AM-Photoroom.png';
import api from './services/api';

// Admin Pages
import { AdminDashboard, ClientsPage, ClientDetailPage, CasesPage, CaseDetailPage, CalendarPage, DocumentsPage, BillingPage, EmailPage, AIPage, UsersPage, SettingsPage, TemplateLibrary } from './pages/AdminPages.jsx';

// Lawyer Pages
import { LawyerDashboard, LawyerCasesPage, LawyerClientsPage, LawyerProfilePage } from './pages/LawyerPages.jsx';

// Lead & Marketing Pages
import { LeadDashboard, LeadDetailPage, ConflictCheckPage } from './pages/LeadPages.jsx';
import { MarketingDashboard, ReportsDashboard } from './pages/MarketingPages.jsx';

// Client Pages
import { ClientDashboard, ClientCasesPage, ClientDocumentsPage, ClientBillingPage, ClientMessagesPage, ClientProfilePage } from './pages/ClientPages.jsx';

// ─────────────────────────────────────────────────────────
//  LOGIN SCREEN
// ─────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('admin@vktori.com');
  const [pass, setPass] = useState('1234');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const roleMap = {
    admin: { email: 'admin@vktori.com', password: '1234', label: 'Admin', color: 'bg-accent-600', desc: 'Full system access' },
    lawyer: { email: 'lawyer@vktori.com', password: '1234', label: 'Lawyer', color: 'bg-blue-600', desc: 'Case & client management' },
    client: { email: 'client@vktori.com', password: '1234', label: 'Client', color: 'bg-emerald-600', desc: 'View your cases' },
  };

  const handleRoleSelect = (r) => {
    setRole(r);
    setEmail(roleMap[r].email);
    setPass(roleMap[r].password);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await api.auth.login({ email, password: pass });
      const payload = response?.data;
      const user = payload?.user ?? response?.user;
      const token = payload?.token ?? response?.token;
      if (!user || !token) {
        throw new Error('Invalid login response from server.');
      }
      onLogin(user, token);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}

        {/* Login Card */}
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-10 shadow-3xl relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-600/10 rounded-full blur-3xl group-hover:bg-primary-600/20 transition-all duration-1000" />

          <div className="text-center mb-12 relative z-10">
            <div className="flex flex-col items-center justify-center gap-4">
              <img src={logoImg} alt="Victoria Tulsidas Law" className="h-28 w-auto object-contain mb-2 filter drop-shadow-2xl" />
              <div className="text-center">
                <h1 className="text-white font-display font-800 text-4xl tracking-tighter leading-none mb-2">Victoria Tulsidas Law</h1>
                <p className="text-primary-400 text-[11px] font-900 uppercase tracking-[0.3em] leading-none">A Professional Legal Corporation</p>
              </div>
            </div>
          </div>

          {/* Role Selector */}
          <div className="bg-white/5 rounded-xl p-1 flex mb-6 overflow-x-auto no-scrollbar">
            {Object.entries(roleMap).map(([key, info]) => (
              <button key={key} onClick={() => handleRoleSelect(key)}
                className={`flex-1 py-2 px-3 rounded-lg text-[12px] font-600 transition-all duration-200 ${role === key
                  ? `${info.color} text-white shadow-lg`
                  : 'text-slate-400 hover:text-white'}`}>
                {info.label}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-[12px] text-center">
              {errorMsg}
            </div>
          )}

          {/* Role Description */}

          {/* Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-[12px] font-500 text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <input value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-white text-[13px] outline-none placeholder:text-slate-500 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium"
                  placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-500 text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                <input type="password" value={pass} onChange={e => setPass(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-white text-[13px] outline-none placeholder:text-slate-500 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium"
                  placeholder="••••••••" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-[12px] text-slate-400 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                Remember me
              </label>
              <button className="text-[12px] text-primary-400 hover:text-primary-300 transition-colors">Forgot password?</button>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={isLoading}
            className="w-full py-3 sm:py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-600 rounded-xl text-[14px] hover:from-primary-700 hover:to-primary-600 transition-all duration-200 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Signing In...' : 'Sign In →'}
          </button>
        </div>

        <p className="text-center text-[11px] text-slate-600 mt-6">
          © 2025 Victoria Tulsidas Law · www.VictoriaTulsidasLaw.com
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  MODAL → API (default submit when page does not pass onSave)
// ─────────────────────────────────────────────────────────
async function defaultModalSubmit(type, modalData, values, { role, user, toast, navigate }) {
  const uid = user?.id;
  const dispatchRefresh = () => window.dispatchEvent(new CustomEvent('vktori:entities-changed'));

  switch (type) {
    case 'add-client': {
      if (!uid) throw new Error('Not signed in.');
      const full_name = `${values.firstName || ''} ${values.lastName || ''}`.trim();
      await api.clients.create({
        full_name,
        email: values.email,
        phone: values.phone || null,
        notes: values.notes || null,
      });
      toast('Client added successfully!', 'success');
      dispatchRefresh();
      break;
    }
    case 'edit-client': {
      const id = modalData?.id ?? modalData?.raw?.id;
      if (!id) throw new Error('Missing client.');
      const full_name = `${values.firstName || ''} ${values.lastName || ''}`.trim();
      const st = (values.status || 'active').toLowerCase();
      const is_portal_enabled = st === 'active';
      await api.clients.update(id, {
        full_name,
        email: values.email,
        phone: values.phone || null,
        notes: values.notes || null,
        is_portal_enabled,
      });
      toast('Client updated successfully!', 'success');
      dispatchRefresh();
      break;
    }
    case 'add-case': {
      if (!uid) throw new Error('Not signed in.');
      const client_id = parseInt(values.clientId, 10);
      if (!Number.isFinite(client_id)) throw new Error('Select a client.');
      let assigned_lawyer_id = values.lawyerId ? parseInt(values.lawyerId, 10) : null;
      if (role === 'lawyer' && !Number.isFinite(assigned_lawyer_id)) assigned_lawyer_id = uid;
      if (!Number.isFinite(assigned_lawyer_id)) assigned_lawyer_id = null;
      const practice = values.matterType || values.type || 'General';
      const filed = values.filed || values.openedAt;
      await api.matters.create({
        title: values.title,
        client_id,
        assigned_lawyer_id,
        practice_area: practice,
        matter_type: practice,
        opposing_party_name: values.opposingParty || null,
        description: values.description || null,
        opened_at: filed ? new Date(filed).toISOString() : null,
        status: 'pending',
        created_by_user_id: uid,
      });
      toast('Matter created!', 'success');
      dispatchRefresh();
      if (role === 'admin') navigate('/admin/matters');
      else if (role === 'lawyer') navigate('/lawyer/matters');
      break;
    }
    case 'create-invoice': {
      if (!uid) throw new Error('Not signed in.');
      const matter_id = parseInt(String(values.matterId || modalData?.matterId || ''), 10);
      if (!Number.isFinite(matter_id)) throw new Error('Select a matter.');
      const invNum = `INV-${Date.now()}`;
      await api.billing.createInvoice({
        matter_id,
        invoice_number: invNum,
        description: values.description || null,
        amount: values.amount,
        due_date: values.dueDate ? new Date(values.dueDate).toISOString() : null,
        status: 'draft',
        created_by_user_id: uid,
      });
      toast('Invoice created!', 'success');
      dispatchRefresh();
      break;
    }
    case 'trust-deposit': {
      if (!uid) throw new Error('Not signed in.');
      await api.billing.depositTrust({
        client_id: values.client_id,
        matter_id: values.matter_id || null,
        amount: values.amount,
        reference: values.reference,
        notes: values.notes,
      });
      toast('Trust deposit recorded!', 'success');
      dispatchRefresh();
      break;
    }
    case 'apply-trust': {
      if (!uid) throw new Error('Not signed in.');
      await api.billing.applyTrustToInvoice({
        trust_account_id: values.trust_account_id,
        invoice_id: values.invoice_id,
        amount: values.amount,
      });
      toast('Funds applied successfully!', 'success');
      dispatchRefresh();
      break;
    }
    case 'add-document': {
      if (!uid) throw new Error('Not signed in.');
      const matter_id = parseInt(String(values.matterId || modalData?.matterId || ''), 10);
      if (!Number.isFinite(matter_id)) throw new Error('Select a matter.');
      const fileObj = values.file instanceof File && values.file.size > 0 ? values.file : null;
      if (!fileObj) throw new Error('Please select a file to upload.');
      const original_name = (fileObj.name || values.originalName || '').trim();
      const form = new FormData();
      form.append('matter_id', String(matter_id));
      form.append('uploaded_by_user_id', String(uid));
      form.append('original_name', original_name);
      form.append('category', values.docCategory || values.category || 'General');
      form.append('visibility', role === 'lawyer' ? 'client_shared' : role === 'client' ? 'client_visible' : 'internal');
      if (fileObj) form.append('file', fileObj);
      await api.documents.create(form);
      toast('Document record created!', 'success');
      dispatchRefresh();
      break;
    }
    case 'edit-case': {
      if (!uid) throw new Error('Not signed in.');
      const matterId = modalData?.numericId ?? modalData?.matterId;
      const idInt = parseInt(String(matterId), 10);
      if (!Number.isFinite(idInt)) throw new Error('Missing matter.');
      let apiStatus = (values.status || 'active').toLowerCase();
      if (apiStatus === 'closed') apiStatus = 'completed';
      const practice = values.type || modalData?.type || 'General';
      await api.matters.update(idInt, {
        title: values.title,
        status: apiStatus,
        matter_type: practice,
        practice_area: practice,
        next_hearing: values.nextHearing || null,
        updated_by_user_id: uid,
      });
      toast('Matter updated successfully!', 'success');
      dispatchRefresh();
      break;
    }
    case 'compose-email': {
      if (!uid) throw new Error('Not signed in.');
      const mid = values.matterId || modalData?.matterId;
      if (!mid) throw new Error('Select a related matter, or open a matter and use Send Email from that workspace.');
      const visibility = values.visibility === 'Shared' || values.visibility === 'client_shared' ? 'client_shared' : 'internal';
      await api.communications.create({
        matter_id: parseInt(String(mid), 10),
        communication_type: 'email_log',
        visibility,
        message_body: `To: ${values.to || ''}\nSubject: ${values.subject || ''}\n\n${values.message || ''}`,
      });
      toast('Email record logged on matter.', 'success');
      dispatchRefresh();
      break;
    }
    case 'add-note': {
      if (!uid) throw new Error('Not signed in.');
      const mid = values.matterId || modalData?.matterId;
      if (!mid) throw new Error('Open a matter to add notes.');
      const visibility = values.visibility === 'Shared' || values.visibility === 'client_shared' ? 'client_shared' : 'internal';
      await api.communications.create({
        matter_id: parseInt(String(mid), 10),
        communication_type: 'note',
        visibility,
        message_body: `${values.title || 'Note'}\n\n${values.content || ''}`,
      });
      toast('Matter note added successfully!', 'success');
      dispatchRefresh();
      break;
    }
    case 'log-call': {
      if (!uid) throw new Error('Not signed in.');
      const mid = values.matterId || modalData?.matterId;
      if (!mid) throw new Error('Open a matter to log a call.');
      const map = { Call: 'call_log', Meeting: 'meeting_log', Video: 'call_log' };
      const communication_type = map[values.type] || 'call_log';
      const visibility = values.visibility === 'Shared' || values.visibility === 'client_shared' ? 'client_shared' : 'internal';
      await api.communications.create({
        matter_id: parseInt(String(mid), 10),
        communication_type,
        visibility,
        message_body: `[${values.direction || ''}] ${values.subject || ''}\n\n${values.notes || ''}`,
      });
      toast('Communication logged successfully!', 'success');
      dispatchRefresh();
      break;
    }
    case 'add-event': {
      if (!uid) throw new Error('Not signed in.');
      await api.calendar.create({
        title: values.title || 'Event',
        date: values.date || new Date().toISOString().split('T')[0],
        time: values.time || null,
        matter_id: values.matterId || null,
        type: (values.eventType || 'meeting').toLowerCase(),
        description: values.notes || null
      });
      toast('Event added to calendar!', 'success');
      dispatchRefresh();
      break;
    }
    case 'add-folder': {
      if (!uid) throw new Error('Not signed in.');
      await api.folders.create({
        name: values.name,
        matterId: values.matterId || null,
        accessLevel: values.accessLevel || 'Public'
      });
      toast('Folder created successfully!', 'success');
      dispatchRefresh();
      break;
    }
    case 'add-user': {
      if (!uid) throw new Error('Not signed in.');
      const fullName = `${values.firstName || ''} ${values.lastName || ''}`.trim();
      const role = String(values.roleLabel || '').toLowerCase();

      if (role === 'client') {
        // Create Client (this backend service already creates a User with 'client' role)
        await api.clients.create({
          full_name: fullName,
          email: values.email,
          phone: values.phone || null,
        });
        toast(`Client account created for ${fullName}`, 'success');
      } else {
        // Create Staff User (Admin/Lawyer)
        await api.users.create({
          full_name: fullName,
          email: values.email,
          role: role,
          password: '1234', // System default
          practice_focus: values.specialty || null,
        });
        toast(`${values.roleLabel} account created for ${fullName}`, 'success');
      }
      dispatchRefresh();
      break;
    }
    case 'add-task': {
      toast('Task lists are not stored in the database yet.', 'info');
      break;
    }
    case 'use-template': {
      if (!uid) throw new Error('Not signed in.');
      const templateId = modalData?.id;
      if (!templateId) throw new Error('Missing template.');

      // Fetch full template content
      const { data: template } = await api.drafts.get(templateId);

      // Use targetMatterId if provided (from the matter detail page), otherwise default to template's matter
      const targetMatterId = modalData.targetMatterId || template.matter_id;

      await api.drafts.create({
        matter_id: Number(targetMatterId),
        title: values.title || `New Draft from ${template.title}`,
        category: template.category,
        content: template.content,
        created_by_user_id: uid,
      });

      toast('New draft created from template!', 'success');
      dispatchRefresh();
      break;
    }
    case 'conflict-check': {
      if (!uid) throw new Error('Not signed in.');
      const res = await api.conflicts.check({
        prospective_client_name: values.prospectiveClient,
        opposing_party_name: values.opposingParty,
      });
      if (res.data?.conflict) {
        toast(`⚠️ Conflict found! ${res.data.matches.length} potential matches detected.`, 'error');
      } else {
        toast('✅ No conflict found. Safe to proceed.', 'success');
      }
      break;
    }
    case 'browse-templates': {
      // This is a selection modal, handled by onSave in AdminPages if needed, 
      // but here we just need it to be a valid case for the switch.
      break;
    }
    case 'view-invoice':
      break;
    case 'pay-invoice': {
      const dbId = modalData?.dbId;
      if (dbId) {
        await api.billing.payInvoice(dbId, {
          payment_method: 'manual',
          payment_reference: values.payment_reference || 'internal-manual',
        });
        toast('Payment marked as paid.', 'success');
        dispatchRefresh();
      } else {
        toast('This invoice is not linked to a database record.', 'info');
      }
      break;
    }
    default:
      toast('This action is not wired to the API yet.', 'info');
  }
}

function ViewInvoicePdfEmbed({ dbId, toast }) {
  const [src, setSrc] = useState(null);
  const [loadErr, setLoadErr] = useState(null);
  const urlRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!dbId) {
      setSrc(null);
      setLoadErr(null);
      return undefined;
    }
    let cancelled = false;
    setSrc(null);
    setLoadErr(null);
    (async () => {
      try {
        const { blob } = await api.billing.downloadInvoicePdf(dbId);
        if (cancelled) return;
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        const u = URL.createObjectURL(blob);
        urlRef.current = u;
        setSrc(u);
      } catch (e) {
        if (!cancelled) {
          const msg = e.message || 'Failed to load PDF';
          setLoadErr(msg);
          toast(msg, 'error');
        }
      }
    })();
    return () => {
      cancelled = true;
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbId]);

  const handlePrint = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    }
  };

  const handleDownload = async () => {
    try {
      const { blob, filename } = await api.billing.downloadInvoicePdf(dbId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      toast('Failed to download invoice', 'error');
    }
  };

  if (!dbId) return null;
  if (loadErr) return <p className="text-[12px] text-red-600 mt-3">{loadErr}</p>;
  if (!src) return <p className="text-[12px] text-slate-500 mt-3">Loading PDF…</p>;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[13px] font-700 text-slate-900">Live Preview</h4>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-[12px] font-600 hover:bg-slate-50 transition-all shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" /></svg>
            Print
          </button>
          <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 text-white text-[12px] font-600 hover:bg-primary-700 transition-all shadow-sm shadow-primary-500/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            Download
          </button>
        </div>
      </div>
      <div className="rounded-xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/50 bg-slate-100 p-2 sm:p-4">
        <iframe ref={iframeRef} title="Invoice PDF" src={src} className="w-full h-[min(540px,65vh)] bg-white rounded-lg shadow-inner ring-1 ring-slate-900/5" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  MODAL SYSTEM
// ─────────────────────────────────────────────────────────
function AppModal({ type, data, onClose, toast, onSave, navigate, role, user, lookups, openModal }) {
  const [isValid, setIsValid] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formState, setFormState] = useState({});
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) setIsValid(formRef.current.checkValidity());
  }, [type, data]);

  const handleChange = () => {
    if (formRef.current) {
      setIsValid(formRef.current.checkValidity());
      const fd = new FormData(formRef.current);
      setFormState(Object.fromEntries(fd.entries()));
    }
  };

  const clientRows = lookups?.clients?.length ? lookups.clients : [];
  const matterRows = lookups?.matters?.length ? lookups.matters : [];
  const lawyerRows = lookups?.lawyers?.length ? lookups.lawyers : [];

  if (!type) return null;

  const modals = {
    'add-task': {
      title: 'Add New Task', wide: false,
      body: <>
        <div className="mb-3"><Field label="Task Title" required><Input name="title" placeholder="E.g., Prepare evidence summary" required /></Field></div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Priority" required><Select name="priority" required><option>Medium</option><option>High</option><option>Low</option></Select></Field>
          <Field label="Due Date" required><Input name="dueDate" type="date" required /></Field>
        </div>
        <div className="mb-3">
          <Field label="Assigned To" required>
            <Select name="assignedTo" required>
              <option value="">Select lawyer...</option>
              {lawyerRows.map((u) => <option key={u.id} value={u.full_name}>{u.full_name}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Description"><Textarea name="description" rows={3} placeholder="Describe the task details..." /></Field>
      </>,
      onSave: () => toast('Task created successfully!', 'success'),
    },
    'add-client': {
      title: 'Add New Client', wide: false,
      body: <>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="First Name" required><Input name="firstName" placeholder="John" required /></Field>
          <Field label="Last Name" required><Input name="lastName" placeholder="Doe" required /></Field>
        </div>
        <div className="mb-3"><Field label="Email Address" required><Input name="email" type="email" placeholder="john@example.com" required /></Field></div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Phone"><Input name="phone" placeholder="+1 (555) 000-0000" /></Field>
          <Field label="Client Type"><Select name="type"><option>Individual</option><option>Corporate</option></Select></Field>
        </div>
        <div className="mb-3"><Field label="Matter Type"><Select name="caseType"><option>Civil Litigation</option><option>Family Law</option><option>Corporate</option><option>Real Estate</option><option>Employment</option></Select></Field></div>
        <Field label="Notes"><Textarea name="notes" rows={3} placeholder="Initial notes..." /></Field>
      </>,
      onSave: () => toast('Client added successfully!', 'success'),
    },
    'edit-client': {
      title: data ? `Edit Client: ${data.full_name || data.name || ''}` : 'Edit Client', wide: false,
      body: <>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="First Name" required><Input name="firstName" defaultValue={data?.full_name ? data.full_name.split(' ')[0] : (data?.name ? data.name.split(' ')[0] : '')} required /></Field>
          <Field label="Last Name" required><Input name="lastName" defaultValue={data?.full_name ? data.full_name.split(' ').slice(1).join(' ') : (data?.name ? data.name.split(' ').slice(1).join(' ') : '')} required /></Field>
        </div>
        <div className="mb-3"><Field label="Email Address" required><Input name="email" type="email" defaultValue={data ? data.email : ''} required /></Field></div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Phone"><Input name="phone" defaultValue={data ? data.phone : ''} /></Field>
          <Field label="Status">
            <Select name="status" defaultValue={data ? (data.status === 'pending' ? 'pending' : data.is_portal_enabled === false ? 'inactive' : 'active') : 'active'}>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </Select>
          </Field>
        </div>
        <Field label="Notes"><Textarea name="notes" rows={3} defaultValue={data?.notes || ''} /></Field>
      </>,
      onSave: () => toast('Client updated successfully!', 'success'),
    },
    'add-case': {
      title: 'Create New Matter', wide: true,
      body: <>
        <div className="mb-3"><Field label="Matter Title" required><Input name="title" placeholder="Plaintiff vs. Defendant" required /></Field></div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Client" required><Select name="clientId" required><option value="">Select client...</option>{clientRows.map((c) => <option key={c.id} value={c.id}>{c.full_name || c.name}</option>)}</Select></Field>
          <Field label="Assigned Lawyer"><Select name="lawyerId"><option value="">Unassigned</option>{lawyerRows.map((u) => <option key={u.id} value={u.id}>{u.full_name}</option>)}</Select></Field>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Case Type"><Select name="matterType"><option>Civil Litigation</option><option>Family Law</option><option>Corporate</option><option>Real Estate</option><option>Employment</option><option>Intellectual Property</option></Select></Field>
          <Field label="Priority"><Select name="priority"><option>High</option><option>Medium</option><option>Low</option></Select></Field>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Filing Date"><Input name="filed" type="date" /></Field>
          <Field label="Opposing party"><Input name="opposingParty" placeholder="Opponent name" /></Field>
        </div>
        <Field label="Case Description"><Textarea name="description" rows={3} placeholder="Brief description of the case..." /></Field>
      </>,
      onSave: () => toast('Case created!', 'success'),
    },
    'compose-email': {
      title: 'Compose Email', wide: false,
      body: <>
        {(matterRows.length > 0 || data?.matterId) && (
          <div className="mb-3">
            {matterRows.length > 0 ? (
              <Field label="Related matter" required>
                <Select name="matterId" required defaultValue={data?.matterId || ''}>
                  <option value="">Select matter...</option>
                  {matterRows.map((m) => <option key={m.id} value={m.id}>{m.matter_number} — {m.title}</option>)}
                </Select>
              </Field>
            ) : (
              <input type="hidden" name="matterId" value={data.matterId} />
            )}
          </div>
        )}
        <div className="mb-3"><Field label="To" required><Input name="to" type="email" placeholder="recipient@example.com" required /></Field></div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Subject" required><Input name="subject" placeholder="Email subject..." required /></Field>
          <Field label="Visibility" required>
            <Select name="visibility" defaultValue="Shared" required>
              <option value="Shared">Shared (Client & Firm)</option>
              <option value="Internal">Internal (Firm Only)</option>
            </Select>
          </Field>
        </div>
        <Field label="Message" required><Textarea name="message" rows={5} placeholder="Write your message..." required /></Field>
        <div className="flex items-center gap-2 mt-2">
          <button className="btn btn-secondary btn-xs">📎 Attach</button>
          <span className="text-[11px] text-slate-400">Max 25MB per file</span>
        </div>
      </>,
      onSave: () => toast('Email sent!', 'success'),
    },
    'create-invoice': {
      title: 'Create Invoice', wide: false,
      body: <>
        <div className="mb-3"><Field label="Matter" required><Select name="matterId" required defaultValue={data?.matterId || ''}><option value="">Select matter...</option>{matterRows.map((m) => <option key={m.id} value={m.id}>{m.matter_number} — {m.title}</option>)}</Select></Field></div>
        <div className="mb-3"><Field label="Description" required><Textarea name="description" rows={2} placeholder="Services rendered..." required /></Field></div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount ($)" required><Input name="amount" type="number" min="0" step="0.01" placeholder="0.00" required /></Field>
          <Field label="Due Date" required><Input name="dueDate" type="date" required /></Field>
        </div>
      </>,
      onSave: () => toast('Invoice created!', 'success'),
    },
    'trust-deposit': {
      title: 'Record Trust Deposit', wide: false,
      body: <>
        <div className="mb-3">
          <Field label="Client" required>
            <Select name="client_id" required>
              <option value="">Select client...</option>
              {clientRows.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </Select>
          </Field>
        </div>
        <div className="mb-3">
          <Field label="Related Matter (Optional)">
            <Select name="matter_id">
              <option value="">None</option>
              {matterRows.map(m => <option key={m.id} value={m.id}>{m.matter_number} — {m.title}</option>)}
            </Select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Deposit Amount ($)" required>
            <Input name="amount" type="number" step="0.01" min="0.01" placeholder="0.00" required />
          </Field>
          <Field label="Date">
            <Input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
          </Field>
        </div>
        <div className="mb-3"><Field label="Reference"><Input name="reference" placeholder="Check #, Wire ID, etc." /></Field></div>
        <Field label="Notes"><Textarea name="notes" rows={2} placeholder="Additional details..." /></Field>
      </>,
      onSave: () => toast('Trust deposit recorded!', 'success'),
    },
    'apply-trust': {
      title: 'Apply Trust to Invoice', wide: false,
      body: <>
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 mb-6">
          <p className="text-[11px] font-900 text-emerald-600 uppercase tracking-widest mb-1">Available Trust Balance</p>
          <p className="text-[24px] font-900 text-slate-900 tracking-tighter">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(data?.balance) || 0)}
          </p>
        </div>
        <input type="hidden" name="trust_account_id" value={data?.id} />
        <div className="mb-3">
          <Field label="Select Unpaid Invoice" required>
            <Select name="invoice_id" required>
              <option value="">Select invoice...</option>
              {lookups?.invoices?.filter(inv => (inv.status !== 'paid' && inv.status !== 'void') && (inv.due_amount > 0)).map(inv => (
                <option key={inv.id} value={inv.id}>{inv.invoice_number} — {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(inv.due_amount))} (Remaining)</option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Amount to Apply ($)" required>
          <Input name="amount" type="number" step="0.01" min="0.01" max={Number(data?.balance)} placeholder="0.00" required />
        </Field>
      </>,
      onSave: () => toast('Funds applied to invoice!', 'success'),
    },
    'trust-ledger': {
      title: data ? `Trust Ledger: ${data.client?.full_name}` : 'Trust Ledger', wide: true,
      body: <TrustLedgerView accountId={data?.id} formatUsd={billFormatUsd} />,
      onSave: () => { },
    },
    'add-document': {
      title: 'Upload Document', wide: false,
      body: <>
        <p className="text-[12px] text-slate-500 mb-3">VkTori records document metadata. Store files on your document server and paste the display name below.</p>
        <div className="mb-3">
          <Field label="Attach File">
            <input name="file" type="file" className="form-input" />
          </Field>
        </div>
        <div className="mb-3"><Field label="File name" required><Input name="originalName" placeholder="e.g. Complaint.pdf" required /></Field></div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Related Matter" required><Select name="matterId" required defaultValue={data?.matterId || ''}><option value="">Select matter...</option>{matterRows.map((m) => <option key={m.id} value={m.id}>{m.matter_number}</option>)}</Select></Field>
          <Field label="Document Type"><Select name="docCategory">{['Complaint', 'Evidence', 'Contract', 'Court Order', 'Other', ...(lookups?.folders || []).map(f => f.name)].map(opt => <option key={opt}>{opt}</option>)}</Select></Field>
        </div>
      </>,
      onSave: () => toast('Document uploaded!', 'success'),
    },
    'add-folder': {
      title: 'Create New Folder', wide: false,
      body: <>
        <div className="mb-3"><Field label="Folder Name" required><Input name="name" placeholder="E.g., Financial Records" required /></Field></div>
        <Field label="Related Matter"><Select name="matterId"><option value="">None</option>{matterRows.map((m) => <option key={m.id} value={m.id}>{m.matter_number}</option>)}</Select></Field>
        <div className="mt-3"><Field label="Access Level"><Select name="accessLevel"><option value="Public">Public (All team)</option><option value="Private">Private (Only you)</option></Select></Field></div>
      </>,
      onSave: () => toast('Folder created successfully!', 'success'),
    },
    'add-event': {
      title: 'Add Calendar Event', wide: false,
      body: <>
        <div className="mb-3"><Field label="Event Title"><Input name="title" placeholder="Hearing, Meeting, Deadline..." /></Field></div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Date"><Input name="date" type="date" /></Field>
          <Field label="Time"><Input name="time" type="time" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Event Type"><Select name="eventType"><option>Hearing</option><option>Deadline</option><option>Meeting</option><option>Consultation</option></Select></Field>
          <Field label="Related Matter"><Select name="matterId" defaultValue={data?.matterId || ''}><option value="">None</option>{matterRows.map((m) => <option key={m.id} value={m.id}>{m.matter_number}</option>)}</Select></Field>
        </div>
        <Field label="Notes"><Textarea name="notes" rows={2} placeholder="Additional details..." /></Field>
      </>,
      onSave: () => toast('Event added to calendar!', 'success'),
    },
    'add-user': {
      title: 'Add New User', wide: false,
      body: <>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="First Name" required><Input name="firstName" placeholder="Jane" required /></Field>
          <Field label="Last Name" required><Input name="lastName" placeholder="Smith" required /></Field>
        </div>
        <div className="mb-3"><Field label="Email Address" required><Input name="email" type="email" placeholder="jane@victoriatulsidaslaw.com" required /></Field></div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Role" required><Select name="roleLabel" required defaultValue=""><option value="" disabled>Select role...</option><option value="Lawyer">Lawyer</option><option value="Admin">Admin</option><option value="Client">Client</option></Select></Field>
          {String(formState.roleLabel || '').toLowerCase() !== 'client' && (
            <Field label="Specialty"><Select name="specialty"><option>Civil Litigation</option><option>Family Law</option><option>Corporate</option><option>Real Estate</option></Select></Field>
          )}
        </div>
        <Field label="Set Password" required><Input name="password" type="password" placeholder="••••••••" required /></Field>
      </>,
      onSave: () => toast('User account created!', 'success'),
    },
    'edit-user': {
      title: data ? `Edit User: ${data.name}` : 'Edit User', wide: false,
      body: <>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="First Name" required><Input name="firstName" defaultValue={data?.name ? data.name.split(' ')[0] : ''} required /></Field>
          <Field label="Last Name" required><Input name="lastName" defaultValue={data?.name ? data.name.split(' ').slice(1).join(' ') : ''} required /></Field>
        </div>
        <div className="mb-3"><Field label="Email Address" required><Input name="email" type="email" defaultValue={data ? data.email : ''} required /></Field></div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Role" required>
            <Select name="roleLabel" defaultValue={data ? data.roleLabel : 'Lawyer'} required>
              <option value="Lawyer">Lawyer</option>
              <option value="Admin">Admin</option>
              <option value="Client">Client</option>
            </Select>
          </Field>
          {String(formState.roleLabel || (data ? data.roleLabel : '')).toLowerCase() !== 'client' && (
            <Field label="Specialty">
              <Select name="specialty" defaultValue={data?.practice_focus || ''}>
                <option value="">None</option>
                <option>Civil Litigation</option>
                <option>Family Law</option>
                <option>Corporate</option>
                <option>Real Estate</option>
              </Select>
            </Field>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Status">
            <Select name="status" defaultValue={data ? data.status : 'active'}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </Field>
        </div>
      </>,
      onSave: () => toast('User updated successfully!', 'success'),
    },
    'edit-case': {
      title: data ? `Edit Matter: ${data.id}` : 'Edit Matter', wide: false,
      body: <>
        <div className="mb-3"><Field label="Matter Title" required><Input name="title" defaultValue={data ? data.title : ''} required /></Field></div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Status" required>
            <Select name="status" defaultValue={data ? data.status : 'active'} required>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </Select>
          </Field>
          <Field label="Priority" required>
            <Select name="priority" defaultValue={data ? data.priority : 'medium'} required>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Case Type" required>
            <Select name="type" defaultValue={data ? data.type : ''} required>
              <option>Civil Litigation</option>
              <option>Family Law</option>
              <option>Criminal Defense</option>
              <option>Corporate Law</option>
              <option>Real Estate</option>
            </Select>
          </Field>
          <Field label="Next Hearing"><Input name="nextHearing" type="date" defaultValue={data ? (data.next_hearing || data.nextHearing || '').split('T')[0] : ''} /></Field>
        </div>
      </>,
      onSave: () => toast('Matter updated successfully!', 'success'),
    },
    'pay-invoice': {
      title: data ? `Pay Invoice: ${data.id}` : 'Pay Invoice', wide: false,
      body: <>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
          <div className="flex justify-between items-center text-[13px] mb-1">
            <span className="text-slate-500">Invoice Amount</span>
            <span className="font-700 text-slate-900">{data?.amount || '$0.00'}</span>
          </div>
          <p className="text-[11px] text-slate-400">Manual/internal payment record (gateway not connected yet).</p>
        </div>
        <Field label="Payment Method">
          <Input value="manual" disabled />
        </Field>
        <Field label="Payment Reference">
          <Input name="payment_reference" defaultValue="internal-manual" />
        </Field>
      </>,
    },
    'use-template': {
      title: 'Apply Document Template', wide: false,
      body: <>
        <p className="text-[12px] text-slate-500 mb-4">You are creating a new draft based on: <strong className="text-slate-900">{data?.title}</strong></p>
        <Field label="New Document Title" required>
          <Input name="title" defaultValue={`Copy of ${data?.title}`} required />
        </Field>
      </>,
      onSave: () => { },
    },
    'apply-template': {
      title: 'Apply Case Template', wide: false,
      body: <>
        <p className="text-[12px] text-slate-500 mb-4">Select a practice area template to auto-generate folder structures and task lists.</p>
        <div className="space-y-2">
          {[
            { id: 'pi', label: 'Personal Injury', desc: 'Medical Records, Insurance, Litigation flow' },
            { id: 'im', label: 'Immigration', desc: 'Identity Docs, USCIS Filings, Evidence' },
            { id: 'gl', label: 'General Litigation', desc: 'Pleadings, Discovery, Trial Prep' }
          ].map(t => (
            <label key={t.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:border-primary-400 cursor-pointer transition-all group">
              <input type="radio" name="template" value={t.id} className="mt-1" defaultChecked={t.id === 'pi'} />
              <div>
                <p className="text-[13px] font-700 text-slate-900 group-hover:text-primary-600">{t.label}</p>
                <p className="text-[11px] text-slate-400">{t.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </>,
      onSave: () => {
        toast('Matter folders and matter registry generated.', 'success');
        navigate('/admin/matters');
      },
    },
    'conflict-check': {
      title: 'Conflict of Interest Check', wide: false,
      body: <>
        <div className="mb-3"><Field label="Prospective Client Name" required><Input name="prospectiveClient" placeholder="Full name or Company" required /></Field></div>
        <div className="mb-3"><Field label="Opposing Party Name" required><Input name="opposingParty" placeholder="Opponent or Adverse Entity" required /></Field></div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-500 italic">
          System will scan all matters, contacts, and closed files for potential hits.
        </div>
      </>,
      onSave: () => toast('Conflict check initiated. Standby...', 'info'),
    },
    'view-invoice': {
      title: data ? `Premium Invoice: ${data.id}` : 'Invoice Preview', wide: false,
      body: <>
        {/* State-of-the-art Fintech Header */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-8 text-white shadow-2xl shadow-indigo-200 mb-8 group">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-900 uppercase tracking-[0.3em] text-indigo-100/80">Electronic Statement</span>
              </div>
              <h2 className="text-[28px] font-900 tracking-tighter leading-tight mb-1">Victoria Tulsidas</h2>
              <p className="text-[13px] font-600 text-indigo-100/60 uppercase tracking-widest">Legal Counsel • Professional Corp.</p>
            </div>
            <div className="text-right">
              <div className="inline-flex px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-800 uppercase tracking-widest mb-4">
                {data?.status || 'Active'}
              </div>
              <p className="text-[11px] font-700 text-indigo-100/50 uppercase tracking-widest mb-1">Grand Total</p>
              <p className="text-[38px] font-900 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">{data?.amount}</p>
            </div>
          </div>
        </div>

        {/* Action Toolbar - Floating Pills */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={async () => {
              try {
                const { blob, filename } = await api.billing.downloadInvoicePdf(data.dbId);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = filename;
                document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url);
              } catch (e) { toast('Download failed', 'error'); }
            }}
            className="py-3 px-6 rounded-2xl bg-white border border-slate-200 text-slate-600 text-[13px] font-700 hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5 5-5M12 15V3" /></svg>
            Download
          </button>
          <button
            onClick={() => window.print()}
            className="py-3 px-4 rounded-2xl bg-white border border-slate-200 text-slate-600 text-[13px] font-700 hover:bg-slate-50 transition-all flex items-center"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          </button>
        </div>

        {/* High-Lustre Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 cursor-default">
            <p className="text-[11px] font-900 text-slate-400 uppercase tracking-widest mb-2">Billed To</p>
            <p className="text-[17px] font-900 text-slate-900 tracking-tight">{data?.client}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span className="text-[11px] font-700 text-slate-400 uppercase tracking-wider">Identity Verified</span>
            </div>
          </div>
          <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 cursor-default">
            <p className="text-[11px] font-900 text-slate-400 uppercase tracking-widest mb-2">Timeline</p>
            <p className="text-[17px] font-900 text-slate-900 tracking-tight">{data?.due}</p>
            <p className="text-[11px] font-700 text-indigo-600 mt-2 uppercase tracking-widest">Valid for 5 Days</p>
          </div>
        </div>

        {/* Sleek Service Breakdown */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <h4 className="text-[16px] font-900 text-slate-900 tracking-tight">Statement Items</h4>
            <span className="text-[11px] font-800 text-slate-400 uppercase tracking-[0.2em]">{data?.id}</span>
          </div>

          <div className="space-y-3">
            {data?.items && data.items.length > 0 ? (
              data.items.map((item) => (
                <div key={item.id} className="rounded-[2.5rem] bg-white border border-slate-200/60 p-2 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-lg">
                  <div className="px-6 py-4 rounded-[2rem] bg-slate-50/50 flex justify-between items-center group">
                    <div className="space-y-1">
                      <p className="text-[14px] font-800 text-slate-900 tracking-tight">{item.description}</p>
                      <div className="flex gap-3 text-[10px] font-700 uppercase tracking-wider">
                        <span className="text-indigo-600">Verified Service</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400">{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[16px] font-900 text-slate-900 tracking-tighter">${Number(item.amount).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[2.5rem] bg-white border border-slate-200/60 p-2 shadow-sm ring-1 ring-slate-900/5">
                <div className="px-6 py-6 rounded-[2rem] bg-slate-50/50 flex justify-between items-center group transition-all hover:bg-white hover:shadow-lg active:scale-[0.98]">
                  <div className="space-y-1.5">
                    <p className="text-[16px] font-800 text-slate-900 tracking-tight">{data?.desc || 'Legal Advisory Services'}</p>
                    <div className="flex gap-3 text-[11px] font-700 uppercase tracking-wider">
                      <span className="text-emerald-600">Verified Service</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400">Billable Unit</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[20px] font-900 text-slate-900 tracking-tighter">{data?.amount}</p>
                    <p className="text-[10px] font-800 text-slate-400 uppercase">Per Agreement</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </>,
      onSave: () => { },
    },
    'add-note': {
      title: 'Add Matter Note', wide: false,
      body: <>
        {data?.matterId ? <input type="hidden" name="matterId" value={data.matterId} /> : null}
        <div className="mb-3">
          <Field label="Note Title" required><Input name="title" placeholder="Summary of discussion/action" required /></Field>
        </div>
        <div className="mb-3">
          <Field label="Visibility" required>
            <Select name="visibility" required>
              <option value="Internal">Internal (Firm Only)</option>
              <option value="Shared">Shared (Client & Firm)</option>
            </Select>
          </Field>
        </div>
        <Field label="Note Content" required>
          <Textarea name="content" rows={5} placeholder="Type the detailed note here..." required />
        </Field>
      </>,
      onSave: () => toast('Matter note added successfully!', 'success'),
    },
    'log-call': {
      title: 'Log Communication / Call', wide: false,
      body: <>
        {data?.matterId ? <input type="hidden" name="matterId" value={data.matterId} /> : null}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Type" required>
            <Select name="type" required>
              <option value="Call">Phone Call</option>
              <option value="Meeting">Meeting</option>
              <option value="Video">Video Call</option>
            </Select>
          </Field>
          <Field label="Direction" required>
            <Select name="direction" required>
              <option value="Inbound">Inbound</option>
              <option value="Outbound">Outbound</option>
            </Select>
          </Field>
        </div>
        <div className="mb-3">
          <Field label="Subject" required><Input name="subject" placeholder="Purpose of the call" required /></Field>
          <Field label="Visibility" required>
            <Select name="visibility" required>
              <option value="Internal">Internal (Firm Only)</option>
              <option value="Shared">Shared (Client & Firm)</option>
            </Select>
          </Field>
        </div>
        <Field label="Notes / Outcome" required>
          <Textarea name="notes" rows={4} placeholder="Key takeaways and next steps..." required />
        </Field>
      </>,
      onSave: () => toast('Communication logged successfully!', 'success'),
    },
    'view-report': {
      title: data?.title || 'Report Overview', wide: false,
      body: data?.content || <p>No content available.</p>,
      onSave: () => { },
    },
    'view-event': {
      title: 'Event Details', wide: false,
      body: (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <p className="text-[11px] font-800 text-slate-400 uppercase tracking-widest mb-1">Type</p>
              <p className="text-[13px] font-800 text-slate-900 uppercase tracking-tight">{data?.type}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-800 text-slate-400 uppercase tracking-widest mb-1">Date</p>
              <p className="text-[13px] font-700 text-slate-900">{new Date(data?.date).toLocaleDateString()} {data?.type === 'invoice' ? '' : new Date(data?.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-[14px] font-900 text-slate-900 tracking-tight">{data?.title}</h4>
            {data?.matter_number && (
              <p className="text-[12px] font-600 text-primary-600 px-2 py-0.5 bg-primary-50 rounded-full inline-block">
                Matter: {data.matter_number} {data.matter_title ? `— ${data.matter_title}` : ''}
              </p>
            )}
          </div>

          {data?.description && (
            <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
              <p className="text-[11px] font-800 text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1">Notes / Description</p>
              <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap">{data.description}</p>
            </div>
          )}

          {data?.type === 'invoice' && (
            <div className="flex gap-4">
              <div className="flex-1 p-3 rounded-xl bg-amber-50 border border-amber-100">
                <p className="text-[10px] font-800 text-amber-600 uppercase mb-1">Amount</p>
                <p className="text-[16px] font-900 text-amber-900 tracking-tighter">₹{data.amount}</p>
              </div>
              <div className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-800 text-slate-400 uppercase mb-1">Status</p>
                <p className="text-[14px] font-800 text-slate-900 uppercase">{data.status}</p>
              </div>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            {data?.type === 'matter' && data?.matter_id && (
              <button
                onClick={() => { onClose(); navigate(role === 'admin' ? `/admin/matters/${data.matter_id}` : `/lawyer/matters/${data.matter_id}`); }}
                className="btn btn-primary w-full justify-center text-[12px] h-10"
              >
                Go to Matter Workspace
              </button>
            )}
            {data?.type === 'invoice' && data?.raw_id && (
              <button
                onClick={() => { onClose(); openModal('view-invoice', { id: data.title.split(' ')[1], dbId: data.raw_id, amount: `₹${data.amount}`, status: data.status, desc: data.description, client: 'See Matter', due: new Date(data.date).toLocaleDateString() }); }}
                className="btn btn-secondary w-full justify-center text-[12px] h-10"
              >
                View Premium Invoice
              </button>
            )}
          </div>
        </div>
      ),
      onSave: () => { },
    },
    'browse-templates': {
      title: 'Document Template Library', wide: true,
      body: <TemplateLibrary targetMatterId={data?.targetMatterId} />,
    },
  };

  const m = modals[type];
  if (!m) return null;

  const primaryLabel =
    type === 'compose-email' ? 'Send Email'
      : type === 'add-document' ? 'Upload'
        : type === 'view-invoice' ? 'Close'
          : type === 'browse-templates' ? 'Close'
            : 'Save';
  const handlePrimary = async () => {
    if (type === 'view-invoice') {
      onClose();
      return;
    }
    const skipValidity = ['apply-template', 'conflict-check'].includes(type);
    if (!skipValidity && formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity?.();
      return;
    }
    setSaving(true);
    try {
      let values = {};
      if (formRef.current) {
        values = Object.fromEntries(new FormData(formRef.current).entries());
      }
      if (onSave) {
        await Promise.resolve(onSave(values));
      } else {
        await defaultModalSubmit(type, data, values, { role, user, toast, navigate });
      }
      onClose();
    } catch (e) {
      toast(e.message || 'Action failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const primaryDisabled = type === 'view-invoice' ? saving : (!isValid || saving);

  return (
    <Modal title={m.title} onClose={onClose} wide={m.wide}
      footer={
        <>
          <button type="button" onClick={onClose} className="btn btn-secondary" disabled={saving}>Cancel</button>
          <button
            type="button"
            onClick={handlePrimary}
            disabled={primaryDisabled}
            className={`btn btn-primary transition-all ${primaryDisabled ? 'opacity-50 cursor-not-allowed hover:translate-y-0 shadow-none' : ''}`}
          >
            {saving && type !== 'view-invoice' ? 'Saving…' : primaryLabel}
          </button>
        </>
      }>
      <form ref={formRef} className="[&_.grid-cols-2]:grid-cols-1 sm:[&_.grid-cols-2]:grid-cols-2" onChange={handleChange} onSubmit={e => e.preventDefault()}>
        {m.body}
      </form>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────
//  APP LAYOUT (Sidebar + Topbar + Outlet)
// ─────────────────────────────────────────────────────────
function AppLayout({ role, user, onLogout, toast, modal, setModal, modalLookups }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [sidebarBadges, setSidebarBadges] = useState({});
  const routerNavigate = useNavigate();

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!user?.id || !role) {
      setSidebarBadges({});
      return undefined;
    }
    let cancelled = false;
    const loadBadges = async () => {
      const r = String(role).toLowerCase();
      try {
        if (r === 'admin') {
          const [lr, mr, cr] = await Promise.all([
            api.leads.list({ limit: 500 }),
            api.matters.list({ limit: 500 }),
            api.communications.list({ limit: 500 }),
          ]);
          if (cancelled) return;
          const leads = Array.isArray(lr?.data) ? lr.data : [];
          const matters = Array.isArray(mr?.data) ? mr.data : [];
          const comms = Array.isArray(cr?.data) ? cr.data : [];
          setSidebarBadges({
            leads: leads.filter((l) => l.status === 'new').length,
            cases: matters.filter((m) => m.status !== 'completed').length,
            email: comms.filter((c) => c.sender_user_id !== user.id && c.sender_role === 'client' && !c.is_read).length,
          });
        } else if (r === 'lawyer') {
          const [mr, cr] = await Promise.all([
            api.matters.list({ limit: 500 }),
            api.communications.list({ limit: 500 }),
          ]);
          if (cancelled) return;
          const matters = Array.isArray(mr?.data) ? mr.data : [];
          const comms = Array.isArray(cr?.data) ? cr.data : [];
          setSidebarBadges({
            'l-cases': matters.filter((m) => m.status !== 'completed').length,
            email: comms.filter((c) => c.sender_user_id !== user.id && c.sender_role === 'client' && !c.is_read).length,
          });
        } else if (r === 'client') {
          const [ir, cr] = await Promise.all([
            api.billing.listInvoices({ limit: 500 }),
            api.communications.list({ limit: 500 }),
          ]);
          if (cancelled) return;
          const invoices = Array.isArray(ir?.data) ? ir.data : [];
          const comms = Array.isArray(cr?.data) ? cr.data : [];
          setSidebarBadges({
            'c-billing': invoices.filter((i) => i.status !== 'paid' && i.status !== 'void').length,
            'c-messages': comms.filter((c) => c.sender_user_id !== user.id && c.sender_role !== 'client' && c.sender_role !== 'system' && !c.is_read).length,
          });
        } else {
          setSidebarBadges({});
        }
      } catch {
        if (!cancelled) setSidebarBadges({});
      }
    };
    loadBadges();
    const onRefresh = () => loadBadges();
    window.addEventListener('vktori:entities-changed', onRefresh);
    return () => {
      cancelled = true;
      window.removeEventListener('vktori:entities-changed', onRefresh);
    };
  }, [user?.id, role]);

  // navigate helper that pages can still call with a path string
  const navigate = (path) => {
    routerNavigate(path);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans text-slate-900 selection:bg-primary-100 selection:text-primary-900">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-[60] lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-[70] lg:relative lg:translate-x-0 transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar open={sidebarOpen} role={role} user={user} onToggle={() => setSidebarOpen(o => !o)} onLogout={onLogout}
          badges={sidebarBadges}
          onItemClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white/50 relative">
        <Topbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(o => !o)}
          role={role} user={user} onLogout={onLogout} toast={toast} navigate={navigate} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="max-w-7xl mx-auto w-full animate-slide-up">
            <Outlet context={{ role, user, navigate, toast, openModal: (type, data, onSave) => setModal({ type, data, onSave }) }} />
          </div>
        </main>
      </div>

      {modal && (
        <AppModal
          type={modal.type || modal}
          data={modal.data}
          onSave={modal.onSave}
          onClose={() => setModal(null)}
          toast={toast}
          navigate={navigate}
          role={role}
          user={user}
          lookups={modalLookups}
          openModal={(type, data, onSave) => setModal({ type, data, onSave })}
        />
      )}

      <VyniusAI role={role} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  PAGE WRAPPERS (read context from Outlet)
// ─────────────────────────────────────────────────────────
import { useOutletContext } from 'react-router-dom';

function AdminDashboardPage() { const ctx = useOutletContext(); return <AdminDashboard   {...ctx} />; }
function LeadsPage() { const ctx = useOutletContext(); return <LeadDashboard     {...ctx} />; }
function LeadDetailWrapper() { const ctx = useOutletContext(); const { id } = useParams(); return <LeadDetailPage {...ctx} leadId={id} />; }
function ConflictPage() { const ctx = useOutletContext(); return <ConflictCheckPage {...ctx} />; }
function AdminClientsPage() { const ctx = useOutletContext(); return <ClientsPage       {...ctx} />; }
function AdminClientDetailPage() { const ctx = useOutletContext(); const { id } = useParams(); return <ClientDetailPage  {...ctx} clientId={id || "C001"} />; }
function AdminMattersPage() { const ctx = useOutletContext(); return <CasesPage         {...ctx} />; }
function AdminMatterDetailPage() { const ctx = useOutletContext(); const { id } = useParams(); return <CaseDetailPage    {...ctx} caseId={id || "CASE-2045"} />; }
function AdminCalendarPage() { const ctx = useOutletContext(); return <CalendarPage      {...ctx} />; }
function AdminDocumentsPage() { const ctx = useOutletContext(); return <DocumentsPage     {...ctx} />; }
function AdminBillingPage() { const ctx = useOutletContext(); return <BillingPage       {...ctx} />; }
function AdminEmailPage() { const ctx = useOutletContext(); return <EmailPage         {...ctx} />; }
function AdminAIPage() { const ctx = useOutletContext(); return <AIPage            {...ctx} />; }
function AdminMarketingPage() { const ctx = useOutletContext(); return <MarketingDashboard {...ctx} />; }
function AdminReportsPage() { const ctx = useOutletContext(); return <ReportsDashboard  {...ctx} />; }
function AdminUsersPage() { const ctx = useOutletContext(); return <UsersPage         {...ctx} />; }
function AdminSettingsPage() { const ctx = useOutletContext(); return <SettingsPage      {...ctx} />; }

function LawyerDashboardPage() { const ctx = useOutletContext(); return <LawyerDashboard  {...ctx} />; }
function LawyerClientsWrapper() { const ctx = useOutletContext(); return <LawyerClientsPage {...ctx} />; }
function LawyerClientDetailWrapper() { const ctx = useOutletContext(); const { id } = useParams(); return <ClientDetailPage  {...ctx} clientId={id} />; }
function LawyerMattersPage() { const ctx = useOutletContext(); return <LawyerCasesPage   {...ctx} />; }
function LawyerMatterDetailWrapper() { const ctx = useOutletContext(); const { id } = useParams(); return <CaseDetailPage    {...ctx} caseId={id} />; }
function LawyerCalendarPage() { const ctx = useOutletContext(); return <CalendarPage      {...ctx} />; }
function LawyerDocumentsPage() { const ctx = useOutletContext(); return <DocumentsPage     {...ctx} />; }
function LawyerBillingPage() { const ctx = useOutletContext(); return <BillingPage       {...ctx} />; }
function LawyerEmailPage() { const ctx = useOutletContext(); return <EmailPage         {...ctx} />; }
function LawyerAIPage() { const ctx = useOutletContext(); return <AIPage            {...ctx} />; }
function LawyerSettingsPage() { const ctx = useOutletContext(); return <SettingsPage      {...ctx} />; }
function LawyerProfileWrapper() { const ctx = useOutletContext(); return <LawyerProfilePage {...ctx} />; }

function ClientDashboardPage() { const ctx = useOutletContext(); return <ClientDashboard      {...ctx} />; }
function ClientMattersPage() { const ctx = useOutletContext(); return <ClientCasesPage       {...ctx} />; }
function ClientMatterDetailWrapper() { const ctx = useOutletContext(); const { id } = useParams(); return <CaseDetailPage    {...ctx} caseId={id} />; }
function ClientDocsPage() { const ctx = useOutletContext(); return <ClientDocumentsPage   {...ctx} />; }
function ClientBillingWrapper() { const ctx = useOutletContext(); return <ClientBillingPage     {...ctx} />; }
function ClientMessagesWrapper() { const ctx = useOutletContext(); return <ClientMessagesPage    {...ctx} />; }
function ClientProfileWrapper() { const ctx = useOutletContext(); return <ClientProfilePage     {...ctx} />; }

import WebsiteLayout from './website/WebsiteLayout.jsx';
import { HomePage, ClientPortalLandingPage } from './website/pages/WebsitePages.jsx';

// ─────────────────────────────────────────────────────────
//  ROOT APP
// ─────────────────────────────────────────────────────────
const HOME_ROUTE = { admin: '/admin/dashboard', lawyer: '/lawyer/dashboard', client: '/client/dashboard' };

const billFormatUsd = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n) || 0);

function TrustLedgerView({ accountId, formatUsd }) {
  const [loading, setLoading] = useState(true);
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    if (!accountId) return;
    api.billing.getTrustTransactions(accountId)
      .then(res => setTxs(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [accountId]);

  if (loading) return <div className="p-10 text-center text-slate-400">Loading ledger...</div>;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-700 text-slate-900">Date</th>
              <th className="px-4 py-3 font-700 text-slate-900">Type</th>
              <th className="px-4 py-3 font-700 text-slate-900">Matter</th>
              <th className="px-4 py-3 font-700 text-slate-900">Reference</th>
              <th className="px-4 py-3 font-700 text-slate-900 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {txs.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400 italic">No transactions found.</td></tr>
            ) : (
              txs.map(tx => {
                const isDeposit = tx.transaction_type === 'deposit';
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{new Date(tx.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`capitalize font-600 ${isDeposit ? 'text-emerald-600' : 'text-indigo-600'}`}>
                        {tx.transaction_type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{tx.matter?.matter_number || '—'}</td>
                    <td className="px-4 py-3 text-slate-400 text-[11px] max-w-[150px] truncate">{tx.reference || tx.notes || '—'}</td>
                    <td className={`px-4 py-3 text-right font-700 ${isDeposit ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {isDeposit ? '+' : '-'}{formatUsd(tx.amount)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const [modal, setModal] = useState(null);
  const [modalLookups, setModalLookups] = useState({ clients: [], matters: [], lawyers: [], folders: [] });
  const { toasts, toast } = useToast();
  const routerNavigate = useNavigate();
  const location = useLocation();

  const refreshModalLookups = useCallback(async () => {
    if (!isLoggedIn || !user) return;
    try {
      const [clRes, mtRes, usRes, flRes, invRes] = await Promise.all([
        api.clients.list({ limit: 500 }),
        api.matters.list({ limit: 500 }),
        role === 'admin' ? api.users.list() : Promise.resolve({ data: [] }),
        api.folders.list(),
        api.billing.listInvoices({ limit: 500 })
      ]);
      const clients = Array.isArray(clRes?.data) ? clRes.data : [];
      const matters = Array.isArray(mtRes?.data) ? mtRes.data : [];
      const users = Array.isArray(usRes?.data) ? usRes.data : [];
      const folders = Array.isArray(flRes?.data) ? flRes.data : [];
      const invoices = Array.isArray(invRes?.data) ? invRes.data : [];
      const lawyers = role === 'admin' ? users.filter((u) => u.role === 'lawyer') : [];
      setModalLookups({ clients, matters, lawyers, folders, invoices });
    } catch (e) {
      console.error(e);
    }
  }, [isLoggedIn, user, role]);

  useEffect(() => {
    refreshModalLookups();
  }, [refreshModalLookups]);

  useEffect(() => {
    if (!isLoggedIn) return;
    window.addEventListener('vktori:entities-changed', refreshModalLookups);

    // Global modal opener for cross-component triggers
    const openHandler = (e) => {
      const { type, data, onSave } = e.detail || {};
      if (type) setModal({ type, data, onSave });
    };
    window.addEventListener('vktori:open-modal', openHandler);

    return () => {
      window.removeEventListener('vktori:entities-changed', refreshModalLookups);
      window.removeEventListener('vktori:open-modal', openHandler);
    };
  }, [isLoggedIn, refreshModalLookups]);

  // Session verification on mount
  useEffect(() => {
    const initSession = async () => {
      const token = localStorage.getItem('vktori_token');
      if (token) {
        try {
          const response = await api.auth.getMe();
          const me = response?.data;
          if (!me?.id || !me?.role || !HOME_ROUTE[me.role]) {
            throw new Error('Invalid session payload');
          }
          localStorage.setItem('vktori_user', JSON.stringify(me));
          localStorage.setItem('vktori_role', me.role);
          setUser(me);
          setRole(me.role);
          setIsLoggedIn(true);
        } catch (err) {
          console.error("Session verification failed", err);
          if (err?.status === 401 || err?.status === 403) {
            handleLogout();
          } else {
            const cachedUser = JSON.parse(localStorage.getItem('vktori_user') || 'null');
            const cachedRole = localStorage.getItem('vktori_role');
            if (cachedUser?.id && cachedRole && HOME_ROUTE[cachedRole]) {
              setUser(cachedUser);
              setRole(cachedRole);
              setIsLoggedIn(true);
            }
          }
        }
      }
      setIsInitializing(false);
    };
    initSession();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isLoggedIn && role) {
      localStorage.setItem('vktori_screen', 'app');
      localStorage.setItem('vktori_role', role);
    }
  }, [isLoggedIn, role]);

  const handleLogin = (userData, token) => {
    const home = HOME_ROUTE[userData?.role];
    if (!home) {
      toast(`Unknown account role: ${userData?.role ?? 'none'}. Contact support.`, 'error');
      return;
    }
    localStorage.setItem('vktori_token', token);
    localStorage.setItem('vktori_user', JSON.stringify(userData));
    setUser(userData);
    setRole(userData.role);
    setIsLoggedIn(true);
    routerNavigate(home, { replace: true });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setRole(null);
    localStorage.clear();
    routerNavigate('/login');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Internal layout element
  const appLayoutEl = (
    <AppLayout
      role={role}
      user={user}
      onLogout={handleLogout}
      toast={toast}
      modal={modal}
      setModal={setModal}
      modalLookups={modalLookups}
    />
  );

  return (
    <>
      <Routes>
        {/* PUBLIC WEBSITE ROUTES */}
        <Route element={<WebsiteLayout toast={toast} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<Navigate to="/#our-firm" replace />} />
          <Route path="/practice-areas" element={<Navigate to="/#practice-areas" replace />} />
          <Route path="/contact" element={<Navigate to="/#contact-us" replace />} />
          <Route path="/book-consultation" element={<Navigate to="/#book-consultation" replace />} />
          <Route path="/client-portal" element={<ClientPortalLandingPage />} />
        </Route>

        {/* AUTH ROUTES */}
        <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />

        {/* PROTECTED APP ROUTES (Guarded) */}
        {/* ADMIN ROUTES */}
        <Route path="/admin" element={isLoggedIn && role === 'admin' ? appLayoutEl : <Navigate to="/login" replace />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="intake-leads" element={<LeadsPage />} />
          <Route path="intake-leads/:id" element={<LeadDetailWrapper />} />
          <Route path="conflict-check" element={<ConflictPage />} />
          <Route path="clients" element={<AdminClientsPage />} />
          <Route path="clients/:id" element={<AdminClientDetailPage />} />
          <Route path="matters" element={<AdminMattersPage />} />
          <Route path="matters/:id" element={<AdminMatterDetailPage />} />
          <Route path="calendar" element={<AdminCalendarPage />} />
          <Route path="documents" element={<AdminDocumentsPage />} />
          <Route path="billing" element={<AdminBillingPage />} />
          <Route path="communications" element={<AdminEmailPage />} />
          <Route path="vynius" element={<AdminAIPage />} />
          <Route path="marketing" element={<AdminMarketingPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* LAWYER ROUTES */}
        <Route path="/lawyer" element={isLoggedIn && role === 'lawyer' ? appLayoutEl : <Navigate to="/login" replace />}>
          <Route index element={<Navigate to="/lawyer/dashboard" replace />} />
          <Route path="dashboard" element={<LawyerDashboardPage />} />
          <Route path="clients" element={<LawyerClientsWrapper />} />
          <Route path="clients/:id" element={<LawyerClientDetailWrapper />} />
          <Route path="matters" element={<LawyerMattersPage />} />
          <Route path="matters/:id" element={<LawyerMatterDetailWrapper />} />
          <Route path="calendar" element={<LawyerCalendarPage />} />
          <Route path="documents" element={<LawyerDocumentsPage />} />
          <Route path="billing" element={<LawyerBillingPage />} />
          <Route path="email" element={<LawyerEmailPage />} />
          <Route path="vynius" element={<LawyerAIPage />} />
          <Route path="profile" element={<LawyerProfileWrapper />} />
          <Route path="settings" element={<LawyerSettingsPage />} />
        </Route>

        {/* CLIENT ROUTES */}
        <Route path="/client" element={isLoggedIn && role === 'client' ? appLayoutEl : <Navigate to="/login" replace />}>
          <Route index element={<Navigate to="/client/dashboard" replace />} />
          <Route path="dashboard" element={<ClientDashboardPage />} />
          <Route path="matters" element={<ClientMattersPage />} />
          <Route path="matters/:id" element={<ClientMatterDetailWrapper />} />
          <Route path="documents" element={<ClientDocsPage />} />
          <Route path="billing" element={<ClientBillingWrapper />} />
          <Route path="messages" element={<ClientMessagesWrapper />} />
          <Route path="profile" element={<ClientProfileWrapper />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={isLoggedIn && HOME_ROUTE[role] ? <Navigate to={HOME_ROUTE[role]} replace /> : <Navigate to="/" replace />} />
      </Routes>
      <ToastContainer toasts={toasts} />
    </>
  );
}
