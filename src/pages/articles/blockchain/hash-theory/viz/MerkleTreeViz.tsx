import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';
const STEPS = [
  { label: 'Merkle Tree 구조', body: '리프에 데이터 해시, 내부 노드에 자식 해시의 해시를 저장.\n루트 하나로 전체 데이터 무결성 검증.' },
  { label: '멤버십 증명 (Inclusion Proof)', body: '특정 데이터가 트리에 포함됨을 증명.\nsibling 해시 log n개 + 루트만 있으면 검증 가능.' },
  { label: 'ZKP에서의 활용', body: 'ZK 회로 안에서 Merkle 경로를 검증.\nPoseidon 해시 × 트리 깊이(log n)로 멤버십 증명.' },
];

const NR = 12;
const T = [
  { x: 150, y: 24, l: 'Root' },
  { x: 95, y: 64, l: 'H01' }, { x: 205, y: 64, l: 'H23' },
  { x: 65, y: 104, l: 'H0' }, { x: 125, y: 104, l: 'H1' },
  { x: 185, y: 104, l: 'H2' }, { x: 245, y: 104, l: 'H3' },
  { x: 65, y: 144, l: 'D0' }, { x: 125, y: 144, l: 'D1' },
  { x: 185, y: 144, l: 'D2' }, { x: 245, y: 144, l: 'D3' },
];
const E = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [3, 7], [4, 8], [5, 9], [6, 10]];
const PATH = [8, 4, 1, 0], SIBS = [3, 2];

const LEVEL_NOTES: Record<number, [number, string, string][]> = {
  0: [
    [24, '← hash(H01 || H23)', C1],
    [64, '← hash(좌 자식 || 우 자식)', C1],
    [104, '← hash(D) — 데이터를 개별 해시', C1],
    [144, '← 원본 데이터 (트리 밖 입력)', '#94a3b8'],
  ],
  1: [
    [24, '← 루트: 검증의 기준점', C2],
    [64, '← 경로: D1→H1→H01→Root 재계산', C2],
    [104, '← sibling: H0, H23 (검증자에게 제공)', C3],
    [144, '← 멤버십 증명 대상: D1이 트리에 존재', C2],
  ],
  2: [
    [24, '← ZK 회로에서 루트 검증', C1],
    [64, '← 상태 갱신 증명', C1],
    [104, '← Poseidon 해시 사용 (ZK 친화)', C1],
    [144, '← 멤버십/비멤버십 증명', C1],
  ],
};

export default function MerkleTreeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 580 170" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {E.map(([a, b], ei) => {
            const pe = step === 1 && PATH.includes(a) && PATH.includes(b);
            const isDH = ei >= 6;
            return (
              <line key={`${a}-${b}`}
                x1={T[a].x} y1={T[a].y + NR} x2={T[b].x} y2={T[b].y - NR}
                stroke={pe ? C2 : 'var(--border)'}
                strokeWidth={pe ? 1.4 : 0.6}
                strokeDasharray={isDH ? '3 2' : 'none'} />
            );
          })}
          {T.map((n, i) => {
            const ip = step === 1 && PATH.includes(i);
            const is = step === 1 && SIBS.includes(i);
            const isData = i >= 7;
            const c = ip ? C2 : is ? C3 : isData ? '#94a3b8' : C1;
            const op = step === 0 || step >= 2 || ip || is ? 1 : 0.3;
            return (
              <motion.g key={i} animate={{ opacity: op }}>
                {isData ? (
                  <rect x={n.x - NR} y={n.y - NR} width={NR * 2} height={NR * 2} rx={3}
                    fill={`${c}12`} stroke={c} strokeWidth={0.8} />
                ) : (
                  <circle cx={n.x} cy={n.y} r={NR} fill={`${c}12`} stroke={c}
                    strokeWidth={(ip || is) ? 1.5 : 0.8} />
                )}
                <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={isData ? '#64748b' : c}>{n.l}</text>
                {is && <motion.text x={n.x} y={n.y - 16} textAnchor="middle" fontSize={9}
                  fill={C3} initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>sibling</motion.text>}
              </motion.g>
            );
          })}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={step}>
            {(LEVEL_NOTES[step] ?? []).map(([y, text, color]) => (
              <text key={y} x={275} y={y + 4} fontSize={11} fill={color}>{text}</text>
            ))}
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
