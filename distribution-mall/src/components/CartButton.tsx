'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

interface CartButtonProps {
  itemCount?: number;
}

export default function CartButton({ itemCount = 0 }: CartButtonProps) {
  return (
    <Link
      href="/cart"
      className="fixed right-4 bottom-20 sm:right-6 sm:bottom-6 z-40 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-rose-500 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300"
    >
      <ShoppingCart className="w-6 h-6 text-white" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] flex items-center justify-center bg-rose-500 text-white text-xs font-bold rounded-full border-2 border-white px-1">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}
