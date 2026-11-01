import React, { useState, useEffect } from 'react';
import { Smartphone, Download, QrCode, CheckCircle2, ExternalLink, X, Sparkles, Heart, ArrowRight } from 'lucide-react';
import QRCode from 'qrcode';

interface AndroidAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
}

export const AndroidAppModal: React.FC<AndroidAppModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [installStatus, setInstallStatus] = useState<'idle' | 'installing' | 'installed'>('idle');
  const [activeTab, setActiveTab] = useState<'quick' | 'apk' | 'qr'>('quick');

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    if (isOpen && currentUrl) {
      QRCode.toDataURL(currentUrl, {
        width: 240,
        margin: 2,
        color: {
          dark: '#1F2E24',
          light: '#FAF7F2',
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch(() => {});
    }
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      try {
        setInstallStatus('installing');
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice?.outcome === 'accepted') {
          setInstallStatus('installed');
        } else {
          setInstallStatus('idle');
        }
      } catch {
        setInstallStatus('idle');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Tap backdrop to close */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#D0DDD1] overflow-hidden flex flex-col z-10 max-h-[92vh]">
        {/* Header with botanical gradient */}
        <div className="bg-gradient-to-r from-[#16241B] via-[#243B2B] to-[#3A5B44] text-[#FAF7F2] px-6 py-5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 p-1 border border-white/20 shadow-inner flex items-center justify-center shrink-0 overflow-hidden">
              <img src="/pwa-192x192.png" alt="for ink icon" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-semibold tracking-wide text-white">
                  Get the Android App
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-sans font-bold uppercase tracking-wider rounded-full bg-[#E26887] text-white">
                  Android Ready
                </span>
              </div>
              <p className="text-xs text-[#D0DDD1] font-light mt-0.5">
                Install "for ink" directly on ink's Android phone with custom icon & real-time notifications
              </p>
            </div>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-[#D0DDD1] bg-[#F4F7F4] px-4 pt-2 shrink-0 gap-2">
          {[
            { id: 'quick', label: '1-Tap Install', icon: Smartphone },
            { id: 'apk', label: 'Download .APK', icon: Download },
            { id: 'qr', label: 'Scan Phone QR', icon: QrCode }
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                  isTabActive
                    ? 'border-[#E26887] text-[#1F2E24] bg-[#FAF7F2] rounded-t-xl'
                    : 'border-transparent text-[#52775C] hover:text-[#1F2E24]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isTabActive ? 'text-[#E26887]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* TAB 1: 1-Tap Native Install */}
          {activeTab === 'quick' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFF5F7] to-[#FAF7F2] border border-[#F7ADC0] space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#E26887] text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-semibold text-[#1F2E24]">
                      Native Android WebApp Install
                    </h4>
                    <p className="text-xs text-[#52775C]">
                      Installs cleanly to your app drawer without using storage space
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#52775C] leading-relaxed">
                  When installed on Android, "for ink" opens in full screen without browser bars, displays the custom Chrysanthemum botanical icon, and stays connected with live letter notifications.
                </p>

                {deferredPrompt ? (
                  <button
                    onClick={handleNativeInstall}
                    disabled={installStatus === 'installed'}
                    className="w-full py-3 px-4 rounded-xl bg-[#46684F] hover:bg-[#334E3A] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-[1.01] cursor-pointer"
                  >
                    {installStatus === 'installed' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#F7ADC0]" />
                        <span>Installed Successfully on Device!</span>
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-4 h-4 text-[#F7ADC0]" />
                        <span>1-Tap Install on This Android Phone</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-bold text-[#263B2D]">
                      To install on Android Chrome or Samsung Internet:
                    </p>
                    <ol className="text-xs text-[#52775C] space-y-1.5 list-decimal list-inside bg-white p-3.5 rounded-xl border border-[#D0DDD1]">
                      <li>Open this page in <strong>Google Chrome</strong> on Android.</li>
                      <li>Tap the <strong>three dots (⋮)</strong> in the top-right corner.</li>
                      <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                    </ol>
                  </div>
                )}
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-white border border-[#D0DDD1]">
                  <p className="font-bold text-[#1F2E24] mb-0.5">🌸 Standalone Fullscreen</p>
                  <p className="text-[11px] text-[#52775C]">No URL bar or browser tabs</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#D0DDD1]">
                  <p className="font-bold text-[#1F2E24] mb-0.5">🔔 Push Chimes & Alerts</p>
                  <p className="text-[11px] text-[#52775C]">Hear notifications when letters bloom</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Direct APK Download */}
          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#EAF1EB] border border-[#D0DDD1] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-base font-semibold text-[#1F2E24]">
                      Standalone Android .APK Package
                    </h4>
                    <p className="text-xs text-[#52775C]">
                      Full native Android package with embedded web runtime
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-[#46684F] text-white text-[10px] font-mono font-bold">
                    Universal APK
                  </span>
                </div>

                <div className="space-y-1 text-xs text-[#52775C] bg-white p-3 rounded-xl border border-[#D0DDD1]/80 font-mono">
                  <p><span className="text-[#688D73]">Package:</span> com.forink.app</p>
                  <p><span className="text-[#688D73]">Min Android:</span> 7.0+ (API 24+)</p>
                  <p><span className="text-[#688D73]">Target:</span> Android 14+ (API 34+)</p>
                  <p><span className="text-[#688D73]">Architecture:</span> Universal (arm64, armv7, x86)</p>
                </div>

                <div className="pt-1 flex flex-col sm:flex-row gap-2">
                  <a
                    href="/APK_DOWNLOAD/app-debug.apk"
                    download="for-ink.apk"
                    className="flex-1 py-3 px-4 rounded-xl bg-[#E26887] hover:bg-[#D45575] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-[1.01] cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-white" />
                    <span>Download for-ink.apk</span>
                  </a>
                </div>

                <p className="text-[11px] text-[#688D73] leading-relaxed">
                  * Note: If Android prompts "File might be harmful", tap <strong>Download anyway</strong> and <strong>Install</strong> (standard for non-Play Store personal APKs).
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: QR Code for Phone */}
          {activeTab === 'qr' && (
            <div className="text-center space-y-3">
              <p className="text-xs text-[#52775C]">
                Point ink's Android phone camera at this QR code to open and install the app instantly:
              </p>

              {qrCodeUrl ? (
                <div className="inline-block p-4 rounded-2xl bg-white border border-[#D0DDD1] shadow-xs">
                  <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto rounded-lg" />
                </div>
              ) : (
                <div className="w-48 h-48 mx-auto rounded-2xl bg-white border border-[#D0DDD1] flex items-center justify-center text-xs text-[#688D73]">
                  Generating QR...
                </div>
              )}

              <p className="text-xs font-mono text-[#46684F] break-all max-w-sm mx-auto bg-white p-2 rounded-xl border border-[#D0DDD1]">
                {currentUrl}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#FAF7F2] border-t border-[#D0DDD1] flex items-center justify-between shrink-0">
          <span className="text-xs text-[#52775C] font-serif italic">
            crafted with devotion for ink
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#E6ECE6] hover:bg-[#D0DDD1] text-[#263B2D] text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
