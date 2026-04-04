import { motion } from 'framer-motion';
import { C } from './MeasuredBootVizData';
import { fade, Box, Arrow } from './MeasuredBootVizParts';

const mono = { fontFamily: 'monospace' };

export function PcrExtendStep() {
  const lines = [
    { line: '// TPM 내부 하드웨어 연산', c: C.main, y: 22 },
    { line: 'old = PCR_Read(pcr_index)         // 현재 값', c: C.main, y: 44 },
    { line: 'digest = SHA-256(old || measurement)', c: C.hash, y: 66 },
    { line: 'PCR_Write(pcr_index, digest)      // 누적 갱신', c: C.hash, y: 88 },
    { line: '// 최종 PCR = 전체 부팅 경로 SHA-256 요약', c: C.main, y: 112 },
  ];
  return (<g>
    <text x={30} y={12} fontSize={11} fill="var(--foreground)" fontWeight={700}>PCR Extend 내부 연산</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...fade(i * 0.1)}>
        <rect x={30} y={l.y - 12} width={420} height={20} rx={3} fill={`${l.c}15`} stroke={l.c} strokeWidth={0.8} />
        <text x={45} y={l.y + 2} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function AttestationStep() {
  const lines = [
    { line: 'TPM2_Quote(AIK_handle, PCR_select, nonce)', c: C.attest, y: 22 },
    { line: '  pcr_digest = SHA-256(PCR[0] || ... || PCR[23])', c: C.main, y: 44 },
    { line: '  quote_info = {pcr_digest, nonce, clock_info}', c: C.main, y: 66 },
    { line: '  sig = HMAC_SHA256(AIK_priv, quote_info)', c: C.attest, y: 88 },
    { line: '// 검증자: AIK_pub로 서명 확인 + 기대 PCR 비교', c: C.hash, y: 112 },
  ];
  return (<g>
    <text x={30} y={12} fontSize={11} fill="var(--foreground)" fontWeight={700}>원격 증명: TPM2_Quote</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...fade(i * 0.1)}>
        <rect x={30} y={l.y - 12} width={420} height={20} rx={3} fill={`${l.c}15`} stroke={l.c} strokeWidth={0.8} />
        <text x={45} y={l.y + 2} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
