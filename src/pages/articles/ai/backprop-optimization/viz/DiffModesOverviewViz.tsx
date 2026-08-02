import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: '미분 계산 방식은 두 가지 — Forward mode 는 입력 하나에 seed 를 주입해 순전파 방향으로 편미분 하나를 전파한다. Reverse mode 는 출력(loss) 하나에서 출발해 역방향 pass 단 1회로 모든 입력에 대한 편미분을 동시에 획득한다.' },
  { label: '계산 그래프 동작 원리 — 순전파 시 각 노드는 입력값과 local gradient 를 메모리에 보관한다. 역전파 시 dL/dL=1.0 에서 시작해 chain rule 로 gradient 를 역방향 누적한다. 각 노드는 (upstream gradient × local gradient) 를 아래 노드로 전달한다.' },
  { label: '효율성 — Forward mode 는 파라미터 N 개에 대해 N 번의 순전파가 필요하다. Reverse mode 는 순전파 1회 + 역전파 1회로 N 개 gradient 를 동시에 얻는다. GPT-4 수준 (수천억 파라미터) 이면 Forward mode 는 수천억 배 더 많은 연산이 필요하다.' },
];

export default function DiffModesOverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const showBlock1 = step >= 1;
        const showBlock2 = step >= 2;
        const showBlock3 = step >= 3;

        return (
          <svg viewBox="0 0 480 260" className="w-full h-auto">
            <defs>
              <marker id="dmo-fwd" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="#3b82f6" />
              </marker>
              <marker id="dmo-bwd" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="#f59e0b" />
              </marker>
              <marker id="dmo-rev" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto-start-reverse">
                <path d="M0,0 L6,3 L0,6" fill="#f59e0b" />
              </marker>
            </defs>

            {/* ─────────── Block #1: Two mode cards ─────────── */}

            {/* Forward mode card */}
            <motion.rect
              x={12} y={12} width={214} height={70} rx={6}
              animate={{
                fill:         showBlock1 ? '#3b82f610' : '#80808008',
                stroke:       showBlock1 ? '#3b82f6'   : '#888888',
                strokeWidth:  showBlock1 ? 1.4 : 0.7,
                strokeOpacity: showBlock1 ? 1 : 0.3,
              }}
              transition={sp}
            />
            <motion.text
              x={119} y={28} textAnchor="middle" fontSize={9} fontWeight={700}
              animate={{ fill: showBlock1 ? '#3b82f6' : '#888888' }}
              transition={sp}>
              Forward mode
            </motion.text>
            <motion.text
              x={119} y={44} textAnchor="middle" fontSize={9}
              animate={{ fill: showBlock1 ? 'var(--foreground)' : 'var(--muted-foreground)' }}
              transition={sp}>
              입력 x₁ 에 seed=1 주입
            </motion.text>
            <motion.text
              x={119} y={58} textAnchor="middle" fontSize={9}
              animate={{ fill: showBlock1 ? 'var(--foreground)' : 'var(--muted-foreground)' }}
              transition={sp}>
              → 순전파 방향으로 편미분 전파
            </motion.text>
            <motion.text
              x={119} y={72} textAnchor="middle" fontSize={9}
              animate={{ fill: showBlock1 ? '#3b82f6' : 'var(--muted-foreground)' }}
              transition={sp}>
              → dL/dx₁ 하나 획득 (1 pass)
            </motion.text>
            {/* forward arrow illustration */}
            {showBlock1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
                <circle cx={28} cy={100} r={10} fill="#3b82f610" stroke="#3b82f6" strokeWidth={1} />
                <text x={28} y={103} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">x</text>
                <line x1={38} y1={100} x2={62} y2={100} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#dmo-fwd)" />
                <circle cx={72} cy={100} r={10} fill="#0ea5e910" stroke="#0ea5e9" strokeWidth={1} />
                <text x={72} y={103} textAnchor="middle" fontSize={9} fontWeight={700} fill="#0ea5e9">z</text>
                <line x1={82} y1={100} x2={106} y2={100} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#dmo-fwd)" />
                <circle cx={116} cy={100} r={10} fill="#ef444410" stroke="#ef4444" strokeWidth={1} />
                <text x={116} y={103} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">L</text>
                <rect x={134} y={92} width={66} height={16} rx={2} fill="#3b82f610" stroke="#3b82f6" strokeWidth={0.7} />
                <text x={167} y={103} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">dL/dx₁ ✓</text>
              </motion.g>
            )}

            {/* Reverse mode card */}
            <motion.rect
              x={254} y={12} width={214} height={70} rx={6}
              animate={{
                fill:         showBlock1 ? '#f59e0b10' : '#80808008',
                stroke:       showBlock1 ? '#f59e0b'   : '#888888',
                strokeWidth:  showBlock1 ? 1.4 : 0.7,
                strokeOpacity: showBlock1 ? 1 : 0.3,
              }}
              transition={sp}
            />
            <motion.text
              x={361} y={28} textAnchor="middle" fontSize={9} fontWeight={700}
              animate={{ fill: showBlock1 ? '#f59e0b' : '#888888' }}
              transition={sp}>
              Reverse mode
            </motion.text>
            <motion.text
              x={361} y={44} textAnchor="middle" fontSize={9}
              animate={{ fill: showBlock1 ? 'var(--foreground)' : 'var(--muted-foreground)' }}
              transition={sp}>
              출력 L 에서 dL/dL=1 주입
            </motion.text>
            <motion.text
              x={361} y={58} textAnchor="middle" fontSize={9}
              animate={{ fill: showBlock1 ? 'var(--foreground)' : 'var(--muted-foreground)' }}
              transition={sp}>
              → 역방향 pass 단 1회
            </motion.text>
            <motion.text
              x={361} y={72} textAnchor="middle" fontSize={9}
              animate={{ fill: showBlock1 ? '#f59e0b' : 'var(--muted-foreground)' }}
              transition={sp}>
              → 모든 dL/dxᵢ 동시 획득
            </motion.text>
            {/* reverse arrow illustration */}
            {showBlock1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.12 }}>
                <circle cx={268} cy={100} r={10} fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1} />
                <text x={268} y={103} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">x</text>
                <line x1={312} y1={100} x2={280} y2={100} stroke="#f59e0b" strokeWidth={1.2} strokeDasharray="3 2" markerEnd="url(#dmo-bwd)" />
                <circle cx={322} cy={100} r={10} fill="#0ea5e910" stroke="#0ea5e9" strokeWidth={1} />
                <text x={322} y={103} textAnchor="middle" fontSize={9} fontWeight={700} fill="#0ea5e9">z</text>
                <line x1={356} y1={100} x2={334} y2={100} stroke="#f59e0b" strokeWidth={1.2} strokeDasharray="3 2" markerEnd="url(#dmo-bwd)" />
                <circle cx={366} cy={100} r={10} fill="#ef444410" stroke="#ef4444" strokeWidth={1} />
                <text x={366} y={103} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">L</text>
                <rect x={383} y={92} width={80} height={16} rx={2} fill="#f59e0b10" stroke="#f59e0b" strokeWidth={0.7} />
                <text x={423} y={103} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">모든 dL/dxᵢ ✓</text>
              </motion.g>
            )}

            {/* ─────────── Block #2: Computational graph memory strip ─────────── */}
            <motion.g
              animate={{ opacity: showBlock2 ? 1 : 0 }}
              transition={sp}>
              <rect x={12} y={124} width={456} height={70} rx={5}
                fill="#10b98108" stroke="#10b981" strokeWidth={0.9} />
              <text x={240} y={138} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">
                계산 그래프 — 순전파 시 local gradient 메모리 저장
              </text>
              {/* node strip */}
              {[
                { cx: 56,  lbl: 'x',    local: '2x' },
                { cx: 152, lbl: 'x²',   local: '1' },
                { cx: 248, lbl: 'u',    local: 'cos' },
                { cx: 344, lbl: 'sin',  local: '1' },
                { cx: 420, lbl: 'L',    local: '—' },
              ].map((n, i) => (
                <g key={`n${i}`}>
                  <circle cx={n.cx} cy={164} r={12}
                    fill={n.lbl === 'L' ? '#ef444410' : '#10b98110'}
                    stroke={n.lbl === 'L' ? '#ef4444' : '#10b981'}
                    strokeWidth={1} />
                  <text x={n.cx} y={167} textAnchor="middle" fontSize={9} fontWeight={700}
                    fill={n.lbl === 'L' ? '#ef4444' : '#10b981'}>
                    {n.lbl}
                  </text>
                  {n.lbl !== 'L' && n.cx < 420 && (
                    <text x={n.cx + 14} y={152} fontSize={9} fill="#10b981">
                      [{n.local}]
                    </text>
                  )}
                  {i < 4 && (
                    <line x1={n.cx + 12} y1={164} x2={n.cx + (i === 3 ? 64 : 84)} y2={164}
                      stroke="#10b981" strokeWidth={0.9} markerEnd="url(#dmo-fwd)"
                      opacity={0.6} />
                  )}
                </g>
              ))}
            </motion.g>

            {/* reverse pass label (inside block2 rect, below nodes) */}
            {showBlock2 && (
              <motion.text
                x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
                역전파: dL/dL=1.0 → (upstream × local) 를 역방향 누적
              </motion.text>
            )}

            {/* ─────────── Block #3: N pass comparison banner ─────────── */}
            <motion.g
              animate={{ opacity: showBlock3 ? 1 : 0 }}
              transition={{ ...sp, delay: 0.05 }}>
              <rect x={12} y={206} width={456} height={42} rx={5}
                fill="#ef444408" stroke="#ef4444" strokeWidth={0.9} />
              <text x={240} y={223} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">
                Forward: N번 순전파 필요 (GPT-4 → ~10¹¹ 회)
              </text>
              <text x={240} y={238} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Reverse: 순전파 1회 + 역전파 1회 → N개 gradient 동시 획득
              </text>
            </motion.g>
          </svg>
        );
      }}
    </StepViz>
  );
}
