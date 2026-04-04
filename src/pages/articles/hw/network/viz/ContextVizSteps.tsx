import { motion } from 'framer-motion';
import { C } from './ContextVizData';
const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepWhy() {
  const lines = [
    { line: '// 데스크톱 vs 서버 네트워크', c: C.eth, y: 38 },
    { line: '데스크톱: RJ45 1Gbps (Cat6), ~200us RTT', c: C.hw, y: 58 },
    { line: '서버:    SFP+ 10Gbps (DAC/광), ~3us RTT', c: C.eth, y: 78 },
    { line: 'DC:      QSFP28 100Gbps (4×25G), ~1.5us', c: C.ib, y: 98 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.eth}>네트워크 대역폭 단계</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={15} y={l.y - 13} width={410} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={25} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepEthernet() {
  const lines = [
    { line: '// 이더넷 스펙 비교', c: C.eth, y: 38 },
    { line: '10GBASE-SR: SFP+ MMF,   10Gbps, ~300m', c: C.hw, y: 58 },
    { line: '25GBASE-SR: SFP28 MMF,  25Gbps, ~100m', c: C.eth, y: 78 },
    { line: '100GBASE-SR4: QSFP28,  100Gbps, ~100m', c: C.ib, y: 98 },
    { line: '// 서버 → DC → 백본 순서로 대역폭 증가', c: C.ib, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.eth}>이더넷 규격 상세</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={15} y={l.y - 13} width={410} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={25} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
