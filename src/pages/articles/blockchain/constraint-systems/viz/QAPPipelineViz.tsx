import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const COLS = [
  { label: '도메인 D', sub: '{ω₁…ωₘ}', color: '#6366f1' },
  { label: 'Lagrange', sub: 'aⱼ(ωᵢ)=A[i,j]', color: '#10b981' },
  { label: '소거 다항식', sub: 't(x)=∏(x-ωᵢ)', color: '#f59e0b' },
  { label: 'Witness 결합', sub: 'a(x)=Σsⱼaⱼ', color: '#8b5cf6' },
  { label: '몫 h(x)', sub: '(a·b-c)/t', color: '#ec4899' },
];
const BW = 54, BH = 32, GAP = 12, OX = 20, OY = 30;

const STEPS = [
  { label: '도메인 선택 — D = {ω₁, …, ωₘ}', body: 'm개 평가 점 선택. roots of unity 사용 시 FFT로 O(m log m) 최적화.' },
  { label: 'Lagrange 보간 — 열 → 다항식', body: 'R1CS 행렬 각 열을 다항식으로 변환. L_i(x)는 Kronecker delta 성질.' },
  { label: '소거 다항식 t(x) = ∏(x − ωᵢ)', body: '도메인 모든 점에서 0. 프로덕션: t(x)=xᵐ-1 으로 O(1) 저장.' },
  { label: 'Witness 결합 — a(x) = Σⱼ sⱼ·aⱼ(x)', body: 'witness 벡터 s로 열 다항식 선형 결합. b(x), c(x) 동일 계산.' },
  { label: '몫 검증 — h(x) = (a·b − c) / t(x)', body: 'R1CS 만족 ⟺ t(x)|a(x)b(x)-c(x). Schwartz-Zippel로 O(1) 검증.' },
];

export default function QAPPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 510 80" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {COLS.map((c, i) => {
            const x = OX + i * (BW + GAP);
            const active = step >= i;
            return (
              <g key={c.label}>
                <motion.rect x={x} y={OY} width={BW} height={BH} rx={4}
                  animate={{ fill: active ? `${c.color}20` : `${c.color}06`,
                    stroke: c.color, strokeWidth: step === i ? 2 : 0.6, opacity: active ? 1 : 0.2 }}
                  transition={sp} />
                <text x={x + BW / 2} y={OY + 13} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={c.color} opacity={active ? 1 : 0.3}>{c.label}</text>
                <text x={x + BW / 2} y={OY + 23} textAnchor="middle" fontSize={9}
                  fill={c.color} opacity={active ? 0.6 : 0.15}>{c.sub}</text>
                {/* arrow */}
                {i > 0 && (
                  <motion.line x1={x - GAP + 2} y1={OY + BH / 2} x2={x - 2} y2={OY + BH / 2}
                    stroke={c.color} strokeWidth={0.8}
                    animate={{ opacity: step >= i ? 0.6 : 0.1 }} transition={sp} />
                )}
              </g>
            );
          })}
          {/* bottom summary */}
          <text x={OX} y={74} fontSize={9} fill="var(--muted-foreground)">
            O(m) 검증 (R1CS) → QAP → O(1) 검증 (Schwartz-Zippel)
          </text>
        </svg>
      )}
    </StepViz>
  );
}
