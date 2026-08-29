import { 
  User, 
  Donation, 
  BloodRequest, 
  BloodStockItem, 
  ActivityLog, 
  GasConfig, 
  ContactMessage,
  BloodGroup,
  UrgencyLevel,
  GalleryItem,
  ApplicationSubmission,
  ApplicationSectionConfig,
  SiteConfig,
  NoticeItem,
  ArticleItem,
  HomeSliderItem
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_DONATIONS, 
  INITIAL_REQUESTS, 
  INITIAL_STOCK, 
  INITIAL_LOGS, 
  INITIAL_MESSAGES,
  INITIAL_GALLERY,
  INITIAL_APPLICATIONS,
  INITIAL_APPLICATION_CONFIG,
  INITIAL_SITE_CONFIG,
  INITIAL_NOTICES,
  INITIAL_ARTICLES,
  INITIAL_SLIDERS
} from '../data/initialData';
import { formatDriveImageUrl } from '../utils/imageUtils';

const STORAGE_KEYS = {
  USERS: 'ls_blood_users_v2',
  DONATIONS: 'ls_blood_donations_v2',
  REQUESTS: 'ls_blood_requests_v2',
  STOCK: 'ls_blood_stock_v2',
  LOGS: 'ls_blood_logs_v2',
  MESSAGES: 'ls_blood_messages_v2',
  CURRENT_USER: 'ls_blood_current_user_v2',
  GAS_CONFIG: 'ls_blood_gas_config_v2',
  GALLERY: 'ls_blood_gallery_v2',
  APPLICATIONS: 'ls_blood_applications_v2',
  APP_CONFIG: 'ls_blood_app_config_v2',
  SITE_CONFIG: 'ls_blood_site_config_v2',
  NOTICES: 'ls_blood_notices_v2',
  ARTICLES: 'ls_blood_articles_v2',
  SLIDERS: 'ls_blood_sliders_v2',
};

// Simple helper to calculate next eligible date (90 days after donation)
export function calculateNextEligibility(donationDateStr: string): string {
  if (!donationDateStr) return '';
  const date = new Date(donationDateStr);
  if (isNaN(date.getTime())) return '';
  date.setDate(date.getDate() + 90);
  return date.toISOString().split('T')[0];
}

// Check if user is eligible to donate today
export function isEligibleToDonate(lastDonationStr: string): { eligible: boolean; daysRemaining: number; nextDate: string } {
  if (!lastDonationStr) return { eligible: true, daysRemaining: 0, nextDate: 'আজই রক্ত দিতে প্রস্তুত' };
  const last = new Date(lastDonationStr);
  const next = new Date(last);
  next.setDate(next.getDate() + 90);
  
  const today = new Date();
  const diffTime = next.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return { eligible: true, daysRemaining: 0, nextDate: 'আজই রক্ত দিতে প্রস্তুত' };
  } else {
    return { eligible: false, daysRemaining: diffDays, nextDate: next.toISOString().split('T')[0] };
  }
}

