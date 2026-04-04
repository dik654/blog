import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepMemory() {
  const lines = [
    { line: '// 메모리 계층별 지연 시간 (cycle)', c: C.ok, y: 38 },
    { line: 'Register  : 1 cycle    // SM당 256 KB', c: C.ok, y: 58 },
    { line: 'Shared    : ~5 cycle   // SM당 64 KB', c: C.mem, y: 78 },
    { line: 'L2 Cache  : ~30 cycle  // 전체 72 MB', c: C.cpu, y: 98 },
    { line: 'GDDR6X    : ~400 cycle // 24 GB, 1008 GB/s', c: C.err, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.mem}>메모리 계층: 지연 시간 400배 차이</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={30} y={l.y - 13} width={380} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={40} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepWarp() {
  const lines = [
    { line: '// 워프 스케줄러 (SM 내부)', c: C.ok, y: 38 },
    { line: 'Warp[0]: EXECUTING  (32 threads, PC=0x400)', c: C.ok, y: 58 },
    { line: 'Warp[1]: MEM_WAIT   (GDDR 요청 중...)', c: C.cpu, y: 78 },
    { line: 'Warp[2]: READY      ← 다음 실행 후보', c: C.gpu, y: 98 },
    { line: '// 전환 비용 = 0 cycle (레지스터 상주)', c: C.ok, y: 120 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.gpu}>워프 스케줄링: 0-cycle 전환</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={20} y={l.y - 13} width={395} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
