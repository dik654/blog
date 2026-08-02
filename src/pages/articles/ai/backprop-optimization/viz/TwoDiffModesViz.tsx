import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: '미분 계산 방식은 두 가지다 — 같은 계산 그래프를 어떤 방향으로 순회하느냐가 차이의 전부다.' },
  { label: 'Forward mode: 입력 하나에 seed=1 을 주입하고 순전파 방향으로 편미분을 전파한다. 한 번에 입력 하나의 gradient 만 얻는다.' },
  { label: 'Reverse mode: 출력(loss) 에서 dL/dL=1 로 초기화하고 역방향으로 전파한다. 단 1 회의 backward pass 로 모든 입력에 대한 gradient 를 동시에 얻는다.' },
];

export default function TwoDiffModesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const fwdActive = step >= 1;
        const revActive = step >= 2;

        return (
          <svg viewBox="0 0 520 210" className="w-full h-auto">
            <defs>
              <marker id="tdm-fwd" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="#3b82f6" />
              </marker>
              <marker id="tdm-bwd" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="#f59e0b" />
              </marker>
            </defs>

            {/* 제목 */}
            <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700}
              fill="var(--foreground)">
              두 가지 자동 미분 방식
            </text>

            {/* 구분선 */}
            <line x1={240} y1={24} x2={240} y2={178}
              stroke="var(--muted-foreground)" strokeOpacity={0.2}
              strokeWidth={1} strokeDasharray="4 4" />

            {/* ── Forward 패널 ── */}
            <rect x={10} y={26} width={218} height={150} rx={6}
              fill={fwdActive ? '#3b82f608' : 'transparent'}
              stroke={fwdActive ? '#3b82f6' : 'var(--border)'}
              strokeWidth={fwdActive ? 1.2 : 0.8}
              strokeDasharray={fwdActive ? undefined : '3 3'}
            />
            <text x={119} y={42} textAnchor="middle" fontSize={10} fontWeight={700}
              fill={fwdActive ? '#3b82f6' : 'var(--muted-foreground)'}>
              Forward mode
            </text>

            {/* 그래프 노드 (forward) */}
            {/* 입력 x */}
            <motion.circle cx={50} cy={100} r={16}
              animate={{
                fill: fwdActive ? '#3b82f620' : '#80808010',
                stroke: fwdActive ? '#3b82f6' : '#888888',
                strokeWidth: fwdActive ? 1.8 : 1,
              }}
              transition={sp}
            />
            <text x={50} y={104} textAnchor="middle" fontSize={11} fontWeight={700}
              fill={fwdActive ? '#3b82f6' : 'var(--muted-foreground)'}>x</text>

            {/* seed 뱃지 */}
            {fwdActive && (
              <motion.g initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
                <rect x={20} y={62} width={60} height={17} rx={2}
                  fill="#3b82f618" stroke="#3b82f6" strokeWidth={0.7} />
                <text x={50} y={74} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">
                  seed = 1
                </text>
              </motion.g>
            )}

            {/* 중간 노드 */}
            <motion.circle cx={119} cy={100} r={14}
              animate={{
                fill: fwdActive ? '#0ea5e920' : '#80808010',
                stroke: fwdActive ? '#0ea5e9' : '#888',
              }}
              transition={sp}
            />
            <text x={119} y={104} textAnchor="middle" fontSize={9} fontWeight={700}
              fill={fwdActive ? '#0ea5e9' : 'var(--muted-foreground)'}>f</text>

            {/* 출력 L */}
            <motion.circle cx={195} cy={100} r={16}
              animate={{
                fill: fwdActive ? '#ef444420' : '#80808010',
                stroke: fwdActive ? '#ef4444' : '#888',
                strokeWidth: fwdActive ? 1.8 : 1,
              }}
              transition={sp}
            />
            <text x={195} y={104} textAnchor="middle" fontSize={11} fontWeight={700}
              fill={fwdActive ? '#ef4444' : 'var(--muted-foreground)'}>L</text>

            {/* forward 화살표 */}
            <motion.line x1={66} y1={100} x2={102} y2={100}
              animate={{ strokeOpacity: fwdActive ? 0.9 : 0.2, strokeWidth: fwdActive ? 1.5 : 0.7 }}
              transition={sp}
              stroke="#3b82f6" markerEnd="url(#tdm-fwd)"
            />
            <motion.line x1={133} y1={100} x2={175} y2={100}
              animate={{ strokeOpacity: fwdActive ? 0.9 : 0.2, strokeWidth: fwdActive ? 1.5 : 0.7 }}
              transition={sp}
              stroke="#3b82f6" markerEnd="url(#tdm-fwd)"
            />

            {/* gradient 결과 */}
            {fwdActive && (
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <rect x={18} y={126} width={112} height={18} rx={2}
                  fill="#3b82f618" stroke="#3b82f6" strokeWidth={0.7} />
                <text x={74} y={139} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">
                  dL/dx — 1개 획득
                </text>
              </motion.g>
            )}

            <text x={119} y={164} textAnchor="middle" fontSize={9}
              fill={fwdActive ? '#3b82f6' : 'var(--muted-foreground)'}>
              입력 N개 → N회 반복
            </text>

            {/* ── Reverse 패널 ── */}
            <rect x={252} y={26} width={258} height={150} rx={6}
              fill={revActive ? '#f59e0b08' : 'transparent'}
              stroke={revActive ? '#f59e0b' : 'var(--border)'}
              strokeWidth={revActive ? 1.2 : 0.8}
              strokeDasharray={revActive ? undefined : '3 3'}
            />
            <text x={381} y={42} textAnchor="middle" fontSize={10} fontWeight={700}
              fill={revActive ? '#f59e0b' : 'var(--muted-foreground)'}>
              Reverse mode
            </text>

            {/* 입력 노드들 x₁ x₂ */}
            {[{ cy: 84, lbl: 'x₁' }, { cy: 124, lbl: 'x₂' }].map((n) => (
              <g key={n.lbl}>
                <motion.circle cx={295} cy={n.cy} r={14}
                  animate={{
                    fill: revActive ? '#f59e0b20' : '#80808010',
                    stroke: revActive ? '#f59e0b' : '#888',
                    strokeWidth: revActive ? 1.6 : 1,
                  }}
                  transition={sp}
                />
                <text x={295} y={n.cy + 4} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={revActive ? '#f59e0b' : 'var(--muted-foreground)'}>{n.lbl}</text>
                {revActive && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
                    <rect x={261} y={n.cy - 28} width={68} height={17} rx={2}
                      fill="#f59e0b18" stroke="#f59e0b" strokeWidth={0.7} />
                    <text x={295} y={n.cy - 16} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">
                      dL/d{n.lbl} ✓
                    </text>
                  </motion.g>
                )}
                {revActive && (
                  <motion.line
                    x1={378} y1={104} x2={310} y2={n.cy}
                    stroke="#f59e0b" strokeWidth={1.4} strokeDasharray="3 2"
                    markerEnd="url(#tdm-bwd)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ ...sp, duration: 0.5 }}
                  />
                )}
              </g>
            ))}

            {/* 중간 노드 f (reverse) */}
            <motion.circle cx={390} cy={104} r={15}
              animate={{
                fill: revActive ? '#f59e0b20' : '#0ea5e920',
                stroke: revActive ? '#f59e0b' : '#0ea5e9',
              }}
              transition={sp}
            />
            <text x={390} y={108} textAnchor="middle" fontSize={11} fontWeight={700}
              fill={revActive ? '#f59e0b' : '#0ea5e9'}>f</text>

            {/* 출력 L (reverse) */}
            <circle cx={478} cy={104} r={17}
              fill="#ef444420" stroke="#ef4444" strokeWidth={1.8} />
            <text x={478} y={108} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">L</text>

            {/* L 에서 역방향 화살표 */}
            {revActive && (
              <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <rect x={468} y={62} width={20} height={17} rx={2}
                  fill="#f59e0b18" stroke="#f59e0b" strokeWidth={0.8} />
                <text x={478} y={74} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">1</text>
                <motion.line x1={460} y1={104} x2={406} y2={104}
                  stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 2"
                  markerEnd="url(#tdm-bwd)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ ...sp, duration: 0.4 }}
                />
              </motion.g>
            )}

            <text x={381} y={164} textAnchor="middle" fontSize={9}
              fill={revActive ? '#f59e0b' : 'var(--muted-foreground)'}>
              입력 N개 → 역전파 1회
            </text>
          </svg>
        );
      }}
    </StepViz>
  );
}
