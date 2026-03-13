import { motion } from 'framer-motion';
import StepViz from '../../../../../components/ui/step-viz';

const BLUE = '#60a5fa';
const ORANGE = '#f97316';
const GREEN = '#22c55e';
const PURPLE = '#a78bfa';

const STEPS = [
  {
    label: 'Step 1: 블록의 기본 구조',
    body: '블록은 블록 헤더(Block Header)와 트랜잭션 목록(Transaction List)으로 구성됩니다. 헤더에는 이전 블록 해시, 머클 루트, 타임스탬프, 난스 등의 메타데이터가 포함됩니다.',
  },
  {
    label: 'Step 2: 트랜잭션 → 머클 루트 해싱',
    body: '트랜잭션들은 쌍으로 해싱되어 머클 트리를 형성하고, 최종적으로 하나의 머클 루트(Merkle Root) 해시로 요약됩니다. 이를 통해 개별 트랜잭션의 포함 여부를 효율적으로 검증할 수 있습니다.',
  },
  {
    label: 'Step 3: 해시 체인으로 연결된 블록들',
    body: '각 블록 헤더에는 이전 블록의 해시가 포함되어, 블록들이 체인 형태로 연결됩니다. 하나의 블록이 변조되면 이후 모든 블록의 해시가 달라져 변조를 즉시 탐지할 수 있습니다.',
  },
];

/* ── Step 0: Single block anatomy ── */
function SingleBlock({ animate }: { animate: boolean }) {
  const fade = animate
    ? { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } }
    : { initial: { opacity: 1 }, animate: { opacity: 1 } };

  return (
    <motion.g {...fade} transition={{ duration: 0.4 }}>
      {/* Block outline */}
      <rect x={80} y={10} width={230} height={200} rx={8}
        fill={`${BLUE}11`} stroke={BLUE} strokeWidth={1.5} />
      <text x={195} y={30} textAnchor="middle"
        fontSize={11} fontWeight="700" fill={BLUE}>Block #N</text>

      {/* Header section */}
      <rect x={95} y={40} width={200} height={100} rx={5}
        fill={`${PURPLE}15`} stroke={PURPLE} strokeWidth={1} />
      <text x={195} y={56} textAnchor="middle"
        fontSize={9} fontWeight="600" fill={PURPLE}>Block Header</text>

      {/* Header fields */}
      {[
        'Prev Block Hash',
        'Merkle Root',
        'Timestamp',
        'Nonce / Difficulty',
      ].map((label, i) => (
        <motion.g key={label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + i * 0.1, duration: 0.3 }}
        >
          <rect x={105} y={62 + i * 19} width={180} height={15} rx={3}
            fill={`${PURPLE}10`} stroke={PURPLE} strokeWidth={0.5} strokeOpacity={0.4} />
          <text x={195} y={73 + i * 19} textAnchor="middle"
            fontSize={8} fill="hsl(var(--foreground))" fillOpacity={0.7}>
            {label}
          </text>
        </motion.g>
      ))}

      {/* Transaction section */}
      <rect x={95} y={150} width={200} height={50} rx={5}
        fill={`${ORANGE}15`} stroke={ORANGE} strokeWidth={1} />
      <text x={195} y={167} textAnchor="middle"
        fontSize={9} fontWeight="600" fill={ORANGE}>Transactions</text>
      <text x={195} y={185} textAnchor="middle"
        fontSize={8} fill="hsl(var(--foreground))" fillOpacity={0.5}>
        Tx1, Tx2, Tx3, ...
      </text>
    </motion.g>
  );
}

/* ── Step 1: Merkle tree hashing ── */
function MerkleHashing() {
  const txLabels = ['Tx1', 'Tx2', 'Tx3', 'Tx4'];
  const txX = [60, 150, 240, 330];
  const txY = 185;

  const h1X = [105, 285];
  const h1Y = 130;

  const rootX = 195;
  const rootY = 65;

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Transactions */}
      {txLabels.map((label, i) => (
        <motion.g key={label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
        >
          <rect x={txX[i] - 25} y={txY - 10} width={50} height={22} rx={4}
            fill={`${ORANGE}20`} stroke={ORANGE} strokeWidth={1} />
          <text x={txX[i]} y={txY + 5} textAnchor="middle"
            fontSize={9} fontWeight="600" fill={ORANGE}>{label}</text>
        </motion.g>
      ))}

      {/* Hash level 1 */}
      {['H(1,2)', 'H(3,4)'].map((label, i) => (
        <motion.g key={label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.15, duration: 0.3 }}
        >
          <rect x={h1X[i] - 30} y={h1Y - 10} width={60} height={22} rx={4}
            fill={`${BLUE}20`} stroke={BLUE} strokeWidth={1} />
          <text x={h1X[i]} y={h1Y + 5} textAnchor="middle"
            fontSize={9} fontWeight="600" fill={BLUE}>{label}</text>
          {/* Lines from tx to hash */}
          <line x1={txX[i * 2]} y1={txY - 10} x2={h1X[i]} y2={h1Y + 12}
            stroke={BLUE} strokeWidth={0.8} strokeOpacity={0.4} />
          <line x1={txX[i * 2 + 1]} y1={txY - 10} x2={h1X[i]} y2={h1Y + 12}
            stroke={BLUE} strokeWidth={0.8} strokeOpacity={0.4} />
        </motion.g>
      ))}

      {/* Merkle root */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.35 }}
      >
        <rect x={rootX - 40} y={rootY - 12} width={80} height={26} rx={5}
          fill={`${GREEN}20`} stroke={GREEN} strokeWidth={1.5} />
        <text x={rootX} y={rootY + 5} textAnchor="middle"
          fontSize={10} fontWeight="700" fill={GREEN}>Merkle Root</text>
        <line x1={h1X[0]} y1={h1Y - 10} x2={rootX} y2={rootY + 14}
          stroke={GREEN} strokeWidth={0.8} strokeOpacity={0.5} />
        <line x1={h1X[1]} y1={h1Y - 10} x2={rootX} y2={rootY + 14}
          stroke={GREEN} strokeWidth={0.8} strokeOpacity={0.5} />
      </motion.g>

      {/* Arrow indicating it goes into header */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      >
        <text x={rootX} y={40} textAnchor="middle"
          fontSize={8} fill="hsl(var(--foreground))" fillOpacity={0.5}>
          ↑ Block Header에 저장
        </text>
      </motion.g>
    </motion.g>
  );
}

