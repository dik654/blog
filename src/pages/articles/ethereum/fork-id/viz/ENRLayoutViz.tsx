import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const FIELDS = [
  { label: 'Node ID (40B)', c: '#6366f1', w: 40 },
  { label: 'IP / Port (12B)', c: '#10b981', w: 12 },
  { label: 'Fork ID (12B)', c: '#f59e0b', w: 12 },
  { label: 'SeqNum (8B)', c: '#8b5cf6', w: 8 },
  { label: '기타 메타 (100B+)', c: '#6b7280', w: 100 },
];
const ANNOT = ['Keccak256(pubkey) 32B', 'IPv4/IPv6 + UDP/TCP', 'fork_hash + fork_next', '시퀀스 번호 (업데이트 시 증가)', '키-값 페어, 300B 제한'];
const TOTAL = 300, BAR_X = 30, BAR_W = 340, BAR_Y = 30, BAR_H = 28;

export default function ENRLayoutViz() {
  return (
    <StepViz steps={FIELDS}>
      {(step) => {
        let cx = BAR_X;
        return (
          <svg viewBox="0 0 500 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <text x={200} y={20} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.3}>
              ENR v4 레코드 (총 300B 이하)
            </text>
            {/* stacked bar */}
            {FIELDS.map((f, i) => {
              const w = (f.w / TOTAL) * BAR_W;
              const x = cx;
              cx += w;
              const active = i === step;
              return (
                <motion.g key={i} animate={{ y: active ? -4 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <rect x={x} y={BAR_Y} width={w} height={BAR_H} rx={i === 0 ? 5 : i === 4 ? 5 : 0}
                    fill={f.c} fillOpacity={active ? 0.7 : 0.25}
                    stroke={f.c} strokeWidth={active ? 2 : 0} />
                  {w > 30 && (
                    <text x={x + w / 2} y={BAR_Y + BAR_H / 2 + 3} textAnchor="middle"
                      fontSize={9} fontWeight={600} fill="white" fillOpacity={0.9}>
                      {f.w}B
                    </text>
                  )}
                </motion.g>
              );
            })}
            {/* detail box for active field */}
            <motion.g key={step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <rect x={40} y={75} width={320} height={38} rx={6}
                fill={FIELDS[step].c + '12'} stroke={FIELDS[step].c} strokeWidth={1.5} />
              <text x={200} y={92} textAnchor="middle" fontSize={10} fontWeight={600} fill={FIELDS[step].c}>
                {FIELDS[step].label.split(' (')[0]}
              </text>
              <text x={200} y={106} textAnchor="middle" fontSize={9} fill={FIELDS[step].c} fillOpacity={0.6}>
                {FIELDS[step].w}B / 300B
              </text>
            </motion.g>
            <motion.text x={405} y={65} fontSize={9} fill="var(--foreground)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
          </svg>
        );
      }}
    </StepViz>
  );
}
