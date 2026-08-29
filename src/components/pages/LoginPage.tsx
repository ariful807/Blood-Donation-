import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Droplet, 
  KeyRound, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Heart
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { User, SiteConfig } from '../../types';

interface LoginPageProps {
  setCurrentPage: (page: string) => void;
  onLoginSuccess: (user: User) => void;
  siteConfig?: SiteConfig;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setCurrentPage, onLoginSuccess, siteConfig }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotModal, setForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const siteName = siteConfig?.siteName || 'লাইফসেভার ব্লাড ব্যাংক';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার ইমেইল এবং পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    const res = storageService.login(email.trim(), password.trim());
    if (!res.success) {
      setErrorMessage(res.message);
      return;
    }

    if (res.user) {
      onLoginSuccess(res.user);
      if (res.user.role === 'admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('dashboard');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#B71C1C] via-[#8E0000] to-stone-900 text-white p-8 text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-md mx-auto mb-3">
            <Droplet className="w-8 h-8 fill-red-700 text-red-700" />
          </div>
          <h2 className="text-2xl font-bold">অ্যাকাউন্টে লগইন করুন</h2>
          <p className="text-xs text-red-100 mt-1">
            {siteName} • সুরক্ষিত প্রবেশদ্বার
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                ইমেইল ঠিকানা (Email) *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="আপনার ইমেইল ঠিকানা লিখুন"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  পাসওয়ার্ড (Password) *
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModal(true)}
                  className="text-xs text-[#B71C1C] hover:underline font-medium"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="পাসওয়ার্ড লিখুন"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer text-xs text-stone-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#B71C1C] rounded-sm focus:ring-red-500"
                />
                <span>আমাকে মনে রাখুন (Remember Me)</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#B71C1C] to-[#D32F2F] hover:from-[#8B0000] hover:to-[#B71C1C] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm"
            >
              <KeyRound className="w-4 h-4" />
              <span>লগইন করুন (Sign In)</span>
            </button>
          </form>

          <div className="pt-4 border-t border-stone-100 text-center space-y-2">
            <p className="text-xs text-stone-600">এখনো কোনো অ্যাকাউন্ট নেই?</p>
            <button
              type="button"
              onClick={() => setCurrentPage('register')}
              className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-stone-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Heart className="w-4 h-4 text-red-600 fill-red-600" />
              <span>নতুন ডোনার হিসেবে বিনামূল্যে রেজিস্টার করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-lg font-bold text-stone-900">পাসওয়ার্ড রিসেট</h3>
            <p className="text-xs text-stone-500">
              আপনার নিবন্ধিত ইমেইল ঠিকানা দিলে পাসওয়ার্ড রিসেট নির্দেশিকা পাঠানো হবে।
            </p>
            {resetSent ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>রিসেট লিংক আপনার ইমেইলে প্রেরণ করা হয়েছে!</span>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="আপনার ইমেইল লিখুন"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setForgotModal(false)}
                    className="px-4 py-2 border rounded-xl text-xs text-stone-700"
                  >
                    বন্ধ করুন
                  </button>
                  <button
                    onClick={() => {
                      if (resetEmail) {
                        setResetSent(true);
                        setTimeout(() => {
                          setForgotModal(false);
                          setResetSent(false);
                        }, 2500);
                      }
                    }}
                    className="px-4 py-2 bg-[#B71C1C] text-white rounded-xl text-xs font-bold"
                  >
                    রিসেট লিংক পাঠান
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
