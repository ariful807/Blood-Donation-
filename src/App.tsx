/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { QuickEmergencyModal } from './components/QuickEmergencyModal';
import { HomePage } from './components/pages/HomePage';
import { BloodRequestPage } from './components/pages/BloodRequestPage';
import { DonorsDirectoryPage } from './components/pages/DonorsDirectoryPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { LoginPage } from './components/pages/LoginPage';
import { UserDashboardPage } from './components/pages/UserDashboardPage';
import { AdminDashboardPage } from './components/pages/AdminDashboardPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { GalleryPage } from './components/pages/GalleryPage';
import { ApplyPage } from './components/pages/ApplyPage';
import { NoticePage } from './components/pages/NoticePage';
import { BlogPage } from './components/pages/BlogPage';
import { storageService } from './services/storageService';
import { User, BloodRequest, BloodStockItem, GalleryItem, ApplicationSectionConfig, SiteConfig } from './types';
import { Droplet } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(storageService.getCurrentUser());
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // App dataset states
  const [requests, setRequests] = useState<BloodRequest[]>(() => storageService.getRequests() || []);
  const [stock, setStock] = useState<BloodStockItem[]>(() => storageService.getStock() || []);
  const [users, setUsers] = useState<User[]>(() => storageService.getUsers() || []);
  const [gallery, setGallery] = useState<GalleryItem[]>(() => storageService.getGallery() || []);
  const [appConfig, setAppConfig] = useState<ApplicationSectionConfig>(() => storageService.getAppConfig());
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => storageService.getSiteConfig());

  const reloadData = () => {
    setRequests(storageService.getRequests());
    setStock(storageService.getStock());
    setUsers(storageService.getUsers());
    setGallery(storageService.getGallery());
    setAppConfig(storageService.getAppConfig());
    setSiteConfig(storageService.getSiteConfig());
    setCurrentUser(storageService.getCurrentUser());
  };

  useEffect(() => {
    reloadData();
    // Scroll to top on page navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    storageService.logout();
    setCurrentUser(null);
    setCurrentPage('home');
    reloadData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 text-stone-900 font-serif selection:bg-red-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentUser={currentUser}
        siteConfig={siteConfig}
        onLogout={handleLogout}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            requests={requests}
            stock={stock}
            users={users}
            siteConfig={siteConfig}
            setCurrentPage={setCurrentPage}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          />
        )}

        {currentPage === 'requests' && (
          <BloodRequestPage
            requests={requests}
            onRefresh={reloadData}
          />
        )}

        {currentPage === 'donors' && (
          <DonorsDirectoryPage
            users={users}
            setCurrentPage={setCurrentPage}
          />
        )}

        {(currentPage === 'notice' || currentPage === 'notices') && (
          <NoticePage
            setCurrentPage={setCurrentPage}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          />
        )}

        {currentPage === 'blog' && (
          <BlogPage
            currentUser={currentUser}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'gallery' && (
          <GalleryPage
            galleryItems={gallery}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'apply' && (
          <ApplyPage
            setCurrentPage={setCurrentPage}
            config={appConfig}
            onRefresh={reloadData}
          />
        )}

        {currentPage === 'register' && (
          <RegisterPage
            setCurrentPage={setCurrentPage}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentPage === 'login' && (
          <LoginPage
            setCurrentPage={setCurrentPage}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentPage === 'dashboard' && (
          currentUser ? (
            <UserDashboardPage
              currentUser={currentUser}
              setCurrentPage={setCurrentPage}
              onLogout={handleLogout}
              onRefresh={reloadData}
              onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            />
          ) : (
            <LoginPage
              setCurrentPage={setCurrentPage}
              onLoginSuccess={handleLoginSuccess}
            />
          )
        )}

        {currentPage === 'admin' && (
          currentUser && currentUser.role === 'admin' ? (
            <AdminDashboardPage
              currentUser={currentUser}
              onLogout={handleLogout}
              onRefresh={reloadData}
              setCurrentPage={setCurrentPage}
              siteConfig={siteConfig}
              onUpdateSiteConfig={reloadData}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl text-center shadow-lg border border-red-200 space-y-4">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <Droplet className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-stone-900">অ্যাডমিন এক্সেস প্রয়োজন</h3>
              <p className="text-xs text-stone-500">
                এই পেজে প্রবেশের জন্য অ্যাডমিন একাউন্টে লগইন করুন (admin@blood.com / Admin@123)।
              </p>
              <button
                onClick={() => setCurrentPage('login')}
                className="px-6 py-2.5 bg-[#B71C1C] text-white rounded-xl text-xs font-bold"
              >
                লগইন পেজে যান
              </button>
            </div>
          )
        )}

        {currentPage === 'about' && (
          <AboutPage
            setCurrentPage={setCurrentPage}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Floating Emergency Action Button for Mobile */}
      <div className="fixed bottom-5 right-5 z-40 sm:hidden">
        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="w-14 h-14 rounded-full bg-[#B71C1C] text-white shadow-2xl flex items-center justify-center border-2 border-amber-400 animate-bounce"
          aria-label="জরুরি রক্তের আবেদন"
        >
          <Droplet className="w-7 h-7 fill-white" />
        </button>
      </div>

      {/* Quick Emergency Request Modal */}
      <QuickEmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onSuccess={reloadData}
      />

      {/* Footer */}
      <Footer
        setCurrentPage={setCurrentPage}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
      />
    </div>
  );
}
