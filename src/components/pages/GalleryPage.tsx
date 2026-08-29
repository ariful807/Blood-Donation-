import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Filter, 
  X, 
  ExternalLink, 
  Sparkles,
  Heart,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { GalleryItem } from '../../types';
import { NILPHAMARI_UPAZILAS } from '../../data/initialData';

interface GalleryPageProps {
  galleryItems: GalleryItem[];
  setCurrentPage: (page: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ galleryItems, setCurrentPage }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('all');
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'সকল কার্যক্রম' },
    { id: 'camp', label: 'রক্তদান ক্যাম্প' },
    { id: 'awareness', label: 'সচেতনতামূলক কর্মসূচি' },
    { id: 'emergency', label: 'জরুরি রক্তের সহায়তা' },
    { id: 'award', label: 'সম্মাননা ও স্বীকৃতি' },
    { id: 'community', label: 'স্বেচ্ছাসেবী সমাবেশ' }
  ];

  const safeItems = galleryItems || [];

  const filteredItems = safeItems.filter((item) => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchUpazila = selectedUpazila === 'all' || item.upazila.toLowerCase().includes(selectedUpazila.toLowerCase()) || selectedUpazila.toLowerCase().includes(item.upazila.toLowerCase());
    return matchCat && matchUpazila;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'camp':
        return { label: 'রক্তদান ক্যাম্প', bg: 'bg-red-50 text-red-700 border-red-200' };
      case 'awareness':
        return { label: 'সচেতনতা', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'emergency':
        return { label: 'জরুরি সেবা', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'award':
        return { label: 'সম্মাননা', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: 'সামাজিক উদ্যোগ', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-[#8E0000] to-[#5F0000] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            <span>স্মৃতি ও কার্যক্রম গ্যালারি</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            নীলফামারী রক্তদান কার্যক্রমের চিত্রশালা
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            নীলফামারী জেলার ৬টি উপজেলায় আয়োজিত রক্তদান ক্যাম্প, সচেতনতামূলক কর্মসূচি ও সেরা রক্তদাতাদের মানবিক স্মৃতিকথা।
          </p>
        </div>
      </div>

      {/* Filter Options */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-[#B71C1C] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Upazila Filter */}
        <div className="flex items-center space-x-2 min-w-[200px]">
          <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
          <select
            value={selectedUpazila}
            onChange={(e) => setSelectedUpazila(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-800"
          >
            <option value="all">সমগ্র নীলফামারী জেলা (সকল উপজেলা)</option>
            {NILPHAMARI_UPAZILAS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3">
          <Camera className="w-12 h-12 text-stone-300 mx-auto" />
          <h4 className="text-base font-bold text-stone-700">কোনো ছবি পাওয়া যায়নি</h4>
          <p className="text-xs text-stone-500">অন্য কোনো ক্যাটাগরি বা উপজেলা সিলেক্ট করে পুনরায় দেখুন।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const badge = getCategoryBadge(item.category);
            return (
              <div
                key={item.id}
                onClick={() => setPreviewItem(item)}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-xl hover:border-red-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-semibold flex items-center space-x-1.5 bg-stone-900/80 px-3 py-1.5 rounded-lg backdrop-blur-xs">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>বড় করে দেখুন</span>
                    </span>
                  </div>
                  <span className={`absolute top-3.5 left-3.5 px-3 py-1 rounded-lg text-[11px] font-bold border backdrop-blur-xs ${badge.bg}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        <span>{item.upazila}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.date}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-stone-900 group-hover:text-[#B71C1C] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#B71C1C]">
                    <span>বিস্তারিত তথ্য</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox / Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95">
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-16/10 bg-stone-950 overflow-hidden">
              <img
                src={previewItem.imageUrl}
                alt={previewItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className={`px-3 py-1 rounded-lg font-bold border ${getCategoryBadge(previewItem.category).bg}`}>
                  {getCategoryBadge(previewItem.category).label}
                </span>
                <span className="px-3 py-1 rounded-lg bg-stone-100 text-stone-700 font-semibold flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>উপজেলা: {previewItem.upazila}</span>
                </span>
                <span className="px-3 py-1 rounded-lg bg-stone-100 text-stone-700 font-semibold flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  <span>তারিখ: {previewItem.date}</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                {previewItem.title}
              </h2>

              <p className="text-sm text-stone-600 leading-relaxed">
                {previewItem.description}
              </p>

              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-stone-500">
                  লাইফসেভার ব্লাড ব্যাংক • নীলফামারী জেলা শাখা
                </span>
                <button
                  onClick={() => {
                    setPreviewItem(null);
                    setCurrentPage('apply');
                  }}
                  className="px-5 py-2.5 bg-[#B71C1C] hover:bg-[#8E0000] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>ক্যাম্প আয়োজন বা সেবায় আবেদন করুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
