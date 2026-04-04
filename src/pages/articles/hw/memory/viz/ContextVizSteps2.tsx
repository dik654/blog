import { motion } from 'framer-motion';
import { C } from './ContextVizData';
const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepECC() {
  const lines = [
    { line: '// ECC: Hamming(72, 64) SEC-DED', c: C.ecc, y: 38 },
    { line: '데이터:    64비트 (8바이트)', c: C.ecc, y: 58 },
    { line: 'ECC 코드:   8비트 (Hamming 패리티)', c: C.ecc, y: 78 },
    { line: '1-bit 에러 → 자동 정정 (Single Error Correct)', c: C.ok, y: 98 },
    { line: '2-bit 에러 → 감지만 (Double Error Detect)', c: C.err, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ecc}>ECC: SEC-DED 동작</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={20} y={l.y - 13} width={390} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepFilecoin() {
  const lines = [
    { line: '// Filecoin 봉인 메모리 요구량', c: C.ddr5, y: 38 },
    { line: 'PC1 단일: 32GiB 섹터 → 최소 64GB RAM', c: C.ddr5, y: 58 },
    { line: '병렬 2개: 128GB (2x RDIMM 64GB)', c: C.ecc, y: 78 },
    { line: '병렬 4개: 256GB (4x RDIMM 64GB)', c: C.ecc, y: 98 },
    { line: '// RDIMM: 레지스터 버퍼 → 대용량 안정 동작', c: C.ok, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ddr5}>Filecoin: 메모리 요구량</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={20} y={l.y - 13} width={390} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
