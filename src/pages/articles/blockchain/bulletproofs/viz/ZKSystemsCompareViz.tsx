import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

// 팔레트
const C = {
  bullet: '#ec4899',
  groth: '#6366f1',
  plonk: '#8b5cf6',
  stark: '#f59e0b',
  ped: '#10b981',
  vec: '#14b8a6',
  gen: '#0ea5e9',
  fs: '#ef4444',
  muted: '#9ca3af',
};

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS = [
  {
    label: '① Bulletproofs (Bünz et al. 2017)',
    body: 'O(log n) range proof + no trusted setup.\n기반: Discrete-Log assumption + Inner Product Argument + Fiat-Shamir.\n이전 Borromean ring signature O(n) 대비 자릿수 압축.',
  },
  {
    label: '② 4-way 비교: Groth16 / PLONK / STARK / Bulletproofs',
    body: '크기·prover·verifier·setup 4 메트릭으로 트레이드오프 시각화.\nBulletproofs는 size에서 STARK보다 압도적으로 작고, setup은 transparent.',
  },
  {
    label: '③ Pedersen Commitment',
    body: 'Com(v, r) = v·G + r·H — group point 두 개의 합.\nHiding (r 모르면 v 복원 불가) · Binding (DL) · Homomorphic.',
  },
  {
    label: '④ Vector Pedersen',
    body: 'Com(a, b, r) = Σ aᵢ·Gᵢ + Σ bᵢ·Hᵢ + r·H.\n다수 generator 와 multi-scalar mul. n비트 range proof에 n쌍 generator.',
  },
  {
    label: '⑤ GeneratorsChain (SHAKE256 XOF)',
    body: 'nothing-up-my-sleeve label → SHAKE256 → 32-byte 후보.\n유효 Ristretto255 점이 될 때까지 재시도. 결정론적, trapdoor 없음.',
  },
  {
    label: '⑥ Fiat-Shamir Transform',
    body: 'Interactive (commit → challenge → response) 를 hash(transcript) 로 대체.\nmerlin crate · Strobe 프레임워크 · domain separation 내장.',
  },
];

const SYSTEMS = [
  { key: 'Groth16', color: C.groth, size: '192 B', prover: 'Fast O(n)', verifier: 'O(1)', setup: 'Circuit-specific', sizePct: 0.04 },
  { key: 'PLONK', color: C.plonk, size: '~500 B', prover: 'Moderate', verifier: 'O(1)', setup: 'Universal', sizePct: 0.08 },
  { key: 'STARK', color: C.stark, size: '50-200 KB', prover: 'Fast', verifier: 'O(log² n)', setup: 'Transparent', sizePct: 1.0 },
  { key: 'Bulletproofs', color: C.bullet, size: '~700 B', prover: 'O(n)', verifier: 'O(n)', setup: 'Transparent', sizePct: 0.11 },
];

function Step1() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={28} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.bullet}>
        Bulletproofs
      </text>
      <text x={260} y={44} textAnchor="middle" fontSize={9} fill={C.muted}>
        Bünz · Bootle · Boneh · Poelstra · Wuille · Maxwell (2017)
      </text>
      <ModuleBox x={30} y={70} w={140} h={50} color={C.bullet}
        label="O(log n) proof" sub="64-bit → ~700 B" />
      <ModuleBox x={190} y={70} w={140} h={50} color={C.ped}
        label="No trusted setup" sub="transparent" />
      <ModuleBox x={350} y={70} w={140} h={50} color={C.gen}
        label="DL assumption" sub="Ristretto255 / secp256k1" />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        <rect x={30} y={150} width={460} height={56} rx={8}
          fill={`${C.bullet}10`} stroke={C.bullet} strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={260} y={172} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.bullet}>
          기반 컴포넌트
        </text>
        <text x={120} y={194} textAnchor="middle" fontSize={9} fill={C.bullet}>
          Pedersen
        </text>
        <text x={260} y={194} textAnchor="middle" fontSize={9} fill={C.bullet}>
          Inner Product Argument
        </text>
        <text x={400} y={194} textAnchor="middle" fontSize={9} fill={C.bullet}>
          Fiat-Shamir
        </text>
      </motion.g>
    </motion.g>
  );
}

