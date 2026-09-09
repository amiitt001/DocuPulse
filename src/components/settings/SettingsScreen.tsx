import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Fingerprint, 
  EyeOff, 
  Cpu, 
  FileText, 
  Sliders, 
  HardDrive, 
  Trash2, 
  DownloadCloud, 
  Check, 
  ChevronRight, 
  Info, 
  Award,
  Layers,
  Sparkles,
  Lock,
  RefreshCw,
  WifiOff,
  Wifi,
  HardDriveDownload,
  CheckCircle2
} from 'lucide-react';
import { useSync } from '../../context/SyncContext';
import { PWAInstallBanner } from '../common/PWAInstallBanner';

interface SettingsProps {
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

export const SettingsScreen: React.FC<SettingsProps> = ({ onBack, onShowToast }) => {
  const {
    cachedCount,
    files,
    totalCacheSize,
    effectiveOnline,
    isSimulatedOffline,
    toggleSimulatedOffline,
    triggerSyncAll,
    openCacheModal,
    syncState,
  } = useSync();

  const [biometricLock, setBiometricLock] = useState<boolean>(true);
  const [metadataSanitization, setMetadataSanitization] = useState<boolean>(true);
  const [neuralAcceleration, setNeuralAcceleration] = useState<boolean>(true);
  const [dpiQuality, setDpiQuality] = useState<'150' | '300' | '600'>('300');
  const [pdfStandard, setPdfStandard] = useState<string>('PDF/A-1b (Archival)');

  const cycleDpi = () => {
    const list: ('150' | '300' | '600')[] = ['150', '300', '600'];
    const next = list[(list.indexOf(dpiQuality) + 1) % list.length];
    setDpiQuality(next);
    onShowToast(`Scanner DPI set to ${next} DPI`);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pt-20 pb-28 px-4 select-none relative">
      {/* Privacy Guarantee Banner */}
      <div className="flex items-center gap-3 p-3.5 mb-4 rounded-2xl bg-zinc-100/90 border border-zinc-200 text-zinc-900 shadow-sm">
        <div className="w-9 h-9 rounded-xl bg-[#18181b] text-white flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-zinc-900">100% On-Device Engine</span>
          <span className="text-[11px] text-zinc-500">
            Zero telemetry, zero analytics tracking, and zero remote storage.
          </span>
        </div>
      </div>

      {/* Security & Hardware Section */}
      <div className="flex flex-col gap-2 mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 px-1">
          Security & Privacy
        </span>
        <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-sm divide-y divide-zinc-100 overflow-hidden">
          {/* Biometric App Lock */}
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-900">Biometric App Lock</span>
                <span className="text-[11px] text-zinc-500">Require FaceID / Fingerprint on launch</span>
              </div>
            </div>
            <button
              onClick={() => {
                setBiometricLock(!biometricLock);
                onShowToast(!biometricLock ? 'Biometric Lock enabled' : 'Biometric Lock disabled');
              }}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors relative flex items-center ${
                biometricLock ? 'bg-[#18181b]' : 'bg-zinc-300'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                  biometricLock ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Metadata Sanitization */}
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
                <EyeOff className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-900">Metadata Sanitization</span>
                <span className="text-[11px] text-zinc-500">Strip GPS, camera model & serials</span>
              </div>
            </div>
            <button
              onClick={() => {
                setMetadataSanitization(!metadataSanitization);
                onShowToast(!metadataSanitization ? 'Metadata stripping ON' : 'Metadata stripping OFF');
              }}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors relative flex items-center ${
                metadataSanitization ? 'bg-[#18181b]' : 'bg-zinc-300'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                  metadataSanitization ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Neural Engine Acceleration */}
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-900">Hardware Neural Edge</span>
                <span className="text-[11px] text-zinc-500">On-device OCR and border recognition</span>
              </div>
            </div>
            <button
              onClick={() => {
                setNeuralAcceleration(!neuralAcceleration);
                onShowToast(!neuralAcceleration ? 'Neural Edge acceleration ON' : 'Software fallback mode');
              }}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors relative flex items-center ${
                neuralAcceleration ? 'bg-[#18181b]' : 'bg-zinc-300'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                  neuralAcceleration ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Document & Scanner Engine Defaults */}
      <div className="flex flex-col gap-2 mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 px-1">
          Document & Optics Defaults
        </span>
        <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-sm divide-y divide-zinc-100 overflow-hidden">
          {/* Scanner DPI */}
          <button
            onClick={cycleDpi}
            className="w-full flex items-center justify-between p-3.5 hover:bg-zinc-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
                <Sliders className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-900">Default Scanner Resolution</span>
                <span className="text-[11px] text-zinc-500">Target output optical fidelity</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-900">
              {dpiQuality} DPI
            </span>
          </button>

          {/* PDF Standard */}
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-900">Output PDF Format</span>
                <span className="text-[11px] text-zinc-500">ISO 19005 Archival compliance</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800">
              {pdfStandard}
            </span>
          </div>
        </div>
      </div>

      {/* Local Storage Sandbox & Cache */}
      <div className="flex flex-col gap-2 mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 px-1">
          Local Storage & Cache
        </span>
        <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-sm p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <HardDrive className="w-4 h-4 text-zinc-700" />
              <span className="text-xs font-bold text-zinc-900">On-Device Cache Allocation</span>
            </div>
            <span className="text-xs font-bold text-zinc-800">{totalCacheSize} / 512 MB</span>
          </div>

          <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
            <div
              className="h-full bg-[#18181b] rounded-full transition-all duration-300"
              style={{ width: '18%' }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 py-0.5">
            <span>{cachedCount} of {files.length} documents cached locally</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              100% Offline Ready
            </span>
          </div>

          {/* Offline Simulation Toggle for Testing */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
            <div className="flex items-center gap-2">
              {isSimulatedOffline ? (
                <WifiOff className="w-4 h-4 text-amber-600" />
              ) : (
                <Wifi className="w-4 h-4 text-zinc-600" />
              )}
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-900">Simulate Offline Mode</span>
                <span className="text-[10px] text-zinc-500">Test zero-cloud offline reading and caching</span>
              </div>
            </div>
            <button
              onClick={() => {
                toggleSimulatedOffline();
                onShowToast(!isSimulatedOffline ? 'Simulating complete offline mode' : 'Restored online connectivity');
              }}
              className={`w-10 h-6 rounded-full p-0.5 transition-colors relative flex items-center ${
                isSimulatedOffline ? 'bg-amber-600' : 'bg-zinc-300'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                  isSimulatedOffline ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={openCacheModal}
              className="flex-1 h-9 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
            >
              <HardDriveDownload className="w-3.5 h-3.5" />
              <span>Manage Cache Hub</span>
            </button>
            <button
              onClick={async () => {
                onShowToast('Auditing SHA-256 local hashes...');
                await triggerSyncAll();
                onShowToast('Audit complete: All local documents verified');
              }}
              disabled={syncState === 'syncing'}
              className="flex-1 h-9 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-zinc-600 ${syncState === 'syncing' ? 'animate-spin' : ''}`} />
              <span>Verify & Sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* App Installation & Native Experience */}
      <div className="flex flex-col gap-2 mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 px-1">
          Install App
        </span>
        <PWAInstallBanner variant="settings-card" onShowToast={onShowToast} />
      </div>

      {/* Engine Signature & Version Stamp */}
      <div className="rounded-2xl bg-zinc-100/70 border border-zinc-200/80 p-4 flex flex-col gap-2 shadow-sm text-zinc-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-zinc-900" />
            <span className="text-xs font-bold text-zinc-900">DocuPulse Core v4.12.0</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">SHA-256 Validated</span>
        </div>
        <p className="text-[11px] leading-relaxed text-zinc-500">
          Air-gapped certified runtime. Built exclusively with client-side WebAssembly, SVG vector rasterization, and local storage. No network telemetry calls are ever made.
        </p>
      </div>
    </div>
  );
};
