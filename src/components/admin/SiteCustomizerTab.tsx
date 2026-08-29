import React, { useState } from 'react';
import { SiteConfig } from '../../types';
import { storageService } from '../../services/storageService';
import { formatDriveImageUrl } from '../../utils/imageUtils';
import { Save, Sparkles, Image, CheckCircle, RefreshCw, Layers, Phone, Mail, MapPin, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SiteCustomizerTabProps {
  onUpdated: () => void;
}

export const SiteCustomizerTab: React.FC<SiteCustomizerTabProps> = ({ onUpdated }) => {
  const [config, setConfig] = useState<SiteConfig>(() => storageService.getSiteConfig());
  const [savedNotice, setSavedNotice] = useState(false);

  const handleChange = (field: keyof SiteConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.updateSiteConfig(config);
    setSavedNotice(true);
    onUpdated();
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {}
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('আপনি কি ডিফল্ট নাম ও সেকশন শিরোনাম ফিরিয়ে আনতে চান?')) {
      const reset = storageService.resetSiteConfig();
      setConfig(reset);
      onUpdated();
    }
  };

  const formattedLogo = config.logoUrl ? formatDriveImageUrl(config.logoUrl) : '';

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-red-100 text-[#B71C1C] text-xs font-bold uppercase tracking-wider">
              কাস্টমাইজেশন
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
            ওয়েবসাইট ও সেকশন নাম এডিটর
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            ওয়েবসাইটের নাম, স্লোগান, লোগো এবং হোম পেজের সকল সেকশনের শিরোনাম ও বিবরণ স্বাধীনভাবে পরিবর্তন করুন।
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>রিসেট ডিফল্ট</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>সকল তথ্য সফলভাবে সংরক্ষিত ও ওয়েবসাইটে তাৎক্ষণিক হালনাগাদ করা হয়েছে!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Global Identity & Branding */}
        <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
          <h3 className="text-base font-bold text-stone-900 flex items-center space-x-2 border-b border-stone-200/80 pb-2.5">
            <Globe className="w-4 h-4 text-[#B71C1C]" />
            <span>১. ওয়েবসাইটের মূল পরিচিতি ও ব্র্যান্ডিং</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                ওয়েবসাইটের নাম (Site Name) *
              </label>
              <input
                type="text"
                value={config.siteName || ''}
                onChange={(e) => handleChange('siteName', e.target.value)}
                placeholder="যেমন: লাইফসেভার ব্লাড ব্যাংক"
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm font-bold text-stone-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                ওয়েবসাইটের স্লোগান (Slogan)
              </label>
              <input
                type="text"
                value={config.siteSlogan || ''}
                onChange={(e) => handleChange('siteSlogan', e.target.value)}
                placeholder="যেমন: জীবন বাঁচান, রক্ত দিন • নীলফামারী জেলা শাখা"
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              ওয়েবসাইট লোগো URL (Google Drive / Direct Image URL)
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <input
                type="text"
                value={config.logoUrl || ''}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                placeholder="https://drive.google.com/file/d/... অথবা ডিরেক্ট ছবি লিঙ্ক"
                className="w-full sm:flex-1 px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
              {formattedLogo && (
                <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-stone-200">
                  <img
                    src={formattedLogo}
                    alt="Logo Preview"
                    className="w-8 h-8 rounded-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-[10px] text-stone-500 font-medium">প্রিভিউ</span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              💡 গুগল ড্রাইভ লিঙ্ক দিলে সিস্টেম স্বয়ংক্রিয়ভাবে সরাসরি লোডযোগ্য ফরম্যাটে রূপান্তর করবে।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-stone-500" />
                <span>জরুরি হেল্পলাইন নম্বর</span>
              </label>
              <input
                type="text"
                value={config.contactPhone || ''}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                placeholder="+880 1711-000000"
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-stone-500" />
                <span>অফিসিয়াল ইমেইল</span>
              </label>
              <input
                type="email"
                value={config.contactEmail || ''}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                placeholder="contact@nilphamariblood.org"
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                <span>অফিসের ঠিকানা</span>
              </label>
              <input
                type="text"
                value={config.officeAddress || ''}
                onChange={(e) => handleChange('officeAddress', e.target.value)}
                placeholder="নীলফামারী সদর, নীলফামারী"
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900"
              />
            </div>
          </div>
        </div>

        {/* 2. Hero Section Titles */}
        <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
          <h3 className="text-base font-bold text-stone-900 flex items-center space-x-2 border-b border-stone-200/80 pb-2.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>২. হোম পেজ হিরো সেকশন (Hero Section)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                হিরো ব্যাজ টেক্সট
              </label>
              <input
                type="text"
                value={config.heroBadge || ''}
                onChange={(e) => handleChange('heroBadge', e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                হিরো প্রধান শিরোনাম (Hero Title)
              </label>
              <input
                type="text"
                value={config.heroTitle || ''}
                onChange={(e) => handleChange('heroTitle', e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              হিরো উপ-শিরোনাম বা বর্ণনা (Hero Subtitle)
            </label>
            <textarea
              rows={2}
              value={config.heroSubtitle || ''}
              onChange={(e) => handleChange('heroSubtitle', e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900"
            />
          </div>
        </div>

        {/* 3. Section Titles Grid */}
        <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-5">
          <h3 className="text-base font-bold text-stone-900 flex items-center space-x-2 border-b border-stone-200/80 pb-2.5">
            <Layers className="w-4 h-4 text-red-600" />
            <span>৩. অন্যান্য সকল সেকশনের শিরোনাম ও বিবরণ</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Urgent Requests Section */}
            <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
              <h4 className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
                জরুরি রক্তের আবেদন সেকশন
              </h4>
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">শিরোনাম</label>
                <input
                  type="text"
                  value={config.urgentRequestsTitle || ''}
                  onChange={(e) => handleChange('urgentRequestsTitle', e.target.value)}
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">উপ-শিরোনাম</label>
                <input
                  type="text"
                  value={config.urgentRequestsSubtitle || ''}
                  onChange={(e) => handleChange('urgentRequestsSubtitle', e.target.value)}
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Donors Directory Section */}
            <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
              <h4 className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
                ডোনার ডিরেক্টরি সেকশন
              </h4>
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">শিরোনাম</label>
                <input
                  type="text"
                  value={config.donorsSectionTitle || ''}
                  onChange={(e) => handleChange('donorsSectionTitle', e.target.value)}
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">উপ-শিরোনাম</label>
                <input
                  type="text"
                  value={config.donorsSectionSubtitle || ''}
                  onChange={(e) => handleChange('donorsSectionSubtitle', e.target.value)}
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Notice Board Section */}
            <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
              <h4 className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
                নোটিস বোর্ড সেকশন
              </h4>
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">শিরোনাম</label>
                <input
                  type="text"
                  value={config.noticeSectionTitle || ''}
                  onChange={(e) => handleChange('noticeSectionTitle', e.target.value)}
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">উপ-শিরোনাম</label>
                <input
                  type="text"
                  value={config.noticeSectionSubtitle || ''}
                  onChange={(e) => handleChange('noticeSectionSubtitle', e.target.value)}
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Blog & Articles Section */}
            <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
              <h4 className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
                ব্লগ ও স্বাস্থ্য পরামর্শ সেকশন
              </h4>
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">শিরোনাম</label>
                <input
                  type="text"
                  value={config.blogSectionTitle || ''}
                  onChange={(e) => handleChange('blogSectionTitle', e.target.value)}
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">উপ-শিরোনাম</label>
                <input
                  type="text"
                  value={config.blogSectionSubtitle || ''}
                  onChange={(e) => handleChange('blogSectionSubtitle', e.target.value)}
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Gallery Section */}
            <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
              <h4 className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
                গ্যালারি ও স্মৃতিশালা সেকশন
              </h4>
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">শিরোনাম</label>
                <input
                  type="text"
                  value={config.gallerySectionTitle || ''}
                  onChange={(e) => handleChange('gallerySectionTitle', e.target.value)}
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">উপ-শিরোনাম</label>
                <input
                  type="text"
                  value={config.gallerySectionSubtitle || ''}
                  onChange={(e) => handleChange('gallerySectionSubtitle', e.target.value)}
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Apply & Volunteer Section */}
            <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
              <h4 className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
                আবেদন ও ভলান্টিয়ার সেকশন
              </h4>
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">শিরোনাম</label>
                <input
                  type="text"
                  value={config.applySectionTitle || ''}
                  onChange={(e) => handleChange('applySectionTitle', e.target.value)}
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">উপ-শিরোনাম</label>
                <input
                  type="text"
                  value={config.applySectionSubtitle || ''}
                  onChange={(e) => handleChange('applySectionSubtitle', e.target.value)}
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-end space-x-3">
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#B71C1C] hover:bg-[#8E0000] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>সকল পরিবর্তন সংরক্ষণ করুন</span>
          </button>
        </div>
      </form>
    </div>
  );
};
