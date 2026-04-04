import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const BARS = [
  { label: '개별 증명 x4', bytes: 26, color: '#ef4444' },
  { label: '단일 증명', bytes: 9, color: '#f59e0b' },
  { label: '집계 증명 (4개)', bytes: 5, color: '#10b981' },
];

const STEPS = [
  { label: '개별 범위 증명 4개 생성', body: 'v1..v4 각각 O(log n) 크기 증명을 따로 만들면 전체 크기 ~26KB.' },
  { label: '내적 인수(IPA) 적용', body: '2·log₂(n) 타원곡선 점으로 증명 크기를 대폭 축소합니다.' },
  { label: '집계 증명 — O(log(n·m))', body: '4개를 하나로 집계하면 ~5KB. 개별 합산 대비 약 80% 절약.' },
];

export default function RangeProofAggViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 340 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {BARS.map((b, i) => {
            const y = 15 + i * 35;
            const active = i <= step;
            const w = (b.bytes / 28) * 240;
            return (
              <g key={b.label}>
                <text x={8} y={y + 14} fontSize={9} fill="var(--muted-foreground)"
                  opacity={active ? 0.8 : 0.3}>{b.label}</text>
                <motion.rect x={90} y={y} rx={4} height={22}
                  animate={{ width: active ? w : 8, fill: active ? `${b.color}30` : `${b.color}08`,
                    stroke: b.color, strokeWidth: active ? 1.5 : 0.5, opacity: active ? 1 : 0.2 }}
                  transition={sp} />
                <motion.text x={90 + w + 6} y={y + 14} fontSize={9} fontWeight={600} fill={b.color}
                  animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
                  ~{b.bytes}KB
                </motion.text>
              </g>
            );
          })}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={240} y={92} width={90} height={18} rx={4} fill="#10b98118" stroke="#10b981" strokeWidth={1} />
              <text x={285} y={104} textAnchor="middle" fontSize={6.5} fontWeight={600} fill="#10b981">
                ~80% 절약
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
