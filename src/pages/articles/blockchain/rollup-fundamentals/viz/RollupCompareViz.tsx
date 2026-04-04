import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = ['#6366f1', '#10b981', '#f59e0b'];
const TYPES = [
  { label: 'Optimistic', finality: 85, cost: 30, security: 60, color: C[2] },
  { label: 'ZK Rollup', finality: 15, cost: 70, security: 95, color: C[0] },
];
const ATTRS = ['확정 지연', 'L1 비용', '보안 강도'];
const STEPS = [
  { label: 'Optimistic vs ZK Rollup 비교', body: '두 롤업 유형의 핵심 트레이드오프를 비교합니다.' },
  { label: 'Optimistic: 낮은 비용, 긴 확정 지연', body: 'Optimistic은 7일 챌린지 기간이 필요하지만 증명 비용이 낮습니다.' },
  { label: 'ZK Rollup: 즉시 확정, 높은 증명 비용', body: 'ZK는 즉시 확정되지만 증명 생성에 높은 연산 비용이 듭니다.' },
];
const BX = [140, 340], BY = 28, BW = 110, BH = 32;

export default function RollupCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {TYPES.map((t, i) => {
            const active = step === i + 1;
            const vals = [t.finality, t.cost, t.security];
            return (
              <g key={t.label}>
                <motion.rect x={BX[i] - BW / 2} y={BY - BH / 2}
                  width={BW} height={BH} rx={5}
                  animate={{
                    fill: `${t.color}${active ? '22' : '0c'}`,
                    stroke: t.color, strokeWidth: active ? 2 : 1,
                    opacity: step === 0 || active ? 1 : 0.25,
                  }} />
                <text x={BX[i]} y={BY + 1} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={t.color}>{t.label}</text>
                <text x={BX[i]} y={BY + 11} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">
                  {i === 0 ? 'Fraud Proof' : 'Validity Proof'}
                </text>
                {vals.map((v, ai) => {
                  const barY = 58 + ai * 26;
                  return (
                    <g key={ai}>
                      {i === 0 && (
                        <text x={10} y={barY + 8} fontSize={10}
                          fill="var(--muted-foreground)">{ATTRS[ai]}</text>
                      )}
                      <motion.rect x={BX[i] - 45} y={barY} height={12} rx={3}
                        animate={{
                          width: (step === 0 || active) ? v * 0.9 : 25,
                          opacity: step === 0 || active ? 1 : 0.25,
                        }}
                        fill={`${t.color}${active ? '50' : '25'}`} />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
