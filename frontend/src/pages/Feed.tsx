import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { FileText, Heart, UserPlus, Share2, MessageCircle, ThumbsUp, Zap } from 'lucide-react';
import type { FeedItem } from '@/store/useStore';

/* ===================================================
   动态类型图标映射
   =================================================== */
const typeMeta: Record<
  FeedItem['type'],
  { icon: typeof FileText; label: string; color: string; bg: string }
> = {
  post: {
    icon: FileText,
    label: '发布了',
    color: 'text-cyber-cyan',
    bg: 'bg-cyber-cyan/10',
  },
  like: {
    icon: Heart,
    label: '赞了',
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
  },
  follow: {
    icon: UserPlus,
    label: '关注了',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  share: {
    icon: Share2,
    label: '分享了',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
};

/* ===================================================
   列表项动画
   =================================================== */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
};

/* ===================================================
   Feed 页面组件
   =================================================== */
export default function FeedPage() {
  const { feed } = useStore();

  return (
    <div className="min-h-screen pt-24 pb-16 bg-cyber-black">
      <div className="max-w-main mx-auto px-8 max-w-3xl">
        {/* ---- 页面标题 ---- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-7 h-7 text-cyber-cyan" strokeWidth={1.5} />
            <h1 className="font-display text-3xl font-bold text-white tracking-tight">
              动态广场
            </h1>
          </div>
          <p className="text-sm text-slate-500">浏览社区最新动态，不错过每一个精彩瞬间</p>
        </motion.div>

        {/* ---- 动态流 ---- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {feed.map((item) => {
            const meta = typeMeta[item.type];
            const Icon = meta.icon;

            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="group glass rounded-2xl p-5 hover:border-cyber-cyan/15 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* ---- 类型图标 ---- */}
                  <div
                    className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center shrink-0 ring-1 ring-white/5`}
                  >
                    <Icon className={`w-4 h-4 ${meta.color}`} strokeWidth={1.5} />
                  </div>

                  {/* ---- 内容区 ---- */}
                  <div className="flex-1 min-w-0">
                    {/* 用户 + 动作 */}
                    <p className="text-sm text-slate-300 leading-relaxed">
                      <span className="font-semibold text-white group-hover:text-cyber-cyan transition-colors duration-300">
                        {item.user.name}
                      </span>
                      <span className="text-slate-500 mx-1">{meta.label}</span>
                      <span className="text-slate-300">{item.content}</span>
                    </p>

                    {/* 目标内容 */}
                    {item.target && (
                      <span className="inline-block mt-2 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-slate-500">
                        {item.target}
                      </span>
                    )}

                    {/* 底部：时间 + 互动数据 */}
                    <div className="flex items-center gap-5 mt-3">
                      <span className="text-xs text-slate-600">{item.timestamp}</span>

                      {item.type !== 'follow' && (
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-xs text-slate-600">
                            <ThumbsUp className="w-3 h-3" strokeWidth={1.5} />
                            {item.likes > 0 ? item.likes.toLocaleString() : '点赞'}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-slate-600">
                            <MessageCircle className="w-3 h-3" strokeWidth={1.5} />
                            {item.comments > 0 ? item.comments.toLocaleString() : '评论'}
                          </span>
                        </div>
                      )}

                      {item.type === 'follow' && (
                        <span className="text-xs text-slate-600">关注</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}