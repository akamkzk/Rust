import { motion } from 'framer-motion';
import { Zap, Shield, Users } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: '实时互动',
    description: '毫秒级延迟的消息推送系统，让每一次交流都如同面对面。采用WebSocket协议，确保连接的稳定与高效。',
    gradient: 'from-cyber-cyan to-cyan-400',
  },
  {
    icon: Shield,
    title: '隐私安全',
    description: '端到端加密通信，零知识证明架构。你的数据只属于你自己，没有人能够窥探你的数字世界。',
    gradient: 'from-cyber-indigo to-purple-400',
  },
  {
    icon: Users,
    title: '智能推荐',
    description: '基于联邦学习的推荐算法，在不侵犯隐私的前提下，为你匹配志同道合的伙伴与优质内容。',
    gradient: 'from-cyber-emerald to-green-400',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function FeaturesSection() {
  return (
    <section className="relative py-32 bg-cyber-surface">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative max-w-main mx-auto px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            为什么选择 <span className="text-gradient">NEXUS</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            我们重新思考了社交网络的本质，以技术为驱动，打造更纯粹的连接体验
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className="group relative p-8 rounded-2xl glass hover:bg-white/[0.07] transition-all duration-500"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(6,182,212,0.06), transparent 40%)`,
                  }}
                />

                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-10 flex items-center justify-center mb-6 ring-1 ring-white/5`}>
                  <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-3 tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom border gradient on hover */}
                <div className={`absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}