import React, { useState } from 'react';
import { 
  User, 
  Donation, 
  BloodRequest, 
  BloodStockItem, 
  ActivityLog, 
  ContactMessage, 
  GasConfig, 
  BloodGroup,
  GalleryItem,
  ApplicationSubmission,
  ApplicationSectionConfig,
  SiteConfig
} from '../../types';
import { storageService } from '../../services/storageService';
import { GOOGLE_APPS_SCRIPT_CODE, GOOGLE_SHEETS_SETUP_STEPS } from '../../services/gasCodeGenerator';
import { BANGLADESH_DISTRICTS, NILPHAMARI_UPAZILAS } from '../../data/initialData';
import { formatDriveImageUrl } from '../../utils/imageUtils';
import { SiteCustomizerTab } from '../admin/SiteCustomizerTab';
import { SlidersManagerTab } from '../admin/SlidersManagerTab';
import { NoticesManagerTab } from '../admin/NoticesManagerTab';
import { ArticlesManagerTab } from '../admin/ArticlesManagerTab';
import { 
  Shield, 
  Users, 
  Droplet, 
  ClipboardList, 
  Activity, 
  Settings, 
  Search, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Edit, 
  Plus, 
  Minus, 
  RefreshCw, 
  Copy, 
  ExternalLink, 
  Lock, 
  Mail, 
  Phone, 
  Check, 
  AlertTriangle,
  Radio,
  Sparkles,
  BarChart3,
  LogOut,
  Send,
  Camera,
  FileText,
  MessageSquare,
  Globe,
  Code,
  Save,
  CheckCircle,
  Bell,
  BookOpen,
  Image
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminDashboardPageProps {
  currentUser: User;
  onLogout: () => void;
  onRefresh: () => void;
  setCurrentPage: (page: string) => void;
  siteConfig?: SiteConfig;
  onUpdateSiteConfig?: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  currentUser,
  onLogout,
  onRefresh,
  setCurrentPage,
  siteConfig,
  onUpdateSiteConfig
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'site_customizer' | 'sliders' | 'notices' | 'articles' | 'donors' | 'requests' | 'stock' | 'applications' | 'app_config' | 'gallery' | 'gas_sync' | 'messages' | 'logs'
  >('overview');

  // Local state for mutations
  const [usersList, setUsersList] = useState<User[]>(storageService.getUsers());
  const [requestsList, setRequestsList] = useState<BloodRequest[]>(storageService.getRequests());
  const [stockList, setStockList] = useState<BloodStockItem[]>(storageService.getStock());
  const [logsList, setLogsList] = useState<ActivityLog[]>(storageService.getLogs());
  const [messagesList, setMessagesList] = useState<ContactMessage[]>(storageService.getMessages());
  const [gasConfig, setGasConfig] = useState<GasConfig>(storageService.getGasConfig());
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(storageService.getGallery());
  const [applicationsList, setApplicationsList] = useState<ApplicationSubmission[]>(storageService.getApplications());
  const [appConfig, setAppConfig] = useState<ApplicationSectionConfig>(storageService.getAppConfig());

  // Search and filter states
  const [donorSearch, setDonorSearch] = useState('');
  const [donorGroupFilter, setDonorGroupFilter] = useState('all');
  const [reqSearch, setReqSearch] = useState('');
  const [reqStatusFilter, setReqStatusFilter] = useState('all');
  const [appTypeFilter, setAppTypeFilter] = useState('all');

  // Feedback states
  const [copiedCode, setCopiedCode] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [configSavedNotice, setConfigSavedNotice] = useState(false);

  // New User Modal
  const [addUserModal, setAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodGroup: 'O+' as BloodGroup,
    role: 'user' as 'user' | 'admin',
    district: NILPHAMARI_UPAZILAS[0],
    password: 'User@123',
    avatarUrl: ''
  });

  // New Gallery Item Form
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: '',
    category: 'camp' as GalleryItem['category'],
    imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
    date: new Date().toISOString().split('T')[0],
    upazila: NILPHAMARI_UPAZILAS[0],
    description: ''
  });
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);

  const refreshAll = () => {
    setUsersList(storageService.getUsers());
    setRequestsList(storageService.getRequests());
    setStockList(storageService.getStock());
    setLogsList(storageService.getLogs());
    setMessagesList(storageService.getMessages());
    setGasConfig(storageService.getGasConfig());
    setGalleryList(storageService.getGallery());
    setApplicationsList(storageService.getApplications());
    setAppConfig(storageService.getAppConfig());
    onRefresh();
  };

  // Handlers
  const handleToggleUserStatus = (userId: string) => {
    storageService.toggleUserStatus(userId);
    refreshAll();
  };

  const handleToggleUserRole = (userId: string) => {
    storageService.toggleUserRole(userId);
    refreshAll();
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই সদস্যকে মুছে ফেলতে চান?')) {
      storageService.deleteUser(userId);
      refreshAll();
    }
  };

  const handleUpdateRequestStatus = (reqId: string, status: BloodRequest['status']) => {
    storageService.updateRequestStatus(reqId, status);
    refreshAll();
  };

  const handleDeleteRequest = (reqId: string) => {
    if (window.confirm('এই রক্তের আবেদনটি মুছে ফেলতে চান?')) {
      storageService.deleteRequest(reqId);
      refreshAll();
    }
  };

  const handleStockChange = (bg: BloodGroup, delta: number) => {
    storageService.updateStockUnit(bg, delta);
    refreshAll();
  };

  const handleUpdateApplicationStatus = (appId: string, status: ApplicationSubmission['status']) => {
    storageService.updateApplicationStatus(appId, status);
    refreshAll();
  };

  const handleDeleteApplication = (appId: string) => {
    if (window.confirm('এই আবেদনটি মুছে ফেলতে চান?')) {
      storageService.deleteApplication(appId);
      refreshAll();
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveAppConfig(appConfig);
    setConfigSavedNotice(true);
    refreshAll();
    try {
      confetti({ particleCount: 40, spread: 50 });
    } catch {}
    setTimeout(() => setConfigSavedNotice(false), 3000);
  };

  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryItem.title.trim() || !newGalleryItem.imageUrl.trim()) return;

    storageService.createGalleryItem({
      title: newGalleryItem.title,
      category: newGalleryItem.category,
      imageUrl: newGalleryItem.imageUrl,
      date: newGalleryItem.date,
      upazila: newGalleryItem.upazila,
      description: newGalleryItem.description
    });

    setShowAddGalleryModal(false);
    setNewGalleryItem({
      title: '',
      category: 'camp',
      imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
      date: new Date().toISOString().split('T')[0],
      upazila: NILPHAMARI_UPAZILAS[0],
      description: ''
    });
    refreshAll();
  };

  const handleDeleteGallery = (id: string) => {
    if (window.confirm('এই ছবিটি গ্যালারি থেকে মুছে ফেলতে চান?')) {
      storageService.deleteGalleryItem(id);
      refreshAll();
    }
  };

  const handleSaveGasUrl = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveGasConfig(gasConfig);
    setSyncFeedback({ success: true, message: 'Google Apps Script কনফিগারেশন সংরক্ষিত হয়েছে।' });
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  const handleTestGasSync = async () => {
    if (!gasConfig.webAppUrl) {
      setSyncFeedback({ success: false, message: 'অনুগ্রহ করে প্রথমে Apps Script Web App URL প্রদান করুন।' });
      return;
    }
    setSyncLoading(true);
    setSyncFeedback(null);
    const res = await storageService.pushDataToGas(gasConfig.webAppUrl);
    setSyncLoading(false);
    setSyncFeedback(res);
    refreshAll();
    if (res.success) {
      try { confetti({ particleCount: 50, spread: 60 }); } catch {}
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([GOOGLE_APPS_SCRIPT_CODE], { type: 'text/javascript' });
    element.href = URL.createObjectURL(file);
    element.download = 'Code.gs';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportDonorsCsv = () => {
    const headers = ['ID,Name,Email,Phone,BloodGroup,Upazila,Address,LastDonation,Role,Status,Available'];
    const rows = usersList.map(u => 
      `"${u.id}","${u.name}","${u.email}","${u.phone}","${u.bloodGroup}","${u.district}","${u.address}","${u.lastDonation}","${u.role}","${u.status}","${u.isAvailableForDonation}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nilphamari_Blood_Donors_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email || !newUserData.phone) return;

    storageService.registerUser({
      name: newUserData.name,
      email: newUserData.email,
      phone: newUserData.phone,
      bloodGroup: newUserData.bloodGroup,
      dob: '1995-01-01',
      address: 'নীলফামারী',
      district: newUserData.district,
      lastDonation: '',
      passwordHash: newUserData.password,
      role: newUserData.role,
      isAvailableForDonation: true
    });

    setAddUserModal(false);
    refreshAll();
  };

  // Filtered lists
  const filteredDonors = usersList.filter(u => {
    const matchesGroup = donorGroupFilter === 'all' || u.bloodGroup === donorGroupFilter;
    const matchesSearch = donorSearch === '' || 
      u.name.toLowerCase().includes(donorSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(donorSearch.toLowerCase()) ||
      u.phone.includes(donorSearch) ||
      u.district.toLowerCase().includes(donorSearch.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const filteredRequests = requestsList.filter(r => {
    const matchesStatus = reqStatusFilter === 'all' || r.status === reqStatusFilter;
    const matchesSearch = reqSearch === '' ||
      r.requesterName.toLowerCase().includes(reqSearch.toLowerCase()) ||
      r.hospital.toLowerCase().includes(reqSearch.toLowerCase()) ||
      r.bloodGroup.toLowerCase().includes(reqSearch.toLowerCase()) ||
      r.district.toLowerCase().includes(reqSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredApplications = applicationsList.filter(a => {
    if (appTypeFilter === 'all') return true;
    return a.type === appTypeFilter;
  });

  const pendingRequestsCount = requestsList.filter(r => r.status === 'pending').length;
  const pendingAppsCount = applicationsList.filter(a => a.status === 'pending').length;
  const totalStockUnits = stockList.reduce((sum, item) => sum + item.unitCount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-[#8B0000] to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-md">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-950 text-amber-300 text-xs font-bold uppercase tracking-wider">
                অ্যাডমিন পোর্টাল
              </span>
              <span className="text-xs text-stone-300">নীলফামারী জেলা শাখা</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              সেন্ট্রাল অ্যাডমিনিস্ট্রেটর ড্যাশবোর্ড
            </h1>
            <p className="text-xs sm:text-sm text-stone-300">
              স্বাগতম, <span className="text-amber-300 font-bold">{currentUser.name}</span> ({currentUser.email})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-stretch md:self-auto justify-end">
          <button
            onClick={() => setCurrentPage('home')}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs transition-all flex items-center space-x-1.5 shadow-md"
          >
            <Globe className="w-4 h-4 text-stone-950" />
            <span>ওয়েবসাইট এ যান</span>
          </button>
          <button
            onClick={refreshAll}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>রিফ্রেশ</span>
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2.5 bg-red-800 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200 shadow-xs flex items-center gap-1.5 overflow-x-auto text-xs font-bold scrollbar-thin">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'overview'
              ? 'bg-[#B71C1C] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>সারসংক্ষেপ</span>
        </button>

        <button
          onClick={() => setActiveTab('site_customizer')}
          className={`px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'site_customizer'
              ? 'bg-[#B71C1C] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Settings className="w-4 h-4 text-amber-500" />
          <span>সাইট ও সেকশন নাম এডিটর</span>
        </button>

        <button
          onClick={() => setActiveTab('sliders')}
          className={`px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'sliders'
              ? 'bg-[#B71C1C] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Image className="w-4 h-4 text-sky-500" />
          <span>হোম স্লাইডার</span>
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'notices'
              ? 'bg-[#B71C1C] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Bell className="w-4 h-4 text-red-500" />
          <span>নোটিস বোর্ড</span>
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'articles'
              ? 'bg-[#B71C1C] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <span>ব্লগ ও ভিডিও</span>
        </button>

        <button
          onClick={() => setActiveTab('donors')}
          className={`px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'donors'
              ? 'bg-[#B71C1C] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>ডোনার ও ইউজার ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'requests'
              ? 'bg-[#B71C1C] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Droplet className="w-4 h-4" />
          <span>রক্তের রিকোয়েস্ট ({requestsList.length})</span>
          {pendingRequestsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('stock')}
          className={`px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'stock'
              ? 'bg-[#B71C1C] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>ব্লাড স্টক ({totalStockUnits})</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'applications'
              ? 'bg-[#B71C1C] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>আবেদনসমূহ ({applicationsList.length})</span>
          {pendingAppsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('app_config')}
          className={`px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'app_config'
              ? 'bg-[#B71C1C] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Edit className="w-4 h-4" />
          <span>আবেদন পেজ এডিটর</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'gallery'
              ? 'bg-[#B71C1C] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>গ্যালারি ({galleryList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('gas_sync')}
          className={`px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'gas_sync'
              ? 'bg-[#B71C1C] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Google Apps Script</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'messages'
              ? 'bg-[#B71C1C] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>বার্তা ({messagesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'logs'
              ? 'bg-[#B71C1C] text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>লগ</span>
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 text-xs font-bold mb-2">
                <span>মোট রক্তদাতা (Donors)</span>
                <Users className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-stone-900">{usersList.length}</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                {usersList.filter(u => u.isAvailableForDonation).length} জন রক্তদানে প্রস্তুত
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 text-xs font-bold mb-2">
                <span>রক্তের আবেদন (Requests)</span>
                <Droplet className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-stone-900">{requestsList.length}</p>
              <p className="text-[11px] text-red-600 font-semibold mt-1">
                {requestsList.filter(r => r.urgency === 'high').length} টি অতি জরুরি রিকোয়েস্ট
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 text-xs font-bold mb-2">
                <span>ব্লাড স্টক (Stock Units)</span>
                <Activity className="w-4 h-4 text-sky-600" />
              </div>
              <p className="text-3xl font-bold text-stone-900">{totalStockUnits}</p>
              <p className="text-[11px] text-stone-500 mt-1">৮টি ব্লাড গ্রুপে সংরক্ষিত</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 text-xs font-bold mb-2">
                <span>নতুন আবেদন (Applications)</span>
                <ClipboardList className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-stone-900">{applicationsList.length}</p>
              <p className="text-[11px] text-purple-600 font-semibold mt-1">
                {pendingAppsCount} টি অপেক্ষমান আবেদন
              </p>
            </div>
          </div>

          {/* Quick Actions & Recent Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Urgent Requests Alert */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-bold text-base text-stone-900 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                  <span>জরুরি রক্তের আবেদনসমূহ</span>
                </h3>
                <button
                  onClick={() => setActiveTab('requests')}
                  className="text-xs text-red-600 hover:underline font-bold"
                >
                  সবগুলো দেখুন ({requestsList.length})
                </button>
              </div>

              <div className="space-y-3">
                {requestsList.slice(0, 4).map((req) => (
                  <div key={req.id} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#B71C1C] text-white flex items-center justify-center font-bold text-sm">
                        {req.bloodGroup}
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-xs sm:text-sm">{req.requesterName}</h4>
                        <p className="text-[11px] text-stone-500">{req.hospital} • {req.district}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {req.status === 'approved' ? 'অনুমোদিত' : req.status === 'pending' ? 'অপেক্ষমান' : 'সম্পন্ন'}
                      </span>
                      <a
                        href={`tel:${req.contact}`}
                        className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                        title="কল দিন"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Management Shortcuts */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
                দ্রুত অ্যাডমিন অ্যাকশন
              </h3>
              <div className="space-y-2.5">
                <button
                  onClick={() => setAddUserModal(true)}
                  className="w-full p-3 bg-stone-50 hover:bg-red-50 hover:border-red-200 border border-stone-200 rounded-xl text-left font-bold text-xs text-stone-800 flex items-center justify-between transition-all"
                >
                  <span className="flex items-center space-x-2">
                    <Plus className="w-4 h-4 text-red-600" />
                    <span>নতুন ডোনার / অ্যাডমিন যোগ করুন</span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('app_config')}
                  className="w-full p-3 bg-stone-50 hover:bg-amber-50 hover:border-amber-200 border border-stone-200 rounded-xl text-left font-bold text-xs text-stone-800 flex items-center justify-between transition-all"
                >
                  <span className="flex items-center space-x-2">
                    <Edit className="w-4 h-4 text-amber-600" />
                    <span>আবেদন পেজ ও নোটিশ এডিট করুন</span>
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('gallery');
                    setShowAddGalleryModal(true);
                  }}
                  className="w-full p-3 bg-stone-50 hover:bg-sky-50 hover:border-sky-200 border border-stone-200 rounded-xl text-left font-bold text-xs text-stone-800 flex items-center justify-between transition-all"
                >
                  <span className="flex items-center space-x-2">
                    <Camera className="w-4 h-4 text-sky-600" />
                    <span>গ্যালারিতে নতুন ছবি যোগ করুন</span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('gas_sync')}
                  className="w-full p-3 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-200 border border-stone-200 rounded-xl text-left font-bold text-xs text-stone-800 flex items-center justify-between transition-all"
                >
                  <span className="flex items-center space-x-2">
                    <Code className="w-4 h-4 text-emerald-600" />
                    <span>Google Apps Script কোড দেখুন</span>
                  </span>
                </button>

                <button
                  onClick={handleExportDonorsCsv}
                  className="w-full p-3 bg-stone-900 text-white hover:bg-stone-800 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all mt-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ডোনার তালিকা CSV ডাউনলোড</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DONORS MANAGEMENT TAB */}
      {activeTab === 'donors' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                ডোনার ও ইউজার ব্যবস্থাপনা
              </h2>
              <p className="text-xs text-stone-500">
                নীলফামারী জেলার সকল নিবন্ধিত রক্তদাতাদের তালিকা ও অ্যাকাউন্ট নিয়ন্ত্রণ।
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportDonorsCsv}
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV এক্সপোর্ট</span>
              </button>
              <button
                onClick={() => setAddUserModal(true)}
                className="px-4 py-2 bg-[#B71C1C] hover:bg-[#8E0000] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন ইউজার যোগ</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="নাম, ফোন, ইমেইল বা উপজেলা দিয়ে খুঁজুন..."
                value={donorSearch}
                onChange={(e) => setDonorSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              />
            </div>
            <select
              value={donorGroupFilter}
              onChange={(e) => setDonorGroupFilter(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800"
            >
              <option value="all">সকল ব্লাড গ্রুপ</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3.5">ডোনারের নাম ও তথ্য</th>
                  <th className="p-3.5">ব্লাড গ্রুপ</th>
                  <th className="p-3.5">উপজেলা ও ঠিকানা</th>
                  <th className="p-3.5">রোল</th>
                  <th className="p-3.5">স্ট্যাটাস</th>
                  <th className="p-3.5 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredDonors.map((donor) => (
                  <tr key={donor.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-stone-900">{donor.name}</div>
                      <div className="text-stone-500 text-[11px] font-mono">{donor.phone} • {donor.email}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 bg-red-100 text-[#B71C1C] rounded-lg font-black text-xs">
                        {donor.bloodGroup}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="text-stone-800 font-medium">{donor.district}</div>
                      <div className="text-[11px] text-stone-400">{donor.address}</div>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleUserRole(donor.id)}
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          donor.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-stone-100 text-stone-700'
                        }`}
                        title="রোল পরিবর্তন করতে ক্লিক করুন"
                      >
                        {donor.role === 'admin' ? '🛡️ অ্যাডমিন' : '👤 ইউজার'}
                      </button>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleUserStatus(donor.id)}
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          donor.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                        title="স্ট্যাটাস সক্রিয়/নিষ্ক্রিয় করতে ক্লিক করুন"
                      >
                        {donor.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <a
                        href={`tel:${donor.phone}`}
                        className="inline-block p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg"
                        title="কল দিন"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleDeleteUser(donor.id)}
                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. REQUESTS MANAGEMENT TAB */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                রক্তের রিকোয়েস্ট ব্যবস্থাপনা
              </h2>
              <p className="text-xs text-stone-500">
                রোগীদের জরুরি রক্তের আবেদন অনুমোদন, সম্পন্ন অথবা প্রত্যাখ্যান করুন।
              </p>
            </div>
            <select
              value={reqStatusFilter}
              onChange={(e) => setReqStatusFilter(e.target.value)}
              className="px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800"
            >
              <option value="all">সকল স্ট্যাটাস</option>
              <option value="pending">অপেক্ষমান (Pending)</option>
              <option value="approved">অনুমোদিত (Approved)</option>
              <option value="completed">সম্পন্ন (Completed)</option>
              <option value="rejected">বাতিল (Rejected)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRequests.map((req) => (
              <div key={req.id} className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-11 h-11 rounded-xl bg-[#B71C1C] text-white flex items-center justify-center font-bold text-base">
                        {req.bloodGroup}
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">{req.requesterName}</h4>
                        <span className="text-[11px] text-stone-500">{req.unitsNeeded} ব্যাগ প্রয়োজন</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      req.status === 'completed' ? 'bg-sky-100 text-sky-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {req.status === 'approved' ? 'অনুমোদিত' :
                       req.status === 'pending' ? 'অপেক্ষমান' :
                       req.status === 'completed' ? 'সম্পন্ন' : 'বাতিল'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-stone-600 bg-white p-3 rounded-xl border border-stone-200">
                    <p><strong className="text-stone-800">হাসপাতাল:</strong> {req.hospital}</p>
                    <p><strong className="text-stone-800">উপজেলা:</strong> {req.district}</p>
                    <p><strong className="text-stone-800">তারিখ:</strong> {req.donationDateNeeded || 'জরুরি'}</p>
                    {req.patientProblem && (
                      <p className="text-[11px] italic text-stone-500 pt-1">"{req.patientProblem}"</p>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleUpdateRequestStatus(req.id, 'approved')}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-colors"
                    >
                      অনুমোদন
                    </button>
                    <button
                      onClick={() => handleUpdateRequestStatus(req.id, 'completed')}
                      className="flex-1 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-xs transition-colors"
                    >
                      সম্পন্ন
                    </button>
                    <button
                      onClick={() => handleDeleteRequest(req.id)}
                      className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                      title="মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${req.contact}`}
                      className="py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-semibold text-xs flex items-center justify-center space-x-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>কল</span>
                    </a>
                    <a
                      href={`https://wa.me/${req.contact.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-xs flex items-center justify-center space-x-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>হোয়াটসঅ্যাপ</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. STOCK MANAGEMENT TAB */}
      {activeTab === 'stock' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-xl font-bold text-stone-900">
              ব্লাড স্টক ও ইনভেন্টরি নিয়ন্ত্রণ
            </h2>
            <p className="text-xs text-stone-500">
              নীলফামারী সেন্ট্রাল ব্লাড ব্যাংকের ৮টি রক্তের গ্রুপের সংরক্ষিত ব্যাগের সংখ্যা হালনাগাদ করুন।
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stockList.map((item) => (
              <div key={item.bloodGroup} className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-center space-y-3">
                <span className="text-xl font-black text-stone-900 block">{item.bloodGroup}</span>
                <div className="text-3xl font-black text-[#B71C1C]">{item.unitCount}</div>
                <span className="text-[11px] text-stone-500 block">ব্যাগ অবশিষ্ট</span>
                
                <div className="flex items-center justify-center space-x-2 pt-2">
                  <button
                    onClick={() => handleStockChange(item.bloodGroup, -1)}
                    className="w-9 h-9 rounded-xl bg-white border border-stone-300 text-stone-800 hover:bg-stone-100 flex items-center justify-center font-bold text-base shadow-xs"
                    title="১ ব্যাগ কমান"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleStockChange(item.bloodGroup, 1)}
                    className="w-9 h-9 rounded-xl bg-[#B71C1C] hover:bg-[#8E0000] text-white flex items-center justify-center font-bold text-base shadow-xs"
                    title="১ ব্যাগ বাড়ান"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. APPLICATIONS MANAGEMENT TAB */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                স্বেচ্ছাসেবী ও ক্যাম্প আবেদনসমূহ
              </h2>
              <p className="text-xs text-stone-500">
                ওয়েবসাইট থেকে প্রাপ্ত রক্তদান ক্যাম্প, ভলান্টিয়ার ও চিকিৎসা সহায়তার আবেদনসমূহ পর্যালোচনা করুন।
              </p>
            </div>
            <select
              value={appTypeFilter}
              onChange={(e) => setAppTypeFilter(e.target.value)}
              className="px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800"
            >
              <option value="all">সকল ক্যাটাগরি</option>
              <option value="volunteer">স্বেচ্ছাসেবী আবেদন (Volunteer)</option>
              <option value="camp_organize">ক্যাম্প আয়োজন (Camp Organize)</option>
              <option value="medical_aid">জরুরি সহায়তা (Medical Aid)</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredApplications.length === 0 ? (
              <div className="p-10 text-center text-stone-500 text-xs">
                কোনো আবেদন পাওয়া যায়নি।
              </div>
            ) : (
              filteredApplications.map((app) => (
                <div key={app.id} className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800 text-[10px] font-bold uppercase">
                        {app.type === 'volunteer' ? '🤝 ভলান্টিয়ার' :
                         app.type === 'camp_organize' ? '⛺ রক্তদান ক্যাম্প' : '🏥 মেডিকেল এইড'}
                      </span>
                      <span className="text-xs text-stone-400">• তারিখ: {app.createdAt}</span>
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {app.applicantName} {app.organizationName && `(${app.organizationName})`}
                    </h4>
                    <p className="text-xs text-stone-600">
                      📍 {app.upazila}, {app.villageOrArea || 'নীলফামারী'} | 🩸 {app.bloodGroup || 'N/A'} | 📞 {app.phone}
                    </p>
                    {app.message && (
                      <p className="text-xs text-stone-500 bg-white p-2.5 rounded-xl border border-stone-200 italic">
                        "{app.message}"
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`tel:${app.phone}`}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>কল</span>
                    </a>
                    <button
                      onClick={() => handleUpdateApplicationStatus(app.id, 'approved')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold ${
                        app.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-white border border-stone-300 text-stone-700 hover:bg-emerald-50'
                      }`}
                    >
                      অনুমোদন
                    </button>
                    <button
                      onClick={() => handleUpdateApplicationStatus(app.id, 'rejected')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold ${
                        app.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-white border border-stone-300 text-stone-700 hover:bg-red-50'
                      }`}
                    >
                      বাতিল
                    </button>
                    <button
                      onClick={() => handleDeleteApplication(app.id)}
                      className="p-2 bg-stone-200 hover:bg-red-100 hover:text-red-700 rounded-xl text-stone-600 transition-colors"
                      title="মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 6. APPLICATION & NOTICE CONFIG EDITOR TAB */}
      {activeTab === 'app_config' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                আবেদন পেজ ও নোটিশ কনফিগারেশন এডিটর
              </h2>
              <p className="text-xs text-stone-500">
                এখানে করা পরিবর্তনসমূহ সরাসরি ওয়েবসাইটের আবেদন পেজ ও নোটিশ বোর্ডে কার্যকর হবে।
              </p>
            </div>
            {configSavedNotice && (
              <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>সফলভাবে সংরক্ষিত হয়েছে!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-6">
            {/* Top Announcement Banner Config */}
            <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-stone-900 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>জরুরি নোটিশ / ঘোষণা ব্যানার (Announcement Banner)</span>
                </h3>
                <label className="flex items-center space-x-2 text-xs font-bold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={appConfig.noticeBannerActive}
                    onChange={(e) => setAppConfig({ ...appConfig, noticeBannerActive: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded-sm"
                  />
                  <span>ব্যানার সক্রিয় রাখুন</span>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">ব্যানার শিরোনাম:</label>
                  <input
                    type="text"
                    value={appConfig.noticeBannerTitle}
                    onChange={(e) => setAppConfig({ ...appConfig, noticeBannerTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">ব্যানার বিবরণ / নোটিশ টেক্সট:</label>
                  <textarea
                    rows={2}
                    value={appConfig.noticeBannerText}
                    onChange={(e) => setAppConfig({ ...appConfig, noticeBannerText: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Volunteer Section Texts */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-4">
              <h3 className="font-bold text-sm text-stone-900">১. ভলান্টিয়ার আবেদন সেকশন</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">সেকশন টাইটেল:</label>
                  <input
                    type="text"
                    value={appConfig.volunteerSectionTitle}
                    onChange={(e) => setAppConfig({ ...appConfig, volunteerSectionTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">সেকশন বিবরণ:</label>
                  <input
                    type="text"
                    value={appConfig.volunteerSectionDesc}
                    onChange={(e) => setAppConfig({ ...appConfig, volunteerSectionDesc: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Camp Section Texts */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-4">
              <h3 className="font-bold text-sm text-stone-900">২. রক্তদান ক্যাম্প আয়োজন সেকশন</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">সেকশন টাইটেল:</label>
                  <input
                    type="text"
                    value={appConfig.campSectionTitle}
                    onChange={(e) => setAppConfig({ ...appConfig, campSectionTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">সেকশন বিবরণ:</label>
                  <input
                    type="text"
                    value={appConfig.campSectionDesc}
                    onChange={(e) => setAppConfig({ ...appConfig, campSectionDesc: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Guidelines List */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
              <h3 className="font-bold text-sm text-stone-900">৩. শর্তাবলী ও নিয়মাবলী (Guidelines)</h3>
              {(appConfig.guidelines || []).map((guide, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-stone-500 w-6">#{idx + 1}</span>
                  <input
                    type="text"
                    value={guide}
                    onChange={(e) => {
                      const updated = [...(appConfig.guidelines || [])];
                      updated[idx] = e.target.value;
                      setAppConfig({ ...appConfig, guidelines: updated });
                    }}
                    className="flex-1 px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (appConfig.guidelines || []).filter((_, i) => i !== idx);
                      setAppConfig({ ...appConfig, guidelines: updated });
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setAppConfig({ ...appConfig, guidelines: [...(appConfig.guidelines || []), 'নতুন নির্দেশিকা বা নিয়ম যোগ করুন...'] })}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs rounded-xl flex items-center space-x-1.5 mt-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন নিয়ম যোগ করুন</span>
              </button>
            </div>

            {/* Disclaimer */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">অস্বীকৃতি ও সতর্কতা বার্তা (Disclaimer):</label>
              <textarea
                rows={2}
                value={appConfig.emergencyDisclaimer}
                onChange={(e) => setAppConfig({ ...appConfig, emergencyDisclaimer: e.target.value })}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-8 py-3 bg-[#B71C1C] hover:bg-[#8E0000] text-white font-bold text-sm rounded-xl shadow-md flex items-center space-x-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>সকল কনফিগারেশন সংরক্ষণ করুন</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 7. GALLERY MANAGEMENT TAB */}
      {activeTab === 'gallery' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                গ্যালারি ও ইভেন্ট ফটো ম্যানেজমেন্ট
              </h2>
              <p className="text-xs text-stone-500">
                নীলফামারী জেলার রক্তদান ক্যাম্প, র‍্যালি ও সম্মাননা অনুষ্ঠানের ছবি যুক্ত বা ডিলিট করুন।
              </p>
            </div>
            <button
              onClick={() => setShowAddGalleryModal(true)}
              className="px-4 py-2.5 bg-[#B71C1C] hover:bg-[#8E0000] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ছবি যোগ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {galleryList.map((item) => (
              <div key={item.id} className="bg-stone-50 rounded-2xl overflow-hidden border border-stone-200 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video bg-stone-200">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-stone-950/80 text-amber-300 font-bold text-[10px]">
                      {item.upazila}
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <span className="text-[10px] text-stone-400 font-mono">{item.date}</span>
                    <h4 className="font-bold text-stone-900 text-sm leading-snug">{item.title}</h4>
                    <p className="text-xs text-stone-600 line-clamp-2">{item.description}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-end">
                  <button
                    onClick={() => handleDeleteGallery(item.id)}
                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs rounded-lg flex items-center space-x-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>মুছে ফেলুন</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. GOOGLE APPS SCRIPT CODE.GS TAB */}
      {activeTab === 'gas_sync' && (
        <div className="space-y-6">
          {/* Top Info Banner */}
          <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
                  <Code className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Google Apps Script (Code.gs) ব্যাকএন্ড কোড</h3>
                  <p className="text-xs text-stone-300">
                    আপনার গুগল স্প্রেডশিটে এই স্ক্রিপ্টটি যুক্ত করে ওয়েব অ্যাপ হিসেবে ডিপ্লয় করুন।
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCode ? 'কপিকৃত!' : 'কোড কপি করুন'}</span>
                </button>
                <button
                  onClick={handleDownloadCode}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Code.gs ফাইল</span>
                </button>
              </div>
            </div>
          </div>

          {/* Web App URL Config & Sync */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-stone-900">
              Apps Script Web App URL কনফিগারেশন
            </h4>
            <form onSubmit={handleSaveGasUrl} className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={gasConfig.webAppUrl}
                onChange={(e) => setGasConfig({ ...gasConfig, webAppUrl: e.target.value })}
                className="w-full flex-1 px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-mono text-stone-900 focus:outline-hidden"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 text-white rounded-xl font-bold text-xs hover:bg-stone-800"
              >
                সংরক্ষণ
              </button>
              <button
                type="button"
                onClick={handleTestGasSync}
                disabled={syncLoading}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#B71C1C] hover:bg-[#8E0000] text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncLoading ? 'animate-spin' : ''}`} />
                <span>{syncLoading ? 'সিঙ্ক হচ্ছে...' : 'এখনই সিঙ্ক করুন'}</span>
              </button>
            </form>

            {syncFeedback && (
              <div className={`p-3 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
                syncFeedback.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {syncFeedback.success ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
                <span>{syncFeedback.message}</span>
              </div>
            )}
          </div>

          {/* Setup Guide Accordion/Steps */}
          <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200 space-y-4">
            <h4 className="font-bold text-sm text-stone-900">গুগল স্প্রেডশিট ও স্ক্রিপ্ট সংযোগের সহজ ধাপসমূহ:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {GOOGLE_SHEETS_SETUP_STEPS.map((st) => (
                <div key={st.step} className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
                  <span className="w-7 h-7 rounded-full bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center">
                    {st.step}
                  </span>
                  <h5 className="font-bold text-xs text-stone-900">{st.title}</h5>
                  <p className="text-[11px] text-stone-500 leading-relaxed">{st.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Code Viewer Box */}
          <div className="bg-stone-950 text-stone-200 rounded-3xl p-6 border border-stone-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <span className="text-xs font-mono text-amber-400">Code.gs (Google Apps Script)</span>
              <button
                onClick={handleCopyCode}
                className="text-xs text-stone-400 hover:text-white flex items-center space-x-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>কপি</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono leading-relaxed overflow-x-auto max-h-96 p-2 text-stone-300">
              <code>{GOOGLE_APPS_SCRIPT_CODE}</code>
            </pre>
          </div>
        </div>
      )}

      {/* 9. MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-xl font-bold text-stone-900">
              ওয়েবসাইট থেকে প্রাপ্ত যোগাযোগ বার্তা
            </h2>
            <p className="text-xs text-stone-500">
              নাগরিক ও স্বেচ্ছাসেবীদের পাঠানো অনুসন্ধান এবং ফিডব্যাক বার্তা।
            </p>
          </div>

          <div className="space-y-4">
            {messagesList.length === 0 ? (
              <div className="p-8 text-center text-stone-500 text-xs">
                কোনো নতুন বার্তা নেই।
              </div>
            ) : (
              messagesList.map((msg) => (
                <div key={msg.id} className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{msg.name}</h4>
                      <span className="text-xs text-stone-500 font-mono">{msg.phone} • {msg.email}</span>
                    </div>
                    <span className="text-xs text-stone-400">{msg.createdAt}</span>
                  </div>
                  <p className="text-xs text-stone-700 bg-white p-3 rounded-xl border border-stone-200">
                    <strong className="text-stone-900">বিষয়: {msg.subject}</strong><br />
                    {msg.message}
                  </p>
                  <div className="flex items-center space-x-2 pt-1">
                    <a
                      href={`tel:${msg.phone}`}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>কল দিন</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 10. LOGS TAB */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-xl font-bold text-stone-900">
              অ্যাক্টিভিটি ও সিকিউরিটি লগ
            </h2>
            <p className="text-xs text-stone-500">
              সিস্টেমের সকল ইভেন্ট, লগইন এবং পরিবর্তনের টাইমস্ট্যাম্প হিস্ট্রি।
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3">সময়</th>
                  <th className="p-3">অ্যাকশন</th>
                  <th className="p-3">বিস্তারিত</th>
                  <th className="p-3">ইউজার আইডি</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                {logsList.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50">
                    <td className="p-3 text-stone-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-3 font-bold text-stone-800">{log.action}</td>
                    <td className="p-3 text-stone-600">{log.details}</td>
                    <td className="p-3 text-stone-400 text-[11px]">{log.userId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD USER / ADMIN */}
      {addUserModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">
              নতুন ডোনার / অ্যাডমিন যোগ করুন
            </h3>
            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">পূর্ণ নাম *</label>
                <input
                  type="text"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">ইমেইল *</label>
                  <input
                    type="email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    value={newUserData.phone}
                    onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">ব্লাড গ্রুপ</label>
                  <select
                    value={newUserData.bloodGroup}
                    onChange={(e) => setNewUserData({ ...newUserData, bloodGroup: e.target.value as BloodGroup })}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">উপজেলা</label>
                  <select
                    value={newUserData.district}
                    onChange={(e) => setNewUserData({ ...newUserData, district: e.target.value })}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  >
                    {NILPHAMARI_UPAZILAS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">রোল</label>
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as 'user' | 'admin' })}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
                  >
                    <option value="user">ইউজার</option>
                    <option value="admin">অ্যাডমিন</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">পাসওয়ার্ড</label>
                <input
                  type="text"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setAddUserModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#B71C1C] hover:bg-[#8E0000] text-white rounded-xl text-xs font-bold"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD GALLERY ITEM */}
      {showAddGalleryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">
              গ্যালারিতে নতুন ছবি ও ইভেন্ট যোগ করুন
            </h3>
            <form onSubmit={handleAddGallery} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">ইভেন্ট বা ছবির শিরোনাম *</label>
                <input
                  type="text"
                  placeholder="যেমন: নীলফামারী সরকারি কলেজে স্বেচ্ছায় রক্তদান ক্যাম্প"
                  value={newGalleryItem.title}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">ক্যাটাগরি</label>
                  <select
                    value={newGalleryItem.category}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="camp">রক্তদান ক্যাম্প</option>
                    <option value="awareness">সচেতনতামূলক কর্মসূচি</option>
                    <option value="emergency">জরুরি সহায়তা</option>
                    <option value="award">সম্মাননা ও স্বীকৃতি</option>
                    <option value="community">স্বেচ্ছাসেবী সমাবেশ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">উপজেলা</label>
                  <select
                    value={newGalleryItem.upazila}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, upazila: e.target.value })}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  >
                    {NILPHAMARI_UPAZILAS.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">ছবির URL (Direct Image Link) *</label>
                <input
                  type="url"
                  value={newGalleryItem.imageUrl}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">তারিখ</label>
                <input
                  type="date"
                  value={newGalleryItem.date}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, date: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">সংক্ষিপ্ত বিবরণ</label>
                <textarea
                  rows={2}
                  value={newGalleryItem.description}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#B71C1C] hover:bg-[#8E0000] text-white rounded-xl text-xs font-bold"
                >
                  ছবি যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
