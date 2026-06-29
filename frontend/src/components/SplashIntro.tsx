import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashIntroProps {
  onFinish: () => void;
}

export default function SplashIntro({ onFinish }: SplashIntroProps) {
  const [phase, setPhase] = useState<'glitch' | 'reveal' | 'hold' | 'exit'>('glitch');
  const [glitchText, setGlitchText] = useState('');
  const [glitchIndex, setGlitchIndex] = useState(0);

  const finalText = 'NEXUS 欢迎你';
  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`αβγδεζηθικλμνξπρστυφχψωΔΘΛΞΠΣΦΨΩ';

  // Phase 1: Glitch scramble leading to reveal
  useEffect(() => {
    if (phase !== 'glitch') return;

    const interval = setInterval(() => {
      setGlitchIndex((prev) => {
        const next = prev + 1;
        if (next >= finalText.length + 12) {
          clearInterval(interval);
          setTimeout(() => setPhase('reveal'), 200);
          return prev;
        }

        let display = '';
        for (let i = 0; i < finalText.length; i++) {
          if (i < next - 12) {
            display += finalText[i];
          } else if (i === next - 12 || i === next - 11 || i === next - 7) {
            display += glitchChars[Math.floor(Math.random() * glitchChars.length)];
          } else if (i < next - 8) {
            display += finalText[i];
          } else {
            display += glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }
        }
        setGlitchText(display);
        return next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [phase]);

  // Phase 2: Reveal - text settles with glitch artifacts
  useEffect(() => {
    if (phase !== 'reveal') return;

    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count > 8) {
        clearInterval(interval);
        setGlitchText(finalText);
        setTimeout(() => setPhase('hold'), 600);
        return;
      }

      const pos = Math.floor(Math.random() * finalText.length);
      const chars = finalText.split('');
      chars[pos] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
      setGlitchText(chars.join(''));
    }, 80);

    return () => clearInterval(interval);
  }, [phase]);

  // Phase 4: Exit
  useEffect(() => {
    if (phase !== 'hold') return;
    const timer = setTimeout(() => setPhase('exit'), 1800);
    return () => clearTimeout(timer);
  }, [phase]);

  const handleSkip = useCallback(() => {
    setPhase('exit');
  }, []);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {phase !== 'exit' ? (
        <motion.div
          key="splash"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-cyber-black flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={handleSkip}
        >
          {/* Scanlines overlay */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 0, 0, 0.08) 2px,
                rgba(0, 0, 0, 0.08) 4px
              )`,
            }}
          />

          {/* Horizontal flicker bar */}
          <motion.div
            className="absolute left-0 right-0 z-10 pointer-events-none h-[3px] bg-cyber-cyan/30"
            animate={{
              top: ['15%', '72%', '33%', '88%', '45%', '18%', '60%'],
              opacity: [0.6, 0.2, 0.8, 0.1, 0.5, 0.3, 0.7],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{ boxShadow: '0 0 20px rgba(6,182,212,0.4), 0 0 60px rgba(6,182,212,0.1)' }}
          />

          {/* Corner decorations */}
          <div className="absolute top-4 sm:top-8 left-4 sm:left-8 w-8 h-8 sm:w-12 sm:h-12 border-l border-t border-cyber-cyan/40 z-10" />
          <div className="absolute top-4 sm:top-8 right-4 sm:right-8 w-8 h-8 sm:w-12 sm:h-12 border-r border-t border-cyber-cyan/40 z-10" />
          <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 w-8 h-8 sm:w-12 sm:h-12 border-l border-b border-cyber-cyan/40 z-10" />
          <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 w-8 h-8 sm:w-12 sm:h-12 border-r border-b border-cyber-cyan/40 z-10" />

          {/* Top status bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-0 left-0 right-0 z-10 px-4 sm:px-8 py-2 flex items-center justify-between text-[8px] sm:text-[10px] font-mono text-cyber-cyan/50 tracking-widest pointer-events-none"
          >
            <span>SYS.INITIALIZE</span>
            <span>NEXUS_PROTOCOL_v2.4.1</span>
            <span>{new Date().toISOString().slice(0, 19).replace('T', ' ')}</span>
          </motion.div>

          {/* Main text with chromatic aberration */}
          <div className="relative z-10 text-center">
            {/* Red channel - offset left */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
              animate={{
                x: phase === 'glitch' ? [-3, 2, -4, 1, -2] : [-2, 1, -1, 0.5, -0.5],
                opacity: phase === 'glitch' ? [0.6, 0.8, 0.4, 0.7, 0.5] : [0.5, 0.6, 0.4, 0.5, 0.45],
              }}
              transition={{
                x: { duration: 0.15, repeat: Infinity, ease: 'linear' },
                opacity: { duration: 0.2, repeat: Infinity, ease: 'linear' },
              }}
            >
              <span
                className="font-display text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-widest text-red-500/40"
                style={{ mixBlendMode: 'screen', textShadow: '0 0 40px rgba(239,68,68,0.5)' }}
              >
                {glitchText || finalText}
              </span>
            </motion.div>

            {/* Blue channel - offset right */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
              animate={{
                x: phase === 'glitch' ? [3, -2, 4, -1, 2] : [2, -1, 1, -0.5, 0.5],
                opacity: phase === 'glitch' ? [0.6, 0.4, 0.8, 0.5, 0.7] : [0.5, 0.4, 0.6, 0.5, 0.55],
              }}
              transition={{
                x: { duration: 0.12, repeat: Infinity, ease: 'linear' },
                opacity: { duration: 0.18, repeat: Infinity, ease: 'linear' },
              }}
            >
              <span
                className="font-display text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-widest text-blue-500/40"
                style={{ mixBlendMode: 'screen', textShadow: '0 0 40px rgba(59,130,246,0.5)' }}
              >
                {glitchText || finalText}
              </span>
            </motion.div>

            {/* Main text */}
            <motion.h1
              className="font-display text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-widest text-white relative"
              style={{
                textShadow: '0 0 40px rgba(6,182,212,0.6), 0 0 80px rgba(6,182,212,0.3), 0 0 120px rgba(99,102,241,0.2)',
              }}
              animate={
                phase === 'glitch'
                  ? {
                      x: [0, -1, 1, -0.5, 0.5, 0],
                      opacity: [1, 0.9, 1, 0.95, 1, 0.9, 1],
                    }
                  : {}
              }
              transition={
                phase === 'glitch'
                  ? { duration: 0.1, repeat: Infinity, ease: 'linear' }
                  : {}
              }
            >
              {glitchText || finalText}
            </motion.h1>

            {/* Glitch slice - occasional horizontal displacement */}
            {phase === 'glitch' && (
              <motion.div
                className="absolute left-0 right-0 h-[6px] bg-cyber-cyan/20 pointer-events-none"
                animate={{
                  top: ['20%', '55%', '30%', '70%', '40%', '25%'],
                  opacity: [0.8, 0.3, 0.6, 0.2, 0.5, 0.4],
                  x: [-20, 15, -10, 25, -5, 30],
                }}
                transition={{ duration: 0.4, repeat: Infinity, ease: 'linear' }}
                style={{ filter: 'blur(1px)' }}
              />
            )}
          </div>

          {/* Bottom hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 2 }}
            className="absolute bottom-12 z-10 text-xs text-slate-600 tracking-widest font-mono"
          >
            CLICK ANYWHERE TO SKIP
          </motion.div>

          {/* Vignette */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 55%, rgba(10,10,15,0.7) 100%)',
            }}
          />
        </motion.div>
      ) : (
        <motion.div
          key="splash-exit"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-cyber-black pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
}