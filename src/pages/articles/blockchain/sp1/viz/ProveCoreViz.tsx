import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'Runtime 설정', sub: 'Program + Stdin', color: '#6366f1' },
  { label: 'Phase 1', sub: '체크포인트 생성', color: '#10b981' },
  { label: 'Phase 2', sub: '레코드 생성 (병렬)', color: '#f59e0b' },
  { label: '커밋', sub: 'Reed-Solomon + Merkle', color: '#8b5cf6' },
  { label: 'FRI 오프닝', sub: '랜덤 질의 응답', color: '#ec4899' },
  { label: 'ShardProof', sub: 'Core STARK 증명', color: '#ef4444' },
];

const NW = 78, GAP = 82, SY = 40;
const nx = (i: number) => 4 + i * GAP;
const EDGES = ['실행 시작', '체크포인트', '트레이스', 'Merkle root', '검증 데이터'];

const STEPS = [
  { label: 'Runtime 설정', body: 'Program과 SP1Stdin을 Executor에 로드합니다.' },
  { label: 'Phase 1', body: 'Checkpoint 모드로 실행, 샤드 경계마다 메모리 스냅샷 저장.' },
  { label: 'Phase 2', body: '각 체크포인트에서 Trace 모드로 재실행, ExecutionRecord 병렬 생성.' },
  { label: '커밋', body: '트레이스 행렬을 Reed-Solomon 인코딩 후 Merkle 트리로 커밋.' },
  { label: 'FRI 오프닝', body: '검증자의 랜덤 질의에 대한 다항식 평가 응답을 생성합니다.' },
  { label: 'ShardProof', body: '최종 Core STARK 증명이 생성됩니다.' },
];

export default function ProveCoreViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 640 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="pc-ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {EDGES.map((lbl, i) => step > i && (
            <motion.g key={`e${i}`} initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>
              <line x1={nx(i) + NW} y1={SY + 19} x2={nx(i + 1)} y2={SY + 19}
                stroke="var(--muted-foreground)" strokeWidth={1.2} markerEnd="url(#pc-ah)" />
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
          {/* Final proof glow */}
          {step === 5 && (
            <motion.rect x={nx(5) - 2} y={SY - 2} width={NW + 4} height={42} rx={9}
              fill="none" stroke="#ef4444" strokeWidth={1.5}
              initial={{ opacity: 0 }} animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }} />
          )}
        </svg>
      )}
    </StepViz>
  );
}
