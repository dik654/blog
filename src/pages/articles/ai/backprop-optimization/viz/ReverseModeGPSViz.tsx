import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS = [
  { label: '계산 그래프 구성 — 경도 x → 선형 z_i → softmax p_i → 정답과 비교해 CE loss L. 노드는 연산, 간선은 값의 흐름.' },
  { label: '순전파 완료 — x=-3.7 투입 → z=[-0.91, -0.27, 1.04] → p=[0.10, 0.19, 0.71]. 모델은 Berlin 으로 판정, 정답은 Madrid 이므로 L=2.30.' },
  { label: 'Reverse 시작 — 출력 L 에서 dL/dL=1 로 초기화. softmax+CE 조합 덕분에 p 자리에서 gradient 가 곧 (p − y) = [−0.90, 0.19, 0.71] 로 정돈됨.' },
  { label: 'Chain rule 역방향 — 각 z_i 로 gradient 가 그대로 흐른 뒤, local 미분 ∂z_i/∂w_i = x, ∂z_i/∂b_i = 1 을 곱해 6개 gradient 일괄 획득.' },
  { label: 'Forward mode 비교 — 같은 결과를 forward mode 로 얻으려면 파라미터 수만큼 6번 순전파 반복. Reverse 는 backward 1회로 끝.' },
];

// 색상
const C_FWD  = '#10b981';   // 순전파 (녹)
const C_BWD  = '#f59e0b';   // 역전파 (황)
const C_PARAM = '#6366f1';  // 가중치/편향 (보라)
const C_INPUT = '#64748b';  // 입력 (회)
const C_Z     = '#0ea5e9';  // hidden z
const C_P     = '#a855f7';  // softmax p
const C_L     = '#ef4444';  // loss

