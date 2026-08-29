import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  PhoneCall, 
  Heart 
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import confetti from 'canvas-confetti';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const siteConfig = storageService.getSiteConfig();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    storageService.saveMessage({
      name,
      email,
      phone,
      subject: subject || 'সাধারণ যোগাযোগ',
      message
    });

    try { confetti({ particleCount: 50, spread: 60 }); } catch {}

    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');

    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#B71C1C] via-[#8E0000] to-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="px-3 py-1 bg-amber-400 text-stone-950 font-bold rounded-full text-xs uppercase tracking-wider">
            ২৪/৭ হেল্পডেস্ক
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            যোগাযোগ ও জরুরি সহায়তা
          </h1>
          <p className="text-red-100 text-sm sm:text-base leading-relaxed">
            {siteConfig.siteName ? `${siteConfig.siteName}-এর যেকোনো রক্তের প্রয়োজনে বা সহায়তার জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন।` : 'যেকোনো রক্তের প্রয়োজনে বা সহযোগিতার জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন।'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-[#B71C1C] flex items-center justify-center font-bold">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">জরুরি হটলাইন নম্বর</h3>
            <p className="text-xs text-stone-600">যেকোনো মুহূর্তে সরাসরি কল করুন:</p>
            <div className="space-y-1 font-mono text-sm font-bold text-[#B71C1C]">
              <a href={`tel:${siteConfig.emergencyPhone || '+8801700000000'}`} className="block hover:underline">
                {siteConfig.emergencyPhone || '+880 1700-000000'}
              </a>
              {siteConfig.emergencyPhoneAlt && (
                <a href={`tel:${siteConfig.emergencyPhoneAlt}`} className="block hover:underline text-stone-700">
                  {siteConfig.emergencyPhoneAlt}
                </a>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">হোয়াটসঅ্যাপ সাপোর্ট</h3>
            <p className="text-xs text-stone-600">জরুরি তথ্য শেয়ারের জন্য টেক্সট পাঠান:</p>
            <a
              href={`https://wa.me/${(siteConfig.emergencyPhone || '8801700000000').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors"
            >
              <span>{siteConfig.emergencyPhone || 'হোয়াটসঅ্যাপে মেসেজ পাঠান'}</span>
            </a>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">কেন্দ্রীয় কার্যালয়</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {siteConfig.officeAddress || 'হাউজ #১২, রোড #০৪, ধানমন্ডি, ঢাকা - ১২০৫, বাংলাদেশ।'}
            </p>
            <p className="text-[11px] text-stone-400">
              {siteConfig.emergencyEmail ? `ইমেইল: ${siteConfig.emergencyEmail}` : 'কার্যক্রম: সপ্তাহে ৭ দিন, ২৪ ঘণ্টা জরুরি সেবা'}
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="text-xl font-bold text-stone-900">আমাদের বার্তা পাঠান</h3>
            <p className="text-xs text-stone-500">আপনার মতামত বা সহায়তার বার্তা লিখে পাঠান</p>
          </div>

          {submitted && (
            <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl flex items-center space-x-2 text-xs sm:text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>আপনার বার্তা সফলভাবে গ্রহণ করা হয়েছে! খুব শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">আপনার নাম *</label>
                <input
                  type="text"
                  placeholder="মোঃ আবদুর রহমান"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">ইমেইল ঠিকানা *</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">মোবাইল নম্বর</label>
                <input
                  type="tel"
                  placeholder="+880 1XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">বিষয় (Subject)</label>
                <input
                  type="text"
                  placeholder="যেমন: ডোনেশন ক্যাম্পেইনের জন্য সহায়তা"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">আপনার বার্তা *</label>
              <textarea
                rows={4}
                placeholder="আপনার বিস্তারিত বার্তা লিখুন..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                required
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3 bg-[#B71C1C] hover:bg-[#8B0000] text-white font-bold rounded-xl shadow-md text-xs sm:text-sm flex items-center space-x-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>বার্তা প্রেরণ করুন (Send Message)</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
