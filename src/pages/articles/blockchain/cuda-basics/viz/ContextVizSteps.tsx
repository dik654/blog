import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepWhat() {
  const lines = [
    { line: '__global__ void add(float *a, float *b, float *c) {', c: C.cuda, y: 38 },
    { line: '  int tid = blockIdx.x * blockDim.x + threadIdx.x;', c: C.cuda, y: 58 },
    { line: '  if (tid < n) c[tid] = a[tid] + b[tid];', c: C.ok, y: 78 },
    { line: '}', c: C.cuda, y: 96 },
    { line: 'add<<<4, 256>>>(d_a, d_b, d_c);  // 1024 스레드', c: C.gpu, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cuda}>CUDA 커널 함수 구조</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={15} y={l.y - 13} width={400} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={25} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepDiff() {
  const lines = [
    { line: 'int tid = blockIdx.x * blockDim.x + threadIdx.x;', c: C.cuda, y: 38 },
    { line: '// blockIdx.x  = 현재 블록 번호 (0..3)', c: C.cuda, y: 60 },
    { line: '// blockDim.x  = 블록당 스레드 수 (256)', c: C.ok, y: 80 },
    { line: '// threadIdx.x = 블록 내 스레드 번호 (0..255)', c: C.ok, y: 100 },
    { line: '// tid = 0..1023 → 전역 고유 인덱스', c: C.gpu, y: 122 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cuda}>스레드 인덱싱: global tid 계산</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={15} y={l.y - 13} width={410} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={25} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
