import React, { useState, useRef } from 'react';
import { 
  ScanLine, 
  RotateCcw, 
  Wand2, 
  Check, 
  X, 
  Sparkles, 
  RotateCw, 
  FileText, 
  Bolt, 
  Layers, 
  SunMedium, 
  Contrast, 
  Sliders, 
  Loader2 
} from 'lucide-react';
import { DocumentFilter } from '../../types';
import { CROP_DOCUMENT_SAMPLE_URL } from '../../data/mockData';

interface PerspectiveCropProps {
  onBack: () => void;
  onApply: () => void;
  onShowToast: (msg: string) => void;
}

export const PerspectiveCropScreen: React.FC<PerspectiveCropProps> = ({
  onBack,
  onApply,
  onShowToast,
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<DocumentFilter>('original');
  const [isEnhanced, setIsEnhanced] = useState<boolean>(false);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [skewText, setSkewText] = useState<string>('Warp: 1.4° Skew Corrected');

  // Interactive Quad Handles State (percentages 0-100)
  const initialCorners = {
    tl: { x: 12, y: 11 },
    tr: { x: 88, y: 8 },
    br: { x: 92.6, y: 90 },
    bl: { x: 8.6, y: 87 },
  };

  const [corners, setCorners] = useState(initialCorners);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeDragRef = useRef<keyof typeof corners | null>(null);

  const handlePointerDown = (cornerKey: keyof typeof corners, e: React.PointerEvent) => {
    activeDragRef.current = cornerKey;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeDragRef.current || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const clampedX = Math.max(2, Math.min(98, ((e.clientX - rect.left) / rect.width) * 100));
    const clampedY = Math.max(2, Math.min(98, ((e.clientY - rect.top) / rect.height) * 100));

    setCorners((prev) => ({
      ...prev,
      [activeDragRef.current!]: { x: clampedX, y: clampedY },
    }));
    setSkewText('Custom Tuning · Quad Calibrated');
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activeDragRef.current) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (_) {}
      activeDragRef.current = null;
    }
  };

  const handleAutoCrop = () => {
    setCorners({
      tl: { x: 6.6, y: 5 },
      tr: { x: 93.3, y: 5 },
      br: { x: 93.3, y: 95 },
      bl: { x: 6.6, y: 95 },
    });
    setSkewText('Auto Edge Detected: 0.0° Parallax');
    onShowToast('Auto edge calibrated with Neural Edge Engine');
  };

  const handleReset = () => {
    setCorners(initialCorners);
    setSkewText('Warp: 1.4° Skew Corrected');
    setRotation(0);
    setIsEnhanced(false);
    setActiveFilter('original');
    onShowToast('Crop geometry reset');
  };

  const handleRotate = () => {
    const nextAngle = (rotation + 90) % 360;
    setRotation(nextAngle);
    onShowToast(`Rotated to ${nextAngle}°`);
  };

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      onShowToast('Document compiled to PDF');
      setIsApplying(false);
      onApply();
    }, 600);
  };

  const getFilterStyle = (): React.CSSProperties => {
    let filterString = '';
    switch (activeFilter) {
      case 'magic':
        filterString = 'contrast(135%) saturate(120%) brightness(105%)';
        break;
      case 'grayscale':
        filterString = 'grayscale(100%) contrast(110%)';
        break;
      case 'bw':
        filterString = 'grayscale(100%) contrast(220%) brightness(95%)';
        break;
      case 'warm':
        filterString = 'sepia(30%) contrast(105%) brightness(102%)';
        break;
      case 'original':
      default:
        filterString = 'none';
        break;
    }
    if (isEnhanced && activeFilter === 'original') {
      filterString = 'contrast(125%) brightness(108%)';
    }
    return {
      filter: filterString,
      transform: `rotate(${rotation}deg)`,
      transition: 'transform 0.2s ease, filter 0.2s ease',
    };
  };

  // Convert percentage coordinates to 300x400 viewBox
  const ptTL = { x: (corners.tl.x / 100) * 300, y: (corners.tl.y / 100) * 400 };
  const ptTR = { x: (corners.tr.x / 100) * 300, y: (corners.tr.y / 100) * 400 };
  const ptBR = { x: (corners.br.x / 100) * 300, y: (corners.br.y / 100) * 400 };
  const ptBL = { x: (corners.bl.x / 100) * 300, y: (corners.bl.y / 100) * 400 };
  const polygonPoints = `${ptTL.x},${ptTL.y} ${ptTR.x},${ptTR.y} ${ptBR.x},${ptBR.y} ${ptBL.x},${ptBL.y}`;

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pt-20 pb-28 px-4 select-none">
      {/* Sub-bar: Utility Controls */}
      <div className="flex items-center justify-between py-2 mb-3">
        <div className="flex items-center gap-2">
          <ScanLine className="w-5 h-5 text-zinc-900" />
          <span className="text-sm font-semibold text-zinc-900">Page 1 of 3</span>
          <span className="px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-[11px] font-bold">
            300 DPI
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="h-8 px-3 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleAutoCrop}
            className="h-8 px-3 rounded-full bg-[#18181b] hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 shadow-sm"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Auto-crop</span>
          </button>
        </div>
      </div>

      {/* Perspective Warp Document Stage */}
      <div className="relative w-full rounded-2xl bg-zinc-100 border border-zinc-200/80 overflow-hidden shadow-sm flex items-center justify-center p-3 mb-4">
        {/* Live Document & SVG Crop Canvas Overlay Container */}
        <div
          ref={stageRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative w-full aspect-[3/4] max-h-[380px] bg-zinc-200 rounded-xl overflow-hidden flex items-center justify-center shadow-inner touch-none"
        >
          {/* Document Underlay Image */}
          <img
            src={CROP_DOCUMENT_SAMPLE_URL}
            alt="Scanned Legal Document"
            referrerPolicy="no-referrer"
            style={getFilterStyle()}
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          />

          {/* Interactive Warp & Grid SVG Overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 300 400"
            preserveAspectRatio="none"
          >
            <defs>
              <radialGradient id="meshGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#18181b" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#18181b" stopOpacity="0.02" />
              </radialGradient>
            </defs>
            {/* Quad Polygon Shading */}
            <polygon
              points={polygonPoints}
              fill="url(#meshGlow)"
              stroke="#18181b"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            {/* Perspective Internal 3x3 Rule-of-Thirds Grid Lines */}
            <line
              x1={(ptTL.x * 2 + ptTR.x) / 3}
              y1={(ptTL.y * 2 + ptTR.y) / 3}
              x2={(ptBL.x * 2 + ptBR.x) / 3}
              y2={(ptBL.y * 2 + ptBR.y) / 3}
              stroke="#18181b"
              strokeOpacity="0.45"
              strokeWidth="0.8"
            />
            <line
              x1={(ptTL.x + ptTR.x * 2) / 3}
              y1={(ptTL.y + ptTR.y * 2) / 3}
              x2={(ptBL.x + ptBR.x * 2) / 3}
              y2={(ptBL.y + ptBR.y * 2) / 3}
              stroke="#18181b"
              strokeOpacity="0.45"
              strokeWidth="0.8"
            />
            <line
              x1={(ptTL.x * 2 + ptBL.x) / 3}
              y1={(ptTL.y * 2 + ptBL.y) / 3}
              x2={(ptTR.x * 2 + ptBR.x) / 3}
              y2={(ptTR.y * 2 + ptBR.y) / 3}
              stroke="#18181b"
              strokeOpacity="0.45"
              strokeWidth="0.8"
            />
            <line
              x1={(ptTL.x + ptBL.x * 2) / 3}
              y1={(ptTL.y + ptBL.y * 2) / 3}
              x2={(ptTR.x + ptBR.x * 2) / 3}
              y2={(ptTR.y + ptBR.y * 2) / 3}
              stroke="#18181b"
              strokeOpacity="0.45"
              strokeWidth="0.8"
            />
          </svg>

          {/* Corner Circular Draggable Handles */}
          {/* Top Left */}
          <div
            onPointerDown={(e) => handlePointerDown('tl', e)}
            className="absolute z-20 w-8 h-8 rounded-full bg-white shadow-lg border border-zinc-300 flex items-center justify-center cursor-move touch-none active:scale-125 transition-transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${corners.tl.x}%`, top: `${corners.tl.y}%` }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-[#18181b] flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white" />
            </div>
          </div>

          {/* Top Right */}
          <div
            onPointerDown={(e) => handlePointerDown('tr', e)}
            className="absolute z-20 w-8 h-8 rounded-full bg-white shadow-lg border border-zinc-300 flex items-center justify-center cursor-move touch-none active:scale-125 transition-transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${corners.tr.x}%`, top: `${corners.tr.y}%` }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-[#18181b] flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white" />
            </div>
          </div>

          {/* Bottom Right */}
          <div
            onPointerDown={(e) => handlePointerDown('br', e)}
            className="absolute z-20 w-8 h-8 rounded-full bg-white shadow-lg border border-zinc-300 flex items-center justify-center cursor-move touch-none active:scale-125 transition-transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${corners.br.x}%`, top: `${corners.br.y}%` }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-[#18181b] flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white" />
            </div>
          </div>

          {/* Bottom Left */}
          <div
            onPointerDown={(e) => handlePointerDown('bl', e)}
            className="absolute z-20 w-8 h-8 rounded-full bg-white shadow-lg border border-zinc-300 flex items-center justify-center cursor-move touch-none active:scale-125 transition-transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${corners.bl.x}%`, top: `${corners.bl.y}%` }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-[#18181b] flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white" />
            </div>
          </div>

          {/* Dynamic Crosshair / Precision Indicator Badge */}
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900/85 backdrop-blur-md text-white shadow-sm text-xs font-semibold">
            <Sliders className="w-3.5 h-3.5 text-zinc-300" />
            <span>{skewText}</span>
          </div>

          {/* Geometric Alignment Guide Pill */}
          <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-zinc-800 border border-zinc-200 shadow-sm text-xs font-semibold">
            <ScanLine className="w-3.5 h-3.5 text-zinc-600" />
            <span>A4 Ratio · 2480 × 3508</span>
          </div>
        </div>
      </div>

      {/* Mid-screen Quick Action Pills Strip */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 mb-4 select-none">
        {/* Active Tool: Perspective Crop */}
        <button className="h-9 px-3.5 rounded-full bg-[#18181b] text-white text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shadow-sm active:scale-95 transition-transform shrink-0">
          <ScanLine className="w-4 h-4" />
          <span>Perspective Crop</span>
        </button>

        {/* Rotate Action */}
        <button
          onClick={handleRotate}
          className="h-9 px-3.5 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap active:scale-95 transition-all shrink-0"
        >
          <RotateCw className="w-4 h-4 text-zinc-700" />
          <span>Rotate 90°</span>
        </button>

        {/* Auto-Enhance Action */}
        <button
          onClick={() => {
            setIsEnhanced(!isEnhanced);
            onShowToast(!isEnhanced ? 'Auto-Enhance enabled' : 'Auto-Enhance off');
          }}
          className={`h-9 px-3.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap active:scale-95 transition-all shrink-0 ${
            isEnhanced
              ? 'bg-[#18181b] text-white border-zinc-900'
              : 'bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Auto-Enhance</span>
        </button>

        {/* Page Size Format */}
        <button
          onClick={() => onShowToast('Page format locked to Standard A4')}
          className="h-9 px-3.5 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap active:scale-95 transition-all shrink-0"
        >
          <FileText className="w-4 h-4 text-zinc-600" />
          <span>Page Size (A4)</span>
        </button>
      </div>

      {/* Document Enhancement / Color Filter Section */}
      <div className="flex flex-col mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
            Document Processing Filter
          </span>
          <div className="flex items-center gap-1 text-zinc-700 text-xs font-semibold">
            <Bolt className="w-3.5 h-3.5 text-zinc-900 fill-zinc-900" />
            <span>Zero Loss Vector Output</span>
          </div>
        </div>

        {/* Filter Swatch Grid */}
        <div className="grid grid-cols-5 gap-2">
          {[
            { id: 'original' as DocumentFilter, label: 'Original', icon: FileText },
            { id: 'magic' as DocumentFilter, label: 'Magic ...', icon: Sparkles },
            { id: 'grayscale' as DocumentFilter, label: 'Graysc...', icon: Layers },
            { id: 'bw' as DocumentFilter, label: 'B&W Cl...', icon: Contrast },
            { id: 'warm' as DocumentFilter, label: 'Warm', icon: SunMedium },
          ].map((f) => {
            const isSelected = activeFilter === f.id;
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => {
                  setActiveFilter(f.id);
                  onShowToast(`Applied ${f.label} filter`);
                }}
                className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-all text-left ${
                  isSelected ? 'bg-zinc-100 border border-zinc-300' : 'bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60'
                }`}
              >
                <div
                  className={`relative w-full aspect-square rounded-lg bg-white overflow-hidden shadow-sm flex items-center justify-center ${
                    isSelected ? 'ring-2 ring-zinc-900' : ''
                  }`}
                >
                  <div className="w-full h-full bg-zinc-100 flex items-center justify-center p-1 text-zinc-800">
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#18181b] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </div>
                  )}
                </div>
                <span
                  className={`text-[11px] truncate w-full text-center ${
                    isSelected ? 'font-bold text-zinc-900' : 'text-zinc-600 font-medium'
                  }`}
                >
                  {f.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Optical Metrics & OCR Pre-pass Card */}
      <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3 flex items-center justify-between shadow-sm mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-zinc-200 flex items-center justify-center text-zinc-900">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-900">Real-time OCR Pre-pass</p>
            <p className="text-[11px] text-zinc-500">99.8% text clarity recognized</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded bg-zinc-200 text-zinc-800 text-xs font-bold">
          Ready
        </span>
      </div>

      {/* Sticky Bottom Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-3 bg-white/95 backdrop-blur-xl border-t border-zinc-200 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] flex items-center gap-3 max-w-md mx-auto">
        <button
          onClick={onBack}
          className="flex-1 h-12 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 text-sm font-semibold flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-sm"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>

        <button
          onClick={handleApply}
          disabled={isApplying}
          className="flex-[1.5] h-12 rounded-full bg-[#18181b] hover:bg-zinc-800 text-white text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md disabled:opacity-75"
        >
          {isApplying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Compiling PDF...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Apply Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
