import React, { useState } from 'react';
import { HomeSliderItem } from '../../types';
import { storageService } from '../../services/storageService';
import { formatDriveImageUrl } from '../../utils/imageUtils';
import { Plus, Edit2, Trash2, Eye, EyeOff, Image, Save, X, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SlidersManagerTabProps {
  onUpdated: () => void;
}

export const SlidersManagerTab: React.FC<SlidersManagerTabProps> = ({ onUpdated }) => {
  const [sliders, setSliders] = useState<HomeSliderItem[]>(() => storageService.getSliders());
  const [editingSlider, setEditingSlider] = useState<HomeSliderItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    badgeText: '',
    imageUrl: '',
    buttonText: 'রক্তদান করুন',
    buttonLink: 'register',
    isActive: true
  });

  const reload = () => {
    setSliders(storageService.getSliders());
    onUpdated();
  };

  const handleOpenAddModal = () => {
    setEditingSlider(null);
    setFormData({
      title: '',
      subtitle: '',
      badgeText: 'জীবন বাঁচান',
      imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80',
      buttonText: 'রক্তদান করুন',
      buttonLink: 'register',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (slider: HomeSliderItem) => {
    setEditingSlider(slider);
    setFormData({
      title: slider.title,
      subtitle: slider.subtitle,
      badgeText: slider.badgeText || '',
      imageUrl: slider.imageUrl,
      buttonText: slider.buttonText || 'রক্তদান করুন',
      buttonLink: slider.buttonLink || 'register',
      isActive: slider.isActive
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) return;

    if (editingSlider) {
      storageService.updateSlider(editingSlider.id, formData);
    } else {
      storageService.addSlider(formData);
    }

    setIsModalOpen(false);
    reload();
    try {
      confetti({ particleCount: 40, spread: 50 });
    } catch {}
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি এই স্লাইডটি মুছে ফেলতে চান?')) {
      storageService.deleteSlider(id);
      reload();
    }
  };

  const handleToggleActive = (slider: HomeSliderItem) => {
    storageService.updateSlider(slider.id, { isActive: !slider.isActive });
    reload();
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-red-100 text-[#B71C1C] text-xs font-bold uppercase tracking-wider">
              হোম স্লাইডার
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
            হোম পেজ ইমেজ স্লাইডার ব্যবস্থাপনা
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            হোম পেজের আকর্ষণীয় ব্যানার ও ইমেজ ক্যারোসেলে স্লাইড যোগ, এডিট বা অন/অফ করুন। ড্রাইভের লিঙ্ক সরাসরি কনভার্ট হবে।
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-[#B71C1C] hover:bg-[#8E0000] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন স্লাইড যোগ করুন</span>
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sliders.map((slider) => {
          const previewImage = formatDriveImageUrl(slider.imageUrl);
          return (
            <div
              key={slider.id}
              className={`rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                slider.isActive ? 'bg-white border-stone-200 shadow-sm' : 'bg-stone-50 border-stone-200 opacity-60'
              }`}
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-48 w-full bg-stone-900 overflow-hidden">
                  <img
                    src={previewImage}
                    alt={slider.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                  
                  {slider.badgeText && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-400 text-stone-950 font-bold text-[10px] uppercase">
                      {slider.badgeText}
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                    <button
                      onClick={() => handleToggleActive(slider)}
                      className={`p-1.5 rounded-lg text-xs font-bold backdrop-blur-md transition-all ${
                        slider.isActive ? 'bg-emerald-500/90 text-white' : 'bg-stone-700/80 text-stone-300'
                      }`}
                      title={slider.isActive ? 'সক্রিয় (ক্লিক করে নিষ্ক্রিয় করুন)' : 'নিষ্ক্রিয় (ক্লিক করে সক্রিয় করুন)'}
                    >
                      {slider.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-bold text-base line-clamp-1">{slider.title}</h3>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-3">
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {slider.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 font-medium">
                      বাটন: {slider.buttonText || 'রক্তদান করুন'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 font-mono">
                      টার্গেট: #{slider.buttonLink || 'register'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md font-bold ${slider.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                      {slider.isActive ? 'সক্রিয় প্রদর্শিত' : 'লুকায়িত'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-stone-50/80 border-t border-stone-100 flex items-center justify-end space-x-2">
                <button
                  onClick={() => handleOpenEditModal(slider)}
                  className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-bold transition-all flex items-center space-x-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>এডিট</span>
                </button>
                <button
                  onClick={() => handleDelete(slider.id)}
                  className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-[#B71C1C] rounded-lg text-xs font-bold transition-all flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>মুছে ফেলুন</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="text-lg font-bold text-stone-900">
                {editingSlider ? 'স্লাইড এডিট করুন' : 'নতুন ব্যানার স্লাইড তৈরি করুন'}
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
                  স্লাইডের প্রধান শিরোনাম *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="যেমন: এক ব্যাগ রক্তে একটি নতুন জীবনের আশা"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  উপ-শিরোনাম / বিস্তারিত বার্তা *
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="যেমন: আপনার ২০ মিনিটের রক্তদানে বেঁচে যেতে পারে কোনো এক মুমূর্ষু রোগীর প্রাণ।"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  ছবির লিঙ্ক (Google Drive Link / Direct Image URL) *
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900"
                  required
                />
                {formData.imageUrl && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-stone-200 h-32 w-full bg-stone-900">
                    <img
                      src={formatDriveImageUrl(formData.imageUrl)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <p className="text-[10px] text-stone-500 mt-1">
                  💡 গুগল ড্রাইভ লিঙ্ক দিলে স্বয়ংক্রিয়ভাবে `https://lh3.googleusercontent.com/d/ID` ফরম্যাটে রূপান্তরিত হবে।
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ব্যাজ টেক্সট (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={formData.badgeText}
                    onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                    placeholder="যেমন: লাইভ ক্যাম্পেইন"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    বাটন টেক্সট
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    placeholder="যেমন: রক্তদাতা হোন"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    বাটন অ্যাকশন পেজ
                  </label>
                  <select
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium"
                  >
                    <option value="register">ডোনার রেজিস্ট্রেশন (register)</option>
                    <option value="requests">রক্তের অনুরোধ (requests)</option>
                    <option value="donors">ডোনার ডিরেক্টরি (donors)</option>
                    <option value="emergency">জরুরি রক্ত চাই (emergency)</option>
                    <option value="notice">নোটিস বোর্ড (notice)</option>
                    <option value="blog">ব্লগ ও প্রবন্ধ (blog)</option>
                    <option value="gallery">গ্যালারি (gallery)</option>
                    <option value="apply">আবেদন ফরম (apply)</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="isActiveCheck"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded-sm"
                  />
                  <label htmlFor="isActiveCheck" className="text-xs font-bold text-stone-800 cursor-pointer">
                    স্লাইড সক্রিয় রাখুন
                  </label>
                </div>
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
                  <span>{editingSlider ? 'হালনাগাদ করুন' : 'সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
