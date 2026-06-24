'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Clock,
  Flame,
  Gift,
  TrendingUp,
  Users,
  Coins,
  ArrowRight,
} from 'lucide-react';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';

const banners = [
  {
    id: 1,
    title: '新人专享大礼',
    subtitle: '注册即送100元优惠券',
    image: 'https://picsum.photos/seed/banner1/1200/400',
    gradient: 'from-orange-500 to-rose-500',
  },
  {
    id: 2,
    title: '分销赚钱计划',
    subtitle: '分享好物，躺赚佣金',
    image: 'https://picsum.photos/seed/banner2/1200/400',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    id: 3,
    title: '限时秒杀特惠',
    subtitle: '每日10点准时开抢',
    image: 'https://picsum.photos/seed/banner3/1200/400',
    gradient: 'from-emerald-500 to-teal-600',
  },
];

export default function HomePage() {
  const { getCartCount } = useStore();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [countdown, setCountdown] = useState({
    hours: 2,
    minutes: 30,
    seconds: 45,
  });

  const hotProducts = products.slice(0, 6);
  const flashProducts = products.slice(0, 4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative">
        <div className="relative h-[200px] sm:h-[300px] md:h-[400px] overflow-hidden">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentBanner ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover opacity-30 mix-blend-overlay"
                priority={index === 0}
              />
              <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 md:mb-4">
                  {banner.title}
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-white/90 mb-4 md:mb-6">
                  {banner.subtitle}
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-2.5 md:px-8 md:py-3 bg-white text-gray-900 rounded-full font-medium text-sm md:text-base hover:bg-gray-100 transition-colors w-fit"
                >
                  立即查看
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
              </div>
            </div>
          ))}

          <button
            onClick={prevBanner}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextBanner}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentBanner ? 'w-6 bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
          <div className="grid grid-cols-5 gap-2 md:gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="flex flex-col items-center gap-2 p-2 md:p-4 rounded-xl hover:bg-orange-50 transition-colors group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center bg-gradient-to-br from-orange-100 to-rose-100 rounded-2xl group-hover:from-orange-200 group-hover:to-rose-200 transition-colors">
                  <span className="text-2xl sm:text-3xl">{category.icon}</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-orange-500 transition-colors">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 md:pb-8">
        <div className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white">限时秒杀</h3>
                <p className="text-xs md:text-sm text-white/80">超值特惠，先到先得</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-white" />
              <div className="flex items-center gap-1">
                <span className="bg-white/20 text-white text-xs md:text-sm font-bold px-2 py-1 rounded-lg min-w-[28px] md:min-w-[32px] text-center">
                  {String(countdown.hours).padStart(2, '0')}
                </span>
                <span className="text-white font-bold">:</span>
                <span className="bg-white/20 text-white text-xs md:text-sm font-bold px-2 py-1 rounded-lg min-w-[28px] md:min-w-[32px] text-center">
                  {String(countdown.minutes).padStart(2, '0')}
                </span>
                <span className="text-white font-bold">:</span>
                <span className="bg-white/20 text-white text-xs md:text-sm font-bold px-2 py-1 rounded-lg min-w-[28px] md:min-w-[32px] text-center">
                  {String(countdown.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {flashProducts.map((product) => {
              const discount = Math.round(
                ((product.originalPrice - product.price) / product.originalPrice) * 100
              );
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="bg-white rounded-xl overflow-hidden group hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-square bg-gray-100">
                    <Image
                      src={product.images[0] || `https://picsum.photos/seed/${product.id}/400/400`}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{discount}%
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-gray-800 line-clamp-1 mb-2">
                      {product.name}
                    </h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-rose-500">
                        ¥{product.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ¥{product.originalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-full"
                        style={{ width: `${Math.min(90, product.sales / 50)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      已抢{product.sales}件
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 md:pb-8">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-orange-500 to-rose-500 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900">热销推荐</h3>
              <p className="text-xs md:text-sm text-gray-500">爆款好物，大家都在买</p>
            </div>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600 font-medium"
          >
            查看更多
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {hotProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.images[0] || `https://picsum.photos/seed/${product.id}/400/400`}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              sales={product.sales}
              commission={product.price * product.commissionRate}
            />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-14">
        <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 md:w-72 md:h-72 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="text-center mb-6 md:mb-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <Gift className="w-5 h-5 text-white" />
                <span className="text-white font-medium text-sm">分销赚钱计划</span>
              </div>
              <h3 className="text-2xl md:text-4xl font-bold text-white mb-3">
                分享好物，轻松赚钱
              </h3>
              <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto">
                成为分销商，分享优质商品给朋友，每笔订单都能获得佣金回报
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Coins className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h4 className="text-white font-bold text-base md:text-lg mb-2">高额佣金</h4>
                <p className="text-white/70 text-xs md:text-sm">
                  最高20%佣金比例，分享越多赚得越多
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Users className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h4 className="text-white font-bold text-base md:text-lg mb-2">团队裂变</h4>
                <p className="text-white/70 text-xs md:text-sm">
                  邀请好友加入，享受多级分销收益
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h4 className="text-white font-bold text-base md:text-lg mb-2">提现自由</h4>
                <p className="text-white/70 text-xs md:text-sm">
                  佣金随时提现，快速到账安全可靠
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/distribution"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-purple-600 rounded-full font-bold text-base hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
              >
                立即成为分销商
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
