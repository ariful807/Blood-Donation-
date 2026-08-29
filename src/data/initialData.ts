import { 
  User, 
  Donation, 
  BloodRequest, 
  BloodStockItem, 
  ActivityLog, 
  ContactMessage,
  GalleryItem,
  ApplicationSubmission,
  ApplicationSectionConfig,
  SiteConfig,
  NoticeItem,
  ArticleItem,
  HomeSliderItem
} from '../types';

export const NILPHAMARI_UPAZILAS = [
  'নীলফামারী সদর (Nilphamari Sadar)',
  'সৈয়দপুর (Saidpur)',
  'ডোমার (Domar)',
  'ডিমলা (Dimla)',
  'জলঢাকা (Jaldhaka)',
  'কিশোরগঞ্জ (Kishoreganj)'
];

// Preset avatars for donors and volunteers
export const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
];

// Backward compatibility alias for existing components
export const BANGLADESH_DISTRICTS = NILPHAMARI_UPAZILAS;

export const INITIAL_USERS: User[] = [
  {
    id: 'USR-1001',
    name: 'অ্যাডমিন পরিচালক (Director Admin)',
    email: 'admin@blood.com',
    passwordHash: 'Admin@123',
    phone: '+880 1711-000001',
    bloodGroup: 'O+',
    dob: '1988-04-12',
    address: 'কলেজ রোড, নীলফামারী সদর',
    district: 'নীলফামারী সদর (Nilphamari Sadar)',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    lastDonation: '2026-05-10',
    role: 'admin',
    status: 'active',
    isAvailableForDonation: true,
    totalDonationsCount: 14,
    createdAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'USR-1002',
    name: 'মোঃ আবদুর রহিম (Rahim Ahmed)',
    email: 'rahim@donor.com',
    passwordHash: 'Donor@123',
    phone: '+880 1819-234567',
    bloodGroup: 'B+',
    dob: '1995-08-20',
    address: 'প্লাজা মোড়, সৈয়দপুর',
    district: 'সৈয়দপুর (Saidpur)',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    lastDonation: '2026-04-15',
    role: 'user',
    status: 'active',
    isAvailableForDonation: true,
    totalDonationsCount: 8,
    createdAt: '2025-02-10T10:30:00.000Z'
  },
  {
    id: 'USR-1003',
    name: 'ফাতিমা সুলতানা (Fatima Sultana)',
    email: 'fatima@blood.com',
    passwordHash: 'User@123',
    phone: '+880 1912-345678',
    bloodGroup: 'A+',
    dob: '1998-11-05',
    address: 'হাসপাতাল রোড, ডোমার',
    district: 'ডোমার (Domar)',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    lastDonation: '2026-06-25',
    role: 'user',
    status: 'active',
    isAvailableForDonation: false,
    totalDonationsCount: 3,
    createdAt: '2025-03-15T14:20:00.000Z'
  },
  {
    id: 'USR-1004',
    name: 'তানভীর হাসান (Tanvir Hasan)',
    email: 'tanvir@gmail.com',
    passwordHash: 'Tanvir@123',
    phone: '+880 1623-889900',
    bloodGroup: 'AB+',
    dob: '1992-02-14',
    address: 'বাবু পাড়া, ডিমলা',
    district: 'ডিমলা (Dimla)',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    lastDonation: '2026-02-10',
    role: 'user',
    status: 'active',
    isAvailableForDonation: true,
    totalDonationsCount: 11,
    createdAt: '2025-04-01T09:00:00.000Z'
  },
  {
    id: 'USR-1005',
    name: 'নুসরাত জাহান (Nusrat Jahan)',
    email: 'nusrat@gmail.com',
    passwordHash: 'Nusrat@123',
    phone: '+880 1734-567890',
    bloodGroup: 'O-',
    dob: '1996-09-18',
    address: 'জলঢাকা বাজার মোড়',
    district: 'জলঢাকা (Jaldhaka)',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
    lastDonation: '2026-01-20',
    role: 'user',
    status: 'active',
    isAvailableForDonation: true,
    totalDonationsCount: 5,
    createdAt: '2025-05-12T11:45:00.000Z'
  },
  {
    id: 'USR-1006',
    name: 'শাকিল চৌধুরী (Shakil Chowdhury)',
    email: 'shakil@gmail.com',
    passwordHash: 'Shakil@123',
    phone: '+880 1511-998877',
    bloodGroup: 'A-',
    dob: '1994-07-30',
    address: 'কিশোরগঞ্জ থানা রোড',
    district: 'কিশোরগঞ্জ (Kishoreganj)',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    lastDonation: '2026-07-01',
    role: 'user',
    status: 'active',
    isAvailableForDonation: false,
    totalDonationsCount: 4,
    createdAt: '2025-06-20T16:10:00.000Z'
  },
  {
    id: 'USR-1007',
    name: 'মাহমুদুল হক (Mahmudul Haque)',
    email: 'mahmud@gmail.com',
    passwordHash: 'Mahmud@123',
    phone: '+880 1788-112233',
    bloodGroup: 'B-',
    dob: '1990-12-12',
    address: 'চৌরাস্তা মোড়, নীলফামারী সদর',
    district: 'নীলফামারী সদর (Nilphamari Sadar)',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    lastDonation: '2026-03-05',
    role: 'user',
    status: 'active',
    isAvailableForDonation: true,
    totalDonationsCount: 6,
    createdAt: '2025-07-10T12:00:00.000Z'
  },
  {
    id: 'USR-1008',
    name: 'সাদিয়া ইসলাম (Sadia Islam)',
    email: 'sadia@gmail.com',
    passwordHash: 'Sadia@123',
    phone: '+880 1977-445566',
    bloodGroup: 'AB-',
    dob: '1997-03-25',
    address: 'রেলওয়ে কলোনি, সৈয়দপুর',
    district: 'সৈয়দপুর (Saidpur)',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    lastDonation: '2025-11-15',
    role: 'user',
    status: 'active',
    isAvailableForDonation: true,
    totalDonationsCount: 2,
    createdAt: '2025-08-05T08:30:00.000Z'
  }
];

