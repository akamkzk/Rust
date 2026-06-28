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
    id: '1',
    title: 'Web3.0 与去中心化社交的未来',
    content: '探讨区块链技术如何重塑社交网络的基础架构...',
    author: mockUser,
    category: '技术',
    replies: 128,
    views: 5600,
    createdAt: '2026-06-28',
    isHot: true,
  },
  {
    id: '2',
    title: 'React 19 新特性全解析',
    content: 'React 19 带来了许多令人兴奋的新特性，包括 Server Components...',
    author: { ...mockUser, id: '2', name: 'CodeMaster', avatar: '' },
    category: '技术',
    replies: 89,
    views: 4200,
    createdAt: '2026-06-27',
    isHot: true,
  },
  {
    id: '3',
    title: '分享我的极简桌面布置',
    content: '从零开始打造一个高效的工作环境...',
    author: { ...mockUser, id: '3', name: 'DesignGeek', avatar: '' },
    category: '生活',
    replies: 256,
    views: 12800,
    createdAt: '2026-06-26',
    isHot: true,
  },
  {
    id: '4',
    title: '《赛博朋克 2077》续作深度解析',
    content: 'CDPR 最新公布的续作细节分析...',
    author: { ...mockUser, id: '4', name: 'GameFan', avatar: '' },
    category: '游戏',
    replies: 432,
    views: 18700,
    createdAt: '2026-06-28',
    isHot: true,
  },
  {
    id: '5',
    title: '推荐几部冷门但精彩的科幻电影',
    content: '除去主流大片，这些独立科幻作品同样值得一看...',
    author: { ...mockUser, id: '5', name: 'FilmBuff', avatar: '' },
    category: '影视',
    replies: 67,
    views: 3100,
    createdAt: '2026-06-25',
    isHot: false,
  },
  {
    id: '6',
    title: 'Rust 语言入门指南',
    content: '从零开始学习 Rust 编程语言的核心概念...',
    author: { ...mockUser, id: '6', name: 'Rustacean', avatar: '' },
    category: '技术',
    replies: 145,
    views: 6700,
    createdAt: '2026-06-24',
    isHot: false,
  },
  {
    id: '7',
    title: '周末徒步：城市周边的隐秘路线',
    content: '分享几条适合周末放松的徒步路线...',
    author: { ...mockUser, id: '7', name: 'NatureWalker', avatar: '' },
    category: '生活',
    replies: 34,
    views: 1800,
    createdAt: '2026-06-23',
    isHot: false,
  },
  {
    id: '8',
    title: '独立游戏《Stray》通关感想',
    content: '一只猫的赛博朋克冒险之旅...',
    author: { ...mockUser, id: '8', name: 'IndieGameLover', avatar: '' },
    category: '游戏',
    replies: 89,
    views: 3500,
    createdAt: '2026-06-22',
    isHot: false,
  },
];

interface AppStore {
  user: User;
  activities: Activity[];
  posts: Post[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export const useStore = create<AppStore>((set) => ({
  user: mockUser,
  activities: mockActivities,
  posts: mockPosts,
  activeCategory: '全部',
  setActiveCategory: (category) => set({ activeCategory: category }),
}));