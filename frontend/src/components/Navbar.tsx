import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon, Menu, X, Search, Bell, MessageCircle, Settings, Compass, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';
import NotificationCenter from './NotificationCenter';

const navLinks = [
  { path: '/', label: '首页' },
  { path: '/forum', label: '贴吧' },
  { path: '/discover', label: '发现' },
  { path: '/feed', label: '动态' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { unreadCount, setSearchOpen, setSettingsOpen, setChatOpen, notifyOpen, setNotifyOpen } = useStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cyber-black/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-main mx-auto px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <Hexagon className="w-7 h-7 text-cyber-cyan transition-transform duration-300 group-hover:rotate-90" strokeWidth={1.5} />
          <span className="font-display text-lg font-bold tracking-wider text-white">
            NEXUS
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-5 py-2 text-sm tracking-wide transition-colors duration-300 rounded-lg ${
                  isActive
                    ? 'text-cyber-cyan'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyber-cyan"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Action Icons + CTA */}
        <div className="hidden md:flex items-center gap-2">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="relative p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            title="搜索 (Ctrl+K)"
          >
            <Search className="w-4 h-4" strokeWidth={1.5} />
            <span className="absolute -bottom-0.5 right-1 text-[9px] text-slate-600 font-mono">⌘K</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifyOpen(!notifyOpen)}
              className="relative p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <Bell className="w-4 h-4" strokeWidth={1.5} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <NotificationCenter />
          </div>

          {/* Chat */}
          <button
            onClick={() => setChatOpen(true)}
            className="relative p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
          </button>

          {/* Settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <Settings className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cyber-surface/95 backdrop-blur-xl border-b border-white/5 overflow-hidden"
          >
            <div className="px-8 py-4 flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-3 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'text-cyber-cyan bg-cyber-cyan/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                <button onClick={() => { setSearchOpen(true); setMobileOpen(false); }} className="flex-1 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" /> 搜索
                </button>
                <button onClick={() => { setChatOpen(true); setMobileOpen(false); }} className="flex-1 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" /> 消息
                </button>
                <button onClick={() => { setSettingsOpen(true); setMobileOpen(false); }} className="flex-1 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 flex items-center justify-center gap-2">
                  <Settings className="w-4 h-4" /> 设置
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}