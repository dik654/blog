import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'TPM PCR Extend — PCR_new = SHA-256(PCR_old || measurement)' },
  { label: '부트 체인 명령어 — DRTM: GETSEC[SENTER]로 PCR 리셋 후 ACM 측정' },
  { label: 'TPM2_Quote — PCR 서명 → Nonce 포함 → AIK 개인키로 HMAC 서명' },
];
const mono = { fontFamily: 'monospace' };

export default function SecureBootStepViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={270} y={20} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">PCR Extend 내부 연산</text>
            {[
              { line: '// TPM 내부 (하드웨어)', c: '#6366f1', y: 48 },
              { line: 'old_pcr = PCR_Read(pcr_index)', c: '#6366f1', y: 70 },
              { line: 'digest  = SHA-256(old_pcr || measurement)', c: '#10b981', y: 92 },
              { line: 'PCR_Write(pcr_index, digest)   // 단방향 누적', c: '#10b981', y: 114 },
              { line: '// PCR_Reset = SRTM: 재부팅만, DRTM: GETSEC', c: '#f59e0b', y: 142 },
            ].map((l, i) => (
              <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <rect x={50} y={l.y - 14} width={440} height={22} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={65} y={l.y} fontSize={11} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 1 && (<g>
            <text x={270} y={20} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">DRTM: GETSEC[SENTER] 명령어</text>
            {[
              { line: 'GETSEC[SENTER](ACM_base, ACM_size)', c: '#10b981', y: 48 },
              { line: '  1. PCR[17..22] = 0x00  // 동적 PCR 리셋', c: '#6366f1', y: 72 },
              { line: '  2. CR4.SMXE = 1        // Safer Mode 활성화', c: '#6366f1', y: 94 },
              { line: '  3. HASH = SHA-256(ACM_binary)', c: '#f59e0b', y: 116 },
              { line: '  4. PCR[17] = Extend(0, HASH)  // ACM 측정', c: '#f59e0b', y: 138 },
            ].map((l, i) => (
              <motion.g key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                <rect x={50} y={l.y - 14} width={440} height={22} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={65} y={l.y} fontSize={11} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
            <text x={270} y={168} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              재부팅 없이 신뢰 체인 재구축 (Dynamic Root of Trust)
            </text>
          </g>)}
          {step === 2 && (<g>
            <text x={270} y={20} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">TPM2_Quote 서명 생성</text>
            {[
              { line: 'TPM2_Quote(AIK_handle, PCR_select, nonce)', c: '#f59e0b', y: 48 },
              { line: '  pcr_digest = SHA-256(PCR[0] || ... || PCR[23])', c: '#6366f1', y: 72 },
              { line: '  quote_info = {pcr_digest, nonce, clock}', c: '#6366f1', y: 94 },
              { line: '  signature = HMAC_SHA256(AIK_priv, quote_info)', c: '#10b981', y: 116 },
              { line: '  return {quote_info, signature, pcr_values}', c: '#10b981', y: 138 },
            ].map((l, i) => (
              <motion.g key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                <rect x={40} y={l.y - 14} width={460} height={22} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={55} y={l.y} fontSize={11} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
            <text x={270} y={165} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              검증자: AIK_pub으로 서명 검증 + 기대 PCR 값과 비교
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
