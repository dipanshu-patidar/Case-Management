import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import api from '../../services/api';
import heroSide from '../../assets/36A1870A-7DA7-4C3A-9A48-F7AE4D701041-2.jpeg';
import heroFront from '../../assets/hero_lawyer_modern.png';

// ── Interactive Enhancements ──────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}



export function HomePage() {
  useScrollReveal();
  const practiceAreas = [
    { title: 'Civil & Business Litigation', icon: '⚖️', desc: 'Disciplined advocacy in civil and business disputes, from early case assessment through resolution, with a focus on results.' },
    { title: 'Creative Law', icon: '🎨', desc: 'Protection and structuring for creative work, ventures, and rights in an evolving commercial and regulatory landscape.' },
    { title: 'International/Immigration Law', icon: '🌐', desc: 'Cross-border counsel and dedicated guidance through immigration processes with clarity, discretion, and global awareness.' },
    { title: 'Personal Injury/Malpractice/Wrongful Death', icon: '🛡️', desc: 'Compassionate representation for individuals and families seeking justice in injury, malpractice, and wrongful death matters.' }
  ];

  return (
    <div className="animate-fade-in space-y-16 sm:space-y-20 lg:space-y-24 overflow-x-clip relative">
      
      {/* 1. HERO SECTION */}
      <section id="home" className="relative py-12 sm:py-14 lg:py-20 overflow-hidden scroll-mt-28 sm:scroll-mt-32 reveal-on-scroll">
        <div className="relative z-10 text-center lg:text-left grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-900 text-slate-900 mb-8 leading-[1.05] tracking-tight text-balance">
              Where Justice and <span className="text-primary-600">Advocacy Intersect</span>
            </h1>
            <p className="text-slate-500 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 mb-4 leading-relaxed font-500">
              We represent more than cases—we represent people, communities, and the universal right to be heard. Rooted in the spirit of justice and human rights, our work reflects a commitment to elevate, protect, and serve—without limitation or borders.
            </p>
            <p className="text-slate-500 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 mb-12 leading-relaxed font-500 text-balance">
              Expert Legal Services Tailored to Your Specific and Complex Needs.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-5">
              <a href="#book-consultation" className="btn btn-primary w-full sm:w-auto justify-center px-6 sm:px-10 py-4 sm:py-5 text-sm sm:text-base font-900 uppercase tracking-wider sm:tracking-widest shadow-2xl shadow-primary-500/30 hover:-translate-y-1 transition-all duration-300">Book a Consultation</a>
              <Link to="/login" className="btn btn-secondary w-full sm:w-auto justify-center px-6 sm:px-10 py-4 sm:py-5 text-sm sm:text-base font-900 uppercase tracking-wider sm:tracking-widest bg-white shadow-md border border-slate-100 hover:bg-slate-50 hover:-translate-y-1 transition-all duration-300">Access Client Portal</Link>
            </div>
          </div>
          <div className="relative group reveal-right">
            <div className="absolute -inset-4 bg-primary-600/5 rounded-3xl rotate-3 -z-10 group-hover:rotate-0 transition-transform duration-1000" />
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-xl bg-white">
              <img
                src={heroFront}
                alt="Victoria Tulsidas - Managing Partner"
                className="w-full h-full object-cover aspect-[4/5] group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-8 left-8 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-900 uppercase tracking-[0.3em] opacity-80">Attorney at Law</span>
                </div>
                <h3 className="text-xl font-display font-800 mt-2 tracking-tight">Victoria Tulsidas, Esq.</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR FIRM SECTION (Combined from AboutPage) */}
      <section id="our-firm" className="space-y-10 sm:space-y-16 lg:space-y-20 scroll-mt-28 sm:scroll-mt-32 reveal-on-scroll">
        <div className="text-center">
          <span className="text-primary-600 font-900 text-[11px] uppercase tracking-[0.3em] mb-4 block leading-none">About Our Firm</span>
          <h2 className="text-4xl lg:text-5xl font-display font-900 text-slate-900 mb-6 tracking-tight">A Commitment to Excellence</h2>
          <div className="w-12 h-1 bg-primary-600 rounded-full mx-auto mb-8" />
        </div>

        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24 items-center">
          <div className="relative group order-2 lg:order-1 reveal-left">
            <div className="absolute -inset-4 bg-slate-100 rounded-3xl -rotate-2 -z-10 group-hover:rotate-0 transition-transform duration-1000" />
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-xl bg-white">
              <img
                src={heroSide}
                alt="About Our Firm"
                className="w-full h-full object-cover aspect-[4/5] group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </div>
          <div className="space-y-10 order-1 lg:order-2">
            <div className="space-y-6">
              <p className="text-slate-600 leading-relaxed text-lg font-500">
                Victoria Tulsidas Law is a boutique legal practice defined by elevated advocacy and global awareness. We provide a concierge experience rooted in precision, discretion, and strategic clarity—where every matter is approached with intention and handled at the highest standard of care.
              </p>
              <p className="text-slate-600 leading-relaxed text-lg font-500">
                With an international and diplomatic lens, we serve clients who expect more than representation—they expect alignment, insight, and results. Our role is not only to advocate, but to anticipate, guide, and safeguard every step of the process.
              </p>
              <p className="text-slate-600 leading-relaxed text-lg font-500">
                Seamless communication, secure access, and refined case management are the foundation of our practice—ensuring a legal experience that is as sophisticated as it is effective.
              </p>
            </div>

            <div className="grid gap-6 pt-4">
              <div className="flex items-center gap-6 p-6 bg-slate-50 border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-white text-primary-600 flex items-center justify-center text-2xl shadow-inner border border-slate-100">🤝</div>
                <div>
                  <p className="font-900 text-slate-900 text-[15px] tracking-tight">Client-First Approach</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-900 mt-1">Tailored case strategies</p>
                </div>
              </div>
              <div className="flex items-center gap-6 p-6 bg-slate-50 border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-white text-emerald-600 flex items-center justify-center text-2xl shadow-inner border border-slate-100">🛡️</div>
                <div>
                  <p className="font-900 text-slate-900 text-[15px] tracking-tight">Confidential Handling</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-900 mt-1">Encrypted matter security</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRACTICE AREAS SECTION */}
      <section id="practice-areas" className="scroll-mt-32 reveal-on-scroll">
        <div className="text-center mb-10">
          <span className="text-primary-600 font-900 text-[11px] uppercase tracking-[0.3em] mb-4 block leading-none">Legal Expertise</span>
          <h2 className="text-4xl lg:text-5xl font-display font-900 text-slate-900 mb-6 tracking-tight">Practice Areas</h2>
          <div className="w-12 h-1 bg-primary-600 rounded-full mx-auto mb-8" />
          <p className="text-slate-500 text-lg lg:text-xl max-w-2xl mx-auto font-500 leading-relaxed text-center">Expert Legal Services Tailored to Your Specific and Complex Needs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mt-12">
          {practiceAreas.map(area => (
            <div key={area.title} className="p-10 bg-white border border-slate-100 rounded-[3.5rem] shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:border-primary-100 transition-all duration-300 group flex flex-col items-start h-full text-left relative overflow-hidden active:scale-[0.98] hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[3rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform group-hover:bg-primary-50 shadow-inner leading-none grayscale hover:grayscale-0">
                {area.icon}
              </div>
              <h3 className="text-2xl font-display font-900 text-slate-900 mb-4 tracking-tight leading-none">{area.title}</h3>
              <p className="text-slate-500 leading-relaxed max-w-sm flex-1 text-[15px] font-500">
                {area.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WHY CHOOSE US / VALUE SECTION */}
      <section className="bg-slate-50 py-12 sm:py-14 lg:py-20 rounded-[2.5rem] sm:rounded-[4rem] border border-slate-200/60 shadow-inner px-4 sm:px-8 lg:px-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="text-center mb-10 sm:mb-14 lg:mb-16">
          <h2 className="text-4xl lg:text-5xl font-display font-900 text-slate-900 mb-6 tracking-tight">Our Commitment to Clients</h2>
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed text-[17px] font-500 text-balance">We blend traditional legal expertise with modern efficiency to provide a superior, transparent legal experience.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 max-w-[1600px] mx-auto">
          {[
            { icon: '🎯', title: 'Personalized Approach', desc: 'Your specific goals and long-term well-being are the absolute core of our firm strategy.' },
            { icon: '🛡️', title: 'Confidential Handling', desc: 'Highest standards of attorney-client privilege and secure physical and digital matter security.' },
            { icon: '💬', title: 'Clear Communication', desc: 'Real-time updates and clear, honest communication at every step of your legal journey.' },
            { icon: '🏛️', title: 'Efficient Management', desc: 'Sophisticated internal processes to ensure no detail is missed or legal deadline delayed.' }
          ].map(item => (
            <div key={item.title} className="text-center sm:text-left group cursor-default">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-8 mx-auto sm:mx-0 border border-slate-100 shadow-slate-200/50 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">{item.icon}</div>
              <h4 className="text-slate-900 font-900 text-[19px] mb-4 tracking-tight leading-none">{item.title}</h4>
              <p className="text-slate-500 text-[15px] leading-relaxed font-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CLIENT PORTAL SECTION */}
      <section className="relative overflow-hidden rounded-[2.5rem] sm:rounded-[4rem] bg-slate-900 text-white p-6 sm:p-10 lg:p-16 shadow-2xl reveal-on-scroll">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" /></svg>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center text-left">
          <div>
            <h2 className="text-4xl lg:text-7xl font-display font-900 mb-10 leading-tight tracking-tight">Trusted Legal Support for <span className="text-primary-400">Every Step</span></h2>
            <p className="text-slate-400 text-lg lg:text-xl mb-16 leading-relaxed font-500 text-balance">
              Our firm provides comprehensive guidance through every stage of your legal journey. We combine professional expertise with personalized attention to ensure your rights are protected.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-10">
              {[
                { title: 'Case Strategy & Planning', desc: 'Strategic assessments tailored to your specific goals.' },
                { title: 'Document Preparation', desc: 'Meticulous drafting and review of all legal filings.' },
                { title: 'Ongoing Legal Support', desc: 'Persistent representation throughout the matter.' },
                { title: 'Attorney Communication', desc: 'Direct access to your dedicated legal team.' }
              ].map(item => (
                <div key={item.title} className="flex gap-5 group">
                  <div className="w-10 h-10 bg-primary-600/20 text-primary-400 rounded-full flex items-center justify-center font-bold text-[16px] ring-1 ring-primary-500/50 flex-shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">✓</div>
                  <div>
                    <h4 className="text-[18px] font-900 text-white mb-2 tracking-tight">{item.title}</h4>
                    <p className="text-[14px] text-slate-500 font-500 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="absolute inset-0 bg-primary-600 blur-[140px] opacity-20" />
            <div className="relative bg-white/5 backdrop-blur-md rounded-[4rem] border border-white/10 p-16 shadow-inner">
              <div className="space-y-12">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 rounded-3xl bg-primary-600 flex items-center justify-center text-4xl shadow-2xl shadow-primary-600/40">⚖️</div>
                  <div>
                    <h4 className="text-2xl font-900 tracking-tight">Professional Advocacy</h4>
                    <p className="text-primary-400 text-xs font-900 uppercase tracking-[0.3em] mt-2">Active Representation</p>
                  </div>
                </div>
                <div className="space-y-10">
                  <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-inner">
                    <p className="text-slate-400 text-[15px] mb-4 leading-relaxed">"Exceptional communication and clear strategic vision for my legal matter."</p>
                    <p className="text-white text-[11px] font-900 uppercase tracking-[0.3em] text-right opacity-60">— Recent Client Review</p>
                  </div>
                  <Link to="/login" className="flex items-center justify-center w-full py-6 bg-white text-slate-900 rounded-[1.5rem] font-900 uppercase tracking-widest text-sm hover:bg-primary-50 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-black/20">
                    Enter Secure Client Portal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONTACT US SECTION (Combined from ContactPage) */}
      <section id="contact-us" className="scroll-mt-28 sm:scroll-mt-32 space-y-10 sm:space-y-16 lg:space-y-20 reveal-on-scroll">
        <div className="text-center">
          <span className="text-primary-600 font-900 text-[11px] uppercase tracking-[0.3em] mb-4 block leading-none">Get in Touch</span>
          <h2 className="text-4xl lg:text-5xl font-display font-900 text-slate-900 mb-6 tracking-tight">Contact Our Firm</h2>
          <div className="w-12 h-1 bg-primary-600 rounded-full mx-auto mb-8" />
          <p className="text-slate-500 text-lg lg:text-xl max-w-2xl mx-auto font-500 leading-relaxed text-center text-balance">Connect with our office for expert legal guidance and professional matter advocacy.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 sm:gap-10 text-left items-start">
          {/* B. CONTACT INFORMATION & SIDE PANEL */}
          <div className="lg:col-span-4 space-y-10">
            <div className="space-y-8">
              <h3 className="text-2xl font-display font-800 text-slate-900 tracking-tight leading-none">Direct Channels</h3>
              <div className="space-y-4">
                {[
                  { label: 'Phone Registry', value: '(310) 504-2359', icon: '📞', link: 'tel:+13105042359' },
                  { label: 'Matter Inquiries', value: 'info@victoriatulsidaslaw.com', icon: '✉️', link: 'mailto:info@victoriatulsidaslaw.com' },
                  { label: 'Global Registry', value: 'www.VictoriaTulsidasLaw.com', icon: '🌐', link: '#' }
                ].map(item => (
                  <a key={item.label} href={item.link} className="flex gap-5 p-5 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm hover:border-primary-100 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-inner border border-slate-100 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <div>
                      <p className="text-[10px] font-900 text-primary-600 uppercase tracking-[0.2em] leading-none mb-1.5">{item.label}</p>
                      <p className="text-[15px] font-800 text-slate-900 tracking-tight">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="p-8 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000" />
              <h4 className="text-[18px] font-800 mb-6 flex items-center gap-3 tracking-tight relative z-10">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" /> Physical Presence
              </h4>
              <ul className="space-y-4 text-[13px] text-slate-400 font-500 relative z-10">
                <li className="flex flex-col gap-1 pb-4 border-b border-white/5">
                  <span className="text-[10px] uppercase font-900 tracking-widest text-primary-400">Main Office</span>
                  <span className="text-white font-700"> 750 San Vicente Blvd, Suite 800, Southern California, CA 90069</span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-white/5">
                  <span>Mon - Fri</span> <span className="text-white font-800 uppercase tracking-widest text-[11px]">9:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Sat - Sun</span> <span className="text-slate-600 uppercase text-[10px]">Closed for Recess</span>
                </li>
              </ul>
            </div>
          </div>

          {/* C. CONTACT FORM */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-200 p-5 sm:p-10 lg:p-16 rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-600 to-accent-500" />
              <div className="mb-12">
                <h3 className="text-2xl lg:text-3xl font-display font-800 text-slate-900 mb-2 tracking-tight">Transmittal of Inquiry</h3>
                <p className="text-slate-500 font-500 text-[15px]">Please provide detailed information regarding your legal matter below.</p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOOK CONSULTATION SECTION (Combined from BookConsultationPage) */}
      <section id="book-consultation" className="scroll-mt-28 sm:scroll-mt-32 space-y-10 sm:space-y-16 lg:space-y-20">
        <div className="text-center">
          <span className="text-primary-600 font-900 text-[11px] uppercase tracking-[0.3em] mb-4 block leading-none">Schedule Evaluation</span>
          <h2 className="text-4xl lg:text-5xl font-display font-900 text-slate-900 mb-6 tracking-tight">Book a Consultation</h2>
          <div className="w-12 h-1 bg-primary-600 rounded-full mx-auto mb-8" />
          <p className="text-slate-500 text-lg lg:text-xl max-w-2xl mx-auto font-500 leading-relaxed text-center">Secure your professional strategy session with Victoria Tulsidas Law for specialized legal guidance.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 sm:gap-10 text-left items-start">
          {/* B. CONSULTATION FORM */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <div className="bg-white border border-slate-200 p-5 sm:p-10 lg:p-16 rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-600 to-emerald-500" />
              <div className="mb-12">
                <h3 className="text-2xl lg:text-3xl font-display font-800 text-slate-900 mb-2 tracking-tight">Strategy Session Request</h3>
                <p className="text-slate-500 font-500 text-[15px]">Please select your preferred time and provide initial matter details.</p>
              </div>
              <ConsultationForm />
            </div>
          </div>

          {/* C. SIDE PANEL INFO */}
          <div className="lg:col-span-4 space-y-10 order-1 lg:order-2">
            <div className="space-y-8">
              <h3 className="text-2xl font-display font-800 text-slate-900 tracking-tight leading-none">The Strategy Process</h3>
              <div className="space-y-4">
                {[
                  { step: '01', title: 'Registry', desc: 'Submit your request via our secure portal transmitter.' },
                  { step: '02', title: 'Verification', desc: 'Our intake specialists perform a preliminary conflict check.' },
                  { step: '03', title: 'Consultation', desc: 'One-on-one session with Victoria Tulsidas, Esq. to define strategy.' }
                ].map(item => (
                  <div key={item.step} className="flex gap-5 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] shadow-sm hover:border-primary-100 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center text-[15px] font-900 shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">{item.step}</div>
                    <div>
                      <p className="font-800 text-slate-900 text-[16px] tracking-tight mb-1">{item.title}</p>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary-600 p-6 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                <svg className="w-48 h-48 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
              </div>
              <div className="relative z-10">
                <h4 className="text-xl font-800 mb-6 tracking-tight leading-none flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-lg" /> Security Promise
                </h4>
                <p className="text-primary-50 text-[14px] leading-relaxed mb-8 font-500">
                  All consultation requests are transmitted via our bank-grade encrypted secure bridge. Your legal narrative remains strictly confidential.
                </p>
                <div className="p-5 bg-white/10 rounded-2xl border border-white/10 text-[11px] font-900 uppercase tracking-widest leading-none flex justify-center text-primary-100">
                  Security Protocol: TLS-256
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export function ContactForm() {
  const { toast } = useOutletContext();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    try {
      const fd = new FormData(form);
      const phone = fd.get('phone');
      await api.leads.publicInquiry({
        full_name: fd.get('full_name'),
        email: fd.get('email'),
        phone: phone != null && String(phone).trim() !== '' ? phone : '',
        matter_type: fd.get('matter_type'),
        message: fd.get('message'),
      });
      toast('Your message has been received. Our team will contact you soon.', 'success');
      form.reset();
    } catch (err) {
      toast(err.message || 'Could not submit your inquiry. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2.5">
          <label className="block text-[13px] font-800 text-slate-600 uppercase tracking-widest ml-1">Full Name Registry <span className="text-primary-600">*</span></label>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 group-focus-within:scale-110 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <input name="full_name" required className="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] sm:rounded-[2rem] pl-14 sm:pl-16 pr-6 sm:pr-8 py-4 sm:py-5 text-[15px] sm:text-[17px] outline-none focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 transition-all duration-300 font-600 text-slate-900 placeholder:text-slate-300 shadow-sm hover:border-slate-200 focus:shadow-xl focus:shadow-primary-500/10" placeholder="E.g., Alexander Hamilton" />
          </div>
        </div>
        <div className="space-y-2.5">
          <label className="block text-[13px] font-800 text-slate-600 uppercase tracking-widest ml-1">Electronic Point <span className="text-primary-600">*</span></label>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 group-focus-within:scale-110 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <input name="email" type="email" required className="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] sm:rounded-[2rem] pl-14 sm:pl-16 pr-6 sm:pr-8 py-4 sm:py-5 text-[15px] sm:text-[17px] outline-none focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 transition-all duration-300 font-600 text-slate-900 placeholder:text-slate-300 shadow-sm hover:border-slate-200 focus:shadow-xl focus:shadow-primary-500/10" placeholder="name@domain.com" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2.5">
          <label className="block text-[13px] font-800 text-slate-600 uppercase tracking-widest ml-1">Phone Contact</label>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 group-focus-within:scale-110 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
            <input name="phone" className="w-full bg-white border-2 border-slate-100 rounded-[2rem] pl-16 pr-8 py-5 text-[17px] outline-none focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 transition-all duration-300 font-600 text-slate-900 placeholder:text-slate-300 shadow-sm hover:border-slate-200 focus:shadow-xl focus:shadow-primary-500/10" placeholder="(310) 504-2359" />
          </div>
        </div>
        <div className="space-y-2.5">
          <label className="block text-[13px] font-800 text-slate-600 uppercase tracking-widest ml-1">Area of Expertise</label>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 group-focus-within:scale-110 transition-all duration-300 z-10 pointer-events-none">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
            </div>
            <select name="matter_type" className="w-full bg-white border-2 border-slate-100 rounded-[2rem] pl-16 pr-12 py-5 text-[17px] outline-none focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 transition-all duration-300 appearance-none text-slate-900 font-600 cursor-pointer shadow-sm hover:border-slate-200 focus:shadow-xl focus:shadow-primary-500/10">
              <option value="">— Select —</option>
              <option value="International Law">International Law</option>
              <option value="Immigration">Immigration</option>
              <option value="Civil Litigation">Civil Litigation</option>
              <option value="Creative Law">Creative Law</option>
              <option value="Business Law">Business Law</option>
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-all">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2.5">
        <label className="block text-[13px] font-800 text-slate-600 uppercase tracking-widest ml-1">Matter Narrative <span className="text-primary-600">*</span></label>
        <div className="relative group">
          <div className="absolute left-6 top-7 text-slate-400 group-focus-within:text-primary-600 group-focus-within:scale-110 transition-all duration-300">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </div>
          <textarea name="message" required className="w-full bg-white border-2 border-slate-100 rounded-[2.5rem] pl-16 pr-8 py-6 text-[17px] outline-none focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 transition-all duration-300 min-h-[180px] resize-none font-600 text-slate-900 placeholder:text-slate-300 shadow-sm hover:border-slate-200 focus:shadow-xl focus:shadow-primary-500/10" placeholder="Briefly summarize the details of your legal challenge..." />
        </div>
      </div>
      <div className="pt-4">
        <button disabled={loading} className={`w-full py-5 lg:py-6 bg-primary-600 text-white font-900 rounded-[2.5rem] uppercase tracking-widest text-[15px] hover:bg-primary-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-600/40 transition-all duration-300 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
          {loading ? 'Processing Inquiry...' : 'Send Inquiry Now'}
        </button>
        <p className="text-center text-[12px] text-slate-400 mt-8 font-700 uppercase tracking-[0.2em]">
          Encrypted Registry Transmission • <span className="text-primary-600">Secure Protocol</span>
        </p>
      </div>
    </form>
  );
}

export function ConsultationForm() {
  const { toast } = useOutletContext();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    try {
      const fd = new FormData(form);
      await api.leads.publicConsultation({
        full_name: fd.get('full_name'),
        email: fd.get('email'),
        phone: fd.get('phone'),
        preferred_date: fd.get('preferred_date'),
        matter_type: fd.get('matter_type'),
        message: fd.get('message'),
      });
      toast('Consultation request transmitted. Our staff will contact you to confirm the time.', 'success');
      form.reset();
    } catch (err) {
      toast(err.message || 'Could not submit your request. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2.5">
          <label className="block text-[13px] font-800 text-slate-600 uppercase tracking-widest ml-1">Full Name Registry <span className="text-primary-600">*</span></label>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 group-focus-within:scale-110 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <input name="full_name" required className="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] sm:rounded-[2rem] pl-14 sm:pl-16 pr-6 sm:pr-8 py-4 sm:py-5 text-[15px] sm:text-[17px] outline-none focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 transition-all duration-300 font-600 text-slate-900 placeholder:text-slate-300 shadow-sm hover:border-slate-200 focus:shadow-xl focus:shadow-primary-500/10" placeholder="E.g., Thomas Jefferson" />
          </div>
        </div>
        <div className="space-y-2.5">
          <label className="block text-[13px] font-800 text-slate-600 uppercase tracking-widest ml-1">Electronic Point <span className="text-primary-600">*</span></label>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 group-focus-within:scale-110 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <input name="email" type="email" required className="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] sm:rounded-[2rem] pl-14 sm:pl-16 pr-6 sm:pr-8 py-4 sm:py-5 text-[15px] sm:text-[17px] outline-none focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 transition-all duration-300 font-600 text-slate-900 placeholder:text-slate-300 shadow-sm hover:border-slate-200 focus:shadow-xl focus:shadow-primary-500/10" placeholder="name@domain.com" />
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <label className="block text-[13px] font-800 text-slate-600 uppercase tracking-widest ml-1">Phone Contact</label>
        <div className="relative group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 group-focus-within:scale-110 transition-all duration-300">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          </div>
          <input name="phone" type="tel" className="w-full bg-white border-2 border-slate-100 rounded-[2rem] pl-16 pr-8 py-5 text-[17px] outline-none focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 transition-all duration-300 font-600 text-slate-900 placeholder:text-slate-300 shadow-sm hover:border-slate-200 focus:shadow-xl focus:shadow-primary-500/10" placeholder="(310) 504-2359" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2.5">
          <label className="block text-[13px] font-800 text-slate-600 uppercase tracking-widest ml-1">Preferred Date <span className="text-primary-600">*</span></label>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 group-focus-within:scale-110 transition-all duration-300 z-10 pointer-events-none">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <input name="preferred_date" type="date" required className="w-full bg-white border-2 border-slate-100 rounded-[2rem] pl-16 pr-8 py-5 text-[17px] outline-none focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 transition-all duration-300 font-600 text-slate-900 shadow-sm cursor-pointer hover:border-slate-200" />
          </div>
        </div>
        <div className="space-y-2.5">
          <label className="block text-[13px] font-800 text-slate-600 uppercase tracking-widest ml-1">Matter Classification <span className="text-primary-600">*</span></label>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 group-focus-within:scale-110 transition-all duration-300 z-10 pointer-events-none">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
            </div>
            <select name="matter_type" required className="w-full bg-white border-2 border-slate-100 rounded-[2rem] pl-16 pr-12 py-5 text-[17px] outline-none focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 transition-all duration-300 appearance-none text-slate-900 font-600 cursor-pointer shadow-sm hover:border-slate-200 focus:shadow-xl focus:shadow-primary-500/10">
              <option value="International Law">International Law</option>
              <option value="Immigration">Immigration</option>
              <option value="Civil Litigation">Civil Litigation</option>
              <option value="Creative Law">Creative Law</option>
              <option value="Business Law">Business Law</option>
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-all">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <label className="block text-[13px] font-800 text-slate-600 uppercase tracking-widest ml-1">Matter Overview <span className="text-primary-600">*</span></label>
        <div className="relative group">
          <div className="absolute left-6 top-7 text-slate-400 group-focus-within:text-primary-600 group-focus-within:scale-110 transition-all duration-300">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <textarea name="message" required className="w-full bg-white border-2 border-slate-100 rounded-[2.5rem] pl-16 pr-8 py-6 text-[17px] outline-none focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 transition-all duration-300 min-h-[160px] resize-none font-600 text-slate-900 placeholder:text-slate-300 shadow-sm hover:border-slate-200 focus:shadow-xl focus:shadow-primary-500/10" placeholder="Briefly summarize the legal issue you wish to discuss..." />
        </div>
      </div>

      <div className="pt-4">
        <button disabled={loading} className={`w-full py-5 lg:py-6 bg-primary-600 text-white font-900 rounded-[2.5rem] uppercase tracking-widest text-[15px] hover:bg-primary-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-600/40 transition-all duration-300 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
          {loading ? 'Verifying Calendar...' : 'Request Consultation Now'}
        </button>
        <p className="text-center text-[12px] text-slate-400 mt-8 font-700 uppercase tracking-[0.2em]">
          Confidential Registry Transmission • <span className="text-primary-600">Secure Bridge</span>
        </p>
      </div>
    </form>
  );
}

export function ClientPortalLandingPage() {
  return (
    <div className="animate-fade-in space-y-16 sm:space-y-20 lg:space-y-24 overflow-x-clip">
      {/* 1. PAGE HEADER / HERO */}
      <section className="relative py-12 sm:py-14 lg:py-20 overflow-hidden bg-slate-50 -mx-4 sm:-mx-6 px-4 sm:px-6 rounded-b-[3rem] sm:rounded-b-[5rem] shadow-inner border-b border-slate-200">
        <div className="absolute top-0 right-0 p-24 opacity-[0.03] pointer-events-none">
          <svg className="w-[30rem] h-[30rem]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.5h7c-.47 4.18-3.05 7.85-7 9.12V11.5H5V6.3l7-3.11v8.31z" /></svg>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-primary-600 font-900 text-[11px] uppercase tracking-[0.4em] mb-6 block leading-none">Member Connectivity Hub</span>
          <h1 className="text-4xl lg:text-7xl font-display font-900 text-slate-900 mb-10 leading-tight tracking-tight">Client Portal Access</h1>
          <p className="text-slate-500 text-lg lg:text-xl max-w-2xl mx-auto mb-16 leading-relaxed font-500 text-balance">
            We utilize a secure client portal to provide a centralized hub for matter management, document transmittal, and persistent communication.
          </p>
          <div className="flex justify-center flex-wrap gap-6 lg:gap-8">
            <Link to="/login" className="btn btn-primary px-12 py-6 text-base font-900 uppercase tracking-widest shadow-2xl shadow-primary-500/40 hover:-translate-y-1 transition-all duration-300 rounded-[1.5rem]">Access Portal</Link>
            <a href="#contact-us" className="btn btn-secondary px-12 py-6 text-base font-900 uppercase tracking-widest bg-white shadow-sm border border-slate-200 hover:-translate-y-1 transition-all duration-300 rounded-[1.5rem]">Need Access?</a>
          </div>
        </div>
      </section>

      {/* 2. PORTAL BENEFITS SECTION */}
      <section className="px-0 text-left">
        <div className="text-center mb-16">
          <span className="text-primary-600 font-900 text-[11px] uppercase tracking-[0.3em] mb-4 block leading-none">Portal Capabilities</span>
          <h2 className="text-3xl lg:text-4xl font-display font-800 text-slate-900 mb-6 tracking-tight">Everything You Need, In One Place</h2>
          <div className="w-12 h-1 bg-primary-600 rounded-full mx-auto mb-6" />
          <p className="text-slate-500 max-w-xl mx-auto font-500 text-[15px]">Our secure platform keeps you informed and organized throughout your legal journey with our firm.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: '📊', title: 'Matter Registry', desc: 'Track real-time updates and legal milestones as your matter progresses through our firm.' },
            { icon: '📤', title: 'Secure Transmittal', desc: 'Transmit sensitive files and evidence directly using bank-grade encrypted bridge technology.' },
            { icon: '🧾', title: 'Billing Ledger', desc: 'Access your full invoice history, review ledger activity, and manage your account statement.' },
            { icon: '💬', title: 'Direct Bridge', desc: 'Receive direct updates and persistent communications from your dedicated legal team.' }
          ].map(benefit => (
            <div key={benefit.title} className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:shadow-2xl hover:border-primary-100 transition-all group flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[3rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-inner group-hover:bg-primary-50 group-hover:scale-110 transition-all">
                {benefit.icon}
              </div>
              <h4 className="text-[18px] font-800 text-slate-900 mb-4 tracking-tight leading-tight">{benefit.title}</h4>
              <p className="text-[14px] text-slate-500 leading-relaxed font-500 flex-1">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="bg-slate-900 rounded-[2.5rem] sm:rounded-[4rem] text-white py-12 sm:py-14 lg:py-20 relative overflow-hidden shadow-2xl px-4 sm:px-10 lg:px-20">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-primary-600 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-accent-500 rounded-full blur-[140px]" />
        </div>
        <div className="relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-display font-800 mb-6 tracking-tight">Portal Operation Guide</h2>
            <div className="w-12 h-1 bg-primary-500 rounded-full mx-auto mb-6" />
            <p className="text-slate-400 max-w-xl mx-auto font-500 text-lg">Seamlessly navigate your secure law firm digital workspace.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-[1600px] mx-auto">
            {[
              { step: '01', title: 'Secure Login', desc: 'Enter the portal using uniquely provided firm credentials from any authorized device.' },
              { step: '02', title: 'Matter Review', desc: 'Navigate through your active matters, shared registries, and transparent billing ledger.' },
              { step: '03', title: 'Collaboration', desc: 'Engage with Victoria Tulsidas Law through encrypted messaging and evidence sharing.' }
            ].map(item => (
              <div key={item.step} className="relative group text-center lg:text-left pt-12 border-t border-white/5">
                <span className="absolute top-0 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 -translate-y-1/2 bg-primary-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-900 text-lg shadow-xl shadow-primary-600/30 group-hover:scale-110 transition-transform">
                  {item.step}
                </span>
                <h4 className="text-xl font-800 mb-4 tracking-tight leading-none">{item.title}</h4>
                <p className="text-slate-400 text-[14px] leading-relaxed font-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FINAL CTA */}
      <section className="py-12 sm:py-14 lg:py-20 text-center">
        <div className="bg-slate-50 border border-slate-100 p-12 lg:p-20 rounded-[4rem] relative overflow-hidden shadow-inner">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-100/30 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl font-display font-800 text-slate-900 mb-8 tracking-tight">Ready to Connect?</h2>
          <p className="text-slate-500 mb-12 text-lg lg:text-xl font-500 max-w-2xl mx-auto">Experience the benefits of a modern, connected legal partnership with Victoria Tulsidas Law.</p>
          <Link to="/login" className="btn btn-primary px-16 py-5 text-base font-800 uppercase tracking-widest shadow-2xl shadow-primary-500/40">Enter Secure Portal</Link>
        </div>
      </section>

      {/* 5. SUPPORT / HELP BLOCK */}
      <section className="px-0 pb-16 sm:pb-20">
        <div className="bg-primary-50 border border-primary-200 rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-10 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-200/20 rounded-bl-full pointer-events-none" />
          <div className="text-center md:text-left relative z-10">
            <span className="text-primary-600 font-900 text-[10px] uppercase tracking-[0.3em] block mb-3 leading-none">Admin Assistance</span>
            <h4 className="text-[22px] font-display font-800 text-slate-900 mb-3 tracking-tight">Need Technical Portal Support?</h4>
            <p className="text-[15px] text-slate-600 max-w-md font-500 leading-relaxed">If you are experiencing difficulty with authentication or require navigational help, our administrative team is standing by.</p>
          </div>
          <div className="flex flex-col items-center gap-4 relative z-10">
            <Link to="/contact" className="btn btn-secondary bg-white px-10 py-4 text-sm whitespace-nowrap shadow-sm border border-slate-200 font-800 uppercase tracking-widest">Request Support</Link>
            <p className="text-[10px] text-slate-400 font-900 uppercase tracking-widest leading-none">VictoriaTulsidasLaw.com</p>
          </div>
        </div>
      </section>
      {/* Floating Action Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group border-4 border-white/20"
      >
        <svg className="w-6 h-6 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        .reveal-on-scroll, .reveal-left, .reveal-right {
          opacity: 0;
          transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .reveal-on-scroll { transform: translateY(40px); }
        .reveal-left { transform: translateX(-50px); }
        .reveal-right { transform: translateX(50px); }
        
        .reveal-visible {
          opacity: 1;
          transform: translate(0, 0);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
      `}} />
    </div>
  );
}
