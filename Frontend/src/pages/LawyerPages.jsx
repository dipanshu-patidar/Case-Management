import { useState, useEffect, useRef } from 'react';
import { Badge, StatCard, PageHeader, Card, Table, Tr, Td, Avatar, Field, Input, Textarea } from '../components/UI.jsx';
import api from '../services/api';

// ─────────────────────────────────────────────────────────
//  LAWYER DASHBOARD
// ─────────────────────────────────────────────────────────
export function LawyerDashboard({ navigate, toast, openModal }) {
  const [dashboard, setDashboard] = useState(null);
  const [matters, setMatters] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const stoppingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const user = JSON.parse(localStorage.getItem('vktori_user') || 'null');
        const lawyerId = user?.id;
        const [dashRes, matterRes, clientRes, timerRes] = await Promise.all([
          api.dashboard.lawyer(),
          api.matters.list({ lawyer_id: lawyerId, limit: 8 }),
          api.clients.list({ limit: 20 }),
          api.timers.active(),
        ]);
        if (cancelled) return;
        setDashboard(dashRes.data || null);
        setMatters(Array.isArray(matterRes.data) ? matterRes.data : []);
        setClients(Array.isArray(clientRes.data) ? clientRes.data : []);
        if (timerRes.data) setActiveTimer(timerRes.data);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load dashboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!activeTimer) {
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
  }, [activeTimer]);

  const stopTimer = async () => {
    const token = localStorage.getItem('vktori_token');
    if (!activeTimer || stoppingRef.current || !token) return;
    stoppingRef.current = true;
    try {
      await api.timers.stop(activeTimer.id);
      setActiveTimer(null);
      setTimerSeconds(0);
      toast('Timer stopped successfully', 'success');
      window.dispatchEvent(new Event('vktori:entities-changed'));
    } catch (e) {
      if (!e.message?.includes('already stopped')) {
        toast(e.message || 'Failed to stop timer', 'error');
      }
    } finally {
      stoppingRef.current = false;
    }
  };

  const formatTimer = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return [h, m, sec].map(v => String(v).padStart(2, '0')).join(':');
  };

  if (loading) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[13px] text-slate-500">Loading lawyer dashboard...</p>
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

  const counters = dashboard?.counters || {};

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="My Dashboard" subtitle="Assigned matters, activity, and workload overview.">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {activeTimer && (
            <div className="flex items-center gap-3 bg-red-50 px-4 py-1.5 rounded-xl border border-red-100 animate-pulse-slow">
              <div className="text-left">
                <p className="text-[9px] text-red-500 font-800 uppercase tracking-widest leading-none">Active Timer</p>
                <p className="text-[13px] font-mono font-700 text-red-700 leading-tight">{formatTimer(timerSeconds)}</p>
              </div>
              <button 
                onClick={stopTimer}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition-all shadow-sm"
                title="Stop Tracking"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
              </button>
            </div>
          )}
          <button onClick={() => openModal('add-case')} className="btn btn-primary">+ New Matter</button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="My Clients" value={String(counters.clientCount ?? clients.length)} icon="👥" iconBg="bg-blue-50" gradient="linear-gradient(90deg,#0B1F3A,#C9A24A)" />
        <StatCard label="Assigned Matters" value={String(counters.assignedMatters ?? matters.length)} icon="📁" iconBg="bg-emerald-50" gradient="linear-gradient(90deg,#10b981,#34d399)" />
        <StatCard label="Pending Items" value={String(counters.openDrafts ?? 0)} icon="📝" iconBg="bg-amber-50" gradient="linear-gradient(90deg,#f59e0b,#fbbf24)" />
        <StatCard label="Messages Sent" value={String(counters.messagesSent ?? 0)} icon="✉️" iconBg="bg-accent-50" gradient="linear-gradient(90deg,#0B1F3A,#C9A24A)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* My Cases */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-600 text-slate-900">My Active Matters</h3>
            <button onClick={() => navigate('/lawyer/matters')} className="text-[12px] text-primary-600 hover:underline font-500">View all →</button>
          </div>
          <div className="space-y-1">
            {matters.slice(0, 4).map((m) => (
              <div key={m.id} onClick={() => navigate(`/lawyer/matters/${m.id}`)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${m.status==='active'?'bg-emerald-500':m.status==='pending'?'bg-amber-500':'bg-slate-300'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-500 text-slate-800 truncate group-hover:text-primary-600">{m.title}</p>
                  <p className="text-[11px] text-slate-400">{m.matter_number}</p>
                </div>
                <Badge status={m.status} />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent activity */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-600 text-slate-900">Recent Activity</h3>
          </div>
          <div className="space-y-1.5">
            {(dashboard?.assignedMatters || []).slice(0, 4).map((m) => (
              <div key={m.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-slate-700 truncate">{m.matter_number} · {m.title}</p>
                  <p className="text-[11px] text-slate-400">Status: {m.status}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Hearings */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-600 text-slate-900">Upcoming Hearings</h3>
            <button onClick={() => navigate('/lawyer/calendar')} className="text-[12px] text-primary-600 hover:underline">Calendar →</button>
          </div>
          <div className="py-6 text-center">
            <p className="text-[12px] text-slate-400 italic">No hearing schedule data available.</p>
          </div>
        </Card>

        {/* My Clients */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-600 text-slate-900">My Clients</h3>
            <button onClick={() => navigate('/lawyer/clients')} className="text-[12px] text-primary-600 hover:underline">View all →</button>
          </div>
          <div className="space-y-1">
            {clients.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                <Avatar initials={(c.full_name || '').split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2) || '?'} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-500 text-slate-800 truncate">{c.full_name}</p>
                  <p className="text-[11px] text-slate-400">{c._count?.matters || 0} matter(s)</p>
                </div>
                <Badge status={c.is_portal_enabled ? 'active' : 'pending'} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  LAWYER CASES
// ─────────────────────────────────────────────────────────
export function LawyerCasesPage({ navigate, toast, openModal }) {
  const [myCases, setMyCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const user = JSON.parse(localStorage.getItem('vktori_user') || 'null');
        const res = await api.matters.list({ lawyer_id: user?.id, limit: 500 });
        if (!cancelled) setMyCases(Array.isArray(res.data) ? res.data : []);
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
      <PageHeader title="My Matters" subtitle={`${myCases.length} matters assigned to you`}>
        <button onClick={() => openModal('add-case')} className="btn btn-primary">+ New Matter</button>
      </PageHeader>
      <Table headers={['Matter ID','Title','Client','Type','Status','Next Hearing','Priority','']}>
        {myCases.map(c => (
          <Tr key={c.id}>
            <Td className="whitespace-nowrap"><span className="font-mono text-[12px] text-primary-600">{c.matter_number}</span></Td>
            <Td className="font-500 text-slate-900 hover:text-primary-600 max-w-[180px] truncate whitespace-nowrap">{c.title}</Td>
            <Td className="whitespace-nowrap">{c.client?.full_name || '—'}</Td>
            <Td className="whitespace-nowrap"><span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{c.matter_type || c.practice_area}</span></Td>
            <Td className="whitespace-nowrap"><Badge status={c.status} /></Td>
            <Td className="text-slate-500 text-[12px] whitespace-nowrap">{c.next_hearing ? new Date(c.next_hearing).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</Td>
            <Td className="whitespace-nowrap"><Badge status="medium" /></Td>
            <Td className="whitespace-nowrap">
              <button onClick={e => { e.stopPropagation(); navigate(`/lawyer/matters/${c.id}`); }} className="btn btn-secondary p-1.5" title="View">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </Td>
          </Tr>
        ))}
      </Table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  LAWYER CLIENTS
// ─────────────────────────────────────────────────────────
export function LawyerClientsPage({ navigate, toast, openModal }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.clients.list({ limit: 500 });
        if (!cancelled) setClients(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load clients');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="text-[13px] text-slate-500 p-4">Loading clients...</div>;
  if (error) return <Card className="border-red-200 bg-red-50/50"><p className="text-[13px] text-red-800 font-600">{error}</p></Card>;

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="My Clients" subtitle="Clients under your representation">
        <button onClick={() => toast('Client creation is managed by admin.', 'info')} className="btn btn-primary">+ Add Client</button>
      </PageHeader>
      <Table headers={['Client','Email','Type','Cases','Status','Joined','']}>
        {clients.map(c => (
          <Tr key={c.id}>
            <Td className="whitespace-nowrap"><div className="flex items-center gap-2"><Avatar initials={(c.full_name || '').split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2) || '?'} size="sm" /><div className="whitespace-nowrap"><p className="font-500 text-slate-900">{c.full_name}</p><p className="text-[11px] text-slate-400">{c.id}</p></div></div></Td>
            <Td className="text-slate-500 text-[12px] whitespace-nowrap">{c.email}</Td>
            <Td className="whitespace-nowrap"><span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{c.is_portal_enabled ? 'Portal' : 'Standard'}</span></Td>
            <Td className="font-600 whitespace-nowrap">{c._count?.matters || 0}</Td>
            <Td className="whitespace-nowrap"><Badge status={c.is_portal_enabled ? 'active' : 'pending'} /></Td>
            <Td className="text-slate-400 text-[12px] whitespace-nowrap">{c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}</Td>
            <Td className="whitespace-nowrap">
              <button onClick={e => { e.stopPropagation(); navigate(`/lawyer/clients/${c.id}`); }} className="btn btn-secondary p-1.5" title="View">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </Td>
          </Tr>
        ))}
      </Table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  LAWYER PROFILE PAGE
// ─────────────────────────────────────────────────────────
export function LawyerProfilePage({ toast }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ full_name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.auth.getMe();
        if (!cancelled) {
          const u = res.data;
          setUser(u);
          setForm({
            full_name: u?.full_name || '',
            email: u?.email || '',
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

  const saveProfile = async () => {
    if (!user?.id) return;
    try {
      setUpdatingProfile(true);
      await api.users.update(user.id, form);
      toast('Profile information updated', 'success');
      // Update local user data if stored
      const stored = JSON.parse(localStorage.getItem('vktori_user') || '{}');
      localStorage.setItem('vktori_user', JSON.stringify({ ...stored, ...form }));
      window.dispatchEvent(new CustomEvent('vktori:entities-changed'));
    } catch (e) {
      toast(e.message || 'Save failed', 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!currentPassword || !newPassword) {
      return toast('Please fill in password fields', 'error');
    }
    if (newPassword !== confirmPassword) {
      return toast('New passwords do not match', 'error');
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

  const initials = (name) => (name || '').split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="My Profile" subtitle="Manage your account information and security" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="text-center h-fit">
          <Avatar initials={initials(form.full_name)} size="xl" />
          <h3 className="text-[16px] font-700 text-slate-900 mt-3">{form.full_name || 'Lawyer'}</h3>
          <p className="text-[12px] text-slate-400 mb-2">Member Since {user?.created_at ? new Date(user.created_at).getFullYear() : '—'}</p>
          <Badge status="active" />
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <h3 className="text-[14px] font-600 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <Field label="Full Name">
                <Input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} />
              </Field>
              <Field label="Email Address">
                <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </Field>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={saveProfile} disabled={updatingProfile} className="btn btn-primary">
                {updatingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </Card>

          <Card>
            <h3 className="text-[14px] font-600 mb-4">Security & Password</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <Field label="Current Password">
                <Input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))} />
              </Field>
              <div className="hidden sm:block"></div>
              <Field label="New Password">
                <Input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))} />
              </Field>
              <Field label="Confirm New Password">
                <Input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))} />
              </Field>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={handlePasswordChange} disabled={updatingPassword} className="btn btn-secondary">
                {updatingPassword ? 'Updating...' : 'Change Password'}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
