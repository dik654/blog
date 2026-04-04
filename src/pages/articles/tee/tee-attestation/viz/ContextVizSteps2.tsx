import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepDCAP() {
  const lines = [
    { line: '// DCAP: Intel 서버 없이 검증', c: C.dcap, y: 38 },
    { line: 'quote.sig = ECDSA_P256(att_key, quote_body)', c: C.dcap, y: 58 },
    { line: 'pck_cert = PCK_CACHE[platform_id]  // 미리 캐시', c: C.ok, y: 78 },
    { line: 'verify(pck_cert.pub, quote.sig) → OK', c: C.ok, y: 98 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.dcap}>DCAP: ECDSA 로컬 검증</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={20} y={l.y - 13} width={380} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepQuote() {
  const lines = [
    { line: '// Quote Body 구조 (508 bytes)', c: C.attest, y: 38 },
    { line: 'MRENCLAVE [32B]  = SHA-256(enclave_code)', c: C.attest, y: 58 },
    { line: 'MRSIGNER  [32B]  = SHA-256(signing_key)', c: C.attest, y: 78 },
    { line: 'report_data[64B] = SHA-256(nonce || payload)', c: C.ok, y: 98 },
    { line: 'ISV_SVN   [2B]   = enclave_security_version', c: C.ok, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.attest}>Quote Body 필드</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={20} y={l.y - 13} width={390} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
