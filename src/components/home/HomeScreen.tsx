import React, { useState } from 'react';
import { 
  FileText, 
  QrCode, 
  ShieldCheck, 
  Scan, 
  Images, 
  FolderOpen, 
  ChevronRight, 
  GitMerge, 
  Split, 
  Minimize2, 
  RotateCw, 
  ArrowUpDown, 
  Image as ImageIcon, 
  ArrowRight, 
  MoreVertical, 
  FileCheck2, 
  PenTool, 
  Receipt, 
  Bolt, 
  CheckCircle2, 
  Globe, 
  FileEdit, 
  Wifi, 
  WifiOff,
  RefreshCw,
  HardDriveDownload,
  Pin,
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Share2, 
  ExternalLink, 
  UserPlus, 
  Lock,
  History
} from 'lucide-react';
import { ScreenType, HomeMode, QRPayloadType, DocItem } from '../../types';
import { INITIAL_QR_CODES } from '../../data/mockData';
import { useSync } from '../../context/SyncContext';
import { PWAInstallBanner } from '../common/PWAInstallBanner';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType, payload?: any) => void;
  onOpenFile?: (file: DocItem) => void;
  onShowToast: (msg: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onOpenFile, onShowToast }) => {
  const [mode, setMode] = useState<HomeMode>('pdf');
  const [recentQRs, setRecentQRs] = useState(INITIAL_QR_CODES);
  const [selectedPayloadType, setSelectedPayloadType] = useState<QRPayloadType>('url');

  const {
    files,
    syncState,
    syncProgress,
    syncStepMessage,
    lastSyncTime,
    effectiveOnline,
    isSimulatedOffline,
    cachedCount,
    totalCacheSize,
    openCacheModal,
    triggerSyncAll,
    toggleSimulatedOffline,
    togglePinFile,
    forceCacheFile,
  } = useSync();

  const payloadTypes: { id: QRPayloadType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'url', label: 'URL', icon: Globe },
    { id: 'text', label: 'Text', icon: FileEdit },
    { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
    { id: 'contact', label: 'Contact', icon: User },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'phone', label: 'Phone', icon: Phone },
    { id: 'location', label: 'Location', icon: MapPin },
  ];

  const handleClearQRs = () => {
    setRecentQRs([]);
    onShowToast('QR History cleared locally');
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pt-20 pb-28 px-4 gap-6 select-none">
      {/* Signature Segmented Mode Switch */}
      <div className="w-full flex justify-center">
        <div className="w-full h-12 p-1 bg-zinc-100 rounded-full flex items-center border border-zinc-200 relative select-none shadow-sm">
          <button
            onClick={() => setMode('pdf')}
            className={`flex-1 h-full rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 ${
              mode === 'pdf'
                ? 'bg-[#18181b] text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => setMode('qr')}
            className={`flex-1 h-full rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 ${
              mode === 'qr'
                ? 'bg-[#18181b] text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR Code</span>
          </button>
        </div>
      </div>

      {mode === 'pdf' ? (
        <>
          {/* Hero Status & Title */}
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 w-fit border border-zinc-200/90 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-900 fill-zinc-900/10" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                100% On-device processing • No cloud uploads
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">PDF Tools</h1>
              <p className="text-sm text-zinc-500 font-normal">Create, scan, edit and manage PDFs</p>
            </div>
          </div>

          {/* In-App PWA Install Banner */}
          <PWAInstallBanner variant="banner" onShowToast={onShowToast} />

          {/* Offline Reliability & On-Device Cache Card */}
          <div 
            onClick={openCacheModal}
            className="p-3.5 rounded-2xl border transition-all cursor-pointer bg-white border-zinc-200 shadow-sm hover:border-zinc-300 hover:shadow-md active:scale-[0.99] flex flex-col gap-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  !effectiveOnline 
                    ? 'bg-amber-500 text-white' 
                    : syncState === 'syncing' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-emerald-600 text-white'
                }`}>
                  {!effectiveOnline ? (
                    <WifiOff className="w-4 h-4" />
                  ) : syncState === 'syncing' ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <HardDriveDownload className="w-4 h-4" />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-900">On-Device Cache</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      !effectiveOnline
                        ? 'bg-amber-50 text-amber-900 border-amber-200'
                        : syncState === 'syncing'
                        ? 'bg-blue-50 text-blue-900 border-blue-200'
                        : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    }`}>
                      {!effectiveOnline ? 'Offline Active' : syncState === 'syncing' ? 'Syncing...' : '100% Cached'}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 truncate">
                    {syncState === 'syncing' ? syncStepMessage : `${cachedCount} of ${files.length} docs offline-ready • ${totalCacheSize}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    onShowToast('Syncing on-device document cache...');
                    await triggerSyncAll();
                    onShowToast('Cache verified: All files offline ready');
                  }}
                  disabled={syncState === 'syncing'}
                  title="Sync and verify offline cache"
                  className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-bold flex items-center gap-1 transition-colors active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${syncState === 'syncing' ? 'animate-spin' : ''}`} />
                  <span>Sync</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openCacheModal();
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Micro sync progress bar if syncing */}
            {syncState === 'syncing' && (
              <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${syncProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Primary Action Cards */}
          <div className="flex flex-col gap-3">
            {/* Scan Document */}
            <div
              role="button"
              onClick={() => onNavigate('scanner')}
              className="group w-full p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-200 flex items-center justify-between active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 shrink-0 group-hover:bg-[#18181b] group-hover:text-white transition-colors border border-zinc-200/60">
                  <Scan className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-base font-semibold text-zinc-900 truncate">Scan Document</span>
                  <span className="text-xs text-zinc-500 truncate">Auto-edge detection & instant flatten</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 transition-colors shrink-0" />
            </div>

            {/* Images to PDF */}
            <div
              role="button"
              onClick={() => onNavigate('crop')}
              className="group w-full p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-200 flex items-center justify-between active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 shrink-0 group-hover:bg-[#18181b] group-hover:text-white transition-colors border border-zinc-200/60">
                  <Images className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-base font-semibold text-zinc-900 truncate">Images to PDF</span>
                  <span className="text-xs text-zinc-500 truncate">Multiple photo compile with auto-align</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 transition-colors shrink-0" />
            </div>

            {/* Open PDF */}
            <div
              role="button"
              onClick={() => onNavigate('viewer')}
              className="group w-full p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-200 flex items-center justify-between active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 shrink-0 group-hover:bg-[#18181b] group-hover:text-white transition-colors border border-zinc-200/60">
                  <FolderOpen className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-base font-semibold text-zinc-900 truncate">Open PDF</span>
                  <span className="text-xs text-zinc-500 truncate">Fast sandbox reader from local device</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 transition-colors shrink-0" />
            </div>
          </div>

          {/* Quick Tools Grid */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-zinc-900">Quick Tools</h2>
              <span className="text-[11px] text-zinc-700 font-bold px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200">
                Engine v2.4
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Merge */}
              <button
                onClick={() => onShowToast('Merge PDF: Select files to combine')}
                className="flex flex-col p-3.5 bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md hover:border-zinc-300 transition-all active:scale-[0.98] text-left gap-2"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
                  <GitMerge className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-zinc-900 truncate">Merge PDF</span>
                  <span className="text-xs text-zinc-500 truncate">Combine sheets</span>
                </div>
              </button>

              {/* Split */}
              <button
                onClick={() => onShowToast('Split PDF: Range extractor ready')}
                className="flex flex-col p-3.5 bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md hover:border-zinc-300 transition-all active:scale-[0.98] text-left gap-2"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
                  <Split className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-zinc-900 truncate">Split PDF</span>
                  <span className="text-xs text-zinc-500 truncate">Extract range</span>
                </div>
              </button>

              {/* Compress */}
              <button
                onClick={() => onShowToast('Compress PDF: Optimized ~40% space')}
                className="flex flex-col p-3.5 bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md hover:border-zinc-300 transition-all active:scale-[0.98] text-left gap-2"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
                  <Minimize2 className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-zinc-900 truncate">Compress PDF</span>
                  <span className="text-xs text-zinc-500 truncate">Shrink bytes</span>
                </div>
              </button>

              {/* Rotate */}
              <button
                onClick={() => onShowToast('Rotate PDF: 90° clockwise applied')}
                className="flex flex-col p-3.5 bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md hover:border-zinc-300 transition-all active:scale-[0.98] text-left gap-2"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
                  <RotateCw className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-zinc-900 truncate">Rotate PDF</span>
                  <span className="text-xs text-zinc-500 truncate">90° / 180° fix</span>
                </div>
              </button>

              {/* Reorder */}
              <button
                onClick={() => onNavigate('edit-pdf')}
                className="flex flex-col p-3.5 bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md hover:border-zinc-300 transition-all active:scale-[0.98] text-left gap-2"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
                  <ArrowUpDown className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-zinc-900 truncate">Reorder Pages</span>
                  <span className="text-xs text-zinc-500 truncate">Drag sequence</span>
                </div>
              </button>

              {/* PDF to Images */}
              <button
                onClick={() => onShowToast('PDF to Images: High-res export ready')}
                className="flex flex-col p-3.5 bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md hover:border-zinc-300 transition-all active:scale-[0.98] text-left gap-2"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
                  <ImageIcon className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-zinc-900 truncate">PDF → Images</span>
                  <span className="text-xs text-zinc-500 truncate">Export JPG/PNG</span>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Files */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-zinc-900">Recent Files</h2>
              <button
                onClick={() => onNavigate('files')}
                className="text-sm text-zinc-900 font-semibold flex items-center gap-0.5 hover:opacity-80 active:opacity-60 transition-opacity"
              >
                <span>See all</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {files.slice(0, 3).map((file) => {
                const isCached = file.cache?.status === 'cached';
                const isPinned = !!file.cache?.isPinned;

                return (
                  <div
                    key={file.id}
                    onClick={() => {
                      if (onOpenFile) {
                        onOpenFile(file);
                      } else {
                        onNavigate('viewer');
                      }
                    }}
                    className="p-3 bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md hover:border-zinc-300 flex items-center justify-between gap-3 transition-all cursor-pointer active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-14 rounded-lg bg-zinc-100 flex flex-col items-center justify-center shrink-0 text-zinc-900 border border-zinc-200/80 relative">
                        {file.type === 'qr' ? (
                          <QrCode className="w-6 h-6 stroke-[2]" />
                        ) : (
                          <FileText className="w-6 h-6 stroke-[2]" />
                        )}
                        <span className="text-[10px] text-zinc-900 font-bold tracking-tight">
                          {file.type.toUpperCase()}
                        </span>
                        {isPinned && (
                          <div 
                            title="Pinned in local offline cache"
                            className="absolute -top-1 -right-1 w-4 h-4 bg-zinc-900 text-white rounded-full flex items-center justify-center shadow-2xs"
                          >
                            <Pin className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-zinc-900 truncate">
                          {file.filename}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-normal">
                          <span>{file.pages} {file.pages === 1 ? 'pg' : 'pgs'}</span>
                          <span>•</span>
                          <span>{file.size}</span>
                          <span>•</span>
                          <span className="truncate">{file.date}</span>
                        </div>
                        {/* Visual indicator for document cache status */}
                        <div className="flex items-center gap-1.5 mt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openCacheModal();
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200/80 transition-colors"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            <span>Cached (Offline Ready)</span>
                          </button>
                          {file.isLocked && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                              <Lock className="w-2.5 h-2.5" />
                              <span>Encrypted</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('files');
                      }}
                      className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors shrink-0"
                    >
                      <MoreVertical className="w-5 h-5 stroke-[2]" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* QR Tools Screen Content */}
          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">QR Tools</h1>
                <p className="text-sm text-zinc-500">Create and scan QR codes instantly</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 shadow-sm">
                <QrCode className="w-7 h-7 stroke-[2]" />
              </div>
            </div>

            {/* Privacy & Local Reassurance Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 self-start mt-1">
              <Bolt className="w-4 h-4 text-zinc-900 fill-zinc-900" />
              <span className="text-xs font-semibold tracking-normal">
                Instant offline generation • Private & local
              </span>
            </div>
          </section>

          {/* Primary Dual Action Cards */}
          <section className="grid grid-cols-1 gap-3">
            {/* Card 1: Create QR Code */}
            <div
              role="button"
              onClick={() => onNavigate('qr-generator')}
              className="relative overflow-hidden rounded-2xl bg-white border border-zinc-200 p-4 shadow-sm flex flex-col justify-between gap-4 transition-all hover:border-zinc-400 active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center shrink-0 border border-zinc-200">
                    <QrCode className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-zinc-900">Create custom QR code</h2>
                    <p className="text-xs text-zinc-500">URL, Wi-Fi, vCard, Text & more</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-xs border border-zinc-200 font-medium">
                  Vector SVG
                </span>
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-xs border border-zinc-200 font-medium">
                  High Error Correction
                </span>
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-xs border border-zinc-200 font-medium">
                  Zero Tracking
                </span>
              </div>
            </div>

            {/* Card 2: Scan QR Code */}
            <div
              role="button"
              onClick={() => onNavigate('scanner')}
              className="relative overflow-hidden rounded-2xl bg-white border border-zinc-200 p-4 shadow-sm flex flex-col justify-between gap-4 transition-all hover:border-zinc-400 active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center shrink-0 border border-zinc-200">
                    <Scan className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-zinc-900">Scan QR Code</h2>
                    <p className="text-xs text-zinc-500">Scan via camera or pick from gallery</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="flex items-center justify-between text-zinc-600 text-xs">
                <div className="flex items-center gap-1.5 text-zinc-900 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-zinc-800" />
                  <span>Zero cloud latency</span>
                </div>
                <span className="text-zinc-500">Continuous auto-detect</span>
              </div>
            </div>
          </section>

          {/* Quick Payload Type Selector */}
          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                Quick Payload Type
              </span>
              <button
                onClick={() => onNavigate('qr-generator')}
                className="text-xs text-zinc-900 font-semibold underline underline-offset-2 hover:opacity-80"
              >
                All Templates
              </button>
            </div>

            {/* Horizontal Scrolling Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar select-none">
              {payloadTypes.map((item) => {
                const isSelected = selectedPayloadType === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedPayloadType(item.id);
                      onNavigate('qr-generator', { type: item.id });
                    }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold shrink-0 transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-[#18181b] text-white shadow-sm'
                        : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Recent QR Codes Section */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-900">Recent QR Codes</h3>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-zinc-100 text-zinc-900 text-xs font-bold border border-zinc-200">
                  {recentQRs.length}
                </span>
              </div>
              {recentQRs.length > 0 && (
                <button
                  onClick={handleClearQRs}
                  className="text-xs font-semibold text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {recentQRs.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border border-zinc-200 text-center flex flex-col items-center justify-center gap-2 shadow-sm">
                <History className="w-8 h-8 text-zinc-400" />
                <span className="text-sm font-semibold text-zinc-900">History Cleared</span>
                <span className="text-xs text-zinc-500">Generated and scanned codes will appear here</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {recentQRs.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-white border border-zinc-200 p-3 shadow-sm flex items-center justify-between gap-3 hover:border-zinc-300 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Stylized QR Matrix Thumbnail */}
                      <div className="w-14 h-14 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 p-2 text-zinc-900 border border-zinc-200">
                        <QrCode className="w-full h-full stroke-[1.8]" />
                      </div>
                      <div className="min-w-0 flex flex-col">
                        <span className="text-sm font-semibold text-zinc-900 truncate">
                          {item.title}
                        </span>
                        <div className="flex items-center gap-1 text-zinc-500 text-xs truncate">
                          {item.type === 'wifi' && <Wifi className="w-3.5 h-3.5 shrink-0" />}
                          {item.type === 'url' && <ExternalLink className="w-3.5 h-3.5 shrink-0" />}
                          {item.type === 'contact' && <User className="w-3.5 h-3.5 shrink-0" />}
                          <span className="truncate">{item.subtitle}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {item.type === 'wifi' && (
                        <button
                          onClick={() => onShowToast('Guest Wi-Fi credentials copied!')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-900 text-xs font-semibold border border-zinc-200 hover:bg-zinc-200 active:scale-95 transition-all"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share</span>
                        </button>
                      )}
                      {item.type === 'url' && (
                        <button
                          onClick={() => onShowToast(`Opened ${item.payload}`)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#18181b] text-white text-xs font-semibold hover:bg-zinc-800 active:scale-95 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open</span>
                        </button>
                      )}
                      {item.type === 'contact' && (
                        <button
                          onClick={() => onShowToast('Contact vCard saved locally')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-900 text-xs font-semibold border border-zinc-200 hover:bg-zinc-200 active:scale-95 transition-all"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      )}
                      <button
                        onClick={() => onShowToast(`Options for ${item.title}`)}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Offline Hardware Guarantee Notice Banner */}
          <footer className="mt-2 rounded-2xl bg-zinc-100 border border-zinc-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-zinc-900 flex items-center justify-center shrink-0 border border-zinc-200 shadow-sm">
              <Lock className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-zinc-900">Zero Data Leaves This Phone</span>
              <span className="text-xs text-zinc-500">Built-in ZXing decoder running in local WASM runtime.</span>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};
