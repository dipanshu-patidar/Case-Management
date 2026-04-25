import { useState, useRef, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Outlet, useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import { VyniusAI } from './components/VyniusAI.jsx';
import { useToast, ToastContainer, Modal, Field, Input, Select, Textarea } from './components/UI.jsx';
import logoImg from './assets/WhatsApp Image 2026-04-13 at 11.01.36 AM-Photoroom.png';
import justiceBg from './assets/lady_justice_login_bg_1777101771752.png';
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
    admin: { email: 'admin@vktori.com', password: '1234', label: 'Admin', color: 'bg-[#001640]', desc: 'Executive Authority' },
    lawyer: { email: 'lawyer@vktori.com', password: '1234', label: 'Lawyer', color: 'bg-[#001640]', desc: 'Legal Practitioner' },
    client: { email: 'client@vktori.com', password: '1234', label: 'Client', color: 'bg-[#001640]', desc: 'Client Portal' },
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
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Left Panel - Cinematic Branding */}
      <div className="hidden md:flex md:w-[45%] lg:w-[40%] bg-[#05080f] relative flex-col items-center justify-center p-12 text-center border-r border-white/5">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img src={justiceBg} alt="Justice Background" className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#05080f]/80 via-[#05080f]/40 to-[#05080f]/90" />
        </div>

        <div className="relative z-10 space-y-12 animate-fade-in-up">
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
              <img src={logoImg} alt="Firm Logo" className="w-full h-full object-contain filter brightness-110" />
            </div>
            <div className="space-y-2">
              <h2 className="text-[#C9A24A] font-serif text-3xl tracking-wide">Victoria Tulsidas, JD</h2>
              <p className="text-white/40 text-[11px] font-900 uppercase tracking-[0.5em] ml-1">Attorney At Law</p>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-white font-serif text-5xl leading-tight">Case Management<br/><span className="text-[#C9A24A]">Software</span></h1>
            <p className="text-white/50 text-sm max-w-sm mx-auto leading-relaxed">
              Streamline your legal practice. Manage cases, clients, documents and billing all in one secure platform.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-12 border-t border-white/10">
            {[
              { label: 'Secure', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
              { label: 'Efficient', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
              { label: 'Insightful', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 012 2h2a2 2 0 012-2" /></svg> },
            ].map(f => (
              <div key={f.label} className="space-y-3 group cursor-default">
                <div className="w-10 h-10 mx-auto rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C9A24A] group-hover:bg-[#C9A24A] group-hover:text-black transition-all duration-300">
                  {f.icon}
                </div>
                <p className="text-[10px] font-900 text-white/60 uppercase tracking-widest">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Institutional Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-24 bg-[#f8fafc] relative">
        <div className="w-full max-w-md space-y-10 animate-fade-in">
          {/* Mobile Logo */}
          <div className="md:hidden flex flex-col items-center gap-4 mb-8">
            <img src={logoImg} alt="Logo" className="h-16 w-auto" />
            <h1 className="text-[#1a1f2e] font-serif text-2xl">Victoria Tulsidas Law</h1>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-4 text-[11px] font-900 text-slate-400 uppercase tracking-widest">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Secure Login | Case Management System
            </div>
            <h2 className="text-[#1a1f2e] font-serif text-5xl tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 text-lg">Sign in to access your dashboard</p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100">
            {/* Role Selector */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-1.5 flex mb-8">
              {Object.entries(roleMap).map(([key, info]) => (
                <button key={key} onClick={() => handleRoleSelect(key)}
                  className={`flex-1 py-3 px-4 rounded-xl text-[11px] font-900 uppercase tracking-widest transition-all duration-300 ${role === key
                    ? `${info.color} text-white shadow-lg`
                    : 'text-slate-400 hover:text-slate-600'}`}>
                  {info.label}
                </button>
              ))}
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[13px] font-700 text-center animate-shake">
                {errorMsg}
              </div>
            )}

            <div className="space-y-6 mb-8">
              <div className="space-y-2">
                <label className="block text-[12px] font-700 text-slate-700 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1a1f2e] transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <input value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-[#1a1f2e] text-[15px] outline-none focus:border-[#1a1f2e] focus:ring-4 focus:ring-slate-900/5 transition-all font-medium"
                    placeholder="Enter your email" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-[12px] font-700 text-slate-700 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1a1f2e] transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input type="password" value={pass} onChange={e => setPass(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-12 py-4 text-[#1a1f2e] text-[15px] outline-none focus:border-[#1a1f2e] focus:ring-4 focus:ring-slate-900/5 transition-all font-medium"
                    placeholder="Enter your password" />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[13px] text-slate-500 font-600 cursor-pointer group">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-[#001640] focus:ring-[#001640]" />
                  Remember me
                </label>
                <button className="text-[13px] text-[#001640] font-800 hover:underline">Forgot Password?</button>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={isLoading}
              className="w-full py-4 bg-[#001640] text-white font-900 uppercase tracking-[0.2em] rounded-2xl text-[14px] hover:bg-[#001640]/90 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <p className="text-center text-[13px] text-slate-500 font-500">
            Don't have an account? <span className="text-[#001640] font-800 cursor-pointer hover:underline">Contact Administrator</span>
          </p>
        </div>

        <div className="absolute bottom-10 left-0 w-full text-center opacity-40">
          <p className="text-[11px] font-900 text-slate-500 uppercase tracking-[0.2em]">
            © 2024 Victoria Tulsidas, JD. All rights reserved.
          </p>
        </div>
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
      title: 'Institutional Trust Deposit', wide: false,
      body: <>
        <div className="bg-[#10b981]/5 p-6 rounded-3xl border border-[#10b981]/10 mb-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#10b981]/10 blur-3xl pointer-events-none group-hover:bg-[#10b981]/20 transition-all duration-700" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center text-[#10b981]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3 1.343 3 3-1.343 3-3 3m0-12c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3m0-4v2m0 16v2" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-900 text-[#10b981] uppercase tracking-[0.2em] mb-1">Escrow Protocol</p>
              <h4 className="text-[15px] font-900 text-white tracking-tighter">Verified Trust Inbound</h4>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <Field label="Target Client Entity" required>
            <Select name="client_id" required>
              <option value="">Select institutional entity...</option>
              {clientRows.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </Select>
          </Field>
          <Field label="Associated Matter (Optional)">
            <Select name="matter_id">
              <option value="">Independent Escrow</option>
              {matterRows.map(m => <option key={m.id} value={m.id}>{m.matter_number} — {m.title}</option>)}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Inbound Valuation ($)" required>
              <Input name="amount" type="number" step="0.01" min="0.01" placeholder="0.00" required />
            </Field>
            <Field label="Execution Date">
              <Input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </Field>
          </div>
          <Field label="Verification Reference">
            <Input name="reference" placeholder="Check #, Wire ID, etc." />
          </Field>
          <Field label="Institutional Notes">
            <Textarea name="notes" rows={2} placeholder="Additional compliance details..." />
          </Field>
        </div>
      </>,
      onSave: () => toast('Trust deposit reconciled successfully!', 'success'),
    },
    'apply-trust': {
      title: 'Institutional Trust Liquidation', wide: false,
      body: <>
        <div className="bg-[#38bdf8]/5 p-6 rounded-3xl border border-[#38bdf8]/10 mb-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#38bdf8]/10 blur-3xl pointer-events-none group-hover:bg-[#38bdf8]/20 transition-all duration-700" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-900 text-[#38bdf8] uppercase tracking-[0.2em] mb-1">Available Liquid Assets</p>
              <p className="text-[28px] font-900 text-white tracking-tighter">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(data?.balance) || 0)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#38bdf8]/10 border border-[#38bdf8]/20 flex items-center justify-center text-[#38bdf8]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
          </div>
        </div>
        <input type="hidden" name="trust_account_id" value={data?.id} />
        <div className="space-y-4">
          <Field label="Target Unpaid Statement" required>
            <Select name="invoice_id" required>
              <option value="">Select outstanding invoice...</option>
              {lookups?.invoices?.filter(inv => (inv.status !== 'paid' && inv.status !== 'void') && (inv.due_amount > 0)).map(inv => (
                <option key={inv.id} value={inv.id}>{inv.invoice_number} — {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(inv.due_amount))} (Remaining Balance)</option>
              ))}
            </Select>
          </Field>
          <Field label="Liquidation Amount ($)" required>
            <Input name="amount" type="number" step="0.01" min="0.01" max={Number(data?.balance)} placeholder="0.00" required />
          </Field>
          <div className="p-4 rounded-2xl bg-[#f59e0b]/5 border border-[#f59e0b]/10 flex items-center gap-3">
            <svg className="w-4 h-4 text-[#f59e0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <p className="text-[10px] text-[#f59e0b] font-900 uppercase tracking-widest opacity-80">Execution will reduce trust balance and update invoice status.</p>
          </div>
        </div>
      </>,
      onSave: () => toast('Funds successfully liquidated to statement!', 'success'),
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
      title: data ? `Authorize Settlement: ${data.id}` : 'Pay Invoice', wide: false,
      body: <>
        <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/5 mb-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#10b981]/5 blur-3xl" />
          <div className="relative z-10 flex justify-between items-center mb-3">
            <span className="text-[11px] font-900 text-[#8a94a6] uppercase tracking-[0.2em]">Total Outstanding</span>
            <span className="text-2xl font-900 text-[#10b981] tracking-tighter">{data?.amount || '$0.00'}</span>
          </div>
          <p className="text-[11px] text-[#8a94a6] font-500 italic opacity-60">Verified transaction record. Awaiting institutional authorization.</p>
        </div>
        <div className="space-y-4">
          <Field label="Institutional Method">
            <Input value="Institutional Wire / Manual" disabled className="!bg-white/[0.01] !border-white/5 !text-[#8a94a6]" />
          </Field>
          <Field label="Transaction Reference">
            <Input name="payment_reference" defaultValue={`SETTLE-${Date.now().toString().slice(-6)}`} placeholder="Enter bank reference number" />
          </Field>
        </div>
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
        <div className="bg-[#0057c7]/10 p-4 rounded-2xl border border-[#0057c7]/20 text-[13px] text-[#38bdf8] italic leading-relaxed">
          System will scan all matters, contacts, and closed files for potential hits.
        </div>
      </>,
      onSave: () => toast('Conflict check initiated. Standby...', 'info'),
    },
    'view-invoice': {
      title: data ? `Verified Financial Record: ${data.id}` : 'Invoice Preview', wide: false,
      body: <>
        {/* Executive Fintech Header */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0b1f3a] via-[#0057c7] to-[#003d8c] p-8 text-white shadow-2xl border border-white/10 mb-8 group">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#38bdf8]/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_10px_#10b981] animate-pulse" />
                <span className="text-[10px] font-900 uppercase tracking-[0.3em] text-white/70">Authenticated Statement</span>
              </div>
              <h2 className="text-[32px] font-900 tracking-tighter leading-tight mb-1 text-white">Victoria Tulsidas</h2>
              <p className="text-[12px] font-800 text-white/50 uppercase tracking-[0.2em]">Institutional Legal Counsel</p>
            </div>
            <div className="text-right">
              <div className="inline-flex px-4 py-1.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-[10px] font-900 uppercase tracking-[0.2em] mb-6">
                {data?.status || 'Processing'}
              </div>
              <p className="text-[11px] font-900 text-white/40 uppercase tracking-widest mb-1">Total Valuation</p>
              <p className="text-[42px] font-900 tracking-tighter text-white drop-shadow-2xl">{data?.amount}</p>
            </div>
          </div>
        </div>

        {/* Global Action Hub */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={async () => {
              try {
                const { blob, filename } = await api.billing.downloadInvoicePdf(data.dbId);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = filename;
                document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url);
              } catch (e) { toast('Download failed', 'error'); }
            }}
            className="flex-1 py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-white text-[13px] font-800 hover:bg-white/10 hover:border-[#38bdf8]/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <svg className="w-4 h-4 text-[#38bdf8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5 5-5M12 15V3" /></svg>
            Export Archive
          </button>
          <button
            onClick={() => window.print()}
            className="py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center active:scale-[0.98]"
          >
            <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          </button>
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 transition-all hover:bg-white/[0.05] hover:border-white/10 group cursor-default relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#38bdf8]/5 blur-2xl" />
            <p className="text-[10px] font-900 text-[#8a94a6] uppercase tracking-[0.2em] mb-2 opacity-60">Client Entity</p>
            <p className="text-[18px] font-900 text-white tracking-tighter group-hover:text-[#38bdf8] transition-colors">{data?.client}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              <span className="text-[10px] font-900 text-[#8a94a6] uppercase tracking-widest opacity-40">Identity Verified</span>
            </div>
          </div>
          <div className="p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 transition-all hover:bg-white/[0.05] hover:border-white/10 group cursor-default relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#f59e0b]/5 blur-2xl" />
            <p className="text-[10px] font-900 text-[#8a94a6] uppercase tracking-[0.2em] mb-2 opacity-60">Settlement window</p>
            <p className="text-[18px] font-900 text-white tracking-tighter group-hover:text-[#f59e0b] transition-colors">{data?.due}</p>
            <p className="text-[10px] font-900 text-[#f59e0b] mt-4 uppercase tracking-[0.2em] opacity-80">Institutional Term</p>
          </div>
        </div>

        {/* Service Breakdown */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-5 px-4">
            <h4 className="text-[15px] font-900 text-white tracking-tighter flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0057c7]" />
              Statement breakdown
            </h4>
            <span className="text-[10px] font-900 text-[#8a94a6] uppercase tracking-[0.3em] opacity-40">{data?.id}</span>
          </div>

          <div className="space-y-3">
            {data?.items && data.items.length > 0 ? (
              data.items.map((item) => (
                <div key={item.id} className="rounded-[2.5rem] bg-white/[0.02] border border-white/5 p-2 transition-all hover:bg-white/[0.04] hover:border-white/10 group">
                  <div className="px-6 py-5 rounded-[2rem] bg-white/[0.02] flex justify-between items-center">
                    <div className="space-y-1.5">
                      <p className="text-[15px] font-900 text-white tracking-tight group-hover:text-[#38bdf8] transition-colors">{item.description}</p>
                      <div className="flex gap-3 text-[10px] font-900 uppercase tracking-[0.2em] opacity-40">
                        <span className="text-[#38bdf8] opacity-100">Verified Service</span>
                        <span>•</span>
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[18px] font-900 text-white tracking-tighter">${Number(item.amount).toFixed(2)}</p>
                      <p className="text-[9px] font-900 text-[#8a94a6] uppercase tracking-widest opacity-40">Institutional Rate</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[2.5rem] bg-white/[0.02] border border-white/5 p-2 transition-all hover:bg-white/[0.04] group">
                <div className="px-8 py-7 rounded-[2rem] bg-white/[0.02] flex justify-between items-center group transition-all">
                  <div className="space-y-2">
                    <p className="text-[17px] font-900 text-white tracking-tight group-hover:text-[#38bdf8] transition-colors">{data?.desc || 'Institutional Legal Services'}</p>
                    <div className="flex gap-3 text-[10px] font-900 uppercase tracking-[0.2em] opacity-40">
                      <span className="text-[#10b981] opacity-100">Verified Service</span>
                      <span>•</span>
                      <span>Operational Ledger</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[22px] font-900 text-white tracking-tighter">{data?.amount}</p>
                    <p className="text-[9px] font-900 text-[#8a94a6] uppercase tracking-widest opacity-40">Consolidated Valuation</p>
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
      title: 'Calendar Intelligence', wide: false,
      body: (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#0057c7]/5 blur-2xl pointer-events-none group-hover:bg-[#0057c7]/10" />
            <div className="relative z-10">
              <p className="text-[10px] font-900 text-[#8a94a6] uppercase tracking-[0.2em] mb-1 opacity-60">Entry Classification</p>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${data?.type === 'invoice' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : data?.type === 'matter' ? 'bg-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.5)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                <p className="text-[14px] font-900 text-white uppercase tracking-tight">{data?.type || 'General'}</p>
              </div>
            </div>
            <div className="text-right relative z-10">
              <p className="text-[10px] font-900 text-[#8a94a6] uppercase tracking-[0.2em] mb-1 opacity-60">Scheduled Date</p>
              <p className="text-[14px] font-800 text-white tracking-tight">
                {new Date(data?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                <span className="text-[#8a94a6] mx-2 opacity-40">·</span>
                {data?.type === 'invoice' ? 'All Day' : new Date(data?.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="space-y-2 px-1">
            <h4 className="text-[18px] font-900 text-white tracking-tighter leading-snug">{data?.title}</h4>
            {data?.matter_number && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-900 text-[#38bdf8] bg-[#0057c7]/10 border border-[#0057c7]/20 px-3 py-1 rounded-lg uppercase tracking-[0.15em]">
                  Matter: {data.matter_number}
                </span>
                {data.matter_title && (
                  <span className="text-[11px] text-[#8a94a6] font-700 tracking-tight opacity-80">— {data.matter_title}</span>
                )}
              </div>
            )}
          </div>

          {data?.description && (
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 relative group">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#0057c7]/20 group-hover:bg-[#38bdf8]/40 transition-colors" />
              <p className="text-[10px] font-900 text-[#8a94a6] uppercase tracking-[0.2em] mb-3 opacity-60">Intelligence Brief / Notes</p>
              <p className="text-[14px] text-[#b8c2d1] font-500 leading-relaxed whitespace-pre-wrap">{data.description}</p>
            </div>
          )}

          {data?.type === 'invoice' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 shadow-xl group hover:bg-amber-500/10 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/5 blur-xl pointer-events-none" />
                <p className="text-[10px] font-900 text-amber-400 uppercase tracking-[0.2em] mb-2 opacity-60">Financial Value</p>
                <p className="text-[20px] font-900 text-white tracking-tighter relative z-10">₹{data.amount}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 shadow-xl group hover:bg-white/[0.05] transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 blur-xl pointer-events-none" />
                <p className="text-[10px] font-900 text-[#8a94a6] uppercase tracking-[0.2em] mb-2 opacity-60">Ledger Status</p>
                <div className="flex items-center gap-2 relative z-10">
                  <span className={`w-1.5 h-1.5 rounded-full ${String(data.status).toLowerCase() === 'paid' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]'}`} />
                  <p className="text-[14px] font-900 text-white uppercase tracking-widest">{data.status || 'Pending'}</p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex flex-col gap-3">
            {data?.type === 'matter' && data?.matter_id && (
              <button
                onClick={() => { onClose(); navigate(role === 'admin' ? `/admin/matters/${data.matter_id}` : `/lawyer/matters/${data.matter_id}`); }}
                className="btn btn-primary w-full justify-center h-12 text-[11px] font-900 uppercase tracking-widest shadow-[#0057c7]/20 active:scale-[0.98] transition-transform"
              >
                Access Matter Workspace →
              </button>
            )}
            {data?.type === 'invoice' && data?.raw_id && (
              <button
                onClick={() => { onClose(); openModal('view-invoice', { id: data.title.split(' ')[1], dbId: data.raw_id, amount: `₹${data.amount}`, status: data.status, desc: data.description, client: 'See Matter', due: new Date(data.date).toLocaleDateString() }); }}
                className="btn btn-secondary w-full justify-center h-12 text-[11px] font-900 uppercase tracking-widest border-white/10 hover:bg-white/5 active:scale-[0.98] transition-transform"
              >
                Review Full Statement
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
        : type === 'view-invoice' ? 'Acknowledge'
          : type === 'view-event' ? 'Acknowledge'
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

  const navigate = (path) => {
    routerNavigate(path);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#111520] overflow-hidden selection:bg-[#0057c7] selection:text-white">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} role={role} user={user} onToggle={() => setSidebarOpen(o => !o)} onLogout={onLogout}
        badges={sidebarBadges}
        onItemClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Topbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(o => !o)}
          role={role} user={user} onLogout={onLogout} toast={toast} navigate={navigate} />

        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#111520]">
          <div className="w-full px-0 sm:px-6 lg:px-10 py-4 lg:py-8">
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
function LawyerSettingsPage() { const ctx = useOutletContext(); return <LawyerProfilePage {...ctx} />; }
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

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-[#0057c7] border-t-transparent rounded-full animate-spin" />
        <p className="text-[12px] text-[#8a94a6] font-900 uppercase tracking-widest opacity-60">Syncing Trust Assets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/[0.03] border-b border-white/5">
            <tr>
              <th className="px-6 py-4 text-[10px] font-900 text-[#8a94a6] uppercase tracking-[0.2em] opacity-60">Execution Date</th>
              <th className="px-6 py-4 text-[10px] font-900 text-[#8a94a6] uppercase tracking-[0.2em] opacity-60">Transaction Type</th>
              <th className="px-6 py-4 text-[10px] font-900 text-[#8a94a6] uppercase tracking-[0.2em] opacity-60">Matter reference</th>
              <th className="px-6 py-4 text-[10px] font-900 text-[#8a94a6] uppercase tracking-[0.2em] opacity-60">Verification ref</th>
              <th className="px-6 py-4 text-[10px] font-900 text-[#8a94a6] uppercase tracking-[0.2em] opacity-60 text-right">Valuation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {txs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-24 text-center text-[#8a94a6] text-[13px] font-500 italic opacity-40">
                  No verified trust transactions synchronized.
                </td>
              </tr>
            ) : (
              txs.map(tx => {
                const isDeposit = tx.transaction_type === 'deposit';
                return (
                  <tr key={tx.id} className="hover:bg-white/[0.03] transition-all group">
                    <td className="px-6 py-5 text-[13px] text-[#8a94a6] font-800 tracking-tighter whitespace-nowrap opacity-60 group-hover:opacity-100">{new Date(tx.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-5">
                      <div className={`inline-flex px-3 py-1 rounded-lg border text-[10px] font-900 uppercase tracking-widest ${isDeposit ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-[#0057c7]/10 text-[#38bdf8] border-[#0057c7]/20'}`}>
                        {tx.transaction_type.replace(/_/g, ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[13px] font-900 text-white tracking-tighter">{tx.matter?.matter_number || '—'}</p>
                      <p className="text-[10px] text-[#8a94a6] font-800 uppercase tracking-widest opacity-40">System Reference</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[12px] text-[#8a94a6] font-700 max-w-[200px] truncate opacity-40 group-hover:opacity-100 transition-opacity">{tx.reference || tx.notes || '—'}</p>
                    </td>
                    <td className={`px-6 py-5 text-right font-900 text-[16px] tracking-tighter ${isDeposit ? 'text-emerald-400' : 'text-white'}`}>
                      {isDeposit ? '+' : '-'}{formatUsd(tx.amount)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Institutional Note */}
      <div className="px-6 py-4 rounded-2xl bg-[#0057c7]/5 border border-[#0057c7]/10 flex items-center gap-3">
        <svg className="w-5 h-5 text-[#38bdf8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <p className="text-[11px] text-[#38bdf8] font-700 uppercase tracking-widest opacity-80">This ledger represents verified trust account movements and is immutable upon reconciliation.</p>
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