function Step2() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={20} y={20} fontSize={10} fontWeight={700} fill={C.muted}>4-way 비교</text>
      {SYSTEMS.map((s, i) => {
        const x = 20 + i * 125;
        return (
          <motion.g key={s.key}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.06 }}>
            <rect x={x} y={32} width={115} height={210} rx={8}
              fill={`${s.color}10`} stroke={s.color} strokeWidth={1} />
            <text x={x + 57.5} y={50} textAnchor="middle" fontSize={11} fontWeight={700} fill={s.color}>
              {s.key}
            </text>
            <line x1={x + 10} y1={56} x2={x + 105} y2={56} stroke={s.color} opacity={0.3} strokeWidth={0.5} />

            <text x={x + 10} y={74} fontSize={8} fill={s.color} opacity={0.6}>Size</text>
            <text x={x + 105} y={74} textAnchor="end" fontSize={9} fontWeight={600} fill={s.color}>{s.size}</text>

            <text x={x + 10} y={96} fontSize={8} fill={s.color} opacity={0.6}>Prover</text>
            <text x={x + 105} y={96} textAnchor="end" fontSize={9} fontWeight={600} fill={s.color}>{s.prover}</text>

            <text x={x + 10} y={118} fontSize={8} fill={s.color} opacity={0.6}>Verifier</text>
            <text x={x + 105} y={118} textAnchor="end" fontSize={9} fontWeight={600} fill={s.color}>{s.verifier}</text>

            <text x={x + 10} y={140} fontSize={8} fill={s.color} opacity={0.6}>Setup</text>
            <text x={x + 105} y={140} textAnchor="end" fontSize={8.5} fontWeight={600} fill={s.color}>{s.setup}</text>

            <text x={x + 10} y={166} fontSize={8} fill={s.color} opacity={0.6}>Proof size (relative)</text>
            <rect x={x + 10} y={172} width={95} height={8} rx={3}
              fill={`${s.color}15`} stroke={`${s.color}30`} strokeWidth={0.4} />
            <motion.rect
              x={x + 10} y={172} height={8} rx={3}
              initial={{ width: 0 }} animate={{ width: 95 * s.sizePct }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
              fill={s.color} />
            {s.key === 'Bulletproofs' && (
              <text x={x + 57.5} y={210} textAnchor="middle" fontSize={8} fontWeight={700} fill={s.color}>
                Monero · Grin · Beam
              </text>
            )}
            {s.key === 'STARK' && (
              <text x={x + 57.5} y={210} textAnchor="middle" fontSize={8} fontWeight={700} fill={s.color}>
                post-quantum
              </text>
            )}
          </motion.g>
        );
      })}
    </motion.g>
  );
}

function Step3() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ped}>
        Pedersen Commitment: Com(v, r) = v·G + r·H
      </text>
      {/* v · G */}
      <motion.g initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}>
        <circle cx={90} cy={130} r={32} fill={`${C.ped}15`} stroke={C.ped} strokeWidth={1.2} />
        <text x={90} y={128} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.ped}>v·G</text>
        <text x={90} y={144} textAnchor="middle" fontSize={8} fill={C.ped} opacity={0.7}>value</text>
      </motion.g>
      {/* + */}
      <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        x={170} y={138} textAnchor="middle" fontSize={20} fontWeight={700} fill={C.muted}>+</motion.text>
      {/* r · H */}
      <motion.g initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}>
        <circle cx={230} cy={130} r={32} fill={`${C.fs}15`} stroke={C.fs} strokeWidth={1.2} />
        <text x={230} y={128} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.fs}>r·H</text>
        <text x={230} y={144} textAnchor="middle" fontSize={8} fill={C.fs} opacity={0.7}>blinding</text>
      </motion.g>
      {/* = */}
      <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        x={310} y={138} textAnchor="middle" fontSize={20} fontWeight={700} fill={C.muted}>=</motion.text>
      {/* Com */}
      <motion.g initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <circle cx={400} cy={130} r={42} fill={`${C.bullet}18`} stroke={C.bullet} strokeWidth={1.4} />
        <text x={400} y={126} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.bullet}>
          Com(v,r)
        </text>
        <text x={400} y={142} textAnchor="middle" fontSize={8} fill={C.bullet} opacity={0.7}>group point</text>
      </motion.g>
      {/* properties */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <DataBox x={40} y={210} w={130} h={28} color={C.ped} label="Hiding" sub="r 없으면 v 불가" />
        <DataBox x={185} y={210} w={130} h={28} color={C.gen} label="Binding" sub="DL assumption" />
        <DataBox x={330} y={210} w={130} h={28} color={C.bullet} label="Homomorphic" sub="Com(a)+Com(b)" />
      </motion.g>
    </motion.g>
  );
}

