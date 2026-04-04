import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepCpuGpu() {
  const lines = [
    { line: '// RTX 4090 (Ada Lovelace, SM 아키텍처)', c: C.gpu, y: 38 },
    { line: 'SM_count         = 128', c: C.gpu, y: 58 },
    { line: 'FP32_per_SM      = 128  // CUDA 코어', c: C.gpu, y: 78 },
    { line: 'Total_FP32       = 16384 코어', c: C.ok, y: 98 },
    { line: 'Shared_mem_per_SM = 64 KB', c: C.mem, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.gpu}>SM 구조: 코어 + 공유 메모리</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={30} y={l.y - 13} width={370} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={40} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepBlockchain() {
  const lines = [
    { line: '// MSM: SM별 버킷 분산', c: C.gpu, y: 38 },
    { line: 'bucket[sm_id] += point[i] * scalar[i]  // 독립', c: C.gpu, y: 58 },
    { line: '// NTT: 공유 메모리 나비 연산', c: C.mem, y: 82 },
    { line: 'shared[j] = a + w*b; shared[j+n/2] = a - w*b', c: C.mem, y: 102 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>ZK 연산의 GPU 병렬 매핑</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={20} y={l.y - 13} width={390} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
