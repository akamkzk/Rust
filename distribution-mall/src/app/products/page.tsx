'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Grid3X3,
  SlidersHorizontal,
  TrendingUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Search,
  X,
} from 'lucide-react';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';

type SortType = 'default' | 'sales' | 'price-asc' | 'price-desc';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { getCartCount } = useStore();

  const [sortBy, setSortBy] = useState<SortType>('default');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const sortParam = searchParams.get('sort') as SortType;
    if (sortParam) {
      setSortBy(sortParam);
    }
  }, [searchParams]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'sales':
        result.sort((a, b) => b.sales - a.sales);
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return result;
  }, [selectedCategory, sortBy, searchQuery]);

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === selectedCategory) {
      updateSearchParams('category', '');
    } else {
      updateSearchParams('category', categoryName);
    }
    setShowMobileSidebar(false);
  };

  const handleSortChange = (sort: SortType) => {
    setSortBy(sort);
    updateSearchParams('sort', sort);
  };

  const sortOptions = [
    { value: 'default' as SortType, label: '综合', icon: Grid3X3 },
    { value: 'sales' as SortType, label: '销量', icon: TrendingUp },
    { value: 'price-asc' as SortType, label: '价格升序', icon: ArrowUp },
    { value: 'price-desc' as SortType, label: '价格降序', icon: ArrowDown },
  ];

  const Sidebar = () => (
    <div className="w-full md:w-60 flex-shrink-0">
      <div className="bg-white rounded-2xl p-4 shadow-sm sticky top-20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-orange-500" />
            商品分类
          </h3>
          <button
            className="md:hidden p-1 text-gray-400 hover:text-gray-600"
            onClick={() => setShowMobileSidebar(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-1">
          <button
            onClick={() => handleCategoryClick('')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
              !selectedCategory
                ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white font-medium shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <span>全部商品</span>
            </span>
            {!selectedCategory && <ChevronRight className="w-4 h-4" />}
          </button>
          {categories.map((category) => {
            const isActive = selectedCategory === category.name;
            const productCount = products.filter((p) => p.category === category.name).length;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white font-medium shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {productCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              首页
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">
              {selectedCategory ? selectedCategory : '全部商品'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {selectedCategory ? `${selectedCategory}专区` : '全部商品'}
          </h1>
          <p className="text-gray-500 mt-2">
            共找到 <span className="text-orange-500 font-semibold">{filteredAndSortedProducts.length}</span> 件商品
          </p>
        </div>

        <button
          className="md:hidden w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl text-gray-700 font-medium shadow-sm"
          onClick={() => setShowMobileSidebar(true)}
        >
          <SlidersHorizontal className="w-5 h-5 text-orange-500" />
          筛选分类
          {selectedCategory && (
            <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">
              {selectedCategory}
            </span>
          )}
        </button>

        {showMobileSidebar && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowMobileSidebar(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-4 overflow-y-auto">
              <Sidebar />
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          <div className="hidden md:block">
            <Sidebar />
          </div>

          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索商品名称或描述..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500 mr-2 hidden sm:inline">排序：</span>
                  <div className="flex bg-gray-50 rounded-xl p-1">
                    {sortOptions.map((option) => {
                      const isActive = sortBy === option.value;
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleSortChange(option.value)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-white text-orange-500 shadow-sm'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredAndSortedProducts.map((product) => (
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
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Grid3X3 className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  暂无相关商品
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  试试其他分类或关键词吧
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    updateSearchParams('category', '');
                    setSortBy('default');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
                >
                  查看全部商品
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
