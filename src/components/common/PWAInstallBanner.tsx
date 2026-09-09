import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallBannerProps {
  variant?: 'banner' | 'button' | 'settings-card';
  onShowToast?: (msg: string) => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  variant = 'banner',
  onShowToast,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  // Suppress completely if already installed as standalone PWA
  if (isInstalled || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        onShowToast?.('DocuPulse is now installed on your device!');
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Fallback for browsers before prompt fires
      setShowIOSModal(true);
    }
  };

  // 1. Compact Header / Top Bar Button Variant
  if (variant === 'button') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          aria-label="Install DocuPulse App"
          className="h-8 px-2.5 rounded-lg bg-zinc-900 hover:bg-black text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Install App</span>
        </button>

        {showIOSModal && <InstallGuideModal isIOS={isIOS} onClose={() => setShowIOSModal(false)} />}
      </>
    );
  }

  // 2. Settings Screen Card Variant
  if (variant === 'settings-card') {
    return (
      <>
        <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-sm p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Smartphone className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-900">Install as Native App</span>
                <span className="text-[11px] text-zinc-500">
                  Runs full-screen, offline, with zero browser URL bars
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold shrink-0">
              PWA Ready
            </span>
          </div>

          <p className="text-[11px] text-zinc-600 leading-relaxed">
            Install DocuPulse onto your home screen or desktop application launcher. Enjoy lightning-fast startup and complete offline hardware isolation.
          </p>

          <button
            onClick={handleInstallClick}
            className="w-full h-9 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isIOS ? 'Instructions for iPhone / iPad' : 'Install DocuPulse App'}</span>
          </button>
        </div>

        {showIOSModal && <InstallGuideModal isIOS={isIOS} onClose={() => setShowIOSModal(false)} />}
      </>
    );
  }

  // 3. Default Banner Variant (for Home Screen)
  return (
    <>
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900 text-white p-4 shadow-md border border-zinc-800">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">Install DocuPulse App</span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold border border-cyan-400/30 uppercase">
                  PWA
                </span>
              </div>
              <span className="text-[11px] text-zinc-300 leading-tight mt-0.5">
                Install to home screen for instant offline scanner access
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss banner"
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3.5 flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 h-8 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install Now</span>
          </button>
          <button
            onClick={() => setShowIOSModal(true)}
            className="h-8 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <span>How it works</span>
          </button>
        </div>
      </div>

      {showIOSModal && <InstallGuideModal isIOS={isIOS} onClose={() => setShowIOSModal(false)} />}
    </>
  );
};

// Modal for iOS Safari / Browser Instructions
const InstallGuideModal: React.FC<{ isIOS: boolean; onClose: () => void }> = ({ isIOS, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-zinc-200 flex flex-col gap-4 text-zinc-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">
              {isIOS ? 'Install on iPhone / iPad' : 'Install on Your Device'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isIOS ? (
          <div className="flex flex-col gap-3 text-xs text-zinc-600">
            <p className="font-medium text-zinc-800">
              Apple Safari does not prompt automatically. To install DocuPulse:
            </p>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <Share className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <strong className="text-zinc-900 block">Step 1</strong>
                Tap the <strong>Share</strong> button in the Safari browser toolbar at the bottom of your screen.
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <PlusSquare className="w-4 h-4 text-zinc-800 mt-0.5 shrink-0" />
              <div>
                <strong className="text-zinc-900 block">Step 2</strong>
                Scroll down and select <strong>Add to Home Screen</strong>.
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <strong className="text-zinc-900 block">Step 3</strong>
                Tap <strong>Add</strong> in the top-right corner. DocuPulse will appear on your home screen.
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 text-xs text-zinc-600">
            <p className="font-medium text-zinc-800">
              Install DocuPulse as a standalone desktop or mobile application:
            </p>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <Download className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <strong className="text-zinc-900 block">Desktop / Chrome / Edge</strong>
                Click the <strong>Install DocuPulse</strong> icon in the address bar (or browser menu &gt; <em>Install DocuPulse</em>).
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
              <div>
                <strong className="text-zinc-900 block">Full Hardware Offline Support</strong>
                Once installed, DocuPulse launches directly in its own app window with offline PDF processing and camera scanning.
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full h-9 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-all"
        >
          Got It
        </button>
      </div>
    </div>
  );
};
