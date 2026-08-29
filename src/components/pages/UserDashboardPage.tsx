import React, { useState } from 'react';
import { 
  User, 
  Donation, 
  BloodRequest, 
  BloodGroup 
} from '../../types';
import { 
  storageService, 
  calculateNextEligibility, 
  isEligibleToDonate 
} from '../../services/storageService';
import { NILPHAMARI_UPAZILAS, PRESET_AVATARS } from '../../data/initialData';
import { 
  Heart, 
  Droplet, 
  User as UserIcon, 
  Calendar, 
  MapPin, 
  Phone, 
  Award, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  Send, 
  Sparkles,
  AlertCircle,
  FileText,
  LogOut,
  Hospital,
  Camera,
  Upload
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UserDashboardPageProps {
  currentUser: User;
  setCurrentPage: (page: string) => void;
  onLogout: () => void;
  onRefresh: () => void;
  onOpenEmergencyModal: () => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  currentUser,
  setCurrentPage,
  onLogout,
  onRefresh,
  onOpenEmergencyModal
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'donations' | 'myrequests' | 'editProfile'>('overview');
  
  // Profile edit state
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address);
  const [district, setDistrict] = useState(currentUser.district);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || PRESET_AVATARS[0]);
  const [lastDonation, setLastDonation] = useState(currentUser.lastDonation || '');
  const [isAvailable, setIsAvailable] = useState(currentUser.isAvailableForDonation);
  const [updateMsg, setUpdateMsg] = useState('');
  const [showAvatarPresets, setShowAvatarPresets] = useState(false);

  // Record Donation modal/state
  const [newDonationHospital, setNewDonationHospital] = useState('');
  const [newDonationDate, setNewDonationDate] = useState(new Date().toISOString().split('T')[0]);
  const [donationSuccess, setDonationSuccess] = useState(false);

  const donations = storageService.getDonations().filter(d => d.userId === currentUser.id);
  const requests = storageService.getRequests().filter(r => r.contact === currentUser.phone || r.requesterName.includes(currentUser.name));

  const eligibility = isEligibleToDonate(currentUser.lastDonation);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setUpdateMsg('ছবির সাইজ সর্বোচ্চ ২ মেগাবাইট (2MB) হতে হবে।');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.updateUser(currentUser.id, {
      name,
      phone,
      address,
      district,
      avatarUrl,
      lastDonation,
      isAvailableForDonation: isAvailable
    });
    setUpdateMsg('প্রোফাইল তথ্য ও ছবি সফলভাবে আপডেট হয়েছে!');
    onRefresh();
    setTimeout(() => setUpdateMsg(''), 3000);
  };

  const handleToggleAvailability = () => {
    const updated = !isAvailable;
    setIsAvailable(updated);
    storageService.updateUser(currentUser.id, { isAvailableForDonation: updated });
    onRefresh();
  };

  const handleRecordNewDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonationHospital.trim()) return;

    storageService.recordDonation({
      userId: currentUser.id,
      userName: currentUser.name,
      bloodGroup: currentUser.bloodGroup,
      donationDate: newDonationDate,
      hospitalName: newDonationHospital,
      units: 1,
      status: 'completed',
      notes: 'ব্যবহারকারী কর্তৃক ড্যাশবোর্ড থেকে যুক্ত করা হয়েছে।'
    });

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {}

    setDonationSuccess(true);
    setNewDonationHospital('');
    onRefresh();
    setTimeout(() => setDonationSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner with Donor Badge */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-[#5F0000] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
          <div className="relative shrink-0">
            {currentUser.avatarUrl ? (
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.name} 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-amber-400/50 shadow-lg"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#B71C1C] to-[#8E0000] text-white flex flex-col items-center justify-center font-bold shadow-lg border-2 border-amber-400/40">
                <span className="text-xl sm:text-2xl">{currentUser.bloodGroup}</span>
                <span className="text-[10px] text-amber-200 uppercase tracking-widest font-mono">রক্ত গ্রুপ</span>
              </div>
            )}
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 bg-[#B71C1C] text-white font-extrabold rounded-xl text-xs border border-white shadow-md">
              {currentUser.bloodGroup}
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold">{currentUser.name}</h1>
              <span className="px-2.5 py-0.5 bg-amber-400 text-stone-950 font-bold rounded-full text-xs">
                স্বেচ্ছাসেবী ডোনার
              </span>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span>{currentUser.email}</span>
              <span>•</span>
              <span>{currentUser.phone}</span>
            </p>
            <p className="text-stone-400 text-xs mt-0.5">
              উপজেলা / থানা: {currentUser.district}
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenEmergencyModal}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2"
          >
            <Droplet className="w-4 h-4 fill-red-700 text-red-700" />
            <span>রক্তের আবেদন করুন</span>
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-[#B71C1C] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          ওভারভিউ ও স্ট্যাটাস
        </button>
        <button
          onClick={() => setActiveTab('donations')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'donations'
              ? 'bg-[#B71C1C] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          রক্তদানের ইতিহাস ({donations.length})
        </button>
        <button
          onClick={() => setActiveTab('myrequests')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'myrequests'
              ? 'bg-[#B71C1C] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          আমার রক্তের আবেদনসমূহ ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('editProfile')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'editProfile'
              ? 'bg-[#B71C1C] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          প্রোফাইল ও ছবি এডিট
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>মোট রক্তদান সম্পন্ন</span>
                <Award className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-stone-900">
                {currentUser.totalDonationsCount || donations.length || 0} বার
              </p>
              <span className="text-[11px] text-emerald-600 font-medium">
                জীবনরক্ষাকারী ডোনার
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>রক্তদানের প্রাপ্যতা</span>
                <Droplet className="w-5 h-5 text-[#B71C1C]" />
              </div>
              <p className="text-xl font-bold text-stone-900">
                {isAvailable ? '✅ প্রস্তুত (Ready)' : '⏸️ সাময়িক বিরতি'}
              </p>
              <button
                onClick={handleToggleAvailability}
                className="text-xs text-[#B71C1C] font-semibold hover:underline"
              >
                স্ট্যাটাস পরিবর্তন করুন
              </button>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>পরবর্তী রক্তদান যোগ্যতা</span>
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-base font-bold text-stone-900">
                {eligibility.eligible ? '🎉 আজই প্রস্তুত' : `${eligibility.daysRemaining} দিন বাকি`}
              </p>
              <span className="text-[11px] text-stone-400">
                তারিখ: {eligibility.nextDate}
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>সার্টিফিকেট স্ট্যাটাস</span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-lg font-bold text-stone-900">
                🏆 গোল্ডেন ব্যাজ
              </p>
              <span className="text-[11px] text-stone-500">ভেরিফাইড রক্তদাতা</span>
            </div>
          </div>

          {/* Quick Record Donation Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-[#B71C1C]" />
                <h3 className="text-lg font-bold text-stone-900">
                  নতুন রক্তদান রেকর্ড যুক্ত করুন
                </h3>
              </div>
              <span className="text-xs text-stone-500">
                সম্প্রতি রক্ত দিয়ে থাকলে ডাটাবেজে সংরক্ষণ করুন
              </span>
            </div>

            {donationSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>আপনার রক্তদান সফলভাবে ডাটাবেজে যুক্ত হয়েছে! ধন্যবাদ।</span>
              </div>
            )}

            <form onSubmit={handleRecordNewDonation} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  হাসপাতাল / ব্লাড সেন্টারের নাম *
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ঢাকা মেডিকেল কলেজ"
                  value={newDonationHospital}
                  onChange={(e) => setNewDonationHospital(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  রক্তদানের তারিখ *
                </label>
                <input
                  type="date"
                  value={newDonationDate}
                  onChange={(e) => setNewDonationDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#B71C1C] hover:bg-[#8B0000] text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
                >
                  রেকর্ড সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: DONATIONS HISTORY */}
      {activeTab === 'donations' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-lg font-bold text-stone-900">
              আপনার সম্পন্নকৃত রক্তদানসমূহ
            </h3>
            <span className="text-xs text-stone-500">
              মোট: {donations.length} টি রেকর্ড
            </span>
          </div>

          {donations.length === 0 ? (
            <div className="py-12 text-center text-stone-400 space-y-2">
              <Droplet className="w-12 h-12 mx-auto text-stone-300" />
              <p className="text-sm font-bold text-stone-700">এখনো কোনো রক্তদানের রেকর্ড নেই</p>
              <p className="text-xs">উপরে 'ওভারভিউ' ট্যাব থেকে নতুন রক্তদান যোগ করতে পারেন।</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {donations.map((don) => (
                <div key={don.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-[#B71C1C] flex items-center justify-center font-bold text-sm">
                      {don.bloodGroup}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{don.hospitalName}</h4>
                      <p className="text-xs text-stone-500">
                        তারিখ: {don.donationDate} • {don.units} ব্যাগ
                      </p>
                      <p className="text-[11px] text-stone-400">
                        পরবর্তী রক্তদানের সম্ভাব্য তারিখ: {don.nextEligibleDate}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-xs self-start sm:self-auto border border-emerald-200">
                    সম্পন্ন (Completed)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MY REQUESTS */}
      {activeTab === 'myrequests' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-lg font-bold text-stone-900">
              আপনার রক্তের আবেদনসমূহ
            </h3>
            <button
              onClick={onOpenEmergencyModal}
              className="px-3 py-1.5 bg-[#B71C1C] text-white rounded-xl font-bold text-xs"
            >
              + নতুন আবেদন
            </button>
          </div>

          {requests.length === 0 ? (
            <div className="py-12 text-center text-stone-400 space-y-2">
              <FileText className="w-12 h-12 mx-auto text-stone-300" />
              <p className="text-sm font-bold text-stone-700">আপনি কোনো আবেদন করেননি</p>
              <p className="text-xs">জরুরি প্রয়োজনে যে কোনো সময় রক্তের রিকোয়েস্ট তৈরি করতে পারেন।</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {requests.map((req) => (
                <div key={req.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-red-100 text-[#B71C1C] rounded-md font-bold text-xs">
                        {req.bloodGroup}
                      </span>
                      <h4 className="font-bold text-stone-900 text-sm">{req.hospital}</h4>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      রোগী/আবেদনকারী: {req.requesterName} • {req.unitsNeeded} ব্যাগ • তারিখ: {req.donationDateNeeded}
                    </p>
                    {req.adminNote && (
                      <p className="text-[11px] text-amber-700 mt-1 bg-amber-50 p-1.5 rounded-md">
                        অ্যাডমিন নোট: {req.adminNote}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold self-start sm:self-auto ${
                    req.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {req.status === 'completed' ? 'সম্পন্ন' : 'সক্রিয় (Active)'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: EDIT PROFILE */}
      {activeTab === 'editProfile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs max-w-2xl space-y-6">
          <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
            ব্যক্তিগত তথ্য ও প্রোফাইল ছবি সম্পাদনা
          </h3>

          {updateMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{updateMsg}</span>
            </div>
          )}

          {/* Avatar Photo Section */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <label className="block text-xs font-bold text-stone-700">
              প্রোফাইল ছবি (Profile Photo)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative group shrink-0">
                <img 
                  src={avatarUrl || PRESET_AVATARS[0]} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-red-600/30"
                  referrerPolicy="no-referrer"
                />
                <label 
                  htmlFor="dash-avatar-input" 
                  className="absolute inset-0 bg-stone-900/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
                >
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px] font-bold">পরিবর্তন</span>
                </label>
              </div>

              <div className="flex-1 w-full space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <label 
                    htmlFor="dash-avatar-input"
                    className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 rounded-xl text-xs font-semibold cursor-pointer flex items-center space-x-1.5 shadow-2xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-stone-600" />
                    <span>নতুন ছবি আপলোড</span>
                  </label>
                  <input 
                    id="dash-avatar-input" 
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
                    {showAvatarPresets ? 'ছবি বন্ধ করুন' : 'প্রিসেট ছবি বেছে নিন'}
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
                          onClick={() => setAvatarUrl(av)}
                          className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                            avatarUrl === av ? 'border-red-600 scale-105 shadow-sm' : 'border-transparent hover:opacity-80'
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

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">পূর্ণ নাম</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">মোবাইল নম্বর</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">সর্বশেষ রক্তদানের তারিখ</label>
                <input
                  type="date"
                  value={lastDonation}
                  onChange={(e) => setLastDonation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">উপজেলা / থানা</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                >
                  {NILPHAMARI_UPAZILAS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">গ্রাম / মহল্লা / বিস্তারিত ঠিকানা</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800">
                জরুরি রক্তদানের জন্য প্রস্তুত আছেন?
              </span>
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 text-[#B71C1C] rounded-sm"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#B71C1C] hover:bg-[#8B0000] text-white rounded-xl font-bold text-xs transition-colors shadow-xs"
            >
              পরিবর্তনগুলো সংরক্ষণ করুন
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
