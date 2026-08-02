import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: '같은 계산 그래프 — 두 방식 모두 입력 x₁·x₂ 에서 출력 L 까지 동일한 구조를 사용한다.' },
  { label: 'Forward mode: x₁ 에 seed=1 주입 → 순전파 방향으로 편미분 전파 → dL/dx₁ 하나 획득.' },
  { label: 'Forward mode: x₂ 에 seed=1 주입 → 두 번째 순전파 → dL/dx₂ 획득. 입력 수만큼 반복 필요.' },
  { label: 'Reverse mode: L 에 dL/dL=1 주입 → 역방향 pass 단 1회 → dL/dx₁ 과 dL/dx₂ 를 동시에 획득.' },
];

export default function DiffModesIntroViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const fwd1 = step >= 1;
        const fwd2 = step >= 2;
        const rev  = step >= 3;

        return (
          <svg viewBox="0 0 480 200" className="w-full h-auto">
            <defs>
              <marker id="dmi-fwd" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="#3b82f6" />
              </marker>
              <marker id="dmi-bwd" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="#f59e0b" />
              </marker>
            </defs>

            {/* 제목 */}
            <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
              fill="var(--foreground)">
              미분 계산 두 방식 — Forward vs Reverse
            </text>

            {/* 구분선 */}
            <line x1={240} y1={28} x2={240} y2={180}
              stroke="var(--muted-foreground)" strokeOpacity={0.2}
              strokeWidth={1} strokeDasharray="3 4" />

            {/* ── Forward 패널 (좌) ── */}
            <text x={120} y={36} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">
              Forward mode
            </text>

            {/* 입력 노드 x₁ x₂ */}
            {[
              { cy: 75,  lbl: 'x₁', active: fwd1 },
              { cy: 135, lbl: 'x₂', active: fwd2 },
            ].map((n) => (
              <g key={n.lbl}>
                <motion.circle cx={60} cy={n.cy} r={14}
                  animate={{
                    fill:        n.active ? '#3b82f622' : '#80808010',
                    stroke:      n.active ? '#3b82f6'   : '#888888',
                    strokeWidth: n.active ? 1.8 : 1,
                  }}
                  transition={sp}
                />
                <text x={60} y={n.cy + 4} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={n.active ? '#3b82f6' : 'var(--muted-foreground)'}>
                  {n.lbl}
                </text>
                {/* seed 주입 (원 왼쪽) */}
                {n.active && (
                  <motion.g initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                    <rect x={8} y={n.cy - 8} width={38} height={16} rx={2}
                      fill="#3b82f618" stroke="#3b82f6" strokeWidth={0.7} />
                    <text x={27} y={n.cy + 4} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">
                      seed
                    </text>
                  </motion.g>
                )}
                {/* 순전파 화살표 */}
                <motion.line x1={74} y1={n.cy} x2={104} y2={105}
                  animate={{
                    strokeOpacity: n.active ? 0.9 : 0.2,
                    strokeWidth:   n.active ? 1.5 : 0.8,
                  }}
                  transition={sp}
                  stroke="#3b82f6" markerEnd="url(#dmi-fwd)"
                />
                {/* gradient 획득 뱃지 */}
                {n.active && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.15 }}>
                    <rect x={180} y={n.cy - 9} width={56} height={18} rx={2}
                      fill="#3b82f610" stroke="#3b82f6" strokeWidth={0.7} />
                    <text x={208} y={n.cy + 4} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">
                      dL/d{n.lbl} ✓
                    </text>
                  </motion.g>
                )}
              </g>
            ))}

            {/* 중간 노드 z */}
            <circle cx={116} cy={105} r={15}
              fill={fwd1 ? '#0ea5e922' : '#80808010'}
              stroke={fwd1 ? '#0ea5e9' : '#888'} strokeWidth={fwd1 ? 1.5 : 1} />
            <text x={116} y={109} textAnchor="middle" fontSize={10} fontWeight={700}
              fill={fwd1 ? '#0ea5e9' : 'var(--muted-foreground)'}>z</text>

            {/* L */}
            <motion.line x1={131} y1={105} x2={160} y2={105}
              animate={{ strokeOpacity: fwd1 ? 0.9 : 0.2, strokeWidth: fwd1 ? 1.5 : 0.8 }}
              transition={sp} stroke="#3b82f6" markerEnd="url(#dmi-fwd)"
            />
            <circle cx={174} cy={105} r={15}
              fill={fwd1 ? '#ef444422' : '#80808010'}
              stroke={fwd1 ? '#ef4444' : '#888'} strokeWidth={fwd1 ? 1.5 : 1} />
            <text x={174} y={109} textAnchor="middle" fontSize={10} fontWeight={700}
              fill={fwd1 ? '#ef4444' : 'var(--muted-foreground)'}>L</text>

            {/* Forward 비용 표시 */}
            <rect x={20} y={160} width={200} height={28} rx={4}
              fill="var(--background)" stroke="#3b82f6" strokeWidth={0.8} strokeOpacity={0.5} />
            <text x={120} y={172} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">
              순전파 횟수: {fwd2 ? 2 : fwd1 ? 1 : 0} / 2
            </text>
            <text x={120} y={184} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              입력 N개 → N번 반복 필요
            </text>

            {/* ── Reverse 패널 (우) ── */}
            <text x={360} y={36} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">
              Reverse mode
            </text>

            {/* 입력 노드 x₁ x₂ (우) */}
            {[
              { cy: 75,  lbl: 'x₁' },
              { cy: 135, lbl: 'x₂' },
            ].map((n) => (
              <g key={`r-${n.lbl}`}>
                <motion.circle cx={286} cy={n.cy} r={14}
                  animate={{
                    fill:        rev ? '#f59e0b22' : '#3b82f610',
                    stroke:      rev ? '#f59e0b'   : '#3b82f6',
                    strokeWidth: rev ? 1.8 : 1.2,
                  }}
                  transition={sp}
                />
                <text x={286} y={n.cy + 4} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={rev ? '#f59e0b' : '#3b82f6'}>
                  {n.lbl}
                </text>
                {/* gradient 뱃지 (원 왼쪽) */}
                {rev && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.15 }}>
                    <rect x={248} y={n.cy - 9} width={24} height={18} rx={2}
                      fill="#f59e0b18" stroke="#f59e0b" strokeWidth={0.7} />
                    <text x={260} y={n.cy + 4} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">
                      ✓
                    </text>
                  </motion.g>
                )}
                {/* 역방향 화살표 */}
                {rev && (
                  <motion.line
                    x1={330} y1={105} x2={302} y2={n.cy === 75 ? 90 : 120}
                    stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 2"
                    markerEnd="url(#dmi-bwd)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ ...sp, duration: 0.5 }}
                  />
                )}
              </g>
            ))}

            {/* 중간 z (우) */}
            <motion.circle cx={346} cy={105} r={15}
              animate={{
                fill:        rev ? '#f59e0b22' : '#0ea5e922',
                stroke:      rev ? '#f59e0b'   : '#0ea5e9',
                strokeWidth: 1.5,
              }}
              transition={sp}
            />
            <text x={346} y={109} textAnchor="middle" fontSize={10} fontWeight={700}
              fill={rev ? '#f59e0b' : '#0ea5e9'}>z</text>

            {/* L (우) */}
            <line x1={361} y1={105} x2={395} y2={105}
              stroke="#10b981" strokeWidth={1.4} opacity={0.7} />
            <circle cx={410} cy={105} r={15}
              fill="#ef444422" stroke="#ef4444" strokeWidth={1.5} />
            <text x={410} y={109} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">L</text>

            {/* dL/dL=1 seed */}
            {rev && (
              <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <rect x={418} y={58} width={54} height={16} rx={2}
                  fill="#f59e0b18" stroke="#f59e0b" strokeWidth={0.8} />
                <text x={445} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">
                  dL/dL=1
                </text>
                <line x1={420} y1={74} x2={410} y2={90}
                  stroke="#f59e0b" strokeWidth={1.4} strokeDasharray="3 2"
                  markerEnd="url(#dmi-bwd)" />
              </motion.g>
            )}

            {/* Reverse 비용 표시 */}
            <rect x={258} y={160} width={200} height={28} rx={4}
              fill="var(--background)" stroke="#f59e0b" strokeWidth={0.8} strokeOpacity={0.5} />
            <text x={358} y={172} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">
              역전파 {rev ? 1 : 0} pass → 모든 dL/dx 동시
            </text>
            <text x={358} y={184} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              scalar loss → M=1 → 항상 1회
            </text>
          </svg>
        );
      }}
    </StepViz>
  );
}
