import React from 'react';
import { 
  Signal, 
  Wifi, 
  WifiOff,
  BatteryMedium, 
  ShieldCheck, 
  SlidersHorizontal, 
  User, 
  ArrowLeft, 
  Lock,
  RefreshCw,
  CheckCircle2,
  HardDriveDownload
} from 'lucide-react';
import { ScreenType } from '../../types';
import { DOCUPULSE_LOGO_URL } from '../../data/mockData';
import { useSync } from '../../context/SyncContext';
import { PWAInstallBanner } from './PWAInstallBanner';

interface HeaderProps {
  currentScreen: ScreenType;
  title?: string;
  subtitle?: string;
  badgeText?: string;
  onBack?: () => void;
  onOpenSettings?: () => void;
  onProfileClick?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  title,
  subtitle,
  badgeText,
  onBack,
  onOpenSettings,
  onProfileClick,
  rightAction,
}) => {
  const isRootScreen = currentScreen === 'home' || currentScreen === 'files' || currentScreen === 'tools';
  const { syncState, syncProgress, effectiveOnline, openCacheModal } = useSync();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fafafa]/85 backdrop-blur-xl border-b border-zinc-200/80 shadow-[0_1px_6px_rgba(0,0,0,0.02)] transition-all">
      {/* Phone Status Bar Simulation */}
      <div className="h-6 px-4 flex items-center justify-between text-zinc-500 text-xs font-semibold select-none">
        <span className="text-zinc-900 tracking-tight">9:41</span>
        <div className="flex items-center gap-1.5 text-zinc-700">
          <Signal className="w-3.5 h-3.5 stroke-[2.2]" />
          {effectiveOnline ? (
            <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 stroke-[2.2] text-amber-600" />
          )}
          <BatteryMedium className="w-4 h-4 stroke-[2.2]" />
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="h-14 px-3 flex items-center justify-between gap-2 max-w-5xl mx-auto">
        {isRootScreen ? (
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={DOCUPULSE_LOGO_URL}
              alt="DocuPulse Logo"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-xl shrink-0 object-cover shadow-sm border border-zinc-200"
            />
            <span className="text-lg font-bold text-zinc-900 tracking-tight truncate hidden xs:inline">
              DocuPulse
            </span>

            {/* Visual Indicator for On-Device Sync & Caching */}
            <button
              onClick={openCacheModal}
              title="Click to view on-device sync & offline cache status"
              aria-label="Offline Sync & Cache Status"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 border transition-all active:scale-95 shadow-2xs cursor-pointer ${
                !effectiveOnline
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  : syncState === 'syncing'
                  ? 'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-300/80 hover:bg-emerald-100'
              }`}
            >
              {!effectiveOnline ? (
                <>
                  <WifiOff className="w-3 h-3 text-amber-700" />
                  <span>Offline • Cached</span>
                </>
              ) : syncState === 'syncing' ? (
                <>
                  <RefreshCw className="w-3 h-3 text-blue-700 animate-spin" />
                  <span>Syncing {syncProgress}%</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <HardDriveDownload className="w-3 h-3 text-emerald-700" />
                  <span>All Cached</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              onClick={onBack}
              aria-label="Back"
              className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-800 hover:bg-zinc-100 active:scale-90 transition-all shrink-0"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div className="flex flex-col min-w-0 pl-0.5">
              <h1 className="text-base font-bold text-zinc-900 tracking-tight truncate">
                {title || 'Document Viewer'}
              </h1>
              {subtitle && (
                <span className="text-xs text-zinc-500 truncate -mt-0.5 font-medium">
                  {subtitle}
                </span>
              )}
            </div>
            
            {/* Sync Cache pill in header */}
            <button
              onClick={openCacheModal}
              title="Click to view cache status"
              className="inline-flex items-center gap-1 ml-1.5 px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-[11px] font-semibold shrink-0 border border-zinc-200 hover:bg-zinc-200 transition-colors"
            >
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
              <span>{badgeText || 'Local'}</span>
            </button>
          </div>
        )}

        {/* Right side controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <PWAInstallBanner variant="button" />

          {/* Quick Sync Button in Header */}
          <button
            onClick={openCacheModal}
            aria-label="Open Cache Hub"
            title="Open Offline Cache Hub"
            className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          >
            <HardDriveDownload className="w-4 h-4 stroke-[2]" />
          </button>

          {rightAction}
          <button
            onClick={onOpenSettings}
            aria-label="Settings"
            className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[2]" />
          </button>
          <button
            onClick={onProfileClick}
            aria-label="Local Profile"
            className="w-8 h-8 rounded-full bg-[#18181b] flex items-center justify-center shrink-0 shadow-sm text-white hover:bg-zinc-800 active:scale-95 transition-all"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
