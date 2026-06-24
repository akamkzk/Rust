'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  ChevronRight,
  Package,
  CreditCard,
  Truck,
  CheckCircle,
  Wallet,
  Coins,
  Heart,
  MapPin,
  Settings,
  LogOut,
  Crown,
  ShoppingBag,
  Star,
  Gift,
  HelpCircle,
  MessageSquare,
  Bell,
  Mail,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function ProfilePage() {
  const router = useRouter();
  const { state, logout } = useStore();
  const { user, isLoggedIn, orders, favorites } = state;

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/profile');
    }
  }, [isLoggedIn, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) return null;

  const orderStats = [
    { status: 'pending', label: '待付款', icon: CreditCard, count: 0 },
    { status: 'paid', label: '待发货', icon: Package, count: 0 },
    { status: 'shipped', label: '待收货', icon: Truck, count: 0 },
    { status: 'completed', label: '已完成', icon: CheckCircle, count: 0 },
  ];

  orders.forEach((order) => {
    const stat = orderStats.find((s) => s.status === order.status);
    if (stat) stat.count++;
  });

  const menuItems = [
    {
      icon: Wallet,
      label: '我的钱包',
      value: `余额 ¥${user.balance.toFixed(2)}`,
      href: '/profile/wallet',
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: Coins,
      label: '累计佣金',
      value: `¥${user.totalCommission.toFixed(2)}`,
      href: '/profile/commission',
      color: 'from-rose-500 to-pink-500',
    },
    {
      icon: Heart,
      label: '我的收藏',
      value: `${favorites.length}件商品`,
      href: '/profile/favorites',
      color: 'from-red-500 to-rose-500',
    },
    {
      icon: MapPin,
      label: '收货地址',
      value: '管理收货地址',
      href: '/profile/address',
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  const toolItems = [
    { icon: Gift, label: '优惠券', href: '/profile/coupons', badge: '3张可用' },
    { icon: Star, label: '我的评价', href: '/profile/reviews' },
    { icon: ShoppingBag, label: '分销中心', href: '/distribution' },
    { icon: MessageSquare, label: '消息中心', href: '/profile/messages' },
    { icon: HelpCircle, label: '帮助中心', href: '/profile/help' },
    { icon: Settings, label: '设置', href: '/profile/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-orange-500 via-rose-500 to-pink-500 pt-12 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-white">个人中心</h1>
            <button className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white/20 p-0.5">
                <div className="w-full h-full rounded-full bg-white p-0.5">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center">
                      <User className="w-10 h-10 text-orange-400" />
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
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-white">{user.username}</h2>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-sm">
                  普通会员
                </span>
              </div>
              <p className="text-white/80 text-sm mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </p>
              <p className="text-white/80 text-sm mb-2">
                邀请码：{user.inviteCode}
              </p>
              <button className="flex items-center gap-1 text-white/90 text-sm hover:text-white transition-colors">
                编辑资料
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">我的订单</h3>
              <Link
                href="/profile/orders"
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 transition-colors"
              >
                查看全部
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-5 gap-2">
              <Link
                href="/profile/orders"
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                    <Package className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
                <span className="text-xs text-gray-600">全部订单</span>
              </Link>

              {orderStats.map((stat) => (
                <Link
                  key={stat.status}
                  href={`/profile/orders?status=${stat.status}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors relative"
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-gray-500" />
                    </div>
                    {stat.count > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {stat.count}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-600">{stat.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden">
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-4">我的资产</h3>
            <div className="grid grid-cols-2 gap-3">
              {menuItems.slice(0, 2).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md`}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="text-lg font-bold text-gray-800 truncate">{item.value}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden">
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-4">常用功能</h3>
            <div className="grid grid-cols-4 gap-4">
              {menuItems.slice(2).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md`}
                  >
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-gray-600 text-center">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden">
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-4">更多服务</h3>
            <div className="grid grid-cols-3 gap-2">
              {toolItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors relative"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-gray-500" />
                  </div>
                  <span className="text-xs text-gray-600 text-center">{item.label}</span>
                  {item.badge && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-rose-500 text-white text-xs rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 mb-8">
          <button
            onClick={handleLogout}
            className="w-full py-4 bg-white rounded-2xl text-red-500 font-medium shadow-lg shadow-gray-200/50 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
}
