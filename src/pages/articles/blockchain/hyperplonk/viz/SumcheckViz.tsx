import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

/* ── 색상 팔레트 ── */
const C = {
  prover: '#6366f1',   // indigo
  verifier: '#f59e0b', // amber
  accent: '#10b981',   // emerald
  dim: '#94a3b8',      // slate
  pcs: '#ec4899',      // pink
};

/* ── Prover / Verifier 위치 ── */
const PX = 80;   // Prover 중앙 x
const VX = 400;  // Verifier 중앙 x

/* ── 하이퍼큐브 꼭짓점 좌표 (n=3, 2^3=8) ── */
const CUBE_CX = 240, CUBE_CY = 80;
const cubeNodes = [
  // front face
  { x: -40, y: -30, label: '000' },
  { x:  20, y: -30, label: '100' },
  { x:  20, y:  20, label: '110' },
  { x: -40, y:  20, label: '010' },
  // back face (offset)
  { x: -22, y: -48, label: '001' },
  { x:  38, y: -48, label: '101' },
  { x:  38, y:   2, label: '111' },
  { x: -22, y:   2, label: '011' },
];
const cubeEdges = [
  [0,1],[1,2],[2,3],[3,0], // front
  [4,5],[5,6],[6,7],[7,4], // back
  [0,4],[1,5],[2,6],[3,7], // depth
];

const STEPS = [
  {
    label: '문제 설정 — 하이퍼큐브 위의 합',
    body: 'f(x₁,x₂,...,xₙ)을 불리언 하이퍼큐브 {0,1}ⁿ 위에서 평가.\n' +
      'Prover가 "전체 합 = S"라고 주장. Verifier가 직접 합산하면 2ⁿ번 평가 필요 — 비실용적.\n' +
      'Sumcheck은 이를 n라운드 대화형 프로토콜로 축소한다.',
  },
  {
    label: 'Round 1 — x₁을 자유 변수로, 나머지 합산',
    body: 'Prover가 g₁(X₁) = Σ_{x₂,...,xₙ} f(X₁, x₂,...,xₙ) 전송.\n' +
      'Verifier는 g₁(0) + g₁(1) = S 확인 (X₁에 0,1 대입 시 원래 합 복원).\n' +
      '확인 후 랜덤 챌린지 r₁ 전송 → x₁ = r₁로 고정.',
  },
  {
    label: 'Round i — 변수를 하나씩 고정하며 차원 축소',
    body: 'gᵢ(Xᵢ) = Σ_{xᵢ₊₁,...,xₙ} f(r₁,...,rᵢ₋₁, Xᵢ, xᵢ₊₁,...,xₙ).\n' +
      'Verifier는 gᵢ(0) + gᵢ(1) = gᵢ₋₁(rᵢ₋₁) 확인 — 이전 라운드와 일관성.\n' +
      '매 라운드마다 평가 점 수가 2ⁿ → 2ⁿ⁻¹ → ... → 2¹로 절반씩 감소.',
  },
  {
    label: '최종 검증 — 단일 점 평가 + PCS',
    body: '모든 변수가 (r₁,...,rₙ)로 고정 → 단일 점 f(r₁,...,rₙ) 평가.\n' +
      'Verifier는 gₙ(rₙ) = f(r₁,...,rₙ)인지 PCS(다항식 커밋먼트) 오라클로 확인.\n' +
      '전체 통신량 O(n)개 필드 원소, Verifier 비용 O(n).',
  },
];

/* ── 메시지 화살표 (Prover ↔ Verifier 간) ── */
function MsgArrow({ x1, x2, y, label, color, active, highlighted }: {
  x1: number; x2: number; y: number; label: string;
  color: string; active: boolean; highlighted: boolean;
}) {
  const dir = x2 > x1 ? 1 : -1;
  return (
    <g>
      <motion.line
        x1={x1} y1={y} x2={x2 - dir * 4} y2={y}
        stroke={color} strokeWidth={highlighted ? 1.6 : 0.8}
        animate={{ opacity: active ? 0.85 : 0.1 }}
        transition={sp}
      />
      {/* arrowhead */}
      <motion.polygon
        points={`${x2},${y} ${x2 - dir * 6},${y - 3} ${x2 - dir * 6},${y + 3}`}
        fill={color}
        animate={{ opacity: active ? 0.85 : 0.1 }}
        transition={sp}
      />
      {/* label bg */}
      <motion.rect
        x={(x1 + x2) / 2 - 30} y={y - 12} width={60} height={12} rx={3}
        fill="var(--card)" stroke="var(--border)" strokeWidth={0.4}
        animate={{ opacity: active ? 1 : 0 }}
        transition={sp}
      />
      <motion.text
        x={(x1 + x2) / 2} y={y - 4} textAnchor="middle"
        fontSize={8} fontWeight={600} fill={color}
        animate={{ opacity: active ? 0.9 : 0 }}
        transition={sp}
      >{label}</motion.text>
    </g>
  );
}

