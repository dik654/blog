import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const K1 = 3, K2 = 3, N = 5;
const C = { src: '#3b82f6', row: '#10b981', col: '#f59e0b', dist: '#8b5cf6' };

const STEPS = [
  { label: '원본 데이터: k1×k2 심볼 행렬', body: `블롭을 ${K1}×${K2} 행렬로 배치합니다. 파란색이 원본 데이터 영역입니다.` },
  { label: '행 방향 RS 인코딩 → Secondary 슬라이버', body: '각 행에 Reed-Solomon 확장. 초록색이 행 복구 심볼(Secondary)입니다.' },
  { label: '열 방향 RS 인코딩 → Primary 슬라이버', body: '각 열에 Reed-Solomon 확장. 주황색이 열 복구 심볼(Primary)입니다.' },
  { label: '노드 i에 Primary[i] + Secondary[n-1-i] 배포', body: '각 노드가 하나의 열(Primary)과 하나의 행(Secondary)을 보유합니다.' },
];

const sz = 28, gap = 3, ox = 120, oy = 20;
const cx = (c: number) => ox + c * (sz + gap);
const ry = (r: number) => oy + r * (sz + gap);

export default function WalrusMatrixViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {Array.from({ length: N }, (_, r) =>
            Array.from({ length: N }, (_, c) => {
              const isSrc = r < K1 && c < K2;
              const isRow = r < K1 && c >= K2;
              const isCol = r >= K1 && c < K2;
              const show = isSrc ? step >= 0
                : isRow ? step >= 1
                : isCol ? step >= 2
                : step >= 2;
              const col = isSrc ? C.src : isRow ? C.row : isCol ? C.col : '#6b7280';
              return (
                <motion.g key={`${r}-${c}`}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: show ? 1 : 0.1, scale: show ? 1 : 0.7 }}
                  transition={{ duration: 0.2, delay: show ? (r + c) * 0.03 : 0 }}>
                  <rect x={cx(c)} y={ry(r)} width={sz} height={sz} rx={4}
                    fill={col + '20'} stroke={col} strokeWidth={show ? 1.2 : 0.5} />
                  <text x={cx(c) + sz / 2} y={ry(r) + sz / 2 + 3} textAnchor="middle"
                    fontSize={9} fill={col} fontWeight={600}>
                    {isSrc ? '■' : isRow ? 'R' : isCol ? 'C' : '·'}
                  </text>
                </motion.g>
              );
            })
          )}
          {/* Row/Col labels */}
          {Array.from({ length: N }, (_, i) => (
            <text key={`rl${i}`} x={ox - 10} y={ry(i) + sz / 2 + 3} textAnchor="end"
              fontSize={9} fill="var(--muted-foreground)">{i < K1 ? `row${i}` : `↓${i - K1}`}</text>
          ))}
          {Array.from({ length: N }, (_, i) => (
            <text key={`cl${i}`} x={cx(i) + sz / 2} y={oy - 6} textAnchor="middle"
              fontSize={9} fill="var(--muted-foreground)">{i < K2 ? `s${i}` : `r${i - K2}`}</text>
          ))}
          {/* Distribution arrows */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[0, 1, 2].map(i => (
                <motion.text key={`d${i}`}
                  x={cx(N) + 20} y={ry(i) + sz / 2 + 3}
                  fontSize={9} fill={C.dist} fontWeight={600}
                  initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  → 노드 {i}
                </motion.text>
              ))}
            </motion.g>
          )}
          {/* Legend */}
          {[
            { label: '원본', color: C.src, y: 170 },
            { label: 'Secondary', color: C.row, y: 170 },
            { label: 'Primary', color: C.col, y: 170 },
          ].map((l, i) => (
            <g key={l.label}>
              <rect x={ox + i * 100} y={l.y} width={10} height={10} rx={2} fill={l.color + '40'} stroke={l.color} />
              <text x={ox + i * 100 + 14} y={l.y + 8} fontSize={9} fill="var(--muted-foreground)">{l.label}</text>
            </g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
