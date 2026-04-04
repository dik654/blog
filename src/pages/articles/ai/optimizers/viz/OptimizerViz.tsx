import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { sgd: '#0ea5e9', mom: '#10b981', adam: '#f59e0b', adamw: '#8b5cf6' };
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const OPT = [
  { label: 'SGD',      color: C.sgd,  converge: 100, lr: '고정 η',       saddle: '정체', decay: '—' },
  { label: 'Momentum', color: C.mom,  converge: 40,  lr: '고정 η',       saddle: '탈출', decay: '—' },
  { label: 'Adam',     color: C.adam, converge: 15,  lr: '파라미터별 적응', saddle: '탈출', decay: 'L2 결합' },
  { label: 'AdamW',    color: C.adamw,converge: 12,  lr: '파라미터별 적응', saddle: '탈출', decay: '분리 λθ' },
];

const STEPS = [
  'SGD — η 고정, 100 에폭에 수렴, 안장점 정체',
  'Momentum — 관성으로 40 에폭에 수렴, 안장점 탈출',
  'Adam — 적응적 η로 15 에폭에 수렴',
  'AdamW — 12 에폭 수렴 + 일관된 weight decay',
];

const BAR_MAX = 280;

export default function OptimizerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 245" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={10} y={16} fontSize={9} fill="var(--muted-foreground)">
            수렴까지 필요한 에폭 수 (짧을수록 좋음)
          </text>

          {OPT.map((o, i) => {
            const active = i === step;
            const y = 32 + i * 48;
            const barW = (o.converge / 100) * BAR_MAX;
            return (
              <motion.g key={i} animate={{ opacity: active ? 1 : 0.25 }} transition={sp}>
                {/* 라벨 */}
                <text x={10} y={y + 14} fontSize={11} fontWeight={active ? 600 : 400} fill={o.color}>
                  {o.label}
                </text>
                {/* 바 */}
                <motion.rect x={90} y={y} rx={4}
                  animate={{ width: active ? barW : barW * 0.6 }}
                  height={20} fill={`${o.color}20`} stroke={o.color} strokeWidth={1}
                  transition={sp} />
                {/* 에폭 수 */}
                <motion.text x={active ? 90 + barW + 8 : 90 + barW * 0.6 + 8} y={y + 14}
                  fontSize={10} fontWeight={600} fill={o.color}
                  animate={{ x: active ? 90 + barW + 8 : 90 + barW * 0.6 + 8 }} transition={sp}>
                  {o.converge} 에폭
                </motion.text>
                {/* 특성 태그 */}
                {active && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <text x={90} y={y + 36} fontSize={9} fill="var(--muted-foreground)">
                      학습률: {o.lr} | 안장점: {o.saddle} | weight decay: {o.decay}
                    </text>
                  </motion.g>
                )}
              </motion.g>
            );
          })}

          {/* 비교 테이블 헤더 */}
          <line x1={90} y1={226} x2={90 + BAR_MAX} y2={226}
            stroke="var(--border)" strokeWidth={0.5} />
          <text x={90} y={224} fontSize={9} fill="var(--muted-foreground)">0</text>
          <text x={90 + BAR_MAX / 2} y={224} textAnchor="middle" fontSize={9}
            fill="var(--muted-foreground)">50</text>
          <text x={90 + BAR_MAX} y={224} textAnchor="end" fontSize={9}
            fill="var(--muted-foreground)">100 에폭</text>
        </svg>
      )}
    </StepViz>
  );
}
