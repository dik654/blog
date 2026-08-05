import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const C = {
  iop: '#6366f1',     // public-coin IOP
  vc: '#10b981',      // vector commitment
  fs: '#f59e0b',      // Fiat-Shamir
  bundle: '#3b82f6',  // proof bundle
  sec: '#ef4444',     // security
  muted: '#94a3b8',
};

const STEPS = [
  {
    label: '① 입력: Public-coin IOP',
    body: 'IOP (Interactive Oracle Proof): Prover 가 매 라운드 oracle πᵢ 를 보내고, Verifier 는 무작위 challenge cᵢ 를 던진다.\n\nPublic-coin = 모든 challenge 가 무작위 비트 (private state 없음).\n\n문제: 상호작용 자체가 블록체인에서 불가능. 또 oracle 전체를 전송 불가.',
  },
  {
    label: '② Vector Commitment (oracle 대체)',
    body: 'Oracle πᵢ = [v₀, v₁, ..., v_{n-1}] 의 모든 위치를 한꺼번에 commit.\n\n  tree   = MerkleTree(πᵢ)\n  commit = tree.root           // 32 B 만 전송\n  open(j)= tree.path(j)        // O(log n) hash\n\n→ Verifier 는 root 와 path 만으로 임의 위치 j 의 값을 검증.',
  },
  {
    label: '③ Fiat-Shamir (challenge 생성)',
    body: '양방향 challenge 를 deterministic 단방향으로.\n\n  challenge_i = H(transcript_so_far || round_index || context)\n\n  state₀ = H("BCS" || instance)\n  state_i = H(state_{i-1} || root_i)\n  c_i     = state_i mod |domain|\n\n→ Prover 가 자체 생성, Verifier 가 동일하게 재현.',
  },
  {
    label: '④ Proof Bundle',
    body: '모든 라운드의 산출물을 하나로 묶는다.\n\n  proof = {\n    roots:   [root₁, root₂, ...],     // VC commits\n    answers: [πᵢ[c_j], ...],          // 질의 응답\n    paths:   [merkle_path(c_j), ...], // VC opens\n  }\n\n→ 단일 byte string. 누구나 검증 가능.',
  },
  {
    label: '⑤ Security: ROM + Soundness',
    body: 'Random Oracle Model: H 를 random oracle 로 가정 → computational soundness.\n\n  Soundness_BCS  =  Soundness_IOP  +  Pr[Merkle collision]\n                 ≤  ε_IOP + q² / 2^λ           // negligible\n\nZero-knowledge: simulator 가 transcript 위조 가능 (witness 없이).\n→ Aurora+BCS, Fractal+BCS 모두 transparent + post-quantum.',
  },
];

