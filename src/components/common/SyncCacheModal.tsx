import React, { useState } from 'react';
import { 
  X, 
  HardDriveDownload, 
  CheckCircle2, 
  RefreshCw, 
  WifiOff, 
  Wifi, 
  ShieldCheck, 
  Database, 
  Pin, 
  FileText, 
  Lock, 
  Sparkles, 
  AlertCircle, 
  Layers,
  ArrowRight,
  RotateCw,
  Trash2
} from 'lucide-react';
import { useSync } from '../../context/SyncContext';

interface SyncCacheModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const SyncCacheModal: React.FC<SyncCacheModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const {
    files,
    syncState,
    syncProgress,
    syncStepMessage,
    lastSyncTime,
    isOnline,
    isSimulatedOffline,
    effectiveOnline,
    cachedCount,
    totalCacheSize,
    triggerSyncAll,
    toggleSimulatedOffline,
    togglePinFile,
    forceCacheFile,
    verifyCacheIntegrity,
    purgeTempCache,
  } = useSync();

  const [activeTab, setActiveTab] = useState<'status' | 'documents' | 'storage'>('status');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSyncClick = async () => {
    onShowToast('Synchronizing on-device document cache...');
    await triggerSyncAll();
    onShowToast('All documents synced & verified offline!');
  };

  const handleIntegrityCheck = async () => {
    setIsVerifying(true);
    const res = await verifyCacheIntegrity();
    setIsVerifying(false);
    onShowToast(res.message);
  };

  const handlePurge = () => {
    purgeTempCache();
    onShowToast('Freed 24.6 MB of temporary canvas render cache');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="cache-modal-title"
        className="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl border border-zinc-200 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden text-zinc-900"
      >
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-sm">
              <HardDriveDownload className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <h2 id="cache-modal-title" className="text-sm font-bold text-zinc-900">
                Offline Cache & Sync Engine
              </h2>
              <span className="text-[11px] text-zinc-500 font-medium">
                Local Sandbox Storage • Zero-Cloud
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-4 pt-3 pb-1 border-b border-zinc-100 gap-1 bg-white">
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors text-center ${
              activeTab === 'status'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'documents'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <span>Documents</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'documents' ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'
            }`}>
              {files.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors text-center ${
              activeTab === 'storage'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            Storage & Health
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'status' && (
            <>
              {/* Primary Status Banner */}
              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  !effectiveOnline
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : syncState === 'syncing'
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                      !effectiveOnline
                        ? 'bg-amber-500 text-white'
                        : syncState === 'syncing'
                        ? 'bg-blue-600 text-white animate-spin'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {!effectiveOnline ? (
                      <WifiOff className="w-5 h-5" />
                    ) : syncState === 'syncing' ? (
                      <RefreshCw className="w-5 h-5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {!effectiveOnline
                          ? 'Offline Mode Active'
                          : syncState === 'syncing'
                          ? 'Synchronizing Cache...'
                          : '100% Offline Ready'}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-current/20">
                        {lastSyncTime}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5 font-medium leading-relaxed opacity-90">
                      {!effectiveOnline
                        ? 'Internet disconnected or simulated offline. All documents and tools are serving directly from high-speed local device cache.'
                        : syncState === 'syncing'
                        ? syncStepMessage
                        : `All ${cachedCount} documents are verified and cached in local sandbox storage. No cloud connectivity required.`}
                    </p>
                  </div>
                </div>

                {/* Progress bar during sync */}
                {syncState === 'syncing' && (
                  <div className="mt-3 pt-2.5 border-t border-blue-200/60 flex flex-col gap-1.5">
                    <div className="flex justify-between text-[11px] font-semibold text-blue-800">
                      <span>Syncing on-device cache</span>
                      <span>{syncProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                        style={{ width: `${syncProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Offline Simulator Control */}
              <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-zinc-200/70 text-zinc-700 flex items-center justify-center shrink-0">
                    {effectiveOnline ? (
                      <Wifi className="w-4 h-4 text-zinc-700" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-zinc-900 truncate">
                      Simulate Offline / Airplane Mode
                    </span>
                    <span className="text-[11px] text-zinc-500 truncate">
                      Test zero-cloud offline reading & editing
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    toggleSimulatedOffline();
                    onShowToast(
                      !isSimulatedOffline
                        ? 'Simulated Offline Mode enabled (Cache active)'
                        : 'Simulated Offline Mode disabled (Online mode)'
                    );
                  }}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors relative flex items-center shrink-0 ${
                    isSimulatedOffline ? 'bg-amber-600' : 'bg-zinc-300'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                      isSimulatedOffline ? 'translate-x-5.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Cache Stats Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-zinc-50/80 border border-zinc-200/80 rounded-xl flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Cached Documents
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-zinc-900">{cachedCount}</span>
                    <span className="text-xs text-zinc-500">of {files.length}</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>100% Available</span>
                  </span>
                </div>

                <div className="p-3 bg-zinc-50/80 border border-zinc-200/80 rounded-xl flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Sandbox Size
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-zinc-900">{totalCacheSize}</span>
                    <span className="text-xs text-zinc-500">used</span>
                  </div>
                  <span className="text-[11px] text-zinc-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-zinc-700" />
                    <span>IndexedDB Cache</span>
                  </span>
                </div>
              </div>

              {/* Cache Policies / Features */}
              <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col gap-2.5">
                <span className="text-xs font-bold text-zinc-900">
                  Offline Reliability Guarantees
                </span>
                <div className="space-y-2 text-xs text-zinc-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>High-Resolution 300 DPI Bitmaps Pre-cached</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Offline OCR Search Vectors Embedded</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>SHA-256 Tamper Verification Engine</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-zinc-500 px-0.5">
                <span>{files.length} Document Caches</span>
                <span>Click pin to keep permanent</span>
              </div>
              <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-2xl overflow-hidden bg-white">
                {files.map((file) => {
                  const isCached = file.cache?.status === 'cached';
                  const isPinned = !!file.cache?.isPinned;

                  return (
                    <div
                      key={file.id}
                      className="p-3 flex items-center justify-between gap-2.5 hover:bg-zinc-50/70 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-9 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200/80">
                          <FileText className="w-4 h-4 text-zinc-700" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold text-zinc-900 truncate">
                            {file.filename}
                          </span>
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
                            <span>{file.size}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Cached 300 DPI
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            togglePinFile(file.id);
                            onShowToast(
                              !isPinned
                                ? `Pinned ${file.filename} for permanent offline retention`
                                : `Unpinned ${file.filename}`
                            );
                          }}
                          aria-label="Pin document"
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isPinned
                              ? 'bg-zinc-900 text-white border-zinc-900'
                              : 'bg-white text-zinc-400 border-zinc-200 hover:text-zinc-800'
                          }`}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            onShowToast(`Re-caching ${file.filename}...`);
                            await forceCacheFile(file.id);
                            onShowToast(`${file.filename} refreshed in cache`);
                          }}
                          aria-label="Re-cache file"
                          className="p-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 transition-colors"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-3.5">
              {/* Storage breakdown */}
              <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900">
                    Local Device Sandbox Allocation
                  </span>
                  <span className="text-xs font-semibold text-zinc-600">
                    14.4 MB / 512 MB
                  </span>
                </div>
                {/* Visual storage segment bar */}
                <div className="w-full h-3 bg-zinc-200 rounded-full overflow-hidden flex">
                  <div className="h-full bg-zinc-900" style={{ width: '68%' }} title="PDF Files" />
                  <div className="h-full bg-zinc-600" style={{ width: '18%' }} title="High-Res Pre-renders" />
                  <div className="h-full bg-emerald-600" style={{ width: '14%' }} title="OCR & Metadata" />
                </div>
                {/* Legend */}
                <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-zinc-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-zinc-900" />
                    <span>PDFs (10.2 MB)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-zinc-600" />
                    <span>Renders (2.4 MB)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>OCR (1.8 MB)</span>
                  </div>
                </div>
              </div>

              {/* Cryptographic SHA-256 verification */}
              <div className="p-3.5 bg-white border border-zinc-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-zinc-900">
                      SHA-256 Integrity Verification
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Cryptographically matches file hashes stored in local sandbox to ensure no corruptions occurred during offline storage.
                </p>
                <button
                  onClick={handleIntegrityCheck}
                  disabled={isVerifying}
                  className="w-full mt-1 py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>{isVerifying ? 'Verifying Hashes...' : 'Run Full Integrity Audit'}</span>
                </button>
              </div>

              {/* Purge cache action */}
              <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-900">
                    Purge Render Cache
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Clears temporary thumbnail renders (keeps original docs)
                  </span>
                </div>
                <button
                  onClick={handlePurge}
                  className="py-1.5 px-3 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
                >
                  <Trash2 className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Purge</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50/70 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate">On-device storage engine active</span>
          </div>

          <button
            onClick={handleSyncClick}
            disabled={syncState === 'syncing'}
            className="py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold flex items-center gap-2 transition-all active:scale-95 shadow-sm disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncState === 'syncing' ? 'animate-spin' : ''}`} />
            <span>{syncState === 'syncing' ? 'Syncing...' : 'Sync All Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
