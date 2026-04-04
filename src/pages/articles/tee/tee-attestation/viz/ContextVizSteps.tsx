import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepWhy() {
  const lines = [
    { line: 'EREPORT(target_info, report_data)', c: C.attest, y: 38 },
    { line: '  report_key = EGETKEY(KEY_REPORT, target)', c: C.attest, y: 58 },
    { line: '  body = {MRENCLAVE, MRSIGNER, report_data}', c: C.ok, y: 78 },
    { line: '  report.mac = CMAC_AES128(report_key, body)', c: C.ok, y: 98 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.attest}>EREPORT: Report 생성</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={20} y={l.y - 13} width={380} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepLocal() {
  const lines = [
    { line: '// Enclave B가 Report 검증', c: C.ok, y: 38 },
    { line: 'my_key = EGETKEY(KEY_REPORT, target=A)', c: C.ok, y: 58 },
    { line: 'expected = CMAC_AES128(my_key, report.body)', c: C.ok, y: 78 },
    { line: 'if (expected == report.mac) → VERIFIED', c: C.ok, y: 98 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>Local: CMAC 키 일치 검증</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={20} y={l.y - 13} width={380} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepEPID() {
  const lines = [
    { line: '// QE 내부에서 Quote 생성', c: C.intel, y: 38 },
    { line: 'EGETKEY(REPORT) → report MAC 검증', c: C.intel, y: 58 },
    { line: 'epid_sig = EPID_Sign(group_key, quote_body)', c: C.intel, y: 78 },
    { line: '// IAS: EPID_Verify(group_pub, sig) → OK', c: C.dcap, y: 100 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.intel}>EPID: 그룹 서명 Quote</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={20} y={l.y - 13} width={380} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
