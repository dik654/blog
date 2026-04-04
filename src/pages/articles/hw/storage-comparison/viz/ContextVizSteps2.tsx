import { motion } from 'framer-motion';
import { C } from './ContextVizData';
const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepSAS() {
  const lines = [
    { line: '// SAS 듀얼 포트 + JBOD 확장', c: C.sas, y: 38 },
    { line: 'SAS HBA → SAS Expander → JBOD 엔클로저', c: C.sas, y: 58 },
    { line: '포트 A: 12 Gbps (Primary 경로)', c: C.sas, y: 78 },
    { line: '포트 B: 12 Gbps (Failover 경로)', c: C.sas, y: 98 },
    { line: '// 수백 TB 확장: 봉인 완료 섹터 장기 저장', c: C.ok, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sas}>SAS: 듀얼 포트 + JBOD</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={10} y={l.y - 13} width={420} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={20} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepBlockchain() {
  const lines = [
    { line: '// 블록체인 노드별 I/O 패턴', c: C.ok, y: 38 },
    { line: 'Reth/Geth: 상태 DB 랜덤 I/O (4K QD32)', c: C.nvme, y: 58 },
    { line: '  SATA: ~10K IOPS → NVMe: ~500K IOPS', c: C.nvme, y: 78 },
    { line: 'Lotus 봉인: 순차 쓰기 (128K sequential)', c: C.nvme, y: 100 },
    { line: '  SATA: 500 MB/s → NVMe: 5,000+ MB/s', c: C.nvme, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>블록체인 노드: NVMe 필수</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={10} y={l.y - 13} width={420} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={20} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
