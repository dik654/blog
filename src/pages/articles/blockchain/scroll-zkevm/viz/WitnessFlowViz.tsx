import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ModuleBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.55 };

const C = {
  geth: '#3b82f6',
  builder: '#10b981',
  block: '#f59e0b',
  circuit: '#a855f7',
  public: '#06b6d4',
  witness: '#ec4899',
  constraint: '#10b981',
};

const STEPS = [
  {
    label: '① 시작 — 이더리움 블록 (Tx 들) 입력',
    body: '블록에 담긴 트랜잭션 묶음을 Geth EVM 으로 실행.\n각 Tx 의 opcode·stack·storage·gas 흐름을 모두 따라가야 zk 증명을 만들 수 있다.',
  },
  {
    label: '② Stage 1 — Geth 트레이스 수집',
    body: 'GethExecTrace { gas, failed, return_value, struct_logs: Vec<GethExecStep> }.\nstruct_logs 가 step 단위로 쌓이면서 실행 스냅샷을 기록 — pc, op, gas, depth, stack, memory.',
  },
  {
    label: '③ Stage 2 — CircuitInputBuilder 변환',
    body: '트레이스를 회로 친화적 구조로 재배치.\nsdb (StateDB · 계정/스토리지 상태) + code_db (CodeDB · 컨트랙트 코드) + block (Blocks · tx/exec/RW 모음).',
  },
  {
    label: '④ Stage 3 — block_convert() 로 Block 구조체 합성',
    body: 'RW 연산 맵, 트랜잭션, ExecStep 시퀀스, MPT 업데이트, 수집된 Bytecode 가 한 객체에 모임.\n이 Block 이 모든 서브회로의 단일 입력 소스.',
  },
  {
    label: '⑤ Stage 4 — 회로별 Witness fan-out 분배',
    body: 'Block → EVM / State / Bytecode / Keccak / MPT … 각 서브회로가 필요한 컬럼만 뽑아 자신의 셀에 채움.\n같은 데이터가 여러 회로에서 lookup 으로 cross-reference 됨.',
  },
  {
    label: '⑥ Witness vs Public vs Constraint + 스케일',
    body: 'Public (모두 봄) · Witness (Prover 전용) · Constraint (회로 자체 · 고정 공개).\n100 tx 한 블록 ≈ witness 10–50 MB, prover RAM 수십 GB → lazy gen / streaming / GPU MSM 으로 완화.',
  },
];

