import { API_BASE_URL } from '../config/env';

function buildQuery(params) {
  if (!params) return '';
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : '';
}

/**
 * Reusable fetch helper for API requests
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('vktori_token');
  const isFormData = options.body instanceof FormData;
  
  const headers = {
    ...options.headers,
  };
  if (!isFormData) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (!isFormData && config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (options.responseType === 'blob') {
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Download failed');
      }
      const blob = await response.blob();
      return { data: blob };
    }

    const text = await response.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        const error = new Error(
          response.ok
            ? 'Invalid response from server'
            : (text.slice(0, 120) || `Request failed (${response.status})`)
        );
        error.status = response.status;
        throw error;
      }
    }

    if (!response.ok) {
      const msg = (data && data.message) || `Request failed (${response.status})`;
      const error = new Error(msg);
      error.status = response.status;
      throw error;
    }

    if (data && data.success === false) {
      const error = new Error(data.message || 'Request failed');
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (err) {
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      const wrapped = new Error(`Cannot reach the server. Is the API running at ${API_BASE_URL}?`);
      wrapped.cause = err;
      console.error(`API Error [${endpoint}]:`, wrapped);
      throw wrapped;
    }
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

async function requestBlob(endpoint, options = {}) {
  const token = localStorage.getItem('vktori_token');
  const headers = {
    ...options.headers,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const config = {
    ...options,
    headers,
  };
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  if (!response.ok) {
    let msg = `Request failed (${response.status})`;
    try {
      const errJson = await response.json();
      msg = errJson?.message || msg;
    } catch {
      // ignore JSON parse errors for binary responses
    }
    const error = new Error(msg);
    error.status = response.status;
    throw error;
  }
  const blob = await response.blob();
  return {
    blob,
    filename: response.headers.get('x-filename') || null,
    contentType: response.headers.get('content-type') || null,
  };
}

export const authAPI = {
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: credentials,
  }),
  getMe: () => request('/auth/me'),
  changePassword: (body) => request('/auth/change-password', {
    method: 'PATCH',
    body,
  }),
};

export const dashboardAPI = {
  admin: () => request('/dashboard/admin'),
  lawyer: () => request('/dashboard/lawyer'),
  client: () => request('/dashboard/client'),
};

export const leadsAPI = {
  list: (params) => request(`/leads${buildQuery(params)}`),
  get: (id) => request(`/leads/${id}`),
  /** Public (no auth). Website Book Consultation form. */
  publicConsultation: (body) => request('/leads/public/consultation', { method: 'POST', body }),
  /** Public (no auth). Website Transmittal of Inquiry form. */
  publicInquiry: (body) => request('/leads/public/inquiry', { method: 'POST', body }),
  create: (body) => request('/leads', { method: 'POST', body }),
  update: (id, body) => request(`/leads/${id}`, { method: 'PUT', body }),
  remove: (id) => request(`/leads/${id}`, { method: 'DELETE' }),
  convert: (id) => request(`/leads/${id}/convert`, { method: 'POST', body: {} }),
};

export const clientsAPI = {
  list: (params) => request(`/clients${buildQuery(params)}`),
  get: (id) => request(`/clients/${id}`),
  create: (body) => request('/clients', { method: 'POST', body }),
  update: (id, body) => request(`/clients/${id}`, { method: 'PUT', body }),
  remove: (id) => request(`/clients/${id}`, { method: 'DELETE' }),
};

export const mattersAPI = {
  list: (params) => request(`/matters${buildQuery(params)}`),
  get: (id) => request(`/matters/${id}`),
  create: (body) => request('/matters', { method: 'POST', body }),
  update: (id, body) => request(`/matters/${id}`, { method: 'PUT', body }),
  remove: (id) => request(`/matters/${id}`, { method: 'DELETE' }),
};

export const documentsAPI = {
  list: (params) => request(`/documents${buildQuery(params)}`),
  get: (id) => request(`/documents/${id}`),
  download: (id) => requestBlob(`/documents/${id}/download`),
  create: (body) => request('/documents', { method: 'POST', body }),
  update: (id, body) => request(`/documents/${id}`, { method: 'PUT', body }),
  remove: (id) => request(`/documents/${id}`, { method: 'DELETE' }),
};

export const communicationsAPI = {
  list: (params) => request(`/communications${buildQuery(params)}`),
  get: (id) => request(`/communications/${id}`),
  create: (body) => request('/communications', { method: 'POST', body }),
  markRead: (id) => request(`/communications/${id}/read`, { method: 'PATCH' }),
  markMatterRead: (matterId) => request(`/communications/matter/${matterId}/read`, { method: 'PATCH' }),
  update: (id, body) => request(`/communications/${id}`, { method: 'PUT', body }),
  remove: (id) => request(`/communications/${id}`, { method: 'DELETE' }),
};