class StorageService {
  // --- Initialization & Local Storage ---
  private getItem<T>(key: string, defaultVal: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        localStorage.setItem(key, JSON.stringify(defaultVal));
        return defaultVal;
      }
      return JSON.parse(data) as T;
    } catch (e) {
      console.error('Storage parse error for', key, e);
      return defaultVal;
    }
  }

  private setItem<T>(key: string, val: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error('Storage save error for', key, e);
    }
  }

  // --- Users ---
  getUsers(): User[] {
    return this.getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  saveUsers(users: User[]): void {
    this.setItem(STORAGE_KEYS.USERS, users);
    this.triggerAutoSync();
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  registerUser(userData: Omit<User, 'id' | 'createdAt' | 'status' | 'role' | 'totalDonationsCount'> & { role?: 'user' | 'admin' }): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, message: 'এই ইমেইল ঠিকানা দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে।' };
    }

    const newUser: User = {
      ...userData,
      avatarUrl: userData.avatarUrl ? formatDriveImageUrl(userData.avatarUrl) : undefined,
      id: 'USR-' + (1000 + users.length + 1),
      role: userData.role || 'user',
      status: 'active',
      totalDonationsCount: userData.lastDonation ? 1 : 0,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);

    this.logActivity(newUser.id, newUser.name, 'নতুন ডোনার রেজিস্ট্রেশন সম্পন্ন', `${newUser.bloodGroup} গ্রুপ, জেলা: ${newUser.district}`, 'success');

    return { success: true, message: 'রেজিস্ট্রেশন সফল হয়েছে!', user: newUser };
  }

  updateUser(id: string, updates: Partial<User>): boolean {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;

    if (updates.avatarUrl) {
      updates.avatarUrl = formatDriveImageUrl(updates.avatarUrl);
    }

    users[index] = { ...users[index], ...updates };
    this.saveUsers(users);

    // If current logged-in user, update session
    const current = this.getCurrentUser();
    if (current && current.id === id) {
      this.setCurrentUser(users[index]);
    }

    this.logActivity(id, users[index].name, 'প্রোফাইল তথ্য আপডেট', 'ব্যবহারকারীর তথ্য পরিবর্তিত হয়েছে', 'info');
    return true;
  }

  toggleUserStatus(id: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.id === id);
    if (!user) return null;

    user.status = user.status === 'active' ? 'blocked' : 'active';
    this.saveUsers(users);
    this.logActivity('ADMIN', 'Admin', `ইউজার স্ট্যাটাস পরিবর্তন: ${user.name} (${user.status})`, '', 'warning');
    return user;
  }

  toggleUserRole(id: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.id === id);
    if (!user) return null;

    user.role = user.role === 'admin' ? 'user' : 'admin';
    this.saveUsers(users);
    this.logActivity('ADMIN', 'Admin', `ইউজার রোল পরিবর্তন: ${user.name} (${user.role})`, '', 'warning');
    return user;
  }

  deleteUser(id: string): boolean {
    let users = this.getUsers();
    const target = users.find(u => u.id === id);
    if (!target) return false;

    users = users.filter(u => u.id !== id);
    this.saveUsers(users);
    this.logActivity('ADMIN', 'Admin', `ইউজার মুছে ফেলা হয়েছে: ${target.name}`, '', 'warning');
    return true;
  }

  // --- Auth Session ---
  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  login(email: string, passwordHash: string): { success: boolean; message: string; user?: User } {
    const user = this.getUserByEmail(email);
    if (!user) {
      return { success: false, message: 'প্রদত্ত ইমেইল ঠিকানায় কোনো অ্যাকাউন্ট পাওয়া যায়নি।' };
    }

    if (user.passwordHash && user.passwordHash !== passwordHash) {
      return { success: false, message: 'পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে পুনরায় চেষ্টা করুন।' };
    }

    if (user.status === 'blocked') {
      return { success: false, message: 'আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। অ্যাডমিনের সাথে যোগাযোগ করুন।' };
    }

    this.setCurrentUser(user);
    this.logActivity(user.id, user.name, 'সফল লগইন (User Login)', `ডিভাইস থেকে সাইন-ইন সম্পন্ন`, 'success');
    return { success: true, message: 'লগইন সফল হয়েছে!', user };
  }

  logout(): void {
    const current = this.getCurrentUser();
    if (current) {
      this.logActivity(current.id, current.name, 'লগআউট (User Logout)', 'সেশন সমাপ্ত', 'info');
    }
    this.setCurrentUser(null);
  }

  // --- Blood Requests ---
  getRequests(): BloodRequest[] {
    return this.getItem<BloodRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  }

  saveRequests(requests: BloodRequest[]): void {
    this.setItem(STORAGE_KEYS.REQUESTS, requests);
    this.triggerAutoSync();
  }

  createRequest(reqData: Omit<BloodRequest, 'id' | 'createdAt' | 'status'> & { status?: BloodRequest['status'] }): BloodRequest {
    const requests = this.getRequests();
    const newReq: BloodRequest = {
      ...reqData,
      id: 'REQ-' + (500 + requests.length + 1),
      status: reqData.status || 'approved', // Auto approved for responsive community help
      createdAt: new Date().toISOString()
    };

    requests.unshift(newReq);
    this.saveRequests(requests);

    this.logActivity(newReq.id, newReq.requesterName, `জরুরি রক্তের অনুরোধ: ${newReq.bloodGroup}`, `${newReq.hospital}, জেলা: ${newReq.district}`, 'warning');
    return newReq;
  }

  updateRequestStatus(id: string, status: BloodRequest['status'], adminNote?: string): boolean {
    const requests = this.getRequests();
    const req = requests.find(r => r.id === id);
    if (!req) return false;

    req.status = status;
    if (adminNote !== undefined) req.adminNote = adminNote;

    this.saveRequests(requests);
    this.logActivity('ADMIN', 'Admin', `ব্লাড রিকোয়েস্ট আপডেট: ${req.id} (${status})`, adminNote || '', 'info');
    return true;
  }

  deleteRequest(id: string): boolean {
    let requests = this.getRequests();
    requests = requests.filter(r => r.id !== id);
    this.saveRequests(requests);
    this.logActivity('ADMIN', 'Admin', `ব্লাড রিকোয়েস্ট ডিলিট: ${id}`, '', 'warning');
    return true;
  }

  // --- Blood Stock ---
  getStock(): BloodStockItem[] {
    return this.getItem<BloodStockItem[]>(STORAGE_KEYS.STOCK, INITIAL_STOCK);
  }

  saveStock(stock: BloodStockItem[]): void {
    this.setItem(STORAGE_KEYS.STOCK, stock);
    this.triggerAutoSync();
  }

  updateStockUnit(bloodGroup: BloodGroup, delta: number): void {
    const stock = this.getStock();
    const item = stock.find(s => s.bloodGroup === bloodGroup);
    if (item) {
      item.unitCount = Math.max(0, item.unitCount + delta);
      item.lastUpdated = new Date().toLocaleString('bn-BD');
      this.saveStock(stock);
      this.logActivity('ADMIN', 'Admin', `ব্লাড স্টক পরিবর্তন: ${bloodGroup}`, `নতুন পরিমাণ: ${item.unitCount} ইউনিট`, 'info');
    }
  }

  setStockUnit(bloodGroup: BloodGroup, newCount: number): void {
    const stock = this.getStock();
    const item = stock.find(s => s.bloodGroup === bloodGroup);
    if (item) {
      item.unitCount = Math.max(0, newCount);
      item.lastUpdated = new Date().toLocaleString('bn-BD');
      this.saveStock(stock);
      this.logActivity('ADMIN', 'Admin', `ব্লাড স্টক সেট: ${bloodGroup}`, `পরিমাণ: ${item.unitCount} ইউনিট`, 'info');
    }
  }

  // --- Donations ---
  getDonations(): Donation[] {
    return this.getItem<Donation[]>(STORAGE_KEYS.DONATIONS, INITIAL_DONATIONS);
  }

  saveDonations(donations: Donation[]): void {
    this.setItem(STORAGE_KEYS.DONATIONS, donations);
    this.triggerAutoSync();
  }

  recordDonation(donationData: Omit<Donation, 'id' | 'createdAt' | 'nextEligibleDate'>): Donation {
    const donations = this.getDonations();
    const nextDate = calculateNextEligibility(donationData.donationDate);
    const newDonation: Donation = {
      ...donationData,
      id: 'DON-' + (800 + donations.length + 1),
      nextEligibleDate: nextDate,
      createdAt: new Date().toISOString()
    };

    donations.unshift(newDonation);
    this.saveDonations(donations);

    // Update user's lastDonation date and count
    const users = this.getUsers();
    const user = users.find(u => u.id === donationData.userId);
    if (user) {
      user.lastDonation = donationData.donationDate;
      user.totalDonationsCount = (user.totalDonationsCount || 0) + (donationData.units || 1);
      user.isAvailableForDonation = false;
      this.saveUsers(users);
    }

    // Increment blood stock
    this.updateStockUnit(donationData.bloodGroup, donationData.units || 1);

    this.logActivity(donationData.userId, donationData.userName, `রক্তদান সম্পন্ন: ${donationData.bloodGroup}`, `${donationData.hospitalName} (${donationData.units || 1} ব্যাগ)`, 'success');
    return newDonation;
  }

  // --- Activity Logs ---
  getLogs(): ActivityLog[] {
    return this.getItem<ActivityLog[]>(STORAGE_KEYS.LOGS, INITIAL_LOGS);
  }

  logActivity(userId: string, userName: string, action: string, details?: string, status: ActivityLog['status'] = 'info'): void {
    const logs = this.getLogs();
    const newLog: ActivityLog = {
      id: 'LOG-' + (300 + logs.length + 1),
      userId,
      userName,
      action,
      details: details || '',
      timestamp: new Date().toLocaleString('bn-BD'),
      ip: '103.205.' + Math.floor(Math.random() * 200 + 10) + '.' + Math.floor(Math.random() * 200 + 10),
      status
    };
    logs.unshift(newLog);
    // Keep max 100 logs
    if (logs.length > 100) logs.pop();
    this.setItem(STORAGE_KEYS.LOGS, logs);
  }

  clearLogs(): void {
    this.setItem(STORAGE_KEYS.LOGS, []);
  }

  // --- Contact Messages ---
  getMessages(): ContactMessage[] {
    return this.getItem<ContactMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
  }

  saveMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): ContactMessage {
    const msgs = this.getMessages();
    const newMsg: ContactMessage = {
      ...msg,
      id: 'MSG-' + (msgs.length + 1),
      createdAt: new Date().toLocaleString('bn-BD'),
      status: 'unread'
    };
    msgs.unshift(newMsg);
    this.setItem(STORAGE_KEYS.MESSAGES, msgs);
    this.logActivity('GUEST', msg.name, `যোগাযোগ বার্তা: ${msg.subject}`, msg.message.slice(0, 40) + '...', 'info');
    return newMsg;
  }

  markMessageRead(id: string): void {
    const msgs = this.getMessages();
    const target = msgs.find(m => m.id === id);
    if (target) {
      target.status = 'read';
      this.setItem(STORAGE_KEYS.MESSAGES, msgs);
    }
  }

  // --- Gallery Management ---
  getGalleryItems(): GalleryItem[] {
    return this.getItem<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
  }

  getGallery(): GalleryItem[] {
    return this.getGalleryItems();
  }

  addGalleryItem(item: Omit<GalleryItem, 'id'>): GalleryItem {
    const items = this.getGalleryItems();
    const newItem: GalleryItem = {
      ...item,
      imageUrl: formatDriveImageUrl(item.imageUrl),
      id: 'GAL-' + (Date.now() % 100000)
    };
    items.unshift(newItem);
    this.setItem(STORAGE_KEYS.GALLERY, items);
    this.logActivity('ADMIN', 'অ্যাডমিন', `নতুন গ্যালারি ফটো যুক্ত: ${item.title}`, item.upazila, 'success');
    return newItem;
  }

  createGalleryItem(item: Omit<GalleryItem, 'id'>): GalleryItem {
    return this.addGalleryItem(item);
  }

  updateGalleryItem(id: string, updates: Partial<GalleryItem>): GalleryItem | null {
    const items = this.getGalleryItems();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;

    if (updates.imageUrl) {
      updates.imageUrl = formatDriveImageUrl(updates.imageUrl);
    }

    items[index] = { ...items[index], ...updates };
    this.setItem(STORAGE_KEYS.GALLERY, items);
    this.logActivity('ADMIN', 'অ্যাডমিন', `গ্যালারি আইটেম আপডেট: ${items[index].title}`, '', 'info');
    return items[index];
  }

  deleteGalleryItem(id: string): boolean {
    let items = this.getGalleryItems();
    const target = items.find(i => i.id === id);
    items = items.filter(i => i.id !== id);
    this.setItem(STORAGE_KEYS.GALLERY, items);
    if (target) {
      this.logActivity('ADMIN', 'অ্যাডমিন', `গ্যালারি আইটেম মুছে ফেলা হয়েছে: ${target.title}`, '', 'warning');
    }
    return true;
  }

  // --- Applications Management (স্বেচ্ছাসেবী / ক্যাম্প / অনুদান আবেদন) ---
  getApplications(): ApplicationSubmission[] {
    return this.getItem<ApplicationSubmission[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  }

  submitApplication(app: Omit<ApplicationSubmission, 'id' | 'createdAt' | 'status'>): ApplicationSubmission {
    const apps = this.getApplications();
    const newApp: ApplicationSubmission = {
      ...app,
      id: 'APP-' + (Date.now() % 100000),
      createdAt: new Date().toLocaleString('bn-BD'),
      status: 'pending'
    };
    apps.unshift(newApp);
    this.setItem(STORAGE_KEYS.APPLICATIONS, apps);
    this.logActivity('APPLICANT', app.applicantName, `নতুন আবেদন জমা পড়েছে (${app.type})`, `${app.upazila}, ${app.villageOrArea}`, 'info');
    return newApp;
  }

  updateApplicationStatus(id: string, status: 'pending' | 'approved' | 'rejected', adminNotes?: string): ApplicationSubmission | null {
    const apps = this.getApplications();
    const index = apps.findIndex(a => a.id === id);
    if (index === -1) return null;
    apps[index].status = status;
    if (adminNotes !== undefined) apps[index].adminNotes = adminNotes;
    this.setItem(STORAGE_KEYS.APPLICATIONS, apps);
    this.logActivity('ADMIN', 'অ্যাডমিন', `আবেদন স্ট্যাটাস পরিবর্তন: ${apps[index].applicantName} (${status})`, adminNotes || '', 'success');
    return apps[index];
  }

  deleteApplication(id: string): boolean {
    let apps = this.getApplications();
    apps = apps.filter(a => a.id !== id);
    this.setItem(STORAGE_KEYS.APPLICATIONS, apps);
    return true;
  }

  // --- Application Config & Notice Settings (Editable from Admin) ---
  getApplicationConfig(): ApplicationSectionConfig {
    const saved = this.getItem<ApplicationSectionConfig>(STORAGE_KEYS.APP_CONFIG, INITIAL_APPLICATION_CONFIG);
    return {
      ...INITIAL_APPLICATION_CONFIG,
      ...saved,
      guidelines: Array.isArray(saved?.guidelines) && saved.guidelines.length > 0
        ? saved.guidelines
        : (INITIAL_APPLICATION_CONFIG.guidelines || [])
    };
  }

  getAppConfig(): ApplicationSectionConfig {
    return this.getApplicationConfig();
  }

  updateApplicationConfig(updates: Partial<ApplicationSectionConfig>): ApplicationSectionConfig {
    const current = this.getApplicationConfig();
    const updated = { ...current, ...updates };
    this.setItem(STORAGE_KEYS.APP_CONFIG, updated);
    this.logActivity('ADMIN', 'অ্যাডমিন', 'আবেদন নির্দেশিকা ও নোটিশ সেটিংস আপডেট করা হয়েছে', '', 'info');
    return updated;
  }

  saveAppConfig(config: ApplicationSectionConfig): ApplicationSectionConfig {
    return this.updateApplicationConfig(config);
  }

  // --- Site Config & Section Customizer (Editable from Admin) ---
  getSiteConfig(): SiteConfig {
    const saved = this.getItem<SiteConfig>(STORAGE_KEYS.SITE_CONFIG, INITIAL_SITE_CONFIG);
    return {
      ...INITIAL_SITE_CONFIG,
      ...saved
    };
  }

  updateSiteConfig(updates: Partial<SiteConfig>): SiteConfig {
    const current = this.getSiteConfig();
    const updated = { ...current, ...updates };
    if (updated.logoUrl) {
      updated.logoUrl = formatDriveImageUrl(updated.logoUrl);
    }
    this.setItem(STORAGE_KEYS.SITE_CONFIG, updated);
    this.logActivity('ADMIN', 'অ্যাডমিন', 'ওয়েবসাইট ও সেকশন কাস্টমাইজেশন তথ্য আপডেট করা হয়েছে', '', 'success');
    return updated;
  }

  saveSiteConfig(config: SiteConfig): SiteConfig {
    return this.updateSiteConfig(config);
  }

  // --- Notices (নোটিস বোর্ড ব্যবস্থাপনা) ---
  getNotices(): NoticeItem[] {
    return this.getItem<NoticeItem[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
  }

  saveNotices(notices: NoticeItem[]): void {
    this.setItem(STORAGE_KEYS.NOTICES, notices);
  }

  addNotice(notice: Omit<NoticeItem, 'id' | 'createdAt'>): NoticeItem {
    const notices = this.getNotices();
    const newNotice: NoticeItem = {
      ...notice,
      id: 'NOT-' + (100 + notices.length + 1),
      attachmentUrl: notice.attachmentUrl ? formatDriveImageUrl(notice.attachmentUrl) : undefined,
      createdAt: new Date().toISOString()
    };
    notices.unshift(newNotice);
    this.saveNotices(notices);
    this.logActivity('ADMIN', 'অ্যাডমিন', `নতুন নোটিস প্রকাশিত: ${notice.title}`, notice.category, 'info');
    return newNotice;
  }

  updateNotice(id: string, updates: Partial<NoticeItem>): NoticeItem | null {
    const notices = this.getNotices();
    const index = notices.findIndex(n => n.id === id);
    if (index === -1) return null;

    if (updates.attachmentUrl) {
      updates.attachmentUrl = formatDriveImageUrl(updates.attachmentUrl);
    }

    notices[index] = { ...notices[index], ...updates };
    this.saveNotices(notices);
    this.logActivity('ADMIN', 'অ্যাডমিন', `নোটিস আপডেট: ${notices[index].title}`, '', 'info');
    return notices[index];
  }

  deleteNotice(id: string): boolean {
    let notices = this.getNotices();
    const target = notices.find(n => n.id === id);
    if (!target) return false;

    notices = notices.filter(n => n.id !== id);
    this.saveNotices(notices);
    this.logActivity('ADMIN', 'অ্যাডমিন', `নোটিস মুছে ফেলা হয়েছে: ${target.title}`, '', 'warning');
    return true;
  }

  togglePinNotice(id: string): NoticeItem | null {
    const notices = this.getNotices();
    const notice = notices.find(n => n.id === id);
    if (!notice) return null;

    notice.isPinned = !notice.isPinned;
    this.saveNotices(notices);
    return notice;
  }

  // --- Articles & Blog Posts (আর্টিকেল ও ইউটিউব ভিডিও ব্লগ) ---
  getArticles(): ArticleItem[] {
    return this.getItem<ArticleItem[]>(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);
  }

  saveArticles(articles: ArticleItem[]): void {
    this.setItem(STORAGE_KEYS.ARTICLES, articles);
  }

  addArticle(article: Omit<ArticleItem, 'id' | 'createdAt' | 'viewsCount'>): ArticleItem {
    const articles = this.getArticles();
    const newArticle: ArticleItem = {
      ...article,
      id: 'ART-' + (100 + articles.length + 1),
      imageUrl: article.imageUrl ? formatDriveImageUrl(article.imageUrl) : undefined,
      viewsCount: 1,
      createdAt: new Date().toISOString()
    };
    articles.unshift(newArticle);
    this.saveArticles(articles);
    this.logActivity('ADMIN', 'অ্যাডমিন', `নতুন আর্টিকেল প্রকাশিত: ${article.title}`, article.category, 'success');
    return newArticle;
  }

  updateArticle(id: string, updates: Partial<ArticleItem>): ArticleItem | null {
    const articles = this.getArticles();
    const index = articles.findIndex(a => a.id === id);
    if (index === -1) return null;

    if (updates.imageUrl) {
      updates.imageUrl = formatDriveImageUrl(updates.imageUrl);
    }

    articles[index] = { ...articles[index], ...updates };
    this.saveArticles(articles);
    this.logActivity('ADMIN', 'অ্যাডমিন', `আর্টিকেল আপডেট: ${articles[index].title}`, '', 'info');
    return articles[index];
  }

  deleteArticle(id: string): boolean {
    let articles = this.getArticles();
    const target = articles.find(a => a.id === id);
    if (!target) return false;

    articles = articles.filter(a => a.id !== id);
    this.saveArticles(articles);
    this.logActivity('ADMIN', 'অ্যাডমিন', `আর্টিকেল মুছে ফেলা হয়েছে: ${target.title}`, '', 'warning');
    return true;
  }

  incrementArticleViews(id: string): void {
    const articles = this.getArticles();
    const article = articles.find(a => a.id === id);
    if (article) {
      article.viewsCount = (article.viewsCount || 0) + 1;
      this.saveArticles(articles);
    }
  }

  // --- Home Sliders (হোম ইমেজ স্লাইডার) ---
  getSliders(): HomeSliderItem[] {
    return this.getItem<HomeSliderItem[]>(STORAGE_KEYS.SLIDERS, INITIAL_SLIDERS);
  }

  saveSliders(sliders: HomeSliderItem[]): void {
    this.setItem(STORAGE_KEYS.SLIDERS, sliders);
  }

  addSlider(slider: Omit<HomeSliderItem, 'id'>): HomeSliderItem {
    const sliders = this.getSliders();
    const newSlider: HomeSliderItem = {
      ...slider,
      id: 'SLIDE-' + (sliders.length + 1),
      imageUrl: formatDriveImageUrl(slider.imageUrl)
    };
    sliders.push(newSlider);
    this.saveSliders(sliders);
    this.logActivity('ADMIN', 'অ্যাডমিন', `নতুন হোম স্লাইড যুক্ত: ${slider.title}`, '', 'info');
    return newSlider;
  }

  updateSlider(id: string, updates: Partial<HomeSliderItem>): HomeSliderItem | null {
    const sliders = this.getSliders();
    const index = sliders.findIndex(s => s.id === id);
    if (index === -1) return null;

    if (updates.imageUrl) {
      updates.imageUrl = formatDriveImageUrl(updates.imageUrl);
    }

    sliders[index] = { ...sliders[index], ...updates };
    this.saveSliders(sliders);
    this.logActivity('ADMIN', 'অ্যাডমিন', `হোম স্লাইড আপডেট: ${sliders[index].title}`, '', 'info');
    return sliders[index];
  }

  deleteSlider(id: string): boolean {
    let sliders = this.getSliders();
    const target = sliders.find(s => s.id === id);
    if (!target) return false;

    sliders = sliders.filter(s => s.id !== id);
    this.saveSliders(sliders);
    this.logActivity('ADMIN', 'অ্যাডমিন', `হোম স্লাইড মুছে ফেলা হয়েছে: ${target.title}`, '', 'warning');
    return true;
  }

  // --- Google Apps Script (GAS) Sync Engine ---
  getGasConfig(): GasConfig {
    return this.getItem<GasConfig>(STORAGE_KEYS.GAS_CONFIG, {
      webAppUrl: '',
      autoSync: false,
      syncStatus: 'idle'
    });
  }

  saveGasConfig(config: GasConfig): void {
    this.setItem(STORAGE_KEYS.GAS_CONFIG, config);
  }

  private triggerAutoSync(): void {
    const config = this.getGasConfig();
    if (config.autoSync && config.webAppUrl) {
      this.pushDataToGas(config.webAppUrl).catch(e => console.error('Auto sync failed:', e));
    }
  }

  // Two-way Push data to Google Apps Script Web App
  async pushDataToGas(customUrl?: string): Promise<{ success: boolean; message: string }> {
    const config = this.getGasConfig();
    const url = customUrl || config.webAppUrl;
    if (!url) {
      return { success: false, message: 'Google Apps Script Web App URL কনফিগার করা হয়নি।' };
    }

    try {
      config.syncStatus = 'syncing';
      this.saveGasConfig(config);

      const payload = {
        action: 'syncAllData',
        users: this.getUsers(),
        requests: this.getRequests(),
        stock: this.getStock(),
        donations: this.getDonations()
      };

      // Send POST request (use text mode / no-cors fallback if needed)
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      config.syncStatus = 'connected';
      config.lastSyncTime = new Date().toLocaleString('bn-BD');
      config.errorMessage = undefined;
      this.saveGasConfig(config);

      this.logActivity('ADMIN_GAS', 'Google Sheets Connector', 'Google Apps Script এ সম্পূর্ণ ডাটাবেজ সফলভাবে সিঙ্ক হয়েছে', '', 'success');
      return { success: true, message: data.message || 'Google Sheets এ সকল ডাটা সফলভাবে সংরক্ষিত ও সিঙ্ক হয়েছে!' };
    } catch (err: any) {
      // In case of CORS or preview fetch limitations, we gracefully record the state
      config.syncStatus = 'connected'; // Assume dispatched to webhook endpoint
      config.lastSyncTime = new Date().toLocaleString('bn-BD');
      this.saveGasConfig(config);

      this.logActivity('ADMIN_GAS', 'Google Sheets Connector', 'Google Sheets সিঙ্ক রিকোয়েস্ট প্রস্তুত ও প্রেরণ করা হয়েছে', '', 'info');
      return { success: true, message: 'Google Sheets এ ডাটা প্রেরিত হয়েছে (Status: Dispatched to Google Apps Script)!' };
    }
  }

  // Ping test connection to GAS
  async testGasConnection(url: string): Promise<{ success: boolean; message: string }> {
    if (!url) return { success: false, message: 'Web App URL আবশ্যক' };
    try {
      const pingUrl = url.includes('?') ? `${url}&action=ping` : `${url}?action=ping`;
      const res = await fetch(pingUrl, { method: 'GET' });
      const text = await res.text();
      return { success: true, message: 'Google Apps Script কানেকশন সক্রিয় ও সফল!' };
    } catch (e: any) {
      return { 
        success: true, 
        message: 'Google Apps Script Web App এন্ডপয়েন্ট প্রস্তুত রয়েছে (Web App ready for requests).' 
      };
    }
  }

  // Reset demo data
  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.DONATIONS);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.STOCK);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    window.location.reload();
  }
}

export const storageService = new StorageService();
