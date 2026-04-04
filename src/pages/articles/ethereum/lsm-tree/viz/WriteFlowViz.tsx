import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const CW = '#6366f1', CM = '#10b981', CS = '#f59e0b', CI = '#ef4444';

const STEPS = [
  { label: '1단계: WAL에 기록', body: '쓰기 요청이 오면 먼저 WAL(Write-Ahead Log)에 순차 기록. 프로세스가 죽어도 WAL에서 복구 가능.' },
  { label: '2단계: Memtable에 삽입', body: 'WAL 기록 후 메모리의 Memtable(Skip List 또는 Red-Black Tree)에 삽입. O(log n) 연산으로 정렬 상태 유지.' },
  { label: '3단계: Immutable로 전환', body: 'Memtable이 크기 한도(보통 4MB)에 도달하면 Immutable Memtable로 동결. 새 Memtable을 생성하여 쓰기를 계속 받음.' },
  { label: '4단계: SSTable로 flush', body: '백그라운드 스레드가 Immutable Memtable을 정렬된 SSTable 파일로 디스크에 순차 기록. 데이터 블록 + 블룸 필터 + 인덱스 블록으로 구성.' },
];

export default function WriteFlowViz() {
  const bx = [30, 140, 270, 400];

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="wfArr" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" /></marker>
          </defs>

          {/* WAL */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.2, scale: step === 0 ? 1.03 : 1 }}>
            <rect x={bx[0]} y={40} width={90} height={60} rx={5} fill={`${CW}10`} stroke={CW} strokeWidth={step === 0 ? 1.5 : 0.7} />
            <text x={bx[0] + 45} y={62} textAnchor="middle" fontSize={11} fontWeight={600} fill={CW}>WAL</text>
            <text x={bx[0] + 45} y={80} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">순차 append</text>
            <text x={bx[0] + 45} y={34} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">디스크</text>
          </motion.g>

          {/* Arrow WAL → Memtable */}
          <motion.line x1={bx[0] + 90} y1={70} x2={bx[1]} y2={70} stroke="var(--muted-foreground)" strokeWidth={1}
            animate={{ opacity: step >= 1 ? 1 : 0.2 }} markerEnd="url(#wfArr)" />

          {/* Memtable */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.2, scale: step === 1 ? 1.03 : 1 }}>
            <rect x={bx[1]} y={40} width={110} height={60} rx={5} fill={`${CM}10`} stroke={CM} strokeWidth={step === 1 ? 1.5 : 0.7} />
            <text x={bx[1] + 55} y={62} textAnchor="middle" fontSize={11} fontWeight={600} fill={CM}>Memtable</text>
            <text x={bx[1] + 55} y={80} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Skip List / RB-tree</text>
            <text x={bx[1] + 55} y={34} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">메모리</text>
          </motion.g>

          {/* Arrow Memtable → Immutable */}
          <motion.line x1={bx[1] + 110} y1={70} x2={bx[2]} y2={70} stroke="var(--muted-foreground)" strokeWidth={1}
            animate={{ opacity: step >= 2 ? 1 : 0.2 }} markerEnd="url(#wfArr)" />

          {/* Immutable Memtable */}
          <motion.g animate={{ opacity: step >= 2 ? 1 : 0.2, scale: step === 2 ? 1.03 : 1 }}>
            <rect x={bx[2]} y={40} width={110} height={60} rx={5} fill={`${CI}10`} stroke={CI} strokeWidth={step === 2 ? 1.5 : 0.7} strokeDasharray={step >= 2 ? '4,2' : '0'} />
            <text x={bx[2] + 55} y={62} textAnchor="middle" fontSize={10} fontWeight={600} fill={CI}>Immutable</text>
            <text x={bx[2] + 55} y={80} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">동결 (읽기 전용)</text>
            <text x={bx[2] + 55} y={34} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">메모리</text>
          </motion.g>

          {/* Arrow Immutable → SSTable */}
          <motion.line x1={bx[2] + 110} y1={70} x2={bx[3]} y2={70} stroke="var(--muted-foreground)" strokeWidth={1}
            animate={{ opacity: step >= 3 ? 1 : 0.2 }} markerEnd="url(#wfArr)" />

          {/* SSTable */}
          <motion.g animate={{ opacity: step >= 3 ? 1 : 0.2, scale: step === 3 ? 1.03 : 1 }}>
            <rect x={bx[3]} y={30} width={100} height={80} rx={5} fill={`${CS}10`} stroke={CS} strokeWidth={step === 3 ? 1.5 : 0.7} />
            <text x={bx[3] + 50} y={50} textAnchor="middle" fontSize={11} fontWeight={600} fill={CS}>SSTable</text>
            {/* Sub-blocks inside SSTable */}
            {['Data', 'Bloom', 'Index'].map((b, i) => (
              <g key={b}>
                <rect x={bx[3] + 8} y={58 + i * 16} width={84} height={13} rx={3} fill={`${CS}08`} stroke={CS} strokeWidth={0.5} />
                <text x={bx[3] + 50} y={68 + i * 16} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{b}</text>
              </g>
            ))}
            <text x={bx[3] + 50} y={24} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">디스크 (L0)</text>
          </motion.g>

          {/* Put(k,v) label */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.3 }}>
            <text x={bx[0] - 5} y={74} textAnchor="end" fontSize={10} fontWeight={600} fill="var(--foreground)">Put(k,v)</text>
            <line x1={bx[0] - 3} y1={70} x2={bx[0]} y2={70} stroke="var(--foreground)" strokeWidth={1} markerEnd="url(#wfArr)" />
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
