import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.18, duration: 0.55 };

const PROVER = '#3b82f6';
const VERIFIER = '#10b981';
const HASH = '#a855f7';
const TRANSCRIPT = '#f59e0b';
const BLAKE = '#06b6d4';
const POSEIDON = '#ec4899';
const KECCAK = '#ef4444';
const DANGER = '#ef4444';

const STEPS = [
  {
    label: '① Interactive Proof — 4 라운드 메시지 교환',
    body: 'Prover ↔ Verifier 양방향. Prover 가 commitment C 를 보내면 Verifier 가 random challenge c 로 응수. Prover 는 response r 로 답하고 Verifier 가 (C, c, r) 을 검증. challenge 가 commitment 이후에 결정되어야 prover 가 cheat 불가.',
  },
  {
    label: '② 문제 — Verifier 없이는 증명 불가능',
    body: 'Non-interactive 환경 (블록체인 등) 에서는 Verifier 가 실시간으로 challenge 를 못 만듦. Prover 가 자기 마음대로 c 를 고르면 자신에게 유리한 c 만 골라 cheat 가능.',
  },
  {
    label: '③ Fiat-Shamir 변환 — Verifier 자리에 Hash',
    body: 'c = H(transcript_so_far) 로 challenge 를 결정론적으로 계산. Prover 가 직접 계산해도 안전 — transcript 가 모든 이전 메시지를 포함하므로 c 는 commitment 이후에만 정해지고 예측 불가.',
  },
  {
    label: '④ Halo2 Transcript API — Sponge 흡수/추출',
    body: 'commit_point(P) 마다 point 를 직렬화해 hash state 에 흡수. squeeze_challenge() 호출 시 현재 state 를 finalize 하여 challenge scalar 추출. 누적 transcript 가 hash state 안에 압축됨.',
  },
  {
    label: '⑤ Hash 선택 — Blake2b / Poseidon / Keccak',
    body: 'Blake2b: 범용 빠른 hash. Poseidon: arithmetic 친화 — SNARK 안에서 재귀 검증할 때. Keccak: EVM 의 SHA3 와 동일 — Solidity verifier contract 호환.',
  },
];

const VBW = 520;
const VBH = 260;

function MessageArrow({
  fromX, toX, y, color, label, delay = 0, reverse = false,
}: { fromX: number; toX: number; y: number; color: string; label: string; delay?: number; reverse?: boolean }) {
  const markerId = reverse ? 'arrFSL' : 'arrFSR';
  return (
    <g>
      <motion.line
        x1={fromX} y1={y} x2={toX} y2={y}
        stroke={color} strokeWidth={1.4} markerEnd={`url(#${markerId})`}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ ...sp, delay }} />
      <motion.text
        x={(fromX + toX) / 2} y={y - 5} textAnchor="middle"
        fontSize={9} fontWeight={600} fill={color}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.2 }}>
        {label}
      </motion.text>
    </g>
  );
}

function Step1Interactive() {
  // Prover (left) ↔ Verifier (right), 4 sequential arrows
  const px = 70, vx = 410;
  const arrows = [
    { from: px + 70, to: vx, y: 90, color: PROVER, label: 'C (commitment)', delay: 0.0, reverse: false },
    { from: vx, to: px + 70, y: 130, color: VERIFIER, label: 'c (challenge)', delay: 0.6, reverse: true },
    { from: px + 70, to: vx, y: 170, color: PROVER, label: 'r (response)', delay: 1.2, reverse: false },
    { from: vx, to: px + 70, y: 210, color: VERIFIER, label: 'verify (C,c,r)', delay: 1.8, reverse: true },
  ];
  return (
    <>
      <ModuleBox x={px} y={50} w={70} h={36} label="Prover" sub="비밀 w" color={PROVER} />
      <ModuleBox x={vx} y={50} w={70} h={36} label="Verifier" sub="random" color={VERIFIER} />
      {arrows.map((a, i) => (
        <MessageArrow key={i} fromX={a.from} toX={a.to} y={a.y}
          color={a.color} label={a.label} delay={a.delay} reverse={a.reverse} />
      ))}
    </>
  );
}

