import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepAlgo() {
  const lines = [
    { line: '// Pippenger: O(n / log n) 복잡도', c: C.msm, y: 38 },
    { line: 'w = optimal_window(n)  // ex: w=16 for n=2^24', c: C.msm, y: 58 },
    { line: 'windows = ceil(256 / w)  // 스칼라 256비트 기준', c: C.ok, y: 78 },
    { line: 'buckets = 2^w per window  // 독립 누적 후 합산', c: C.ok, y: 98 },
    { line: '// 각 윈도우 내 2^w 버킷 → SM별 분산 병렬화', c: C.zk, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.msm}>Pippenger 윈도우 분할</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={10} y={l.y - 13} width={420} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={20} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepGPU() {
  const lines = [
    { line: '// MSM 2^24 points 벤치마크', c: C.ok, y: 38 },
    { line: 'CPU (32-core Xeon) : ~120.0 초', c: C.err, y: 58 },
    { line: 'RTX 4090  (16384코어, 24GB, 1008 GB/s) :  1.2 초', c: C.msm, y: 78 },
    { line: 'A100 80GB (6912코어, 80GB, 2039 GB/s) :  0.8 초', c: C.ntt, y: 98 },
    { line: 'H100 SXM  (16896코어, 80GB, 3352 GB/s) :  0.5 초', c: C.ok, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>GPU 벤치마크: MSM 2^24</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={10} y={l.y - 13} width={420} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={20} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
