import React, { useState } from 'react';
import { X, Droplet, Send, AlertTriangle, Hospital, MapPin, Phone, User, CheckCircle2 } from 'lucide-react';
import { BloodGroup, UrgencyLevel } from '../types';
import { BANGLADESH_DISTRICTS } from '../data/initialData';
import { storageService } from '../services/storageService';
import confetti from 'canvas-confetti';

interface QuickEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const QuickEmergencyModal: React.FC<QuickEmergencyModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
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

  const [submitted, setSubmitted] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaNum1] = useState(Math.floor(Math.random() * 5) + 3);
  const [captchaNum2] = useState(Math.floor(Math.random() * 4) + 1);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.requesterName.trim() || !formData.contact.trim() || !formData.hospital.trim()) {
      setErrorMessage('অনুগ্রহ করে নাম, মোবাইল নম্বর এবং হাসপাতালের নাম সঠিকভাবে পূরণ করুন।');
      return;
    }

    if (parseInt(captchaAnswer, 10) !== captchaNum1 + captchaNum2) {
      setErrorMessage(`স্প্যাম প্রতিরোধ: ক্যাপচা উত্তর সঠিক নয় (${captchaNum1} + ${captchaNum2} = ?)`);
      return;
    }

    // Save blood request
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

    setSubmitted(true);
    setTimeout(() => {
      onSuccess();
      onClose();
      setSubmitted(false);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#B71C1C] via-[#900] to-[#600] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-md">
              <Droplet className="w-7 h-7 fill-red-700 text-red-700" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-red-950/60 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>জরুরি আবেদন ফর্ম</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">রক্তের জরুরি আবেদন</h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-red-100 mt-2">
            আপনার তথ্য লাইভ রিকোয়েস্ট বোর্ডে যুক্ত হবে এবং নিকটস্থ ডোনারদের দৃষ্টিগোচর হবে।
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-stone-800">অনুরোধ সফলভাবে জমা হয়েছে!</h3>
              <p className="text-stone-600 text-sm max-w-md mx-auto">
                আপনার রক্তের আবেদনটি অনুমোদিত হয়েছে এবং লাইভ বোর্ডে প্রকাশিত হয়েছে। ডোনারগণ অতি দ্রুত আপনার দেওয়া নম্বরে যোগাযোগ করতে পারবেন।
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Blood Group */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    রক্তের গ্রুপ (Blood Group) *
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-red-600 focus:outline-hidden text-sm"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                {/* Units Needed */}
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
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 focus:outline-hidden text-sm font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Requester Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  রোগীর নাম / আবেদনকারীর নাম *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="যেমন: রোগীর ভাই কামরুল"
                    value={formData.requesterName}
                    onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 focus:outline-hidden text-sm"
                    required
                  />
                </div>
              </div>

              {/* Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    মোবাইল নম্বর (যোগাযোগ) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      placeholder="+880 17XXXXXXXX"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 focus:outline-hidden text-sm font-mono"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    বিকল্প মোবাইল (ঐচ্ছিক)
                  </label>
                  <input
                    type="tel"
                    placeholder="+880 18XXXXXXXX"
                    value={formData.alternateContact}
                    onChange={(e) => setFormData({ ...formData, alternateContact: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 focus:outline-hidden text-sm font-mono"
                  />
                </div>
              </div>

              {/* Hospital & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    হাসপাতালের নাম ও স্থান *
                  </label>
                  <div className="relative">
                    <Hospital className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="যেমন: জেনারেল হাসপাতাল, নীলফামারী"
                      value={formData.hospital}
                      onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 focus:outline-hidden text-sm"
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
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 focus:outline-hidden text-sm"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Urgency & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    জরুরি অবস্থা (Urgency)
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value as UrgencyLevel })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-semibold focus:ring-2 focus:ring-red-600 focus:outline-hidden text-sm"
                  >
                    <option value="high">🚨 অতি জরুরি (High Priority - Immediate)</option>
                    <option value="medium">⚠️ মাঝারি জরুরি (Medium - within 24h)</option>
                    <option value="low">📅 সাধারণ (Low - Planned Surgery)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    রক্তদানের কাঙ্ক্ষিত তারিখ *
                  </label>
                  <input
                    type="date"
                    value={formData.donationDateNeeded}
                    onChange={(e) => setFormData({ ...formData, donationDateNeeded: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 focus:outline-hidden text-sm"
                    required
                  />
                </div>
              </div>

              {/* Patient Problem */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  রোগীর সমস্যা / বিস্তারিত কারণ
                </label>
                <textarea
                  rows={2}
                  placeholder="যেমন: রোগীর সিজারিয়ান অপারেশন, হিমোগ্লোবিন ৫.২, জরুরি রক্ত প্রয়োজন..."
                  value={formData.patientProblem}
                  onChange={(e) => setFormData({ ...formData, patientProblem: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 focus:outline-hidden text-sm"
                />
              </div>

              {/* Anti-spam Captcha */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="font-bold text-stone-800">
                  রোবট প্রতিরোধ: {captchaNum1} + {captchaNum2} = কত?
                </span>
                <input
                  type="number"
                  placeholder="উত্তর লিখুন"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  className="w-28 px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-center font-bold text-stone-900 focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-medium text-sm transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#B71C1C] to-[#D32F2F] hover:from-[#8B0000] hover:to-[#B71C1C] text-white font-bold rounded-xl shadow-md transition-all flex items-center space-x-2 text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>আবেদন জমা দিন (Submit)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
