import React from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Users, 
  Award, 
  CheckCircle2, 
  Clock, 
  Droplet, 
  HelpCircle,
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface AboutPageProps {
  setCurrentPage: (page: string) => void;
  onOpenEmergencyModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setCurrentPage, onOpenEmergencyModal }) => {
  const faqs = [
    {
      q: 'কত দিন পর পর রক্তদান করা যায়?',
      a: 'একজন সুস্থ পুরুষ প্রতি ৩ মাস (৯০ দিন) পর পর এবং সুস্থ নারী প্রতি ৪ মাস (১২০ দিন) পর পর নিরাপদে রক্তদান করতে পারেন।'
    },
    {
      q: 'রক্তদানের ন্যূনতম শারীরিক যোগ্যতা কী?',
      a: 'বয়স ১৮ থেকে ৬০ বছর, ওজন পুরুষদের ক্ষেত্রে কমপক্ষে ৫০ কেজি ও নারীদের ক্ষেত্রে কমপক্ষে ৪৫ কেজি হতে হবে। হিমোগ্লোবিনের মাত্রা স্বাভাবিক থাকা আবশ্যক।'
    },
    {
      q: 'রক্তদানের পর কি কোনো শারীরিক দুর্বলতা তৈরি হয়?',
      a: 'না, একজন সুস্থ মানুষের শরীর থেকে গৃহীত ১ ব্যাগ রক্তে কোনো ক্ষতি হয় না। শরীর ২৪ থেকে ৪৮ ঘণ্টার মধ্যে রক্তের তরল অংশ (প্লাজমা) পূরণ করে ফেলে।'
    },
    {
      q: 'নীলফামারী জেলায় সেবা গ্রহণের নিয়ম কী?',
      a: 'নীলফামারী সদর, সৈয়দপুর, ডোমার, ডিমলা, জলঢাকা এবং কিশোরগঞ্জ উপজেলার যেকোনো নাগরিক বিনামূল্যে রক্তদানের আবেদন করতে বা সরাসরি ডোনারদের সাথে যোগাযোগ করতে পারেন।'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-stone-900 via-[#8E0000] to-[#B71C1C] text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden text-center sm:text-left">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>আমাদের লক্ষ্য ও দৃষ্টিভঙ্গি</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            একটি ফোঁটা রক্ত, বাঁচায় হাজারো হাসিমুখ
          </h1>
          <p className="text-red-100 text-sm sm:text-base leading-relaxed">
            "লাইফসেভার ব্লাড ব্যাংক" নীলফামারী জেলার প্রতিটি উপজেলায় মুমূর্ষু রোগীদের কাছে সঠিক সময়ে নিরাপদ রক্ত পৌঁছে দেওয়ার এক সুসংগঠিত স্বেচ্ছাসেবী অঙ্গীকার।
          </p>
        </div>
      </div>

      {/* Core Values Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#B71C1C] flex items-center justify-center font-bold">
            <Heart className="w-6 h-6 fill-[#B71C1C]" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">মানবিক রক্তদান</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            সম্পূর্ণ বিনামূল্যে ও নিঃস্বার্থভাবে জরুরি রক্তের চাহিদা মেটাতে আমরা স্বেচ্ছাসেবী নেটওয়ার্ক পরিচালনা করি।
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">নিরাপদ ও নির্ভরযোগ্য</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            প্রতিটি রক্তদাতার তথ্য ও রক্তদানের সঠিক সময়সূচি ডিজিটাল যাচাইয়ের মাধ্যমে নিশ্চিত করা হয়।
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">২৪/৭ জরুরি রেসপন্স</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            লাইভ রিকোয়েস্ট বোর্ড এবং সরাসরি ডোনার সার্চিংয়ের মাধ্যমে মাত্র কয়েক মিনিটেই রক্তদাতা খুঁজে পাওয়ার সুবিধা।
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-stone-100 pb-4">
          <HelpCircle className="w-6 h-6 text-[#B71C1C]" />
          <h2 className="text-2xl font-bold text-stone-900">
            রক্তদান সংক্রান্ত সাধারণ প্রশ্নোত্তর (FAQ)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-2">
              <h4 className="font-bold text-stone-900 text-sm flex items-start space-x-2">
                <span className="text-[#B71C1C] font-black">Q:</span>
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-[#B71C1C] to-[#8E0000] text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">আপনি কি জীবন বাঁচাতে প্রস্তুত?</h3>
          <p className="text-red-100 text-xs sm:text-sm">
            আজই নিবন্ধন করুন অথবা জরুরি রক্তের প্রয়োজনে আবেদন জানান।
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCurrentPage('register')}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all"
          >
            ডোনার হিসেবে যোগ দিন
          </button>
          <button
            onClick={onOpenEmergencyModal}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs sm:text-sm transition-all"
          >
            জরুরি রক্তের আবেদন
          </button>
        </div>
      </div>
    </div>
  );
};
