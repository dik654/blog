import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ModuleBox, ActionBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.6 };

const C = {
  ptau: '#3b82f6',
  zkey: '#10b981',
  vkey: '#84cc16',
  witness: '#f59e0b',
  proof: '#ec4899',
  verify: '#06b6d4',
  mpc: '#8b5cf6',
};

const STEPS = [
  {
    label: '① Powers of Tau — MPC 세레모니',
    body: 'newAccumulator("bn128", 12, "pot.ptau") 로 빈 accumulator 생성.\n여러 참가자가 무작위성 τ 를 릴레이하며 기여 → 1명이라도 정직하면 안전.\npreparePhase2 후 pot_final.ptau 완성 (회로-무관 범용 셋업).',
  },
  {
    label: '② 회로별 키 생성 (zKey)',
    body: 'newZKey(r1cs, pot_final.ptau, zkey) → circuit.zkey (~100MB).\nexportVerificationKey(zkey) → vKey (~1KB, Solidity 내장 가능).\n.zkey: Alpha/Beta/Gamma/Delta + A/B/C 다항식 + H. vkey: 4 그룹원소 + IC[].',
  },
  {
    label: '③ 증인 계산 (WASM)',
    body: 'WitnessCalculatorBuilder(wasmBuffer) 로 계산기 생성.\ncalculateWitness(input) → witness.wtns (모든 내부 시그널 할당값).\n입력 JSON 은 BigNumber 문자열, 회로 시그널 이름과 정확히 일치해야.',
  },
  {
    label: '④ Prove — groth16.prove',
    body: 'groth16.prove(zkey, witness) → { proof, publicSignals }.\nproof = 3 그룹 원소 (~192 bytes, A/B/C).\nsnarkjs(JS/WASM) ~60s, rapidSnark(C++) ~5-10s, GPU <1s (1M 제약).',
  },
  {
    label: '⑤ Verify — 페어링 검증',
    body: 'groth16.verify(vKey, publicSignals, proof) → valid : boolean.\n3 페어링 체크: e(A,B) = e(α,β)·e(Σ, γ)·e(C, δ).\n온체인: EIP-196/197 프리컴파일, ~200K gas.',
  },
];