export default function BCSTransformDeepViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* ① Public-coin IOP — Prover/Verifier 메시지 교환 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={30} y={40} w={90} h={36} label="Prover" sub="oracle 생성" color={C.iop} />
              <ModuleBox x={360} y={40} w={90} h={36} label="Verifier" sub="challenge 던짐" color={C.iop} />
              {[0, 1, 2].map((r) => {
                const y = 100 + r * 38;
                return (
                  <motion.g key={r}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ ...sp, delay: 0.1 + r * 0.12 }}>
                    <text x={20} y={y - 10} fontSize={8} fill={C.muted}>round {r + 1}</text>
                    <line x1={120} y1={y} x2={355} y2={y} stroke={C.iop} strokeWidth={0.8} markerEnd="url(#ai)" />
                    <text x={235} y={y - 4} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.iop}>
                      π{r + 1} (oracle)
                    </text>
                    <line x1={355} y1={y + 16} x2={120} y2={y + 16} stroke={C.fs} strokeWidth={0.8} markerEnd="url(#aif)" strokeDasharray="3 2" />
                    <text x={235} y={y + 12} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.fs}>
                      c{r + 1} (challenge)
                    </text>
                  </motion.g>
                );
              })}
              <defs>
                <marker id="ai" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill={C.iop} />
                </marker>
                <marker id="aif" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill={C.fs} />
                </marker>
              </defs>
            </motion.g>
          )}

          {/* ② Vector Commitment — Merkle tree */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.vc}>
                π = [v₀, v₁, v₂, v₃, v₄, v₅, v₆, v₇]   →  MerkleTree
              </text>
              {/* leaves */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <motion.g key={`l${i}`}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.04 }}>
                  <rect x={40 + i * 50} y={180} width={36} height={22} rx={3}
                    fill={`${C.vc}18`} stroke={C.vc} strokeWidth={0.8} />
                  <text x={58 + i * 50} y={194} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill={C.vc}>
                    H(v{i})
                  </text>
                </motion.g>
              ))}
              {/* level 1 */}
              {[0, 1, 2, 3].map((i) => (
                <motion.g key={`l1-${i}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.32 + i * 0.04 }}>
                  <rect x={65 + i * 100} y={130} width={36} height={20} rx={3}
                    fill={`${C.vc}30`} stroke={C.vc} strokeWidth={0.8} />
                  <text x={83 + i * 100} y={143} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={C.vc}>
                    h{i}
                  </text>
                  <line x1={83 + i * 100} y1={150} x2={58 + i * 100} y2={180} stroke={C.vc} strokeWidth={0.5} opacity={0.5} />
                  <line x1={83 + i * 100} y1={150} x2={108 + i * 100} y2={180} stroke={C.vc} strokeWidth={0.5} opacity={0.5} />
                </motion.g>
              ))}
              {/* level 2 */}
              {[0, 1].map((i) => (
                <motion.g key={`l2-${i}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.5 + i * 0.05 }}>
                  <rect x={115 + i * 200} y={88} width={36} height={20} rx={3}
                    fill={`${C.vc}48`} stroke={C.vc} strokeWidth={0.8} />
                  <text x={133 + i * 200} y={101} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={C.vc}>
                    g{i}
                  </text>
                  <line x1={133 + i * 200} y1={108} x2={83 + i * 200} y2={130} stroke={C.vc} strokeWidth={0.5} opacity={0.5} />
                  <line x1={133 + i * 200} y1={108} x2={183 + i * 200} y2={130} stroke={C.vc} strokeWidth={0.5} opacity={0.5} />
                </motion.g>
              ))}
              {/* root */}
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.65 }}>
                <DataBox x={210} y={42} w={60} h={28} label="root" sub="commit" color={C.vc} outlined />
                <line x1={240} y1={70} x2={133} y2={88} stroke={C.vc} strokeWidth={0.5} opacity={0.5} />
                <line x1={240} y1={70} x2={333} y2={88} stroke={C.vc} strokeWidth={0.5} opacity={0.5} />
              </motion.g>
              <text x={240} y={222} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.muted}>
                open(j) = path(j)  →  O(log n) hash
              </text>
            </motion.g>
          )}

          {/* ③ Fiat-Shamir — interactive → deterministic */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={120} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}>
                Before: 양방향 (interactive)
              </text>
              <text x={360} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.fs}>
                After: 단방향 (deterministic)
              </text>
              {/* before */}
              <ModuleBox x={20} y={40} w={70} h={28} label="Prover" color={C.muted} />
              <ModuleBox x={150} y={40} w={70} h={28} label="Verifier" color={C.muted} />
              {[0, 1].map((r) => (
                <motion.g key={`b${r}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                  transition={{ ...sp, delay: r * 0.1 }}>
                  <line x1={90} y1={84 + r * 22} x2={150} y2={84 + r * 22}
                    stroke={C.muted} strokeWidth={0.7} markerEnd="url(#bm)" />
                  <line x1={150} y1={94 + r * 22} x2={90} y2={94 + r * 22}
                    stroke={C.muted} strokeWidth={0.7} markerEnd="url(#bm)" strokeDasharray="2 2" />
                </motion.g>
              ))}
              <text x={120} y={140} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={C.muted}>
                round 1, 2, ... ↔
              </text>
              {/* after — hash chain */}
              {[
                { i: 0, label: 'state₀ = H("BCS" ∥ inst)' },
                { i: 1, label: 'state₁ = H(state₀ ∥ root₁)' },
                { i: 2, label: 'state₂ = H(state₁ ∥ root₂)' },
                { i: 3, label: 'cₖ = stateₖ mod |domain|' },
              ].map(({ i, label }) => (
                <motion.g key={i}
                  initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.15 + i * 0.1 }}>
                  <rect x={250} y={42 + i * 26} width={220} height={20} rx={4}
                    fill={`${C.fs}14`} stroke={C.fs} strokeWidth={0.6} />
                  <text x={260} y={56 + i * 26} fontSize={8.5} fontFamily="monospace" fill={C.fs}>
                    {label}
                  </text>
                </motion.g>
              ))}
              <text x={360} y={170} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.fs}>
                challenge_i = H(transcript || i || ctx)
              </text>
              <text x={120} y={195} textAnchor="middle" fontSize={8} fill={C.muted}>
                Prover ↔ Verifier
              </text>
              <text x={360} y={195} textAnchor="middle" fontSize={8} fill={C.fs}>
                Prover 가 자체 생성, Verifier 재현
              </text>
              <defs>
                <marker id="bm" markerWidth="5" markerHeight="5" refX="4.5" refY="2.5" orient="auto">
                  <path d="M0,0 L0,5 L5,2.5 z" fill={C.muted} />
                </marker>
              </defs>
            </motion.g>
          )}

          {/* ④ Proof Bundle — 묶기 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.bundle}>
                모든 라운드 산출물 → 단일 proof
              </text>
              {/* sources */}
              {[
                { x: 30, y: 50, color: C.vc, label: 'roots', sub: '[r₁,r₂,...]' },
                { x: 30, y: 110, color: C.iop, label: 'answers', sub: '[π[c_j],...]' },
                { x: 30, y: 170, color: C.fs, label: 'paths', sub: '[mp(c_j),...]' },
              ].map((s, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.05 + i * 0.1 }}>
                  <DataBox x={s.x} y={s.y} w={120} h={40} label={s.label} sub={s.sub} color={s.color} outlined />
                  <motion.line x1={155} y1={s.y + 20} x2={290} y2={120}
                    stroke={s.color} strokeWidth={0.8} opacity={0.55}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ ...sp, delay: 0.2 + i * 0.1 }} />
                </motion.g>
              ))}
              {/* bundle */}
              <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.45 }}>
                <ModuleBox x={290} y={90} w={160} h={60} label="proof bundle" sub="단일 byte string" color={C.bundle} />
              </motion.g>
              <text x={370} y={175} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.bundle}>
                size: O(λ · k · log n)
              </text>
              <text x={370} y={190} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.bundle}>
                예: n=2²⁰, SHA-256 → ~12 KB
              </text>
            </motion.g>
          )}

          {/* ⑤ Security — ROM + soundness 누적 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.sec}>
                Random Oracle Model — Soundness 누적
              </text>
              <ActionBox x={30} y={50} w={140} h={40} label="IOP soundness" sub="ε_IOP" color={C.iop} />
              <text x={185} y={75} fontSize={14} fontWeight={700} fill={C.sec}>+</text>
              <ActionBox x={205} y={50} w={140} h={40} label="Merkle collision" sub="q² / 2^λ" color={C.vc} />
              <text x={360} y={75} fontSize={14} fontWeight={700} fill={C.sec}>=</text>
              <DataBox x={380} y={50} w={70} h={40} label="negligible" color={C.sec} outlined />

              <text x={30} y={120} fontSize={10} fontWeight={600} fill={C.sec}>가정</text>
              <text x={30} y={138} fontSize={9} fontFamily="monospace" fill={C.muted}>
                H 를 random oracle 로 가정 (ROM)
              </text>
              <text x={30} y={152} fontSize={9} fontFamily="monospace" fill={C.muted}>
                → computational soundness 보장
              </text>

              <AlertBox x={30} y={170} w={200} h={50} label="ZK 지원" sub="simulator 가 transcript 위조 가능" color={C.fs} />
              <AlertBox x={250} y={170} w={200} h={50} label="Post-quantum" sub="hash only — pairing 불요" color={C.bundle} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
