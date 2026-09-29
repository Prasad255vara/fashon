import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Bell,
  Sparkles,
  ShieldCheck,
  Package,
  Send,
  CheckCheck,
} from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    markNotificationsAsRead,
    sendSimulatedPush,
  } = useStore();

  const [testTitle, setTestTitle] = useState('Private Runway Drop Alert');
  const [testMessage, setTestMessage] = useState('The 380 GSM L’Éclipse Gown in Sovereign Ivory has just been restocked in limited quantities.');

  if (!isNotificationOpen) return null;

  const handleSendCustomNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle) return;
    sendSimulatedPush(testTitle, testMessage, 'drop');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#131418] border border-white/15 rounded-2xl shadow-2xl p-6 flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-[#d4af37]" />
            <h3 className="text-base font-bold uppercase text-white font-display">
              Atelier Push Notifications
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markNotificationsAsRead}
              className="text-[11px] font-mono text-zinc-400 hover:text-white flex items-center gap-1"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Mark Read</span>
            </button>
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications Feed */}
        <div className="py-4 space-y-3 overflow-y-auto flex-1">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3.5 rounded-xl border text-xs font-mono transition-colors ${
                notif.read
                  ? 'bg-zinc-900/30 border-white/5 text-zinc-400'
                  : 'bg-zinc-900/80 border-[#d4af37]/30 text-zinc-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {notif.type === 'drop' ? (
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  ) : notif.type === 'security' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Package className="w-3.5 h-3.5 text-blue-400" />
                  )}
                  <h4 className="font-bold text-white uppercase text-[11px]">
                    {notif.title}
                  </h4>
                </div>
                <span className="text-[10px] text-zinc-500 whitespace-nowrap">
                  {notif.timestamp}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-300">
                {notif.message}
              </p>
            </div>
          ))}
        </div>

        {/* Dispatch Custom Push Simulation */}
        <div className="pt-4 border-t border-white/10 space-y-3 text-xs font-mono">
          <p className="text-[10px] uppercase tracking-wider text-[#d4af37]">
            Test Real-Time Personalized Push
          </p>
          <form onSubmit={handleSendCustomNotification} className="space-y-2">
            <input
              type="text"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              placeholder="Push title..."
              className="w-full p-2 rounded bg-zinc-900 border border-white/10 text-white outline-none focus:border-[#d4af37] text-xs"
            />
            <input
              type="text"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Push body message..."
              className="w-full p-2 rounded bg-zinc-900 border border-white/10 text-white outline-none focus:border-[#d4af37] text-xs"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded bg-white hover:bg-zinc-200 text-black font-display font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Personalized Notification</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
