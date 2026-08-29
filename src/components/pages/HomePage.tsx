import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  Heart, 
  Users, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  PhoneCall, 
  MessageSquare, 
  Hospital, 
  MapPin, 
  Activity, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Search,
  CalendarCheck,
  Bell,
  BookOpen,
  Video,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { User, BloodRequest, BloodStockItem, BloodGroup, SiteConfig, HomeSliderItem, NoticeItem, ArticleItem } from '../../types';
import { EligibilityCalculator } from '../EligibilityCalculator';
import { HomeImageSlider } from '../HomeImageSlider';
import { storageService } from '../../services/storageService';
import { formatDriveImageUrl } from '../../utils/imageUtils';

interface HomePageProps {
  setCurrentPage: (page: string) => void;
  onOpenEmergencyModal: () => void;
  users: User[];
  requests: BloodRequest[];
  stock: BloodStockItem[];
  siteConfig?: SiteConfig;
}

export const HomePage: React.FC<HomePageProps> = ({
  setCurrentPage,
  onOpenEmergencyModal,
  users,
  requests,
  stock,
  siteConfig: propConfig
}) => {
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sliders, setSliders] = useState<HomeSliderItem[]>(() => storageService.getSliders());
  const [notices, setNotices] = useState<NoticeItem[]>(() => storageService.getNotices());
  const [articles, setArticles] = useState<ArticleItem[]>(() => storageService.getArticles());

  useEffect(() => {
    setSliders(storageService.getSliders());
    setNotices(storageService.getNotices());
    setArticles(storageService.getArticles());
  }, []);

  const config = propConfig || storageService.getSiteConfig();
  const safeUsers = users || [];
  const safeRequests = requests || [];
  const safeStock = stock || [];

  const totalDonors = safeUsers.filter(u => u.role === 'user').length;
  const activeRequests = safeRequests.filter(r => r.status === 'approved' || r.status === 'pending');
  const totalStockUnits = safeStock.reduce((sum, item) => sum + (item.unitCount || 0), 0);
  const urgentCount = activeRequests.filter(r => r.urgency === 'high').length;

  const filteredRequests = activeRequests.filter(r => {
    const matchesGroup = filterGroup === 'all' || r.bloodGroup === filterGroup;
    const matchesSearch = searchQuery === '' || 
      r.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requesterName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const latestNotices = notices.slice(0, 3);
  const latestArticles = articles.slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900 to-[#4A0000] text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle background glow circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#B71C1C]/25 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{config.heroBadge || 'নীলফামারী জেলা সেন্ট্রাল রক্তদান নেটওয়ার্ক'}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-tight">
                {config.heroTitle || 'রক্তের অভাবে ঝরবে না কোনো প্রাণ'}
              </h1>

              {/* Tagline */}
              <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                {config.heroSubtitle || '“রক্ত দিতে এক সেকেন্ড, বাঁচাতে এক জীবন”। নীলফামারী সদর, সৈয়দপুর, ডোমার, ডিমলা, জলঢাকা ও কিশোরগঞ্জ উপজেলার মুমূর্ষু রোগীর জরুরি রক্তের প্রয়োজনে তাৎক্ষণিক সহায়তা।'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onOpenEmergencyModal}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2.5 text-base border border-amber-300/50 group"
                >
                  <Droplet className="w-5 h-5 fill-red-700 text-red-700 group-hover:scale-110 transition-transform" />
                  <span>জরুরি রক্ত চাই (Emergency Request)</span>
                </button>

                <button
                  onClick={() => setCurrentPage('register')}
                  className="w-full sm:w-auto px-8 py-4 bg-[#B71C1C] hover:bg-[#8E0000] text-white font-bold rounded-2xl shadow-md transition-all duration-200 flex items-center justify-center space-x-2.5 text-base border border-red-500/30"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  <span>ডোনার হিসেবে যুক্ত হোন</span>
                </button>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>১০০% ভেরিফাইড ডোনার</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>৬টি উপজেলা কভারেজ</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>সম্পূর্ণ ফ্রি ও অলাভজনক</span>
                </div>
              </div>
            </div>

            {/* Right Card (Live Stats & Quick Search) */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                    <h3 className="font-bold text-white text-lg">
                      {config.statsSectionTitle || 'লাইভ ব্লাড ড্যাশবোর্ড'}
                    </h3>
                  </div>
                  <span className="text-xs bg-amber-400/20 text-amber-300 font-semibold px-2.5 py-1 rounded-full border border-amber-400/30">
                    রিয়েল-টাইম
                  </span>
                </div>

                {/* 4 Counter Matrix */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-stone-900/60 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
                      <span>মোট ডোনার</span>
                      <Users className="w-4 h-4 text-amber-400" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{totalDonors + 120}+</p>
                    <span className="text-[10px] text-emerald-400 font-medium">সক্রিয় সদস্য</span>
                  </div>

                  <div className="bg-stone-900/60 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
                      <span>সক্রিয় রিকোয়েস্ট</span>
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-red-400">{activeRequests.length}</p>
                    <span className="text-[10px] text-amber-400 font-medium">{urgentCount} অতি জরুরি</span>
                  </div>

                  <div className="bg-stone-900/60 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
                      <span>আজকের ডোনেশন</span>
                      <CalendarCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-emerald-400">১২+</p>
                    <span className="text-[10px] text-stone-400">ব্যাগ রক্তদান সম্পন্ন</span>
                  </div>

                  <div className="bg-stone-900/60 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
                      <span>উপলব্ধ ব্লাড স্টক</span>
                      <Droplet className="w-4 h-4 text-sky-400" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-sky-300">{totalStockUnits}</p>
                    <span className="text-[10px] text-stone-400">ইউনিট সংরক্ষিত</span>
                  </div>
                </div>

                {/* Instant Blood Group Finder */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-stone-300">
                    কোন গ্রুপের রক্ত খুঁজছেন?
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <button
                        key={bg}
                        onClick={() => {
                          setFilterGroup(bg);
                          const el = document.getElementById('live-requests-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="py-2 rounded-xl bg-white/10 hover:bg-[#B71C1C] hover:border-amber-400 text-white font-bold text-sm border border-white/10 transition-all text-center"
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOME IMAGE SLIDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomeImageSlider
          sliders={sliders}
          onNavigate={(page) => setCurrentPage(page)}
          onOpenEmergencyModal={onOpenEmergencyModal}
        />
      </section>

      {/* 3. LATEST NOTICES (বিজ্ঞপ্তি ও নোটিস বোর্ড) */}
      {latestNotices.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-[#B71C1C] flex items-center justify-center">
                  <Bell className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900">
                    {config.noticeSectionTitle || 'জরুরি নোটিস ও আপডেট'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {config.noticeSectionSubtitle || 'নীলফামারী রক্তদান নেটওয়ার্কের সাম্প্রতিক ঘোষণা ও ক্যাম্পিং নোটিস।'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCurrentPage('notice')}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#B71C1C] hover:text-[#8E0000] bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-all self-start sm:self-auto"
              >
                <span>সকল নোটিস দেখুন ({notices.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {latestNotices.map((notice) => (
                <div 
                  key={notice.id}
                  onClick={() => setCurrentPage('notice')}
                  className="p-4 rounded-2xl bg-stone-50 hover:bg-red-50/40 border border-stone-200/80 hover:border-red-200 transition-all cursor-pointer space-y-3 group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-stone-200 text-stone-800 text-[10px] font-bold">
                        {notice.category === 'emergency' ? '🚨 জরুরি' :
                         notice.category === 'camp' ? '🏕️ ক্যাম্প' :
                         notice.category === 'meeting' ? '👥 সভা' : '📢 সাধারণ'}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {notice.publishDate}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-stone-900 group-hover:text-[#B71C1C] transition-colors line-clamp-2">
                      {notice.title}
                    </h4>

                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {notice.content}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                    <span>বিস্তারিত দেখুন</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 text-[#B71C1C] transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. WHY BLOOD DONATION MATTERS - 3 CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 text-[#B71C1C] text-xs font-bold uppercase tracking-wider">
            <span>জীবনরক্ষাকারী মানবিক সেবা</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900">
            কেন রক্তদান গুরুত্বপূর্ণ?
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            আপনার দেয়া এক ব্যাগ রক্ত কেবল একজন রোগীর জীবনই বাঁচায় না, বরং সমাজের জন্য একটি অনন্য আশীর্বাদ।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-[#B71C1C] text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
              <Heart className="w-7 h-7 fill-white" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-3">
              ১. কারও জীবন বাঁচান
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              দুর্ঘটনা, ক্যান্সার, প্রসূতি মা কিংবা থ্যালাসেমিয়া রোগীর বেঁচে থাকার একমাত্র উপায় রক্ত। আপনার রক্তদান একজন মানুষের মুখে হাসি ফেরাতে পারে।
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
              <Activity className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-3">
              ২. নিজের স্বাস্থ্য ভালো রাখুন
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              নিয়মিত রক্তদানে শরীরে নতুন রক্তকণিকা তৈরি হয়, হৃদরোগ ও স্ট্রোকের ঝুঁকি কমে এবং বিনামূল্যে নিজের রক্তের প্রাথমিক পরীক্ষা হয়ে যায়।
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-3">
              ৩. সমাজে আত্মতৃপ্তি ও অবদান
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              স্বেচ্ছাসেবী হিসেবে একটি সক্রিয় রক্তদাতা পরিবারের অংশ হোন। মানবতার স্বার্থে নিঃস্বার্থ ভালোবাসা ছড়ানোর চেয়ে বড় শান্তি আর কিছুতে নেই।
            </p>
          </div>
        </div>
      </section>

      {/* 3. LIVE BLOOD REQUESTS BOARD (জরুরি রক্তের চাহিদা) */}
      <section id="live-requests-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-100/90 rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-600 animate-ping"></span>
                <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
                  {config.urgentRequestsTitle || 'সর্বশেষ রক্তের প্রয়োজন (Live Requests)'}
                </h2>
              </div>
              <p className="text-stone-600 text-sm">
                {config.urgentRequestsSubtitle || 'জরুরি প্রয়োজনে দ্রুত রক্তদাতাদের সাথে যোগাযোগ করুন অথবা আবেদন জানান।'}
              </p>
            </div>

            <button
              onClick={onOpenEmergencyModal}
              className="bg-[#B71C1C] hover:bg-[#8E0000] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xs transition-colors flex items-center space-x-2 self-start md:self-auto"
            >
              <Droplet className="w-4 h-4 fill-white" />
              <span>জরুরি আবেদন যোগ করুন</span>
            </button>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Blood group selector */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => setFilterGroup('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  filterGroup === 'all'
                    ? 'bg-[#B71C1C] text-white'
                    : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
                }`}
              >
                সকল গ্রুপ ({activeRequests.length})
              </button>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <button
                  key={bg}
                  onClick={() => setFilterGroup(bg)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    filterGroup === bg
                      ? 'bg-[#B71C1C] text-white'
                      : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="হাসপাতাল, উপজেলা বা নাম..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-red-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Live Request Cards Grid */}
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-stone-300 space-y-3">
              <Droplet className="w-12 h-12 text-stone-300 mx-auto" />
              <p className="text-stone-600 font-semibold text-sm">
                এই ফিল্টারে বর্তমানে কোনো সক্রিয় রক্তের অনুরোধ নেই।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-4 relative overflow-hidden flex flex-col justify-between"
                >
                  {/* Urgency Ribbon / Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-stone-400">
                      #{req.id}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        req.urgency === 'high'
                          ? 'bg-red-100 text-red-700 animate-pulse'
                          : req.urgency === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {req.urgency === 'high' ? '🚨 অতি জরুরি' : req.urgency === 'medium' ? '⚡ জরুরি' : 'নরমাল'}
                    </span>
                  </div>

                  {/* Blood Group Header & Patient Info */}
                  <div className="flex items-center space-x-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#B71C1C] to-[#7F0000] text-white flex flex-col items-center justify-center font-black shadow-sm shrink-0">
                      <span className="text-base leading-none">{req.bloodGroup}</span>
                      <span className="text-[9px] font-medium text-amber-300 mt-0.5">রক্ত</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                        {req.requesterName}
                      </h4>
                      <p className="text-xs text-stone-500 font-medium">
                        প্রয়োজন: <span className="font-bold text-red-600">{req.unitsRequired} ব্যাগ</span> • {req.neededTime}
                      </p>
                    </div>
                  </div>

                  {/* Location & Details */}
                  <div className="space-y-1.5 text-xs text-stone-600 bg-stone-50/70 p-3 rounded-xl border border-stone-100">
                    <div className="flex items-center space-x-2">
                      <Hospital className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate font-semibold text-stone-800">{req.hospital}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{req.district}</span>
                    </div>
                    {req.patientProblem && (
                      <p className="text-[11px] text-stone-500 bg-stone-50 p-2 rounded-lg italic">
                        "{req.patientProblem}"
                      </p>
                    )}
                  </div>

                  {/* Contact / Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                    <a
                      href={`tel:${req.contact}`}
                      className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-2xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>কল দিন</span>
                    </a>
                    <a
                      href={`https://wa.me/${req.contact.replace(/[^0-9]/g, '')}?text=লাইফসেভার%20ব্লাড%20ব্যাংক%20থেকে%20যোগাযোগ%20করছি`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>হোয়াটসঅ্যাপ</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. BLOOD STOCK INVENTORY SUMMARY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                সংরক্ষণাগার স্থিতি
              </span>
              <h2 className="text-2xl font-bold text-stone-900">
                {config.bloodStockTitle || 'ব্লাড স্টক ও প্রাপ্যতা (Blood Inventory)'}
              </h2>
              {config.bloodStockSubtitle && (
                <p className="text-xs text-stone-500 mt-0.5">{config.bloodStockSubtitle}</p>
              )}
            </div>
            <span className="text-xs text-stone-500 bg-stone-100 py-1.5 px-3 rounded-xl">
              সর্বশেষ আপডেট: আজ সকাল ০৮:৩০
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
            {safeStock.map((item) => {
              const isLow = item.unitCount <= item.minimumThreshold;
              return (
                <div
                  key={item.bloodGroup}
                  className={`rounded-2xl p-4 text-center border transition-all ${
                    isLow
                      ? 'bg-red-50/70 border-red-200'
                      : 'bg-stone-50 border-stone-200 hover:border-amber-400'
                  }`}
                >
                  <div className="text-lg font-black text-stone-900 mb-1">
                    {item.bloodGroup}
                  </div>
                  <div className={`text-2xl font-bold ${isLow ? 'text-red-600' : 'text-stone-800'}`}>
                    {item.unitCount}
                  </div>
                  <div className="text-[10px] text-stone-500 font-medium">ব্যাগ অবশিষ্ট</div>
                  {isLow && (
                    <span className="inline-block mt-2 text-[9px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded-sm">
                      স্বল্পতা
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. ELIGIBILITY CALCULATOR WIDGET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EligibilityCalculator />
      </section>

      {/* 6. HOW BLOOD DONATION PROCESS WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-xl space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              সহজ ও সুরক্ষিত ৪ ধাপ
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold">
              কীভাবে রক্তদান সম্পন্ন হয়?
            </h2>
            <p className="text-stone-400 text-sm">
              রক্তদান সম্পূর্ণ নিরাপদ এবং এতে মাত্র ১০-১৫ মিনিট সময় প্রয়োজন হয়।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-stone-800/80 rounded-2xl p-6 border border-stone-700 space-y-3">
              <span className="w-8 h-8 rounded-full bg-amber-400 text-stone-950 font-bold flex items-center justify-center text-sm">
                ১
              </span>
              <h4 className="font-bold text-base text-white">১. নিবন্ধন ও স্বাস্থ্য পরীক্ষা</h4>
              <p className="text-stone-400 text-xs leading-relaxed">
                ডোনার হিসেবে নাম, রক্ত গ্রুপ ও মোবাইল নম্বর দিয়ে নিবন্ধন করুন এবং রক্তচাপ ও হিমোগ্লোবিন চেক করুন।
              </p>
            </div>

            <div className="bg-stone-800/80 rounded-2xl p-6 border border-stone-700 space-y-3">
              <span className="w-8 h-8 rounded-full bg-amber-400 text-stone-950 font-bold flex items-center justify-center text-sm">
                ২
              </span>
              <h4 className="font-bold text-base text-white">২. ম্যাচিং ও কল গ্রহণ</h4>
              <p className="text-stone-400 text-xs leading-relaxed">
                আপনার এলাকার কোনো রোগীর আপনার রক্তের প্রয়োজন হলে আমাদের প্ল্যাটফর্ম থেকে আপনাকে জানানো হবে।
              </p>
            </div>

            <div className="bg-stone-800/80 rounded-2xl p-6 border border-stone-700 space-y-3">
              <span className="w-8 h-8 rounded-full bg-amber-400 text-stone-950 font-bold flex items-center justify-center text-sm">
                ৩
              </span>
              <h4 className="font-bold text-base text-white">৩. রক্তদান সম্পন্ন</h4>
              <p className="text-stone-400 text-xs leading-relaxed">
                হাসপাতাল বা ব্লাড সেন্টারে প্রশিক্ষিত স্বাস্থ্যকর্মীর তত্ত্বাবধানে আরামদায়ক পরিবেশে রক্ত দিন।
              </p>
            </div>

            <div className="bg-stone-800/80 rounded-2xl p-6 border border-stone-700 space-y-3">
              <span className="w-8 h-8 rounded-full bg-emerald-400 text-stone-950 font-bold flex items-center justify-center text-sm">
                ৪
              </span>
              <h4 className="font-bold text-base text-white">৪. রিফ্রেশমেন্ট ও স্বস্তি</h4>
              <p className="text-stone-400 text-xs leading-relaxed">
                রক্তদানের পর হালকা জুস বা নাশতা গ্রহণ করুন এবং একজন মুমূর্ষু রোগীর প্রাণ বাঁচানোর স্বর্গীয় আনন্দ উপভোগ করুন।
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setCurrentPage('register')}
              className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-8 py-3.5 rounded-2xl transition-all shadow-md inline-flex items-center space-x-2 text-sm"
            >
              <span>আজই ডোনার হিসেবে যুক্ত হোন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. HEALTH & BLOOD BLOG HIGHLIGHTS */}
      {latestArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-red-100 text-[#B71C1C] text-xs font-bold uppercase tracking-wider">
                  জ্ঞান ও স্বাস্থ্য পরামর্শ
                </span>
                <h3 className="text-2xl font-bold text-stone-900 mt-1">
                  {config.blogSectionTitle || 'রক্তদান ও স্বাস্থ্য ব্লগ'}
                </h3>
                <p className="text-xs text-stone-500">
                  {config.blogSectionSubtitle || 'রক্তদানের উপকারিতা, নিয়মাবলি ও সচেতনতামূলক শিক্ষণীয় ভিডিও ও প্রবন্ধ।'}
                </p>
              </div>

              <button
                onClick={() => setCurrentPage('blog')}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-stone-800 hover:text-[#B71C1C] bg-white hover:bg-stone-100 border border-stone-200 px-4 py-2 rounded-xl transition-all shadow-2xs self-start sm:self-auto"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>সবগুলো আর্টিকেল পড়ুন ({articles.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setCurrentPage('blog')}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Cover or Thumbnail */}
                    <div className="relative h-44 w-full bg-stone-900 overflow-hidden">
                      {art.coverImageUrl ? (
                        <img
                          src={formatDriveImageUrl(art.coverImageUrl)}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-stone-800 to-[#7F0000] flex items-center justify-center text-white/50">
                          <BookOpen className="w-12 h-12" />
                        </div>
                      )}
                      {art.youtubeUrl && (
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-red-600/90 text-white text-[11px] font-bold flex items-center space-x-1 shadow-md">
                          <Video className="w-3 h-3" />
                          <span>ভিডিও সহ</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-stone-950/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold uppercase">
                        {art.category === 'facts' ? 'তথ্য ও নিয়ম' :
                         art.category === 'health' ? 'স্বাস্থ্য পরামর্শ' :
                         art.category === 'stories' ? 'প্রেরণাদায়ী গল্প' : 'ক্যাম্পিং'}
                      </div>
                    </div>

                    <div className="px-5 space-y-2">
                      <h4 className="font-bold text-base text-stone-900 group-hover:text-[#B71C1C] transition-colors line-clamp-2">
                        {art.title}
                      </h4>
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {art.excerpt || art.content}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span>লেখক: {art.authorName || 'এডমিন'}</span>
                    <span className="text-[#B71C1C] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center space-x-1">
                      <span>পড়ুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. NILPHAMARI INITIATIVES: GALLERY & APPLY DUAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gallery Card */}
          <div className="bg-gradient-to-br from-stone-900 to-[#7F0000] text-white rounded-3xl p-8 border border-red-900/40 shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs">
                📸 কার্যক্রম ও স্মৃতিশালা
              </span>
              <h3 className="text-2xl font-bold text-white">
                {config.gallerySectionTitle || 'নীলফামারী রক্তদান কার্যক্রম গ্যালারি'}
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                {config.gallerySectionSubtitle || 'কলেজ প্রাঙ্গণে রক্তদান ক্যাম্প, বিনামূল্যে রক্তের গ্রুপ পরীক্ষা, সচেতনতামূলক র‍্যালি ও সেরা স্বেচ্ছাসেবীদের সম্মাননা চিত্রাবলি।'}
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('gallery')}
              className="px-6 py-3 bg-white text-stone-950 hover:bg-amber-300 font-bold text-xs rounded-xl transition-all shadow-xs self-start flex items-center space-x-2"
            >
              <span>সম্পূর্ণ গ্যালারি দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Apply Card */}
          <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-stone-900 text-stone-950 rounded-3xl p-8 border border-amber-400/40 shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-stone-950 text-amber-300 font-bold text-xs">
                🤝 সেবা ও অংশীদারিত্ব
              </span>
              <h3 className="text-2xl font-bold text-stone-950">
                {config.applySectionTitle || 'স্বেচ্ছাসেবী বা ক্যাম্প আয়োজনে আবেদন'}
              </h3>
              <p className="text-stone-900 font-medium text-xs sm:text-sm leading-relaxed">
                {config.applySectionSubtitle || 'আপনার প্রতিষ্ঠানে রক্তদান ক্যাম্প আয়োজন করতে চান অথবা টিম নীলফামারীর সাথে ভলান্টিয়ার হিসেবে কাজ করতে সরাসরি আবেদন ফরম জমা দিন।'}
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('apply')}
              className="px-6 py-3 bg-stone-950 hover:bg-stone-900 text-white font-bold text-xs rounded-xl transition-all shadow-xs self-start flex items-center space-x-2"
            >
              <span>আবেদন ফরম পূরণ করুন</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