export const INITIAL_REQUESTS: BloodRequest[] = [
  {
    id: 'REQ-501',
    requesterName: 'মোঃ কামরুল ইসলাম (রোগীর ভাই)',
    contact: '+880 1712-998877',
    alternateContact: '+880 1815-667788',
    bloodGroup: 'O-',
    hospital: 'নীলফামারী ২৫০ শয্যা বিশিষ্ট জেনারেল হাসপাতাল',
    district: 'নীলফামারী সদর (Nilphamari Sadar)',
    urgency: 'high',
    unitsNeeded: 2,
    status: 'approved',
    patientProblem: 'জরুরি ওপেন সার্জারি, অতি দ্রুত রক্ত প্রয়োজন',
    donationDateNeeded: '2026-08-30',
    adminNote: 'অ্যাডমিন কর্তৃক ভেরিফাইড ও অনুমোদিত। নীলফামারী সদরের ডোনার প্রয়োজন।',
    createdAt: '2026-08-28T18:40:00.000Z'
  },
  {
    id: 'REQ-502',
    requesterName: 'আরিফুর রহমান (স্বজন)',
    contact: '+880 1911-334455',
    bloodGroup: 'A+',
    hospital: 'সৈয়দপুর ১০০ শয্যা রেলওয়ে ও জেনারেল হাসপাতাল',
    district: 'সৈয়দপুর (Saidpur)',
    urgency: 'high',
    unitsNeeded: 1,
    status: 'approved',
    patientProblem: 'থ্যালাসেমিয়া নিয়মিত রক্ত গ্রহণ',
    donationDateNeeded: '2026-08-29',
    adminNote: 'থ্যালাসেমিয়া পেশেন্ট, নিয়মিত শিশু রোগী।',
    createdAt: '2026-08-28T21:15:00.000Z'
  },
  {
    id: 'REQ-503',
    requesterName: 'তাহমিনা বেগম (মা)',
    contact: '+880 1822-445566',
    bloodGroup: 'B+',
    hospital: 'ডোমার উপজেলা স্বাস্থ্য কমপ্লেক্স',
    district: 'ডোমার (Domar)',
    urgency: 'medium',
    unitsNeeded: 1,
    status: 'approved',
    patientProblem: 'গর্ভবতী মায়ের জরুরি সিজারিয়ান ডেলিভারি',
    donationDateNeeded: '2026-08-31',
    adminNote: 'অপারেশন নির্ধারিত। প্রস্তুত ডোনার প্রয়োজন।',
    createdAt: '2026-08-27T10:20:00.000Z'
  },
  {
    id: 'REQ-504',
    requesterName: 'সৈয়দ জুবায়ের (সহকর্মী)',
    contact: '+880 1611-223344',
    bloodGroup: 'AB-',
    hospital: 'জলঢাকা উপজেলা স্বাস্থ্য কমপ্লেক্স',
    district: 'জলঢাকা (Jaldhaka)',
    urgency: 'high',
    unitsNeeded: 2,
    status: 'pending',
    patientProblem: 'সড়ক দুর্ঘটনায় রক্তক্ষরণ',
    donationDateNeeded: '2026-08-29',
    adminNote: '',
    createdAt: '2026-08-29T01:10:00.000Z'
  },
  {
    id: 'REQ-505',
    requesterName: 'হাসান জামিল',
    contact: '+880 1755-667788',
    bloodGroup: 'A-',
    hospital: 'ডিমলা উপজেলা স্বাস্থ্য কমপ্লেক্স',
    district: 'ডিমলা (Dimla)',
    urgency: 'low',
    unitsNeeded: 1,
    status: 'completed',
    patientProblem: 'অর্থোপেডিক সার্জারি',
    donationDateNeeded: '2026-08-25',
    adminNote: 'রক্তদান সম্পন্ন হয়েছে। ডিমলার ডোনার শাকিল ভাইকে ধন্যবাদ।',
    createdAt: '2026-08-24T09:00:00.000Z'
  }
];

export const INITIAL_DONATIONS: Donation[] = [
  {
    id: 'DON-801',
    userId: 'USR-1002',
    userName: 'মোঃ আবদুর রহিম',
    bloodGroup: 'B+',
    donationDate: '2026-04-15',
    nextEligibleDate: '2026-07-15',
    hospitalName: 'নীলফামারী জেনারেল হাসপাতাল',
    units: 1,
    status: 'completed',
    notes: 'জরুরি রক্তের রিকোয়েস্টে দান করা হয়েছে।',
    createdAt: '2026-04-15T12:00:00.000Z'
  },
  {
    id: 'DON-802',
    userId: 'USR-1004',
    userName: 'তানভীর হাসান',
    bloodGroup: 'AB+',
    donationDate: '2026-02-10',
    nextEligibleDate: '2026-05-10',
    hospitalName: 'সৈয়দপুর রেলওয়ে হাসপাতাল',
    units: 1,
    status: 'completed',
    notes: 'থ্যালাসেমিয়া রোগীকে দান করা হয়েছে।',
    createdAt: '2026-02-10T15:30:00.000Z'
  },
  {
    id: 'DON-803',
    userId: 'USR-1005',
    userName: 'নুসরাত জাহান',
    bloodGroup: 'O-',
    donationDate: '2026-01-20',
    nextEligibleDate: '2026-04-20',
    hospitalName: 'জলঢাকা স্বাস্থ্য কমপ্লেক্স',
    units: 1,
    status: 'completed',
    notes: 'জরুরি প্রসূতি মায়ের জন্য।',
    createdAt: '2026-01-20T10:00:00.000Z'
  },
  {
    id: 'DON-804',
    userId: 'USR-1001',
    userName: 'অ্যাডমিন পরিচালক',
    bloodGroup: 'O+',
    donationDate: '2026-05-10',
    nextEligibleDate: '2026-08-10',
    hospitalName: 'ডোমার স্বাস্থ্য কমপ্লেক্স',
    units: 1,
    status: 'completed',
    notes: 'ক্যাম্পেইন ডোনেশন।',
    createdAt: '2026-05-10T11:00:00.000Z'
  }
];

