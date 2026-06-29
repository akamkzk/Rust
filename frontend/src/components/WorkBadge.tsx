import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { QrCode, Fingerprint, Wifi, Battery, GripHorizontal, Shield, Globe, Code2, Terminal, Cpu, MapPin, Mail, Calendar, Award, X } from 'lucide-react';

export default function WorkBadge() {
  const { user } = useStore();
  const rotateX = useSpring(0, { stiffness: 80, damping: 15 });
  const rotateY = useSpring(0, { stiffness: 80, damping: 15 });
  const flipRotation = useSpring(0, { stiffness: 120, damping: 18 });
  const [mounted, setMounted] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const constraintsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    flipRotation.set(flipped ? 180 : 0);
  }, [flipped, flipRotation]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging || collapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(y * -15);
    rotateY.set(x * 15);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleClick = useCallback(() => {
    setFlipped((prev) => !prev);
  }, []);

  const skills = [
    { icon: Code2, label: 'React / TypeScript', level: 95 },
    { icon: Terminal, label: 'Node.js / Rust', level: 88 },
    { icon: Globe, label: 'Web3 / Blockchain', level: 82 },
    { icon: Cpu, label: 'AI / Machine Learning', level: 76 },
  ];

  return (
    <div ref={constraintsRef} className="fixed inset-0 z-40 pointer-events-none" style={{ perspective: '1000px' }}>
      {/* ── Collapsed Mini Badge (1/10 scale) ──────────── */}
      <AnimatePresence>
        {collapsed && (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={() => setCollapsed(false)}
            className="absolute top-16 right-2 sm:top-20 sm:right-6 pointer-events-auto z-40
                       w-[51.2px] sm:w-[57.6px] h-[56px] sm:h-[62px]
                       overflow-hidden rounded-[0.2rem]
                       border border-cyber-cyan/30
                       hover:border-cyber-cyan/60 hover:shadow-lg hover:shadow-cyber-cyan/20
                       transition-all duration-300 cursor-pointer"
            style={{
              boxShadow: '0 0 20px rgba(6,182,212,0.15), 0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            <div className="scale-[0.2] origin-top-left w-64 sm:w-72 h-[280px] sm:h-[310px]">
              <div
                className="w-64 sm:w-72 h-[280px] sm:h-[310px] rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(6,182,212,0.1), inset 0 1px 0 rgba(255,255,255,0.03)',
                }}
              >
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)',
                  }}
                />
                <div className="h-1 bg-gradient-to-r from-cyber-cyan via-cyber-indigo to-cyber-cyan" />
                <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
                    <span className="text-[10px] font-mono text-cyber-cyan/70 tracking-widest uppercase">NEXUS CORP</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                    <Wifi className="w-2.5 h-2.5" strokeWidth={2} />
                    <Battery className="w-2.5 h-2.5" strokeWidth={2} />
                  </div>
                </div>
                <div className="px-5 pb-3 flex gap-4">
                  <div className="relative shrink-0">
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-cyber-cyan/30 to-cyber-indigo/30 border border-white/10">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-cyber-cyan/20 flex items-center justify-center">
                          <span className="font-display text-lg font-bold text-cyber-cyan">{user.name.charAt(0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm font-bold text-white tracking-wider mb-0.5 truncate">{user.name}</h3>
                    <p className="text-[10px] text-cyber-cyan/80 font-mono mb-1.5">SENIOR DEVELOPER</p>
                    <p className="text-[9px] text-slate-500 font-mono leading-relaxed">ID: NX-{user.id.padStart(6, '0')}</p>
                    <p className="text-[9px] text-slate-500 font-mono">LVL: 07 | CLR: ALPHA</p>
                  </div>
                </div>
                <div className="mx-5 border-t border-white/5" />
                <div className="px-5 py-3 flex items-center justify-between">
                  <div className="flex items-end gap-[1px] h-8">
                    {[2,1,3,2,4,1,3,2,1,3,2,4,1,2,3,1,4,2,3,1,2,3,1,4,2,1].map((h, i) => (
                      <div key={i} className="w-[1.5px] bg-white/60" style={{ height: `${h * 25}%` }} />
                    ))}
                  </div>
                  <div className="w-8 h-8 rounded border border-white/10 bg-white/5 flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-slate-500" strokeWidth={1} />
                  </div>
                </div>
                <div className="px-5 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Fingerprint className="w-3 h-3 text-cyber-cyan/60" strokeWidth={1.5} />
                    <span className="text-[8px] font-mono text-slate-600">BIOMETRIC VERIFIED</span>
                  </div>
                  <span className="text-[8px] font-mono text-slate-600">EXP: 2027.12.31</span>
                </div>
              </div>
            </div>
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-[0.2rem] border border-cyber-cyan/40 animate-ping opacity-30" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Expanded Badge ────────────────────────────── */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            key="expanded"
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
            className="absolute top-16 right-2 sm:top-20 sm:right-6 pointer-events-auto cursor-grab active:cursor-grabbing group"
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, scale: 0.5, rotateZ: -10 }}
            animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotateZ: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            {/* Lanyard hole */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-slate-500/50 bg-cyber-black z-20"
              style={{ boxShadow: 'inset 0 0 4px rgba(0,0,0,0.5)' }}
            />

            {/* Collapse button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={(e) => { e.stopPropagation(); setCollapsed(true); setFlipped(false); }}
              className="absolute -top-1.5 -right-1.5 z-30 w-6 h-6 rounded-full
                         bg-cyber-surface border border-white/20
                         flex items-center justify-center
                         text-slate-400 hover:text-white hover:border-cyber-cyan/50
                         transition-all duration-200"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
            >
              <X className="w-3 h-3" strokeWidth={2} />
            </motion.button>

            {/* Drag handle hint */}
            <div className="flex items-center justify-center pb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <GripHorizontal className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
            </div>

            {/* Flip container */}
            <motion.div
              className="relative w-64 sm:w-72 h-[280px] sm:h-[310px]"
              style={{
                rotateY: flipRotation,
                transformStyle: 'preserve-3d',
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!isDragging) handleClick();
              }}
            >
              {/* ── FRONT FACE ──────────────────────────────── */}
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(6,182,212,0.1), inset 0 1px 0 rgba(255,255,255,0.03)',
                }}
              >
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)',
                  }}
                />
                <div className="h-1 bg-gradient-to-r from-cyber-cyan via-cyber-indigo to-cyber-cyan" />

                <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
                    <span className="text-[10px] font-mono text-cyber-cyan/70 tracking-widest uppercase">NEXUS CORP</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                    <Wifi className="w-2.5 h-2.5" strokeWidth={2} />
                    <Battery className="w-2.5 h-2.5" strokeWidth={2} />
                  </div>
                </div>

                <div className="px-5 pb-3 flex gap-4">
                  <div className="relative shrink-0">
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-cyber-cyan/30 to-cyber-indigo/30 border border-white/10">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-cyber-cyan/20 flex items-center justify-center">
                          <span className="font-display text-lg font-bold text-cyber-cyan">{user.name.charAt(0)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-lg opacity-20 pointer-events-none"
                      style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.5) 0%, transparent 50%, rgba(99,102,241,0.5) 100%)' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm font-bold text-white tracking-wider mb-0.5 truncate">{user.name}</h3>
                    <p className="text-[10px] text-cyber-cyan/80 font-mono mb-1.5">SENIOR DEVELOPER</p>
                    <p className="text-[9px] text-slate-500 font-mono leading-relaxed">ID: NX-{user.id.padStart(6, '0')}</p>
                    <p className="text-[9px] text-slate-500 font-mono">LVL: 07 | CLR: ALPHA</p>
                  </div>
                </div>

                <div className="mx-5 border-t border-white/5" />

                <div className="px-5 py-3 flex items-center justify-between">
                  <div className="flex items-end gap-[1px] h-8">
                    {[2,1,3,2,4,1,3,2,1,3,2,4,1,2,3,1,4,2,3,1,2,3,1,4,2,1].map((h, i) => (
                      <div key={i} className="w-[1.5px] bg-white/60" style={{ height: `${h * 25}%` }} />
                    ))}
                  </div>
                  <div className="w-8 h-8 rounded border border-white/10 bg-white/5 flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-slate-500" strokeWidth={1} />
                  </div>
                </div>

                <div className="px-5 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Fingerprint className="w-3 h-3 text-cyber-cyan/60" strokeWidth={1.5} />
                    <span className="text-[8px] font-mono text-slate-600">BIOMETRIC VERIFIED</span>
                  </div>
                  <span className="text-[8px] font-mono text-slate-600">EXP: 2027.12.31</span>
                </div>

                <div className="absolute bottom-1 right-3 text-[7px] font-mono text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  CLICK TO FLIP
                </div>
              </div>

              {/* ── BACK FACE ────────────────────────────────── */}
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: 'linear-gradient(145deg, #0f3460 0%, #16213e 40%, #1a1a2e 100%)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.03)',
                }}
              >
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)',
                  }}
                />
                <div className="h-1 bg-gradient-to-r from-cyber-indigo via-purple-400 to-cyber-indigo" />

                <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-cyber-indigo/70" strokeWidth={1.5} />
                    <span className="text-[10px] font-mono text-cyber-indigo/70 tracking-widest uppercase">SECURITY CLEARANCE</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400/70 tracking-wider">LEVEL 7</span>
                </div>

                <div className="px-5 pb-2">
                  <h3 className="font-display text-sm font-bold text-white tracking-wider mb-0.5">{user.name}</h3>
                  <p className="text-[10px] text-slate-500 font-mono mb-3">{user.bio}</p>
                </div>

                <div className="px-5 grid grid-cols-2 gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-600" strokeWidth={1.5} />
                    <span className="text-[9px] font-mono text-slate-500">cyber@nexus.dev</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-600" strokeWidth={1.5} />
                    <span className="text-[9px] font-mono text-slate-500">NODE-07</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-slate-600" strokeWidth={1.5} />
                    <span className="text-[9px] font-mono text-slate-500">SINCE 2024</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3 h-3 text-slate-600" strokeWidth={1.5} />
                    <span className="text-[9px] font-mono text-slate-500">TOP 1%</span>
                  </div>
                </div>

                <div className="mx-5 border-t border-white/5" />

                <div className="px-5 py-2.5">
                  <p className="text-[9px] font-mono text-slate-600 tracking-wider mb-2">SKILL MATRIX</p>
                  <div className="space-y-2">
                    {skills.map((skill) => {
                      const Icon = skill.icon;
                      return (
                        <div key={skill.label} className="flex items-center gap-2">
                          <Icon className="w-2.5 h-2.5 text-cyber-indigo/60 shrink-0" strokeWidth={1.5} />
                          <span className="text-[8px] font-mono text-slate-500 w-24 truncate">{skill.label}</span>
                          <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-cyber-indigo to-purple-400"
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 0.8, delay: 0.3 }}
                            />
                          </div>
                          <span className="text-[8px] font-mono text-slate-600 w-5 text-right">{skill.level}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mx-5 border-t border-white/5" />

                <div className="px-5 py-2.5 flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-[8px] font-mono text-slate-600">POSTS</p>
                    <p className="font-display text-xs font-bold text-white">{user.posts.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] font-mono text-slate-600">LIKES</p>
                    <p className="font-display text-xs font-bold text-white">{user.likes.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] font-mono text-slate-600">FANS</p>
                    <p className="font-display text-xs font-bold text-white">{user.followers.toLocaleString()}</p>
                  </div>
                </div>

                <div className="absolute bottom-1.5 left-0 right-0 flex justify-center">
                  <span className="text-[7px] font-mono text-slate-700">*** CLASSIFIED · NEXUS CORP ***</span>
                </div>
              </div>
            </motion.div>

            {/* Wall shadow */}
            <div className="absolute -bottom-2 left-2 right-2 h-4 rounded-full bg-black/30 blur-md -z-10" />
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}