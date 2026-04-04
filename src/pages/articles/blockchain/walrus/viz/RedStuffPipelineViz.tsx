import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { id: 'blob',   label: '원본 블롭',     color: '#6366f1', x: 40 },
  { id: 'matrix', label: '매트릭스',      color: '#8b5cf6', x: 100 },
  { id: 'rowRS',  label: '행 RS 인코딩',  color: '#10b981', x: 175 },
  { id: 'colRS',  label: '열 RS 인코딩',  color: '#f59e0b', x: 175 },
  { id: 'pair',   label: '슬라이버 쌍',   color: '#ec4899', x: 250 },
  { id: 'merkle', label: 'Merkle 메타',  color: '#0ea5e9', x: 320 },
  { id: 'dist',   label: '노드 배포',     color: '#6b7280', x: 390 },
];
const ROW_Y = 30, COL_Y = 65, MID_Y = 48;

const STEPS = [
  { label: '원본 블롭', body: '클라이언트가 walrus store 명령으로 블롭을 업로드합니다.' },
  { label: '매트릭스 구성', body: '블롭을 k1(=n-2f) x k2(=n-f) 심볼로 행 우선 배열합니다.' },
  { label: '2D RS 인코딩', body: '행(Secondary)과 열(Primary) Reed-Solomon을 SIMD로 병렬 실행합니다.' },
  { label: '슬라이버 쌍', body: 'Primary[i]와 Secondary[n-1-i]를 쌍으로 묶어 교차 복구를 보장합니다.' },
  { label: 'Merkle 메타데이터', body: 'n x n 심볼 해시 행렬로 Blake2b256 Merkle 트리를 생성합니다.' },
  { label: '노드 배포', body: 'Sui 체인에 메타데이터 등록 후 각 노드에 슬라이버 쌍을 전송합니다.' },
];

const VIS = [[0], [0, 1], [0, 1, 2, 3], [0, 1, 2, 3, 4], [0, 1, 2, 3, 4, 5], [0, 1, 2, 3, 4, 5, 6]];
const GLOW = [0, 1, 2, 4, 5, 6];

export default function RedStuffPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 570 90" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const vis = VIS[step].includes(i);
            const glow = GLOW[step] === i;
            const ny = (i === 2) ? ROW_Y : (i === 3) ? COL_Y : MID_Y;
            return (
              <motion.g key={n.id} animate={{ opacity: vis ? 1 : 0.12 }} transition={{ duration: 0.35 }}>
                <rect x={n.x - 32} y={ny - 11} width={64} height={22} rx={5}
                  fill={`${n.color}${glow ? '28' : '10'}`} stroke={n.color}
                  strokeWidth={glow ? 2 : 1} />
                <text x={n.x} y={ny + 3} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
          {/* Edges: blob→matrix→rowRS/colRS→pair→merkle→dist */}
          {[[0, 1], [1, 2], [1, 3], [2, 4], [3, 4], [4, 5], [5, 6]].map(([a, b], i) => {
            const na = NODES[a], nb = NODES[b];
            const ay = (a === 2) ? ROW_Y : (a === 3) ? COL_Y : MID_Y;
            const by = (b === 2) ? ROW_Y : (b === 3) ? COL_Y : MID_Y;
            const show = VIS[step].includes(a) && VIS[step].includes(b);
            return (
              <motion.line key={i} x1={na.x + 33} y1={ay} x2={nb.x - 33} y2={by}
                stroke="var(--muted-foreground)" strokeWidth={0.8}
                animate={{ opacity: show ? 0.4 : 0.06 }} transition={{ duration: 0.3 }} />
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
