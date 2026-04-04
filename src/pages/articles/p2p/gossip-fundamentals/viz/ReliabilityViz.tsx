import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '중복 제거 (Dedup)', body: 'msg_id를 seen 캐시에 저장하여 재전파 방지' },
  { label: 'Peer Scoring', body: '저품질 피어는 메시에서 PRUNE 처리' },
  { label: 'TTL 만료', body: 'TTL 적용으로 오래된 메시지 자동 삭제' },
  { label: 'Flood Publishing', body: '자기 발행 메시지는 모든 메시 피어에 즉시 전달' },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { dedup: '#0ea5e9', score: '#10b981', ttl: '#f59e0b', flood: '#6366f1' };
const colors = [C.dedup, C.score, C.ttl, C.flood];

const ITEMS = [
  { label: 'Dedup Cache', icon: '#', y: 20 },
  { label: 'Peer Score', icon: 'S', y: 55 },
  { label: 'TTL Timer', icon: 'T', y: 90 },
  { label: 'Flood Pub', icon: 'F', y: 125 },
];

export default function ReliabilityViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 400 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {ITEMS.map((item, i) => {
            const active = i === step;
            const c = colors[i];
            return (
              <motion.g key={i}
                animate={{ opacity: active ? 1 : 0.2 }} transition={sp}>
                {/* Icon circle */}
                <circle cx={40} cy={item.y + 12} r={12}
                  fill={c + '15'} stroke={c} strokeWidth={active ? 1.5 : 1} />
                <text x={40} y={item.y + 16} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={c}>{item.icon}</text>
                {/* Label and bar */}
                <rect x={65} y={item.y} width={300} height={24} rx={4}
                  fill={c + '08'} stroke={c} strokeWidth={active ? 1.3 : 0.5} />
                <text x={80} y={item.y + 16} fontSize={10} fontWeight={600} fill={c}>
                  {item.label}
                </text>
                {/* Active detail */}
                {active && (
                  <motion.text x={350} y={item.y + 16} textAnchor="end"
                    fontSize={10} fill={c} initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
                    {['hash → seen cache', 'score < 0 → reject', 'ttl=120s → expire', 'all mesh peers'][i]}
                  </motion.text>
                )}
                {/* Pulse on active */}
                {active && (
                  <motion.circle cx={40} cy={item.y + 12} r={12} fill="none"
                    stroke={c} strokeWidth={1}
                    initial={{ r: 12, opacity: 0.6 }} animate={{ r: 22, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }} />
                )}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
