import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  likes: number;
  favorites: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  category: string;
  replies: number;
  views: number;
  createdAt: string;
  isHot: boolean;
}

export interface Activity {
  id: string;
  type: 'post' | 'like' | 'comment';
  content: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  userId: string;
  userName: string;
  lastMessage: string;
  unread: number;
  timestamp: string;
  online: boolean;
  messages: ChatMessage[];
}

export interface Notification {
  id: string;
  type: 'reply' | 'like' | 'follow' | 'system' | 'mention';
  content: string;
  from?: string;
  timestamp: string;
  read: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  likes: number;
  createdAt: string;
}

export interface DiscoverUser {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  tags: string[];
  isFollowing: boolean;
}

export interface FeedItem {
  id: string;
  type: 'post' | 'like' | 'follow' | 'share';
  user: { id: string; name: string };
  content: string;
  target?: string;
  timestamp: string;
  likes: number;
  comments: number;
}

const mockUser: User = {
  id: '1',
  name: 'CyberPunk',
  avatar: '',
  bio: '数字世界的探索者 | 全栈开发者 | 开源爱好者',
  followers: 12840,
  following: 342,
  posts: 256,
  likes: 9782,
  favorites: 1536,
};

const mockActivities: Activity[] = [
  { id: '1', type: 'post', content: '发布了一篇新帖子《Web3.0 与去中心化社交的未来》', timestamp: '2小时前' },
  { id: '2', type: 'like', content: '点赞了帖子《React 19 新特性全解析》', timestamp: '5小时前' },
  { id: '3', type: 'comment', content: '评论了《2024年前端技术趋势》', timestamp: '8小时前' },
  { id: '4', type: 'post', content: '发布了一篇新帖子《深入理解 Framer Motion 动画原理》', timestamp: '1天前' },
  { id: '5', type: 'like', content: '点赞了帖子《Tailwind CSS 最佳实践》', timestamp: '1天前' },
  { id: '6', type: 'comment', content: '评论了《TypeScript 高级类型体操》', timestamp: '2天前' },
];

const mockPosts: Post[] = [
  {
    id: '1', title: 'Web3.0 与去中心化社交的未来',
    content: '探讨区块链技术如何重塑社交网络的基础架构。随着以太坊等智能合约平台的成熟，去中心化社交网络（DeSoc）正从概念走向现实。用户将真正拥有自己的数据主权，算法透明化成为可能。但挑战依然存在：可扩展性、用户体验、以及监管合规性都是需要攻克的难题。',
    author: mockUser, category: '技术', replies: 128, views: 5600, createdAt: '2026-06-28', isHot: true,
  },
  {
    id: '2', title: 'React 19 新特性全解析',
    content: 'React 19 带来了许多令人兴奋的新特性，包括 Server Components、Actions、use() hook 等。这些特性将从根本上改变我们构建 React 应用的方式。',
    author: { ...mockUser, id: '2', name: 'CodeMaster', avatar: '' }, category: '技术', replies: 89, views: 4200, createdAt: '2026-06-27', isHot: true,
  },
  {
    id: '3', title: '分享我的极简桌面布置',
    content: '从零开始打造一个高效的工作环境，关键在于减少视觉干扰，保持桌面整洁。',
    author: { ...mockUser, id: '3', name: 'DesignGeek', avatar: '' }, category: '生活', replies: 256, views: 12800, createdAt: '2026-06-26', isHot: true,
  },
  {
    id: '4', title: '《赛博朋克 2077》续作深度解析',
    content: 'CDPR 最新公布的续作细节分析，包括新引擎、新地图和新玩法。',
    author: { ...mockUser, id: '4', name: 'GameFan', avatar: '' }, category: '游戏', replies: 432, views: 18700, createdAt: '2026-06-28', isHot: true,
  },
  {
    id: '5', title: '推荐几部冷门但精彩的科幻电影',
    content: '除去主流大片，这些独立科幻作品同样值得一看。',
    author: { ...mockUser, id: '5', name: 'FilmBuff', avatar: '' }, category: '影视', replies: 67, views: 3100, createdAt: '2026-06-25', isHot: false,
  },
  {
    id: '6', title: 'Rust 语言入门指南',
    content: '从零开始学习 Rust 编程语言的核心概念，包括所有权、借用和生命周期。',
    author: { ...mockUser, id: '6', name: 'Rustacean', avatar: '' }, category: '技术', replies: 145, views: 6700, createdAt: '2026-06-24', isHot: false,
  },
  {
    id: '7', title: '周末徒步：城市周边的隐秘路线',
    content: '分享几条适合周末放松的徒步路线，远离城市喧嚣。',
    author: { ...mockUser, id: '7', name: 'NatureWalker', avatar: '' }, category: '生活', replies: 34, views: 1800, createdAt: '2026-06-23', isHot: false,
  },
  {
    id: '8', title: '独立游戏《Stray》通关感想',
    content: '一只猫的赛博朋克冒险之旅，画面精美，故事感人。',
    author: { ...mockUser, id: '8', name: 'IndieGameLover', avatar: '' }, category: '游戏', replies: 89, views: 3500, createdAt: '2026-06-22', isHot: false,
  },
];

