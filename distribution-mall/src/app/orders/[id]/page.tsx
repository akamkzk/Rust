'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Package,
  Truck,
  CheckCircle,
  FileText,
  Coins,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatDate } from '@/lib/utils';

const statusConfig: Record<string, { label: string; color: string; bgColor: string; steps: string[] }> = {
  pending: {
    label: '待付款',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    steps: ['提交订单', '付款', '发货', '收货', '完成'],
  },
  paid: {
    label: '待发货',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    steps: ['提交订单', '付款', '发货', '收货', '完成'],
  },
  shipped: {
    label: '待收货',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    steps: ['提交订单', '付款', '发货', '收货', '完成'],
  },
  completed: {
    label: '已完成',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    steps: ['提交订单', '付款', '发货', '收货', '完成'],
  },
  cancelled: {
    label: '已取消',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    steps: ['提交订单', '已取消'],
  },
};

const stepIcons = [Package, CreditCard, Truck, Package, CheckCircle];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state } = useStore();
  const { orders } = state;

  const order = useMemo(() => {
    return orders.find((o) => o.id === params.id) || null;
  }, [orders, params.id]);

  if (!order) {
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
              <h1 className="text-lg font-semibold text-gray-800">订单详情</h1>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-500">订单不存在</p>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.status];
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const getCurrentStepIndex = () => {
    switch (order.status) {
      case 'pending':
        return 0;
      case 'paid':
        return 1;
      case 'shipped':
        return 2;
      case 'completed':
        return 4;
      case 'cancelled':
        return 1;
      default:
        return 0;
    }
  };

  const currentStepIndex = getCurrentStepIndex();
  const steps = status.steps;

  const shippingFee: number = 0;
  const discount: number = 0;
  const actualPay = order.totalAmount;

  const getActionButtons = () => {
    const buttons: { label: string; variant: 'primary' | 'secondary' }[] = [];

    switch (order.status) {
      case 'pending':
        buttons.push({ label: '取消订单', variant: 'secondary' });
        buttons.push({ label: '立即付款', variant: 'primary' });
        break;
      case 'paid':
        buttons.push({ label: '提醒发货', variant: 'primary' });
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

  const actionButtons = getActionButtons();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center h-14 gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">订单详情</h1>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-500 via-rose-500 to-pink-500 pt-6 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-2">{status.label}</h2>
            <p className="text-white/80 text-sm">
              {order.status === 'pending' && '请尽快完成付款'}
              {order.status === 'paid' && '商家正在准备发货'}
              {order.status === 'shipped' && '商品已发出，请注意查收'}
              {order.status === 'completed' && '交易已完成，感谢您的购买'}
              {order.status === 'cancelled' && '订单已取消'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = stepIcons[index] || Package;
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <div key={step} className="flex flex-col items-center flex-1 relative">
                  {index > 0 && (
                    <div
                      className={`absolute top-4 -left-1/2 w-full h-0.5 -translate-y-1/2 z-0 ${
                        isActive ? 'bg-orange-400' : 'bg-gray-200'
                      }`}
                      style={{ width: '100%', left: '-50%' }}
                    />
                  )}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                      isActive
                        ? 'bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-xs ${
                      isCurrent ? 'text-orange-500 font-medium' : isActive ? 'text-gray-700' : 'text-gray-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          <div className="p-4 border-b border-gray-50 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-800">张三</span>
                <span className="text-gray-500 text-sm">138****8888</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                北京市朝阳区某某街道某某小区1号楼1单元101室
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800">商品明细</h3>
          </div>
          <div className="p-4 space-y-4">
            {order.items.map((item, index) => (
              <Link
                key={index}
                href={`/products/${item.product.id}`}
                className="flex items-center gap-3"
              >
                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 line-clamp-2 mb-2">
                    {item.product.name}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-rose-500">
                      ¥{item.product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">x{item.quantity}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800">价格明细</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">商品总价</span>
              <span className="text-gray-800">¥{order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">运费</span>
              <span className="text-gray-800">
                {shippingFee === 0 ? '免运费' : `¥${shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">优惠</span>
              <span className="text-rose-500">-¥{discount.toFixed(2)}</span>
            </div>
            {order.commission && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-1">
                  <Coins className="w-4 h-4 text-orange-500" />
                  预计佣金
                </span>
                <span className="text-orange-500 font-medium">
                  ¥{order.commission.total.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="font-medium text-gray-800">实付金额</span>
              <span className="text-xl font-bold text-rose-500">¥{actualPay.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-800">订单信息</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">订单编号</span>
              <span className="text-gray-800 font-mono text-xs">{order.id}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">下单时间</span>
              <span className="text-gray-800">{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">支付方式</span>
              <span className="text-gray-800">微信支付</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">商品数量</span>
              <span className="text-gray-800">{totalItems} 件</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-sm text-gray-600">
            实付：
            <span className="text-xl font-bold text-rose-500 ml-1">
              ¥{actualPay.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {actionButtons.map((button, index) => (
              <button
                key={index}
                className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all ${
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
      </div>
    </div>
  );
}