export const INITIAL_STOCK: BloodStockItem[] = [
  { bloodGroup: 'A+', unitCount: 18, lastUpdated: '2026-08-28 16:30', minimumThreshold: 10 },
  { bloodGroup: 'A-', unitCount: 4, lastUpdated: '2026-08-28 14:15', minimumThreshold: 5 },
  { bloodGroup: 'B+', unitCount: 26, lastUpdated: '2026-08-29 08:00', minimumThreshold: 12 },
  { bloodGroup: 'B-', unitCount: 3, lastUpdated: '2026-08-27 18:45', minimumThreshold: 5 },
  { bloodGroup: 'AB+', unitCount: 14, lastUpdated: '2026-08-28 19:20', minimumThreshold: 8 },
  { bloodGroup: 'AB-', unitCount: 2, lastUpdated: '2026-08-29 02:10', minimumThreshold: 4 },
  { bloodGroup: 'O+', unitCount: 32, lastUpdated: '2026-08-29 07:30', minimumThreshold: 15 },
  { bloodGroup: 'O-', unitCount: 5, lastUpdated: '2026-08-28 20:00', minimumThreshold: 6 }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'LOG-301',
    userId: 'USR-1001',
    userName: 'অ্যাডমিন পরিচালক',
    action: 'লগইন সফল (Admin Login)',
    details: 'নীলফামারী সেন্ট্রাল অ্যাডমিন প্যানেলে প্রবেশ করেছেন।',
    timestamp: '2026-08-29 02:40:15',
    ip: '103.205.180.45',
    status: 'success'
  },
  {
    id: 'LOG-302',
    userId: 'SYSTEM',
    userName: 'সিস্টেম অটোমেটর',
    action: 'নতুন জরুরি ব্লাড রিকোয়েস্ট তৈরি',
    details: 'REQ-504 (জলঢাকা স্বাস্থ্য কমপ্লেক্সে AB- রক্তের অনুরোধ জমা হয়েছে)',
    timestamp: '2026-08-29 01:10:00',
    ip: '103.221.254.12',
    status: 'warning'
  },
  {
    id: 'LOG-303',
    userId: 'USR-1001',
    userName: 'অ্যাডমিন পরিচালক',
    action: 'ব্লাড স্টক আপডেট',
    details: 'নীলফামারী ব্লাড ব্যাংকে O+ স্টক ৩২ ইউনিটে হালনাগাদ করা হয়েছে।',
    timestamp: '2026-08-29 00:30:10',
    ip: '103.205.180.45',
    status: 'info'
  },
  {
    id: 'LOG-304',
    userId: 'USR-1002',
    userName: 'মোঃ আবদুর রহিম',
    action: 'ডোনার প্রোফাইল আপডেট',
    details: 'সৈয়দপুর এলাকায় রক্তদানের জন্য প্রস্তুত স্ট্যাটাস চালু করেছেন।',
    timestamp: '2026-08-28 22:15:30',
    ip: '118.179.102.88',
    status: 'success'
  },
  {
    id: 'LOG-305',
    userId: 'USR-1001',
    userName: 'অ্যাডমিন পরিচালক',
    action: 'রিকোয়েস্ট অনুমোদন',
    details: 'REQ-501 (নীলফামারী জেনারেল হাসপাতালের O- ব্লাড রিকোয়েস্ট অনুমোদিত)',
    timestamp: '2026-08-28 19:00:20',
    ip: '103.205.180.45',
    status: 'success'
  }
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'MSG-01',
    name: 'ডাঃ মোশাররফ হোসেন',
    email: 'drmosharraf@nilphamarigen.gov.bd',
    phone: '+880 1711-223344',
    subject: 'নীলফামারী জেনারেল হাসপাতালে রক্তদান ক্যাম্প আয়োজন',
    message: 'আমরা আগামী মাসে নীলফামারীতে একটি বড় পরিসরের স্বেচ্ছায় রক্তদান ক্যাম্পেইন করতে চাই। আপনাদের স্বেচ্ছাসেবকদের উপস্থিতি প্রত্যাশা করছি।',
    createdAt: '2026-08-28 11:30',
    status: 'unread'
  },
  {
    id: 'MSG-02',
    name: 'রাশেদুল করিম (সৈয়দপুর)',
    email: 'rashed.saidpur@gmail.com',
    phone: '+880 1819-001122',
    subject: 'নীলফামারী জেলা ভেরিফাইড ডোনার কার্ড সংগ্রহ',
    message: 'আমি সৈয়দপুরে ৫ বার রক্ত দিয়েছি। কীভাবে লাইফসেভার ব্লাড ব্যাংকের ভেরিফাইড ডোনার কার্ড পেতে পারি?',
    createdAt: '2026-08-27 15:45',
    status: 'read'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'GAL-101',
    title: 'নীলফামারী সরকারি কলেজ প্রাঙ্গণে রক্তদান ক্যাম্পেইন ২০২৬',
    category: 'camp',
    imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1000&q=80',
    date: '১৫ আগস্ট, ২০২৬',
    upazila: 'নীলফামারী সদর',
    description: 'নীলফামারী সদর সরকারি কলেজে দিনব্যাপী রক্তদান কর্মসূচি। এতে শতাধিক শিক্ষার্থী স্বেচ্ছায় রক্তদান করেন।'
  },
  {
    id: 'GAL-102',
    title: 'সৈয়দপুর প্লাজা চত্বরে বিনামূল্যে রক্তের গ্রুপ নির্ণয় কর্মসূচি',
    category: 'awareness',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    date: '১০ আগস্ট, ২০২৬',
    upazila: 'সৈয়দপুর',
    description: 'সৈয়দপুর শহরের সাধারণ পথচারী ও রিকশাচালকদের মাঝে বিনামূল্যে রক্তের গ্রুপ পরীক্ষা ও সচেতনতামূলক ক্যাম্প।'
  },
  {
    id: 'GAL-103',
    title: 'ডোমার উপজেলা স্বাস্থ্য কমপ্লেক্সে জরুরি রক্ত সহায়তা টিম',
    category: 'emergency',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
    date: '২৮ জুলাই, ২০২৬',
    upazila: 'ডোমার',
    description: 'মুমূর্ষু প্রসূতি মায়ের অপারেশনের জন্য মধ্যরাতে ডোমার স্বাস্থ্য কমপ্লেক্সে জরুরি রক্ত পৌঁছে দেয় আমাদের ভলান্টিয়ার টিম।'
  },
  {
    id: 'GAL-104',
    title: 'ডিমলা ইসলামিয়া ডিগ্রি কলেজে বিশ্ব রক্তদাতা দিবস উদযাপন ও র‍্যালি',
    category: 'awareness',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    date: '১৪ জুন, ২০২৬',
    upazila: 'ডিমলা',
    description: 'বিশ্ব রক্তদাতা দিবসে ডিমলা উপজেলায় সচেতনতামূলক বর্ণাঢ্য র‍্যালি ও আলোচনা সভা।'
  },
  {
    id: 'GAL-105',
    title: 'সেরা স্বেচ্ছাসেবী রক্তদাতাদের সম্মাননা স্মারক প্রদান ২০২৬',
    category: 'award',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
    date: '২৫ মে, ২০২৬',
    upazila: 'নীলফামারী সদর',
    description: '১০ বারের বেশি রক্তদানকারী নীলফামারী জেলার ৫০ জন বীর রক্তদাতাকে বিশেষ সম্মাননা ক্রেস্ট প্রদান।'
  },
  {
    id: 'GAL-106',
    title: 'জলঢাকা বাজারে স্বেচ্ছাসেবী রক্তদাতা সমাবেশ ও ওরিয়েন্টেশন',
    category: 'community',
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1000&q=80',
    date: '০২ মে, ২০২৬',
    upazila: 'জলঢাকা',
    description: 'জলঢাকা উপজেলার তরুণ স্বেচ্ছাসেবকদের নিয়ে রক্তদান ব্যবস্থাপনা ও জরুরি যোগাযোগ বিষয়ক কর্মশালা।'
  }
];

