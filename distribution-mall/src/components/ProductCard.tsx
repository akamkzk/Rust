import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, Coins } from 'lucide-react';

interface ProductCardProps {
  id: string | number;
  image: string;
  name: string;
  price: number;
  originalPrice?: number;
  sales: number;
  commission: number;
}

export default function ProductCard({
  id,
  image,
  name,
  price,
  originalPrice,
  sales,
  commission,
}: ProductCardProps) {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Link
      href={`/product/${id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {discount}% OFF
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-orange-600 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
          <Coins className="w-3 h-3" />
          赚¥{commission.toFixed(2)}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-3 min-h-[40px] group-hover:text-orange-500 transition-colors">
          {name}
        </h3>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xl font-bold text-rose-500">
            ¥{price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ¥{originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>已售 {sales >= 10000 ? `${(sales / 10000).toFixed(1)}万` : sales}</span>
          </div>
          <div className="text-xs text-orange-500 font-medium">
            分享赚佣金
          </div>
        </div>
      </div>
    </Link>
  );
}
