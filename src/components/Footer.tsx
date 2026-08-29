import React from 'react';
import { Droplet, Heart, Phone, Mail, MapPin, Database, ShieldCheck, ExternalLink } from 'lucide-react';
import { SiteConfig } from '../types';
import { storageService } from '../services/storageService';
import { formatDriveImageUrl } from '../utils/imageUtils';

interface FooterProps {
  setCurrentPage: (page: string) => void;
  onOpenEmergencyModal: () => void;
  siteConfig?: SiteConfig;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage, onOpenEmergencyModal, siteConfig: propConfig }) => {
  const config = propConfig || storageService.getSiteConfig();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Top emergency action row */}
      <div className="bg-gradient-to-r from-[#B71C1C] via-[#8E0000] to-[#5F0000] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-red-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="bg-amber-400 text-stone-950 text-xs font-black uppercase px-2.5 py-0.5 rounded-full">
                জরুরি রক্ত সেবা
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                আপনার কি জরুরি রক্তের প্রয়োজন?
              </h3>
            </div>
            <p className="text-stone-200 text-sm">
              এক ক্লিকে রক্তের অনুরোধ জানান, আমাদের ভেরিফাইড ডোনার নেটওয়ার্ক দ্রুত সাড়া দেবে।
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenEmergencyModal}
              className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-6 py-3 rounded-xl transition-all shadow-md flex items-center space-x-2 text-sm"
            >
              <Droplet className="w-4 h-4 fill-current text-red-700" />
              <span>জরুরি রক্তের আবেদন করুন</span>
            </button>
            <a
              href={`tel:${config.emergencyPhone}`}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 rounded-xl border border-white/20 transition-colors flex items-center space-x-2 text-sm"
            >
              <Phone className="w-4 h-4 text-amber-300" />
              <span>হটলাইনে কল করুন</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {config.logoUrl ? (
                <img 
                  src={formatDriveImageUrl(config.logoUrl)} 
                  alt={config.siteName} 
                  className="w-10 h-10 rounded-xl object-contain bg-white/10 p-1 border border-amber-400/40"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#B71C1C] flex items-center justify-center text-white shadow-md border border-amber-400/40">
                  <Droplet className="w-6 h-6 fill-white" />
                </div>
              )}
              <span className="text-xl font-bold text-white tracking-tight">
                {config.siteName}
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              {config.footerText || config.siteSlogan}
            </p>
            <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700 flex items-center space-x-3 text-xs text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{config.siteSlogan}</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#B71C1C]"></span>
              <span>প্রয়োজনীয় লিংক</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-amber-400 transition-colors">
                  হোমপেজ
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('requests')} className="hover:text-amber-400 transition-colors">
                  চলমান রক্তের অনুরোধসমূহ
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('donors')} className="hover:text-amber-400 transition-colors">
                  ডোনার তালিকা ও সন্ধান
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('gallery')} className="hover:text-amber-400 transition-colors">
                  কার্যক্রম ও স্মৃতি গ্যালারি
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('apply')} className="hover:text-amber-400 transition-colors text-amber-400 font-medium">
                  স্বেচ্ছাসেবী / ক্যাম্প আবেদন
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('about')} className="hover:text-amber-400 transition-colors">
                  আমাদের সম্পর্কে
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('contact')} className="hover:text-amber-400 transition-colors">
                  যোগাযোগ ও হেল্পডেস্ক
                </button>
              </li>
            </ul>
          </div>

          {/* Blood Groups Direct Search */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>নীলফামারী উপজেলা সমূহ</span>
            </h4>
            <div className="flex flex-col space-y-1.5 text-xs text-stone-300">
              <span className="py-1 px-2.5 bg-stone-800 rounded-lg">📍 নীলফামারী সদর</span>
              <span className="py-1 px-2.5 bg-stone-800 rounded-lg">📍 সৈয়দপুর উপজেলা</span>
              <span className="py-1 px-2.5 bg-stone-800 rounded-lg">📍 ডোমার উপজেলা</span>
              <span className="py-1 px-2.5 bg-stone-800 rounded-lg">📍 ডিমলা উপজেলা</span>
              <span className="py-1 px-2.5 bg-stone-800 rounded-lg">📍 জলঢাকা উপজেলা</span>
              <span className="py-1 px-2.5 bg-stone-800 rounded-lg">📍 কিশোরগঞ্জ উপজেলা</span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base mb-4 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>নীলফামারী কন্ট্রোল রুম</span>
            </h4>
            <div className="flex items-start space-x-3 text-sm text-stone-400">
              <MapPin className="w-4 h-4 text-red-400 mt-1 shrink-0" />
              <span>{config.officeAddress}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-stone-400">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <a href={`tel:${config.emergencyPhone}`} className="hover:text-white transition-colors">
                {config.emergencyPhone}
              </a>
            </div>
            <div className="flex items-center space-x-3 text-sm text-stone-400">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{config.emergencyEmail}</span>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setCurrentPage('admin')}
                className="inline-flex items-center space-x-1.5 text-xs text-stone-400 hover:text-amber-300 underline"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>অ্যাডমিন ম্যানেজমেন্ট পোর্টাল</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-stone-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>{config.copyrightText}</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-stone-400">
              <span>মানবতার সেবায় নিবেদিত</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
