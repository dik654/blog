import { motion } from 'framer-motion';
import StepViz from '../../../../../components/ui/step-viz';

const C = { blue: '#60a5fa', orange: '#f97316', green: '#22c55e', purple: '#a78bfa' };

const STEPS = [
  {
    label: 'Step 1: RLP vs SSZ 비교',
    body: 'RLP는 스키마 없이(schema-less) 재귀적 인코딩. SSZ는 스키마 기반(schema-aware)으로 고정 크기 타입과 가변 크기 타입을 명확히 구분합니다.',
  },
  {
    label: 'Step 2: SSZ Fixed/Variable 인코딩',
    body: 'Fixed-size 필드는 고정 오프셋으로 직접 접근. Variable-size 필드는 오프셋 테이블을 통해 간접 접근합니다. Little-endian 바이트 순서를 사용합니다.',
  },
  {
    label: 'Step 3: Merkleization — 데이터에서 머클 트리로',
    body: '직렬화된 데이터를 32-byte 청크로 분할하고, SHA-256 기반 바이너리 머클 트리를 구성하여 hash_tree_root를 계산합니다.',
  },
];

function Box({ x, y, w, h, label, sub, color, delay = 0 }: {
  x: number; y: number; w: number; h: number; label: string; sub?: string; color: string; delay?: number;
}) {
  return (
    <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={`${color}18`} stroke={color} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h / 2 + (sub ? -4 : 4)} textAnchor="middle" fontSize={10} fontWeight="700" fill={color}>{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))">{sub}</text>}
    </motion.g>
  );
}

function Arrow({ x1, y1, x2, y2, color, delay = 0 }: {
  x1: number; y1: number; x2: number; y2: number; color: string; delay?: number;
}) {
  return (
    <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1.5} markerEnd="url(#arrowhead)"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.7 }}
      transition={{ duration: 0.4, delay }} />
  );
}

function Step0() {
  return (
    <g>
      <Box x={20} y={20} w={130} h={80} label="RLP" sub="Schema-less" color={C.orange} />
      <text x={85} y={125} textAnchor="middle" fontSize={8} fill="hsl(var(--muted-foreground))">재귀적 길이 접두사</text>
      <text x={85} y={137} textAnchor="middle" fontSize={8} fill="hsl(var(--muted-foreground))">Big-endian / Keccak-256</text>

      <motion.text x={190} y={65} textAnchor="middle" fontSize={18} fill="hsl(var(--muted-foreground))"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        →
      </motion.text>

      <Box x={220} y={20} w={130} h={80} label="SSZ" sub="Schema-aware" color={C.blue} delay={0.2} />
      <text x={285} y={125} textAnchor="middle" fontSize={8} fill="hsl(var(--muted-foreground))">결정론적 직렬화</text>
      <text x={285} y={137} textAnchor="middle" fontSize={8} fill="hsl(var(--muted-foreground))">Little-endian / SHA-256</text>
    </g>
  );
}

function Step1() {
  return (
    <g>
      <Box x={10} y={10} w={160} h={40} label="Container (Fixed Fields)" color={C.blue} />
      <Box x={15} y={60} w={50} h={30} label="uint64" sub="8 bytes" color={C.green} delay={0.1} />
      <Box x={70} y={60} w={50} h={30} label="uint32" sub="4 bytes" color={C.green} delay={0.15} />
      <Box x={125} y={60} w={40} h={30} label="bool" sub="1 byte" color={C.green} delay={0.2} />

      <Box x={200} y={10} w={160} h={40} label="Container (Variable Fields)" color={C.orange} delay={0.3} />
      <Box x={205} y={60} w={70} h={30} label="offset table" sub="4B per field" color={C.purple} delay={0.4} />
      <Box x={280} y={60} w={75} h={30} label="var data" sub="List, Bitlist" color={C.orange} delay={0.5} />

      <Arrow x1={240} y1={90} x2={317} y2={90} color={C.purple} delay={0.5} />
      <motion.text x={270} y={105} textAnchor="middle" fontSize={7} fill={C.purple}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        offset → data
      </motion.text>
    </g>
  );
}

function Step2() {
  return (
    <g>
      {/* Chunks */}
      <Box x={10} y={15} w={60} h={25} label="Chunk 0" color={C.blue} delay={0} />
      <Box x={75} y={15} w={60} h={25} label="Chunk 1" color={C.blue} delay={0.05} />
      <Box x={140} y={15} w={60} h={25} label="Chunk 2" color={C.blue} delay={0.1} />
      <Box x={205} y={15} w={60} h={25} label="Chunk 3" color={C.blue} delay={0.15} />
      <text x={140} y={55} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))">32-byte chunks (leaves)</text>

      {/* Level 1 */}
      <Arrow x1={40} y1={40} x2={72} y2={70} color={C.green} delay={0.2} />
      <Arrow x1={105} y1={40} x2={72} y2={70} color={C.green} delay={0.2} />
      <Box x={42} y={65} w={60} h={25} label="H(0,1)" color={C.green} delay={0.3} />

      <Arrow x1={170} y1={40} x2={200} y2={70} color={C.green} delay={0.25} />
      <Arrow x1={235} y1={40} x2={200} y2={70} color={C.green} delay={0.25} />
      <Box x={170} y={65} w={60} h={25} label="H(2,3)" color={C.green} delay={0.35} />

      {/* Root */}
      <Arrow x1={72} y1={90} x2={135} y2={115} color={C.purple} delay={0.4} />
      <Arrow x1={200} y1={90} x2={135} y2={115} color={C.purple} delay={0.4} />
      <Box x={100} y={110} w={75} h={30} label="hash_tree_root" color={C.purple} delay={0.5} />

      <motion.text x={310} y={80} textAnchor="middle" fontSize={8} fontWeight="600" fill={C.purple}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        SHA-256
      </motion.text>
      <motion.text x={310} y={95} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
        Binary Merkle Tree
      </motion.text>
    </g>
  );
}

export default function SSZViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 380 155" className="w-full max-w-[480px]" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="hsl(var(--muted-foreground))" opacity={0.5} />
            </marker>
          </defs>
          {step === 0 && <Step0 />}
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
        </svg>
      )}
    </StepViz>
  );
}
