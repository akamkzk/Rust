'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Coins,
  Wallet,
  Clock,
  Users,
  ShoppingBag,
  TrendingUp,
  Gift,
  Crown,
  Copy,
  QrCode,
  ChevronRight,
  ArrowLeft,
  Share2,
  Star,
  Check,
  User,
  Zap,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

const commissionTabs = [
  { key: 'all', label: '全部' },
  { key: 'settled', label: '已结算' },
  { key: 'pending', label: '待结算' },
];

const mockCommissionRecords = [
  {
    id: 1,
    source: '一级团队 - 张三',
    amount: 128.50,
    time: '2024-01-15 14:30',
    status: 'settled',
    level: 1,
  },
  {
    id: 2,
    source: '二级团队 - 李四',
    amount: 56.80,
    time: '2024-01-14 10:20',
    status: 'settled',
    level: 2,
  },
  {
    id: 3,
    source: '一级团队 - 王五',
    amount: 239.00,
    time: '2024-01-13 16:45',
    status: 'pending',
    level: 1,
  },
  {
    id: 4,
    source: '自购返利',
    amount: 89.90,
    time: '2024-01-12 09:15',
    status: 'settled',
    level: 0,
  },
  {
    id: 5,
    source: '二级团队 - 赵六',
    amount: 45.60,
    time: '2024-01-11 20:30',
    status: 'pending',
    level: 2,
  },
];

const mockTeamMembers = [
  {
    id: 1,
    avatar: '',
    nickname: '张三',
    joinTime: '2024-01-01',
    contribution: 568.50,
    level: 1,
  },
  {
    id: 2,
    avatar: '',
    nickname: '李四',
    joinTime: '2024-01-05',
    contribution: 320.80,
    level: 2,
  },
  {
    id: 3,
    avatar: '',
    nickname: '王五',
    joinTime: '2024-01-08',
    contribution: 1256.00,
    level: 1,
  },
  {
    id: 4,
    avatar: '',
    nickname: '赵六',
    joinTime: '2024-01-10',
    contribution: 89.60,
    level: 2,
  },
  {
    id: 5,
    avatar: '',
    nickname: '孙七',
    joinTime: '2024-01-12',
    contribution: 456.30,
    level: 1,
  },
];

const levelBenefits = [
  {
    level: 1,
    name: '普通分销商',
    icon: Star,
    requirements: '注册即可成为',
    rate: '10%',
    color: 'from-orange-400 to-amber-500',
    features: ['一级佣金 10%', '二级佣金 5%', '三级佣金 3%'],
  },
  {
    level: 2,
    name: '黄金分销商',
    icon: Crown,
    requirements: '团队人数 ≥ 20人',
    rate: '15%',
    color: 'from-yellow-400 to-amber-600',
    features: ['一级佣金 15%', '二级佣金 8%', '三级佣金 5%', '专属客服'],
  },
  {
    level: 3,
    name: '钻石分销商',
    icon: Zap,
    requirements: '团队人数 ≥ 100人',
    rate: '20%',
    color: 'from-purple-400 to-pink-600',
    features: ['一级佣金 20%', '二级佣金 12%', '三级佣金 8%', '专属客服', '优先提现', '培训支持'],
  },
];

