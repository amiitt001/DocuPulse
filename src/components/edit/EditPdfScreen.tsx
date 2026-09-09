import React, { useState } from 'react';
import { 
  Check, 
  GripVertical, 
  Lock, 
  Plus, 
  RotateCw, 
  Trash2, 
  ArrowUpDown, 
  Save, 
  Building2, 
  BarChart3, 
  Table, 
  ShieldCheck, 
  PenTool, 
  QrCode, 
  Touchpad
} from 'lucide-react';
import { PageCardItem } from '../../types';
import { INITIAL_PAGES } from '../../data/mockData';

interface EditPdfProps {
  onBack: () => void;
  onSave: () => void;
  onShowToast: (msg: string) => void;
}

export const EditPdfScreen: React.FC<EditPdfProps> = ({ onBack, onSave, onShowToast }) => {
  const [pages, setPages] = useState<PageCardItem[]>(INITIAL_PAGES);

  const selectedCount = pages.filter((p) => p.isSelected).length;

  const togglePageSelection = (id: number) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isSelected: !p.isSelected } : p))
    );
  };

  const handleSelectAll = () => {
    const allSelected = pages.every((p) => p.isSelected);
    setPages((prev) => prev.map((p) => ({ ...p, isSelected: !allSelected })));
    onShowToast(!allSelected ? 'Selected all 6 pages' : 'Deselected all pages');
  };

  const handleRotateSelected = () => {
    if (selectedCount === 0) {
      onShowToast('Please select pages to rotate');
      return;
    }
    setPages((prev) =>
      prev.map((p) =>
        p.isSelected ? { ...p, rotation: (p.rotation + 90) % 360 } : p
      )
    );
    onShowToast(`Rotated ${selectedCount} selected page(s) by 90°`);
  };

  const handleDeleteSelected = () => {
    if (selectedCount === 0) {
      onShowToast('No pages selected to delete');
      return;
    }
    if (pages.length <= selectedCount) {
      onShowToast('Document must contain at least 1 page');
      return;
    }
    setPages((prev) => prev.filter((p) => !p.isSelected));
    onShowToast(`Deleted ${selectedCount} page(s)`);
  };

  const handleAddPage = () => {
    const newPageNum = pages.length + 1;
    const newPage: PageCardItem = {
      id: Date.now(),
      pageNum: newPageNum,
      title: `Supplemental Appendix ${newPageNum}`,
      type: 'text',
      rotation: 0,
      isSelected: false,
      footerLabel: `Pg ${newPageNum}`,
    };
    setPages([...pages, newPage]);
    onShowToast(`Added page ${newPageNum}`);
  };

  const handleReverseOrder = () => {
    setPages([...pages].reverse());
    onShowToast('Reordered page sequence');
  };

  const renderThumbnail = (page: PageCardItem) => {
    switch (page.type) {
      case 'cover':
        return (
          <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col gap-1.5">
              <div className="w-12 h-2 rounded bg-zinc-400" />
              <div className="w-20 h-1.5 rounded bg-zinc-300" />
              <div className="w-full h-10 mt-1 rounded bg-zinc-100 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-zinc-400" />
              </div>
              <div className="space-y-1 mt-1">
                <div className="w-full h-1 bg-zinc-200 rounded" />
                <div className="w-4/5 h-1 bg-zinc-200 rounded" />
                <div className="w-3/5 h-1 bg-zinc-200 rounded" />
              </div>
            </div>
            <div className="pt-2 flex justify-between items-center text-zinc-400">
              <span className="text-[9px] font-bold">ANNUAL '24</span>
              <ShieldCheck className="w-3 h-3 text-zinc-400" />
            </div>
          </div>
        );

      case 'chart':
        return (
          <div className="space-y-1.5 flex flex-col justify-between h-full">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="w-14 h-1.5 rounded bg-zinc-800" />
                <BarChart3 className="w-3 h-3 text-zinc-800" />
              </div>
              {/* Sparkline Bar Chart visualization */}
              <div className="h-12 w-full pt-1 flex items-end gap-1 px-1">
                <div className="w-1/6 h-[35%] bg-zinc-300 rounded-t-sm" />
                <div className="w-1/6 h-[55%] bg-zinc-400 rounded-t-sm" />
                <div className="w-1/6 h-[45%] bg-zinc-300 rounded-t-sm" />
                <div className="w-1/6 h-[75%] bg-zinc-600 rounded-t-sm" />
                <div className="w-1/6 h-[60%] bg-zinc-500 rounded-t-sm" />
                <div className="w-1/6 h-[95%] bg-[#18181b] rounded-t-sm" />
              </div>
              <div className="space-y-1 pt-1">
                <div className="w-full h-1 bg-zinc-200 rounded" />
                <div className="w-full h-1 bg-zinc-200 rounded" />
                <div className="w-2/3 h-1 bg-zinc-200 rounded" />
              </div>
            </div>
            <div className="flex justify-between items-center text-zinc-500 text-[9px]">
              <span>Q1-Q4 EBITDA</span>
              <span className="font-bold text-zinc-900">+18.4%</span>
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="space-y-1.5 flex flex-col justify-between h-full">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="w-14 h-1.5 rounded bg-zinc-800" />
                <Table className="w-3 h-3 text-zinc-700" />
              </div>
              {/* Mini Table layout */}
              <div className="grid grid-cols-3 gap-1 pt-1">
                <div className="h-2 rounded bg-zinc-200" />
                <div className="h-2 rounded bg-zinc-200" />
                <div className="h-2 rounded bg-zinc-200" />
                <div className="h-1.5 rounded bg-zinc-200/60" />
                <div className="h-1.5 rounded bg-zinc-200/60" />
                <div className="h-1.5 rounded bg-zinc-200/60" />
                <div className="h-1.5 rounded bg-zinc-200/60" />
                <div className="h-1.5 rounded bg-zinc-200/60" />
                <div className="h-1.5 rounded bg-zinc-200/60" />
              </div>
              <div className="space-y-1 pt-1">
                <div className="w-full h-1 bg-zinc-200 rounded" />
                <div className="w-2/3 h-1 bg-zinc-200 rounded" />
              </div>
            </div>
            <div className="flex justify-between items-center text-zinc-400 text-[9px]">
              <span>SECTION IV</span>
              <ShieldCheck className="w-3 h-3 text-zinc-700" />
            </div>
          </div>
        );

      case 'pie':
        return (
          <div className="space-y-1.5 flex flex-col justify-between h-full">
            <div className="space-y-1.5">
              <div className="w-14 h-1.5 rounded bg-zinc-800" />
              <div className="w-full h-1 bg-zinc-200 rounded" />
              <div className="w-3/4 h-1 bg-zinc-200 rounded" />
              <div className="flex items-center justify-center py-1">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-zinc-200"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                  />
                  <path
                    className="text-zinc-600"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="60, 100"
                    strokeWidth="6"
                  />
                  <path
                    className="text-[#18181b]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="25, 100"
                    strokeDashoffset="-60"
                    strokeWidth="6"
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-between items-center text-zinc-400 text-[9px]">
              <span>DISTRIBUTION</span>
              <span>Pg {page.pageNum}</span>
            </div>
          </div>
        );

      case 'signatures':
        return (
          <div className="space-y-1.5 flex flex-col justify-between h-full">
            <div className="space-y-1.5">
              <div className="w-16 h-1.5 rounded bg-zinc-800" />
              <div className="w-full h-1 bg-zinc-200 rounded" />
              <div className="w-3/4 h-1 bg-zinc-200 rounded" />
              <div className="pt-2 grid grid-cols-2 gap-1.5">
                <div className="p-1 rounded bg-zinc-100 flex flex-col items-center">
                  <PenTool className="w-3 h-3 text-zinc-600" />
                  <div className="w-6 h-0.5 bg-zinc-300 rounded mt-1" />
                </div>
                <div className="p-1 rounded bg-zinc-100 flex flex-col items-center">
                  <PenTool className="w-3 h-3 text-zinc-600" />
                  <div className="w-6 h-0.5 bg-zinc-300 rounded mt-1" />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center text-zinc-400 text-[9px]">
              <span>EXECUTED</span>
              <QrCode className="w-3 h-3 text-zinc-600" />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-1.5 flex flex-col justify-between h-full">
            <div className="space-y-1.5">
              <div className="w-16 h-2 rounded bg-zinc-800" />
              <div className="w-full h-1 bg-zinc-200 rounded" />
              <div className="w-full h-1 bg-zinc-200 rounded" />
              <div className="w-5/6 h-1 bg-zinc-200 rounded" />
              <div className="w-full h-1 bg-zinc-200 rounded" />
              <div className="w-4/6 h-1 bg-zinc-200 rounded" />
            </div>
            <div className="pt-1 flex justify-between items-center text-zinc-400 text-[9px]">
              <div className="w-8 h-1.5 rounded bg-zinc-300" />
              <span>Pg {page.pageNum}</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pt-20 pb-44 px-4 select-none relative">
      {/* Top Operational Sub-bar */}
      <div className="flex items-center justify-between gap-2 py-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-zinc-900 truncate">Edit PDF</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-800 text-[11px] font-bold">
                {pages.length} Pgs
              </span>
            </div>
            <span className="text-xs text-zinc-500 truncate">Annual_Report_2024.pdf</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSelectAll}
            className="h-8 px-3 rounded-full flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-zinc-900 text-xs font-semibold transition-all border border-zinc-200"
          >
            <span>{pages.every((p) => p.isSelected) ? 'Deselect All' : 'Select All'}</span>
          </button>
          <button
            onClick={onSave}
            aria-label="Confirm Changes"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-[#18181b] text-white shadow-md active:scale-90 transition-transform"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Status & Quick Filter Banner */}
      <div className="flex items-center justify-between p-3 mb-4 rounded-xl bg-zinc-100/90 border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-200 text-zinc-800 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-900">Local Sandbox Workspace</p>
            <p className="text-[11px] text-zinc-500">Changes saved to device cache instantly</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-zinc-200 px-2.5 py-1 rounded-full text-zinc-900 text-xs font-bold">
          <span>{selectedCount} Selected</span>
        </div>
      </div>

      {/* Page Grid (2 Columns) */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {pages.map((page, idx) => {
          const isSelected = page.isSelected;
          return (
            <div
              key={page.id}
              onClick={() => togglePageSelection(page.id)}
              className={`relative flex flex-col rounded-2xl bg-white transition-all cursor-pointer overflow-hidden p-2 shadow-sm ${
                isSelected
                  ? 'border-2 border-zinc-900 shadow-md ring-1 ring-zinc-900'
                  : 'border border-zinc-200 hover:border-zinc-300 hover:shadow-md'
              }`}
            >
              {isSelected && (
                <div className="absolute inset-0 rounded-2xl pointer-events-none bg-zinc-900/5 z-0" />
              )}

              {/* Header row inside card */}
              <div className="flex items-center justify-between mb-1.5 px-0.5 relative z-10">
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                    isSelected ? 'bg-[#18181b] text-white' : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {idx + 1}
                </span>

                <div className="flex items-center gap-1">
                  <GripVertical className="w-4 h-4 text-zinc-400 opacity-60" />
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-[#18181b] text-white shadow-sm' : 'bg-zinc-100 text-zinc-400'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>

              {/* Document Thumbnail Render */}
              <div
                style={{ transform: `rotate(${page.rotation}deg)` }}
                className="aspect-[3/4] w-full rounded-xl bg-zinc-50 border border-zinc-200/80 p-2.5 flex flex-col justify-between overflow-hidden shadow-inner relative z-10 transition-transform duration-200"
              >
                {renderThumbnail(page)}
              </div>

              {/* Footer info */}
              <div className="mt-1.5 flex items-center justify-between px-0.5 relative z-10">
                <span
                  className={`text-[11px] truncate font-medium ${
                    isSelected ? 'font-bold text-zinc-900' : 'text-zinc-600'
                  }`}
                >
                  {page.title}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">{page.rotation}°</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reorder affordance prompt */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-zinc-500 text-xs font-medium">
        <Touchpad className="w-4 h-4 text-zinc-600" />
        <span>Press and drag handles to reorganize page flow</span>
      </div>

      {/* Sticky Floating Action Suite */}
      <div className="fixed bottom-6 left-0 right-0 px-4 z-40 flex flex-col gap-2 pointer-events-none max-w-md mx-auto">
        {/* Tonal Pill Quick Actions */}
        <div className="pointer-events-auto w-full bg-[#18181b] text-white rounded-full shadow-2xl backdrop-blur-md px-2 py-1.5 flex items-center justify-between gap-1 border border-zinc-800 transition-all">
          {/* Add Pages */}
          <button
            onClick={handleAddPage}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-1 rounded-full hover:bg-zinc-800 active:scale-95 transition-all text-zinc-100 text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>

          <div className="w-px h-4 bg-zinc-700" />

          {/* Rotate */}
          <button
            onClick={handleRotateSelected}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-1 rounded-full hover:bg-zinc-800 active:scale-95 transition-all text-zinc-100 text-xs font-semibold"
          >
            <RotateCw className="w-4 h-4" />
            <span>Rotate</span>
          </button>

          <div className="w-px h-4 bg-zinc-700" />

          {/* Delete */}
          <button
            onClick={handleDeleteSelected}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-1 rounded-full active:scale-95 transition-all text-xs font-semibold ${
              selectedCount > 0
                ? 'text-red-400 hover:bg-red-500/20'
                : 'text-zinc-500 opacity-50 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete ({selectedCount})</span>
          </button>

          <div className="w-px h-4 bg-zinc-700" />

          {/* Reorder */}
          <button
            onClick={handleReverseOrder}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-1 rounded-full hover:bg-zinc-800 active:scale-95 transition-all text-zinc-100 text-xs font-semibold"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>Reorder</span>
          </button>
        </div>

        {/* Primary Action: Save PDF */}
        <div className="pointer-events-auto w-full">
          <button
            onClick={onSave}
            className="w-full h-12 rounded-xl bg-[#18181b] hover:bg-zinc-800 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.99] transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save PDF ({pages.length} Pages)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
