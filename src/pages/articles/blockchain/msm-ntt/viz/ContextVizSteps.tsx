import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepTwoOps() {
  const lines = [
    { line: '__global__ void msm_bucket_kernel(', c: C.msm, y: 38 },
    { line: '    Point *points, Scalar *scalars, Point *buckets) {', c: C.msm, y: 58 },
    { line: '  int tid = blockIdx.x * blockDim.x + threadIdx.x;', c: C.msm, y: 78 },
    { line: '  int window = (scalars[tid] >> (w * win_idx)) & mask;', c: C.ok, y: 98 },
    { line: '  atomicAdd(&buckets[window], points[tid]);', c: C.ok, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.msm}>MSM 커널: 버킷 누적</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={10} y={l.y - 13} width={420} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={20} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepSlow() {
  const lines = [
    { line: '__global__ void ntt_butterfly(Fr *data, Fr w, int n) {', c: C.ntt, y: 38 },
    { line: '  __shared__ Fr tile[1024];  // 공유 메모리 할당', c: C.ntt, y: 58 },
    { line: '  tile[threadIdx.x] = data[blockIdx.x*1024+threadIdx.x];', c: C.ntt, y: 78 },
    { line: '  __syncthreads();  // 블록 내 동기화', c: C.err, y: 98 },
    { line: '  Fr t = w * tile[j + half];  // 나비 연산', c: C.ok, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ntt}>NTT 커널: 나비 연산</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={10} y={l.y - 13} width={420} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={20} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
