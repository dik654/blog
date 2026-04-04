import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '플랫폼 증명 — CPUID leaf 0x12 → SGX 기능 확인 후 PRMRR 레지스터 읽기' },
  { label: '펌웨어 증명 — SHA-256(firmware) → PCR[0] extend, CSME가 서명 생성' },
  { label: '앱 증명 — EREPORT → QE 내부에서 ECDSA-P256 서명 → Quote 생성' },
];
const mono = { fontFamily: 'monospace' };

export default function RemoteAttestStepViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={270} y={20} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">CPUID + PRMRR 레지스터</text>
            {[
              { line: 'CPUID(EAX=0x12, ECX=0)  // SGX Capability', c: '#6366f1', y: 48 },
              { line: '  EAX[0] = 1  → SGX1 supported', c: '#6366f1', y: 70 },
              { line: '  EAX[1] = 1  → SGX2 supported', c: '#6366f1', y: 92 },
              { line: 'PRMRR_BASE = MSR 0x2A0  // EPC 물리 주소', c: '#10b981', y: 118 },
              { line: 'PRMRR_MASK = MSR 0x2A1  // EPC 크기 마스크', c: '#10b981', y: 140 },
            ].map((l, i) => (
              <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <rect x={50} y={l.y - 14} width={440} height={22} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={65} y={l.y} fontSize={11} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
            <text x={270} y={170} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              BIOS에서 PRMRR 설정 → EPC 영역 물리 메모리 확보
            </text>
          </g>)}
          {step === 1 && (<g>
            <text x={270} y={20} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">펌웨어 측정 → PCR Extend</text>
            {[
              { line: '// UEFI Secure Boot 체인', c: '#10b981', y: 48 },
              { line: 'fw_hash = SHA-256(firmware_binary)', c: '#10b981', y: 70 },
              { line: 'TPM2_PCR_Extend(PCR[0], fw_hash)', c: '#6366f1', y: 92 },
              { line: 'csme_report = CSME_Sign(platform_id, fw_ver)', c: '#f59e0b', y: 118 },
              { line: '// CSME: Converged Security & Management Engine', c: '#f59e0b', y: 140 },
            ].map((l, i) => (
              <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <rect x={50} y={l.y - 14} width={440} height={22} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={65} y={l.y} fontSize={11} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 2 && (<g>
            <text x={270} y={20} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">EREPORT → Quote 서명</text>
            {[
              { line: 'EREPORT(target=QE, data={MRENCLAVE, user_data})', c: '#f59e0b', y: 48 },
              { line: '  report.mac = CMAC(report_key, report_body)', c: '#6366f1', y: 72 },
              { line: '// Quoting Enclave 내부:', c: '#10b981', y: 100 },
              { line: 'EGETKEY(REPORT_KEY) → report MAC 검증', c: '#10b981', y: 122 },
              { line: 'quote.sig = ECDSA_P256(att_key, quote_body)', c: '#10b981', y: 144 },
            ].map((l, i) => (
              <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <rect x={40} y={l.y - 14} width={460} height={22} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={55} y={l.y} fontSize={11} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
            <text x={270} y={172} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              검증자: PCK 인증서 체인 → ECDSA 서명 확인
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
