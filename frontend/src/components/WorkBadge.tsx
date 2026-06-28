import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { QrCode, Fingerprint, Wifi, Battery } from 'lucide-react';

export default function WorkBadge() {
  const { user } = useStore();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(0, { stiffness: 80, damping: 15 });
  const rotateY = useSpring(0, { stiffness: 80, damping: 15 });
  const translateX = useSpring(0, { stiffness: 50, damping: 15 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    rotateX.set(y * -15);
    rotateY.set(x * 15);
    translateX.set(x * 8);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    translateX.set(0);
  };

  return (
    <div className="fixed top-0 right-8 z-40 pointer-events-none" style={{ perspective: '800px' }}>
      {/* Lanyard */}
      <svg
        className="absolute top-0 pointer-events-none"
        width="200"
        height="180"
        viewBox="0 0 200 180"
        style={{ right: '10px' }}
      >
        {/* Lanyard strap */}
        <motion.path
          d="M 160 0 Q 180 40 170 80 Q 160 120 145 160"
          fill="none"
          stroke="url(#lanyardGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="lanyardGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Clip */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ right: '42px', top: '152px' }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <div className="w-8 h-5 rounded-t-md bg-gradient-to-b from-slate-400 to-slate-500 border border-slate-300/30"
          style={{ boxShadow: '0 0 8px rgba(6,182,212,0.4)' }}
        />
      </motion.div>

      {/* Badge Card */}
      <motion.div
        className="relative pointer-events-auto cursor-default"
        style={{
          rotateX,
          rotateY,
          x: translateX,
          marginTop: '170px',
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: -60, rotateZ: -15 }}
        animate={mounted ? { opacity: 1, y: 0, rotateZ: 0 } : {}}
        transition={{
          opacity: { duration: 0.6, delay: 0.6 },
          y: { type: 'spring', stiffness: 60, damping: 12, delay: 0.6 },
          rotateZ: { type: 'spring', stiffness: 60, damping: 12, delay: 0.6 },
        }}
      >
        {/* Badge hole */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-slate-500/50 bg-cyber-black z-10"
          style={{ boxShadow: 'inset 0 0 4px rgba(0,0,0,0.5)' }}
        />

        {/* Main card */}
        <div className="relative w-72 rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(6,182,212,0.1), inset 0 1px 0 rgba(255,255,255,0.03)',
          }}
        >
          {/* Card scanline texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)',
            }}
          />

          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-cyber-cyan via-cyber-indigo to-cyber-cyan" />

          {/* Header */}
          <div className="px-5 pt-4 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
              <span className="text-[10px] font-mono text-cyber-cyan/70 tracking-widest uppercase">
                NEXUS CORP
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
              <Wifi className="w-2.5 h-2.5" strokeWidth={2} />
              <Battery className="w-2.5 h-2.5" strokeWidth={2} />
            </div>
          </div>

          {/* Photo & Info */}
          <div className="px-5 pb-3 flex gap-4">
            {/* Photo */}
            <div className="relative shrink-0">
              <div className="w-16 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-cyber-cyan/30 to-cyber-indigo/30 border border-white/10">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-cyber-cyan/20 flex items-center justify-center">
                    <span className="font-display text-lg font-bold text-cyber-cyan">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
              {/* Photo hologram overlay */}
              <div className="absolute inset-0 rounded-lg opacity-20 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.5) 0%, transparent 50%, rgba(99,102,241,0.5) 100%)',
                }}
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-sm font-bold text-white tracking-wider mb-0.5 truncate">
                {user.name}
              </h3>
              <p className="text-[10px] text-cyber-cyan/80 font-mono mb-1.5">
                SENIOR DEVELOPER
              </p>
              <p className="text-[9px] text-slate-500 font-mono leading-relaxed">
                ID: NX-{user.id.padStart(6, '0')}
              </p>
              <p className="text-[9px] text-slate-500 font-mono">
                LVL: 07 | CLR: ALPHA
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-white/5" />

          {/* Barcode / QR section */}
          <div className="px-5 py-3 flex items-center justify-between">
            {/* Barcode */}
            <div className="flex items-end gap-[1px] h-8">
              {[2,1,3,2,4,1,3,2,1,3,2,4,1,2,3,1,4,2,3,1,2,3,1,4,2,1].map((h, i) => (
                <div
                  key={i}
                  className="w-[1.5px] bg-white/60"
                  style={{ height: `${h * 25}%` }}
                />
              ))}
            </div>

            {/* QR code placeholder */}
            <div className="w-8 h-8 rounded border border-white/10 bg-white/5 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-slate-500" strokeWidth={1} />
            </div>
          </div>

          {/* Bottom bar */}
          <div className="px-5 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Fingerprint className="w-3 h-3 text-cyber-cyan/60" strokeWidth={1.5} />
              <span className="text-[8px] font-mono text-slate-600">BIOMETRIC VERIFIED</span>
            </div>
            <span className="text-[8px] font-mono text-slate-600">
              EXP: 2027.12.31
            </span>
          </div>

          {/* Holographic shimmer */}
          <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(6,182,212,0.08) 45%, rgba(99,102,241,0.08) 50%, rgba(6,182,212,0.08) 55%, transparent 60%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s infinite',
            }}
          />
        </div>

        {/* Shadow on "wall" */}
        <div className="absolute -bottom-2 left-2 right-2 h-4 rounded-full bg-black/30 blur-md -z-10" />
      </motion.div>

      {/* Shimmer keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}