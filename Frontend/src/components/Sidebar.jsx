import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar } from './UI.jsx';
import logoImg from '../assets/WhatsApp Image 2026-04-13 at 11.01.36 AM-Photoroom.png';

// ── Nav Icon ──────────────────────────────────────────────
const NAV_ICONS = {
  dashboard: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>,
  clients: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  cases: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>,
  calendar: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  documents: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
  billing: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  email: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
  ai: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  leads: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" /></svg>,
  marketing: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>,
  reports: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
  users: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  settings: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
  messages: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  profile: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
};

const NAV_BY_ROLE = {
  admin: [
    { section: 'Main' },
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
    { id: 'leads', label: 'Intake / Leads', icon: 'leads', path: '/admin/intake-leads' },
    { id: 'clients', label: 'Clients', icon: 'clients', path: '/admin/clients' },
    { id: 'cases', label: 'Matters', icon: 'cases', path: '/admin/matters' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar', path: '/admin/calendar' },
    { section: 'Workspace' },
    { id: 'documents', label: 'Documents', icon: 'documents', path: '/admin/documents' },
    { id: 'billing', label: 'Billing', icon: 'billing', path: '/admin/billing' },
    { id: 'email', label: 'Communications', icon: 'email', path: '/admin/communications' },
    { id: 'ai', label: 'VyNius', icon: 'ai', path: '/admin/vynius' },
    { section: 'Growth' },
    { id: 'marketing', label: 'Marketing', icon: 'marketing', path: '/admin/marketing' },
    { id: 'reports', label: 'Reports', icon: 'reports', path: '/admin/reports' },
    { section: 'Admin' },
    { id: 'users', label: 'Users', icon: 'users', path: '/admin/users' },
    { id: 'settings', label: 'Settings', icon: 'settings', path: '/admin/settings' },
  ],
  lawyer: [
    { section: 'My Work' },
    { id: 'l-dashboard', label: 'Dashboard', icon: 'dashboard', path: '/lawyer/dashboard' },
    { id: 'l-clients', label: 'My Clients', icon: 'clients', path: '/lawyer/clients' },
    { id: 'l-cases', label: 'My Matters', icon: 'cases', path: '/lawyer/matters' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar', path: '/lawyer/calendar' },
    { section: 'Tools' },
    { id: 'documents', label: 'Documents', icon: 'documents', path: '/lawyer/documents' },
    { id: 'billing', label: 'Billing', icon: 'billing', path: '/lawyer/billing' },
    { id: 'email', label: 'Email', icon: 'email', path: '/lawyer/email' },
    { id: 'ai', label: 'VyNius', icon: 'ai', path: '/lawyer/vynius' },
    { section: 'Account' },
    { id: 'l-profile', label: 'My Profile', icon: 'profile', path: '/lawyer/profile' },
  ],
  client: [
    { section: 'My Portal' },
    { id: 'c-dashboard', label: 'Dashboard', icon: 'dashboard', path: '/client/dashboard' },
    { id: 'c-cases', label: 'My Matters', icon: 'cases', path: '/client/matters' },
    { id: 'c-documents', label: 'Documents', icon: 'documents', path: '/client/documents' },
    { id: 'c-billing', label: 'Billing', icon: 'billing', path: '/client/billing' },
    { id: 'c-messages', label: 'Messages', icon: 'messages', path: '/client/messages' },
    { section: 'Account' },
    { id: 'c-profile', label: 'My Profile', icon: 'profile', path: '/client/profile' },
  ],
};

const ROLE_INFO = {
  admin: { name: 'Admin User', role: 'Administrator', initials: 'AU', color: 'linear-gradient(135deg,#0B1F3A,#C9A24A)' },
  lawyer: { name: 'Alex Parker', role: 'Lawyer', initials: 'AP', color: 'linear-gradient(135deg,#0B1F3A,#C9A24A)' },
  client: { name: 'Sarah Mitchell', role: 'Client', initials: 'SM', color: 'linear-gradient(135deg,#10b981,#059669)' },
};

export default function Sidebar({ open, role, user, onToggle, onLogout, onItemClick, badges = {} }) {
  const info = ROLE_INFO[role?.toLowerCase()] || ROLE_INFO.client;
  const displayName = user?.full_name || user?.name || info.name;
  const displayInitials = displayName.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().substring(0, 2);
  const navItems = NAV_BY_ROLE[role?.toLowerCase()] || NAV_BY_ROLE.admin;

  return (
    <aside className={`flex flex-col h-screen bg-slate-50 border-r border-slate-200/60 flex-shrink-0 transition-all duration-300 ease-in-out relative ${open ? 'w-64 sm:w-56' : 'w-16'} overflow-hidden shadow-[1px_0_10px_rgba(0,0,0,0.02)]`}>

      {/* Brand + Toggle */}
      <div className={`flex items-center h-16 ${open ? 'px-4' : 'px-0 justify-center'} border-b border-slate-100 gap-3 flex-shrink-0 bg-white/50 backdrop-blur-sm`}>
        <div className={`transition-all duration-300 ${open ? 'w-14 h-14' : 'w-10 h-10'} flex items-center justify-center overflow-hidden`}>
          <img src={logoImg} alt="VkTori Logo" className="w-full h-full object-contain scale-110" />
        </div>
        {open && <span className="text-slate-900 font-display font-800 text-[19px] whitespace-nowrap leading-none tracking-tight">VkTori</span>}
        <button onClick={onToggle}
          className={`${open ? 'ml-auto' : ''} w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-all duration-250 shadow-sm flex-shrink-0`}
          title={open ? 'Collapse sidebar' : 'Expand sidebar'}>
          {open
            ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="m15 18-6-6 6-6" /></svg>
            : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="m9 18 6-6-6-6" /></svg>
          }
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1">
        {navItems.map((item, i) => {
          if (item.section) {
            return open
              ? <p key={i} className="text-[10px] font-700 uppercase tracking-[0.1em] text-slate-400 px-3 py-2 mt-4 first:mt-0">{item.section}</p>
              : <div key={i} className="h-px bg-slate-100 mx-2 my-3" />;
          }
          return (
            <NavLink key={item.id} to={item.path} onClick={onItemClick}
              className={({ isActive }) => `sidebar-link w-full ${isActive ? 'active' : ''} ${!open ? 'justify-center' : ''}`}
              title={!open ? item.label : ''}>
              {({ isActive }) => (
                <>
                  <span className={`flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-slate-400'}`}>{NAV_ICONS[item.icon]}</span>
                  {open && <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100 bg-white/30 backdrop-blur-sm flex-shrink-0 space-y-1.5">
        {open ? (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white border border-slate-100 shadow-sm">
            <Avatar initials={displayInitials} size="sm" color={info.color} />
            <div className="min-w-0">
              <p className="text-[13px] font-700 text-slate-900 truncate">{displayName}</p>
              <p className="text-[11px] text-slate-400 font-500">{info.role}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <Avatar initials={displayInitials} size="sm" color={info.color} />
          </div>
        )}
        <button onClick={onLogout}
          className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 text-[13px] font-600 ${!open ? 'justify-center' : ''}`}
          title="Logout">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          {open && 'Sign Out'}
        </button>
      </div>
    </aside>
  );
}
