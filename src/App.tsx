import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  Cable,
  Zap,
  Infinity as InfinityIcon,
  TrendingDown,
  CheckCircle,
  PhoneCall,
  ShoppingBag,
  GraduationCap,
  Gamepad2,
  Tv,
  Users,
  Check,
  MapPin,
  Search,
  MessageSquare,
  ArrowRight,
  Lock,
  Settings,
  Trash2,
  ExternalLink,
  FileText,
  X,
  ChevronDown,
  ChevronUp,
  Menu,
  Clock,
  Sparkles,
  RefreshCw,
  Send,
  Wifi,
  Database
} from 'lucide-react';
import {
  INTERNET_PLANS,
  BANDUNG_AREAS,
  ADVANTAGES,
  USE_CASES,
  FAQS,
  InternetPlan,
  BandungArea,
  LeadSubmission
} from './types';

export default function App() {
  // Navigation State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'gamer' | 'business'>('home');

  // Interactive Plan Advisor States
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [deviceCount, setDeviceCount] = useState<string>('4-8');
  const [recommendedPlan, setRecommendedPlan] = useState<InternetPlan | null>(null);

  // Speed Simulator States
  const [simProvider, setSimProvider] = useState<'mnet' | 'traditional'>('mnet');
  const [simSpeedTestActive, setSimSpeedTestActive] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [simDownload, setSimDownload] = useState(0);
  const [simUpload, setSimUpload] = useState(0);
  const [simPing, setSimPing] = useState(0);

  // Coverage Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<BandungArea | null>(null);
  const [showAreaSuggestions, setShowAreaSuggestions] = useState(false);

  // lead form states
  const [leadName, setLeadName] = useState('');
  const [leadWhatsapp, setLeadWhatsapp] = useState('');
  const [leadSubdistrict, setLeadSubdistrict] = useState('');
  const [leadAddress, setLeadAddress] = useState('');
  const [leadPlanId, setLeadPlanId] = useState('mnet-populer');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Local Storage Leads Management
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');

  // FAQ state
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // Load leads from LocalStorage
  useEffect(() => {
    const savedLeads = localStorage.getItem('mnet_leads');
    if (savedLeads) {
      setLeads(JSON.parse(savedLeads));
    }
  }, []);

  // Filter plans list based on active tab category
  const filteredPlans = INTERNET_PLANS.filter(plan => plan.category === activeTab);

  // Speed Simulator Logic
  const startSpeedTest = () => {
    if (simSpeedTestActive) return;
    setSimSpeedTestActive(true);
    setSimProgress(0);
    setSimDownload(0);
    setSimUpload(0);
    setSimPing(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setSimProgress(progress);

      if (simProvider === 'mnet') {
        // MNET FIBER - Symmetrical, stable, low ping
        setSimPing(Math.floor(Math.random() * 3) + 2); // 2-4 ms
        if (progress < 50) {
          // Download test phase
          setSimDownload(parseFloat((48 + Math.random() * 4).toFixed(1)));
        } else {
          // Upload test phase
          setSimUpload(parseFloat((47 + Math.random() * 5).toFixed(1)));
        }
      } else {
        // Traditional ISP - Asymmetrical, jitter, high ping
        setSimPing(Math.floor(Math.random() * 35) + 42); // 42-77 ms
        if (progress < 50) {
          setSimDownload(parseFloat((11 + Math.random() * 6).toFixed(1)));
        } else {
          setSimUpload(parseFloat((1 + Math.random() * 0.9).toFixed(1))); // Awful upload speed
        }
      }

      if (progress >= 100) {
        clearInterval(interval);
        setSimSpeedTestActive(false);
      }
    }, 50);
  };

  // Live advisor recommendation algorithm
  useEffect(() => {
    // Basic heuristics based on activities and device counts
    let targetSpeedNeed = 20;

    if (selectedActivities.includes('gaming')) targetSpeedNeed += 30;
    if (selectedActivities.includes('streaming')) targetSpeedNeed += 25;
    if (selectedActivities.includes('olshop')) targetSpeedNeed += 15;
    if (selectedActivities.includes('influencer')) targetSpeedNeed += 40;
    if (selectedActivities.includes('school')) targetSpeedNeed += 10;

    if (deviceCount === '4-8') targetSpeedNeed += 20;
    if (deviceCount === '8+') targetSpeedNeed += 50;

    // Recommend plan based on speed requirements
    let recommended: InternetPlan = INTERNET_PLANS[0]; // default hemat
    if (targetSpeedNeed > 100) {
      recommended = INTERNET_PLANS.find(p => p.id === 'mnet-business') || INTERNET_PLANS[3];
    } else if (targetSpeedNeed > 50) {
      recommended = INTERNET_PLANS.find(p => p.id === 'mnet-gamer') || INTERNET_PLANS[2];
    } else if (targetSpeedNeed > 20) {
      recommended = INTERNET_PLANS.find(p => p.id === 'mnet-populer') || INTERNET_PLANS[1];
    }

    setRecommendedPlan(recommended);
  }, [selectedActivities, deviceCount]);

  // Lead Form Submission handler
  const handleLeadSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadWhatsapp || !leadAddress || !leadSubdistrict) return;

    const chosenPlan = INTERNET_PLANS.find(p => p.id === leadPlanId) || INTERNET_PLANS[1];

    const newLead: LeadSubmission = {
      id: 'lead_' + Date.now(),
      name: leadName,
      whatsapp: leadWhatsapp,
      subdistrict: leadSubdistrict,
      address: leadAddress,
      selectedPlanId: leadPlanId,
      selectedPlanName: chosenPlan.name,
      status: 'Baru',
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updatedLeads = [newLead, ...leads];
    setLeads(updatedLeads);
    localStorage.setItem('mnet_leads', JSON.stringify(updatedLeads));

    // Prepare WhatsApp Message API link
    const waBase = 'https://wa.me/6281221520966';
    const textMsg = `Halo MNET Fiber Bandung! Saya berminat pasang internet murah, kenceng, & tanpa FUP.
Berikut data pengajuan saya:

- Nama: ${leadName}
- WhatsApp: ${leadWhatsapp}
- Kelurahan/Area: ${leadSubdistrict}
- Alamat Lengkap: ${leadAddress}
- Pilihan Paket: ${chosenPlan.name} (${chosenPlan.speed} Mbps)

Mohon bantuannya untuk jadwal survey dan pemasangan gratisnya ya. Hatur nuhun!`;

    const encodedText = encodeURIComponent(textMsg);
    const waLink = `${waBase}?text=${encodedText}`;

    setFormSubmitted(true);

    // Redirect user to WhatsApp in a new window/tab safely
    setTimeout(() => {
      window.open(waLink, '_blank', 'noopener,noreferrer');
    }, 1500);
  };

  // Admin Log Authentication
  const handleAdminAuth = (e: FormEvent) => {
    e.preventDefault();
    // Simple password check for demo/local dashboard: admin123
    if (adminPassword === 'admin123' || adminPassword === 'mnetbandung') {
      setIsAdminAuthenticated(true);
    } else {
      alert('Password salah! Silakan coba lagi.');
    }
  };

  // Delete lead from log
  const deleteLead = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data pengajuan ini?')) {
      const updated = leads.filter(l => l.id !== id);
      setLeads(updated);
      localStorage.setItem('mnet_leads', JSON.stringify(updated));
    }
  };

  // Change lead status
  const updateLeadStatus = (id: string, newStatus: 'Baru' | 'Dihubungi' | 'Terpasang') => {
    const updated = leads.map(l => {
      if (l.id === id) {
        return { ...l, status: newStatus };
      }
      return l;
    });
    setLeads(updated);
    localStorage.setItem('mnet_leads', JSON.stringify(updated));
  };

  // Search filter for Bandung coverage
  const filteredAreas = BANDUNG_AREAS.filter(area =>
    area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    area.subdistrict.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectAreaSuggestion = (area: BandungArea) => {
    setSelectedArea(area);
    setSearchQuery(`${area.name}, Kec. ${area.subdistrict}`);
    setShowAreaSuggestions(false);
    setLeadSubdistrict(area.name);
  };

  // Pre-fill plan from selection to form
  const selectPlanForOrder = (planId: string) => {
    setLeadPlanId(planId);
    const element = document.getElementById('formulir-daftar');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dynamic Lucide Icon Mapper
  const renderIcon = (iconName: string, className: string = 'w-6 h-6') => {
    switch (iconName) {
      case 'Activity': return <Activity className={className} />;
      case 'Cable': return <Cable className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Infinity': return <InfinityIcon className={className} />;
      case 'TrendingDown': return <TrendingDown className={className} />;
      case 'CheckCircle': return <CheckCircle className={className} />;
      case 'PhoneCall': return <PhoneCall className={className} />;
      case 'ShoppingBag': return <ShoppingBag className={className} />;
      case 'GraduationCap': return <GraduationCap className={className} />;
      case 'Gamepad2': return <Gamepad2 className={className} />;
      case 'Tv': return <Tv className={className} />;
      case 'Users': return <Users className={className} />;
      default: return <Zap className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-brand-500 selection:text-white relative">
      
      {/* Promo Banner */}
      <div id="top-promo" className="bg-[#0c0c10] border-b border-zinc-900 text-white py-2 px-4 text-xs md:text-sm font-medium text-center relative z-40 flex items-center justify-center gap-2 overflow-hidden">
        <span className="inline-block bg-gradient-to-r from-brand-400 to-brand-600 text-brand-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full animate-pulse">
          PROMO TERBATAS!
        </span>
        <span className="tracking-wide">🔥 Dapatkan Gratis Biaya Pemasangan Rp 0,- & Kecepatan Simetris 1:1 Khusus Bulan Ini! 🔥</span>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 bg-[#050505]/90 backdrop-blur-md border-b border-zinc-900/80 z-30 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="bg-gradient-to-br from-brand-400 to-brand-600 p-2.5 rounded-xl text-brand-950 shadow-md shadow-brand-500/10 group-hover:scale-105 transition-transform duration-300">
              <Wifi className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-2xl tracking-tight text-white leading-none flex items-center gap-1">
                MNET <span className="text-brand-400 text-xl font-medium font-serif italic">FIBER</span>
              </span>
              <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Bandung Unlimited</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#keunggulan" className="font-medium text-sm text-zinc-400 hover:text-brand-400 transition-colors">Keunggulan</a>
            <a href="#kebutuhan" className="font-medium text-sm text-zinc-400 hover:text-brand-400 transition-colors">Kebutuhan</a>
            <a href="#paket" className="font-medium text-sm text-zinc-400 hover:text-brand-400 transition-colors">Paket & Harga</a>
            <a href="#cek-area" className="font-medium text-sm text-zinc-400 hover:text-brand-400 transition-colors flex items-center gap-1">
              <MapPin className="w-4 h-4 text-brand-400" /> Cek Area
            </a>
            <a href="#faq" className="font-medium text-sm text-zinc-400 hover:text-brand-400 transition-colors">FAQ</a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="https://wa.me/6281221520966" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-zinc-300 hover:text-brand-400 font-semibold text-sm px-3 py-2 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-brand-400" />
              <span>0812-2152-0966</span>
            </a>
            <a
              href="#formulir-daftar"
              className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 active:scale-95 text-brand-950 text-sm font-bold px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-brand-500/10"
            >
              <span>Pasang Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            id="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-zinc-900 text-zinc-400 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#0a0a0c] border-t border-zinc-900/50 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-3 flex flex-col">
                <a 
                  href="#keunggulan" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-medium text-base text-zinc-300 py-2 border-b border-zinc-900/30 hover:text-brand-400"
                >
                  Keunggulan
                </a>
                <a 
                  href="#kebutuhan" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-medium text-base text-zinc-300 py-2 border-b border-zinc-900/30 hover:text-brand-400"
                >
                  Kebutuhan Aktivitas
                </a>
                <a 
                  href="#paket" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-medium text-base text-zinc-300 py-2 border-b border-zinc-900/30 hover:text-brand-400"
                >
                  Paket & Harga
                </a>
                <a 
                  href="#cek-area" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-medium text-base text-zinc-300 py-2 border-b border-zinc-900/30 hover:text-brand-400 flex items-center gap-1"
                >
                  <MapPin className="w-4 h-4 text-brand-400" /> Cek Area Bandung
                </a>
                <a 
                  href="#faq" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-medium text-base text-zinc-300 py-2 border-b border-zinc-900/30 hover:text-brand-400"
                >
                  FAQ
                </a>
                
                <div className="pt-4 flex flex-col gap-3">
                  <a 
                    href="https://wa.me/6281221520966"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 border border-zinc-850 py-3 rounded-xl font-semibold text-zinc-300 hover:bg-zinc-900 transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 text-brand-400" />
                    <span>WhatsApp: 0812-2152-0966</span>
                  </a>
                  <a
                    href="#formulir-daftar"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-gradient-to-r from-brand-500 to-brand-600 text-brand-950 text-center font-bold py-3.5 rounded-xl border border-zinc-800"
                  >
                    Pasang Sekarang (Gratis Ongkos)
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 bg-[#050505]">
        
        {/* Ambient background blur circles */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-brand-500/5 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-400/5 rounded-full blur-3xl opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              
              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-full text-zinc-300 text-xs sm:text-sm font-semibold tracking-wide">
                <MapPin className="w-4 h-4 text-brand-400 animate-bounce" />
                <span>MNET FIBER Bandung - Internetnya Wargi Bandung</span>
              </div>

              {/* Title */}
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-none">
                Internet Murah, <br />
                <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-brand-300 bg-clip-text text-transparent">
                  Kenceng, & Unlimited
                </span> <br className="hidden sm:inline" />
                <span className="font-serif italic font-normal text-zinc-400">Pasti Tanpa Batas!</span>
              </h1>

              {/* Subdescription */}
              <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Halo wargi Bandung! MNET FIBER menghadirkan internet rumah, kantor, dan cafe berteknologi <strong className="text-white font-semibold">100% Fiber Optic</strong> dengan kecepatan simetris <strong className="text-white font-semibold">Speed 1:1</strong> serta kuota murni unlimited tanpa FUP. Nikmati koneksi andal bebas buffer!
              </p>

              {/* Features quick points */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto lg:mx-0 pt-2 text-left">
                <div className="flex items-center gap-2 bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-800/60">
                  <Check className="w-4 h-4 text-brand-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-zinc-300">100% Fiber Optic</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-800/60">
                  <Check className="w-4 h-4 text-brand-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-zinc-300">Murni Tanpa FUP</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-800/60 col-span-2 sm:col-span-1">
                  <Check className="w-4 h-4 text-brand-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-zinc-300">Gratis Pemasangan</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <a
                  href="https://wa.me/6281221520966?text=Halo%20MNET%20Fiber%2C%20saya%20tertarik%20tanya-tanya%20mengenai%20promo%20pemasangan%20internet%20di%20Kota%20Bandung"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-[#10b981] hover:bg-[#0ea5e9] active:scale-95 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-[#10b981]/15 transition-all duration-200 flex items-center justify-center gap-3 text-base"
                >
                  <MessageSquare className="w-5 h-5 fill-white text-transparent" />
                  <span>Daftar via WhatsApp</span>
                </a>
                <a
                  href="#paket"
                  className="w-full sm:w-auto bg-zinc-900/50 hover:bg-zinc-900 text-zinc-200 border border-zinc-800 font-semibold px-8 py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 text-base"
                >
                  <span>Lihat Pilihan Paket</span>
                  <ArrowRight className="w-4 h-4 text-zinc-500" />
                </a>
              </div>

              {/* Promo tag */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-zinc-500 pt-1">
                <span className="w-2 h-2 rounded-full bg-stable-500 animate-ping" />
                <span>Sedang Berlangsung: <strong className="text-zinc-300">Promo Bebas Biaya Instalasi Rp0</strong></span>
              </div>

            </div>

            {/* Right Interactive Dashboard Widget */}
            <div className="lg:col-span-5 w-full max-w-md mx-auto">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-[#0c0c10] rounded-3xl border border-zinc-800/80 shadow-2xl overflow-hidden"
              >
                {/* Widget Header */}
                <div className="bg-[#121218] p-5 text-white border-b border-zinc-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-brand-400 animate-pulse" />
                    <span className="font-display font-bold text-sm tracking-wide uppercase">MNET Fiber Lab</span>
                  </div>
                  <span className="bg-stable-500 text-zinc-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                    Live Simulator
                  </span>
                </div>

                {/* Widget Body */}
                <div className="p-6 space-y-6">
                  
                  {/* Explanation */}
                  <div className="text-center space-y-1.5">
                    <h3 className="font-display font-bold text-lg text-white">Uji Perbandingan Kecepatan</h3>
                    <p className="text-xs text-zinc-400">
                      Bandingkan kualitas MNET Fiber (Speed Symmetrical 1:1) dengan internet konvensional tidak simetris.
                    </p>
                  </div>

                  {/* Provider Switcher */}
                  <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-900">
                    <button
                      id="speed-provider-mnet"
                      onClick={() => !simSpeedTestActive && setSimProvider('mnet')}
                      disabled={simSpeedTestActive}
                      className={`py-2.5 rounded-xl font-bold text-xs transition-all duration-200 ${
                        simProvider === 'mnet'
                          ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-zinc-950 shadow-md font-extrabold'
                          : 'text-zinc-400 hover:text-zinc-200 disabled:opacity-50'
                      }`}
                    >
                      🚀 MNET FIBER (1:1)
                    </button>
                    <button
                      id="speed-provider-trad"
                      onClick={() => !simSpeedTestActive && setSimProvider('traditional')}
                      disabled={simSpeedTestActive}
                      className={`py-2.5 rounded-xl font-bold text-xs transition-all duration-200 ${
                        simProvider === 'traditional'
                          ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-zinc-950 shadow-md font-extrabold'
                          : 'text-zinc-400 hover:text-zinc-200 disabled:opacity-50'
                      }`}
                    >
                      Konvensional (Asimetris)
                    </button>
                  </div>

                  {/* Meter Screen */}
                  <div className="bg-slate-950 p-5 rounded-2xl text-center relative overflow-hidden flex flex-col justify-between h-44 border border-zinc-900">
                    
                    {/* Background Tech Wave Lines */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:16px_16px]" />

                    {/* Ping Indicator */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 relative z-10">
                      <span>PING: <strong className={simPing > 0 ? (simPing < 10 ? "text-stable-500 font-bold" : "text-amber-500 font-bold") : "text-zinc-500"}>{simPing > 0 ? `${simPing} ms` : '--'}</strong></span>
                      <span>STABILITAS: <strong className="text-brand-400">{simProvider === 'mnet' ? '100% Fiber' : '35% Tembaga'}</strong></span>
                    </div>

                    {/* Speed Gauges */}
                    <div className="grid grid-cols-2 gap-4 relative z-10 my-auto">
                      {/* Download */}
                      <div className="border-r border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-zinc-400 tracking-wider block uppercase">DOWNLOAD</span>
                        <div className="font-mono text-3xl font-black text-white tracking-tight leading-none">
                          {simDownload > 0 ? simDownload : '0.0'}
                          <span className="text-xs text-brand-400 font-normal ml-0.5">Mbps</span>
                        </div>
                      </div>
                      
                      {/* Upload */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-zinc-400 tracking-wider block uppercase">UPLOAD</span>
                        <div className="font-mono text-3xl font-black text-white tracking-tight leading-none">
                          {simUpload > 0 ? simUpload : '0.0'}
                          <span className="text-xs text-brand-400 font-normal ml-0.5">Mbps</span>
                        </div>
                      </div>
                    </div>

                    {/* Tester Progress bar */}
                    <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden relative z-10">
                      <div
                        className="bg-gradient-to-r from-brand-500 to-brand-400 h-full transition-all duration-100 ease-out"
                        style={{ width: `${simProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Trigger Button */}
                  <button
                    id="run-speed-test-btn"
                    onClick={startSpeedTest}
                    disabled={simSpeedTestActive}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 font-bold py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 disabled:bg-zinc-950 disabled:text-zinc-600 cursor-pointer shadow-md"
                  >
                    {simSpeedTestActive ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-brand-400" />
                        <span>Menguji Jaringan ({simProgress}%)</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-brand-400" />
                        <span>Mulai Uji Speed {simProvider === 'mnet' ? 'MNET' : 'Konvensional'}</span>
                      </>
                    )}
                  </button>

                  {/* Simulator Educational Footer Message */}
                  <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-900 flex gap-2 items-start text-xs text-zinc-400">
                    <Sparkles className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <span>
                      {simProvider === 'mnet' 
                        ? 'Analisis: MNET Fiber menghasilkan kecepatan Unggah (Upload) yang setara dengan Unduh (Download) sehingga video call dan upload file berjalan mulus seketika.'
                        : 'Analisis: Internet asimetris memiliki upload sangat lambat. Akibatnya, saat Anda mengunggah konten atau live jualan, internet akan lag parah dan terputus.'}
                    </span>
                  </div>

                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Keunggulan (Advantages) Section */}
      <section id="keunggulan" className="py-20 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-brand-400">KEUNGGULAN UTAMA</h2>
            <p className="font-display font-black text-3xl sm:text-4xl text-white leading-tight">
              Mengapa Wargi Bandung Harus Memilih MNET FIBER?
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-400 to-brand-600 mx-auto rounded-full" />
            <p className="text-zinc-400 text-sm sm:text-base">
              Kami berkomitmen menyajikan kebebasan berinternet tanpa batasan kuota dengan infrastruktur serat optik tercanggih langsung ke lokasi Anda.
            </p>
          </div>

          {/* Advantages Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ADVANTAGES.map((adv, index) => {
              // Highlight the crucial unlimited and 1:1 speed features
              const isHighlighted = adv.title.includes('UNLIMITED') || adv.title.includes('SPEED 1:1');
              
              return (
                <div
                  key={index}
                  className={`p-8 rounded-3xl transition-all duration-300 border hover:shadow-2xl ${
                    isHighlighted 
                      ? 'bg-gradient-to-b from-[#0e0e12] to-[#07070a] border-brand-500/20 relative overflow-hidden shadow-brand-500/5' 
                      : 'bg-[#0c0c10] border-zinc-900 hover:border-zinc-800'
                  }`}
                >
                  {isHighlighted && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-brand-400 to-brand-600 text-brand-950 text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                      REKOMENDASI WARGI
                    </div>
                  )}

                  <div className="flex flex-col gap-5">
                    {/* Icon Container */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isHighlighted ? 'bg-gradient-to-br from-brand-400 to-brand-600 text-brand-950 shadow-md shadow-brand-500/10' : 'bg-zinc-900 text-brand-400 border border-zinc-800'
                    }`}>
                      {renderIcon(adv.icon, 'w-5 h-5')}
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="font-display font-bold text-lg text-white tracking-tight flex items-center gap-2">
                        {adv.title}
                        {adv.title.includes('24 JAM') && (
                          <span className="bg-stable-500/10 text-stable-400 border border-stable-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">LIVE</span>
                        )}
                      </h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        {adv.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Activity Needs (Kebutuhan Aktivitas) Section */}
      <section id="kebutuhan" className="py-20 bg-[#07070a] border-y border-zinc-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-brand-400">KEBUTUHAN INTERNET</h2>
            <p className="font-display font-black text-3xl sm:text-4xl text-white leading-tight">
              Tunjang Segala Aktivitas Tanpa Buffering
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-400 to-brand-600 mx-auto rounded-full" />
            <p className="text-zinc-400 text-sm sm:text-base">
              Apapun kesibukan digital Anda di Bandung, pastikan didukung oleh jaringan internet handal yang murni unlimited.
            </p>
          </div>

          {/* Use Cases Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {USE_CASES.map((uc, index) => (
              <div
                key={index}
                className="bg-[#0c0c10] p-6 rounded-2xl border border-zinc-900 hover:border-zinc-800 hover:shadow-lg transition-all duration-300 flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  {/* Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 text-brand-400 border border-zinc-850 flex items-center justify-center">
                      {renderIcon(uc.icon, 'w-4 h-4')}
                    </div>
                    <span className="text-[10px] font-extrabold bg-zinc-900 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {uc.badge}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-base text-white">{uc.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{uc.description}</p>
                  </div>
                </div>

                <a 
                  href={`https://wa.me/6281221520966?text=Halo%20MNET%20Fiber%2C%20saya%20tertarik%20tanya%20paket%20internet%20yang%20bagus%20untuk%20kebutuhan%20${encodeURIComponent(uc.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 group/btn"
                >
                  <span>Konsultasi Paket</span>
                  <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            ))}
          </div>

          {/* Advisor Tool Widget inside Use Case section */}
          <div className="mt-16 bg-[#0c0c10] rounded-3xl border border-zinc-900 p-8 shadow-xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Advisor Left explanation */}
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-1 bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2.5 py-1 rounded-lg text-xs font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>Rekomendator Paket Pintar</span>
                </div>
                <h3 className="font-display font-bold text-2xl text-white">Berapa Kecepatan WiFi yang Anda Butuhkan?</h3>
                <p className="text-sm text-zinc-400">
                  Pilih aktivitas rutin dan jumlah gadget di lokasi Anda untuk menghitung rekomendasi paket terbaik secara instan.
                </p>
              </div>

              {/* Advisor Center Inputs */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Step 1: Select Activities */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 block uppercase tracking-wider">
                    Pilih Aktivitas Utama Anda (Bisa lebih dari satu)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'olshop', label: '🛒 Jualan Online' },
                      { id: 'school', label: '🎓 Belajar Online' },
                      { id: 'gaming', label: '🎮 Main Game' },
                      { id: 'streaming', label: '📺 Nonton Video/TV' },
                      { id: 'influencer', label: '✨ Live / Upload Konten' }
                    ].map(act => {
                      const isSelected = selectedActivities.includes(act.id);
                      return (
                        <button
                          key={act.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedActivities(selectedActivities.filter(a => a !== act.id));
                            } else {
                              setSelectedActivities([...selectedActivities, act.id]);
                            }
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                            isSelected 
                              ? 'bg-gradient-to-r from-brand-400 to-brand-600 border-brand-500 text-brand-950 shadow-md font-bold' 
                              : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-750'
                          }`}
                        >
                          {act.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Device Count */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 block uppercase tracking-wider">
                    Berapa banyak HP / TV / Komputer yang tersambung WiFi?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: '1-3', label: '🏠 1 - 3 Perangkat' },
                      { id: '4-8', label: '🏠 4 - 8 Perangkat' },
                      { id: '8+', label: '🏢 8+ Perangkat / Lebih' }
                    ].map(dev => (
                      <button
                        key={dev.id}
                        onClick={() => setDeviceCount(dev.id)}
                        className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          deviceCount === dev.id
                            ? 'bg-gradient-to-r from-brand-400 to-brand-600 border-brand-500 text-brand-950 shadow-md font-bold'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-750'
                        }`}
                      >
                        {dev.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results Preview */}
                {recommendedPlan && (
                  <div className="bg-[#121218] p-4 rounded-2xl border border-zinc-900 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest block">REKOMENDASI UNTUK ANDA</span>
                      <strong className="text-white font-display text-lg tracking-tight block">
                        {recommendedPlan.name} ({recommendedPlan.speed} Mbps)
                      </strong>
                      <span className="text-xs text-brand-400 font-bold">
                        Hanya Rp {recommendedPlan.price.toLocaleString('id-ID')}/bulan
                      </span>
                    </div>

                    <button
                      onClick={() => selectPlanForOrder(recommendedPlan.id)}
                      className="bg-gradient-to-r from-brand-400 to-brand-600 text-brand-950 hover:from-brand-500 hover:to-brand-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all"
                    >
                      Pilih Paket Ini
                    </button>
                  </div>
                )}

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Paket & Harga (Pricing) Section */}
      <section id="paket" className="py-20 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-brand-400">PILIHAN PAKET MNET</h2>
            <p className="font-display font-black text-3xl sm:text-4xl text-white leading-tight">
              Daftar Paket Internet Murah & Terjangkau
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-400 to-brand-600 mx-auto rounded-full" />
            <p className="text-zinc-400 text-sm sm:text-base">
              Pilih paket internet wifi yang paling sesuai untuk kebutuhan hunian Anda. Semua paket murni tanpa kuota FUP dan gratis biaya pemasangan awal!
            </p>

            {/* Category Selector Tab */}
            <div className="flex justify-center pt-8">
              <div className="bg-zinc-950 p-1.5 rounded-2xl flex gap-1.5 border border-zinc-900">
                <button
                  id="tab-category-home"
                  onClick={() => setActiveTab('home')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    activeTab === 'home'
                      ? 'bg-gradient-to-r from-brand-400 to-brand-600 text-zinc-950 shadow-md font-extrabold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  🏠 Rumah & Kost (Best Seller)
                </button>
                <button
                  id="tab-category-gamer"
                  onClick={() => setActiveTab('gamer')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    activeTab === 'gamer'
                      ? 'bg-gradient-to-r from-brand-400 to-brand-600 text-zinc-950 shadow-md font-extrabold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  🎮 Gamer & Streamer
                </button>
                <button
                  id="tab-category-biz"
                  onClick={() => setActiveTab('business')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    activeTab === 'business'
                      ? 'bg-gradient-to-r from-brand-400 to-brand-600 text-zinc-950 shadow-md font-extrabold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  🏢 Bisnis & Cafe
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-[#0c0c10] rounded-3xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                  plan.isPopular 
                    ? 'border-brand-500/40 shadow-2xl shadow-brand-500/5 ring-1 ring-brand-500/30' 
                    : 'border-zinc-900 hover:border-zinc-800 hover:shadow-lg'
                }`}
              >
                {/* Popularity Badge */}
                {plan.isPopular && (
                  <div className="bg-gradient-to-r from-brand-400 to-brand-600 text-brand-950 text-[10px] font-black uppercase tracking-wider py-1.5 text-center absolute top-0 left-0 right-0">
                    PAKET PALING LARIS DI BANDUNG
                  </div>
                )}

                {/* Card Top */}
                <div className={`p-6 ${plan.isPopular ? 'pt-10' : ''} space-y-6`}>
                  
                  {/* Category & Speed Indicator */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest block">
                        KATEGORI {plan.category === 'home' ? 'RUMAHAN' : plan.category === 'gamer' ? 'GAMING' : 'BISNIS'}
                      </span>
                      <h3 className="font-display font-extrabold text-xl text-white mt-1">{plan.name}</h3>
                    </div>
                    <div className="bg-brand-500/10 text-brand-400 font-mono font-black text-xs px-3 py-1.5 rounded-xl border border-brand-500/20 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-brand-400 text-brand-400" />
                      <span>{plan.speed} Mbps</span>
                    </div>
                  </div>

                  {/* Pricing Info */}
                  <div className="border-y border-zinc-900 py-4 space-y-1">
                    {plan.originalPrice && (
                      <div className="text-xs text-zinc-500 line-through">
                        Rp {plan.originalPrice.toLocaleString('id-ID')}
                      </div>
                    )}
                    <div className="flex items-baseline">
                      <span className="text-xs font-bold text-zinc-400 mr-1">Rp</span>
                      <span className="font-display font-black text-3xl text-white tracking-tight">
                        {plan.price.toLocaleString('id-ID')}
                      </span>
                      <span className="text-xs font-medium text-zinc-400 ml-1">/bulan</span>
                    </div>
                    <span className="text-[10px] font-bold text-stable-400 block bg-stable-500/10 border border-stable-500/20 rounded-lg px-2 py-0.5 w-fit">
                      Harga Net / Flat Tidak Berubah
                    </span>
                  </div>

                  {/* Suitability Points */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-500 block uppercase tracking-wider">Ideal Untuk:</span>
                    <div className="flex flex-wrap gap-1">
                      {plan.bestFor.map((bf, idx) => (
                        <span key={idx} className="bg-zinc-900 text-zinc-300 border border-zinc-850 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                          {bf}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features Checklist */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-zinc-500 block uppercase tracking-wider">Fitur Termasuk:</span>
                    <ul className="space-y-2.5">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                          <CheckCircle className="w-3.5 h-3.5 text-stable-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Card CTA */}
                <div className="p-6 bg-[#07070a] border-t border-zinc-900/80 flex flex-col gap-2.5 rounded-b-3xl">
                  <button
                    onClick={() => selectPlanForOrder(plan.id)}
                    className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-brand-950 font-extrabold py-3 rounded-xl shadow-md shadow-brand-500/10 text-xs sm:text-sm tracking-wide transition-all duration-200"
                  >
                    Ajukan Pemasangan
                  </button>
                  <a
                    href={`https://wa.me/6281221520966?text=Halo%20MNET%20Fiber%2C%20saya%20tertarik%20tanya-tanya%20mengenai%20paket%20${encodeURIComponent(plan.name)}%20berkecepatan%20${plan.speed}%20Mbps%20seharga%20Rp%20${plan.price.toLocaleString('id-ID')}%20per%20bulan.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 font-semibold py-2.5 rounded-xl text-center text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-stable-500" />
                    <span>Tanya Admin via WA</span>
                  </a>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Coverage Checker (Cek Area) Section */}
      <section id="cek-area" className="py-20 bg-[#07070a] border-y border-zinc-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Area description */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs uppercase font-extrabold tracking-widest text-brand-400">PETA JARINGAN BANDUNG</span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-tight">
                Cek Ketersediaan Kabel Fiber Optic MNET di Rumah Anda
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Jaringan utama MNET FIBER telah terbentang di berbagai wilayah strategis kota Bandung. Gunakan pencarian instan di sebelah kanan untuk melihat kelurahan Anda apakah sudah 100% tercover atau dalam masa perluasan (partial/upcoming).
              </p>

              {/* Quick Area Coverage highlights */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-stable-500 shrink-0" />
                  <span>Hijau (Covered): Siap daftar langsung aktif.</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span>Kuning (Partial): Tercover sebagian jalan, butuh survey tiang terdekat.</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <span>Biru (Upcoming): Sedang ditarik jalur utama, daftar prioritas!</span>
                </div>
              </div>
            </div>

            {/* Right Column Search Widget */}
            <div className="lg:col-span-7">
              <div className="bg-[#0c0c10] rounded-3xl border border-zinc-900 p-6 sm:p-8 shadow-2xl space-y-6">
                
                <div className="space-y-1.5">
                  <h3 className="font-display font-bold text-lg text-white">Cari Kelurahan / Area Anda</h3>
                  <p className="text-xs text-zinc-400">
                    Contoh ketik: Dago, Antapani, Sukajadi, Kiaracondong, Pasteur, dsb.
                  </p>
                </div>

                {/* Search Input Autocomplete */}
                <div className="relative">
                  <div className="flex items-center bg-zinc-950 border border-zinc-850 focus-within:border-brand-500 focus-within:bg-[#121218] rounded-2xl px-4 py-3.5 transition-all duration-200">
                    <Search className="w-5 h-5 text-zinc-500 mr-3 shrink-0" />
                    <input
                      type="text"
                      placeholder="Ketik nama kelurahan di Bandung..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowAreaSuggestions(true);
                      }}
                      onFocus={() => setShowAreaSuggestions(true)}
                      className="bg-transparent text-sm w-full outline-none text-white font-medium placeholder:text-zinc-500"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedArea(null);
                        }}
                        className="text-zinc-500 hover:text-zinc-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Suggestions List */}
                  {showAreaSuggestions && searchQuery.trim().length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#121218] border border-zinc-800 rounded-2xl shadow-2xl z-20 overflow-hidden max-h-60 overflow-y-auto">
                      {filteredAreas.length > 0 ? (
                        filteredAreas.map((area, idx) => (
                           <button
                            key={idx}
                            onClick={() => selectAreaSuggestion(area)}
                            className="w-full text-left px-4 py-3 hover:bg-zinc-900 flex items-center justify-between border-b border-zinc-900 text-xs sm:text-sm font-medium transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-zinc-500" />
                              <span className="text-zinc-100">{area.name}</span>
                              <span className="text-[10px] text-zinc-400 bg-zinc-950 border border-zinc-850 px-1.5 py-0.5 rounded-md">
                                Kec. {area.subdistrict}
                              </span>
                            </div>
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              area.status === 'covered' 
                                ? 'bg-stable-500/10 text-stable-400 border border-stable-500/20'
                                : area.status === 'partial'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {area.status === 'covered' ? 'Tersedia' : area.status === 'partial' ? 'Sebagian' : 'Segera Hadir'}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center text-xs text-zinc-500 space-y-2">
                          <p>Kelurahan "{searchQuery}" belum terdata di database cepat.</p>
                          <button
                            onClick={() => {
                              setSelectedArea({
                                name: searchQuery,
                                subdistrict: 'Bandung',
                                status: 'partial',
                                notes: 'Area kustom Anda. Harap isi data diri lengkap agar tim kami dapat melakukan survey tiang eksternal.'
                              });
                              setLeadSubdistrict(searchQuery);
                              setShowAreaSuggestions(false);
                            }}
                            className="text-xs font-bold text-brand-400 hover:text-brand-300 underline"
                          >
                            Ajukan Survey Mandiri untuk Area Ini
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Display Chosen Area Status Result */}
                {selectedArea && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-5 rounded-2xl border ${
                      selectedArea.status === 'covered'
                        ? 'bg-stable-500/5 border-stable-500/20'
                        : selectedArea.status === 'partial'
                        ? 'bg-amber-500/5 border-amber-500/20'
                        : 'bg-blue-500/5 border-blue-500/20'
                    }`}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="font-display font-extrabold text-sm uppercase tracking-wide flex items-center gap-1.5 text-zinc-150">
                          <MapPin className="w-4 h-4 text-brand-400" />
                          <span>Status: {selectedArea.name}</span>
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          selectedArea.status === 'covered'
                            ? 'bg-stable-500 text-zinc-950 shadow-sm font-extrabold'
                            : selectedArea.status === 'partial'
                            ? 'bg-amber-500 text-zinc-950 shadow-sm font-extrabold'
                            : 'bg-blue-500 text-zinc-950 shadow-sm font-extrabold'
                        }`}>
                          {selectedArea.status === 'covered' ? 'MNET ACTIVE COVERED' : selectedArea.status === 'partial' ? 'PARTIAL COVERAGE' : 'UPCOMING EXPANSION'}
                        </span>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
                        {selectedArea.notes}
                      </p>

                      <div className="pt-2 border-t border-zinc-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-[11px] text-zinc-400 text-center sm:text-left">
                          {selectedArea.status === 'covered'
                            ? '🎉 Selamat! Jaringan utama fiber kami aktif penuh di area ini.'
                            : '⚠️ Silakan isi formulir agar admin mencocokkan jarak tiang terdekat.'}
                        </span>
                        
                        <button
                          onClick={() => {
                            setLeadSubdistrict(selectedArea.name);
                            const el = document.getElementById('formulir-daftar');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-zinc-800 transition-colors text-center"
                        >
                          Isi Form Tercover ({selectedArea.name})
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Simulated Map Visualizer */}
                <div className="bg-zinc-950 rounded-2xl p-4 border border-zinc-900 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">
                      <Cable className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-xs sm:text-sm text-zinc-200 block">Survey Jaringan Gratis Bandung</strong>
                      <span className="text-[10px] text-zinc-400 block leading-tight">Teknisi kami siap datang mengecek ketersediaan tiang depan rumah Anda.</span>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/6281221520966?text=Halo%20MNET%20FIBER%2C%20bisa%20tolong%20survey%20tiang%20internet%20wifi%20terdekat%20di%20alamat%20saya%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-zinc-900 hover:bg-zinc-850 text-zinc-200 text-[10px] font-bold px-3.5 py-2.5 rounded-xl border border-zinc-800 shrink-0 shadow-sm"
                  >
                    Minta Survey WA
                  </a>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Leads Lead Form (Formulir Pengajuan) Section */}
      <section id="formulir-daftar" className="py-20 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Card Outer */}
          <div className="bg-[#0c0c10] border border-zinc-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            
            {/* Graphics Background */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-400/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4 mb-10">
              <span className="bg-gradient-to-r from-brand-400 to-brand-600 text-brand-950 text-xs font-black uppercase px-3 py-1 rounded-full w-fit mx-auto tracking-wider">
                MULAI GABUNG MNET FIBER
              </span>
              <h2 className="font-display font-black text-3xl md:text-4xl text-white">
                Formulir Pendaftaran & Cek Lokasi Detail
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto">
                Isi data lengkap Anda di bawah ini. Tim MNET akan memproses ketersediaan tiang wifi terdekat dan menghubungi Anda segera via WhatsApp!
              </p>
            </div>

            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-950/85 border border-zinc-800 backdrop-blur-md rounded-2xl p-8 text-center space-y-6 max-w-md mx-auto"
              >
                <div className="w-16 h-16 bg-[#10b981] rounded-full flex items-center justify-center mx-auto text-white shadow-lg shadow-emerald-500/25">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-xl text-white">Pendaftaran Berhasil Terkirim!</h3>
                  <p className="text-xs text-zinc-400">
                    Sistem kami sedang menyambungkan Anda ke WhatsApp Admin MNET FIBER dengan draf formulir otomatis Anda. Mohon tunggu...
                  </p>
                </div>

                <div className="text-[11px] font-mono text-brand-400 bg-zinc-900 py-2.5 px-4 rounded-xl border border-zinc-800">
                  Membuka WhatsApp Anda...
                </div>

                <button
                  onClick={() => setFormSubmitted(false)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 underline"
                >
                  Daftar ulang / masukkan data baru
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-6 max-w-xl mx-auto">
                
                {/* Input row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                      Nama Lengkap Wargi *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama lengkap"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-brand-500 focus:bg-[#121218] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                      Nomor WhatsApp Aktif *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081221520966"
                      value={leadWhatsapp}
                      onChange={(e) => setLeadWhatsapp(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-brand-500 focus:bg-[#121218] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Input row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Subdistrict */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                      Kelurahan / Area Bandung *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Dago / Antapani"
                      value={leadSubdistrict}
                      onChange={(e) => setLeadSubdistrict(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-brand-500 focus:bg-[#121218] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all"
                    />
                  </div>

                  {/* Plan selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                      Pilihan Paket Internet *
                    </label>
                    <select
                      value={leadPlanId}
                      onChange={(e) => setLeadPlanId(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-brand-500 focus:bg-[#121218] rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                    >
                      {INTERNET_PLANS.map(plan => (
                        <option key={plan.id} value={plan.id} className="bg-zinc-950 text-white">
                          {plan.name} ({plan.speed} Mbps) - Rp {plan.price.toLocaleString('id-ID')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Full Address */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                    Alamat Lengkap & Patokan Rumah *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Contoh: Jl. Dago Elos No. 24, RT 03/RW 05, Kel. Dago, dekat Warung Bu Ipah"
                    value={leadAddress}
                    onChange={(e) => setLeadAddress(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-brand-500 focus:bg-[#121218] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all resize-none"
                  />
                </div>

                {/* Submitting guidelines */}
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 text-xs text-zinc-400 leading-relaxed text-left space-y-1">
                  <div className="flex gap-2 items-center text-brand-400 font-bold mb-1">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Benefit Tambahan Pendaftaran Hari Ini:</span>
                  </div>
                  <p>• Pemasangan gratis diatur dalam waktu cepat.</p>
                  <p>• Perangkat modem/router dipinjamkan full gratis selama berlangganan.</p>
                  <p>• Jaminan bantuan teknis cepat dari tim support 24 jam kami.</p>
                </div>

                {/* Submit button */}
                <button
                  id="submit-pendaftaran-btn"
                  type="submit"
                  className="w-full bg-[#10b981] hover:bg-[#0ea5e9] active:scale-[0.98] text-white font-display font-bold text-base py-4 rounded-2xl shadow-xl shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                  <span>KIRIM DATA & BUKA WHATSAPP</span>
                </button>

                <p className="text-center text-[10px] text-zinc-500">
                  Dengan mengklik tombol, draf pendaftaran akan tersimpan di sistem kami & Anda akan disambungkan langsung ke admin untuk prioritas pemasangan.
                </p>

              </form>
            )}

          </div>

        </div>
      </section>

      {/* Bandung Testimonials Section */}
      <section className="py-20 bg-[#07070a] border-t border-zinc-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-brand-400">TESTIMONI WARGI</h2>
            <p className="font-display font-black text-3xl sm:text-4xl text-white leading-tight">
              Kata Wargi Bandung yang Telah Menggunakan MNET FIBER
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-400 to-brand-600 mx-auto rounded-full" />
            <p className="text-zinc-400 text-sm sm:text-base">
              Ratusan rumah, kos-kosan, cafe, dan UMKM di Bandung telah memercayakan koneksi internet harian mereka kepada kami.
            </p>
          </div>

          {/* Testimonial grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Testimonial 1 */}
            <div className="bg-[#0c0c10] p-8 rounded-3xl border border-zinc-900 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex text-amber-500">
                  {'★'.repeat(5)}
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed italic">
                  "Sangat puas pakai MNET 50 Mbps di daerah Dago! Saya sehari-hari jualan olshop sering live streaming TikTok. Sebelumnya pake wifi tetangga sering putus dan lemot pas live, pas ganti MNET fiber lancar jaya, live HD lancar dan untungnya UNLIMITED tanpa FUP jadi bebas download sepuasnya."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-6 border-t border-zinc-900 mt-6">
                <div className="w-10 h-10 rounded-full bg-zinc-900 text-brand-400 border border-zinc-800 font-bold flex items-center justify-center text-xs">
                  TF
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white">Teh Fanny Fauziah</h4>
                  <span className="text-[10px] text-zinc-500">Olshop Owner, Dago Bandung</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-[#0c0c10] p-8 rounded-3xl border border-zinc-900 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex text-amber-500">
                  {'★'.repeat(5)}
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed italic">
                  "Sebagai mahasiswa sekalian gamer kompetitif di Bandung, ping stabil itu harga mati. MNET Gamer Pro beneran membuktikan speed 1:1 nya. Ping Valorant konstan di angka single digit 4-7ms! Gak pernah lag lagi walau di kosan dipake bareng anak-anak kos lain."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-6 border-t border-zinc-900 mt-6">
                <div className="w-10 h-10 rounded-full bg-zinc-900 text-brand-400 border border-zinc-800 font-bold flex items-center justify-center text-xs">
                  AR
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white">Kang Asep Rian</h4>
                  <span className="text-[10px] text-zinc-500">Gamer & Mahasiswa, Coblong Bandung</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-[#0c0c10] p-8 rounded-3xl border border-zinc-900 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex text-amber-500">
                  {'★'.repeat(5)}
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed italic">
                  "Kami langganan paket Ultra Biz untuk cafe kami di Sukajadi. Pelanggan seneng nongkrong lama karena wifi kenceng dan stabil. Biaya bulanan murah banget dibanding provider bisnis lain, pelayanannya IT 24 jam sangat membantu jika modem butuh restart malam hari."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-6 border-t border-zinc-900 mt-6">
                <div className="w-10 h-10 rounded-full bg-zinc-900 text-brand-400 border border-zinc-800 font-bold flex items-center justify-center text-xs">
                  WJ
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white">Warung Kopi Jaya</h4>
                  <span className="text-[10px] text-zinc-500">Owner Cafe, Sukajadi Bandung</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FAQs Section */}
      <section id="faq" className="py-20 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-brand-400">FAQ (TANYA JAWAB)</h2>
            <p className="font-display font-black text-3xl sm:text-4xl text-white leading-tight">
              Pertanyaan yang Sering Diajukan
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-400 to-brand-600 mx-auto rounded-full" />
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = expandedFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-[#0c0c10] border border-zinc-900 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setExpandedFaqIndex(isOpen ? null : index)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-display font-bold text-sm sm:text-base text-white">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-brand-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-zinc-500 shrink-0" />
                    )}
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-5 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-900 pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Admin Log Dashboard (Discreet Drawer for the Business Owner) */}
      <section className="bg-[#050505] text-white py-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-zinc-900">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2 justify-center md:justify-start">
                <Database className="w-5 h-5 text-brand-400" />
                <span>MNET Internal Database</span>
              </h3>
              <p className="text-xs text-zinc-500">
                Khusus pemilik bisnis MNET FIBER untuk memantau data pendaftaran wargi Bandung yang terkirim.
              </p>
            </div>

            {/* Login Toggle */}
            <div>
              {!isAdminAuthenticated ? (
                <button
                  onClick={() => setIsAdminOpen(!isAdminOpen)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 border border-zinc-800"
                >
                  <Lock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{isAdminOpen ? 'Tutup Panel Admin' : 'Akses Dashboard Admin'}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsAdminAuthenticated(false);
                    setIsAdminOpen(false);
                  }}
                  className="bg-red-950/20 hover:bg-red-950/40 text-red-400 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 border border-red-950"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Logout Admin</span>
                </button>
              )}
            </div>
          </div>

          {/* Admin Login Form / Panel */}
          {isAdminOpen && !isAdminAuthenticated && (
            <div className="max-w-md mx-auto py-8">
              <form onSubmit={handleAdminAuth} className="bg-[#0c0c10] p-6 rounded-2xl border border-zinc-900 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">OTENTIKASI DATABASE</h4>
                  <p className="text-[11px] text-zinc-500">Masukkan sandi khusus owner untuk melihat leads masuk.</p>
                </div>
                
                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="Sandi (Gunakan: admin123)"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-brand-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Masuk ke Dashboard
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Admin Log View when Authenticated */}
          {isAdminAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8 space-y-6"
            >
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c0c10] p-4 rounded-2xl border border-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="bg-brand-500/10 text-brand-400 p-2.5 rounded-xl border border-brand-500/20">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">TOTAL LEADS MASUK</span>
                    <strong className="text-xl text-white block font-display leading-none mt-1">
                      {leads.length} Pengajuan Wargi
                    </strong>
                  </div>
                </div>

                {/* Filter Search Input */}
                <div className="w-full sm:w-64 bg-zinc-950 border border-zinc-800 focus-within:border-brand-500 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Search className="w-4 h-4 text-zinc-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="Cari nama / kelurahan..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    className="bg-transparent text-xs text-white outline-none w-full"
                  />
                </div>
              </div>

              {/* Leads Table */}
              <div className="overflow-x-auto bg-[#0c0c10] border border-zinc-900 rounded-2xl">
                {leads.filter(l => 
                  l.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
                  l.subdistrict.toLowerCase().includes(adminSearch.toLowerCase())
                ).length > 0 ? (
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-zinc-950 border-b border-zinc-900 text-zinc-400 font-bold">
                        <th className="p-4 uppercase tracking-wider">Nama & Tgl</th>
                        <th className="p-4 uppercase tracking-wider">WhatsApp</th>
                        <th className="p-4 uppercase tracking-wider">Kelurahan / Alamat</th>
                        <th className="p-4 uppercase tracking-wider">Paket</th>
                        <th className="p-4 uppercase tracking-wider">Status</th>
                        <th className="p-4 uppercase tracking-wider text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {leads
                        .filter(l => 
                          l.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
                          l.subdistrict.toLowerCase().includes(adminSearch.toLowerCase())
                        )
                        .map((l) => (
                          <tr key={l.id} className="hover:bg-zinc-950/50 transition-colors">
                            <td className="p-4 space-y-1">
                              <div className="font-bold text-white text-sm">{l.name}</div>
                              <div className="text-[10px] text-zinc-500">{l.createdAt}</div>
                            </td>
                            <td className="p-4">
                              <a
                                href={`https://wa.me/${l.whatsapp.replace(/^0/, '62')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-400 hover:underline font-semibold flex items-center gap-1 w-fit"
                              >
                                <span>{l.whatsapp}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </td>
                            <td className="p-4 space-y-1">
                              <span className="bg-zinc-900 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                Kec. {l.subdistrict}
                              </span>
                              <p className="text-zinc-500 text-[11px] leading-tight max-w-xs pt-1">{l.address}</p>
                            </td>
                            <td className="p-4">
                              <span className="font-semibold text-brand-400">{l.selectedPlanName}</span>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-1.5">
                                {['Baru', 'Dihubungi', 'Terpasang'].map((st) => (
                                  <button
                                    key={st}
                                    onClick={() => updateLeadStatus(l.id, st as any)}
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                      l.status === st
                                        ? st === 'Baru'
                                          ? 'bg-[#3b82f6] text-white'
                                          : st === 'Dihubungi'
                                          ? 'bg-[#f59e0b] text-white'
                                          : 'bg-[#10b981] text-white'
                                        : 'bg-zinc-950 text-zinc-500 hover:text-zinc-350'
                                    }`}
                                  >
                                    {st}
                                  </button>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => deleteLead(l.id)}
                                className="text-red-400 hover:text-red-350 p-1 bg-red-950/10 hover:bg-red-950/30 rounded-lg transition-colors inline-flex cursor-pointer"
                                title="Hapus Lead"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-12 text-center text-zinc-500">
                    Belum ada data pendaftaran yang cocok dengan pencarian Anda.
                  </div>
                )}
              </div>

            </motion.div>
          )}

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] text-zinc-400 pt-16 pb-12 border-t border-zinc-900/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-zinc-900/80">
            
            {/* Footer Left Business info */}
            <div className="md:col-span-5 space-y-6">
              <a href="#" className="flex items-center gap-2.5">
                <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-2.5 rounded-xl text-white">
                  <Wifi className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-extrabold text-2xl tracking-tight text-white leading-none">
                    MNET <span className="text-brand-400">FIBER</span>
                  </span>
                  <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Bandung Unlimited</span>
                </div>
              </a>

              <p className="text-sm leading-relaxed text-zinc-400">
                Penyedia jaringan WiFi internet serat optik handal murah kencang murni tanpa kuota FUP untuk warga kota Bandung tercinta. Kami hadir untuk memenuhi kebutuhan internet rumahan, ruko, apartemen, cafe, maupun korporasi bisnis.
              </p>

              <div className="space-y-2 text-xs">
                <p className="flex items-center gap-2 text-white font-semibold">
                  <PhoneCall className="w-4 h-4 text-brand-400" />
                  <span>CS / Pemasangan: 0812-2152-0966</span>
                </p>
                <p className="flex items-center gap-2 text-zinc-500">
                  <Clock className="w-4 h-4 text-zinc-600" />
                  <span>Dukungan Teknis IT: 24 Jam Non-stop</span>
                </p>
                <p className="flex items-center gap-2 text-zinc-500">
                  <MapPin className="w-4 h-4 text-zinc-600" />
                  <span>Area Coverage: Seluruh Wilayah Kota Bandung</span>
                </p>
              </div>
            </div>

            {/* Footer Middle Navigation */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">NAVIGASI</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#keunggulan" className="hover:text-brand-400 transition-colors">Keunggulan Layanan</a></li>
                <li><a href="#kebutuhan" className="hover:text-brand-400 transition-colors">Kebutuhan Aktivitas</a></li>
                <li><a href="#paket" className="hover:text-brand-400 transition-colors">Paket & Harga Net</a></li>
                <li><a href="#cek-area" className="hover:text-brand-400 transition-colors">Cek Ketersediaan Kabel</a></li>
                <li><a href="#faq" className="hover:text-brand-400 transition-colors">Frequently Asked Questions</a></li>
              </ul>
            </div>

            {/* Footer Right Promo block */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">MNET PROMO BANDUNG</h4>
              <div className="bg-[#0c0c10] border border-zinc-900 p-5 rounded-2xl space-y-3">
                <span className="inline-block bg-[#10b981] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                  PROMO AKTIF
                </span>
                <p className="text-xs text-white font-semibold">
                  Bebas Biaya Pasang S/D Akhir Bulan!
                </p>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Segera hubungi tim marketing kami melalui Whatsapp untuk konsultasi pemasangan, gratis ditarik kabel fiber optik, dan gratis pinjam router wifi wifi murni.
                </p>
                <a
                  href="https://wa.me/6281221520966?text=Halo%20MNET%20FIBER%2C%20saya%20mau%20bertanya%20mengenai%20Promo%20Pemasangan%20Gratis%20di%20Kota%20Bandung."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-2 px-4 rounded-xl text-center text-xs block transition-all shadow-md shadow-brand-500/10 cursor-pointer"
                >
                  Tanya Promo via WA
                </a>
              </div>
            </div>

          </div>

          {/* Footer bottom bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p className="text-zinc-500 text-center sm:text-left">
              &copy; {new Date().getFullYear()} MNET FIBER Bandung. Hak Cipta Dilindungi. <br />
              <span className="text-[10px]">Dikelola khusus untuk melayani Wargi Kota Bandung.</span>
            </p>
            <div className="flex gap-4">
              <span className="text-zinc-600">Bandung Juara</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-600">MNET Internet Stabil</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating WhatsApp Action Button */}
      <a
        href="https://wa.me/6281221520966"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl flex items-center justify-center group active:scale-95 transition-all duration-300"
        title="Hubungi WhatsApp MNET"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:mr-3 transition-all duration-500 ease-out font-bold text-sm whitespace-nowrap">
          Hubungi MNET WiFi 🟢
        </span>
        <MessageSquare className="w-6 h-6 fill-white text-[#25D366]" />
      </a>

    </div>
  );
}
