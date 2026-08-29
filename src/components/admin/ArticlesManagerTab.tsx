import React, { useState } from 'react';
import { ArticleItem } from '../../types';
import { storageService } from '../../services/storageService';
import { formatDriveImageUrl, getYouTubeEmbedUrl } from '../../utils/imageUtils';
import { Plus, Edit2, Trash2, Video, BookOpen, Share2, Copy, Check, Save, X, ExternalLink, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ArticlesManagerTabProps {
  onUpdated: () => void;
}

export const ArticlesManagerTab: React.FC<ArticlesManagerTabProps> = ({ onUpdated }) => {
  const [articles, setArticles] = useState<ArticleItem[]>(() => storageService.getArticles());
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'facts' as ArticleItem['category'],
    excerpt: '',
    content: '',
    coverImageUrl: '',
    youtubeUrl: '',
    authorName: 'এডমিন',
    tags: 'রক্তদান, স্বাস্থ্য, জীবন'
  });

  const reload = () => {
    setArticles(storageService.getArticles());
    onUpdated();
  };

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      category: 'facts',
      excerpt: '',
      content: '',
      coverImageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
      youtubeUrl: '',
      authorName: 'এডমিন',
      tags: 'রক্তদান, স্বাস্থ্য, সচেতনতা'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (art: ArticleItem) => {
    setEditingArticle(art);
    setFormData({
      title: art.title,
      category: art.category,
      excerpt: art.excerpt || '',
      content: art.content,
      coverImageUrl: art.coverImageUrl || '',
      youtubeUrl: art.youtubeUrl || '',
      authorName: art.authorName || 'এডমিন',
      tags: Array.isArray(art.tags) ? art.tags.join(', ') : ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title,
      category: formData.category,
      excerpt: formData.excerpt,
      content: formData.content,
      coverImageUrl: formData.coverImageUrl,
      youtubeUrl: formData.youtubeUrl,
      authorName: formData.authorName,
      tags: tagsArray,
      publishedDate: new Date().toISOString().split('T')[0]
    };

    if (editingArticle) {
      storageService.updateArticle(editingArticle.id, payload);
    } else {
      storageService.addArticle(payload);
    }

    setIsModalOpen(false);
    reload();
    try {
      confetti({ particleCount: 35, spread: 50 });
    } catch {}
  };

  const handleDelete = (id: string) => {
    if (window.confirm('এই আর্টিকেলটি কি মুছে ফেলতে চান?')) {
      storageService.deleteArticle(id);
      reload();
    }
  };

  const handleCopyShareLink = (art: ArticleItem) => {
    const url = `${window.location.origin}/#blog-${art.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(art.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const embedUrl = formData.youtubeUrl ? getYouTubeEmbedUrl(formData.youtubeUrl) : null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-red-100 text-[#B71C1C] text-xs font-bold uppercase tracking-wider">
              ব্লগ ও আর্টিকেল
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
            স্বাস্থ্য ও সচেতনতামূলক ব্লগ/ভিডিও ব্যবস্থাপনা
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            রক্তদানের স্বাস্থ্য উপকারিতা, নিয়মনীতি ও অনুপ্রেরণামূলক শিক্ষণীয় আর্টিকেল এবং ইউটিউব ভিডিও প্রকাশ ও পরিচালনা করুন।
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#B71C1C] hover:bg-[#8E0000] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন আর্টিকেল লিখুন</span>
        </button>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((art) => {
          const coverImg = art.coverImageUrl ? formatDriveImageUrl(art.coverImageUrl) : null;
          return (
            <div
              key={art.id}
              className="bg-stone-50 rounded-3xl overflow-hidden border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Cover Image & Tag */}
                <div className="relative h-44 w-full bg-stone-900 overflow-hidden">
                  {coverImg ? (
                    <img
                      src={coverImg}
                      alt={art.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-500">
                      <BookOpen className="w-10 h-10" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-stone-950/80 text-amber-300 font-bold text-[10px] uppercase backdrop-blur-xs">
                    {art.category === 'facts' ? 'তথ্য ও নিয়ম' :
                     art.category === 'health' ? 'স্বাস্থ্য পরামর্শ' :
                     art.category === 'stories' ? 'প্রেরণাদায়ী গল্প' : 'ক্যাম্পিং'}
                  </div>

                  {art.youtubeUrl && (
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-red-600/90 text-white font-bold text-[10px] flex items-center space-x-1 shadow-xs">
                      <Video className="w-3 h-3" />
                      <span>ভিডিও সংযুক্ত</span>
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>লেখক: {art.authorName || 'এডমিন'}</span>
                    <span>{art.publishedDate}</span>
                  </div>

                  <h3 className="font-bold text-base text-stone-900 line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {art.excerpt || art.content}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-white border-t border-stone-200/80 flex items-center justify-between">
                <button
                  onClick={() => handleCopyShareLink(art)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center space-x-1"
                >
                  {copiedId === art.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedId === art.id ? 'লিঙ্ক কপি হয়েছে!' : 'শেয়ার লিঙ্ক'}</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEdit(art)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold transition-all flex items-center space-x-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>এডিট</span>
                  </button>
                  <button
                    onClick={() => handleDelete(art.id)}
                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-[#B71C1C] rounded-lg text-xs font-bold transition-all flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>মুছে ফেলুন</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-stone-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="text-lg font-bold text-stone-900">
                {editingArticle ? 'আর্টিকেল এডিট করুন' : 'নতুন আর্টিকেল ও ভিডিও পোস্ট'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  আর্টিকেলের শিরোনাম *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="যেমন: নিয়মিত রক্তদানে হার্ট সুস্থ থাকে ও মেদ কমে"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium"
                  >
                    <option value="facts">তথ্য ও নিয়মাবলি</option>
                    <option value="health">স্বাস্থ্য পরামর্শ</option>
                    <option value="stories">প্রেরণাদায়ী অভিজ্ঞতা</option>
                    <option value="camps">ক্যাম্পিং ও সচেতনতা</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    লেখকের নাম
                  </label>
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    placeholder="এডমিন বা রক্তদাতা"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ট্যাগসমূহ (কমা দিয়ে)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="স্বাস্থ্য, রক্তদান, হার্ট"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  সংক্ষিপ্ত সারসংক্ষেপ (Excerpt)
                </label>
                <input
                  type="text"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="হোম পেজে প্রিভিউয়ের জন্য ১-২ লাইনের সারসংক্ষেপ..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  কভার ছবির লিঙ্ক (Google Drive Link / Direct Image URL)
                </label>
                <input
                  type="text"
                  value={formData.coverImageUrl}
                  onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  ইউটিউব ভিডিও লিঙ্ক (YouTube Video URL - ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=... অথবা https://youtu.be/..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900"
                />
                {embedUrl && (
                  <div className="mt-3 rounded-2xl overflow-hidden aspect-video border border-stone-300 bg-stone-950 shadow-xs">
                    <iframe
                      src={embedUrl}
                      title="YouTube preview"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  আর্টিকেলের সম্পূর্ণ বিবরণ / মূল বক্তব্য *
                </label>
                <textarea
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="এখানে আপনার সম্পূর্ণ আর্টিকেলটি লিখুন..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 leading-relaxed"
                  required
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#B71C1C] hover:bg-[#8E0000] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingArticle ? 'হালনাগাদ করুন' : 'আর্টিকেল পোস্ট করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
