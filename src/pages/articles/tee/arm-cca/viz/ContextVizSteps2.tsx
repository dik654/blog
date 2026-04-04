import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepRME() {
  const lines = [
    { line: '// Realm 내부에서 런타임 측정', c: C.realm, y: 38 },
    { line: 'SMC #RSI_MEASUREMENT_EXTEND(idx, data, len)', c: C.realm, y: 58 },
    { line: '  REM[idx] = SHA-512(REM[idx] || data)', c: C.ok, y: 78 },
    { line: '  // idx: 0=커널, 1=initrd, 2=cmdline, 3=앱', c: C.ok, y: 98 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.realm}>RSI: 측정값 확장</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={20} y={l.y - 13} width={400} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepAttest() {
  const lines = [
    { line: 'SMC #RSI_ATTEST_TOKEN_INIT(challenge[64])', c: C.realm, y: 38 },
    { line: '  token.rim     = RIM        // 초기 측정', c: C.realm, y: 58 },
    { line: '  token.rem[0..3] = REM[0..3]  // 런타임 측정', c: C.ok, y: 78 },
    { line: '  token.challenge = challenge', c: C.ok, y: 98 },
    { line: '  COSE_Sign1(platform_key, CBOR(token))', c: C.root, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.root}>CCA Token: COSE 서명 증명</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={20} y={l.y - 13} width={400} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
