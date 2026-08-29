import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MapPin, 
  PhoneCall, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Heart,
  Droplet,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { User, BloodGroup } from '../../types';
import { BANGLADESH_DISTRICTS } from '../../data/initialData';
import { isEligibleToDonate } from '../../services/storageService';

interface DonorsDirectoryPageProps {
  users: User[];
  setCurrentPage: (page: string) => void;
}

export const DonorsDirectoryPage: React.FC<DonorsDirectoryPageProps> = ({ users, setCurrentPage }) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [availabilityOnly, setAvailabilityOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const safeUsers = users || [];
  const donorsList = safeUsers.filter((u) => u.role === 'user' && u.status === 'active');

  const filteredDonors = donorsList.filter((donor) => {
    const matchGroup = selectedGroup === 'all' || donor.bloodGroup === selectedGroup;
    const matchDistrict = selectedDistrict === 'all' || donor.district === selectedDistrict;
    const matchAvailability = !availabilityOnly || donor.isAvailableForDonation;
    const matchSearch = searchQuery === '' ||
      donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGroup && matchDistrict && matchAvailability && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-[#5F0000] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ভেরিফাইড রক্তদাতা ডিরেক্টরি</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            স্বেচ্ছাসেবী রক্তদাতা খুঁজুন (Find Donors)
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            জরুরি রক্তের প্রয়োজনে সরাসরি আপনার নিকটবর্তী এলাকার নিবন্ধিত রক্তদাতাদের সাথে ফোনে বা হোয়াটসঅ্যাপে যোগাযোগ করুন।
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Blood Group */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">ব্লাড গ্রুপ:</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-800"
            >
              <option value="all">সকল ব্লাড গ্রুপ ({donorsList.length})</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          {/* Upazila */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">উপজেলা / থানা (Upazila):</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-800"
            >
              <option value="all">সমগ্র নীলফামারী জেলা (সকল উপজেলা)</option>
              {BANGLADESH_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">নাম বা ঠিকানা:</label>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="ডোনারের নাম বা এলাকা..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex flex-col justify-end">
            <label className="flex items-center space-x-2.5 p-2 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={availabilityOnly}
                onChange={(e) => setAvailabilityOnly(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded-sm focus:ring-red-500"
              />
              <span className="text-xs font-bold text-stone-800">
                শুধু প্রস্তুত ডোনার (Available Now)
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Donors Cards Grid */}
      {filteredDonors.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4">
          <Users className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-lg font-bold text-stone-800">কোনো ডোনার পাওয়া যায়নি</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            অন্যান্য জেলা বা রক্ত গ্রুপ দিয়ে ফিল্টার পরিবর্তন করুন অথবা নিজেই রক্তদাতা হিসেবে যুক্ত হোন।
          </p>
          <button
            onClick={() => setCurrentPage('register')}
            className="bg-[#B71C1C] hover:bg-[#8B0000] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
          >
            ডোনার হিসেবে নিবন্ধন করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredDonors.map((donor) => {
            const eligibility = isEligibleToDonate(donor.lastDonation);
            return (
              <div
                key={donor.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 hover:border-red-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Avatar & Badge */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="relative shrink-0">
                        {donor.avatarUrl ? (
                          <img 
                            src={donor.avatarUrl} 
                            alt={donor.name} 
                            className="w-13 h-13 rounded-2xl object-cover border-2 border-stone-100 shadow-sm"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#B71C1C] to-[#8E0000] text-white flex items-center justify-center font-bold text-base shadow-xs">
                            {donor.bloodGroup}
                          </div>
                        )}
                        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-[#B71C1C] text-white font-extrabold text-[10px] rounded-lg border border-white shadow-2xs">
                          {donor.bloodGroup}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-stone-900 text-sm leading-snug truncate">
                          {donor.name}
                        </h4>
                        <span className="text-[11px] text-stone-500 block">
                          রক্তদান করেছেন: <strong className="text-stone-800">{donor.totalDonationsCount || 0} বার</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-3">
                    {donor.isAvailableForDonation && eligibility.eligible ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>রক্তদানে প্রস্তুত (Ready)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-medium border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>বিরতিতে আছেন ({eligibility.daysRemaining} দিন বাকি)</span>
                      </span>
                    )}
                  </div>

                  {/* Location Info */}
                  <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span>{donor.address}, {donor.district}</span>
                    </div>
                    {donor.lastDonation && (
                      <div className="flex items-center space-x-2 text-[11px] text-stone-400">
                        <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>সর্বশেষ দান: {donor.lastDonation}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-100">
                  <a
                    href={`tel:${donor.phone}`}
                    className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-2xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>কল দিন</span>
                  </a>
                  <a
                    href={`https://wa.me/${donor.phone.replace(/[^0-9]/g, '')}?text=লাইফসেভার%20ব্লাড%20ব্যাংক%20থেকে%20জরুরি%20রক্তের%20প্রয়োজনে%20যোগাযোগ%20করছি`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>হোয়াটসঅ্যাপ</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