function Step4() {
  // Vector Pedersen — multi-scalar mul
  const aArr = [3, 5, 2, 7];
  const bArr = [1, 4, 6, 2];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.vec}>
        Vector Pedersen: Σ aᵢ·Gᵢ + Σ bᵢ·Hᵢ + r·H
      </text>
      {/* a vector with G generators */}
      <text x={20} y={48} fontSize={9} fontWeight={600} fill={C.vec}>a · G</text>
      {aArr.map((v, i) => (
        <motion.g key={`a${i}`}
          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 + i * 0.05 }}>
          <rect x={20 + i * 50} y={56} width={42} height={32} rx={6}
            fill={`${C.vec}15`} stroke={C.vec} strokeWidth={0.8} />
          <text x={41 + i * 50} y={72} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.vec}>
            {v}·G{i}
          </text>
          <text x={41 + i * 50} y={84} textAnchor="middle" fontSize={7} fill={C.vec} opacity={0.7}>
            scalar·gen
          </text>
        </motion.g>
      ))}
      {/* + b vector with H generators */}
      <text x={20} y={108} fontSize={9} fontWeight={600} fill={C.gen}>b · H</text>
      {bArr.map((v, i) => (
        <motion.g key={`b${i}`}
          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 + i * 0.05 }}>
          <rect x={20 + i * 50} y={116} width={42} height={32} rx={6}
            fill={`${C.gen}15`} stroke={C.gen} strokeWidth={0.8} />
          <text x={41 + i * 50} y={132} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.gen}>
            {v}·H{i}
          </text>
          <text x={41 + i * 50} y={144} textAnchor="middle" fontSize={7} fill={C.gen} opacity={0.7}>
            scalar·gen
          </text>
        </motion.g>
      ))}
      {/* arrow → MSM */}
      <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }}
        x1={245} y1={170} x2={365} y2={210}
        stroke={C.muted} strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#arr-vec)" />
      <defs>
        <marker id="arr-vec" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={C.muted} />
        </marker>
      </defs>
      {/* Final MSM result */}
      <motion.g initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7 }}>
        <rect x={350} y={195} width={150} height={48} rx={8}
          fill={`${C.bullet}18`} stroke={C.bullet} strokeWidth={1.2} />
        <text x={425} y={216} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bullet}>
          multi-scalar mul
        </text>
        <text x={425} y={232} textAnchor="middle" fontSize={8} fill={C.bullet} opacity={0.8}>
          n쌍 generator · n비트 range
        </text>
      </motion.g>
    </motion.g>
  );
}

function Step5() {
  // Generator chain: SHAKE256 → candidate → valid point
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.gen}>
        GeneratorsChain (SHAKE256 XOF · Ristretto255)
      </text>
      {/* Stage 1: label + index */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
        <rect x={20} y={60} width={110} height={64} rx={8}
          fill={`${C.gen}15`} stroke={C.gen} strokeWidth={1} />
        <text x={75} y={82} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.gen}>label</text>
        <text x={75} y={98} textAnchor="middle" fontSize={9} fill={C.gen} opacity={0.8} fontFamily="monospace">
          "GeneratorsChain"
        </text>
        <text x={75} y={114} textAnchor="middle" fontSize={9} fill={C.gen} opacity={0.8} fontFamily="monospace">
          + idx.bytes
        </text>
      </motion.g>
      {/* arrow */}
      <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }}
        x1={132} y1={92} x2={158} y2={92}
        stroke={C.muted} strokeWidth={1.2} markerEnd="url(#arr-gen)" />
      {/* SHAKE256 */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}>
        <rect x={160} y={60} width={100} height={64} rx={8}
          fill={`${C.fs}15`} stroke={C.fs} strokeWidth={1} />
        <text x={210} y={86} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fs}>SHAKE256</text>
        <text x={210} y={102} textAnchor="middle" fontSize={8} fill={C.fs} opacity={0.7}>XOF</text>
        <text x={210} y={114} textAnchor="middle" fontSize={8} fill={C.fs} opacity={0.7}>read 32 bytes</text>
      </motion.g>
      <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }}
        x1={262} y1={92} x2={288} y2={92}
        stroke={C.muted} strokeWidth={1.2} markerEnd="url(#arr-gen)" />
      {/* Candidate */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45 }}>
        <rect x={290} y={60} width={100} height={64} rx={8}
          fill={`${C.stark}15`} stroke={C.stark} strokeWidth={1} />
        <text x={340} y={84} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.stark}>
          candidate
        </text>
        <text x={340} y={100} textAnchor="middle" fontSize={8} fill={C.stark} opacity={0.8}>
          try_decode_point
        </text>
        <text x={340} y={114} textAnchor="middle" fontSize={8} fill={C.stark} opacity={0.7}>
          reject? loop
        </text>
      </motion.g>
      <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }}
        x1={392} y1={92} x2={418} y2={92}
        stroke={C.ped} strokeWidth={1.5} markerEnd="url(#arr-ok)" />
      {/* Valid point */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.65 }}>
        <circle cx={460} cy={92} r={28} fill={`${C.ped}18`} stroke={C.ped} strokeWidth={1.4} />
        <text x={460} y={88} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.ped}>Gᵢ</text>
        <text x={460} y={102} textAnchor="middle" fontSize={7.5} fill={C.ped} opacity={0.8}>valid</text>
      </motion.g>
      {/* loop arrow */}
      <motion.path initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} transition={{ delay: 0.55 }}
        d="M 340 60 Q 340 30 250 30 Q 160 30 160 60"
        fill="none" stroke={C.fs} strokeWidth={0.8} strokeDasharray="3 2" />
      <text x={250} y={26} textAnchor="middle" fontSize={8} fill={C.fs} opacity={0.7}>retry on invalid</text>
      <defs>
        <marker id="arr-gen" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={C.muted} />
        </marker>
        <marker id="arr-ok" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={C.ped} />
        </marker>
      </defs>
      <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
        x={260} y={172} textAnchor="middle" fontSize={9} fill={C.muted}>
        nothing-up-my-sleeve · trapdoor 없음 · 결정론적 재현 가능
      </motion.text>
    </motion.g>
  );
}

