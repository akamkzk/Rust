'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Package,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  ChevronRight,
  Inbox,
  ArrowLeft,
  Clock,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatDate } from '@/lib/utils';

const tabs = [
  { key: 'all', label: '全部', icon: Package },
  { key: 'pending', label: '待付款', icon: CreditCard },
  { key: 'paid', label: '待发货', icon: Package },
  { key: 'shipped', label: '待收货', icon: Truck },
  { key: 'completed', label: '已完成', icon: CheckCircle },
  { key: 'cancelled', label: '已取消', icon: XCircle },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: '待付款', color: 'text-orange-500', bgColor: 'bg-orange-50' },
  paid: { label: '待发货', color: 'text-blue-500', bgColor: 'bg-blue-50' },
  shipped: { label: '待收货', color: 'text-purple-500', bgColor: 'bg-purple-50' },
  completed: { label: '已完成', color: 'text-green-500', bgColor: 'bg-green-50' },
  cancelled: { label: '已取消', color: 'text-gray-500', bgColor: 'bg-gray-100' },
};

export default function OrdersPage() {
  const router = useRouter();
  const { state } = useStore();
  const { orders } = state;
  const [activeTab, setActiveTab] = useState('all');

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter((order) => order.status === activeTab);

  const getActionButtons = (status: string) => {
    const buttons: { label: string; variant: 'primary' | 'secondary'; onClick?: () => void }[] = [];

    switch (status) {
      case 'pending':
        buttons.push({ label: '取消订单', variant: 'secondary' });
        buttons.push({ label: '去付款', variant: 'primary' });
        break;
      case 'paid':
        buttons.push({ label: '提醒发货', variant: 'secondary' });
        break;
      case 'shipped':
        buttons.push({ label: '查看物流', variant: 'secondary' });
        buttons.push({ label: '确认收货', variant: 'primary' });
        break;
      case 'completed':
        buttons.push({ label: '评价', variant: 'secondary' });
        buttons.push({ label: '再次购买', variant: 'primary' });
        break;
      case 'cancelled':
        buttons.push({ label: '删除订单', variant: 'secondary' });
        break;
    }

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center h-14 gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">我的订单</h1>
          </div>

          <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/30'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Inbox className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">暂无订单</h2>
            <p className="text-gray-500 mb-6">快去挑选心仪的商品吧~</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              去逛逛
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status];
              const actionButtons = getActionButtons(order.status);
              const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        下单时间：{formatDate(order.createdAt, 'YYYY-MM-DD HH:mm')}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="px-4 py-3">
                    <div className="text-xs text-gray-500 mb-3">订单号：{order.id}</div>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <Link
                          key={`${order.id}-${index}`}
                          href={`/products/${item.product.id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 line-clamp-2 mb-1">
                              {item.product.name}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-rose-500">
                                ¥{item.product.price.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500">x{item.quantity}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50">
                    <div className="text-sm text-gray-600">
                      共 {totalItems} 件商品，合计：
                      <span className="text-lg font-bold text-rose-500 ml-1">
                        ¥{order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-50">
                    <Link
                      href={`/orders/${order.id}`}
                      className="px-4 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      查看详情
                    </Link>
                    {actionButtons.map((button, index) => (
                      <button
                        key={index}
                        className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                          button.variant === 'primary'
                            ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:shadow-lg hover:shadow-orange-500/30'
                            : 'text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {button.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
