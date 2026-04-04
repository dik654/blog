import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: '실행', sub: 'SHARD_SIZE 사이클', color: '#6366f1' },
  { label: '샤드 분할', sub: '체크포인트 경계', color: '#10b981' },
  { label: '병렬 트레이스', sub: 'par_iter 생성', color: '#f59e0b' },
  { label: '병렬 증명', sub: '샤드별 ShardProof', color: '#8b5cf6' },
  { label: '수집', sub: 'Vec<ShardProof>', color: '#ec4899' },
  { label: 'CoreProof', sub: 'SP1CoreProof', color: '#ef4444' },
];

const NW = 78, GAP = 82, SY = 40;
const nx = (i: number) => 4 + i * GAP;
const EDGES = ['bump_shard()', '체크포인트', 'Record', 'ShardProof', '합산'];

const STEPS = [
  { label: '실행', body: 'RISC-V 명령어를 SHARD_SIZE(~400만) 사이클까지 실행합니다.' },
  { label: '샤드 분할', body: 'bump_shard()가 ExecutionRecord를 완료하고 체크포인트를 저장합니다.' },
  { label: '병렬 트레이스', body: '각 체크포인트에서 Trace 모드로 재실행해 레코드를 병렬 생성합니다.' },
  { label: '병렬 증명', body: 'rayon par_iter로 각 샤드의 STARK 증명을 동시 생성합니다.' },
  { label: '수집', body: '모든 ShardProof를 Vec로 수집합니다.' },
  { label: 'CoreProof', body: 'SP1CoreProof = 전체 프로그램의 Core 증명 완성.' },
];

export default function ShardPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 640 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="sp-ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {EDGES.map((lbl, i) => step > i && (
            <motion.g key={`e${i}`} initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>
              <line x1={nx(i) + NW} y1={SY + 19} x2={nx(i + 1)} y2={SY + 19}
                stroke="var(--muted-foreground)" strokeWidth={1.2} markerEnd="url(#sp-ah)" />
              <rect x={(nx(i) + NW + nx(i + 1)) / 2 - 20} y={SY + 6} width={40} height={11} rx={2} fill="var(--card)" />
              <text x={(nx(i) + NW + nx(i + 1)) / 2} y={SY + 13}
                textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{lbl}</text>
            </motion.g>
          ))}
          {NODES.map((n, i) => i <= step && (
            <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}>
              <rect x={nx(i)} y={SY} width={NW} height={38} rx={7}
                fill={n.color + '18'} stroke={n.color} strokeWidth={step === i ? 2 : 1} />
              <text x={nx(i) + NW / 2} y={SY + 15} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={n.color}>{n.label}</text>
              <text x={nx(i) + NW / 2} y={SY + 28} textAnchor="middle"
                fontSize={9} fill="var(--muted-foreground)">{n.sub}</text>
            </motion.g>
          ))}
          {/* Parallel hint at steps 2-3 */}
          {(step === 2 || step === 3) && (
            <motion.text x={nx(step) + NW / 2} y={SY + 52} textAnchor="middle"
              fontSize={9} fill={NODES[step].color}
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>rayon 병렬</motion.text>
          )}
        </svg>
      )}
    </StepViz>
  );
}
