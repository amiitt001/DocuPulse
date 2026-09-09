import React, { useState } from 'react';
import { 
  FileText, 
  Lock, 
  Search, 
  Bookmark, 
  MoreVertical, 
  X, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  TrendingUp, 
  ShieldCheck, 
  Fingerprint, 
  List, 
  Maximize2, 
  Minimize2, 
  Share2, 
  Printer, 
  Eye, 
  Info, 
  Trash2,
  UnfoldVertical,
  CheckCircle2,
  HardDriveDownload,
  Pin,
  RefreshCw,
  WifiOff
} from 'lucide-react';
import { useSync } from '../../context/SyncContext';

interface DocumentViewerProps {
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

export const DocumentViewerScreen: React.FC<DocumentViewerProps> = ({ onBack, onShowToast }) => {
  const {
    effectiveOnline,
    openCacheModal,
    triggerSyncAll,
    syncState
  } = useSync();

  const [currentPage, setCurrentPage] = useState<number>(3);
  const totalPages = 18;
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isJumpModalOpen, setIsJumpModalOpen] = useState<boolean>(false);
  const [jumpPageInput, setJumpPageInput] = useState<string>('3');
  const [readingMode, setReadingMode] = useState<boolean>(false);
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);

  const handlePageChange = (delta: number) => {
    const next = currentPage + delta;
    if (next >= 1 && next <= totalPages) {
      setCurrentPage(next);
      setJumpPageInput(next.toString());
      onShowToast(`Navigated to page ${next}`);
    } else {
      onShowToast(delta < 0 ? "You're on the first page" : 'End of document reached');
    }
  };

  const handleJumpSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseInt(jumpPageInput, 10);
    if (!isNaN(val) && val >= 1 && val <= totalPages) {
      setCurrentPage(val);
      setIsJumpModalOpen(false);
      onShowToast(`Jumped to Page ${val}`);
    } else {
      onShowToast('Please enter a valid page number (1-18)');
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onShowToast(!isBookmarked ? 'Page saved to local bookmarks' : 'Bookmark removed');
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
    onShowToast(!isZoomed ? 'Zoom: 115% (Fit Width)' : 'Zoom: Reset to 100%');
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto pt-20 pb-28 px-4 select-none relative">
      {/* Top Document Context & Quick Action Ribbon */}
      <div className="flex items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-900 flex items-center justify-center shrink-0 shadow-sm">
            <FileText className="w-4 h-4 stroke-[2]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-zinc-900 truncate">
              Quarterly_Financial_Summary.pdf
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium">
              <span>1.4 MB • PDF v1.7</span>
              <span className="w-1 h-1 rounded-full bg-zinc-300" />
              <button
                onClick={openCacheModal}
                title="View on-device offline cache details"
                className="text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-1.5 py-0.2 rounded text-[10px] font-bold inline-flex items-center gap-1 transition-colors"
              >
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                <span>Cached (Offline)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Document Appbar Actions */}
        <div className="flex items-center gap-1 shrink-0 relative">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search Document"
            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-600 hover:bg-zinc-100 active:scale-95 transition-all"
          >
            <Search className="w-4 h-4 stroke-[2]" />
          </button>
          <button
            onClick={toggleBookmark}
            aria-label="Bookmark Page"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              isBookmarked ? 'text-zinc-950 fill-zinc-950' : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 stroke-[2] ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Overflow Menu"
            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-600 hover:bg-zinc-100 active:scale-95 transition-all"
          >
            <MoreVertical className="w-4 h-4 stroke-[2]" />
          </button>

          {/* Quick Document Overflow Menu Dropdown */}
          {isMenuOpen && (
            <div className="absolute top-11 right-0 z-50 bg-white text-zinc-900 border border-zinc-200 rounded-2xl shadow-xl p-1.5 w-56 flex flex-col gap-0.5 animate-in fade-in duration-150">
              <button
                onClick={() => {
                  setReadingMode(!readingMode);
                  setIsMenuOpen(false);
                  onShowToast(!readingMode ? 'Reading mode activated' : 'Standard view restored');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-zinc-100 text-left text-xs font-semibold text-zinc-800"
              >
                <Eye className="w-4 h-4 text-zinc-500" />
                <span>Reading Mode ({readingMode ? 'ON' : 'OFF'})</span>
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  openCacheModal();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-zinc-100 text-left text-xs font-semibold text-zinc-800"
              >
                <HardDriveDownload className="w-4 h-4 text-emerald-600" />
                <span>On-Device Cache Status</span>
              </button>
              <button
                onClick={async () => {
                  setIsMenuOpen(false);
                  onShowToast('Verifying local document bitmaps...');
                  await triggerSyncAll();
                  onShowToast('100% Verified: Ready for zero-cloud offline reading');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-zinc-100 text-left text-xs font-semibold text-zinc-800"
              >
                <RefreshCw className="w-4 h-4 text-zinc-500" />
                <span>Verify Local Cache</span>
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onShowToast('SHA-256 Checksum: c849b2... verified');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-zinc-100 text-left text-xs font-semibold text-zinc-800"
              >
                <Info className="w-4 h-4 text-zinc-500" />
                <span>File Metadata</span>
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  window.print?.();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-zinc-100 text-left text-xs font-semibold text-zinc-800"
              >
                <Printer className="w-4 h-4 text-zinc-500" />
                <span>Print Document</span>
              </button>
              <div className="h-px bg-zinc-200 my-1" />
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onShowToast('Local sandbox copy cleared');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50 text-left text-xs font-semibold text-red-600"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
                <span>Delete Local Copy</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Popover Drawer */}
      {isSearchOpen && (
        <div className="flex flex-col gap-2 p-3 mb-3 rounded-2xl bg-zinc-100 border border-zinc-200 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-zinc-200">
            <Search className="w-4 h-4 text-zinc-500 shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in page or entire PDF..."
              className="w-full bg-transparent text-sm text-zinc-900 focus:outline-none placeholder:text-zinc-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-zinc-500 hover:text-zinc-800 ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-zinc-500 font-medium">
              {searchQuery ? '3 matches found on Page 3' : 'Type keywords to highlight'}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onShowToast('Previous match')}
                className="w-7 h-7 rounded-lg bg-zinc-200/80 hover:bg-zinc-300 flex items-center justify-center text-zinc-700 active:scale-95"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => onShowToast('Next match')}
                className="w-7 h-7 rounded-lg bg-zinc-200/80 hover:bg-zinc-300 flex items-center justify-center text-zinc-700 active:scale-95"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Central High-Fidelity PDF Document Canvas */}
      <div className="relative w-full flex justify-center items-start overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-200/80 p-2 sm:p-4">
        {/* Paper Sheet Container (High-Res 8.5x11 Ratio Paper Simulation) */}
        <div
          className={`w-full max-w-xl rounded-xl shadow-md border border-zinc-200/90 overflow-hidden relative transition-all duration-300 ease-out ${
            readingMode ? 'bg-[#18181b] text-zinc-100' : 'bg-white text-zinc-900'
          } ${isZoomed ? 'scale-[1.08] shadow-xl' : 'scale-100'}`}
        >
          {/* Top Paper Edge Header Info */}
          <div className="px-5 pt-5 pb-2 flex items-center justify-between border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#18181b] text-white flex items-center justify-center text-[10px] font-bold">
                DP
              </div>
              <span className="text-[11px] text-zinc-500 tracking-wider uppercase font-semibold">
                DocuPulse Global Financial Group
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 text-[10px] font-bold">
                CONFIDENTIAL
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Q3-FINAL</span>
            </div>
          </div>

          {/* PDF Page Content Body */}
          <div className="px-5 py-4 flex flex-col gap-4">
            {/* Section Header */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-zinc-600 uppercase tracking-wider font-bold">
                Section 03 • Operations & Yield
              </span>
              <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${readingMode ? 'text-white' : 'text-zinc-900'}`}>
                Key Execution Metrics & Net Cap Structure
              </h2>
              <p className="text-xs text-zinc-500 font-normal">
                Audit window: July 01 – September 30 • Local consensus validation completed with zero discrepancies.
              </p>
            </div>

            {/* Metric Highlight Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-xl border flex flex-col gap-1 ${readingMode ? 'bg-zinc-800/80 border-zinc-700' : 'bg-zinc-50 border-zinc-200/80'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-medium">Gross Adjusted Net</span>
                  <TrendingUp className="w-4 h-4 text-zinc-700" />
                </div>
                <span className={`text-2xl font-bold tracking-tight ${readingMode ? 'text-white' : 'text-zinc-900'}`}>
                  $42.85M
                </span>
                <span className="text-[11px] text-zinc-600 font-semibold">+18.4% YoY vs Benchmark</span>
              </div>

              <div className={`p-3 rounded-xl border flex flex-col gap-1 ${readingMode ? 'bg-zinc-800/80 border-zinc-700' : 'bg-zinc-50 border-zinc-200/80'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-medium">Burn Liquidity Ratio</span>
                  <ShieldCheck className="w-4 h-4 text-zinc-700" />
                </div>
                <span className={`text-2xl font-bold tracking-tight ${readingMode ? 'text-white' : 'text-zinc-900'}`}>
                  3.92x
                </span>
                <span className="text-[11px] text-zinc-600 font-semibold">Tier-1 Capital Reserves</span>
              </div>
            </div>

            {/* Realistic Inline SVG Vector Performance Chart */}
            <div className={`p-3.5 rounded-xl border flex flex-col gap-2 ${readingMode ? 'bg-zinc-800/80 border-zinc-700' : 'bg-zinc-50 border-zinc-200/80'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-zinc-900" />
                  <span className={`text-xs font-semibold ${readingMode ? 'text-zinc-200' : 'text-zinc-800'}`}>
                    Yield Trajectory (Trailing 90 Days)
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500 font-mono">Local Target: 99.4%</span>
              </div>

              <div className="w-full h-24 pt-1 flex items-end">
                <svg className="w-full h-full overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 320 80">
                  <defs>
                    <linearGradient id="yieldFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#18181b" stopOpacity="0.14" />
                      <stop offset="100%" stopColor="#18181b" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,65 L32,60 L64,52 L96,56 L128,40 L160,42 L192,28 L224,30 L256,18 L288,22 L320,10 L320,80 L0,80 Z"
                    fill="url(#yieldFill)"
                  />
                  <path
                    d="M0,65 L32,60 L64,52 L96,56 L128,40 L160,42 L192,28 L224,30 L256,18 L288,22 L320,10"
                    stroke={readingMode ? '#f4f4f5' : '#18181b'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="192" cy="28" r="3.5" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
                  <circle cx="320" cy="10" r="3.5" fill={readingMode ? '#ffffff' : '#18181b'} />
                </svg>
              </div>

              <div className="flex justify-between text-[11px] text-zinc-400 px-1 font-mono">
                <span>Wk 01</span>
                <span>Wk 04</span>
                <span>Wk 08</span>
                <span>Wk 12</span>
              </div>
            </div>

            {/* Synthesized Financial Statement Table */}
            <div className={`rounded-xl border overflow-hidden ${readingMode ? 'border-zinc-700' : 'border-zinc-200/80 bg-zinc-50'}`}>
              <div className="grid grid-cols-12 bg-zinc-100/90 border-b border-zinc-200/80 px-3 py-2 text-zinc-600 text-[11px] font-bold">
                <span className="col-span-6">Instrument / Allocation</span>
                <span className="col-span-3 text-right">Yield</span>
                <span className="col-span-3 text-right">Status</span>
              </div>
              <div className="grid grid-cols-12 px-3 py-2 text-xs text-zinc-800 items-center">
                <span className="col-span-6 font-medium truncate">Institutional Sovereign Reserve</span>
                <span className="col-span-3 text-right font-mono text-zinc-600">5.42%</span>
                <span className="col-span-3 text-right text-zinc-700 font-semibold">Secured</span>
              </div>
              <div className="grid grid-cols-12 px-3 py-2 text-xs text-zinc-800 items-center bg-white/70">
                <span className="col-span-6 font-medium truncate">Short-term Commercial Paper</span>
                <span className="col-span-3 text-right font-mono text-zinc-600">4.89%</span>
                <span className="col-span-3 text-right text-zinc-700 font-semibold">Secured</span>
              </div>
              <div className="grid grid-cols-12 px-3 py-2 text-xs text-zinc-800 items-center">
                <span className="col-span-6 font-medium truncate">Synthetic On-Device Hedging</span>
                <span className="col-span-3 text-right font-mono text-zinc-600">6.12%</span>
                <span className="col-span-3 text-right text-zinc-700 font-semibold">Active</span>
              </div>
            </div>

            {/* Realistic Paragraph Body */}
            <p className={`text-xs leading-relaxed text-justify font-normal ${readingMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
              The consolidated assets reflect positive variance within discretionary allocations. Stress tests confirm sustained risk tolerance under elevated macro volatility without requiring liquidity intervention. Localized client-side signatures retain integrity with zero reliance on remote token issuers.
            </p>

            {/* Document Signoff Stamp */}
            <div className="flex items-center justify-between pt-2 pb-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-400 font-medium">Verified by Hardware Security Module</span>
                <span className="text-xs font-bold text-zinc-800">DocuPulse Local Core v4.12.0</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-semibold">
                <Fingerprint className="w-3.5 h-3.5 text-zinc-700" />
                <span>SHA-256 Validated</span>
              </div>
            </div>
          </div>

          {/* Page Watermark / Footer Strip */}
          <div className="w-full py-2 px-5 bg-zinc-50 border-t border-zinc-200/70 flex justify-between items-center text-zinc-400 text-[11px] font-medium">
            <span>DocuPulse Private Reader Engine</span>
            <span className="font-bold text-zinc-700">PAGE {currentPage} OF {totalPages}</span>
          </div>
        </div>
      </div>

      {/* Jump-to-Page Modal Overlay */}
      {isJumpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-zinc-900 w-full max-w-xs rounded-2xl p-5 shadow-2xl border border-zinc-200 flex flex-col gap-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900">Jump to Page</h3>
              <button
                onClick={() => setIsJumpModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleJumpSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500 font-medium">
                  Enter page number (1 - {totalPages})
                </label>
                <div className="flex items-center gap-2 bg-zinc-100 px-3 py-2 rounded-xl border border-zinc-200">
                  <BookOpen className="w-4 h-4 text-zinc-600" />
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={jumpPageInput}
                    onChange={(e) => setJumpPageInput(e.target.value)}
                    className="w-full bg-transparent text-base font-bold text-zinc-900 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsJumpModalOpen(false)}
                  className="px-3 py-2 rounded-lg text-zinc-600 text-xs font-semibold hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#18181b] text-white text-xs font-bold shadow-sm active:scale-95 transition-transform"
                >
                  Go
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table of Contents Drawer Modal */}
      {isTocOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end">
          <div className="w-full max-w-md mx-auto bg-white rounded-t-3xl p-5 shadow-2xl border-t border-zinc-200 flex flex-col gap-3 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1 bg-zinc-300 rounded-full mx-auto" />
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-base font-bold text-zinc-900">Document Outline</h3>
              <button onClick={() => setIsTocOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
              {[
                { page: 1, title: 'Cover & Executive Summary' },
                { page: 2, title: 'Section 01 • Macro Liquidity & Yield' },
                { page: 3, title: 'Section 03 • Operations & Net Cap Structure (Current)' },
                { page: 6, title: 'Section 04 • Regulatory & Compliance Audit' },
                { page: 12, title: 'Section 08 • Discretionary Balance Sheet' },
                { page: 18, title: 'Signatures, Seals & Local Proofs' },
              ].map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    setCurrentPage(item.page);
                    setIsTocOpen(false);
                    onShowToast(`Jumped to Page ${item.page}`);
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-colors ${
                    currentPage === item.page
                      ? 'bg-zinc-100 text-zinc-950 font-bold border border-zinc-200'
                      : 'hover:bg-zinc-50 text-zinc-700'
                  }`}
                >
                  <span className="truncate">{item.title}</span>
                  <span className="font-mono text-zinc-400 text-[11px] shrink-0">Pg {item.page}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Tonal Toolbar */}
      <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-40 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md bg-white border border-zinc-200/90 text-zinc-900 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-1.5 flex items-center justify-between">
          {/* Previous Page Arrow */}
          <button
            onClick={() => handlePageChange(-1)}
            aria-label="Previous Page"
            className="w-11 h-11 rounded-full flex items-center justify-center text-zinc-700 hover:bg-zinc-100 active:scale-90 transition-all"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Center Page Count Pill */}
          <button
            onClick={() => setIsJumpModalOpen(true)}
            className="px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200/70 hover:bg-zinc-200/70 flex items-center gap-1.5 text-zinc-900 active:scale-95 transition-all shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-zinc-700" />
            <span className="text-xs font-semibold tracking-tight">
              Page {currentPage} of {totalPages}
            </span>
            <UnfoldVertical className="w-3.5 h-3.5 text-zinc-500" />
          </button>

          {/* Next Page Arrow */}
          <button
            onClick={() => handlePageChange(1)}
            aria-label="Next Page"
            className="w-11 h-11 rounded-full flex items-center justify-center text-zinc-700 hover:bg-zinc-100 active:scale-90 transition-all"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Vertical Divider */}
          <div className="w-px h-6 bg-zinc-200 mx-0.5" />

          {/* Integrated Secondary Utility Actions */}
          <div className="flex items-center gap-0.5">
            {/* Table of Contents */}
            <button
              onClick={() => setIsTocOpen(true)}
              aria-label="Table of Contents"
              className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-600 hover:bg-zinc-100 active:scale-90 transition-all"
            >
              <List className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Zoom / Fit View Toggle */}
            <button
              onClick={toggleZoom}
              aria-label="Zoom Reset"
              className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-600 hover:bg-zinc-100 active:scale-90 transition-all"
            >
              {isZoomed ? (
                <Minimize2 className="w-4 h-4 stroke-[2]" />
              ) : (
                <Maximize2 className="w-4 h-4 stroke-[2]" />
              )}
            </button>

            {/* Share */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Quarterly Financial Summary',
                    text: 'Locally generated PDF from DocuPulse',
                  }).catch(() => {});
                } else {
                  onShowToast('Share link copied to clipboard');
                }
              }}
              aria-label="Export or Share"
              className="w-10 h-10 rounded-full bg-[#18181b] text-white flex items-center justify-center hover:bg-zinc-800 active:scale-90 transition-all shadow-sm"
            >
              <Share2 className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