function Step2Problem() {
  const px = 70, vx = 410;
  return (
    <>
      <ModuleBox x={px} y={70} w={70} h={36} label="Prover" sub="혼자" color={PROVER} />
      <AlertBox x={vx} y={70} w={70} h={36} label="Verifier?" sub="부재" color={DANGER} />
      {/* Prover picks self-favoring c */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <DataBox x={px - 15} y={140} w={100} h={28} label="c ← prover 선택" color={DANGER} outlined />
      </motion.g>
      <motion.path
        d={`M ${px + 35} ${106} C ${px + 35} 130, ${px + 35} 130, ${px + 35} 138`}
        stroke={DANGER} strokeWidth={1.2} fill="none" strokeDasharray="3 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.5 }} />
      <motion.text x={260} y={195} textAnchor="middle" fontSize={10} fontWeight={700} fill={DANGER}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        prover 가 유리한 c 만 골라 forge 가능
      </motion.text>
      <motion.text x={260} y={215} textAnchor="middle" fontSize={9} fill={DANGER} opacity={0.8}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        soundness 무너짐 — 거짓 진술도 통과
      </motion.text>
    </>
  );
}

function Step3FiatShamir() {
  const px = 70, hx = 410;
  return (
    <>
      <ModuleBox x={px} y={70} w={70} h={36} label="Prover" sub="혼자 계산" color={PROVER} />
      {/* Hash replaces Verifier */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={sp}>
        <ModuleBox x={hx} y={70} w={70} h={36} label="H(·)" sub="hash" color={HASH} />
      </motion.g>
      {/* transcript flow: prover → hash */}
      <MessageArrow fromX={px + 70} toX={hx} y={88}
        color={PROVER} label="transcript" delay={0.3} />
      {/* hash → prover (challenge) */}
      <MessageArrow fromX={hx} toX={px + 70} y={108}
        color={HASH} label="c = H(...)" delay={0.9} reverse />
      {/* equation */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 1.5 }}>
        <rect x={130} y={160} width={260} height={36} rx={8}
          fill={`${HASH}10`} stroke={HASH} strokeWidth={1} />
        <text x={260} y={184} textAnchor="middle" fontSize={11} fontWeight={700} fill={HASH}>
          c = H(C₁ ‖ C₂ ‖ ... ‖ Cₙ)
        </text>
      </motion.g>
      <motion.text x={260} y={220} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
        transcript 가 c 의 모든 입력 — prover 가 c 를 미리 알 수 없음
      </motion.text>
    </>
  );
}

function Step4Transcript() {
  // commit_point(C1), commit_point(C2), squeeze_challenge → c
  const blockY = 110;
  const blockH = 36;
  const startX = 60;
  const blockW = 70;
  const blocks = ['C₁', 'C₂', 'C₃'];
  return (
    <>
      {/* API labels */}
      <motion.text x={260} y={50} textAnchor="middle" fontSize={11} fontWeight={700}
        fill={TRANSCRIPT}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        transcript.commit_point(P)  →  hash state 에 흡수
      </motion.text>
      {/* Sponge state box (right side) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <rect x={350} y={blockY - 4} width={110} height={blockH + 8} rx={10}
          fill={`${HASH}12`} stroke={HASH} strokeWidth={1.2} />
        <text x={405} y={blockY + 14} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={HASH}>hash state</text>
        <text x={405} y={blockY + 30} textAnchor="middle" fontSize={8.5}
          fill={HASH} opacity={0.75}>sponge</text>
      </motion.g>
      {/* Transcript blocks accumulating from left */}
      {blocks.map((lbl, i) => {
        const x = startX + i * (blockW + 6);
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.4 + i * 0.4 }}>
            <DataBox x={x} y={blockY} w={blockW} h={blockH}
              label={`commit(${lbl})`} color={TRANSCRIPT} outlined />
          </motion.g>
        );
      })}
      {/* Arrow from last block → state */}
      <motion.path
        d={`M ${startX + 3 * (blockW + 6) - 6} ${blockY + blockH / 2} L 350 ${blockY + blockH / 2}`}
        stroke={TRANSCRIPT} strokeWidth={1.4} fill="none" markerEnd="url(#arrFSR)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ ...sp, delay: 1.7 }} />
      {/* squeeze_challenge → c extracted */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 2.2 }}>
        <path d={`M 460 ${blockY + blockH / 2} L 490 ${blockY + blockH / 2}`}
          stroke={HASH} strokeWidth={1.6} fill="none" markerEnd="url(#arrFSH)" />
        <text x={475} y={blockY - 4} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={HASH}>squeeze</text>
        <text x={500} y={blockY + blockH / 2 + 4} fontSize={11}
          fontWeight={700} fill={HASH}>c</text>
      </motion.g>
      <motion.text x={260} y={205} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
        squeeze_challenge() — finalize 하여 scalar c 추출
      </motion.text>
    </>
  );
}

