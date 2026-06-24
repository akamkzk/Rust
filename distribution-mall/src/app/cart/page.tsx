'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Trash2,
  Minus,
  Plus,
  ShoppingCart,
  ArrowLeft,
  Coins,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function CartPage() {
  const router = useRouter();
  const { state, updateCartQuantity, removeFromCart, clearCart, placeOrder } = useStore();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    new Set(state.cart.map((item) => item.product.id))
  );
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const allSelected = state.cart.length > 0 && selectedItems.size === state.cart.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(state.cart.map((item) => item.product.id)));
    }
  };

  const toggleSelectItem = (productId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedItems(newSelected);
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    const item = state.cart.find((i) => i.product.id === productId);
    if (!item) return;
    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) {
      removeFromCart(productId);
      const newSelected = new Set(selectedItems);
      newSelected.delete(productId);
      setSelectedItems(newSelected);
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    const newSelected = new Set(selectedItems);
    newSelected.delete(productId);
    setSelectedItems(newSelected);
  };

  const totals = useMemo(() => {
    const selectedCartItems = state.cart.filter((item) =>
      selectedItems.has(item.product.id)
    );
    const subtotal = selectedCartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const originalTotal = selectedCartItems.reduce((sum, item) => {
      const product = item.product;
      const originalPrice = (product as { originalPrice?: number }).originalPrice || product.price;
      return sum + originalPrice * item.quantity;
    }, 0);
    const discount = originalTotal - subtotal;
    const commission = subtotal * 0.1;
    return { subtotal, discount, commission, count: selectedCartItems.length };
  }, [state.cart, selectedItems]);

  const handleCheckout = async () => {
    if (totals.count === 0) return;
    setIsCheckingOut(true);
    try {
      await placeOrder();
      setSelectedItems(new Set());
      router.push('/profile');
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (state.cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">购物车空空如也</h2>
          <p className="text-gray-500 mb-6">快去挑选心仪的商品吧~</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            去逛逛
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">购物车</h1>
        <button
          onClick={() => {
            clearCart();
            setSelectedItems(new Set());
          }}
          className="text-sm text-gray-500 hover:text-rose-500 transition-colors"
        >
          清空购物车
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {state.cart.map((item) => {
          const isSelected = selectedItems.has(item.product.id);
          const originalPrice = (item.product as { originalPrice?: number }).originalPrice;
          return (
            <div
              key={item.product.id}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4"
            >
              <button
                onClick={() => toggleSelectItem(item.product.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-orange-500 border-orange-500'
                    : 'border-gray-300 hover:border-orange-400'
                }`}
              >
                {isSelected && (
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>

              <Link
                href={`/products/${item.product.id}`}
                className="relative flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden"
              >
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product.id}`}
                  className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 hover:text-orange-500 transition-colors block"
                >
                  {item.product.name}
                </Link>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-rose-500">
                    ¥{item.product.price.toFixed(2)}
                  </span>
                  {originalPrice && originalPrice > item.product.price && (
                    <span className="text-xs text-gray-400 line-through">
                      ¥{originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(item.product.id, -1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-medium text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.product.id, 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => handleRemove(item.product.id)}
                  className="text-gray-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 sticky bottom-4">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors"
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                allSelected
                  ? 'bg-orange-500 border-orange-500'
                  : 'border-gray-300'
              }`}
            >
              {allSelected && (
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            全选
          </button>

          <div className="text-right">
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-sm text-gray-500">已选 {totals.count} 件，合计：</span>
              <span className="text-2xl font-bold text-rose-500">
                ¥{totals.subtotal.toFixed(2)}
              </span>
            </div>
            {totals.discount > 0 && (
              <div className="text-xs text-orange-500 mt-1">
                已优惠 ¥{totals.discount.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>商品总价</span>
            <span>¥{(totals.subtotal + totals.discount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>优惠</span>
            <span className="text-rose-500">-¥{totals.discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-gray-500">
            <span className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-orange-500" />
              预计佣金
            </span>
            <span className="text-orange-500 font-medium">¥{totals.commission.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-100">
            <span className="font-medium text-gray-700">实付</span>
            <span className="text-xl font-bold text-rose-500">¥{totals.subtotal.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={totals.count === 0 || isCheckingOut}
          className="w-full h-12 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          {isCheckingOut ? '结算中...' : `结算 (${totals.count})`}
        </button>
      </div>
    </div>
  );
}
