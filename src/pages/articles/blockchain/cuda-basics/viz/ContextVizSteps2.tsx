import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepKernel() {
  const lines = [
    { line: 'float *d_a, *d_b, *d_c;', c: C.cuda, y: 38 },
    { line: 'cudaMalloc(&d_a, n * sizeof(float));', c: C.cuda, y: 58 },
    { line: 'cudaMemcpy(d_a, h_a, n*4, H2D);  // Host→Device', c: C.gpu, y: 78 },
    { line: 'add<<<(n+255)/256, 256>>>(d_a, d_b, d_c);', c: C.ok, y: 100 },
    { line: 'cudaMemcpy(h_c, d_c, n*4, D2H);  // Device→Host', c: C.gpu, y: 120 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.gpu}>커널 실행 파이프라인</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={15} y={l.y - 13} width={410} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={25} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepBlockchain() {
  const lines = [
    { line: '__global__ void tx_verify(', c: C.cuda, y: 38 },
    { line: '    Sig *sigs, Pub *pubs, Msg *msgs, int n) {', c: C.cuda, y: 58 },
    { line: '  int tid = blockIdx.x * blockDim.x + threadIdx.x;', c: C.cuda, y: 78 },
    { line: '  if (tid >= n) return;  // 경계 검사', c: C.err, y: 98 },
    { line: '  result[tid] = ed25519_verify(sigs[tid], pubs[tid]);', c: C.ok, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>블록체인: 서명 검증 커널</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={10} y={l.y - 13} width={420} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={20} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
