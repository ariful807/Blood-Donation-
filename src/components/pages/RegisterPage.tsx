import React, { useState } from 'react';
import { 
  Heart, 
  Droplet, 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Upload,
  Camera,
  Image as ImageIcon,
  Sparkles,
  Trash2
} from 'lucide-react';
import { BloodGroup } from '../../types';
import { BANGLADESH_DISTRICTS, PRESET_AVATARS } from '../../data/initialData';
import { storageService } from '../../services/storageService';
import confetti from 'canvas-confetti';

interface RegisterPageProps {
  setCurrentPage: (page: string) => void;
  onLoginSuccess: (user: any) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ setCurrentPage, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodGroup: 'A+' as BloodGroup,
    dob: '1998-01-01',
    address: '',
    district: 'নীলফামারী সদর (Nilphamari Sadar)',
    avatarUrl: PRESET_AVATARS[0],
    lastDonation: '',
    password: '',
    confirmPassword: '',
    isAvailableForDonation: true,
    agreeTerms: true
  });

  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showAvatarPresets, setShowAvatarPresets] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  // File to base64 converter for profile photo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('ছবির সাইজ সর্বোচ্চ ২ মেগাবাইট (2MB) হতে হবে।');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
        setErrorMessage('');
      }
    };
    reader.readAsDataURL(file);
  };

  // Password strength helper
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passScore = getPasswordStrength(formData.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('অনুগ্রহ করে সকল আবশ্যকীয় তথ্য পূরণ করুন।');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড একই হতে হবে।');
      return;
    }

    const res = storageService.registerUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      bloodGroup: formData.bloodGroup,
      dob: formData.dob,
      address: formData.address || 'বাংলাদেশ',
      district: formData.district,
      avatarUrl: formData.avatarUrl,
      lastDonation: formData.lastDonation,
      passwordHash: formData.password,
      isAvailableForDonation: formData.isAvailableForDonation
    });

    if (!res.success) {
      setErrorMessage(res.message);
      return;
    }

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    setSuccess(true);
    setTimeout(() => {
      if (res.user) {
        onLoginSuccess(res.user);
        setCurrentPage('dashboard');
      }
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#B71C1C] via-[#8E0000] to-stone-900 text-white p-8 sm:p-10 relative">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-md">
              <Heart className="w-7 h-7 fill-stone-950" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-300 font-bold">
                রক্তদাতা নিবন্ধন
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold">ডোনার হিসেবে যোগ দিন</h2>
            </div>
          </div>
          <p className="text-red-100 text-xs sm:text-sm">
            আপনার এক ফোঁটা রক্ত বাঁচাতে পারে একটি মুমূর্ষু প্রাণ। আজই আমাদের স্বেচ্ছাসেবী রক্তদাতা পরিবারে নিবন্ধন করুন।
          </p>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-10">
          {success ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900">অভিনন্দন! নিবন্ধন সফল হয়েছে</h3>
              <p className="text-stone-600 text-sm max-w-md mx-auto">
                লাইফসেভার ব্লাড ব্যাংকে স্বেচ্ছায় রক্তদাতা হিসেবে যুক্ত হওয়ায় আপনাকে আন্তরিক ধন্যবাদ। আপনাকে ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Personal Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-stone-800 border-b border-stone-100 pb-2">
                  ১. ব্যক্তিগত তথ্য ও প্রোফাইল ছবি
                </h4>

                {/* Profile Picture Uploader & Selector */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <label className="block text-xs font-bold text-stone-700">
                    প্রোফাইল ছবি (Profile Picture)
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative group shrink-0">
                      <img 
                        src={formData.avatarUrl || PRESET_AVATARS[0]} 
                        alt="Profile Preview" 
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-red-600/30"
                        referrerPolicy="no-referrer"
                      />
                      <label 
                        htmlFor="avatar-file-input" 
                        className="absolute inset-0 bg-stone-900/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
                      >
                        <Camera className="w-5 h-5 mb-0.5" />
                        <span className="text-[10px] font-bold">পরিবর্তন</span>
                      </label>
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <label 
                          htmlFor="avatar-file-input"
                          className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 rounded-xl text-xs font-semibold cursor-pointer flex items-center space-x-1.5 shadow-2xs transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5 text-stone-600" />
                          <span>ডিভাইস থেকে ছবি আপলোড করুন</span>
                        </label>
                        <input 
                          id="avatar-file-input" 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileUpload} 
                          className="hidden" 
                        />
                        <button
                          type="button"
                          onClick={() => setShowAvatarPresets(!showAvatarPresets)}
                          className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-colors"
                        >
                          {showAvatarPresets ? 'ডিফল্ট ছবি লুকান' : 'প্রিসেট অ্যাভাটার নির্বাচন'}
                        </button>
                      </div>

                      {showAvatarPresets && (
                        <div className="pt-2 animate-in fade-in duration-200">
                          <p className="text-[11px] text-stone-500 mb-1.5">নিচের যেকোনো একটি ছবি সিলেক্ট করুন:</p>
                          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                            {PRESET_AVATARS.map((av, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, avatarUrl: av }))}
                                className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                                  formData.avatarUrl === av ? 'border-red-600 scale-105 shadow-sm' : 'border-transparent hover:opacity-80'
                                }`}
                              >
                                <img src={av} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    আপনার পূর্ণ নাম *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="মোঃ আবদুর রহিম"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      ইমেইল ঠিকানা *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      মোবাইল নম্বর *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        placeholder="+880 18XXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      রক্তের গ্রুপ (Blood Group) *
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-bold text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      জন্ম তারিখ *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Donation info */}
              <div className="space-y-4 pt-2">
                <h4 className="text-sm font-bold text-stone-800 border-b border-stone-100 pb-2">
                  ২. অবস্থান ও রক্তদান তথ্য
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      উপজেলা / থানা (Upazila) *
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                    >
                      {BANGLADESH_DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      সর্বশেষ রক্তদানের তারিখ (যদি থাকে)
                    </label>
                    <input
                      type="date"
                      value={formData.lastDonation}
                      onChange={(e) => setFormData({ ...formData, lastDonation: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    পূর্ণ ঠিকানা / এলাকা
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="যেমন: মীরপুর ১০, ব্লক সি, ঢাকা"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Security */}
              <div className="space-y-4 pt-2">
                <h4 className="text-sm font-bold text-stone-800 border-b border-stone-100 pb-2">
                  ৩. পাসওয়ার্ড ও নিরাপত্তা
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      পাসওয়ার্ড নির্ধারণ করুন *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        placeholder="কমপক্ষে ৬ অক্ষর..."
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                        required
                      />
                    </div>
                    {/* Password Strength Meter */}
                    {formData.password && (
                      <div className="mt-2 flex items-center space-x-1.5">
                        <div className="flex-1 h-1.5 rounded-full bg-stone-200 overflow-hidden flex gap-1">
                          <div className={`h-full flex-1 ${passScore >= 1 ? 'bg-red-500' : 'bg-transparent'}`}></div>
                          <div className={`h-full flex-1 ${passScore >= 2 ? 'bg-amber-500' : 'bg-transparent'}`}></div>
                          <div className={`h-full flex-1 ${passScore >= 3 ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                          <div className={`h-full flex-1 ${passScore >= 4 ? 'bg-emerald-500' : 'bg-transparent'}`}></div>
                        </div>
                        <span className="text-[10px] text-stone-500 font-semibold">
                          {passScore <= 1 ? 'দুর্বল' : passScore <= 2 ? 'মাঝারি' : passScore <= 3 ? 'ভালো' : 'শক্তিশালী'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      পাসওয়ার্ড পুনরায় লিখুন *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        placeholder="একই পাসওয়ার্ড লিখুন"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ready to donate toggle */}
              <div className="p-4 bg-red-50/60 rounded-2xl border border-red-200/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                    আমি যেকোনো মুহূর্তে জরুরি রক্তদানের জন্য প্রস্তুত
                  </span>
                  <span className="text-[11px] text-stone-500">
                    জরুরি প্রয়োজনে আপনার নম্বরে রক্তগ্রহীতারা কল করতে পারবেন।
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailableForDonation}
                    onChange={(e) => setFormData({ ...formData, isAvailableForDonation: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B71C1C]"></div>
                </label>
              </div>

              {/* Terms agreement */}
              <label className="flex items-start space-x-2.5 cursor-pointer text-xs text-stone-600">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="w-4 h-4 text-[#B71C1C] rounded-sm focus:ring-red-500 mt-0.5"
                  required
                />
                <span>
                  আমি স্বেচ্ছায় ও স্বজ্ঞানে রক্তদানে সম্মত হচ্ছি এবং আমার দেওয়া সকল তথ্য সঠিক বলে অঙ্গীকার করছি।
                </span>
              </label>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#B71C1C] to-[#D32F2F] hover:from-[#8B0000] hover:to-[#B71C1C] text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>রেজিস্ট্রেশন সম্পন্ন করুন (Sign Up)</span>
                </button>
              </div>

              <div className="text-center pt-2 text-xs text-stone-500">
                <span>ইতোমধ্যে অ্যাকাউন্ট আছে? </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage('login')}
                  className="font-bold text-[#B71C1C] hover:underline"
                >
                  এখানে লগইন করুন
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