export const INITIAL_APPLICATIONS: ApplicationSubmission[] = [
  {
    id: 'APP-201',
    type: 'volunteer',
    applicantName: 'মোঃ সাজ্জাদ হোসেন',
    phone: '+880 1712-445566',
    email: 'sajjad.nil@gmail.com',
    upazila: 'নীলফামারী সদর (Nilphamari Sadar)',
    villageOrArea: 'কুখাপাড়া, নীলফামারী',
    bloodGroup: 'B+',
    details: 'আমি নীলফামারী সদর এলাকায় জরুরি রক্তের সমন্বয় ও সচেতনতা বৃদ্ধিতে স্বেচ্ছাসেবী হিসেবে নিয়মিত সময় দিতে ইচ্ছুক।',
    status: 'approved',
    adminNotes: 'ভেরিফাইড ও সক্রিয় স্বেচ্ছাসেবী হিসেবে টিম নীলফামারীতে যুক্ত করা হয়েছে।',
    createdAt: '2026-08-25 10:30'
  },
  {
    id: 'APP-202',
    type: 'blood_camp',
    applicantName: 'আহসান হাবীব (সভাপতি, যুব ফোরাম সৈয়দপুর)',
    phone: '+880 1819-778899',
    email: 'ahsan.saidpur@gmail.com',
    upazila: 'সৈয়দপুর (Saidpur)',
    villageOrArea: 'রেলওয়ে অফিসার্স ক্লাব প্রাঙ্গণ',
    organizationName: 'সৈয়দপুর তরুণ ঐক্য ফোরাম',
    proposedDate: '2026-09-15',
    details: 'আগামী ১৫ সেপ্টেম্বর সৈয়দপুরে দিনব্যাপী ১০০ জনের রক্তদান ক্যাম্প করতে চাই। আপনাদের মেডিকেল টিম ও কারিগরি সহায়তা প্রয়োজন।',
    status: 'pending',
    adminNotes: 'তারিখ ও ভেন্যু যাচাই চলছে।',
    createdAt: '2026-08-27 14:15'
  },
  {
    id: 'APP-203',
    type: 'medical_aid',
    applicantName: 'সুলতানা রাজিয়া',
    phone: '+880 1913-667788',
    email: 'sultana.domar@gmail.com',
    upazila: 'ডোমার (Domar)',
    villageOrArea: 'হরিণচড়া, ডোমার',
    details: 'আমার পরিবারে থ্যালাসেমিয়া আক্রান্ত ২ জন শিশুর জন্য নিয়মিত রক্ত সংগ্রহে জরুরি সহায়তা দরকার।',
    status: 'approved',
    adminNotes: 'জরুরি কার্ড ও নিয়মিত ডোনার ম্যাপিং তৈরি করে দেওয়া হয়েছে।',
    createdAt: '2026-08-26 09:00'
  }
];

