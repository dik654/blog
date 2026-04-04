import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: '상태 초기화', body: 'T=3 벡터 0 초기화. cap=보안(비노출), rate=입출력.' },
  { label: '흡수 ①: 입력 XOR', body: '입력 [m₁,m₂]를 rate에 XOR. cap은 변경하지 않는다.' },
  { label: '흡수 ②: 순열 π 적용', body: 'Poseidon SPN π를 전체 상태에 적용 → cap에도 입력 확산.' },
  { label: '압출 (Squeeze)', body: '최종 상태에서 rate 부분만 출력으로 추출.\ncapacity는 끝까지 비노출 → 역추적 불가능.' },
];

/* 상태 벡터 셀 */
function Cell({ x, y, w, label, sub, color, dashed }:
  { x: number; y: number; w: number; label: string; sub?: string; color: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={36} rx={5}
        fill={`${color}12`} stroke={color} strokeWidth={dashed ? 0.6 : 1}
        strokeDasharray={dashed ? '4 2' : 'none'} />
      <text x={x + w / 2} y={y + (sub ? 16 : 22)} textAnchor="middle"
        fontSize={10} fontWeight={600} fill={color}>{label}</text>
      {sub && <text x={x + w / 2} y={y + 30} textAnchor="middle"
        fontSize={9} fill="var(--muted-foreground)">{sub}</text>}
    </g>
  );
}

/* 수직 화살표 */
function VArrow({ x, y1, y2, color }: { x: number; y1: number; y2: number; color: string }) {
  return <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth={0.8} markerEnd="url(#sp-a)" />;
}

/* Step 0 */
function StateInit() {
  const cx = [60, 170, 280], y = 50, w = 80;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={210} y={24} textAnchor="middle" fontSize={10} fontWeight={600}
        fill="var(--foreground)">초기 상태 벡터 (T=3)</text>
      <Cell x={cx[0]} y={y} w={w} label="0" sub="capacity" color={C1} />
      <Cell x={cx[1]} y={y} w={w} label="0" sub="rate[0]" color={C2} />
      <Cell x={cx[2]} y={y} w={w} label="0" sub="rate[1]" color={C2} />
      <text x={cx[0] + w / 2} y={y - 8} textAnchor="middle" fontSize={10}>🔒</text>
      <rect x={cx[0] - 4} y={y - 4} width={w + 8} height={44} rx={7}
        fill="transparent" stroke={C1} strokeWidth={0.5} strokeDasharray="4 2" />
      <rect x={cx[1] - 4} y={y - 4} width={2 * w + 18 + 8} height={44} rx={7}
        fill="transparent" stroke={C2} strokeWidth={0.5} strokeDasharray="4 2" />
      <text x={cx[0] + w / 2} y={y + 58} textAnchor="middle" fontSize={9} fill={C1}>c = 1</text>
      <text x={(cx[1] + cx[2] + w) / 2} y={y + 58} textAnchor="middle" fontSize={9} fill={C2}>r = 2</text>
    </motion.g>
  );
}

/* Step 1 */
function AbsorbXOR() {
  const cx = [60, 170, 280], w = 80;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* input block */}
      <text x={210} y={16} textAnchor="middle" fontSize={9} fontWeight={600}
        fill="var(--foreground)">입력 블록 XOR</text>
      <Cell x={cx[1]} y={24} w={w} label="m₁" color={C3} />
      <Cell x={cx[2]} y={24} w={w} label="m₂" color={C3} />
      {/* XOR symbols */}
      <text x={cx[1] + w / 2} y={76} textAnchor="middle" fontSize={12} fontWeight={700} fill={C3}>⊕</text>
      <text x={cx[2] + w / 2} y={76} textAnchor="middle" fontSize={12} fontWeight={700} fill={C3}>⊕</text>
      {/* before state */}
      <Cell x={cx[0]} y={82} w={w} label="0" sub="cap" color={C1} dashed />
      <Cell x={cx[1]} y={82} w={w} label="0" sub="rate" color={C2} dashed />
      <Cell x={cx[2]} y={82} w={w} label="0" sub="rate" color={C2} dashed />
      {/* arrows down */}
      {cx.map(c => <VArrow key={c} x={c + w / 2} y1={120} y2={136} color="var(--muted-foreground)" />)}
      {/* result state */}
      <Cell x={cx[0]} y={138} w={w} label="0" sub="변화 없음" color={C1} />
      <Cell x={cx[1]} y={138} w={w} label="m₁" color={C2} />
      <Cell x={cx[2]} y={138} w={w} label="m₂" color={C2} />
    </motion.g>
  );
}

