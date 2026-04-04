import { motion } from 'framer-motion';
import { C } from './ContextVizData';
const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepWhy() {
  const lines = [
    { line: '// 스토리지 프로토콜 비교', c: C.nvme, y: 38 },
    { line: 'SATA (AHCI): 1큐 × 32cmd,  550 MB/s, 6 Gbps', c: C.sata, y: 58 },
    { line: 'NVMe (PCIe): 64K큐 × 64Kcmd, 7 GB/s, PCIe 4.0', c: C.nvme, y: 78 },
    { line: 'SAS:         256큐 × 256cmd, 12 Gbps, 듀얼 포트', c: C.sas, y: 98 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.nvme}>프로토콜 스펙 비교</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={10} y={l.y - 13} width={420} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={20} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepSata() {
  const lines = [
    { line: '// SATA AHCI 큐 구조 (레거시)', c: C.err, y: 38 },
    { line: 'AHCI.queue_depth = 1   // 큐 1개', c: C.sata, y: 58 },
    { line: 'AHCI.cmds_per_q  = 32  // 커맨드 32개', c: C.sata, y: 78 },
    { line: 'NVMe.queue_depth = 65535  // 큐 64K개', c: C.nvme, y: 100 },
    { line: '// 동시 I/O: SATA 32 vs NVMe 4,194,304', c: C.err, y: 120 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.err}>SATA AHCI 병목</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={10} y={l.y - 13} width={420} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={20} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