export const INITIAL_APPLICATION_CONFIG: ApplicationSectionConfig = {
  volunteerNotice: 'নীলফামারী জেলার ৬টি উপজেলার যেকোনো তরুণ-তরুণী স্বেচ্ছাসেবী হিসেবে মানবতার সেবায় যুক্ত হতে পারেন। রক্তদানের পাশাপাশি জরুরি রোগীর সহায়তায় সক্রিয় দায়িত্ব পালন করার সুযোগ রয়েছে।',
  campGuidelines: 'আপনার স্কুল, কলেজ, মাদ্রাসা, ক্লাব বা প্রতিষ্ঠানে রক্তদান ক্যাম্পেইন আয়োজনের জন্য কমপক্ষে ৭ দিন আগে আবেদন করুন। আমাদের টিম রক্ত সংগ্রহের যন্ত্রপাতি ও টেকনিক্যাল সহযোগিতা প্রদান করবে।',
  aidInstructions: 'থ্যালাসেমিয়া ও অসহায় রোগীদের বিনামূল্যে রক্ত পেতে জরুরি আবেদন করুন। চিকিৎসকের প্রেসক্রিপশন ও রোগীর তথ্য সঠিক হওয়া বাধ্যতামূলক।',
  emergencyContactNilphamari: '+880 1711-000001 (নীলফামারী সদর কন্ট্রোল রুম)',
  allowPublicApplications: true,
  announcementBannerText: '🔴 নীলফামারী জেলার সকল উপজেলায় জরুরি রক্তের প্রয়োজনে আমাদের স্বেচ্ছাসেবী টিম সার্বক্ষণিক প্রস্তুত।',
  noticeBannerActive: true,
  noticeBannerTitle: 'জরুরি রক্তের হেল্পলাইন ও নোটিশ',
  noticeBannerText: 'নীলফামারী সেন্ট্রাল ব্লাড ব্যাংক সবসময় বিনামূল্যে রক্তদানে সেবায় নিয়োজিত। রক্তের জন্য কোনো আর্থিক লেনদেন করবেন না।',
  volunteerSectionTitle: 'স্বেচ্ছাসেবী হিসেবে যোগ দিন',
  volunteerSectionDesc: 'নীলফামারী জেলার প্রতিটি ইউনিয়নে রক্তদানে উদ্বুদ্ধ করতে ভলান্টিয়ার টিম গঠন করা হচ্ছে।',
  campSectionTitle: 'রক্তদান ক্যাম্প আয়োজন করুন',
  campSectionDesc: 'স্কুল, কলেজ, সামাজিক ক্লাব বা প্রতিষ্ঠানে বিনামূল্যে রক্তদান কর্মসূচি পরিচালনায় যোগাযোগ করুন।',
  guidelines: [
    'রক্তদাতার বয়স ১৮ থেকে ৬০ বছরের মধ্যে হতে হবে এবং ওজন নূন্যতম ৪৫ কেজি হতে হবে।',
    'বিগত ৩ মাসের মধ্যে কোনো ধরনের বড় সার্জারি বা রক্তদান করে থাকলে অপেক্ষা করতে হবে।',
    'রক্তদান একটি সম্পূর্ণ অহিংস ও মানবিক উদ্যোগ, কোনো প্রকার আর্থিক লেনদেন সম্পূর্ণ নিষিদ্ধ।'
  ],
  emergencyDisclaimer: 'জরুরি পরিস্থিতিতে সরাসরি নীলফামারী সদর হাসপাতাল ব্লাড ব্যাংকে যোগাযোগ করতে পারেন।'
};

export const INITIAL_SITE_CONFIG: SiteConfig = {
  siteName: 'লাইফসেভার ব্লাড ব্যাংক',
  siteNameEn: 'Lifesaver Blood Network',
  siteSlogan: 'জীবন বাঁচান, রক্ত দিন • নীলফামারী জেলা শাখা',
  logoUrl: '',
  emergencyPhone: '+880 1711-000001',
  emergencyPhoneAlt: '+880 1819-234567',
  emergencyEmail: 'bloodhelp.nilphamari@gmail.com',
  officeAddress: 'হাসপাতাল রোড, নীলফামারী সদর, নীলফামারী',
  heroBadge: 'রক্তদানে প্রস্তুত একঝাঁক প্রাণ',
  heroTitle: 'রক্তের অভাবে ঝরবে না কোনো প্রাণ',
  heroSubtitle: 'নীলফামারী জেলার সকল উপজেলায় জরুরি রক্তের প্রয়োজনে দ্রুত রক্তদাতা খুঁজুন ও এক ক্লিকে রক্তের অনুরোধ জানান।',
  statsSectionTitle: 'আমাদের রক্তদান কার্যক্রমের বর্তমান অবস্থা',
  urgentRequestsTitle: 'জরুরি রক্তের অনুরোধ',
  urgentRequestsSubtitle: 'নীলফামারীর বিভিন্ন হাসপাতালে চিকিৎসাধীন মুমূর্ষু রোগীদের জন্য অবিলম্বে রক্ত প্রয়োজন',
  bloodStockTitle: 'নীলফামারী সেন্ট্রাল ব্লাড ব্যাংক স্টক',
  bloodStockSubtitle: 'লাইভ সংরক্ষিত রক্তের ব্যাগ ও মজুদের রিয়েল-টাইম তথ্য',
  donorsDirectoryTitle: 'স্বেচ্ছাসেবী রক্তদাতাদের তালিকা',
  donorsDirectorySubtitle: 'নীলফামারী জেলার রেজিস্টার্ড রক্তদাতাদের সাথে সরাসরি যোগাযোগ করুন',
  aboutSectionTitle: 'আমাদের লক্ষ্য ও উদ্দেশ্য',
  aboutSectionSubtitle: 'নীলফামারী জেলার প্রতিটি রোগীর জন্য রক্তদান সেবা সহজ ও নিখরচায় পৌঁছে দেওয়া',
  aboutStoryText: 'লাইফসেভার ব্লাড ব্যাংক নীলফামারী জেলার একটি স্বেচ্ছাসেবী অরাজনৈতিক ও অলাভজনক মানবিক প্ল্যাটফর্ম। আমাদের মূল উদ্দেশ্য রক্তের অভাবে যেন কোনো রোগীর জীবন বিপন্ন না হয়।',
  gallerySectionTitle: 'রক্তদান ও সচেতনতামূলক কার্যক্রম গ্যালারি',
  gallerySectionSubtitle: 'বিভিন্ন উপজেলা ও ইউনিয়নে অনুষ্ঠিত রক্তদান ক্যাম্প ও স্বেচ্ছাসেবকদের স্মৃতিচিত্র',
  applySectionTitle: 'স্বেচ্ছাসেবী ও রক্তদান কর্মসূচি আবেদন',
  applySectionSubtitle: 'আমাদের টিমে ভলান্টিয়ার হিসেবে যুক্ত হন অথবা আপনার এলাকায় ফ্রি ক্যাম্প আয়োজনের আবেদন করুন',
  contactSectionTitle: 'যোগাযোগ ও সহায়তা কেন্দ্র',
  contactSectionSubtitle: 'যে কোনো তথ্য, অভিযোগ বা পরামর্শের জন্য আমাদের সাথে যোগাযোগ করুন',
  footerText: 'নীলফামারী জেলার প্রতিটি মানুষের পাশে বিপদের সময় রক্তদানে প্রস্তুত আমাদের স্বেচ্ছাসেবী নেটওয়ার্ক।',
  copyrightText: '© ২০২৬ লাইফসেভার ব্লাড ব্যাংক - নীলফামারী। সর্বস্বত্ব সংরক্ষিত।'
};

