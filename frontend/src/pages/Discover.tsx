import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { UserPlus, UserCheck, Users } from 'lucide-react';

/* ===================================================
   卡片入场动画
   =================================================== */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
};

/* ===================================================
   获取用户头像首字母
   =================================================== */
function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

/* ===================================================
   格式化粉丝数
   =================================================== */
function formatFollowers(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

/* ===================================================
   Discover 页面组件
   =================================================== */
export default function DiscoverPage() {
  const { discoverUsers, toggleFollow } = useStore();

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16 bg-cyber-black">
      <div className="max-w-main mx-auto px-4 sm:px-8">
        {/* ---- 页面标题 ---- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-7 h-7 text-cyber-cyan" strokeWidth={1.5} />
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              发现用户
            </h1>
          </div>
          <p className="text-sm text-slate-500">探索更多有趣的人，扩展你的数字社交圈</p>
        </motion.div>

        {/* ---- 用户卡片网格 ---- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {discoverUsers.map((u) => (
            <motion.div
              key={u.id}
              variants={cardVariants}
              className="group glass rounded-2xl p-4 sm:p-6 hover:border-cyber-cyan/20 transition-all duration-300"
            >
              {/* ---- 卡片顶部：头像 + 信息 ---- */}
              <div className="flex items-start gap-4 mb-4">
                {/* 首字母头像 */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyber-cyan/30 to-cyber-indigo/30 flex items-center justify-center ring-1 ring-white/10 shrink-0">
                  <span className="text-lg font-bold text-white font-display">
                    {getInitial(u.name)}
                  </span>
                </div>

                {/* 用户名 + 简介 */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-white truncate group-hover:text-cyber-cyan transition-colors duration-300">
                    {u.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {u.bio}
                  </p>
                </div>
              </div>

              {/* ---- 粉丝数 ---- */}
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-3.5 h-3.5 text-slate-600" strokeWidth={1.5} />
                <span className="text-xs text-slate-500">
                  <strong className="text-slate-300 font-semibold">
                    {formatFollowers(u.followers)}
                  </strong>
                  {' '}粉丝
                </span>
              </div>

              {/* ---- 标签 ---- */}
              <div className="flex flex-wrap gap-2 mb-4">
                {u.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full text-[10px] text-slate-500 bg-white/[0.03] border border-white/5 group-hover:border-cyber-cyan/20 transition-colors duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* ---- 关注/已关注按钮 ---- */}
              <button
                onClick={() => toggleFollow(u.id)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                  u.isFollowing
                    ? 'bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/15'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-cyber-cyan/10 hover:border-cyber-cyan/30 hover:text-cyber-cyan'
                }`}
              >
                {u.isFollowing ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
                    已关注
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" strokeWidth={1.5} />
                    关注
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}