/* ── Step 2: Chain of blocks ── */
function BlockChain() {
  const blocks = [
    { x: 25, label: 'Block N-1', color: PURPLE },
    { x: 155, label: 'Block N', color: BLUE },
    { x: 285, label: 'Block N+1', color: GREEN },
  ];
  const bw = 105;
  const bh = 130;
  const by = 40;

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {blocks.map((b, i) => (
        <motion.g key={b.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.2, duration: 0.35 }}
        >
          {/* Block rect */}
          <rect x={b.x} y={by} width={bw} height={bh} rx={6}
            fill={`${b.color}11`} stroke={b.color} strokeWidth={1.5} />
          <text x={b.x + bw / 2} y={by + 18} textAnchor="middle"
            fontSize={10} fontWeight="700" fill={b.color}>{b.label}</text>

          {/* Prev hash field */}
          <rect x={b.x + 8} y={by + 28} width={bw - 16} height={18} rx={3}
            fill={`${ORANGE}15`} stroke={ORANGE} strokeWidth={0.7} />
          <text x={b.x + bw / 2} y={by + 40} textAnchor="middle"
            fontSize={7} fill={ORANGE}>Prev Hash</text>

          {/* Merkle root field */}
          <rect x={b.x + 8} y={by + 52} width={bw - 16} height={18} rx={3}
            fill={`${b.color}10`} stroke={b.color} strokeWidth={0.5} strokeOpacity={0.4} />
          <text x={b.x + bw / 2} y={by + 64} textAnchor="middle"
            fontSize={7} fill="hsl(var(--foreground))" fillOpacity={0.6}>Merkle Root</text>

          {/* Nonce field */}
          <rect x={b.x + 8} y={by + 76} width={bw - 16} height={18} rx={3}
            fill={`${b.color}10`} stroke={b.color} strokeWidth={0.5} strokeOpacity={0.4} />
          <text x={b.x + bw / 2} y={by + 88} textAnchor="middle"
            fontSize={7} fill="hsl(var(--foreground))" fillOpacity={0.6}>Nonce</text>

          {/* Tx section */}
          <rect x={b.x + 8} y={by + 100} width={bw - 16} height={22} rx={3}
            fill={`${b.color}08`} stroke={b.color} strokeWidth={0.5} strokeOpacity={0.3} />
          <text x={b.x + bw / 2} y={by + 114} textAnchor="middle"
            fontSize={7} fill="hsl(var(--foreground))" fillOpacity={0.4}>Txs...</text>

          {/* Chain arrow from prev block */}
          {i > 0 && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.2, duration: 0.3 }}
            >
              <line
                x1={blocks[i - 1].x + bw} y1={by + 37}
                x2={b.x} y2={by + 37}
                stroke={ORANGE} strokeWidth={1.5} strokeDasharray="4 2"
              />
              <text
                x={(blocks[i - 1].x + bw + b.x) / 2} y={by + 32}
                textAnchor="middle" fontSize={7} fill={ORANGE}
              >
                Hash(N{i > 1 ? '' : '-1'})
              </text>
            </motion.g>
          )}
        </motion.g>
      ))}

      {/* Immutability note */}
      <motion.text
        x={195} y={by + bh + 25} textAnchor="middle"
        fontSize={8} fill="hsl(var(--foreground))" fillOpacity={0.5}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.3 }}
      >
        Prev Hash로 연결 → 변조 시 이후 모든 해시가 불일치
      </motion.text>
    </motion.g>
  );
}

export default function BlockStructureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 390 220" className="w-full max-w-[520px]" style={{ height: 'auto' }}>
          {step === 0 && <SingleBlock animate />}
          {step === 1 && <MerkleHashing />}
          {step === 2 && <BlockChain />}
        </svg>
      )}
    </StepViz>
  );
}
