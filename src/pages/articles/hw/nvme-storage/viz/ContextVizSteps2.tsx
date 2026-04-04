import { motion } from 'framer-motion';
import { C } from './ContextVizData';
const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepServer() {
  const lines = [
    { line: '// 서버 전용 NVMe 스펙', c: C.u2, y: 38 },
    { line: 'U.2:  금속 케이스, 핫스왑 베이, 3+ DWPD', c: C.u2, y: 58 },
    { line: 'E1.S: 9.5mm 높이, 1U 랙 최적화, 고밀도', c: C.e1s, y: 78 },
    { line: '// DWPD = Drive Writes Per Day (내구성 지표)', c: C.e1s, y: 100 },
    { line: '3 DWPD: 하루에 전체 용량의 3배 쓰기 가능', c: C.e1s, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.u2}>U.2 / E1.S: 서버 스펙</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={15} y={l.y - 13} width={410} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={25} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepFilecoin() {
  const lines = [
    { line: '// Filecoin NVMe 워크로드', c: C.e1s, y: 38 },
    { line: 'PC1:  순차 쓰기 32GiB × 11레이어 = 352 GiB', c: C.m2, y: 58 },
    { line: '      필요: 순차 쓰기 3~5 GB/s 지속', c: C.m2, y: 78 },
    { line: 'PoSt: 랜덤 읽기 2,349개 챌린지 섹터', c: C.u2, y: 100 },
    { line: '      필요: 랜덤 IOPS 성능 (4K 읽기)', c: C.u2, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.e1s}>Filecoin: 워크로드별 요구</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={15} y={l.y - 13} width={410} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={25} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
