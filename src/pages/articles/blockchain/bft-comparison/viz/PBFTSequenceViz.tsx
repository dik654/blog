import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: '클라이언트', color: '#6366f1' },
  { label: 'Primary', color: '#10b981' },
  { label: 'Pre-Prepare', color: '#f59e0b' },
  { label: 'Prepare', color: '#8b5cf6' },
  { label: 'Commit', color: '#ec4899' },
  { label: 'Reply', color: '#ef4444' },
];

const EDGES = ['Request', '시퀀스 번호 부여', '전체 브로드캐스트', '2f+1 수집', '실행 완료'];

const STEPS = [
  { label: '클라이언트 요청', body: '클라이언트가 Primary 노드에 요청 전송' },
  { label: 'Primary 수신', body: 'Primary(리더)가 요청을 수신, 처리 시작' },
  { label: 'Pre-Prepare', body: 'Primary가 시퀀스 번호를 부여하고 모든 Replica에게 브로드캐스트' },
  { label: 'Prepare', body: '2f+1 Prepare 메시지 수집 → 순서 합의. O(n²) 통신' },
  { label: 'Commit', body: '2f+1 Commit 수집 → 요청 실행. 되돌릴 수 없음' },
  { label: 'Reply', body: '실행 결과를 클라이언트에 반환. f+1 동일 Reply로 확인' },
];

const NW = 72, NH = 34, GAP = 86, SY = 60, LY = 28;
function nx(i: number) { return 10 + i * GAP; }

export default function PBFTSequenceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="pbft-ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {/* 엣지 라벨 — 박스 위에 배치하여 겹침 방지 */}
          {EDGES.map((lbl, i) => {
            const x1 = nx(i) + NW / 2, x2 = nx(i + 1) + NW / 2;
            const mx = (x1 + x2) / 2, visible = i < step;
            return (
              <motion.g key={`e-${i}`} initial={{ opacity: 0 }} animate={{ opacity: visible ? 0.7 : 0 }}>
                <path d={`M${x1},${SY - NH / 2} Q${mx},${LY} ${x2},${SY - NH / 2}`}
                  fill="none" stroke="var(--muted-foreground)" strokeWidth={0.8}
                  markerEnd="url(#pbft-ah)" />
                <rect x={mx - 36} y={LY - 8} width={72} height={14} rx={2} fill="var(--background)" />
                <text x={mx} y={LY + 3} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{lbl}</text>
              </motion.g>
            );
          })}
          {/* Reply 반환 화살표 */}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>
              <path d={`M${nx(5) + NW / 2},${SY + NH / 2} Q${270},${SY + 50} ${nx(0) + NW / 2},${SY + NH / 2}`}
                fill="none" stroke="#ef4444" strokeWidth={1} markerEnd="url(#pbft-ah)" strokeDasharray="3,3" />
              <rect x={240} y={SY + 42} width={60} height={14} rx={2} fill="var(--background)" />
              <text x={270} y={SY + 53} textAnchor="middle" fontSize={10} fill="#ef4444">결과 반환</text>
            </motion.g>
          )}
          {/* 노드 — 엣지 위에 렌더 */}
          {NODES.map((n, i) => {
            const x = nx(i), visible = i <= step, glow = i === step;
            return (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0.15 }}
                transition={{ duration: 0.3 }}>
                <rect x={x} y={SY - NH / 2} width={NW} height={NH} rx={6}
                  fill={glow ? n.color + '22' : 'var(--background)'} stroke={n.color}
                  strokeWidth={glow ? 2 : 1} />
                <text x={x + NW / 2} y={SY + 5} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