export const INITIAL_SLIDERS: HomeSliderItem[] = [
  {
    id: 'SLIDE-1',
    title: 'রক্তের অভাবে ঝরবে না কোনো প্রাণ',
    subtitle: 'নীলফামারী জেলা সেন্ট্রাল রক্তদান নেটওয়ার্ক — ৬টি উপজেলার জরুরি রক্তের প্রয়োজনে তাৎক্ষণিক সহায়তা।',
    badge: 'জরুরি সেবা ২৪/৭',
    imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1200&auto=format&fit=crop&q=80',
    linkPage: 'requests',
    linkText: 'রক্তের আবেদন দেখুন',
    order: 1,
    isActive: true
  },
  {
    id: 'SLIDE-2',
    title: 'আপনার ১ ব্যাগ রক্ত বাঁচাতে পারে ৩টি জীবন',
    subtitle: 'নিবন্ধন করুন আমাদের অনলাইন ডোনার ডিরেক্টরিতে এবং মানবতার সেবায় সবার আগে এগিয়ে আসুন।',
    badge: 'স্বেচ্ছাসেবী রক্তদাতা হোন',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&auto=format&fit=crop&q=80',
    linkPage: 'register',
    linkText: 'ডোনার হিসেবে যুক্ত হন',
    order: 2,
    isActive: true
  },
  {
    id: 'SLIDE-3',
    title: 'ফ্রি রক্তের গ্রুপ পরীক্ষা ও ব্লাড ডোনেশন ক্যাম্প',
    subtitle: 'নীলফামারীর কলেজ ও শিক্ষা প্রতিষ্ঠানে নিয়মিত অনুষ্ঠিত হচ্ছে সচেতনতামূলক ক্যাম্পেইন।',
    badge: 'ক্যাম্প ও ইভেন্ট',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80',
    linkPage: 'gallery',
    linkText: 'কার্যক্রমের ছবি দেখুন',
    order: 3,
    isActive: true
  },
  {
    id: 'SLIDE-4',
    title: 'রক্তদান সম্পর্কে জানুন এবং সুস্থ থাকুন',
    subtitle: 'বিশেষজ্ঞ চিকিৎসকের পরামর্শ ও রক্তদান বিষয়ক উপকারী স্বাস্থ্য টিপস পড়ুন আমাদের ব্লগে।',
    badge: 'স্বাস্থ্য বার্তা ও ব্লগ',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&auto=format&fit=crop&q=80',
    linkPage: 'blog',
    linkText: 'ব্লগ ও ভিডিও দেখুন',
    order: 4,
    isActive: true
  }
];

