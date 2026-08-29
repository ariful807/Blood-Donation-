import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  Pin, 
  Calendar, 
  UserCheck, 
  ExternalLink, 
  Share2, 
  Check, 
  AlertCircle, 
  Sparkles, 
  FileText,
  ChevronRight,
  Droplet,
  Info
} from 'lucide-react';
import { NoticeItem, SiteConfig } from '../../types';
import { storageService } from '../../services/storageService';

interface NoticePageProps {
  siteConfig?: SiteConfig;
  onOpenEmergencyModal?: () => void;
}

export const NoticePage: React.FC<NoticePageProps> = ({
  siteConfig,
  onOpenEmergencyModal
}) => {
  const [notices, setNotices] = useState<NoticeItem[]>(() => storageService.getNotices());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeNoticeModal, setActiveNoticeModal] = useState<NoticeItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'সকল নোটিস' },
    { id: 'urgent', label: '🔴 জরুরি সতর্কতা' },
    { id: 'camp', label: '🩸 ব্লাড ক্যাম্প' },
    { id: 'official', label: '🏛️ অফিসিয়াল বিজ্ঞপ্তি' },
    { id: 'general', label: '📢 সাধারণ নোটিস' },
  ];

  const filteredNotices = notices.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.publishedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const pinnedNotices = filteredNotices.filter(n => n.isPinned);
  const otherNotices = filteredNotices.filter(n => !n.isPinned);

  const handleCopyNoticeLink = (notice: NoticeItem) => {
    const url = window.location.href.split('?')[0] + `?notice=${notice.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(notice.id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'camp':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'official':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'urgent': return 'জরুরি সতর্কতা';
      case 'camp': return 'ব্লাড ক্যাম্প';
      case 'official': return 'অফিসিয়াল বিজ্ঞপ্তি';
      default: return 'সাধারণ বিজ্ঞপ্তি';
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header Window */}
        <div className="bg-gradient-to-br from-[#B71C1C] via-[#8E0000] to-[#5F0000] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold text-red-100 border border-white/20">
              <Bell className="w-3.5 h-3.5" />
              <span>কেন্দ্রীয় নোটিস বোর্ড ও জরুরি ঘোষণা</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              বিজ্ঞপ্তি ও সাংগঠনিক ঘোষণা
            </h1>
            <p className="text-stone-200 text-sm sm:text-base leading-relaxed">
              {siteConfig?.siteName || 'লাইফসেভার ব্লাড ব্যাংক'}-এর সর্বশেষ নোটিস, ক্যাম্পেইনের তারিখ, জরুরি রক্তের সতর্কতা ও সকল আপডেট তথ্য এখানে নিয়মিত প্রকাশ করা হয়।
            </p>
          </div>
        </div>

        {/* Search & Category Filter Window */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-stone-200 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="শিরোনাম, বিষয়বস্তু বা বিভাগ দিয়ে নোটিস খুঁজুন..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B71C1C]/30 focus:border-[#B71C1C]"
              />
            </div>

            {/* Total counter badge */}
            <div className="flex items-center space-x-2 text-xs text-stone-500 font-medium shrink-0">
              <span className="px-3 py-1.5 bg-red-50 text-[#B71C1C] font-bold rounded-xl border border-red-100">
                মোট নোটিস: {filteredNotices.length} টি
              </span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    active
                      ? 'bg-[#B71C1C] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pinned Notices Section */}
        {pinnedNotices.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-amber-700 font-bold text-sm sm:text-base">
              <Pin className="w-4 h-4 fill-amber-600 text-amber-600" />
              <span>গুরুত্বপূর্ণ পিন করা নোটিস</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {pinnedNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-amber-50/60 hover:bg-amber-50 rounded-2xl p-5 sm:p-6 border-2 border-amber-300 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-200 text-amber-900 border border-amber-300">
                          <Pin className="w-3 h-3 fill-amber-800" />
                          <span>পিন করা</span>
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${getCategoryBadgeClass(notice.category)}`}>
                          {notice.categoryLabel || getCategoryLabel(notice.category)}
                        </span>
                        <span className="text-xs text-stone-500 flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{notice.date}</span>
                        </span>
                      </div>

                      <h3 
                        onClick={() => setActiveNoticeModal(notice)}
                        className="text-lg sm:text-xl font-bold text-stone-900 hover:text-[#B71C1C] cursor-pointer transition-colors"
                      >
                        {notice.title}
                      </h3>

                      <p className="text-stone-700 text-sm leading-relaxed line-clamp-3">
                        {notice.content}
                      </p>

                      <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-stone-600">
                        <span className="flex items-center space-x-1 font-medium text-stone-500">
                          <UserCheck className="w-3.5 h-3.5 text-stone-400" />
                          <span>প্রকাশক: {notice.publishedBy}</span>
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex sm:flex-col items-center gap-2 shrink-0 pt-2 sm:pt-0">
                      <button
                        onClick={() => setActiveNoticeModal(notice)}
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
                      >
                        <span>সম্পূর্ণ পড়ুন</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {notice.externalUrl && (
                        <a
                          href={notice.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
                        >
                          <span>{notice.externalUrlText || 'লিংকে যান'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <button
                        onClick={() => handleCopyNoticeLink(notice)}
                        className="p-2 bg-white hover:bg-stone-100 text-stone-600 rounded-xl border border-stone-200 transition-colors"
                        title="শেয়ার লিংক কপি করুন"
                      >
                        {copiedId === notice.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Share2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Notices List */}
        <div className="space-y-4">
          {pinnedNotices.length > 0 && otherNotices.length > 0 && (
            <h3 className="font-bold text-stone-800 text-sm sm:text-base">অন্যান্য সকল নোটিস</h3>
          )}

          {otherNotices.length === 0 && pinnedNotices.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs space-y-3">
              <FileText className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-lg font-bold text-stone-800">কোনো নোটিস পাওয়া যায়নি</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                আপনার দেওয়া সার্চ বা ফিল্টারের সাথে মিলে এমন কোনো বিজ্ঞপ্তি এই মুহূর্তে বিদ্যমান নেই।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {otherNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-white hover:bg-stone-50/70 rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs hover:shadow-md transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${getCategoryBadgeClass(notice.category)}`}>
                          {notice.categoryLabel || getCategoryLabel(notice.category)}
                        </span>
                        <span className="text-xs text-stone-500 flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{notice.date}</span>
                        </span>
                      </div>

                      <h3 
                        onClick={() => setActiveNoticeModal(notice)}
                        className="text-base sm:text-lg font-bold text-stone-900 hover:text-[#B71C1C] cursor-pointer transition-colors"
                      >
                        {notice.title}
                      </h3>

                      <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                        {notice.content}
                      </p>

                      <div className="pt-1 flex flex-wrap items-center gap-3 text-xs text-stone-500">
                        <span className="flex items-center space-x-1">
                          <UserCheck className="w-3.5 h-3.5 text-stone-400" />
                          <span>প্রকাশক: {notice.publishedBy}</span>
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex sm:flex-col items-center gap-2 shrink-0 pt-2 sm:pt-0">
                      <button
                        onClick={() => setActiveNoticeModal(notice)}
                        className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1"
                      >
                        <span>বিস্তারিত</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {notice.externalUrl && (
                        <a
                          href={notice.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1"
                        >
                          <span>{notice.externalUrlText || 'লিংক'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      <button
                        onClick={() => handleCopyNoticeLink(notice)}
                        className="p-2 hover:bg-stone-100 text-stone-500 rounded-xl border border-stone-200 transition-colors"
                        title="শেয়ার লিংক কপি করুন"
                      >
                        {copiedId === notice.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Emergency Assistance Help Box */}
        <div className="bg-red-50 rounded-2xl p-6 border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#B71C1C] text-white flex items-center justify-center shrink-0">
              <Droplet className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">জরুরি রক্তের সাহায্য প্রয়োজন?</h4>
              <p className="text-xs text-stone-600">আমাদের তাৎক্ষণিক রক্তের রিকোয়েস্ট ফর্ম পূরণ করুন অথবা হটলাইনে সরাসরি কল দিন।</p>
            </div>
          </div>
          {onOpenEmergencyModal && (
            <button
              onClick={onOpenEmergencyModal}
              className="px-5 py-2.5 bg-[#B71C1C] hover:bg-[#8E0000] text-white text-xs font-bold rounded-xl shadow-xs shrink-0 transition-colors"
            >
              জরুরি রক্তের আবেদন করুন
            </button>
          )}
        </div>
      </div>

      {/* Notice Detail Modal */}
      {activeNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getCategoryBadgeClass(activeNoticeModal.category)}`}>
                  {activeNoticeModal.categoryLabel || getCategoryLabel(activeNoticeModal.category)}
                </span>
                {activeNoticeModal.isPinned && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center space-x-1">
                    <Pin className="w-3 h-3 fill-amber-700" />
                    <span>পিন করা</span>
                  </span>
                )}
              </div>
              <button
                onClick={() => setActiveNoticeModal(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                {activeNoticeModal.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 border-y border-stone-100 py-2.5">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>প্রকাশের তারিখ: {activeNoticeModal.date}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>কর্তৃপক্ষ: {activeNoticeModal.publishedBy}</span>
                </span>
              </div>

              <div className="text-stone-800 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-stone-50 p-5 rounded-2xl border border-stone-200/60">
                {activeNoticeModal.content}
              </div>

              {activeNoticeModal.externalUrl && (
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-emerald-900 font-medium">
                    এই বিজ্ঞপ্তির সাথে যুক্ত অনলাইন লিংক বা ফরম রয়েছে:
                  </div>
                  <a
                    href={activeNoticeModal.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-2 shrink-0 transition-colors"
                  >
                    <span>{activeNoticeModal.externalUrlText || 'সংযুক্ত লিংকে যান'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <button
                onClick={() => handleCopyNoticeLink(activeNoticeModal)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center space-x-2"
              >
                {copiedId === activeNoticeModal.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">লিংক কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>নোটিস লিংক কপি করুন</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setActiveNoticeModal(null)}
                className="px-6 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
