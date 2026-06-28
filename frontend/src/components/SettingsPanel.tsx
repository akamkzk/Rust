import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Moon, Sun, Bell, Mail, Globe, Shield, LogOut, User } from 'lucide-react';
import { useStore } from '@/store/useStore';

/* ===================================================
   ToggleSwitch - 内联开关组件
   =================================================== */
function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 ${
        checked ? 'bg-cyber-cyan/40' : 'bg-white/10'
      }`}
    >
      <motion.span
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`inline-block h-5 w-5 rounded-full ${
          checked ? 'bg-cyber-cyan' : 'bg-white/30'
        } shadow-sm`}
      />
    </button>
  );
}

/* ===================================================
   面板动画变体
   =================================================== */
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

/* ===================================================
   SettingsPanel 主组件
   =================================================== */
export default function SettingsPanel() {
  const { settingsOpen, setSettingsOpen, user } = useStore();

  /* ---- 主题 ---- */
  const [themeDark, setThemeDark] = useState(true);

  /* ---- 通知 ---- */
  const [notifyMsg, setNotifyMsg] = useState(true);
  const [notifySystem, setNotifySystem] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);

  /* ---- 隐私 ---- */
  const [publicProfile, setPublicProfile] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);

  /* ---- 语言 ---- */
  const [language, setLanguage] = useState('zh');

  /* ---- 退出登录 ---- */
  const handleLogout = () => {
    // 可在此处添加实际退出登录逻辑
    console.log('退出登录');
  };

  return (
    <>
      {/* ========== 右下角齿轮按钮 ========== */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setSettingsOpen(!settingsOpen)}
        className="
          fixed bottom-24 right-6 z-40
          flex items-center justify-center
          w-12 h-12 rounded-full
          bg-white/5 backdrop-blur-xl border border-white/10
          text-slate-400 hover:text-white
          hover:border-cyber-cyan/40 hover:bg-cyber-cyan/10
          transition-all duration-300
          shadow-lg shadow-black/20
        "
        aria-label="打开设置面板"
      >
        <Settings className="w-5 h-5" strokeWidth={1.5} />
      </motion.button>

      {/* ========== 遮罩层 + 面板 ========== */}
      <AnimatePresence>
        {settingsOpen && (
          <>
            {/* 遮罩层 */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setSettingsOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            {/* 面板 */}
            <motion.aside
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="
                fixed top-0 right-0 z-50 h-full
                w-[340px] max-w-[90vw]
                bg-cyber-surface/95 backdrop-blur-2xl
                border-l border-white/10
                shadow-2xl shadow-black/40
                flex flex-col
              "
            >
              {/* ---- 头部：标题 + 关闭 ---- */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <h2 className="text-base font-semibold text-white tracking-wide">设置</h2>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>

              {/* ---- 内容区域 ---- */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                {/* ---- 用户信息 ---- */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-cyan/30 to-cyber-indigo/30 flex items-center justify-center ring-1 ring-white/5 shrink-0">
                    <User className="w-6 h-6 text-slate-300" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{user.bio}</p>
                  </div>
                </div>

                {/* ---- 主题切换 ---- */}
                <section>
                  <h3 className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-3">
                    外观
                  </h3>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                        {themeDark ? (
                          <Moon className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
                        ) : (
                          <Sun className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
                        )}
                      </div>
                      <span className="text-sm text-slate-300">暗色模式</span>
                    </div>
                    <ToggleSwitch checked={themeDark} onChange={setThemeDark} />
                  </div>
                </section>

                {/* ---- 通知设置 ---- */}
                <section>
                  <h3 className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-3">
                    通知
                  </h3>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyber-cyan/10 flex items-center justify-center">
                          <Bell className="w-4 h-4 text-cyber-cyan" strokeWidth={1.5} />
                        </div>
                        <span className="text-sm text-slate-300">消息通知</span>
                      </div>
                      <ToggleSwitch checked={notifyMsg} onChange={setNotifyMsg} />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                          <Bell className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
                        </div>
                        <span className="text-sm text-slate-300">系统通知</span>
                      </div>
                      <ToggleSwitch checked={notifySystem} onChange={setNotifySystem} />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-400/10 flex items-center justify-center">
                          <Mail className="w-4 h-4 text-rose-400" strokeWidth={1.5} />
                        </div>
                        <span className="text-sm text-slate-300">邮件通知</span>
                      </div>
                      <ToggleSwitch checked={notifyEmail} onChange={setNotifyEmail} />
                    </div>
                  </div>
                </section>

                {/* ---- 隐私设置 ---- */}
                <section>
                  <h3 className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-3">
                    隐私
                  </h3>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyber-emerald/10 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-cyber-emerald" strokeWidth={1.5} />
                        </div>
                        <span className="text-sm text-slate-300">公开资料</span>
                      </div>
                      <ToggleSwitch checked={publicProfile} onChange={setPublicProfile} />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-400/10 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-purple-400" strokeWidth={1.5} />
                        </div>
                        <span className="text-sm text-slate-300">在线状态</span>
                      </div>
                      <ToggleSwitch checked={onlineStatus} onChange={setOnlineStatus} />
                    </div>
                  </div>
                </section>

                {/* ---- 语言选择 ---- */}
                <section>
                  <h3 className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-3">
                    语言
                  </h3>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Globe className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
                    </div>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="
                        w-full pl-10 pr-4 py-3 rounded-xl
                        bg-white/[0.02] border border-white/5
                        text-sm text-slate-300
                        focus:outline-none focus:border-cyber-cyan/40
                        appearance-none cursor-pointer
                        transition-colors duration-200
                        hover:bg-white/[0.04]
                      "
                    >
                      <option value="zh" className="bg-cyber-surface text-slate-300">
                        中文
                      </option>
                      <option value="en" className="bg-cyber-surface text-slate-300">
                        English
                      </option>
                    </select>
                    {/* 自定义下拉箭头 */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </section>
              </div>

              {/* ---- 底部：退出登录 ---- */}
              <div className="px-6 py-5 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="
                    w-full flex items-center justify-center gap-2
                    px-4 py-3 rounded-xl
                    bg-red-500/10 border border-red-500/20
                    text-red-400 text-sm font-medium
                    hover:bg-red-500/20 hover:border-red-500/40
                    hover:text-red-300
                    transition-all duration-300
                  "
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.5} />
                  退出登录
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}