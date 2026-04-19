import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_OLD = '#ef4444';
const C_NEW = '#10b981';
const C_SETUP = '#6366f1';

const STEPS_LIST = [
  ['1. 호환성 확인', 'SGX driver 2.14+, Linux 5.11+, Ubuntu 20.04+'],
  ['2. PCCS 인프라 구축', 'Intel PCS API key + Docker 실행 + 내부망 설정'],
  ['3. SDK 업데이트', 'Intel SGX SDK 2.15+ + DCAP quote gen 라이브러리'],
  ['4. Quote 생성 코드 변경', 'sgx_get_quote → sgx_qe_get_quote'],
  ['5. Verifier 변경', 'HTTPS POST IAS → sgx_qv_verify_quote() 로컬'],
  ['6. 정책 재검토', 'TCB 만료, SW_HARDENING, supplemental data'],
];

const STEPS = [
  {
    label: 'EPID → DCAP 마이그레이션 — 6단계',
    body: '호환성 확인 → 인프라 → SDK → 코드 → verifier → 정책.\n점진적 진행 권장.',
  },
  {
    label: '코드 차이 — Quote 생성',
    body: 'Before: sgx_get_quote(p_report, LINKABLE_SIGNATURE, &spid, ...).\nAfter: sgx_qe_get_quote_size + sgx_qe_get_quote.',
  },
  {
    label: '권장 일정 — 병렬 운영 후 phase-out',
    body: '병렬 운영 3~6개월 → EPID 점진적 phase-out → DCAP 프로덕션 검증.\n급격한 전환 위험을 분산.',
  },
];

export default function MigrationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {STEPS_LIST.map(([head, sub], i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}>
                  <DataBox x={40} y={16 + i * 36} w={150} h={28} label={head} color={C_SETUP} outlined />
                  <text x={205} y={36 + i * 36} fontSize={9} fill="var(--foreground)">{sub}</text>
                </motion.g>
              ))}
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C_OLD}>
                Before (EPID)
              </text>
              <ActionBox x={40} y={36} w={400} h={32} label="sgx_get_quote(p_report, LINKABLE_SIGNATURE, &spid, ...)" color={C_OLD} />
              <text x={240} y={92} textAnchor="middle" fontSize={10} fontWeight={700} fill={C_NEW}>
                After (ECDSA / DCAP)
              </text>
              <ActionBox x={40} y={108} w={400} h={32} label="sgx_qe_get_quote_size(&size)" color={C_NEW} />
              <ActionBox x={40} y={148} w={400} h={32} label="sgx_qe_get_quote(p_report, size, quote_buf)" color={C_NEW} />
              <text x={240} y={206} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Verifier도 HTTPS → sgx_qv_verify_quote() 로 변경
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C_SETUP}>
                권장 일정 (3~6개월)
              </text>
              <DataBox x={40} y={50} w={400} h={32} label="병렬 운영 (EPID + DCAP)" color={C_SETUP} outlined />
              <DataBox x={40} y={94} w={400} h={32} label="EPID 점진적 phase-out" color={C_OLD} outlined />
              <DataBox x={40} y={138} w={400} h={32} label="DCAP 프로덕션 검증" color={C_NEW} outlined />
              <text x={240} y={196} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                급격한 전환 → 위험 분산
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
