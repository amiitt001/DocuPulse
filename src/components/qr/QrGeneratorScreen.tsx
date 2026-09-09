import React, { useState } from 'react';
import { 
  ShieldCheck, 
  History, 
  Globe, 
  FileEdit, 
  Wifi, 
  User, 
  Mail, 
  Phone, 
  Clipboard, 
  X, 
  Bolt, 
  Activity, 
  Square, 
  Circle, 
  Disc, 
  Check, 
  Share2, 
  Download,
  Lock
} from 'lucide-react';
import { QRPayloadType, QRErrorCorrection, QRModuleStyle } from '../../types';

interface QrGeneratorProps {
  initialType?: QRPayloadType;
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

export const QrGeneratorScreen: React.FC<QrGeneratorProps> = ({
  initialType = 'url',
  onBack,
  onShowToast,
}) => {
  const [payloadType, setPayloadType] = useState<QRPayloadType>(initialType);
  const [urlInput, setUrlInput] = useState<string>('https://docupulse.app/download');
  const [textInput, setTextInput] = useState<string>('DocuPulse local secure document token');
  const [wifiSsid, setWifiSsid] = useState<string>('Office-Guest');
  const [wifiPass, setWifiPass] = useState<string>('securePassword123');
  const [contactName, setContactName] = useState<string>('Dr. Aris Vance');
  const [contactPhone, setContactPhone] = useState<string>('+1 555-019-2834');
  const [contactEmail, setContactEmail] = useState<string>('aris@docupulse.local');

  const [ecc, setEcc] = useState<QRErrorCorrection>('H');
  const [moduleStyle, setModuleStyle] = useState<QRModuleStyle>('dots');
  const [showWatermark, setShowWatermark] = useState<boolean>(true);

  // Compute active payload text
  const getActivePayload = (): string => {
    switch (payloadType) {
      case 'url':
        return urlInput;
      case 'text':
        return textInput;
      case 'wifi':
        return `WIFI:S:${wifiSsid};T:WPA;P:${wifiPass};;`;
      case 'contact':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName}\nTEL:${contactPhone}\nEMAIL:${contactEmail}\nEND:VCARD`;
      case 'email':
        return `mailto:${contactEmail}?subject=DocuPulse%20Export`;
      case 'phone':
        return `tel:${contactPhone}`;
      default:
        return urlInput;
    }
  };

  const payloadString = getActivePayload();
  const byteLength = new Blob([payloadString]).size;

  const eccDescriptions: Record<QRErrorCorrection, string> = {
    L: 'Level L (7% Recovery)',
    M: 'Level M (15% Recovery)',
    Q: 'Level Q (25% Recovery)',
    H: 'Level H (30% Recovery)',
  };

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          if (payloadType === 'url') setUrlInput(text);
          else if (payloadType === 'text') setTextInput(text);
          onShowToast('Pasted from clipboard');
          return;
        }
      }
    } catch (_) {}
    setUrlInput('https://docupulse.app/local-docs');
    onShowToast('Clipboard sample inserted');
  };

  const handleClear = () => {
    if (payloadType === 'url') setUrlInput('');
    else if (payloadType === 'text') setTextInput('');
    onShowToast('Field cleared');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'DocuPulse QR Code',
        text: payloadString,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(payloadString);
      onShowToast('QR Link copied to clipboard');
    }
  };

  const handleSavePng = () => {
    // Generate a downloadable PNG image from canvas
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 512, 512);

      // Draw high resolution QR simulation
      ctx.fillStyle = '#18181b';

      // Corner finders
      const drawFinder = (x: number, y: number) => {
        ctx.fillRect(x, y, 110, 110);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 18, y + 18, 74, 74);
        ctx.fillStyle = '#18181b';
        ctx.fillRect(x + 36, y + 36, 38, 38);
      };

      drawFinder(40, 40);
      drawFinder(362, 40);
      drawFinder(40, 362);

      // Data dots
      for (let r = 0; r < 24; r++) {
        for (let c = 0; c < 24; c++) {
          const inCorner =
            (r < 8 && c < 8) || (r < 8 && c > 15) || (r > 15 && c < 8);
          if (!inCorner && (r * c + r + c) % 3 !== 0) {
            const posX = 50 + c * 17.5;
            const posY = 50 + r * 17.5;
            if (moduleStyle === 'dots') {
              ctx.beginPath();
              ctx.arc(posX, posY, 6, 0, Math.PI * 2);
              ctx.fill();
            } else if (moduleStyle === 'smooth') {
              ctx.beginPath();
              ctx.roundRect(posX - 6, posY - 6, 12, 12, 4);
              ctx.fill();
            } else {
              ctx.fillRect(posX - 6, posY - 6, 12, 12);
            }
          }
        }
      }

      // Watermark center badge if enabled
      if (showWatermark) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(256, 256, 42, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e4e4e7';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#18181b';
        ctx.beginPath();
        ctx.arc(256, 256, 34, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(240, 256);
        ctx.lineTo(248, 264);
        ctx.lineTo(256, 246);
        ctx.lineTo(264, 260);
        ctx.lineTo(272, 256);
        ctx.stroke();
      }

      const a = document.createElement('a');
      a.download = `DocuPulse_QR_${Date.now()}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
      onShowToast('Saved QR Code PNG to device');
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pt-20 pb-32 px-4 select-none relative">
      {/* Sub-Header / Privacy Callout & History Action */}
      <div className="flex items-center justify-between py-2 mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200">
          <ShieldCheck className="w-4 h-4 text-zinc-800" />
          <span className="text-xs text-zinc-800 font-semibold">Zero-Cloud Engine</span>
        </div>
        <button
          onClick={() => onShowToast('3 previous QR codes in history')}
          className="h-8 px-3 rounded-full bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200 flex items-center gap-1.5 text-zinc-700 transition-all active:scale-95 shadow-sm"
        >
          <History className="w-3.5 h-3.5 text-zinc-800" />
          <span className="text-xs text-zinc-900 font-semibold">History</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#18181b]" />
        </button>
      </div>

      {/* Content Type Horizontal Pill Strip */}
      <section className="mb-4 -mx-4 px-4 overflow-x-auto no-scrollbar flex items-center gap-2 py-1">
        {[
          { id: 'url' as QRPayloadType, label: 'URL', icon: Globe },
          { id: 'text' as QRPayloadType, label: 'Text', icon: FileEdit },
          { id: 'wifi' as QRPayloadType, label: 'Wi-Fi', icon: Wifi },
          { id: 'contact' as QRPayloadType, label: 'Contact', icon: User },
          { id: 'email' as QRPayloadType, label: 'Email', icon: Mail },
          { id: 'phone' as QRPayloadType, label: 'Phone', icon: Phone },
        ].map((item) => {
          const isSelected = payloadType === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setPayloadType(item.id);
                onShowToast(`Switched to ${item.label} payload`);
              }}
              className={`shrink-0 h-9 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 ${
                isSelected
                  ? 'bg-[#18181b] text-white'
                  : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </section>

      {/* Dynamic Input Card */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/90 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-zinc-900 tracking-wide uppercase">
            {payloadType === 'url' && 'Website URL'}
            {payloadType === 'text' && 'Plain Text Payload'}
            {payloadType === 'wifi' && 'Wi-Fi Configuration'}
            {payloadType === 'contact' && 'Contact vCard Details'}
            {payloadType === 'email' && 'Email Recipient & Body'}
            {payloadType === 'phone' && 'Telephone Number'}
          </label>
          <button
            onClick={handlePasteClipboard}
            className="inline-flex items-center gap-1 text-zinc-700 hover:text-zinc-900 text-xs font-bold transition-colors active:scale-95"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span>Paste Clipboard</span>
          </button>
        </div>

        {payloadType === 'url' && (
          <div className="relative flex items-center">
            <Globe className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://..."
              className="w-full h-11 pl-9 pr-9 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:bg-white focus:border-zinc-400 transition-all"
            />
            {urlInput && (
              <button
                onClick={handleClear}
                className="absolute right-3 text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {payloadType === 'text' && (
          <textarea
            rows={3}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter text to encode into QR..."
            className="w-full p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:bg-white focus:border-zinc-400 transition-all resize-none"
          />
        )}

        {payloadType === 'wifi' && (
          <div className="space-y-2">
            <input
              type="text"
              value={wifiSsid}
              onChange={(e) => setWifiSsid(e.target.value)}
              placeholder="Network Name (SSID)"
              className="w-full h-10 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:bg-white"
            />
            <input
              type="password"
              value={wifiPass}
              onChange={(e) => setWifiPass(e.target.value)}
              placeholder="Network Password (WPA2)"
              className="w-full h-10 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:bg-white"
            />
          </div>
        )}

        {payloadType === 'contact' && (
          <div className="space-y-2">
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Full Name"
              className="w-full h-10 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:bg-white"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full h-10 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:bg-white"
              />
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full h-10 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:bg-white"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-2 pt-1 text-zinc-500 text-[11px] font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
            <span>
              Payload: <strong className="text-zinc-900">{byteLength}</strong> bytes
            </span>
          </span>
          <span>Max capacity: 2,953 bytes ({ecc})</span>
        </div>
      </div>

      {/* Real-Time Live QR Preview Card */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/90 shadow-sm mb-4 flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-zinc-900">Matrix Preview</span>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-bold">
            <Bolt className="w-3.5 h-3.5 text-zinc-900 fill-zinc-900 animate-pulse" />
            <span>Live Engine</span>
          </div>
        </div>

        {/* Scannable Matrix Canvas Frame */}
        <div className="relative w-64 h-64 rounded-2xl bg-white p-3 border border-zinc-200 shadow-sm flex items-center justify-center">
          {/* Vector QR Graphic */}
          <svg className="w-full h-full text-[#18181b]" viewBox="0 0 200 200" fill="currentColor">
            {/* Corner Finder Patterns (Top-Left) */}
            <rect x="12" y="12" width="48" height="48" rx={moduleStyle === 'dots' ? '12' : moduleStyle === 'smooth' ? '8' : '2'} />
            <rect x="20" y="20" width="32" height="32" rx="4" fill="#ffffff" />
            <rect x="26" y="26" width="20" height="20" rx={moduleStyle === 'dots' ? '6' : '2'} />

            {/* Corner Finder Patterns (Top-Right) */}
            <rect x="140" y="12" width="48" height="48" rx={moduleStyle === 'dots' ? '12' : moduleStyle === 'smooth' ? '8' : '2'} />
            <rect x="148" y="20" width="32" height="32" rx="4" fill="#ffffff" />
            <rect x="154" y="26" width="20" height="20" rx={moduleStyle === 'dots' ? '6' : '2'} />

            {/* Corner Finder Patterns (Bottom-Left) */}
            <rect x="12" y="140" width="48" height="48" rx={moduleStyle === 'dots' ? '12' : moduleStyle === 'smooth' ? '8' : '2'} />
            <rect x="20" y="148" width="32" height="32" rx="4" fill="#ffffff" />
            <rect x="26" y="154" width="20" height="20" rx={moduleStyle === 'dots' ? '6' : '2'} />

            {/* Matrix Data Modules */}
            {[
              [70, 18], [82, 18], [94, 18], [118, 18], [130, 18],
              [70, 30], [94, 30], [106, 30], [118, 30],
              [70, 42], [82, 42], [106, 42], [130, 42],
              [82, 54], [94, 54], [118, 54],
              [18, 70], [30, 70], [42, 70], [54, 70], [66, 70], [78, 70], [122, 70], [134, 70], [146, 70], [170, 70], [182, 70],
              [18, 82], [42, 82], [66, 82], [134, 82], [158, 82], [182, 82],
              [18, 118], [30, 118], [42, 118], [66, 118], [78, 118], [122, 118], [146, 118], [170, 118],
              [18, 130], [42, 130], [54, 130], [66, 130], [134, 130], [158, 130], [182, 130],
              [70, 146], [94, 146], [106, 146], [130, 146], [142, 146], [166, 146], [178, 146],
              [82, 158], [118, 158], [142, 158], [154, 158], [178, 158],
              [70, 170], [82, 170], [106, 170], [130, 170], [166, 170], [178, 170],
              [94, 182], [118, 182], [142, 182], [154, 182],
            ].map(([cx, cy], i) => {
              if (moduleStyle === 'dots') {
                return <circle key={i} cx={cx} cy={cy} r="4.5" />;
              } else if (moduleStyle === 'smooth') {
                return (
                  <rect
                    key={i}
                    x={cx - 4.5}
                    y={cy - 4.5}
                    width="9"
                    height="9"
                    rx="3"
                  />
                );
              } else {
                return (
                  <rect
                    key={i}
                    x={cx - 4.5}
                    y={cy - 4.5}
                    width="9"
                    height="9"
                  />
                );
              }
            })}
          </svg>

          {/* Center Brand Logo Watermark */}
          {showWatermark && (
            <div className="absolute w-12 h-12 rounded-full bg-white shadow-md border border-zinc-200 flex items-center justify-center p-1 transition-transform">
              <div className="w-full h-full rounded-full bg-[#18181b] flex items-center justify-center text-white shadow-sm">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>
          )}
        </div>

        {/* Feedback Pill */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-medium">
          <Check className="w-3.5 h-3.5 text-zinc-900 stroke-[3]" />
          <span>Rendered instantly on-device in 8ms</span>
        </div>
      </div>

      {/* Vector Customization Panel */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/90 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-zinc-900">Vector Customization</h2>
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">
            M3 Optics
          </span>
        </div>

        {/* Error Correction Level */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-900">Error Correction</span>
            <span className="text-xs font-bold text-zinc-900">{eccDescriptions[ecc]}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(['L', 'M', 'Q', 'H'] as QRErrorCorrection[]).map((level) => {
              const isSelected = ecc === level;
              return (
                <button
                  key={level}
                  onClick={() => {
                    setEcc(level);
                    onShowToast(`Error correction set to ${level}`);
                  }}
                  className={`h-9 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#18181b] text-white shadow-sm'
                      : 'bg-zinc-100 hover:bg-zinc-200/70 border border-zinc-200 text-zinc-800'
                  }`}
                >
                  {level === 'H' ? '★ H (30%)' : level === 'L' ? 'L (7%)' : level === 'M' ? 'M (15%)' : 'Q (25%)'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Module Geometry */}
        <div className="mb-4">
          <span className="block text-xs font-semibold text-zinc-900 mb-2">Module Geometry</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'square' as QRModuleStyle, label: 'Square', icon: Square },
              { id: 'dots' as QRModuleStyle, label: 'Dots', icon: Disc },
              { id: 'smooth' as QRModuleStyle, label: 'Smooth', icon: Circle },
            ].map((st) => {
              const isSelected = moduleStyle === st.id;
              const Icon = st.icon;
              return (
                <button
                  key={st.id}
                  onClick={() => {
                    setModuleStyle(st.id);
                    onShowToast(`Geometry style: ${st.label}`);
                  }}
                  className={`h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#18181b] text-white shadow-sm'
                      : 'bg-zinc-100 border border-zinc-200 text-zinc-700 hover:bg-zinc-200/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Logo Toggle */}
        <div className="flex items-center justify-between pt-2 bg-zinc-50 border border-zinc-200 p-3 rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-900">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-zinc-900">DocuPulse Watermark</span>
              <span className="block text-[11px] text-zinc-500">Recommended with 25%+ ECC</span>
            </div>
          </div>
          <button
            onClick={() => {
              setShowWatermark(!showWatermark);
              onShowToast(!showWatermark ? 'Watermark enabled' : 'Watermark hidden');
            }}
            className={`w-12 h-7 rounded-full p-0.5 transition-colors relative flex items-center ${
              showWatermark ? 'bg-[#18181b]' : 'bg-zinc-300'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full bg-white shadow-sm transform transition-transform flex items-center justify-center ${
                showWatermark ? 'translate-x-5' : 'translate-x-0'
              }`}
            >
              {showWatermark && <Check className="w-3.5 h-3.5 text-[#18181b] stroke-[3]" />}
            </span>
          </button>
        </div>
      </div>

      {/* Sticky Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-xl border-t border-zinc-200 z-40 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleShare}
            className="h-12 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-900 text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>Share QR</span>
          </button>

          <button
            onClick={handleSavePng}
            className="h-12 rounded-full bg-[#18181b] hover:bg-zinc-800 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Save PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
