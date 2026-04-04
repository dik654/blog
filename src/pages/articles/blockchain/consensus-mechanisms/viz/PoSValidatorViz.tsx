import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const VALS = [
  { name: 'V1', stake: 32, color: '#6366f1' },
  { name: 'V2', stake: 96, color: '#10b981' },
  { name: 'V3', stake: 64, color: '#f59e0b' },
  { name: 'V4', stake: 128, color: '#ec4899' },
];
const TOTAL = VALS.reduce((s, v) => s + v.stake, 0);
const BAR_BASE = 85, MAX_H = 60, CX = [60, 130, 200, 270];

const STEPS = [
  { label: '검증자 스테이킹 현황', body: '각 검증자가 보유한 스테이크 양에 비례하여 막대 높이가 결정됩니다.' },
  { label: '가중 랜덤 선택 시작', body: '스테이크 비율이 높을수록 선택될 확률이 높습니다. 룰렛이 돌아갑니다.' },
  { label: 'V4 선택됨 (40%)', body: '가장 높은 스테이크(128 ETH, 40%)를 가진 V4가 다음 블록 제안자로 선택되었습니다.' },
  { label: '블록 제안', body: '선택된 V4가 새 블록을 제안하고, 나머지 검증자들이 attestation으로 확인합니다.' },
];

export default function PoSValidatorViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {VALS.map((v, i) => {
            const barH = (v.stake / TOTAL) * MAX_H;
            const barY = BAR_BASE - barH;
            const selected = step >= 2 && i === 3;
            const scanning = step === 1;
            return (
              <g key={v.name}>
                <motion.rect x={CX[i] - 18} y={barY} width={36} height={barH} rx={4}
                  animate={{
                    fill: selected ? `${v.color}40` : `${v.color}18`,
                    stroke: v.color,
                    strokeWidth: selected ? 2.5 : scanning ? 1.5 : 1,
                    opacity: step === 2 || step === 3 ? (selected ? 1 : 0.3) : 1,
                  }} transition={sp} />
                <text x={CX[i]} y={BAR_BASE + 12} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={v.color}>{v.name}</text>
                <text x={CX[i]} y={BAR_BASE + 20} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{v.stake} ETH</text>
                <motion.text x={CX[i]} y={barY - 5} textAnchor="middle" fontSize={10}
                  fill={v.color} animate={{ opacity: step === 0 ? 1 : 0.4 }}>
                  {((v.stake / TOTAL) * 100).toFixed(0)}%
                </motion.text>
                {/* scanning highlight ring */}
                {scanning && (
                  <motion.circle cx={CX[i]} cy={barY + barH / 2} r={22}
                    fill="none" stroke={v.color} strokeWidth={1.5}
                    initial={{ opacity: 0 }} animate={{ opacity: [0, 0.6, 0] }}
                    transition={{ duration: 0.5, delay: i * 0.3, repeat: Infinity, repeatDelay: 0.8 }} />
                )}
              </g>
            );
          })}
          {/* selected indicator */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <motion.circle cx={CX[3]} cy={8} r={6} fill="#ec4899"
                style={{ filter: 'drop-shadow(0 0 6px #ec489988)' }} />
              <text x={CX[3]} y={10.5} textAnchor="middle" fontSize={10} fill="white" fontWeight={600}>V4</text>
            </motion.g>
          )}
          {/* block proposal arrow */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={CX[3] - 22} y={-6} width={44} height={16} rx={4}
                fill="#ec48990c" stroke="#ec4899" strokeWidth={1.5} />
              <text x={CX[3]} y={6} textAnchor="middle" fontSize={10}
                fill="#ec4899" fontWeight={600}>New Block</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
