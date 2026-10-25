/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { AboutUs } from './components/AboutUs.tsx';
import { CementProducts } from './components/CementProducts.tsx';
import { BlockFactory } from './components/BlockFactory.tsx';
import { FleetSection } from './components/FleetSection.tsx';
import { ProjectsSection } from './components/ProjectsSection.tsx';
import { PublicGallery } from './components/PublicGallery.tsx';
import { TradeCalculator } from './components/TradeCalculator.tsx';
import { ShipmentTracker } from './components/ShipmentTracker.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { InquiryModal } from './components/InquiryModal.tsx';

// Admin CMS Components
import { AdminLayout } from './admin/AdminLayout.tsx';
import { AdminLogin } from './admin/views/AdminLogin.tsx';
import { OverviewView } from './admin/views/OverviewView.tsx';
import { ProductsView } from './admin/views/ProductsView.tsx';
import { CategoriesView } from './admin/views/CategoriesView.tsx';
import { BlocksView } from './admin/views/BlocksView.tsx';
import { FleetView } from './admin/views/FleetView.tsx';
import { ProjectsView } from './admin/views/ProjectsView.tsx';
import { ServicesView } from './admin/views/ServicesView.tsx';
import { GalleryView } from './admin/views/GalleryView.tsx';
import { InquiriesView } from './admin/views/InquiriesView.tsx';
import { BusinessProfileView } from './admin/views/BusinessProfileView.tsx';
import { SettingsView } from './admin/views/SettingsView.tsx';

function MainApp() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [contactPrefill, setContactPrefill] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize browser history and pathname
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleRequestQuote = (productName?: string) => {
    setSelectedProduct(productName || '');
    setModalOpen(true);
  };

  const handleScrollToSection = (sectionId: string) => {
    if (currentPath !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleForwardCalculation = (summary: string) => {
    setContactPrefill(summary);
    showToast('Materials calculation transferred to Pallandri Order Desk.');
    handleScrollToSection('contact');
  };

  const handleBookTransport = (vehicleName: string) => {
    handleRequestQuote(`Transport Booking: ${vehicleName}`);
  };

  // Loading state
  if (isLoading && currentPath.startsWith('/admin')) {
    return (
      <div className="min-h-screen bg-[#070e20] text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-300">Verifying secure portal session...</p>
      </div>
    );
  }

  // Admin Routes Rendering
  if (currentPath.startsWith('/admin')) {
    if (!isAuthenticated) {
      return (
        <AdminLogin
          onSuccess={() => navigate('/admin')}
          onNavigateHome={() => navigate('/')}
        />
      );
    }

    // Authenticated Admin Dashboard Layout
    return (
      <AdminLayout currentPath={currentPath} onNavigate={navigate}>
        {currentPath === '/admin' && <OverviewView onNavigate={navigate} />}
        {currentPath === '/admin/products' && <ProductsView />}
        {currentPath === '/admin/categories' && <CategoriesView />}
        {currentPath === '/admin/blocks' && <BlocksView />}
        {currentPath === '/admin/fleet' && <FleetView />}
        {currentPath === '/admin/projects' && <ProjectsView />}
        {currentPath === '/admin/services' && <ServicesView />}
        {currentPath === '/admin/gallery' && <GalleryView />}
        {currentPath === '/admin/inquiries' && <InquiriesView />}
        {currentPath === '/admin/business-profile' && <BusinessProfileView />}
        {currentPath === '/admin/settings' && <SettingsView />}
      </AdminLayout>
    );
  }

  // Public Website Rendering
  return (
    <div className="min-h-screen bg-[#070e22] text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0d1e42] border-2 border-orange-500 text-white text-xs sm:text-sm py-3 px-5 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar 
        onNavigateSection={handleScrollToSection} 
        onRequestQuote={handleRequestQuote} 
        onNavigateToAdmin={() => navigate('/admin')}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* Large Hero Section */}
        <Hero 
          onExploreServices={() => handleScrollToSection('cement')} 
          onContactUs={() => handleScrollToSection('contact')}
          onOpenCalculator={() => handleScrollToSection('calculator')}
        />

        {/* About Us Section */}
        <AboutUs />

        {/* Cement Products & Materials */}
        <CementProducts 
          onRequestQuote={(product) => handleRequestQuote(product)} 
        />

        {/* Concrete Block Factory Plant */}
        <BlockFactory 
          onRequestQuote={(block) => handleRequestQuote(block)} 
        />

        {/* Our Transport Fleet */}
        <FleetSection 
          onBookTransport={handleBookTransport} 
        />

        {/* Landmark Projects */}
        <ProjectsSection />

        {/* Public Operations Gallery */}
        <PublicGallery />

        {/* Interactive Rate & Quantity Calculator */}
        <TradeCalculator 
          onForwardCalculation={handleForwardCalculation} 
        />

        {/* Live Truck Delivery Tracking */}
        <ShipmentTracker />

        {/* Contact Desk & Booking Form in Pallandri */}
        <ContactSection 
          prefilledCommodity={contactPrefill} 
        />
      </main>

      {/* Footer */}
      <Footer 
        onNavigateSection={handleScrollToSection} 
        onRequestQuote={() => handleRequestQuote()} 
        onNavigateToAdmin={() => navigate('/admin')}
      />

      {/* Quick RFQ / Quote Modal */}
      <InquiryModal 
        isOpen={modalOpen} 
        initialCommodity={selectedProduct} 
        onClose={() => setModalOpen(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
