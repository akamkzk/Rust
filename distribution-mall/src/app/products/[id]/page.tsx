'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Share2,
  TrendingUp,
  Package,
  Coins,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { products } from '@/data/products';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAddedToast, setShowAddedToast] = useState(false);

  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-gray-500 text-lg mb-4">商品不存在</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
        >
          返回
        </button>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const commission = product.price * product.commissionRate;
  const favorite = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        description: product.description,
        stock: product.stock,
        commissionRate: product.commissionRate,
      },
      quantity
    );
    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        description: product.description,
        stock: product.stock,
        commissionRate: product.commissionRate,
      },
      quantity
    );
    router.push('/cart');
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {showAddedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full shadow-lg animate-bounce">
          <Check className="w-5 h-5" />
          <span>已加入购物车</span>
        </div>
      )}

      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-gray-600 hover:text-orange-500 mb-4 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>返回</span>
      </button>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                  {discount}% OFF
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-orange-500 ring-2 ring-orange-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800 mb-3">{product.name}</h1>

            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>已售 {product.sales >= 10000 ? `${(product.sales / 10000).toFixed(1)}万` : product.sales}</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                <span>库存 {product.stock} 件</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-xl p-4 mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-rose-500">¥{product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ¥{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-orange-600">
                <Coins className="w-5 h-5" />
                <span className="font-medium">
                  分享可赚 ¥{commission.toFixed(2)} 佣金
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">商品描述</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-medium text-gray-700">数量</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-14 text-center font-medium text-gray-800">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-auto flex gap-3">
              <button
                onClick={() => toggleFavorite(product.id)}
                className={`flex items-center justify-center w-14 h-14 rounded-xl border-2 transition-all ${
                  favorite
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-gray-200 hover:border-rose-300 hover:bg-rose-50'
                }`}
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    favorite ? 'fill-rose-500 text-rose-500' : 'text-gray-400'
                  }`}
                />
              </button>

              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 h-14 bg-orange-100 text-orange-600 font-semibold rounded-xl hover:bg-orange-200 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                加入购物车
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 h-14 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all"
              >
                <Share2 className="w-5 h-5" />
                立即购买
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
