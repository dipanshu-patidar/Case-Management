import { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { marketingAPI } from '../services/api';
import logoImg from '../assets/WhatsApp Image 2026-04-13 at 11.01.36 AM-Photoroom.png';

function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Hash Scrolling
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsOpen(false); // Close mobile menu on every navigation
  }, [location]);

  const navLinks = [
    { label: 'Home', path: '/#home' },
    { label: 'Our Firm', path: '/#our-firm' },
    { label: 'Practice Areas', path: '/#practice-areas' },
    { label: 'Contact Us', path: '/#contact-us' },
    { label: 'Book a Consultation', path: '/#book-consultation' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md py-2 sm:py-2.5 shadow-sm border-b border-slate-100' : 'bg-transparent py-2.5 sm:py-4'}`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-12 flex items-center justify-between gap-3">
        {/* Branding */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logoImg} alt="Victoria Tulsidas Law" className="h-16 sm:h-20 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-md" />
          <div className="hidden sm:block">
            <span className="text-slate-900 font-display font-900 text-2xl tracking-tight leading-none block">Victoria Tulsidas Law</span>
            <span className="text-slate-500 text-[11px] font-600 block mt-1">A Professional Legal Corporation</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map(link => (
            <NavLink key={link.path} to={link.path}
              className={({ isActive }) => `text-[12px] font-800 uppercase tracking-widest transition-colors ${isActive ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}>
              {link.label}
            </NavLink>
          ))}
          <Link to="/login" className="bg-primary-600 text-white px-6 py-3 rounded-xl text-[13px] font-800 uppercase tracking-wider hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 active:scale-[0.98]">
            Login
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-700 active:scale-95 transition-transform"
          aria-label="Toggle Menu">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {isOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 top-0 left-0 w-full h-full bg-white z-[90] transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col p-6 sm:p-8 pt-24 sm:pt-32 space-y-6 sm:space-y-8 bg-white min-h-screen overflow-y-auto">
          {navLinks.map((link, i) => (
            <NavLink key={link.path} to={link.path}
              style={{ transitionDelay: `${i * 50}ms` }}
              className={({ isActive }) => `text-xl sm:text-2xl font-800 tracking-tight transition-all ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'} ${isActive ? 'text-primary-600' : 'text-slate-900 hover:text-primary-600'}`}>
              {link.label}
            </NavLink>
          ))}
          <div className={`pt-8 border-t border-slate-100 transition-all duration-500 delay-300 ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
            <Link to="/login" className="block w-full bg-primary-600 text-white text-center py-5 rounded-2xl font-800 text-lg shadow-2xl shadow-primary-600/30 active:scale-[0.98]">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function PublicFooter() {
  const [dynamicSocialLinks, setDynamicSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await marketingAPI.getSocialLinks();
        if (res.success) {
          setDynamicSocialLinks(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch social links:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-10 lg:py-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-10 sm:mb-12">
          {/* Brand Block */}
          <div className="space-y-10">
            <Link to="/" className="flex flex-col gap-4">
              <img src={logoImg} alt="Victoria Tulsidas Law" className="h-20 w-auto object-contain hover:scale-105 transition-all duration-500 mr-auto drop-shadow-md" />
              <div className="leading-tight">
                <span className="text-slate-900 font-display font-900 text-2xl block tracking-tight">Victoria Tulsidas Law</span>
                <span className="text-slate-500 text-[11px] font-600 block mt-1">A Professional Legal Corporation</span>
              </div>
            </Link>
            <p className="text-slate-500 text-[15px] leading-relaxed font-500">
              Exceptional legal advocacy with a modern touch. Committed to precision, integrity, and client success across the Southern California region.
            </p>
            <div className="pt-4">
              <p className="text-primary-600 font-900 text-[13px] uppercase tracking-[0.25em] underline decoration-primary-200 underline-offset-[12px] decoration-2 transition-all hover:decoration-primary-600">www.VictoriaTulsidasLaw.com</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-slate-900 font-900 text-[11px] uppercase tracking-[0.4em] mb-12 leading-none opacity-80">Firm Navigation</h4>
            <div className="flex flex-col gap-6">
              {[
                { label: 'Home', path: '/#home' },
                { label: 'Our Firm', path: '/#our-firm' },
                { label: 'Practice Areas', path: '/#practice-areas' },
                { label: 'Contact Us', path: '/#contact-us' },
                { label: 'Client Login', path: '/login' }
              ].map(link => (
                <Link key={link.label} to={link.path} className="text-slate-500 hover:text-primary-600 transition-all text-[15px] font-700 tracking-tight hover:translate-x-1">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-slate-900 font-900 text-[11px] uppercase tracking-[0.3em] mb-10 leading-none">Contact Our Office</h4>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <span className="text-slate-400 bg-slate-100 p-2 rounded-lg text-xs grayscale">📍</span>
                <p className="text-slate-600 text-[13px] leading-relaxed font-600">
                  750 San Vicente Blvd, Suite 800, Southern California, CA 90069
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-slate-400 bg-slate-100 p-2 rounded-lg text-xs grayscale">📞</span>
                <a href="tel:+13105042359" className="text-slate-900 text-[14px] font-800 tracking-tight hover:text-primary-600 transition-colors">(310) 504-2359</a>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-slate-400 bg-slate-100 p-2 rounded-lg text-xs grayscale">✉️</span>
                <p className="text-slate-900 text-[14px] font-800 tracking-tight">info@victoriatulsidaslaw.com</p>
              </div>
            </div>
          </div>

          {/* Social Presence */}
          <div>
            <h4 className="text-slate-900 font-900 text-[11px] uppercase tracking-[0.4em] mb-12 leading-none opacity-80">Connect with Us</h4>
            <div className="flex flex-col gap-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-14 bg-slate-200/50 rounded-3xl animate-pulse" />
                  ))}
                </div>
              ) : dynamicSocialLinks.length > 0 ? (
                dynamicSocialLinks.map(social => {
                  const hasUrl = social.url && social.url.trim() !== '';
                  const IconMap = {
                    LinkedIn: '💼',
                    Instagram: '📸',
                    Facebook: '👥',
                    YouTube: '🎥'
                  };
                  return (
                    <a 
                      key={social.platform} 
                      href={hasUrl ? social.url : undefined}
                      target={hasUrl ? "_blank" : undefined}
                      rel={hasUrl ? "noopener noreferrer" : undefined}
                      className={`flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-3xl transition-all group shadow-sm ${
                        hasUrl 
                          ? 'hover:border-primary-500 hover:bg-primary-50 hover:shadow-md hover:-translate-y-1 cursor-pointer' 
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <span className="text-xl grayscale group-hover:grayscale-0 transition-all duration-300">
                        {IconMap[social.platform] || '🔗'}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-900 text-slate-500 group-hover:text-primary-800 uppercase tracking-[0.2em]">
                          {social.platform}
                        </span>
                        {!hasUrl && <span className="text-[9px] text-slate-400 font-600 uppercase tracking-widest mt-0.5 italic">Not available</span>}
                      </div>
                    </a>
                  );
                })
              ) : (
                <div className="text-slate-400 text-[11px] font-700 uppercase tracking-widest italic py-4">No social links configured</div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 sm:pt-10 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <p className="text-[11px] text-slate-400 font-700 tracking-tight text-center md:text-left leading-relaxed">
            © 2026 Victoria Tulsidas Law. All legal representations are subject to conflict checks and engagement.
          </p>
          <div className="flex items-center gap-4 sm:gap-6 text-[10px] font-900 uppercase tracking-[0.2em] sm:tracking-[0.25em] text-slate-300 flex-wrap justify-center">
            <span className="hover:text-slate-500 cursor-pointer transition-colors">Security</span>
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <span className="hover:text-slate-500 cursor-pointer transition-colors">Privacy</span>
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <span className="hover:text-slate-500 cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function WebsiteLayout({ toast }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />
      <main className="flex-1 pt-16 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-10 lg:px-12 max-w-[1600px] mx-auto w-full overflow-x-clip">
        <Outlet context={{ toast }} />
      </main>
      <PublicFooter />
    </div>
  );
}
