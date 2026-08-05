import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, AlertBox, ActionBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_USER = '#6366f1';
const C_TEE = '#10b981';
const C_BAD = '#ef4444';
const C_FLOW = '#f59e0b';

const STEPS = [
  {
    label: 'Attestation 없음 — 신뢰의 근거 부재',
    body: '서비스: "TEE에서 안전하게 처리". 사용자: "정말? 증명해봐". 서비스: "그냥 믿어".\n불신의 고리를 끊을 수 없다 — 모든 SW 스택을 신뢰해야 한다.',
  },
  {
    label: 'Attestation 있을 때 — 수학적 증명',
    body: '사용자가 nonce 전송 → TEE가 measurement+nonce+platform info report 생성 → HW 서명.\n사용자는 CPU vendor 인증서로 검증 → CPU vendor만 신뢰하면 충분하다.',
  },
  {
    label: '검증 5단계 — cert chain → signature → measurement → nonce → TCB',
    body: '인증서 체인 검증 → ECDSA 서명 검증 → measurement 비교 → nonce 일치 → TCB 최신.\n5개 모두 통과해야 데이터 전송 OK.',
  },
];

export default function AttestationRoleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={40} y={20} w={170} h={42} label="사용자" color={C_USER} />
              <ModuleBox x={270} y={20} w={170} h={42} label="서비스 (TEE 주장)" color={C_TEE} />
              <ActionBox x={120} y={84} w={240} h={32} label='"안전하다고 주장"' color={C_FLOW} />
              <ActionBox x={120} y={124} w={240} h={32} label='"증명해봐" / "그냥 믿어"' color={C_BAD} />
              <AlertBox x={120} y={170} w={240} h={32} label="신뢰 불가 — 모든 SW 스택 신뢰 필요" color={C_BAD} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={40} y={20} w={150} h={36} label="사용자" color={C_USER} />
              <ModuleBox x={290} y={20} w={150} h={36} label="TEE" color={C_TEE} />
              <ActionBox x={40} y={70} w={400} h={26} label="1. nonce (32B) →" color={C_FLOW} />
              <ActionBox x={40} y={102} w={400} h={26} label="2. EREPORT (measurement + nonce + pubkey)" color={C_TEE} />
              <ActionBox x={40} y={134} w={400} h={26} label="3. HW 서명 (ECDSA, CPU vendor 체인)" color={C_TEE} />
              <ActionBox x={40} y={166} w={400} h={26} label="4. ← (report, signature, cert_chain)" color={C_FLOW} />
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill={C_TEE}>
                CPU vendor만 신뢰 = SW 전체 신뢰 불필요
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[
                ['1. cert_chain 검증', 'Intel/AMD/ARM root CA까지 추적'],
                ['2. signature 검증', 'cert 공개키로 ECDSA verify'],
                ['3. measurement 확인', 'expected MRENCLAVE/MRTD/RIM'],
                ['4. nonce 확인', '내가 보낸 random과 일치'],
                ['5. TCB 확인', '최신 패치 적용 (TCB_UP_TO_DATE)'],
              ].map(([head, sub], i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}>
                  <DataBox x={40} y={20 + i * 38} w={150} h={28} label={head} color={C_TEE} outlined />
                  <text x={205} y={38 + i * 38} fontSize={9} fill="var(--foreground)">{sub}</text>
                </motion.g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
