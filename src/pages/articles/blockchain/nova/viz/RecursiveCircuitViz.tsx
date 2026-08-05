import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.55 };

const C = {
  input: '#3b82f6',
  hash: '#a855f7',
  nifs: '#10b981',
  step: '#f59e0b',
  output: '#ec4899',
  e1: '#06b6d4',
  e2: '#8b5cf6',
  muted: '#94a3b8',
};

const INPUTS = [
  { id: 'i', label: 'i', sub: 'step counter' },
  { id: 'z0', label: 'z₀', sub: 'IVC init' },
  { id: 'zi', label: 'zᵢ', sub: 'curr input' },
  { id: 'Ui', label: 'Uᵢ', sub: 'accumulator' },
  { id: 'cT', label: 'comm_T', sub: 'NIFS cross' },
];

const STEPS = [
  {
    label: '① 회로 입력 — 5개 공개 IO',
    body:
      'i: 스텝 카운터 / z₀: IVC 초기 입력 / zᵢ: 현재 스텝 입력\n' +
      'Uᵢ: 누적된 Relaxed R1CS 인스턴스 / comm_T: NIFS 가 보낸 교차항 커밋\n' +
      '회로는 이 5개 입력만 받아 다음 스텝의 단일 hash 를 출력한다.',
  },
  {
    label: '② 검증 1 — 일관성 hash 검증',
    body:
      'hash(i, z₀, zᵢ, Uᵢ) == h_in 인지 확인.\n' +
      'h_in 은 이전 스텝 회로가 출력한 hash. 다른 IVC trace 가 섞이는 것 방지.',
  },
  {
    label: '③ 검증 2 — NIFS::verify 회로화',
    body:
      'Random Oracle 로 r squeeze → Uᵢ₊₁ = Uᵢ + r · u₂ (default).\n' +
      'u₂ = 현재 스텝의 표준 R1CS 인스턴스 (자기 자신).\n' +
      'comm_E, comm_W 모두 곡선 점 덧셈/스칼라곱으로 회로 안에서 계산.',
  },
  {
    label: '④ 검증 3 — StepCircuit::synthesize',
    body:
      'z_{i+1} = F(zᵢ).\n' +
      '사용자가 정의한 함수 F 적용 — IVC 의 "유용한 계산" (Lurk REPL, ZKVM cycle, ML inference 등).',
  },
  {
    label: '⑤ 검증 4 — 출력 hash 생성',
    body:
      'h_out = hash(i+1, z₀, z_{i+1}, U_{i+1}).\n' +
      '회로의 단일 public output. 다음 스텝의 h_in 으로 들어가 IVC 체인을 잇는다.',
  },
  {
    label: '⑥ Cycle of curves — E1 ↔ E2 ping-pong',
    body:
      'E1 회로의 산술 필드 = 𝔽_q (E1 스칼라 필드). E1 점 좌표는 𝔽_p (베이스).\n' +
      'E2 의 베이스 = E1 의 스칼라 인 cycle 도입 → E1 ECC 는 E2 회로에서 native.\n' +
      'Pasta(Pallas/Vesta) · Grumpkin(BN254/Grumpkin) · Secp/Secq.',
  },
];

