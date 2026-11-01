import React, { useState, useEffect } from 'react';
import { Bell, Check, Sparkles, X, Flower2, Mail, CheckCheck } from 'lucide-react';
import { AppNotification } from '../types';
import { sound } from '../utils/audio';

interface NotificationBannerProps {
  notifications: AppNotification[];
  onOpenLetterById: (letterId: string) => void;
  onDismissNotification: (id: string) => void;
  onMarkAllAsRead?: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notifications,
  onOpenLetterById,
  onDismissNotification,
  onMarkAllAsRead
}) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showPrompt, setShowPrompt] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      if (Notification.permission === 'default') {
        // Show polite prompt after 3 seconds of browsing
        const timer = setTimeout(() => setShowPrompt(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        setPermission(result);
        setShowPrompt(false);
        if (result === 'granted') {
          sound.playBloomChime();
          new Notification("🌸 Chrysanthemum Notifications Active", {
            body: "You'll be alerted as soon as today's birthday letter blooms!",
            icon: "/favicon.png"
          });
        }
      } catch (err) {
        console.error('Permission error', err);
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      {/* Gentle Floating Notification Permission Prompt - Fixed for mobile bounds */}
      {showPrompt && permission === 'default' && (
        <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-sm sm:w-96 bg-[#FAF7F2] p-4 rounded-2xl shadow-2xl border border-[#D0DDD1] flex items-start gap-3 transition-all animate-fade-in">
          <div className="p-2.5 rounded-xl bg-[#FFE6EB] text-[#E26887] shrink-0 mt-0.5">
            <Bell className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-[#1F2E24] uppercase tracking-wider">
              Daily Letter Alerts
            </h4>
            <p className="text-xs text-[#52775C] mt-1 leading-snug">
              Receive a quiet notification when your loved one blooms a new letter for your countdown!
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={requestNotificationPermission}
                className="px-3.5 py-1.5 rounded-full bg-[#46684F] hover:bg-[#334E3A] text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Enable Alerts
              </button>
              <button
                onClick={() => setShowPrompt(false)}
                className="px-3 py-1.5 text-xs text-[#688D73] hover:text-[#1F2E24] cursor-pointer"
              >
                Later
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowPrompt(false)}
            className="text-[#D0DDD1] hover:text-[#52775C] p-1 cursor-pointer"
            aria-label="Dismiss alert prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bell Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpenMenu(!isOpenMenu)}
          className={`relative p-2 rounded-full border transition-all cursor-pointer ${
            isOpenMenu
              ? 'bg-[#E6ECE6] text-[#1F2E24] border-[#46684F]'
              : 'bg-white/80 hover:bg-white text-[#263B2D] border-[#D0DDD1] hover:scale-105'
          }`}
          title="Daily Notifications"
          aria-label="View notifications"
          aria-expanded={isOpenMenu}
        >
          <Bell className="w-4 h-4 text-[#46684F]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E26887] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Mobile Backdrop Overlay - allows tapping outside to close on all devices */}
        {isOpenMenu && (
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity"
            onClick={() => setIsOpenMenu(false)}
            aria-label="Close notification panel backdrop"
          />
        )}

        {/* Notification Panel - perfectly positioned on mobile (top-16 inset-x-3) and anchored on desktop */}
        {isOpenMenu && (
          <div className="fixed top-16 left-3 right-3 sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:absolute sm:w-96 max-w-md mx-auto z-50 bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#D0DDD1] overflow-hidden flex flex-col transition-all animate-in fade-in-50 zoom-in-95">
            {/* Panel Header */}
            <div className="px-4 py-3.5 bg-gradient-to-r from-[#263B2D] to-[#3A5B44] text-[#FAF7F2] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#E26887]/30 text-[#F7ADC0]">
                  <Flower2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-sm font-semibold tracking-wide text-white">
                      Letter Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#E26887] text-white text-[10px] font-sans font-bold">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#D0DDD1] font-light">Countdown keepsakes for ink</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && onMarkAllAsRead && (
                  <button
                    type="button"
                    onClick={onMarkAllAsRead}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-[#FAF7F2]/90 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-[#F7ADC0]" />
                    <span>Read all</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpenMenu(false)}
                  className="p-1.5 rounded-full text-[#D0DDD1] hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                  aria-label="Close notification panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto divide-y divide-[#D0DDD1]/50 overscroll-contain">
              {notifications.length === 0 ? (
                <div className="py-8 px-6 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#EAF1EB] text-[#46684F] mx-auto flex items-center justify-center">
                    <Flower2 className="w-5 h-5 text-[#E26887]" />
                  </div>
                  <p className="text-xs font-semibold text-[#1F2E24]">No letter alerts yet</p>
                  <p className="text-xs text-[#52775C] max-w-xs mx-auto leading-relaxed">
                    When today's chrysanthemum letter blooms, a gentle alert will appear here for you!
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3.5 sm:p-4 transition-colors flex items-start justify-between gap-3 relative ${
                      notif.isRead ? 'bg-[#FAF7F2] hover:bg-[#F4F7F4]' : 'bg-[#FFE6EB]/40 hover:bg-[#FFE6EB]/60'
                    }`}
                  >
                    {!notif.isRead && (
                      <span className="absolute left-1 top-4 bottom-4 w-1 rounded-full bg-[#E26887]" />
                    )}

                    <div
                      className="flex-1 cursor-pointer min-w-0 pl-1"
                      onClick={() => {
                        if (notif.letterId) {
                          onOpenLetterById(notif.letterId);
                        }
                        setIsOpenMenu(false);
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#E26887] shrink-0" />
                        <p className="text-xs font-bold text-[#1F2E24] truncate">{notif.title}</p>
                      </div>
                      <p className="text-xs text-[#52775C] mt-1 line-clamp-2 leading-relaxed">
                        {notif.body}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-[#688D73] font-medium">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {notif.letterId && (
                          <span className="text-[10px] text-[#A6304C] font-semibold hover:underline">
                            Tap to read letter →
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDismissNotification(notif.id)}
                      className="p-1.5 rounded-lg text-[#688D73] hover:text-[#1F2E24] hover:bg-[#E6ECE6] transition-colors shrink-0 cursor-pointer"
                      title="Dismiss notification"
                      aria-label="Dismiss notification"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Permission Status */}
            <div className="p-3 bg-[#EAF1EB] border-t border-[#D0DDD1] text-center shrink-0">
              {permission !== 'granted' ? (
                <button
                  type="button"
                  onClick={requestNotificationPermission}
                  className="text-xs text-[#46684F] font-semibold hover:text-[#263B2D] flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E26887]" />
                  <span>Enable device alerts on this phone →</span>
                </button>
              ) : (
                <p className="text-[11px] text-[#52775C] flex items-center justify-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#46684F]" />
                  <span>Device notifications active for ink</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
