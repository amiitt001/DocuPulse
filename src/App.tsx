import React, { useState } from 'react';
import { ScreenType, DocItem } from './types';
import { SyncProvider, useSync } from './context/SyncContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Toast } from './components/common/Toast';
import { SyncCacheModal } from './components/common/SyncCacheModal';
import { HomeScreen } from './components/home/HomeScreen';
import { DocumentViewerScreen } from './components/viewer/DocumentViewerScreen';
import { PerspectiveCropScreen } from './components/crop/PerspectiveCropScreen';
import { EditPdfScreen } from './components/edit/EditPdfScreen';
import { QrGeneratorScreen } from './components/qr/QrGeneratorScreen';
import { CameraScannerScreen } from './components/scanner/CameraScannerScreen';
import { FilesScreen } from './components/files/FilesScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';

function AppContent() {
  const { isCacheModalOpen, closeCacheModal } = useSync();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [screenHistory, setScreenHistory] = useState<ScreenType[]>(['home']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const navigateTo = (screen: ScreenType) => {
    setScreenHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (screenHistory.length > 1) {
      const nextHistory = [...screenHistory];
      nextHistory.pop();
      const prevScreen = nextHistory[nextHistory.length - 1] || 'home';
      setScreenHistory(nextHistory);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('home');
      setScreenHistory(['home']);
    }
  };

  const handleOpenFile = (file: DocItem) => {
    if (file.type === 'qr') {
      navigateTo('qr');
    } else {
      navigateTo('viewer');
    }
  };

  // Screens that have their own specialized full-screen bottom bars or immersion
  const hideBottomNav =
    currentScreen === 'scanner' ||
    currentScreen === 'crop' ||
    currentScreen === 'viewer' ||
    currentScreen === 'edit-pdf' ||
    currentScreen === 'qr';

  const getHeaderMeta = () => {
    switch (currentScreen) {
      case 'viewer':
        return {
          title: 'Document Viewer',
          subtitle: 'Quarterly_Financial_Summary.pdf',
          badgeText: 'Local',
        };
      case 'scanner':
        return {
          title: 'Document Viewer',
          subtitle: 'Neural Edge Scanner',
          badgeText: '300 DPI',
        };
      case 'crop':
        return {
          title: 'Document Viewer',
          subtitle: 'Page 1 of 3',
          badgeText: '300 DPI',
        };
      case 'edit-pdf':
        return {
          title: 'Edit PDF',
          subtitle: 'Annual_Report_2024.pdf',
          badgeText: '6 Pgs',
        };
      case 'qr':
      case 'qr-generator':
        return {
          title: 'QR Generator',
          subtitle: 'Zero-Cloud Engine',
          badgeText: 'Local',
        };
      case 'files':
        return {
          title: 'Files',
          subtitle: '18 Items',
          badgeText: 'Local',
        };
      case 'settings':
        return {
          title: 'Settings',
          subtitle: 'Security & Engine',
          badgeText: 'v4.12',
        };
      default:
        return {
          title: 'DocuPulse',
          badgeText: 'On-Device',
        };
    }
  };

  const headerMeta = getHeaderMeta();

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans selection:bg-zinc-800 selection:text-white antialiased">
      {/* Universal Floating Header */}
      <Header
        currentScreen={currentScreen}
        title={headerMeta.title}
        subtitle={headerMeta.subtitle}
        badgeText={headerMeta.badgeText}
        onBack={currentScreen !== 'home' ? handleBack : undefined}
        onOpenSettings={() => navigateTo('settings')}
      />

      {/* Primary Screen Body Container */}
      <main className="flex-1 flex flex-col w-full">
        {currentScreen === 'home' && (
          <HomeScreen
            onNavigate={navigateTo}
            onOpenFile={handleOpenFile}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'scanner' && (
          <CameraScannerScreen
            onBack={handleBack}
            onReview={() => navigateTo('crop')}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'viewer' && (
          <DocumentViewerScreen
            onBack={handleBack}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'crop' && (
          <PerspectiveCropScreen
            onBack={handleBack}
            onApply={() => navigateTo('edit-pdf')}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'edit-pdf' && (
          <EditPdfScreen
            onBack={handleBack}
            onSave={() => {
              showToast('PDF compiled & saved to local documents');
              navigateTo('files');
            }}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'qr' && (
          <QrGeneratorScreen
            onBack={handleBack}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'files' && (
          <FilesScreen
            onOpenFile={handleOpenFile}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            onBack={handleBack}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Floating Global Bottom Navigation Bar */}
      {!hideBottomNav && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={(screen) => {
            if (screen === 'scan') {
              navigateTo('scanner');
            } else {
              navigateTo(screen);
            }
          }}
        />
      )}

      {/* Dedicated On-Device Sync & Cache Modal */}
      <SyncCacheModal
        isOpen={isCacheModalOpen}
        onClose={closeCacheModal}
        onShowToast={showToast}
      />

      {/* Feedback Toast Notification */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <SyncProvider>
      <AppContent />
    </SyncProvider>
  );
}
