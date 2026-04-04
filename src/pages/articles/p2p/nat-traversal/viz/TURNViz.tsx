import { useState } from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  { label: 'Allocate', desc: 'Peer A가 TURN 서버에 릴레이 주소 할당 요청' },
  { label: 'Permission', desc: 'Peer B의 IP를 허용 목록에 등록' },
  { label: 'Data Relay', desc: 'A → TURN → B: 모든 데이터가 TURN 서버를 경유' },
  { label: '양방향 중계', desc: 'B → TURN → A: 역방향도 TURN 경유. 직접 연결 대비 2x RTT 지연' },
];

const C = { a: '#6366f1', turn: '#10b981', b: '#ec4899' };

export default function TURNViz() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <p className="text-xs font-mono text-foreground/50">TURN Relay 흐름</p>
      <svg viewBox="0 0 360 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
        {/* Nodes */}
        <rect x={20} y={35} width={60} height={28} rx={5}
          fill={C.a + '12'} stroke={C.a} strokeWidth={1.3} />
        <text x={50} y={53} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.a}>Peer A</text>

        <rect x={150} y={20} width={60} height={28} rx={5}
          fill={C.turn + '12'} stroke={C.turn} strokeWidth={1.3} />
        <text x={180} y={38} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.turn}>TURN</text>

        <rect x={280} y={35} width={60} height={28} rx={5}
          fill={C.b + '12'} stroke={C.b} strokeWidth={1.3} />
        <text x={310} y={53} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.b}>Peer B</text>

        {/* Allocate arrow */}
        {step >= 0 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <line x1={80} y1={42} x2={150} y2={34} stroke={C.a} strokeWidth={1.3} />
            {step === 0 && (
              <>
                <rect x={92} y={26} width={48} height={12} rx={2} fill="var(--card)" />
                <text x={116} y={35} textAnchor="middle" fontSize={10} fill={C.a}>Allocate</text>
              </>
            )}
          </motion.g>
        )}
        {/* Data relay A→TURN→B */}
        {step >= 2 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <line x1={80} y1={49} x2={150} y2={40} stroke={C.a} strokeWidth={1.3} />
            <line x1={210} y1={40} x2={280} y2={49} stroke={C.turn} strokeWidth={1.3} />
            <motion.circle r={3} fill={C.a}
              animate={{ cx: [80, 150, 210, 280], cy: [49, 40, 40, 49] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.6 }} />
          </motion.g>
        )}
        {/* Reverse relay B→TURN→A */}
        {step >= 3 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <line x1={280} y1={56} x2={210} y2={48} stroke={C.b} strokeWidth={1} strokeDasharray="4 3" />
            <line x1={150} y1={48} x2={80} y2={56} stroke={C.turn} strokeWidth={1} strokeDasharray="4 3" />
            <rect x={130} y={60} width={100} height={14} rx={3} fill="var(--card)" />
            <text x={180} y={70} textAnchor="middle" fontSize={10} fill={C.turn}>
              양방향 중계 (2x RTT)
            </text>
          </motion.g>
        )}
      </svg>
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <div key={i} onClick={() => setStep(i)}
            className={`h-1 flex-1 rounded-full cursor-pointer transition-colors ${i <= step ? 'bg-primary' : 'bg-border'}`} />
        ))}
      </div>
      <p className="text-xs font-semibold text-center">{s.label}</p>
      <p className="text-[10px] text-foreground/50 text-center">{s.desc}</p>
    </div>
  );
}
