import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox, ModuleBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_EPC = '#10b981';
const C_ATK = '#ef4444';
const C_FIX = '#6366f1';
const C_L1 = '#f59e0b';

const STEPS = [
  {
    label: 'SGX EPC — 외부 접근 시 abort page 반환',
    body: 'EPC(Encrypted Page Cache)는 enclave 메모리.\n외부에서 직접 읽으면 0xFF로 마스킹된 abort page가 반환된다.',
  },
  {
    label: '하지만 enclave 실행 중에는 L1 cache에 평문 존재',
    body: 'CPU는 enclave 실행 시 L1 cache에 복호화된 데이터를 둔다.\nL1TF 공격은 이 평문을 page table 조작으로 탈취한다.',
  },
  {
    label: 'L1TF — host PTE 조작으로 L1 cache에서 EPC 평문 로드',
    body: 'Host가 PTE의 P-bit를 0으로, PA field에 EPC 주소를 둔다.\n투기 실행이 L1 cache에서 enclave 평문을 로드한다.',
  },
  {
    label: '완화 — L1D flush + SMT 비활성화 + Attestation TCB',
    body: 'L1D_FLUSH_CMD MSR로 enclave exit 시 L1 plus.\nIntel IAS는 영향받은 CPU의 attestation을 거부 → 재확인 필수.',
  },
];

export default function ForeshadowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={120} y={20} w={240} h={50} label="EPC (Encrypted Page Cache)" sub="enclave 메모리, MEE로 암호화" color={C_EPC} />
              <ActionBox x={40} y={100} w={170} h={32} label="외부 read 시도" color={C_ATK} />
              <DataBox x={250} y={100} w={170} h={32} label="abort page (0xFF...)" color={C_EPC} outlined />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill={C_EPC}>
                정상 경로로는 enclave 평문 접근 불가
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={150} y={20} w={180} h={36} label="enclave 실행 중" color={C_EPC} />
              <ActionBox x={40} y={70} w={180} h={32} label="L1 cache" sub="복호화된 평문" color={C_L1} />
              <ModuleBox x={250} y={70} w={180} h={32} label="EPC (암호화)" color={C_EPC} />
              <line x1={130} y1={102} x2={130} y2={120} stroke={C_L1} strokeWidth={0.7} />
              <DataBox x={50} y={130} w={160} h={32} label="평문 존재 (휘발)" color={C_L1} outlined />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill={C_ATK}>
                L1TF: 이 평문을 탈취 가능
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <AlertBox x={40} y={20} w={400} h={32} label="host PTE: P-bit=0, PA=EPC_addr" color={C_ATK} />
              <ActionBox x={40} y={66} w={170} h={32} label="투기 접근" sub="page fault 예약" color={C_ATK} />
              <line x1={210} y1={82} x2={250} y2={82} stroke={C_ATK} strokeWidth={0.7} />
              <DataBox x={250} y={66} w={170} h={32} label="L1 cache 검색 → hit" color={C_L1} outlined />
              <DataBox x={120} y={114} w={240} h={32} label="enclave 평문이 dependent inst로 leak" color={C_ATK} outlined />
              <text x={240} y={172} textAnchor="middle" fontSize={9} fontWeight={600} fill={C_ATK}>
                cache side channel로 평문 추출 가능
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[
                ['L1D_FLUSH_CMD MSR (enclave exit)', C_FIX],
                ['SMT 비활성화 (데이터센터 권장)', C_FIX],
                ['Microcode + OS 패치', C_FIX],
                ['IAS attestation 거부 (영향 CPU)', C_FIX],
              ].map(([label, color], i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}>
                  <rect x={40} y={28 + i * 32} width={400} height={24} rx={4}
                    fill={`${color}15`} stroke={color as string} strokeWidth={0.6} />
                  <text x={50} y={28 + i * 32 + 16} fontSize={9.5} fontWeight={500} fill={color as string}>
                    ✓ {label}
                  </text>
                </motion.g>
              ))}
              <text x={240} y={186} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                TCB 업데이트 → attestation 재발급 필수
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
