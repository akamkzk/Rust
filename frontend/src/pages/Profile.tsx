import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { User, MessageSquare, Heart, Bookmark, Edit3, MapPin, Calendar, FileText, ThumbsUp, MessageCircle } from 'lucide-react';

const activityIcons = {
  post: FileText,
  like: ThumbsUp,
  comment: MessageCircle,
};

const activityColors = {
  post: 'text-cyber-cyan',
  like: 'text-rose-400',
  comment: 'text-amber-400',
};

const activityBg = {
  post: 'bg-cyber-cyan/10',
  like: 'bg-rose-400/10',
  comment: 'bg-amber-400/10',
};

export default function ProfilePage() {
  const { user, activities } = useStore();

  const stats = [
    { label: '帖子', value: user.posts.toLocaleString(), icon: FileText, color: 'text-cyber-cyan' },
    { label: '获赞', value: user.likes.toLocaleString(), icon: Heart, color: 'text-rose-400' },
    { label: '收藏', value: user.favorites.toLocaleString(), icon: Bookmark, color: 'text-amber-400' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-cyber-black">
      <div className="max-w-main mx-auto px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-12 p-10 rounded-3xl glass overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 blur-[80px]"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)' }}
          />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-15 blur-[80px]"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)' }}
          />

          <div className="relative flex flex-col md:flex-row items-start gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyber-cyan to-cyber-indigo flex items-center justify-center ring-4 ring-cyber-black/50">
                <User className="w-10 h-10 text-white" strokeWidth={1.5} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cyber-emerald border-2 border-cyber-black flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
                    {user.name}
                  </h1>
                  <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
                    {user.bio}
                  </p>
                </div>
                <button className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full glass-hover text-sm text-slate-300 transition-all duration-300">
                  <Edit3 className="w-4 h-4" strokeWidth={1.5} />
                  编辑资料
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-4">
                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="w-4 h-4" strokeWidth={1.5} />
                  数字空间
                </span>
                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="w-4 h-4" strokeWidth={1.5} />
                  2024年加入
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-400">
                    <strong className="text-white font-semibold">{user.followers.toLocaleString()}</strong>
                    {' '}关注者
                  </span>
                  <span className="text-sm text-slate-400">
                    <strong className="text-white font-semibold">{user.following.toLocaleString()}</strong>
                    {' '}正在关注
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-300 tracking-wide mb-4">数据统计</h3>
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${stat.color.replace('text', 'bg')}/10 flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${stat.color}`} strokeWidth={1.5} />
                      </div>
                      <span className="text-sm text-slate-400">{stat.label}</span>
                    </div>
                    <span className="text-lg font-bold text-white font-display">{stat.value}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-300 tracking-wide mb-6">最近动态</h3>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-5 top-2 bottom-2 w-px bg-white/5" />

                <div className="space-y-6">
                  {activities.map((activity, index) => {
                    const Icon = activityIcons[activity.type];
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.08 }}
                        className="relative flex items-start gap-4 pl-2"
                      >
                        {/* Timeline dot */}
                        <div className={`relative z-10 w-8 h-8 rounded-full ${activityBg[activity.type]} flex items-center justify-center ring-4 ring-cyber-black shrink-0`}>
                          <Icon className={`w-4 h-4 ${activityColors[activity.type]}`} strokeWidth={1.5} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-4">
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {activity.content}
                          </p>
                          <span className="text-xs text-slate-600 mt-1.5 block">
                            {activity.timestamp}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}