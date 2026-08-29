import React, { useState } from 'react';
import { 
  Send, 
  Heart, 
  Users, 
  Calendar, 
  Hospital, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ShieldCheck,
  Building,
  Sparkles,
  Info
} from 'lucide-react';
import { ApplicationType, BloodGroup, ApplicationSectionConfig } from '../../types';
import { NILPHAMARI_UPAZILAS } from '../../data/initialData';
import { storageService } from '../../services/storageService';
import confetti from 'canvas-confetti';

interface ApplyPageProps {
  setCurrentPage: (page: string) => void;
  config: ApplicationSectionConfig;
  onRefresh: () => void;
}

export const ApplyPage: React.FC<ApplyPageProps> = ({ setCurrentPage, config, onRefresh }) => {
  const [activeType, setActiveType] = useState<ApplicationType>('volunteer');

  const [formData, setFormData] = useState({
    applicantName: '',
    phone: '',
    email: '',
    upazila: NILPHAMARI_UPAZILAS[0],
    villageOrArea: '',
    bloodGroup: 'A+' as BloodGroup,
    organizationName: '',
    proposedDate: '',
    details: ''
  });

  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaNum1] = useState(5);
  const [captchaNum2] = useState(3);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const typesList = [
    {
      type: 'volunteer' as ApplicationType,
      title: 'স্বেচ্ছাসেবী হিসেবে যোগ দিন',
      subtitle: 'নীলফামারী জেলায় রক্তদান সমন্বয়কারী হিসেবে কাজ করতে',
      icon: Users,
      badge: 'ভলান্টিয়ার'
    },
    {
      type: 'blood_camp' as ApplicationType,
      title: 'রক্তদান ক্যাম্পেইন আয়োজন',
      subtitle: 'আপনার প্রতিষ্ঠানে বা এলাকায় ক্যাম্প আয়োজনের জন্য',
      icon: Calendar,
      badge: 'ক্যাম্পেইন'
    },
    {
      type: 'medical_aid' as ApplicationType,
      title: 'অসহায় রোগীর জরুরি সহায়তা',
      subtitle: 'থ্যালাসেমিয়া বা নিয়মিত রোগীর রক্ত সহায়তার আবেদন',
      icon: Hospital,
      badge: 'পেশেন্ট সাপোর্ট'
    },
    {
      type: 'collaboration' as ApplicationType,
      title: 'সাংগঠনিক পার্টনারশিপ',
      subtitle: 'ক্লাব, এনজিও বা হাসপাতালের সাথে যৌথ সমঝোতা',
      icon: Building,
      badge: 'কোলাবোরেশন'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.applicantName.trim() || !formData.phone.trim() || !formData.details.trim()) {
      setErrorMessage('অনুগ্রহ করে নাম, মোবাইল নম্বর এবং আবেদনের বিস্তারিত তথ্য পূরণ করুন।');
      return;
    }

    if (parseInt(captchaAnswer, 10) !== captchaNum1 + captchaNum2) {
      setErrorMessage(`রোবট প্রতিরোধ: ক্যাপচা উত্তর সঠিক নয় (${captchaNum1} + ${captchaNum2} = ?)`);
      return;
    }

    storageService.submitApplication({
      type: activeType,
      applicantName: formData.applicantName,
      phone: formData.phone,
      email: formData.email || 'applicant@nilphamari.org',
      upazila: formData.upazila,
      villageOrArea: formData.villageOrArea || formData.upazila,
      bloodGroup: formData.bloodGroup,
      organizationName: formData.organizationName,
      proposedDate: formData.proposedDate,
      details: formData.details
    });

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {}

    setSubmitted(true);
    onRefresh();

    // Reset fields
    setFormData({
      applicantName: '',
      phone: '',
      email: '',
      upazila: NILPHAMARI_UPAZILAS[0],
      villageOrArea: '',
      bloodGroup: 'A+',
      organizationName: '',
      proposedDate: '',
      details: ''
    });
    setCaptchaAnswer('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#B71C1C] via-[#8E0000] to-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>মানবতার সেবায় আবেদন ফরম</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            স্বেচ্ছাসেবী ও সামাজিক রক্তদান কার্যক্রমে আবেদন
          </h1>
          <p className="text-red-100 text-sm sm:text-base leading-relaxed">
            নীলফামারী জেলার প্রতিটি উপজেলার মানুষের জন্য রক্তসেবা পৌঁছে দিতে আমাদের সাথে যুক্ত হোন অথবা আপনার এলাকায় ক্যাম্পেইন আয়োজনে আবেদন জানান।
          </p>
        </div>
      </div>

      {/* Dynamic Announcement Banner (Configurable from Admin) */}
      {config.announcementBannerText && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center space-x-3 text-xs sm:text-sm font-semibold text-stone-900">
          <Info className="w-5 h-5 text-amber-700 shrink-0" />
          <span>{config.announcementBannerText}</span>
        </div>
      )}

      {/* Main Grid: Application Types Selector + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Types & Guideline Box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-2.5">
            <h3 className="text-sm font-bold text-stone-900 px-2 mb-2">
              আবেদনের ধরন নির্বাচন করুন:
            </h3>
            {typesList.map((item) => {
              const Icon = item.icon;
              const isSelected = activeType === item.type;
              return (
                <button
                  key={item.type}
                  onClick={() => {
                    setActiveType(item.type);
                    setSubmitted(false);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start space-x-3.5 ${
                    isSelected
                      ? 'bg-red-50/80 border-[#B71C1C] shadow-xs ring-1 ring-[#B71C1C]'
                      : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-[#B71C1C] text-white' : 'bg-stone-100 text-stone-700'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#B71C1C]' : 'text-stone-900'}`}>
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 leading-snug">
                      {item.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dynamic Admin-Configured Guidelines Card */}
          <div className="bg-stone-900 text-white rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>জরুরি দিকনির্দেশনা (Guidelines)</span>
            </div>
            
            <div className="text-xs text-stone-300 space-y-2.5 leading-relaxed">
              {activeType === 'volunteer' && (
                <p>{config.volunteerNotice}</p>
              )}
              {activeType === 'blood_camp' && (
                <p>{config.campGuidelines}</p>
              )}
              {activeType === 'medical_aid' && (
                <p>{config.aidInstructions}</p>
              )}
              {activeType === 'collaboration' && (
                <p>নীলফামারীর যেকোনো রেজিস্টার্ড সংগঠন, ক্লাব বা হাসপাতালের সাথে সমঝোতা স্মারক (MoU) এর মাধ্যমে রক্তসেবা নিশ্চিত করা হয়।</p>
              )}
            </div>

            <div className="pt-3 border-t border-stone-800 text-[11px] text-amber-300 flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5" />
              <span>সহায়তা হটলাইন: {config.emergencyContactNilphamari}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Application Form */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-md">
          {submitted ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900">
                আপনার আবেদন সফলভাবে জমা হয়েছে!
              </h3>
              <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
                লাইফসেভার ব্লাড ব্যাংক নীলফামারী টিম খুব শীঘ্রই আপনার দেওয়া নম্বরে যোগাযোগ করে প্রয়োজনীয় পদক্ষেপ গ্রহণ করবে।
              </p>
              <div className="pt-4 flex justify-center space-x-3">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs transition-colors"
                >
                  আরেকটি আবেদন করুন
                </button>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="px-6 py-2.5 bg-[#B71C1C] hover:bg-[#8B0000] text-white font-bold rounded-xl text-xs transition-colors"
                >
                  হোমপেজে ফিরে যান
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <span className="px-3 py-1 bg-red-100 text-[#B71C1C] text-xs font-bold rounded-lg uppercase">
                  {typesList.find(t => t.type === activeType)?.badge} আবেদন ফরম
                </span>
                <h2 className="text-2xl font-bold text-stone-900 mt-2">
                  {typesList.find(t => t.type === activeType)?.title}
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  সঠিক তথ্য দিয়ে নিচের ফরমটি পূরণ করুন।
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Applicant Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    আবেদনকারীর নাম / দায়িত্বপ্রাপ্ত প্রতিনিধি *
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: মোঃ কামরুজ্জামান"
                    value={formData.applicantName}
                    onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    মোবাইল নম্বর (যোগাযোগ) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      placeholder="+880 17XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Upazila & Village/Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    উপজেলা (Nilphamari Upazila) *
                  </label>
                  <select
                    value={formData.upazila}
                    onChange={(e) => setFormData({ ...formData, upazila: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-semibold focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                  >
                    {NILPHAMARI_UPAZILAS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    গ্রাম / মহল্লা / নির্দিষ্ট স্থান *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="যেমন: কুখাপাড়া, কলেজ মোড়"
                      value={formData.villageOrArea}
                      onChange={(e) => setFormData({ ...formData, villageOrArea: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Conditional Fields depending on Type */}
              {activeType === 'volunteer' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      আপনার রক্তের গ্রুপ (Blood Group)
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-bold text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      ইমেইল ঠিকানা (ঐচ্ছিক)
                    </label>
                    <input
                      type="email"
                      placeholder="yourname@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {(activeType === 'blood_camp' || activeType === 'collaboration') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      সংগঠন / প্রতিষ্ঠান / ক্লাবের নাম
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: সৈয়দপুর যুব সমাজ কল্যাণ সমিতি"
                      value={formData.organizationName}
                      onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      প্রস্তাবিত ক্যাম্পেইন তারিখ
                    </label>
                    <input
                      type="date"
                      value={formData.proposedDate}
                      onChange={(e) => setFormData({ ...formData, proposedDate: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* Details / Reason */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  আবেদনের বিস্তারিত উদ্দেশ্য / প্রয়োজনীয় বিবরণ *
                </label>
                <textarea
                  rows={4}
                  placeholder="আপনার আবেদন সম্পর্কে বিস্তারিত বর্ণনা লিখুন..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                  required
                />
              </div>

              {/* Anti-spam Captcha */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs sm:text-sm font-bold text-stone-800">
                  রোবট প্রতিরোধ: {captchaNum1} + {captchaNum2} = কত?
                </span>
                <input
                  type="number"
                  placeholder="উত্তর লিখুন"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  className="w-32 px-4 py-2 bg-white border border-amber-300 rounded-xl text-center font-bold text-stone-900 focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#B71C1C] to-[#D32F2F] hover:from-[#8B0000] hover:to-[#B71C1C] text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>আবেদন জমা দিন (Submit Application)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
