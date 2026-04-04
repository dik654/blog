import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const NODES = [
  { label: '프로그램', sub: 'f(x)', color: '#6366f1' },
  { label: '곱셈 게이트', sub: '연산 분해', color: '#8b5cf6' },
  { label: 'R1CS', sub: 'A,B,C 행렬', color: '#10b981' },
  { label: 'Lagrange', sub: '열→다항식', color: '#f59e0b' },
  { label: 'QAP', sub: 'a(x)b(x)-c(x)', color: '#ec4899' },
  { label: 'h(x) 검증', sub: 't(x)로 나눔', color: '#ef4444' },
];
const BW = 48, BH = 28, GAP = 8, OX = 10, OY = 30;

const STEPS = [
  { label: '프로그램 정의', body: '증명하고자 하는 계산 f(x)를 정의합니다.' },
  { label: '곱셈 게이트 분해', body: '모든 연산을 곱셈 게이트로 분해. 덧셈은 무료(선형결합).' },
  { label: 'R1CS 생성', body: '각 게이트를 (A·s)*(B·s)=C·s 제약으로 표현합니다.' },
  { label: 'Lagrange 보간', body: 'R1CS 행렬의 각 열을 도메인 D 위에서 다항식으로 보간.' },
  { label: 'QAP 결합', body: 'witness 벡터로 다항식 결합: a(x)b(x)-c(x) = h(x)t(x).' },
  { label: 'h(x) 검증', body: 'a(x)b(x)-c(x)가 t(x)로 나누어떨어지면 R1CS 만족. O(1) 검증.' },
];

export default function R1CStoQAPViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 78" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const x = OX + i * (BW + GAP);
            const active = step >= i;
            const glow = step === i;
            return (
              <g key={n.label}>
                <motion.rect x={x} y={OY} width={BW} height={BH} rx={4}
                  animate={{ fill: active ? `${n.color}20` : `${n.color}06`,
                    stroke: n.color, strokeWidth: glow ? 2.2 : 0.6, opacity: active ? 1 : 0.15 }}
                  transition={sp} />
                <text x={x + BW / 2} y={OY + 12} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={n.color} opacity={active ? 1 : 0.2}>{n.label}</text>
                <text x={x + BW / 2} y={OY + 21} textAnchor="middle" fontSize={9}
                  fill={n.color} opacity={active ? 0.55 : 0.1}>{n.sub}</text>
                {/* arrow */}
                {i > 0 && (
                  <motion.line x1={x - GAP + 2} y1={OY + BH / 2} x2={x - 2} y2={OY + BH / 2}
                    stroke={n.color} strokeWidth={0.8} markerEnd="url(#arr)"
                    animate={{ opacity: active ? 0.6 : 0.08 }} transition={sp} />
                )}
              </g>
            );
          })}
          <defs>
            <marker id="arr" viewBox="0 0 6 6" refX={6} refY={3} markerWidth={4} markerHeight={4} orient="auto">
              <path d="M0,0 L6,3 L0,6Z" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
