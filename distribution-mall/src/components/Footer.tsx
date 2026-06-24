import { ShoppingCart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">分销商城</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              分销商城是一个专注于社交电商的创新平台，致力于为消费者提供优质商品的同时，
              让每一位用户都能通过分享获得收益。我们精选全球好物，保障正品品质，
              让购物更省钱，分享更赚钱。
            </p>
            <div className="flex gap-4">
              <span className="text-xs text-gray-500">品质保障</span>
              <span className="text-xs text-gray-500">·</span>
              <span className="text-xs text-gray-500">七天无理由</span>
              <span className="text-xs text-gray-500">·</span>
              <span className="text-xs text-gray-500">极速发货</span>
            </div>
          </div>

          <div className="md:text-right">
            <h3 className="text-white font-semibold mb-4">联系我们</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>客服热线：400-888-8888</p>
              <p>工作时间：9:00 - 21:00</p>
              <p>商务合作：business@shop.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © 2024 分销商城 版权所有 | 粤ICP备12345678号
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">
              用户协议
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              隐私政策
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              关于我们
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
