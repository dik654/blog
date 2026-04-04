import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '합의 계층: CometBFT 기반 빠른 finality' },
  { label: '런타임 계층: ParaTime별 독립 실행 환경' },
  { label: 'TEE 계층: SGX 내 키 관리 & 트랜잭션 실행' },
];
const ANNOT = ['BFT 합의로 블록 확정', 'ParaTime 독립 실행', 'SGX 엔클레이브 내 실행'];

const LAYERS = [
  { y: 20, label: '합의 계층', sub: 'CometBFT + Validator', color: '#6366f1', w: 300 },
  { y: 95, label: '런타임 계층', sub: 'Sapphire / Cipher / Emerald', color: '#10b981', w: 260 },
  { y: 170, label: 'TEE 계층', sub: 'SGX 워커 + 키 매니저 + RA-TLS', color: '#f59e0b', w: 220 },
];

export default function OasisLayerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LAYERS.map((l, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <g key={l.label}>
                {/* connector */}
                {i > 0 && (
                  <motion.line x1={180} y1={LAYERS[i - 1].y + 55} x2={180} y2={l.y}
                    stroke={done || active ? l.color : 'var(--border)'} strokeWidth={1.5} strokeDasharray="4,4"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.15, duration: 0.4 }} />
                )}
                {/* box */}
                <motion.rect x={180 - l.w / 2} y={l.y} width={l.w} height={50} rx={8}
                  fill={active ? `${l.color}20` : `${l.color}08`}
                  stroke={active ? l.color : `${l.color}40`}
                  strokeWidth={active ? 1.5 : 1}
                  animate={{ opacity: active ? 1 : done ? 0.5 : 0.3 }}
                  transition={{ duration: 0.3 }} />
                <text x={180} y={l.y + 22} textAnchor="middle" fontSize={12} fontWeight={600}
                  fill={active ? l.color : 'var(--foreground)'} opacity={active ? 1 : 0.5}>{l.label}</text>
                <text x={180} y={l.y + 38} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)" opacity={active ? 1 : 0.4}>{l.sub}</text>
                {/* active glow */}
                {active && (
                  <motion.rect x={180 - l.w / 2 - 3} y={l.y - 3} width={l.w + 6} height={56} rx={10}
                    fill="none" stroke={l.color} strokeWidth={1} opacity={0.3}
                    initial={{ scale: 0.95 }} animate={{ scale: 1.02 }}
                    transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }} />
                )}
              </g>
            );
          })}
          {/* moving arrow */}
          <motion.g animate={{ y: LAYERS[step].y + 25 - LAYERS[0].y - 25 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}>
            <circle cx={180 - LAYERS[0].w / 2 - 18} cy={LAYERS[0].y + 25} r={8}
              fill={LAYERS[step].color} />
            <text x={180 - LAYERS[0].w / 2 - 18} y={LAYERS[0].y + 28} textAnchor="middle"
              fontSize={10} fontWeight={600} fill="white">&#9654;</text>
          </motion.g>
          <motion.text x={365} y={120} fontSize={10} fill="var(--foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
