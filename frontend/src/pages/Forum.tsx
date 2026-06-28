import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { MessageSquare, Eye, Clock, Flame, User, TrendingUp, Plus } from 'lucide-react';

const categories = ['全部', '技术', '生活', '游戏', '影视'];

export default function ForumPage() {
  const { posts, activeCategory, setActiveCategory } = useStore();

  const filteredPosts = activeCategory === '全部'
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  const hotPosts = posts.filter((p) => p.isHot).slice(0, 5);

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16 bg-cyber-black">
      <div className="max-w-main mx-auto px-4 sm:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
            贴吧
          </h1>
          <p className="text-sm text-slate-500">探索话题，加入讨论，分享你的见解</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-1 sm:gap-2 mb-8 overflow-x-auto pb-2"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    activeCategory === cat
                      ? 'text-white bg-cyber-cyan/20 border border-cyber-cyan/40 shadow-lg shadow-cyber-cyan/10'
                      : 'text-slate-400 border border-white/5 hover:border-white/15 hover:text-slate-300'
                  }`}
                >
                  {cat}
                  {activeCategory === cat && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute inset-0 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}

              {/* Create Post Button */}
              <button className="w-full sm:w-auto sm:ml-auto flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-indigo text-white text-sm font-medium hover:shadow-lg hover:shadow-cyber-cyan/25 transition-all duration-300 whitespace-nowrap">
                <Plus className="w-4 h-4" strokeWidth={2} />
                发帖
              </button>
            </motion.div>

            {/* Post List */}
            <div className="space-y-3">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                  className="group glass-hover rounded-2xl p-4 sm:p-5 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    {/* Author Avatar */}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyber-cyan/30 to-cyber-indigo/30 flex items-center justify-center shrink-0 ring-1 ring-white/5">
                      <User className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-cyber-cyan transition-colors duration-300 truncate">
                          {post.title}
                        </h3>
                        {post.isHot && (
                          <Flame className="w-4 h-4 text-orange-400 shrink-0" strokeWidth={1.5} />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mb-3 line-clamp-1">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-[10px] sm:text-xs text-slate-600">
                        <span className="text-slate-400">{post.author.name}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" strokeWidth={1.5} />
                          {post.createdAt}
                        </span>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-[10px] sm:text-xs text-slate-600 shrink-0">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
                        {post.replies}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                        {post.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden lg:block lg:col-span-1"
          >
            {/* Hot Topics */}
            <div className="glass rounded-2xl p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-4 h-4 text-cyber-cyan" strokeWidth={1.5} />
                <h3 className="text-sm font-semibold text-slate-300 tracking-wide">热门讨论</h3>
              </div>

              <div className="space-y-1">
                {hotPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors duration-200 cursor-pointer group"
                  >
                    <span className={`font-display text-xs font-bold shrink-0 w-5 h-5 rounded flex items-center justify-center ${
                      index < 3 ? 'text-cyber-cyan bg-cyber-cyan/10' : 'text-slate-600 bg-white/[0.02]'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-200 line-clamp-2 leading-relaxed">
                        {post.title}
                      </p>
                      <span className="text-[10px] text-slate-600 mt-1 block">
                        {post.replies} 回复 · {post.views.toLocaleString()} 浏览
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Category Tag Cloud */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <h4 className="text-xs font-semibold text-slate-500 tracking-wide mb-3">热门标签</h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Web3', 'AI', '前端', 'Rust', '赛博朋克', '开源', '设计'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full text-[10px] text-slate-500 bg-white/[0.02] border border-white/5 hover:border-cyber-cyan/30 hover:text-cyber-cyan transition-all duration-300 cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}