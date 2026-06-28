import { Link } from 'react-router-dom';
import { Hexagon } from 'lucide-react';

const footerLinks = {
  product: { title: '产品', links: ['首页', '个人中心', '贴吧', '关于我们'] },
  support: { title: '支持', links: ['帮助中心', '社区规范', '隐私政策', '服务条款'] },
  contact: { title: '联系我们', links: ['官方邮箱', 'Twitter', 'Discord', 'GitHub'] },
};

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-cyber-black">
      <div className="max-w-main mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <Hexagon className="w-6 h-6 text-cyber-cyan" strokeWidth={1.5} />
              <span className="font-display text-lg font-bold tracking-wider text-white">NEXUS</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              连接未来，探索无限可能。
              <br />
              新一代科技社交平台。
            </p>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-slate-300 mb-4 tracking-wide">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-cyber-cyan transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Nexus. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Built with React + Tailwind CSS + Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}