import { motion } from 'framer-motion';
import { C } from './ContextVizData';
const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepWhy() {
  const lines = [
    { line: '// 데스크톱 vs 서버 설계 차이', c: C.server, y: 38 },
    { line: '데스크톱: 1인 사용, 가성비, 재부팅 OK', c: C.desktop, y: 58 },
    { line: '서버:    24/7 운영, 원격 관리, 다중 GPU', c: C.server, y: 78 },
    { line: '// 같은 x86이지만 확장성·안정성 설계가 다름', c: C.hw, y: 98 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.server}>설계 철학 차이</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={20} y={l.y - 13} width={390} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepProblem() {
  const lines = [
    { line: '// 데스크톱 CPU 한계 (i9-14900K)', c: C.err, y: 38 },
    { line: 'PCIe 5.0 레인: 20개 (x16 GPU + x4 NVMe = 끝)', c: C.err, y: 58 },
    { line: 'ECC 메모리:  미지원 → 비트 플립 위험', c: C.err, y: 78 },
    { line: 'IPMI/BMC:   없음 → 원격 전원 제어 불가', c: C.err, y: 98 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.err}>데스크톱 CPU 한계</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={20} y={l.y - 13} width={400} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
