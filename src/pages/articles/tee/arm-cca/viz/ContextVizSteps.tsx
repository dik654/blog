import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepTZ() {
  const lines = [
    { line: '// TrustZone: NS 비트 1개로 구분', c: C.tz, y: 38 },
    { line: 'SCR_EL3.NS = 0  → Secure World', c: C.ok, y: 58 },
    { line: 'SCR_EL3.NS = 1  → Normal World', c: C.tz, y: 78 },
    { line: '// 문제: Secure 내부 앱 간 격리 없음', c: C.err, y: 100 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.tz}>TrustZone: NS 비트 한계</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={20} y={l.y - 13} width={380} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepProblem() {
  const lines = [
    { line: '// GPT (Granule Protection Table)', c: C.root, y: 38 },
    { line: 'GPCCR_EL3.base = gpt_base_phys_addr', c: C.root, y: 58 },
    { line: 'GPT[granule].PAS = 0b00  // Normal', c: C.tz, y: 78 },
    { line: 'GPT[granule].PAS = 0b01  // Secure', c: C.ok, y: 98 },
    { line: 'GPT[granule].PAS = 0b10  // Realm', c: C.realm, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.root}>GPT: 4개 세계 페이지 분류</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={20} y={l.y - 13} width={380} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepCCA() {
  const lines = [
    { line: 'SMC #RMI_REALM_CREATE(rd_addr)', c: C.realm, y: 38 },
    { line: '  RD.state      = REALM_NEW', c: C.realm, y: 58 },
    { line: '  RD.ipa_width   = 40  // IPA 주소 폭', c: C.realm, y: 78 },
    { line: '  RD.hash_algo   = SHA-512', c: C.ok, y: 98 },
    { line: '  RIM = SHA-512_Init()  // 초기 측정 시작', c: C.ok, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.realm}>RMI: Realm 생성</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={20} y={l.y - 13} width={380} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
