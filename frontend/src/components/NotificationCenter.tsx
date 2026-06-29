import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  MessageSquare,
  Heart,
  UserPlus,
  AtSign,
  CheckCheck,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { Notification } from '@/store/useStore';

const typeIconMap: Record<Notification['type'], LucideIcon> = {
  reply: MessageSquare,
  like: Heart,
  follow: UserPlus,
  system: Bell,
  mention: AtSign,
};

const typeLabelMap: Record<Notification['type'], string> = {
  reply: '回复',
  like: '点赞',
  follow: '关注',
  system: '系统',
  mention: '@提及',
};

export default function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllRead,
    notifyOpen,
    setNotifyOpen,
  } = useStore();

  const panelRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭面板
  useEffect(() => {
    if (!notifyOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setNotifyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifyOpen, setNotifyOpen]);

  return (
    <div className="relative" ref={panelRef}>
      {/* ---------- 通知铃铛按钮 ---------- */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setNotifyOpen(!notifyOpen)}
        className="
          relative flex items-center justify-center
          w-9 h-9 rounded-lg
          text-white/60 hover:text-white/90
          hover:bg-white/10
          transition-colors
        "
        aria-label="通知中心"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="
            absolute -top-1 -right-1
            flex items-center justify-center
            min-w-[18px] h-[18px] px-1
            rounded-full bg-red-500
            text-[10px] font-bold text-white
            border-2 border-slate-900
          ">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </motion.button>

      {/* ---------- 下拉通知面板 ---------- */}
      <AnimatePresence>
        {notifyOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="
              absolute right-2 sm:right-0 top-12
              w-[calc(100vw-32px)] sm:w-[380px] max-h-[480px]
              rounded-2xl overflow-hidden
              border border-white/10
              bg-slate-900/75 backdrop-blur-2xl
              shadow-2xl shadow-black/50
              flex flex-col
            "
          >
            {/* 头部 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-cyan-400" />
                <h3 className="text-sm font-semibold text-white/90">通知</h3>
                {unreadCount > 0 && (
                  <span className="
                    text-[11px] px-1.5 py-0.5 rounded-full
                    bg-cyan-500/20 text-cyan-400
                  ">
                    {unreadCount} 条未读
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="
                      flex items-center gap-1
                      px-2 py-1 rounded-md
                      text-[11px] text-cyan-400
                      hover:bg-cyan-500/10
                      transition-colors
                    "
                    aria-label="全部已读"
                  >
                    <CheckCheck size={13} />
                    全部已读
                  </button>
                )}
                <button
                  onClick={() => setNotifyOpen(false)}
                  className="text-white/40 hover:text-white/80 transition-colors"
                  aria-label="关闭通知面板"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* 通知列表 */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 && (
                <p className="text-center text-white/30 text-sm py-10">
                  暂无通知
                </p>
              )}
              {notifications.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notification={notif}
                  onClick={() => markNotificationRead(notif.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==================== 子组件 ==================== */

function NotificationItem({
  notification,
  onClick,
}: {
  notification: Notification;
  onClick: () => void;
}) {
  const Icon = typeIconMap[notification.type];

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-start gap-3 px-4 py-3
        text-left transition-colors
        border-l-[3px]
        ${notification.read
          ? 'border-l-transparent bg-transparent hover:bg-white/[0.03]'
          : 'border-l-cyan-400 bg-cyan-500/[0.04] hover:bg-cyan-500/[0.08]'
        }
      `}
    >
      {/* 类型图标 */}
      <div
        className={`
          shrink-0 w-9 h-9 rounded-full
          flex items-center justify-center
          ${notification.read
            ? 'bg-white/5 text-white/35'
            : 'bg-cyan-500/15 text-cyan-400'
          }
        `}
      >
        <Icon size={16} />
      </div>

      {/* 通知内容 */}
      <div className="flex-1 min-w-0">
        <p
          className={`
            text-sm leading-relaxed
            ${notification.read ? 'text-white/50' : 'text-white/85'}
          `}
        >
          {notification.content}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-white/25">
            {typeLabelMap[notification.type]}
          </span>
          <span className="text-[11px] text-white/20">
            {notification.timestamp}
          </span>
          {!notification.read && (
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          )}
        </div>
      </div>
    </button>
  );
}