export const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'NOT-101',
    title: 'সৈয়দপুর রেলওয়ে সরকারি উচ্চ বিদ্যালয়ে দিনব্যাপী বিনামূল্যে রক্তের গ্রুপ নির্ণয় ও রক্তদান ক্যাম্প',
    category: 'camp',
    categoryLabel: 'ব্লাড ক্যাম্প',
    content: 'আগামী শুক্রবার সকাল ৯টা থেকে বিকাল ৫টা পর্যন্ত সৈয়দপুর রেলওয়ে সরকারি উচ্চ বিদ্যালয় প্রাঙ্গণে লাইফসেভার ব্লাড ব্যাংকের উদ্যোগে দিনব্যাপী ফ্রি ব্লাড গ্রুপিং ও স্বেচ্ছায় রক্তদান কর্মসূচির আয়োজন করা হয়েছে। সকল শিক্ষার্থী, অভিভাবক ও শুভানুধ্যায়ীদের উপস্থিত থাকার জন্য অনুরোধ জানানো হচ্ছে।',
    date: '২০২৬-০৮-২৮',
    publishedBy: 'সেন্ট্রাল এক্সিকিউটিভ কমিটি, নীলফামারী',
    isPinned: true,
    externalUrl: 'https://forms.google.com',
    externalUrlText: 'ক্যাম্পে রেজিস্ট্রেশন করুন',
    createdAt: '2026-08-28T10:00:00.000Z'
  },
  {
    id: 'NOT-102',
    title: 'জরুরি রক্তের সতর্কবার্তা: নেগেটিভ গ্রুপের (O-, AB-, A-) রক্তদাতাদের সক্রিয় থাকার আহ্বান',
    category: 'urgent',
    categoryLabel: 'জরুরি সতর্কতা',
    content: 'নীলফামারী সদর আধুনিক হাসপাতাল ও রংপুর মেডিকেল কলেজ হাসপাতালে চিকিৎসাধীন একাধিক মুমূর্ষু রোগীর জন্য O নেগেটিভ এবং AB নেগেটিভ রক্তের জরুরি প্রয়োজন দেখা দিয়েছে। উল্লেখিত গ্রুপের সম্মানিত রক্তদাতাদের অবিলম্বে আমাদের হটলাইনে যোগাযোগ করতে বিনীত অনুরোধ জানাচ্ছি।',
    date: '২০২৬-০৮-২৭',
    publishedBy: 'জরুরি রেসপন্স টিম',
    isPinned: true,
    externalUrl: 'tel:+8801711000001',
    externalUrlText: 'সরাসরি হটলাইনে কল দিন',
    createdAt: '2026-08-27T16:30:00.000Z'
  },
  {
    id: 'NOT-103',
    title: 'রক্তদানে আর্থিক লেনদেন সম্পূর্ণ নিষিদ্ধ - সতর্কীকরণ বিজ্ঞপ্তি',
    category: 'official',
    categoryLabel: 'অফিসিয়াল বিজ্ঞপ্তি',
    content: 'লাইফসেভার ব্লাড ব্যাংক একটি সম্পূর্ণ অলাভজনক ও মানবিক সংগঠন। রক্তদাতা এবং গ্রহীতার মাঝে কোনো প্রকার আর্থিক লেনদেন সম্পূর্ণভাবে নিষিদ্ধ। কোনো ব্যক্তি যদি রক্তের বিনিময়ে অর্থ দাবি করে, তবে তৎক্ষণাৎ আমাদের কেন্দ্রীয় হটলাইনে অথবা নিকটস্থ থানায় অবহিত করুন।',
    date: '২০২৬-০৮-২৫',
    publishedBy: 'শৃঙ্খলা ও তদারকি সেল',
    isPinned: false,
    externalUrl: '',
    externalUrlText: '',
    createdAt: '2026-08-25T08:20:00.000Z'
  },
  {
    id: 'NOT-104',
    title: 'নীলফামারী জেলা তরুণ স্বেচ্ছাসেবক টিম গঠন ও আবেদন জমাদান সংক্রান্ত',
    category: 'general',
    categoryLabel: 'সাধারণ বিজ্ঞপ্তি',
    content: 'জেলার ৬টি উপজেলা (নীলফামারী সদর, সৈয়দপুর, ডোমার, ডিমলা, জলঢাকা, কিশোরগঞ্জ) এর ইউনিয়ন পর্যায়ে স্বেচ্ছাসেবী উপ-কমিটি গঠন করা হচ্ছে। রক্তদান সচেতনতা ও সমাজসেবায় আগ্রহী ১৮-৩৫ বছর বয়সী যে কেউ আমাদের আবেদন ফর্মের মাধ্যমে অনলাইনে আবেদন করতে পারবেন।',
    date: '২০২৬-০৮-২২',
    publishedBy: 'স্বেচ্ছাসেবক সমন্বয় সেল',
    isPinned: false,
    externalUrl: 'https://docs.google.com',
    externalUrlText: 'আবেদন নির্দেশিকা দেখুন',
    createdAt: '2026-08-22T14:10:00.000Z'
  }
];

