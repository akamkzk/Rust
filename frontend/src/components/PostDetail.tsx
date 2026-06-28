import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Eye, User, Send, ArrowLeft, Clock } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { posts, comments, addComment, user } = useStore();
  const [commentText, setCommentText] = useState('');

  const post = posts.find((p) => p.id === id);

  // 帖子不存在
  if (!post) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-cyber-black">
        <div className="max-w-main mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl p-16 text-center"
          >
            <FileTextIcon className="w-16 h-16 text-slate-600 mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-slate-400 mb-3">帖子不存在</h2>
            <p className="text-sm text-slate-600 mb-8">该帖子可能已被删除或链接无效</p>
            <button
              onClick={() => navigate('/forum')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-sm hover:bg-cyber-cyan/20 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              返回贴吧
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const postComments = comments[post.id] || [];

  const handleSendComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    addComment(post.id, trimmed);
    setCommentText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-cyber-black">
      <div className="max-w-main mx-auto px-8">
        <div className="max-w-3xl mx-auto">
          {/* 返回按钮 */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => navigate('/forum')}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
            返回贴吧
          </motion.button>

          {/* 帖子主体 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-3xl p-8 md:p-10 mb-8 relative overflow-hidden"
          >
            {/* 背景光晕 */}
            <div
              className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-10 blur-[80px] pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)' }}
            />

            {/* 分类标签 */}
            <div className="relative mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20">
                {post.category}
              </span>
            </div>

            {/* 标题 */}
            <h1 className="relative text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight leading-tight">
              {post.title}
            </h1>

            {/* 作者和元信息 */}
            <div className="relative flex flex-wrap items-center gap-5 mb-8">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyber-cyan/30 to-cyber-indigo/30 flex items-center justify-center ring-1 ring-white/10">
                  <User className="w-4.5 h-4.5 text-slate-400" strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium text-slate-300">{post.author.name}</span>
              </div>

              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                {post.createdAt}
              </span>

              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                {post.views.toLocaleString()} 浏览
              </span>

              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
                {post.replies} 回复
              </span>
            </div>

            {/* 内容 */}
            <div className="relative text-sm text-slate-300 leading-relaxed space-y-4">
              {post.content.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </motion.div>

          {/* 评论区 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-3xl p-8 md:p-10"
          >
            <div className="flex items-center gap-2.5 mb-8">
              <MessageSquare className="w-5 h-5 text-cyber-cyan" strokeWidth={1.5} />
              <h2 className="text-lg font-semibold text-white tracking-tight">
                评论 {postComments.length > 0 && <span className="text-slate-500 font-normal">({postComments.length})</span>}
              </h2>
            </div>

            {/* 评论列表 */}
            {postComments.length > 0 ? (
              <div className="space-y-5 mb-8">
                {postComments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * index }}
                    className="group"
                  >
                    <div className="flex gap-3">
                      {/* 头像首字母 */}
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyber-cyan/20 to-cyber-indigo/20 flex items-center justify-center shrink-0 ring-1 ring-white/5">
                        <span className="text-xs font-semibold text-cyber-cyan">
                          {comment.author.name.charAt(0)}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-slate-200">
                            {comment.author.name}
                          </span>
                          <span className="text-xs text-slate-600">
                            {comment.createdAt}
                          </span>
                        </div>

                        <p className="text-sm text-slate-400 leading-relaxed mb-2">
                          {comment.content}
                        </p>

                        {/* 点赞 */}
                        <button className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-rose-400 transition-colors duration-200">
                          <Heart className="w-3.5 h-3.5" strokeWidth={1.5} />
                          <span>{comment.likes}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 mb-6">
                <MessageSquare className="w-10 h-10 text-slate-700 mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-sm text-slate-600">暂无评论，快来发表第一条评论吧</p>
              </div>
            )}

            {/* 评论输入框 */}
            <div className="flex items-start gap-3 pt-6 border-t border-white/5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyber-cyan/20 to-cyber-indigo/20 flex items-center justify-center shrink-0 ring-1 ring-white/5">
                <span className="text-xs font-semibold text-cyber-cyan">
                  {user.name.charAt(0)}
                </span>
              </div>

              <div className="flex-1 flex items-end gap-3">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="写下你的评论..."
                  rows={2}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none resize-none focus:border-cyber-cyan/40 focus:bg-white/[0.07] transition-all duration-300"
                />
                <button
                  onClick={handleSendComment}
                  disabled={!commentText.trim()}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-indigo text-white text-sm font-medium hover:shadow-lg hover:shadow-cyber-cyan/25 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none shrink-0"
                >
                  <Send className="w-4 h-4" strokeWidth={1.5} />
                  发送
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/** 帖子不存在时使用的小图标 */
function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}