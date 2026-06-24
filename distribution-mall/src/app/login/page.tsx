'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShoppingCart,
  ArrowRight,
  AlertCircle,
  Phone,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, state } = useStore();

  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ account?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (state.isLoggedIn) {
      router.push(redirectTo);
    }
  }, [state.isLoggedIn, router, redirectTo]);

  const validateForm = () => {
    const newErrors: { account?: string; password?: string } = {};

    if (!account.trim()) {
      newErrors.account = loginType === 'email' ? '请输入邮箱地址' : '请输入手机号';
    } else if (loginType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account)) {
      newErrors.account = '请输入有效的邮箱地址';
    } else if (loginType === 'phone' && !/^1[3-9]\d{9}$/.test(account)) {
      newErrors.account = '请输入有效的手机号';
    }

    if (!password) {
      newErrors.password = '请输入密码';
    } else if (password.length < 6) {
      newErrors.password = '密码长度不能少于6位';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(account, password);
      router.push(redirectTo);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('登录失败，请检查账号和密码');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <ShoppingCart className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
              分销商城
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h1>
          <p className="text-gray-500">登录您的账号，开始购物赚钱之旅</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8">
          <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setLoginType('email')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                loginType === 'email'
                  ? 'bg-white text-orange-500 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              邮箱登录
            </button>
            <button
              type="button"
              onClick={() => setLoginType('phone')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                loginType === 'phone'
                  ? 'bg-white text-orange-500 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              手机号登录
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {loginType === 'email' ? '邮箱地址' : '手机号码'}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {loginType === 'email' ? (
                    <Mail className="w-5 h-5" />
                  ) : (
                    <Phone className="w-5 h-5" />
                  )}
                </div>
                <input
                  type={loginType === 'email' ? 'email' : 'tel'}
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  placeholder={loginType === 'email' ? '请输入邮箱地址' : '请输入手机号码'}
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all ${
                    errors.account ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.account && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.account}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-gray-600">记住我</span>
              </label>
              <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">
                忘记密码？
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isLoading ? '登录中...' : '登 录'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              还没有账号？
              <Link
                href="/register"
                className="text-orange-500 hover:text-orange-600 font-semibold ml-1 inline-flex items-center gap-1"
              >
                立即注册
                <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">其他登录方式</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <button className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500 hover:bg-green-100 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.269-.03-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
                </svg>
              </button>
              <button className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.003 2.001a9.705 9.705 0 1 1 0 19.41 9.705 9.705 0 0 1 0-19.41zm0 1.672a8.033 8.033 0 1 0 0 16.066 8.033 8.033 0 0 0 0-16.066zm0 2.726c.846 0 1.533.688 1.533 1.536 0 .847-.687 1.535-1.533 1.535a1.535 1.535 0 0 1-1.535-1.535c0-.848.689-1.536 1.535-1.536zm0 5.778c2.49 0 4.528 1.353 4.528 3.018 0 .074-.063.137-.137.137H7.608a.137.137 0 0 1-.137-.137c0-1.665 2.038-3.018 4.532-3.018z" />
                </svg>
              </button>
              <button className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.003 2.001c5.52 0 10.002 4.48 10.002 10.002 0 5.52-4.482 10.002-10.002 10.002-5.52 0-10.002-4.482-10.002-10.002 0-5.522 4.482-10.002 10.002-10.002zm0 1.672c-4.595 0-8.33 3.736-8.33 8.33s3.735 8.33 8.33 8.33 8.33-3.736 8.33-8.33-3.735-8.33-8.33-8.33z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-8">
          登录即表示您同意
          <a href="#" className="text-gray-500 hover:text-gray-700 mx-1">《用户协议》</a>
          和
          <a href="#" className="text-gray-500 hover:text-gray-700 mx-1">《隐私政策》</a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