export default function ReverseModeGPSViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const fwd     = step >= 1;
        const revInit = step >= 2;
        const revFull = step >= 3;
        const compare = step === 4;

        return (
          <svg viewBox="0 0 640 290" className="w-full h-auto" style={{ maxWidth: 860 }}>
            <defs>
              <marker id="gps-fwd" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <path d="M0,0 L6,3 L0,6" fill={C_FWD} />
              </marker>
              <marker id="gps-bwd" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <path d="M0,0 L6,3 L0,6" fill={C_BWD} />
              </marker>
            </defs>

            {/* 제목 */}
            <text x={320} y={18} textAnchor="middle" fontSize={13} fontWeight={700}
              fill="var(--foreground)">
              Reverse-Mode Autodiff — GPS 모델 계산 그래프
            </text>

            {/* 부제 */}
            <text x={320} y={33} textAnchor="middle" fontSize={9}
              fill="var(--muted-foreground)">
              x=-3.7 (경도) → 선형 z_i → softmax p_i → cross-entropy L
            </text>

            {/* ── 레이어 헤더 ── */}
            <text x={50}  y={54} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">입력</text>
            <text x={220} y={54} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">선형 z = w·x + b</text>
            <text x={410} y={54} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">softmax p</text>
            <text x={570} y={54} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">loss L</text>

            {/* ── 간선: x → z_i (세 개) ── */}
            {[80, 145, 210].map((y, i) => (
              <motion.line
                key={`x-z-${i}`}
                x1={75} y1={108}
                x2={197} y2={y}
                stroke={C_FWD}
                animate={{ strokeOpacity: fwd ? 1 : 0.2, strokeWidth: fwd ? 1.6 : 0.7 }}
                transition={sp}
                markerEnd="url(#gps-fwd)"
              />
            ))}
            {/* weight 라벨: w_madrid, w_paris, w_berlin */}
            {[['w_m', 80, 0.3], ['w_p', 145, 0.1], ['w_b', 210, -0.2]].map(([lbl, y], i) => (
              <g key={`wlabel-${i}`}>
                <rect x={114} y={(y as number) - 20} width={58} height={14} rx={2}
                  fill="var(--background)" stroke={C_PARAM} strokeWidth={0.6} />
                <text x={143} y={(y as number) - 10} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={C_PARAM}>{lbl as string}={([0.3, 0.1, -0.2][i]).toFixed(1)}</text>
              </g>
            ))}

            {/* ── 간선: z_i → p_i ── */}
            {[80, 145, 210].map((y, i) => (
              <motion.line
                key={`z-p-${i}`}
                x1={253} y1={y}
                x2={377} y2={y}
                stroke={C_FWD}
                animate={{ strokeOpacity: fwd ? 1 : 0.2, strokeWidth: fwd ? 1.6 : 0.7 }}
                transition={sp}
                markerEnd="url(#gps-fwd)"
              />
            ))}

            {/* softmax coupling — z 전체가 각 p 에 영향, 점선으로 표시 */}
            {fwd && (
              <motion.path
                d="M 253 80 Q 320 145 377 210 M 253 210 Q 320 145 377 80"
                fill="none" stroke={C_FWD} strokeWidth={0.6} strokeDasharray="2 2"
                opacity={0.35}
                initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} transition={sp}
              />
            )}

            {/* ── 간선: p_i → L (세 개 합류) ── */}
            {[80, 145, 210].map((y, i) => (
              <motion.line
                key={`p-l-${i}`}
                x1={433} y1={y}
                x2={547} y2={145}
                stroke={C_FWD}
                animate={{ strokeOpacity: fwd ? 1 : 0.2, strokeWidth: fwd ? 1.6 : 0.7 }}
                transition={sp}
                markerEnd="url(#gps-fwd)"
              />
            ))}

            {/* ── 노드: x ── */}
            <circle cx={50} cy={108} r={22} fill={`${C_INPUT}14`} stroke={C_INPUT} strokeWidth={1.2} />
            <text x={50} y={105} textAnchor="middle" fontSize={12} fontWeight={700} fill={C_INPUT}>x</text>
            <text x={50} y={119} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">-3.7</text>

            {/* ── 노드: z_i ── */}
            {[
              { y: 80,  lbl: 'z_m', val: fwd ? '-0.91' : '?' },
              { y: 145, lbl: 'z_p', val: fwd ? '-0.27' : '?' },
              { y: 210, lbl: 'z_b', val: fwd ?  '1.04' : '?' },
            ].map((n, i) => (
              <g key={`zn-${i}`}>
                <motion.circle cx={225} cy={n.y} r={22}
                  animate={{ fill: fwd ? `${C_Z}22` : '#80808010', stroke: fwd ? C_Z : '#888', strokeWidth: fwd ? 1.6 : 1 }}
                  transition={sp} />
                <text x={225} y={n.y - 3} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={fwd ? C_Z : 'var(--muted-foreground)'}>{n.lbl}</text>
                <text x={225} y={n.y + 11} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">{n.val}</text>
              </g>
            ))}

            {/* ── 노드: p_i (softmax output) ── */}
            {[
              { y: 80,  lbl: 'p_m', val: fwd ? '0.10' : '?', isTrue: true },
              { y: 145, lbl: 'p_p', val: fwd ? '0.19' : '?', isTrue: false },
              { y: 210, lbl: 'p_b', val: fwd ? '0.71' : '?', isTrue: false },
            ].map((n, i) => (
              <g key={`pn-${i}`}>
                <motion.circle cx={405} cy={n.y} r={22}
                  animate={{
                    fill: fwd ? `${C_P}22` : '#80808010',
                    stroke: fwd ? C_P : '#888',
                    strokeWidth: fwd ? (n.isTrue ? 2.2 : 1.4) : 1,
                  }} transition={sp} />
                <text x={405} y={n.y - 3} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={fwd ? C_P : 'var(--muted-foreground)'}>{n.lbl}</text>
                <text x={405} y={n.y + 11} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">{n.val}</text>
                {n.isTrue && fwd && (
                  <text x={405} y={n.y - 28} textAnchor="middle" fontSize={9} fontWeight={600} fill={C_L}>
                    정답
                  </text>
                )}
              </g>
            ))}

            {/* ── 노드: L ── */}
            <motion.circle cx={570} cy={145} r={24}
              animate={{
                fill: fwd ? `${C_L}20` : '#80808010',
                stroke: fwd ? C_L : '#888',
                strokeWidth: fwd ? 2 : 1,
              }} transition={sp} />
            <text x={570} y={142} textAnchor="middle" fontSize={12} fontWeight={700}
              fill={fwd ? C_L : 'var(--muted-foreground)'}>L</text>
            <text x={570} y={156} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {fwd ? '2.30' : 'CE'}
            </text>

            {/* ── dL/dL = 1 배지 ── */}
            {revInit && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <rect x={544} y={106} width={62} height={16} rx={2}
                  fill={`${C_L}20`} stroke={C_L} strokeWidth={0.8} />
                <text x={575} y={117} textAnchor="middle" fontSize={9} fontWeight={700} fill={C_L}>
                  dL/dL = 1
                </text>
              </motion.g>
            )}

            {/* ── 역전파: L → p_i (dL/dp_i = -y_i/p_i + ... 축약: p-y 직접 표시) ── */}
            {revInit && [
              { y: 80,  val: '-0.90' },
              { y: 145, val: '+0.19' },
              { y: 210, val: '+0.71' },
            ].map((n, i) => (
              <motion.g key={`Lp-bwd-${i}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: i * 0.05 }}>
                <line x1={547} y1={145} x2={435} y2={n.y}
                  stroke={C_BWD} strokeWidth={1.4} strokeDasharray="4 3"
                  markerEnd="url(#gps-bwd)" />
                <rect x={447} y={((n.y + 145) / 2) - 9} width={76} height={14} rx={2}
                  fill="var(--background)" stroke={C_BWD} strokeWidth={0.6} />
                <text x={485} y={((n.y + 145) / 2) + 1} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={C_BWD}>(p-y)={n.val}</text>
              </motion.g>
            ))}

            {/* ── 역전파: p_i → z_i (softmax+CE 에서는 그대로 pass-through, 값 동일) ── */}
            {revFull && [
              { y: 80,  val: '-0.90' },
              { y: 145, val: '+0.19' },
              { y: 210, val: '+0.71' },
            ].map((n, i) => (
              <motion.g key={`pz-bwd-${i}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.15 + i * 0.05 }}>
                <line x1={377} y1={n.y} x2={253} y2={n.y}
                  stroke={C_BWD} strokeWidth={1.4} strokeDasharray="4 3"
                  markerEnd="url(#gps-bwd)" />
                <rect x={282} y={n.y - 16} width={68} height={14} rx={2}
                  fill="var(--background)" stroke={C_BWD} strokeWidth={0.6} />
                <text x={316} y={n.y - 6} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={C_BWD}>dL/dz={n.val}</text>
              </motion.g>
            ))}

            {/* ── 역전파: z_i → w_i (local ∂z/∂w = x = -3.7) ── */}
            {revFull && [
              { y: 80,  val: '+3.33' },
              { y: 145, val: '-0.70' },
              { y: 210, val: '-2.63' },
            ].map((n, i) => (
              <motion.g key={`zw-bwd-${i}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.3 + i * 0.05 }}>
                <line x1={203} y1={n.y} x2={73} y2={108}
                  stroke={C_BWD} strokeWidth={1.2} strokeDasharray="4 3"
                  markerEnd="url(#gps-bwd)" opacity={0.75} />
                <rect x={114} y={n.y + 4} width={68} height={14} rx={2}
                  fill="var(--background)" stroke={C_BWD} strokeWidth={0.6} />
                <text x={148} y={n.y + 14} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={C_BWD}>dL/dw={n.val}</text>
              </motion.g>
            ))}

            {/* ── Forward vs Reverse 비교 패널 ── */}
            {compare && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.1 }}>
                <rect x={16} y={245} width={608} height={38} rx={6}
                  fill={`${C_L}10`} stroke={C_L} strokeWidth={1} />
                <text x={320} y={260} textAnchor="middle" fontSize={9} fontWeight={700} fill={C_L}>
                  Forward mode: 파라미터마다 순전파 반복 → 이 모델은 6회 (w_m, w_p, w_b, b_m, b_p, b_b)
                </text>
                <text x={320} y={274} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  Reverse mode: 단 1회의 역방향 pass 로 6개 gradient 전부 획득 — scalar loss × N params 조합의 본질적 비대칭
                </text>
              </motion.g>
            )}

            {/* ── 범례 (compare 이전까지) ── */}
            {!compare && (
              <g>
                <line x1={20} y1={260} x2={42} y2={260} stroke={C_FWD} strokeWidth={1.5}
                  markerEnd="url(#gps-fwd)" />
                <text x={47} y={264} fontSize={9} fill="var(--muted-foreground)">순전파</text>

                <line x1={106} y1={260} x2={128} y2={260} stroke={C_BWD} strokeWidth={1.5}
                  strokeDasharray="4 3" markerEnd="url(#gps-bwd)" />
                <text x={133} y={264} fontSize={9} fill="var(--muted-foreground)">역전파 gradient</text>

                <circle cx={248} cy={260} r={5} fill={`${C_PARAM}22`} stroke={C_PARAM} strokeWidth={1} />
                <text x={257} y={264} fontSize={9} fill="var(--muted-foreground)">파라미터 (w, b)</text>

                <circle cx={356} cy={260} r={5} fill={`${C_INPUT}14`} stroke={C_INPUT} strokeWidth={1} />
                <text x={365} y={264} fontSize={9} fill="var(--muted-foreground)">입력 (고정)</text>

                <circle cx={448} cy={260} r={5} fill={`${C_Z}22`} stroke={C_Z} strokeWidth={1} />
                <text x={457} y={264} fontSize={9} fill="var(--muted-foreground)">hidden z</text>

                <circle cx={516} cy={260} r={5} fill={`${C_P}22`} stroke={C_P} strokeWidth={1} />
                <text x={525} y={264} fontSize={9} fill="var(--muted-foreground)">softmax p</text>

                <circle cx={588} cy={260} r={5} fill={`${C_L}20`} stroke={C_L} strokeWidth={1.2} />
                <text x={597} y={264} fontSize={9} fill="var(--muted-foreground)">loss L</text>
              </g>
            )}
          </svg>
        );
      }}
    </StepViz>
  );
}