export default function DistributionPage() {
  const router = useRouter();
  const { state } = useStore();
  const { user, distribution } = state;
  const [activeCommissionTab, setActiveCommissionTab] = useState('all');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/distribution');
    }
  }, [user, router]);

  if (!user) return null;

  const totalCommission = user.totalCommission || 0;
  const withdrawableCommission = user.balance || 0;
  const pendingCommission = totalCommission * 0.3;
  const teamCount = distribution.team.length || 12;
  const todayOrders = 3;
  const monthEarnings = 2580.50;

  const firstLevelCount = Math.ceil(teamCount * 0.6);
  const secondLevelCount = teamCount - firstLevelCount;

  const filteredRecords = mockCommissionRecords.filter((record) => {
    if (activeCommissionTab === 'all') return true;
    return record.status === activeCommissionTab;
  });

  const handleCopyInviteCode = () => {
    if (user?.inviteCode) {
      navigator.clipboard.writeText(user.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyLink = () => {
    const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/register?invite=${user?.inviteCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statCards = [
    {
      label: '累计佣金',
      value: totalCommission,
      icon: Coins,
      color: 'from-orange-500 to-rose-500',
      gradient: true,
    },
    {
      label: '可提现',
      value: withdrawableCommission,
      icon: Wallet,
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: '待结算',
      value: pendingCommission,
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: '团队人数',
      value: teamCount,
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      suffix: '人',
    },
    {
      label: '今日订单',
      value: todayOrders,
      icon: ShoppingBag,
      color: 'from-amber-500 to-orange-500',
      suffix: '单',
    },
    {
      label: '本月收益',
      value: monthEarnings,
      icon: TrendingUp,
      color: 'from-rose-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-gradient-to-br from-orange-500 via-rose-500 to-pink-500 pt-6 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-white">分销中心</h1>
            <button className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-white/20 p-0.5">
                <div className="w-full h-full rounded-full bg-white p-0.5 relative">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.username}
                      fill
                      sizes="64px"
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center">
                      <User className="w-8 h-8 text-orange-400" />
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-0.5 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full text-white text-xs font-medium shadow-lg">
                <Crown className="w-3 h-3" />
                <span>VIP</span>
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-bold text-white mb-1">{user.username}</h2>
              <p className="text-white/80 text-sm flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400" />
                普通分销商
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center">
              <p className="text-white/70 text-xs mb-1">累计佣金</p>
              <p className="text-xl font-bold text-white">¥{totalCommission.toFixed(2)}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center">
              <p className="text-white/70 text-xs mb-1">可提现</p>
              <p className="text-xl font-bold text-white">¥{withdrawableCommission.toFixed(2)}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center">
              <p className="text-white/70 text-xs mb-1">团队人数</p>
              <p className="text-xl font-bold text-white">{teamCount}人</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-5 mb-4">
          <div className="grid grid-cols-3 gap-4">
            {statCards.slice(3).map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    {typeof card.value === 'number' && card.value % 1 !== 0
                      ? `¥${card.value.toFixed(2)}`
                      : card.value}
                    {card.suffix && card.suffix}
                  </p>
                  <p className="text-xs text-gray-500">{card.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Gift className="w-5 h-5 text-orange-500" />
              我的推广码
            </h3>
          </div>
          <div className="p-4">
            <div className="bg-gradient-to-r from-orange-50 to-rose-50 rounded-2xl p-5 mb-4">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500 mb-2">邀请码</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent tracking-widest">
                    {user.inviteCode}
                  </span>
                  <button
                    onClick={handleCopyInviteCode}
                    className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5 text-orange-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white rounded-xl p-3 mb-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">推广链接</p>
                  <p className="text-sm text-gray-700 truncate">
                    {typeof window !== 'undefined' ? window.location.origin : ''}/register?invite={user.inviteCode}
                  </p>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-sm font-medium rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                >
                  复制
                </button>
              </div>

              <div className="flex justify-center">
                <div className="w-32 h-32 bg-white rounded-xl p-3 shadow-sm">
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-gray-400" />
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 mt-2">扫码注册加入团队</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              我的团队
            </h3>
            <button className="text-sm text-orange-500 flex items-center gap-1">
              查看全部
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">一级团队</p>
              <p className="text-2xl font-bold text-orange-500">{firstLevelCount}人</p>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">二级团队</p>
              <p className="text-2xl font-bold text-rose-500">{secondLevelCount}人</p>
            </div>
          </div>

          <div className="px-4 pb-4">
            <p className="text-sm text-gray-500 mb-3">团队成员</p>
            <div className="space-y-3">
              {mockTeamMembers.slice(0, 3).map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {member.nickname}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        member.level === 1 ? 'bg-orange-50 text-orange-500' : 'bg-rose-50 text-rose-500'
                      }`}>
                        {member.level === 1 ? '一级' : '二级'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">加入：{member.joinTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-orange-500">
                      ¥{member.contribution.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">贡献佣金</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Coins className="w-5 h-5 text-orange-500" />
              佣金记录
            </h3>
          </div>

          <div className="flex gap-2 px-4 py-3">
            {commissionTabs.map((tab) => {
              const isActive = activeCommissionTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveCommissionTab(tab.key)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="px-4 pb-4">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-8">
                <Coins className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">暂无佣金记录</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        record.level === 0 ? 'bg-orange-50' : record.level === 1 ? 'bg-blue-50' : 'bg-purple-50'
                      }`}>
                        <Coins className={`w-5 h-5 ${
                          record.level === 0 ? 'text-orange-500' : record.level === 1 ? 'text-blue-500' : 'text-purple-500'
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{record.source}</p>
                        <p className="text-xs text-gray-500">{record.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${
                        record.status === 'settled' ? 'text-green-500' : 'text-orange-500'
                      }`}>
                        +¥{record.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {record.status === 'settled' ? '已结算' : '待结算'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Crown className="w-5 h-5 text-orange-500" />
              分销等级说明
            </h3>
          </div>

          <div className="p-4 space-y-4">
            {levelBenefits.map((level, index) => {
              const Icon = level.icon;
              const isCurrent = index === 0;
              return (
                <div
                  key={level.level}
                  className={`relative rounded-2xl p-4 border-2 transition-all ${
                    isCurrent
                      ? 'border-orange-300 bg-gradient-to-r from-orange-50/50 to-rose-50/50'
                      : 'border-gray-100 bg-gray-50/50'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute -top-2 -right-2 px-3 py-0.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-medium rounded-full shadow-md">
                      当前等级
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center shadow-md flex-shrink-0`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-800">{level.name}</h4>
                        <span className="text-sm text-orange-500 font-semibold">
                          佣金 {level.rate}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{level.requirements}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {level.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-white rounded-full text-xs text-gray-600 border border-gray-100"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
