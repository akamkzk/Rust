import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import InteractiveParticleCloud from './InteractiveParticleCloud';

const titleChars = '连接未来'.split('');

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Interactive Particle Cloud */}
      <InteractiveParticleCloud />

      {/* Gradient Fluid Overlays */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {/* Top-left cyan glow */}
        <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full opacity-15 blur-[120px] animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)',
            animationDuration: '8s',
          }}
        />
        {/* Bottom-right indigo glow */}
        <div className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] rounded-full opacity-10 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
            animation: 'float 8s ease-in-out infinite',
          }}
        />
        {/* Center emerald accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-8 blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Dark Gaussian Blur Overlay */}
      <div className="absolute inset-0 z-[2] bg-cyber-black/50 backdrop-blur-[1px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 z-[3] opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-main mx-auto px-8 text-center pointer-events-none">
        <div className="pointer-events-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-cyan" />
            </span>
            <span className="text-xs text-slate-400 tracking-widest">NEXUS PLATFORM v2.0</span>
          </motion.div>

          {/* Title */}
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6">
            <span className="text-white">NEXUS</span>
            <br />
            <span className="text-gradient">
              {titleChars.map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.6 + i * 0.1,
                    ease: 'easeOut',
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            新一代科技社交平台，以去中心化架构重新定义连接方式。
            <br />
            在这里，每个人都是未来网络的一个节点。
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="group relative px-10 py-4 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-indigo text-white font-semibold text-sm tracking-wider overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-cyber-cyan/25">
              <span className="relative z-10 flex items-center gap-2">
                立即探索
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-indigo to-cyber-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <button className="btn-primary flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
              <span>了解更多</span>
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1"
          >
            <motion.div className="w-1 h-2 rounded-full bg-cyber-cyan/60" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}