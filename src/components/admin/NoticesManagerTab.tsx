import React, { useState } from 'react';
import { NoticeItem } from '../../types';
import { storageService } from '../../services/storageService';
import { formatDriveImageUrl } from '../../utils/imageUtils';
import { Plus, Edit2, Trash2, Pin, Bell, ExternalLink, Save, X, Calendar, Tag, Paperclip } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NoticesManagerTabProps {
  onUpdated: () => void;
}

export const NoticesManagerTab: React.FC<NoticesManagerTabProps> = ({ onUpdated }) => {
  const [notices, setNotices] = useState<NoticeItem[]>(() => storageService.getNotices());
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'general' as NoticeItem['category'],
    content: '',
    publishDate: new Date().toISOString().split('T')[0],
    isPinned: false,
    actionUrl: '',
    actionText: '',
    attachmentUrl: ''
  });

  const reload = () => {
    setNotices(storageService.getNotices());
    onUpdated();
  };

  const handleOpenAdd = () => {
    setEditingNotice(null);
    setFormData({
      title: '',
      category: 'general',
      content: '',
      publishDate: new Date().toISOString().split('T')[0],
      isPinned: false,
      actionUrl: '',
      actionText: '',
      attachmentUrl: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (n: NoticeItem) => {
    setEditingNotice(n);
    setFormData({
      title: n.title,
      category: n.category,
      content: n.content,
      publishDate: n.publishDate,
      isPinned: !!n.isPinned,
      actionUrl: n.actionUrl || '',
      actionText: n.actionText || '',
      attachmentUrl: n.attachmentUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    if (editingNotice) {
      storageService.updateNotice(editingNotice.id, formData);
    } else {
      storageService.addNotice(formData);
    }

    setIsModalOpen(false);
    reload();
    try {
      confetti({ particleCount: 35, spread: 45 });
    } catch {}
  };

  const handleDelete = (id: string) => {
    if (window.confirm('এই নোটিসটি নিশ্চিতভাবে মুছে ফেলতে চান?')) {
      storageService.deleteNotice(id);
      reload();
    }
  };

  const handleTogglePin = (id: string) => {
    storageService.togglePinNotice(id);
    reload();
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-red-100 text-[#B71C1C] text-xs font-bold uppercase tracking-wider">
              নোটিস বোর্ড
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
            জরুরি ঘোষণা ও নোটিস ব্যবস্থাপনা
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            রক্তদান ক্যাম্প, জরুরি রক্তের ডাক বা সাধারণ সভা সম্পর্কিত বিজ্ঞপ্তি প্রকাশ করুন (ঐচ্ছিক URL ও ড্রাইভ ফাইল সহ)।
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#B71C1C] hover:bg-[#8E0000] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন নোটিস প্রকাশ করুন</span>
        </button>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {notices.length === 0 ? (
          <div className="text-center py-12 text-stone-500 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
            <Bell className="w-10 h-10 mx-auto text-stone-400 mb-2 opacity-50" />
            <p className="text-sm font-bold">কোনো নোটিস প্রকাশিত হয়নি</p>
          </div>
        ) : (
          notices.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                n.isPinned ? 'bg-amber-50/50 border-amber-300 shadow-2xs' : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {n.isPinned && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold text-[10px] flex items-center space-x-1">
                      <Pin className="w-2.5 h-2.5" />
                      <span>পিন করা নোটিস</span>
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-md bg-stone-200 text-stone-800 font-bold text-[10px]">
                    {n.category === 'emergency' ? '🚨 জরুরি' :
                     n.category === 'camp' ? '🏕️ ক্যাম্প' :
                     n.category === 'meeting' ? '👥 সভা' : '📢 সাধারণ'}
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    <span>{n.publishDate}</span>
                  </span>
                </div>

                <h3 className="font-bold text-base text-stone-900">{n.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line line-clamp-2">
                  {n.content}
                </p>

                {(n.actionUrl || n.attachmentUrl) && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {n.actionUrl && (
                      <span className="inline-flex items-center space-x-1 text-[11px] text-[#B71C1C] font-semibold bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                        <ExternalLink className="w-3 h-3" />
                        <span>লিঙ্ক: {n.actionText || n.actionUrl}</span>
                      </span>
                    )}
                    {n.attachmentUrl && (
                      <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        <Paperclip className="w-3 h-3" />
                        <span>ফাইল সংযুক্ত</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => handleTogglePin(n.id)}
                  className={`p-2 rounded-xl text-xs font-bold transition-all ${
                    n.isPinned ? 'bg-amber-400 text-stone-950' : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                  }`}
                  title={n.isPinned ? 'আনপিন করুন' : 'উপরে পিন করুন'}
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleOpenEdit(n)}
                  className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>এডিট</span>
                </button>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="px-3 py-2 bg-red-100 hover:bg-red-200 text-[#B71C1C] rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ডিলিট</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="text-lg font-bold text-stone-900">
                {editingNotice ? 'নোটিস সম্পাদনা করুন' : 'নতুন নোটিস প্রকাশ করুন'}
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
                  বিজ্ঞপ্তির শিরোনাম *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="যেমন: নীলফামারী সরকারি কলেজে বিনামূল্যে রক্তের গ্রুপ পরীক্ষা ক্যাম্প"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium"
                  >
                    <option value="general">সাধারণ ঘোষণা</option>
                    <option value="emergency">জরুরি বিজ্ঞপ্তি</option>
                    <option value="camp">রক্তদান ক্যাম্পিং</option>
                    <option value="meeting">জরুরি সভা</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    প্রকাশের তারিখ
                  </label>
                  <input
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  নোটিসের মূল বিবরণ / বক্তব্য *
                </label>
                <textarea
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="বিজ্ঞপ্তির বিস্তারিত এখানে লিখুন..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    অ্যাকশন URL (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={formData.actionUrl}
                    onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })}
                    placeholder="https://... অথবা apply"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    বাটন টেক্সট (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={formData.actionText}
                    onChange={(e) => setFormData({ ...formData, actionText: e.target.value })}
                    placeholder="যেমন: রেজিস্ট্রেশন করুন"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  সংযুক্ত ফাইল / ছবি লিঙ্ক (Google Drive Link ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={formData.attachmentUrl}
                  onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded-sm"
                />
                <label htmlFor="pinCheck" className="text-xs font-bold text-stone-800 cursor-pointer">
                  নোটিসটি সবার উপরে পিন (Pin to Top) করে রাখুন
                </label>
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
                  <span>{editingNotice ? 'হালনাগাদ করুন' : 'প্রকাশ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
