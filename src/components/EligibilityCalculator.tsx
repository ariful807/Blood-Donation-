import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Calendar, Sparkles, HeartPulse, Scale, ShieldAlert } from 'lucide-react';
import { isEligibleToDonate } from '../services/storageService';

export const EligibilityCalculator: React.FC = () => {
  const [lastDate, setLastDate] = useState('');
  const [weight, setWeight] = useState(55);
  const [age, setAge] = useState(25);
  const [hasDiseases, setHasDiseases] = useState(false);
  const [checked, setChecked] = useState(false);

  const calculateResult = () => {
    setChecked(true);
  };

  const donationEligibility = isEligibleToDonate(lastDate);
  const isWeightValid = weight >= 48;
  const isAgeValid = age >= 18 && age <= 60;
  const isHealthy = !hasDiseases;
  const isOverallEligible = donationEligibility.eligible && isWeightValid && isAgeValid && isHealthy;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#B71C1C] flex items-center justify-center font-bold">
          <HeartPulse className="w-7 h-7" />
        </div>
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            স্মার্ট হেলথ চেকার
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
            রক্তদান যোগ্যতা ও তারিখ গণক
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Last Donation Date */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-[#B71C1C]" />
            <span>শেষ রক্তদানের তারিখ:</span>
          </label>
          <input
            type="date"
            value={lastDate}
            onChange={(e) => setLastDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 focus:outline-hidden text-sm"
          />
          <p className="text-[11px] text-stone-400 mt-1">কখনো না দিলে খালি রাখুন</p>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center space-x-1">
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            <span>আপনার ওজন (কেজি):</span>
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="40"
              max="120"
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value, 10))}
              className="w-full accent-[#B71C1C]"
            />
            <span className="w-12 font-bold text-stone-800 text-sm bg-stone-100 py-1 px-2 rounded-lg text-center">
              {weight}
            </span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">ন্যূনতম ওজন ৪৮ কেজি আবশ্যক</p>
        </div>

        {/* Age */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center space-x-1">
            <span>বয়স (বছর):</span>
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="15"
              max="70"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value, 10))}
              className="w-full accent-[#B71C1C]"
            />
            <span className="w-12 font-bold text-stone-800 text-sm bg-stone-100 py-1 px-2 rounded-lg text-center">
              {age}
            </span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">১৮ থেকে ৬০ বছর পর্যন্ত বৈধ</p>
        </div>
      </div>

      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-4 mb-6">
        <label className="flex items-center space-x-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hasDiseases}
            onChange={(e) => setHasDiseases(e.target.checked)}
            className="w-4 h-4 text-[#B71C1C] rounded-sm focus:ring-red-500"
          />
          <span className="text-xs sm:text-sm text-stone-700 font-medium">
            গত ৬ মাসে হেপাটাইটিস, ডেঙ্গু, ম্যালেরিয়া বা বড় কোনো সার্জারি হয়নি
          </span>
        </label>
        <button
          onClick={calculateResult}
          className="bg-[#B71C1C] hover:bg-[#8B0000] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors shrink-0 shadow-xs"
        >
          যোগ্যতা পরীক্ষা করুন
        </button>
      </div>

      {checked && (
        <div className={`p-5 rounded-2xl border transition-all duration-300 ${
          isOverallEligible 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
            : 'bg-amber-50 border-amber-200 text-amber-950'
        }`}>
          <div className="flex items-start space-x-3.5">
            {isOverallEligible ? (
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
            )}
            <div className="space-y-1">
              <h4 className="font-bold text-base sm:text-lg">
                {isOverallEligible 
                  ? '🎉 অভিনন্দন! আপনি আজই রক্তদানের জন্য সম্পূর্ণ উপযুক্ত।' 
                  : '⚠️ রক্তদানের জন্য কিছু শর্ত পূরণ প্রয়োজন'}
              </h4>
              <div className="text-xs sm:text-sm space-y-1 opacity-90">
                {!donationEligibility.eligible && (
                  <p>• শেষ রক্তদান থেকে ৯০ দিন পূর্ণ হতে আরও <strong>{donationEligibility.daysRemaining} দিন</strong> বাকি (পরবর্তী যোগ্য তারিখ: {donationEligibility.nextDate})।</p>
                )}
                {!isWeightValid && (
                  <p>• আপনার ওজন ৪৮ কেজির কম ({weight} কেজি)। রক্তদানের জন্য কমপক্ষে ৪৮ কেজি ওজন প্রয়োজন।</p>
                )}
                {!isAgeValid && (
                  <p>• আপনার বয়স রক্তদানের জন্য নির্ধারিত ১৮-৬০ বছরের সীমার মধ্যে নয়।</p>
                )}
                {hasDiseases && (
                  <p>• সাম্প্রতিক অসুস্থতা বা চিকিৎসাজনিত কারণে কিছুদিন বিশ্রাম নেওয়া নিরাপদ।</p>
                )}
                {isOverallEligible && (
                  <p>আপনার রক্ত একজন মুমূর্ষু রোগীর প্রাণ ফিরিয়ে দিতে পারে। আমাদের ডোনার হিসেবে নিবন্ধন করুন অথবা জরুরি রিকোয়েস্টে সাড়া দিন।</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
