import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS = [
  { label: '계산 그래프 구성: 순전파로 각 연산 노드와 간선을 기록한다' },
  { label: '순전파 완료: w₁=0.5, x=2.0, w₂=0.2 → z=1.2 → L=0.85' },
  { label: 'Reverse 시작: 출력 L에서 dL/dL = 1.0 으로 초기화' },
  { label: 'Chain rule 역방향: dL/dz=0.74 → dL/dw₁=1.48, dL/dw₂=0.74 동시 획득' },
  { label: 'Forward mode 비교: 파라미터 N개면 N번 순전파 필요 — Reverse는 단 1회로 전체 gradient 완성' },
];

export default function ReverseModeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const fwdDone = step >= 1;
        const revStart = step >= 2;
        const revFull = step >= 3;
        const compare = step === 4;

        return (
          <svg viewBox="0 0 520 235" className="w-full h-auto">
            {/* 제목 */}
            <text
              x={260} y={18}
              textAnchor="middle" fontSize={13} fontWeight={700}
              fill="var(--foreground)"
            >
              Reverse Mode Autodiff — 계산 그래프
            </text>

            {/* ── 순전파 간선 ── */}
            {/* w₁ → z */}
            <motion.line
              x1={65} y1={58} x2={207} y2={102}
              stroke="#10b981"
              animate={{ strokeWidth: fwdDone ? 1.6 : 0.6, strokeOpacity: fwdDone ? 1 : 0.18 }}
              transition={sp}
            />
            {/* x → z */}
            <motion.line
              x1={65} y1={108} x2={207} y2={108}
              stroke="#10b981"
              animate={{ strokeWidth: fwdDone ? 1.6 : 0.6, strokeOpacity: fwdDone ? 1 : 0.18 }}
              transition={sp}
            />
            {/* w₂ → z */}
            <motion.line
              x1={65} y1={158} x2={207} y2={114}
              stroke="#10b981"
              animate={{ strokeWidth: fwdDone ? 1.6 : 0.6, strokeOpacity: fwdDone ? 1 : 0.18 }}
              transition={sp}
            />
            {/* z → L */}
            <motion.line
              x1={253} y1={108} x2={378} y2={108}
              stroke="#10b981"
              animate={{ strokeWidth: fwdDone ? 1.8 : 0.6, strokeOpacity: fwdDone ? 1 : 0.18 }}
              transition={sp}
            />

            {/* ── 순전파 화살표 마커 ── */}
            <defs>
              <marker id="rm-fwd" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="#10b981" />
              </marker>
              <marker id="rm-bwd" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="#f59e0b" />
              </marker>
            </defs>

            {/* ── 노드: w₁ ── */}
            <motion.circle
              cx={42} cy={58} r={22}
              animate={{
                fill: '#6366f122',
                stroke: '#6366f1',
                strokeWidth: 1.6,
              }}
              transition={sp}
            />
            <text x={42} y={54} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">w₁</text>
            <text x={42} y={68} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">0.5</text>

            {/* ── 노드: x (입력, 학습 안 함) ── */}
            <motion.circle
              cx={42} cy={108} r={22}
              animate={{
                fill: '#64748b14',
                stroke: '#64748b',
                strokeWidth: 1.2,
              }}
              transition={sp}
            />
            <text x={42} y={104} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">x</text>
            <text x={42} y={118} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">2.0</text>

            {/* ── 노드: w₂ ── */}
            <motion.circle
              cx={42} cy={158} r={22}
              animate={{
                fill: '#6366f122',
                stroke: '#6366f1',
                strokeWidth: 1.6,
              }}
              transition={sp}
            />
            <text x={42} y={154} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">w₂</text>
            <text x={42} y={168} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">0.2</text>

            {/* ── 노드: z ── */}
            <motion.circle
              cx={230} cy={108} r={24}
              animate={{
                fill: fwdDone ? '#0ea5e920' : '#80808010',
                stroke: fwdDone ? '#0ea5e9' : '#888',
                strokeWidth: fwdDone ? 1.8 : 1,
              }}
              transition={sp}
            />
            <text x={230} y={104} textAnchor="middle" fontSize={12} fontWeight={700}
              fill={fwdDone ? '#0ea5e9' : 'var(--muted-foreground)'}>z</text>
            <text x={230} y={117} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {fwdDone ? '1.2' : 'w₁x+w₂'}
            </text>

            {/* ── 노드: L ── */}
            <motion.circle
              cx={402} cy={108} r={24}
              animate={{
                fill: fwdDone ? '#ef444420' : '#80808010',
                stroke: fwdDone ? '#ef4444' : '#888',
                strokeWidth: fwdDone ? 2 : 1,
              }}
              transition={sp}
            />
            <text x={402} y={104} textAnchor="middle" fontSize={12} fontWeight={700}
              fill={fwdDone ? '#ef4444' : 'var(--muted-foreground)'}>L</text>
            <text x={402} y={117} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {fwdDone ? '0.85' : 'loss'}
            </text>

            {/* ── 순전파 값 배지 ── */}
            {fwdDone && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={sp}
              >
                <rect x={209} y={58} width={42} height={16} rx={3}
                  fill="#0ea5e918" stroke="#0ea5e9" strokeWidth={0.7} />
                <text x={230} y={69} textAnchor="middle" fontSize={9} fontWeight={700} fill="#0ea5e9">
                  z=1.2
                </text>
              </motion.g>
            )}

            {/* ── dL/dL 배지 ── */}
            {revStart && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={sp}
              >
                <rect x={382} y={78} width={62} height={16} rx={3}
                  fill="#ef444420" stroke="#ef4444" strokeWidth={0.9} />
                <text x={413} y={90} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">
                  dL/dL=1.0
                </text>
              </motion.g>
            )}

            {/* ── 역전파 간선: L → z ── */}
            {revFull && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={sp}
              >
                <line
                  x1={378} y1={116} x2={254} y2={116}
                  stroke="#f59e0b" strokeWidth={1.8} strokeDasharray="5 3"
                  markerEnd="url(#rm-bwd)"
                />
                <rect x={287} y={120} width={72} height={16} rx={2}
                  fill="var(--background)" stroke="#f59e0b" strokeWidth={0.7} />
                <text x={323} y={131} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">
                  dL/dz=0.74
                </text>
              </motion.g>
            )}

            {/* ── 역전파 간선: z → w₁ ── */}
            {revFull && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.1 }}
              >
                <line
                  x1={207} y1={100} x2={65} y2={62}
                  stroke="#f59e0b" strokeWidth={1.8} strokeDasharray="5 3"
                  markerEnd="url(#rm-bwd)"
                />
                <rect x={95} y={62} width={82} height={16} rx={2}
                  fill="var(--background)" stroke="#f59e0b" strokeWidth={0.7} />
                <text x={136} y={73} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">
                  dL/dw₁=1.48
                </text>
              </motion.g>
            )}

            {/* ── 역전파 간선: z → w₂ ── */}
            {revFull && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}
              >
                <line
                  x1={207} y1={116} x2={65} y2={154}
                  stroke="#f59e0b" strokeWidth={1.8} strokeDasharray="5 3"
                  markerEnd="url(#rm-bwd)"
                />
                <rect x={95} y={128} width={82} height={16} rx={2}
                  fill="var(--background)" stroke="#f59e0b" strokeWidth={0.7} />
                <text x={136} y={139} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">
                  dL/dw₂=0.74
                </text>
              </motion.g>
            )}

            {/* ── Forward mode 비교 패널 ── */}
            {compare && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.1 }}
              >
                <rect x={18} y={190} width={484} height={38} rx={6}
                  fill="#ef444410" stroke="#ef4444" strokeWidth={1} />
                <text x={260} y={205} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">
                  Forward mode: N번 순전파 (파라미터 N개)
                </text>
                <text x={260} y={219} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  Reverse mode: 단 1회 backward — scalar output + 대규모 파라미터 조합에서 O(N) 배 우위
                </text>
              </motion.g>
            )}

            {/* ── 범례 ── */}
            {!compare && (
              <g>
                <line x1={28} y1={210} x2={50} y2={210} stroke="#10b981" strokeWidth={1.5} />
                <text x={55} y={214} fontSize={9} fill="var(--muted-foreground)">순전파</text>
                <line x1={118} y1={210} x2={140} y2={210}
                  stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5 3" />
                <text x={145} y={214} fontSize={9} fill="var(--muted-foreground)">역전파 gradient</text>
                <circle cx={260} cy={210} r={5} fill="#6366f122" stroke="#6366f1" strokeWidth={1.2} />
                <text x={268} y={214} fontSize={9} fill="var(--muted-foreground)">파라미터</text>
                <circle cx={348} cy={210} r={5} fill="#64748b14" stroke="#64748b" strokeWidth={1} />
                <text x={356} y={214} fontSize={9} fill="var(--muted-foreground)">입력 (고정)</text>
              </g>
            )}
          </svg>
        );
      }}
    </StepViz>
  );
}
