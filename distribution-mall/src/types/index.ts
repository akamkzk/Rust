export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  images: string[];
  category: string;
  stock: number;
  sales: number;
  commissionRate: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  createdAt: string;
  address: string;
  payMethod: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  phone: string;
  balance: number;
  totalCommission: number;
  inviteCode: string;
  inviterId: string | null;
  level: number;
}

export interface CommissionRecord {
  id: string;
  userId: string;
  fromUserId: string;
  orderId: string;
  amount: number;
  status: 'pending' | 'settled' | 'cancelled';
  createdAt: string;
  level: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
