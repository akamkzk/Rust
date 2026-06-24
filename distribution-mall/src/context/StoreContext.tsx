"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import {
  generateOrderId,
  generateInviteCode,
  calculateCommission as calcCommission,
  CommissionLevel,
} from "@/lib/utils";

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  inviteCode: string;
  invitedBy?: string;
  balance: number;
  totalCommission: number;
  createdAt: string;
  password?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  stock: number;
  commissionRate: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  createdAt: string;
  commission: {
    total: number;
    details: { level: number; amount: number; userId?: string }[];
  };
}

export interface Distribution {
  team: User[];
  commissionLevels: CommissionLevel[];
  totalTeamSales: number;
}

export interface StoreState {
  user: User | null;
  isLoggedIn: boolean;
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
  distribution: Distribution;
}

type StoreAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "REGISTER"; payload: User }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "ADD_TO_CART"; payload: { product: Product; quantity?: number } }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_CART_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_FAVORITE"; payload: string }
  | { type: "PLACE_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER_STATUS"; payload: { orderId: string; status: Order["status"] } }
  | { type: "ADD_TEAM_MEMBER"; payload: User }
  | { type: "UPDATE_COMMISSION"; payload: number };

const defaultCommissionLevels: CommissionLevel[] = [
  { level: 1, rate: 0.1 },
  { level: 2, rate: 0.05 },
  { level: 3, rate: 0.03 },
];

const initialState: StoreState = {
  user: null,
  isLoggedIn: false,
  cart: [],
  favorites: [],
  orders: [],
  distribution: {
    team: [],
    commissionLevels: defaultCommissionLevels,
    totalTeamSales: 0,
  },
};

const STORAGE_KEY = "distribution-mall-store";
const USERS_STORAGE_KEY = "distribution-mall-users";

function loadState(): StoreState {
  if (typeof window === "undefined") {
    return initialState;
  }
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Failed to load state from localStorage:", error);
  }
  return initialState;
}

function saveState(state: StoreState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save state to localStorage:", error);
  }
}

function loadUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Failed to load users from localStorage:", error);
  }
  return [];
}

function saveUsers(users: User[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Failed to save users to localStorage:", error);
  }
}

function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case "LOGIN":
    case "REGISTER": {
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
      };
    }

    case "LOGOUT": {
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        cart: [],
      };
    }

    case "UPDATE_USER": {
      if (!state.user) return state;
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    }

    case "ADD_TO_CART": {
      const { product, quantity = 1 } = action.payload;
      const existingIndex = state.cart.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingIndex >= 0) {
        const newCart = [...state.cart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + quantity,
        };
        return { ...state, cart: newCart };
      }

      return {
        ...state,
        cart: [...state.cart, { product, quantity }],
      };
    }

    case "REMOVE_FROM_CART": {
      return {
        ...state,
        cart: state.cart.filter((item) => item.product.id !== action.payload),
      };
    }

    case "UPDATE_CART_QUANTITY": {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter((item) => item.product.id !== productId),
        };
      }
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      };
    }

    case "CLEAR_CART": {
      return { ...state, cart: [] };
    }

    case "TOGGLE_FAVORITE": {
      const productId = action.payload;
      const isFavorite = state.favorites.includes(productId);
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter((id) => id !== productId)
          : [...state.favorites, productId],
      };
    }

    case "PLACE_ORDER": {
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        cart: [],
      };
    }

    case "UPDATE_ORDER_STATUS": {
      const { orderId, status } = action.payload;
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        ),
      };
    }

    case "ADD_TEAM_MEMBER": {
      const exists = state.distribution.team.some(
        (m) => m.id === action.payload.id
      );
      if (exists) return state;
      return {
        ...state,
        distribution: {
          ...state.distribution,
          team: [...state.distribution.team, action.payload],
        },
      };
    }

    case "UPDATE_COMMISSION": {
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          balance: state.user.balance + action.payload,
          totalCommission: state.user.totalCommission + action.payload,
        },
      };
    }

    default:
      return state;
  }
}

interface StoreContextType {
  state: StoreState;
  login: (email: string, password: string) => Promise<User>;
  register: (username: string, email: string, password: string, inviteCode?: string, phone?: string) => Promise<User>;
  logout: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  placeOrder: () => Promise<Order>;
  calculateCommission: (orderAmount: number) => { total: number; details: { level: number; amount: number }[] };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const login = async (email: string, password: string): Promise<User> => {
    const users = loadUsers();
    const user = users.find(
      (u) => u.email === email || u.username === email || u.phone === email
    );

    if (!user) {
      throw new Error("用户不存在");
    }

    if (user.password && user.password !== password) {
      throw new Error("密码错误");
    }

    const { password: _, ...safeUser } = user;
    dispatch({ type: "LOGIN", payload: safeUser as User });
    return safeUser as User;
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    inviteCode?: string,
    phone?: string
  ): Promise<User> => {
    const users = loadUsers();

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      throw new Error("该邮箱已被注册");
    }

    const existingUsername = users.find((u) => u.username === username);
    if (existingUsername) {
      throw new Error("该用户名已被使用");
    }

    let invitedBy: string | undefined;
    if (inviteCode) {
      const inviter = users.find((u) => u.inviteCode === inviteCode);
      if (inviter) {
        invitedBy = inviter.id;
      }
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      username,
      email,
      phone,
      inviteCode: generateInviteCode(),
      invitedBy,
      balance: 0,
      totalCommission: 0,
      createdAt: new Date().toISOString(),
      password,
    };

    users.push(newUser);
    saveUsers(users);

    if (invitedBy) {
      dispatch({ type: "ADD_TEAM_MEMBER", payload: newUser });
    }

    const { password: _, ...safeUser } = newUser;
    dispatch({ type: "REGISTER", payload: safeUser as User });
    return safeUser as User;
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    dispatch({ type: "ADD_TO_CART", payload: { product, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_CART_QUANTITY", payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getCartTotal = (): number => {
    return state.cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getCartCount = (): number => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  };

  const toggleFavorite = (productId: string) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: productId });
  };

  const isFavorite = (productId: string): boolean => {
    return state.favorites.includes(productId);
  };

  const placeOrder = async (): Promise<Order> => {
    const totalAmount = getCartTotal();
    const commission = calcCommission(
      totalAmount,
      state.distribution.commissionLevels
    );

    const order: Order = {
      id: generateOrderId(),
      items: [...state.cart],
      totalAmount,
      status: "pending",
      createdAt: new Date().toISOString(),
      commission,
    };

    dispatch({ type: "PLACE_ORDER", payload: order });
    return order;
  };

  const calculateCommission = (orderAmount: number) => {
    return calcCommission(orderAmount, state.distribution.commissionLevels);
  };

  const value: StoreContextType = {
    state,
    login,
    register,
    logout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    toggleFavorite,
    isFavorite,
    placeOrder,
    calculateCommission,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
