import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ChevronLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { ChatConversation, ChatMessage } from '@/store/useStore';

export default function ChatPanel() {
  const {
    conversations,
    activeChatId,
    setActiveChatId,
    sendMessage,
    chatOpen,
    setChatOpen,
  } = useStore();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);
  const activeConversation = conversations.find((c) => c.id === activeChatId) ?? null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || !activeChatId) return;
    sendMessage(activeChatId, trimmed);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ---------- 右下角悬浮按钮 ---------- */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setChatOpen(!chatOpen)}
        className="
          fixed bottom-6 right-6 z-50
          flex items-center justify-center
          w-14 h-14 rounded-full
          bg-gradient-to-br from-cyan-500 to-blue-600
          text-white shadow-lg shadow-cyan-500/30
          hover:shadow-cyan-500/50 transition-shadow
        "
        aria-label="打开聊天面板"
      >
        {chatOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {totalUnread > 0 && !chatOpen && (
          <span className="
            absolute -top-1 -right-1
            flex items-center justify-center
            min-w-[20px] h-5 px-1
            rounded-full bg-red-500
            text-[11px] font-bold text-white
            border-2 border-slate-900
          ">
            {totalUnread > 99 ? '99+' : totalUnread}
          </span>
        )}
      </motion.button>

      {/* ---------- 聊天面板 ---------- */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="
              fixed bottom-24 right-6 z-40
              w-[720px] h-[520px] max-w-[calc(100vw-48px)]
              rounded-2xl overflow-hidden
              border border-white/10
              bg-slate-900/70 backdrop-blur-2xl
              shadow-2xl shadow-black/50
              flex
            "
          >
            {/* ---- 左侧对话列表 ---- */}
            <div className="
              w-[260px] shrink-0
              border-r border-white/5
              flex flex-col
              bg-white/[0.02]
            ">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white/90">聊天</h3>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-white/40 hover:text-white/80 transition-colors"
                  aria-label="关闭聊天面板"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 && (
                  <p className="text-center text-white/30 text-sm mt-10">暂无对话</p>
                )}
                {conversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    isActive={conv.id === activeChatId}
                    onClick={() => setActiveChatId(conv.id)}
                  />
                ))}
              </div>
            </div>

            {/* ---- 右侧聊天窗口 ---- */}
            {activeConversation ? (
              <div className="flex-1 flex flex-col min-w-0">
                {/* 聊天头部 */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                  <button
                    onClick={() => setActiveChatId(null)}
                    className="text-white/40 hover:text-white/80 transition-colors shrink-0"
                    aria-label="返回对话列表"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                      {activeConversation.userName.charAt(0)}
                    </div>
                    {activeConversation.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-slate-900" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white/90 truncate">
                      {activeConversation.userName}
                    </p>
                    <p className="text-[11px] text-white/40">
                      {activeConversation.online ? '在线' : '离线'}
                    </p>
                  </div>
                </div>

                {/* 消息列表 */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                  {activeConversation.messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isOwn={msg.senderId === '1'}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* 输入框 */}
                <div className="px-4 py-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="输入消息..."
                      className="
                        flex-1 px-3 py-2 rounded-lg
                        bg-white/5 border border-white/10
                        text-sm text-white/90 placeholder:text-white/25
                        outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30
                        transition-colors
                      "
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputValue.trim()}
                      className="
                        p-2 rounded-lg
                        bg-cyan-500/20 text-cyan-400
                        hover:bg-cyan-500/30
                        disabled:opacity-30 disabled:cursor-not-allowed
                        transition-colors
                      "
                      aria-label="发送消息"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-white/25 text-sm">选择一位用户开始聊天</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ==================== 子组件 ==================== */

function ConversationItem({
  conversation,
  isActive,
  onClick,
}: {
  conversation: ChatConversation;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3
        text-left transition-colors
        ${isActive
          ? 'bg-cyan-500/10 border-l-2 border-cyan-400'
          : 'border-l-2 border-transparent hover:bg-white/[0.04]'
        }
      `}
    >
      {/* 头像 */}
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400/60 to-blue-500/60 flex items-center justify-center text-white text-sm font-bold">
          {conversation.userName.charAt(0)}
        </div>
        {conversation.online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-slate-900" />
        )}
      </div>

      {/* 中间信息 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white/90 truncate">
          {conversation.userName}
        </p>
        <p className="text-xs text-white/40 truncate">
          {conversation.lastMessage}
        </p>
      </div>

      {/* 右侧时间 + 未读数 */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-[11px] text-white/30">{conversation.timestamp}</span>
        {conversation.unread > 0 && (
          <span className="
            flex items-center justify-center
            min-w-[18px] h-[18px] px-1
            rounded-full bg-cyan-500
            text-[10px] font-bold text-white
          ">
            {conversation.unread > 99 ? '99+' : conversation.unread}
          </span>
        )}
      </div>
    </button>
  );
}

function MessageBubble({
  message,
  isOwn,
}: {
  message: ChatMessage;
  isOwn: boolean;
}) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
          ${isOwn
            ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-br-md'
            : 'bg-white/10 text-white/85 rounded-bl-md'
          }
        `}
      >
        {!isOwn && (
          <p className="text-[11px] text-cyan-400 font-medium mb-0.5">
            {message.senderName}
          </p>
        )}
        <p>{message.content}</p>
        <p
          className={`text-[10px] mt-1 text-right ${
            isOwn ? 'text-white/60' : 'text-white/30'
          }`}
        >
          {message.timestamp}
        </p>
      </div>
    </div>
  );
}