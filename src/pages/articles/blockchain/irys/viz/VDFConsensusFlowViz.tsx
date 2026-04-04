import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { id: 'prev',   label: '이전 블록',      color: '#6b7280', x: 40,  y: 45 },
  { id: 'vdf',    label: 'VDF 계산',       color: '#10b981', x: 110, y: 45 },
  { id: 'verify', label: 'VDF 검증',       color: '#6366f1', x: 180, y: 20 },
  { id: 'sample', label: '리콜 범위',      color: '#f59e0b', x: 180, y: 70 },
  { id: 'recall', label: '청크 리콜',      color: '#8b5cf6', x: 260, y: 70 },
  { id: 'pack',   label: '매트릭스 패킹',  color: '#ec4899', x: 340, y: 70 },
  { id: 'block',  label: '블록 생성',      color: '#ef4444', x: 340, y: 20 },
];

const EDGES: [number, number, string][] = [
  [0, 1, '해시 시드'], [1, 2, '체크포인트'], [1, 3, 'VDF 출력'],
  [3, 4, '리콜 오프셋'], [4, 5, '청크 데이터'],
  [5, 6, '패킹 증명'], [2, 6, '유효성 확인'],
];

const VIS = [[0], [0, 1], [0, 1, 2], [0, 1, 2, 3], [0, 1, 2, 3, 4], [0, 1, 2, 3, 4, 5], [0, 1, 2, 3, 4, 5, 6]];
const GLOW = [0, 1, 2, 3, 4, 5, 6];

const STEPS = [
  { label: '이전 블록 해시', body: '이전 블록의 해시가 VDF 계산의 시드로 사용됩니다.' },
  { label: 'VDF 순차 계산', body: 'SHA256을 수십만 회 반복합니다. 병렬화 불가능하므로 시간 증명으로 기능합니다.' },
  { label: 'VDF 검증', body: '중간 체크포인트로 O(root N) 복잡도로 빠르게 검증할 수 있습니다.' },
  { label: '리콜 범위 결정', body: 'VDF 출력값으로 데이터셋 내 리콜 오프셋을 결정합니다.' },
  { label: '청크 리콜', body: '해당 오프셋의 청크를 로컬 스토리지에서 읽어 저장 증명을 생성합니다.' },
  { label: '매트릭스 패킹', body: '노드별 고유 엔트로피로 XOR 패킹된 데이터를 검증합니다.' },
  { label: '블록 생성', body: 'VDF 증명 + 저장 증명을 포함한 블록을 생성하고 전파합니다.' },
];

export default function VDFConsensusFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 530 95" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map(([a, b, lbl], i) => {
            const na = NODES[a], nb = NODES[b];
            const show = VIS[step].includes(a) && VIS[step].includes(b);
            return (
              <motion.g key={i} animate={{ opacity: show ? 0.5 : 0.06 }} transition={{ duration: 0.3 }}>
                <line x1={na.x + 30} y1={na.y} x2={nb.x - 30} y2={nb.y}
                  stroke="var(--muted-foreground)" strokeWidth={0.8} />
                {(() => { const tx = (na.x + nb.x) / 2, ty = Math.min(na.y, nb.y) - 4; return (
                  <><rect x={tx - 18} y={ty - 5.5} width={36} height={8} rx={2} fill="var(--card)" />
                  <text x={tx} y={ty} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{lbl}</text></>
                ); })()}
              </motion.g>
            );
          })}
          {NODES.map((n, i) => {
            const vis = VIS[step].includes(i);
            const glow = GLOW[step] === i;
            return (
              <motion.g key={n.id} animate={{ opacity: vis ? 1 : 0.12 }} transition={{ duration: 0.35 }}>
                <rect x={n.x - 30} y={n.y - 11} width={60} height={22} rx={5}
                  fill={`${n.color}${glow ? '28' : '10'}`} stroke={n.color}
                  strokeWidth={glow ? 2 : 1} />
                <text x={n.x} y={n.y + 3} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
