import React, { useState } from 'react';
import { 
  Zap, 
  ZapOff, 
  Grid, 
  Sparkles, 
  FileText, 
  Compass, 
  Cpu, 
  Scan, 
  Images, 
  Check 
} from 'lucide-react';
import { 
  SCANNER_CAMERA_SAMPLE_URL, 
  GALLERY_THUMB_URL, 
  BATCH_REVIEW_THUMB_URL 
} from '../../data/mockData';

interface CameraScannerProps {
  onBack: () => void;
  onReview: () => void;
  onShowToast: (msg: string) => void;
}

export const CameraScannerScreen: React.FC<CameraScannerProps> = ({
  onBack,
  onReview,
  onShowToast,
}) => {
  const [scanMode, setScanMode] = useState<'single' | 'batch'>('batch');
  const [batchCount, setBatchCount] = useState<number>(1);
  const [flashMode, setFlashMode] = useState<'auto' | 'on' | 'off'>('auto');
  const [isGridVisible, setIsGridVisible] = useState<boolean>(true);
  const [autoCropEnabled, setAutoCropEnabled] = useState<boolean>(true);
  const [showFlashFx, setShowFlashFx] = useState<boolean>(false);

  const cycleFlash = () => {
    const states: ('auto' | 'on' | 'off')[] = ['auto', 'on', 'off'];
    const next = states[(states.indexOf(flashMode) + 1) % states.length];
    setFlashMode(next);
    onShowToast(`Flash mode: ${next.toUpperCase()}`);
  };

  const handleCapture = () => {
    // Optical flash animation
    setShowFlashFx(true);
    setTimeout(() => {
      setShowFlashFx(false);
      setBatchCount((prev) => prev + 1);
      onShowToast(`Captured page ${batchCount + 1}`);
    }, 150);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pt-20 pb-16 px-4 select-none relative">
      {/* Flash overlay fx */}
      {showFlashFx && (
        <div className="fixed inset-0 bg-white opacity-80 pointer-events-none z-50 transition-opacity duration-150" />
      )}

      {/* Local Processing & Offline Guarantee Banner */}
      <div className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-100/90 border border-zinc-200/80 shadow-sm mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-zinc-800" />
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-zinc-900 tracking-wide">
              Processing on device
            </span>
            <span className="text-[11px] text-zinc-500">
              Zero cloud sync • Neural edge engine
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-zinc-200/80 px-2 py-0.5 rounded-full text-zinc-800 text-[11px] font-bold">
          <span>100% Offline</span>
        </div>
      </div>

      {/* Camera Sub-Header / Tool Controls */}
      <div className="w-full flex items-center justify-between mb-3">
        {/* Mode / Batch Count Toggle Pill */}
        <div className="inline-flex p-0.5 rounded-full bg-zinc-100 border border-zinc-200 shadow-inner">
          <button
            onClick={() => {
              setScanMode('single');
              onShowToast('Single document mode');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              scanMode === 'single'
                ? 'bg-[#18181b] text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Single
          </button>
          <button
            onClick={() => {
              setScanMode('batch');
              onShowToast('Batch document mode');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
              scanMode === 'batch'
                ? 'bg-[#18181b] text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <span>Batch</span>
            <span className="bg-zinc-800 px-1.5 py-0.2 rounded-full text-[10px] text-zinc-200">
              Pg {batchCount}
            </span>
          </button>
        </div>

        {/* Quick Utility Switches */}
        <div className="flex items-center gap-2">
          {/* Flash Button */}
          <button
            onClick={cycleFlash}
            className="h-8 px-3 rounded-full bg-zinc-100 border border-zinc-200 flex items-center gap-1.5 text-zinc-800 text-xs font-semibold active:scale-95 transition-transform"
          >
            {flashMode === 'off' ? (
              <ZapOff className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-zinc-900 fill-zinc-900" />
            )}
            <span className="uppercase text-[11px] text-zinc-700">{flashMode}</span>
          </button>

          {/* Grid Button */}
          <button
            onClick={() => {
              setIsGridVisible(!isGridVisible);
              onShowToast(!isGridVisible ? 'Grid overlay enabled' : 'Grid overlay off');
            }}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all active:scale-95 ${
              isGridVisible
                ? 'bg-zinc-200 border-zinc-300 text-zinc-900'
                : 'bg-zinc-100 border-zinc-200 text-zinc-400'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Viewfinder Simulation Frame */}
      <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-950 shadow-2xl flex items-center justify-center border border-zinc-900">
        {/* Background Camera Mockup Stream */}
        <img
          src={SCANNER_CAMERA_SAMPLE_URL}
          alt="Document Camera Stream"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Optical Tint */}
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[0.5px]" />

        {/* Composition Alignment Grid (Toggleable) */}
        {isGridVisible && (
          <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-25">
            <div className="border-r border-b border-white/50" />
            <div className="border-r border-b border-white/50" />
            <div className="border-b border-white/50" />
            <div className="border-r border-b border-white/50" />
            <div className="border-r border-b border-white/50" />
            <div className="border-b border-white/50" />
            <div className="border-r border-b border-white/50" />
            <div className="border-r border-b border-white/50" />
            <div />
          </div>
        )}

        {/* Laser Scanning Beam Animation */}
        <div className="absolute inset-x-6 h-0.5 bg-gradient-to-r from-transparent via-white/90 to-transparent opacity-80 blur-[1px] animate-[pulse_2s_infinite] pointer-events-none" />

        {/* Active Perspective Quadrilateral SVG Layer */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 360 480"
          preserveAspectRatio="none"
        >
          {/* Detected Quad Path */}
          <polygon
            points="42,76 318,62 334,402 30,388"
            fill="rgba(255, 255, 255, 0.08)"
            stroke="#ffffff"
            strokeWidth="2"
          />
          {/* Midpoint Tick Lines */}
          <line x1="180" y1="69" x2="180" y2="79" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="182" y1="395" x2="182" y2="405" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="36" y1="232" x2="46" y2="232" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="321" y1="232" x2="331" y2="232" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>

        {/* Corner Pinch Anchors */}
        <div className="absolute top-[14%] left-[10%] w-7 h-7 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
          <div className="w-5 h-5 rounded-full bg-white shadow-lg flex items-center justify-center ring-2 ring-zinc-900">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
          </div>
        </div>
        <div className="absolute top-[11.5%] right-[10%] w-7 h-7 translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
          <div className="w-5 h-5 rounded-full bg-white shadow-lg flex items-center justify-center ring-2 ring-zinc-900">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
          </div>
        </div>
        <div className="absolute bottom-[17.5%] right-[6%] w-7 h-7 translate-x-1/2 translate-y-1/2 flex items-center justify-center pointer-events-none">
          <div className="w-5 h-5 rounded-full bg-white shadow-lg flex items-center justify-center ring-2 ring-zinc-900">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
          </div>
        </div>
        <div className="absolute bottom-[20.5%] left-[7.5%] w-7 h-7 -translate-x-1/2 translate-y-1/2 flex items-center justify-center pointer-events-none">
          <div className="w-5 h-5 rounded-full bg-white shadow-lg flex items-center justify-center ring-2 ring-zinc-900">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
          </div>
        </div>

        {/* Top Guidance Pill */}
        <div className="absolute top-4 inset-x-0 flex justify-center pointer-events-none">
          <div className="px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/60 backdrop-blur-md shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span className="text-xs text-white font-semibold tracking-tight">
              Document detected • Hold steady
            </span>
          </div>
        </div>

        {/* Bottom Viewfinder Controls Overlays */}
        <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-auto">
          <button
            onClick={() => {
              setAutoCropEnabled(!autoCropEnabled);
              onShowToast(!autoCropEnabled ? 'Auto Crop: ON' : 'Auto Crop: OFF');
            }}
            className="h-8 px-3 rounded-full bg-zinc-900/85 border border-zinc-700/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
            <span>Auto Crop: {autoCropEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <div className="h-8 px-3 rounded-full bg-zinc-900/85 border border-zinc-700/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-md">
            <FileText className="w-3.5 h-3.5 text-zinc-300" />
            <span>A4 Format (300 DPI)</span>
          </div>
        </div>
      </div>

      {/* Real-time Leveler & Telemetry Strip */}
      <div className="w-full flex items-center justify-between mt-3 px-2">
        <div className="flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-zinc-700" />
          <span className="text-xs text-zinc-500">
            Orientation: <strong className="text-zinc-900 font-bold">Flat (0.3° tilt)</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-zinc-700" />
          <span className="text-xs text-zinc-500">
            Latency: <strong className="text-zinc-900 font-bold">14ms</strong>
          </span>
        </div>
      </div>

      {/* Bottom Interactive Camera Controls Palette */}
      <div className="w-full mt-4 pt-2 flex items-center justify-between px-2">
        {/* Gallery Import Action Button */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => {
              onShowToast('Importing document from device photos...');
              setTimeout(onReview, 400);
            }}
            className="relative w-12 h-12 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm active:scale-90 transition-transform p-0.5 group flex items-center justify-center"
          >
            <img
              src={GALLERY_THUMB_URL}
              alt="Device Gallery"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-xl"
            />
          </button>
          <span className="text-xs text-zinc-600 font-semibold">Gallery</span>
        </div>

        {/* Circular Dual-Ring Shutter Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleCapture}
            className="relative w-20 h-20 rounded-full flex items-center justify-center focus:outline-none active:scale-95 transition-transform"
          >
            <span className="absolute inset-0 rounded-full bg-zinc-300 ring-2 ring-zinc-400/40" />
            <span className="relative w-[74px] h-[74px] rounded-full bg-white flex items-center justify-center shadow-lg border border-zinc-200">
              <span className="w-[60px] h-[60px] rounded-full bg-[#18181b] flex items-center justify-center shadow-inner transition-colors duration-150">
                <Scan className="w-7 h-7 text-white stroke-[2]" />
              </span>
            </span>
          </button>
        </div>

        {/* Batch Review Action Button */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={onReview}
            className="relative w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 shadow-sm active:scale-90 transition-transform flex items-center justify-center"
          >
            <div className="w-8 h-8 rounded-lg bg-white shadow-sm overflow-hidden relative border border-zinc-200 flex items-center justify-center">
              <img
                src={BATCH_REVIEW_THUMB_URL}
                alt="Captured Review"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#18181b] text-white text-[11px] font-bold flex items-center justify-center shadow-md ring-2 ring-white">
              {batchCount}
            </span>
          </button>
          <span className="text-xs text-zinc-600 font-semibold">Review</span>
        </div>
      </div>
    </div>
  );
};
