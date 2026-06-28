import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// ── 实时互动：能量脉冲 / 数据流 ──────────────────────────────
export function CardEffectPulse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const nodes: { x: number; y: number; phase: number; speed: number }[] = [];
    for (let i = 0; i < 6; i++) {
      nodes.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        phase: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03,
      });
    }

    let time = 0;
    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Draw connections between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Energy pulse traveling along connection
          const pulsePos = (Math.sin(time * 2 + i * 0.7 + j * 0.3) + 1) / 2;

          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);

          const gradient = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
          gradient.addColorStop(0, `rgba(6, 182, 212, ${0.05 + Math.sin(time * 3 + i) * 0.03})`);
          gradient.addColorStop(pulsePos, `rgba(6, 182, 212, ${0.15 + Math.sin(time * 4) * 0.08})`);
          gradient.addColorStop(1, `rgba(99, 102, 241, ${0.05 + Math.sin(time * 3 + j) * 0.03})`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Draw nodes with pulsing glow
      for (const node of nodes) {
        node.phase += node.speed;
        const pulse = (Math.sin(node.phase) + 1) / 2;
        const r = 2 + pulse * 3;

        const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 3);
        grad.addColorStop(0, `rgba(6, 182, 212, ${0.4 + pulse * 0.3})`);
        grad.addColorStop(0.5, `rgba(6, 182, 212, ${0.1})`);
        grad.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${0.6 + pulse * 0.4})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />
      {/* Corner energy arcs */}
      <motion.div
        className="absolute top-0 right-0 w-24 h-24"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-0 right-0 w-full h-full border-t border-r border-cyber-cyan/15 rounded-tr-2xl"
          style={{ clipPath: 'polygon(70% 0, 100% 0, 100% 30%)' }}
        />
      </motion.div>
    </div>
  );
}

// ── 隐私安全：六边形力场护盾 ─────────────────────────────────
export function CardEffectShield() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      {/* Hexagonal grid pattern */}
      <motion.div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg width='60' height='52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 17.3v34.6L30 69.3 0 52V17.3z' fill='none' stroke='%236366f1' stroke-width='0.5'/%3E%3C/svg%3E")
          `,
          backgroundSize: '40px 34px',
        }}
        animate={{ backgroundPosition: ['0px 0px', '0px 34px'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* Rotating ring - outer shield */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-cyber-indigo/10"
        animate={{ rotate: 360, scale: [1, 1.08, 1] }}
        transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
      />

      {/* Inner shield ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-cyber-indigo/15"
        animate={{ rotate: -360, scale: [1.05, 1, 1.05] }}
        transition={{ rotate: { duration: 15, repeat: Infinity, ease: 'linear' }, scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
      />

      {/* Center shield glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-cyber-indigo/20 to-purple-400/10 blur-xl" />
      </motion.div>

      {/* Lock icon particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-cyber-indigo/40"
          style={{
            top: `${30 + Math.sin(i * 1.047) * 25}%`,
            left: `${30 + Math.cos(i * 1.047) * 25}%`,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ── 智能推荐：神经网络节点连接 ───────────────────────────────
export function CardEffectNetwork() {
  const nodes = [
    { x: 15, y: 25 }, { x: 50, y: 15 }, { x: 85, y: 25 },
    { x: 25, y: 55 }, { x: 55, y: 45 }, { x: 75, y: 60 },
    { x: 15, y: 80 }, { x: 50, y: 75 }, { x: 85, y: 80 },
  ];

  const connections = [
    [0, 1], [1, 2], [0, 3], [1, 3], [1, 4], [2, 5],
    [3, 4], [4, 5], [3, 6], [4, 6], [4, 7], [5, 8],
    [6, 7], [7, 8], [0, 4], [2, 4], [1, 5], [3, 7],
  ];

  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Connection lines */}
        {connections.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="#10b981"
            strokeWidth="0.15"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0.4, 0.8, 0.4],
              opacity: [0.15, 0.35, 0.15],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
            style={{ strokeDasharray: '2 1' }}
          />
        ))}

        {/* Signal pulses traveling along connections */}
        {connections.map(([a, b], i) => (
          <motion.circle
            key={`pulse-${i}`}
            r="0.6"
            fill="#10b981"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.9, 0],
              cx: [nodes[a].x, nodes[b].x, nodes[b].x],
              cy: [nodes[a].y, nodes[b].y, nodes[b].y],
            }}
            transition={{
              duration: 2 + Math.random() * 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>

      {/* Network nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-cyber-emerald/60"
          style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.4, 0.9, 0.4],
            boxShadow: [
              '0 0 4px rgba(16,185,129,0.3)',
              '0 0 12px rgba(16,185,129,0.6)',
              '0 0 4px rgba(16,185,129,0.3)',
            ],
          }}
          transition={{
            duration: 2.5 + Math.random(),
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Central brain-like glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
        animate={{ opacity: [0.05, 0.12, 0.05], scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}