const mockNotifications: Notification[] = [
  { id: 'n1', type: 'reply', content: 'CodeMaster 回复了你的帖子《Web3.0》', from: 'CodeMaster', timestamp: '3分钟前', read: false },
  { id: 'n2', type: 'like', content: 'DesignGeek 赞了你的评论', from: 'DesignGeek', timestamp: '12分钟前', read: false },
  { id: 'n3', type: 'follow', content: 'Rustacean 关注了你', from: 'Rustacean', timestamp: '1小时前', read: false },
  { id: 'n4', type: 'system', content: '系统公告：NEXUS v2.4 版本更新，新增粒子云交互功能', timestamp: '3小时前', read: false },
  { id: 'n5', type: 'mention', content: 'GameFan 在帖子中提到了你', from: 'GameFan', timestamp: '5小时前', read: true },
  { id: 'n6', type: 'like', content: 'FilmBuff 赞了你的帖子《Rust入门》', from: 'FilmBuff', timestamp: '昨天', read: true },
  { id: 'n7', type: 'reply', content: 'NatureWalker 回复了你的帖子《周末徒步》', from: 'NatureWalker', timestamp: '2天前', read: true },
];

const mockChats: ChatConversation[] = [
  {
    id: 'c1', userId: '2', userName: 'CodeMaster', lastMessage: '同意，这个方案确实更优', unread: 3, timestamp: '刚刚', online: true,
    messages: [
      { id: 'm1', senderId: '2', senderName: 'CodeMaster', content: '嘿，你看了最新的 React 19 RFC 吗？', timestamp: '14:30' },
      { id: 'm2', senderId: '1', senderName: 'CyberPunk', content: '看了，Server Components 的改进很令人期待', timestamp: '14:32' },
      { id: 'm3', senderId: '2', senderName: 'CodeMaster', content: '对，特别是流式渲染那块，性能提升很明显', timestamp: '14:33' },
      { id: 'm4', senderId: '1', senderName: 'CyberPunk', content: '你觉得我们应该在项目里先试用吗？', timestamp: '14:35' },
      { id: 'm5', senderId: '2', senderName: 'CodeMaster', content: '同意，这个方案确实更优', timestamp: '14:36' },
    ],
  },
  {
    id: 'c2', userId: '3', userName: 'DesignGeek', lastMessage: '这个配色方案太棒了', unread: 1, timestamp: '5分钟前', online: true,
    messages: [
      { id: 'm6', senderId: '3', senderName: 'DesignGeek', content: '我设计了一套新的暗色主题，你帮我看看', timestamp: '15:00' },
      { id: 'm7', senderId: '1', senderName: 'CyberPunk', content: '发过来看看', timestamp: '15:01' },
      { id: 'm8', senderId: '3', senderName: 'DesignGeek', content: '这个配色方案太棒了', timestamp: '15:05' },
    ],
  },
  {
    id: 'c3', userId: '6', userName: 'Rustacean', lastMessage: 'Rust 的所有权模型确实需要时间适应', unread: 0, timestamp: '昨天', online: false,
    messages: [
      { id: 'm9', senderId: '1', senderName: 'CyberPunk', content: 'Rust 入门确实有点陡峭', timestamp: '昨天 10:00' },
      { id: 'm10', senderId: '6', senderName: 'Rustacean', content: 'Rust 的所有权模型确实需要时间适应', timestamp: '昨天 10:05' },
    ],
  },
];

const mockComments: Record<string, Comment[]> = {
  '1': [
    { id: 'cm1', postId: '1', author: { ...mockUser, id: '2', name: 'CodeMaster' }, content: '非常有深度的见解，Web3确实在改变社交网络的底层架构。期待更多去中心化应用的出现。', likes: 45, createdAt: '2026-06-28 14:30' },
    { id: 'cm2', postId: '1', author: { ...mockUser, id: '6', name: 'Rustacean' }, content: '从技术角度看，区块链的共识机制还需要进一步优化才能支撑大规模社交应用。', likes: 32, createdAt: '2026-06-28 15:10' },
    { id: 'cm3', postId: '1', author: { ...mockUser, id: '3', name: 'DesignGeek' }, content: '用户体验也是关键，如何让普通用户无缝使用去中心化产品是一大挑战。', likes: 18, createdAt: '2026-06-28 16:45' },
  ],
};

