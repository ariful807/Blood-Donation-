export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UserRole = 'admin' | 'user';

export type UserStatus = 'active' | 'blocked';

export type UrgencyLevel = 'high' | 'medium' | 'low';

export type RequestStatus = 'pending' | 'approved' | 'completed' | 'rejected';

export type DonationStatus = 'pending' | 'completed' | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  phone: string;
  bloodGroup: BloodGroup;
  dob: string;
  address: string;
  district: string;
  avatarUrl?: string;
  lastDonation: string; // YYYY-MM-DD or empty
  role: UserRole;
  status: UserStatus;
  isAvailableForDonation: boolean;
  totalDonationsCount: number;
  createdAt: string;
}

export interface Donation {
  id: string;
  userId: string;
  userName: string;
  bloodGroup: BloodGroup;
  donationDate: string;
  nextEligibleDate: string;
  hospitalName: string;
  units: number;
  status: DonationStatus;
  notes?: string;
  createdAt: string;
}

export interface BloodRequest {
  id: string;
  requesterName: string;
  contact: string;
  alternateContact?: string;
  bloodGroup: BloodGroup;
  hospital: string;
  district: string;
  urgency: UrgencyLevel;
  unitsNeeded: number;
  status: RequestStatus;
  patientProblem?: string;
  donationDateNeeded: string;
  adminNote?: string;
  createdAt: string;
}

export interface BloodStockItem {
  bloodGroup: BloodGroup;
  unitCount: number;
  lastUpdated: string;
  minimumThreshold: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details?: string;
  timestamp: string;
  ip: string;
  status?: 'success' | 'warning' | 'info' | 'error';
}

export interface GasConfig {
  webAppUrl: string;
  sheetId?: string;
  autoSync: boolean;
  lastSyncTime?: string;
  syncStatus?: 'idle' | 'syncing' | 'connected' | 'error';
  errorMessage?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'urgent' | 'info' | 'success' | 'alert';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
}

export type ApplicationType = 'volunteer' | 'blood_camp' | 'medical_aid' | 'collaboration';

export interface ApplicationSubmission {
  id: string;
  type: ApplicationType;
  applicantName: string;
  phone: string;
  email: string;
  upazila: string;
  villageOrArea: string;
  bloodGroup?: BloodGroup;
  organizationName?: string;
  proposedDate?: string;
  details: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'camp' | 'awareness' | 'award' | 'emergency' | 'community';
  imageUrl: string;
  date: string;
  upazila: string;
  description: string;
}

export interface ApplicationSectionConfig {
  volunteerNotice: string;
  campGuidelines: string;
  aidInstructions: string;
  emergencyContactNilphamari: string;
  allowPublicApplications: boolean;
  announcementBannerText: string;
  noticeBannerActive?: boolean;
  noticeBannerTitle?: string;
  noticeBannerText?: string;
  volunteerSectionTitle?: string;
  volunteerSectionDesc?: string;
  campSectionTitle?: string;
  campSectionDesc?: string;
  guidelines?: string[];
  emergencyDisclaimer?: string;
}

export interface SiteConfig {
  siteName: string;
  siteNameEn?: string;
  siteSlogan: string;
  logoUrl?: string;
  emergencyPhone?: string;
  emergencyPhoneAlt?: string;
  emergencyEmail?: string;
  officeAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  // Hero section
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  // Section Titles & Subtitles
  statsSectionTitle?: string;
  urgentRequestsTitle?: string;
  urgentRequestsSubtitle?: string;
  bloodStockTitle?: string;
  bloodStockSubtitle?: string;
  donorsDirectoryTitle?: string;
  donorsDirectorySubtitle?: string;
  donorsSectionTitle?: string;
  donorsSectionSubtitle?: string;
  noticeSectionTitle?: string;
  noticeSectionSubtitle?: string;
  blogSectionTitle?: string;
  blogSectionSubtitle?: string;
  aboutSectionTitle?: string;
  aboutSectionSubtitle?: string;
  aboutStoryText?: string;
  gallerySectionTitle?: string;
  gallerySectionSubtitle?: string;
  applySectionTitle?: string;
  applySectionSubtitle?: string;
  contactSectionTitle?: string;
  contactSectionSubtitle?: string;
  footerText?: string;
  copyrightText?: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  category: 'urgent' | 'general' | 'camp' | 'official' | string;
  categoryLabel?: string;
  content: string;
  date?: string;
  publishDate?: string;
  publishedBy?: string;
  isPinned: boolean;
  externalUrl?: string; // ঐচ্ছিক লিংক
  externalUrlText?: string; // বাটনের লেবেল যেমন 'বিস্তারিত দেখুন'
  actionUrl?: string;
  actionText?: string;
  attachmentUrl?: string;
  createdAt?: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  category: string; // 'স্বাস্থ্য বার্তা' | 'রক্তদান সচেতনতা' | 'স্বেচ্ছাসেবী অভিজ্ঞতা' | 'থ্যালাসেমিয়া ও সেবা' | 'facts' | string
  excerpt?: string;
  content: string;
  author?: string;
  authorName?: string;
  authorRole?: string;
  imageUrl?: string;
  coverImageUrl?: string;
  youtubeUrl?: string; // ইউটিউব ভিডিও লিংক
  date?: string;
  publishedDate?: string;
  readTime?: string;
  tags?: string[];
  viewsCount?: number;
  createdAt?: string;
}

export interface HomeSliderItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeText?: string;
  imageUrl: string;
  linkPage?: string;
  buttonLink?: string;
  linkText?: string;
  buttonText?: string;
  order?: number;
  isActive: boolean;
}

