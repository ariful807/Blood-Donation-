import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Tag, 
  Calendar, 
  Clock, 
  Eye, 
  Share2, 
  Check, 
  Youtube, 
  PenTool, 
  ChevronRight, 
  ArrowLeft, 
  Heart, 
  ExternalLink,
  MessageCircle,
  Copy,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { ArticleItem, User, SiteConfig } from '../../types';
import { storageService } from '../../services/storageService';
import { formatDriveImageUrl, getYouTubeEmbedUrl } from '../../utils/imageUtils';

interface BlogPageProps {
  currentUser: User | null;
  siteConfig?: SiteConfig;
  onOpenEmergencyModal?: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  currentUser,
  siteConfig,
  onOpenEmergencyModal
}) => {
  const [articles, setArticles] = useState<ArticleItem[]>(() => storageService.getArticles());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // New Article Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('স্বাস্থ্য বার্তা');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newYoutubeUrl, setNewYoutubeUrl] = useState('');
  const [newAuthor, setNewAuthor] = useState(currentUser?.name || '');
  const [newAuthorRole, setNewAuthorRole] = useState(currentUser?.role === 'admin' ? 'অ্যাডমিন পরিচালক' : 'স্বেচ্ছাসেবী রক্তদাতা');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = [
    { id: 'all', label: 'সকল নিবন্ধ' },
    { id: 'স্বাস্থ্য বার্তা', label: '🩺 স্বাস্থ্য বার্তা' },
    { id: 'রক্তদান সচেতনতা', label: '🩸 রক্তদান সচেতনতা' },
    { id: 'থ্যালাসেমিয়া ও সেবা', label: '🏥 থ্যালাসেমিয়া ও সেবা' },
    { id: 'স্বেচ্ছাসেবী অভিজ্ঞতা', label: '🤝 স্বেচ্ছাসেবী অভিজ্ঞতা' },
  ];

  const filteredArticles = articles.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenArticle = (article: ArticleItem) => {
    storageService.incrementArticleViews(article.id);
    setActiveArticle({ ...article, viewsCount: (article.viewsCount || 0) + 1 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyLink = (articleId: string) => {
    const shareUrl = window.location.origin + window.location.pathname + `?article=${articleId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    });
  };

  const handleShareWhatsApp = (article: ArticleItem) => {
    const text = encodeURIComponent(`*${article.title}*\n${article.excerpt}\n\nপড়ুন: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShareFacebook = (article: ArticleItem) => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const formattedImage = formatDriveImageUrl(newImageUrl);

    const created = storageService.addArticle({
      title: newTitle.trim(),
      category: newCategory,
      excerpt: newExcerpt.trim() || newContent.trim().substring(0, 120) + '...',
      content: newContent.trim(),
      author: newAuthor.trim() || 'স্বেচ্ছাসেবী লেখক',
      authorRole: newAuthorRole.trim() || 'লাইফসেভার ব্লাড ব্যাংক',
      imageUrl: formattedImage || undefined,
      youtubeUrl: newYoutubeUrl.trim() || undefined,
      date: new Date().toLocaleDateString('bn-BD'),
      readTime: '৩ মিনিট',
      tags: [newCategory, 'রক্তদান', 'স্বাস্থ্য']
    });

    setArticles(storageService.getArticles());
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowSubmitModal(false);
      // Reset
      setNewTitle('');
      setNewExcerpt('');
      setNewContent('');
      setNewImageUrl('');
      setNewYoutubeUrl('');
    }, 1500);
  };

  // Render Full Article View
  if (activeArticle) {
    const embedUrl = getYouTubeEmbedUrl(activeArticle.youtubeUrl);
    const featuredImg = formatDriveImageUrl(activeArticle.imageUrl);

    return (
      <div className="min-h-screen bg-stone-50 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Back & Action Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveArticle(null)}
              className="px-4 py-2 bg-white hover:bg-stone-100 text-stone-700 rounded-xl text-sm font-semibold border border-stone-200 transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>সকল ব্লগে ফিরে যান</span>
            </button>

            {/* Share Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCopyLink(activeArticle.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                  copiedLink
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>লিংক কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>কপি লিংক</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleShareWhatsApp(activeArticle)}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1"
                title="WhatsApp এ শেয়ার করুন"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>

              <button
                onClick={() => handleShareFacebook(activeArticle)}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1"
                title="Facebook এ শেয়ার করুন"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          {/* Article Main Card */}
          <article className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
            {/* Meta Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-red-50 text-[#B71C1C] rounded-xl text-xs font-bold border border-red-200">
                  {activeArticle.category}
                </span>
                <span className="text-xs text-stone-500 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{activeArticle.date}</span>
                </span>
                <span className="text-xs text-stone-500 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activeArticle.readTime || '৪ মিনিট'}</span>
                </span>
                <span className="text-xs text-stone-500 flex items-center space-x-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{activeArticle.viewsCount || 1} বার পঠিত</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 leading-tight">
                {activeArticle.title}
              </h1>

              {/* Author Bio Bar */}
              <div className="flex items-center space-x-3 pt-3 border-t border-stone-100">
                <div className="w-10 h-10 rounded-full bg-[#B71C1C] text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {activeArticle.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-stone-900 text-sm leading-tight">{activeArticle.author}</p>
                  <p className="text-xs text-stone-500">{activeArticle.authorRole || 'স্বাস্থ্য ও রক্তদান গবেষক'}</p>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {featuredImg && (
              <div className="rounded-2xl overflow-hidden shadow-sm border border-stone-200">
                <img
                  src={featuredImg}
                  alt={activeArticle.title}
                  className="w-full h-[260px] sm:h-[380px] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Embedded YouTube Video (if provided) */}
            {embedUrl && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-red-600 font-bold text-xs">
                  <Youtube className="w-4 h-4" />
                  <span>সংযুক্ত ভিডিও টিউটোরিয়াল ও আলোচনা:</span>
                </div>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md border border-stone-800 bg-black">
                  <iframe
                    src={embedUrl}
                    title={activeArticle.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Article Content Body */}
            <div className="prose max-w-none text-stone-800 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line pt-4 border-t border-stone-100">
              {activeArticle.content}
            </div>

            {/* Tags */}
            {activeArticle.tags && activeArticle.tags.length > 0 && (
              <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-stone-400" />
                {activeArticle.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-stone-100 text-stone-600 rounded-lg text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Bottom Sharing Bar */}
            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-stone-900 text-sm">নিবন্ধটি ভালো লাগলে বন্ধুদের সাথে শেয়ার করুন</h4>
                <p className="text-xs text-stone-500">আপনার একটি শেয়ারে অনেকে রক্তদানে সচেতন হতে পারে।</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopyLink(activeArticle.id)}
                  className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 flex items-center space-x-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'কপি হয়েছে!' : 'লিংক কপি'}</span>
                </button>
                <button
                  onClick={() => handleShareWhatsApp(activeArticle)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 flex items-center space-x-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  // Main Articles Listing View
  return (
    <div className="min-h-screen bg-stone-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header Window */}
        <div className="bg-gradient-to-br from-[#B71C1C] via-[#8E0000] to-[#5F0000] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold text-red-100 border border-white/20">
                <BookOpen className="w-3.5 h-3.5" />
                <span>স্বাস্থ্য বার্তা, পরামর্শ ও ভিডিও ব্লগ</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                রক্তদান স্বাস্থ্য ও সচেতনতা ব্লগ
              </h1>
              <p className="text-stone-200 text-sm sm:text-base leading-relaxed">
                রক্তদানের উপকারিতা, প্রয়োজনীয় নিয়মাবলী, থ্যালাসেমিয়া প্রতিরোধ এবং পুষ্টিকর খাদ্য তালিকার তথ্যবহুল নিবন্ধ ও বিশেষজ্ঞ চিকিৎসকের ভিডিও।
              </p>
            </div>

            {/* Write article button */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 shrink-0 border border-amber-500/30 cursor-pointer"
            >
              <PenTool className="w-4 h-4 fill-stone-900" />
              <span>আর্টিকেল লিখুন</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar Window */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-stone-200 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ব্লগের শিরোনাম, লেখক বা বিষয় দিয়ে অনুসন্ধান করুন..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B71C1C]/30 focus:border-[#B71C1C]"
              />
            </div>
            <div className="text-xs text-stone-500 font-medium shrink-0">
              <span className="px-3 py-1.5 bg-red-50 text-[#B71C1C] font-bold rounded-xl border border-red-100">
                মোট আর্টিকেল: {filteredArticles.length} টি
              </span>
            </div>
          </div>

          {/* Categories */}
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

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs space-y-3">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-lg font-bold text-stone-800">কোনো নিবন্ধ খুঁজে পাওয়া যায়নি</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              অনুগ্রহ করে অন্য কোনো কি-ওয়ার্ড দিয়ে সার্চ করুন অথবা নতুন ক্যাটাগরি নির্বাচন করুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => {
              const displayImg = formatDriveImageUrl(article.imageUrl);
              const hasVideo = Boolean(article.youtubeUrl);

              return (
                <div
                  key={article.id}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
                >
                  {/* Card Image */}
                  <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                    {displayImg ? (
                      <img
                        src={displayImg}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-800 to-stone-900 flex items-center justify-center text-white">
                        <BookOpen className="w-10 h-10 opacity-40" />
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white/95 backdrop-blur-md text-[#B71C1C] shadow-xs border border-white">
                        {article.category}
                      </span>
                    </div>

                    {/* YouTube indicator if video exists */}
                    {hasVideo && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl text-xs font-bold bg-red-600 text-white shadow-sm flex items-center space-x-1">
                        <Youtube className="w-3.5 h-3.5" />
                        <span>ভিডিও</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 text-xs text-stone-400">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{article.date}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime || '৩ মিনিট'}</span>
                        </span>
                      </div>

                      <h3
                        onClick={() => handleOpenArticle(article)}
                        className="font-bold text-stone-900 text-base sm:text-lg leading-snug group-hover:text-[#B71C1C] cursor-pointer transition-colors line-clamp-2"
                      >
                        {article.title}
                      </h3>

                      <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>

                    {/* Footer / Author & Action */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-red-100 text-[#B71C1C] flex items-center justify-center text-xs font-bold">
                          {article.author.charAt(0)}
                        </div>
                        <span className="text-xs font-medium text-stone-700 truncate max-w-[120px]">
                          {article.author}
                        </span>
                      </div>

                      <button
                        onClick={() => handleOpenArticle(article)}
                        className="text-xs font-bold text-[#B71C1C] hover:underline flex items-center space-x-1"
                      >
                        <span>পড়ুন</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Article Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <PenTool className="w-5 h-5 text-[#B71C1C]" />
                <h2 className="font-bold text-lg text-stone-900">নতুন স্বাস্থ্য বা সচেতনতামূলক নিবন্ধ লিখুন</h2>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl"
              >
                ✕
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-6 bg-emerald-50 text-emerald-800 rounded-2xl text-center space-y-2 border border-emerald-200">
                <Check className="w-8 h-8 mx-auto text-emerald-600" />
                <h3 className="font-bold">আর্টিকেলটি সফলভাবে প্রকাশিত হয়েছে!</h3>
              </div>
            ) : (
              <form onSubmit={handleCreateArticle} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">আর্টিকেলের শিরোনাম *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="যেমন: নিয়মিত রক্তদানে হার্ট সুস্থ থাকে কীভাবে?"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B71C1C]/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">ক্যাটাগরি *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B71C1C]/30"
                    >
                      <option value="স্বাস্থ্য বার্তা">স্বাস্থ্য বার্তা</option>
                      <option value="রক্তদান সচেতনতা">রক্তদান সচেতনতা</option>
                      <option value="থ্যালাসেমিয়া ও সেবা">থ্যালাসেমিয়া ও সেবা</option>
                      <option value="স্বেচ্ছাসেবী অভিজ্ঞতা">স্বেচ্ছাসেবী অভিজ্ঞতা</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">লেখকের নাম *</label>
                    <input
                      type="text"
                      required
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="আপনার নাম বা পরিচয়"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B71C1C]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">সংক্ষিপ্ত বিবরণ (Excerpt)</label>
                  <input
                    type="text"
                    value={newExcerpt}
                    onChange={(e) => setNewExcerpt(e.target.value)}
                    placeholder="আর্টিকেলের মূল কথার ১-২ লাইনের সারসংক্ষেপ"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B71C1C]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">সম্পূর্ণ নিবন্ধ/লেখা *</label>
                  <textarea
                    rows={6}
                    required
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="বিস্তারিত আলোচনা, পরামর্শ বা অভিজ্ঞতা লিখুন..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B71C1C]/30 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">কভার ছবির লিংক / ড্রাইভ লিংক (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://drive.google.com/... বা ইমেজ লিংক"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B71C1C]/30 text-xs"
                    />
                    <p className="text-[10px] text-stone-400 mt-1">গুগল ড্রাইভ লিংক দিলে তা স্বয়ংক্রিয়ভাবে কনভার্ট হবে।</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">ইউটিউব ভিডিও লিংক (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      value={newYoutubeUrl}
                      onChange={(e) => setNewYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B71C1C]/30 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 text-stone-600 rounded-xl text-xs font-semibold hover:bg-stone-100"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#B71C1C] hover:bg-[#8E0000] text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                  >
                    আর্টিকেল প্রকাশ করুন
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