function Step6() {
  // Fiat-Shamir transcript
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={130} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.muted}>Interactive</text>
      <text x={390} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bullet}>Fiat-Shamir (NI)</text>
      {/* divider */}
      <line x1={260} y1={32} x2={260} y2={250} stroke={C.muted} strokeWidth={0.5} strokeDasharray="3 3" opacity={0.4} />

      {/* Interactive side */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
        <ActionRow x={20} y={50} label="Prover → commit" color={C.ped} />
        <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.15 }}
          x1={130} y1={80} x2={130} y2={104} stroke={C.muted} strokeWidth={1} markerEnd="url(#arr-fs)" />
        <ActionRow x={20} y={108} label="Verifier ← challenge" color={C.fs} />
        <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }}
          x1={130} y1={138} x2={130} y2={162} stroke={C.muted} strokeWidth={1} markerEnd="url(#arr-fs)" />
        <ActionRow x={20} y={166} label="Prover → response" color={C.ped} />
        <text x={130} y={210} textAnchor="middle" fontSize={9} fill={C.muted}>verifier 라운드 필요</text>
      </motion.g>

      {/* Fiat-Shamir side */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x={280} y={50} width={220} height={130} rx={8}
          fill={`${C.bullet}10`} stroke={C.bullet} strokeWidth={1} strokeDasharray="3 2" />
        <text x={390} y={70} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.bullet}>
          merlin transcript
        </text>
        <text x={390} y={84} textAnchor="middle" fontSize={8} fill={C.bullet} opacity={0.7}>
          (Strobe protocol)
        </text>
        {[
          { y: 100, t: 'append(commit)', c: C.ped },
          { y: 118, t: 'challenge = hash(state)', c: C.fs },
          { y: 136, t: 'append(response)', c: C.ped },
          { y: 154, t: 'domain separation 내장', c: C.muted },
        ].map((row, i) => (
          <motion.text key={i}
            initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.08 }}
            x={295} y={row.y} fontSize={9} fontFamily="monospace" fill={row.c}>
            {row.t}
          </motion.text>
        ))}
        <text x={390} y={210} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.bullet}>
          Non-interactive proof
        </text>
      </motion.g>
      <defs>
        <marker id="arr-fs" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={C.muted} />
        </marker>
      </defs>
    </motion.g>
  );
}

function ActionRow({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={220} height={32} rx={6}
        fill={`${color}12`} stroke={color} strokeWidth={0.8} />
      <rect x={x} y={y} width={3} height={32} fill={color} />
      <text x={x + 12} y={y + 20} fontSize={10} fontWeight={600} fill={color}>{label}</text>
    </g>
  );
}

export default function ZKSystemsCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 260" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <Step1 />}
          {step === 1 && <Step2 />}
          {step === 2 && <Step3 />}
          {step === 3 && <Step4 />}
          {step === 4 && <Step5 />}
          {step === 5 && <Step6 />}
        </svg>
      )}
    </StepViz>
  );
}
