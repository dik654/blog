import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const PATHS = [
  { label: 'Fast Path', sub: '소유 객체 TX (합의 불필요)', color: '#10b981', x: 30 },
  { label: 'Consensus Path', sub: '공유 객체 TX (Narwhal + Bullshark)', color: '#6366f1', x: 210 },
];

const STEPS = [
  { label: '트랜잭션 수신', body: '검증자가 TX를 수신하고 소유 객체인지 공유 객체인지 판별합니다.' },
  { label: 'Fast Path: 소유 객체', body: '소유 객체만 접근하는 TX는 Byzantine Consistent Broadcast로 즉시 처리. ~400ms.' },
  { label: 'Consensus Path: 공유 객체', body: '공유 객체를 접근하는 TX는 Narwhal + Bullshark 합의를 거쳐 순서가 결정됩니다.' },
  { label: '이중 경로의 장점', body: '단순 전송의 90%+ TX가 Fast Path로 처리. 합의 부하를 최소화합니다.' },
];

export default function SuiArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* TX Input */}
          <motion.rect x={150} y={5} width={80} height={28} rx={7}
            fill="#8b5cf618" stroke="#8b5cf6" strokeWidth={1.5} />
          <text x={190} y={23} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">TX 수신</text>
          {/* Fork arrows */}
          <motion.line x1={170} y1={33} x2={PATHS[0].x + 65} y2={55}
            stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 2"
            animate={{ opacity: step >= 1 ? 0.8 : 0.15 }} transition={sp} />
          <motion.line x1={210} y1={33} x2={PATHS[1].x + 65} y2={55}
            stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4 2"
            animate={{ opacity: step >= 2 ? 0.8 : 0.15 }} transition={sp} />
          {/* Path boxes */}
          {PATHS.map((p, i) => (
            <motion.g key={i} animate={{ opacity: (i === 0 && step >= 1) || (i === 1 && step >= 2) ? 1 : 0.15 }} transition={sp}>
              <rect x={p.x} y={55} width={140} height={45} rx={8}
                fill={`${p.color}15`} stroke={p.color} strokeWidth={1.5} />
              <text x={p.x + 70} y={73} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={p.color}>{p.label}</text>
              <text x={p.x + 70} y={88} textAnchor="middle" fontSize={9}
                fill={p.color}>{p.sub}</text>
            </motion.g>
          ))}
          {/* Latency labels */}
          {step >= 1 && (
            <motion.text x={100} y={118} textAnchor="middle" fontSize={9}
              fill="#10b981" fontWeight={600} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              ~400ms finality
            </motion.text>
          )}
          {step >= 2 && (
            <motion.text x={280} y={118} textAnchor="middle" fontSize={9}
              fill="#6366f1" fontWeight={600} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              ~2-3s finality
            </motion.text>
          )}
          {step === 3 && (
            <motion.text x={190} y={136} textAnchor="middle" fontSize={9}
              fill="#f59e0b" fontWeight={600} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              90%+ TX via Fast Path
            </motion.text>
          )}
        </svg>
      )}
    </StepViz>
  );
}
