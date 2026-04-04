import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const STEPS = [
  { label: '부모 가중치 상속', body: 'w[r+1]은 부모 TipSet의 w[r]에서 시작\n→ 체인이 길수록 누적 가중치 증가' },
  { label: 'log₂(totalPower) 항', body: 'PowerActor에서 QualityAdjPower 조회\nBitLen()-1로 log₂ 근사 → 256배 스케일링(<<8)\n→ 네트워크 전체 파워가 클수록 가중치 증가' },
  { label: 'WinCount 보너스', body: 'Tipset 내 모든 블록의 WinCount 합산\n→ log₂P × totalJ × wRatioNum × 256 / (BlocksPerEpoch × wRatioDen)\n→ 블록이 많은 Tipset이 더 무거운 체인' },
];

const BAR_W = 300, BAR_H = 30;

export default function WeightViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Formula */}
          <text x={220} y={18} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">
            w[r+1] = w[r] + log₂(P) × 2⁸ + (log₂(P) × ΣWinCount × wRatio) / e
          </text>

          {/* Stacked bar */}
          {[
            { label: 'w[r] (부모 가중치)', w: 0.4, color: '#6366f1', idx: 0 },
            { label: 'log₂(P) × 2⁸', w: 0.35, color: '#10b981', idx: 1 },
            { label: 'WinCount 보너스', w: 0.25, color: '#f59e0b', idx: 2 },
          ].map((seg) => {
            const prevW = seg.idx === 0 ? 0 : seg.idx === 1 ? 0.4 : 0.75;
            const x = 70 + prevW * BAR_W;
            const w = seg.w * BAR_W;
            const active = step === seg.idx;
            return (
              <motion.g key={seg.label}
                animate={{ opacity: step >= seg.idx ? 1 : 0.15 }} transition={sp}>
                <rect x={x} y={40} width={w} height={BAR_H} rx={seg.idx === 0 ? 6 : 0}
                  fill={active ? `${seg.color}30` : `${seg.color}15`}
                  stroke={seg.color} strokeWidth={active ? 2 : 0.8} />
                <text x={x + w / 2} y={59} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={seg.color}>{seg.label}</text>
              </motion.g>
            );
          })}

          {/* Code mapping */}
          <motion.g animate={{ opacity: step >= 1 ? 0.7 : 0 }} transition={sp}>
            <text x={70} y={95} fontSize={10} fill="#10b981" fontFamily="monospace">
              log2P = tpow.BitLen() - 1
            </text>
            <text x={70} y={112} fontSize={10} fill="#10b981" fontFamily="monospace">
              out.Add(out, log2P{'<<'}8)
            </text>
          </motion.g>
          <motion.g animate={{ opacity: step >= 2 ? 0.7 : 0 }} transition={sp}>
            <text x={70} y={132} fontSize={10} fill="#f59e0b" fontFamily="monospace">
              eWeight = log2P × WRatioNum × totalJ / (e × WRatioDen)
            </text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