export default function SumcheckViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* ═══ Prover / Verifier 박스 ═══ */}
          <ModuleBox x={PX - 40} y={4} w={80} h={28} label="Prover" sub="합 증명" color={C.prover} />
          <ModuleBox x={VX - 40} y={4} w={80} h={28} label="Verifier" sub="합 검증" color={C.verifier} />

          {/* 수직 점선 */}
          <line x1={PX} y1={34} x2={PX} y2={155} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 2" />
          <line x1={VX} y1={34} x2={VX} y2={155} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 2" />

          {/* ═══ Step 0: 하이퍼큐브 ═══ */}
          {step === 0 && (
            <g>
              {/* 하이퍼큐브 엣지 */}
              {cubeEdges.map(([a, b], i) => (
                <motion.line key={i}
                  x1={CUBE_CX + cubeNodes[a].x} y1={CUBE_CY + cubeNodes[a].y}
                  x2={CUBE_CX + cubeNodes[b].x} y2={CUBE_CY + cubeNodes[b].y}
                  stroke={C.prover} strokeWidth={0.7}
                  initial={{ opacity: 0 }} animate={{ opacity: 0.35 }}
                  transition={{ ...sp, delay: i * 0.03 }}
                />
              ))}
              {/* 하이퍼큐브 노드 */}
              {cubeNodes.map((n, i) => (
                <g key={i}>
                  <motion.circle
                    cx={CUBE_CX + n.x} cy={CUBE_CY + n.y} r={8}
                    fill={`${C.prover}18`} stroke={C.prover} strokeWidth={1}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ ...sp, delay: i * 0.04 }}
                  />
                  <motion.text
                    x={CUBE_CX + n.x} y={CUBE_CY + n.y + 3}
                    textAnchor="middle" fontSize={7} fontWeight={600} fill={C.prover}
                    initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                    transition={{ ...sp, delay: i * 0.04 + 0.1 }}
                  >{n.label}</motion.text>
                </g>
              ))}
              {/* 합 레이블 */}
              <motion.text
                x={CUBE_CX} y={CUBE_CY + 42} textAnchor="middle"
                fontSize={10} fontWeight={700} fill={C.prover}
                initial={{ opacity: 0 }} animate={{ opacity: 0.9 }}
                transition={{ ...sp, delay: 0.3 }}
              >Σ f(x) = S</motion.text>
              <motion.text
                x={CUBE_CX} y={CUBE_CY + 54} textAnchor="middle"
                fontSize={8} fill={C.dim}
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                transition={{ ...sp, delay: 0.4 }}
              >2ⁿ개 꼭짓점 평가</motion.text>
            </g>
          )}

          {/* ═══ Step 1: Round 1 메시지 교환 ═══ */}
          {step === 1 && (
            <g>
              {/* Prover → Verifier: g₁(X₁) */}
              <MsgArrow x1={PX + 20} x2={VX - 20} y={54}
                label="g₁(X₁) 전송" color={C.prover}
                active highlighted />
              {/* Verifier checks */}
              <motion.text x={VX} y={78} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={C.verifier}
                initial={{ opacity: 0 }} animate={{ opacity: 0.9 }}
                transition={{ ...sp, delay: 0.15 }}
              >g₁(0)+g₁(1)=S ?</motion.text>
              <motion.text x={VX} y={90} textAnchor="middle"
                fontSize={8} fill={C.accent}
                initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                transition={{ ...sp, delay: 0.25 }}
              >확인 통과</motion.text>
              {/* Verifier → Prover: r₁ */}
              <MsgArrow x1={VX - 20} x2={PX + 20} y={108}
                label="r₁ 전송" color={C.verifier}
                active highlighted={false} />
              {/* 차원 표시 */}
              <motion.text x={240} y={136} textAnchor="middle"
                fontSize={8} fill={C.dim}
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                transition={{ ...sp, delay: 0.3 }}
              >x₁ = r₁ 고정 → 2ⁿ⁻¹개로 축소</motion.text>
              {/* 변수 상태 */}
              <DataBox x={PX - 32} y={46} w={48} h={22} label="x₁ free" color={C.accent} />
            </g>
          )}

          {/* ═══ Step 2: Round i (차원 축소) ═══ */}
          {step === 2 && (
            <g>
              {/* 차원 축소 바 */}
              {[0, 1, 2, 3].map((i) => {
                const bx = 145 + i * 52;
                const bw = 44;
                const by = 44;
                const filled = i < 2; // 첫 2개 고정
                const current = i === 2;
                return (
                  <g key={i}>
                    <motion.rect
                      x={bx} y={by} width={bw} height={22} rx={4}
                      fill={filled ? `${C.accent}20` : current ? `${C.prover}15` : `${C.dim}08`}
                      stroke={filled ? C.accent : current ? C.prover : C.dim}
                      strokeWidth={current ? 1.6 : 0.6}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ ...sp, delay: i * 0.08 }}
                    />
                    <motion.text
                      x={bx + bw / 2} y={by + 14} textAnchor="middle"
                      fontSize={8} fontWeight={600}
                      fill={filled ? C.accent : current ? C.prover : C.dim}
                      initial={{ opacity: 0 }} animate={{ opacity: 0.9 }}
                      transition={{ ...sp, delay: i * 0.08 + 0.05 }}
                    >{filled ? `r${i + 1}` : current ? `Xᵢ` : `x${i + 3}`}</motion.text>
                  </g>
                );
              })}
              {/* 레이블 */}
              <motion.text x={240} y={40} textAnchor="middle"
                fontSize={9} fontWeight={600} fill="var(--foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                transition={{ ...sp, delay: 0.05 }}
              >변수 상태</motion.text>
              <motion.text x={167} y={82} textAnchor="middle"
                fontSize={8} fill={C.accent}
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                transition={{ ...sp, delay: 0.3 }}
              >고정됨</motion.text>
              <motion.text x={249} y={82} textAnchor="middle"
                fontSize={8} fill={C.prover}
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                transition={{ ...sp, delay: 0.35 }}
              >자유</motion.text>
              <motion.text x={336} y={82} textAnchor="middle"
                fontSize={8} fill={C.dim}
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                transition={{ ...sp, delay: 0.4 }}
              >합산 대상</motion.text>

              {/* Prover → Verifier 메시지 */}
              <MsgArrow x1={PX + 20} x2={VX - 20} y={100}
                label="gᵢ(Xᵢ) 전송" color={C.prover}
                active highlighted />
              {/* Verifier 검증 */}
              <motion.text x={VX} y={118} textAnchor="middle"
                fontSize={8} fontWeight={600} fill={C.verifier}
                initial={{ opacity: 0 }} animate={{ opacity: 0.85 }}
                transition={{ ...sp, delay: 0.2 }}
              >gᵢ(0)+gᵢ(1)=gᵢ₋₁(rᵢ₋₁)?</motion.text>
              {/* Verifier → Prover: rᵢ */}
              <MsgArrow x1={VX - 20} x2={PX + 20} y={136}
                label="rᵢ 전송" color={C.verifier}
                active highlighted={false} />
              {/* 차원 축소 표시 */}
              <motion.text x={240} y={154} textAnchor="middle"
                fontSize={8} fill={C.dim}
                initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
                transition={{ ...sp, delay: 0.45 }}
              >2ⁿ → 2ⁿ⁻¹ → ... → 2¹ (매 라운드 절반)</motion.text>
            </g>
          )}

          {/* ═══ Step 3: 최종 검증 ═══ */}
          {step === 3 && (
            <g>
              {/* 고정된 변수들 */}
              {[0, 1, 2, 3].map((i) => {
                const bx = 150 + i * 46;
                return (
                  <g key={i}>
                    <motion.rect
                      x={bx} y={44} width={38} height={20} rx={4}
                      fill={`${C.accent}20`} stroke={C.accent} strokeWidth={0.8}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ ...sp, delay: i * 0.06 }}
                    />
                    <motion.text
                      x={bx + 19} y={57} textAnchor="middle"
                      fontSize={8} fontWeight={600} fill={C.accent}
                      initial={{ opacity: 0 }} animate={{ opacity: 0.9 }}
                      transition={{ ...sp, delay: i * 0.06 + 0.05 }}
                    >r{i + 1}</motion.text>
                  </g>
                );
              })}
              <motion.text x={240} y={40} textAnchor="middle"
                fontSize={9} fontWeight={600} fill="var(--foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                transition={sp}
              >모든 변수 고정</motion.text>

              {/* 단일 점 평가 */}
              <motion.circle
                cx={240} cy={95} r={16}
                fill={`${C.pcs}15`} stroke={C.pcs} strokeWidth={1.4}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ ...sp, delay: 0.2 }}
              />
              <motion.text x={240} y={93} textAnchor="middle"
                fontSize={8} fontWeight={700} fill={C.pcs}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.25 }}
              >f(r₁,...,rₙ)</motion.text>
              <motion.text x={240} y={103} textAnchor="middle"
                fontSize={7} fill={C.pcs}
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                transition={{ ...sp, delay: 0.3 }}
              >단일 점</motion.text>

              {/* PCS 화살표 */}
              <motion.line x1={240} y1={113} x2={240} y2={128}
                stroke={C.pcs} strokeWidth={1}
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                transition={{ ...sp, delay: 0.35 }}
              />
              <motion.polygon
                points="240,132 236,126 244,126"
                fill={C.pcs}
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                transition={{ ...sp, delay: 0.35 }}
              />
              <motion.rect x={200} y={132} width={80} height={20} rx={10}
                fill={`${C.pcs}12`} stroke={C.pcs} strokeWidth={1}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.4 }}
              />
              <motion.text x={240} y={145} textAnchor="middle"
                fontSize={9} fontWeight={700} fill={C.pcs}
                initial={{ opacity: 0 }} animate={{ opacity: 0.9 }}
                transition={{ ...sp, delay: 0.45 }}
              >PCS 오라클 검증</motion.text>

              {/* 결과 */}
              <motion.text x={370} y={100} textAnchor="middle"
                fontSize={10} fontWeight={700} fill={C.accent}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}
              >증명 완료</motion.text>
              <motion.text x={370} y={114} textAnchor="middle"
                fontSize={8} fill={C.dim}
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                transition={{ ...sp, delay: 0.55 }}
              >통신량 O(n)</motion.text>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