/* Step 2 */
function AbsorbPerm() {
  const cx = [60, 170, 280], w = 80;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={210} y={16} textAnchor="middle" fontSize={9} fontWeight={600}
        fill="var(--foreground)">순열 π 적용</text>
      {/* before */}
      <Cell x={cx[0]} y={26} w={w} label="0" color={C1} dashed />
      <Cell x={cx[1]} y={26} w={w} label="m₁" color={C2} />
      <Cell x={cx[2]} y={26} w={w} label="m₂" color={C2} />
      {/* arrows into π */}
      {cx.map(c => <VArrow key={c} x={c + w / 2} y1={64} y2={78} color={C1} />)}
      {/* π 내부: 3-stage 미니 파이프라인 */}
      <motion.rect x={40} y={76} width={340} height={86} rx={8}
        fill={`${C1}06`} stroke={C1} strokeWidth={1}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
      <text x={56} y={90} fontSize={9} fontWeight={600} fill={C1}>π 내부:</text>

      {/* AddRC 행 */}
      {cx.map((c, i) => (
        <motion.g key={`arc-${i}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 + i * 0.05 }}>
          <rect x={c + 4} y={96} width={w - 8} height={18} rx={3}
            fill={`${C1}15`} stroke={C1} strokeWidth={0.6} />
          <text x={c + w / 2} y={108} textAnchor="middle" fontSize={9} fill={C1}>+cᵢ</text>
        </motion.g>
      ))}

      {/* S-box 행 */}
      {cx.map((c, i) => (
        <motion.g key={`sb-${i}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 + i * 0.05 }}>
          <rect x={c + 4} y={118} width={w - 8} height={18} rx={3}
            fill={`${C2}15`} stroke={C2} strokeWidth={0.6} />
          <text x={c + w / 2} y={130} textAnchor="middle" fontSize={9} fill={C2}>x⁵</text>
        </motion.g>
      ))}

      {/* MDS 행 (전체 혼합) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <rect x={cx[0] + 4} y={140} width={cx[2] + w - cx[0] - 8} height={18} rx={3}
          fill={`${C3}12`} stroke={C3} strokeWidth={0.6} />
        <text x={210} y={152} textAnchor="middle" fontSize={9} fontWeight={600} fill={C3}>
          MDS 행렬 곱 (전체 혼합)
        </text>
      </motion.g>

      <text x={390} y={134} fontSize={9} fill={C1}>× R회</text>

      {/* 화살표 → 출력 */}
      {cx.map(c => <VArrow key={`o${c}`} x={c + w / 2} y1={162} y2={176} color={C1} />)}

      {/* cross connections (MDS 확산) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.25 }} transition={{ delay: 0.5 }}>
        {[0, 1, 2].map(i => [0, 1, 2].filter(j => j !== i).map(j => (
          <line key={`${i}-${j}`} x1={cx[i] + w / 2} y1={160} x2={cx[j] + w / 2} y2={176}
            stroke={C3} strokeWidth={0.4} strokeDasharray="2 2" />
        )))}
      </motion.g>

      {/* after */}
      <Cell x={cx[0]} y={178} w={w} label="s₀'" color={C1} />
      <Cell x={cx[1]} y={178} w={w} label="s₁'" color={C1} />
      <Cell x={cx[2]} y={178} w={w} label="s₂'" color={C1} />
      <motion.text x={210} y={230} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.6 }}>
        모든 원소가 서로 영향 → capacity에도 입력 정보 확산
      </motion.text>
    </motion.g>
  );
}

/* Step 3 */
function Squeeze() {
  const cx = [60, 170, 280], w = 80;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={210} y={20} textAnchor="middle" fontSize={9} fontWeight={600}
        fill="var(--foreground)">출력 추출 (Squeeze)</text>
      {/* final state */}
      <Cell x={cx[0]} y={36} w={w} label="s₀" sub="capacity" color={C1} />
      <Cell x={cx[1]} y={36} w={w} label="s₁" sub="rate" color={C2} />
      <Cell x={cx[2]} y={36} w={w} label="s₂" sub="rate" color={C2} />
      <text x={cx[0] + w / 2} y={30} textAnchor="middle" fontSize={10}>🔒</text>
      {/* X mark on capacity */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.2 }}>
        <line x1={cx[0] + 10} y1={40} x2={cx[0] + w - 10} y2={68} stroke="#ef4444" strokeWidth={1.5} />
        <line x1={cx[0] + w - 10} y1={40} x2={cx[0] + 10} y2={68} stroke="#ef4444" strokeWidth={1.5} />
      </motion.g>
      {/* output arrows from rate */}
      <VArrow x={cx[1] + w / 2} y1={74} y2={96} color={C2} />
      <VArrow x={cx[2] + w / 2} y1={74} y2={96} color={C2} />
      {/* output box */}
      <motion.rect x={cx[1] - 4} y={100} width={2 * w + 18 + 8} height={34} rx={8}
        fill={`${C2}15`} stroke={C2} strokeWidth={1.5}
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} />
      <text x={(cx[1] + cx[2] + w) / 2} y={122} textAnchor="middle"
        fontSize={11} fontWeight={700} fill={C2}>hash = [s₁, s₂]</text>
      <motion.text x={210} y={155} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.5 }}>
        capacity는 끝까지 비노출 → 상태 역추적 불가
      </motion.text>
    </motion.g>
  );
}

export default function SpongeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={step === 2 ? '0 0 420 240' : '0 0 420 200'} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="sp-a" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {step === 0 && <StateInit />}
          {step === 1 && <AbsorbXOR />}
          {step === 2 && <AbsorbPerm />}
          {step === 3 && <Squeeze />}
        </svg>
      )}
    </StepViz>
  );
}
