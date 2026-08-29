import React, { useState } from 'react';
import { 
  Droplet, 
  Send, 
  Search, 
  Filter, 
  Hospital, 
  MapPin, 
  Phone, 
  PhoneCall, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  User as UserIcon,
  Calendar
} from 'lucide-react';
import { BloodRequest, BloodGroup, UrgencyLevel } from '../../types';
import { BANGLADESH_DISTRICTS } from '../../data/initialData';
import { storageService } from '../../services/storageService';
import confetti from 'canvas-confetti';

interface BloodRequestPageProps {
  requests: BloodRequest[];
  onRefresh: () => void;
}

export const BloodRequestPage: React.FC<BloodRequestPageProps> = ({ requests, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'create'>('browse');

  // Form State
  const [formData, setFormData] = useState({
    requesterName: '',
    contact: '',
    alternateContact: '',
    bloodGroup: 'A+' as BloodGroup,
    hospital: '',
    district: 'নীলফামারী সদর (Nilphamari Sadar)',
    urgency: 'high' as UrgencyLevel,
    unitsNeeded: 1,
    patientProblem: '',
    donationDateNeeded: new Date().toISOString().split('T')[0]
  });

  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaNum1] = useState(4);
  const [captchaNum2] = useState(3);
  const [formSuccess, setFormSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Filter State
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const safeRequests = requests || [];

  const filteredRequests = safeRequests.filter((r) => {
    const matchGroup = selectedGroup === 'all' || r.bloodGroup === selectedGroup;
    const matchDistrict = selectedDistrict === 'all' || r.district === selectedDistrict;
    const matchUrgency = selectedUrgency === 'all' || r.urgency === selectedUrgency;
    const matchSearch = searchTerm === '' ||
      r.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.district.toLowerCase().includes(searchTerm.toLowerCase());
    return matchGroup && matchDistrict && matchUrgency && matchSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.requesterName || !formData.contact || !formData.hospital) {
      setErrorMessage('অনুগ্রহ করে প্রয়োজনীয় তথ্যসমূহ (নাম, মোবাইল ও হাসপাতাল) সঠিকভাবে পূরণ করুন।');
      return;
    }

    if (parseInt(captchaAnswer, 10) !== captchaNum1 + captchaNum2) {
      setErrorMessage(`রোবট প্রতিরোধ: ক্যাপচা উত্তর সঠিক নয় (${captchaNum1} + ${captchaNum2} = ?)`);
      return;
    }

    storageService.createRequest({
      requesterName: formData.requesterName,
      contact: formData.contact,
      alternateContact: formData.alternateContact,
      bloodGroup: formData.bloodGroup,
      hospital: formData.hospital,
      district: formData.district,
      urgency: formData.urgency,
      unitsNeeded: Number(formData.unitsNeeded) || 1,
      patientProblem: formData.patientProblem,
      donationDateNeeded: formData.donationDateNeeded,
      status: 'approved'
    });

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch {}

    setFormSuccess(true);
    onRefresh();
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('browse');
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#B71C1C] via-[#8E0000] to-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="px-3 py-1 bg-amber-400 text-stone-950 font-bold rounded-full text-xs uppercase tracking-wider">
            জরুরি রক্তের সেবা
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            রক্তের আবেদন ও লাইভ রিকোয়েস্ট বোর্ড
          </h1>
          <p className="text-red-100 text-sm sm:text-base leading-relaxed">
            জরুরি রক্তের প্রয়োজনে আবেদন জানাতে পারেন অথবা হাসপাতালে ভর্তি থাকা মুমূর্ষু রোগীদের পাশে দাঁড়াতে রক্তদানে এগিয়ে আসুন।
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'browse'
                ? 'bg-white text-[#B71C1C] shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            চলমান রক্তের রিকোয়েস্টসমূহ ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center space-x-2 ${
              activeTab === 'create'
                ? 'bg-amber-400 text-stone-950 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Droplet className="w-4 h-4 fill-current" />
            <span>নতুন আবেদন ফরম পূরণ করুন</span>
          </button>
        </div>
      </div>

      {activeTab === 'create' ? (
        /* CREATE BLOOD REQUEST FORM */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-md max-w-3xl mx-auto">
          {formSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900">আবেদন সফলভাবে গ্রহণ করা হয়েছে!</h3>
              <p className="text-stone-600 text-sm max-w-md mx-auto">
                আপনার রক্তের আবেদনটি অনুমোদিত হয়েছে এবং লাইভ বোর্ডে প্রকাশিত হয়েছে।
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="text-xl font-bold text-stone-900">
                  রক্তের চাহিদার সম্পূর্ণ বিবরণ প্রদান করুন
                </h3>
                <p className="text-xs text-stone-500">
                  সঠিক তথ্য দিলে রক্তদাতাদের পক্ষে যোগাযোগ করা সহজ হবে।
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    রক্তের গ্রুপ (Blood Group) *
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl font-bold text-stone-900 focus:ring-2 focus:ring-red-600 text-sm"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    কত ব্যাগ রক্ত প্রয়োজন? *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.unitsNeeded}
                    onChange={(e) => setFormData({ ...formData, unitsNeeded: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl font-semibold text-stone-900 focus:ring-2 focus:ring-red-600 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  রোগীর নাম / যোগাযোগের ব্যক্তির নাম *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="যেমন: রোগীর ভাই কামরুল ইসলাম"
                    value={formData.requesterName}
                    onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    মোবাইল নম্বর (প্রধান যোগাযোগ) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      placeholder="+880 17XXXXXXXX"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 text-sm font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    বিকল্প নম্বর (যদি থাকে)
                  </label>
                  <input
                    type="tel"
                    placeholder="+880 18XXXXXXXX"
                    value={formData.alternateContact}
                    onChange={(e) => setFormData({ ...formData, alternateContact: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    হাসপাতাল / ক্লিনিকের নাম ও ওয়ার্ড *
                  </label>
                  <div className="relative">
                    <Hospital className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="যেমন: ২৫০ শয্যা বিশিষ্ট জেনারেল হাসপাতাল, নীলফামারী"
                      value={formData.hospital}
                      onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    উপজেলা / থানা (Upazila) *
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 text-sm"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    জরুরি অবস্থা (Urgency)
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value as UrgencyLevel })}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl font-bold text-stone-900 focus:ring-2 focus:ring-red-600 text-sm"
                  >
                    <option value="high">🚨 অতি জরুরি (Immediate/Within 4 hours)</option>
                    <option value="medium">⚠️ মাঝারি জরুরি (Within 24 hours)</option>
                    <option value="low">📅 সাধারণ (Planned Surgery)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    রক্তদানের তারিখ *
                  </label>
                  <input
                    type="date"
                    value={formData.donationDateNeeded}
                    onChange={(e) => setFormData({ ...formData, donationDateNeeded: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  রোগীর সমস্যা / বিস্তারিত কারণ
                </label>
                <textarea
                  rows={3}
                  placeholder="যেমন: রোগীর সিজারিয়ান অপারেশন, রক্তের হিমোগ্লোবিন কম, জরুরি রক্তের প্রয়োজন..."
                  value={formData.patientProblem}
                  onChange={(e) => setFormData({ ...formData, patientProblem: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 text-sm"
                />
              </div>

              {/* Anti Spam Captcha */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs sm:text-sm font-bold text-stone-800">
                  নিরাপত্তা প্রশ্ন: {captchaNum1} + {captchaNum2} = কত?
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

              <div className="pt-4 flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('browse')}
                  className="px-6 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-medium text-sm transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-[#B71C1C] to-[#D32F2F] hover:from-[#8B0000] hover:to-[#B71C1C] text-white font-bold rounded-xl shadow-md transition-all flex items-center space-x-2 text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>আবেদন জমা দিন (Submit Request)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* BROWSE REQUESTS LIST */
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Group filter */}
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">গ্রুপ ফিল্টার:</label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold"
                >
                  <option value="all">সকল ব্লাড গ্রুপ</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              {/* District filter */}
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">জেলা ফিল্টার:</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold"
                >
                  <option value="all">সকল জেলা</option>
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Urgency filter */}
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">জরুরিতা:</label>
                <select
                  value={selectedUrgency}
                  onChange={(e) => setSelectedUrgency(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold"
                >
                  <option value="all">সকল লেভেল</option>
                  <option value="high">🚨 অতি জরুরি (High)</option>
                  <option value="medium">⚠️ মাঝারি (Medium)</option>
                  <option value="low">📅 সাধারণ (Low)</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">হাসপাতাল / রোগীর নাম:</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="সার্চ করুন..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
              <Droplet className="w-12 h-12 text-stone-300 mx-auto" />
              <h4 className="text-base font-bold text-stone-700">কোনো আবেদন পাওয়া যায়নি</h4>
              <p className="text-xs text-stone-500">অন্য কোনো গ্রুপ বা জেলা দিয়ে ফিল্টার পরিবর্তন করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-red-400 shadow-xs hover:shadow-lg transition-all duration-200 space-y-4 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#B71C1C] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                          {req.bloodGroup}
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 text-sm block">
                            {req.unitsNeeded} ব্যাগ রক্ত প্রয়োজন
                          </span>
                          <span className="text-[11px] text-stone-400 flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-stone-400" />
                            <span>তারিখ: {req.donationDateNeeded || 'আজই'}</span>
                          </span>
                        </div>
                      </div>

                      {req.urgency === 'high' ? (
                        <span className="px-2.5 py-1 bg-red-100 text-red-700 border border-red-200 text-[10px] font-black uppercase rounded-lg">
                          🚨 অতি জরুরি
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold rounded-lg">
                          ⚠️ সাধারণ
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3">
                      <div className="flex items-start space-x-2">
                        <Hospital className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                        <span className="font-semibold text-stone-800">{req.hospital}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                        <span>জেলা: {req.district}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <UserIcon className="w-4 h-4 text-stone-400 shrink-0" />
                        <span>আবেদনকারী: {req.requesterName}</span>
                      </div>

                      {req.patientProblem && (
                        <p className="text-[11px] text-stone-600 bg-stone-50 p-2.5 rounded-xl italic mt-2 border border-stone-100">
                          "{req.patientProblem}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-100">
                    <a
                      href={`tel:${req.contact}`}
                      className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-2xs transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>সরাসরি কল</span>
                    </a>
                    <a
                      href={`https://wa.me/${req.contact.replace(/[^0-9]/g, '')}?text=লাইফসেভার%20ব্লাড%20ব্যাংক%20থেকে%20যোগাযোগ%20করছি`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>হোয়াটসঅ্যাপ</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
