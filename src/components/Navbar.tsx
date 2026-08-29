import React, { useState } from 'react';
import { 
  Heart, 
  Droplet, 
  User as UserIcon, 
  Shield, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  PlusCircle, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { User, SiteConfig } from '../types';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  currentUser: User | null;
  siteConfig?: SiteConfig;
  onLogout: () => void;
  onOpenEmergencyModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  currentUser,
  siteConfig,
  onLogout,
  onOpenEmergencyModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const siteName = siteConfig?.siteName || 'লাইফসেভার ব্লাড ব্যাংক';
  const siteSlogan = siteConfig?.siteSlogan || 'জীবন বাঁচান, রক্ত দিন • নীলফামারী জেলা শাখা';
  const logoUrl = siteConfig?.logoUrl;

  const navItems = [
    { id: 'home', label: 'হোম' },
    { id: 'requests', label: 'রক্তের অনুরোধ' },
    { id: 'donors', label: 'ডোনার তালিকা' },
    { id: 'notice', label: 'নোটিস' },
    { id: 'blog', label: 'ব্লগ ও স্বাস্থ্য' },
    { id: 'gallery', label: 'গ্যালারি' },
    { id: 'apply', label: 'আবেদন করুন' },
    { id: 'about', label: 'আমাদের সম্পর্কে' },
    { id: 'contact', label: 'যোগাযোগ' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Site Name */}
          <div 
            onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={siteName} 
                className="w-12 h-12 rounded-2xl object-cover shadow-md border border-stone-200 group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B71C1C] via-[#8E0000] to-[#5F0000] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300 border border-amber-400/30">
                <Droplet className="w-7 h-7 fill-white drop-shadow-sm text-white" />
              </div>
            )}
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#B71C1C]">
                  {siteName}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-500 font-medium tracking-wide line-clamp-1">
                {siteSlogan}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-red-50 text-[#B71C1C] font-bold border border-red-200/60 shadow-2xs'
                      : 'text-stone-700 hover:text-[#B71C1C] hover:bg-stone-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons & Auth */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Quick Blood Request Button */}
            <button
              onClick={onOpenEmergencyModal}
              className="bg-gradient-to-r from-[#B71C1C] to-[#D32F2F] hover:from-[#9A0007] hover:to-[#B71C1C] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all duration-200 flex items-center space-x-2 border border-red-700/50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>রক্তের আবেদন করুন</span>
            </button>

            {/* User Session Dropdown or Login/Register */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 p-1.5 pr-3.5 rounded-2xl text-sm font-medium border border-stone-200 transition-colors"
                >
                  {currentUser.avatarUrl ? (
                    <img 
                      src={currentUser.avatarUrl} 
                      alt={currentUser.name} 
                      className="w-8 h-8 rounded-xl object-cover border border-white shadow-2xs shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-[#B71C1C] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {currentUser.bloodGroup}
                    </div>
                  )}
                  <div className="text-left">
                    <span className="font-semibold text-xs block leading-tight max-w-[110px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-stone-500 capitalize block leading-tight">
                      {currentUser.role === 'admin' ? '👑 অ্যাডমিন' : `🩸 ডোনার (${currentUser.bloodGroup})`}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-stone-100 flex items-center space-x-3">
                      {currentUser.avatarUrl ? (
                        <img 
                          src={currentUser.avatarUrl} 
                          alt={currentUser.name} 
                          className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-[#B71C1C] text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {currentUser.bloodGroup}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs text-stone-500">লগইন প্রোফাইল</p>
                        <p className="text-sm font-bold text-stone-800 truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-stone-400 truncate">{currentUser.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => { setCurrentPage('dashboard'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-stone-700 hover:bg-red-50 hover:text-[#B71C1C] flex items-center space-x-2.5 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>আমার ড্যাশবোর্ড (Dashboard)</span>
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => { setCurrentPage('admin'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-amber-700 font-semibold hover:bg-amber-50 flex items-center space-x-2.5 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-amber-600" />
                        <span>অ্যাডমিন প্যানেল ও সেটিংস</span>
                      </button>
                    )}

                    <div className="border-t border-stone-100 my-1"></div>

                    <button
                      onClick={() => { onLogout(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>লগআউট (Logout)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage('login')}
                  className="px-3.5 py-2 rounded-xl text-sm font-medium text-stone-700 hover:text-[#B71C1C] hover:bg-stone-50 transition-colors border border-stone-200"
                >
                  লগইন (Login)
                </button>
                <button
                  onClick={() => setCurrentPage('register')}
                  className="bg-amber-400 hover:bg-amber-300 text-stone-900 px-4 py-2 rounded-xl text-sm font-bold shadow-2xs hover:shadow-xs transition-all border border-amber-500/30 flex items-center space-x-1.5"
                >
                  <Heart className="w-4 h-4 fill-stone-900" />
                  <span>ডোনার হোন (Sign Up)</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={onOpenEmergencyModal}
              className="bg-[#B71C1C] text-white p-2 rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1"
            >
              <Droplet className="w-3.5 h-3.5 fill-white" />
              <span>রক্ত চাই</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 border border-stone-200"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                currentPage === item.id
                  ? 'bg-red-50 text-[#B71C1C] font-bold border border-red-200'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              {item.label}
            </button>
          ))}

          {currentUser ? (
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <div className="px-4 py-2.5 bg-stone-50 rounded-xl flex items-center space-x-3">
                {currentUser.avatarUrl ? (
                  <img 
                    src={currentUser.avatarUrl} 
                    alt={currentUser.name} 
                    className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-[#B71C1C] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {currentUser.bloodGroup}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-stone-800 truncate">{currentUser.name}</p>
                  <p className="text-xs text-stone-400 truncate">{currentUser.email}</p>
                </div>
                <span className="px-2.5 py-1 bg-[#B71C1C] text-white rounded-lg font-bold text-xs shrink-0">
                  {currentUser.bloodGroup}
                </span>
              </div>

              <button
                onClick={() => { setCurrentPage('dashboard'); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-stone-800 hover:bg-stone-50 flex items-center space-x-2 font-medium"
              >
                <LayoutDashboard className="w-4 h-4 text-[#B71C1C]" />
                <span>আমার ড্যাশবোর্ড (Dashboard)</span>
              </button>

              {currentUser.role === 'admin' && (
                <button
                  onClick={() => { setCurrentPage('admin'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 rounded-xl bg-amber-50 text-amber-900 flex items-center space-x-2 font-bold border border-amber-200"
                >
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span>অ্যাডমিন প্যানেল ও সেটিংস</span>
                </button>
              )}

              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 flex items-center space-x-2 font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>লগআউট (Logout)</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2">
              <button
                onClick={() => { setCurrentPage('login'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 rounded-xl text-stone-800 border border-stone-300 font-semibold text-center hover:bg-stone-50"
              >
                লগইন (Login)
              </button>
              <button
                onClick={() => { setCurrentPage('register'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 rounded-xl bg-amber-400 text-stone-900 font-bold text-center hover:bg-amber-300 shadow-xs"
              >
                ডোনার হোন
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