export default function RecursiveCircuitViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="rcArr" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill={C.muted} />
            </marker>
            <marker id="rcArrE1" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill={C.e1} />
            </marker>
            <marker id="rcArrE2" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill={C.e2} />
            </marker>
          </defs>

          {/* 좌측 입력 컬럼 — 모든 step 공통 (step ⑥ 제외) */}
          {step < 5 && (
            <g>
              <text x={56} y={28} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.input}>
                회로 입력
              </text>
              {INPUTS.map((inp, i) => {
                const y = 42 + i * 38;
                const active = step === 0 || (step > 0 && (
                  (step === 1 && ['i', 'z0', 'zi', 'Ui'].includes(inp.id)) ||
                  (step === 2 && ['Ui', 'cT'].includes(inp.id)) ||
                  (step === 3 && inp.id === 'zi') ||
                  (step === 4 && ['i', 'z0'].includes(inp.id))
                ));
                return (
                  <g key={inp.id}>
                    <motion.rect x={16} y={y} width={80} height={30} rx={6}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{
                        opacity: active ? 1 : 0.32,
                        x: 16,
                        fill: `${C.input}${active ? '22' : '08'}`,
                        stroke: C.input,
                        strokeWidth: active ? 1.4 : 0.6,
                      }}
                      transition={{ ...sp, delay: i * 0.06 }} />
                    <motion.text x={56} y={y + 14} textAnchor="middle" fontSize={11} fontWeight={700}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: active ? 1 : 0.4, fill: C.input }}
                      transition={{ delay: i * 0.06 + 0.1 }}>
                      {inp.label}
                    </motion.text>
                    <motion.text x={56} y={y + 25} textAnchor="middle" fontSize={7.5}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: active ? 0.85 : 0.3, fill: C.input }}
                      transition={{ delay: i * 0.06 + 0.15 }}>
                      {inp.sub}
                    </motion.text>
                  </g>
                );
              })}
            </g>
          )}

          {/* ① 입력 5개만 강조 + 회로 윤곽 안내 */}
          {step === 0 && (
            <g>
              <motion.rect x={130} y={42} width={370} height={196} rx={12}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, fill: 'transparent', stroke: C.muted, strokeWidth: 0.8, strokeDasharray: '5 4' }}
                transition={{ delay: 0.4 }} />
              <text x={315} y={60} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.muted}>
                NovaAugmentedCircuit
              </text>
              <text x={315} y={140} textAnchor="middle" fontSize={10} fill={C.muted}>
                4가지 검증을 회로 내부에서 수행
              </text>
              <text x={315} y={158} textAnchor="middle" fontSize={9} fill={C.muted} opacity={0.75}>
                hash check · NIFS::verify · F(zᵢ) · output hash
              </text>
              {INPUTS.map((_, i) => (
                <motion.line key={`a-${i}`}
                  x1={96} y1={57 + i * 38} x2={130} y2={57 + i * 38}
                  stroke={C.input} strokeWidth={0.7} strokeDasharray="2 2"
                  initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.5 + i * 0.05 }} />
              ))}
              <text x={315} y={222} textAnchor="middle" fontSize={9} fill={C.muted}>
                다음 step 부터 각 검증의 데이터 흐름을 drill-down
              </text>
            </g>
          )}

          {/* ② Hash 검증 */}
          {step === 1 && (
            <g>
              <motion.rect x={170} y={86} width={130} height={56} rx={8}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1, fill: `${C.hash}18`, stroke: C.hash, strokeWidth: 1.4 }}
                transition={{ ...sp, delay: 0.3 }} />
              <text x={235} y={108} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.hash}>
                hash(i, z₀, zᵢ, Uᵢ)
              </text>
              <text x={235} y={124} textAnchor="middle" fontSize={9} fill={C.hash} opacity={0.8}>
                Poseidon
              </text>
              <text x={235} y={136} textAnchor="middle" fontSize={8} fill={C.hash} opacity={0.7}>
                in-circuit hash
              </text>

              <motion.line x1={300} y1={114} x2={350} y2={114}
                stroke={C.hash} strokeWidth={1.2} markerEnd="url(#rcArr)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.7 }} />
              <text x={325} y={108} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.hash}>?=</text>

              <motion.rect x={355} y={92} width={130} height={44} rx={8}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1, fill: `${C.hash}10`, stroke: C.hash, strokeWidth: 1.2 }}
                transition={{ ...sp, delay: 0.85 }} />
              <text x={420} y={110} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.hash}>
                h_in
              </text>
              <text x={420} y={124} textAnchor="middle" fontSize={8} fill={C.hash} opacity={0.75}>
                from prev step
              </text>

              <motion.rect x={170} y={184} width={310} height={36} rx={6}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, fill: `${C.hash}06`, stroke: C.hash, strokeWidth: 0.8, strokeDasharray: '4 3' }}
                transition={{ delay: 1.05 }} />
              <text x={325} y={200} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.hash}>
                일관성 검사 — 다른 IVC trace 차단
              </text>
              <text x={325} y={213} textAnchor="middle" fontSize={8} fill={C.hash} opacity={0.75}>
                해시가 어긋나면 회로 자체가 satisfy 불가
              </text>
            </g>
          )}

          {/* ③ NIFS::verify */}
          {step === 2 && (
            <g>
              <motion.rect x={170} y={56} width={150} height={42} rx={6}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1, fill: `${C.nifs}15`, stroke: C.nifs, strokeWidth: 1.2 }}
                transition={{ ...sp, delay: 0.3 }} />
              <text x={245} y={74} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.nifs}>
                Random Oracle
              </text>
              <text x={245} y={88} textAnchor="middle" fontSize={8} fill={C.nifs} opacity={0.8}>
                absorb(comm_T) · squeeze
              </text>

              <motion.line x1={320} y1={77} x2={360} y2={77}
                stroke={C.nifs} strokeWidth={1} markerEnd="url(#rcArr)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.65 }} />
              <motion.circle cx={385} cy={77} r={18}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1, fill: `${C.nifs}28`, stroke: C.nifs, strokeWidth: 1.4 }}
                transition={{ ...sp, delay: 0.75 }} />
              <text x={385} y={81} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.nifs}>r</text>

              <motion.rect x={170} y={120} width={310} height={56} rx={8}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, fill: `${C.nifs}10`, stroke: C.nifs, strokeWidth: 1.4 }}
                transition={{ ...sp, delay: 1.0 }} />
              <text x={325} y={140} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.nifs}>
                Uᵢ₊₁ = Uᵢ + r · u₂
              </text>
              <text x={325} y={154} textAnchor="middle" fontSize={8} fill={C.nifs} opacity={0.85}>
                comm_W' = comm_Wᵢ + r · comm_W₂
              </text>
              <text x={325} y={166} textAnchor="middle" fontSize={8} fill={C.nifs} opacity={0.85}>
                comm_E' = comm_Eᵢ + r · comm_T  (E₂ = 0)
              </text>

              <motion.rect x={170} y={196} width={310} height={32} rx={6}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, fill: `${C.nifs}06`, stroke: C.nifs, strokeWidth: 0.8, strokeDasharray: '4 3' }}
                transition={{ delay: 1.3 }} />
              <text x={325} y={216} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.nifs}>
                ECC 점 덧셈/스칼라곱 → cycle of curves 필요 (step ⑥)
              </text>
            </g>
          )}

          {/* ④ StepCircuit F(zᵢ) */}
          {step === 3 && (
            <g>
              <motion.line x1={96} y1={114} x2={210} y2={134}
                stroke={C.step} strokeWidth={1} markerEnd="url(#rcArr)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.4 }} />

              <motion.rect x={210} y={104} width={150} height={64} rx={10}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1, fill: `${C.step}1c`, stroke: C.step, strokeWidth: 1.6 }}
                transition={{ ...sp, delay: 0.5 }} />
              <text x={285} y={128} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.step}>
                F(zᵢ)
              </text>
              <text x={285} y={144} textAnchor="middle" fontSize={9} fill={C.step} opacity={0.8}>
                StepCircuit::synthesize
              </text>
              <text x={285} y={158} textAnchor="middle" fontSize={8} fill={C.step} opacity={0.7}>
                user-defined function
              </text>

              <motion.line x1={360} y1={136} x2={400} y2={136}
                stroke={C.step} strokeWidth={1.2} markerEnd="url(#rcArr)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 1.0 }} />

              <motion.rect x={405} y={114} width={86} height={44} rx={8}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1, fill: `${C.step}28`, stroke: C.step, strokeWidth: 1.4 }}
                transition={{ ...sp, delay: 1.1 }} />
              <text x={448} y={134} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.step}>
                z_{'{i+1}'}
              </text>
              <text x={448} y={148} textAnchor="middle" fontSize={8} fill={C.step} opacity={0.75}>
                next state
              </text>

              <text x={325} y={200} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.step}>
                예시 F: Lurk REPL · ZKVM cycle · ML inference
              </text>
              <text x={325} y={214} textAnchor="middle" fontSize={8} fill={C.step} opacity={0.75}>
                회로 크기의 사용자 부분 (1K ~ 100K 제약)
              </text>
            </g>
          )}

          {/* ⑤ Output hash */}
          {step === 4 && (
            <g>
              {[
                { lbl: 'i+1', col: C.input },
                { lbl: 'z₀', col: C.input },
                { lbl: 'z_{i+1}', col: C.step },
                { lbl: 'U_{i+1}', col: C.nifs },
              ].map((d, i) => (
                <g key={`oh-${i}`}>
                  <motion.rect x={140} y={56 + i * 32} width={70} height={24} rx={5}
                    initial={{ opacity: 0, x: 110 }}
                    animate={{ opacity: 1, x: 140, fill: `${d.col}1c`, stroke: d.col, strokeWidth: 1 }}
                    transition={{ ...sp, delay: 0.2 + i * 0.08 }} />
                  <text x={175} y={71 + i * 32} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={d.col}>
                    {d.lbl}
                  </text>
                  <motion.line x1={210} y1={68 + i * 32} x2={258} y2={138}
                    stroke={C.output} strokeWidth={0.7}
                    initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
                    transition={{ delay: 0.55 + i * 0.06 }} />
                </g>
              ))}

              <motion.rect x={258} y={114} width={120} height={52} rx={8}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1, fill: `${C.output}1c`, stroke: C.output, strokeWidth: 1.4 }}
                transition={{ ...sp, delay: 0.85 }} />
              <text x={318} y={134} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.output}>
                hash(·)
              </text>
              <text x={318} y={148} textAnchor="middle" fontSize={8} fill={C.output} opacity={0.8}>
                Poseidon
              </text>
              <text x={318} y={160} textAnchor="middle" fontSize={8} fill={C.output} opacity={0.7}>
                in-circuit
              </text>

              <motion.line x1={378} y1={140} x2={418} y2={140}
                stroke={C.output} strokeWidth={1.2} markerEnd="url(#rcArr)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 1.2 }} />

              <motion.rect x={420} y={116} width={84} height={48} rx={8}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1, fill: `${C.output}28`, stroke: C.output, strokeWidth: 1.6 }}
                transition={{ ...sp, delay: 1.3 }} />
              <text x={462} y={138} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.output}>
                h_out
              </text>
              <text x={462} y={154} textAnchor="middle" fontSize={8} fill={C.output} opacity={0.8}>
                public output
              </text>

              <motion.path
                d="M 462 164 Q 462 230 200 230 Q 50 230 50 70"
                fill="none" stroke={C.output} strokeWidth={0.9} strokeDasharray="4 3"
                markerEnd="url(#rcArr)"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 0.55, pathLength: 1 }}
                transition={{ duration: 0.9, delay: 1.55 }} />
              <text x={260} y={246} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.output}>
                h_out → 다음 스텝의 h_in (IVC 체인의 고리)
              </text>
            </g>
          )}

          {/* ⑥ Cycle of curves */}
          {step === 5 && (
            <g>
              <text x={260} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.muted}>
                Cycle of Curves — E1 ↔ E2 ping-pong
              </text>

              {/* E1 회로 */}
              <motion.rect x={40} y={56} width={170} height={130} rx={12}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1, fill: `${C.e1}10`, stroke: C.e1, strokeWidth: 1.5 }}
                transition={{ ...sp, delay: 0.2 }} />
              <text x={125} y={76} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.e1}>
                E1 회로 (Pallas)
              </text>
              <text x={125} y={90} textAnchor="middle" fontSize={8} fill={C.e1} opacity={0.75}>
                arithmetic field 𝔽_q
              </text>
              <motion.rect x={56} y={102} width={138} height={36} rx={6}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, fill: `${C.e2}1a`, stroke: C.e2, strokeWidth: 1, strokeDasharray: '3 2' }}
                transition={{ ...sp, delay: 0.45 }} />
              <text x={125} y={120} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.e2}>
                E2 ECC native
              </text>
              <text x={125} y={132} textAnchor="middle" fontSize={7.5} fill={C.e2} opacity={0.85}>
                E2 점 좌표 ∈ 𝔽_q
              </text>
              <text x={125} y={156} textAnchor="middle" fontSize={8} fill={C.e1} opacity={0.7}>
                E1 점 자체 연산은 비싸다
              </text>

              {/* E2 회로 */}
              <motion.rect x={310} y={56} width={170} height={130} rx={12}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1, fill: `${C.e2}10`, stroke: C.e2, strokeWidth: 1.5 }}
                transition={{ ...sp, delay: 0.35 }} />
              <text x={395} y={76} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.e2}>
                E2 회로 (Vesta)
              </text>
              <text x={395} y={90} textAnchor="middle" fontSize={8} fill={C.e2} opacity={0.75}>
                arithmetic field 𝔽_p
              </text>
              <motion.rect x={326} y={102} width={138} height={36} rx={6}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, fill: `${C.e1}1a`, stroke: C.e1, strokeWidth: 1, strokeDasharray: '3 2' }}
                transition={{ ...sp, delay: 0.6 }} />
              <text x={395} y={120} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.e1}>
                E1 ECC native
              </text>
              <text x={395} y={132} textAnchor="middle" fontSize={7.5} fill={C.e1} opacity={0.85}>
                E1 점 좌표 ∈ 𝔽_p
              </text>
              <text x={395} y={156} textAnchor="middle" fontSize={8} fill={C.e2} opacity={0.7}>
                E2 점 자체 연산은 비싸다
              </text>

              {/* Ping-pong 화살표 */}
              <motion.path
                d="M 210 100 C 250 80 270 80 310 100"
                fill="none" stroke={C.e1} strokeWidth={1.4}
                markerEnd="url(#rcArrE1)"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 0.9, pathLength: 1 }}
                transition={{ duration: 0.7, delay: 0.85 }} />
              <text x={260} y={78} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.e1}>
                E1 점 → E2 회로
              </text>

              <motion.path
                d="M 310 150 C 270 170 250 170 210 150"
                fill="none" stroke={C.e2} strokeWidth={1.4}
                markerEnd="url(#rcArrE2)"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 0.9, pathLength: 1 }}
                transition={{ duration: 0.7, delay: 1.05 }} />
              <text x={260} y={172} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.e2}>
                E2 점 → E1 회로
              </text>

              {/* Cycle 종류 */}
              <motion.rect x={40} y={202} width={440} height={48} rx={8}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, fill: `${C.muted}10`, stroke: C.muted, strokeWidth: 0.8, strokeDasharray: '4 3' }}
                transition={{ delay: 1.3 }} />
              <text x={260} y={220} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
                Pasta (Pallas/Vesta) · Grumpkin (BN254/Grumpkin) · Secp/Secq
              </text>
              <text x={260} y={234} textAnchor="middle" fontSize={8} fill={C.muted}>
                EVM verifier 호환은 Grumpkin · EOA 키 호환은 Secp/Secq
              </text>
              <text x={260} y={246} textAnchor="middle" fontSize={8} fill={C.muted} opacity={0.75}>
                두 회로가 서로의 ECC 를 native 로 실행 → boilerplate ~20K 제약
              </text>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
