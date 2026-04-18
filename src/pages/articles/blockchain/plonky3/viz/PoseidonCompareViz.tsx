import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const POSEIDON = '#f59e0b';
const POSEIDON2 = '#10b981';
const SBOX = '#6366f1';
const MDS = '#8b5cf6';

const STEPS = [
  {
    label: '1. Poseidon 라운드 구조',
    body: 'R_F/2 full → R_P partial → R_F/2 full. BabyBear width 16 기준 R_F=8, R_P=12, 총 20 라운드.',
  },
  {
    label: '2. Full round: S-box 전체 적용',
    body: '① round constants 추가 → ② 16개 원소 모두에 S-box (x^α, α=3,5,7) → ③ MDS matrix 곱.',
  },
  {
    label: '3. Partial round: S-box 1개만',
    body: '① round constants → ② 단 1개 원소만 S-box → ③ MDS. 비선형 비용을 줄이는 핵심 최적화.',
  },
  {
    label: '4. Poseidon2 개선점',
    body: 'Poseidon(2019) → Poseidon2(2023): 동일 보안에 round constants 개선 + diagonal MDS 로 행렬 곱 비용 격감. 3-5x 빠르고 Plonky3/Risc Zero 채용.',
  },
  {
    label: '5. 제약 수: Poseidon2 vs Keccak',
    body: 'Poseidon2(BabyBear) ~120 constraints/hash 대 Keccak(emulated) ~30K. 회로 내부에서 약 250배 효율.',
  },
];

// 16-element state layout (horizontal)
const N = 16;
const CELL_W = 22;
const CELL_H = 22;
const START_X = 40;
const STATE_Y = 60;

function StateRow({
  step,
  highlightAll,
  highlightOne,
  showMds,
}: { step: number; highlightAll: boolean; highlightOne: boolean; showMds: boolean }) {
  return (
    <g>
      {/* label */}
      <text x={START_X - 8} y={STATE_Y + CELL_H / 2 + 3} textAnchor="end" fontSize={8}
        fill="#94a3b8">state</text>
      {Array.from({ length: N }).map((_, i) => {
        const isHLAll = highlightAll;
        const isHLOne = highlightOne && i === 0;
        const sboxActive = isHLAll || isHLOne;
        return (
          <g key={i}>
            <motion.rect
              x={START_X + i * CELL_W}
              y={STATE_Y}
              width={CELL_W - 2}
              height={CELL_H}
              rx={3}
              animate={{
                fill: sboxActive ? `${SBOX}35` : `${SBOX}08`,
                stroke: sboxActive ? SBOX : '#64748b',
                strokeWidth: sboxActive ? 1.6 : 0.5,
              }}
              transition={sp}
            />
            <motion.text
              x={START_X + i * CELL_W + (CELL_W - 2) / 2}
              y={STATE_Y + CELL_H / 2 + 3}
              textAnchor="middle"
              fontSize={8}
              animate={{
                fill: sboxActive ? SBOX : '#94a3b8',
                fontWeight: sboxActive ? 700 : 400,
              }}
              transition={sp}
            >
              s{i}
            </motion.text>
            {/* S-box marker above */}
            {sboxActive && (
              <motion.text
                x={START_X + i * CELL_W + (CELL_W - 2) / 2}
                y={STATE_Y - 5}
                textAnchor="middle"
                fontSize={7}
                fill={SBOX}
                fontWeight={700}
                initial={{ opacity: 0, y: STATE_Y + 2 }}
                animate={{ opacity: 1, y: STATE_Y - 5 }}
                transition={sp}
              >
                x^α
              </motion.text>
            )}
          </g>
        );
      })}
      {/* MDS bracket */}
      {showMds && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
          <rect
            x={START_X - 2}
            y={STATE_Y + CELL_H + 10}
            width={N * CELL_W}
            height={14}
            rx={3}
            fill={`${MDS}18`}
            stroke={MDS}
            strokeWidth={0.8}
          />
          <text
            x={START_X + (N * CELL_W) / 2}
            y={STATE_Y + CELL_H + 20}
            textAnchor="middle"
            fontSize={8}
            fill={MDS}
            fontWeight={700}
          >
            MDS matrix × state
          </text>
        </motion.g>
      )}
    </g>
  );
}

function RoundStructure({ step }: { step: number }) {
  const parts = [
    { label: 'R_F/2 = 4', sub: 'full', w: 90, color: POSEIDON2 },
    { label: 'R_P = 12', sub: 'partial', w: 170, color: POSEIDON },
    { label: 'R_F/2 = 4', sub: 'full', w: 90, color: POSEIDON2 },
  ];
  let x = 40;
  return (
    <g>
      <text x={220} y={30} textAnchor="middle" fontSize={9} fill="#64748b" fontWeight={600}>
        총 20 라운드 (BabyBear width 16)
      </text>
      {parts.map((p) => {
        const rect = (
          <g key={p.label}>
            <motion.rect
              x={x}
              y={55}
              width={p.w}
              height={34}
              rx={5}
              animate={{
                fill: `${p.color}20`,
                stroke: p.color,
                strokeWidth: step === 0 ? 1.5 : 0.8,
              }}
              transition={sp}
            />
            <text x={x + p.w / 2} y={70} textAnchor="middle" fontSize={9} fill={p.color} fontWeight={700}>
              {p.label}
            </text>
            <text x={x + p.w / 2} y={82} textAnchor="middle" fontSize={8} fill={p.color}>
              {p.sub} round
            </text>
          </g>
        );
        x += p.w + 4;
        return rect;
      })}
      {/* flow arrows */}
      <text x={220} y={108} textAnchor="middle" fontSize={8} fill="#94a3b8">
        AddRC → S-box → MDS  (반복)
      </text>
    </g>
  );
}