export default function SnarkjsWorkflowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrW" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#94a3b8" />
            </marker>
            <marker id="arrMPC" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill={C.mpc} />
            </marker>
            <marker id="arrV" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill={C.verify} />
            </marker>
          </defs>

          {/* ① Powers of Tau — MPC relay animation */}
          {step === 0 && (
            <g>
              <text x={240} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.mpc}>
                Powers of Tau MPC — pot.ptau 릴레이 기여
              </text>
              {/* 3 participants */}
              {[0, 1, 2].map((i) => {
                const x = 40 + i * 140;
                return (
                  <g key={i}>
                    <motion.circle cx={x + 40} cy={80} r={22}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1, fill: `${C.mpc}18`, stroke: C.mpc, strokeWidth: 1.3 }}
                      transition={{ ...sp, delay: i * 0.15 }} />
                    <text x={x + 40} y={78} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.mpc}>
                      P{i + 1}
                    </text>
                    <text x={x + 40} y={90} textAnchor="middle" fontSize={7.5} fill={C.mpc} opacity={0.8}>
                      τ{i + 1}
                    </text>
                    <text x={x + 40} y={116} textAnchor="middle" fontSize={8} fill="#64748b">
                      참가자 {i + 1}
                    </text>
                  </g>
                );
              })}
              {/* relay arrows pot{n}.ptau */}
              {[0, 1].map((i) => {
                const x1 = 40 + i * 140 + 62;
                const x2 = 40 + (i + 1) * 140 + 18;
                return (
                  <g key={`r-${i}`}>
                    <motion.line x1={x1} y1={80} x2={x2} y2={80}
                      stroke={C.mpc} strokeWidth={1.2} markerEnd="url(#arrMPC)"
                      initial={{ opacity: 0, pathLength: 0 }}
                      animate={{ opacity: 0.85, pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.4 }} />
                    <motion.text x={(x1 + x2) / 2} y={72} textAnchor="middle" fontSize={7.5} fontWeight={600}
                      initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.mpc }}
                      transition={{ delay: 0.7 + i * 0.4 }}>
                      pot{i + 1}.ptau
                    </motion.text>
                  </g>
                );
              })}
              {/* initial accumulator */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <DataBox x={20} y={150} w={90} h={30} label="pot.ptau" sub='newAccumulator("bn128",12)' color={C.mpc} outlined />
              </motion.g>
              {/* preparePhase2 arrow */}
              <motion.line x1={120} y1={165} x2={180} y2={165}
                stroke={C.mpc} strokeWidth={1.2} markerEnd="url(#arrMPC)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 1.5 }} />
              <motion.text x={150} y={158} textAnchor="middle" fontSize={7.5} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.mpc }} transition={{ delay: 1.6 }}>
                preparePhase2
              </motion.text>
              {/* pot_final */}
              <motion.g initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 1.7 }}>
                <DataBox x={190} y={150} w={110} h={30} label="pot_final.ptau" sub="범용 셋업" color={C.ptau} outlined />
              </motion.g>
              <motion.text x={380} y={168} textAnchor="middle" fontSize={8.5} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.mpc }}
                transition={{ delay: 2.0 }}>
                1명만 정직해도 안전
              </motion.text>
              <text x={240} y={216} textAnchor="middle" fontSize={8} fill="#64748b">
                Perpetual PoT (50+), Zcash Phase1 (87), Hermez Phase2 (36 참가자)
              </text>
            </g>
          )}

          {/* ② zKey 생성 — r1cs + pot_final → zkey → vkey 분리 */}
          {step === 1 && (
            <g>
              <text x={240} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.zkey}>
                newZKey — r1cs + pot_final → zkey → vkey 분리
              </text>
              <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <DataBox x={20} y={60} w={90} h={32} label=".r1cs" sub="회로 제약" color="#6366f1" outlined />
              </motion.g>
              <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.1 }}>
                <DataBox x={20} y={108} w={90} h={32} label="pot_final.ptau" sub="Phase 1 결과" color={C.ptau} outlined />
              </motion.g>
              {/* arrows into zKey action */}
              <motion.line x1={112} y1={76} x2={160} y2={96} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#arrW)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.4 }} />
              <motion.line x1={112} y1={124} x2={160} y2={104} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#arrW)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.45 }} />
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <ActionBox x={162} y={78} w={100} h={44} label="newZKey" sub="Phase 2 셋업" color={C.zkey} />
              </motion.g>
              {/* zkey output */}
              <motion.line x1={264} y1={100} x2={300} y2={100} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#arrW)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.9 }} />
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 1.0 }}>
                <DataBox x={302} y={76} w={140} h={48} label="circuit.zkey" sub="~100MB · 증명 키" color={C.zkey} outlined />
              </motion.g>
              {/* exportVerificationKey */}
              <motion.line x1={372} y1={128} x2={372} y2={158} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#arrW)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1.4 }} />
              <motion.text x={412} y={148} textAnchor="middle" fontSize={7.5} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.vkey }} transition={{ delay: 1.5 }}>
                exportVKey
              </motion.text>
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 1.6 }}>
                <DataBox x={302} y={160} w={140} h={36} label="vKey" sub="~1KB · 검증 키" color={C.vkey} outlined />
              </motion.g>
              {/* key internals hint */}
              <motion.text x={130} y={172} textAnchor="middle" fontSize={8} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.zkey }} transition={{ delay: 1.2 }}>
                zkey = α·β·γ·δ + A/B/C poly + H
              </motion.text>
              <motion.text x={130} y={188} textAnchor="middle" fontSize={8} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.vkey }} transition={{ delay: 1.7 }}>
                vKey = α·β·γ·δ + IC[]
              </motion.text>
              <text x={240} y={222} textAnchor="middle" fontSize={8} fill="#64748b">
                .zkey 는 Prover 용 (대용량), vKey 는 Solidity verifier 에 내장
              </text>
            </g>
          )}

          {/* ③ Witness 계산 */}
          {step === 2 && (
            <g>
              <text x={240} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.witness}>
                WitnessCalculator — wasm + input → witness.wtns
              </text>
              <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <DataBox x={20} y={60} w={90} h={32} label="circuit.wasm" sub="컴파일 결과" color="#6366f1" outlined />
              </motion.g>
              <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.1 }}>
                <DataBox x={20} y={108} w={90} h={32} label="input.json" sub='{"in":[...]}' color={C.witness} outlined />
              </motion.g>
              <motion.line x1={112} y1={76} x2={158} y2={96} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#arrW)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.4 }} />
              <motion.line x1={112} y1={124} x2={158} y2={104} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#arrW)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.45 }} />
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <ModuleBox x={160} y={70} w={130} h={60} label="WitnessCalculator" sub="calculateWitness(input)" color={C.witness} />
              </motion.g>
              {/* signal bars */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.rect key={i} x={180 + i * 18} y={100} width={12} height={18} rx={1.5}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1, fill: `${C.witness}30`, stroke: C.witness, strokeWidth: 0.7 }}
                  transition={{ ...sp, delay: 0.8 + i * 0.06 }}
                  style={{ transformOrigin: `${186 + i * 18}px 118px` }} />
              ))}
              <motion.line x1={292} y1={100} x2={328} y2={100} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#arrW)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1.3 }} />
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 1.4 }}>
                <DataBox x={330} y={76} w={130} h={48} label="witness.wtns" sub="모든 시그널 할당" color={C.witness} outlined />
              </motion.g>
              <text x={240} y={172} textAnchor="middle" fontSize={9} fill={C.witness}>
                내부 시그널 모두 평가 → 모든 제약 R1CS 만족 확인 가능
              </text>
              <text x={240} y={192} textAnchor="middle" fontSize={8} fill="#64748b">
                BigNumber 문자열, 시그널 이름 일치 필수. snarkjs wtns check 로 검증
              </text>
              <text x={240} y={214} textAnchor="middle" fontSize={8} fill="#64748b">
                WASM 실행이므로 브라우저/Node 양쪽 동작
              </text>
            </g>
          )}

          {/* ④ Prove */}
          {step === 3 && (
            <g>
              <text x={240} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.proof}>
                groth16.prove(zkey, witness) → {'{'} proof, publicSignals {'}'}
              </text>
              <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <DataBox x={20} y={60} w={110} h={32} label="circuit.zkey" sub="~100MB" color={C.zkey} outlined />
              </motion.g>
              <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.1 }}>
                <DataBox x={20} y={108} w={110} h={32} label="witness.wtns" sub="R1CS 해" color={C.witness} outlined />
              </motion.g>
              <motion.line x1={132} y1={76} x2={178} y2={96} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#arrW)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.3 }} />
              <motion.line x1={132} y1={124} x2={178} y2={104} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#arrW)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.35 }} />
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <ActionBox x={180} y={78} w={100} h={44} label="groth16.prove" sub="MSM + FFT" color={C.proof} />
              </motion.g>
              <motion.line x1={282} y1={100} x2={318} y2={100} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#arrW)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.95 }} />
              {/* proof output */}
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 1.0 }}>
                <DataBox x={320} y={62} w={140} h={32} label="proof" sub="{A, B, C} ~192B" color={C.proof} outlined />
              </motion.g>
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 1.15 }}>
                <DataBox x={320} y={104} w={140} h={32} label="publicSignals" sub="공개 입력[]" color={C.proof} outlined />
              </motion.g>
              {/* prover benchmark */}
              {[
                { l: 'snarkjs', v: '~60s', y: 160 },
                { l: 'rapidSnark', v: '~5-10s', y: 180 },
                { l: 'GPU', v: '<1s', y: 200 },
              ].map((r, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + i * 0.1 }}>
                  <text x={80} y={r.y} fontSize={8.5} fontWeight={600} fill={C.proof}>{r.l}</text>
                  <rect x={140} y={r.y - 7} width={i === 0 ? 200 : i === 1 ? 40 : 10} height={8} rx={2}
                    fill={`${C.proof}30`} stroke={C.proof} strokeWidth={0.7} />
                  <text x={360} y={r.y} fontSize={8.5} fill={C.proof}>{r.v}</text>
                </motion.g>
              ))}
              <text x={240} y={226} textAnchor="middle" fontSize={8} fill="#64748b">
                1M 제약 기준. proof = 3 그룹 원소, 크기 상수 (증거량 ∝ 회로크기와 무관)
              </text>
            </g>
          )}

          {/* ⑤ Verify + 체크마크 */}
          {step === 4 && (
            <g>
              <text x={240} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.verify}>
                groth16.verify(vKey, publicSignals, proof) — 3 페어링 체크
              </text>
              {/* inputs */}
              <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <DataBox x={20} y={50} w={100} h={28} label="vKey" sub="~1KB" color={C.vkey} outlined />
              </motion.g>
              <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.08 }}>
                <DataBox x={20} y={86} w={100} h={28} label="publicSignals" sub="입력 공개" color={C.proof} outlined />
              </motion.g>
              <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.16 }}>
                <DataBox x={20} y={122} w={100} h={28} label="proof" sub="{A,B,C}" color={C.proof} outlined />
              </motion.g>
              <motion.line x1={122} y1={64} x2={168} y2={100} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#arrW)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.35 }} />
              <motion.line x1={122} y1={100} x2={168} y2={100} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#arrW)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.4 }} />
              <motion.line x1={122} y1={136} x2={168} y2={100} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#arrW)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.45 }} />
              {/* pairing engine */}
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.55 }}>
                <ModuleBox x={170} y={70} w={130} h={60} label="Pairing Check" sub="e(A,B)=e(α,β)·e(Σ,γ)·e(C,δ)" color={C.verify} />
              </motion.g>
              {/* 3 pairing dots */}
              {[0, 1, 2].map((i) => (
                <motion.circle key={i} cx={195 + i * 35} cy={114} r={4.5}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1, fill: `${C.verify}40`, stroke: C.verify, strokeWidth: 1 }}
                  transition={{ ...sp, delay: 0.9 + i * 0.12 }} />
              ))}
              {/* arrow to result */}
              <motion.line x1={302} y1={100} x2={336} y2={100} stroke={C.verify} strokeWidth={1.2} markerEnd="url(#arrV)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 1.3 }} />
              {/* valid box with checkmark */}
              <motion.rect x={338} y={76} width={110} height={50} rx={8}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1, fill: `${C.verify}20`, stroke: C.verify, strokeWidth: 1.5 }}
                transition={{ ...sp, delay: 1.5 }} />
              <motion.path d="M 352 102 L 365 114 L 388 88"
                fill="none" stroke={C.verify} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ duration: 0.5, delay: 1.75 }} />
              <motion.text x={415} y={108} textAnchor="middle" fontSize={10} fontWeight={700}
                initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.verify }}
                transition={{ delay: 2.0 }}>
                valid
              </motion.text>
              {/* onchain verifier hint */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.1 }}>
                <rect x={60} y={170} width={360} height={42} rx={6}
                  fill={`${C.verify}08`} stroke={C.verify} strokeWidth={0.8} strokeDasharray="3 3" />
                <text x={240} y={187} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.verify}>
                  Solidity Verifier — EIP-196/197 프리컴파일
                </text>
                <text x={240} y={202} textAnchor="middle" fontSize={8} fill={C.verify} opacity={0.85}>
                  bn128 페어링 체크, ~200K gas / verify
                </text>
              </motion.g>
              <text x={240} y={228} textAnchor="middle" fontSize={8} fill="#64748b">
                verify 는 proof 크기와 무관한 상수 시간 — succinct 의 핵심
              </text>
            </g>
          )}

        </svg>
      )}
    </StepViz>
  );
}
