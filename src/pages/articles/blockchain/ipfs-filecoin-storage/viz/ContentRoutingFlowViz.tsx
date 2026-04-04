import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const CID  = { label: 'CID 생성',      color: '#6366f1', x: 60,  y: 40 };
const DHT  = { label: 'Kademlia DHT',  color: '#8b5cf6', x: 160, y: 20 };
const IPNI = { label: 'IPNI 인덱서',    color: '#10b981', x: 160, y: 60 };
const PROV = { label: 'Provider 발견',  color: '#f59e0b', x: 260, y: 40 };
const BITS = { label: 'Bitswap 교환',   color: '#ec4899', x: 330, y: 40 };
const DAG  = { label: 'Merkle DAG',    color: '#ef4444', x: 400, y: 40 };
const ALL = [CID, DHT, IPNI, PROV, BITS, DAG];

const VIS = [[0], [0, 1, 2], [0, 1, 2, 3], [0, 1, 2, 3, 4], [0, 1, 2, 3, 4, 5]];
const GLOW = [0, 1, 3, 4, 5]; // which node glows at each step

const STEPS = [
  { label: 'CID 생성', body: '파일 콘텐츠를 SHA-256으로 해싱하여 CIDv1을 생성합니다.' },
  { label: 'DHT + IPNI 병렬 조회', body: 'Kademlia DHT와 IPNI(cid.contact) 인덱서에 동시 조회합니다.' },
  { label: 'Provider 발견', body: 'DHT는 O(log n) 홉으로, IPNI는 인덱스 기반으로 Provider를 찾습니다.' },
  { label: 'Bitswap 교환', body: 'WANT_HAVE로 블록 존재 확인 후 WANT_BLOCK으로 데이터를 요청합니다.' },
  { label: 'Merkle DAG 복원', body: '수신한 블록들을 Merkle DAG에 따라 조합하여 원본 파일을 복원합니다.' },
];

const EDGES: [number, number, string][] = [
  [0, 1, 'FindProvs'], [0, 2, '병렬 조회'],
  [1, 3, 'O(log n)'], [2, 3, '인덱스 응답'],
  [3, 4, 'WANT_HAVE'], [4, 5, '블록 수신'],
];

export default function ContentRoutingFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 600 85" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map(([a, b, lbl], i) => {
            const na = ALL[a], nb = ALL[b];
            const show = VIS[step].includes(a) && VIS[step].includes(b);
            return (
              <motion.g key={i} animate={{ opacity: show ? 0.5 : 0.08 }} transition={{ duration: 0.3 }}>
                <line x1={na.x + 36} y1={na.y} x2={nb.x - 36} y2={nb.y}
                  stroke="var(--muted-foreground)" strokeWidth={0.8} />
                {(() => { const tx = (na.x + nb.x) / 2, ty = Math.min(na.y, nb.y) - 5; return (
                  <><rect x={tx - 18} y={ty - 5.5} width={36} height={8} rx={2} fill="var(--card)" />
                  <text x={tx} y={ty} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{lbl}</text></>
                ); })()}
              </motion.g>
            );
          })}
          {ALL.map((n, i) => {
            const vis = VIS[step].includes(i);
            const glow = GLOW[step] === i;
            return (
              <motion.g key={i} animate={{ opacity: vis ? 1 : 0.12 }} transition={{ duration: 0.35 }}>
                <rect x={n.x - 35} y={n.y - 12} width={70} height={24} rx={5}
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
