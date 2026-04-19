import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_ATK = '#ef4444';
const C_OK = '#10b981';
const C_WARN = '#f59e0b';

const STEPS = [
  {
    label: 'Sc1: 다른 서버로 sealed 복사 — Root Key 다름 → 실패',
    body: '공격자가 sealed.bin 훔쳐 자기 CPU에서 unseal 시도.\n다른 CPU = 다른 Root Key → Seal Key 다름 → 복호화 실패.',
  },
  {
    label: 'Sc2: 같은 서버 다른 enclave — MRENCLAVE 다름 → 실패',
    body: '공격자가 자기 코드 MRENCLAVE_X로 EGETKEY 호출.\nMRENCLAVE 다름 → Seal Key 다름 → 복호화 실패.',
  },
  {
    label: 'Sc3: ciphertext 변조 — AES-GCM MAC 실패',
    body: '공격자가 sealed.bin의 1 byte 수정.\nAES-GCM MAC 검증 실패 → 에러 반환, 평문 노출 없음.',
  },
  {
    label: 'Sc4: rollback (구버전 sealed) — SVN 또는 monotonic counter로 탐지',
    body: 'MAC은 통과 (같은 key) — but SVN 필드 체크로 구버전 식별.\n또는 monotonic counter 사용으로 방어.',
  },
  {
    label: 'Sc5: CPU 분석 (decapping) — 실전 무시 가능',
    body: '칩 decapping + SEM/FIB → Root Key 추출 가능성 있음.\n수십만 달러 장비 + 수개월 소요 → 실전 위협 모델에서 무시.',
  },
];

const SCENARIOS = [
  { label: 'Sc1', risk: 'Root Key 다름', defense: 'CPU 바운드', result: 'OK', color: C_OK },
  { label: 'Sc2', risk: 'MRENCLAVE 다름', defense: '코드 바운드', result: 'OK', color: C_OK },
  { label: 'Sc3', risk: 'ciphertext 변조', defense: 'AES-GCM MAC', result: 'OK', color: C_OK },
  { label: 'Sc4', risk: 'rollback', defense: 'SVN / counter', result: 'WARN', color: C_WARN },
  { label: 'Sc5', risk: 'CPU 분석', defense: '실전 위협 X', result: 'INFO', color: C_WARN },
];

export default function AttackScenariosViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const sc = SCENARIOS[step];
        return (
          <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C_ATK}>
              공격 시나리오 {sc.label}
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} key={step}>
              <AlertBox x={40} y={40} w={400} h={36} label={sc.risk} color={C_ATK} />
              <ActionBox x={40} y={88} w={400} h={36} label="공격 시도 → ..." color={C_ATK} />
              <DataBox x={40} y={136} w={400} h={36} label={`방어: ${sc.defense}`} color={sc.color} outlined />
              <text x={240} y={196} textAnchor="middle" fontSize={10} fontWeight={700} fill={sc.color}>
                결과: {sc.result === 'OK' ? '✓ 복호화 실패 (방어 성공)' : sc.result === 'WARN' ? '⚠ 추가 메커니즘 필요' : 'ⓘ 실전 무시 가능'}
              </text>
            </motion.g>
          </svg>
        );
      }}
    </StepViz>
  );
}