export const INITIAL_ARTICLES: ArticleItem[] = [
  {
    id: 'ART-101',
    title: 'রক্তদানের বৈজ্ঞানিক উপকারিতা ও স্বাস্থ্যগত সুফলসমূহ',
    category: 'স্বাস্থ্য বার্তা',
    excerpt: 'নিয়মিত রক্তদান কেবল অন্যের জীবন বাঁচায় না, বরং রক্তদাতার নিজের শরীরকেও সুস্থ ও প্রাণবন্ত রাখতে সাহায্য করে। জেনে নিন এর মূল উপকারিতাগুলো।',
    content: `রক্তদান একটি মহৎ ও নিঃস্বার্থ কাজ। একজন প্রাপ্তবয়স্ক সুস্থ মানুষের শরীরে গড়ে ৪.৫ থেকে ৫.৫ লিটার রক্ত থাকে। রক্তদানের সময় মাত্র ৩৫০ থেকে ৪৫০ মিলিলিটার রক্ত নেওয়া হয়, যা মোট রক্তের সামান্য অংশ।

### রক্তদানের প্রধান স্বাস্থ্যগত সুফল:
1. **হৃদরোগ ও স্ট্রোকের ঝুঁকি হ্রাস:** রক্তদানের ফলে রক্তে অতিরিক্ত আয়রনের মাত্রা স্বাভাবিক থাকে, যা রক্তনালী পরিষ্কার রাখে এবং হৃদরোগের ঝুঁকি বহুলাংশে কমায়।
2. **নতুন রক্তকণিকা উৎপাদন:** রক্তদানের মাত্র ২৪ থেকে ৪৮ ঘণ্টার মধ্যে শরীরে নতুন রক্তরস তৈরি হয় এবং কয়েক সপ্তাহের মধ্যে লোহিত রক্তকণিকা পুনরুজ্জীবিত হয়।
3. **ক্যালোরি ক্ষয় ও ওজন নিয়ন্ত্রণ:** প্রতিবার রক্তদানে প্রায় ৬৫০ ক্যালোরি ক্ষয় হয়।
4. **বিনামূল্যে স্বাস্থ্য পরীক্ষা:** রক্তদানের পূর্বে রক্তচাপ, হিমোগ্লোবিনের মাত্রা, হেপাটাইটিস বি ও সি, এইচআইভি, ম্যালেরিয়া এবং সিফিলিস স্ক্রিনিং সম্পন্ন হয় সম্পূর্ণ বিনামূল্যে।
5. **মানসিক স্বস্তি ও প্রফুল্লতা:** একজন মুমূর্ষু রোগীর প্রাণ বাঁচানোর অনুভূতি মস্তিষ্কে ইতিবাচক হরমোন নিঃসরণ ঘটায়।

রক্তদানের পর পর্যাপ্ত পানি পান করুন, পুষ্টিকর খাবার খান এবং অন্তত ১২ ঘণ্টা ভারী কাজ বা শরীরচর্চা থেকে বিরত থাকুন।`,
    author: 'ডাঃ মোস্তাফিজুর রহমান',
    authorRole: 'মেডিসিন বিশেষজ্ঞ ও রক্তরোগ পরামর্শক',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    date: '২০২৬-০৮-২৬',
    readTime: '৪ মিনিট',
    tags: ['রক্তদান', 'স্বাস্থ্য', 'মেডিকেল টিপস', 'হৃদরোগ'],
    viewsCount: 342,
    createdAt: '2026-08-26T09:30:00.000Z'
  },
  {
    id: 'ART-102',
    title: 'রক্তদানের পূর্বে ও পরে কী কী প্রস্তুতি এবং খাদ্য তালিকা গ্রহণ করা উচিত?',
    category: 'রক্তদান সচেতনতা',
    excerpt: 'রক্তদানের অভিজ্ঞতাকে আনন্দদায়ক ও নিরাপদ রাখতে রক্তদানের পূর্বে ও পরের সঠিক খাবার এবং জীবনযাত্রার নিয়ম জেনে রাখা জরুরি।',
    content: `সঠিক নিয়মে প্রস্তুতি নিয়ে রক্ত দিলে কোনো প্রকার দুর্বলতা বা মাথা ঘোরার সমস্যা হয় না। 

### রক্তদানের আগের প্রস্তুতি:
- রক্তদানের আগের রাতে কমপক্ষে ৭-৮ ঘণ্টা পর্যাপ্ত ঘুমান।
- রক্তদানের ৩-৪ ঘণ্টা আগে পুষ্টিকর হালকা খাবার গ্রহণ করুন (যেমন: ডিম, রুটি, কলা, দুধ)। খালি পেটে কখনোই রক্তদান করবেন না।
- রক্তদানের দিন সকাল থেকেই পর্যাপ্ত পরিমাণে পানি এবং তরল খাবার (যেমন: ফলের জুস, ডাবের পানি) পান করুন।
- রক্তদানের আগের ১২ ঘণ্টা ধূমপান ও ভারী পরিশ্রম পরিহার করুন।

### রক্তদানের পর করণীয়:
- রক্তদান শেষে অন্তত ১০-১৫ মিনিট বিশ্রাম নিন।
- হাসপাতাল বা ক্যাম্প থেকে দেওয়া জুস, বিস্কুট ও স্যালাইন গ্রহণ করুন।
- সুঁচ ফোটানোর স্থানে লাগানো ব্যান্ডেজ অন্তত ৪-৫ ঘণ্টা রাখুন।
- সারাদিন প্রচুর পানি ও ফলের রস পান করুন।`,
    author: 'পুষ্টিবিদ সামিয়া তাসনিম',
    authorRole: 'ক্লিনিক্যাল নিউট্রিশনিস্ট',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80',
    youtubeUrl: 'https://www.youtube.com/watch?v=7wtfhZwyrcc',
    date: '২০২৬-০৮-২৩',
    readTime: '৩ মিনিট',
    tags: ['পুষ্টি', 'খাদ্য তালিকা', 'রক্তদান প্রস্তুতি'],
    viewsCount: 215,
    createdAt: '2026-08-23T11:00:00.000Z'
  },
  {
    id: 'ART-103',
    title: 'থ্যালাসেমিয়া রোগীদের জন্য নিয়মিত রক্তদানের গুরুত্ব ও সচেতনতা',
    category: 'থ্যালাসেমিয়া ও সেবা',
    excerpt: 'থ্যালাসেমিয়া আক্রান্ত শিশুদের প্রতি মাসে ১-২ ব্যাগ নিরাপদ রক্ত প্রয়োজন হয়। আপনার নিয়মিত রক্তদানই তাদের বেঁচে থাকার একমাত্র অবলম্বন।',
    content: `থ্যালাসেমিয়া একটি বংশগত রক্তের রোগ যেখানে লোহিত রক্তকণিকা ঠিকমতো তৈরি হতে পারে না। ফলে রোগীর রক্তে তীব্র রক্তশূন্যতা দেখা দেয়। 

বাংলাদেশের প্রায় ১ কোটিরও বেশি মানুষ থ্যালাসেমিয়ার জিন বহন করছে এবং প্রতি বছর হাজার হাজার শিশু এই রোগ নিয়ে জন্মগ্রহণ করছে।

### কীভাবে সহায়তা করবেন:
1. **নিয়মিত রক্তদাতা হওয়া:** থ্যালাসেমিয়া রোগীদের প্রতি ২০-৩০ দিন অন্তর রক্তের প্রয়োজন হয়। আপনি নিয়মিত রক্তদাতা হিসেবে নির্দিষ্ট রোগীর পাশে দাঁড়াতে পারেন।
2. **বিয়ের আগে রক্ত পরীক্ষা:** থ্যালাসেমিয়া প্রতিরোধে বিয়ের আগে হিমোগ্লোবিন ইলেক্ট্রোফোরেসিস টেস্ট করা অত্যন্ত জরুরি।
3. **থ্যালাসেমিয়া রোগীদের মানসিক সমর্থন:** অসুস্থ শিশুদের ভালোবাসা ও উৎসাহ প্রদান করুন।

আসুন থ্যালাসেমিয়ামুক্ত সুন্দর ভবিষ্যৎ গড়তে সচেতন হই এবং রক্তদানে এগিয়ে আসি।`,
    author: 'অধ্যাপক ড. এম. এ. খান',
    authorRole: 'হেমাটোলজি ও থ্যালাসেমিয়া গবেষক',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    youtubeUrl: 'https://www.youtube.com/watch?v=kXYiU_JCYtU',
    date: '২০২৬-০৮-২০',
    readTime: '৫ মিনিট',
    tags: ['থ্যালাসেমিয়া', 'শিশু স্বাস্থ্য', 'সচেতনতা', 'নিয়মিত রক্তদান'],
    viewsCount: 480,
    createdAt: '2026-08-20T14:40:00.000Z'
  }
];