const HASH_CARDS = [
  { name: 'Blake2b', use: '범용 · 빠름', color: BLAKE, x: 30 },
  { name: 'Poseidon', use: 'SNARK 재귀', color: POSEIDON, x: 190 },
  { name: 'Keccak', use: 'EVM 검증자', color: KECCAK, x: 350 },
];

function Step5HashChoices() {
  return (
    <>
      <motion.text x={260} y={45} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={HASH}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Halo2 transcript hash 선택지
      </motion.text>
      {HASH_CARDS.map((h, i) => (
        <motion.g key={h.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.2 + i * 0.2 }}>
          <rect x={h.x} y={75} width={140} height={120} rx={10}
            fill={`${h.color}10`} stroke={h.color} strokeWidth={1.2} />
          <rect x={h.x} y={75} width={140} height={6} rx={3} fill={h.color} opacity={0.85} />
          <text x={h.x + 70} y={108} textAnchor="middle" fontSize={13}
            fontWeight={700} fill={h.color}>{h.name}</text>
          <text x={h.x + 70} y={128} textAnchor="middle" fontSize={9}
            fontWeight={600} fill={h.color} opacity={0.85}>{h.use}</text>
          <line x1={h.x + 20} y1={142} x2={h.x + 120} y2={142}
            stroke={h.color} strokeWidth={0.5} opacity={0.4} />
          <text x={h.x + 70} y={160} textAnchor="middle" fontSize={8.5}
            fill="var(--muted-foreground)">
            {h.name === 'Blake2b' && '256-bit SHA3 대안'}
            {h.name === 'Poseidon' && 'arithmetic 친화'}
            {h.name === 'Keccak' && 'SHA3-256 = EVM'}
          </text>
          <text x={h.x + 70} y={176} textAnchor="middle" fontSize={8.5}
            fill="var(--muted-foreground)">
            {h.name === 'Blake2b' && 'CPU 속도 1순위'}
            {h.name === 'Poseidon' && '회로 비용 최소'}
            {h.name === 'Keccak' && 'Solidity 호환'}
          </text>
          <text x={h.x + 70} y={188} textAnchor="middle" fontSize={8}
            fill={h.color} opacity={0.7}>
            {h.name === 'Blake2b' && '기본값'}
            {h.name === 'Poseidon' && 'IPA recursion'}
            {h.name === 'Keccak' && 'on-chain verifier'}
          </text>
        </motion.g>
      ))}
      <motion.text x={260} y={220} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}>
        prover · verifier 양쪽 동일한 hash 사용 — transcript 일관성
      </motion.text>
    </>
  );
}

export default function FiatShamirViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${VBW} ${VBH}`} className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          <defs>
            <marker id="arrFSR" viewBox="0 0 10 10" refX="8" refY="5"
              markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={PROVER} />
            </marker>
            <marker id="arrFSL" viewBox="0 0 10 10" refX="8" refY="5"
              markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={VERIFIER} />
            </marker>
            <marker id="arrFSH" viewBox="0 0 10 10" refX="8" refY="5"
              markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={HASH} />
            </marker>
          </defs>
          {step === 0 && <Step1Interactive />}
          {step === 1 && <Step2Problem />}
          {step === 2 && <Step3FiatShamir />}
          {step === 3 && <Step4Transcript />}
          {step === 4 && <Step5HashChoices />}
        </svg>
      )}
    </StepViz>
  );
}
