import { useEffect, useRef, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, User } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function SearchOverlay() {
  const { searchQuery, setSearchQuery, searchOpen, setSearchOpen, posts, discoverUsers } = useStore();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [highlightedUserId, setHighlightedUserId] = useState<string | null>(null);

  // 监听键盘快捷键 Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  // 打开时自动聚焦输入框并清空搜索词
  useEffect(() => {
    if (searchOpen) {
      setSearchQuery('');
      setHighlightedUserId(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchOpen, setSearchQuery]);

  // 根据搜索词过滤结果
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return posts.filter((p) => p.title.toLowerCase().includes(q));
  }, [searchQuery, posts]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return discoverUsers.filter((u) => u.name.toLowerCase().includes(q));
  }, [searchQuery, discoverUsers]);

  const hasResults = filteredPosts.length > 0 || filteredUsers.length > 0;
  const hasNoResults = searchQuery.trim().length > 0 && !hasResults;

  const handlePostClick = (postId: string) => {
    setSearchOpen(false);
    navigate(`/post/${postId}`);
  };

  const handleUserClick = (userId: string) => {
    setHighlightedUserId(userId === highlightedUserId ? null : userId);
  };

  const handleClose = () => {
    setSearchOpen(false);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
        >
          {/* 暗色半透明遮罩 */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* 搜索面板 */}
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-[calc(100vw-32px)] sm:w-[560px] mx-4 sm:mx-auto glass rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
          >
            {/* 搜索输入框 */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <Search className="w-5 h-5 text-slate-500 shrink-0" strokeWidth={1.5} />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索帖子或用户..."
                className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-slate-500 outline-none"
              />
              <button
                onClick={handleClose}
                className="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* 搜索结果 */}
            <div className="max-h-[50vh] overflow-y-auto">
              {/* 无结果 */}
              {hasNoResults && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <Search className="w-8 h-8 mb-3 opacity-40" strokeWidth={1.5} />
                  <p className="text-sm">未找到相关内容</p>
                </div>
              )}

              {/* 帖子结果 */}
              {filteredPosts.length > 0 && (
                <div className="py-2">
                  <div className="px-5 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    帖子
                  </div>
                  {filteredPosts.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => handlePostClick(post.id)}
                      className="w-full flex items-start gap-3 px-5 py-3 hover:bg-white/5 transition-colors duration-200 text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-cyber-cyan/10 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-4 h-4 text-cyber-cyan" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-slate-200 group-hover:text-white transition-colors truncate">
                          {post.title}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                          {post.author.name} · {post.category} · {post.views.toLocaleString()} 浏览
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* 用户结果 */}
              {filteredUsers.length > 0 && (
                <div className="py-2">
                  <div className="px-5 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    用户
                  </div>
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserClick(user.id)}
                      className={`w-full flex items-start gap-3 px-5 py-3 hover:bg-white/5 transition-colors duration-200 text-left ${
                        highlightedUserId === user.id ? 'bg-cyber-cyan/10' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-cyan/30 to-cyber-indigo/30 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-slate-200 transition-colors truncate">
                          {user.name}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">
                          {user.bio}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* 搜索为空时显示提示 */}
              {!searchQuery.trim() && (
                <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                  <Search className="w-8 h-8 mb-3 opacity-30" strokeWidth={1.5} />
                  <p className="text-sm">输入关键词搜索帖子或用户</p>
                  <p className="text-xs text-slate-600 mt-1">
                    按 <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-400 text-[11px]">Esc</kbd> 关闭
                  </p>
                </div>
              )}
            </div>

            {/* 底部快捷键提示 */}
            {searchQuery.trim() && hasResults && (
              <div className="px-5 py-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-600">
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-slate-500">↑↓</kbd> 导航
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-slate-500">Esc</kbd> 关闭
                </span>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}