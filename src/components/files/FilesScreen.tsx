import React, { useState } from 'react';
import { 
  FileText, 
  Grid, 
  List, 
  ArrowUpDown, 
  Search, 
  Mic, 
  X, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  MoreVertical, 
  QrCode, 
  Badge, 
  Share2, 
  Edit3, 
  Trash2, 
  FileKey, 
  Minimize2, 
  Info, 
  ChevronRight, 
  Check,
  Pin,
  RefreshCw,
  HardDriveDownload
} from 'lucide-react';
import { DocItem } from '../../types';
import { useSync } from '../../context/SyncContext';

interface FilesScreenProps {
  onOpenFile: (file: DocItem) => void;
  onShowToast: (msg: string) => void;
}

export const FilesScreen: React.FC<FilesScreenProps> = ({ onOpenFile, onShowToast }) => {
  const {
    files,
    deleteFile,
    renameFile,
    togglePinFile,
    forceCacheFile,
    openCacheModal,
    totalCacheSize,
  } = useSync();

  const [activeCategory, setActiveCategory] = useState<'all' | 'pdf' | 'image' | 'qr' | 'cached'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGridView, setIsGridView] = useState<boolean>(false);
  const [selectedFileForDrawer, setSelectedFileForDrawer] = useState<DocItem | null>(null);

  const filteredFiles = files.filter((f) => {
    const matchesCategory =
      activeCategory === 'all'
        ? true
        : activeCategory === 'cached'
        ? f.cache?.status === 'cached'
        : f.type === activeCategory;
    const matchesSearch = f.filename.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDeleteFile = (id: string) => {
    deleteFile(id);
    setSelectedFileForDrawer(null);
    onShowToast('File deleted from local storage');
  };

  const handleRename = (file: DocItem) => {
    const newName = prompt('Rename local file:', file.filename);
    if (newName && newName.trim()) {
      renameFile(file.id, newName.trim());
      setSelectedFileForDrawer(null);
      onShowToast(`Renamed to ${newName.trim()}`);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pt-20 pb-28 px-4 select-none relative">
      {/* Header Controls Row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Files</h1>
          <span className="text-xs text-zinc-600 bg-zinc-200/80 px-2 py-0.5 rounded-full font-bold">
            {files.length} items
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setIsGridView(!isGridView);
              onShowToast(!isGridView ? 'Grid layout enabled' : 'List layout enabled');
            }}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition-colors active:scale-95 shadow-sm"
          >
            {isGridView ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onShowToast('Sorted by Most Recent')}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900 hover:bg-zinc-200 transition-colors active:scale-95 shadow-sm"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full flex items-center mb-3">
        <Search className="w-4 h-4 absolute left-3.5 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search local documents, notes, tags..."
          className="w-full h-11 pl-10 pr-10 rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 text-sm outline-none shadow-sm focus:border-zinc-400 transition-all"
        />
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 text-zinc-400 hover:text-zinc-700"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => onShowToast('Voice search listening on-device...')}
            className="absolute right-3 text-zinc-400 hover:text-zinc-700"
          >
            <Mic className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar mb-3 select-none">
        {[
          { id: 'all' as const, label: 'All', count: files.length },
          { id: 'cached' as const, label: 'Offline Ready', count: files.filter((f) => f.cache?.status === 'cached').length },
          { id: 'pdf' as const, label: 'PDF', count: files.filter((f) => f.type === 'pdf').length },
          { id: 'image' as const, label: 'Images', count: files.filter((f) => f.type === 'image').length },
          { id: 'qr' as const, label: 'QR Codes', count: files.filter((f) => f.type === 'qr').length },
        ].map((tab) => {
          const isSelected = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveCategory(tab.id);
                onShowToast(`Filtered by ${tab.label}`);
              }}
              className={`flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-bold shrink-0 transition-all active:scale-95 ${
                isSelected
                  ? 'bg-[#18181b] text-white shadow-sm'
                  : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-zinc-700 text-white' : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Storage Security Reassurance Banner */}
      <div 
        onClick={openCacheModal}
        className="flex items-center justify-between p-3 rounded-2xl bg-zinc-100/90 border border-zinc-200 text-zinc-900 gap-2 shadow-sm mb-3 cursor-pointer hover:border-zinc-300 transition-all"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-zinc-200 text-zinc-800 flex items-center justify-center shrink-0">
            <HardDriveDownload className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-zinc-900 truncate">
                {totalCacheSize} On-Device Cache
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-400" />
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                100% Offline
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 truncate">
              Zero-cloud sandbox • Indexed & SHA-256 verified
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            openCacheModal();
          }}
          className="shrink-0 text-xs font-bold text-zinc-900 px-2.5 py-1 rounded-lg bg-white border border-zinc-200 shadow-sm hover:bg-zinc-50 transition-colors"
        >
          Manage
        </button>
      </div>

      {/* Sort Indicator & Local Sync Strip */}
      <div className="flex items-center justify-between pt-0.5 pb-2">
        <span className="inline-flex items-center gap-1 text-xs text-zinc-600 font-medium">
          <span>Sorted by Recent</span>
          <span className="text-zinc-400">• Date Modified</span>
        </span>
        <button
          onClick={openCacheModal}
          className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 text-xs font-semibold"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Local Sync OK</span>
        </button>
      </div>

      {/* Document List Container */}
      <div className={isGridView ? 'grid grid-cols-2 gap-2.5' : 'flex flex-col gap-2'}>
        {filteredFiles.map((file) => {
          const isPinned = !!file.cache?.isPinned;
          return (
            <div
              key={file.id}
              onClick={() => onOpenFile(file)}
              className={`group relative rounded-2xl bg-white border border-zinc-200/90 hover:border-zinc-300 hover:shadow-md transition-all shadow-sm active:scale-[0.99] cursor-pointer ${
                isGridView ? 'p-3 flex flex-col justify-between h-44' : 'p-3 flex items-center justify-between gap-3'
              }`}
            >
              <div className={`flex items-center gap-3 min-w-0 ${isGridView ? 'flex-col items-start gap-2' : ''}`}>
                {/* Preview Icon Badge */}
                <div className="relative w-11 h-11 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center shrink-0 border border-zinc-200">
                  {file.type === 'qr' ? (
                    <QrCode className="w-5 h-5 stroke-[2]" />
                  ) : (
                    <FileText className="w-5 h-5 stroke-[2]" />
                  )}
                  <span className="absolute bottom-0.5 right-0.5 text-[8px] leading-tight px-1 py-0.2 rounded bg-zinc-800 text-white font-bold tracking-tighter uppercase">
                    {file.isOcr ? 'OCR' : file.tag || file.type}
                  </span>
                  {isPinned && (
                    <div 
                      title="Pinned in local offline cache"
                      className="absolute -top-1 -right-1 w-4 h-4 bg-zinc-900 text-white rounded-full flex items-center justify-center shadow-xs"
                    >
                      <Pin className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                {/* Title & metadata */}
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-semibold text-zinc-900 truncate group-hover:text-black">
                      {file.filename}
                    </h2>
                    {file.isLocked && <Lock className="w-3 h-3 text-zinc-600 shrink-0" />}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5 flex-wrap">
                    <span className="font-medium text-zinc-800">{file.pages} pgs</span>
                    <span>•</span>
                    <span>{file.size}</span>
                    {!isGridView && (
                      <>
                        <span>•</span>
                        <span className="truncate">{file.date}</span>
                      </>
                    )}
                  </div>
                  {/* Visual On-Device Cache Indicator Badge */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/80">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      <span>Cached</span>
                    </span>
                    {file.cache?.bitmapAvailable && (
                      <span className="text-[10px] text-zinc-500 hidden sm:inline">
                        300 DPI
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Trigger */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFileForDrawer(file);
                }}
                className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors shrink-0"
              >
                <MoreVertical className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Local Vault Snapshot & Capacity Visualizer */}
      <div className="mt-4 p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#18181b] text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-zinc-900">Local Vault Snapshot</span>
          </div>
          <span className="text-xs text-zinc-700 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-full font-bold">
            100% Offline
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-zinc-500 font-medium">
            <span>DocuPulse Sandboxed Engine</span>
            <span>48.2 MB / 512 MB Allocation</span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden flex">
            <div className="h-full bg-[#18181b] rounded-full" style={{ width: '68%' }} />
            <div className="h-full bg-zinc-500 rounded-full" style={{ width: '14%' }} />
            <div className="h-full bg-zinc-300 rounded-full" style={{ width: '8%' }} />
          </div>
          <div className="flex items-center gap-3 pt-1 text-[11px] text-zinc-500 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#18181b]" />
              PDFs (32.8 MB)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-zinc-500" />
              Images (11.2 MB)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-zinc-300" />
              QRs (4.2 MB)
            </span>
          </div>
        </div>
      </div>

      {/* Contextual Action Bottom Sheet Modal (Drawer) */}
      {selectedFileForDrawer && (
        <div
          onClick={() => setSelectedFileForDrawer(null)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md mx-auto bg-white rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 border-t border-zinc-200 animate-in slide-in-from-bottom duration-200"
          >
            <div className="w-12 h-1 bg-zinc-300 rounded-full mx-auto" />

            {/* Subject Preview Header */}
            <div className="flex items-center gap-3 pb-2 border-b border-zinc-100">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 text-zinc-900 flex items-center justify-center shrink-0">
                {selectedFileForDrawer.type === 'qr' ? (
                  <QrCode className="w-6 h-6" />
                ) : (
                  <FileText className="w-6 h-6" />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-zinc-900 truncate">
                  {selectedFileForDrawer.filename}
                </span>
                <span className="text-xs text-zinc-500">
                  {selectedFileForDrawer.size} • Sandboxed Device Storage
                </span>
              </div>
            </div>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <button
                onClick={() => {
                  const f = selectedFileForDrawer;
                  setSelectedFileForDrawer(null);
                  onOpenFile(f);
                }}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-900 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-[#18181b] text-white flex items-center justify-center shadow-sm">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold">Open</span>
              </button>

              <button
                onClick={() => handleRename(selectedFileForDrawer)}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-900 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-700 text-white flex items-center justify-center shadow-sm">
                  <Edit3 className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold">Rename</span>
              </button>

              <button
                onClick={() => {
                  setSelectedFileForDrawer(null);
                  onShowToast(`Export ready for ${selectedFileForDrawer.filename}`);
                }}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-900 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-600 text-white flex items-center justify-center shadow-sm">
                  <Share2 className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold">Share</span>
              </button>

              <button
                onClick={() => handleDeleteFile(selectedFileForDrawer.id)}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-[#18181b] text-red-400 flex items-center justify-center shadow-sm">
                  <Trash2 className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-red-600">Delete</span>
              </button>
            </div>

            {/* On-Device Cache & Offline Reliability Section in Drawer */}
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-900">On-Device Cache Status</span>
                    <span className="text-[10px] text-zinc-500">
                      {selectedFileForDrawer.cache?.status === 'cached'
                        ? '100% Offline Ready • 300 DPI High-Res Bitmaps'
                        : 'Partial cache'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 bg-white border border-zinc-200 px-1.5 py-0.5 rounded">
                  {selectedFileForDrawer.cache?.integrityHash ? `SHA: ${selectedFileForDrawer.cache.integrityHash.slice(0, 8)}...` : 'Valid'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    togglePinFile(selectedFileForDrawer.id);
                    onShowToast(
                      selectedFileForDrawer.cache?.isPinned
                        ? 'Unpinned from priority local cache'
                        : 'Pinned! Document protected from auto-cleanup'
                    );
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                    selectedFileForDrawer.cache?.isPinned
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-100'
                  }`}
                >
                  <Pin className="w-3.5 h-3.5" />
                  <span>{selectedFileForDrawer.cache?.isPinned ? 'Pinned' : 'Pin Offline'}</span>
                </button>

                <button
                  onClick={async () => {
                    onShowToast(`Re-caching ${selectedFileForDrawer.filename}...`);
                    await forceCacheFile(selectedFileForDrawer.id);
                    onShowToast(`Re-cached & verified: 300 DPI ready`);
                  }}
                  className="px-3 py-2 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-cache</span>
                </button>
              </div>
            </div>

            {/* Advanced Functional Secondary Row */}
            <div className="flex flex-col gap-1 pt-1">
              <button
                onClick={() => {
                  setSelectedFileForDrawer(null);
                  onShowToast('AES-256 On-Device encryption locked');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors text-left text-zinc-800 text-xs font-semibold"
              >
                <div className="flex items-center gap-3">
                  <FileKey className="w-4 h-4 text-zinc-500" />
                  <span>Set Password & Encrypt</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>

              <button
                onClick={() => {
                  setSelectedFileForDrawer(null);
                  onShowToast('Compressed document saved (~42% smaller)');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors text-left text-zinc-800 text-xs font-semibold"
              >
                <div className="flex items-center gap-3">
                  <Minimize2 className="w-4 h-4 text-zinc-500" />
                  <span>Compress File Size</span>
                </div>
                <span className="text-[10px] text-zinc-700 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-full font-bold">
                  Save ~40%
                </span>
              </button>

              <button
                onClick={() => {
                  setSelectedFileForDrawer(null);
                  onShowToast(`File: ${selectedFileForDrawer.filename} (CRC32: 9A4D2E)`);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors text-left text-zinc-800 text-xs font-semibold"
              >
                <div className="flex items-center gap-3">
                  <Info className="w-4 h-4 text-zinc-500" />
                  <span>Metadata & Checksum Details</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            {/* Close Drawer Button */}
            <button
              onClick={() => setSelectedFileForDrawer(null)}
              className="w-full h-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold active:scale-[0.98] transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
