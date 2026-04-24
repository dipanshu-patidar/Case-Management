import { useState, useEffect, useCallback, useRef } from 'react';
import { Avatar } from './UI.jsx';
import api from '../services/api';

const ROLE_INFO = {
  admin: { name: 'Admin User', role: 'Administrator', initials: 'AU', color: 'linear-gradient(135deg,#0B1F3A,#C9A24A)' },
  lawyer: { name: 'Alex Parker', role: 'Lawyer', initials: 'AP', color: 'linear-gradient(135deg,#0B1F3A,#C9A24A)' },
  client: { name: 'Sarah Mitchell', role: 'Client Portal', initials: 'SM', color: 'linear-gradient(135deg,#10b981,#059669)' },
};

const NOTIF_CONFIG = {
  document: { icon: '📄', color: 'bg-blue-50 text-blue-600' },
  deadline: { icon: '📅', color: 'bg-amber-50 text-amber-600' },
  client:   { icon: '👤', color: 'bg-emerald-50 text-emerald-600' },
  system:   { icon: '🔔', color: 'bg-indigo-50 text-indigo-600' },
};


export default function Topbar({ sidebarOpen, onToggleSidebar, role, onLogout, toast, navigate, user }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Search Logic
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.search.global(searchQuery);
        setSearchResults(res.data || []);
        setShowResults(true);
      } catch (err) {
        console.error('Global search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  const info = ROLE_INFO[role?.toLowerCase()] || ROLE_INFO.client;
  const displayName = user?.full_name || user?.name || info.name;
  const displayInitials = displayName.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().substring(0, 2);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.notifications.list();
      setNotifs(Array.isArray(res?.data) ? res.data : []);
      const countRes = await api.notifications.unreadCount();
      setUnreadCount(countRes?.data?.unread_count ?? 0);
    } catch (e) {
      console.error('Failed to fetch notifications', e);
      toast('Could not sync notifications', 'error');
    }
  }, [toast]);

  useEffect(() => {
    fetchNotifications();
    window.addEventListener('vktori:entities-changed', fetchNotifications);
    window.addEventListener('vktori:notifications-refresh', fetchNotifications);
    return () => {
      window.removeEventListener('vktori:entities-changed', fetchNotifications);
      window.removeEventListener('vktori:notifications-refresh', fetchNotifications);
    };
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notif) => {
    try {
      if (!notif.is_read) {
        await api.notifications.markRead(notif.id);
        fetchNotifications();
      }
      
      // Navigate based on notification type
      const baseRole = role?.toLowerCase() || 'admin';
      const refId = notif.reference_id;
      
      if (refId) {
        switch (notif.type) {
          case 'document':
            navigate(`/${baseRole}/matters/${refId}?tab=Documents`);
            break;
          case 'deadline':
            navigate(`/${baseRole}/matters/${refId}?tab=Tasks`);
            break;
          case 'system':
            // Usually message notifications
            navigate(`/${baseRole}/matters/${refId}?tab=Messages`);
            break;
          case 'client':
            // Lead notification
            if (baseRole === 'admin') {
              navigate(`/admin/intake-leads/${refId}`);
            }
            break;
          case 'invoice':
            navigate(`/${baseRole}/matters/${refId}?tab=Billing`);
            break;
          default:
            // Fallback for system or unknown types if reference_id is a matter
            navigate(`/${baseRole}/matters/${refId}`);
        }
      }
      
      setShowNotifs(false);
    } catch (e) {
      toast('Failed to handle notification', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllRead();
      toast('All notifications marked as read', 'success');
      fetchNotifications();
    } catch (e) {
      toast('Failed to mark all read', 'error');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all notifications?')) return;
    try {
      await api.notifications.clearAll();
      setNotifs([]);
      setUnreadCount(0);
      toast('Notifications cleared', 'success');
      fetchNotifications();
    } catch (e) {
      toast('Failed to clear notifications', 'error');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await api.notifications.remove(id);
      setNotifs(prev => prev.filter(n => n.id !== id));
      fetchNotifications();
    } catch (e) {
      toast('Failed to delete notification', 'error');
    }
  };

  const formatNotifTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/60 flex items-center px-4 gap-4 flex-shrink-0 relative z-50">
      <button onClick={onToggleSidebar}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-all active:scale-95">
        <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
      </button>

      {/* Global Search - adaptive for mobile */}
      <div className="flex items-center gap-2 sm:gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-2 sm:px-3.5 py-1.5 sm:py-2 flex-1 max-w-[160px] sm:max-w-sm transition-all focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-50 focus-within:border-primary-200 relative">
        <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
        <input 
          className="bg-transparent border-none outline-none text-[12px] sm:text-[13.5px] text-slate-700 w-full placeholder:text-slate-400 font-500" 
          placeholder="Search..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
        />
        
        {showResults && (searchQuery.trim().length >= 2 || isSearching) && (
          <div ref={searchRef} className="absolute top-12 left-0 w-[calc(100vw-2rem)] sm:w-full bg-white rounded-2xl shadow-2xl border border-slate-200 animate-fade-in overflow-hidden z-[100] max-h-[400px] overflow-y-auto">
            {isSearching ? (
              <div className="p-6 flex flex-col items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] text-slate-400 font-600 uppercase tracking-widest">Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-1.5 bg-slate-50 border-y border-slate-100 mb-1">
                  <p className="text-[10px] font-800 text-slate-400 uppercase tracking-widest">Top Results</p>
                </div>
                {searchResults.map((res, i) => (
                  <div 
                    key={`${res.type}-${res.id}-${i}`}
                    onClick={() => {
                      navigate(res.url);
                      setShowResults(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50/50 cursor-pointer transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-sm group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                      {res.type === 'Matter' ? '📁' : res.type === 'Client' ? '👤' : res.type === 'Document' ? '📄' : '📥'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-600 text-slate-900 group-hover:text-primary-700 transition-colors truncate">{res.title}</p>
                        <span className="text-[9px] font-800 uppercase tracking-widest px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-600">{res.type}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{res.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-2xl mb-2">🔍</p>
                <p className="text-[13px] text-slate-500 font-500">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 ml-auto">
        {/* Timer - only for lawyers */}

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
            className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl transition-all active:scale-95 relative ${showNotifs ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-100'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-primary-600 text-white text-[7px] sm:text-[8px] font-800 rounded-full flex items-center justify-center border-2 border-white shadow-sm">{unreadCount}</span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 animate-fade-in overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-[14px] font-700 text-slate-900">Notifications</h4>
                  {unreadCount > 0 && <span className="text-[11px] bg-primary-50 text-primary-600 font-700 px-2 py-0.5 rounded-lg">{unreadCount}</span>}
                </div>
                {notifs.length > 0 && (
                  <button onClick={handleClearAll} className="text-[11px] text-slate-400 hover:text-red-500 font-700 transition-colors uppercase tracking-wider">Clear All</button>
                )}
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {notifs.length > 0 ? notifs.map(n => {
                  const cfg = NOTIF_CONFIG[n.type] || NOTIF_CONFIG.system;
                  return (
                    <div key={n.id} onClick={() => handleMarkAsRead(n)}
                      className={`flex items-start gap-3.5 px-4 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors group relative ${!n.is_read ? 'bg-primary-50/20' : ''}`}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${cfg.color}`}>{cfg.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-slate-700 leading-snug font-500">{n.title}</p>
                        <p className="text-[12px] text-slate-500 mt-0.5 truncate">{n.message}</p>
                        <p className="text-[11px] text-slate-400 mt-1">{formatNotifTime(n.created_at)}</p>
                      </div>
                      <div className="flex flex-col items-center gap-2 flex-shrink-0">
                        {!n.is_read && <div className="w-2 h-2 bg-primary-500 rounded-full shadow-sm shadow-primary-500/50" />}
                        <button onClick={(e) => handleDelete(e, n.id)} 
                          className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <span className="text-2xl">🔔</span>
                    <p className="text-[12px]">All caught up!</p>
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-slate-100 bg-slate-50">
                <button onClick={handleMarkAllRead} className="text-[12px] text-primary-600 font-700 hover:bg-white w-full py-2 rounded-lg transition-all border border-transparent hover:border-slate-200">Mark all as read</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
            className={`flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl transition-all active:scale-95 ${showProfile ? 'bg-primary-50 ring-2 ring-primary-100' : 'hover:bg-slate-100'}`}>
            <Avatar initials={displayInitials} size="sm" color={info.color} />
            <div className="hidden sm:block text-left">
              <p className="text-[12px] sm:text-[13px] font-700 text-slate-900 leading-tight">{displayName}</p>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-500">{info.role}</p>
            </div>
            <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 transition-transform ${showProfile ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><polyline points="6 9 12 15 18 9" /></svg>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 animate-fade-in overflow-hidden z-50">
              <div className="px-4 py-4 border-b border-slate-100 bg-slate-50/50">
                <p className="text-[14px] font-700 text-slate-900">{displayName}</p>
                <p className="text-[11px] text-slate-400 font-500">{info.role}</p>
              </div>
              <div className="p-1.5">
                {[
                  { label: '⚙️ Settings', id: 'settings' }
                ].map((item) => (
                  <button key={item.id} onClick={() => { setShowProfile(false); navigate(`/${role}/${item.id}`); }}
                    className="w-full px-3 py-2.5 text-left text-[13.5px] font-600 text-slate-600 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all flex items-center gap-2">{item.label}</button>
                ))}
              </div>
              <div className="p-1.5 border-t border-slate-100">
                <button onClick={() => { setShowProfile(false); onLogout(); }}
                  className="w-full px-3 py-2.5 text-left text-[13.5px] font-700 text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center gap-2">
                  🚪 Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {(showNotifs || showProfile) && (
        <div className="fixed inset-0 z-40" onClick={() => { setShowNotifs(false); setShowProfile(false); }} />
      )}
    </header>
  );
}