export const billingAPI = {
  listInvoices: (params) => request(`/billing${buildQuery(params)}`),
  getInvoice: (id) => request(`/billing/${id}`),
  /** Authenticated PDF (use blob; do not open API URL directly). */
  downloadInvoicePdf: (id) => requestBlob(`/billing/${id}/pdf`),
  createInvoice: (body) => request('/billing', { method: 'POST', body }),
  payInvoice: (id, body) => request(`/billing/${id}/pay`, { method: 'POST', body }),
  updateInvoice: (id, body) => request(`/billing/${id}`, { method: 'PUT', body }),
  removeInvoice: (id) => request(`/billing/${id}`, { method: 'DELETE' }),
  
  // Trust Accounts
  listTrustAccounts: () => request('/billing/trust-accounts'),
  getTrustTransactions: (id) => request(`/billing/trust-accounts/${id}/transactions`),
  depositTrust: (body) => request('/billing/trust-accounts/deposit', { method: 'POST', body }),
  applyTrustToInvoice: (body) => request('/billing/trust-accounts/apply', { method: 'POST', body }),
};

export const draftsAPI = {
  list: (params) => request(`/drafts${buildQuery(params)}`),
  get: (id) => request(`/drafts/${id}`),
  create: (body) => request('/drafts', { method: 'POST', body }),
  update: (id, body) => request(`/drafts/${id}`, { method: 'PUT', body }),
  remove: (id) => request(`/drafts/${id}`, { method: 'DELETE' }),
  sign: (id, body) => request(`/drafts/${id}/sign`, { method: 'POST', body }),
};

export const marketingAPI = {
  overview: () => request('/marketing/overview'),
  sources: () => request('/marketing/sources'),
  getSocialLinks: () => request('/public/social-links'),
  updateSocialLinks: (links) => request('/admin/social-links', { method: 'PUT', body: links }),
};

export const usersAPI = {
  list: () => request('/users'),
  get: (id) => request(`/users/${id}`),
  create: (body) => request('/users', { method: 'POST', body }),
  update: (id, body) => request(`/users/${id}`, { method: 'PUT', body }),
  remove: (id) => request(`/users/${id}`, { method: 'DELETE' }),
};

export const conflictsAPI = {
  check: (body) => request('/conflicts/check', { method: 'POST', body }),
  list: () => request('/conflicts'),
};

export const timersAPI = {
  start: (matter_id) => request('/timers/start', { method: 'POST', body: { matter_id } }),
  stop: (id) => request(`/timers/${id}/stop`, { method: 'POST' }),
  active: () => request('/timers/active'),
  list: (params) => request(`/timers${buildQuery(params)}`),
};

export const reportsAPI = {
  generate: (body) => request('/reports/generate', { method: 'POST', body }),
  list: () => request('/reports'),
  get: (id) => request(`/reports/${id}`),
  download: (id) => request(`/reports/${id}/download`, { method: 'GET', responseType: 'blob' }),
  marketing: () => request('/reports/marketing'),
};

export const calendarAPI = {
  list: () => request('/calendar'),
  create: (data) => request('/calendar', { method: 'POST', body: data }),
};

export const notificationsAPI = {
  list: () => request('/notifications'),
  markRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => request('/notifications/read-all', { method: 'PATCH' }),
  unreadCount: () => request('/notifications/unread-count'),
  clearAll: () => request('/notifications', { method: 'DELETE' }),
  remove: (id) => request(`/notifications/${id}`, { method: 'DELETE' }),
};

export const searchAPI = {
  global: (q) => request(`/search?q=${encodeURIComponent(q)}`),
};

export default {
  request,
  auth: authAPI,
  search: searchAPI,
  dashboard: dashboardAPI,
  leads: leadsAPI,
  clients: clientsAPI,
  matters: mattersAPI,
  documents: documentsAPI,
  communications: communicationsAPI,
  billing: billingAPI,
  drafts: draftsAPI,
  marketing: marketingAPI,
  users: usersAPI,
  conflicts: conflictsAPI,
  timers: timersAPI,
  reports: reportsAPI,
  calendar: calendarAPI,
  notifications: notificationsAPI,
  folders: {
    list: (params) => request('/folders', { params }),
    create: (data) => request('/folders', { method: 'POST', body: data }),
  },
  settings: {
    get: () => request('/settings'),
    update: (data) => request('/settings', { method: 'PUT', body: data }),
  },
};