const mockDiscoverUsers: DiscoverUser[] = [
  { id: 'd1', name: 'CodeMaster', avatar: '', bio: '全栈工程师 | 开源贡献者', followers: 15420, tags: ['React', 'TypeScript', '开源'], isFollowing: false },
  { id: 'd2', name: 'AIExplorer', avatar: '', bio: 'AI 研究员 | 深度学习爱好者', followers: 28300, tags: ['AI', 'Python', 'LLM'], isFollowing: false },
  { id: 'd3', name: 'CyberArtist', avatar: '', bio: '数字艺术家 | 赛博朋克美学', followers: 9200, tags: ['设计', '3D', 'NFT'], isFollowing: true },
  { id: 'd4', name: 'TechVoyager', avatar: '', bio: '科技博主 | 探索前沿技术', followers: 45600, tags: ['科技', '评测', '硬件'], isFollowing: false },
  { id: 'd5', name: 'QuantumCoder', avatar: '', bio: '量子计算研究员 | 密码学', followers: 18900, tags: ['量子', '密码学', '安全'], isFollowing: false },
  { id: 'd6', name: 'PixelWizard', avatar: '', bio: 'UI/UX 设计师 | 交互体验', followers: 11200, tags: ['UI', 'UX', 'Figma'], isFollowing: true },
];

const mockFeed: FeedItem[] = [
  { id: 'f1', type: 'post', user: { id: '2', name: 'CodeMaster' }, content: '刚发布了一篇关于 React Server Components 的深度解析文章', likes: 234, comments: 56, timestamp: '10分钟前' },
  { id: 'f2', type: 'share', user: { id: '3', name: 'DesignGeek' }, content: '分享了一套赛博朋克风格的 UI 组件库', target: 'Figma Community', likes: 189, comments: 23, timestamp: '25分钟前' },
  { id: 'f3', type: 'follow', user: { id: '6', name: 'Rustacean' }, content: '关注了 AIExplorer', likes: 0, comments: 0, timestamp: '40分钟前' },
  { id: 'f4', type: 'like', user: { id: '4', name: 'GameFan' }, content: '赞了帖子《赛博朋克 2077》续作深度解析', target: '游戏区', likes: 432, comments: 89, timestamp: '1小时前' },
  { id: 'f5', type: 'post', user: { id: '5', name: 'FilmBuff' }, content: '整理了 2024 年必看的 20 部科幻电影清单', likes: 567, comments: 134, timestamp: '2小时前' },
  { id: 'f6', type: 'share', user: { id: '7', name: 'NatureWalker' }, content: '分享了周末徒步的路线图和攻略', target: '生活区', likes: 89, comments: 12, timestamp: '3小时前' },
  { id: 'f7', type: 'post', user: { id: '8', name: 'IndieGameLover' }, content: '推荐 5 款被低估的独立游戏，每一款都是精品', likes: 345, comments: 78, timestamp: '5小时前' },
];

interface AppStore {
  user: User;
  activities: Activity[];
  posts: Post[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  notifications: Notification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  conversations: ChatConversation[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  sendMessage: (chatId: string, content: string) => void;
  comments: Record<string, Comment[]>;
  addComment: (postId: string, content: string) => void;
  discoverUsers: DiscoverUser[];
  toggleFollow: (userId: string) => void;
  feed: FeedItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  notifyOpen: boolean;
  setNotifyOpen: (open: boolean) => void;
}

export const useStore = create<AppStore>((set) => ({
  user: mockUser,
  activities: mockActivities,
  posts: mockPosts,
  activeCategory: '全部',
  setActiveCategory: (category) => set({ activeCategory: category }),
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter((n) => !n.read).length,
  markNotificationRead: (id) => set((s) => {
    const notifications = s.notifications.map((n) => n.id === id ? { ...n, read: true } : n);
    return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
  }),
  markAllRead: () => set((s) => ({
    notifications: s.notifications.map((n) => ({ ...n, read: true })),
    unreadCount: 0,
  })),
  conversations: mockChats,
  activeChatId: null,
  setActiveChatId: (id) => set({ activeChatId: id }),
  sendMessage: (chatId, content) => set((s) => {
    const conversations = s.conversations.map((c) => {
      if (c.id === chatId) {
        const newMsg: ChatMessage = {
          id: `m${Date.now()}`,
          senderId: '1',
          senderName: 'CyberPunk',
          content,
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        };
        return { ...c, messages: [...c.messages, newMsg], lastMessage: content, timestamp: '刚刚' };
      }
      return c;
    });
    return { conversations };
  }),
  comments: mockComments,
  addComment: (postId, content) => set((s) => {
    const newComment: Comment = {
      id: `cm${Date.now()}`,
      postId,
      author: s.user,
      content,
      likes: 0,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    const comments = { ...s.comments };
    comments[postId] = [...(comments[postId] || []), newComment];
    return { comments };
  }),
  discoverUsers: mockDiscoverUsers,
  toggleFollow: (userId) => set((s) => ({
    discoverUsers: s.discoverUsers.map((u) =>
      u.id === userId ? { ...u, isFollowing: !u.isFollowing } : u
    ),
  })),
  feed: mockFeed,
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),
  settingsOpen: false,
  setSettingsOpen: (open) => set({ settingsOpen: open }),
  chatOpen: false,
  setChatOpen: (open) => set({ chatOpen: open }),
  notifyOpen: false,
  setNotifyOpen: (open) => set({ notifyOpen: open }),
}));