function ImprovementCompare() {
  const items = [
    { label: 'Poseidon (2019)', color: POSEIDON, y: 30, bullets: ['full MDS matrix', 'original RC', 'baseline speed'] },
    { label: 'Poseidon2 (2023)', color: POSEIDON2, y: 78, bullets: ['diagonal MDS', 'improved RC', '3-5x faster'] },
  ];
  return (
    <g>
      {items.map((it) => (
        <g key={it.label}>
          <motion.rect
            x={30}
            y={it.y}
            width={420}
            height={40}
            rx={6}
            animate={{ fill: `${it.color}12`, stroke: it.color, strokeWidth: 1 }}
            transition={sp}
          />
          <text x={40} y={it.y + 16} fontSize={10} fill={it.color} fontWeight={700}>
            {it.label}
          </text>
          {it.bullets.map((b, i) => (
            <text key={b} x={40 + i * 135} y={it.y + 32} fontSize={8} fill={it.color}>
              • {b}
            </text>
          ))}
        </g>
      ))}
      <text x={240} y={140} textAnchor="middle" fontSize={8} fill="#94a3b8" fontStyle="italic">
        Plonky3, Risc Zero 에서 표준 해시로 채택
      </text>
    </g>
  );
}

function ConstraintBars() {
  // log-scale feel: widths are log10(value) mapped
  const keccakLog = Math.log10(30000); // ~4.48
  const poseidonLog = Math.log10(120); // ~2.08
  const maxW = 360;
  const keccakW = (keccakLog / keccakLog) * maxW;
  const poseidonW = (poseidonLog / keccakLog) * maxW;
  return (
    <g>
      <text x={240} y={22} textAnchor="middle" fontSize={9} fill="#64748b" fontWeight={600}>
        Hash 당 Circuit constraints (log scale)
      </text>
      {/* Poseidon2 */}
      <text x={30} y={52} fontSize={9} fill={POSEIDON2} fontWeight={700}>
        Poseidon2
      </text>
      <motion.rect
        x={30}
        y={58}
        height={18}
        rx={3}
        initial={{ width: 0 }}
        animate={{ width: poseidonW }}
        transition={{ ...sp, duration: 0.7 }}
        fill={`${POSEIDON2}40`}
        stroke={POSEIDON2}
        strokeWidth={1}
      />
      <text x={30 + poseidonW + 6} y={71} fontSize={9} fill={POSEIDON2} fontWeight={700}>
        ~120
      </text>
      {/* Keccak */}
      <text x={30} y={98} fontSize={9} fill="#ef4444" fontWeight={700}>
        Keccak (emulated)
      </text>
      <motion.rect
        x={30}
        y={104}
        height={18}
        rx={3}
        initial={{ width: 0 }}
        animate={{ width: keccakW }}
        transition={{ ...sp, duration: 0.9, delay: 0.15 }}
        fill="#ef444440"
        stroke="#ef4444"
        strokeWidth={1}
      />
      <text x={30 + keccakW + 6} y={117} fontSize={9} fill="#ef4444" fontWeight={700}>
        ~30,000
      </text>
      {/* ratio */}
      <motion.text
        x={240}
        y={150}
        textAnchor="middle"
        fontSize={11}
        fill={POSEIDON2}
        fontWeight={800}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.5 }}
      >
        ≈ 250× 효율
      </motion.text>
    </g>
  );
}

export default function PoseidonCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step === 0 && <RoundStructure step={step} />}
          {step === 1 && (
            <g>
              <text x={240} y={22} textAnchor="middle" fontSize={9} fill={POSEIDON2} fontWeight={700}>
                Full round — S-box on all 16 elements
              </text>
              <text x={240} y={36} textAnchor="middle" fontSize={8} fill="#94a3b8">
                AddRC  →  S-box (x^α 전 원소)  →  MDS
              </text>
              <StateRow step={step} highlightAll highlightOne={false} showMds />
            </g>
          )}
          {step === 2 && (
            <g>
              <text x={240} y={22} textAnchor="middle" fontSize={9} fill={POSEIDON} fontWeight={700}>
                Partial round — S-box on 1 element only
              </text>
              <text x={240} y={36} textAnchor="middle" fontSize={8} fill="#94a3b8">
                AddRC  →  S-box (s0 1개)  →  MDS   (비선형 비용 ↓)
              </text>
              <StateRow step={step} highlightAll={false} highlightOne showMds />
            </g>
          )}
          {step === 3 && <ImprovementCompare />}
          {step === 4 && <ConstraintBars />}
        </svg>
      )}
    </StepViz>
  );
}