export default function WitnessFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="wfArr" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#94a3b8" />
            </marker>
            <marker id="wfArrG" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill={C.geth} />
            </marker>
            <marker id="wfArrC" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill={C.circuit} />
            </marker>
          </defs>

          {/* ① 입력 — 이더리움 블록 → Geth EVM */}
          {step === 0 && (
            <g>
              <text x={260} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.geth}>
                Ethereum Block (Tx 들) → Geth EVM 실행
              </text>
              {/* Block container */}
              <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <ModuleBox x={30} y={80} w={150} h={130} label="Block #N" sub="100 tx · header + body" color={C.geth} />
              </motion.g>
              {/* Tx pills inside block */}
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.25 + i * 0.08 }}>
                  <rect x={45} y={108 + i * 18} width={120} height={13} rx={3}
                    fill={`${C.geth}18`} stroke={C.geth} strokeWidth={0.6} />
                  <text x={105} y={118 + i * 18} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={C.geth}>
                    {i < 4 ? `tx${i}: transfer / call / deploy` : '⋯ 95 more tx'}
                  </text>
                </motion.g>
              ))}
              {/* arrow → Geth EVM */}
              <motion.line x1={185} y1={145} x2={278} y2={145}
                stroke={C.geth} strokeWidth={1.4} markerEnd="url(#wfArrG)"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 0.85, pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }} />
              <motion.text x={232} y={138} textAnchor="middle" fontSize={8} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.geth }} transition={{ delay: 1.0 }}>
                feed
              </motion.text>
              {/* Geth EVM */}
              <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 1.1 }}>
                <ActionBox x={280} y={115} w={210} h={60} label="Geth EVM (re-execute)" sub="opcode by opcode · state diff" color={C.geth} />
              </motion.g>
              <text x={260} y={250} textAnchor="middle" fontSize={8} fill="#64748b">
                zkEVM 은 합의 노드와 동일하게 모든 Tx 를 다시 실행 — 그 흐름을 trace 로 떠 회로 입력으로 만든다
              </text>
            </g>
          )}

          {/* ② Geth 트레이스 수집 */}
          {step === 1 && (
            <g>
              <text x={260} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.geth}>
                GethExecTrace — struct_logs 가 step 별 상태를 기록
              </text>
              {/* EVM source */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <ActionBox x={20} y={70} w={130} h={50} label="Geth EVM" sub="step interpreter" color={C.geth} />
              </motion.g>
              {/* arrow → trace container */}
              <motion.line x1={152} y1={95} x2={188} y2={95}
                stroke={C.geth} strokeWidth={1.2} markerEnd="url(#wfArrG)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.4 }} />
              {/* GethExecTrace container */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <ModuleBox x={190} y={60} w={300} h={80} label="GethExecTrace" sub="gas · failed · return_value · struct_logs[]" color={C.geth} />
              </motion.g>
              {/* struct_logs stack accumulating */}
              <text x={340} y={158} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.geth}>
                struct_logs : Vec&lt;GethExecStep&gt;
              </text>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <motion.rect key={i}
                  x={210 + (i % 7) * 38} y={170}
                  width={34} height={14} rx={2}
                  initial={{ opacity: 0, y: 200, scaleY: 0.4 }}
                  animate={{ opacity: 1, y: 170, scaleY: 1, fill: `${C.geth}25`, stroke: C.geth, strokeWidth: 0.6 }}
                  transition={{ ...sp, delay: 0.7 + i * 0.1 }}
                  style={{ transformOrigin: 'center' }} />
              ))}
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <motion.text key={`t${i}`}
                  x={227 + i * 38} y={180}
                  textAnchor="middle" fontSize={7} fontWeight={600}
                  initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.geth }}
                  transition={{ delay: 0.85 + i * 0.1 }}>
                  step{i}
                </motion.text>
              ))}
              {/* one expanded GethExecStep */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
                <rect x={60} y={200} width={400} height={56} rx={6}
                  fill={`${C.geth}08`} stroke={C.geth} strokeWidth={0.7} />
                <text x={260} y={216} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={C.geth}>
                  GethExecStep 한 칸
                </text>
                <text x={260} y={230} textAnchor="middle" fontSize={7.5} fill="#64748b">
                  pc · op (ADD/MSTORE/…) · gas · gas_cost · depth · refund
                </text>
                <text x={260} y={244} textAnchor="middle" fontSize={7.5} fill="#64748b">
                  stack[] · memory[] · storage{'{}'} · returnData
                </text>
              </motion.g>
            </g>
          )}

          {/* ③ CircuitInputBuilder — sdb / code_db / block */}
          {step === 2 && (
            <g>
              <text x={260} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.builder}>
                CircuitInputBuilder — trace → (sdb, code_db, block)
              </text>
              {/* input */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <DataBox x={20} y={120} w={120} h={36} label="GethExecTrace" sub="step 들" color={C.geth} outlined />
              </motion.g>
              {/* builder */}
              <motion.line x1={142} y1={138} x2={178} y2={138}
                stroke="#94a3b8" strokeWidth={1} markerEnd="url(#wfArr)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.3 }} />
              <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <ActionBox x={180} y={112} w={130} h={52} label="CircuitInputBuilder" sub="trace 재배치" color={C.builder} />
              </motion.g>
              {/* fan-out to 3 */}
              {[
                { y: 60, label: 'sdb', sub: 'StateDB · 계정/스토리지' },
                { y: 120, label: 'code_db', sub: 'CodeDB · 컨트랙트 bytecode' },
                { y: 180, label: 'block', sub: 'Blocks · tx/exec/RW' },
              ].map((b, i) => (
                <g key={b.label}>
                  <motion.line
                    x1={312} y1={138}
                    x2={362} y2={b.y + 18}
                    stroke={C.builder} strokeWidth={1} markerEnd="url(#wfArr)"
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 0.7, pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.95 + i * 0.12 }} />
                  <motion.g
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...sp, delay: 1.1 + i * 0.12 }}>
                    <DataBox x={364} y={b.y} w={140} h={36} label={b.label} sub={b.sub} color={C.builder} outlined />
                  </motion.g>
                </g>
              ))}
              <text x={260} y={250} textAnchor="middle" fontSize={8} fill="#64748b">
                같은 trace 를 3 종 인덱스로 분할 — 회로가 빠르게 lookup 할 수 있도록
              </text>
            </g>
          )}

          {/* ④ Block 구조체 — 4 컴포넌트 합성 */}
          {step === 3 && (
            <g>
              <text x={260} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.block}>
                block_convert() — RW · Tx · ExecSteps · MPT 가 한 Block 으로
              </text>
              {/* 4 inputs around the center */}
              {[
                { x: 30, y: 60, label: 'RW Map', sub: 'rws: RwMap' },
                { x: 360, y: 60, label: 'Transactions', sub: 'txs: Vec<Tx>' },
                { x: 30, y: 200, label: 'ExecSteps', sub: 'execution_steps[]' },
                { x: 360, y: 200, label: 'MPT updates', sub: 'mpt_updates' },
              ].map((b, i) => (
                <motion.g key={b.label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...sp, delay: 0.1 + i * 0.1 }}>
                  <DataBox x={b.x} y={b.y} w={130} h={36} label={b.label} sub={b.sub} color={C.block} outlined />
                </motion.g>
              ))}
              {/* center Block */}
              <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.7 }}>
                <ModuleBox x={195} y={115} w={130} h={70} label="Block" sub="중앙 witness 저장소" color={C.block} />
              </motion.g>
              {/* arrows from each input toward Block */}
              {[
                { x1: 95, y1: 96, x2: 200, y2: 130 },
                { x1: 425, y1: 96, x2: 320, y2: 130 },
                { x1: 95, y1: 200, x2: 200, y2: 175 },
                { x1: 425, y1: 200, x2: 320, y2: 175 },
              ].map((a, i) => (
                <motion.line key={i}
                  x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
                  stroke={C.block} strokeWidth={1} markerEnd="url(#wfArr)"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 0.65, pathLength: 1 }}
                  transition={{ duration: 0.45, delay: 0.85 + i * 0.08 }} />
              ))}
              {/* extra: bytecode collection */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                <rect x={60} y={250} width={400} height={20} rx={4}
                  fill={`${C.block}10`} stroke={C.block} strokeWidth={0.7} strokeDasharray="3 3" />
                <text x={260} y={263} textAnchor="middle" fontSize={8} fill={C.block} fontWeight={600}>
                  + bytecodes · copy_events · sha3_inputs · circuits_params 모두 포함
                </text>
              </motion.g>
            </g>
          )}

          {/* ⑤ 회로별 fan-out — Block → 5 회로 */}
          {step === 4 && (
            <g>
              <text x={260} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.circuit}>
                Block witness fan-out → 5 sub-circuits
              </text>
              {/* source Block */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <ModuleBox x={20} y={110} w={120} h={70} label="Block" sub="단일 witness 소스" color={C.block} />
              </motion.g>
              {/* 5 circuits on the right */}
              {[
                { y: 50, label: 'EVM Circuit', sub: 'opcode 실행 검증' },
                { y: 96, label: 'State Circuit', sub: 'RW 일관성' },
                { y: 142, label: 'Bytecode Circuit', sub: 'code lookup' },
                { y: 188, label: 'Keccak Circuit', sub: 'hash 검증' },
                { y: 234, label: 'MPT Circuit', sub: 'state root 갱신' },
              ].map((c, i) => (
                <g key={c.label}>
                  <motion.line
                    x1={142} y1={145}
                    x2={328} y2={c.y + 16}
                    stroke={C.circuit} strokeWidth={0.9} markerEnd="url(#wfArrC)"
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 0.65, pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }} />
                  <motion.g
                    initial={{ opacity: 0, x: 14, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ ...sp, delay: 0.55 + i * 0.1 }}>
                    <DataBox x={330} y={c.y} w={170} h={32} label={c.label} sub={c.sub} color={C.circuit} outlined />
                  </motion.g>
                </g>
              ))}
              {/* moving witness particles */}
              {[0, 1, 2].map((i) => (
                <motion.circle key={i}
                  r={2.6} fill={C.circuit}
                  initial={{ opacity: 0, cx: 142, cy: 145 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    cx: [142, 240, 330],
                    cy: [145, 145 - 30 + i * 30, 145 - 50 + i * 50],
                  }}
                  transition={{ duration: 1.4, delay: 1.0 + i * 0.2, repeat: Infinity, repeatDelay: 1.0 }} />
              ))}
            </g>
          )}

          {/* ⑥ Witness vs Public vs Constraint + 스케일 */}
          {step === 5 && (
            <g>
              <text x={260} y={24} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.witness}>
                Public · Witness · Constraint — 누가 무엇을 보는가
              </text>
              {/* 3 boxes side by side */}
              {[
                { x: 18, color: C.public, label: 'Public Input', who: '모두 볼 수 있음',
                  items: ['block number, ts', 'prev / new state root', 'tx · receipt root'] },
                { x: 178, color: C.witness, label: 'Witness', who: 'Prover 만 보유',
                  items: ['opcode 세부 실행', 'stack/mem/storage 중간', 'carry · remainder 등'] },
                { x: 338, color: C.constraint, label: 'Constraint', who: '회로 자체 (고정 공개)',
                  items: ['제약식 — 누구나 검증', 'witness 만족 게임', 'private comp · public verify'] },
              ].map((b, i) => (
                <motion.g key={b.label}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.1 + i * 0.12 }}>
                  <rect x={b.x} y={42} width={156} height={108} rx={8}
                    fill={`${b.color}10`} stroke={b.color} strokeWidth={1} />
                  <text x={b.x + 78} y={60} textAnchor="middle" fontSize={10} fontWeight={700} fill={b.color}>
                    {b.label}
                  </text>
                  <text x={b.x + 78} y={73} textAnchor="middle" fontSize={7.5} fill={b.color} opacity={0.75}>
                    {b.who}
                  </text>
                  {b.items.map((t, k) => (
                    <text key={k} x={b.x + 8} y={92 + k * 15} fontSize={7.5} fill="#475569">
                      • {t}
                    </text>
                  ))}
                </motion.g>
              ))}
              {/* scale chart */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <text x={260} y={172} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.witness}>
                  zkEVM 스케일 (1 블록 ≈ 100 tx)
                </text>
                {/* axis */}
                <line x1={130} y1={258} x2={420} y2={258} stroke="#94a3b8" strokeWidth={0.6} />
                {/* witness bar */}
                <text x={120} y={196} textAnchor="end" fontSize={8} fontWeight={600} fill={C.witness}>witness</text>
                <motion.rect
                  x={130} y={188} height={14} rx={2}
                  initial={{ width: 0 }} animate={{ width: 80 }}
                  transition={{ duration: 0.6, delay: 0.85 }}
                  fill={`${C.witness}40`} stroke={C.witness} strokeWidth={0.7} />
                <text x={216} y={199} fontSize={8} fontWeight={600} fill={C.witness}>10–50 MB</text>
                {/* prover memory bar */}
                <text x={120} y={221} textAnchor="end" fontSize={8} fontWeight={600} fill={C.circuit}>prover RAM</text>
                <motion.rect
                  x={130} y={213} height={14} rx={2}
                  initial={{ width: 0 }} animate={{ width: 280 }}
                  transition={{ duration: 0.7, delay: 1.0 }}
                  fill={`${C.circuit}40`} stroke={C.circuit} strokeWidth={0.7} />
                <text x={416} y={224} fontSize={8} fontWeight={600} fill={C.circuit} textAnchor="end">수십 GB</text>
                {/* proof bar */}
                <text x={120} y={246} textAnchor="end" fontSize={8} fontWeight={600} fill={C.public}>proof</text>
                <motion.rect
                  x={130} y={238} height={14} rx={2}
                  initial={{ width: 0 }} animate={{ width: 6 }}
                  transition={{ duration: 0.5, delay: 1.15 }}
                  fill={`${C.public}40`} stroke={C.public} strokeWidth={0.7} />
                <text x={144} y={249} fontSize={8} fontWeight={600} fill={C.public}>~수 KB (상수)</text>
              </motion.g>
              {/* optimization callout */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
                <AlertBox x={140} y={264} w={260} h={14} label="lazy gen · streaming · GPU MSM" color={C.witness} />
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
