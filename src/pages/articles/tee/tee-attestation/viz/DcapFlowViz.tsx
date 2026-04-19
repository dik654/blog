import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_PCCS = '#6366f1';
const C_QVE = '#10b981';
const C_LIB = '#f59e0b';
const C_RES = '#a855f7';

const RESULTS = [
  { name: 'OK', color: '#10b981', desc: '완전 유효 + 최신 TCB' },
  { name: 'OUT_OF_DATE', color: '#f59e0b', desc: 'TCB 패치 필요' },
  { name: 'SW_HARDENING_NEEDED', color: '#f59e0b', desc: 'SW 완화 필요' },
  { name: 'REVOKED', color: '#ef4444', desc: '거부' },
];

const STEPS = [
  {
    label: '사전 설정 — PCCS Docker 1회 실행',
    body: 'docker run intel/pccs:latest.\nIntel PCS로부터 PCK cert 캐시.',
  },
  {
    label: '런타임 — Quote 생성 + 옵션 선택',
    body: 'quote = sgx_get_quote(report, ECDSA).\n옵션 1: QVE(Quote Verification Enclave). 옵션 2: 순수 라이브러리.',
  },
  {
    label: 'sgx_qv_verify_quote — 결과 분기',
    body: '4가지 결과: OK / OUT_OF_DATE / SW_HARDENING_NEEDED / REVOKED.\n각 결과에 맞는 정책 적용.',
  },
  {
    label: '장점 — 오프라인 + 저지연 + 정책 자율',
    body: '인터넷 불필요 (PCCS 로컬). Latency < 100ms (vs IAS 수초).\n자체 정책 적용 가능, 감사 로그 자체 관리.',
  },
];

export default function DcapFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={130} y={20} w={220} h={36} label="PCCS Docker (운영자)" color={C_PCCS} />
              <ActionBox x={40} y={80} w={400} h={28} label="docker run intel/pccs:latest" color={C_PCCS} />
              <DataBox x={120} y={120} w={240} h={32} label="PCK cert 캐시 완료" color={C_PCCS} outlined />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={20} w={400} h={28} label="quote = sgx_get_quote(report, ECDSA)" color={C_QVE} />
              <DataBox x={40} y={70} w={195} h={36} label="옵션 1: QVE" sub="Quote Verification Enclave" color={C_QVE} outlined />
              <DataBox x={245} y={70} w={195} h={36} label="옵션 2: 순수 라이브러리" sub="no_enclave 변형" color={C_LIB} outlined />
              <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                둘 다 sgx_qv_verify_quote API 사용
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={20} w={400} h={28} label="ret = sgx_qv_verify_quote(quote, ...)" color={C_QVE} />
              {RESULTS.map((r, i) => {
                const x = 40 + (i % 2) * 210;
                const y = 70 + Math.floor(i / 2) * 56;
                return (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
                    <DataBox x={x} y={y} w={200} h={42} label={r.name} sub={r.desc} color={r.color} outlined />
                  </motion.g>
                );
              })}
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[
                '인터넷 연결 불필요 (PCCS 로컬)',
                'Latency < 100ms (vs IAS 수초)',
                '자체 정책 적용 가능',
                '감사 로그 자체 관리',
              ].map((line, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}>
                  <DataBox x={40} y={28 + i * 38} w={400} h={32} label={`✓ ${line}`} color={C_RES} outlined />
                </motion.g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
